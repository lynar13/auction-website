import{N as s}from"./app-DP7YxoMj.js";const n=new s;async function i(r){r.preventDefault();const o=r.target,a=new FormData(o),t=Object.fromEntries(a.entries());console.log("Form Data:",t);try{if(!t.name||!t.email||!t.password)throw new Error("All fields are required: Name, Email, and Password")}catch(e){console.error("Validation Error:",e.message),alert(`Registration failed: ${e.message}`);return}try{const{user:e}=await n.auth.register(t);if(!e)throw new Error("Registration failed: No user data returned");console.log(`User registered successfully with name: ${e.name} and email: ${e.email}`),localStorage.setItem("user",JSON.stringify(e)),console.log("Stored User in localStorage:",JSON.parse(localStorage.getItem("user"))),alert("Registration successful! Please log in to continue."),window.location.href="/auction-website/auth/login/index.html"}catch(e){console.error("Error during registration:",e.message),alert(`Registration failed: ${e.message}`)}}document.addEventListener("DOMContentLoaded",()=>{const r=document.getElementById("registerForm");r?r.addEventListener("submit",i):console.error("Registration form not found in the DOM.")});export{i as onRegister};
