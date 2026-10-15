// LOGIN, ADDRESSES and ACCOUNT. Everything is saved in THIS phone's browser (localStorage), so every phone
// has its own accounts and no server is needed. Demo only: there is no real password or OTP check.
let profile = null, addrLabel = "Home";
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const addrText = a => [a.line1, a.area, a.landmark, "PIN " + a.pin].filter(Boolean).join(", ");
const db = () => { try { return JSON.parse(localStorage.getItem("dd_accounts") || "{}"); } catch (e) { return {}; } };
function saveProfile() {
  try { const d = db(); d[profile.phone] = profile; localStorage.setItem("dd_accounts", JSON.stringify(d)); localStorage.setItem("dd_current", profile.phone); } catch (e) {}
}
function restore() { try { const d = db(), p = localStorage.getItem("dd_current"); if (p && d[p]) profile = d[p]; } catch (e) {} setGreet(); }
function ctx() { return { firstOrder: !profile || profile.orders.length === 0 }; }
function setGreet() {
  document.getElementById("greet").textContent = profile ? "Hi, " + profile.name.split(" ")[0] + " - you choose the address at checkout" : "Welcome";
}

function doLogin() {
  const name = document.getElementById("lname").value.trim(), phone = document.getElementById("lphone").value.trim(), err = document.getElementById("lerr");
  if (name.length < 2) { err.textContent = "Please enter your name"; return; }
  if (!/^[6-9]\d{9}$/.test(phone)) { err.textContent = "Enter a valid 10-digit mobile number"; return; }
  err.textContent = "";
  profile = db()[phone] || { name, phone, addresses: [], orders: [] };   // same number = same account again
  profile.name = name; saveProfile(); setGreet();
  document.getElementById("login").hidden = true;
  goHome(); toast("Welcome, " + name.split(" ")[0] + "!");
}
function logout() {
  profile = null; try { localStorage.removeItem("dd_current"); } catch (e) {}
  closeAccount(); closeCart(); closeTrack(); closeAddress();
  products.forEach(p => cart[p.id] = 0); coupon = ""; refresh(); setGreet();
  document.getElementById("login").hidden = false;
}

function openAddress() {
  if (!products.some(p => cart[p.id])) return;
  const s = document.getElementById("saved-addr");
  s.innerHTML = profile && profile.addresses.length ? "<b>Saved addresses</b>" + profile.addresses.map((a, i) =>
    `<div class="saddr" onclick="useAddr(${i})"><b>${esc(a.label)}</b><div class="wt">${esc(addrText(a))}</div></div>`).join("") : "<b>Saved addresses</b><div class='wt'>None yet. Add one below.</div>";
  document.getElementById("addrpanel").hidden = false;
}
function closeAddress() { document.getElementById("addrpanel").hidden = true; }
function pickLabel(l) { addrLabel = l; document.querySelectorAll("#alabels span").forEach(s => s.classList.toggle("on", s.textContent === l)); }
function useAddr(i) { closeAddress(); placeOrder(profile.addresses[i]); }
function saveAddr() {
  const g = id => document.getElementById(id).value.trim(), e = document.getElementById("aerr");
  const a = { label: addrLabel, line1: g("aline"), area: g("aarea"), landmark: g("aland"), pin: g("apin") };
  if (a.line1.length < 3) { e.textContent = "Enter your flat or house number"; return; }
  if (a.area.length < 3) { e.textContent = "Enter your area or street"; return; }
  if (!/^\d{6}$/.test(a.pin)) { e.textContent = "Enter a valid 6-digit pincode"; return; }
  e.textContent = "";
  profile.addresses = [a].concat(profile.addresses.filter(x => addrText(x) !== addrText(a))).slice(0, 4);
  saveProfile(); ["aline", "aarea", "aland", "apin"].forEach(id => document.getElementById(id).value = "");
  closeAddress(); placeOrder(a);
}

function openAccount() { if (!profile) return; renderAccount(); document.getElementById("accpanel").hidden = false; }
function closeAccount() { document.getElementById("accpanel").hidden = true; }
function renderAccount() {
  const saved = profile.orders.reduce((s, o) => s + o.saved, 0);
  const when = t => new Date(t).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  document.getElementById("accbody").innerHTML =
    `<div class="box acc"><div class="avatar">${esc(profile.name[0].toUpperCase())}</div><div class="aname">${esc(profile.name)}</div>
      <div class="wt">+91 ${esc(profile.phone)}</div>
      <div class="stats"><div><b>${profile.orders.length}</b><br>orders</div><div><b>\u20B9${saved}</b><br>saved</div><div><b>${profile.addresses.length}</b><br>addresses</div></div></div>` +
    (profile.orders.length ? "" : `<div class="box"><b>Offer for you</b><div class="wt">FIRSTDASH: \u20B975 off your first order (\u20B9299+). Apply it in the cart.</div></div>`) +
    `<div class="box"><b>Saved addresses</b>` + (profile.addresses.length ? profile.addresses.map(a =>
      `<div class="saddr"><b>${esc(a.label)}</b><div class="wt">${esc(addrText(a))}</div></div>`).join("") : "<div class='wt'>No addresses yet. You add one when you place an order.</div>") + `</div>` +
    `<div class="box"><b>My orders</b>` + (profile.orders.length ? profile.orders.slice(0, 5).map((o, i) =>
      `<div class="saddr"><b>Order #${profile.orders.length - i}</b> \u00B7 \u20B9${o.paid}<div class="wt">${o.items} items \u00B7 ${when(o.time)}<br>${esc(o.addr)}</div></div>`).join("") : "<div class='wt'>No orders yet.</div>") + `</div>`;
}
