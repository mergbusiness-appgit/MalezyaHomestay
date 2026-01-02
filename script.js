/************* DATA *************/
const homestays = {
  "Çapa": { short:485, long:435, max:5, extra:false },
  "Fındıkzade": { short:440, long:390, max:4, extra:false },
  "Pazartekke": { short:460, long:410, max:5, extra:true },
  "Haseki": { short:535, long:485, max:6, extra:true },
  "Cibali": { short:860, long:790, max:12, extra:true },
  "Saray Kuning": { short:640, long:590, max:9, extra:true },
  "Saray Merah": { short:720, long:670, max:12, extra:true },
  "Saray Biru": { short:975, long:890, max:18, extra:true },
  "Balat": { short:430, long:380, max:6, extra:true },
  "Saray Studios": { short:215, long:190, max:2, extra:true },
  "Çarşamba Studios": { short:310, long:270, max:3, extra:true },
  "Beyazıt": { short:445, long:395, max:7, extra:true }
};

const roomstays = {
  "Koca Mustafapaşa": { nightly:90, weekly:500, twoWeeks:900, monthly:1500, max:2 },
  "Çapa (Private)": { nightly:140, weekly:650, twoWeeks:1100, monthly:1900, max:3, extra:60 },
  "Çapa (Sharing)": { nightly:75, weekly:425, twoWeeks:700, monthly:1100, perPax:true }
};

/************* INIT *************/
const homestaySelect = document.getElementById("homestay");
const roomstaySelect = document.getElementById("roomstay");

Object.keys(homestays).forEach(h => homestaySelect.add(new Option(h,h)));
homestaySelect.add(new Option("Others (Manual)","Others"));

Object.keys(roomstays).forEach(r => roomstaySelect.add(new Option(r,r)));

/************* HELPERS *************/
const nightsBetween = (a,b)=>Math.round((b-a)/(1000*60*60*24));
const fmt = d=>d.toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});

/************* SWITCH SERVICE TYPE *************/
function switchService(){
  const type = document.getElementById("serviceType").value;
  const homestaySec = document.getElementById("homestaySection");
  const roomstaySec = document.getElementById("roomstaySection");

  if(type==="homestay"){
    homestaySec.style.display = "block";
    roomstaySec.style.display = "none";
    if(homestaySelect.options.length === 0){
      Object.keys(homestays).forEach(h => homestaySelect.add(new Option(h,h)));
      homestaySelect.add(new Option("Others (Manual)","Others"));
    }
    updateHomestayRate();
  } else {
    homestaySec.style.display = "none";
    roomstaySec.style.display = "block";
    if(roomstaySelect.options.length === 0){
      Object.keys(roomstays).forEach(r => roomstaySelect.add(new Option(r,r)));
    }
  }
}

/************* HOMESTAY RATE UPDATE *************/
function updateHomestayRate(){
  const h = homestaySelect.value;
  if(h==="Others") return;

  const inD = new Date(checkin.value);
  const outD = new Date(checkout.value);
  const nights = nightsBetween(inD,outD);
  if(nights<=0) return;

  rate.value = nights>=5 ? homestays[h].long : homestays[h].short;
}

/************* GENERATE QUOTATION *************/
function generateQuotation(){
  const type = serviceType.value;
  let text="";

  if(type==="homestay"){
    const h = homestaySelect.value;
    const inD=new Date(checkin.value), outD=new Date(checkout.value);
    const nights=nightsBetween(inD,outD);
    const r=+rate.value, d=+discount.value, p=+pax.value;
    let extra=0;

    if(h!=="Others"){
      const s=homestays[h];
      if(p>s.max && s.extra) extra=(p-s.max)*35*nights;
    }

    const total=(r-d)*nights+extra;
    const dep=Math.round(total*depositPercent.value/100);

    text=`
🏡 Malezya Homestay+ | ${h}

PRICE QUOTE
━━━━━━━━━━━━━

🚪 Check-In
📅 ${fmt(inD)}
🕒 From 3:00 PM onwards

👋🏻 Check-Out
📅 ${fmt(outD)}
🕛 By 11:00 AM

━━━━━━━━━━━━━

🗓 Duration:
${nights} nights

💰 Rate Breakdown:
(RM${r} - RM${d}) × ${nights} nights
= RM${total.toLocaleString()}

🔒 Booking Deposit:
~${depositPercent.value}% = RM${dep.toLocaleString()}

━━━━━━━━━━━━━

💳 Payment Details
Bank: Maybank
Account No: 162263816091
Account Name: Ariff Imran Bin Kamarul Zaman

━━━━━━━━━━━━━

📝 Terms & Conditions
1. Reservation will only be confirmed once the booking deposit is received
2. The booking deposit is non-refundable
3. Full payment to be made upon check-in

👋🏻 We look forward to hosting you at Malezya Homestay, your home in Türkiye 🇹🇷
`;
  }

  if(type==="roomstay"){
    const r=roomstays[roomstay.value];
    let total=r[duration.value];
    if(r.perPax) total*=roomPax.value;
    if(r.extra && roomPax.value>r.max)
      total+=(roomPax.value-r.max)*r.extra;

    text=`
🛏️ Malezya Roomstay+ | ${roomstay.value}

🗓 Duration: ${duration.options[duration.selectedIndex].text}
👥 Pax: ${roomPax.value}

💰 Total: RM${total.toLocaleString()}

📝 Notes:
• Booking fee required
• Non-refundable
`;
  }

  output.value=text.trim();
}

/************* COPY TO CLIPBOARD *************/
function copyText(){
  output.select();
  document.execCommand("copy");
  alert("Copied!");
}
