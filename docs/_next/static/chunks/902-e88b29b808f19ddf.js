(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[902],{4292:function(e,t,n){"use strict";n.d(t,{e:function(){return f}});var r=n(4090);function a(e,t,n,r){return new(n||(n=Promise))(function(a,o){function u(e){try{i(r.next(e))}catch(e){o(e)}}function c(e){try{i(r.throw(e))}catch(e){o(e)}}function i(e){var t;e.done?a(e.value):((t=e.value)instanceof n?t:new n(function(e){e(t)})).then(u,c)}i((r=r.apply(e,t||[])).next())})}function o(e,t){var n,r,a,o,u={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return o={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function c(o){return function(c){return function(o){if(n)throw TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(a=2&o[0]?r.return:o[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,o[1])).done)return a;switch(r=0,a&&(o=[2&o[0],a.value]),o[0]){case 0:case 1:a=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,r=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(a=(a=u.trys).length>0&&a[a.length-1])&&(6===o[0]||2===o[0])){u=0;continue}if(3===o[0]&&(!a||o[1]>a[0]&&o[1]<a[3])){u.label=o[1];break}if(6===o[0]&&u.label<a[1]){u.label=a[1],a=o;break}if(a&&u.label<a[2]){u.label=a[2],u.ops.push(o);break}a[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],r=0}finally{n=a=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,c])}}}function u(e){var t="function"==typeof Symbol&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function c(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,a,o=n.call(e),u=[];try{for(;(void 0===t||t-- >0)&&!(r=o.next()).done;)u.push(r.value)}catch(e){a={error:e}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(a)throw a.error}}return u}function i(e,t,n){if(n||2==arguments.length)for(var r,a=0,o=t.length;a<o;a++)!r&&a in t||(r||(r=Array.prototype.slice.call(t,0,a)),r[a]=t[a]);return e.concat(r||Array.prototype.slice.call(t))}function l(e,t,n,r,l){for(var f=[],d=5;d<arguments.length;d++)f[d-5]=arguments[d];return a(this,void 0,void 0,function(){var d,p,h,y,v;return o(this,function(b){switch(b.label){case 0:b.trys.push([0,12,13,14]),p=(d=u(f)).next(),b.label=1;case 1:if(p.done)return[3,11];switch(typeof(h=p.value)){case"string":return[3,2];case"number":return[3,4];case"function":return[3,6]}return[3,8];case 2:return[4,function(e,t,n,r,l,f){return a(this,void 0,void 0,function(){var d,p;return o(this,function(h){switch(h.label){case 0:var y,v;return y=d=e.textContent||"",v=c(n).slice(0),p=i(i([],c(y),!1),[NaN],!1).findIndex(function(e,t){return v[t]!==e}),[4,function(e,t,n,r,i){return a(this,void 0,void 0,function(){var a,l,f,d,p,h,y,v,b,m,w,g;return o(this,function(x){switch(x.label){case 0:if(a=t,i){for(l=0,f=1;f<t.length;f++)if(p=(d=c([t[f-1],t[f]],2))[0],(h=d[1]).length>p.length||""===h){l=f;break}a=t.slice(l,t.length)}x.label=1;case 1:x.trys.push([1,6,7,8]),v=(y=u(function(e){var t,n,r,a,c,i;return o(this,function(l){switch(l.label){case 0:t=function(e){return o(this,function(t){switch(t.label){case 0:return[4,{op:function(t){return requestAnimationFrame(function(){return t.textContent=e})},opCode:function(t){var n=t.textContent||"";return""===e||n.length>e.length?"DELETE":"WRITING"}}];case 1:return t.sent(),[2]}})},l.label=1;case 1:l.trys.push([1,6,7,8]),r=(n=u(e)).next(),l.label=2;case 2:return r.done?[3,5]:(a=r.value,[5,t(a)]);case 3:l.sent(),l.label=4;case 4:return r=n.next(),[3,2];case 5:return[3,8];case 6:return c={error:l.sent()},[3,8];case 7:try{r&&!r.done&&(i=n.return)&&i.call(n)}finally{if(c)throw c.error}return[7];case 8:return[2]}})}(a))).next(),x.label=2;case 2:return v.done?[3,5]:(m="WRITING"===(b=v.value).opCode(e)?n+n*(Math.random()-.5):r+r*(Math.random()-.5),b.op(e),[4,s(m)]);case 3:x.sent(),x.label=4;case 4:return v=y.next(),[3,2];case 5:return[3,8];case 6:return w={error:x.sent()},[3,8];case 7:try{v&&!v.done&&(g=y.return)&&g.call(y)}finally{if(w)throw w.error}return[7];case 8:return[2]}})})}(e,i(i([],c(function(e,t,n){var r,a;return void 0===n&&(n=0),o(this,function(o){switch(o.label){case 0:a=(r=t(e)).length,o.label=1;case 1:return a>n?[4,r.slice(0,--a).join("")]:[3,3];case 2:return o.sent(),[3,1];case 3:return[2]}})}(d,t,p)),!1),c(function(e,t,n){var r,a;return void 0===n&&(n=0),o(this,function(o){switch(o.label){case 0:a=(r=t(e)).length,o.label=1;case 1:return n<a?[4,r.slice(0,++n).join("")]:[3,3];case 2:return o.sent(),[3,1];case 3:return[2]}})}(n,t,p)),!1),r,l,f)];case 1:return h.sent(),[2]}})})}(e,t,h,n,r,l)];case 3:case 5:case 7:return b.sent(),[3,10];case 4:return[4,s(h)];case 6:return[4,h.apply(void 0,i([e,t,n,r,l],c(f),!1))];case 8:return[4,h];case 9:b.sent(),b.label=10;case 10:return p=d.next(),[3,1];case 11:return[3,14];case 12:return y={error:b.sent()},[3,14];case 13:try{p&&!p.done&&(v=d.return)&&v.call(d)}finally{if(y)throw y.error}return[7];case 14:return[2]}})})}function s(e){return a(this,void 0,void 0,function(){return o(this,function(t){switch(t.label){case 0:return[4,new Promise(function(t){return setTimeout(t,e)})];case 1:return t.sent(),[2]}})})}!function(e,t){void 0===t&&(t={});var n=t.insertAt;if(e&&"undefined"!=typeof document){var r=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css","top"===n&&r.firstChild?r.insertBefore(a,r.firstChild):r.appendChild(a),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(document.createTextNode(e))}}(".index-module_type__E-SaG::after {\n  content: '|';\n  animation: index-module_cursor__PQg0P 1.1s infinite step-start;\n}\n\n@keyframes index-module_cursor__PQg0P {\n  50% {\n    opacity: 0;\n  }\n}\n");var f=(0,r.memo)((0,r.forwardRef)(function(e,t){var n=e.sequence,a=e.repeat,o=e.className,u=e.speed,s=void 0===u?40:u,f=e.deletionSpeed,d=e.omitDeletionAnimation,p=void 0!==d&&d,h=e.preRenderFirstString,y=e.wrapper,v=e.splitter,b=void 0===v?function(e){return i([],c(e),!1)}:v,m=e.cursor,w=void 0===m||m,g=e.style,x=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&0>t.indexOf(r)&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(e);a<r.length;a++)0>t.indexOf(r[a])&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]])}return n}(e,["sequence","repeat","className","speed","deletionSpeed","omitDeletionAnimation","preRenderFirstString","wrapper","splitter","cursor","style"]),_=x["aria-label"],S=x["aria-hidden"],E=x.role;f||(f=s);var k=[,,].fill(40);[s,f].forEach(function(e,t){switch(typeof e){case"number":k[t]=Math.abs(e-100);break;case"object":var n=e.type,r=e.value;if("number"!=typeof r)break;"keyStrokeDelayInMs"===n&&(k[t]=r)}});var N,C,O,R,I,P,T,j,A=k[0],F=k[1],G=(void 0===N&&(N=null),C=(0,r.useRef)(N),(0,r.useEffect)(function(){t&&("function"==typeof t?t(C.current):t.current=C.current)},[t]),C),D="index-module_type__E-SaG";O=o?"".concat(w?D+" ":"").concat(o):w?D:"",R=(0,r.useRef)(function(){var e,t=n;a===1/0?e=l:"number"==typeof a&&(t=Array(1+a).fill(n).flat());var r=e?i(i([],c(t),!1),[e],!1):i([],c(t),!1);return l.apply(void 0,i([G.current,b,A,F,p],c(r),!1)),function(){G.current}}),I=(0,r.useRef)(),P=(0,r.useRef)(!1),T=(0,r.useRef)(!1),j=c((0,r.useState)(0),2)[1],P.current&&(T.current=!0),(0,r.useEffect)(function(){return P.current||(I.current=R.current(),P.current=!0),j(function(e){return e+1}),function(){T.current&&I.current&&I.current()}},[]);var M=void 0!==h&&h?n.find(function(e){return"string"==typeof e})||"":null;return r.createElement(void 0===y?"span":y,{"aria-hidden":S,"aria-label":_,role:E,style:g,className:O,children:_?r.createElement("span",{"aria-hidden":"true",ref:G,children:M}):M,ref:_?void 0:G})}),function(e,t){return!0})},3249:function(e){e.exports={style:{fontFamily:"'__Inconsolata_5a7012', '__Inconsolata_Fallback_5a7012'",fontStyle:"normal"},className:"__className_5a7012"}}}]);