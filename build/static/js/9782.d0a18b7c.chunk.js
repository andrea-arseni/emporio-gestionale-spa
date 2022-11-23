"use strict";(self.webpackChunkemporiocasegestionale=self.webpackChunkemporiocasegestionale||[]).push([[9782],{8068:function(e,t,n){n.r(t),n.d(t,{startInputShims:function(){return h}});var o=n(6797),i=n(8006),r=n(4363),a=new WeakMap,u=function(e,t,n,o,i){void 0===o&&(o=0),void 0===i&&(i=!1),a.has(e)!==n&&(n?d(e,t,o,i):l(e,t))},c=function(e){return e===e.getRootNode().activeElement},d=function(e,t,n,o){void 0===o&&(o=!1);var i=t.parentNode,r=t.cloneNode(!1);r.classList.add("cloned-input"),r.tabIndex=-1,o&&(r.disabled=!0),i.appendChild(r),a.set(e,r);var u="rtl"===e.ownerDocument.dir?9999:-9999;e.style.pointerEvents="none",t.style.transform="translate3d(".concat(u,"px,").concat(n,"px,0) scale(0)")},l=function(e,t){var n=a.get(e);n&&(a.delete(e),n.remove()),e.style.pointerEvents="",t.style.transform=""},s="input, textarea, [no-blur], [contenteditable]",f=function(e,t,n,o){var i=e.top,r=e.bottom,a=t.top,u=a+15,c=.75*Math.min(t.bottom,o-n)-r,d=u-i,l=Math.round(c<0?-c:d>0?-d:0),s=Math.min(l,i-a),f=Math.abs(s)/.3;return{scrollAmount:s,scrollDuration:Math.min(400,Math.max(150,f)),scrollPadding:n,inputSafeY:4-(i-u)}},v=function(e,t,n,a,c,d){return void 0===d&&(d=!1),(0,o.mG)(void 0,void 0,void 0,(function(){var l,s,v,m,p,h;return(0,o.Jh)(this,(function(w){switch(w.label){case 0:return n||a?(l=function(e,t,n){var o,i=null!==(o=e.closest("ion-item,[ion-item]"))&&void 0!==o?o:e;return f(i.getBoundingClientRect(),t.getBoundingClientRect(),n,e.ownerDocument.defaultView.innerHeight)}(e,n||a,c),n&&Math.abs(l.scrollAmount)<4?(t.focus(),[2]):(u(e,t,!0,l.inputSafeY,d),t.focus(),(0,r.r)((function(){return e.click()})),"undefined"===typeof window?[3,3]:(v=function(){return(0,o.mG)(void 0,void 0,void 0,(function(){return(0,o.Jh)(this,(function(o){switch(o.label){case 0:return void 0!==s&&clearTimeout(s),window.removeEventListener("ionKeyboardDidShow",m),window.removeEventListener("ionKeyboardDidShow",v),n?[4,(0,i.c)(n,0,l.scrollAmount,l.scrollDuration)]:[3,2];case 1:o.sent(),o.label=2;case 2:return u(e,t,!1,l.inputSafeY),t.focus(),[2]}}))}))},m=function(){window.removeEventListener("ionKeyboardDidShow",m),window.addEventListener("ionKeyboardDidShow",v)},n?[4,(0,i.g)(n)]:[3,2]))):[2];case 1:if(p=w.sent(),h=p.scrollHeight-p.clientHeight,l.scrollAmount>h-p.scrollTop)return"password"===t.type?(l.scrollAmount+=50,window.addEventListener("ionKeyboardDidShow",m)):window.addEventListener("ionKeyboardDidShow",v),s=setTimeout(v,1e3),[2];w.label=2;case 2:v(),w.label=3;case 3:return[2]}}))}))},m=function(e,t,n){if(t&&n){var o=t.x-n.x,i=t.y-n.y;return o*o+i*i>e*e}return!1},p=function(e,t){var n,o;if("INPUT"===e.tagName&&(!e.parentElement||"ION-INPUT"!==e.parentElement.tagName)&&"ION-SEARCHBAR"!==(null===(o=null===(n=e.parentElement)||void 0===n?void 0:n.parentElement)||void 0===o?void 0:o.tagName)){var r=(0,i.f)(e);if(null!==r){var a=r.$ionPaddingTimer;a&&clearTimeout(a),t>0?r.style.setProperty("--keyboard-offset","".concat(t,"px")):r.$ionPaddingTimer=setTimeout((function(){r.style.setProperty("--keyboard-offset","0px")}),120)}}},h=function(e,t){var n=document,a="ios"===t,d="android"===t,l=e.getNumber("keyboardHeight",290),f=e.getBoolean("scrollAssist",!0),h=e.getBoolean("hideCaretOnScroll",a),w=e.getBoolean("inputBlurring",a),g=e.getBoolean("scrollPadding",!0),b=Array.from(n.querySelectorAll("ion-input, ion-textarea")),E=new WeakMap,y=new WeakMap,S=function(e){return(0,o.mG)(void 0,void 0,void 0,(function(){var t,n,a,s,p;return(0,o.Jh)(this,(function(o){switch(o.label){case 0:return[4,new Promise((function(t){return(0,r.c)(e,t)}))];case 1:return o.sent(),t=e.shadowRoot||e,n=t.querySelector("input")||t.querySelector("textarea"),a=(0,i.f)(e),s=a?null:e.closest("ion-footer"),n?(a&&h&&!E.has(e)&&(p=function(e,t,n){if(!n||!t)return function(){};var o=function(n){c(t)&&u(e,t,n)},i=function(){return u(e,t,!1)},a=function(){return o(!0)},d=function(){return o(!1)};return(0,r.a)(n,"ionScrollStart",a),(0,r.a)(n,"ionScrollEnd",d),t.addEventListener("blur",i),function(){(0,r.b)(n,"ionScrollStart",a),(0,r.b)(n,"ionScrollEnd",d),t.addEventListener("ionBlur",i)}}(e,n,a),E.set(e,p)),"date"===n.type||"datetime-local"===n.type||!a&&!s||!f||y.has(e)||(p=function(e,t,n,o,i,a){var u;void 0===a&&(a=!1);var d=function(e){u=(0,r.p)(e)},l=function(d){if(u){var l=(0,r.p)(d);m(6,u,l)||c(t)||v(e,t,n,o,i,a)}};return e.addEventListener("touchstart",d,{capture:!0,passive:!0}),e.addEventListener("touchend",l,!0),function(){e.removeEventListener("touchstart",d,!0),e.removeEventListener("touchend",l,!0)}}(e,n,a,s,l,d),y.set(e,p)),[2]):[2]}}))}))};w&&function(){var e=!0,t=!1,n=document,o=function(){t=!0},i=function(){e=!0},a=function(o){if(t)t=!1;else{var i=n.activeElement;if(i&&!i.matches(s)){var r=o.target;r!==i&&(r.matches(s)||r.closest(s)||(e=!1,setTimeout((function(){e||i.blur()}),50)))}}};(0,r.a)(n,"ionScrollStart",o),n.addEventListener("focusin",i,!0),n.addEventListener("touchend",a,!1)}(),g&&function(e){var t=document,n=function(t){p(t.target,e)},o=function(e){p(e.target,0)};t.addEventListener("focusin",n),t.addEventListener("focusout",o)}(l);for(var L=0,D=b;L<D.length;L++){var k=D[L];S(k)}n.addEventListener("ionInputDidLoad",(function(e){S(e.detail)})),n.addEventListener("ionInputDidUnload",(function(e){!function(e){var t;h&&((t=E.get(e))&&t(),E.delete(e)),f&&((t=y.get(e))&&t(),y.delete(e))}(e.detail)}))}}}]);