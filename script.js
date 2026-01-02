function generate() {
  const house = document.getElementById("house").value;
  const checkin = new Date(document.getElementById("checkin").value);
  const checkout = new Date(document.getElementById("checkout").value);
  const rate = Number(document.getElementById("rate").value);
  const discount = Number(document.getElementById("discount").value);
  const depositPercent = Number(document.getElementById("depositPercent").value);

  const nights = Math.round((checkout - checkin) / (1000 * 60 * 60 * 24));
  const finalRate = rate - discount;
  const total = finalRate * nights;
  const deposit = Math.round((depositPercent / 100) * total);

  const formatDate = d =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  const text = `
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
`;

  document.getElementById("output").value = text.trim();
}

function copyText() {
  const textarea = document.getElementById("output");
  textarea.select();
  document.execCommand("copy");
  alert("Quotation copied! Ready to send.");
}
