/*! For license information please see 2171.4bbdfaad.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkemporiocasegestionale=self.webpackChunkemporiocasegestionale||[]).push([[2171,3914,4662],{6578:function(e,t,n){n.r(t),n.d(t,{i:function(){return r}});var r=function(e){return e&&""!==e.dir?"rtl"===e.dir.toLowerCase():"rtl"===(null===document||void 0===document?void 0:document.dir.toLowerCase())}},4662:function(e,t,n){n.r(t),n.d(t,{createSwipeBackGesture:function(){return u}});var r=n(4363),i=n(6578),o=n(6111),u=(n(452),function(e,t,n,u,a){var c=e.ownerDocument.defaultView,s=(0,i.i)(e),d=function(e){return s?-e.deltaX:e.deltaX},f=function(e){return s?-e.velocityX:e.velocityX};return(0,o.createGesture)({el:e,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:function(e){return function(e){var t=e.startX;return s?t>=c.innerWidth-50:t<=50}(e)&&t()},onStart:n,onMove:function(e){var t=d(e)/c.innerWidth;u(t)},onEnd:function(e){var t=d(e),n=c.innerWidth,i=t/n,o=f(e),u=o>=0&&(o>.2||t>n/2),s=(u?1-i:i)*n,l=0;if(s>5){var v=s/Math.abs(o);l=Math.min(v,540)}a(u,i<=0?.01:(0,r.l)(0,i,.9999),l)}})})}}]);