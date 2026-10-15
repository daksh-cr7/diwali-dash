const DIWALI = new Date(2026, 10, 8, 18, 0, 0); // change if the date is different

const categories = [
  ["\u{1FA94}","Diyas"],["\u{1F36C}","Sweets"],["\u{1F95C}","Dry fruits"],["\u{1F381}","Gift hampers"],
  ["\u{1F3A8}","Rangoli"],["\u{1F4A1}","Lights"],["\u{1F36B}","Chocolates"],["\u{1F9F4}","Pooja items"],
  ["\u{1F968}","Snacks"],["\u{1F38A}","Decor"],["\u2615","Tea & coffee"],["\u{1F33C}","Fresh flowers"]
];
const tints = {"Diyas":"#ff9f1c","Sweets":"#ff4d8d","Dry fruits":"#c58b4a","Gift hampers":"#b66dff","Rangoli":"#2ec4b6","Lights":"#ffd60a",
  "Chocolates":"#8d5524","Pooja items":"#ff6b35","Snacks":"#e9a23b","Decor":"#e63946","Tea & coffee":"#52b788","Fresh flowers":"#ff8fab"};

// [name, weight, price, mrp, picture, category, buyOneGetOne?]
const raw = [
  ["Clay diya set","12 pcs",79,120,"\u{1FA94}","Diyas"],["Painted diya set","6 pcs",149,220,"\u{1FA94}","Diyas"],
  ["Tea light candles","50 pcs",129,199,"\u{1F56F}","Diyas"],["Brass diya","2 pcs",249,320,"\u{1FA94}","Diyas"],
  ["Diya wicks","100 pcs",39,50,"\u{1F9F5}","Diyas"],["Floating candles","6 pcs",179,250,"\u{1F56F}","Diyas"],
  ["Kaju katli","250 g",249,330,"\u{1F36C}","Sweets",1],["Soan papdi","500 g",199,260,"\u{1F36C}","Sweets",1],
  ["Gulab jamun tin","1 kg",229,280,"\u{1F36E}","Sweets"],["Motichoor laddu","500 g",299,380,"\u{1F36C}","Sweets",1],
  ["Rasgulla tin","1 kg",199,240,"\u{1F36E}","Sweets"],["Mysore pak","250 g",179,240,"\u{1F36C}","Sweets"],
  ["Mixed dry fruits","500 g",449,600,"\u{1F95C}","Dry fruits"],["Almonds","500 g",399,520,"\u{1F95C}","Dry fruits"],
  ["Cashews","250 g",289,370,"\u{1F95C}","Dry fruits"],["Pistachios","200 g",349,450,"\u{1F95C}","Dry fruits"],
  ["Raisins","500 g",149,190,"\u{1F347}","Dry fruits"],["Walnut kernels","250 g",329,420,"\u{1F95C}","Dry fruits"],
  ["Classic Diwali hamper","1 box",599,899,"\u{1F381}","Gift hampers"],["Dry fruit gift box","1 box",799,1100,"\u{1F381}","Gift hampers"],
  ["Sweet and snack hamper","1 box",499,700,"\u{1F381}","Gift hampers"],["Festive puja hamper","1 box",899,1199,"\u{1F381}","Gift hampers"],
  ["Chocolate hamper","1 box",649,850,"\u{1F381}","Gift hampers"],["Mini gift hamper","1 box",299,420,"\u{1F381}","Gift hampers"],
  ["Rangoli colour pack","6 colours",99,149,"\u{1F3A8}","Rangoli"],["Rangoli stencil set","10 pcs",79,120,"\u{1F3A8}","Rangoli"],
  ["Flower rangoli stickers","12 pcs",59,90,"\u{1F338}","Rangoli"],["White rangoli powder","500 g",49,70,"\u{1F3A8}","Rangoli"],
  ["Glitter rangoli","100 g",69,99,"\u2728","Rangoli"],["Peacock rangoli mat","1 pc",119,180,"\u{1F99A}","Rangoli"],
  ["LED string lights","10 m",199,399,"\u{1F4A1}","Lights"],["Paper lantern","3 pcs",249,360,"\u{1F3EE}","Lights"],
  ["Warm fairy lights","5 m",149,250,"\u{1F4A1}","Lights"],["Lotus floating lamp","2 pcs",199,300,"\u{1FAB7}","Lights"],
  ["Star lantern","1 pc",179,259,"\u2B50","Lights"],["Rice lights","15 m",299,499,"\u{1F4A1}","Lights"],
  ["Milk chocolate gift box","5 bars",299,350,"\u{1F36B}","Chocolates"],["Assorted chocolates box","250 g",349,450,"\u{1F36B}","Chocolates"],
  ["Dark chocolate","100 g",149,190,"\u{1F36B}","Chocolates"],["Truffle box","200 g",399,520,"\u{1F36B}","Chocolates"],
  ["Chocolate coins","20 pcs",99,130,"\u{1FA99}","Chocolates"],["Wafer rolls","150 g",129,160,"\u{1F36B}","Chocolates"],
  ["Pooja thali set","1 set",349,499,"\u{1F9FF}","Pooja items"],["Incense sticks","100 sticks",89,130,"\u{1F9F4}","Pooja items"],
  ["Camphor","100 g",79,110,"\u{1F9F4}","Pooja items"],["Roli and chawal kit","1 kit",59,80,"\u{1F9F4}","Pooja items"],
  ["Pure ghee for diya","500 ml",299,380,"\u{1F9C8}","Pooja items"],["Brass kalash","1 pc",449,650,"\u{1F3FA}","Pooja items"]
];

raw.push(
  ["Bhujia sev","400 g",99,130,"\u{1F968}","Snacks",1],["Chakli","250 g",119,150,"\u{1F365}","Snacks"],
  ["Mathri","300 g",109,140,"\u{1F960}","Snacks",1],["Namak pare","400 g",89,120,"\u{1F968}","Snacks"],
  ["Masala peanuts","200 g",59,80,"\u{1F95C}","Snacks"],["Chivda mix","500 g",129,170,"\u{1F37F}","Snacks"],
  ["Door toran","1 pc",149,220,"\u{1F380}","Decor"],["Wall hanging bells","1 pc",179,260,"\u{1F514}","Decor"],
  ["Candle stand","1 pc",229,320,"\u{1F56F}","Decor"],["Paper garland","3 m",69,99,"\u{1F38A}","Decor"],
  ["Festive wall stickers","1 sheet",99,150,"\u{1F387}","Decor"],["Table runner","1 pc",199,299,"\u{1F9F6}","Decor"],
  ["Masala chai","250 g",129,170,"\u2615","Tea & coffee"],["Green tea","25 bags",149,200,"\u{1F375}","Tea & coffee"],
  ["Instant coffee","100 g",199,260,"\u2615","Tea & coffee"],["Kesar milk mix","200 g",169,220,"\u{1F95B}","Tea & coffee"],
  ["Honey","500 g",249,330,"\u{1F36F}","Tea & coffee"],["Tea gift tin","1 tin",349,450,"\u{1FAD6}","Tea & coffee"],
  ["Marigold garland","2 pcs",79,110,"\u{1F33C}","Fresh flowers"],["Rose petals","100 g",59,80,"\u{1F339}","Fresh flowers"],
  ["Lotus flowers","4 pcs",99,140,"\u{1FAB7}","Fresh flowers"],["Jasmine gajra","4 pcs",49,70,"\u{1F338}","Fresh flowers"],
  ["Mango leaves","1 bunch",29,40,"\u{1F343}","Fresh flowers"],["Coconut","2 pcs",59,80,"\u{1F965}","Fresh flowers"]
);
const products = raw.map((r, i) => ({
  id: i, base: r[2], name: r[0], wt: r[1], price: r[2], mrp: r[3], img: r[4], cat: r[5], bogo: !!r[6],
  off: r[6] ? "BUY 1 GET 1" : Math.round((1 - r[2] / r[3]) * 100) + "% OFF"
}));

// Build the Trie once: every WORD of every product name goes in.
initStock(products);
FLASH_START.forEach(f => addFlash(products, f[0], f[1]));
refreshPrices(products);
buildVectors(products);

const trie = new Trie();
products.forEach(p => p.name.toLowerCase().split(" ").forEach(w => trie.insert(w, p.id)));

function searchProducts(text) {
  const words = text.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  let ids = trie.search(words[0]);
  for (let i = 1; i < words.length; i++) {          // multi-word: keep ids found for every word
    const more = trie.search(words[i]);
    ids = ids.filter(id => more.includes(id));
  }
  return ids.map(id => products[id]);
}

const cart = {};
let view = [];   // products currently shown

function showHome() {
  // sort by biggest discount, show top 12
  view = [...products].sort((a, b) => (1 - b.price / b.mrp) - (1 - a.price / a.mrp)).slice(0, 12);
  document.getElementById("gridTitle").textContent = "Festive deals"; mode(false);
  renderGrid();
}
function showCat(name) {
  view = products.filter(p => p.cat === name);
  document.getElementById("gridTitle").textContent = name; mode(true);
  renderGrid();
}
function runSearch() {
  const text = document.getElementById("q").value;
  hideSugg();
  if (!text.trim()) return showHome();
  view = searchProducts(text); mode(true);
  document.getElementById("gridTitle").textContent =
    view.length ? "Results for \u201C" + text.trim() + "\u201D" : "No results for \u201C" + text.trim() + "\u201D. Try diya, kaju or lights.";
  renderGrid();
}

function showSugg() {
  const text = document.getElementById("q").value;
  const box = document.getElementById("sugg");
  const found = searchProducts(text).slice(0, 6);
  if (!found.length) return hideSugg();
  box.innerHTML = found.map(p => `<div onclick="pick(${p.id})">${p.img} ${p.name}</div>`).join("");
  box.hidden = false;
}
function hideSugg() { document.getElementById("sugg").hidden = true; }
function pick(id) { document.getElementById("q").value = products[id].name; runSearch(); }

function renderCats() {
  document.getElementById("cats").innerHTML =
    categories.map(c => `<div class="cat" onclick="showCats('${c[1]}')"><span>${c[0]}</span>${c[1]}</div>`).join("");
}
function cardsHTML(list, why) {
  return list.map(p => {
    const q = cart[p.id] || 0;
    const action = q === 0
      ? (p.stock <= 0 ? `<button class="add" disabled>Sold out</button>` : `<button class="add" onclick="change(${p.id},1)">ADD</button>`)
      : `<div class="qty"><button onclick="change(${p.id},-1)">-</button>${q}<button onclick="change(${p.id},1)">+</button></div>`;
    return `<div class="card${p.id === pop ? ' pop' : ''}" style="--t:${tints[p.cat]}"><div class="badge">${p.off}</div><div class="img" onclick="viewItem(${p.id})">${p.img}</div>
      <div class="name" onclick="viewItem(${p.id})">${p.name}</div>${why && why[p.id] ? '<div class="why">' + why[p.id] + '</div>' : ''}<div class="wt">${p.wt} ${stockTag(p)}</div>
      <div class="row"><div class="price">\u20B9${p.price}<s>\u20B9${p.mrp}</s></div>${action}</div></div>`;
  }).join("");
}
function renderGrid() {
  document.getElementById("grid").innerHTML = cardsHTML(view);
  document.getElementById("cgrid").innerHTML = cardsHTML(catView);
  document.getElementById("flash").innerHTML = cardsHTML(flashList(products));
  const rec = recommend(products, cart, views, 6), why = {};
  rec.forEach(x => why[x.p.id] = x.why);
  const personal = products.some(p => cart[p.id] || views[p.id]);
  document.getElementById("fytitle").textContent = personal ? "\u2728 For You" : "\u2728 Trending this Diwali";
  document.getElementById("fysub").textContent = personal ? "Picked from your cart and what you tap" : "Add or tap items and this list learns your taste";
  document.getElementById("foryou").innerHTML = cardsHTML(rec.map(x => x.p), why);
}
const views = {};
function viewItem(id) { views[id] = (views[id] || 0) + 1; refresh(); }
let pop = -1;
function stockTag(p) {
  const left = p.stock - (cart[p.id] || 0);
  if (p.stock <= 0) return "";
  if (left <= 0) return '<b class="low">Max in cart</b>';
  return left <= 5 ? `<b class="low">Only ${left} left</b>` : p.stock <= 10 ? '<b class="hot">Selling fast</b>' : "";
}
function refresh() { renderGrid(); renderCart(); renderPanel(); }
function updateFlashTimer() {
  const top = flashHeap.peek(); if (!top) return;
  const s = Math.max(0, Math.ceil((top.endsAt - Date.now()) / 1000));
  document.getElementById("ftimer").textContent = "Next deal ends in " + String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}
function change(id, d) {
  const item = products[id];
  if (d > 0 && (cart[id] || 0) >= item.stock) { toast("Only " + item.stock + " available"); return; }
  cart[id] = Math.max(0, (cart[id] || 0) + d);
  pop = d > 0 ? id : -1;
  renderGrid(); pop = -1; renderCart(); renderPanel();
  if (d > 0) { const b = document.getElementById("cartbar"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
}
function renderCart() {
  let n = 0, total = 0;
  products.forEach(p => { const q = cart[p.id] || 0; n += q; total += lineTotal(p, q); });
  document.getElementById("cartbar").hidden = n === 0;
  document.getElementById("cartCount").textContent = n + (n === 1 ? " item" : " items");
  document.getElementById("cartTotal").textContent = "\u20B9" + total;
}
function tick() {
  const s = Math.floor((DIWALI - new Date()) / 1000), el = document.getElementById("timer");
  if (s <= 0) { el.textContent = "Happy Diwali!"; return; }
  el.textContent = `Sale ends in ${Math.floor(s / 86400)}d ${Math.floor(s % 86400 / 3600)}h ${Math.floor(s % 3600 / 60)}m ${s % 60}s`;
}

let coupon = "";
const rs = n => "\u20B9" + n;
function openCart() { document.getElementById("cartpanel").hidden = false; renderPanel(); }
function closeCart() { document.getElementById("cartpanel").hidden = true; }
function applyCoupon(code) {
  const v = (code || document.getElementById("code").value).trim().toUpperCase();
  document.getElementById("code").value = v; coupon = v; renderPanel();
}
function placeOrder() {
  if (!products.some(p => cart[p.id])) return;
  products.forEach(p => { p.stock = Math.max(0, p.stock - (cart[p.id] || 0)); cart[p.id] = 0; });
  refreshPrices(products); closeCart(); refresh();
  toast("Order placed! Stock updated. Delivery tracking comes in stage 6.");
}
function renderPanel() {
  if (document.getElementById("cartpanel").hidden) return;
  const items = products.filter(p => cart[p.id]);
  const b = calcBill(products, cart, coupon);
  const rec = recommend(products, cart, views, 4), why = {};
  rec.forEach(x => why[x.p.id] = x.why);
  document.getElementById("recbox").hidden = !items.length;
  document.getElementById("cartrec").innerHTML = cardsHTML(rec.map(x => x.p), why);
  document.getElementById("saved").textContent = b.saved > 0 ? "You are saving " + rs(b.saved) + " on this order" : "";
  document.getElementById("saved").hidden = b.saved <= 0;
  document.getElementById("cartitems").innerHTML = items.length ? items.map(p => {
    const q = cart[p.id], free = q - payableUnits(p, q);
    return `<div class="line"><div class="lemo">${p.img}</div>
      <div class="linfo"><div class="name">${p.name}</div><div class="wt">${p.wt}${free ? ' <b class="free">' + free + ' free</b>' : ''}</div></div>
      <div class="qty"><button onclick="change(${p.id},-1)">-</button>${q}<button onclick="change(${p.id},1)">+</button></div>
      <div class="lprice">${rs(lineTotal(p, q))}</div></div>`;
  }).join("") : '<div class="empty">Your cart is empty. Go back and add some Diwali goodies.</div>';
  const m = document.getElementById("couponmsg");
  m.textContent = b.couponMsg; m.className = b.couponOff > 0 ? "ok" : "bad";
  const row = (l, v, c) => `<div class="brow ${c || ""}"><span>${l}</span><span>${v}</span></div>`;
  document.getElementById("bill").innerHTML = items.length ?
    "<b>Bill details</b>" + row("Item total (MRP)", rs(b.mrpTotal)) +
    row("Product discount", "-" + rs(b.regular), "g") +
    (b.bogoSaved ? row("Buy 1 Get 1 savings", "-" + rs(b.bogoSaved), "g") : "") +
    (b.couponOff ? row("Coupon " + coupon, "-" + rs(b.couponOff), "g") : "") +
    row("Delivery fee", b.delivery ? rs(b.delivery) : "FREE") + row("Handling fee", rs(b.handling)) +
    row("To pay", rs(b.grand), "tot") : "";
  document.getElementById("payamt").innerHTML = items.length ? "<b>" + rs(b.grand) + "</b><br><small>TOTAL</small>" : "";
}

function mode(on) { const sc = document.querySelector(".screen"); sc.classList.toggle("results", on); sc.classList.remove("catmode"); document.getElementById("main").scrollTop = 0; }
function setTab(i) { document.querySelectorAll(".tabs div").forEach((d, j) => d.classList.toggle("on", j === i)); }
function goHome() {
  document.getElementById("q").value = ""; document.getElementById("clr").hidden = true;
  hideSugg(); closeCart(); showHome(); setTab(0);
}
function showAll() {
  view = products; document.getElementById("gridTitle").textContent = "All " + products.length + " products";
  closeCart(); mode(true); renderGrid(); setTab(1);
}
let catView = [], catName = "";
function showCats(name) {
  document.querySelector(".screen").classList.add("catmode");
  closeCart(); hideSugg(); setTab(1);
  pickCat(name || catName || categories[0][1]);
}
function pickCat(name) {
  catName = name; catView = products.filter(p => p.cat === name);
  document.getElementById("sidecol").innerHTML = categories.map(c =>
    `<div class="side${c[1] === name ? " on" : ""}" onclick="pickCat('${c[1]}')"><span>${c[0]}</span>${c[1]}</div>`).join("");
  document.getElementById("cattitle").textContent = name + " (" + catView.length + ")";
  document.querySelector(".cat-main").scrollTop = 0;
  renderGrid();
}
let tt;
function toast(m) {
  const t = document.getElementById("toast"); t.textContent = m; t.hidden = false;
  clearTimeout(tt); tt = setTimeout(() => t.hidden = true, 2500);
}
const q = document.getElementById("q");
q.addEventListener("input", () => { document.getElementById("clr").hidden = !q.value; showSugg(); });
q.addEventListener("keydown", e => { if (e.key === "Enter") runSearch(); });
renderCats(); showHome(); renderCart(); tick(); updateFlashTimer();
setInterval(() => { tick(); if (flashTick(products)) refresh(); updateFlashTimer(); }, 1000);
setInterval(() => { simulateDemand(products); refresh(); }, 12000);
