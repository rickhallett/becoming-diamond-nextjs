import { e as createComponent, f as createAstro, h as addAttribute, l as renderHead, o as renderSlot, r as renderTemplate } from './astro/server_C1911K9M.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                       */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "Aceternity AI - Modern web experiences with elegant design",
    image = "/og-image.png",
    url = Astro2.site || "https://becoming-diamond-astro.vercel.app"
  } = Astro2.props;
  const canonicalUrl = new URL(Astro2.url.pathname, url).toString();
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width, initial-scale=1.0"><!-- SEO --><link rel="canonical"${addAttribute(canonicalUrl, "href")}><meta name="robots" content="index, follow"><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(canonicalUrl, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(image, "content")}><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(canonicalUrl, "content")}><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image"${addAttribute(image, "content")}><!-- Favicon --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
