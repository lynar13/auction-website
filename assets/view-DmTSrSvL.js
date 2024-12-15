import{a as p}from"./listing-xXRwS0O9.js";import"./app-BPAMsPET.js";let n=1,s=12;document.addEventListener("DOMContentLoaded",()=>{l(n,s),g()});async function l(e,o){try{const a=await p(e,o),i=document.getElementById("listingList");i.innerHTML="",a.forEach(t=>{const d=document.createElement("div");d.className="col-lg-4 col-md-6 col-sm-12 mb-4";const c=t.media?.[0]?.url?`<img src="${t.media[0].url}" alt="${t.title}" class="img-fluid rounded mb-3">`:'<img src="https://via.placeholder.com/400" alt="Default Image" class="img-fluid rounded mb-3">',m=t.endsAt?`<p class="text-muted"><strong>Ends At:</strong> ${new Date(t.endsAt).toLocaleString()}</p>`:'<p class="text-muted"><strong>Ends At:</strong> No expiration date</p>',u=t.id?`<a href="/auction-website/listing/index.html?id=${encodeURIComponent(t.id)}" class="btn btn-primary mt-auto">Place a Bid</a>`:'<p class="text-muted small">No valid listing ID available.</p>';d.innerHTML=`
        <div class="card h-100 shadow-sm">
          ${c}
          <div class="card-body">
            <h4 class="card-title">${t.title||"Untitled"}</h4>
            <p class="card-text">${t.description?t.description.slice(0,100)+"...":"No description available"}</p>
            ${m}
            ${u}
            <a href="/auction-website/listing/index.html?id=${t.id}" class="btn btn-primary">Read More</a>
          </div>
        </div>
      `,i.appendChild(d)})}catch(a){console.error("Failed to load listings:",a)}}function g(){const e=document.querySelectorAll("[data-page]"),o=document.querySelectorAll("[data-limit]");e.length>0&&e.forEach(a=>{a.addEventListener("click",i=>{i.preventDefault();const t=parseInt(a.getAttribute("data-page"));h(t)})}),o.length>0&&o.forEach(a=>{a.addEventListener("click",i=>{i.preventDefault();const t=parseInt(a.getAttribute("data-limit"));f(t)})})}function h(e){n=e,l(n,s),r()}function f(e){s=e,n=1,l(n,s),r()}function r(){const e=new URL(window.location);e.searchParams.set("page",n),e.searchParams.set("limit",s),window.history.pushState({},"",e)}
