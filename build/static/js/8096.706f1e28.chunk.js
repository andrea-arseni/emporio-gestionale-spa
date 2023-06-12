/*! For license information please see 8096.706f1e28.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkemporiocasegestionale=self.webpackChunkemporiocasegestionale||[]).push([[8096,6532],{8096:function(t,e,i){i.r(e),i.d(e,{ion_radio:function(){return l},ion_radio_group:function(){return d}});var r=i(6797),o=i(8062),n=i(8102),a=i(4363),s=i(6532),l=function(){function t(t){var e=this;(0,o.r)(this,t),this.ionStyle=(0,o.e)(this,"ionStyle",7),this.ionFocus=(0,o.e)(this,"ionFocus",7),this.ionBlur=(0,o.e)(this,"ionBlur",7),this.inputId="ion-rb-".concat(c++),this.radioGroup=null,this.checked=!1,this.buttonTabindex=-1,this.name=this.inputId,this.disabled=!1,this.updateState=function(){e.radioGroup&&(e.checked=e.radioGroup.value===e.value)},this.onClick=function(){e.checked=e.nativeInput.checked},this.onFocus=function(){e.ionFocus.emit()},this.onBlur=function(){e.ionBlur.emit()}}return t.prototype.valueChanged=function(){this.updateState()},t.prototype.setFocus=function(t){return(0,r.mG)(this,void 0,void 0,(function(){return(0,r.Jh)(this,(function(e){return t.stopPropagation(),t.preventDefault(),this.el.focus(),[2]}))}))},t.prototype.setButtonTabindex=function(t){return(0,r.mG)(this,void 0,void 0,(function(){return(0,r.Jh)(this,(function(e){return this.buttonTabindex=t,[2]}))}))},t.prototype.connectedCallback=function(){void 0===this.value&&(this.value=this.inputId);var t=this.radioGroup=this.el.closest("ion-radio-group");t&&(this.updateState(),(0,a.a)(t,"ionChange",this.updateState))},t.prototype.disconnectedCallback=function(){var t=this.radioGroup;t&&((0,a.b)(t,"ionChange",this.updateState),this.radioGroup=null)},t.prototype.componentWillLoad=function(){this.emitStyle()},t.prototype.emitStyle=function(){this.ionStyle.emit({"radio-checked":this.checked,"interactive-disabled":this.disabled})},t.prototype.render=function(){var t,e=this,i=this,r=i.inputId,l=i.disabled,c=i.checked,d=i.color,u=i.el,h=i.buttonTabindex,p=(0,n.b)(this),b=(0,a.d)(u,r),m=b.label,f=b.labelId,g=b.labelText;return(0,o.h)(o.H,{"aria-checked":"".concat(c),"aria-hidden":l?"true":null,"aria-labelledby":m?f:null,role:"radio",tabindex:h,onFocus:this.onFocus,onBlur:this.onBlur,onClick:this.onClick,class:(0,s.c)(d,(t={},t[p]=!0,t["in-item"]=(0,s.h)("ion-item",u),t.interactive=!0,t["radio-checked"]=c,t["radio-disabled"]=l,t))},(0,o.h)("div",{class:"radio-icon",part:"container"},(0,o.h)("div",{class:"radio-inner",part:"mark"}),(0,o.h)("div",{class:"radio-ripple"})),(0,o.h)("label",{htmlFor:r},g),(0,o.h)("input",{type:"radio",checked:c,disabled:l,tabindex:"-1",id:r,ref:function(t){return e.nativeInput=t}}))},Object.defineProperty(t.prototype,"el",{get:function(){return(0,o.i)(this)},enumerable:!1,configurable:!0}),Object.defineProperty(t,"watchers",{get:function(){return{value:["valueChanged"],color:["emitStyle"],checked:["emitStyle"],disabled:["emitStyle"]}},enumerable:!1,configurable:!0}),t}(),c=0;l.style={ios:':host{--inner-border-radius:50%;display:inline-block;position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:2}:host(.radio-disabled){pointer-events:none}.radio-icon{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;contain:layout size style}.radio-icon,.radio-inner{-webkit-box-sizing:border-box;box-sizing:border-box}label{left:0;top:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;position:absolute;width:100%;height:100%;border:0;background:transparent;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;opacity:0}[dir=rtl] label,:host-context([dir=rtl]) label{left:unset;right:unset;right:0}label::-moz-focus-inner{border:0}input{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;margin:0;padding:0;border:0;outline:0;clip:rect(0 0 0 0);opacity:0;overflow:hidden;-webkit-appearance:none;-moz-appearance:none}:host(:focus){outline:none}:host{--color-checked:var(--ion-color-primary, #3880ff);width:15px;height:24px}:host(.ion-color.radio-checked) .radio-inner{border-color:var(--ion-color-base)}.item-radio.item-ios ion-label{margin-left:0}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.item-radio.item-ios ion-label{margin-left:unset;-webkit-margin-start:0;margin-inline-start:0}}.radio-inner{width:33%;height:50%}:host(.radio-checked) .radio-inner{-webkit-transform:rotate(45deg);transform:rotate(45deg);border-width:2px;border-top-width:0;border-left-width:0;border-style:solid;border-color:var(--color-checked)}:host(.radio-disabled){opacity:0.3}:host(.ion-focused) .radio-icon::after{border-radius:var(--inner-border-radius);left:-9px;top:-8px;display:block;position:absolute;width:36px;height:36px;background:var(--ion-color-primary-tint, #4c8dff);content:"";opacity:0.2}:host-context([dir=rtl]):host(.ion-focused) .radio-icon::after,:host-context([dir=rtl]).ion-focused .radio-icon::after{left:unset;right:unset;right:-9px}:host(.in-item){margin-left:10px;margin-right:11px;margin-top:8px;margin-bottom:8px;display:block;position:static}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host(.in-item){margin-left:unset;margin-right:unset;-webkit-margin-start:10px;margin-inline-start:10px;-webkit-margin-end:11px;margin-inline-end:11px}}:host(.in-item[slot=start]){margin-left:3px;margin-right:21px;margin-top:8px;margin-bottom:8px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host(.in-item[slot=start]){margin-left:unset;margin-right:unset;-webkit-margin-start:3px;margin-inline-start:3px;-webkit-margin-end:21px;margin-inline-end:21px}}',md:':host{--inner-border-radius:50%;display:inline-block;position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:2}:host(.radio-disabled){pointer-events:none}.radio-icon{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;contain:layout size style}.radio-icon,.radio-inner{-webkit-box-sizing:border-box;box-sizing:border-box}label{left:0;top:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;position:absolute;width:100%;height:100%;border:0;background:transparent;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;opacity:0}[dir=rtl] label,:host-context([dir=rtl]) label{left:unset;right:unset;right:0}label::-moz-focus-inner{border:0}input{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;margin:0;padding:0;border:0;outline:0;clip:rect(0 0 0 0);opacity:0;overflow:hidden;-webkit-appearance:none;-moz-appearance:none}:host(:focus){outline:none}:host{--color:var(--ion-color-step-400, #999999);--color-checked:var(--ion-color-primary, #3880ff);--border-width:2px;--border-style:solid;--border-radius:50%;width:20px;height:20px}:host(.ion-color) .radio-inner{background:var(--ion-color-base)}:host(.ion-color.radio-checked) .radio-icon{border-color:var(--ion-color-base)}.radio-icon{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;border-radius:var(--border-radius);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--color)}.radio-inner{border-radius:var(--inner-border-radius);width:calc(50% + var(--border-width));height:calc(50% + var(--border-width));-webkit-transform:scale3d(0, 0, 0);transform:scale3d(0, 0, 0);-webkit-transition:-webkit-transform 280ms cubic-bezier(0.4, 0, 0.2, 1);transition:-webkit-transform 280ms cubic-bezier(0.4, 0, 0.2, 1);transition:transform 280ms cubic-bezier(0.4, 0, 0.2, 1);transition:transform 280ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 280ms cubic-bezier(0.4, 0, 0.2, 1);background:var(--color-checked)}:host(.radio-checked) .radio-icon{border-color:var(--color-checked)}:host(.radio-checked) .radio-inner{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1)}:host(.radio-disabled){opacity:0.3}:host(.ion-focused) .radio-icon::after{border-radius:var(--inner-border-radius);left:-12px;top:-12px;display:block;position:absolute;width:36px;height:36px;background:var(--ion-color-primary-tint, #4c8dff);content:"";opacity:0.2}:host-context([dir=rtl]):host(.ion-focused) .radio-icon::after,:host-context([dir=rtl]).ion-focused .radio-icon::after{left:unset;right:unset;right:-12px}:host(.in-item){margin-left:0;margin-right:0;margin-top:9px;margin-bottom:9px;display:block;position:static}:host(.in-item[slot=start]){margin-left:4px;margin-right:36px;margin-top:11px;margin-bottom:10px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host(.in-item[slot=start]){margin-left:unset;margin-right:unset;-webkit-margin-start:4px;margin-inline-start:4px;-webkit-margin-end:36px;margin-inline-end:36px}}'};var d=function(){function t(t){var e=this;(0,o.r)(this,t),this.ionChange=(0,o.e)(this,"ionChange",7),this.inputId="ion-rg-".concat(u++),this.labelId="".concat(this.inputId,"-lbl"),this.allowEmptySelection=!1,this.name=this.inputId,this.setRadioTabindex=function(t){var i=e.getRadios(),r=i.find((function(t){return!t.disabled})),o=i.find((function(e){return e.value===t&&!e.disabled}));if(r||o)for(var n=o||r,a=0,s=i;a<s.length;a++){var l=s[a],c=l===n?0:-1;l.setButtonTabindex(c)}},this.onClick=function(t){t.preventDefault();var i=t.target&&t.target.closest("ion-radio");if(i){var r=e.value,o=i.value;o!==r?e.value=o:e.allowEmptySelection&&(e.value=void 0)}}}return t.prototype.valueChanged=function(t){this.setRadioTabindex(t),this.ionChange.emit({value:t})},t.prototype.componentDidLoad=function(){this.setRadioTabindex(this.value)},t.prototype.connectedCallback=function(){return(0,r.mG)(this,void 0,void 0,(function(){var t,e;return(0,r.Jh)(this,(function(i){return(t=this.el.querySelector("ion-list-header")||this.el.querySelector("ion-item-divider"))&&(e=this.label=t.querySelector("ion-label"))&&(this.labelId=e.id=this.name+"-lbl"),[2]}))}))},t.prototype.getRadios=function(){return Array.from(this.el.querySelectorAll("ion-radio"))},t.prototype.onKeydown=function(t){var e=!!this.el.closest("ion-select-popover");if(!t.target||this.el.contains(t.target)){var i=this.getRadios().filter((function(t){return!t.disabled}));if(t.target&&i.includes(t.target)){var r=i.findIndex((function(e){return e===t.target})),o=i[r],n=void 0;["ArrowDown","ArrowRight"].includes(t.key)&&(n=r===i.length-1?i[0]:i[r+1]),["ArrowUp","ArrowLeft"].includes(t.key)&&(n=0===r?i[i.length-1]:i[r-1]),n&&i.includes(n)&&(n.setFocus(t),e||(this.value=n.value)),[" "].includes(t.key)&&(this.value=this.allowEmptySelection&&void 0!==this.value?void 0:o.value,t.preventDefault())}}},t.prototype.render=function(){var t=this,e=t.label,i=t.labelId,r=t.el,s=t.name,l=t.value,c=(0,n.b)(this);return(0,a.e)(!0,r,s,l,!1),(0,o.h)(o.H,{role:"radiogroup","aria-labelledby":e?i:null,onClick:this.onClick,class:c})},Object.defineProperty(t.prototype,"el",{get:function(){return(0,o.i)(this)},enumerable:!1,configurable:!0}),Object.defineProperty(t,"watchers",{get:function(){return{value:["valueChanged"]}},enumerable:!1,configurable:!0}),t}(),u=0},6532:function(t,e,i){i.r(e),i.d(e,{c:function(){return n},g:function(){return a},h:function(){return o},o:function(){return l}});var r=i(6797),o=function(t,e){return null!==e.closest(t)},n=function(t,e){var i;return"string"===typeof t&&t.length>0?Object.assign(((i={"ion-color":!0})["ion-color-".concat(t)]=!0,i),e):e},a=function(t){var e={};return function(t){return void 0!==t?(Array.isArray(t)?t:t.split(" ")).filter((function(t){return null!=t})).map((function(t){return t.trim()})).filter((function(t){return""!==t})):[]}(t).forEach((function(t){return e[t]=!0})),e},s=/^[a-z][a-z0-9+\-.]*:/,l=function(t,e,i,o){return(0,r.mG)(void 0,void 0,void 0,(function(){var n;return(0,r.Jh)(this,(function(r){return null!=t&&"#"!==t[0]&&!s.test(t)&&(n=document.querySelector("ion-router"))?(null!=e&&e.preventDefault(),[2,n.push(t,i,o)]):[2,!1]}))}))}}}]);