// Clean Air Walnut — commute calculator + pledge counter (stored on this device only).

function fmt(n) { return n.toLocaleString("en-US", { maximumFractionDigits: 1 }); }

document.getElementById("calcBtn").addEventListener("click", function () {
  var miles = parseFloat(document.getElementById("miles").value) || 0;
  var perMile = parseFloat(document.getElementById("mode").value);
  var days = parseFloat(document.getElementById("days").value) || 0;
  var weeklyKg = miles * perMile * days;
  var yearlyKg = weeklyKg * 52;
  var out = document.getElementById("calcOut");
  if (perMile === 0) {
    out.textContent = "Zero tailpipe CO2 — that's the clear-air special. Keep it up!";
  } else {
    out.textContent = "Your commute: about " + fmt(weeklyKg) + " kg of CO2 a week — roughly " +
      fmt(yearlyKg) + " kg a year. Switch modes or share the ride and watch it drop.";
  }
});

function loadPledges() {
  try { return JSON.parse(localStorage.getItem("caw_pledges") || "[]"); }
  catch (e) { return []; }
}
function renderPledgeCount() {
  document.getElementById("pledgeCount").textContent = loadPledges().length;
}
renderPledgeCount();

document.getElementById("pledgeBtn").addEventListener("click", function () {
  var name = document.getElementById("pledgeName").value.trim();
  var pledges = loadPledges();
  pledges.push({ name: name, when: new Date().toISOString() });
  try { localStorage.setItem("caw_pledges", JSON.stringify(pledges)); } catch (e) {}
  renderPledgeCount();
  document.getElementById("pledgeMsg").textContent =
    "You're in" + (name ? ", " + name : "") + "! One week: share a ride, cut one energy habit, " +
    "one meatless meal. Track it in AWorld and tell us how it went at @CleanAirWalnut.";
  document.getElementById("pledgeName").value = "";
});
