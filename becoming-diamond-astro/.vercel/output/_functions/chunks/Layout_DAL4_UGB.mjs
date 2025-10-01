import { e as createComponent, f as createAstro, h as addAttribute, k as renderHead, n as renderSlot, r as renderTemplate } from './astro/server_DNBQcFRE.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                       */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description = "Aceternity AI - Modern Web Experience" } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
