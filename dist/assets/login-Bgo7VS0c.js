import{N as a}from"./app-BSg41Yl5.js";const i=new a;async function l(e){e.preventDefault();const n=e.target,r=new FormData(n),s=Object.fromEntries(r.entries());try{const{user:o,token:t}=await i.auth.login(s);if(o&&t)localStorage.setItem("user",JSON.stringify(o)),localStorage.setItem("token",t),console.log("User stored in localStorage:",JSON.parse(localStorage.getItem("user"))),console.log("Token stored in localStorage:",localStorage.getItem("token")),window.location.href="/index.html";else throw new Error("User or access token is undefined")}catch(o){alert("Login failed: "+o.message),console.error("Login Error:",o.message)}}document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("loginForm");e?e.addEventListener("submit",l):console.error("Login form not found in the DOM")});export{l as onLogin};