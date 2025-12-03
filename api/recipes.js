// /api/recipes.js
// Vercel Serverless Function: nimmt Zutaten entgegen und liefert Rezeptvorschläge zurück.
// Erwartet ein JSON { ingredients: Ingredient[], extraIngredients: string[] }.

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Only POST is allowed" }));
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "OPENAI_API_KEY is not configured on the server" }));
    return;
  }

  let body = "";
  for await (const chunk of req) {
    body += chunk;
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch (err) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid JSON body" }));
    return;
  }

  const ingredients = Array.isArray(payload.ingredients) ? payload.ingredients : [];
  const extraIngredients = Array.isArray(payload.extraIngredients) ? payload.extraIngredients : [];

  const allNames = [];

  ingredients.forEach((ing) => {
    if (!ing) return;
    const name = ing.name || ing.id;
    if (name && !allNames.includes(name)) {
      allNames.push(name);
    }
  });

  extraIngredients.forEach((name) => {
    if (!name) return;
    if (!allNames.includes(name)) {
      allNames.push(name);
    }
  });

  if (allNames.length === 0) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ recipes: [] }));
    return;
  }

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  "Du bist ein kreativer, aber pragmatischer Koch für Familienküche. " +
                  "Aus den folgenden Zutaten sollst du 3 bis 5 einfache Rezepte vorschlagen, die man ohne exotische Extras kochen kann. " +
                  "Zutaten: " + allNames.join(", ") + ". " +
                  "Antworte NUR als JSON-Objekt mit einem Feld 'recipes', das ein Array von Rezept-Objekten enthält. " +
                  "Jedes Rezept soll diese Felder haben: " +
                  "id (kurzer string, z. B. 'rezept_1'), " +
                  "title (kurzer Titel), " +
                  "minutes (ungefähre Zubereitungszeit in Minuten, Zahl), " +
                  "teaser (1 kurzer Satz als Beschreibung), " +
                  "uses (Array von Strings mit den wichtigsten verwendeten Zutaten) " +
                  "und steps (Array von kurzen Strings mit den Kochschritten). " +
                  "Beispiel: { \"recipes\": [ { \"id\": \"rezept_1\", \"title\": \"Tomatenpasta\", \"minutes\": 15, \"teaser\": \"Schnelle Nudeln mit Tomatensauce\", \"uses\": [\"Tomaten\", \"Nudeln\"], \"steps\": [\"Nudeln kochen\", \"Sauce zubereiten\"] } ] }."
              }
            ]
          }
        ]
      })
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error in /api/recipes:", openaiResponse.status, errorText);
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "OpenAI API error", details: errorText }));
      return;
    }

    const data = await openaiResponse.json();

    let recipesPayload = null;
    try {
      const messageContent = data.choices?.[0]?.message?.content;
      if (typeof messageContent === "string") {
        recipesPayload = JSON.parse(messageContent);
      } else if (typeof messageContent === "object" && messageContent !== null) {
        recipesPayload = messageContent;
      }
    } catch (e) {
      console.error("Fehler beim Parsen der OpenAI-Antwort in /api/recipes:", e);
    }

    if (!recipesPayload || !Array.isArray(recipesPayload.recipes)) {
      recipesPayload = { recipes: [] };
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(recipesPayload));
  } catch (error) {
    console.error("Server error in /api/recipes:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error", details: String(error) }));
  }
};
