document.addEventListener("DOMContentLoaded", () => {
  let scanIngredients = [
    { id: "tomato", name: "Tomaten", emoji: "🍅", quantity: "4", freshness: "ok" },
    { id: "lettuce", name: "Grüner Salat", emoji: "🥬", quantity: "1 Kopf", freshness: "frisch" },
    { id: "carrot", name: "Karotten", emoji: "🥕", quantity: "2", freshness: "trocken" },
    { id: "pepper", name: "Grüne Paprika", emoji: "🫑", quantity: "2", freshness: "ok" }
  ];

  
// URL des Vision-Backends (lokal). Für Produktion später anpassen.
const SCAN_API_URL = "http://localhost:4000/api/scan";
const ingredientEmojiMap = {
    "tomaten": "🍅",
    "tomate": "🍅",
    "grüner salat": "🥬",
    "salat": "🥬",
    "karotten": "🥕",
    "karotte": "🥕",
    "grüne paprika": "🫑",
    "paprika": "🫑",
    "zwiebeln": "🧅",
    "zwiebel": "🧅",
    "knoblauch": "🧄",
    "milch": "🥛",
    "brot": "🍞",
    "käse": "🧀",
    "reis": "🍚",
    "nudeln": "🍝",
    "pasta": "🍝",
    "eier": "🥚",
    "ei": "🥚",
    "öl": "🫗",
    "zucker": "🧂",
    "salz": "🧂",
    "joghurt": "🥛",
    "apfel": "🍎",
    "banane": "🍌",
    "orange": "🍊",
    "zitrone": "🍋",
    "kartoffeln": "🥔",
    "kartoffel": "🥔",
    "wasser": "💧",
    "gurke": "🥒",
    "butter": "🧈",
    "sahne": "🥛",
    "mehl": "🌾",
    "hackfleisch": "🥩",
    "hähnchenbrust": "🍗",
    "schinken": "🥓",
    "kaffee": "☕",
    "tee": "🍵",
    "cola": "🥤",
    "mineralwasser": "💧",
    "saft": "🧃",
    "käseaufschnitt": "🧀",
    "frischkäse": "🧀",
    "toastbrot": "🍞",
    "marmelade": "🍓",
    "honig": "🍯"
  };

  function getEmojiForName(name, fallback) {
    if (!name) return fallback || "🧺";
    const key = name.trim().toLowerCase();
    return ingredientEmojiMap[key] || fallback || "🧺";
  }


  const freshnessHints = {
    trocken: "⚠ Einige Zutaten wirken leicht trocken – bald verbrauchen.",
    ok: "✔ Zutaten sind in gutem Zustand.",
    frisch: "✔ Deine Zutaten sind sehr frisch."
  };

  const scanRecipes = [
    {
      id: "r1",
      title: "Tomaten-Paprika-Pfanne",
      minutes: 12,
      teaser: "Schnelle Pfanne für Brot, Reis oder Nudeln.",
      uses: ["tomato", "carrot", "pepper"],
      steps: [
        "Paprika in Streifen, Tomaten grob schneiden.",
        "Karotten fein hobeln und alles anbraten.",
        "Mit Salz, Pfeffer und Kräutern abschmecken."
      ]
    },
    {
      id: "r2",
      title: "Tomaten-Karotten-Salat",
      minutes: 8,
      teaser: "Leichter, frischer Teller – ideal als Beilage.",
      uses: ["tomato", "carrot", "lettuce", "pepper"],
      steps: [
        "Tomaten würfeln, Karotten raspeln.",
        "Paprika klein schneiden, Salat zupfen.",
        "Mit Öl, Zitronensaft, Salz & Pfeffer anmachen."
      ]
    },
    {
      id: "r3",
      title: "Veggie-Bowl aus dem Fach",
      minutes: 10,
      teaser: "Alles in eine Schale – fertig ist die Bowl.",
      uses: ["lettuce", "tomato", "carrot", "pepper"],
      steps: [
        "Salat als Basis in die Schale geben.",
        "Tomaten, Paprika & Karotten darauf verteilen.",
        "Mit Dressing deiner Wahl servieren."
      ]
    }
  ];

  const globalRecipes = [
    {
      id: "g1",
      title: "Schnelle Tomatenbrot-Stulle",
      minutes: 5,
      teaser: "Frisches Brot mit Tomaten, Salz, Pfeffer & Öl – super schnell.",
      uses: ["tomato"],
      tags: ["quick", "cheap", "family"],
      steps: [
        "Brot in Scheiben schneiden.",
        "Tomaten in Scheiben schneiden und darauf legen.",
        "Salzen, pfeffern, mit etwas Öl beträufeln."
      ]
    },
    {
      id: "g2",
      title: "Einfacher Ofengemüse-Mix",
      minutes: 20,
      teaser: "Gemüse aufs Blech, würzen, backen – fertig.",
      uses: ["carrot", "pepper"],
      tags: ["filling", "healthy"],
      steps: [
        "Gemüse in Stücke schneiden.",
        "Mit Öl und Gewürzen mischen.",
        "Bei 200°C im Ofen backen, bis es goldbraun ist."
      ]
    },
    {
      id: "g3",
      title: "Kinderfreundliche Gemüse-Sticks",
      minutes: 10,
      teaser: "Rohkost-Sticks mit Dip – perfekt als Snack.",
      uses: ["carrot", "pepper"],
      tags: ["quick", "family", "healthy"],
      steps: [
        "Karotten und Paprika in Sticks schneiden.",
        "Mit einem Dip nach Wahl servieren.",
        "Ideal als Snack für zwischendurch."
      ]
    },
    {
      id: "g4",
      title: "Budget-Tomatensuppe",
      minutes: 15,
      teaser: "Einfache Suppe aus Tomaten, Zwiebeln & Gewürzen.",
      uses: ["tomato"],
      tags: ["cheap", "filling"],
      steps: [
        "Tomaten grob schneiden.",
        "Mit Zwiebeln anschwitzen, Wasser hinzugeben.",
        "Köcheln lassen und pürieren, würzen."
      ]
    }
  ];

  
  const commonIngredients = [
    "Tomaten",
    "Grüner Salat",
    "Karotten",
    "Grüne Paprika",
    "Zwiebeln",
    "Knoblauch",
    "Milch",
    "Brot",
    "Käse",
    "Reis",
    "Nudeln",
    "Eier",
    "Öl",
    "Zucker",
    "Salz",
    "Joghurt",
    "Apfel",
    "Banane",
    "Kartoffeln",
    "Wasser",
    "Gurke",
    "Butter",
    "Sahne",
    "Mehl",
    "Hackfleisch",
    "Hähnchenbrust",
    "Schinken",
    "Kaffee",
    "Tee",
    "Cola",
    "Mineralwasser",
    "Saft",
    "Käseaufschnitt",
    "Frischkäse",
    "Toastbrot",
    "Marmelade",
    "Honig"
  ];

  function updateShoppingSuggestions() {
    if (!shoppingSuggestionsEl || !shoppingManualNameInput) return;
    const query = shoppingManualNameInput.value.trim().toLowerCase();
    shoppingSuggestionsEl.innerHTML = "";

    if (!query) {
      shoppingSuggestionsEl.style.display = "none";
      return;
    }

    const matches = commonIngredients
      .filter((name) => name.toLowerCase().startsWith(query))
      .slice(0, 5);

    if (matches.length === 0) {
      shoppingSuggestionsEl.style.display = "none";
      return;
    }

    matches.forEach((name) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "shopping-suggestion-item";
      const emoji = getEmojiForName(name, "📝");
      btn.textContent = emoji + " " + name;
      btn.addEventListener("click", () => {
        shoppingManualNameInput.value = name;
        shoppingSuggestionsEl.style.display = "none";
        if (shoppingManualQtyInput) {
          shoppingManualQtyInput.focus();
        }
      });
      shoppingSuggestionsEl.appendChild(btn);
    });

    shoppingSuggestionsEl.style.display = "block";
  }

const screens = {
    onboarding: document.getElementById("screen-onboarding"),
    start: document.getElementById("screen-start"),
    scan: document.getElementById("screen-scan"),
    recipes: document.getElementById("screen-recipes"),
    recipeDetail: document.getElementById("screen-recipe-detail"),
    favorites: document.getElementById("screen-favorites"),
    shopping: document.getElementById("screen-shopping"),
    profile: document.getElementById("screen-profile")
  };

  const btnOnboardingNext = document.getElementById("btn-onboarding-next");
  const btnStartScan = document.getElementById("btn-start-scan");
  const cameraPlaceholder = document.querySelector(".camera-view-placeholder");
  const cameraInput = document.getElementById("camera-input");
  const scanPhoto = document.getElementById("scan-photo");
  const btnShowRecipes = document.getElementById("btn-show-recipes");
  const backButtons = document.querySelectorAll(".back-btn");
  const navButtons = document.querySelectorAll(".nav-btn");
  const togglePremiumBtn = document.getElementById("toggle-premium");
  const toggleDevBtn = document.getElementById("toggle-dev");

  const ingredientListEl = document.getElementById("ingredient-list");
  const freshnessHintEl = document.getElementById("freshness-hint");
  const recipesSubtitleEl = document.getElementById("recipes-subtitle");
  const aiJsonEl = document.getElementById("ai-json");
  const aiCardEl = document.getElementById("ai-card");

  const btnRescan = document.getElementById("btn-rescan");
  const btnAddIngredient = document.getElementById("btn-add-ingredient");
  const addIngredientPanel = document.getElementById("add-ingredient-panel");
  const addIngredientInput = document.getElementById("add-ingredient-input");
  const addIngredientSubmit = document.getElementById("btn-add-ingredient-submit");
  const chipButtons = document.querySelectorAll(".chip-btn");

  const favoritesMainListEl = document.getElementById("favorites-main-list");
  const favoritesMainEmptyEl = document.getElementById("favorites-main-empty");

  const shoppingFromRecipesEl = document.getElementById("shopping-from-recipes");
  const shoppingEmptyHintEl = document.getElementById("shopping-empty-hint");
  const shoppingManualNameInput = document.getElementById("shopping-manual-name");
  const shoppingManualQtyInput = document.getElementById("shopping-manual-qty");
  const shoppingManualListEl = document.getElementById("shopping-manual-list");
  const shoppingManualEmptyEl = document.getElementById("shopping-manual-empty");
  const shoppingSuggestionsEl = document.getElementById("shopping-suggestions");
  const btnShoppingManualAdd = document.getElementById("btn-shopping-manual-add");
  const btnClearShoppingManual = document.getElementById("btn-clear-shopping-manual");
  const btnClearShoppingRecipes = document.getElementById("btn-clear-shopping-recipes");
  const btnRemoveCheckedManual = document.getElementById("btn-remove-checked-manual");
  const btnRemoveCheckedRecipes = document.getElementById("btn-remove-checked-recipes");
  const shoppingTabButtons = document.querySelectorAll(".shopping-tab-btn");
  const shoppingSections = document.querySelectorAll(".shopping-section");

  const shoppingAd = document.getElementById("shopping-ad-card");
  const profileAd = document.getElementById("profile-ad-card");
  const adCards = [shoppingAd, profileAd];
  const aiLoadingOverlay = document.getElementById("ai-loading-overlay");

  const detailTitleEl = document.getElementById("detail-title");
  const detailSubtitleEl = document.getElementById("detail-subtitle");
  const detailNameEl = document.getElementById("detail-name");
  const detailTimeEl = document.getElementById("detail-time");
  const detailTeaserEl = document.getElementById("detail-teaser");
  const detailIngredientsEl = document.getElementById("detail-ingredients");
  const detailStepsEl = document.getElementById("detail-steps");

  const favBtn = document.getElementById("btn-fav");
  const addShoppingBtn = document.getElementById("btn-add-shopping");

  const recipesLastScanEl = document.getElementById("recipes-last-scan");
  const recipesLastScanEmptyEl = document.getElementById("recipes-last-scan-empty");
  const recipesFavListEl = document.getElementById("recipes-fav-list");
  const recipesFavEmptyEl = document.getElementById("recipes-fav-empty");
  const recipesGlobalListEl = document.getElementById("recipes-global-list");
  const recipesFilterChips = document.querySelectorAll(".recipes-filter-chip");
  const recipesTabButtons = document.querySelectorAll(".recipes-tab-btn");
  const recipesSections = document.querySelectorAll(".recipes-section");
  const btnOpenFavoritesFull = document.getElementById("btn-open-favorites-full");

  let currentRecipeId = null;
  let currentRecipesTab = "scan";
  const extraIngredients = [];


  function getRecipeById(recipeId) {
    let r = scanRecipes.find((r) => r.id === recipeId);
    if (r) return r;
    return globalRecipes.find((r) => r.id === recipeId) || null;
  }

  function getIsPremium() {
    return localStorage.getItem("scanchef_isPremium") === "true";
  }

  function setIsPremium(value) {
    localStorage.setItem("scanchef_isPremium", value ? "true" : "false");
  }

  function getIsDev() {
    return localStorage.getItem("scanchef_devMode") === "true";
  }

  function setIsDev(value) {
    localStorage.setItem("scanchef_devMode", value ? "true" : "false");
  }

  function getFavorites() {
    try {
      const raw = localStorage.getItem("scanchef_favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function setFavorites(arr) {
    localStorage.setItem("scanchef_favorites", JSON.stringify(arr));
  }

  function isFavorite(recipeId) {
    return getFavorites().includes(recipeId);
  }

  function getShoppingItems() {
    try {
      const raw = localStorage.getItem("scanchef_shopping");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function setShoppingItems(arr) {
    localStorage.setItem("scanchef_shopping", JSON.stringify(arr));
  }


function getShoppingItemsBySource(source) {
    const all = getShoppingItems();
    return all.filter((item) => (item.source || "recipe") === source);
  }

  function setShoppingItemsBySource(source, itemsForSource) {
    const all = getShoppingItems();
    const remaining = all.filter((item) => (item.source || "recipe") !== source);
    setShoppingItems([...remaining, ...itemsForSource]);
  }

  function clearShoppingBySource(source) {
    setShoppingItemsBySource(source, []);
  }

  function updatePremiumUI() {
    const isPremium = getIsPremium();
    if (togglePremiumBtn) {
      togglePremiumBtn.textContent = isPremium
        ? "Modus: Plus (werbefrei)"
        : "Modus: Free (mit Werbung)";
    }
    adCards.forEach((el) => {
      if (!el) return;
      el.style.display = isPremium ? "none" : "";
    });
  }

  function updateDevUI() {
    const isDev = getIsDev();
    if (toggleDevBtn) {
      toggleDevBtn.textContent = isDev ? "Dev-Modus: An" : "Dev-Modus: Aus";
    }
    if (aiCardEl) {
      aiCardEl.style.display = isDev ? "" : "none";
    }
  }

  function renderIngredients() {
    if (!ingredientListEl) return;
    ingredientListEl.innerHTML = "";
    scanIngredients.forEach((item) => {
      const li = document.createElement("li");
      const left = document.createElement("span");
      left.textContent = item.emoji + " " + item.name;
      const right = document.createElement("span");
      right.className = "badge";
      right.textContent = item.quantity;
      li.appendChild(left);
      li.appendChild(right);
      ingredientListEl.appendChild(li);
    });

    if (freshnessHintEl) {
      const hasDry = scanIngredients.some((i) => i.freshness === "trocken");
      const hasFresh = scanIngredients.some((i) => i.freshness === "frisch");
      let hintKey = "ok";
      if (hasDry) hintKey = "trocken";
      else if (hasFresh) hintKey = "frisch";
      freshnessHintEl.textContent = freshnessHints[hintKey];
    }
  }

  function renderAiJson() {
    if (!aiJsonEl) return;
    const payload = {
      ingredients: scanIngredients,
      extraIngredients: extraIngredients,
      recipes: scanRecipes.map((r) => ({
        id: r.id,
        title: r.title,
        minutes: r.minutes,
        uses: r.uses
      }))
    };
    aiJsonEl.textContent = JSON.stringify(payload, null, 2);
  }

  
  function formatRecipeTags(tags) {
    if (!Array.isArray(tags)) return "";
    const labelMap = {
      quick: "⏱ bis 10 Min",
      filling: "🍝 Sättigend",
      family: "🧒 Familienfreundlich",
      cheap: "🪙 Günstig",
      healthy: "🥦 Leicht & frisch"
    };
    const labels = tags
      .map((t) => labelMap[t])
      .filter(Boolean);
    if (labels.length === 0) return "";
    return labels.join(" · ");
  }

function buildRecipeCard(recipe) {
    const favorites = getFavorites();
    const card = document.createElement("article");
    card.className = "card recipe-card clickable";
    card.setAttribute("data-recipe-id", recipe.id);

    const header = document.createElement("div");
    header.className = "recipe-header";

    const h3 = document.createElement("h3");
    h3.textContent = recipe.title;

    const rightWrap = document.createElement("div");
    rightWrap.style.display = "flex";
    rightWrap.style.alignItems = "center";
    rightWrap.style.gap = "6px";

    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = "⏱ " + recipe.minutes + " Min";

    const favToggle = document.createElement("button");
    favToggle.type = "button";
    favToggle.textContent = favorites.includes(recipe.id) ? "★" : "☆";
    favToggle.title = "Als Favorit speichern";
    favToggle.style.border = "none";
    favToggle.style.background = "transparent";
    favToggle.style.color = favorites.includes(recipe.id) ? "#facc15" : "#9ca3af";
    favToggle.style.cursor = "pointer";
    favToggle.style.fontSize = "16px";
    favToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(recipe.id);
    });

    rightWrap.appendChild(pill);
    rightWrap.appendChild(favToggle);
    header.appendChild(h3);
    header.appendChild(rightWrap);
    card.appendChild(header);

    if (recipe.teaser) {
      const meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = recipe.teaser;
      card.appendChild(meta);
    }

    const tagLine = formatRecipeTags(recipe.tags);
    if (tagLine) {
      const tagsMeta = document.createElement("p");
      tagsMeta.className = "meta small-meta";
      tagsMeta.textContent = tagLine;
      card.appendChild(tagsMeta);
    }

    if (Array.isArray(recipe.steps) && recipe.steps.length > 0) {
      const stepsUl = document.createElement("ul");
      stepsUl.className = "steps";
      recipe.steps.forEach((step) => {
        const li = document.createElement("li");
        li.textContent = step;
        stepsUl.appendChild(li);
      });
      card.appendChild(stepsUl);
    }

    card.addEventListener("click", () => {
      openRecipeDetail(recipe.id);
    });

    return card;
  }

  function renderScanRecipesSection() {
    if (!recipesLastScanEl || !recipesLastScanEmptyEl) return;
    recipesLastScanEl.innerHTML = "";

    if (!scanRecipes || scanRecipes.length === 0) {
      recipesLastScanEmptyEl.style.display = "";
      return;
    }
    recipesLastScanEmptyEl.style.display = "none";

    scanRecipes.forEach((recipe) => {
      const card = buildRecipeCard(recipe);
      recipesLastScanEl.appendChild(card);
    });
  }

  let currentGlobalFilter = "all";

  function renderGlobalRecipesSection() {
    if (!recipesGlobalListEl) return;
    recipesGlobalListEl.innerHTML = "";

    let list = globalRecipes.slice();
    if (currentGlobalFilter !== "all") {
      list = list.filter((r) => {
        if (!Array.isArray(r.tags)) return true;
        return r.tags.includes(currentGlobalFilter);
      });
    } else {
      // "Empfohlen heute" – zufällige Reihenfolge für die Vorschau
      list = list.slice().sort(() => Math.random() - 0.5);
    }

    const limit = currentGlobalFilter === "all" ? 4 : list.length;

    list.slice(0, limit).forEach((recipe) => {
      const card = buildRecipeCard(recipe);
      recipesGlobalListEl.appendChild(card);
    });
  }

  function renderRecipesFavoritesSection() {
    if (!recipesFavListEl || !recipesFavEmptyEl) return;
    const favIds = getFavorites();
    recipesFavListEl.innerHTML = "";

    if (favIds.length === 0) {
      recipesFavEmptyEl.style.display = "";
      return;
    }
    recipesFavEmptyEl.style.display = "none";

    const previewIds = favIds.slice(-3).reverse();
    previewIds.forEach((id) => {
      const recipe = getRecipeById(id);
      if (!recipe) return;
      const card = buildRecipeCard(recipe);
      recipesFavListEl.appendChild(card);
    });
  }

  function renderRecipesHome() {
    renderScanRecipesSection();
    renderGlobalRecipesSection();
    renderRecipesFavoritesSection();

    if (recipesSubtitleEl) {
      const baseNames = scanIngredients.map((i) => i.name);
      const extraNames = extraIngredients.slice();
      const allNames = baseNames.concat(extraNames).filter(Boolean);
      if (allNames.length > 0) {
        recipesSubtitleEl.textContent = "Aus deinen " + allNames.join(", ");
      } else {
        recipesSubtitleEl.textContent = "Aus deinen Zutaten und Vorschlägen";
      }
    }
  }

  function renderFavoritesMain() {
    if (!favoritesMainListEl || !favoritesMainEmptyEl) return;
    const favIds = getFavorites();
    favoritesMainListEl.innerHTML = "";

    if (favIds.length === 0) {
      favoritesMainEmptyEl.style.display = "";
      return;
    }
    favoritesMainEmptyEl.style.display = "none";

    favIds.forEach((id) => {
      const recipe = getRecipeById(id);
      if (!recipe) return;
      const card = buildRecipeCard(recipe);
      favoritesMainListEl.appendChild(card);
    });
  }
  
function renderShoppingFromRecipes() {
    // Rezepte-Liste
    if (shoppingFromRecipesEl && shoppingEmptyHintEl) {
      const recipeItems = getShoppingItemsBySource("recipe");
      shoppingFromRecipesEl.innerHTML = "";

      if (recipeItems.length === 0) {
        shoppingEmptyHintEl.style.display = "";
      } else {
        shoppingEmptyHintEl.style.display = "none";
        recipeItems.forEach((item) => {
          const li = document.createElement("li");
          li.className = "shopping-item" + (item.checked ? " completed" : "");
          const label = document.createElement("label");
          label.className = "shopping-item-row";

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "shopping-check";
          checkbox.checked = !!item.checked;
          checkbox.setAttribute("data-id", item.id);
          checkbox.setAttribute("data-source", "recipe");

          const main = document.createElement("span");
          main.className = "shopping-item-main";

          const nameSpan = document.createElement("span");
          nameSpan.className = "shopping-item-name";
          const emoji = item.emoji || getEmojiForName(item.name, "🧺");
          nameSpan.textContent = emoji + " " + item.name;

          const qtySpan = document.createElement("span");
          qtySpan.className = "shopping-qty";
          qtySpan.textContent = item.quantity || "";

          main.appendChild(nameSpan);
          main.appendChild(qtySpan);

          label.appendChild(checkbox);
          label.appendChild(main);
          li.appendChild(label);

          shoppingFromRecipesEl.appendChild(li);
        });
      }
    }

    // Manuelle Liste
    if (shoppingManualListEl && shoppingManualEmptyEl) {
      const manualItems = getShoppingItemsBySource("manual");
      shoppingManualListEl.innerHTML = "";

      if (manualItems.length === 0) {
        shoppingManualEmptyEl.style.display = "";
      } else {
        shoppingManualEmptyEl.style.display = "none";
        manualItems.forEach((item) => {
          const li = document.createElement("li");
          li.className = "shopping-item" + (item.checked ? " completed" : "");
          const label = document.createElement("label");
          label.className = "shopping-item-row";

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "shopping-check";
          checkbox.checked = !!item.checked;
          checkbox.setAttribute("data-id", item.id);
          checkbox.setAttribute("data-source", "manual");

          const main = document.createElement("span");
          main.className = "shopping-item-main";

          const nameSpan = document.createElement("span");
          nameSpan.className = "shopping-item-name";
          const emoji = item.emoji || getEmojiForName(item.name, "📝");
          nameSpan.textContent = emoji + " " + item.name;

          const qtySpan = document.createElement("span");
          qtySpan.className = "shopping-qty";
          qtySpan.textContent = item.quantity || "";

          main.appendChild(nameSpan);
          main.appendChild(qtySpan);

          label.appendChild(checkbox);
          label.appendChild(main);
          li.appendChild(label);

          shoppingManualListEl.appendChild(li);
        });
      }
    }
  }

  
function addRecipeToShopping(recipeId) {
    const recipe = getRecipeById(recipeId);
    if (!recipe) return;
    const current = getShoppingItems();
    const byId = new Map(current.map((item) => [item.id, item]));

    recipe.uses.forEach((ingId) => {
      const ing = scanIngredients.find((i) => i.id === ingId);
      if (!ing) return;
      if (!byId.has(ing.id)) {
        byId.set(ing.id, {
          id: ing.id,
          name: ing.name,
          emoji: ing.emoji,
          quantity: ing.quantity,
          source: "recipe"
        });
      } else {
        const existing = byId.get(ing.id);
        if (!existing.source) existing.source = "recipe";
      }
    });

    const newList = Array.from(byId.values());
    setShoppingItems(newList);
    renderShoppingFromRecipes();
  }

  function toggleFavorite(recipeId) {
    const current = getFavorites();
    let next;
    if (current.includes(recipeId)) {
      next = current.filter((id) => id !== recipeId);
    } else {
      next = [...current, recipeId];
    }
    setFavorites(next);
    renderRecipesHome();
    renderFavoritesMain();
    updateDetailFavButton();
  }

  function openRecipeDetail(recipeId) {
    const recipe = getRecipeById(recipeId);
    if (!recipe) return;
    currentRecipeId = recipeId;

    if (detailTitleEl) detailTitleEl.textContent = "Rezept-Details";
    if (detailSubtitleEl) detailSubtitleEl.textContent = recipe.title;
    if (detailNameEl) detailNameEl.textContent = recipe.title;
    if (detailTimeEl) detailTimeEl.textContent = "⏱ " + recipe.minutes + " Min";
    if (detailTeaserEl) detailTeaserEl.textContent = recipe.teaser || "";

    if (detailIngredientsEl) {
      detailIngredientsEl.innerHTML = "";
      const usedIds = new Set(recipe.uses || []);
      scanIngredients
        .filter((ing) => usedIds.has(ing.id))
        .forEach((ing) => {
          const li = document.createElement("li");
          const left = document.createElement("span");
          left.textContent = ing.emoji + " " + ing.name;
          const right = document.createElement("span");
          right.className = "badge";
          right.textContent = ing.quantity;
          li.appendChild(left);
          li.appendChild(right);
          detailIngredientsEl.appendChild(li);
        });
    }

    if (detailStepsEl) {
      detailStepsEl.innerHTML = "";
      (recipe.steps || []).forEach((step) => {
        const li = document.createElement("li");
        li.textContent = step;
        detailStepsEl.appendChild(li);
      });
    }

    updateDetailFavButton();
    setActiveTab("recipes");
    showScreen("recipeDetail");
  }

  function updateDetailFavButton() {
    if (!favBtn || !currentRecipeId) return;
    const fav = isFavorite(currentRecipeId);
    favBtn.textContent = fav ? "★ Favorit entfernen" : "☆ Zu Favoriten";
  }

  function showScreen(key) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    const target = screens[key];
    if (target) target.classList.add("active");
  }

  function setActiveTab(tab) {
    navButtons.forEach((btn) => {
      const isActive = btn.getAttribute("data-tab") === tab;
      btn.classList.toggle("active", isActive);
    });
  }

  
function setActiveRecipesTab(tab) {
    currentRecipesTab = tab;
    if (recipesTabButtons && recipesTabButtons.length > 0) {
      recipesTabButtons.forEach((btn) => {
        const t = btn.getAttribute("data-recipes-tab") || "scan";
        btn.classList.toggle("active", t === tab);
      });
    }
    if (recipesSections && recipesSections.length > 0) {
      recipesSections.forEach((section) => {
        const sectionTab = section.getAttribute("data-recipes-section") || "scan";
        if (sectionTab === tab) {
          section.style.display = "";
        } else {
          section.style.display = "none";
        }
      });
    }
  }

  let currentShoppingTab = "recipes";

  function setActiveShoppingTab(tab) {
    currentShoppingTab = tab;
    if (shoppingTabButtons && shoppingTabButtons.length > 0) {
      shoppingTabButtons.forEach((btn) => {
        const t = btn.getAttribute("data-shopping-tab") || "recipes";
        btn.classList.toggle("active", t === tab);
      });
    }
    if (shoppingSections && shoppingSections.length > 0) {
      shoppingSections.forEach((section) => {
        const sectionTab = section.getAttribute("data-shopping-section") || "recipes";
        if (sectionTab === tab) {
          section.style.display = "";
        } else {
          section.style.display = "none";
        }
      });
    }
  }

  // Demo: Zutaten-Hilfe

  if (btnRescan) {
    btnRescan.addEventListener("click", () => {
      setActiveTab("scan");
      showScreen("start");
    });
  }

  if (btnAddIngredient && addIngredientPanel) {
    btnAddIngredient.addEventListener("click", () => {
      const isVisible = addIngredientPanel.style.display === "block";
      addIngredientPanel.style.display = isVisible ? "none" : "block";
    });
  }

  if (chipButtons && addIngredientInput) {
    chipButtons.forEach((chip) => {
      chip.addEventListener("click", () => {
        const raw = chip.textContent.trim();
        const parts = raw.split(" ");
        const name = parts.length > 1 ? parts.slice(1).join(" ") : raw;

        const current = addIngredientInput.value.trim();
        if (!current) {
          addIngredientInput.value = name;
        } else {
          const existing = current.split(",").map((p) => p.trim()).filter(Boolean);
          if (!existing.includes(name)) {
            addIngredientInput.value = current + ", " + name;
          }
        }

        // Extra-Liste für Demo / KI-Input
        const cleanName = name.trim();
        if (cleanName && !extraIngredients.includes(cleanName)) {
          extraIngredients.push(cleanName);
        }
      });
    });
  }

  if (addIngredientSubmit && addIngredientInput) {
    addIngredientSubmit.addEventListener("click", () => {
      const val = addIngredientInput.value.trim();
      if (!val) {
        alert("Demo: Bitte gib eine zusätzliche Zutat ein (z. B. Zwiebeln, Nudeln, Reis).");
        return;
      }
      alert('Demo: "' + val + '" würde als zusätzliche Vorrats-Zutat gespeichert und in die Rezepte einfließen.');
      addIngredientInput.value = "";
    });
  }

  // Startflow
  if (btnOnboardingNext) {
    btnOnboardingNext.addEventListener("click", () => {
      setActiveTab("scan");
      showScreen("start");
    });
  }


  let lastScanImageUrl = null;

  function updateScanPhoto(file) {
    if (!file || !scanPhoto) return;
    if (lastScanImageUrl) {
      URL.revokeObjectURL(lastScanImageUrl);
    }
    const url = URL.createObjectURL(file);
    lastScanImageUrl = url;
    scanPhoto.src = url;
  }

  
async function startRealScan(file) {
  if (!file) return;

  if (!btnStartScan || !cameraPlaceholder) {
    // Kein spezieller Scan-Header vorhanden – rendere direkt
    try {
      await performScanRequest(file);
    } catch (err) {
      console.error("Scan fehlgeschlagen, Fallback auf Demo:", err);
      startFakeScanFlow();
    }
    return;
  }

  const originalText = btnStartScan.textContent;
  btnStartScan.disabled = true;
  btnStartScan.textContent = "🔍 Scan läuft…";
  cameraPlaceholder.classList.add("scanning");

  try {
    await performScanRequest(file);
  } catch (err) {
    console.error("Scan fehlgeschlagen, Fallback auf Demo:", err);
    startFakeScanFlow();
    return;
  } finally {
    cameraPlaceholder.classList.remove("scanning");
    btnStartScan.disabled = false;
    btnStartScan.textContent = originalText;
  }

  renderIngredients();
  if (getIsDev()) renderAiJson();
  setActiveTab("scan");
  showScreen("scan");
}

async function performScanRequest(file) {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("locale", "de-DE");
    formData.append("maxIngredients", "12");

    const response = await fetch(SCAN_API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Scan-API Antwort war nicht OK: " + response.status);
    }

    const data = await response.json();
    const zutaten = Array.isArray(data.zutaten) ? data.zutaten : [];

    if (zutaten.length === 0) {
      console.warn("Scan-API hat keine Zutaten zurückgegeben:", data);
      return;
    }

    scanIngredients = zutaten.map((z, index) => {
      const name = (z.name || "").trim() || "Zutat";
      const lower = name.toLowerCase();
      const emoji = ingredientEmojiMap[lower] || "🧺";
      const mengeText = (z.menge || "").toString().trim();
      const einheitText = (z.einheit || "").toString().trim();
      const quantity = [mengeText, einheitText].filter(Boolean).join(" ").trim() || mengeText || "1";

      let freshness = "ok";
      const f = (z.frische || "").toLowerCase();
      if (f.includes("frisch")) freshness = "frisch";
      else if (f.includes("trocken") || f.includes("alt")) freshness = "trocken";

      return {
        id: z.id || ("zutat_" + index),
        name,
        emoji,
        quantity,
        freshness,
      };
    });
  } catch (err) {
    throw err;
  }
}

function startFakeScanFlow() {
    if (!cameraPlaceholder) {
      // Fallback: direkt zum Scan-Screen
      renderIngredients();
      if (getIsDev()) renderAiJson();
      setActiveTab("scan");
      showScreen("scan");
      return;
    }

    const originalText = btnStartScan.textContent;
    btnStartScan.disabled = true;
    btnStartScan.textContent = "🔍 Scan läuft…";

    cameraPlaceholder.classList.add("scanning");

    setTimeout(() => {
      cameraPlaceholder.classList.remove("scanning");
      btnStartScan.disabled = false;
      btnStartScan.textContent = originalText;

      renderIngredients();
      if (getIsDev()) renderAiJson();
      setActiveTab("scan");
      showScreen("scan");
    }, 2600);
  }

  if (btnStartScan) {
    btnStartScan.addEventListener("click", () => {
      // Kamera-/Galerie-Auswahl öffnen
      if (cameraInput) {
        cameraInput.value = "";
        cameraInput.click();
      } else {
        startFakeScanFlow();
      }
    });
  }

  if (cameraInput) {
    cameraInput.addEventListener("change", () => {
      if (!cameraInput.files || cameraInput.files.length === 0) return;
      const file = cameraInput.files[0];

      // Bild im Scan-Screen setzen
      updateScanPhoto(file);

      // Scan-Flow starten – echte Vision-Analyse, Fallback auf Demo
      startRealScan(file);
    });
  }

if (btnShowRecipes) {
    btnShowRecipes.addEventListener("click", () => {
      // Übernimm manuell eingegebene zusätzliche Zutaten (Komma-separiert)
      if (addIngredientInput) {
        const val = addIngredientInput.value.trim();
        if (val) {
          const parts = val.split(",").map((p) => p.trim()).filter(Boolean);
          parts.forEach((name) => {
            const cleanName = name.trim();
            if (cleanName && !extraIngredients.includes(cleanName)) {
              extraIngredients.push(cleanName);
            }
          });
          addIngredientInput.value = "";
        }
      }

      // KI-Loader anzeigen
      if (aiLoadingOverlay) {
        aiLoadingOverlay.style.display = "flex";
      }

      setTimeout(() => {
        renderRecipesHome();
        setActiveTab("recipes");
        showScreen("recipes");
        setActiveRecipesTab("scan");
        if (aiLoadingOverlay) {
          aiLoadingOverlay.style.display = "none";
        }
      }, 750);
    });
  }

  backButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (target === "screen-start") {
        setActiveTab("scan");
        showScreen("start");
      } else if (target === "screen-scan") {
        setActiveTab("scan");
        showScreen("scan");
      } else if (target === "screen-recipes") {
        setActiveTab("recipes");
        showScreen("recipes");
      }
    });
  });

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      setActiveTab(tab);
      if (tab === "scan") {
        showScreen("start");
      } else if (tab === "recipes") {
        renderRecipesHome();
        showScreen("recipes");
        setActiveRecipesTab(currentRecipesTab);
      } else if (tab === "favorites") {
        renderFavoritesMain();
        showScreen("favorites");
      } else if (tab === "shopping") {
        renderShoppingFromRecipes();
        showScreen("shopping");
      } else if (tab === "profile") {
        showScreen("profile");
      }
    });
  });

  if (togglePremiumBtn) {
    togglePremiumBtn.addEventListener("click", () => {
      const current = getIsPremium();
      setIsPremium(!current);
    

  // Einkaufsliste – Tabs
  if (shoppingTabButtons && shoppingTabButtons.length > 0) {
    shoppingTabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-shopping-tab") || "recipes";
        setActiveShoppingTab(tab);
      });
    });
  }

  // Einkaufsliste – manuelle Einträge
  if (btnShoppingManualAdd && shoppingManualNameInput) {
    btnShoppingManualAdd.addEventListener("click", () => {
      const name = shoppingManualNameInput.value.trim();
      const qty = shoppingManualQtyInput ? shoppingManualQtyInput.value.trim() : "";
      if (!name) {
        return;
      }

      const manualItems = getShoppingItemsBySource("manual");
      const emoji = getEmojiForName(name, "📝");
      manualItems.push({
        id: "manual-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        name,
        quantity: qty,
        emoji,
        source: "manual"
      });
      setShoppingItemsBySource("manual", manualItems);
      shoppingManualNameInput.value = "";
      if (shoppingManualQtyInput) shoppingManualQtyInput.value = "";
      updateShoppingSuggestions();
      renderShoppingFromRecipes();
      setActiveShoppingTab("manual");
    });
  }

  if (btnClearShoppingManual) {
    btnClearShoppingManual.addEventListener("click", () => {
      clearShoppingBySource("manual");
      renderShoppingFromRecipes();
    });
  }

  if (btnClearShoppingRecipes) {
    btnClearShoppingRecipes.addEventListener("click", () => {
      clearShoppingBySource("recipe");
      renderShoppingFromRecipes();
    });
  }

  if (shoppingManualNameInput) {
    shoppingManualNameInput.addEventListener("input", () => {
      updateShoppingSuggestions();
    });
  }

  // Einkaufsliste – Checkbox-Änderungen (Delegation)
  if (shoppingFromRecipesEl) {
    shoppingFromRecipesEl.addEventListener("change", (ev) => {
      const target = ev.target;
      if (!target || !target.classList.contains("shopping-check")) return;
      const id = target.getAttribute("data-id");
      const items = getShoppingItemsBySource("recipe");
      const next = items.map((item) =>
        item.id === id ? { ...item, checked: target.checked } : item
      );
      setShoppingItemsBySource("recipe", next);
      renderShoppingFromRecipes();
    });
  }

  if (shoppingManualListEl) {
    shoppingManualListEl.addEventListener("change", (ev) => {
      const target = ev.target;
      if (!target || !target.classList.contains("shopping-check")) return;
      const id = target.getAttribute("data-id");
      const items = getShoppingItemsBySource("manual");
      const next = items.map((item) =>
        item.id === id ? { ...item, checked: target.checked } : item
      );
      setShoppingItemsBySource("manual", next);
      renderShoppingFromRecipes();
    });
  }

  // Einkaufsliste – Abgehakte entfernen
  if (btnRemoveCheckedRecipes) {
    btnRemoveCheckedRecipes.addEventListener("click", () => {
      const items = getShoppingItemsBySource("recipe");
      const next = items.filter((item) => !item.checked);
      setShoppingItemsBySource("recipe", next);
      renderShoppingFromRecipes();
    });
  }

  if (btnRemoveCheckedManual) {
    btnRemoveCheckedManual.addEventListener("click", () => {
      const items = getShoppingItemsBySource("manual");
      const next = items.filter((item) => !item.checked);
      setShoppingItemsBySource("manual", next);
      renderShoppingFromRecipes();
    });
  }


  updatePremiumUI();
    });
  }

  if (toggleDevBtn) {
    toggleDevBtn.addEventListener("click", () => {
      const current = getIsDev();
      setIsDev(!current);
      updateDevUI();
      if (getIsDev()) renderAiJson();
    });
  }

  if (favBtn) {
    favBtn.addEventListener("click", () => {
      if (!currentRecipeId) return;
      toggleFavorite(currentRecipeId);
    });
  }

  if (addShoppingBtn) {
    addShoppingBtn.addEventListener("click", () => {
      if (!currentRecipeId) return;
      addRecipeToShopping(currentRecipeId);
    });
  }

  if (recipesTabButtons && recipesTabButtons.length > 0) {
    recipesTabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-recipes-tab") || "scan";
        setActiveRecipesTab(tab);
      });
    });
    // Initial state
    setActiveRecipesTab(currentRecipesTab);
  }

  if (btnOpenFavoritesFull) {
    btnOpenFavoritesFull.addEventListener("click", () => {
      setActiveTab("favorites");
      showScreen("favorites");
    });
  }

  if (recipesFilterChips && recipesFilterChips.length > 0) {
    recipesFilterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const filter = chip.getAttribute("data-filter") || "all";
        currentGlobalFilter = filter;
        recipesFilterChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        renderGlobalRecipesSection();
      });
    });
  }



  // Einkaufsliste – Tabs
  if (shoppingTabButtons && shoppingTabButtons.length > 0) {
    shoppingTabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-shopping-tab") || "recipes";
        setActiveShoppingTab(tab);
      });
    });
  }

  // Einkaufsliste – manuelle Einträge
  if (btnShoppingManualAdd && shoppingManualNameInput) {
    btnShoppingManualAdd.addEventListener("click", () => {
      const name = shoppingManualNameInput.value.trim();
      const qty = shoppingManualQtyInput ? shoppingManualQtyInput.value.trim() : "";
      if (!name) {
        return;
      }

      const manualItems = getShoppingItemsBySource("manual");
      const emoji = getEmojiForName(name, "📝");
      manualItems.push({
        id: "manual-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        name,
        quantity: qty,
        emoji,
        source: "manual"
      });
      setShoppingItemsBySource("manual", manualItems);
      shoppingManualNameInput.value = "";
      if (shoppingManualQtyInput) shoppingManualQtyInput.value = "";
      updateShoppingSuggestions();
      renderShoppingFromRecipes();
      setActiveShoppingTab("manual");
    });
  }

  if (btnClearShoppingManual) {
    btnClearShoppingManual.addEventListener("click", () => {
      clearShoppingBySource("manual");
      renderShoppingFromRecipes();
    });
  }

  if (btnClearShoppingRecipes) {
    btnClearShoppingRecipes.addEventListener("click", () => {
      clearShoppingBySource("recipe");
      renderShoppingFromRecipes();
    });
  }

  if (shoppingManualNameInput) {
    shoppingManualNameInput.addEventListener("input", () => {
      updateShoppingSuggestions();
    });
  }

  // Einkaufsliste – Checkbox-Änderungen (Delegation)
  if (shoppingFromRecipesEl) {
    shoppingFromRecipesEl.addEventListener("change", (ev) => {
      const target = ev.target;
      if (!target || !target.classList.contains("shopping-check")) return;
      const id = target.getAttribute("data-id");
      const items = getShoppingItemsBySource("recipe");
      const next = items.map((item) =>
        item.id === id ? { ...item, checked: target.checked } : item
      );
      setShoppingItemsBySource("recipe", next);
      renderShoppingFromRecipes();
    });
  }

  if (shoppingManualListEl) {
    shoppingManualListEl.addEventListener("change", (ev) => {
      const target = ev.target;
      if (!target || !target.classList.contains("shopping-check")) return;
      const id = target.getAttribute("data-id");
      const items = getShoppingItemsBySource("manual");
      const next = items.map((item) =>
        item.id === id ? { ...item, checked: target.checked } : item
      );
      setShoppingItemsBySource("manual", next);
      renderShoppingFromRecipes();
    });
  }

  // Einkaufsliste – Abgehakte entfernen
  if (btnRemoveCheckedRecipes) {
    btnRemoveCheckedRecipes.addEventListener("click", () => {
      const items = getShoppingItemsBySource("recipe");
      const next = items.filter((item) => !item.checked);
      setShoppingItemsBySource("recipe", next);
      renderShoppingFromRecipes();
    });
  }

  if (btnRemoveCheckedManual) {
    btnRemoveCheckedManual.addEventListener("click", () => {
      const items = getShoppingItemsBySource("manual");
      const next = items.filter((item) => !item.checked);
      setShoppingItemsBySource("manual", next);
      renderShoppingFromRecipes();
    });
  }


  updatePremiumUI();
  updateDevUI();
  renderFavoritesMain();
  renderShoppingFromRecipes();
  setActiveShoppingTab(currentShoppingTab);

// v9.10.1 – helper for rich recipe cards
  function getRecipeEmoji(recipe) {
    if (recipe && recipe.emoji) return recipe.emoji;
    const uses = (recipe && recipe.uses) || [];
    const tagStr = ((recipe && recipe.tags) || []).join(" ").toLowerCase();
    if (uses.includes("pasta") || uses.includes("noodles") || tagStr.includes("pasta")) return "🍝";
    if (uses.includes("tomato")) return "🍅";
    if (uses.includes("soup") || tagStr.includes("suppe")) return "🍲";
    if (tagStr.includes("salat") || tagStr.includes("salad")) return "🥗";
    if (tagStr.includes("snack")) return "🥨";
    return "🍽️";
  }

  function getRecipeDifficulty(recipe) {
    if (recipe && recipe.difficulty) return recipe.difficulty;
    return "Einfach";
  }

  function getRecipePortions(recipe) {
    if (recipe && recipe.portions) return recipe.portions;
    return 2;
  }

  function getRecipeTagChips(recipe) {
    const tags = (recipe && recipe.tags) || [];
    return tags.slice(0, 3);
  }

  // v9.10.1 – new rich recipe card UI
  function buildRecipeCard(recipe) {
    const card = document.createElement("article");
    card.className = "card recipe-card clickable";
    card.setAttribute("data-recipe-id", recipe.id);

    const favorites = getFavorites();
    const isFav = favorites.includes(recipe.id);

    const top = document.createElement("div");
    top.className = "recipe-card-top";

    const main = document.createElement("div");
    main.className = "recipe-main";

    const titleRow = document.createElement("div");
    titleRow.className = "recipe-title-row";

    const emojiBadge = document.createElement("div");
    emojiBadge.className = "recipe-emoji-badge";
    emojiBadge.textContent = getRecipeEmoji(recipe);

    const h3 = document.createElement("h3");
    h3.textContent = recipe.title || "Rezept";

    titleRow.appendChild(emojiBadge);
    titleRow.appendChild(h3);
    main.appendChild(titleRow);

    const metaRow = document.createElement("div");
    metaRow.className = "recipe-meta-row";

    if (typeof recipe.minutes === "number") {
      const timePill = document.createElement("span");
      timePill.className = "meta-pill";
      const icon = document.createElement("span");
      icon.className = "meta-pill-icon";
      icon.textContent = "⏱";
      const label = document.createElement("span");
      label.textContent = recipe.minutes + " Min";
      timePill.appendChild(icon);
      timePill.appendChild(label);
      metaRow.appendChild(timePill);
    }

    const diffPill = document.createElement("span");
    diffPill.className = "meta-pill";
    const diffIcon = document.createElement("span");
    diffIcon.className = "meta-pill-icon";
    diffIcon.textContent = "⭐";
    const diffLabel = document.createElement("span");
    diffLabel.textContent = getRecipeDifficulty(recipe);
    diffPill.appendChild(diffIcon);
    diffPill.appendChild(diffLabel);
    metaRow.appendChild(diffPill);

    const portions = getRecipePortions(recipe);
    if (portions) {
      const portPill = document.createElement("span");
      portPill.className = "meta-pill";
      const portIcon = document.createElement("span");
      portIcon.className = "meta-pill-icon";
      portIcon.textContent = "👨‍👩‍👧";
      const portLabel = document.createElement("span");
      portLabel.textContent = portions + " Port.";
      portPill.appendChild(portIcon);
      portPill.appendChild(portLabel);
      metaRow.appendChild(portPill);
    }

    main.appendChild(metaRow);
    top.appendChild(main);

    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.className = "favorite-toggle" + (isFav ? " is-active" : "");
    favBtn.setAttribute("aria-label", "Favorit umschalten");
    favBtn.textContent = isFav ? "★" : "☆";
    favBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      toggleFavorite(recipe.id);
    });

    top.appendChild(favBtn);
    card.appendChild(top);

    if (recipe.teaser) {
      const teaser = document.createElement("p");
      teaser.className = "recipe-teaser";
      teaser.textContent = recipe.teaser;
      card.appendChild(teaser);
    }

    const tagChips = getRecipeTagChips(recipe);
    if (tagChips.length) {
      const tagsRow = document.createElement("div");
      tagsRow.className = "recipe-tags-row";
      tagChips.forEach((tag) => {
        const chip = document.createElement("span");
        chip.className = "recipe-tag-chip";
        chip.textContent = tag;
        tagsRow.appendChild(chip);
      });
      card.appendChild(tagsRow);
    }

    card.addEventListener("click", () => {
      openRecipeDetail(recipe.id);
    });

    return card;
  }

});


// PWA: Service Worker Registration (non-blocking)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {
      // ignore errors silently – app works fine without SW
    });
  });
}
