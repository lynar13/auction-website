import{a as u}from"./listing-DDq9Lyx5.js";import"./app-BSg41Yl5.js";let i=1,s=12;document.addEventListener("DOMContentLoaded",()=>{l(i,s),g()});async function l(e,o){try{const a=await u(e,o),n=document.getElementById("listingList");n.innerHTML="",a.forEach(t=>{const d=document.createElement("div");d.className="col-lg-4 col-md-6 col-sm-12 mb-4";const c=t.media?.[0]?.url?`<img src="${t.media[0].url}" alt="${t.title}" class="img-fluid rounded mb-3">`:'<img src="https://via.placeholder.com/400" alt="Default Image" class="img-fluid rounded mb-3">',m=t.endsAt?`<p class="text-muted"><strong>Ends At:</strong> ${new Date(t.endsAt).toLocaleString()}</p>`:'<p class="text-muted"><strong>Ends At:</strong> No expiration date</p>',p=t.id?`<a href="/listing/index.html?id=${encodeURIComponent(t.id)}" class="btn btn-primary mt-auto">Place a Bid</a>`:'<p class="text-muted small">No valid listing ID available.</p>';d.innerHTML=`
        <div class="card h-100 shadow-sm">
          ${c}
          <div class="card-body">
            <h4 class="card-title">${t.title||"Untitled"}</h4>
            <p class="card-text">${t.description?t.description.slice(0,100)+"...":"No description available"}</p>
            ${m}
            ${p}
            <a href="/listing/index.html?id=${t.id}" class="btn btn-primary">Read More</a>
          </div>
        </div>
      `,n.appendChild(d)})}catch(a){console.error("Failed to load listings:",a)}}function g(){const e=document.querySelectorAll("[data-page]"),o=document.querySelectorAll("[data-limit]");e.length>0&&e.forEach(a=>{a.addEventListener("click",n=>{n.preventDefault();const t=parseInt(a.getAttribute("data-page"));h(t)})}),o.length>0&&o.forEach(a=>{a.addEventListener("click",n=>{n.preventDefault();const t=parseInt(a.getAttribute("data-limit"));f(t)})})}function h(e){i=e,l(i,s),r()}function f(e){s=e,i=1,l(i,s),r()}function r(){const e=new URL(window.location);e.searchParams.set("page",i),e.searchParams.set("limit",s),window.history.pushState({},"",e)}
