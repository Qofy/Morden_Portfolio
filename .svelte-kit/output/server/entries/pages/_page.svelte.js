import "clsx";
import { p as portfolioStore } from "../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
/* empty css                                                */
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    portfolioStore.subscribe((data) => {
    });
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading-container svelte-1uha8ag"><div class="loading-spinner svelte-1uha8ag"></div> <p class="svelte-1uha8ag">Loading portfolio...</p></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
