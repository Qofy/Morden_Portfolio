import { X as bind_props, Y as attr_class } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import { e as escape_html } from "../../../chunks/escaping.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { a as authStore } from "../../../chunks/stores.js";
import { a as attr } from "../../../chunks/attributes.js";
function DashboardOverview($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let user = $$props["user"];
    let loading = true;
    $$renderer2.push(`<div class="overview svelte-txbjoy"><div class="overview-header svelte-txbjoy"><h2 class="svelte-txbjoy">Portfolio Overview</h2> <button class="btn-download svelte-txbjoy"${attr("disabled", loading, true)}>Download as PDF</button></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-txbjoy">Loading your portfolio data...</div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { user });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeTab = "overview";
    let user = null;
    authStore.subscribe((state) => {
      user = state.user;
    });
    if (user) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="dashboard svelte-x1i5gj"><header class="dashboard-header svelte-x1i5gj"><div class="header-content svelte-x1i5gj"><h1 class="svelte-x1i5gj">Portfolio Dashboard</h1> <p class="welcome svelte-x1i5gj">Welcome back, ${escape_html(user.username)}!</p></div> <div class="header-actions svelte-x1i5gj"><button class="btn-secondary svelte-x1i5gj">View Portfolio</button> <button class="btn-logout svelte-x1i5gj">Logout</button></div></header> <div class="dashboard-content svelte-x1i5gj"><nav class="tabs svelte-x1i5gj"><button${attr_class("tab svelte-x1i5gj", void 0, { "active": activeTab === "overview" })}>Overview</button> <button${attr_class("tab svelte-x1i5gj", void 0, { "active": activeTab === "edit" })}>Edit Portfolio</button> <button${attr_class("tab svelte-x1i5gj", void 0, { "active": activeTab === "interview" })}>AI Interview</button></nav> <div class="tab-content svelte-x1i5gj">`);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<!---->`);
        {
          DashboardOverview($$renderer2, { user });
        }
        $$renderer2.push(`<!---->`);
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
