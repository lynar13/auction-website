import{a as u}from"./listing-C2KN82Sj.js";import"./cachedFetch-OvMXQHTG.js";import"./app-vh6XL3P4.js";let n=1,s=12;document.addEventListener("DOMContentLoaded",()=>{r(n,s),g()});async function r(e,o){try{const a=await u(e,o),i=document.getElementById("listingList");i.innerHTML="",a.forEach(t=>{const d=document.createElement("div");d.className="col-lg-4 col-md-6 col-sm-12 mb-4";const c=t.media?.[0]?.url?`<img src="${t.media[0].url}" alt="${t.title}" class="img-fluid rounded mb-3">`:'<img src="https://via.placeholder.com/400" alt="Default Image" class="img-fluid rounded mb-3">',m=t.endsAt?`<p class="text-muted"><strong>Ends At:</strong> ${new Date(t.endsAt).toLocaleString()}</p>`:'<p class="text-muted"><strong>Ends At:</strong> No expiration date</p>',p=t.id?`<a href="/listing/index.html?id=${encodeURIComponent(t.id)}" class="btn btn-primary mt-auto">Place a Bid</a>`:'<p class="text-muted small">No valid listing ID available.</p>';d.innerHTML=`
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
      `,i.appendChild(d)})}catch(a){console.error("Failed to load listings:",a)}}function g(){const e=document.querySelectorAll("[data-page]"),o=document.querySelectorAll("[data-limit]");e.length>0&&e.forEach(a=>{a.addEventListener("click",i=>{i.preventDefault();const t=parseInt(a.getAttribute("data-page"));h(t)})}),o.length>0&&o.forEach(a=>{a.addEventListener("click",i=>{i.preventDefault();const t=parseInt(a.getAttribute("data-limit"));f(t)})})}function h(e){n=e,r(n,s),l()}function f(e){s=e,n=1,r(n,s),l()}function l(){const e=new URL(window.location);e.searchParams.set("page",n),e.searchParams.set("limit",s),window.history.pushState({},"",e)}
