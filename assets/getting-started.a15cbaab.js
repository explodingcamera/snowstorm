import{j as e}from"./jsx-runtime.f9f14ca4.js";import{a as r}from"./index.1acfd37d.js";const l="Getting Started";function i(n={}){const{wrapper:t}=n.components||{};return t?e.exports.jsx(t,Object.assign({},n,{children:e.exports.jsx(o,{})})):o();function o(){const s=Object.assign({blockquote:"blockquote",p:"p",strong:"strong",h2:"h2",ul:"ul",li:"li",code:"code",pre:"pre",span:"span"},n.components);return e.exports.jsxs(e.exports.Fragment,{children:[e.exports.jsxs(s.blockquote,{children:[`
`,e.exports.jsxs(s.p,{children:[e.exports.jsx(s.strong,{children:"Welcome to Snowstorm's Documentation!"}),e.exports.jsx("br",{}),`
Please note that this site is still incomplete.
I'm actively working on version 1.0, which will hopefully be ready in the coming months. Until then, expect bugs and breaking changes.`]}),`
`]}),`
`,e.exports.jsx(s.h2,{children:"Caveats"}),`
`,e.exports.jsxs(s.ul,{children:[`
`,e.exports.jsxs(s.li,{children:["Dynamic routing is not supported for exported sites yet. Alternatively, you can specify routes on build-time, more on that ",e.exports.jsx(r,{to:"/docs/dynamic-routes",children:"here"}),"."]}),`
`]}),`
`,e.exports.jsx(s.h2,{children:"Alright, let's actually get started now!"}),`
`,e.exports.jsxs(s.p,{children:["Getting started with snowstorm takes less than a minute and doesn't any require confusing ",e.exports.jsx(s.code,{children:"init"})," commands:"]}),`
`,e.exports.jsx(s.pre,{className:"language-bash",children:e.exports.jsxs(s.code,{className:"language-bash",children:[e.exports.jsx(s.span,{className:"token comment",children:"# install the required dependencies"}),`
$ `,e.exports.jsx(s.span,{className:"token function",children:"npm"})," ",e.exports.jsx(s.span,{className:"token function",children:"install"}),` -S @snowstorm/core @snowstorm/cli react@18 react-dom@18 typescript

`,e.exports.jsx(s.span,{className:"token comment",children:"# (optional) enable scss support:"}),`
$ `,e.exports.jsx(s.span,{className:"token function",children:"npm"})," ",e.exports.jsx(s.span,{className:"token function",children:"install"}),` -S sass

`,e.exports.jsx(s.span,{className:"token comment",children:"# this folder will contain all webpages"}),`
$ `,e.exports.jsx(s.span,{className:"token function",children:"mkdir"}),` pages
$ `,e.exports.jsx(s.span,{className:"token builtin class-name",children:"echo"})," ",e.exports.jsx(s.span,{className:"token string",children:"'export const Index = () => <h1>Hello World</h1>'"})," ",e.exports.jsx(s.span,{className:"token operator",children:">"}),` pages/index.tsx

`,e.exports.jsx(s.span,{className:"token comment",children:"# (optional) enable typescript support"}),`
$ `,e.exports.jsx(s.span,{className:"token builtin class-name",children:"echo"})," ",e.exports.jsx(s.span,{className:"token string",children:`'{ "extends": "@snowstorm/core/tsconfig.base.json" }'`})," ",e.exports.jsx(s.span,{className:"token operator",children:">"}),` tsconfig.json

`,e.exports.jsx(s.span,{className:"token comment",children:"# start the development server"}),`
$ npx snowstorm dev
`]})}),`
`,e.exports.jsx("pre",{className:"language-terminal",children:e.exports.jsxs(s.p,{children:[e.exports.jsx("b",{children:"INFO"}),` starting snowstorm v0.10.0 (development mode)
`,e.exports.jsx("b",{children:"INFO"}),` started in 19ms
`,e.exports.jsx("b",{children:"INFO"})," listening on ",e.exports.jsx("u",{children:"http:/\u200B/localhost:2020/"})]})})]})}}export{i as default,l as title};
