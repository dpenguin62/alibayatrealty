/* Ali Bayat Realty: generated from src/site.html by build.py */
(function(){
"use strict";
/* ---------- In-page jumps ---------- */
function jumpTo(id){const t=document.getElementById(id);if(!t)return;t.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});t.classList.remove("flash");void t.offsetWidth;t.classList.add("flash")}
document.addEventListener("click",e=>{const s=e.target.closest("[data-step]");if(s)jumpTo(s.dataset.step);const j=e.target.closest("[data-jump]");if(j)jumpTo(j.dataset.jump)});
/* ---------- Knowledge centre ---------- */
const CATS=[
 {id:"buying",name:"Buying Guides",d:"From budget to closing day."},
 {id:"selling",name:"Selling Guides",d:"Preparing, pricing and selling."},
 {id:"investment",name:"Investment",d:"Analyzing income properties: cash flow, cap rate, financing and strategy."},
 {id:"market",name:"GTA Market Insights",d:"Monthly notes by area, from board data."},
 {id:"areas",name:"Neighbourhood Guides",d:"What it's like to live in each community."},
 {id:"tips",name:"Real Estate Tips",d:"Short answers to common questions."}];
/* Only published guides ship. Unwritten guides live in the prototype block below and are stripped from the
   production build (no cards, no status labels, no unbuilt URLs in the page or in site.js). To publish one,
   write the page, add its route, then move its entry above with href and pub:1. */
const ARTS=[
 {c:"buying",t:"Land transfer tax in Toronto vs. York Region, with a calculator",d:"Why the same price costs more to close on in North York than in Vaughan.",u:"/resources/buying/land-transfer-tax-toronto-york-region/",href:"#guide-land-transfer-tax",pub:1},
 {c:"buying",t:"Buying your first home in Toronto",d:"Every cost on an $800,000 first home, and the six steps from pre-approval to keys.",u:"/resources/buying/first-home-toronto/",href:"#guide-first-home",pub:1},
 {c:"buying",t:"Pre-construction condos: what to check before you sign",d:"The 10-day cooling-off period, deposit protection, occupancy fees and the red flags.",u:"/resources/buying/pre-construction-condo-questions/",href:"#guide-pre-construction",pub:1},
 {c:"selling",t:"What's worth fixing before you list",d:"Fix, maybe, skip: where your prep money goes furthest, and a four-week plan.",u:"/resources/selling/what-to-fix-before-listing/",href:"#guide-fix-before-listing",pub:1},
 {c:"selling",t:"Offer dates vs. pricing to market",d:"How each strategy works, the TRESA rules, and when each tends to make sense.",u:"/resources/selling/offer-date-vs-pricing-to-market/",href:"#guide-offer-date",pub:1},
 {c:"investment",t:"Investment property analysis: a six-step framework",d:"The six steps from property review to a decision, with the questions at each.",u:"/resources/investment/investment-analysis/",href:"#guide-investment-analysis",pub:1},
 {c:"investment",t:"How to calculate cash flow on a rental property",d:"From gross rent to what's left after vacancy, expenses and the mortgage.",u:"/resources/investment/cash-flow/",href:"#guide-cash-flow",pub:1},
 {c:"investment",t:"What is cap rate, and what it doesn't tell you",d:"How to calculate it, how to compare with it, and its limits.",u:"/resources/investment/cap-rate/",href:"#guide-cap-rate",pub:1},
 {c:"investment",t:"Financing an investment property: what to ask",d:"Down payments, lender rules, and the questions to bring to a mortgage professional.",u:"/resources/investment/financing/",href:"#guide-investment-financing",pub:1},
 {c:"investment",t:"Duplexes, triplexes and fourplexes in the GTA",d:"What's permitted, how financing changes with unit count, and what to verify.",u:"/resources/investment/duplexes-triplexes-fourplexes/",href:"#guide-multiplexes",pub:1},
 {c:"investment",t:"Cash flow vs. appreciation: choosing a strategy",d:"Two reasons to own a property, the trade-offs, and the risks of each.",u:"/resources/investment/investor-strategy/",href:"#guide-investor-strategy",pub:1},
 {c:"market",t:"Market notes, October 2026: Toronto vs. York Region",d:"October sales, prices and inventory in the City of Toronto and York Region.",u:"/resources/market/2026-10-toronto-york-region/",href:"#guide-market-toronto-york",pub:1},
 {c:"market",t:"Market notes, October 2026: Vaughan, Richmond Hill and Markham",d:"Vaughan, Richmond Hill and Markham side by side for October.",u:"/resources/market/2026-10-york-region/",href:"#guide-market-york-region",pub:1},
 {c:"tips",t:"How to read a condo status certificate",d:"The pages that matter and the red flags to look for.",u:"/resources/tips/condo-status-certificate/",href:"#guide-status-certificate",pub:1},
 {c:"tips",t:"Home inspections in the GTA: what to expect",d:"What inspectors check and how to use the report.",u:"/resources/tips/home-inspection-gta/",href:"#guide-home-inspection",pub:1},
 {c:"tips",t:"Choosing a contractor after you buy",d:"Quotes, contracts, permits and payment schedules.",u:"/resources/tips/choosing-a-contractor/",href:"#guide-contractor",pub:1},
 {c:"buying",t:"Buying in Toronto from abroad: what changes",d:"Status, the 25% non-resident tax, federal limits, and closing at a distance.",u:"/resources/buying/buying-toronto-from-abroad/",href:"#guide-buying-from-abroad",pub:1},
 {c:"buying",t:"Condo or detached along Yonge: the cost trade-offs",d:"Fees, upkeep, risk and resale compared line by line.",u:"/resources/buying/condo-vs-detached-yonge-corridor/",href:"#guide-condo-vs-detached",pub:1},
 {c:"tips",t:"Three deal notes: how the numbers changed the decision",d:"Illustrative examples of the checks I run before an offer or a list price.",u:"/resources/tips/deal-notes-how-numbers-change-decisions/",href:"#guide-deal-notes",pub:1},
 {c:"areas",t:"North York neighbourhood guide",d:"Condo corridor, bungalow streets, transit and advice.",u:"/neighbourhoods/north-york/",href:"#north-york",pub:1},
 {c:"areas",t:"Thornhill: the Vaughan side vs. the Markham side",d:"How the two halves differ on taxes, services and housing.",u:"/neighbourhoods/thornhill/",href:"#thornhill",pub:1},
 {c:"areas",t:"Richmond Hill neighbourhood guide",d:"Downtown Richmond Hill, Oak Ridges, the Yonge corridor and the GO line.",u:"/neighbourhoods/richmond-hill/",href:"#richmond-hill",pub:1},
 {c:"areas",t:"Vaughan neighbourhood guide",d:"Woodbridge, Maple, Kleinburg and the VMC.",u:"/neighbourhoods/vaughan/",href:"#vaughan",pub:1},
 {c:"areas",t:"Toronto neighbourhood guide",d:"Victorian semis, midtown family streets, downtown condos and the extra land transfer tax.",u:"/neighbourhoods/toronto/",href:"#toronto",pub:1}];
let activeCat="all";
function renderKC(){
  if(!document.getElementById("chips"))return;
  const arts=ARTS.filter(a=>a.pub||!window.__publishedOnly);  // build.py sets __publishedOnly before capturing the page
  const cats=CATS.filter(c=>arts.some(a=>a.c===c.id));
  document.getElementById("chips").innerHTML=[{id:"all",name:"All"},...cats].map(c=>`<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${c.id===activeCat}">${c.name}</button>`).join("");
  document.getElementById("kc").innerHTML=cats.filter(c=>activeCat==="all"||c.id===activeCat).map(c=>`<section class="kc-cat"><div class="intro"><h2>${c.name}</h2><p>${c.d}</p></div><div class="arts">${arts.filter(a=>a.c===c.id).map(a=>{const tag=a.href?"a":"div";return `<${tag} class="art"${a.href?` href="${STATIC?a.u:a.href}"`:""}><h3>${a.t}</h3>${a.st?`<span class="status">${a.st}</span>`:""}<p>${a.d}</p></${tag}>`}).join("")}</div></section>`).join("")}
document.addEventListener("click",e=>{const b=e.target.closest("[data-cat]");if(!b||!document.getElementById("chips"))return;activeCat=b.dataset.cat;renderKC()});
/* Farsi Resources tabs: the list is static (built from GUIDES_FA); the tabs only show or hide its sections. */
document.addEventListener("click",e=>{const b=e.target.closest("[data-fa-cat]");if(!b)return;const c=b.dataset.faCat;document.querySelectorAll("[data-fa-cat]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));document.querySelectorAll("[data-fa-sec]").forEach(x=>x.hidden=c!=="all"&&x.dataset.faSec!==c)});
/* ---------- Calculators: shared parsing, tax constants, side-by-side land transfer tax, deal screen ---------- */
const ON_FTB_MAX=4000,TO_FTB_MAX=4475;
const ON=[[55000,.005],[250000,.01],[400000,.015],[2000000,.02],[Infinity,.025]];
const TO=[[55000,.005],[250000,.01],[400000,.015],[2000000,.02],[3000000,.025],[4000000,.044],[5000000,.0545],[10000000,.065],[20000000,.0755],[Infinity,.086]];
const LTT_ILLUSTRATION={rate:5,years:25};
const INPUT_MAX={price:1e8,annual:1e7,monthly:1e6,pct:100,rate:30};
function tiered(p,br){let t=0,prev=0;for(const [cap,r] of br){if(p>prev)t+=(Math.min(p,cap)-prev)*r;prev=cap}return Math.round(t*100)/100}
window.__ltt={tiered,ON,TO};
const fmt=n=>isFinite(n)?n.toLocaleString("en-CA",{style:"currency",currency:"CAD",maximumFractionDigits:0}):"—";
const fmtS=n=>isFinite(n)?(n<0?"−":"")+fmt(Math.abs(n)):"—";
const pctF=n=>isFinite(n)?(n<0?"−":"")+(Math.round(Math.abs(n)*100)/100).toLocaleString("en-CA",{minimumFractionDigits:2,maximumFractionDigits:2})+"%":"—";
/* Number typed on any keyboard: Persian ۰-۹ and Arabic-Indic ٠-٩ digits, ٫ decimal mark, ٬ thousands mark. */
const latinDigits=s=>String(s).replace(/[۰-۹]/g,d=>d.charCodeAt(0)-1776).replace(/[٠-٩]/g,d=>d.charCodeAt(0)-1632);
/* parseAmount never returns NaN or Infinity. flag: ok | zero | blank | neg | invalid | max. Negative, invalid and blank give 0; too large is capped. */
function parseAmount(raw,max){
  let s=latinDigits(raw==null?"":raw).replace(/٫/g,".").replace(/CAD|[٬,\s'’$]/gi,"");
  const neg=/^[-−–]/.test(s)||/^\(.*\)$/.test(s);
  s=s.replace(/^[-−–+]/,"").replace(/[()]/g,"");
  if(s==="")return{v:0,flag:"blank"};
  if(!/^(\d+\.?\d*|\.\d+)$/.test(s))return{v:0,flag:"invalid"};
  const v=parseFloat(s);
  if(!isFinite(v)||v>max)return{v:max,flag:"max"};
  if(neg&&v>0)return{v:0,flag:"neg"};
  return{v,flag:v===0?"zero":"ok"}}
const isFA=el=>!!(el&&el.closest('[lang="fa"]'))||document.documentElement.lang==="fa";
/* One reader for every calculator field. Problems are collected and shown in the calculator's own live region. */
function reader(warns,fa){
  return (id,max)=>{const el=document.getElementById(id);if(!el)return 0;const r=parseAmount(el.value,max);
    const bad=r.flag==="invalid"||r.flag==="neg"||r.flag==="max";el.setAttribute("aria-invalid",String(bad));
    if(bad){const lab=document.querySelector(`label[for="${id}"]`),name=lab?lab.textContent.replace(/\(.*?\)/g,"").trim():id;
      warns.push(fa?(r.flag==="max"?`${name}: بیشتر از سقف مجاز بود و به ${fmt(max)} کاهش یافت.`:r.flag==="neg"?`${name}: مقدار منفی استفاده نمی‌شود و صفر در نظر گرفته شد.`:`${name}: عدد قابل‌استفاده نیست و صفر در نظر گرفته شد.`)
        :(r.flag==="max"?`${name}: capped at ${fmt(max)}.`:r.flag==="neg"?`${name}: negative amounts aren't used, so it's treated as 0.`:`${name}: that isn't a number I can use, so it's treated as 0.`))}
    return r.v}}
function showWarns(id,warns){const el=document.getElementById(id);if(!el)return;el.hidden=!warns.length;el.textContent=warns.join(" ")}
function mortgageAnnual(loan,ratePct,years){
  if(!(loan>0)||!(years>0))return 0;const n=years*12;
  if(!(ratePct>0))return loan/n*12;
  const i=Math.pow(1+ratePct/100/2,1/6)-1; /* Canadian fixed-rate convention: semi-annual compounding, monthly payments */
  const a=loan*i/(1-Math.pow(1+i,-n))*12;return isFinite(a)?a:0}
const blurMoney=(el,max)=>el.addEventListener("blur",()=>{const r=parseAmount(el.value,max);el.value=r.flag==="blank"||r.flag==="invalid"?el.value.trim():Math.round(r.v).toLocaleString("en-CA")});
/* ---------- Land transfer tax: North vs. South of Steeles ---------- */
/* South of Steeles = City of Toronto (Ontario tax + Toronto municipal tax). North = York Region (Ontario tax only). */
function lttCompare(price,first){
  const on=tiered(price,ON),onReb=first?Math.min(on,ON_FTB_MAX):0,to=tiered(price,TO),toReb=first?Math.min(to,TO_FTB_MAX):0;
  const north=on-onReb,south=north+to-toReb;return{on,onReb,to,toReb,north,south,gap:south-north}}
window.__lttCompare=lttCompare;
const LT={
 en:{enter:"Enter a purchase price to compare.",gap:"South of Steeles costs more to close on at this price. The difference is paid in cash at closing and can't be added to the mortgage.",
  ftb:"Includes the Ontario and Toronto first-time buyer rebates, if you qualify. Your lawyer checks eligibility and confirms the final amount.",
  fin:(m,r,y)=>`${fmt(m)} a month`,
  offNone:"Enter the annual property tax for both homes to see how carrying costs change the picture.",
  offNorth:(d,yrs)=>yrs>50?`North of Steeles carries ${fmt(d)} a year more in property tax, but that takes over 50 years to use up the closing-cost savings.`:`North of Steeles carries ${fmt(d)} a year more in property tax. At these figures that uses up the closing-cost savings in about ${yrs<1?"under a year":Math.round(yrs*10)/10+" years"}.`,
  offSouth:"At these figures North of Steeles costs less both at closing and to carry.",
  offEven:"At these figures the annual property tax is the same, so the closing-cost gap is the whole difference."},
 fa:{enter:"برای مقایسه، قیمت خرید را وارد کنید.",gap:"در این قیمت، بستن معامله در جنوب استیلز هزینه‌ی بیشتری دارد. این تفاوت هنگام بستن معامله نقدی پرداخت می‌شود و به وام اضافه نمی‌شود.",
  ftb:"شامل بازپرداخت‌های خریدار خانه‌ی اول انتاریو و تورنتو، اگر واجد شرایط باشید. شرایط را وکیل شما بررسی و مبلغ نهایی را تأیید می‌کند.",
  fin:(m)=>`${fmt(m)} در ماه`,
  offNone:"مالیات سالانه‌ی ملک را برای هر دو خانه وارد کنید تا اثر هزینه‌ی نگهداری را ببینید.",
  offNorth:(d,yrs)=>yrs>50?`شمال استیلز سالانه ${fmt(d)} مالیات ملک بیشتر دارد، اما مصرف‌شدن صرفه‌جویی هزینه‌ی بستن معامله بیش از ۵۰ سال طول می‌کشد.`:`شمال استیلز سالانه ${fmt(d)} مالیات ملک بیشتر دارد. با این اعداد، صرفه‌جویی هزینه‌ی بستن معامله حدود ${yrs<1?"کمتر از یک سال":Math.round(yrs*10)/10+" سال"} طول می‌کشد تا مصرف شود.`,
  offSouth:"با این اعداد، شمال استیلز هم هنگام بستن معامله و هم در هزینه‌ی نگهداری ارزان‌تر است.",
  offEven:"با این اعداد، مالیات سالانه‌ی ملک یکسان است و تفاوت فقط همان هزینه‌ی بستن معامله است."}};
function calc(){
  if(!document.getElementById("lt-price"))return;
  const fa=isFA(document.getElementById("lt-price")),T=fa?LT.fa:LT.en,W=[],rd=reader(W,fa);
  const price=rd("lt-price",INPUT_MAX.price),first=document.getElementById("lt-first").checked;
  const rate=rd("lt-rate",INPUT_MAX.rate),taxN=rd("lt-tax-n",INPUT_MAX.annual),taxS=rd("lt-tax-s",INPUT_MAX.annual);
  const c=lttCompare(price,first),set=(id,t)=>{const e=document.getElementById(id);if(e)e.textContent=t};
  set("o-n-on",fmt(c.on));set("o-s-on",fmt(c.on));set("o-n-onr",c.onReb?"−"+fmt(c.onReb):fmt(0));set("o-s-onr",c.onReb?"−"+fmt(c.onReb):fmt(0));
  set("o-n-to","—");set("o-s-to",fmt(c.to));set("o-n-tor","—");set("o-s-tor",c.toReb?"−"+fmt(c.toReb):fmt(0));
  set("o-n-total",fmt(c.north));set("o-s-total",fmt(c.south));
  document.getElementById("o-onr-row").hidden=!first;document.getElementById("o-tor-row").hidden=!first;
  set("o-gap",fmt(c.gap));
  set("o-gap-pct",price>0?pctF(c.gap/price*100):"—");
  const m=c.gap>0?mortgageAnnual(c.gap,rate||LTT_ILLUSTRATION.rate,LTT_ILLUSTRATION.years)/12:0;
  set("o-gap-m",c.gap>0?T.fin(m,rate||LTT_ILLUSTRATION.rate,LTT_ILLUSTRATION.years):fmt(0));
  const both=taxN>0&&taxS>0,row=document.getElementById("o-carry-row"),yrRow=document.getElementById("o-years-row");
  row.hidden=!both;yrRow.hidden=!both;
  let carry=T.offNone;
  if(both){const d=taxN-taxS;set("o-carry",fmtS(d));
    if(d>0){const yrs=c.gap/d;set("o-years",yrs>50?">50":String(Math.round(yrs*10)/10));carry=T.offNorth(d,yrs)}
    else{set("o-years","—");carry=d<0?T.offSouth:T.offEven}}
  set("o-note",!price?T.enter:(first?T.ftb+" ":"")+T.gap);
  set("o-carry-note",carry);
  showWarns("lt-warn",W)}
const pr=document.getElementById("lt-price");
if(pr){["lt-price","lt-rate","lt-tax-n","lt-tax-s"].forEach(id=>document.getElementById(id).addEventListener("input",calc));
 blurMoney(pr,INPUT_MAX.price);["lt-tax-n","lt-tax-s"].forEach(id=>blurMoney(document.getElementById(id),INPUT_MAX.annual));
 document.getElementById("lt-first").addEventListener("change",calc)}
/* Stage-matched entry points ("check closing costs at your price") hand the price over in the URL (built site) or the tab (prototype). */
function lttHandoff(){
  const el=document.getElementById("lt-price");if(!el)return;let v=STATIC?params.get("price"):null;
  if(!v){try{v=sessionStorage.getItem("abr-price");sessionStorage.removeItem("abr-price")}catch(e){}}
  if(!v)return;const r=parseAmount(v,INPUT_MAX.price);if(r.v>0){el.value=Math.round(r.v).toLocaleString("en-CA");
    if(STATIC&&params.get("first")==="1")document.getElementById("lt-first").checked=true;calc()}}
document.addEventListener("click",e=>{const a=e.target.closest("[data-cc-go]");if(!a)return;
  const box=a.closest("[data-cc]"),inp=box&&box.querySelector("input"),r=parseAmount(inp?inp.value:"",INPUT_MAX.price);
  if(!(r.v>0)){e.preventDefault();if(inp){inp.setAttribute("aria-invalid","true");inp.focus()}return}
  inp.setAttribute("aria-invalid","false");const p=Math.round(r.v);
  try{sessionStorage.setItem("abr-price",String(p))}catch(err){}
  if(STATIC){e.preventDefault();location.href=a.getAttribute("href").split("#")[0].split("?")[0]+"?price="+p+"#calc"}});
document.addEventListener("keydown",e=>{if(e.key!=="Enter")return;const inp=e.target.closest&&e.target.closest("[data-cc] input");if(!inp)return;e.preventDefault();const a=inp.closest("[data-cc]").querySelector("[data-cc-go]");if(a)a.click()});
document.querySelectorAll("[data-cc] input").forEach(i=>blurMoney(i,INPUT_MAX.price));
/* ---------- Investment deal screen (educational) ---------- */
function dealCalc(){
  const priceEl=document.getElementById("iv-price");if(!priceEl)return null;
  const fa=isFA(priceEl),W=[],rd=reader(W,fa);
  const price=rd("iv-price",INPUT_MAX.price),down=Math.min(100,rd("iv-down",INPUT_MAX.pct)),rate=rd("iv-rate",INPUT_MAX.rate),yrs=parseInt(document.getElementById("iv-amort").value,10)||25;
  const rentM=rd("iv-rent",INPUT_MAX.monthly),vacP=Math.min(100,rd("iv-vac",INPUT_MAX.pct));
  const tax=rd("iv-tax",INPUT_MAX.annual),condoM=rd("iv-condo",INPUT_MAX.monthly),ins=rd("iv-ins",INPUT_MAX.annual),maint=rd("iv-maint",INPUT_MAX.annual),util=rd("iv-util",INPUT_MAX.annual),other=rd("iv-other",INPUT_MAX.annual);
  const loc=document.getElementById("iv-loc").value;
  const gross=rentM*12,vac=gross*vacP/100,eff=gross-vac,opex=tax+condoM*12+ins+maint+util+other,noi=eff-opex;
  const dpay=price*down/100,debt=mortgageAnnual(price-dpay,rate,yrs),cf=noi-debt;
  const ltt=loc==="to"?tiered(price,ON)+tiered(price,TO):loc==="on"?tiered(price,ON):0; /* investors don't qualify for first-time buyer rebates */
  const cash=dpay+ltt,cap=price>0?noi/price*100:NaN,coc=cash>0?cf/cash*100:NaN;
  const beRent=vacP<100?(opex+debt)/(12*(1-vacP/100)):NaN;
  return{fa,W,price,down,rate,yrs,rentM,vacP,tax,condoM,ins,maint,util,other,loc,gross,vac,eff,opex,noi,dpay,debt,cf,ltt,cash,cap,coc,beRent}}
function invCalc(){
  const d=dealCalc();if(!d)return;const FA=d.fa;
  const set=(id,t,neg)=>{const el=document.getElementById(id);if(!el)return;el.textContent=t;el.classList.toggle("neg",!!neg)};
  set("iv-o-gross",fmt(d.gross));set("iv-o-vac",d.vac?"−"+fmt(d.vac):fmt(0));set("iv-o-eff",fmt(d.eff));
  set("iv-o-opex",d.opex?"−"+fmt(d.opex):fmt(0));set("iv-o-noi",fmtS(d.noi),d.noi<0);
  set("iv-o-debt",d.debt?"−"+fmt(d.debt):fmt(0));set("iv-o-cf",fmtS(d.cf),d.cf<0);set("iv-o-cfm",fmtS(d.cf/12),d.cf<0);
  set("iv-o-cap",d.price>0?pctF(d.cap):"—",d.noi<0);
  set("iv-o-coc",d.cash>0?pctF(d.coc):"—",d.cf<0);
  set("iv-o-cash",fmt(d.cash));
  set("iv-o-be",isFinite(d.beRent)&&d.price>0?fmt(d.beRent):"—");
  const hasIn=d.price>0&&d.rentM>0,note=document.getElementById("iv-o-note"),lev=document.getElementById("iv-o-lev");
  note.textContent=!hasIn?(FA?"برای دیدن برآورد، قیمت خرید و اجاره‌ی ماهانه را وارد کنید.":"Enter a purchase price and monthly rent to see an estimate.")
    :d.cf<0?(FA?`با این فرض‌ها، این ملک ماهانه حدود ${fmt(Math.abs(d.cf)/12)} علاوه بر اجاره از جیب شما هزینه می‌خواهد. برخی سرمایه‌گذاران این را در ازای رشد احتمالی ارزش ملک و بازپرداخت اصل وام می‌پذیرند، اما هیچ‌کدام تضمین‌شده نیست.`:`At these assumptions the property would need about ${fmt(Math.abs(d.cf)/12)} a month from you on top of the rent. Some investors accept that in exchange for potential appreciation and mortgage paydown, but neither is guaranteed.`)
    :(FA?`با این فرض‌ها مثبت است: حدود ${fmt(d.cf/12)} در ماه، پیش از مالیات بر درآمد. نرخ بهره، خالی ماندن یا هزینه‌ی نگهداری بالاتری را امتحان کنید تا ببینید چقدر حاشیه دارید.`:`Positive at these assumptions, about ${fmt(d.cf/12)} a month before income tax. Try a higher interest rate, vacancy or maintenance figure to see how much room there is.`);
  /* Rentals you won't live in generally need 20% down; flag lower entries without blocking them. */
  if(hasIn&&d.down<20)note.textContent=(FA?"توجه: برای ملکی که خودتان در آن زندگی نمی‌کنید، معمولاً دست‌کم ۲۰٪ پیش‌پرداخت لازم است؛ شرایط را از وام‌دهنده بپرسید. ":"Note: a property you won't live in generally needs at least 20% down; check with your lender. ")+note.textContent;
  /* Negative leverage: the property earns less than the money costs. */
  const neg=hasIn&&d.price>0&&d.down<100&&d.cap<d.rate;
  lev.hidden=!neg;lev.textContent=neg?(FA?`نرخ بازده سرمایه (${pctF(d.cap)}) کمتر از نرخ بهره‌ی وام (${pctF(d.rate)}) است؛ یعنی هزینه‌ی وام از درآمد خود ملک بیشتر است و اهرم وام به جریان نقدی ضرر می‌زند.`:`Cap rate (${pctF(d.cap)}) is below the mortgage rate (${pctF(d.rate)}): borrowing costs more than the property earns, so the loan works against cash flow.`):"";
  showWarns("iv-warn",d.W)}
window.__inv={mortgageAnnual,invCalc,dealCalc};
document.querySelectorAll("[data-iv]").forEach(el=>{
  el.addEventListener(el.tagName==="SELECT"?"change":"input",invCalc);
  if(el.dataset.iv==="money")blurMoney(el,INPUT_MAX.annual)});
/* Hand the screen to the contact form: numbers only, kept in this tab's sessionStorage (see LEADS.md). */
function dealSnapshot(){const d=dealCalc();if(!d||!(d.price>0))return null;
  return{v:1,price:d.price,rentM:d.rentM,tax:d.tax,condoM:d.condoM,down:d.down,rate:d.rate,yrs:d.yrs,loc:d.loc,vacP:d.vacP,ins:d.ins,maint:d.maint,util:d.util,other:d.other}}
document.addEventListener("click",e=>{if(!e.target.closest("[data-deal-send]"))return;const s=dealSnapshot();try{if(s)sessionStorage.setItem("abr-deal",JSON.stringify(s));else sessionStorage.removeItem("abr-deal")}catch(err){}});
/* Rebuild everything from the stored numbers, never from stored text. Returns null if nothing valid is stored. */
function readDeal(){
  let o=null;try{o=JSON.parse(sessionStorage.getItem("abr-deal")||"null")}catch(e){}
  if(!o||o.v!==1)return null;const n=(k,max)=>parseAmount(o[k],max).v;
  const d={price:n("price",INPUT_MAX.price),rentM:n("rentM",INPUT_MAX.monthly),tax:n("tax",INPUT_MAX.annual),condoM:n("condoM",INPUT_MAX.monthly),down:Math.min(100,n("down",INPUT_MAX.pct)),rate:n("rate",INPUT_MAX.rate),
    yrs:o.yrs===30?30:25,loc:["to","on","other"].includes(o.loc)?o.loc:"to",vacP:Math.min(100,n("vacP",INPUT_MAX.pct)),ins:n("ins",INPUT_MAX.annual),maint:n("maint",INPUT_MAX.annual),util:n("util",INPUT_MAX.annual),other:n("other",INPUT_MAX.annual)};
  if(!(d.price>0))return null;
  d.gross=d.rentM*12;d.eff=d.gross*(1-d.vacP/100);d.opex=d.tax+d.condoM*12+d.ins+d.maint+d.util+d.other;d.noi=d.eff-d.opex;
  d.dpay=d.price*d.down/100;d.debt=mortgageAnnual(d.price-d.dpay,d.rate,d.yrs);d.cf=d.noi-d.debt;
  d.ltt=d.loc==="to"?tiered(d.price,ON)+tiered(d.price,TO):d.loc==="on"?tiered(d.price,ON):0;d.cash=d.dpay+d.ltt;
  d.cap=d.noi/d.price*100;d.coc=d.cash>0?d.cf/d.cash*100:NaN;return d}
const locName={to:"City of Toronto",on:"York Region / elsewhere in Ontario",other:"Land transfer tax not included"};
function dealText(d){return`Price ${fmt(d.price)} · rent ${fmt(d.rentM)}/mo · property tax ${fmt(d.tax)}/yr · condo fees ${fmt(d.condoM)}/mo · maintenance ${fmt(d.maint)}/yr · insurance ${fmt(d.ins)}/yr · utilities ${fmt(d.util)}/yr · other ${fmt(d.other)}/yr · vacancy ${pctF(d.vacP)} · down payment ${pctF(d.down)} · rate ${pctF(d.rate)} · ${d.yrs}-yr amortization · ${locName[d.loc]}\nScreen result: NOI ${fmtS(d.noi)}/yr · cap rate ${pctF(d.cap)} · cash flow ${fmtS(d.cf)}/yr (${fmtS(d.cf/12)}/mo) · cash-on-cash ${pctF(d.coc)} on ${fmt(d.cash)} (down payment + land transfer tax)`}
function initDealBox(){
  const box=document.getElementById("deal-box");if(!box)return;const d=readDeal();if(!d){box.hidden=true;return}
  const fa=isFA(box),dl=box.querySelector("[data-deal-lines]"),inc=document.getElementById("c-deal-on"),hid=document.getElementById("c-deal");
  const rows=fa?[["قیمت",fmt(d.price)],["اجاره‌ی ماهانه",fmt(d.rentM)],["مالیات ملک (سالانه)",fmt(d.tax)],["شارژ ساختمان (ماهانه)",fmt(d.condoM)],["پیش‌پرداخت",pctF(d.down)],["نرخ بهره",pctF(d.rate)],["نرخ بازده سرمایه (Cap rate)",pctF(d.cap)],["جریان نقدی سالانه",fmtS(d.cf)]]
   :[["Price",fmt(d.price)],["Rent per month",fmt(d.rentM)],["Property tax per year",fmt(d.tax)],["Condo fees per month",fmt(d.condoM)],["Down payment",pctF(d.down)],["Interest rate",pctF(d.rate)],["Cap rate",pctF(d.cap)],["Cash flow per year",fmtS(d.cf)]];
  dl.replaceChildren(...rows.map(([k,v])=>{const w=document.createElement("div"),a=document.createElement("dt"),b=document.createElement("dd");a.textContent=k;b.textContent=v;b.dir="ltr";w.append(a,b);return w}));
  const sync=()=>{hid.value=inc.checked?dealText(d):""};inc.addEventListener("change",sync);inc.checked=true;sync();box.hidden=false}
/* ---------- Mode: the prototype uses the hash router; built pages (data-static) are real URLs ---------- */
const STATIC=document.documentElement.hasAttribute("data-static");
const params=new URLSearchParams(location.search);
const LEGACY={"home":"/","about":"/about/","buy":"/buy/","sell":"/sell/","invest":"/invest/","neighbourhoods":"/neighbourhoods/","north-york":"/neighbourhoods/north-york/","thornhill":"/neighbourhoods/thornhill/","richmond-hill":"/neighbourhoods/richmond-hill/","vaughan":"/neighbourhoods/vaughan/","toronto":"/neighbourhoods/toronto/","resources":"/resources/","guide-land-transfer-tax":"/resources/buying/land-transfer-tax-toronto-york-region/","contact":"/contact/","fa-home":"/fa/","fa-buy":"/fa/buy/","fa-sell":"/fa/sell/","fa-invest":"/fa/invest/","fa-neighbourhoods":"/fa/neighbourhoods/","fa-north-york":"/fa/neighbourhoods/north-york/","fa-thornhill":"/fa/neighbourhoods/thornhill/","fa-richmond-hill":"/fa/neighbourhoods/richmond-hill/","fa-vaughan":"/fa/neighbourhoods/vaughan/","fa-toronto":"/fa/neighbourhoods/toronto/","fa-resources":"/fa/resources/","fa-guide-land-transfer-tax":"/fa/resources/buying/land-transfer-tax-toronto-york-region/","fa-about":"/fa/about/","fa-contact":"/fa/contact/","privacy":"/privacy/","terms":"/terms/","accessibility":"/accessibility/","guide-first-home":"/resources/buying/first-home-toronto/","guide-pre-construction":"/resources/buying/pre-construction-condo-questions/","guide-fix-before-listing":"/resources/selling/what-to-fix-before-listing/","guide-offer-date":"/resources/selling/offer-date-vs-pricing-to-market/","guide-investment-analysis":"/resources/investment/investment-analysis/","guide-cash-flow":"/resources/investment/cash-flow/","guide-cap-rate":"/resources/investment/cap-rate/","guide-investment-financing":"/resources/investment/financing/","guide-multiplexes":"/resources/investment/duplexes-triplexes-fourplexes/","guide-investor-strategy":"/resources/investment/investor-strategy/","guide-market-toronto-york":"/resources/market/2026-10-toronto-york-region/","guide-market-york-region":"/resources/market/2026-10-york-region/","guide-status-certificate":"/resources/tips/condo-status-certificate/","guide-home-inspection":"/resources/tips/home-inspection-gta/","guide-contractor":"/resources/tips/choosing-a-contractor/","guide-buying-from-abroad":"/resources/buying/buying-toronto-from-abroad/","guide-condo-vs-detached":"/resources/buying/condo-vs-detached-yonge-corridor/","guide-deal-notes":"/resources/tips/deal-notes-how-numbers-change-decisions/","fa-guide-first-home":"/fa/resources/buying/first-home-toronto/","fa-guide-pre-construction":"/fa/resources/buying/pre-construction-condo-questions/","fa-guide-fix-before-listing":"/fa/resources/selling/what-to-fix-before-listing/","fa-guide-offer-date":"/fa/resources/selling/offer-date-vs-pricing-to-market/","fa-guide-investment-analysis":"/fa/resources/investment/investment-analysis/","fa-guide-cash-flow":"/fa/resources/investment/cash-flow/","fa-guide-cap-rate":"/fa/resources/investment/cap-rate/","fa-guide-investment-financing":"/fa/resources/investment/financing/","fa-guide-multiplexes":"/fa/resources/investment/duplexes-triplexes-fourplexes/","fa-guide-investor-strategy":"/fa/resources/investment/investor-strategy/","fa-guide-market-toronto-york":"/fa/resources/market/2026-10-toronto-york-region/","fa-guide-market-york-region":"/fa/resources/market/2026-10-york-region/","fa-guide-status-certificate":"/fa/resources/tips/condo-status-certificate/","fa-guide-home-inspection":"/fa/resources/tips/home-inspection-gta/","fa-guide-contractor":"/fa/resources/tips/choosing-a-contractor/","fa-guide-buying-from-abroad":"/fa/resources/buying/buying-toronto-from-abroad/","fa-guide-condo-vs-detached":"/fa/resources/buying/condo-vs-detached-yonge-corridor/","fa-guide-deal-notes":"/fa/resources/tips/deal-notes-how-numbers-change-decisions/"}; /* build.py fills: old prototype hash -> real URL */
/* ---------- First-party attribution: no cookies, no third parties, this browser tab only ---------- */
const ATTR_KEYS=["utm_source","utm_medium","utm_campaign","utm_content"];
let attrib={};
try{attrib=JSON.parse(sessionStorage.getItem("abr-attrib")||"{}")}catch(e){}
if(STATIC&&!attrib.landing_page){
  const a={landing_page:location.pathname};
  ATTR_KEYS.forEach(k=>{const v=params.get(k);if(v)a[k]=v.slice(0,100)});
  try{const r=document.referrer&&new URL(document.referrer);if(r&&r.origin!==location.origin)a.referrer=r.origin}catch(e){}
  attrib=a;try{sessionStorage.setItem("abr-attrib",JSON.stringify(a))}catch(e){}
}
/* ---------- Mobile menu & CTA bar ---------- */
const mb=document.getElementById("menu-btn"),dr=document.getElementById("drawer");
function closeDrawer(){dr.hidden=true;mb.setAttribute("aria-expanded","false");mb.textContent=mb.dataset.open||"Menu"}
mb.addEventListener("click",()=>{const o=dr.hidden;dr.hidden=!o;mb.setAttribute("aria-expanded",String(o));mb.textContent=o?(mb.dataset.close||"Close"):(mb.dataset.open||"Menu")});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!dr.hidden){closeDrawer();mb.focus()}});
dr.addEventListener("click",e=>{if(e.target.closest("a"))closeDrawer()});
/* Neighbourhoods dropdown: opens on hover or focus by CSS; the button toggles it for touch, Escape closes it. */
document.querySelectorAll(".has-sub").forEach(w=>{const b=w.querySelector(".sub-btn"),set=o=>{w.classList.toggle("open",o);b.setAttribute("aria-expanded",String(o))};
  b.addEventListener("click",()=>{w.classList.remove("shut");set(!w.classList.contains("open"))});
  w.addEventListener("keydown",e=>{if(e.key==="Escape"){set(false);w.classList.add("shut");b.focus()}});
  w.addEventListener("focusout",e=>{if(!w.contains(e.relatedTarget)){set(false);w.classList.remove("shut")}});
  w.addEventListener("mouseleave",()=>w.classList.remove("shut"))});
const bar=document.getElementById("mbar");
function updateBar(){const on=window.scrollY>520&&!/contact$/.test(document.body.dataset.route||"");bar.classList.toggle("on",on);bar.setAttribute("aria-hidden",String(!on));bar.querySelector("a").tabIndex=on?0:-1}
window.addEventListener("scroll",updateBar,{passive:true});
/* ---------- Contact form (lead contract: see LEADS.md) ---------- */
const cf=document.getElementById("contact-form");
if(cf){
const reqIn=document.getElementById("c-request"),reqNote=document.getElementById("req-note"),reqNotePc=document.getElementById("req-note-pc"),sent=document.getElementById("sent");
const setRequest=v=>{reqIn.value=v||"";reqNote.hidden=v!=="analysis";if(reqNotePc)reqNotePc.hidden=v!=="pricing-check"};
const setInterest=(i,req)=>{const r=document.getElementById("i-"+i);if(r)r.checked=true;setRequest(req==="analysis"?"analysis":req==="pricing-check"&&i==="sell"?"pricing-check":"")};
/* prototype: buttons on other "pages" preselect the form; built site: /contact/?interest=invest&request=analysis */
if(!STATIC)document.addEventListener("click",e=>{const a=e.target.closest("[data-interest]");if(a)setInterest(a.dataset.interest,a.dataset.request)});
else if(params.get("interest"))setInterest(params.get("interest").replace(/[^a-z]/g,""),params.get("request"));
document.querySelectorAll('input[name="interest"]').forEach(r=>r.addEventListener("change",()=>{if(!r.checked)return;if((reqIn.value==="analysis"&&r.value!=="invest")||(reqIn.value==="pricing-check"&&r.value!=="sell"))setRequest("")}));
cf.noValidate=true; /* JS validates; without JS the browser's own validation applies */
const setField=(n,v)=>{const el=cf.elements.namedItem(n);if(el&&!el.length)el.value=v||""};
if(STATIC){
  try{const r=document.referrer&&new URL(document.referrer);setField("source_page",r&&r.origin===location.origin?r.pathname:"")}catch(e){}
  setField("source_cta",(params.get("cta")||"").replace(/[^a-z0-9:-]/g,"").slice(0,80));
  ATTR_KEYS.forEach(k=>setField(k,attrib[k]));setField("referrer",attrib.referrer);
}
const sendBtn=document.getElementById("c-send"),sendErr=document.getElementById("send-error"),sentLive=document.getElementById("sent-live");
cf.addEventListener("submit",async e=>{e.preventDefault();const nm=document.getElementById("c-name"),em=document.getElementById("c-email"),cn=document.getElementById("c-consent"),ph=document.getElementById("c-phone");
  ph.value=latinDigits(ph.value); /* Persian/Arabic-Indic digits from a Farsi keyboard: validate and send as 0-9 */
  const pd=ph.value.replace(/[^0-9]/g,"");
  const okN=nm.value.trim().length>0,okE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim()),okC=cn.checked,okP=!ph.value.trim()||(pd.length>=7&&pd.length<=15&&/^[0-9+().\s-]+$/.test(ph.value.trim()));
  [["e-name",nm,okN],["e-email",em,okE],["e-phone",ph,okP],["e-consent",cn,okC]].forEach(([id,el,ok])=>{document.getElementById(id).hidden=ok;el.setAttribute("aria-invalid",String(!ok))});
  if(!okN){nm.focus();return}if(!okE){em.focus();return}if(!okP){ph.focus();return}if(!okC){cn.focus();return}
  const endpoint=cf.dataset.endpoint;
  if(!endpoint){if(!STATIC&&sent){cf.hidden=true;sent.hidden=false;sent.querySelector("h3").focus()}return} /* no endpoint: never pretend it was sent */
  setField("timestamp",new Date().toISOString());
  const sendLabel=sendBtn.textContent;
  sendErr.hidden=true;sendBtn.disabled=true;sendBtn.textContent=sendBtn.dataset.sending||"Sending…";
  try{
    let r;
    if(/^https:\/\/api(-[a-z0-9]+)?\.hsforms\.com\//.test(endpoint)){
      /* HubSpot adapter (contact-2): the visitor's own words stay in "message"; everything else goes to its own
         HubSpot contact property. Property names must exist in HubSpot AND as hidden fields on the HubSpot form.
         If HubSpot rejects the structured payload (400, e.g. a field missing from the form), the adapter resends
         the older text-in-message payload so a lead is never lost. See LEADS.md. */
      const fd=new FormData(cf),g=k=>String(fd.get(k)||"").trim();
      if(g("website")){cf.hidden=true;sentLive.hidden=false;sentLive.querySelector("h3").focus();return} /* honeypot: drop silently */
      const parts=g("name").split(/\s+/),first=parts.shift()||"",last=parts.join(" ");
      const lbl={buy:"Buying",sell:"Selling",invest:"Investing",question:"A question"};
      const leadType={buy:"buyer",sell:"seller",invest:"investor",question:"general_question"}[g("interest")]||"other";
      const lang=g("language")==="fa"?"fa":"en";
      const utm=["utm_source","utm_medium","utm_campaign","utm_content"].map(g).filter(Boolean).join(" / ");
      const chan=(g("utm_source")+" "+g("referrer")).toLowerCase();
      const leadSource=/instagram/.test(chan)?"instagram":/facebook|fb\.com/.test(chan)?"facebook":/google/.test(chan)?"google":"website";
      const consentSrc="Website contact form ("+(g("form_version")||"unknown")+", "+location.pathname+")";
      const now=Date.now();
      const deal=g("deal_screen"),message=g("message")+(g("deal_screen")?(g("message")?"\n\n":"")+"--- Deal screen (website calculator) ---\n"+deal:"");
      const toFields=list=>list.filter(([,v])=>v!==""&&v!=null).map(([name,value])=>({objectTypeId:"0-1",name,value:String(value)}));
      const structured=toFields([["firstname",first],["lastname",last],["email",g("email")],["phone",g("phone")],["message",message],
        ["lead_type",leadType],["analysis_requested",g("request")==="analysis"?"true":"false"],["hs_language",lang],
        /* Lead Status is NOT sent: a repeat submission must never reset a lead Ali is already working back to "New". */["lead_source",leadSource],["source_page",g("source_page")||location.pathname],["source_cta",g("source_cta")],
        ["source_campaign",utm],["referrer_url",g("referrer")],
        ["consent_status",g("consent")==="yes"?"given":"not_given"],["consent_source",consentSrc],["consent_version",g("consent_version")]]);
      const ctx=["Interest: "+(lbl[g("interest")]||g("interest"))+(g("request")==="analysis"?" (Investment Property Analysis request)":g("request")==="pricing-check"?" (Pricing & prep check request)":""),
        "Reply in: "+(lang==="fa"?"Farsi":"English"),g("source_page")&&("From page: "+g("source_page")),g("source_cta")&&("Clicked: "+g("source_cta")),
        utm&&("Campaign: "+utm),g("referrer")&&("Referrer: "+g("referrer")),"Consent: "+g("consent")+" (wording "+g("consent_version")+")"].filter(Boolean).join("\n");
      const legacy=toFields([["firstname",first],["lastname",last],["email",g("email")],["phone",g("phone")],["message",(message?message+"\n\n":"")+"---\n"+ctx]]);
      const post=fields=>fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},
        body:JSON.stringify({submittedAt:String(now),fields,context:{pageUri:location.href,pageName:document.title}})});
      r=await post(structured);
      if(r.status===400)r=await post(legacy); /* safety net: never lose a lead over a field-mapping mismatch */
    }else{
      r=await fetch(endpoint,{method:"POST",body:new FormData(cf),headers:{Accept:"application/json"}});
    }
    if(!r.ok)throw new Error(String(r.status));
    cf.hidden=true;sentLive.hidden=false;sentLive.querySelector("h3").focus();
  }catch(err){sendErr.hidden=false;sendErr.focus()}
  finally{sendBtn.disabled=false;sendBtn.textContent=sendLabel}});
const rf=document.getElementById("reset-form");if(rf)rf.addEventListener("click",()=>{sent.hidden=true;cf.hidden=false;document.getElementById("c-name").focus()});
}
/* ---------- Boot ---------- */
/* ---------- How-it-works flows: autoplay while on screen (built pages); paused for reduced motion ---------- */
if(STATIC)document.querySelectorAll(".flow").forEach(el=>{
  const svgs=[...el.querySelectorAll(".flow-art svg")],lis=[...el.querySelectorAll(".flow-steps li")],btns=[...el.querySelectorAll(".flow-track button")],fill=el.querySelector(".flow-fill"),ctrl=el.querySelector(".flow-ctrl"),N=lis.length,fa=document.documentElement.lang==="fa";
  const still=matchMedia("(prefers-reduced-motion: reduce)").matches;let cur=0,playing=!still,seen=false,timer=0;
  const show=i=>{cur=i;svgs.forEach((s,k)=>{s.classList.remove("on");if(k===i){void s.getBoundingClientRect();s.classList.add("on")}});
    lis.forEach((l,k)=>l.classList.toggle("cur",k===i));btns.forEach((b,k)=>{b.classList.toggle("done",k<i);b.classList.toggle("cur",k===i);k===i?b.setAttribute("aria-current","step"):b.removeAttribute("aria-current")});
    fill.style.width=`calc((100% - 20px) * ${i/(N-1)})`};
  const tick=()=>{clearTimeout(timer);if(playing&&seen&&!document.hidden)timer=setTimeout(()=>{show((cur+1)%N);tick()},cur===N-1?3400:2600)};
  const label=()=>{ctrl.innerHTML=playing?'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg>':'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>';
    ctrl.setAttribute("aria-label",playing?(fa?"توقف انیمیشن":"Pause animation"):(fa?"پخش انیمیشن":"Play animation"))};
  btns.forEach((b,k)=>b.addEventListener("click",()=>{show(k);tick()}));
  if(!still){ctrl.hidden=false;label();ctrl.addEventListener("click",()=>{playing=!playing;label();tick()})}
  document.addEventListener("visibilitychange",tick);
  if("IntersectionObserver" in window)new IntersectionObserver(es=>es.forEach(e=>{const was=seen;seen=e.isIntersecting;if(seen&&!was)show(cur);tick()}),{threshold:.35}).observe(el);else{seen=true;tick()}
});
/* ---------- Scroll reveal: built pages only, skipped for reduced motion; content is visible without it ---------- */
if(STATIC&&"IntersectionObserver" in window&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.2});
  document.querySelectorAll("[data-reveal]").forEach(el=>{el.classList.add("rv");io.observe(el)})}
if(STATIC){const c=params.get("category");if(c&&CATS.some(x=>x.id===c))activeCat=c}
renderKC();calc();invCalc();lttHandoff();initDealBox();
if(STATIC){
  const to=LEGACY[location.hash.slice(1)];
  if(to&&location.pathname==="/"){location.replace(to);return}
  updateBar();
}
})();
