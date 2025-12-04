import { U as store_get, V as slot, W as unsubscribe_stores } from "../../chunks/index2.js";
import { a as authStore } from "../../chunks/stores.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$authStore", authStore).user;
    $$renderer2.push(`<main class="app-container svelte-12qhfyh"><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></main>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
