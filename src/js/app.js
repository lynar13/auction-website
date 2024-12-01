import router from "/src/js/router/index.js"; 

import "../css/style.scss";
// Wrap the router call in an async function
async function initRouter() {
  await router(window.location.pathname);
}

initRouter();
