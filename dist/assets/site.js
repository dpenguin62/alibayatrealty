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
const ARTS=[
 {c:"buying",t:"Land transfer tax in Toronto vs. York Region, with a calculator",d:"Why the same price costs more to close on in North York than in Vaughan.",u:"/resources/buying/land-transfer-tax-toronto-york-region/",href:"#guide-land-transfer-tax",pub:1},
 {c:"buying",t:"Buying your first home in Toronto: a step-by-step plan",d:"From pre-approval to closing, with the costs at each stage.",u:"/resources/buying/first-home-toronto/"},
 {c:"buying",t:"Pre-construction condos: questions to ask before you sign",d:"Deposits, occupancy fees, assignment rules and closing adjustments.",u:"/resources/buying/pre-construction-condo-questions/"},
 {c:"selling",t:"What's worth fixing before you list",d:"Which repairs pay off, which don't, and how to get them done on time.",u:"/resources/selling/what-to-fix-before-listing/"},
 {c:"selling",t:"Offer dates vs. pricing to market",d:"How each strategy works and when each tends to make sense.",u:"/resources/selling/offer-date-vs-pricing-to-market/"},
 {c:"investment",t:"Investment property analysis: a step-by-step framework",d:"The six steps from property review to a decision, with the questions to ask at each.",u:"/invest/investment-analysis/"},
 {c:"investment",t:"How to calculate cash flow on a rental property",d:"From gross rent to what's left after expenses, vacancy and the mortgage.",u:"/invest/cash-flow/"},
 {c:"investment",t:"What is cap rate, and what it doesn't tell you",d:"How to calculate it, how to compare it, and its limits.",u:"/invest/cap-rate/"},
 {c:"investment",t:"Financing an investment property: what to ask",d:"Down payments, rates and lender rules, and the questions to bring to a mortgage professional.",u:"/resources/investment/financing/"},
 {c:"investment",t:"Income properties in the GTA: duplexes, triplexes and fourplexes",d:"How each type works, and what to verify about zoning and legal units.",u:"/invest/duplexes/ · /invest/triplexes/ · /invest/fourplexes/"},
 {c:"investment",t:"Cash flow vs. appreciation: choosing an investor strategy",d:"Two reasons to own a property, the trade-offs, and the risks of each.",u:"/resources/investment/investor-strategy/"},
 {c:"market",t:"Monthly market notes: North York",d:"First report using the monthly template, once a data source is connected.",u:"/resources/market/2026-10-north-york/"},
 {c:"market",t:"Monthly market notes: York Region",d:"Vaughan, Richmond Hill and Thornhill in one monthly summary.",u:"/resources/market/2026-10-york-region/"},
 {c:"areas",t:"North York neighbourhood guide",d:"Condo corridor, bungalow streets, transit and advice.",u:"/neighbourhoods/north-york/",href:"#north-york",pub:1},
 {c:"areas",t:"Thornhill: the Vaughan side vs. the Markham side",d:"How the two halves differ on taxes, services and housing.",u:"/neighbourhoods/thornhill/",href:"#thornhill",pub:1},
 {c:"areas",t:"Vaughan neighbourhood guide",d:"Woodbridge, Maple, Kleinburg and the VMC.",u:"/neighbourhoods/vaughan/",href:"#vaughan",pub:1},
 {c:"tips",t:"How to read a condo status certificate",d:"The pages that matter and the red flags to look for.",u:"/resources/tips/condo-status-certificate/"},
 {c:"tips",t:"Home inspections in the GTA: what to expect",d:"What inspectors check and how to use the report.",u:"/resources/tips/home-inspection-gta/"},
 {c:"tips",t:"Choosing a contractor after you buy",d:"Quotes, contracts, permits and payment schedules.",u:"/resources/tips/choosing-a-contractor/"}];
let activeCat="all";
function renderKC(){
  if(!document.getElementById("chips"))return;
  document.getElementById("chips").innerHTML=[{id:"all",name:"All"},...CATS].map(c=>`<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${c.id===activeCat}">${c.name}</button>`).join("");
  document.getElementById("kc").innerHTML=CATS.filter(c=>activeCat==="all"||c.id===activeCat).map(c=>`<section class="kc-cat"><div class="intro"><h2>${c.name}</h2><p>${c.d}</p></div><div class="arts">${ARTS.filter(a=>a.c===c.id).map(a=>{const tag=a.href?"a":"div";return `<${tag} class="art"${a.href?` href="${a.href}"`:""}><h3>${a.t}</h3><span class="status${a.pub?" pub":""}">${a.pub?"Live":"Planned"}</span><p>${a.d}</p><span class="url">${a.u}</span></${tag}>`}).join("")}</div></section>`).join("")}
document.addEventListener("click",e=>{const b=e.target.closest("[data-cat]");if(!b||!document.getElementById("chips"))return;activeCat=b.dataset.cat;renderKC()});
/* ---------- Land transfer tax estimator ---------- */
const ON=[[55000,.005],[250000,.01],[400000,.015],[2000000,.02],[Infinity,.025]];
const TO=[[55000,.005],[250000,.01],[400000,.015],[2000000,.02],[3000000,.025],[4000000,.044],[5000000,.0545],[10000000,.065],[20000000,.0755],[Infinity,.086]];
function tiered(p,br){let t=0,prev=0;for(const [cap,r] of br){if(p>prev)t+=(Math.min(p,cap)-prev)*r;prev=cap}return Math.round(t*100)/100}
window.__ltt={tiered,ON,TO};
const fmt=n=>n.toLocaleString("en-CA",{style:"currency",currency:"CAD",maximumFractionDigits:0});
function calc(){
  if(!document.getElementById("lt-price"))return;
  const raw=document.getElementById("lt-price").value.replace(/[^0-9.]/g,"");const p=Math.max(0,parseFloat(raw)||0);
  const inTO=document.getElementById("lt-to").checked,first=document.getElementById("lt-first").checked;
  const on=tiered(p,ON),reb=first?Math.min(on,4000):0,to=inTO?tiered(p,TO):0;
  document.getElementById("o-on").textContent=fmt(on);
  document.getElementById("o-onr-row").hidden=!first;document.getElementById("o-onr").textContent="−"+fmt(reb);
  document.getElementById("o-to-row").hidden=!inTO;document.getElementById("o-to").textContent=fmt(to);
  document.getElementById("o-total").textContent=fmt(on-reb+to);
  const FA=document.documentElement.lang==="fa";
  document.getElementById("o-note").textContent=inTO&&first?(FA?"بازپرداخت ویژه‌ی خریداران خانه‌ی اول تورنتو ممکن است این مبلغ را باز هم کاهش دهد؛ در این محاسبه منظور نشده است. وکیل شما مبلغ نهایی را تأیید می‌کند.":"Toronto's first-time buyer rebate may lower this further; it isn't included here. Your lawyer will confirm."):inTO?(FA?"خرید همین خانه در منطقه‌ی یورک، مالیات شهرداری نمایش‌داده‌شده در بالا را صرفه‌جویی می‌کند.":"Buying the same home in York Region would save the municipal tax shown above."):(FA?"خارج از شهر تورنتو، مالیات انتقال زمین شهرداری وجود ندارد.":"No municipal land transfer tax outside the City of Toronto.")}
const pr=document.getElementById("lt-price");
if(pr){pr.addEventListener("input",calc);
pr.addEventListener("blur",()=>{const v=parseFloat(pr.value.replace(/[^0-9.]/g,""));if(v)pr.value=Math.round(v).toLocaleString("en-CA")});
["lt-to","lt-on","lt-first"].forEach(id=>document.getElementById(id).addEventListener("change",calc))}
/* ---------- Investment property estimator (educational) ---------- */
const ivNum=id=>{const v=parseFloat(document.getElementById(id).value.replace(/[^0-9.]/g,""));return isFinite(v)&&v>0?v:0};
const pctF=n=>isFinite(n)?(n<0?"−":"")+(Math.round(Math.abs(n)*100)/100).toLocaleString("en-CA",{minimumFractionDigits:2,maximumFractionDigits:2})+"%":"—";
const fmtS=n=>(n<0?"−":"")+fmt(Math.abs(n));
function mortgageAnnual(loan,ratePct,years){
  if(loan<=0)return 0;const n=years*12;
  if(ratePct<=0)return loan/n*12;
  const i=Math.pow(1+ratePct/100/2,1/6)-1; /* Canadian fixed-rate convention: semi-annual compounding, monthly payments */
  return loan*i/(1-Math.pow(1+i,-n))*12}
function invCalc(){
  if(!document.getElementById("iv-price"))return;
  const price=ivNum("iv-price"),down=Math.min(100,ivNum("iv-down")),rate=ivNum("iv-rate"),yrs=parseInt(document.getElementById("iv-amort").value,10)||25;
  const gross=ivNum("iv-rent"),vacP=Math.min(100,ivNum("iv-vac"));
  const opex=ivNum("iv-tax")+ivNum("iv-ins")+ivNum("iv-maint")+ivNum("iv-util")+ivNum("iv-other");
  const vac=gross*vacP/100,eff=gross-vac,noi=eff-opex;
  const cash=price*down/100,debt=mortgageAnnual(price-cash,rate,yrs),cf=noi-debt;
  const set=(id,t,neg)=>{const el=document.getElementById(id);el.textContent=t;el.classList.toggle("neg",!!neg)};
  set("iv-o-gross",fmt(gross));set("iv-o-vac",vac?"−"+fmt(vac):fmt(0));set("iv-o-eff",fmt(eff));
  set("iv-o-opex",opex?"−"+fmt(opex):fmt(0));set("iv-o-noi",fmtS(noi),noi<0);
  set("iv-o-debt",debt?"−"+fmt(debt):fmt(0));set("iv-o-cf",fmtS(cf),cf<0);
  set("iv-o-cap",price>0?pctF(noi/price*100):"—",noi<0);
  set("iv-o-coc",cash>0?pctF(cf/cash*100):"—",cf<0);
  const FA=document.documentElement.lang==="fa"||!!document.getElementById("iv-price").closest('[lang="fa"]');
  document.getElementById("iv-o-note").textContent=!price||!gross?(FA?"برای دیدن برآورد، قیمت خرید و درآمد اجاره را وارد کنید.":"Enter a purchase price and rental income to see an estimate.")
    :cf<0?(FA?`با این فرض‌ها، این ملک ماهانه حدود ${fmt(Math.abs(cf)/12)} علاوه بر اجاره از جیب شما هزینه می‌خواهد. برخی سرمایه‌گذاران این را در ازای رشد احتمالی ارزش ملک و بازپرداخت اصل وام می‌پذیرند، اما هیچ‌کدام تضمین‌شده نیست.`:`At these assumptions the property would need about ${fmt(Math.abs(cf)/12)} a month from you on top of the rent. Some investors accept that in exchange for potential appreciation and mortgage paydown, but neither is guaranteed.`)
    :(FA?`با این فرض‌ها مثبت است: حدود ${fmt(cf/12)} در ماه، پیش از مالیات بر درآمد. نرخ بهره، خالی ماندن یا هزینه‌ی نگهداری بالاتری را امتحان کنید تا ببینید چقدر حاشیه دارید.`:`Positive at these assumptions, about ${fmt(cf/12)} a month before income tax. Try a higher interest rate, vacancy or maintenance figure to see how much room there is.`)}
window.__inv={mortgageAnnual,invCalc};
document.querySelectorAll("[data-iv]").forEach(el=>{
  el.addEventListener(el.tagName==="SELECT"?"change":"input",invCalc);
  if(el.dataset.iv==="money")el.addEventListener("blur",()=>{const v=parseFloat(el.value.replace(/[^0-9.]/g,""));el.value=isFinite(v)?Math.round(v).toLocaleString("en-CA"):"0"})});
/* ---------- Mode: the prototype uses the hash router; built pages (data-static) are real URLs ---------- */
const STATIC=document.documentElement.hasAttribute("data-static");
const params=new URLSearchParams(location.search);
const LEGACY={"home":"/","about":"/about/","buy":"/buy/","sell":"/sell/","invest":"/invest/","neighbourhoods":"/neighbourhoods/","north-york":"/neighbourhoods/north-york/","thornhill":"/neighbourhoods/thornhill/","richmond-hill":"/neighbourhoods/richmond-hill/","vaughan":"/neighbourhoods/vaughan/","toronto":"/neighbourhoods/toronto/","resources":"/resources/","guide-land-transfer-tax":"/resources/buying/land-transfer-tax-toronto-york-region/","contact":"/contact/","fa-home":"/fa/","fa-buy":"/fa/buy/","fa-sell":"/fa/sell/","fa-invest":"/fa/invest/","fa-neighbourhoods":"/fa/neighbourhoods/","fa-north-york":"/fa/neighbourhoods/north-york/","fa-thornhill":"/fa/neighbourhoods/thornhill/","fa-richmond-hill":"/fa/neighbourhoods/richmond-hill/","fa-vaughan":"/fa/neighbourhoods/vaughan/","fa-toronto":"/fa/neighbourhoods/toronto/","fa-resources":"/fa/resources/","fa-guide-land-transfer-tax":"/fa/resources/buying/land-transfer-tax-toronto-york-region/","fa-about":"/fa/about/","fa-contact":"/fa/contact/","privacy":"/privacy/","terms":"/terms/","accessibility":"/accessibility/"}; /* build.py fills: old prototype hash -> real URL */
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
const bar=document.getElementById("mbar");
function updateBar(){const on=window.scrollY>520&&!/contact$/.test(document.body.dataset.route||"");bar.classList.toggle("on",on);bar.setAttribute("aria-hidden",String(!on));bar.querySelector("a").tabIndex=on?0:-1}
window.addEventListener("scroll",updateBar,{passive:true});
/* ---------- Contact form (lead contract: see LEADS.md) ---------- */
const cf=document.getElementById("contact-form");
if(cf){
const reqIn=document.getElementById("c-request"),reqNote=document.getElementById("req-note"),sent=document.getElementById("sent");
const setRequest=v=>{reqIn.value=v||"";reqNote.hidden=v!=="analysis"};
const setInterest=(i,req)=>{const r=document.getElementById("i-"+i);if(r)r.checked=true;setRequest(req==="analysis"?"analysis":"")};
/* prototype: buttons on other "pages" preselect the form; built site: /contact/?interest=invest&request=analysis */
if(!STATIC)document.addEventListener("click",e=>{const a=e.target.closest("[data-interest]");if(a)setInterest(a.dataset.interest,a.dataset.request)});
else if(params.get("interest"))setInterest(params.get("interest").replace(/[^a-z]/g,""),params.get("request"));
document.querySelectorAll('input[name="interest"]').forEach(r=>r.addEventListener("change",()=>{if(r.checked&&r.value!=="invest")setRequest("")}));
cf.noValidate=true; /* JS validates; without JS the browser's own validation applies */
const setField=(n,v)=>{const el=cf.elements.namedItem(n);if(el&&!el.length)el.value=v||""};
if(STATIC){
  try{const r=document.referrer&&new URL(document.referrer);setField("source_page",r&&r.origin===location.origin?r.pathname:"")}catch(e){}
  setField("source_cta",(params.get("cta")||"").replace(/[^a-z0-9:-]/g,"").slice(0,80));
  ATTR_KEYS.forEach(k=>setField(k,attrib[k]));setField("referrer",attrib.referrer);
}
const sendBtn=document.getElementById("c-send"),sendErr=document.getElementById("send-error"),sentLive=document.getElementById("sent-live");
cf.addEventListener("submit",async e=>{e.preventDefault();const nm=document.getElementById("c-name"),em=document.getElementById("c-email"),cn=document.getElementById("c-consent");
  const okN=nm.value.trim().length>0,okE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim()),okC=cn.checked;
  [["e-name",nm,okN],["e-email",em,okE],["e-consent",cn,okC]].forEach(([id,el,ok])=>{document.getElementById(id).hidden=ok;el.setAttribute("aria-invalid",String(!ok))});
  if(!okN){nm.focus();return}if(!okE){em.focus();return}if(!okC){cn.focus();return}
  const endpoint=cf.dataset.endpoint;
  if(!endpoint){if(!STATIC&&sent){cf.hidden=true;sent.hidden=false;sent.querySelector("h3").focus()}return} /* no endpoint: never pretend it was sent */
  setField("timestamp",new Date().toISOString());
  const sendLabel=sendBtn.textContent;
  sendErr.hidden=true;sendBtn.disabled=true;sendBtn.textContent=sendBtn.dataset.sending||"Sending…";
  try{
    const r=await fetch(endpoint,{method:"POST",body:new FormData(cf),headers:{Accept:"application/json"}});
    if(!r.ok)throw new Error(String(r.status));
    cf.hidden=true;sentLive.hidden=false;sentLive.querySelector("h3").focus();
  }catch(err){sendErr.hidden=false;sendErr.focus()}
  finally{sendBtn.disabled=false;sendBtn.textContent=sendLabel}});
const rf=document.getElementById("reset-form");if(rf)rf.addEventListener("click",()=>{sent.hidden=true;cf.hidden=false;document.getElementById("c-name").focus()});
}
/* ---------- Boot ---------- */
if(STATIC){const c=params.get("category");if(c&&CATS.some(x=>x.id===c))activeCat=c}
renderKC();calc();invCalc();
if(STATIC){
  const to=LEGACY[location.hash.slice(1)];
  if(to&&location.pathname==="/"){location.replace(to);return}
  updateBar();
}
})();
