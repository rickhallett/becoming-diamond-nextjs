/* empty css                                 */
import { e as createComponent, f as createAstro, h as addAttribute, k as renderHead, l as renderSlot, r as renderTemplate, n as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_CK61d8bl.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description = "Aceternity AI - Modern Web Experience" } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/layouts/Layout.astro", void 0);

const $$Landing = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Aceternity AI" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-black text-white"> <!-- Hero Section --> <section class="flex items-center justify-center min-h-screen px-4"> <div class="text-center max-w-2xl mx-auto"> <h1 class="text-5xl md:text-6xl lg:text-8xl font-bold mb-6">
Aceternity AI
</h1> <p class="text-lg md:text-xl text-gray-400 mb-8">
Modern web experiences with elegant design
</p> </div> </section> <!-- Auth Section Placeholder --> <section class="flex items-center justify-center min-h-[50vh] px-4 pb-20"> <div class="w-full max-w-md"> <div class="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10"> <h2 class="text-2xl font-semibold mb-4">Get Started</h2> <p class="text-gray-400 mb-6">
Authentication form will be added in the next phase
</p> <button class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
Enter
</button> </div> </div> </section> </main> ` })}`;
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
