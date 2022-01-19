import{j as s}from"./jsx-runtime.4a4136f8.js";import"./vendor.82f5f2d7.js";const p="Multiple Sites";function c(n={}){const{wrapper:o}=n.components||{};return o?s.exports.jsx(o,Object.assign({},n,{children:s.exports.jsx(t,{})})):t();function t(){const e=Object.assign({p:"p",code:"code",pre:"pre",span:"span"},n.components);return s.exports.jsxs(s.exports.Fragment,{children:[s.exports.jsxs(e.p,{children:[`A key difference to other react frameworks is that a snowstorm project can consist of multiple sites.
For a simple setup, you will probably only have a single site. Here, your pages can be defined a `,s.exports.jsx(e.code,{children:"pages"})," folder you create at the root of your project."]}),`
`,s.exports.jsxs(e.p,{children:["As your project grows, you might want add more sites, for example you might want to host your documentation on ",s.exports.jsx(e.code,{children:"docs.example.com"}),`.
Sharing your components, configs and assets between multiple projects in the same repository is a first-class supported feature with snowstorm.`]}),`
`,s.exports.jsxs(e.p,{children:["To add new sites, simply create a new folder calld ",s.exports.jsx(e.code,{children:"sites"}),`.
In this folder, create sub-folders named after the different sites you want to develop, e.g:`]}),`
`,s.exports.jsx("pre",{className:"language-tree",children:s.exports.jsx(e.p,{children:`\u251C\u2500\u2500 sites
\u2502   \u251C\u2500\u2500 admin.example.com
\u2502   \u2502   \u251C\u2500\u2500 components
\u2502   \u2502   \u2514\u2500\u2500 pages
\u2502   \u251C\u2500\u2500 docs.example.com
\u2502   \u2502   \u251C\u2500\u2500 components
\u2502   \u2502   \u2514\u2500\u2500 pages
\u2502   \u2514\u2500\u2500 example.com
\u2502       \u251C\u2500\u2500 components
\u2502       \u2514\u2500\u2500 pages
\u251C\u2500\u2500 package.json
\u2514\u2500\u2500 snowstorm.config.ts`})}),`
`,s.exports.jsxs(e.p,{children:["Now, you can keep your ",s.exports.jsx(e.code,{children:"snowstorm.config"})," like before or even configure plugins, routes, etc for each site individually."]}),`
`,s.exports.jsx("br",{}),`
`,s.exports.jsx(e.p,{children:s.exports.jsx(e.code,{children:"snowstorm.config.ts"})}),`
`,s.exports.jsx(e.pre,{className:"language-ts",children:s.exports.jsxs(e.code,{className:"language-ts",children:[s.exports.jsx(e.span,{className:"token keyword",children:"import"})," ",s.exports.jsxs(e.span,{className:"token imports",children:[s.exports.jsx(e.span,{className:"token punctuation",children:"{"})," ",s.exports.jsx(e.span,{className:"token maybe-class-name",children:"SnowstormConfig"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"}"})]})," ",s.exports.jsx(e.span,{className:"token keyword",children:"from"})," ",s.exports.jsx(e.span,{className:"token string",children:'"@snowstorm/core/server"'}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`

`,s.exports.jsx(e.span,{className:"token keyword",children:"export"})," ",s.exports.jsx(e.span,{className:"token keyword",children:"const"})," ",s.exports.jsx(e.span,{className:"token maybe-class-name",children:"Config"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token maybe-class-name",children:"SnowstormConfig"})," ",s.exports.jsx(e.span,{className:"token operator",children:"="})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
  sites`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"["}),`
    `,s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
      domain`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token string",children:'"docs.example.com"'}),s.exports.jsx(e.span,{className:"token punctuation",children:","}),`
      build`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
        vitePlugins`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"["}),`
          `,s.exports.jsx(e.span,{className:"token comment",children:"// plugins applied only to docs.example.com"}),`
        `,s.exports.jsx(e.span,{className:"token punctuation",children:"]"}),s.exports.jsx(e.span,{className:"token punctuation",children:","}),`
      `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:","}),`
    `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:","}),`
  `,s.exports.jsx(e.span,{className:"token punctuation",children:"]"}),s.exports.jsx(e.span,{className:"token punctuation",children:","}),`
  site`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
    build`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
      vitePlugins`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"["}),`
        `,s.exports.jsx(e.span,{className:"token comment",children:"// plugins applied to all sites"}),`
      `,s.exports.jsx(e.span,{className:"token punctuation",children:"]"}),s.exports.jsx(e.span,{className:"token punctuation",children:","}),`
    `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:","}),`
  `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:","}),`
`,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
`]})})]})}}export{c as default,p as title};
