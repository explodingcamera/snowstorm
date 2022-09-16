import{j as s}from"./jsx-runtime.c93d6323.js";import"./index.b9548439.js";const r="CSS";function a(n){const e=Object.assign({p:"p",code:"code",pre:"pre",span:"span",h2:"h2"},n.components);return s.exports.jsxs(s.exports.Fragment,{children:[s.exports.jsx(e.p,{children:"Out of the box, snowstorm supports just importing your css files:"}),`
`,s.exports.jsx("br",{}),`
`,s.exports.jsx(e.p,{children:s.exports.jsx(e.code,{children:"pages/index.css"})}),`
`,s.exports.jsx(e.pre,{className:"language-css",children:s.exports.jsxs(e.code,{className:"language-css",children:[s.exports.jsx(e.span,{className:"token selector",children:"html"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
  `,s.exports.jsx(e.span,{className:"token property",children:"color"}),s.exports.jsx(e.span,{className:"token punctuation",children:":"})," ",s.exports.jsx(e.span,{className:"token color",children:"red"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
`,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),`
`]})}),`
`,s.exports.jsx(e.p,{children:s.exports.jsx(e.code,{children:"pages/index.ts"})}),`
`,s.exports.jsx(e.pre,{className:"language-tsx",children:s.exports.jsxs(e.code,{className:"language-tsx",children:[s.exports.jsx(e.span,{className:"token keyword",children:"import"})," ",s.exports.jsx(e.span,{className:"token string",children:'"./index.css"'}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
`]})}),`
`,s.exports.jsx("br",{}),`
`,s.exports.jsx(e.h2,{children:"CSS-Modules"}),`
`,s.exports.jsxs(e.p,{children:[`If you want to be a bit more fancy and utilise css modules, you can change the
name of yout file to `,s.exports.jsx(e.code,{children:"{file}.module.css"}),":"]}),`
`,s.exports.jsx("br",{}),`
`,s.exports.jsx(e.p,{children:s.exports.jsx(e.code,{children:"pages/index.module.css"})}),`
`,s.exports.jsx(e.pre,{className:"language-css",children:s.exports.jsxs(e.code,{className:"language-css",children:[s.exports.jsx(e.span,{className:"token selector",children:s.exports.jsx(e.span,{className:"token class",children:".wrapper"})})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
  `,s.exports.jsx(e.span,{className:"token property",children:"color"}),s.exports.jsx(e.span,{className:"token punctuation",children:":"})," ",s.exports.jsx(e.span,{className:"token color",children:"red"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
`,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),`
`]})}),`
`,s.exports.jsx(e.p,{children:s.exports.jsx(e.code,{children:"pages/index.ts"})}),`
`,s.exports.jsx(e.pre,{className:"language-tsx",children:s.exports.jsxs(e.code,{className:"language-tsx",children:[s.exports.jsx(e.span,{className:"token keyword",children:"import"})," ",s.exports.jsx(e.span,{className:"token imports",children:"styles"})," ",s.exports.jsx(e.span,{className:"token keyword",children:"from"})," ",s.exports.jsx(e.span,{className:"token string",children:'"./index.module.css"'}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
`,s.exports.jsx(e.span,{className:"token keyword",children:"export"})," ",s.exports.jsx(e.span,{className:"token keyword",children:"const"})," ",s.exports.jsx(e.span,{className:"token maybe-class-name",children:"Index"})," ",s.exports.jsx(e.span,{className:"token operator",children:"="})," ",s.exports.jsxs(e.span,{className:"token tag",children:[s.exports.jsxs(e.span,{className:"token tag",children:[s.exports.jsx(e.span,{className:"token punctuation",children:"<"}),"div"]})," ",s.exports.jsx(e.span,{className:"token attr-name",children:"className"}),s.exports.jsxs(e.span,{className:"token script language-javascript",children:[s.exports.jsx(e.span,{className:"token script-punctuation punctuation",children:"="}),s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),"styles",s.exports.jsx(e.span,{className:"token punctuation",children:"."}),s.exports.jsx(e.span,{className:"token property-access",children:"wrapper"}),s.exports.jsx(e.span,{className:"token punctuation",children:"}"})]})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"/>"})]}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
`]})}),`
`,s.exports.jsx("br",{}),`
`,s.exports.jsx(e.h2,{children:"SCSS"}),`
`,s.exports.jsxs(e.p,{children:["If you want to be even more fancy, you can install ",s.exports.jsx(e.code,{children:"sass"})," to enable sass/scss support:"]}),`
`,s.exports.jsx(e.pre,{className:"language-bash",children:s.exports.jsxs(e.code,{className:"language-bash",children:["$ ",s.exports.jsx(e.span,{className:"token function",children:"npm"})," ",s.exports.jsx(e.span,{className:"token function",children:"install"}),` -S sass
`]})})]})}function c(n={}){const{wrapper:e}=n.components||{};return e?s.exports.jsx(e,Object.assign({},n,{children:s.exports.jsx(a,n)})):a(n)}export{c as default,r as title};
