/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_C1911K9M.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_Cq7s04YD.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "404 - Page Not Found" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-black text-white flex items-center justify-center px-4"> <div class="text-center max-w-2xl mx-auto"> <h1 class="text-6xl md:text-8xl font-bold mb-4 text-purple-600">
404
</h1> <h2 class="text-2xl md:text-3xl font-semibold mb-4">
Page Not Found
</h2> <p class="text-gray-400 mb-8">
The page you're looking for doesn't exist or has been moved.
</p> <a href="/landing" class="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
Go Home
</a> </div> </main> ` })}`;
}, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/pages/404.astro", void 0);

const $$file = "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
