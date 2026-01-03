document.addEventListener("DOMContentLoaded", () => {

  /**************** DATA ****************/
  window.homestays = {
    "Çapa": { short:485, long:435, max:5 },
    "Fındıkzade": { short:440, long:390, max:4 },
    "Pazartekke": { short:460, long:410, max:5 },
    "Haseki": { short:535, long:485, max:6 },
    "Cibali": { short:860, long:790, max:12 },
    "Saray Kuning": { short:640, long:590, max:9 },
    "Saray Merah": { short:720, long:670, max:12 },
    "Saray Biru": { short:975, long:890, max:18 },
    "Balat": { short:430, long:380, max:6 },
    "Saray Studios": { short:215, long:190, max:2 },
    "Çarşamba Studios": { short:310, long:270, max:3 },
    "Beyazıt": { short:445, long:395, max:7 }
  };

  window.roomstays = {
    "Koca Mustafapaşa": {
      nightly:90, weekly:500, twoWeeks:900, monthly:1500, max:2
    },
    "Çapa (Private)": {
      nightly:140, weekly:650, twoWeeks:1100, monthly:1900,
      max:2, extra:60
    },
    "Çapa (Sharing)": {
      nightly:75, weekly:425, twoWeeks:700, monthly:1100,
      perPax:true
    }
  };

  /**************** ELEMENTS ****************/
  const serviceType = document.getElementById("serviceType");
  const homestaySelect = document.getElementById("homestay");
  const roomstaySelect = document.getElementById("roomstay");

  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");
  const pax = document.getElementById("pax");
  const rate = document.getElementById("rate");
  const discount = document.getElementById("discount");
  const depositPercent = document.getElementById("depositPercent");

  const roomPax = document.getElementById("roomPax");
  const duration = document.getElementById("duration");

  const output = document.getElementById("output");
  const extraPaxInfo = document.getElementById("extraPaxInfo");

  /**************** INIT ****************/
  function loadHomestays(){
    homestaySelect.innerHTML = "";
    Object.keys(homestays).forEach(h =>
      homestaySelect.appendChild(new Option(h,h))
    );
    homestaySelect.appendChild(new Option("Others (Manual)","Others"));
  }

  function loadRoomstays(){
    roomstaySelect.innerHTML = "";
    Object.keys(roomstays).forEach(r =>
      roomstaySelect.appendChild(new Option(r,r))
    );
  }

  loadHomestays();
  loadRoomstays();

  /**************** HELPERS ****************/
  const nightsBetween = (a,b)=>
    Math.round((b-a)/(1000*60*60*24));

  const fmt = d =>
    d.toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});

  /**************** SWITCH SERVICE ****************/
  window.switchService = function(){
    const type = serviceType.value;
    document.getElementById("homestaySection").style.display =
      type === "homestay" ? "block" : "none";
    document.getElementById("roomstaySection").style.display =
      type === "roomstay" ? "block" : "none";
  };

  /**************** EXTRA PAX INFO (HOMESTAY) ****************/
  window.updateExtraPaxInfo = function(){
    const h = homestaySelect.value;
    const p = +pax.value;

    if(!homestays[h] || h==="Çapa" || h==="Fındıkzade"){
      extraPaxInfo.style.display = "none";
      return;
    }

    const max = homestays[h].max;
    if(p > max){
      extraPaxInfo.style.display = "block";
      extraPaxInfo.innerText =
        `⚠️ ${p-max} additional pax × RM35 / night will be charged`;
    } else {
      extraPaxInfo.style.display = "none";
    }
  };

  /**************** AUTO RATE ****************/
  window.updateHomestayRate = function(){
    const h = homestaySelect.value;
    if(!homestays[h]) return;

    const inD = new Date(checkin.value);
    const outD = new Date(checkout.value);
    const nights = nightsBetween(inD,outD);
    if(nights<=0) return;

    rate.value = nights>=5 ? homestays[h].long : homestays[h].short;
    updateExtraPaxInfo();
  };

  /**************** GENERATE QUOTATION ****************/
  window.generateQuotation = function(){
    let text = "";

    /************ HOMESTAY ************/
    if(serviceType.value === "homestay"){
      const h = homestaySelect.value;
      const inD = new Date(checkin.value);
      const outD = new Date(checkout.value);
      const nights = nightsBetween(inD,outD);
      const r = +rate.value;
      const d = +discount.value;
      const p = +pax.value;

      let extra = 0;
      let extraText = "";

      if(h!=="Çapa" && h!=="Fındıkzade" && homestays[h]){
        const max = homestays[h].max;
        if(p > max){
          extra = (p-max) * 35 * nights;
          extraText = `
➕ Extra Pax Charge:
${p-max} pax × RM35 × ${nights} nights
= RM${extra.toLocaleString()}
`;
        }
      }

      const subtotal = (r-d)*nights;
      const total = subtotal + extra;
      const deposit = Math.round(total * depositPercent.value / 100);

      text = `
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
= RM${subtotal.toLocaleString()}

${extraText}
💳 Total Amount:
RM${total.toLocaleString()}

🔒 Booking Deposit:
~${depositPercent.value}% = RM${deposit.toLocaleString()}

━━━━━━━━━━━━━

💳 Payment Details
Bank: Maybank
Account No: 162263816091
Account Name: Ariff Imran Bin Kamarul Zaman

━━━━━━━━━━━━━

📝 Terms & Conditions
1. Reservation confirmed once deposit is received
2. Deposit is non-refundable
3. Full payment upon check-in
4. RM35/pax/night applies if pax exceeds max
   (Except Çapa & Fındıkzade)

👋🏻 We look forward to hosting you at Malezya Homestay, your home in Türkiye 🇹🇷
`;
    }

    /************ ROOMSTAY ************/
    if(serviceType.value === "roomstay"){
      const r = roomstays[roomstaySelect.value];
      const paxCount = +roomPax.value;
      const dur = duration.value;

      let base = r[dur];
      let extra = 0;
      let extraText = "";

      if(r.perPax){
        base = base * paxCount;
      }

      if(r.extra && paxCount > r.max){
        let nights = dur==="weekly"?7:dur==="twoWeeks"?14:dur==="monthly"?30:1;
        extra = (paxCount-r.max) * r.extra * nights;
        extraText = `
➕ Extra Pax Charge:
${paxCount-r.max} pax × RM${r.extra} × ${nights} nights
= RM${extra.toLocaleString()}
`;
      }

      const total = base + extra;

      text = `
🛏️ Malezya Roomstay+ | ${roomstaySelect.value}

🗓 Duration: ${duration.options[duration.selectedIndex].text}
👥 Pax: ${paxCount}

💰 Rate Breakdown:
RM${base.toLocaleString()}
${extraText}
💳 Total Amount:
RM${total.toLocaleString()}

📝 Notes:
• Booking fee required
• Booking fee is non-refundable
`;
    }

    output.value = text.trim();
  };

  /**************** COPY ****************/
  window.copyText = function(){
    output.select();
    document.execCommand("copy");
    alert("Copied!");
  };

});
