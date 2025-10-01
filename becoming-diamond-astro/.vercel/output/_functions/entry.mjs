import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DHU94od4.mjs';
import { manifest } from './manifest_B4z5GYqi.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/app.astro.mjs');
const _page3 = () => import('./pages/landing.astro.mjs');
const _page4 = () => import('./pages/oauth/callback.astro.mjs');
const _page5 = () => import('./pages/oauth.astro.mjs');
const _page6 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["node_modules/astro-decap-cms-oauth/src/admin.astro", _page1],
    ["src/pages/app.astro", _page2],
    ["src/pages/landing.astro", _page3],
    ["node_modules/astro-decap-cms-oauth/src/oauth/callback.ts", _page4],
    ["node_modules/astro-decap-cms-oauth/src/oauth/index.ts", _page5],
    ["src/pages/index.astro", _page6]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "2f9e6864-de60-4be9-ac23-9d5f7cf513e7",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
