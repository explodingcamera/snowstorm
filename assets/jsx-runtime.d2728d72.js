import{r as m}from"./vendor.c293d705.js";var u={exports:{}},o={};/** @license React vundefined
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var y=m.exports,i=60103;o.Fragment=60107;if(typeof Symbol=="function"&&Symbol.for){var s=Symbol.for;i=s("react.element"),o.Fragment=s("react.fragment")}var a=Object.prototype.hasOwnProperty,v=y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,c={key:!0,ref:!0,__self:!0,__source:!0};function l(t,r,p){var e,n={},f=null,_=null;p!==void 0&&(f=""+p),r.key!==void 0&&(f=""+r.key),r.ref!==void 0&&(_=r.ref);for(e in r)a.call(r,e)&&!c.hasOwnProperty(e)&&(n[e]=r[e]);if(t&&t.defaultProps)for(e in r=t.defaultProps,r)n[e]===void 0&&(n[e]=r[e]);return{$$typeof:i,type:t,key:f,ref:_,props:n,_owner:v.current}}o.jsx=l;o.jsxs=l;u.exports=o;export{u as j};
