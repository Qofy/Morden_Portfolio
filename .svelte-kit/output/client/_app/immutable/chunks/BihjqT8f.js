import{b as fe,d as me,a as K,c as te}from"./B-k66CwF.js";import{i as ve}from"./DcsHEGtP.js";import{a9 as P,r as S,ag as ie,a1 as U,t as z,R as oe,a as L,b as he,a6 as ge,a7 as Se,a8 as X,aa as H,a3 as x,ao as be,aJ as we,au as Z,Z as _e,a2 as q,a5 as ke,aP as re,aH as se,G as Te,aQ as le,aR as ce,y as ye,m as ee,aS as Ce,_ as de,a0 as Ee,aT as V,W as Ae,aU as Ie,aD as xe,aV as Me,aW as Ne,aG as Re,$ as De,aX as Pe,T as je,aY as Be,e as Oe,v as Fe,H as Le,M as He,Q as $e,N as We,K as Ge,u as ae,ae as F,O as ue,aO as Ue,aZ as Ve}from"./w9EZV_lN.js";import{s as pe}from"./Dx3C_MuA.js";import{l as Y,p as D,s as Je}from"./Blx_muET.js";import{i as Ke}from"./CHrQZ83B.js";import{B as ze}from"./C569hdZR.js";import{a as ne}from"./Bbs2bVA6.js";function qe(a,e){return e}function Ye(a,e,i){for(var p=[],f=e.length,c=0;c<f;c++)Me(e[c].e,p,!0);Ne(p,()=>{var o=p.length===0&&i!==null;if(o){var t=i,r=t.parentNode;Re(r),r.append(t),a.items.clear(),_(a,e[0].prev,e[f-1].next)}for(var u=0;u<f;u++){var s=e[u];o||(a.items.delete(s.k),_(a,s.prev,s.next)),De(s.e,!o)}a.first===e[0]&&(a.first=e[0].prev)})}function Qe(a,e,i,p,f,c=null){var o=a,t=new Map,r=null,u=(e&re)!==0,s=(e&le)!==0,g=(e&ce)!==0;if(u){var m=a;o=S?P(ie(m)):m.appendChild(U())}S&&z();var l=null,b=he(()=>{var v=i();return Te(v)?v:v==null?[]:se(v)}),h,n=!0;function d(){Xe(T,h,o,e,p),l!==null&&(h.length===0?(l.fragment?(o.before(l.fragment),l.fragment=null):de(l.effect),A.first=l.effect):Ee(l.effect,()=>{l=null}))}var A=oe(()=>{h=L(b);var v=h.length;let E=!1;if(S){var M=ge(o)===Se;M!==(v===0)&&(o=X(),P(o),H(!1),E=!0)}for(var j=new Set,k=_e,y=null,$=ke(),C=0;C<v;C+=1){S&&x.nodeType===be&&x.data===we&&(o=x,E=!0,H(!1));var N=h[C],I=p(N,C),w=n?null:t.get(I);w?(s&&Z(w.v,N),g&&Z(w.i,C),$&&k.skipped_effects.delete(w.e)):(w=Ze(n?o:null,y,N,I,C,f,e,i),n&&(w.o=!0,y===null?r=w:y.next=w,y=w),t.set(I,w)),j.add(I)}if(v===0&&c&&!l)if(n)l={fragment:null,effect:q(()=>c(o))};else{var B=document.createDocumentFragment(),O=U();B.append(O),l={fragment:B,effect:q(()=>c(O))}}if(S&&v>0&&P(X()),!n)if($){for(const[W,G]of t)j.has(W)||k.skipped_effects.add(G.e);k.oncommit(d),k.ondiscard(()=>{})}else d();E&&H(!0),L(b)}),T={effect:A,items:t,first:r};n=!1,S&&(o=x)}function Xe(a,e,i,p,f){var C,N,I,w,B,O,W,G;var c=(p&Ie)!==0,o=e.length,t=a.items,r=a.first,u,s=null,g,m=[],l=[],b,h,n,d;if(c)for(d=0;d<o;d+=1)b=e[d],h=f(b,d),n=t.get(h),n.o&&((N=(C=n.e.nodes)==null?void 0:C.a)==null||N.measure(),(g??(g=new Set)).add(n));for(d=0;d<o;d+=1){if(b=e[d],h=f(b,d),n=t.get(h),a.first??(a.first=n),!n.o){n.o=!0;var A=s?s.next:r;_(a,s,n),_(a,n,A),J(n,A,i),s=n,m=[],l=[],r=s.next;continue}if(n.e.f&V&&(de(n.e),c&&((w=(I=n.e.nodes)==null?void 0:I.a)==null||w.unfix(),(g??(g=new Set)).delete(n))),n!==r){if(u!==void 0&&u.has(n)){if(m.length<l.length){var T=l[0],v;s=T.prev;var E=m[0],M=m[m.length-1];for(v=0;v<m.length;v+=1)J(m[v],T,i);for(v=0;v<l.length;v+=1)u.delete(l[v]);_(a,E.prev,M.next),_(a,s,E),_(a,M,T),r=T,s=M,d-=1,m=[],l=[]}else u.delete(n),J(n,r,i),_(a,n.prev,n.next),_(a,n,s===null?a.first:s.next),_(a,s,n),s=n;continue}for(m=[],l=[];r!==null&&r!==n;)r.e.f&V||(u??(u=new Set)).add(r),l.push(r),r=r.next;if(r===null)continue;n=r}m.push(n),s=n,r=n.next}let j=t.size>o;if(r!==null||u!==void 0){for(var k=u===void 0?[]:se(u);r!==null;)r.e.f&V||k.push(r),r=r.next;var y=k.length;if(j=t.size-y>o,y>0){var $=p&re&&o===0?i:null;if(c){for(d=0;d<y;d+=1)(O=(B=k[d].e.nodes)==null?void 0:B.a)==null||O.measure();for(d=0;d<y;d+=1)(G=(W=k[d].e.nodes)==null?void 0:W.a)==null||G.fix()}Ye(a,k,$)}}if(j)for(const R of t.values())R.o||(_(a,s,R),s=R);a.effect.last=s&&s.e,c&&Ae(()=>{var R,Q;if(g!==void 0)for(n of g)(Q=(R=n.e.nodes)==null?void 0:R.a)==null||Q.apply()})}function Ze(a,e,i,p,f,c,o,t){var r=(o&le)!==0,u=(o&Ce)===0,s=r?u?ye(i,!1,!1):ee(i):i,g=o&ce?ee(f):f,m={i:g,v:s,k:p,e:null,o:!1,prev:e,next:null};if(a===null){var l=document.createDocumentFragment();l.append(a=U())}return m.e=q(()=>c(a,s,g,t)),e!==null&&(e.next=m),m}function J(a,e,i){if(a.e.nodes)for(var p=a.next?a.next.e.nodes.start:i,f=e?e.e.nodes.start:i,c=a.e.nodes.start;c!==null&&c!==p;){var o=xe(c);f.before(c),c=o}}function _(a,e,i){e===null?(a.first=i,a.effect.first=i&&i.e):(e.e.next&&(e.e.next.prev=null),e.next=i,e.e.next=i&&i.e),i!==null&&(i.e.prev&&(i.e.prev.next=null),i.prev=e,i.e.prev=e&&e.e)}function ea(a,e,i,p,f,c){let o=S;S&&z();var t=null;S&&x.nodeType===Pe&&(t=x,z());var r=S?x:a,u=new ze(r,!1);oe(()=>{const s=e()||null;var g=Be;if(s===null){u.ensure(null,null);return}return u.ensure(s,m=>{if(s){if(t=S?t:document.createElementNS(g,s),fe(t,t),p){S&&Ke(s)&&t.append(document.createComment(""));var l=S?ie(t):t.appendChild(U());S&&(l===null?H(!1):P(l)),p(t,l)}Oe.nodes.end=t,m.before(t)}S&&P(m)}),()=>{}},je),Fe(()=>{}),o&&(H(!0),P(r))}const va={personal:{name:"Kofi Safo Agyekum",title:"Full Stack Developer",location:"German 🇩🇪",bio:"I like to build web applications, solve complex problems and continuously learn new technologies.",photo:"/assets/profile/profile.png",resumeUrl:"/resume.pdf"},socialLinks:[{name:"Resume",icon:"file-text",url:"#resume"},{name:"LinkedIn",icon:"linkedin",url:"https://www.linkedin.com/in/kofi-agyekum-870569298/"},{name:"GitHub",icon:"github",url:"https://github.com/Qofy"},{name:"Email",icon:"mail",url:"mailto:safokofi888@gmail.com"}],navigation:[{label:"home",href:"#home"},{label:"projects",href:"#projects"},{label:"blog",href:"#blog"},{label:"contact",href:"#contact"}],workExperience:[{id:1,period:"Jul 2023 - Present",position:"Full Stack Developer - Freelance",company:"Freelance",location:"Remote",description:["Designed and developed modern web applications using React, Node.js, and MongoDB","Implemented CI/CD pipelines and automated deployment workflows","Built responsive user interfaces with Tailwind CSS and Svelte","Collaborated with clients to gather requirements and deliver solutions"],tags:["React","Node.js","MongoDB","Svelte"]},{id:2,period:"Aug 2021 - Jul 2023",position:"Frontend Developer",company:"Tech Company",location:"Berlin, Germany",description:["Developed and maintained frontend applications using React and TypeScript","Worked closely with design team to implement pixel-perfect UI components","Optimized application performance and improved load times by 40%","Mentored junior developers and conducted code reviews"],tags:["React","TypeScript","CSS","Git"]},{id:3,period:"May 2020 - Aug 2021",position:"Junior Developer",company:"Startup Inc",location:"Remote",description:["Built web applications using HTML, CSS, JavaScript, and Vue.js","Integrated RESTful APIs and third-party services","Participated in agile development processes and daily standups","Fixed bugs and implemented new features based on user feedback"],tags:["Vue.js","JavaScript","API Integration"]}],education:[{id:1,period:"2023 - 2026",degree:"Bachelor of Science in Software Engineering",institution:"University of Europe Of Applied Science",location:"Potsdam, Germany",description:["Graduated with First Class Honors","Focused on software engineering and web development","Led university coding club and organized hackathons"]}],projects:[{id:1,title:"E-Commerce Platform",description:"Full-stack e-commerce application with cart, checkout, and payment integration",technologies:["React","Node.js","MongoDB","Stripe"],image:"/projects/ecommerce.jpg",liveUrl:"https://example.com",githubUrl:"https://github.com/yourusername/project"},{id:2,title:"Task Management App",description:"Real-time collaborative task management tool with drag-and-drop functionality",technologies:["Svelte","Firebase","Tailwind CSS"],image:"/projects/taskapp.jpg",liveUrl:"https://example.com",githubUrl:"https://github.com/yourusername/project"},{id:3,title:"Weather Dashboard",description:"Interactive weather dashboard with location search and forecasts",technologies:["Vue.js","OpenWeather API","Chart.js"],image:"/projects/weather.jpg",liveUrl:"https://example.com",githubUrl:"https://github.com/yourusername/project"}],skills:{frontend:["React","Svelte","Vue.js","TypeScript","Tailwind CSS","HTML/CSS"],backend:["Node.js","Express","MongoDB","PostgreSQL","REST APIs"],tools:["Git","Docker","CI/CD","Vite","Webpack"],other:["Agile","Problem Solving","Team Collaboration","Code Review"]}},aa=`You are an AI assistant representing Kofi Safo Agyekum's portfolio. You know everything about Kofi's professional background, skills, and experience.

Here's what you know about Kofi:

**Personal Info:**
- Name: Kofi Safo Agyekum
- Title: Full Stack Developer from Ghana
- Bio: Passionate about building web applications and solving complex problems

**Work Experience:**
1. Full Stack Developer - Freelance (Jul 2023 - Present)
   - Designs and develops modern web applications using React, Node.js, and MongoDB
   - Implements CI/CD pipelines and automated deployment workflows
   - Builds responsive UIs with Tailwind CSS and Svelte
   - Tech: React, Node.js, MongoDB, Svelte

2. Frontend Developer - Tech Company (Aug 2021 - Jul 2023, Accra, Ghana)
   - Developed frontend applications using React and TypeScript
   - Optimized application performance by 40%
   - Mentored junior developers
   - Tech: React, TypeScript, CSS, Git

3. Junior Developer - Startup Inc (May 2020 - Aug 2021, Remote)
   - Built web applications using Vue.js, HTML, CSS, JavaScript
   - Integrated RESTful APIs
   - Tech: Vue.js, JavaScript, API Integration

**Education:**
- Bachelor of Science in Computer Science from University of Ghana (2016-2020)
- First Class Honors
- Led university coding club

**Skills:**
- Frontend: React, Svelte, Vue.js, TypeScript, Tailwind CSS, HTML/CSS
- Backend: Node.js, Express, MongoDB, PostgreSQL, REST APIs
- Tools: Git, Docker, CI/CD, Vite, Webpack
- Soft Skills: Agile, Problem Solving, Team Collaboration, Code Review

**Projects:**
1. E-Commerce Platform - React, Node.js, MongoDB, Stripe
2. Task Management App - Svelte, Firebase, Tailwind CSS
3. Weather Dashboard - Vue.js, OpenWeather API, Chart.js

When answering questions:
- Be professional but friendly
- Provide specific details about Kofi's experience when asked
- If asked about availability for hire, say Kofi is open to opportunities
- If you don't know something specific, be honest but helpful
- Keep responses concise and relevant
- You can discuss technical topics related to Kofi's skills

Answer the following question about Kofi:`;/**
 * @license lucide-svelte v0.554.0 - ISC
 *
 * ISC License
 * 
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 * ---
 * 
 * The MIT License (MIT) (for portions derived from Feather)
 * 
 * Copyright (c) 2013-2023 Cole Bemis
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */const na={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};var ta=me("<svg><!><!></svg>");function ia(a,e){const i=Y(e,["children","$$slots","$$events","$$legacy"]),p=Y(i,["name","color","size","strokeWidth","absoluteStrokeWidth","iconNode"]);Le(e,!1);let f=D(e,"name",8,void 0),c=D(e,"color",8,"currentColor"),o=D(e,"size",8,24),t=D(e,"strokeWidth",8,2),r=D(e,"absoluteStrokeWidth",8,!1),u=D(e,"iconNode",24,()=>[]);const s=(...b)=>b.filter((h,n,d)=>!!h&&d.indexOf(h)===n).join(" ");ve();var g=ta();ne(g,(b,h)=>({...na,...p,width:o(),height:o(),stroke:c(),"stroke-width":b,class:h}),[()=>(F(r()),F(t()),F(o()),ae(()=>r()?Number(t())*24/Number(o()):t())),()=>(F(f()),F(i),ae(()=>s("lucide-icon","lucide",f()?`lucide-${f()}`:"",i.class)))]);var m=He(g);Qe(m,1,u,qe,(b,h)=>{var n=Ue(()=>Ve(L(h),2));let d=()=>L(n)[0],A=()=>L(n)[1];var T=te(),v=ue(T);ea(v,d,!0,(E,M)=>{ne(E,()=>({...A()}))}),K(b,T)});var l=$e(m);pe(l,e,"default",{}),We(g),K(a,g),Ge()}function ha(a,e){const i=Y(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.554.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const p=[["path",{d:"M12 8V4H8"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2"}],["path",{d:"M2 14h2"}],["path",{d:"M20 14h2"}],["path",{d:"M15 13v2"}],["path",{d:"M9 13v2"}]];ia(a,Je({name:"bot"},()=>i,{get iconNode(){return p},children:(f,c)=>{var o=te(),t=ue(o);pe(t,e,"default",{}),K(f,o)},$$slots:{default:!0}}))}const oa="http://localhost:11434/api/generate",ra="qwen2.5:0.5b";async function ga(a,e){var i,p,f,c,o;try{let t=aa;e&&(e.systemPrompt?t=e.systemPrompt:t=`You are an AI assistant representing ${((i=e.personal)==null?void 0:i.name)||"the portfolio owner"}.
Here is information about them:
- Name: ${(p=e.personal)==null?void 0:p.name}
- Title: ${(f=e.personal)==null?void 0:f.title}
- Location: ${(c=e.personal)==null?void 0:c.location}
- Bio: ${(o=e.personal)==null?void 0:o.bio}

Answer questions about their experience, skills, and projects based on this information. Be helpful, professional, and concise.`);const r=`${t}

User: ${a}

Assistant:`,u=await fetch(oa,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:ra,prompt:r,stream:!1,options:{temperature:.7,top_p:.9}})});if(!u.ok)throw new Error(`Ollama API error: ${u.statusText}`);return(await u.json()).response}catch(t){throw console.error("Error communicating with Ollama:",t),t instanceof TypeError&&t.message.includes("fetch")?new Error("Cannot connect to Ollama. Make sure Ollama is running on localhost:11434"):t}}export{ha as B,ia as I,Qe as e,qe as i,va as p,ga as s};
