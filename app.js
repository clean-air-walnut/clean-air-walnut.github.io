// Clean Air Walnut, commute calculator + pledge counter (stored on this device only).

function fmt(n) { return n.toLocaleString("en-US", { maximumFractionDigits: 1 }); }

document.getElementById("calcBtn").addEventListener("click", function () {
  var miles = parseFloat(document.getElementById("miles").value) || 0;
  var perMile = parseFloat(document.getElementById("mode").value);
  var days = parseFloat(document.getElementById("days").value) || 0;
  var weeklyKg = miles * perMile * days;
  var yearlyKg = weeklyKg * 52;
  var out = document.getElementById("calcOut");
  if (perMile === 0) {
    out.textContent = "Zero tailpipe CO2, that's the clear-air special. Keep it up!";
  } else {
    out.textContent = "Your commute: about " + fmt(weeklyKg) + " kg of CO2 a week, roughly " +
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

// Weekly campus poll (demo tally stored on this device).
var POLL_OPTIONS = [
  "A bus pass that just works, free transit for students",
  "More carpool matching, I'd share the ride",
  "Safer bike routes + secure bike parking",
  "EV / carpool priority parking near my classes",
  "Later & more frequent buses on the routes I use"
];
function loadPoll() {
  try { return JSON.parse(localStorage.getItem("caw_poll") || "null") || POLL_OPTIONS.map(function () { return 0; }); }
  catch (e) { return POLL_OPTIONS.map(function () { return 0; }); }
}
function renderPoll() {
  var votes = loadPoll();
  var total = votes.reduce(function (a, b) { return a + b; }, 0);
  var mine = -1;
  try { mine = parseInt(localStorage.getItem("caw_poll_mine") || "-1", 10); } catch (e) {}
  var wrap = document.getElementById("pollOptions");
  wrap.innerHTML = "";
  POLL_OPTIONS.forEach(function (label, i) {
    var pct = total ? Math.round((votes[i] / total) * 100) : 0;
    var row = document.createElement("div");
    row.className = "poll-row";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "poll-btn" + (mine === i ? " mine" : "");
    btn.textContent = label;
    btn.addEventListener("click", function () { vote(i); });
    var bar = document.createElement("div");
    bar.className = "poll-bar";
    bar.innerHTML = "<span style=\"width:" + pct + "%\"></span>";
    var meta = document.createElement("div");
    meta.className = "poll-meta";
    meta.textContent = votes[i] + " vote" + (votes[i] === 1 ? "" : "s") + " · " + pct + "%" + (mine === i ? " · your pick" : "");
    row.appendChild(btn); row.appendChild(bar); row.appendChild(meta);
    wrap.appendChild(row);
  });
  document.getElementById("pollTotal").textContent =
    total ? total + " vote" + (total === 1 ? "" : "s") + " so far, tap an option to move the tally." : "No votes yet, be the first.";
}
function vote(i) {
  var votes = loadPoll();
  var mine = -1;
  try { mine = parseInt(localStorage.getItem("caw_poll_mine") || "-1", 10); } catch (e) {}
  if (mine >= 0 && votes[mine] > 0) votes[mine]--;
  votes[i]++;
  try {
    localStorage.setItem("caw_poll", JSON.stringify(votes));
    localStorage.setItem("caw_poll_mine", String(i));
  } catch (e) {}
  renderPoll();
}
renderPoll();
