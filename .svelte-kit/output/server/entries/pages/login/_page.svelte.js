import { a as attr } from "../../../chunks/attributes.js";
import { e as escape_html } from "../../../chunks/escaping.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import "../../../chunks/stores.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let email = "";
    let password = "";
    let loading = false;
    $$renderer2.push(`<div class="login-container svelte-1x05zx6"><div class="login-box svelte-1x05zx6"><h1 class="svelte-1x05zx6">Login to Your Portfolio</h1> <p class="subtitle svelte-1x05zx6">Manage and customize your portfolio</p> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <form><div class="form-group svelte-1x05zx6"><label for="email" class="svelte-1x05zx6">Email</label> <input type="email" id="email"${attr("value", email)} placeholder="Enter your email" required${attr("disabled", loading, true)} class="svelte-1x05zx6"/></div> <div class="form-group svelte-1x05zx6"><label for="password" class="svelte-1x05zx6">Password</label> <input type="password" id="password"${attr("value", password)} placeholder="Enter your password" required${attr("disabled", loading, true)} class="svelte-1x05zx6"/></div> <button type="submit" class="btn-primary svelte-1x05zx6"${attr("disabled", loading, true)}>${escape_html("Login")}</button></form> <div class="links svelte-1x05zx6"><button class="link-btn svelte-1x05zx6"${attr("disabled", loading, true)}>Don't have an account? Register</button> <button class="link-btn svelte-1x05zx6"${attr("disabled", loading, true)}>Back to Home</button></div></div></div>`);
  });
}
export {
  _page as default
};
