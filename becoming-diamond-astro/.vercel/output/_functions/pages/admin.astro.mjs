/* empty css                                 */
import { e as createComponent, r as renderTemplate, h as addAttribute, k as renderHead } from '../chunks/astro/server_DNBQcFRE.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const PUBLIC_DECAP_CMS_VERSION = "3.3.3";

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Admin = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex"><link href="/admin/config.yml" type="text/yaml" rel="cms-config-url"><title>Content Manager</title>', "</head> <body> <!-- Include the script that builds the page and powers Decap CMS --> <script", "><\/script> </body> </html>"])), renderHead(), addAttribute(`https://unpkg.com/decap-cms@^${PUBLIC_DECAP_CMS_VERSION}/dist/decap-cms.js`, "src"));
}, "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/node_modules/astro-decap-cms-oauth/src/admin.astro", void 0);

const $$file = "/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-astro/node_modules/astro-decap-cms-oauth/src/admin.astro";
const $$url = undefined;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Admin,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
