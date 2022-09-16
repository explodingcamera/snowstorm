import{j as s}from"./jsx-runtime.c93d6323.js";import"./index.b9548439.js";function o(n){const e=Object.assign({h1:"h1",p:"p",code:"code",pre:"pre",span:"span"},n.components);return s.exports.jsxs(s.exports.Fragment,{children:[s.exports.jsx(e.h1,{children:"Deploying your website"}),`
`,s.exports.jsxs(e.p,{children:["Deploying your website is as easy as running ",s.exports.jsx(e.code,{children:"$ npx snowstorm export"}),`.
For convenience, you can also add a export script to your `,s.exports.jsx(e.code,{children:"package.json"}),":"]}),`
`,s.exports.jsx(e.pre,{className:"language-json",children:s.exports.jsxs(e.code,{className:"language-json",children:[s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
  `,s.exports.jsx(e.span,{className:"token property",children:'"name"'}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token string",children:'"@snowstorm/www"'}),s.exports.jsx(e.span,{className:"token punctuation",children:","}),`
  `,s.exports.jsx(e.span,{className:"token property",children:'"scripts"'}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token punctuation",children:"{"}),`
    `,s.exports.jsx(e.span,{className:"token property",children:'"dev"'}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token string",children:'"snowstorm dev"'}),s.exports.jsx(e.span,{className:"token punctuation",children:","}),`
    `,s.exports.jsx(e.span,{className:"token property",children:'"export"'}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token string",children:'"snowstorm export"'}),s.exports.jsx(e.span,{className:"token punctuation",children:","}),`
    `,s.exports.jsx(e.span,{className:"token property",children:'"start"'}),s.exports.jsx(e.span,{className:"token operator",children:":"})," ",s.exports.jsx(e.span,{className:"token string",children:'"snowstorm start"'}),`
  `,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),`
`,s.exports.jsx(e.span,{className:"token punctuation",children:"}"}),`
`]})}),`
`,s.exports.jsx(e.p,{children:"If you have any issues in export mode, you can also test out a production build using the start command which might help reveal more errors."})]})}function a(n={}){const{wrapper:e}=n.components||{};return e?s.exports.jsx(e,Object.assign({},n,{children:s.exports.jsx(o,n)})):o(n)}export{a as default};