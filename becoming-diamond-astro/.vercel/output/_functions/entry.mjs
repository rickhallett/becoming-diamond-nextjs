import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_E8sumjZ_.mjs';
import { manifest } from './manifest_Bcxe5sl_.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/500.astro.mjs');
const _page3 = () => import('./pages/admin.astro.mjs');
const _page4 = () => import('./pages/app.astro.mjs');
const _page5 = () => import('./pages/landing.astro.mjs');
const _page6 = () => import('./pages/oauth/callback.astro.mjs');
const _page7 = () => import('./pages/oauth.astro.mjs');
const _page8 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/500.astro", _page2],
    ["node_modules/astro-decap-cms-oauth/src/admin.astro", _page3],
    ["src/pages/app.astro", _page4],
    ["src/pages/landing.astro", _page5],
    ["node_modules/astro-decap-cms-oauth/src/oauth/callback.ts", _page6],
    ["node_modules/astro-decap-cms-oauth/src/oauth/index.ts", _page7],
    ["src/pages/index.astro", _page8]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "cb1d6e26-10b0-4803-93fd-f18553558b59",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
