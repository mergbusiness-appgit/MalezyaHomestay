const homestays = {
  "Çapa": { short: 485, long: 435 },
  "Fındıkzade": { short: 440, long: 390 },
  "Pazartekke": { short: 460, long: 410 },
  "Haseki": { short: 535, long: 485 },
  "Cibali": { short: 860, long: 790 },
  "Saray Kuning": { short: 640, long: 590 },
  "Saray Merah": { short: 720, long: 670 },
  "Saray Biru": { short: 975, long: 890 },
  "Balat": { short: 430, long: 380 },
  "Beyazıt": { short: 445, long: 395 },
  "Çarşamba Studios": { short: 310, long: 270 }
};

// Populate dropdown
const select = document.getElementById("house");
Object.keys(homestays).forEach(name => {
  const opt = document.createElement("option");
  opt.value = name;
  opt.textContent = name;
  select.appendChild(opt);
});

// Add Others at END
const other = document.createElement("option");
other.value = "Others";
other.textContent = "Others (Manual)";
select.appendChild(other);

function nightsBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function updateRate() {
  const house = select.value;
  const inDate = new Date(document.getElementById("checkin").value);
  const outDate = new Date(document.getElementById("checkout").value);

  if (!inDate || !outDate || house === "Others") return;

  const nights = nightsBetween(inDate, outDate);
  if (nights <= 0) return;

  const rate = nights >= 5 ? homestays[house].long : homestays[house].short;
  document.getElementById("rate").value = rate;
}

function generate() {
  const house = select.value;
  const checkin = new Date(document.getElementById("checkin").value);
  const checkout = new Date(document.getElementById("checkout").value);
  const rate = Number(document.getElementById("rate").value);
  const discount = Number(document.getElementById("discount").value);
  const depositPercent = Number(document.getElementById("depositPercent").value);

  const nights = nightsBetween(checkin, checkout);
  const finalRate = rate - discount;
  const total = finalRate * nights;
  const deposit = Math.round((depositPercent / 100) * total);

  const formatDate = d =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  document.getElementById("output").value = `
🏡 Malezya Homestay+ | ${house}

PRICE QUOTE
━━━━━━━━━━━━━

🚪 Check-In
📅 ${formatDate(checkin)}
🕒 From 3:00 PM onwards

👋🏻 Check-Out
📅 ${formatDate(checkout)}
🕛 By 11:00 AM

━━━━━━━━━━━━━

🗓 Duration:
${nights} nights

💰 Rate Breakdown:
(RM${rate} - RM${discount} Long Stay Discount) × ${nights} nights
= RM${total.toLocaleString()}

🔒 Booking Deposit:
~${depositPercent}% of total = RM${deposit.toLocaleString()}

━━━━━━━━━━━━━

💳 Payment Details
Bank: Maybank
Account No: 162263816091
Account Name: Ariff Imran Bin Kamarul Zaman

━━━━━━━━━━━━━

📝 Terms & Conditions
1.⁠ ⁠Reservation will only be confirmed once the booking deposit is received
2.⁠ ⁠The booking deposit is non-refundable
3.⁠ ⁠⁠Full payment to be made upon check-in

👋🏻 We look forward to hosting you at Malezya Homestay, your home in Türkiye 🇹🇷
`.trim();
}

function copyText() {
  const t = document.getElementById("output");
  t.select();
  document.execCommand("copy");
  alert("Quotation copied. Ready to send.");
}
