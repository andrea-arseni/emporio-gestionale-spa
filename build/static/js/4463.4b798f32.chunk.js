/*! For license information please see 4463.4b798f32.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkemporiocasegestionale=self.webpackChunkemporiocasegestionale||[]).push([[4463],{4463:function(t,i,n){n.r(i),n.d(i,{a:function(){return c},b:function(){return r},c:function(){return a},d:function(){return u},h:function(){return s}});var e={getEngine:function(){var t,i=window;return i.TapticEngine||(null===(t=i.Capacitor)||void 0===t?void 0:t.isPluginAvailable("Haptics"))&&i.Capacitor.Plugins.Haptics},available:function(){var t,i=window;return!!this.getEngine()&&("web"!==(null===(t=i.Capacitor)||void 0===t?void 0:t.getPlatform())||"undefined"!==typeof navigator&&void 0!==navigator.vibrate)},isCordova:function(){return!!window.TapticEngine},isCapacitor:function(){return!!window.Capacitor},impact:function(t){var i=this.getEngine();if(i){var n=this.isCapacitor()?t.style.toUpperCase():t.style;i.impact({style:n})}},notification:function(t){var i=this.getEngine();if(i){var n=this.isCapacitor()?t.style.toUpperCase():t.style;i.notification({style:n})}},selection:function(){this.impact({style:"light"})},selectionStart:function(){var t=this.getEngine();t&&(this.isCapacitor()?t.selectionStart():t.gestureSelectionStart())},selectionChanged:function(){var t=this.getEngine();t&&(this.isCapacitor()?t.selectionChanged():t.gestureSelectionChanged())},selectionEnd:function(){var t=this.getEngine();t&&(this.isCapacitor()?t.selectionEnd():t.gestureSelectionEnd())}},o=function(){return e.available()},a=function(){o()&&e.selection()},c=function(){o()&&e.selectionStart()},r=function(){o()&&e.selectionChanged()},s=function(){o()&&e.selectionEnd()},u=function(t){o()&&e.impact(t)}}}]);