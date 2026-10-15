// STOCK, FLASH SALES and DEMAND-BASED PRICING live in this file.

// MIN-HEAP (priority queue): the deal that ends SOONEST is always at the top.
// push/pop take about log2(n) steps, so even thousands of deals stay fast.
class MinHeap {
  constructor(key = "endsAt") { this.a = []; this.k = key; }
  size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) {
    const a = this.a; a.push(x);
    let i = a.length - 1;
    while (i > 0) {                                   // bubble up
      const p = (i - 1) >> 1;
      if (a[p][this.k] <= a[i][this.k]) break;
      [a[p], a[i]] = [a[i], a[p]]; i = p;
    }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) {
      a[0] = last; let i = 0;
      for (;;) {                                      // bubble down
        const l = 2 * i + 1, r = l + 1; let m = i;
        if (l < a.length && a[l][this.k] < a[m][this.k]) m = l;
        if (r < a.length && a[r][this.k] < a[m][this.k]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]]; i = m;
      }
    }
    return top;
  }
}

const flashHeap = new MinHeap();
const flashPct = {};                                  // productId -> % off while its deal is live
const FLASH_START = [[120, 30], [240, 25], [360, 20]]; // [seconds the deal lasts, % off] - change to taste

function initStock(products) { products.forEach(p => p.stock = 5 + (p.id * 7) % 26); }  // 5 to 30 units

function addFlash(products, secs, pct) {
  const pool = products.filter(p => !p.bogo && p.stock > 8 && !(p.id in flashPct));
  if (!pool.length) return;
  const p = pool[Math.floor(Math.random() * pool.length)];
  flashHeap.push({ id: p.id, endsAt: Date.now() + secs * 1000 });
  flashPct[p.id] = pct;
}

// DEMAND-BASED PRICING: the fewer units left, the higher the price (capped at MRP).
function surge(p) { return p.stock <= 5 ? 0.05 : p.stock <= 10 ? 0.02 : 0; }

function refreshPrices(products) {
  products.forEach(p => {
    const f = flashPct[p.id] || 0;
    p.price = Math.min(p.mrp, Math.round(p.base * (1 + surge(p)) * (1 - f / 100)));
    p.off = f ? "FLASH " + f + "% OFF" : p.bogo ? "BUY 1 GET 1" : Math.round((1 - p.price / p.mrp) * 100) + "% OFF";
  });
}

// Called every second: pop expired deals off the heap and start a replacement.
function flashTick(products) {
  let changed = false;
  while (flashHeap.size() && flashHeap.peek().endsAt <= Date.now()) {
    delete flashPct[flashHeap.pop().id];
    addFlash(products, 360, 25);
    changed = true;
  }
  if (changed) refreshPrices(products);
  return changed;
}

function flashList(products) { return [...flashHeap.a].sort((x, y) => x.endsAt - y.endsAt).map(d => products[d.id]); }

// Pretend other shoppers are buying: one random item loses a unit, so prices react live.
function simulateDemand(products) {
  const pool = products.filter(p => p.stock > 3);
  if (pool.length) pool[Math.floor(Math.random() * pool.length)].stock--;
  refreshPrices(products);
}
