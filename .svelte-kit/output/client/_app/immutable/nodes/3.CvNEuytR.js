import{c as T,a as w,f as F}from"../chunks/D4fZ_g2E.js";import{i as W}from"../chunks/BriPaUDu.js";import{o as $}from"../chunks/C5DPmBWz.js";import{H as q,I as k,J as B,s as I,y as L,a as M,M as p,K as P,N as _,W as U,V as J}from"../chunks/Ddzy9yRd.js";import{s as R}from"../chunks/DorMfE8p.js";import{i as G}from"../chunks/BmrWgj5Q.js";import{s as N,a as X}from"../chunks/Ca1ymtt3.js";import{s as Y}from"../chunks/BXItRzDC.js";import{p as j}from"../chunks/skZBBLja.js";import{h as A,E as K}from"../chunks/XUe1VO12.js";import{H as O,a as V,W as Q,P as Z,B as ee,C as te,b as oe,F as ae}from"../chunks/LS-mKuKA.js";const re=()=>{const o=Y;return{page:{subscribe:o.page.subscribe},navigating:{subscribe:o.navigating.subscribe},updated:o.updated}},ie={subscribe(o){return re().page.subscribe(o)}};async function se(o,d={}){const{filename:m="portfolio.pdf",quality:y=1,scale:v=3,margin:a=10}=d;try{const n=window.getComputedStyle(o).backgroundColor||"#ffffff",s=await A(o,{scale:v,useCORS:!0,allowTaint:!0,logging:!1,backgroundColor:n,windowWidth:1920,windowHeight:o.scrollHeight,scrollY:-window.scrollY,scrollX:-window.scrollX,imageTimeout:0,removeContainer:!0}),r=210-a*2,g=s.height*r/s.width,e=new K({orientation:g>r?"portrait":"landscape",unit:"mm",format:"a4"}),l=s.toDataURL("image/jpeg",y),h=e.internal.pageSize.getHeight()-a*2;let t=g,f=a,c=1;for(e.addImage(l,"JPEG",a,f,r,g),t-=h;t>0;)f=t-g+a,e.addPage(),c++,e.addImage(l,"JPEG",a,f,r,g),t-=h;e.save(m)}catch(i){throw console.error("Error generating PDF:",i),new Error("Failed to generate PDF. Please try again.")}}async function ne(o){const d=document.querySelector(".portfolio-view");if(!d)throw new Error("Portfolio container not found");const m=new Map,y=[".chat-container",".chat-overlay","header",".chat-fab","button"],v=[];y.forEach(i=>{document.querySelectorAll(i).forEach(s=>{const r=s;r.style.display!=="none"&&(v.push(r),m.set(r,r.style.cssText),r.style.display="none")})});const a=document.createElement("style");a.id="pdf-export-styles",a.innerHTML=`
    /* PDF-specific styles */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    body {
      overflow: visible !important;
    }

    .portfolio-view {
      width: 1920px !important;
      max-width: none !important;
      overflow: visible !important;
      padding: 40px !important;
    }

    section {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      margin-bottom: 60px !important;
    }

    .container {
      max-width: 1200px !important;
      margin: 0 auto !important;
      padding: 0 40px !important;
    }

    /* Ensure backgrounds are visible */
    .hero, .section {
      background-color: inherit !important;
    }

    /* Fix text readability */
    h1, h2, h3, h4, h5, h6, p, span, li, a {
      text-rendering: optimizeLegibility !important;
      -webkit-font-smoothing: antialiased !important;
    }

    /* Fix images */
    img {
      max-width: 100% !important;
      height: auto !important;
    }
  `,document.head.appendChild(a),d.offsetHeight;try{await se(d,{filename:`${o}-portfolio.pdf`,quality:1,scale:3})}finally{v.forEach(n=>{const s=m.get(n);s!==void 0?n.style.cssText=s:n.style.display=""});const i=document.getElementById("pdf-export-styles");i&&i.remove()}}var le=F('<div class="loading-container svelte-14luta1"><div class="loading-spinner svelte-14luta1"></div> <p class="svelte-14luta1">Loading portfolio...</p></div>'),de=F('<div class="error-container svelte-14luta1"><h1 class="svelte-14luta1">Portfolio Not Found</h1> <p class="svelte-14luta1"> </p> <a href="/" class="svelte-14luta1">Go to Home</a></div>'),ce=F('<div class="portfolio-view svelte-14luta1"><!> <!> <!> <!> <!> <!> <!> <!></div>');function Pe(o,d){q(d,!1);const m=()=>X(ie,"$page",y),[y,v]=N();let a=L(!0),i=L(!1);j.subscribe(e=>{}),$(async()=>{const e=m().params.username;if(e)try{await j.loadPortfolio(e)}catch{I(i,!0)}I(a,!1);const l=sessionStorage.getItem("generatePDF"),h=sessionStorage.getItem("pdfUsername");if(l==="true"&&h===e){sessionStorage.removeItem("generatePDF"),sessionStorage.removeItem("pdfUsername");const t=document.createElement("div");t.id="pdf-loading",t.style.cssText=`
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 30px 50px;
        border-radius: 12px;
        z-index: 10000;
        font-size: 18px;
        text-align: center;
      `,t.innerHTML=`
        <div style="margin-bottom: 10px;">Generating PDF...</div>
        <div style="font-size: 14px; opacity: 0.7;">Please wait a moment</div>
      `,document.body.appendChild(t),setTimeout(async()=>{try{await ne(e),t.innerHTML=`
            <div style="color: #4ade80;">✓ PDF Generated Successfully!</div>
          `,setTimeout(()=>{document.body.removeChild(t)},1e3)}catch(f){console.error("PDF generation failed:",f),document.body.removeChild(t),alert("Failed to generate PDF. Please try using Print (Ctrl/Cmd+P) instead.")}},2500)}}),W();var n=T(),s=k(n);{var r=e=>{var l=le();w(e,l)},g=e=>{var l=T(),h=k(l);{var t=c=>{var u=de(),b=p(P(u),2),x=P(b);_(b),U(2),_(u),J(()=>R(x,`The portfolio for user "${m().params.username??""}" could not be found.`)),w(c,u)},f=c=>{var u=ce(),b=P(u);O(b,{});var x=p(b,2);V(x,{});var E=p(x,2);Q(E,{});var S=p(E,2);Z(S,{});var C=p(S,2);ee(C,{});var H=p(C,2);te(H,{});var D=p(H,2);oe(D,{});var z=p(D,2);ae(z,{}),_(u),w(c,u)};G(h,c=>{M(i)?c(t):c(f,!1)},!0)}w(e,l)};G(s,e=>{M(a)?e(r):e(g,!1)})}w(o,n),B(),v()}export{Pe as component};
