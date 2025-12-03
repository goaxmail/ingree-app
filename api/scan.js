// /api/scan.js
// Vercel Serverless Function: nimmt ein Base64-Bild entgegen und liefert erkannte Zutaten zurück.
// WICHTIG: In Vercel muss die Environment Variable OPENAI_API_KEY gesetzt sein.

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

  const { imageBase64 } = payload || {};
  if (!imageBase64) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Missing imageBase64 in request body" }));
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
                  "Du bist eine Küchenhilfe. Analysiere das Bild und erkenne alle gut sichtbaren Lebensmittel und Zutaten. " +
                  "Antworte NUR als JSON-Objekt mit einem Feld 'ingredients', das ein Array von Objekten enthält. " +
                  "Jedes Objekt soll diese Felder haben: id (kurzer string, z. B. 'banana'), name (deutsch), emoji (passendes Lebensmittel-Emoji), " +
                  "quantity (grob geschätzt, z. B. '3-4 Stück', '1 Kopf', '1 Packung') und freshness ('frisch', 'ok' oder 'trocken'). " +
                  "Beispiel: { \"ingredients\": [ { \"id\": \"tomato\", \"name\": \"Tomaten\", \"emoji\": \"🍅\", \"quantity\": \"3-4\", \"freshness\": \"ok\" } ] }"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ]
      })
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error:", openaiResponse.status, errorText);
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "OpenAI API error", details: errorText }));
      return;
    }

    const data = await openaiResponse.json();

    // data.choices[0].message.content sollte ein JSON-String sein
    let ingredientsPayload = null;
    try {
      const messageContent = data.choices?.[0]?.message?.content;
      if (typeof messageContent === "string") {
        ingredientsPayload = JSON.parse(messageContent);
      } else if (typeof messageContent === "object" && messageContent !== null) {
        ingredientsPayload = messageContent;
      }
    } catch (e) {
      console.error("Fehler beim Parsen der OpenAI-Antwort:", e);
    }

    if (!ingredientsPayload || !Array.isArray(ingredientsPayload.ingredients)) {
      ingredientsPayload = {
        ingredients: []
      };
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(ingredientsPayload));
  } catch (error) {
    console.error("Server error in /api/scan:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error", details: String(error) }));
  }
};
