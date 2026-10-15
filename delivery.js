// DELIVERY TIME with DIJKSTRA'S SHORTEST-PATH ALGORITHM.
// The city is a GRAPH: junctions are nodes, roads are edges, and each edge weight is the travel time in minutes.
const MAP_NODES = {
  Store: { x: 30, y: 110, name: "Dark Store" }, MainRoad: { x: 95, y: 40, name: "Main Road" },
  ParkLane: { x: 95, y: 180, name: "Park Lane" }, MarketChowk: { x: 170, y: 25, name: "Market Chowk" },
  Flyover: { x: 170, y: 85, name: "Flyover" }, RingRoad: { x: 170, y: 135, name: "Ring Road" },
  TempleCircle: { x: 170, y: 195, name: "Temple Circle" }, SocietyGate: { x: 255, y: 110, name: "Society Gate" },
  Home: { x: 315, y: 110, name: "Your Home" }
};
// [from, to, minutes, busy?]  Busy roads (Diwali shopping rush) get slower at random for every order.
const MAP_EDGES = [
  ["Store", "MainRoad", 3, 0], ["Store", "ParkLane", 4, 0], ["MainRoad", "MarketChowk", 2, 1], ["MainRoad", "Flyover", 3, 0],
  ["ParkLane", "TempleCircle", 3, 0], ["ParkLane", "RingRoad", 4, 0], ["MarketChowk", "SocietyGate", 3, 1],
  ["MarketChowk", "Flyover", 2, 1], ["Flyover", "SocietyGate", 3, 0], ["Flyover", "RingRoad", 2, 0],
  ["RingRoad", "SocietyGate", 3, 0], ["TempleCircle", "SocietyGate", 4, 0], ["SocietyGate", "Home", 2, 0]
];
const SIM_SECONDS_PER_MIN = 2;   // demo speed: 1 "minute" of delivery takes 2 real seconds

const edgeTime = (m, busy, traffic) => Math.round(m * (busy ? traffic : 1) * 10) / 10;

function buildGraph(traffic) {
  const g = {}; for (const k in MAP_NODES) g[k] = [];
  MAP_EDGES.forEach(([a, b, m, busy]) => { const w = edgeTime(m, busy, traffic); g[a].push([b, w]); g[b].push([a, w]); });
  return g;
}

// Dijkstra: always explore the nearest unvisited junction next (a min-heap gives it in log n steps),
// and keep the best known distance to every junction.
function dijkstra(g, src, dst) {
  const dist = {}, prev = {};
  for (const k in g) dist[k] = Infinity;
  dist[src] = 0;
  const heap = new MinHeap("d");
  heap.push({ node: src, d: 0 });
  while (heap.size()) {
    const { node, d } = heap.pop();
    if (d > dist[node]) continue;                     // old, longer entry - skip
    if (node === dst) break;
    for (const [nb, w] of g[node]) {
      const nd = d + w;
      if (nd < dist[nb]) { dist[nb] = nd; prev[nb] = node; heap.push({ node: nb, d: nd }); }
    }
  }
  const path = [];
  for (let at = dst; at !== undefined; at = prev[at]) path.unshift(at);
  return { minutes: Math.round(dist[dst] * 10) / 10, path };
}

let order = null, trackTimer = null;
const pt = k => MAP_NODES[k];

function startOrder(items, paid, addr) {
  MAP_NODES.Home.name = "Your " + (addr ? addr.label : "Home");
  const traffic = 1.2 + Math.random();                // 1.2x to 2.2x slower on busy roads
  const g = buildGraph(traffic), route = dijkstra(g, "Store", "Home");
  const segs = route.path.slice(1).map((n, i) => ({ from: route.path[i], to: n, w: g[route.path[i]].find(e => e[0] === n)[1] }));
  const pack = 2 + Math.ceil(items / 4);              // packing time grows with the number of items
  order = { items, paid, pack, route, segs, traffic, total: pack + route.minutes, start: Date.now() };
  renderMap();
  document.getElementById("routetxt").textContent = (addr ? "Delivering to: " + addrText(addr) + ". " : "") + "Fastest route (Dijkstra): " + route.path.map(k => pt(k).name).join(" > ") +
    " = " + route.minutes + " min. Dashed pink roads are slowed by Diwali rush.";
  document.getElementById("trackpanel").hidden = false;
  clearInterval(trackTimer); trackTimer = setInterval(trackTick, 250); trackTick();
}
function closeTrack() { document.getElementById("trackpanel").hidden = true; }

function renderMap() {
  const o = order, hot = new Set();
  o.route.path.forEach((n, i) => { if (i) hot.add([o.route.path[i - 1], n].sort().join("|")); });
  let s = '<svg viewBox="0 0 340 220">';
  MAP_EDGES.forEach(([a, b, m, busy]) => {
    const A = pt(a), B = pt(b), on = hot.has([a, b].sort().join("|"));
    s += `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="${on ? "#ffb627" : busy ? "#ff4d8d" : "#43276f"}" stroke-width="${on ? 4 : 2}"${busy && !on ? ' stroke-dasharray="4 3"' : ""}/>`;
    s += `<text x="${(A.x + B.x) / 2}" y="${(A.y + B.y) / 2 - 3}" font-size="8" fill="#b7a2d6" text-anchor="middle">${edgeTime(m, busy, o.traffic)}</text>`;
  });
  for (const k in MAP_NODES) {
    const n = pt(k);
    s += `<circle cx="${n.x}" cy="${n.y}" r="5" fill="#2b1650" stroke="#ffb627"/><text x="${n.x}" y="${n.y + 16}" font-size="8" fill="#fff4e2" text-anchor="middle">${n.name}</text>`;
  }
  s += '<text x="30" y="96" font-size="16" text-anchor="middle">&#127978;</text><text x="315" y="96" font-size="16" text-anchor="middle">&#127968;</text>' +
       '<text id="rider" x="30" y="108" font-size="18" text-anchor="middle">' + E("\u{1F6F5}", "\u{1F69A}") + '</text></svg>';
  document.getElementById("map").innerHTML = s;
}

function riderXY(o, t) {
  let p = Math.min(1, Math.max(0, (t - o.pack) / o.route.minutes)) * o.route.minutes;
  for (const s of o.segs) {
    if (p <= s.w) { const A = pt(s.from), B = pt(s.to), f = p / s.w; return [A.x + (B.x - A.x) * f, A.y + (B.y - A.y) * f]; }
    p -= s.w;
  }
  const H = pt("Home"); return [H.x, H.y];
}

function trackTick() {
  if (!order) return;
  const o = order, t = (Date.now() - o.start) / (SIM_SECONDS_PER_MIN * 1000);
  const stage = t < o.pack ? 0 : t < o.total ? 1 : 2, left = Math.max(1, Math.ceil(o.total - t));
  document.getElementById("eta2").textContent = stage === 2 ? "Delivered. Happy Diwali!" : "Arriving in " + left + " min";
  document.getElementById("osum").textContent = o.items + (o.items === 1 ? " item" : " items") + " \u00B7 \u20B9" + o.paid +
    " \u00B7 estimated " + Math.round(o.total) + " min (packing " + o.pack + " + riding " + o.route.minutes + ")";
  document.getElementById("steps").innerHTML = ["Packing your order", "Out for delivery", "Delivered"].map((l, i) =>
    `<div class="step ${i < stage || stage === 2 ? "done" : i === stage ? "now" : ""}">${l}</div>`).join("");
  const rider = document.getElementById("rider");
  if (rider) { const xy = riderXY(o, t); rider.setAttribute("x", xy[0]); rider.setAttribute("y", xy[1] + 4); }
  if (stage === 2) clearInterval(trackTimer);
}
