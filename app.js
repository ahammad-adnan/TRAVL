// ═══════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXu3-G7IMt5Q2ilncabO5YfBW9glp87_A",
  authDomain: "travel-18ebe.firebaseapp.com",
  projectId: "travel-18ebe",
  storageBucket: "travel-18ebe.firebasestorage.app",
  messagingSenderId: "32893201937",
  appId: "1:32893201937:web:f6462df60de16db0ea0bb0",
  measurementId: "G-32D15SQHBX"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const esc = str => {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag]));
};

// ═══════════════════════════════════════════════
//  CURRENCY DETECTION
// ═══════════════════════════════════════════════
const COUNTRY_CURRENCY = {
  // Asia
  'japan':'JPY','jp':'JPY',
  'india':'INR','in':'INR',
  'china':'CNY','cn':'CNY',
  'thailand':'THB','th':'THB',
  'indonesia':'IDR','id':'IDR',
  'malaysia':'MYR','my':'MYR',
  'singapore':'SGD','sg':'SGD',
  'south korea':'KRW','korea':'KRW','kr':'KRW',
  'philippines':'PHP','ph':'PHP',
  'vietnam':'VND','vn':'VND',
  'hong kong':'HKD','hk':'HKD',
  'taiwan':'TWD','tw':'TWD',
  'nepal':'NPR','np':'NPR',
  'sri lanka':'LKR','lk':'LKR',
  'bangladesh':'BDT','bd':'BDT',
  'pakistan':'PKR','pk':'PKR',
  'myanmar':'MMK','mm':'MMK',
  'cambodia':'KHR','kh':'KHR',
  'laos':'LAK','la':'LAK',
  'mongolia':'MNT','mn':'MNT',
  'maldives':'MVR','mv':'MVR',
  'bhutan':'BTN','bt':'BTN',
  'uae':'AED','dubai':'AED','abu dhabi':'AED',
  'saudi arabia':'SAR','sa':'SAR',
  'qatar':'QAR','qa':'QAR',
  'kuwait':'KWD','kw':'KWD',
  'bahrain':'BHD','bh':'BHD',
  'oman':'OMR','om':'OMR',
  'jordan':'JOD','jo':'JOD',
  'israel':'ILS','il':'ILS',
  'turkey':'TRY','tr':'TRY',
  // Europe
  'france':'EUR','paris':'EUR',
  'germany':'EUR','berlin':'EUR',
  'italy':'EUR','rome':'EUR','milan':'EUR',
  'spain':'EUR','madrid':'EUR','barcelona':'EUR',
  'netherlands':'EUR','amsterdam':'EUR',
  'portugal':'EUR','lisbon':'EUR',
  'greece':'EUR','athens':'EUR',
  'austria':'EUR','vienna':'EUR',
  'belgium':'EUR','brussels':'EUR',
  'finland':'EUR','helsinki':'EUR',
  'ireland':'EUR','dublin':'EUR',
  'luxembourg':'EUR',
  'uk':'GBP','united kingdom':'GBP','england':'GBP','london':'GBP','scotland':'GBP','wales':'GBP',
  'switzerland':'CHF','zurich':'CHF','geneva':'CHF',
  'norway':'NOK','oslo':'NOK',
  'sweden':'SEK','stockholm':'SEK',
  'denmark':'DKK','copenhagen':'DKK',
  'poland':'PLN','warsaw':'PLN',
  'czech republic':'CZK','czechia':'CZK','prague':'CZK',
  'hungary':'HUF','budapest':'HUF',
  'romania':'RON','bucharest':'RON',
  'croatia':'EUR','zagreb':'EUR',
  'ukraine':'UAH','kyiv':'UAH',
  'russia':'RUB','moscow':'RUB',
  // Americas
  'usa':'USD','united states':'USD','us':'USD','new york':'USD','los angeles':'USD','chicago':'USD','miami':'USD',
  'canada':'CAD','toronto':'CAD','vancouver':'CAD','montreal':'CAD',
  'mexico':'MXN','mexico city':'MXN','cancun':'MXN',
  'brazil':'BRL','sao paulo':'BRL','rio de janeiro':'BRL',
  'argentina':'ARS','buenos aires':'ARS',
  'colombia':'COP','bogota':'COP',
  'peru':'PEN','lima':'PEN',
  'chile':'CLP','santiago':'CLP',
  'cuba':'CUP','havana':'CUP',
  'costa rica':'CRC','san jose':'CRC',
  // Africa & Oceania
  'south africa':'ZAR','cape town':'ZAR','johannesburg':'ZAR',
  'egypt':'EGP','cairo':'EGP',
  'kenya':'KES','nairobi':'KES',
  'morocco':'MAD','marrakech':'MAD',
  'nigeria':'NGN','lagos':'NGN',
  'ghana':'GHS','accra':'GHS',
  'ethiopia':'ETB','addis ababa':'ETB',
  'australia':'AUD','sydney':'AUD','melbourne':'AUD',
  'new zealand':'NZD','auckland':'NZD',
  'fiji':'FJD',
};

const CURRENCY_META = {
  USD:{sym:'$',   code:'USD',locale:'en-US'},
  EUR:{sym:'€',   code:'EUR',locale:'de-DE'},
  GBP:{sym:'£',   code:'GBP',locale:'en-GB'},
  JPY:{sym:'¥',   code:'JPY',locale:'ja-JP'},
  INR:{sym:'₹',   code:'INR',locale:'en-IN'},
  CNY:{sym:'¥',   code:'CNY',locale:'zh-CN'},
  AUD:{sym:'A$',  code:'AUD',locale:'en-AU'},
  CAD:{sym:'C$',  code:'CAD',locale:'en-CA'},
  CHF:{sym:'Fr',  code:'CHF',locale:'de-CH'},
  KRW:{sym:'₩',   code:'KRW',locale:'ko-KR'},
  SGD:{sym:'S$',  code:'SGD',locale:'en-SG'},
  MYR:{sym:'RM',  code:'MYR',locale:'ms-MY'},
  THB:{sym:'฿',   code:'THB',locale:'th-TH'},
  IDR:{sym:'Rp',  code:'IDR',locale:'id-ID'},
  VND:{sym:'₫',   code:'VND',locale:'vi-VN'},
  PHP:{sym:'₱',   code:'PHP',locale:'en-PH'},
  HKD:{sym:'HK$', code:'HKD',locale:'zh-HK'},
  TWD:{sym:'NT$', code:'TWD',locale:'zh-TW'},
  NPR:{sym:'Rs',  code:'NPR',locale:'ne-NP'},
  LKR:{sym:'Rs',  code:'LKR',locale:'si-LK'},
  BDT:{sym:'৳',   code:'BDT',locale:'bn-BD'},
  PKR:{sym:'Rs',  code:'PKR',locale:'ur-PK'},
  AED:{sym:'د.إ', code:'AED',locale:'ar-AE'},
  SAR:{sym:'﷼',   code:'SAR',locale:'ar-SA'},
  QAR:{sym:'ر.ق', code:'QAR',locale:'ar-QA'},
  KWD:{sym:'د.ك', code:'KWD',locale:'ar-KW'},
  TRY:{sym:'₺',   code:'TRY',locale:'tr-TR'},
  ZAR:{sym:'R',   code:'ZAR',locale:'en-ZA'},
  EGP:{sym:'E£',  code:'EGP',locale:'ar-EG'},
  MXN:{sym:'$',   code:'MXN',locale:'es-MX'},
  BRL:{sym:'R$',  code:'BRL',locale:'pt-BR'},
  RUB:{sym:'₽',   code:'RUB',locale:'ru-RU'},
  NOK:{sym:'kr',  code:'NOK',locale:'nb-NO'},
  SEK:{sym:'kr',  code:'SEK',locale:'sv-SE'},
  DKK:{sym:'kr',  code:'DKK',locale:'da-DK'},
  PLN:{sym:'zł',  code:'PLN',locale:'pl-PL'},
  NZD:{sym:'NZ$', code:'NZD',locale:'en-NZ'},
  MNT:{sym:'₮',   code:'MNT',locale:'mn-MN'},
  MMK:{sym:'K',   code:'MMK',locale:'my-MM'},
  KHR:{sym:'៛',   code:'KHR',locale:'km-KH'},
  MVR:{sym:'Rf',  code:'MVR',locale:'dv-MV'},
  JOD:{sym:'JD',  code:'JOD',locale:'ar-JO'},
  ILS:{sym:'₪',   code:'ILS',locale:'he-IL'},
  KES:{sym:'KSh', code:'KES',locale:'sw-KE'},
  NGN:{sym:'₦',   code:'NGN',locale:'en-NG'},
  MAD:{sym:'MAD', code:'MAD',locale:'ar-MA'},
  COP:{sym:'$',   code:'COP',locale:'es-CO'},
  ARS:{sym:'$',   code:'ARS',locale:'es-AR'},
  CLP:{sym:'$',   code:'CLP',locale:'es-CL'},
  PEN:{sym:'S/',  code:'PEN',locale:'es-PE'},
  CRC:{sym:'₡',   code:'CRC',locale:'es-CR'},
  HUF:{sym:'Ft',  code:'HUF',locale:'hu-HU'},
  CZK:{sym:'Kč',  code:'CZK',locale:'cs-CZ'},
  RON:{sym:'lei', code:'RON',locale:'ro-RO'},
  HRK:{sym:'kn',  code:'HRK',locale:'hr-HR'},
  UAH:{sym:'₴',   code:'UAH',locale:'uk-UA'},
};

function detectCurrencyFromDestination(destination) {
  if (!destination) return CURRENCY_META.USD;
  const lower = destination.toLowerCase();
  // Check longest match first
  const keys = Object.keys(COUNTRY_CURRENCY).sort((a,b) => b.length - a.length);
  for (const key of keys) {
    if (lower.includes(key)) {
      const code = COUNTRY_CURRENCY[key];
      return CURRENCY_META[code] || CURRENCY_META.USD;
    }
  }
  return CURRENCY_META.USD;
}

function getCurrencyForTrip(trip) {
  if (!trip) return CURRENCY_META.USD;
  return detectCurrencyFromDestination(trip.destination);
}

function fmtCurrency(amount, currencyMeta) {
  const meta = currencyMeta || CURRENCY_META.USD;
  const noDecimals = ['JPY','KRW','VND','IDR','KHR','LAK','MNT','BDT','MMK','CLP','HUF'];
  const minFrac = noDecimals.includes(meta.code) ? 0 : 2;
  const maxFrac = noDecimals.includes(meta.code) ? 0 : 2;
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: 'currency', currency: meta.code,
      minimumFractionDigits: minFrac, maximumFractionDigits: maxFrac
    }).format(amount);
  } catch(e) {
    return meta.sym + Number(amount).toLocaleString('en-US', {minimumFractionDigits: minFrac, maximumFractionDigits: maxFrac});
  }
}

function fmtCurrencyShort(amount, currencyMeta) {
  const meta = currencyMeta || CURRENCY_META.USD;
  const noDecimals = ['JPY','KRW','VND','IDR','KHR','LAK','MNT','BDT','MMK','CLP','HUF'];
  if (amount >= 1000000) return meta.sym + (amount/1000000).toFixed(1) + 'M';
  if (amount >= 1000) return meta.sym + (amount/1000).toFixed(1) + 'k';
  return meta.sym + (noDecimals.includes(meta.code) ? Math.round(amount) : amount.toFixed(2));
}

const SK = 'wp_v2';
let S = {
  user: null,
  trips: [],
  expenses: {},       // tripId -> []
  itineraries: {},    // tripId -> stops[]
  currentTrip: null,
  activeFilter: 'all',
  editTrip: null,
  editExp: null,
  activeTab: 'trips',
  activeDetTab: 'expenses',
  globalStops: [],
  userCurrencyCode: 'USD',
  exchangeRates: null,
};

// ═══════════════════════════════════════════════
//  PERSIST
// ═══════════════════════════════════════════════
async function load(){
  if (!S.user) return;
  try {
    const docSnap = await db.collection("users").doc(S.user.uid).get();
    if (docSnap.exists) {
      const d = docSnap.data();
      S.trips=d.trips||[];S.expenses=d.expenses||{};S.itineraries=d.itineraries||{};S.globalStops=d.globalStops||[];
    }
  } catch(e) { console.error('Load error', e); }
}
function save(){
  if (!S.user) return;
  try {
    db.collection("users").doc(S.user.uid).set({
      trips:S.trips, expenses:S.expenses, itineraries:S.itineraries, globalStops:S.globalStops
    });
  } catch(e) { console.error('Save error', e); }
}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2)}

// ═══════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════
function doGoogleSignIn(){
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(e => {
    console.error(e);
    toast('Sign in failed: ' + e.message, 'er');
  });
}
function doEmailSignIn(){
  const email = document.getElementById('auth-email').value.trim();
  const pass = document.getElementById('auth-pass').value;
  if (!email || !pass) { toast('Enter email and password', 'er'); return; }
  auth.signInWithEmailAndPassword(email, pass).catch(e => {
    console.error(e);
    toast('Sign in failed: ' + e.message, 'er');
  });
}
function doEmailSignUp(){
  const email = document.getElementById('auth-email').value.trim();
  const pass = document.getElementById('auth-pass').value;
  if (!email || !pass) { toast('Enter email and password', 'er'); return; }
  auth.createUserWithEmailAndPassword(email, pass).catch(e => {
    console.error(e);
    toast('Sign up failed: ' + e.message, 'er');
  });
}
function doForgotPassword() {
  const email = document.getElementById('auth-email').value.trim();
  if (!email) { toast('Enter your email address first', 'er'); return; }
  auth.sendPasswordResetEmail(email).then(() => {
    toast('Password reset email sent!', 'ok');
  }).catch(e => {
    console.error(e);
    toast('Error: ' + e.message, 'er');
  });
}
function doSignOut(){
  auth.signOut();
}

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const nm = user.displayName || (user.email ? user.email.split('@')[0] : 'Traveler');
    const init = nm[0].toUpperCase();
    S.user = { uid: user.uid, nm, init };
    document.getElementById('nav-nm').textContent = nm;
    document.getElementById('nav-ava').textContent = init;
    document.getElementById('auth').style.display = 'none';
    document.getElementById('app').classList.add('show');
    document.getElementById('pg-sub').textContent = `Welcome, ${nm.split(' ')[0]}! Plan your next adventure.`;
    await load();
    populateTripSelectors();
    renderTrips();
    toast(`Hey ${nm.split(' ')[0]}! 👋`, 'ok');
  } else {
    S.user = null;
    S.trips = []; S.expenses = {}; S.itineraries = {}; S.globalStops = [];
    document.getElementById('auth').style.display = 'flex';
    document.getElementById('app').classList.remove('show');
  }
});

// ═══════════════════════════════════════════════
//  TABS
// ═══════════════════════════════════════════════
function switchTab(tab, btn){
  S.activeTab=tab;
  document.querySelectorAll('.nav-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#app > .view').forEach(v=>v.classList.remove('active'));
  if(tab==='trips') document.getElementById('view-trips').classList.add('active');
  else if(tab==='dashboard'){
    document.getElementById('view-dashboard').classList.add('active');
    showSkeleton('dash-content','dash-skeleton',700).then(()=>renderDashboard());
  }
  else if(tab==='map'){ document.getElementById('view-map').classList.add('active'); renderGlobalMap(); }
}
function switchDetTab(tab, btn){
  S.activeDetTab=tab;
  document.querySelectorAll('.det-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.det-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('dp-'+tab).classList.add('active');
  if(tab==='map'){ populateItinTripSel(); renderTripMap(); }
  if(tab==='summary'){ renderTripSummary(); }
}

// ═══════════════════════════════════════════════
//  FORMAT
// ═══════════════════════════════════════════════
// fmt: formats for current trip context (or trip arg), falls back to USD
function fmt(n, trip) {
  const t = trip || (S.currentTrip ? S.trips.find(x=>x.id===S.currentTrip) : null);
  const meta = getCurrencyForTrip(t);
  return fmtCurrency(Number(n), meta);
}
// fmtS: short format for stats overview
function fmtS(n, trip) {
  const t = trip || null; // stats overview shows aggregate, use USD or first trip currency
  const meta = t ? getCurrencyForTrip(t) : CURRENCY_META.USD;
  return fmtCurrencyShort(n, meta);
}
// fmtT: format with explicit trip object (use in dashboard loops)
function fmtT(n, trip) {
  const meta = getCurrencyForTrip(trip);
  return fmtCurrency(Number(n), meta);
}
function fmtST(n, trip) {
  const meta = getCurrencyForTrip(trip);
  return fmtCurrencyShort(n, meta);
}

function convertToLocal(amount, fromCode) {
  if (!S.exchangeRates || !S.userCurrencyCode) return null;
  if (fromCode === S.userCurrencyCode) return null;
  const rateFrom = S.exchangeRates[fromCode];
  const rateTo = S.exchangeRates[S.userCurrencyCode];
  if (!rateFrom || !rateTo) return null;
  return (amount / rateFrom) * rateTo;
}

function fmtDual(n, trip, short = false) {
  const meta = getCurrencyForTrip(trip);
  const primaryStr = short ? fmtCurrencyShort(Number(n), meta) : fmtCurrency(Number(n), meta);
  const convertedVal = convertToLocal(Number(n), meta.code);
  if (convertedVal !== null) {
    const localMeta = CURRENCY_META[S.userCurrencyCode] || CURRENCY_META.USD;
    const convertedStr = short ? fmtCurrencyShort(convertedVal, localMeta) : fmtCurrency(convertedVal, localMeta);
    return `${primaryStr} <span class="converted-cur">(~${convertedStr})</span>`;
  }
  return primaryStr;
}

function fmtSDual(n) {
  const primaryStr = fmtS(Number(n));
  const convertedVal = convertToLocal(Number(n), 'USD'); // Global stats baseline is USD
  if (convertedVal !== null) {
    const localMeta = CURRENCY_META[S.userCurrencyCode] || CURRENCY_META.USD;
    const convertedStr = fmtCurrencyShort(convertedVal, localMeta);
    return `${primaryStr} <span class="converted-cur">(~${convertedStr})</span>`;
  }
  return primaryStr;
}

async function initCurrencySystem() {
  try {
    const ipRes = await fetch('https://ipwho.is/');
    const ipData = await ipRes.json();
    if (ipData && ipData.currency && ipData.currency.code) {
      S.userCurrencyCode = ipData.currency.code;
    }
  } catch (e) { console.warn('IP detect fail', e); }
  
  try {
    const rateRes = await fetch('https://open.er-api.com/v6/latest/USD');
    const rateData = await rateRes.json();
    if (rateData && rateData.rates) {
      S.exchangeRates = rateData.rates;
    }
  } catch (e) { console.warn('Rate fetch fail', e); }
  
  if (S.user) {
    if (S.activeTab === 'trips') {
      if (S.currentTrip) { renderDetHead(); renderExpList(); }
      else renderTrips();
    } else if (S.activeTab === 'dashboard') {
      if (typeof renderDashboard === 'function') renderDashboard();
    } else if (S.activeTab === 'detail' && S.activeDetTab === 'summary') {
      if (typeof renderTripSummary === 'function') renderTripSummary();
    }
  }
}
initCurrencySystem();

// ═══════════════════════════════════════════════
//  TRIPS RENDER
// ═══════════════════════════════════════════════
function renderTrips(){
  updateStats();
  const grid=document.getElementById('trips-grid');
  const grads=['linear-gradient(135deg,#667eea,#764ba2)','linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)','linear-gradient(135deg,#43e97b,#38f9d7)',
    'linear-gradient(135deg,#fa709a,#fee140)','linear-gradient(135deg,#a18cd1,#fbc2eb)'];
  if(!S.trips.length){
    grid.innerHTML=`<button class="add-card" onclick="openCreateTrip()"><div style="font-size:1.8rem">✈</div><div style="font-size:.85rem;font-weight:500">Create your first trip</div><div style="font-size:.73rem;opacity:.6">Set a destination and budget</div></button>`;
    return;
  }
  grid.innerHTML=S.trips.map((t,i)=>{
    const exps=S.expenses[t.id]||[];
    const spent=exps.reduce((s,e)=>s+e.amount,0);
    const pct=Math.min((spent/t.budget)*100,100);
    const bc=pct<70?'bf-ok':pct<90?'bf-wa':'bf-ov';
    const sl={upcoming:'b-up',active:'b-ac',completed:'b-co'}[t.status]||'b-up';
    const sn={upcoming:'Upcoming',active:'Active',completed:'Completed'}[t.status]||'Upcoming';
    const days=t.start&&t.end?Math.ceil((new Date(t.end)-new Date(t.start))/86400000):null;
    const stops=(S.itineraries[t.id]||[]).length;
    return `<div class="trip-card" onclick="openTrip('${t.id}')">
      <div class="tc-banner" style="background:${grads[i%grads.length]}">
        <div class="tc-emoji">${t.emoji||'✈️'}</div>
        <div class="tc-badge ${sl}">${sn}</div>
      </div>
      <div class="tc-body">
        <div class="tc-name">${esc(t.name)}</div>
        <div class="tc-meta">
          <span>📍 ${esc(t.destination)||'TBD'}</span>
          ${days!==null?`<span>📅 ${days}d</span>`:''}
          ${stops?`<span>📌 ${stops} stops</span>`:''}
        </div>
        <div class="bar-wrap">
          <div class="bar-lbls"><span style="font-weight:500;font-size:.7rem">${fmtDual(spent,t,true)}</span><span style="color:var(--ink3);font-size:.7rem">of ${fmtDual(t.budget,t,true)}</span></div>
          <div class="bar-t"><div class="bar-f ${bc}" style="width:${pct}%"></div></div>
        </div>
      </div>
      <div class="tc-foot">
        <span class="tc-cnt">${exps.length} expense${exps.length!==1?'s':''}</span>
        <div style="display:flex;gap:.35rem" onclick="event.stopPropagation()">
          <button class="btn-sm" onclick="openEditTrip('${t.id}')">✏ Edit</button>
          <button class="btn-sm dg" onclick="delTrip('${t.id}')">✕</button>
        </div>
      </div>
    </div>`;
  }).join('')+`<button class="add-card" onclick="openCreateTrip()"><div style="font-size:1.5rem">+</div><div style="font-size:.82rem;font-weight:500">New trip</div></button>`;
}
function updateStats(){
  document.getElementById('s-trips').textContent=S.trips.length;
  const tb=S.trips.reduce((s,t)=>s+(t.budget||0),0);
  const ts=S.trips.reduce((s,t)=>{return s+(S.expenses[t.id]||[]).reduce((e,x)=>e+x.amount,0);},0);
  // For aggregate stats, show with USD (mixed currencies scenario)
  document.getElementById('s-budget').innerHTML=fmtSDual(tb);
  document.getElementById('s-spent').innerHTML=fmtSDual(ts);
}

// ═══════════════════════════════════════════════
//  TRIP DETAIL
// ═══════════════════════════════════════════════
function openTrip(id){
  S.currentTrip=id; S.activeFilter='all';
  document.querySelectorAll('.fchip').forEach((c,i)=>c.classList.toggle('active',i===0));
  document.getElementById('view-trips').classList.remove('active');
  document.getElementById('view-detail').classList.add('active');
  switchDetTab('expenses',document.querySelector('.det-tab'));
  renderDetHead(); renderExpList();
}
function gotoTrips(){
  S.currentTrip=null;
  document.getElementById('view-detail').classList.remove('active');
  document.getElementById('view-trips').classList.add('active');
  renderTrips();
}
function renderDetHead(){
  const t=S.trips.find(x=>x.id===S.currentTrip); if(!t) return;
  const exps=S.expenses[t.id]||[];
  const spent=exps.reduce((s,e)=>s+e.amount,0);
  const rem=t.budget-spent;
  const pct=Math.min((spent/t.budget)*100,100);
  const bc=pct<70?'bf-ok':pct<90?'bf-wa':'bf-ov';
  const days=t.start&&t.end?Math.ceil((new Date(t.end)-new Date(t.start))/86400000):null;
  const cur=getCurrencyForTrip(t);
  const curBadge=cur.code!=='USD'?`<span class="currency-badge" title="Currency for ${t.destination}">${cur.code} ${cur.sym}</span>`:'';
  document.getElementById('det-head').innerHTML=`
    <div class="det-ico">${t.emoji||'✈️'}</div>
    <div class="det-info">
      <div class="det-title">${esc(t.name)} ${curBadge}</div>
      <div class="det-dates">📍 ${esc(t.destination)||'TBD'}${t.start?` · ${t.start}${t.end?' → '+t.end:''}`:''} ${days!==null?`· ${days} days`:''}</div>
      <div class="bsum">
        <div class="bi"><div class="bv">${fmtDual(t.budget,t)}</div><div class="bl">Budget</div></div>
        <div class="bi"><div class="bv">${fmtDual(spent,t)}</div><div class="bl">Spent</div></div>
        <div class="bi"><div class="bv ${rem>=0?'g':'r'}">${rem>=0?fmtDual(rem,t):'-'+fmtDual(-rem,t)}</div><div class="bl">${rem>=0?'Left':'Over'}</div></div>
      </div>
      <div class="big-bar" style="margin-top:.6rem">
        <div class="bar-t"><div class="bar-f ${bc}" style="width:${pct}%"></div></div>
        <div style="font-size:.68rem;color:var(--ink3);margin-top:.25rem">${Math.round(pct)}% used</div>
      </div>
    </div>
    <div class="det-acts">
      <button class="btn-sm" onclick="openEditTrip('${t.id}')">✏ Edit</button>
      <button class="btn-sm dg" onclick="delTripDetail('${t.id}')">✕ Delete</button>
    </div>`;
}
function renderExpList(){
  const t=S.trips.find(x=>x.id===S.currentTrip); if(!t) return;
  let exps=(S.expenses[t.id]||[]).slice().sort((a,b)=>new Date(b.date)-new Date(a.date));
  if(S.activeFilter!=='all') exps=exps.filter(e=>e.category===S.activeFilter);
  const cm={Food:{i:'🍴',c:'cf'},Stay:{i:'🏨',c:'cs'},Transport:{i:'🚗',c:'ct'},Activity:{i:'🎭',c:'ca'},Shopping:{i:'🛍',c:'csh'},Other:{i:'📦',c:'cx'}};
  if(!exps.length){
    document.getElementById('exp-list').innerHTML=`<div class="empty"><div class="ei">${S.activeFilter==='all'?'💸':'🔍'}</div><div class="et">${S.activeFilter==='all'?'No expenses yet. Add your first!':'No expenses in this category.'}</div></div>`;
    return;
  }
  document.getElementById('exp-list').innerHTML=exps.map(e=>{
    const m=cm[e.category]||cm.Other;
    return `<div class="exp-row">
      <div class="exp-ico ${m.c}">${m.i}</div>
      <div class="exp-desc"><div class="exp-name">${esc(e.description)}</div><div class="exp-cd">${esc(e.category)} · ${e.date}${e.notes?' · '+esc(e.notes):''}</div></div>
      <div class="exp-amt">${fmtDual(e.amount,t)}</div>
      <div class="exp-acts">
        <button class="ico-btn ed" onclick="openEditExp('${e.id}')">✏</button>
        <button class="ico-btn" onclick="delExp('${e.id}')">✕</button>
      </div>
    </div>`;
  }).join('');
}
function setFilter(cat,btn){
  S.activeFilter=cat;
  document.querySelectorAll('.fchip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active'); renderExpList();
}

// ═══════════════════════════════════════════════
//  TRIP CRUD
// ═══════════════════════════════════════════════
function openCreateTrip(){
  S.editTrip=null;
  document.getElementById('m-trip-title').textContent='Create Trip';
  document.getElementById('t-submit').textContent='Create Trip';
  ['t-name','t-dest','t-budget'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('t-status').value='upcoming';
  document.getElementById('t-emoji').value='✈️';
  const today = new Date().toISOString().slice(0,10);
  document.getElementById('t-start').value=today;
  document.getElementById('t-start').min=today;
  document.getElementById('t-end').value='';
  document.getElementById('t-end').min=today;
  document.querySelectorAll('.eo').forEach((e,i)=>e.classList.toggle('sel',i===0));
  document.getElementById('m-trip').style.display='flex';
  setTimeout(()=>document.getElementById('t-name').focus(),80);
}
function openEditTrip(id){
  const t=S.trips.find(x=>x.id===id); if(!t) return;
  S.editTrip=id;
  document.getElementById('m-trip-title').textContent='Edit Trip';
  document.getElementById('t-submit').textContent='Save Changes';
  document.getElementById('t-name').value=t.name;
  document.getElementById('t-dest').value=t.destination||'';
  document.getElementById('t-budget').value=t.budget;
  document.getElementById('t-status').value=t.status||'upcoming';
  document.getElementById('t-emoji').value=t.emoji||'✈️';
  document.getElementById('t-start').value=t.start||'';
  document.getElementById('t-end').value=t.end||'';
  const emojis=EMOJIS;
  document.querySelectorAll('.eo').forEach((e,i)=>e.classList.toggle('sel',emojis[i]===(t.emoji||'✈️')));
  document.getElementById('m-trip').style.display='flex';
}
function submitTrip(){
  const name=document.getElementById('t-name').value.trim();
  const dest=document.getElementById('t-dest').value.trim();
  const budget=parseFloat(document.getElementById('t-budget').value);
  const emoji=document.getElementById('t-emoji').value;
  const status=document.getElementById('t-status').value;
  const start=document.getElementById('t-start').value;
  const end=document.getElementById('t-end').value;
  if(!name){toast('Trip name required','er');return;}
  if(!budget||budget<=0){toast('Valid budget required','er');return;}
  if(start && end && end < start){toast('End date must be after start date','er');return;}
  if(end && end < new Date().toISOString().slice(0,10) && !S.editTrip){toast('End date cannot be in the past','er');return;}
  if(S.editTrip){
    const t=S.trips.find(x=>x.id===S.editTrip);
    if(t) Object.assign(t,{name,destination:dest,budget,emoji,status,start,end});
    toast('Trip updated!','ok');
  } else {
    S.trips.push({id:uid(),name,destination:dest,budget,emoji,status,start,end,createdAt:Date.now()});
    toast('Trip created! 🎉','ok');
  }
  save(); closeM('m-trip'); populateTripSelectors();
  if(S.currentTrip) renderDetHead(); else renderTrips();
}
function delTrip(id){
  if(!confirm('Delete trip and all data?')) return;
  S.trips=S.trips.filter(t=>t.id!==id);
  delete S.expenses[id]; delete S.itineraries[id];
  save(); populateTripSelectors(); renderTrips(); toast('Trip deleted');
}
function delTripDetail(id){
  if(!confirm('Delete trip and all data?')) return;
  S.trips=S.trips.filter(t=>t.id!==id);
  delete S.expenses[id]; delete S.itineraries[id];
  save(); populateTripSelectors(); gotoTrips(); toast('Trip deleted');
}

// ═══════════════════════════════════════════════
//  EXPENSE CRUD
// ═══════════════════════════════════════════════
function openAddExp(){
  S.editExp=null;
  document.getElementById('m-exp-title').textContent='Add Expense';
  document.getElementById('e-submit').textContent='Add Expense';
  ['e-desc','e-notes'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('e-amt').value='';
  document.getElementById('e-cat').value='Food';
  document.getElementById('e-date').value=new Date().toISOString().slice(0,10);
  document.querySelectorAll('.co').forEach((e,i)=>e.classList.toggle('sel',i===0));
  document.getElementById('m-exp').style.display='flex';
  setTimeout(()=>document.getElementById('e-desc').focus(),80);
}
function openEditExp(id){
  const exps=S.expenses[S.currentTrip]||[];
  const e=exps.find(x=>x.id===id); if(!e) return;
  S.editExp=id;
  document.getElementById('m-exp-title').textContent='Edit Expense';
  document.getElementById('e-submit').textContent='Save Changes';
  document.getElementById('e-desc').value=e.description;
  document.getElementById('e-amt').value=e.amount;
  document.getElementById('e-notes').value=e.notes||'';
  document.getElementById('e-cat').value=e.category;
  document.getElementById('e-date').value=e.date;
  const cats=CATS.map(c=>c.v);
  document.querySelectorAll('.co').forEach((el,i)=>el.classList.toggle('sel',cats[i]===e.category));
  document.getElementById('m-exp').style.display='flex';
}
function submitExp(){
  const desc=document.getElementById('e-desc').value.trim();
  const amt=parseFloat(document.getElementById('e-amt').value);
  const date=document.getElementById('e-date').value;
  const cat=document.getElementById('e-cat').value;
  const notes=document.getElementById('e-notes').value.trim();
  if(!desc){toast('Description required','er');return;}
  if(!amt||amt<=0){toast('Valid amount required','er');return;}
  if(!date){toast('Date required','er');return;}
  if(!S.expenses[S.currentTrip]) S.expenses[S.currentTrip]=[];
  if(S.editExp){
    const e=S.expenses[S.currentTrip].find(x=>x.id===S.editExp);
    if(e) Object.assign(e,{description:desc,amount:amt,date,category:cat,notes});
    toast('Expense updated!','ok');
  } else {
    S.expenses[S.currentTrip].push({id:uid(),description:desc,amount:amt,date,category:cat,notes,createdAt:Date.now()});
    toast('Expense added!','ok');
  }
  save(); closeM('m-exp'); renderDetHead(); renderExpList();
}
function delExp(id){
  S.expenses[S.currentTrip]=(S.expenses[S.currentTrip]||[]).filter(e=>e.id!==id);
  save(); renderDetHead(); renderExpList(); toast('Removed');
}

// ═══════════════════════════════════════════════
//  REAL MAP SYSTEM — Leaflet + OpenStreetMap + Nominatim
// ═══════════════════════════════════════════════
let tripLeafletMap = null;
let globalLeafletMap = null;
let tripMarkers = [];
let globalMarkers = [];
let tripPolyline = null;
let globalPolyline = null;

const MARKER_COLORS = ['#e8521a','#2563eb','#16a34a','#9333ea','#d97706'];

function makeNumberedIcon(n, color){
  return L.divIcon({
    className:'',
    html:`<div style="
      width:32px;height:32px;border-radius:50%;
      background:${color};color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-family:Syne,sans-serif;font-size:13px;font-weight:700;
      box-shadow:0 3px 10px rgba(0,0,0,.35);
      border:2px solid rgba(255,255,255,.8);
    ">${n}</div>`,
    iconSize:[32,32],iconAnchor:[16,16],popupAnchor:[0,-18]
  });
}

function initTripMap(){
  if(tripLeafletMap) return;
  tripLeafletMap = L.map('trip-leaflet-map',{zoomControl:true,scrollWheelZoom:true})
    .setView([20,0],2);
  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    attribution:'© <a href="https://maps.google.com">Google Maps</a>',
    maxZoom:20
  }).addTo(tripLeafletMap);
}

function initGlobalMap(){
  if(globalLeafletMap) return;
  globalLeafletMap = L.map('global-leaflet-map',{zoomControl:true,scrollWheelZoom:true})
    .setView([20,0],2);
  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    attribution:'© <a href="https://maps.google.com">Google Maps</a>',
    maxZoom:20
  }).addTo(globalLeafletMap);
}

function updateLeafletMap(mapObj, stops, markersArr, polylineRef, badgeId, countId){
  // Clear old markers & polylines
  markersArr.forEach(m=>mapObj.removeLayer(m));
  markersArr.length=0;
  if(polylineRef.line){ mapObj.removeLayer(polylineRef.line); polylineRef.line=null; }
  if(polylineRef.deco){ mapObj.removeLayer(polylineRef.deco); polylineRef.deco=null; }

  document.getElementById(badgeId).style.display=stops.length?'flex':'none';
  document.getElementById(countId).textContent=stops.length;

  if(!stops.length) return;

  const latlngs=[];
  stops.forEach((s,i)=>{
    const lat=parseFloat(s.lat), lng=parseFloat(s.lng);
    latlngs.push([lat,lng]);
    const color=MARKER_COLORS[i%MARKER_COLORS.length];
    const marker=L.marker([lat,lng],{icon:makeNumberedIcon(i+1,color)})
      .addTo(mapObj)
      .bindPopup(`<b>${s.name}</b><br><span style="font-size:12px;color:#6b7280">${s.addr}</span>`);
    markersArr.push(marker);
  });

  if(latlngs.length>1){
    polylineRef.line = L.polyline(latlngs,{
      color:'#0d9488',weight:3,opacity:.85,dashArray:'10 8'
    }).addTo(mapObj);
  }

  // Fit map to all stops
  const bounds=L.latLngBounds(latlngs);
  mapObj.fitBounds(bounds,{padding:[40,40],maxZoom:12});
  setTimeout(()=>mapObj.invalidateSize(),200);
}

// ─── Nominatim Search (real geocoding) ───
let searchTimeout=null;
let activeSearchEl=null; let activeSugEl=null; let activeMode='trip';
let nominatimResults=[];

function onSearchInput(){
  activeSearchEl=document.getElementById('place-search');
  activeSugEl=document.getElementById('suggestions');
  activeMode='trip'; doNominatimSearch();
}
function onGlobalSearch(){
  activeSearchEl=document.getElementById('global-search');
  activeSugEl=document.getElementById('global-sug');
  activeMode='global'; doNominatimSearch();
}

async function doNominatimSearch(){
  clearTimeout(searchTimeout);
  const q=activeSearchEl.value.trim();
  if(q.length<2){activeSugEl.classList.remove('open');return;}
  // Show loading
  activeSugEl.innerHTML=`<div class="sug-item" style="pointer-events:none;color:var(--ink3)"><div class="sug-pin">⏳</div><div class="sug-text"><div class="sug-main">Searching…</div></div></div>`;
  activeSugEl.classList.add('open');
  searchTimeout=setTimeout(async()=>{
    try{
      const url=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`;
      const res=await fetch(url,{headers:{'Accept-Language':'en-US,en','User-Agent':'WanderPlanApp/1.0'}});
      const data=await res.json();
      if(!data.length){
        activeSugEl.innerHTML=`<div class="sug-item" style="pointer-events:none;color:var(--ink3)"><div class="sug-pin">🔍</div><div class="sug-text"><div class="sug-main">No results found</div></div></div>`;
        return;
      }
      nominatimResults=data;
      activeSugEl.innerHTML=data.map((p,i)=>{
        const name=p.name||p.display_name.split(',')[0];
        const addr=p.display_name.split(',').slice(1,3).join(',').trim();
        const type=p.type||p.class||'place';
        const typeIco={city:'🏙',town:'🏘',village:'🏡',tourism:'🏛',restaurant:'🍴',hotel:'🏨',airport:'✈️',station:'🚉',park:'🌳',historic:'⛩',island:'🏝',beach:'🏖',mountain:'🏔',default:'📍'};
        const ico=typeIco[type]||typeIco[p.class]||typeIco.default;
        return `<div class="sug-item" onclick="selectNominatimPlace(${i},'${activeMode}')">
          <div class="sug-pin">${ico}</div>
          <div class="sug-text">
            <div class="sug-main">${esc(name)}</div>
            <div class="sug-sub">${esc(addr||p.display_name.slice(0,60))}</div>
          </div>
        </div>`;
      }).join('');
      activeSugEl.classList.add('open');
    }catch(err){
      activeSugEl.innerHTML=`<div class="sug-item" style="pointer-events:none;color:var(--ink3)"><div class="sug-pin">⚠️</div><div class="sug-text"><div class="sug-main">Search failed — check internet</div></div></div>`;
    }
  },400);
}

function selectNominatimPlace(idx, mode){
  const p=nominatimResults[idx]; if(!p) return;
  const sugEl=mode==='trip'?document.getElementById('suggestions'):document.getElementById('global-sug');
  sugEl.classList.remove('open');

  const typeIco={city:'🏙',town:'🏘',village:'🏡',tourism:'🏛',restaurant:'🍴',hotel:'🏨',airport:'✈️',station:'🚉',park:'🌳',historic:'⛩',island:'🏝',beach:'🏖',mountain:'🏔',default:'📍'};
  const icon=typeIco[p.type]||typeIco[p.class]||'📍';
  const name=p.name||p.display_name.split(',')[0];
  const addr=p.display_name;
  const stop={id:uid(),name,addr,lat:parseFloat(p.lat),lng:parseFloat(p.lon),icon};

  if(mode==='trip'){
    document.getElementById('place-search').value='';
    const tid=document.getElementById('itin-trip-sel').value||S.currentTrip;
    if(!tid){toast('Select a trip first','er');return;}
    if(!S.itineraries[tid]) S.itineraries[tid]=[];
    if(S.itineraries[tid].find(s=>s.name===name)){toast('Already added','');return;}
    S.itineraries[tid].push(stop);
    save(); renderTripMap();
  } else {
    document.getElementById('global-search').value='';
    const tid=document.getElementById('global-trip-sel').value;
    if(tid){
      if(!S.itineraries[tid]) S.itineraries[tid]=[];
      if(!S.itineraries[tid].find(s=>s.name===name)){
        S.itineraries[tid].push({...stop,id:uid()});
        save();
      }
    }
    if(!S.globalStops.find(s=>s.name===name)){
      S.globalStops.push(stop);
      save();
    }
    renderGlobalMap();
  }
  toast(`📍 ${name} added`,'ok');
}

function onSearchKey(e){ if(e.key==='Escape') document.getElementById('suggestions').classList.remove('open'); }
function onGlobalKey(e){ if(e.key==='Escape') document.getElementById('global-sug').classList.remove('open'); }

function delStop(id, mode){
  if(mode==='trip'){
    const tid=document.getElementById('itin-trip-sel').value||S.currentTrip;
    S.itineraries[tid]=(S.itineraries[tid]||[]).filter(s=>s.id!==id);
    save(); renderTripMap();
  } else {
    S.globalStops=S.globalStops.filter(s=>s.id!==id);
    save(); renderGlobalMap();
  }
}

// ─── TRIP MAP ───
function populateItinTripSel(){
  const sel=document.getElementById('itin-trip-sel');
  sel.innerHTML=S.trips.map(t=>`<option value="${t.id}">${t.emoji||'✈️'} ${esc(t.name)}</option>`).join('');
  if(S.currentTrip) sel.value=S.currentTrip;
}
function onItinTripChange(){ renderTripMap(); }
function populateTripSelectors(){
  const gs=document.getElementById('global-trip-sel');
  gs.innerHTML=`<option value="">— Link to trip (optional) —</option>`+
    S.trips.map(t=>`<option value="${t.id}">${t.emoji||'✈️'} ${esc(t.name)}</option>`).join('');
}
function onGlobalTripChange(){}

function renderTripMap(){
  populateItinTripSel();
  const tid=document.getElementById('itin-trip-sel').value||S.currentTrip;
  const stops=S.itineraries[tid]||[];
  renderStopList(stops,'stop-list','trip');
  initTripMap();
  if(!tripPolyline) tripPolyline={line:null,deco:null};
  updateLeafletMap(tripLeafletMap, stops, tripMarkers, tripPolyline,'stops-badge','stops-count');
  document.getElementById('calc-btn').disabled=stops.length<2;
  document.getElementById('dist-panel').classList.remove('show');
  setTimeout(()=>tripLeafletMap&&tripLeafletMap.invalidateSize(),300);
}

function renderGlobalMap(){
  const stops=S.globalStops;
  renderStopList(stops,'global-stops','global');
  initGlobalMap();
  if(!globalPolyline) globalPolyline={line:null,deco:null};
  updateLeafletMap(globalLeafletMap, stops, globalMarkers, globalPolyline,'gstops-badge','gstops-count');
  document.getElementById('gcalc-btn').disabled=stops.length<2;
  document.getElementById('gdist-panel').classList.remove('show');
  setTimeout(()=>globalLeafletMap&&globalLeafletMap.invalidateSize(),300);
}

// ═══════════════════════════════════════════════
//  REAL DISTANCE — Haversine formula
// ═══════════════════════════════════════════════
function haversineKm(a, b){
  const R=6371, dLat=(b.lat-a.lat)*Math.PI/180, dLng=(b.lng-a.lng)*Math.PI/180;
  const x=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}
function fmtDist(km){
  const hrs=km/80, h=Math.floor(hrs), m=Math.round((hrs-h)*60);
  return {km:Math.round(km), time:`${h>0?h+'h ':''}${m}m`};
}

function calcDistances(){
  const tid=document.getElementById('itin-trip-sel').value||S.currentTrip;
  const stops=S.itineraries[tid]||[];
  if(stops.length<2){toast('Add 2+ stops first','er');return;}
  computeAndShowDistances(stops,'dist-rows','dist-panel',tid,'trip');
}
function globalCalcDistances(){
  const stops=S.globalStops;
  if(stops.length<2){toast('Add 2+ stops first','er');return;}
  computeAndShowDistances(stops,'gdist-rows','gdist-panel',null,'global');
}

function computeAndShowDistances(stops,rowsId,panelId,tid,mode){
  let totalKm=0; let html='';
  stops.forEach(s=>s.distBadge=null);
  for(let i=0;i<stops.length-1;i++){
    const a=stops[i], b=stops[i+1];
    const d=fmtDist(haversineKm(a,b));
    totalKm+=d.km;
    stops[i].distBadge=`${d.km.toLocaleString()} km · ${d.time} →`;
    html+=`<div class="dist-row">
      <div class="dr-from">${a.icon||'📍'} ${esc(a.name)} <span class="dr-arrow">→</span> ${b.icon||'📍'} ${esc(b.name)}</div>
      <div class="dr-vals"><span class="dr-val dk">${d.km.toLocaleString()} km</span><span class="dr-val t">⏱ ${d.time}</span></div>
    </div>`;
  }
  html+=`<div class="total-dist"><span class="td-lbl">🧭 Total Route Distance</span><span class="td-val">${Math.round(totalKm).toLocaleString()} km</span></div>`;
  document.getElementById(rowsId).innerHTML=html;
  document.getElementById(panelId).classList.add('show');
  if(tid) renderStopList(stops,'stop-list',mode); else renderStopList(stops,'global-stops',mode);
  toast(`📏 ${stops.length-1} segment${stops.length>2?'s':''} calculated!`,'ok');
}

// ═══════════════════════════════════════════════
//  PICKERS & MODAL UTILS
// ═══════════════════════════════════════════════
function pickEmoji(el,e){
  document.querySelectorAll('.eo').forEach(x=>x.classList.remove('sel'));
  el.classList.add('sel'); document.getElementById('t-emoji').value=e;
}
function pickCat(el,c){
  document.querySelectorAll('.co').forEach(x=>x.classList.remove('sel'));
  el.classList.add('sel'); document.getElementById('e-cat').value=c;
}
function closeM(id){ document.getElementById(id).style.display='none'; }
function bdClose(e,id){ if(e.target.classList.contains('overlay')) closeM(id); }

// ═══════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════
function toast(msg,type=''){
  const el=document.createElement('div');
  el.className='toast'+(type?' '+type:'');
  el.textContent=msg;
  document.getElementById('toasts').appendChild(el);
  setTimeout(()=>el.remove(),3000);
}

// ─── KEYBOARD ───
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    ['m-trip','m-exp'].forEach(id=>closeM(id));
    ['suggestions','global-sug'].forEach(id=>document.getElementById(id).classList.remove('open'));
  }
});
document.addEventListener('click',e=>{
  if(!e.target.closest('.search-wrap')){
    ['suggestions','global-sug'].forEach(id=>document.getElementById(id).classList.remove('open'));
  }
});

// ═══════════════════════════════════════════════
//  DARK MODE
// ═══════════════════════════════════════════════
let darkMode = localStorage.getItem('wp_theme') === 'dark';
function applyTheme(){
  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  document.getElementById('theme-toggle').textContent = darkMode ? '☀️' : '🌙';
}
function toggleTheme(){
  darkMode = !darkMode;
  localStorage.setItem('wp_theme', darkMode ? 'dark' : 'light');
  applyTheme();
  toast(darkMode ? '🌙 Dark mode on' : '☀️ Light mode on');
}
applyTheme();

// ═══════════════════════════════════════════════
//  SKELETON LOADER HELPER
// ═══════════════════════════════════════════════
function showSkeleton(containerId, skeletonId, delay=600){
  const sk=document.getElementById(skeletonId);
  const ct=document.getElementById(containerId);
  if(sk) sk.style.display='block';
  if(ct) ct.style.display='none';
  return new Promise(r=>{
    setTimeout(()=>{
      if(sk) sk.style.display='none';
      if(ct) ct.style.display='block';
      r();
    }, delay);
  });
}

// ═══════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════
function renderDashboard(){
  const content = document.getElementById('dash-content');
  if(!S.trips.length){
    content.innerHTML=`<div class="dash-empty" style="padding:3rem 1rem"><div style="font-size:3rem;margin-bottom:.75rem">🧳</div><div style="font-family:var(--ff);font-size:1rem;font-weight:700;margin-bottom:.4rem">No trips yet</div><div>Create your first trip to see your dashboard.</div><button class="btn-p" style="margin-top:1rem" onclick="switchTab('trips',document.querySelector('.nav-tab'))">+ New Trip</button></div>`;
    return;
  }
  const totalBudget = S.trips.reduce((s,t)=>s+(t.budget||0),0);
  const totalSpent = S.trips.reduce((s,t)=>{return s+(S.expenses[t.id]||[]).reduce((a,e)=>a+e.amount,0);},0);
  const totalRem = totalBudget - totalSpent;
  const totalPct = totalBudget ? Math.min((totalSpent/totalBudget)*100,100) : 0;
  const allExps = S.trips.flatMap(t=>(S.expenses[t.id]||[]).map(e=>({...e,tripName:t.name})));
  const upcoming = S.trips.filter(t=>t.status==='upcoming').length;
  const active = S.trips.filter(t=>t.status==='active').length;
  const catTotals = {};
  const catMeta = {Food:{i:'🍴',c:'#f59e0b'},Stay:{i:'🏨',c:'#3b82f6'},Transport:{i:'🚗',c:'#10b981'},Activity:{i:'🎭',c:'#8b5cf6'},Shopping:{i:'🛍',c:'#ec4899'},Other:{i:'📦',c:'#6b7280'}};
  allExps.forEach(e=>{catTotals[e.category]=(catTotals[e.category]||0)+e.amount;});
  const topCats = Object.entries(catTotals).sort((a,b)=>b[1]-a[1]);
  const maxCat = topCats[0]?.[1]||1;
  const recentExps = [...allExps].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  const barClr = totalPct<70?'var(--success)':totalPct<90?'var(--warn)':'var(--danger)';
  content.innerHTML=`
    <div class="dash-hero" id="dash-hero">
      <div class="dh-title">Trip Overview</div>
      <div class="dh-sub">${S.trips.length} trip${S.trips.length!==1?'s':''} · ${allExps.length} expense${allExps.length!==1?'s':''}</div>
      <div class="dh-stats">
        <div class="dh-stat"><div class="dv">${fmtSDual(totalBudget)}</div><div class="dl">Total Budget</div></div>
        <div class="dh-stat"><div class="dv">${fmtSDual(totalSpent)}</div><div class="dl">Total Spent</div></div>
        <div class="dh-stat"><div class="dv" style="${totalRem<0?'color:#fca5a5':'color:#86efac'}">${totalRem>=0?fmtSDual(totalRem):'-'+fmtSDual(-totalRem)}</div><div class="dl">${totalRem>=0?'Remaining':'Over budget'}</div></div>
      </div>
    </div>
    <div class="dash-grid">
      <div class="dash-card" id="dc-budget">
        <div class="dash-title">💰 Budget Progress</div>
        <div class="budget-labels">
          <span style="font-weight:600;color:var(--ink)">${fmtSDual(totalSpent)} spent</span>
          <span style="color:var(--ink3)">of ${fmtSDual(totalBudget)}</span>
        </div>
        <div class="budget-bar-wrap">
          <div class="budget-bar-bg">
            <div class="budget-bar-fill" style="width:${totalPct}%;background:${barClr}"></div>
          </div>
          <div class="budget-pct">${totalPct.toFixed(1)}% of total budget used</div>
        </div>
        <div style="margin-top:1rem">
          ${S.trips.map(t=>{
            const sp=(S.expenses[t.id]||[]).reduce((s,e)=>s+e.amount,0);
            const p=t.budget?Math.min((sp/t.budget)*100,100):0;
            const bc=p<70?'var(--success)':p<90?'var(--warn)':'var(--danger)';
            return `<div style="margin-bottom:.65rem">
              <div style="display:flex;justify-content:space-between;font-size:.72rem;margin-bottom:.25rem">
                <span style="font-weight:500">${t.emoji||'✈️'} ${esc(t.name)}</span>
                <span style="color:var(--ink3)">${fmtDual(sp,t,true)} / ${fmtDual(t.budget,t,true)}</span>
              </div>
              <div class="budget-bar-bg" style="height:7px">
                <div class="budget-bar-fill" style="width:${p}%;background:${bc};height:7px"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="dash-card" id="dc-cats">
        <div class="dash-title">📂 Spending by Category</div>
        ${topCats.length?`<div class="cat-breakdown">
          ${topCats.map(([cat,amt])=>{
            const m=catMeta[cat]||catMeta.Other;
            return `<div class="cat-row">
              <div class="cat-ico">${m.i}</div>
              <div class="cat-name">${esc(cat)}</div>
              <div class="cat-pct-bar"><div class="cat-pct-fill" style="width:${(amt/maxCat)*100}%;background:${m.c}"></div></div>
              <div class="cat-amt">${fmtSDual(amt)}</div>
            </div>`;
          }).join('')}
        </div>`:'<div class="dash-empty">No expenses yet</div>'}
      </div>
      <div class="dash-card" id="dc-trips">
        <div class="dash-title">🧳 Trip Status</div>
        <div class="cat-breakdown" style="margin-top:0">
          <div class="stat-row"><span class="sk">✈️ Upcoming</span><span class="sv" style="color:var(--blue)">${upcoming}</span></div>
          <div class="stat-row"><span class="sk">🟢 Active</span><span class="sv" style="color:var(--success)">${active}</span></div>
          <div class="stat-row"><span class="sk">✅ Completed</span><span class="sv">${S.trips.filter(t=>t.status==='completed').length}</span></div>
          <div class="stat-row"><span class="sk">📌 Total Stops</span><span class="sv">${Object.values(S.itineraries).reduce((s,a)=>s+a.length,0)}</span></div>
          <div class="stat-row"><span class="sk">💸 Avg/Trip</span><span class="sv">${S.trips.length?fmtSDual(totalSpent/S.trips.length):'—'}</span></div>
        </div>
      </div>
      <div class="dash-card" id="dc-recent" style="grid-column:span 2">
        <div class="dash-title">🕐 Recent Expenses</div>
        ${recentExps.length?`<div class="cat-breakdown" style="margin-top:0">
          ${recentExps.map(e=>{
            const m=(catMeta[e.category]||catMeta.Other);
            const eTrip = S.trips.find(x=>x.name===e.tripName);
            return `<div class="stat-row">
              <span class="sk" style="display:flex;align-items:center;gap:.4rem;font-size:.75rem">
                <span>${m.i}</span><span>${esc(e.description)}</span>
                <span style="color:var(--ink3);font-size:.68rem">${esc(e.tripName)}</span>
              </span>
              <span class="sv" style="font-size:.78rem">${fmtDual(e.amount,eTrip)}</span>
            </div>`;
          }).join('')}
        </div>`:'<div class="dash-empty">No expenses recorded</div>'}
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════
//  TRIP SUMMARY PANEL
// ═══════════════════════════════════════════════
function renderTripSummary(){
  const t = S.trips.find(x=>x.id===S.currentTrip); if(!t) return;
  const exps = S.expenses[t.id]||[];
  const spent = exps.reduce((s,e)=>s+e.amount,0);
  const rem = t.budget - spent;
  const pct = t.budget ? Math.min((spent/t.budget)*100,100) : 0;
  const barClr = pct<70?'var(--success)':pct<90?'var(--warn)':'var(--danger)';
  const catMeta = {Food:'🍴',Stay:'🏨',Transport:'🚗',Activity:'🎭',Shopping:'🛍',Other:'📦'};
  const catTotals = {};
  exps.forEach(e=>{catTotals[e.category]=(catTotals[e.category]||0)+e.amount;});
  const topCats = Object.entries(catTotals).sort((a,b)=>b[1]-a[1]);
  const maxCat = topCats[0]?.[1]||1;
  const days = t.start&&t.end ? Math.ceil((new Date(t.end)-new Date(t.start))/86400000) : null;
  const stops = (S.itineraries[t.id]||[]).length;
  const cur = getCurrencyForTrip(t);
  document.getElementById('trip-summary-content').innerHTML=`
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem">
      <div class="dash-card">
        <div class="dash-title">💰 Budget Progress <span class="currency-badge">${cur.code} ${cur.sym}</span></div>
        <div style="text-align:center;margin:.5rem 0 1rem">
          <div style="font-family:var(--ff);font-size:2rem;font-weight:800;color:${rem>=0?'var(--success)':'var(--danger)'}">${rem>=0?fmtDual(rem,t):'-'+fmtDual(-rem,t)}</div>
          <div style="font-size:.72rem;color:var(--ink3);margin-top:.2rem">${rem>=0?'remaining':'over budget'}</div>
        </div>
        <div class="budget-labels">
          <span style="font-weight:600">${fmtDual(spent,t)} spent</span>
          <span style="color:var(--ink3)">of ${fmtDual(t.budget,t)}</span>
        </div>
        <div class="budget-bar-wrap">
          <div class="budget-bar-bg" style="height:14px">
            <div class="budget-bar-fill" style="width:${pct}%;background:${barClr};height:14px"></div>
          </div>
          <div class="budget-pct">${pct.toFixed(1)}% of budget used</div>
        </div>
      </div>
      <div class="dash-card">
        <div class="dash-title">📂 Category Breakdown</div>
        ${topCats.length?`<div class="cat-breakdown">
          ${topCats.map(([cat,amt])=>`
            <div class="cat-row">
              <div class="cat-ico">${catMeta[cat]||'📦'}</div>
              <div class="cat-name">${esc(cat)}</div>
              <div class="cat-pct-bar"><div class="cat-pct-fill" style="width:${(amt/maxCat)*100}%"></div></div>
              <div class="cat-amt">${fmtDual(amt,t,true)}</div>
            </div>`).join('')}
        </div>`:'<div class="dash-empty" style="padding:1rem">No expenses yet</div>'}
      </div>
      <div class="dash-card">
        <div class="dash-title">📋 Trip Details</div>
        <div class="cat-breakdown" style="margin-top:0">
          <div class="stat-row"><span class="sk">📍 Destination</span><span class="sv">${esc(t.destination)||'TBD'}</span></div>
          <div class="stat-row"><span class="sk">💱 Currency</span><span class="sv">${cur.code} (${cur.sym})</span></div>
          <div class="stat-row"><span class="sk">📅 Duration</span><span class="sv">${days!==null?days+' days':'—'}</span></div>
          <div class="stat-row"><span class="sk">📌 Stops</span><span class="sv">${stops}</span></div>
          <div class="stat-row"><span class="sk">💸 Expenses</span><span class="sv">${exps.length}</span></div>
          <div class="stat-row"><span class="sk">🏷 Status</span><span class="sv" style="text-transform:capitalize">${t.status}</span></div>
          ${days&&spent&&days>0?`<div class="stat-row"><span class="sk">📆 Avg/day</span><span class="sv">${fmtDual(spent/days,t,true)}</span></div>`:''}
        </div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════
//  NOTES FOR ITINERARY STOPS
// ═══════════════════════════════════════════════
function saveStopNote(stopId, mode, val){
  const tid = mode==='trip' ? (document.getElementById('itin-trip-sel').value||S.currentTrip) : null;
  if(mode==='trip'&&tid){
    const stop = (S.itineraries[tid]||[]).find(s=>s.id===stopId);
    if(stop){ stop.notes=val; save(); }
  } else {
    const stop = S.globalStops.find(s=>s.id===stopId);
    if(stop){ stop.notes=val; save(); }
  }
}
function toggleNoteBox(stopId){
  const box = document.getElementById('nb-'+stopId);
  if(box){ box.classList.toggle('open'); if(box.classList.contains('open')) box.querySelector('textarea').focus(); }
}

// Enhanced stop list with notes
function renderStopList(stops, listId, mode){
  const el = document.getElementById(listId);
  if(!stops.length){
    el.innerHTML=`<div class="empty-itin"><div class="ei">🗺</div>${mode==='trip'?'Search and add stops to build your route':'Add stops to plan your route'}</div>`;
    return;
  }
  const snCls=['sn-1','sn-2','sn-3','sn-4','sn-5'];
  el.innerHTML = stops.map((s,i)=>`
    <div class="stop-item">
      <div class="stop-num ${snCls[i%5]||'sn-def'}">${i+1}</div>
      <div class="stop-body">
        <div class="stop-name">${s.icon||'📍'} ${esc(s.name)}</div>
        <div class="stop-addr">${esc(s.addr)}</div>
        ${s.distBadge?`<div class="dist-badge">📏 ${esc(s.distBadge)}</div>`:''}
        <div class="stop-notes-wrap">
          <button class="note-toggle" onclick="toggleNoteBox('${s.id}')">📝 ${s.notes?'Edit notes':'Add notes / ticket link'}</button>
          <div class="note-box ${s.notes?'open':''}" id="nb-${s.id}">
            <textarea class="note-input" rows="2" placeholder="Paste ticket URL, booking ref, or any note…" onchange="saveStopNote('${s.id}','${mode}',this.value)" onblur="saveStopNote('${s.id}','${mode}',this.value)">${esc(s.notes)||''}</textarea>
            <div class="note-hint">💡 Paste links to tickets, booking PDFs, or reservations</div>
            ${s.notes&&s.notes.startsWith('http')?`<a class="note-link" href="${esc(s.notes)}" target="_blank" rel="noopener">🔗 ${esc(s.notes).slice(0,50)}${s.notes.length>50?'…':''}</a>`:''}
          </div>
        </div>
      </div>
      <button class="stop-del" onclick="delStop('${s.id}','${mode}')">✕</button>
    </div>`).join('');
}

// ═══════════════════════════════════════════════
//  PDF EXPORT
// ═══════════════════════════════════════════════
function exportTripPDF(){
  const t = S.trips.find(x=>x.id===S.currentTrip); if(!t){toast('No trip selected','er');return;}
  const exps = S.expenses[t.id]||[];
  const spent = exps.reduce((s,e)=>s+e.amount,0);
  const rem = t.budget - spent;
  const stops = S.itineraries[t.id]||[];
  const cur = getCurrencyForTrip(t);
  const pdfFmt = (n) => {
    const s = fmtT(n, t);
    // Replace common non-ASCII currency symbols with ASCII equivalents
    return s.replace(/₹/g,'Rs').replace(/₩/g,'KRW ').replace(/₺/g,'TRY ')
            .replace(/₴/g,'UAH ').replace(/₦/g,'NGN ').replace(/₱/g,'PHP ')
            .replace(/₫/g,'VND ').replace(/฿/g,'THB ').replace(/৳/g,'BDT ')
            .replace(/₮/g,'MNT ').replace(/₡/g,'CRC ').replace(/₪/g,'ILS ')
            .replace(/﷼/g,'SAR ').replace(/د\.إ/g,'AED ').replace(/ر\.ق/g,'QAR ')
            .replace(/د\.ك/g,'KWD ').replace(/[^\x00-\x7F]/g,'');
  };
  const btn = document.querySelector('[onclick="exportTripPDF()"]');
  if(btn){btn.disabled=true;btn.innerHTML='⏳ Generating…';}
  try{
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
    const W=210,M=18,Y=(()=>{let y=M;return{get:()=>y,add:(n)=>y+=n,set:(n)=>y=n};})();
    // Header
    doc.setFillColor(232,82,26);doc.rect(0,0,W,28,'F');
    doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(20);
    doc.text('WanderPlan - Trip Report',M,18);
    doc.setFontSize(9);doc.setFont('helvetica','normal');
    doc.text(`Generated ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}`,W-M,18,{align:'right'});
    Y.set(38);
    // Trip title
    doc.setTextColor(17,24,39);doc.setFont('helvetica','bold');doc.setFontSize(16);
    doc.text(t.name,M,Y.get());Y.add(7);
    doc.setFont('helvetica','normal');doc.setFontSize(10);doc.setTextColor(75,85,99);
    doc.text(`Destination: ${t.destination||'TBD'}   Dates: ${t.start||'-'} to ${t.end||'-'}   Currency: ${cur.code} (${cur.sym.replace(/[^\x00-\x7F]/g,'')})`,M,Y.get());Y.add(10);
    // Budget summary box
    doc.setFillColor(249,248,245);doc.roundedRect(M,Y.get(),W-2*M,32,3,3,'F');
    doc.setDrawColor(229,231,235);doc.roundedRect(M,Y.get(),W-2*M,32,3,3,'S');
    doc.setTextColor(17,24,39);doc.setFont('helvetica','bold');doc.setFontSize(10);
    doc.text('Budget Summary',M+5,Y.get()+8);
    doc.setFontSize(9);doc.setFont('helvetica','normal');doc.setTextColor(75,85,99);
    const budRow = Y.get()+16;
    [['Total Budget',pdfFmt(t.budget)],['Total Spent',pdfFmt(spent)],['Remaining',rem>=0?pdfFmt(rem):'-'+pdfFmt(-rem)]].forEach(([l,v],i)=>{
      const x=M+5+(i*54);
      doc.setFont('helvetica','bold');doc.setTextColor(17,24,39);doc.setFontSize(10);doc.text(v,x,budRow);
      doc.setFont('helvetica','normal');doc.setTextColor(107,114,128);doc.setFontSize(7.5);doc.text(l,x,budRow+5);
    });
    // Progress bar
    const barY=Y.get()+26; const barW=W-2*M-10; const pct=t.budget?Math.min(spent/t.budget,1):0;
    doc.setFillColor(229,231,235);doc.roundedRect(M+5,barY,barW,4,2,2,'F');
    const fc=pct<.7?[22,163,74]:pct<.9?[217,119,6]:[220,38,38];
    doc.setFillColor(...fc);doc.roundedRect(M+5,barY,barW*pct,4,2,2,'F');
    Y.add(38);
    // Expenses
    if(exps.length){
      Y.add(6);
      if(Y.get()>240){doc.addPage();Y.set(M);}
      // Section header bar
      doc.setFillColor(232,82,26);doc.rect(M,Y.get()-4,W-2*M,10,'F');
      doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(255,255,255);
      doc.text('EXPENSES',M+4,Y.get()+2);
      doc.text(`(${exps.length} items)`,W-M-4,Y.get()+2,{align:'right'});
      Y.add(12);
      // Column headers
      doc.setFillColor(243,244,246);doc.rect(M,Y.get()-4,W-2*M,8,'F');
      doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(107,114,128);
      doc.text('DESCRIPTION',M+2,Y.get());
      doc.text('CATEGORY',M+100,Y.get());
      doc.text('DATE',M+130,Y.get());
      doc.text('AMOUNT',W-M-2,Y.get(),{align:'right'});
      Y.add(8);
      const sorted=[...exps].sort((a,b)=>new Date(b.date)-new Date(a.date));
      sorted.forEach((e,i)=>{
        if(Y.get()>270){doc.addPage();Y.set(M);}
        const rowY=Y.get();
        doc.setFillColor(i%2===0?249:255,i%2===0?248:255,i%2===0?245:255);
        doc.rect(M,rowY-4,W-2*M,8,'F');
        doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(17,24,39);
        doc.text(e.description.slice(0,38),M+2,rowY);
        doc.setTextColor(107,114,128);doc.text(e.category,M+100,rowY);
        doc.text(e.date,M+130,rowY);
        doc.setFont('helvetica','bold');doc.setTextColor(17,24,39);
        doc.text(pdfFmt(e.amount),W-M-2,rowY,{align:'right'});
        Y.add(8);
      });
      // Total row
      Y.add(2);doc.setFillColor(232,82,26);doc.rect(M,Y.get()-4,W-2*M,9,'F');
      doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(255,255,255);
      doc.text('TOTAL SPENT',M+2,Y.get()+1.5);doc.text(pdfFmt(spent),W-M-2,Y.get()+1.5,{align:'right'});
      Y.add(12);
    }
    // Itinerary
    if(stops.length){
      if(Y.get()>240){doc.addPage();Y.set(M);}
      doc.setFillColor(13,148,136);doc.rect(M,Y.get()-4,W-2*M,10,'F');
      doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(255,255,255);
      doc.text('ITINERARY STOPS',M+4,Y.get()+2);
      doc.text(`(${stops.length} stops)`,W-M-4,Y.get()+2,{align:'right'});
      Y.add(12);
      stops.forEach((s,i)=>{
        if(Y.get()>270){doc.addPage();Y.set(M);}
        doc.setFillColor(219,234,254);doc.circle(M+4,Y.get()-1.5,3.5,'F');
        doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(29,78,216);
        doc.text(String(i+1),M+4,Y.get()-0.5,{align:'center'});
        doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(17,24,39);
        doc.text(s.name.slice(0,55),M+10,Y.get());
        doc.setFont('helvetica','normal');doc.setTextColor(107,114,128);doc.setFontSize(7.5);
        doc.text(s.addr.slice(0,80),M+10,Y.get()+4.5);
        if(s.notes){
          doc.setTextColor(37,99,235);
          doc.text(`Note: ${s.notes.slice(0,65)}${s.notes.length>65?'...':''}`,M+10,Y.get()+9);
        }
        Y.add(s.notes?15:11);
      });
    }
    // Footer on all pages
    const totalPages = doc.internal.getNumberOfPages();
    for(let p=1;p<=totalPages;p++){
      doc.setPage(p);
      doc.setDrawColor(229,231,235);doc.line(M,287,W-M,287);
      doc.setFontSize(7.5);doc.setTextColor(156,163,175);
      doc.text('Generated by WanderPlan',M,292);
      doc.text(`Page ${p} of ${totalPages}`,W-M,292,{align:'right'});
    }
    doc.save(`${t.name.replace(/[^a-z0-9]/gi,'_')}_WanderPlan.pdf`);
    toast('📄 PDF downloaded!','ok');
  }catch(err){
    console.error(err); toast('PDF failed: '+err.message,'er');
  }finally{
    if(btn){btn.disabled=false;btn.innerHTML='📄 <span>Export PDF</span>';}
  }
}

function exportDashboardPDF(){
  if(!S.trips.length){toast('No trips to export','er');return;}
  const btn=document.getElementById('dash-pdf-btn');
  if(btn){btn.disabled=true;btn.innerHTML='⏳ Generating…';}
  try{
    const {jsPDF}=window.jspdf;
    const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
    const W=210,M=18;let y=M;
    doc.setFillColor(232,82,26);doc.rect(0,0,W,28,'F');
    doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(20);
    doc.text('WanderPlan - Dashboard Report',M,18);
    doc.setFontSize(9);doc.setFont('helvetica','normal');
    doc.text(new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}),W-M,18,{align:'right'});
    y=38;
    const totalBudget=S.trips.reduce((s,t)=>s+(t.budget||0),0);
    const totalSpent=S.trips.reduce((s,t)=>{return s+(S.expenses[t.id]||[]).reduce((a,e)=>a+e.amount,0);},0);
    doc.setTextColor(17,24,39);doc.setFont('helvetica','bold');doc.setFontSize(13);
    doc.text('All Trips Summary',M,y);y+=8;
    S.trips.forEach(t=>{
      if(y>265){doc.addPage();y=M;}
      const sp=(S.expenses[t.id]||[]).reduce((s,e)=>s+e.amount,0);
      const p=t.budget?Math.min(sp/t.budget,1):0;
      const tpdfFmt = (n) => fmtT(n,t).replace(/[^\x00-\x7F]/g,'');
      doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(17,24,39);
      doc.text(`${t.name}`,M,y);
      doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(75,85,99);
      doc.text(`${t.destination||'TBD'} - ${t.status} - ${getCurrencyForTrip(t).code}`,M,y+5);
      doc.text(`Budget: ${tpdfFmt(t.budget)}  Spent: ${tpdfFmt(sp)}  Remaining: ${tpdfFmt(t.budget-sp)}`,M,y+10);
      const bw=W-2*M-10;
      doc.setFillColor(229,231,235);doc.roundedRect(M,y+14,bw,3.5,1,1,'F');
      const fc=p<.7?[22,163,74]:p<.9?[217,119,6]:[220,38,38];
      doc.setFillColor(...fc);if(p>0)doc.roundedRect(M,y+14,bw*p,3.5,1,1,'F');
      y+=22;
    });
    y+=4;doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(17,24,39);
    const dashPdfFmt = (n) => fmt(n).replace(/[^\x00-\x7F]/g,'');
    doc.text(`Totals: Budget ${dashPdfFmt(totalBudget)}  /  Spent ${dashPdfFmt(totalSpent)}  /  Remaining ${dashPdfFmt(totalBudget-totalSpent)}`,M,y);
    doc.setFontSize(7.5);doc.setTextColor(156,163,175);doc.text('Generated by WanderPlan',M,292);
    doc.save('WanderPlan_Dashboard.pdf');
    toast('📄 Dashboard PDF downloaded!','ok');
  }catch(err){console.error(err);toast('PDF failed: '+err.message,'er');}
  finally{if(btn){btn.disabled=false;btn.innerHTML='📄 <span>Export PDF</span>';}}
}

// ─── DATE FIELD CONSTRAINTS ───
document.addEventListener('DOMContentLoaded', () => {
  const startEl = document.getElementById('t-start');
  const endEl = document.getElementById('t-end');
  if (startEl && endEl) {
    // When start changes, update end's min
    startEl.addEventListener('change', () => {
      endEl.min = startEl.value || '';
      if (endEl.value && endEl.value < startEl.value) endEl.value = startEl.value;
    });
    // End date cannot be before today (only enforce on new trips, done in submitTrip for edits)
    endEl.addEventListener('change', () => {
      if (startEl.value && endEl.value < startEl.value) {
        toast('End date must be after start date', 'er');
        endEl.value = startEl.value;
      }
    });
  }
});

// ═══════════════════════════════════════════════
//  INIT PICKERS
// ═══════════════════════════════════════════════
const EMOJIS = ['✈️','🌴','🗼','🏔️','🏖️','🗺️','🎒','🌍','🚂','🛳️','🏕️','🌸'];
const CATS = [
  {v:'Food',i:'🍴',l:'Food'},
  {v:'Stay',i:'🏨',l:'Stay'},
  {v:'Transport',i:'🚗',l:'Travel'},
  {v:'Activity',i:'🎭',l:'Activity'},
  {v:'Shopping',i:'🛍',l:'Shopping'},
  {v:'Other',i:'📦',l:'Other'},
];

function initPickers() {
  // Emoji picker
  const eg = document.getElementById('emoji-grid');
  if (eg && !eg.children.length) {
    eg.innerHTML = EMOJIS.map((e,i) =>
      `<button type="button" class="eo${i===0?' sel':''}" onclick="pickEmoji(this,'${e}')">${e}</button>`
    ).join('');
  }
  // Category picker
  const cp = document.getElementById('cat-picker');
  if (cp && !cp.children.length) {
    cp.innerHTML = CATS.map((c,i) =>
      `<button type="button" class="co${i===0?' sel':''}" onclick="pickCat(this,'${c.v}')">${c.i} ${c.l}</button>`
    ).join('');
  }
}
document.addEventListener('DOMContentLoaded', initPickers);
// Also call immediately in case DOM is already ready
if (document.readyState !== 'loading') initPickers();

// ─── INIT ───
load();
