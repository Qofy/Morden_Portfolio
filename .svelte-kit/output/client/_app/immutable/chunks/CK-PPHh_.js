import{b as fe,d as me,a as V,c as ae}from"./D4fZ_g2E.js";import{i as he}from"./BriPaUDu.js";import{a7 as x,r as w,ag as ie,$ as U,t as K,O as oe,a as F,b as ve,a4 as ge,a5 as Se,a6 as Q,a8 as B,a1 as C,as as we,aN as ye,ay as Z,X as Ee,a0 as J,a3 as be,aP as re,aL as se,G as Ie,aQ as le,aR as ce,y as Ne,m as ee,aS as Ae,Y as de,_ as Te,aT as H,U as ke,aU as Oe,aH as Ce,aV as _e,aW as Re,aK as Pe,Z as De,aX as xe,Q as Me,aY as $e,e as Le,v as je,H as Fe,K as Be,M as Ye,N as We,J as Ge,u as te,ac as j,I as pe,ap as Ue,aZ as He}from"./Ddzy9yRd.js";import{s as ue}from"./mHiT55f2.js";import{l as z,p as D,s as Xe}from"./BRm5XKiR.js";import{i as Ve}from"./DorMfE8p.js";import{B as Ke}from"./BmrWgj5Q.js";import{a as ne}from"./CeUgsFBs.js";function Je(n,e){return e}function ze(n,e,o){for(var u=[],f=e.length,c=0;c<f;c++)_e(e[c].e,u,!0);Re(u,()=>{var i=u.length===0&&o!==null;if(i){var l=o,r=l.parentNode;Pe(r),r.append(l),n.items.clear(),I(n,e[0].prev,e[f-1].next)}for(var h=0;h<f;h++){var s=e[h];i||(n.items.delete(s.k),I(n,s.prev,s.next)),De(s.e,!i)}n.first===e[0]&&(n.first=e[0].prev)})}function qe(n,e,o,u,f,c=null){var i=n,l=new Map,r=null,h=(e&re)!==0,s=(e&le)!==0,S=(e&ce)!==0;if(h){var m=n;i=w?x(ie(m)):m.appendChild(U())}w&&K();var d=null,g=ve(()=>{var t=o();return Ie(t)?t:t==null?[]:se(t)}),v,a=!0;function p(){Qe(b,v,i,e,u),d!==null&&(v.length===0?(d.fragment?(i.before(d.fragment),d.fragment=null):de(d.effect),k.first=d.effect):Te(d.effect,()=>{d=null}))}var k=oe(()=>{v=F(g);var t=v.length;let y=!1;if(w){var _=ge(i)===Se;_!==(t===0)&&(i=Q(),x(i),B(!1),y=!0)}for(var M=new Set,N=Ee,A=null,Y=be(),T=0;T<t;T+=1){w&&C.nodeType===we&&C.data===ye&&(i=C,y=!0,B(!1));var R=v[T],O=u(R,T),E=a?null:l.get(O);E?(s&&Z(E.v,R),S&&Z(E.i,T),Y&&N.skipped_effects.delete(E.e)):(E=Ze(a?i:null,A,R,O,T,f,e,o),a&&(E.o=!0,A===null?r=E:A.next=E,A=E),l.set(O,E)),M.add(O)}if(t===0&&c&&!d)if(a)d={fragment:null,effect:J(()=>c(i))};else{var $=document.createDocumentFragment(),L=U();$.append(L),d={fragment:$,effect:J(()=>c(L))}}if(w&&t>0&&x(Q()),!a)if(Y){for(const[W,G]of l)M.has(W)||N.skipped_effects.add(G.e);N.oncommit(p),N.ondiscard(()=>{})}else p();y&&B(!0),F(g)}),b={effect:k,items:l,first:r};a=!1,w&&(i=C)}function Qe(n,e,o,u,f){var T,R,O,E,$,L,W,G;var c=(u&Oe)!==0,i=e.length,l=n.items,r=n.first,h,s=null,S,m=[],d=[],g,v,a,p;if(c)for(p=0;p<i;p+=1)g=e[p],v=f(g,p),a=l.get(v),a.o&&((R=(T=a.e.nodes)==null?void 0:T.a)==null||R.measure(),(S??(S=new Set)).add(a));for(p=0;p<i;p+=1){if(g=e[p],v=f(g,p),a=l.get(v),n.first??(n.first=a),!a.o){a.o=!0;var k=s?s.next:r;I(n,s,a),I(n,a,k),X(a,k,o),s=a,m=[],d=[],r=s.next;continue}if(a.e.f&H&&(de(a.e),c&&((E=(O=a.e.nodes)==null?void 0:O.a)==null||E.unfix(),(S??(S=new Set)).delete(a))),a!==r){if(h!==void 0&&h.has(a)){if(m.length<d.length){var b=d[0],t;s=b.prev;var y=m[0],_=m[m.length-1];for(t=0;t<m.length;t+=1)X(m[t],b,o);for(t=0;t<d.length;t+=1)h.delete(d[t]);I(n,y.prev,_.next),I(n,s,y),I(n,_,b),r=b,s=_,p-=1,m=[],d=[]}else h.delete(a),X(a,r,o),I(n,a.prev,a.next),I(n,a,s===null?n.first:s.next),I(n,s,a),s=a;continue}for(m=[],d=[];r!==null&&r!==a;)r.e.f&H||(h??(h=new Set)).add(r),d.push(r),r=r.next;if(r===null)continue;a=r}m.push(a),s=a,r=a.next}let M=l.size>i;if(r!==null||h!==void 0){for(var N=h===void 0?[]:se(h);r!==null;)r.e.f&H||N.push(r),r=r.next;var A=N.length;if(M=l.size-A>i,A>0){var Y=u&re&&i===0?o:null;if(c){for(p=0;p<A;p+=1)(L=($=N[p].e.nodes)==null?void 0:$.a)==null||L.measure();for(p=0;p<A;p+=1)(G=(W=N[p].e.nodes)==null?void 0:W.a)==null||G.fix()}ze(n,N,Y)}}if(M)for(const P of l.values())P.o||(I(n,s,P),s=P);n.effect.last=s&&s.e,c&&ke(()=>{var P,q;if(S!==void 0)for(a of S)(q=(P=a.e.nodes)==null?void 0:P.a)==null||q.apply()})}function Ze(n,e,o,u,f,c,i,l){var r=(i&le)!==0,h=(i&Ae)===0,s=r?h?Ne(o,!1,!1):ee(o):o,S=i&ce?ee(f):f,m={i:S,v:s,k:u,e:null,o:!1,prev:e,next:null};if(n===null){var d=document.createDocumentFragment();d.append(n=U())}return m.e=J(()=>c(n,s,S,l)),e!==null&&(e.next=m),m}function X(n,e,o){if(n.e.nodes)for(var u=n.next?n.next.e.nodes.start:o,f=e?e.e.nodes.start:o,c=n.e.nodes.start;c!==null&&c!==u;){var i=Ce(c);f.before(c),c=i}}function I(n,e,o){e===null?(n.first=o,n.effect.first=o&&o.e):(e.e.next&&(e.e.next.prev=null),e.next=o,e.e.next=o&&o.e),o!==null&&(o.e.prev&&(o.e.prev.next=null),o.prev=e,o.e.prev=e&&e.e)}function et(n,e,o,u,f,c){let i=w;w&&K();var l=null;w&&C.nodeType===xe&&(l=C,K());var r=w?C:n,h=new Ke(r,!1);oe(()=>{const s=e()||null;var S=$e;if(s===null){h.ensure(null,null);return}return h.ensure(s,m=>{if(s){if(l=w?l:document.createElementNS(S,s),fe(l,l),u){w&&Ve(s)&&l.append(document.createComment(""));var d=w?ie(l):l.appendChild(U());w&&(d===null?B(!1):x(d)),u(l,d)}Le.nodes.end=l,m.before(l)}w&&x(m)}),()=>{}},Me),je(()=>{}),i&&(B(!0),x(r))}const gt={personal:{name:"Kofi Safo Agyekum",title:"Full Stack Developer",location:"German 🇩🇪",bio:"I like to build web applications, solve complex problems and continuously learn new technologies.",photo:"/assets/profile/profile.png",resumeUrl:"/resume.pdf"},socialLinks:[{name:"Resume",icon:"file-text",url:"#resume"},{name:"LinkedIn",icon:"linkedin",url:"https://www.linkedin.com/in/kofi-agyekum-870569298/"},{name:"GitHub",icon:"github",url:"https://github.com/Qofy"},{name:"Email",icon:"mail",url:"mailto:safokofi888@gmail.com"}],navigation:[{label:"home",href:"#home"},{label:"projects",href:"#projects"},{label:"blog",href:"#blog"},{label:"contact",href:"#contact"}],workExperience:[{id:1,period:"Jul 2023 - Present",position:"Full Stack Developer - Freelance",company:"Freelance",location:"Remote",description:["Designed and developed modern web applications using React, Node.js, and MongoDB","Implemented CI/CD pipelines and automated deployment workflows","Built responsive user interfaces with Tailwind CSS and Svelte","Collaborated with clients to gather requirements and deliver solutions"],tags:["React","Node.js","MongoDB","Svelte"]},{id:2,period:"Aug 2021 - Jul 2023",position:"Frontend Developer",company:"Tech Company",location:"Berlin, Germany",description:["Developed and maintained frontend applications using React and TypeScript","Worked closely with design team to implement pixel-perfect UI components","Optimized application performance and improved load times by 40%","Mentored junior developers and conducted code reviews"],tags:["React","TypeScript","CSS","Git"]},{id:3,period:"May 2020 - Aug 2021",position:"Junior Developer",company:"Startup Inc",location:"Remote",description:["Built web applications using HTML, CSS, JavaScript, and Vue.js","Integrated RESTful APIs and third-party services","Participated in agile development processes and daily standups","Fixed bugs and implemented new features based on user feedback"],tags:["Vue.js","JavaScript","API Integration"]}],education:[{id:1,period:"2023 - 2026",degree:"Bachelor of Science in Software Engineering",institution:"University of Europe Of Applied Science",location:"Potsdam, Germany",description:["Graduated with First Class Honors","Focused on software engineering and web development","Led university coding club and organized hackathons"]}],projects:[{id:1,title:"E-Commerce Platform",description:"Full-stack e-commerce application with cart, checkout, and payment integration",technologies:["React","Node.js","MongoDB","Stripe"],image:"/projects/ecommerce.jpg",liveUrl:"https://example.com",githubUrl:"https://github.com/yourusername/project"},{id:2,title:"Task Management App",description:"Real-time collaborative task management tool with drag-and-drop functionality",technologies:["Svelte","Firebase","Tailwind CSS"],image:"/projects/taskapp.jpg",liveUrl:"https://example.com",githubUrl:"https://github.com/yourusername/project"},{id:3,title:"Weather Dashboard",description:"Interactive weather dashboard with location search and forecasts",technologies:["Vue.js","OpenWeather API","Chart.js"],image:"/projects/weather.jpg",liveUrl:"https://example.com",githubUrl:"https://github.com/yourusername/project"}],skills:{frontend:["React","Svelte","Vue.js","TypeScript","Tailwind CSS","HTML/CSS"],backend:["Node.js","Express","MongoDB","PostgreSQL","REST APIs"],tools:["Git","Docker","CI/CD","Vite","Webpack"],other:["Agile","Problem Solving","Team Collaboration","Code Review"]}},tt=`You are an AI assistant representing Kofi Safo Agyekum's portfolio. You know everything about Kofi's professional background, skills, and experience.

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
 */const nt={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};var at=me("<svg><!><!></svg>");function it(n,e){const o=z(e,["children","$$slots","$$events","$$legacy"]),u=z(o,["name","color","size","strokeWidth","absoluteStrokeWidth","iconNode"]);Fe(e,!1);let f=D(e,"name",8,void 0),c=D(e,"color",8,"currentColor"),i=D(e,"size",8,24),l=D(e,"strokeWidth",8,2),r=D(e,"absoluteStrokeWidth",8,!1),h=D(e,"iconNode",24,()=>[]);const s=(...g)=>g.filter((v,a,p)=>!!v&&p.indexOf(v)===a).join(" ");he();var S=at();ne(S,(g,v)=>({...nt,...u,width:i(),height:i(),stroke:c(),"stroke-width":g,class:v}),[()=>(j(r()),j(l()),j(i()),te(()=>r()?Number(l())*24/Number(i()):l())),()=>(j(f()),j(o),te(()=>s("lucide-icon","lucide",f()?`lucide-${f()}`:"",o.class)))]);var m=Be(S);qe(m,1,h,Je,(g,v)=>{var a=Ue(()=>He(F(v),2));let p=()=>F(a)[0],k=()=>F(a)[1];var b=ae(),t=pe(b);et(t,p,!0,(y,_)=>{ne(y,()=>({...k()}))}),V(g,b)});var d=Ye(m);ue(d,e,"default",{}),We(S),V(n,S),Ge()}function St(n,e){const o=z(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const u=[["path",{d:"M12 8V4H8"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2"}],["path",{d:"M2 14h2"}],["path",{d:"M20 14h2"}],["path",{d:"M15 13v2"}],["path",{d:"M9 13v2"}]];it(n,Xe({name:"bot"},()=>o,{get iconNode(){return u},children:(f,c)=>{var i=ae(),l=pe(i);ue(l,e,"default",{}),V(f,i)},$$slots:{default:!0}}))}const ot="http://localhost:11434/api/generate",rt="http://localhost:11434/api/tags",st=["llama3.2:3b","llama3.2","mistral:7b","mistral","phi3:3.8b","phi3","qwen2.5:0.5b"];async function lt(){var n;try{const e=await fetch(rt);if(!e.ok)throw new Error("Could not fetch available models");const u=((n=(await e.json()).models)==null?void 0:n.map(f=>f.name))||[];for(const f of st){const c=u.find(i=>i.includes(f.split(":")[0]));if(c)return console.log(`Selected Ollama model: ${c}`),c}if(u.length>0)return console.warn(`No preferred model found. Using: ${u[0]}`),u[0];throw new Error("No Ollama models installed. Please run: ollama pull llama3.2:3b")}catch(e){return console.error("Error detecting Ollama model:",e),"qwen2.5:0.5b"}}async function wt(n,e){var o,u,f,c,i,l,r,h,s,S,m,d;try{const g=await lt();let v=tt;if(e)if(e.systemPrompt)v=e.systemPrompt;else{const b=`
PORTFOLIO INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Personal Information:
- Name: ${((o=e.personal)==null?void 0:o.name)||"Not specified"}
- Title: ${((u=e.personal)==null?void 0:u.title)||"Not specified"}
- Location: ${((f=e.personal)==null?void 0:f.location)||"Not specified"}
- Email: ${((c=e.personal)==null?void 0:c.email)||"Not specified"}
- Bio: ${((i=e.personal)==null?void 0:i.bio)||"Not specified"}

Work Experience:
${((l=e.workExperience)==null?void 0:l.map(t=>`
  • ${t.position||t.title} at ${t.company} (${t.period||`${t.startDate} - ${t.endDate||"Present"}`})
    ${Array.isArray(t.description)?t.description.join("; "):t.description||""}
`).join(`
`))||"- No work experience listed"}

Education:
${((r=e.education)==null?void 0:r.map(t=>`
  • ${t.degree} - ${t.institution||t.school} (${t.period||t.year})
    ${Array.isArray(t.description)?t.description.join("; "):t.description||""}
`).join(`
`))||"- No education listed"}

Projects:
${((h=e.projects)==null?void 0:h.map(t=>`
  • ${t.title}
    ${t.description||""}
    Technologies: ${Array.isArray(t.technologies)?t.technologies.join(", "):"Not specified"}
    ${t.liveUrl||t.link?`Link: ${t.liveUrl||t.link}`:""}
    ${t.githubUrl?`GitHub: ${t.githubUrl}`:""}
`).join(`
`))||"- No projects listed"}

Skills:
${Object.entries(e.skills||{}).map(([t,y])=>`
  ${t}: ${Array.isArray(y)?y.join(", "):"None"}
`).join(`
`)||"- No skills listed"}

Blog Posts:
${((s=e.blogPosts)==null?void 0:s.map(t=>{var y;return`
  • ${t.title}
    ${t.excerpt||""}
    Tags: ${((y=t.tags)==null?void 0:y.join(", "))||"None"}
`}).join(`
`))||"- No blog posts available"}

Social Links:
${((S=e.socialLinks)==null?void 0:S.map(t=>`
  • ${t.name}: ${t.url}
`).join(`
`))||"- No social links listed"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;v=`You are ${((m=e.personal)==null?void 0:m.name)||"the portfolio owner"} answering questions about your professional background in a virtual interview.

⚠️ CRITICAL - FOLLOW THESE RULES EXACTLY OR YOUR RESPONSE IS WRONG:

1. ANSWER IN FIRST PERSON: Say "I", "my", "me" (not "they/their")

2. COPY-PASTE ONLY FROM PORTFOLIO DATA BELOW:
   ❌ WRONG: "In 2019, I joined Intuivo as a Backend Developer building an e-commerce platform using React, Next.js, Django, Python, and Docker."
   ✅ RIGHT: "In 2019, I worked at [EXACT COMPANY NAME] as [EXACT JOB TITLE]. [COPY EXACT DESCRIPTION FROM PORTFOLIO - NOTHING MORE]"

   If the portfolio says: "Backend Developer at XYZ Corp (2019 - 2020): Built web apps"
   You must say: "I worked as a Backend Developer at XYZ Corp during 2019 - 2020. I built web apps."

   DO NOT ADD: technologies, frameworks, details, or anything not explicitly written

3. VERIFY BEFORE ANSWERING:
   - Is the company name EXACTLY in the portfolio? If not, DON'T mention it
   - Is the technology EXACTLY listed? If not, DON'T mention it
   - Is the date EXACTLY written? If not, DON'T mention it
   - Are you COPYING word-for-word from the portfolio? If not, STOP

4. RESPONSE FORMAT:
   Give DIRECT answers only. NO steps, NO thinking process.

   Example:
   Question: "What did you do in 2019?"
   ✅ RIGHT: "I worked as Backend Developer at XYZ Corp during 2019 - 2020. I built web apps."
   ❌ WRONG: "Step 1: Check portfolio... Step 2: Copy exact... Answer: I worked..."

5. IF ASKED ABOUT SPECIFIC YEAR/COMPANY/ROLE:
   - First, verify it EXISTS in portfolio below
   - If it exists, COPY it exactly
   - If it doesn't exist, say: "I don't see that in my portfolio. Let me tell you what I DO have: [list what's actually there]"

6. FORBIDDEN WORDS/PHRASES (Never use unless in portfolio):
   ❌ "building an e-commerce platform"
   ❌ "using React, Next.js, Django, Python, Docker"
   ❌ "allowed users to"
   ❌ Any technology not explicitly listed
   ❌ Any company name not explicitly listed
   ❌ Any detail not explicitly written

${b}

⚠️ FINAL CHECK BEFORE ANSWERING:
- Did I copy company name EXACTLY? (YES/NO)
- Did I copy job title EXACTLY? (YES/NO)
- Did I copy dates EXACTLY? (YES/NO)
- Did I copy description EXACTLY? (YES/NO)
- Did I add ANY extra details? (MUST BE NO)

If ANY answer is NO, your response is WRONG. Fix it.

NOW ANSWER AS ${((d=e.personal)==null?void 0:d.name)||"yourself"} using ONLY exact information above:`}const a=`${v}

User: ${n}

Assistant:`,p=await fetch(ot,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:g,prompt:a,stream:!1,system:"You are a fact-checking assistant. You must only state information that is explicitly written in the provided context. Never add details, never elaborate, never infer. Copy exact wording from the context only.",options:{temperature:0,top_p:.3,top_k:5,repeat_penalty:1.1,num_predict:200}})});if(!p.ok)throw new Error(`Ollama API error: ${p.statusText}`);return(await p.json()).response}catch(g){throw console.error("Error communicating with Ollama:",g),g instanceof TypeError&&g.message.includes("fetch")?new Error("Cannot connect to Ollama. Make sure Ollama is running on localhost:11434"):g}}export{St as B,it as I,qe as e,Je as i,gt as p,wt as s};
