/* empty css                                 */
import { e as createComponent, l as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DNBQcFRE.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DAL4_UGB.mjs';
export { renderers } from '../renderers.mjs';

const $$App = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "App - Aceternity AI" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-black text-white flex items-center justify-center px-4"> <div class="text-center max-w-2xl mx-auto"> <h1 class="text-4xl md:text-5xl font-bold mb-4">
Welcome to the App
</h1> <p class="text-lg text-gray-400 mb-8">
You've successfully authenticated. This page will be enhanced in future phases.
</p> <a href="/landing" class="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
Back to Landing
</a> </div> </main> ` })}`;
}, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/pages/app.astro", void 0);

const $$file = "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/pages/app.astro";
const $$url = "/app";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$App,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
