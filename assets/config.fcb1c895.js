import{j as s}from"./jsx-runtime.74a0b71c.js";import"./vendor.f1139e42.js";function p(n={}){const{wrapper:a}=n.components||{};return a?s.exports.jsx(a,Object.assign({},n,{children:s.exports.jsx(t,{})})):t();function t(){const e=Object.assign({h1:"h1",p:"p",pre:"pre",code:"code",span:"span"},n.components);return s.exports.jsxs(s.exports.Fragment,{children:[s.exports.jsx(e.h1,{children:"Configuration"}),`
`,s.exports.jsx(e.p,{children:"Work-in-progress, for now, use the typescript type-definitions as a guide:"}),`
`,s.exports.jsx(e.pre,{className:"language-tsx",children:s.exports.jsxs(e.code,{className:"language-tsx",children:[s.exports.jsx(e.span,{className:"token keyword",children:"export"})," ",s.exports.jsx(e.span,{className:"token keyword",children:"interface"})," ",s.exports.jsx(e.span,{className:"token class-name",children:s.exports.jsx(e.span,{className:"token maybe-class-name",children:"SnowstormConfig"})})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
  `,s.exports.jsx(e.span,{className:"token comment",children:`/**
   * The root folder for the snowstorm project
   */`}),`
  rootFolder`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"string"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
  `,s.exports.jsx(e.span,{className:"token comment",children:`/**
   * Multisite only: The folder containing sites in Multisite-mode
   */`}),`
  sitesFolder`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"string"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
  `,s.exports.jsx(e.span,{className:"token comment",children:`/**
   * Multisite only: Sites includes a list of config ovverides for specific sites
   * (just an array of the same type as site below with added \`domain: string; alias: string[];\` fields)
   */`}),`
  sites`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token maybe-class-name",children:"SnowstormMultiSiteConfig"}),s.exports.jsx(e.span,{className:"token punctuation",children:"["}),s.exports.jsx(e.span,{className:"token punctuation",children:"]"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
  `,s.exports.jsx(e.span,{className:"token comment",children:`/**
   * Site is the base site config for all sites included in a snowstorm project
   */`}),`
  site`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
    pagesFolder`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"string"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
    staticFolder`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"string"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
    basePath`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"string"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
    domain`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"string"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
    build`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
      css`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
        `,s.exports.jsx(e.span,{className:"token comment",children:`/**
         * https://github.com/css-modules/postcss-modules
         */`}),`
        modules`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token maybe-class-name",children:"CSSModulesOptions"})," ",s.exports.jsx(e.span,{className:"token operator",children:"|"})," ",s.exports.jsx(e.span,{className:"token boolean",children:"false"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
        preprocessorOptions`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token maybe-class-name",children:"Record"}),s.exports.jsx(e.span,{className:"token operator",children:"<"}),s.exports.jsx(e.span,{className:"token builtin",children:"string"}),s.exports.jsx(e.span,{className:"token punctuation",children:","})," ",s.exports.jsx(e.span,{className:"token builtin",children:"any"}),s.exports.jsx(e.span,{className:"token operator",children:">"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
        postcss`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"}),`
          `,s.exports.jsx(e.span,{className:"token operator",children:"|"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"string"}),`
          `,s.exports.jsx(e.span,{className:"token operator",children:"|"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"("}),s.exports.jsx(e.span,{className:"token maybe-class-name",children:"Postcss"}),s.exports.jsx(e.span,{className:"token punctuation",children:"."}),s.exports.jsx(e.span,{className:"token property-access",children:s.exports.jsx(e.span,{className:"token maybe-class-name",children:"ProcessOptions"})})," ",s.exports.jsx(e.span,{className:"token operator",children:"&"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
              plugins`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token maybe-class-name",children:"Postcss"}),s.exports.jsx(e.span,{className:"token punctuation",children:"."}),s.exports.jsx(e.span,{className:"token property-access",children:s.exports.jsx(e.span,{className:"token maybe-class-name",children:"Plugin"})}),s.exports.jsx(e.span,{className:"token punctuation",children:"["}),s.exports.jsx(e.span,{className:"token punctuation",children:"]"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
            `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:")"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
      `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
      json`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
        `,s.exports.jsx(e.span,{className:"token comment",children:`/**
         * Generate a named export for every property of the JSON object
         * @default true
         */`}),`
        namedExports`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"boolean"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
        `,s.exports.jsx(e.span,{className:"token comment",children:`/**
         * Generate performant output as JSON.parse("stringified").
         * Enabling this will disable namedExports.
         * @default false
         */`}),`
        stringify`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"boolean"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
      `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
      vitePlugins`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token known-class-name class-name",children:"Array"}),s.exports.jsx(e.span,{className:"token operator",children:"<"}),s.exports.jsx(e.span,{className:"token maybe-class-name",children:"PluginOption"})," ",s.exports.jsx(e.span,{className:"token operator",children:"|"})," ",s.exports.jsx(e.span,{className:"token maybe-class-name",children:"PluginOption"}),s.exports.jsx(e.span,{className:"token punctuation",children:"["}),s.exports.jsx(e.span,{className:"token punctuation",children:"]"}),s.exports.jsx(e.span,{className:"token operator",children:">"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
      `,s.exports.jsx(e.span,{className:"token comment",children:"// force pre-bundle module. can be helpful if commonjs packages are not detected and thus not converted to esm"}),`
      forcePrebundle`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"string"}),s.exports.jsx(e.span,{className:"token punctuation",children:"["}),s.exports.jsx(e.span,{className:"token punctuation",children:"]"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
    `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
    routes`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
      fileSystemRouting`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"boolean"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
      customRoutes`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token maybe-class-name",children:"Record"}),s.exports.jsx(e.span,{className:"token operator",children:"<"}),`
        `,s.exports.jsx(e.span,{className:"token builtin",children:"string"}),s.exports.jsx(e.span,{className:"token punctuation",children:","}),`
        `,s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
          page`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"string"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
          disabled`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"boolean"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
          exportParams`,s.exports.jsx(e.span,{className:"token operator",children:"?"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"("}),s.exports.jsx(e.span,{className:"token punctuation",children:")"})," ",s.exports.jsx(e.span,{className:"token arrow operator",children:"=>"})," ",s.exports.jsx(e.span,{className:"token known-class-name class-name",children:"Promise"}),s.exports.jsx(e.span,{className:"token operator",children:"<"}),s.exports.jsx(e.span,{className:"token builtin",children:"string"}),s.exports.jsx(e.span,{className:"token punctuation",children:"["}),s.exports.jsx(e.span,{className:"token punctuation",children:"]"}),s.exports.jsx(e.span,{className:"token punctuation",children:"["}),s.exports.jsx(e.span,{className:"token punctuation",children:"]"}),s.exports.jsx(e.span,{className:"token operator",children:">"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
        `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),`
      `,s.exports.jsx(e.span,{className:"token operator",children:">"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
    `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
  `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
  `,s.exports.jsx(e.span,{className:"token comment",children:`/**
   * Configuration relevant for exporting sites
   */`}),`
  `,s.exports.jsx(e.span,{className:"token keyword",children:"export"}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
    `,s.exports.jsx(e.span,{className:"token comment",children:"/**\n     * The directory where the website will be output to.\n     * In the case of `site`, this can be relative to the project root or an absolute path,\n     * in the case of `sites`, relative paths are relative to the outputDir set in `site`\n     */"}),`
    outDir`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"string"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
    target`,s.exports.jsx(e.span,{className:"token operator",children:":"}),`
      `,s.exports.jsx(e.span,{className:"token operator",children:"|"})," ",s.exports.jsx(e.span,{className:"token string",children:'"github-pages"'}),`
      `,s.exports.jsx(e.span,{className:"token operator",children:"|"})," ",s.exports.jsx(e.span,{className:"token string",children:'"gitlab-pages"'}),`
      `,s.exports.jsx(e.span,{className:"token operator",children:"|"})," ",s.exports.jsx(e.span,{className:"token string",children:'"cloudflare-pages"'}),`
      `,s.exports.jsx(e.span,{className:"token operator",children:"|"})," ",s.exports.jsx(e.span,{className:"token string",children:'"netlify"'}),`
      `,s.exports.jsx(e.span,{className:"token operator",children:"|"})," ",s.exports.jsx(e.span,{className:"token string",children:'"independent"'}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
  `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
  `,s.exports.jsx(e.span,{className:"token comment",children:`/**
   * Configuration relevant for development
   */`}),`
  development`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
    port`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"number"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
  `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
  `,s.exports.jsx(e.span,{className:"token comment",children:`/**
   * Configuration relevant for production
   */`}),`
  production`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
    port`,s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token builtin",children:"number"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
  `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),s.exports.jsx(e.span,{className:"token punctuation",children:";"}),`
`,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),`
`]})})]})}}export{p as default};
