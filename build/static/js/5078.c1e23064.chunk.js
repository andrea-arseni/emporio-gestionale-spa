"use strict";(self.webpackChunkemporiocasegestionale=self.webpackChunkemporiocasegestionale||[]).push([[5078,9761],{9761:function(e,t,n){n.r(t),n.d(t,{C:function(){return a},a:function(){return o},d:function(){return s}});var i=n(6797),r=n(4363),o=function(e,t,n,o,s,a){return(0,i.mG)(void 0,void 0,void 0,(function(){var u,c;return(0,i.Jh)(this,(function(i){switch(i.label){case 0:if(e)return[2,e.attachViewToDom(t,n,s,o)];if(!a&&"string"!==typeof n&&!(n instanceof HTMLElement))throw new Error("framework delegate is missing");return c="string"===typeof n?null===(u=t.ownerDocument)||void 0===u?void 0:u.createElement(n):n,o&&o.forEach((function(e){return c.classList.add(e)})),s&&Object.assign(c,s),t.appendChild(c),[4,new Promise((function(e){return(0,r.c)(c,e)}))];case 1:return i.sent(),[2,c]}}))}))},s=function(e,t){if(t){if(e){var n=t.parentElement;return e.removeViewFromDom(n,t)}t.remove()}return Promise.resolve()},a=function(){var e,t;return{attachViewToDom:function(n,o,s,a){return void 0===s&&(s={}),void 0===a&&(a=[]),(0,i.mG)(void 0,void 0,void 0,(function(){var u,c,h,d,l;return(0,i.Jh)(this,(function(i){switch(i.label){case 0:return e=n,o?(h="string"===typeof o?null===(u=e.ownerDocument)||void 0===u?void 0:u.createElement(o):o,a.forEach((function(e){return h.classList.add(e)})),Object.assign(h,s),e.appendChild(h),[4,new Promise((function(e){return(0,r.c)(h,e)}))]):[3,2];case 1:return i.sent(),[3,3];case 2:e.children.length>0&&(e.children[0].classList.contains("ion-delegate-host")||((d=null===(c=e.ownerDocument)||void 0===c?void 0:c.createElement("div")).classList.add("ion-delegate-host"),a.forEach((function(e){return d.classList.add(e)})),d.append.apply(d,e.children),e.appendChild(d))),i.label=3;case 3:return l=document.querySelector("ion-app")||document.body,t=document.createComment("ionic teleport"),e.parentNode.insertBefore(t,e),l.appendChild(e),[2,e]}}))}))},removeViewFromDom:function(){return e&&t&&(t.parentNode.insertBefore(e,t),t.remove()),Promise.resolve()}}}},5078:function(e,t,n){n.r(t),n.d(t,{ion_nav:function(){return v},ion_nav_link:function(){return p}});var i=n(6797),r=n(8062),o=n(8266),s=n(6301),a=n(4363),u=n(8067),c=n(9761),h=function(){function e(e,t){this.component=e,this.params=t,this.state=1}return e.prototype.init=function(e){return(0,i.mG)(this,void 0,void 0,(function(){var t,n;return(0,i.Jh)(this,(function(i){switch(i.label){case 0:return this.state=2,this.element?[3,2]:(t=this.component,n=this,[4,(0,c.a)(this.delegate,e,t,["ion-page","ion-page-invisible"],this.params)]);case 1:n.element=i.sent(),i.label=2;case 2:return[2]}}))}))},e.prototype._destroy=function(){(0,a.n)(3!==this.state,"view state must be ATTACHED");var e=this.element;e&&(this.delegate?this.delegate.removeViewFromDom(e.parentElement,e):e.remove()),this.nav=void 0,this.state=3},e}(),d=function(e,t,n){return!!e&&(e.component===t&&(0,a.s)(e.params,n))},l=function(e,t){return e?e instanceof h?e:new h(e,t):null},v=function(){function e(e){(0,r.r)(this,e),this.ionNavWillLoad=(0,r.e)(this,"ionNavWillLoad",7),this.ionNavWillChange=(0,r.e)(this,"ionNavWillChange",3),this.ionNavDidChange=(0,r.e)(this,"ionNavDidChange",3),this.transInstr=[],this.animationEnabled=!0,this.useRouter=!1,this.isTransitioning=!1,this.destroyed=!1,this.views=[],this.animated=!0}return e.prototype.swipeGestureChanged=function(){this.gesture&&this.gesture.enable(!0===this.swipeGesture)},e.prototype.rootChanged=function(){void 0!==this.root&&(this.useRouter||this.setRoot(this.root,this.rootParams))},e.prototype.componentWillLoad=function(){if(this.useRouter=null!==document.querySelector("ion-router")&&null===this.el.closest("[no-router]"),void 0===this.swipeGesture){var e=(0,o.b)(this);this.swipeGesture=o.c.getBoolean("swipeBackEnabled","ios"===e)}this.ionNavWillLoad.emit()},e.prototype.componentDidLoad=function(){return(0,i.mG)(this,void 0,void 0,(function(){var e;return(0,i.Jh)(this,(function(t){switch(t.label){case 0:return this.rootChanged(),e=this,[4,n.e(2171).then(n.bind(n,4662))];case 1:return e.gesture=t.sent().createSwipeBackGesture(this.el,this.canStart.bind(this),this.onStart.bind(this),this.onMove.bind(this),this.onEnd.bind(this)),this.swipeGestureChanged(),[2]}}))}))},e.prototype.connectedCallback=function(){this.destroyed=!1},e.prototype.disconnectedCallback=function(){for(var e=0,t=this.views;e<t.length;e++){var n=t[e];(0,u.l)(n.element,u.d),n._destroy()}this.gesture&&(this.gesture.destroy(),this.gesture=void 0),this.transInstr.length=0,this.views.length=0,this.destroyed=!0},e.prototype.push=function(e,t,n,i){return this.insert(-1,e,t,n,i)},e.prototype.insert=function(e,t,n,i,r){return this.insertPages(e,[{component:t,componentProps:n}],i,r)},e.prototype.insertPages=function(e,t,n,i){return this.queueTrns({insertStart:e,insertViews:t,opts:n},i)},e.prototype.pop=function(e,t){return this.removeIndex(-1,1,e,t)},e.prototype.popTo=function(e,t,n){var i={removeStart:-1,removeCount:-1,opts:t};return"object"===typeof e&&e.component?(i.removeView=e,i.removeStart=1):"number"===typeof e&&(i.removeStart=e+1),this.queueTrns(i,n)},e.prototype.popToRoot=function(e,t){return this.removeIndex(1,-1,e,t)},e.prototype.removeIndex=function(e,t,n,i){return void 0===t&&(t=1),this.queueTrns({removeStart:e,removeCount:t,opts:n},i)},e.prototype.setRoot=function(e,t,n,i){return this.setPages([{component:e,componentProps:t}],n,i)},e.prototype.setPages=function(e,t,n){return null!==t&&void 0!==t||(t={}),!0!==t.animated&&(t.animated=!1),this.queueTrns({insertStart:0,insertViews:e,removeStart:0,removeCount:-1,opts:t},n)},e.prototype.setRouteId=function(e,t,n,r){var o,s=this,a=this.getActiveSync();if(d(a,e,t))return Promise.resolve({changed:!1,element:a.element});var u,c=new Promise((function(e){return o=e})),h={updateURL:!1,viewIsReady:function(e){var t,n=new Promise((function(e){return t=e}));return o({changed:!0,element:e,markVisible:function(){return(0,i.mG)(s,void 0,void 0,(function(){return(0,i.Jh)(this,(function(e){switch(e.label){case 0:return t(),[4,u];case 1:return e.sent(),[2]}}))}))}}),n}};if("root"===n)u=this.setRoot(e,t,h);else{var l=this.views.find((function(n){return d(n,e,t)}));l?u=this.popTo(l,Object.assign(Object.assign({},h),{direction:"back",animationBuilder:r})):"forward"===n?u=this.push(e,t,Object.assign(Object.assign({},h),{animationBuilder:r})):"back"===n&&(u=this.setRoot(e,t,Object.assign(Object.assign({},h),{direction:"back",animated:!0,animationBuilder:r})))}return c},e.prototype.getRouteId=function(){return(0,i.mG)(this,void 0,void 0,(function(){var e;return(0,i.Jh)(this,(function(t){return(e=this.getActiveSync())?[2,{id:e.element.tagName,params:e.params,element:e.element}]:[2,void 0]}))}))},e.prototype.getActive=function(){return(0,i.mG)(this,void 0,void 0,(function(){return(0,i.Jh)(this,(function(e){return[2,this.getActiveSync()]}))}))},e.prototype.getByIndex=function(e){return(0,i.mG)(this,void 0,void 0,(function(){return(0,i.Jh)(this,(function(t){return[2,this.views[e]]}))}))},e.prototype.canGoBack=function(e){return(0,i.mG)(this,void 0,void 0,(function(){return(0,i.Jh)(this,(function(t){return[2,this.canGoBackSync(e)]}))}))},e.prototype.getPrevious=function(e){return(0,i.mG)(this,void 0,void 0,(function(){return(0,i.Jh)(this,(function(t){return[2,this.getPreviousSync(e)]}))}))},e.prototype.getLength=function(){return this.views.length},e.prototype.getActiveSync=function(){return this.views[this.views.length-1]},e.prototype.canGoBackSync=function(e){return void 0===e&&(e=this.getActiveSync()),!(!e||!this.getPreviousSync(e))},e.prototype.getPreviousSync=function(e){if(void 0===e&&(e=this.getActiveSync()),e){var t=this.views,n=t.indexOf(e);return n>0?t[n-1]:void 0}},e.prototype.queueTrns=function(e,t){return(0,i.mG)(this,void 0,void 0,(function(){var n,r,o,s,a;return(0,i.Jh)(this,(function(i){switch(i.label){case 0:return this.isTransitioning&&(null===(n=e.opts)||void 0===n?void 0:n.skipIfBusy)?[2,!1]:(o=new Promise((function(t,n){e.resolve=t,e.reject=n})),e.done=t,e.opts&&!1!==e.opts.updateURL&&this.useRouter&&(s=document.querySelector("ion-router"))?[4,s.canTransition()]:[3,2]);case 1:if(!1===(a=i.sent()))return[2,!1];if("string"===typeof a)return s.push(a,e.opts.direction||"back"),[2,!1];i.label=2;case 2:return 0===(null===(r=e.insertViews)||void 0===r?void 0:r.length)&&(e.insertViews=void 0),this.transInstr.push(e),this.nextTrns(),[2,o]}}))}))},e.prototype.success=function(e,t){if(this.destroyed)this.fireError("nav controller was destroyed",t);else if(t.done&&t.done(e.hasCompleted,e.requiresTransition,e.enteringView,e.leavingView,e.direction),t.resolve(e.hasCompleted),!1!==t.opts.updateURL&&this.useRouter){var n=document.querySelector("ion-router");if(n){var i="back"===e.direction?"back":"forward";n.navChanged(i)}}},e.prototype.failed=function(e,t){this.destroyed?this.fireError("nav controller was destroyed",t):(this.transInstr.length=0,this.fireError(e,t))},e.prototype.fireError=function(e,t){t.done&&t.done(!1,!1,e),t.reject&&!this.destroyed?t.reject(e):t.resolve(!1)},e.prototype.nextTrns=function(){if(this.isTransitioning)return!1;var e=this.transInstr.shift();return!!e&&(this.runTransition(e),!0)},e.prototype.runTransition=function(e){return(0,i.mG)(this,void 0,void 0,(function(){var t,n,r,o,s;return(0,i.Jh)(this,(function(i){switch(i.label){case 0:if(i.trys.push([0,6,,7]),this.ionNavWillChange.emit(),this.isTransitioning=!0,this.prepareTI(e),t=this.getActiveSync(),n=this.getEnteringView(e,t),!t&&!n)throw new Error("no views in the stack to be removed");return n&&1===n.state?[4,n.init(this.el)]:[3,2];case 1:i.sent(),i.label=2;case 2:return this.postViewInit(n,t,e),(r=(e.enteringRequiresTransition||e.leavingRequiresTransition)&&n!==t)&&e.opts&&t&&("back"===e.opts.direction&&(e.opts.animationBuilder=e.opts.animationBuilder||(null===n||void 0===n?void 0:n.animationBuilder)),t.animationBuilder=e.opts.animationBuilder),o=void 0,r?[4,this.transition(n,t,e)]:[3,4];case 3:return o=i.sent(),[3,5];case 4:o={hasCompleted:!0,requiresTransition:!1},i.label=5;case 5:return this.success(o,e),this.ionNavDidChange.emit(),[3,7];case 6:return s=i.sent(),this.failed(s,e),[3,7];case 7:return this.isTransitioning=!1,this.nextTrns(),[2]}}))}))},e.prototype.prepareTI=function(e){var t,n,i,r=this.views.length;if(null!==(t=e.opts)&&void 0!==t||(e.opts={}),null!==(n=(i=e.opts).delegate)&&void 0!==n||(i.delegate=this.delegate),void 0!==e.removeView){(0,a.n)(void 0!==e.removeStart,"removeView needs removeStart"),(0,a.n)(void 0!==e.removeCount,"removeView needs removeCount");var o=this.views.indexOf(e.removeView);if(o<0)throw new Error("removeView was not found");e.removeStart+=o}void 0!==e.removeStart&&(e.removeStart<0&&(e.removeStart=r-1),e.removeCount<0&&(e.removeCount=r-e.removeStart),e.leavingRequiresTransition=e.removeCount>0&&e.removeStart+e.removeCount===r),e.insertViews&&((e.insertStart<0||e.insertStart>r)&&(e.insertStart=r),e.enteringRequiresTransition=e.insertStart===r);var s=e.insertViews;if(s){(0,a.n)(s.length>0,"length can not be zero");var u=function(e){return e.map((function(e){return e instanceof h?e:"component"in e?l(e.component,null===e.componentProps?void 0:e.componentProps):l(e,void 0)})).filter((function(e){return null!==e}))}(s);if(0===u.length)throw new Error("invalid views to insert");for(var c=0,d=u;c<d.length;c++){var v=d[c];v.delegate=e.opts.delegate;var p=v.nav;if(p&&p!==this)throw new Error("inserted view was already inserted");if(3===v.state)throw new Error("inserted view was already destroyed")}e.insertViews=u}},e.prototype.getEnteringView=function(e,t){var n=e.insertViews;if(void 0!==n)return n[n.length-1];var i=e.removeStart;if(void 0!==i)for(var r=this.views,o=i+e.removeCount,s=r.length-1;s>=0;s--){var a=r[s];if((s<i||s>=o)&&a!==t)return a}},e.prototype.postViewInit=function(e,t,n){var i,r,o;(0,a.n)(t||e,"Both leavingView and enteringView are null"),(0,a.n)(n.resolve,"resolve must be valid"),(0,a.n)(n.reject,"reject must be valid");var s,c=n.opts,h=n.insertViews,d=n.removeStart,l=n.removeCount;if(void 0!==d&&void 0!==l){(0,a.n)(d>=0,"removeStart can not be negative"),(0,a.n)(l>=0,"removeCount can not be negative"),s=[];for(var v=d;v<d+l;v++){void 0!==(w=this.views[v])&&w!==e&&w!==t&&s.push(w)}null!==(i=c.direction)&&void 0!==i||(c.direction="back")}var p=this.views.length+(null!==(r=null===h||void 0===h?void 0:h.length)&&void 0!==r?r:0)-(null!==l&&void 0!==l?l:0);if((0,a.n)(p>=0,"final balance can not be negative"),0===p)throw console.warn("You can't remove all the pages in the navigation stack. nav.pop() is probably called too many times.",this,this.el),new Error("navigation stack needs at least one root page");if(h){for(var f=n.insertStart,m=0,g=h;m<g.length;m++){var w=g[m];this.insertViewAt(w,f),f++}n.enteringRequiresTransition&&(null!==(o=c.direction)&&void 0!==o||(c.direction="forward"))}if(s&&s.length>0){for(var y=0,b=s;y<b.length;y++){w=b[y];(0,u.l)(w.element,u.b),(0,u.l)(w.element,u.c),(0,u.l)(w.element,u.d)}for(var S=0,C=s;S<C.length;S++){w=C[S];this.destroyView(w)}}},e.prototype.transition=function(e,t,n){return(0,i.mG)(this,void 0,void 0,(function(){var r,s,a,c,h,d,l,v=this;return(0,i.Jh)(this,(function(i){switch(i.label){case 0:return r=n.opts,s=r.progressAnimation?function(e){return v.sbAni=e}:void 0,a=(0,o.b)(this),c=e.element,h=t&&t.element,d=Object.assign(Object.assign({mode:a,showGoBack:this.canGoBackSync(e),baseEl:this.el,progressCallback:s,animated:this.animated&&o.c.getBoolean("animated",!0),enteringEl:c,leavingEl:h},r),{animationBuilder:r.animationBuilder||this.animation||o.c.get("navAnimation")}),[4,(0,u.t)(d)];case 1:return l=i.sent().hasCompleted,[2,this.transitionFinish(l,e,t,r)]}}))}))},e.prototype.transitionFinish=function(e,t,n,i){var r=e?t:n;return r&&this.unmountInactiveViews(r),{hasCompleted:e,requiresTransition:!0,enteringView:t,leavingView:n,direction:i.direction}},e.prototype.insertViewAt=function(e,t){var n=this.views,i=n.indexOf(e);i>-1?((0,a.n)(e.nav===this,"view is not part of the nav"),n.splice(i,1),n.splice(t,0,e)):((0,a.n)(!e.nav,"nav is used"),e.nav=this,n.splice(t,0,e))},e.prototype.removeView=function(e){(0,a.n)(2===e.state||3===e.state,"view state should be loaded or destroyed");var t=this.views,n=t.indexOf(e);(0,a.n)(n>-1,"view must be part of the stack"),n>=0&&t.splice(n,1)},e.prototype.destroyView=function(e){e._destroy(),this.removeView(e)},e.prototype.unmountInactiveViews=function(e){if(!this.destroyed)for(var t=this.views,n=t.indexOf(e),i=t.length-1;i>=0;i--){var r=t[i],o=r.element;o&&(i>n?((0,u.l)(o,u.d),this.destroyView(r)):i<n&&(0,u.s)(o,!0))}},e.prototype.canStart=function(){return!!this.swipeGesture&&!this.isTransitioning&&0===this.transInstr.length&&this.animationEnabled&&this.canGoBackSync()},e.prototype.onStart=function(){this.pop({direction:"back",progressAnimation:!0})},e.prototype.onMove=function(e){this.sbAni&&this.sbAni.progressStep(e)},e.prototype.onEnd=function(e,t,n){var i=this;if(this.sbAni){this.animationEnabled=!1,this.sbAni.onFinish((function(){i.animationEnabled=!0}),{oneTimeCallback:!0});var r=e?-.001:.001;e?r+=(0,s.g)([0,0],[.32,.72],[0,1],[1,1],t)[0]:(this.sbAni.easing("cubic-bezier(1, 0, 0.68, 0.28)"),r+=(0,s.g)([0,0],[1,0],[.68,.28],[1,1],t)[0]),this.sbAni.progressEnd(e?1:0,r,n)}},e.prototype.render=function(){return(0,r.h)("slot",null)},Object.defineProperty(e.prototype,"el",{get:function(){return(0,r.i)(this)},enumerable:!1,configurable:!0}),Object.defineProperty(e,"watchers",{get:function(){return{swipeGesture:["swipeGestureChanged"],root:["rootChanged"]}},enumerable:!1,configurable:!0}),e}();v.style=":host{left:0;right:0;top:0;bottom:0;position:absolute;contain:layout size style;overflow:hidden;z-index:0}";var p=function(){function e(e){var t=this;(0,r.r)(this,e),this.routerDirection="forward",this.onClick=function(){return function(e,t,n,i,r){var o=e.closest("ion-nav");if(o)if("forward"===t){if(void 0!==n)return o.push(n,i,{skipIfBusy:!0,animationBuilder:r})}else if("root"===t){if(void 0!==n)return o.setRoot(n,i,{skipIfBusy:!0,animationBuilder:r})}else if("back"===t)return o.pop({skipIfBusy:!0,animationBuilder:r});return Promise.resolve(!1)}(t.el,t.routerDirection,t.component,t.componentProps,t.routerAnimation)}}return e.prototype.render=function(){return(0,r.h)(r.H,{onClick:this.onClick})},Object.defineProperty(e.prototype,"el",{get:function(){return(0,r.i)(this)},enumerable:!1,configurable:!0}),e}()}}]);