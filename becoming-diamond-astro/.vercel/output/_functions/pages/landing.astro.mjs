/* empty css                                 */
import { e as createComponent, m as maybeRenderHead, r as renderTemplate, l as renderComponent } from '../chunks/astro/server_DNBQcFRE.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DAL4_UGB.mjs';
import 'clsx';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
export { renderers } from '../renderers.mjs';

const $$HeroSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="flex items-center justify-center min-h-screen px-4"> <div class="text-center max-w-2xl mx-auto"> <h1 class="text-5xl md:text-6xl lg:text-8xl font-bold mb-6">
Aceternity AI
</h1> <p class="text-lg md:text-xl text-gray-400 mb-8">
Modern web experiences with elegant design
</p> </div> </section>`;
}, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/components/landing/HeroSection.astro", void 0);

function AuthForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = "/app";
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: "email",
          className: "block text-sm font-medium text-gray-300 mb-2",
          children: "Email"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          id: "email",
          name: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          placeholder: "you@example.com",
          required: true,
          className: "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: "password",
          className: "block text-sm font-medium text-gray-300 mb-2",
          children: "Password"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          id: "password",
          name: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          placeholder: "••••••••",
          required: true,
          className: "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3", children: error }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        disabled: isLoading,
        className: "w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors",
        children: isLoading ? "Signing in..." : "Sign In"
      }
    )
  ] });
}

const $$AuthSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="flex items-center justify-center min-h-[50vh] px-4 pb-20"> <div class="w-full max-w-md"> <div class="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10"> <h2 class="text-2xl font-semibold mb-6 text-center">Get Started</h2> ${renderComponent($$result, "AuthForm", AuthForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/components/landing/AuthForm", "client:component-export": "default" })} </div> </div> </section>`;
}, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/components/landing/AuthSection.astro", void 0);

const $$Landing = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Aceternity AI" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-black text-white"> ${renderComponent($$result2, "HeroSection", $$HeroSection, {})} ${renderComponent($$result2, "AuthSection", $$AuthSection, {})} </main> ` })}`;
}, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/pages/landing.astro", void 0);

const $$file = "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/pages/landing.astro";
const $$url = "/landing";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Landing,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
