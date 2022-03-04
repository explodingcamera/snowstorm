import{r as o,y as g,h as M}from"./vendor.8a5ef2fe.js";const B=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const c of s)if(c.type==="childList")for(const n of c.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function r(s){const c={};return s.integrity&&(c.integrity=s.integrity),s.referrerpolicy&&(c.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?c.credentials="include":s.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function a(s){if(s.ep)return;s.ep=!0;const c=r(s);fetch(s.href,c)}};B();var U={pathname:"",port:"80",host:"localhost"},x=typeof location=="undefined"?U:location,j="popstate",b="pushState",R="replaceState",L=[j,b,R],z=({base:e=""}={})=>{const[{path:t,search:r},a]=o.exports.useState(()=>({path:A(e),search:x.search})),s=o.exports.useRef(t+r);o.exports.useEffect(()=>{const n=()=>{const i=A(e),{search:p}=x,u=i+p;s.current!==u&&(s.current=u,a({path:i,search:p}))};return L.forEach(i=>window.addEventListener(i,n)),n(),()=>L.forEach(i=>window.removeEventListener(i,n))},[e]);const c=o.exports.useCallback((n,{replace:i=!1}={})=>history[i?R:b](null,"",n.startsWith("~")?n.slice(1):e+n),[e]);return[t,c]},Z=z;if(typeof history!="undefined"){const e=[b,R];for(const t of e){const r=history[t];history[t]=function(){const a=r.apply(this,arguments),s=new window.Event(t,{bubbles:!0,cancelable:!1});return s.arguments=arguments,window.dispatchEvent(s),a}}}var A=(e,t=x.pathname)=>t.toLowerCase().indexOf(e.toLowerCase())?"~"+t:t.slice(e.length)||"/";function G(e=J){const t={},r=a=>t[a]||(t[a]=e(a));return(a,s)=>{const{regexp:c,keys:n}=r(a||""),i=c.exec(s);if(!i)return[!1,null];const p=n.reduce((u,d,m)=>(u[d.name]=i[m+1],u),{});return[!0,p]}}var I=e=>e.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1"),H=(e,t,r)=>{let a=e?"((?:[^\\/]+?)(?:\\/(?:[^\\/]+?))*)":"([^\\/]+?)";return t&&r&&(a="(?:\\/"+a+")"),a+(t?"?":"")},J=e=>{const t=/:([A-Za-z0-9_]+)([?+*]?)/g;let r=null,a=0;const s=[];let c="";for(;(r=t.exec(e))!==null;){const[,n,i]=r,p=i==="+"||i==="*",u=i==="?"||i==="*",d=u&&e[r.index-1]==="/"?1:0,m=e.substring(a,r.index-d);s.push({name:n}),a=t.lastIndex,c+=I(m)+H(p,u,Boolean(d))}return c+=I(e.substring(a)),{keys:s,regexp:new RegExp("^"+c+"(?:\\/)?$","i")}},D=o.exports.createContext({}),V=({hook:e=Z,base:t="",matcher:r=G()}={})=>({hook:e,base:t,matcher:r}),P=()=>{const e=o.exports.useContext(D);return e.v||(e.v=V())};function v(){const e=P();return e.hook(e)}var Q=e=>{const t=o.exports.useRef(),[,r]=v();return t.current=()=>r(e.to||e.href,e),t},X=e=>{const t=o.exports.useRef(),r=t.current||(t.current={v:V(e)});return o.exports.createElement(D.Provider,{value:r,children:e.children})};function y(e){const t=Q(e),{base:r}=P();let{to:a,href:s=a,children:c,onClick:n}=e;const i=o.exports.useCallback(d=>{var m;d.ctrlKey||d.metaKey||d.altKey||d.shiftKey||d.button!==0||(d.preventDefault(),(m=t.current)==null||m.call(t),n&&n(d))},[n]);s||(s="");const p={href:s.startsWith("~")?s.slice(1):r+s,onClick:i,to:null},u=o.exports.isValidElement(c)?c:o.exports.createElement("a",e);return o.exports.cloneElement(u,p)}function $(e=ee){const t={},r=a=>t[a]||(t[a]=e(a));return(a,s)=>{const{regexp:c,keys:n}=r(a||""),i=c.exec(s);if(!i)return[!1,null];const p=n.reduce((u,d,m)=>(u[d.name]=i[m+1],u),{});return[!0,p]}}var O=e=>e.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1"),Y=(e,t,r)=>{let a=e?"((?:[^\\/]+?)(?:\\/(?:[^\\/]+?))*)":"([^\\/]+?)";return t&&r&&(a="(?:\\/"+a+")"),a+(t?"?":"")},ee=e=>{const t=/:([A-Za-z0-9_]+)([?+*]?)/g;let r=null,a=0;const s=[];let c="";for(;(r=t.exec(e))!==null;){const[,n,i]=r,p=i==="+"||i==="*",u=i==="?"||i==="*",d=u&&e[r.index-1]==="/"?1:0,m=e.substring(a,r.index-d);s.push({name:n}),a=t.lastIndex,c+=O(m)+Y(p,u,Boolean(d))}return c+=O(e.substring(a)),{keys:s,regexp:new RegExp("^"+c+"(?:\\/)?$","i")}};const te="modulepreload",k={},re="/",l=function(t,r){return!r||r.length===0?t():Promise.all(r.map(a=>{if(a=`${re}${a}`,a in k)return;k[a]=!0;const s=a.endsWith(".css"),c=s?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${c}`))return;const n=document.createElement("link");if(n.rel=s?"stylesheet":te,s||(n.as="script",n.crossOrigin=""),n.href=a,document.head.appendChild(n),s)return new Promise((i,p)=>{n.addEventListener("load",i),n.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${a}`)))})})).then(()=>t())};var se=({status:e})=>g.createElement("h1",null,"Something went wrong. ",e&&e),oe=se;const ae="_wrapper_fqyvw_1",ne="_nav_fqyvw_8",ce="_logo_fqyvw_34",ie="_main_fqyvw_42",le="_sidebar_fqyvw_55",pe="_retracted_fqyvw_67",ue="_active_fqyvw_92";var f={wrapper:ae,nav:ne,logo:ce,main:ie,sidebar:le,retracted:pe,active:ue},de="/assets/logo.4a8e5f82.svg";const me=[{title:"documentation",pages:[{title:"getting started",slug:""},{title:"basic features",pages:[{title:"pages"},{title:"routing"},{title:"css"},{title:"static assets",slug:"static-assets"},{title:"sites"},{title:"custom fonts",slug:"custom-fonts"},{title:"importing libraries",slug:"imports"}]},{title:"advanced features",pages:[{title:"webassembly",slug:"wasm"},{title:"dynamic routes",slug:"dynamic-routes"},{title:"workers"},{title:"environment variables",slug:"env-variables"},{title:"custom `App`",slug:"custom-app"}]},{title:"plugins"},{title:"deploying a site",slug:"deploy"},{title:"browser support",slug:"browser-support"}]},{title:"api reference",pages:[{title:"configuration",slug:"api/config"},{title:"cli",slug:"api/cli"},{title:"plugin api",slug:"api/plugins"}]},{title:"inspirations",slug:"inspirations"}],ge=()=>o.exports.createElement("nav",{className:f.nav},o.exports.createElement("ul",null,o.exports.createElement("li",{className:f.logo},o.exports.createElement(y,{to:"/"},o.exports.createElement("img",{src:de,height:"40",width:"40"}),"Snowstorm")),o.exports.createElement("li",null,o.exports.createElement(y,{to:"/docs"},"docs")),o.exports.createElement("li",null,o.exports.createElement("a",{target:"_blank",referrerPolicy:"no-referrer",href:"https://github.com/explodingcamera/snowstorm",rel:"noreferrer"},"github")))),_e=e=>e.pages,N=({level:e=0,item:t})=>{var i;const[r,a]=o.exports.useState(!0),[s]=v(),c=()=>a(p=>!p);let n;return _e(t)?n=o.exports.createElement(o.exports.Fragment,null,e===0?o.exports.createElement("h1",null,"# ",t.title):o.exports.createElement("h2",{onClick:c},r?"-":"+"," ",o.exports.createElement("span",null,t.title)),o.exports.createElement("ul",{className:e!==0&&!r&&f.retracted||void 0},t.pages.map(p=>o.exports.createElement(N,{key:p.title,level:e+1,item:p})))):(n=o.exports.createElement("h2",{className:s.endsWith(t.slug||t.title)&&f.active||void 0},e<=1?"> ":o.exports.createElement(o.exports.Fragment,null,"\xA0>\xA0"),o.exports.createElement("span",null,t.title)),n=o.exports.createElement(y,{to:"/docs/"+((i=t.slug)!=null?i:t.title)},n)),o.exports.createElement("li",{key:t.title},n)},fe=()=>o.exports.createElement("aside",{className:f.sidebar},o.exports.createElement("ul",null,me.map(e=>o.exports.createElement(N,{key:e.title,item:e})))),he=({children:e,className:t,meta:r})=>o.exports.createElement("div",{className:`${t||""} ${(r==null?void 0:r.layoutClassName)||""} ${f.wrapper}`.trim()},o.exports.createElement(ge,null),o.exports.createElement("main",{className:f.main},!(r!=null&&r.disableSidebar)&&o.exports.createElement(fe,null),o.exports.createElement("div",{className:r==null?void 0:r.wrapperClassName},e))),ve=({children:e,exports:t})=>o.exports.createElement(he,{meta:t==null?void 0:t.meta},o.exports.createElement(o.exports.Fragment,null,(t==null?void 0:t.title)&&o.exports.createElement("h1",null,t.title),e)),Ee={impressum:()=>l(()=>import("./impressum.36a6b0a3.js"),["assets/impressum.36a6b0a3.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),index:()=>l(()=>import("./index.25d4a309.js"),["assets/index.25d4a309.js","assets/index.1c1c71bf.css","assets/vendor.8a5ef2fe.js"]),inspirations:()=>l(()=>import("./inspirations.7532ba4f.js"),["assets/inspirations.7532ba4f.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/browser-support":()=>l(()=>import("./browser-support.4e2c291b.js"),["assets/browser-support.4e2c291b.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/css":()=>l(()=>import("./css.60a66938.js"),["assets/css.60a66938.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/custom-app":()=>l(()=>import("./custom-app.876bb7b6.js"),["assets/custom-app.876bb7b6.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/custom-fonts":()=>l(()=>import("./custom-fonts.a5a20418.js"),["assets/custom-fonts.a5a20418.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/deploy":()=>l(()=>import("./deploy.aeed21f0.js"),["assets/deploy.aeed21f0.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/dynamic-routes":()=>l(()=>import("./dynamic-routes.54981e2f.js"),["assets/dynamic-routes.54981e2f.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/env-variables":()=>l(()=>import("./env-variables.979fd900.js"),["assets/env-variables.979fd900.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/getting-started":()=>l(()=>import("./getting-started.dbefb26b.js"),["assets/getting-started.dbefb26b.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/imports":()=>l(()=>import("./imports.1a07e1ca.js"),["assets/imports.1a07e1ca.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/index":()=>l(()=>import("./index.e58aad3d.js"),["assets/index.e58aad3d.js","assets/vendor.8a5ef2fe.js","assets/getting-started.dbefb26b.js","assets/jsx-runtime.9ff45209.js"]),"docs/pages":()=>l(()=>import("./pages.141f00f4.js"),["assets/pages.141f00f4.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/plugins":()=>l(()=>import("./plugins.49a3c251.js"),["assets/plugins.49a3c251.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/routing":()=>l(()=>import("./routing.f21cdd5c.js"),["assets/routing.f21cdd5c.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/sites":()=>l(()=>import("./sites.56eeecb5.js"),["assets/sites.56eeecb5.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/static-assets":()=>l(()=>import("./static-assets.590de83d.js"),["assets/static-assets.590de83d.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/wasm":()=>l(()=>import("./wasm.1b4abe46.js"),["assets/wasm.1b4abe46.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/workers":()=>l(()=>import("./workers.2914c2a7.js"),["assets/workers.2914c2a7.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/api/cli":()=>l(()=>import("./cli.3a555a4a.js"),["assets/cli.3a555a4a.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/api/config":()=>l(()=>import("./config.2ec46974.js"),["assets/config.2ec46974.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),"docs/api/plugins":()=>l(()=>import("./plugins.7870fd2d.js"),["assets/plugins.7870fd2d.js","assets/jsx-runtime.9ff45209.js","assets/vendor.8a5ef2fe.js"]),_app:()=>ve,_error:()=>oe},xe=[{page:"docs/api/plugins",parts:["docs","api","plugins"],path:"/docs/api/plugins"},{page:"docs/api/config",parts:["docs","api","config"],path:"/docs/api/config"},{page:"docs/api/cli",parts:["docs","api","cli"],path:"/docs/api/cli"},{page:"docs/workers",parts:["docs","workers"],path:"/docs/workers"},{page:"docs/wasm",parts:["docs","wasm"],path:"/docs/wasm"},{page:"docs/static-assets",parts:["docs","static-assets"],path:"/docs/static-assets"},{page:"docs/sites",parts:["docs","sites"],path:"/docs/sites"},{page:"docs/routing",parts:["docs","routing"],path:"/docs/routing"},{page:"docs/plugins",parts:["docs","plugins"],path:"/docs/plugins"},{page:"docs/pages",parts:["docs","pages"],path:"/docs/pages"},{page:"docs/index",parts:["docs",""],path:"/docs"},{page:"docs/imports",parts:["docs","imports"],path:"/docs/imports"},{page:"docs/getting-started",parts:["docs","getting-started"],path:"/docs/getting-started"},{page:"docs/env-variables",parts:["docs","env-variables"],path:"/docs/env-variables"},{page:"docs/dynamic-routes",parts:["docs","dynamic-routes"],path:"/docs/dynamic-routes"},{page:"docs/deploy",parts:["docs","deploy"],path:"/docs/deploy"},{page:"docs/custom-fonts",parts:["docs","custom-fonts"],path:"/docs/custom-fonts"},{page:"docs/custom-app",parts:["docs","custom-app"],path:"/docs/custom-app"},{page:"docs/css",parts:["docs","css"],path:"/docs/css"},{page:"docs/browser-support",parts:["docs","browser-support"],path:"/docs/browser-support"},{page:"inspirations",parts:["inspirations"],path:"/inspirations"},{page:"index",parts:[""],path:"/"},{page:"impressum",parts:["impressum"],path:"/impressum"}],ye="/";var we=()=>{let[e]=v(),[t,r]=o.exports.useState(""),a=o.exports.useRef(!1);return o.exports.useEffect(()=>{if(!a.current){a.current=!0;return}let s,c=document.querySelector("h1");c&&(s=c.innerText||c.textContent),s||(document.title?s=document.title:s=e),r(s)},[e]),g.createElement("p",{"aria-live":"assertive",id:"__snowstorm-route-announcer__",role:"alert",style:{border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"absolute",width:"1px",whiteSpace:"nowrap",wordWrap:"normal"}},t)},w=Ee,q=xe,C=ye,be=e=>e.charAt(0).toUpperCase()+e.slice(1),h=new Map,Re=({Wrapper:e,ErrorPage:t,initialPageName:r})=>{let a=r&&h.get(r)||void 0,[s,c]=o.exports.useState(a),n=P(),[i]=v(),p=o.exports.useRef(!0);o.exports.useEffect(()=>{if(p.current){p.current=!1;return}o.exports.startTransition(()=>{var m;let K=(m=q.filter(E=>n.matcher(E.path,i)[0]))==null?void 0:m[0];(async()=>{let E=await Pe(K.page);c(E)})()})},[i]);let u=s!=null&&s.Component?g.createElement(s.Component,null):g.createElement(t,{status:404}),d=e?g.createElement(e,{exports:s==null?void 0:s.exports,status:s?200:404},u):u;return g.createElement(g.Fragment,null,g.createElement(we,null),d)},Pe=async e=>{let t=h.get(e);if(t)return t;let r=await W(e);return t||h.set(e,r),r},F=e=>be(e.split("/").slice(-1)[0].replace(/\[|\]/g,"")),Le=(e,t)=>{let r=F(e);return t.default||t[r]||void 0},W=async e=>{let t=await w[e](),r=Le(e,t);return r?{Component:r,exports:t}:Promise.reject(new Error(`Failed to find page export for page '${e}'. Expected 'export default /* react component */' or 'export const ${F(e)} = /* react component */' `))},Ae=({initialPage:e})=>{var t;let r=w._app(),a=w._error(),s=(t=e.route)==null?void 0:t.page;return o.exports.useState(()=>{s&&e.Component&&h.set(s,{Component:e.Component,exports:e.exports||{}})}),g.createElement(o.exports.Suspense,{fallback:"loading"},g.createElement(Re,{Wrapper:r,ErrorPage:a,initialPageName:s}))},Ie=({location:e})=>{let t=$();for(let r of q)if(t(r.path,e)[0])return r},T;(T=document.querySelector(".__snowstorm-dev-floc"))==null||T.remove();var S=document.getElementById("app"),_=document.location.pathname;_.startsWith(C)&&(_=_.substr(C.length));_.startsWith("/")||(_="/"+_);(async()=>{let e=Ie({location:_}),t;e!=null&&e.page&&(t=await W(e==null?void 0:e.page));let r={route:e,Component:t==null?void 0:t.Component,exports:t==null?void 0:t.exports},a=$();S&&M(S,g.createElement(X,{matcher:a,base:void 0},g.createElement(Ae,{initialPage:r})))})();export{de as L,y as a};
