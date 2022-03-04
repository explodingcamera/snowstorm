import{r as i}from"./vendor.8a5ef2fe.js";var l={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var u=i.exports,m=Symbol.for("react.element"),y=Symbol.for("react.fragment"),a=Object.prototype.hasOwnProperty,c=u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d={key:!0,ref:!0,__self:!0,__source:!0};function s(o,r,f){var e,t={},_=null,p=null;f!==void 0&&(_=""+f),r.key!==void 0&&(_=""+r.key),r.ref!==void 0&&(p=r.ref);for(e in r)a.call(r,e)&&!d.hasOwnProperty(e)&&(t[e]=r[e]);if(o&&o.defaultProps)for(e in r=o.defaultProps,r)t[e]===void 0&&(t[e]=r[e]);return{$$typeof:m,type:o,key:_,ref:p,props:t,_owner:c.current}}n.Fragment=y;n.jsx=s;n.jsxs=s;l.exports=n;export{l as j};
