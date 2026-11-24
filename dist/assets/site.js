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
const LEGACY={"home":"/","about":"/about/","buy":"/buy/","sell":"/sell/","invest":"/invest/","neighbourhoods":"/neighbourhoods/","north-york":"/neighbourhoods/north-york/","thornhill":"/neighbourhoods/thornhill/","richmond-hill":"/neighbourhoods/richmond-hill/","vaughan":"/neighbourhoods/vaughan/","toronto":"/neighbourhoods/toronto/","resources":"/resources/","guide-land-transfer-tax":"/resources/buying/land-transfer-tax-toronto-york-region/","contact":"/contact/","fa-home":"/fa/","fa-buy":"/fa/buy/","fa-sell":"/fa/sell/","fa-invest":"/fa/invest/","fa-neighbourhoods":"/fa/neighbourhoods/","fa-north-york":"/fa/neighbourhoods/north-york/","fa-thornhill":"/fa/neighbourhoods/thornhill/","fa-richmond-hill":"/fa/neighbourhoods/richmond-hill/","fa-vaughan":"/fa/neighbourhoods/vaughan/","fa-toronto":"/fa/neighbourhoods/toronto/","fa-resources":"/fa/resources/","fa-guide-land-transfer-tax":"/fa/resources/buying/land-transfer-tax-toronto-york-region/","fa-about":"/fa/about/","fa-contact":"/fa/contact/","privacy":"/privacy/","terms":"/terms/","accessibility":"/accessibility/","guide-first-home":"/resources/buying/first-home-toronto/","guide-pre-construction":"/resources/buying/pre-construction-condo-questions/","guide-fix-before-listing":"/resources/selling/what-to-fix-before-listing/","guide-offer-date":"/resources/selling/offer-date-vs-pricing-to-market/","guide-investment-analysis":"/resources/investment/investment-analysis/","guide-cash-flow":"/resources/investment/cash-flow/","guide-cap-rate":"/resources/investment/cap-rate/","guide-investment-financing":"/resources/investment/financing/","guide-multiplexes":"/resources/investment/duplexes-triplexes-fourplexes/","guide-investor-strategy":"/resources/investment/investor-strategy/","guide-market-toronto-york":"/resources/market/2026-10-toronto-york-region/","guide-market-york-region":"/resources/market/2026-10-york-region/","guide-status-certificate":"/resources/tips/condo-status-certificate/","guide-home-inspection":"/resources/tips/home-inspection-gta/","guide-contractor":"/resources/tips/choosing-a-contractor/","fa-guide-first-home":"/fa/resources/buying/first-home-toronto/","fa-guide-pre-construction":"/fa/resources/buying/pre-construction-condo-questions/","fa-guide-fix-before-listing":"/fa/resources/selling/what-to-fix-before-listing/","fa-guide-offer-date":"/fa/resources/selling/offer-date-vs-pricing-to-market/","fa-guide-investment-analysis":"/fa/resources/investment/investment-analysis/","fa-guide-cash-flow":"/fa/resources/investment/cash-flow/","fa-guide-cap-rate":"/fa/resources/investment/cap-rate/","fa-guide-investment-financing":"/fa/resources/investment/financing/","fa-guide-multiplexes":"/fa/resources/investment/duplexes-triplexes-fourplexes/","fa-guide-investor-strategy":"/fa/resources/investment/investor-strategy/","fa-guide-market-toronto-york":"/fa/resources/market/2026-10-toronto-york-region/","fa-guide-market-york-region":"/fa/resources/market/2026-10-york-region/","fa-guide-status-certificate":"/fa/resources/tips/condo-status-certificate/","fa-guide-home-inspection":"/fa/resources/tips/home-inspection-gta/","fa-guide-contractor":"/fa/resources/tips/choosing-a-contractor/"}; /* build.py fills: old prototype hash -> real URL */
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
cf.addEventListener("submit",async e=>{e.preventDefault();const nm=document.getElementById("c-name"),em=document.getElementById("c-email"),cn=document.getElementById("c-consent"),ph=document.getElementById("c-phone");
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
      const message=g("message");
      const toFields=list=>list.filter(([,v])=>v!==""&&v!=null).map(([name,value])=>({objectTypeId:"0-1",name,value:String(value)}));
      const structured=toFields([["firstname",first],["lastname",last],["email",g("email")],["phone",g("phone")],["message",message],
        ["lead_type",leadType],["analysis_requested",g("request")==="analysis"?"true":"false"],["hs_language",lang],
        /* Lead Status is NOT sent: a repeat submission must never reset a lead Ali is already working back to "New". */["lead_source",leadSource],["source_page",g("source_page")||location.pathname],["source_cta",g("source_cta")],
        ["source_campaign",utm],["referrer_url",g("referrer")],
        ["consent_status",g("consent")==="yes"?"given":"not_given"],["consent_source",consentSrc],["consent_version",g("consent_version")]]);
      const ctx=["Interest: "+(lbl[g("interest")]||g("interest"))+(g("request")==="analysis"?" (Investment Property Analysis request)":""),
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
renderKC();calc();invCalc();
if(STATIC){
  const to=LEGACY[location.hash.slice(1)];
  if(to&&location.pathname==="/"){location.replace(to);return}
  updateBar();
}
})();
