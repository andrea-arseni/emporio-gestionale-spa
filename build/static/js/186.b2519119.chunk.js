"use strict";(self.webpackChunkni=self.webpackChunkni||[]).push([[186],{1186:function(e,n,t){t.r(n),t.d(n,{startInputShims:function(){return E}});var r=t(4165),o=t(5861),i=t(3743),a=t(1811),u=new WeakMap,c=function(e,n,t){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;u.has(e)!==t&&(t?d(e,n,r):l(e,n))},s=function(e){return e===e.getRootNode().activeElement},d=function(e,n,t){var r=n.parentNode,o=n.cloneNode(!1);o.classList.add("cloned-input"),o.tabIndex=-1,r.appendChild(o),u.set(e,o);var i="rtl"===e.ownerDocument.dir?9999:-9999;e.style.pointerEvents="none",n.style.transform="translate3d(".concat(i,"px,").concat(t,"px,0) scale(0)")},l=function(e,n){var t=u.get(e);t&&(u.delete(e),t.remove()),e.style.pointerEvents="",n.style.transform=""},f=function(e,n,t){if(!t||!n)return function(){};var r=function(t){s(n)&&c(e,n,t)},o=function(){return c(e,n,!1)},i=function(){return r(!0)},u=function(){return r(!1)};return(0,a.a)(t,"ionScrollStart",i),(0,a.a)(t,"ionScrollEnd",u),n.addEventListener("blur",o),function(){(0,a.b)(t,"ionScrollStart",i),(0,a.b)(t,"ionScrollEnd",u),n.addEventListener("ionBlur",o)}},v="input, textarea, [no-blur], [contenteditable]",p=function(e,n,t){var r=e.closest("ion-item,[ion-item]")||e;return m(r.getBoundingClientRect(),n.getBoundingClientRect(),t,e.ownerDocument.defaultView.innerHeight)},m=function(e,n,t,r){var o=e.top,i=e.bottom,a=n.top,u=a+15,c=.75*Math.min(n.bottom,r-t)-i,s=u-o,d=Math.round(c<0?-c:s>0?-s:0),l=Math.min(d,o-a),f=Math.abs(l)/.3;return{scrollAmount:l,scrollDuration:Math.min(400,Math.max(150,f)),scrollPadding:t,inputSafeY:4-(o-u)}},h=function(e,n,t,r,o){var i,u=function(e){i=(0,a.q)(e)},c=function(u){if(i){var c=(0,a.q)(u);b(6,i,c)||s(n)||w(e,n,t,r,o)}};return e.addEventListener("touchstart",u,!0),e.addEventListener("touchend",c,!0),function(){e.removeEventListener("touchstart",u,!0),e.removeEventListener("touchend",c,!0)}},w=function(){var e=(0,o.Z)((0,r.Z)().mark((function e(n,t,u,s,d){var l,f,v,m,h,w;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(u||s){e.next=2;break}return e.abrupt("return");case 2:if(l=p(n,u||s,d),!(u&&Math.abs(l.scrollAmount)<4)){e.next=6;break}return t.focus(),e.abrupt("return");case 6:if(c(n,t,!0,l.inputSafeY),t.focus(),(0,a.r)((function(){return n.click()})),"undefined"===typeof window){e.next=22;break}if(v=function(){var e=(0,o.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!==f&&clearTimeout(f),window.removeEventListener("ionKeyboardDidShow",m),window.removeEventListener("ionKeyboardDidShow",v),!u){e.next=6;break}return e.next=6,(0,i.b)(u,0,l.scrollAmount,l.scrollDuration);case 6:c(n,t,!1,l.inputSafeY),t.focus();case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),m=function e(){window.removeEventListener("ionKeyboardDidShow",e),window.addEventListener("ionKeyboardDidShow",v)},!u){e.next=21;break}return e.next=15,(0,i.g)(u);case 15:if(h=e.sent,w=h.scrollHeight-h.clientHeight,!(l.scrollAmount>w-h.scrollTop)){e.next=21;break}return"password"===t.type?(l.scrollAmount+=50,window.addEventListener("ionKeyboardDidShow",m)):window.addEventListener("ionKeyboardDidShow",v),f=setTimeout(v,1e3),e.abrupt("return");case 21:v();case 22:case"end":return e.stop()}}),e)})));return function(n,t,r,o,i){return e.apply(this,arguments)}}(),b=function(e,n,t){if(n&&t){var r=n.x-t.x,o=n.y-t.y;return r*r+o*o>e*e}return!1},g=function(e,n){var t,r;if("INPUT"===e.tagName&&(!e.parentElement||"ION-INPUT"!==e.parentElement.tagName)&&"ION-SEARCHBAR"!==(null===(r=null===(t=e.parentElement)||void 0===t?void 0:t.parentElement)||void 0===r?void 0:r.tagName)){var o=(0,i.a)(e);if(null!==o){var a=o.$ionPaddingTimer;a&&clearTimeout(a),n>0?o.style.setProperty("--keyboard-offset","".concat(n,"px")):o.$ionPaddingTimer=setTimeout((function(){o.style.setProperty("--keyboard-offset","0px")}),120)}}},E=function(e){var n=document,t=e.getNumber("keyboardHeight",290),u=e.getBoolean("scrollAssist",!0),c=e.getBoolean("hideCaretOnScroll",!0),s=e.getBoolean("inputBlurring",!0),d=e.getBoolean("scrollPadding",!0),l=Array.from(n.querySelectorAll("ion-input, ion-textarea")),p=new WeakMap,m=new WeakMap,w=function(){var e=(0,o.Z)((0,r.Z)().mark((function e(n){var o,s,d,l,v,w;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new Promise((function(e){return(0,a.c)(n,e)}));case 2:if(o=n.shadowRoot||n,s=o.querySelector("input")||o.querySelector("textarea"),d=(0,i.a)(n),l=d?null:n.closest("ion-footer"),s){e.next=8;break}return e.abrupt("return");case 8:d&&c&&!p.has(n)&&(v=f(n,s,d),p.set(n,v)),(d||l)&&u&&!m.has(n)&&(w=h(n,s,d,l,t),m.set(n,w));case 10:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}();s&&function(){var e=!0,n=!1,t=document,r=function(){n=!0},o=function(){e=!0},i=function(r){if(n)n=!1;else{var o=t.activeElement;if(o&&!o.matches(v)){var i=r.target;i!==o&&(i.matches(v)||i.closest(v)||(e=!1,setTimeout((function(){e||o.blur()}),50)))}}};(0,a.a)(t,"ionScrollStart",r),t.addEventListener("focusin",o,!0),t.addEventListener("touchend",i,!1)}(),d&&function(e){var n=document,t=function(n){g(n.target,e)},r=function(e){g(e.target,0)};n.addEventListener("focusin",t),n.addEventListener("focusout",r)}(t);for(var b=0,E=l;b<E.length;b++){var y=E[b];w(y)}n.addEventListener("ionInputDidLoad",(function(e){w(e.detail)})),n.addEventListener("ionInputDidUnload",(function(e){!function(e){if(c){var n=p.get(e);n&&n(),p.delete(e)}if(u){var t=m.get(e);t&&t(),m.delete(e)}}(e.detail)}))}}}]);
//# sourceMappingURL=186.b2519119.chunk.js.map