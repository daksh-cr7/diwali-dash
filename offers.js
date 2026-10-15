// OFFERS ENGINE: all the price maths lives here, away from the screen code.
const COUPONS = {
  DIWALI10:   { type: "pct",  value: 10, max: 150, min: 299, desc: "10% off up to \u20B9150 on \u20B9299+" },
  FESTIVE50:  { type: "flat", value: 50, min: 499, desc: "Flat \u20B950 off on \u20B9499+" },
  LAKSHMI100: { type: "flat", value: 100, min: 799, desc: "Flat \u20B9100 off on \u20B9799+" },
  DIWALI20:   { type: "pct",  value: 20, max: 300, min: 999, desc: "20% off up to \u20B9300 on \u20B9999+" },
  SWEET15:    { type: "pct",  value: 15, max: 120, min: 199, cats: ["Sweets", "Chocolates", "Snacks"], desc: "15% off sweets, chocolates and snacks (max \u20B9120)" },
  CLEAN12:    { type: "pct",  value: 12, max: 100, min: 199, cats: ["Cleaning"], desc: "12% off home cleaning items (max \u20B9100)" },
  FREEDEL:    { type: "freedel", min: 199, desc: "Free delivery on \u20B9199+" },
  FIRSTDASH:  { type: "flat", value: 75, min: 299, once: true, desc: "\u20B975 off your first order (\u20B9299+)" }
};
const DELIVERY_FEE = 25, FREE_DELIVERY_ABOVE = 499, HANDLING_FEE = 4;
const BONUS_ABOVE = 1499, BONUS_PCT = 5;     // automatic Diwali bonus: no code needed

// Buy 1 Get 1: you pay for half the units, rounded up (3 items -> pay for 2).
function payableUnits(p, q) { return p.bogo ? Math.ceil(q / 2) : q; }
function lineTotal(p, q) { return payableUnits(p, q) * p.price; }

function calcBill(products, cart, code, ctx) {
  ctx = ctx || {};
  let mrpTotal = 0, regular = 0, itemsTotal = 0, bogoSaved = 0;
  products.forEach(p => {
    const q = cart[p.id] || 0;
    if (!q) return;
    mrpTotal += q * p.mrp;
    regular += q * (p.mrp - p.price);
    itemsTotal += lineTotal(p, q);
    bogoSaved += (q - payableUnits(p, q)) * p.price;
  });

  let couponOff = 0, couponMsg = "", couponOk = false, freeDel = false;
  if (code) {
    const c = COUPONS[code];
    if (!c) couponMsg = "This code is not valid";
    else if (c.once && !ctx.firstOrder) couponMsg = code + " is only for your first order";
    else if (itemsTotal < c.min) couponMsg = "Add items worth \u20B9" + (c.min - itemsTotal) + " more to use " + code;
    else {
      // category coupons only discount the items of those categories
      const base = c.cats ? products.reduce((s, p) => s + (c.cats.includes(p.cat) ? lineTotal(p, cart[p.id] || 0) : 0), 0) : itemsTotal;
      if (!base) couponMsg = "Add " + c.cats.join(" / ").toLowerCase() + " items to use " + code;
      else {
        couponOk = true; couponMsg = code + " applied";
        freeDel = c.type === "freedel";
        couponOff = c.type === "pct" ? Math.min(Math.round(base * c.value / 100), c.max) : c.type === "flat" ? Math.min(c.value, itemsTotal) : 0;
      }
    }
  }
  const bonus = itemsTotal >= BONUS_ABOVE ? Math.round(itemsTotal * BONUS_PCT / 100) : 0;
  const after = itemsTotal - couponOff - bonus;
  const normalFee = itemsTotal === 0 ? 0 : (after >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE);
  const delivery = freeDel ? 0 : normalFee;
  const handling = itemsTotal === 0 ? 0 : HANDLING_FEE;
  return { mrpTotal, regular, bogoSaved, itemsTotal, couponOff, couponMsg, couponOk, bonus, delivery, handling,
           grand: after + delivery + handling, saved: regular + bogoSaved + couponOff + bonus + (normalFee - delivery) };
}
