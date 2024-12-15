const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/create-DaTZEmbO.js","assets/listing-CzwvzXFI.js","assets/edit-C9LF98CN.js","assets/view-CZM86PM7.js","assets/profile-DHkEAXBR.js","assets/profile-CUZq2tJi.js","assets/viewList-gtxPewOb.js","assets/home-D3jrPWjX.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(t){if(t.ep)return;t.ep=!0;const r=n(t);fetch(t.href,r)}})();const A="modulepreload",P=function(o){return"/auction-website/"+o},m={},u=function(e,n,s){let t=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),a=i?.nonce||i?.getAttribute("nonce");t=Promise.allSettled(n.map(c=>{if(c=P(c),c in m)return;m[c]=!0;const d=c.endsWith(".css"),y=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${y}`))return;const l=document.createElement("link");if(l.rel=d?"stylesheet":A,d||(l.as="script"),l.crossOrigin="",l.href=c,a&&l.setAttribute("nonce",a),document.head.appendChild(l),d)return new Promise((E,S)=>{l.addEventListener("load",E),l.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return t.then(i=>{for(const a of i||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})},b="78300a41-8e7a-40b2-804e-14463ccd9ab1",g="https://v2.api.noroff.dev",_=`${g}/auth`,O=`${_}/login`,v=`${_}/register`,p=`${g}/auction`,I=`${p}/listings`,k=`${p}/profiles`,$=o=>`${I}/${o}`,N=`${I}/search`,R=o=>`https://v2.api.noroff.dev/auction/listings/${o}/bids`;function f(o=!0,e=!1){const n=e?{}:{"Content-Type":"application/json"},s=localStorage.getItem("token");return o&&s&&(n.Authorization=`Bearer ${s}`),n["X-Noroff-API-Key"]=b,o&&s&&(n.Authorization=`Bearer ${s}`),n}class T{constructor(){this.auth.login=this.auth.login.bind(this),this.auth.register=this.auth.register.bind(this)}get user(){try{const e=localStorage.getItem("user");return e?JSON.parse(e):null}catch{return null}}set user(e){localStorage.setItem("user",JSON.stringify(e))}get token(){return localStorage.getItem("token")||null}set token(e){localStorage.setItem("token",e)}auth={login:async function({email:e,password:n}){const s=JSON.stringify({email:e,password:n}),t=await fetch(O,{method:"POST",headers:f(!0),body:s});if(t.ok){const{data:i}=await t.json(),{accessToken:a,...c}=i;return this.user=c,this.token=a,{user:c,token:a}}const r=await t.json();throw new Error(r.message||"Couldn't login")}.bind(this),register:async function({name:e,email:n,password:s}){const t=JSON.stringify({name:e,email:n,password:s}),r=await fetch(v,{method:"POST",headers:f(!1),body:t}),i=await r.json();if(r.ok){const a=i.data;if(!a)throw new Error("No user data returned from the API");return localStorage.setItem("user",JSON.stringify(a)),{user:a}}throw new Error(i.message||"Couldn't register")}.bind(this)};search={listings:async e=>{const n=new URL(`${N}?q=${e}`),s=await fetch(n,{headers:f()});if(s.ok){const{data:t}=await s.json();return t}throw new Error("Couldn't search listings")}}}new T;function h(){const o=localStorage.getItem("user");if(o)try{const e=JSON.parse(o);if(!e||!e.email||!e.name)throw new Error("Invalid user data: Missing email or name");return e}catch(e){return console.error("Error parsing user data:",e.message),alert("Invalid user data. Please log in again."),localStorage.removeItem("user"),window.location.href="/auction-website/auth/login/index.html",!1}return alert("You must be logged in to access this page."),window.location.href="/auction-website/auth/login/index.html",!1}async function w(o=window.location.pathname){switch(o.replace("/auction-website","")){case"/auth/login/index.html":await u(()=>import("./login-88DjhwZA.js"),[]);break;case"/auth/register/index.html":await u(()=>import("./register-CaCoqvAS.js"),[]);break;case"/listing/create/index.html":h()&&await u(()=>import("./create-DaTZEmbO.js"),__vite__mapDeps([0,1]));break;case"/listing/edit/index.html":h()&&await u(()=>import("./edit-C9LF98CN.js"),__vite__mapDeps([2,1]));break;case"/listing/index.html":await u(()=>import("./view-CZM86PM7.js"),__vite__mapDeps([3,1]));break;case"/profile/index.html":h()&&await u(()=>import("./profile-DHkEAXBR.js"),__vite__mapDeps([4,5]));break;case"/listings/index.html":await u(()=>import("./viewList-gtxPewOb.js"),__vite__mapDeps([6,1,5]));break;default:await u(()=>import("./home-D3jrPWjX.js"),__vite__mapDeps([7,1]))}}document.addEventListener("DOMContentLoaded",()=>{const o=document.getElementById("loginButton"),e=document.getElementById("registerButton"),n=document.getElementById("logoutButton"),s=localStorage.getItem("token"),t=localStorage.getItem("user");if(s&&t)try{const r=JSON.parse(t);o&&(o.style.display="none"),e&&(e.style.display="none"),n&&(n.style.display="inline-block")}catch(r){console.error("Error parsing user data:",r.message),localStorage.removeItem("user")}else o&&(o.style.display="inline-block"),e&&(e.style.display="inline-block"),n&&(n.style.display="none");w()});async function L(){await w(window.location.pathname)}L();export{R as A,T as N,k as a,$ as b,N as c,I as d,f as h};