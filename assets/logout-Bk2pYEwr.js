function t(){try{localStorage.removeItem("token"),localStorage.removeItem("user"),alert("User has been logged out"),setTimeout(()=>{window.location.href="./index.html"},500)}catch(o){console.error("Error during logout:",o),alert("An error occurred while logging out. Please try again.")}}function e(){const o=document.getElementById("logoutButton");o?o.addEventListener("click",t):(console.error("Logout button not found in the DOM. Retrying..."),setTimeout(e,500))}document.addEventListener("DOMContentLoaded",e);
