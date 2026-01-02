/***********************
 * DATA CONFIGURATION
 ***********************/
const homestays = {
  "Çapa": { short: 485, long: 435, max: 5, extraAllowed: false },
  "Fındıkzade": { short: 440, long: 390, max: 4, extraAllowed: false },
  "Pazartekke": { short: 460, long: 410, max: 5, extraAllowed: true },
  "Haseki": { short: 535, long: 485, max: 6, extraAllowed: true },
  "Cibali": { short: 860, long: 790, max: 12, extraAllowed: true },
  "Saray Kuning": { short: 640, long: 590, max: 9, extraAllowed: true },
  "Saray Merah": { short: 720, long: 670, max: 12, extraAllowed: true },
  "Saray Biru": { short: 975, long: 890, max: 18, extraAllowed: true },
  "Balat": { short: 430, long: 380, max: 6, extraAllowed: true },
  "Beyazıt": { short: 445, long: 395, max: 7, extraAllowed: true },
  "Çarşamba Studios": { short: 310, long: 270, max: 3, extraAllowed: true }
};

/***********************
 * INITIAL SETUP
 ***********************/
const houseSelect = document.getElementById("house");

// Populate dropdown
Object.keys(homestays).forEach(name => {
  const opt = document.createElement("option");
  opt.value = name;
  opt.textContent = name;
  houseSelect.appendChild(opt);
});

// Add "Others (Manual)" at END
const otherOpt = document.createElement("option");
otherOpt.value = "Others";
otherOpt.textContent = "Others (Manual)";
houseSelect.appendChild(otherOpt);

/***********************
 * UTILITIES
 ***********************/
function getNights(checkin, checkout) {
  return Math.round((checkout - checkin) / (1000 * 60 * 60 * 24));
}

function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

/***********************
 * AUTO RATE UPDATE
 ***********************/
function updateRate() {
  const house = houseSelect.value;
  const checkinVal = document.getElementById("checkin").value;
  const checkoutVal = document.getElementById("checkout").value;

  if (!checkinVal || !checkoutVal) return;
  if (house === "Others") return;

  const checkin = new Date(checkinVal);
  const checkout = new Date(checkoutVal);
  const nights = getNights(checkin, checkout);

  if (nights <= 0) return;

  const rate =
    nights >= 5 ? homestays[house].long : homestays[house].short;

  document.getElementById("rate").value = rate;
}

/***********************
 * GENERATE QUOTATION
 ***********************/
function generate() {
  const house = houseSelect.value;
  const checkin = new Date(document.getElementById("checkin").value);
  const checkout = new Date(document.getElementById("checkout").value);
  const rate = Number(document.getElementById("rate").value);
  const discount = Number(document.getElementById("discount").value);
  const pax = Number(document.getElementById("pax").value);
  const depositPercent = Number(document.getElementById("depositPercent").value);

  const nights = getNights(checkin, checkout);
  if (nights <= 0) {
    alert("Invalid check-in / check-out date");
    return;
  }

  /***********************
   * EXTRA PAX LOGIC
   ***********************/
  let extraCharge = 0;
  let extraText = "";

  if (house !== "Others") {
    const stay = homestays[house];
    if (pax > stay.max && stay.extraAllowed) {
      const extraPax = pax - stay.max;
      extraCharge = extraPax * 35 * nights;
      extraText = `
👥 Additional Pax Charge:
RM35 × ${extraPax} pax × ${nights} nights
= RM${extraCharge.toLocaleString()}
`;
    }
  }

  /***********************
   * TOTAL CALCULATION
   ***********************/
  const finalRate = rate - discount;
  const baseTotal = finalRate * nights;
  const total = baseTotal + extraCharge;
  const deposit = Math.round((depositPercent / 100) * total);

  /***********************
   * OUTPUT TEXT
   ***********************/
  const quotation = `
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
= RM${baseTotal.toLocaleString()}
${extraText}
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

  document.getElementById("output").value = quotation;
}

/***********************
 * COPY FUNCTION
 ***********************/
function copyText() {
  const textarea = document.getElementById("output");
  textarea.select();
  document.execCommand("copy");
  alert("Quotation copied. Ready to send via WhatsApp.");
}
