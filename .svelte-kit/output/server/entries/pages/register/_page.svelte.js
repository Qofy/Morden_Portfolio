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
    let username = "";
    let email = "";
    let password = "";
    let confirmPassword = "";
    let success = false;
    let loading = false;
    $$renderer2.push(`<div class="register-container svelte-52fghe"><div class="register-box svelte-52fghe"><h1 class="svelte-52fghe">Create Your Portfolio</h1> <p class="subtitle svelte-52fghe">Join and showcase your work</p> `);
    {
      $$renderer2.push("<!--[!-->");
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> <form><div class="form-group svelte-52fghe"><label for="username" class="svelte-52fghe">Username</label> <input type="text" id="username"${attr("value", username)} placeholder="Choose a username" required${attr("disabled", success, true)} class="svelte-52fghe"/> <small class="svelte-52fghe">This will be your portfolio URL</small></div> <div class="form-group svelte-52fghe"><label for="email" class="svelte-52fghe">Email</label> <input type="email" id="email"${attr("value", email)} placeholder="Enter your email" required${attr("disabled", success, true)} class="svelte-52fghe"/></div> <div class="form-group svelte-52fghe"><label for="password" class="svelte-52fghe">Password</label> <input type="password" id="password"${attr("value", password)} placeholder="Create a password (min 6 characters)" required${attr("disabled", success, true)} class="svelte-52fghe"/></div> <div class="form-group svelte-52fghe"><label for="confirmPassword" class="svelte-52fghe">Confirm Password</label> <input type="password" id="confirmPassword"${attr("value", confirmPassword)} placeholder="Confirm your password" required${attr("disabled", success, true)} class="svelte-52fghe"/></div> <button type="submit" class="btn-primary svelte-52fghe"${attr("disabled", success, true)}>${escape_html("Create Account")}</button></form> <div class="links svelte-52fghe"><button class="link-btn svelte-52fghe"${attr("disabled", loading, true)}>Already have an account? Login</button> <button class="link-btn svelte-52fghe"${attr("disabled", loading, true)}>Back to Home</button></div></div></div>`);
  });
}
export {
  _page as default
};
