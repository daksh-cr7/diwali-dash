// "FOR YOU" RECOMMENDATION ENGINE - three ideas combined:
// 1. CONTENT-BASED FILTERING: turn every product into a list of numbers (a vector), compare with COSINE SIMILARITY.
// 2. ASSOCIATION ("people who buy A also buy B"): counted from sample past orders (BASKETS).
// 3. DIVERSITY: never show more than 2 items from one category.

const TAGS = {
  "Diyas": ["puja", "decor", "light"], "Sweets": ["edible", "sweet", "gift"], "Dry fruits": ["edible", "gift"],
  "Gift hampers": ["gift"], "Rangoli": ["decor"], "Lights": ["decor", "light"], "Chocolates": ["edible", "sweet", "gift"],
  "Pooja items": ["puja"], "Snacks": ["edible"], "Decor": ["decor"], "Tea & coffee": ["drink", "edible"],
  "Fresh flowers": ["puja", "decor"], "Cleaning": ["home"], "Festive wear": ["wear", "gift"]
};
const CATS = Object.keys(TAGS);
const TAGLIST = ["puja", "decor", "edible", "sweet", "gift", "drink", "light", "home", "wear"];

// Sample past orders (category level). A real app has millions of these.
const BASKETS = [
  ["Diyas", "Rangoli", "Pooja items", "Fresh flowers"], ["Sweets", "Gift hampers", "Dry fruits"],
  ["Lights", "Decor", "Rangoli"], ["Snacks", "Tea & coffee", "Sweets"], ["Chocolates", "Gift hampers"],
  ["Pooja items", "Fresh flowers", "Diyas"], ["Dry fruits", "Sweets", "Tea & coffee"], ["Decor", "Lights", "Diyas"],
  ["Gift hampers", "Chocolates", "Dry fruits", "Sweets"], ["Snacks", "Chocolates"], ["Rangoli", "Diyas", "Lights"],
  ["Fresh flowers", "Decor"],
  ["Cleaning", "Decor", "Lights", "Diyas"], ["Festive wear", "Gift hampers", "Sweets"], ["Cleaning", "Rangoli"],
  ["Festive wear", "Fresh flowers", "Pooja items"]
];
const catCount = {}, assoc = {};   // assoc[A][B] = number of orders containing both A and B
BASKETS.forEach(b => b.forEach(a => {
  catCount[a] = (catCount[a] || 0) + 1; assoc[a] = assoc[a] || {};
  b.forEach(c => { if (c !== a) assoc[a][c] = (assoc[a][c] || 0) + 1; });
}));

// A product becomes numbers: 12 category slots + 3 price-band slots + 7 tag slots.
function featureVector(p) {
  const v = CATS.map(c => c === p.cat ? 1 : 0);
  const tier = p.base < 100 ? 0 : p.base < 300 ? 1 : 2;
  [0, 1, 2].forEach(t => v.push(t === tier ? 0.5 : 0));
  TAGLIST.forEach(t => v.push(TAGS[p.cat].includes(t) ? 0.7 : 0));
  return v;
}
function buildVectors(products) { products.forEach(p => p.vec = featureVector(p)); }

function dot(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
// Cosine similarity: 1 = pointing the same way (very alike), 0 = nothing in common.
function cosine(a, b) { const d = Math.sqrt(dot(a, a)) * Math.sqrt(dot(b, b)); return d ? dot(a, b) / d : 0; }

function diversify(rows, n) {
  rows.sort((a, b) => b.score - a.score);
  const out = [], cnt = {};
  for (const r of rows) {
    if ((cnt[r.p.cat] || 0) >= 2) continue;
    cnt[r.p.cat] = (cnt[r.p.cat] || 0) + 1; out.push(r);
    if (out.length >= n) break;
  }
  return out;
}

function recommend(products, cart, views, n) {
  const w = {};                                            // how much the shopper cares about each product
  products.forEach(p => { const x = (cart[p.id] || 0) + 0.5 * (views[p.id] || 0); if (x > 0) w[p.id] = x; });
  const ids = Object.keys(w).map(Number);
  const candidates = products.filter(p => p.stock > 0 && !(cart[p.id] > 0));

  if (!ids.length) {                                       // COLD START: nothing known yet, so show what is popular
    return diversify(candidates.map(p => ({ p, score: (catCount[p.cat] || 0) / BASKETS.length + (1 - p.price / p.mrp),
      why: "Trending this Diwali" })), n);
  }
  const profile = new Array(products[0].vec.length).fill(0);   // the shopper's taste = sum of liked product vectors
  ids.forEach(id => products[id].vec.forEach((x, i) => profile[i] += x * w[id]));
  const catW = {}; ids.forEach(id => { const c = products[id].cat; catW[c] = (catW[c] || 0) + w[id]; });

  const rows = candidates.map(p => {
    const content = cosine(profile, p.vec);
    let assocScore = 0, bestCat = null, bestVal = 0;
    for (const a in catW) {                                // P(buy this category | bought category a)
      if (a === p.cat || !catCount[a]) continue;
      const v = catW[a] * ((assoc[a][p.cat] || 0) / catCount[a]);
      assocScore += v; if (v > bestVal) { bestVal = v; bestCat = a; }
    }
    return { p, content, assocScore, bestCat };
  });
  const maxA = Math.max(...rows.map(r => r.assocScore), 1e-9);
  rows.forEach(r => {
    const a = r.assocScore / maxA;
    r.score = 0.55 * r.content + 0.45 * a + (flashPct[r.p.id] ? 0.05 : 0);   // small boost for live flash deals
    if (0.45 * a > 0.55 * r.content && r.bestCat) r.why = "Goes with your " + r.bestCat.toLowerCase();
    else {
      let best = null, bv = -1;
      ids.forEach(id => { const s = cosine(products[id].vec, r.p.vec); if (s > bv) { bv = s; best = products[id]; } });
      r.why = "Because you " + (cart[best.id] ? "added " : "looked at ") + best.name;
    }
  });
  return diversify(rows, n);
}
