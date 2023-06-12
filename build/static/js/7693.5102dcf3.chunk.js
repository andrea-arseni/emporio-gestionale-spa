/*! For license information please see 7693.5102dcf3.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkemporiocasegestionale=self.webpackChunkemporiocasegestionale||[]).push([[7693,2557],{7693:function(n,t,r){r.r(t),r.d(t,{A:function(){return wn},B:function(){return Tn},C:function(){return d},D:function(){return On},E:function(){return v},F:function(){return hn},G:function(){return Q},H:function(){return ln},I:function(){return sn},J:function(){return f},K:function(){return L},L:function(){return K},M:function(){return fn},N:function(){return z},O:function(){return P},P:function(){return w},Q:function(){return T},R:function(){return W},S:function(){return nn},T:function(){return V},a:function(){return X},b:function(){return i},c:function(){return u},d:function(){return E},e:function(){return G},f:function(){return s},g:function(){return B},h:function(){return k},i:function(){return a},j:function(){return M},k:function(){return F},l:function(){return C},m:function(){return A},n:function(){return x},o:function(){return g},p:function(){return D},q:function(){return p},r:function(){return l},s:function(){return I},t:function(){return mn},u:function(){return R},v:function(){return J},w:function(){return c},x:function(){return m},y:function(){return Dn},z:function(){return pn}});var e=r(6797),o=r(2557),u=function(n,t){return n.month===t.month&&n.day===t.day&&n.year===t.year},a=function(n,t){return!!(n.year<t.year||n.year===t.year&&n.month<t.month||n.year===t.year&&n.month===t.month&&null!==n.day&&n.day<t.day)},i=function(n,t){return!!(n.year>t.year||n.year===t.year&&n.month>t.month||n.year===t.year&&n.month===t.month&&null!==n.day&&n.day>t.day)},c=function(n,t,r){for(var e=0,u=Array.isArray(n)?n:[n];e<u.length;e++){var c=u[e];if(void 0!==t&&a(c,t)||void 0!==r&&i(c,r)){(0,o.p)("The value provided to ion-datetime is out of bounds.\n\n"+"Min: ".concat(JSON.stringify(t),"\n")+"Max: ".concat(JSON.stringify(r),"\n")+"Value: ".concat(JSON.stringify(n)));break}}},f=function(n,t){if(void 0!==t)return"h23"===t;var r=new Intl.DateTimeFormat(n,{hour:"numeric"}),e=r.resolvedOptions();if(void 0!==e.hourCycle)return"h23"===e.hourCycle;var o=new Date("5/18/2021 00:00"),u=r.formatToParts(o).find((function(n){return"hour"===n.type}));if(!u)throw new Error("Hour value not found from DateTimeFormat");return"00"===u.value},m=function(n,t){return 4===n||6===n||9===n||11===n?30:2===n?function(n){return n%4===0&&n%100!==0||n%400===0}(t)?29:28:31},d=function(n,t){return void 0===t&&(t={month:"numeric",year:"numeric"}),"month"===new Intl.DateTimeFormat(n,t).formatToParts(new Date)[0].type},v=function(n){return"dayPeriod"===new Intl.DateTimeFormat(n,{hour:"numeric"}).formatToParts(new Date)[0].type},y=/^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/,h=/^((\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/,l=function(n){if(void 0!==n){var t,r=n;return"string"===typeof n&&(r=n.replace(/\[|\]|\s/g,"").split(",")),t=Array.isArray(r)?r.map((function(n){return parseInt(n,10)})).filter(isFinite):[r],t}},s=function(n){return{month:parseInt(n.getAttribute("data-month"),10),day:parseInt(n.getAttribute("data-day"),10),year:parseInt(n.getAttribute("data-year"),10),dayOfWeek:parseInt(n.getAttribute("data-day-of-week"),10)}};function p(n){if(Array.isArray(n))return n.map((function(n){return p(n)}));var t=null;if(null!=n&&""!==n&&((t=h.exec(n))?(t.unshift(void 0,void 0),t[2]=t[3]=void 0):t=y.exec(n)),null!==t){for(var r=1;r<8;r++)t[r]=void 0!==t[r]?parseInt(t[r],10):void 0;var e=0;return t[9]&&t[10]&&(e=60*parseInt(t[10],10),t[11]&&(e+=parseInt(t[11],10)),"-"===t[9]&&(e*=-1)),{year:t[1],month:t[2],day:t[3],hour:t[4],minute:t[5],tzOffset:e,ampm:t[4]<12?"am":"pm"}}}var w=function(n,t,r){return t&&a(n,t)?t:r&&i(n,r)?r:n},T=function(n){return n>=12?"pm":"am"},g=function(n,t){var r=p(n),e=r.month,o=r.day,u=r.year,a=r.hour,i=r.minute,c=null!==u&&void 0!==u?u:t.year,f=null!==e&&void 0!==e?e:12;return{month:f,day:null!==o&&void 0!==o?o:m(f,c),year:c,hour:null!==a&&void 0!==a?a:23,minute:null!==i&&void 0!==i?i:59}},D=function(n,t){var r=p(n),e=r.month,o=r.day,u=r.year,a=r.hour,i=r.minute;return{month:null!==e&&void 0!==e?e:1,day:null!==o&&void 0!==o?o:1,year:null!==u&&void 0!==u?u:t.year,hour:null!==a&&void 0!==a?a:0,minute:null!==i&&void 0!==i?i:0}},O=function(n){return("0"+(void 0!==n?Math.abs(n):"0")).slice(-2)},b=function(n){return("000"+(void 0!==n?Math.abs(n):"0")).slice(-4)};function I(n){if(Array.isArray(n))return n.map((function(n){return I(n)}));var t="";return void 0!==n.year?(t=b(n.year),void 0!==n.month&&(t+="-"+O(n.month),void 0!==n.day&&(t+="-"+O(n.day),void 0!==n.hour&&(t+="T".concat(O(n.hour),":").concat(O(n.minute),":00"),void 0===n.tzOffset?t+="Z":t+=(n.tzOffset>0?"+":"-")+O(Math.floor(Math.abs(n.tzOffset/60)))+":"+O(n.tzOffset%60))))):void 0!==n.hour&&(t=O(n.hour)+":"+O(n.minute)),t}var j=function(n,t){return void 0===t?n:"am"===t?12===n?0:n:12===n?12:n+12},M=function(n){var t=n.dayOfWeek;if(null===t||void 0===t)throw new Error("No day of week provided");return Z(n,t)},k=function(n){var t=n.dayOfWeek;if(null===t||void 0===t)throw new Error("No day of week provided");return U(n,6-t)},C=function(n){return U(n,1)},F=function(n){return Z(n,1)},A=function(n){return Z(n,7)},x=function(n){return U(n,7)},Z=function(n,t){var r=n.month,e=n.day,o=n.year;if(null===e)throw new Error("No day provided");var u={month:r,day:e,year:o};if(u.day=e-t,u.day<1&&(u.month-=1),u.month<1&&(u.month=12,u.year-=1),u.day<1){var a=m(u.month,u.year);u.day=a+u.day}return u},U=function(n,t){var r=n.month,e=n.day,o=n.year;if(null===e)throw new Error("No day provided");var u={month:r,day:e,year:o},a=m(r,o);return u.day=e+t,u.day>a&&(u.day-=a,u.month+=1),u.month>12&&(u.month=1,u.year+=1),u},E=function(n){var t=1===n.month?12:n.month-1,r=1===n.month?n.year-1:n.year,e=m(t,r);return{month:t,year:r,day:e<n.day?e:n.day}},G=function(n){var t=12===n.month?1:n.month+1,r=12===n.month?n.year+1:n.year,e=m(t,r);return{month:t,year:r,day:e<n.day?e:n.day}},N=function(n,t){var r=n.month,e=n.year+t,o=m(r,e);return{month:r,year:e,day:o<n.day?o:n.day}},P=function(n){return N(n,-1)},z=function(n){return N(n,1)},S=function(n,t,r){return t?n:j(n,r)},W=function(n,t){var r=n.ampm,e=n.hour;return"am"===r&&"pm"===t?e=j(e,"pm"):"pm"===r&&"am"===t&&(e=Math.abs(e-12)),e},J=function(n,t,r){var e=n.month,o=n.day,a=n.year,i=Object.assign({},n),c=m(e,a);return null!==o&&c<o&&(i.day=c),void 0!==t&&u(i,t)&&void 0!==i.hour&&void 0!==t.hour&&(i.hour<t.hour?(i.hour=t.hour,i.minute=t.minute):i.hour===t.hour&&void 0!==i.minute&&void 0!==t.minute&&i.minute<t.minute&&(i.minute=t.minute)),void 0!==r&&u(n,r)&&void 0!==i.hour&&void 0!==r.hour&&(i.hour>r.hour?(i.hour=r.hour,i.minute=r.minute):i.hour===r.hour&&void 0!==i.minute&&void 0!==r.minute&&i.minute>r.minute&&(i.minute=r.minute)),i},R=function(n,t,r,e,o,u){var a=n.hour,i=n.minute,c=n.day,f=n.month,m=n.year,d=Object.assign(Object.assign({},n),{dayOfWeek:void 0});return void 0!==t&&(d.month=H(f,t)),null!==c&&void 0!==r&&(d.day=H(c,r)),void 0!==e&&(d.year=H(m,e)),void 0!==a&&void 0!==o&&(d.hour=H(a,o),d.ampm=T(d.hour)),void 0!==i&&void 0!==u&&(d.minute=H(i,u)),d},H=function(n,t){for(var r=t[0],e=Math.abs(r-n),o=1;o<t.length;o++){var u=t[o],a=Math.abs(u-n);a<e&&(r=u,e=a)}return r},L=function(n,t,r){var e={hour:t.hour,minute:t.minute};return void 0===e.hour||void 0===e.minute?"Invalid Time":new Intl.DateTimeFormat(n,{hour:"numeric",minute:"numeric",timeZone:"UTC",hourCycle:r?"h23":"h12"}).format(new Date(I(Object.assign(Object.assign({year:2023,day:1,month:1},e),{tzOffset:void 0}))))},$=function(n){var t=n.toString();return t.length>1?t:"0".concat(t)},q=function(n,t){return t?$(n):0===n?"12":n.toString()},B=function(n,t,r){if(null===r.day)return null;var e=new Date("".concat(r.month,"/").concat(r.day,"/").concat(r.year," GMT+0000")),o=new Intl.DateTimeFormat(n,{weekday:"long",month:"long",day:"numeric",timeZone:"UTC"}).format(e);return t?"Today, ".concat(o):o},K=function(n,t){var r=new Date("".concat(t.month,"/").concat(t.day,"/").concat(t.year," GMT+0000"));return new Intl.DateTimeFormat(n,{weekday:"short",month:"short",day:"numeric",timeZone:"UTC"}).format(r)},Q=function(n,t){var r=new Date("".concat(t.month,"/").concat(t.day,"/").concat(t.year," GMT+0000"));return new Intl.DateTimeFormat(n,{month:"long",year:"numeric",timeZone:"UTC"}).format(r)},V=function(n,t){return nn(n,t,{month:"short",day:"numeric",year:"numeric"})},X=function(n,t){return tn(n,t,{day:"numeric"}).find((function(n){return"day"===n.type})).value},Y=function(n,t){return nn(n,t,{year:"numeric"})},_=function(n){var t=void 0!==n.hour&&void 0!==n.minute?" ".concat(n.hour,":").concat(n.minute):"";return new Date("".concat(n.month,"/").concat(n.day,"/").concat(n.year).concat(t," GMT+0000"))},nn=function(n,t,r){var e=_(t);return rn(n,r).format(e)},tn=function(n,t,r){var e=_(t);return rn(n,r).formatToParts(e)},rn=function(n,t){return new Intl.DateTimeFormat(n,Object.assign(Object.assign({},t),{timeZone:"UTC"}))},en=function(n){if("RelativeTimeFormat"in Intl){var t=new Intl.RelativeTimeFormat(n,{numeric:"auto"}).format(0,"day");return t.charAt(0).toUpperCase()+t.slice(1)}return"Today"},on=function(n){var t=n.getTimezoneOffset();return n.setMinutes(n.getMinutes()-t),n},un=on(new Date("2022T01:00")),an=on(new Date("2022T13:00")),cn=function(n,t){var r="am"===t?un:an,e=new Intl.DateTimeFormat(n,{hour:"numeric",timeZone:"UTC"}).formatToParts(r).find((function(n){return"dayPeriod"===n.type}));return e?e.value:function(n){return void 0===n?"":n.toUpperCase()}(t)},fn=function(n){return Array.isArray(n)?n.join(","):n},mn=function(){return on(new Date).toISOString()},dn=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59],vn=[0,1,2,3,4,5,6,7,8,9,10,11],yn=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],hn=function(n,t,r){void 0===r&&(r=0);for(var e="ios"===t?"short":"narrow",o=new Intl.DateTimeFormat(n,{weekday:e}),u=new Date("11/01/2020"),a=[],i=r;i<r+7;i++){var c=new Date(u);c.setDate(c.getDate()+i),a.push(o.format(c))}return a},ln=function(n,t,r){for(var o=m(n,t),u=new Date("".concat(n,"/1/").concat(t)).getDay(),a=u>=r?u-(r+1):6-(r-u),i=[],c=1;c<=o;c++)i.push({day:c,dayOfWeek:(a+c)%7});for(c=0;c<=a;c++)i=(0,e.ev)([{day:null,dayOfWeek:null}],i,!0);return i},sn=function(n){return[E(n),{month:n.month,year:n.year,day:n.day},G(n)]},pn=function(n,t,r,e,o,u){void 0===u&&(u={month:"long"});var a=t.year,i=[];if(void 0!==o){var c=o;void 0!==(null===e||void 0===e?void 0:e.month)&&(c=c.filter((function(n){return n<=e.month}))),void 0!==(null===r||void 0===r?void 0:r.month)&&(c=c.filter((function(n){return n>=r.month}))),c.forEach((function(t){var r=new Date("".concat(t,"/1/").concat(a," GMT+0000")),e=new Intl.DateTimeFormat(n,Object.assign(Object.assign({},u),{timeZone:"UTC"})).format(r);i.push({text:e,value:t})}))}else for(var f=e&&e.year===a?e.month:12,m=r&&r.year===a?r.month:1;m<=f;m++){var d=new Date("".concat(m,"/1/").concat(a," GMT+0000")),v=new Intl.DateTimeFormat(n,Object.assign(Object.assign({},u),{timeZone:"UTC"})).format(d);i.push({text:v,value:m})}return i},wn=function(n,t,r,e,o,u){void 0===u&&(u={day:"numeric"});var a=t.month,i=t.year,c=[],f=m(a,i),d=null!==(null===e||void 0===e?void 0:e.day)&&void 0!==(null===e||void 0===e?void 0:e.day)&&e.year===i&&e.month===a?e.day:f,v=null!==(null===r||void 0===r?void 0:r.day)&&void 0!==(null===r||void 0===r?void 0:r.day)&&r.year===i&&r.month===a?r.day:1;if(void 0!==o){var y=o;y=y.filter((function(n){return n>=v&&n<=d})),y.forEach((function(t){var r=new Date("".concat(a,"/").concat(t,"/").concat(i," GMT+0000")),e=new Intl.DateTimeFormat(n,Object.assign(Object.assign({},u),{timeZone:"UTC"})).format(r);c.push({text:e,value:t})}))}else for(var h=v;h<=d;h++){var l=new Date("".concat(a,"/").concat(h,"/").concat(i," GMT+0000")),s=new Intl.DateTimeFormat(n,Object.assign(Object.assign({},u),{timeZone:"UTC"})).format(l);c.push({text:s,value:h})}return c},Tn=function(n,t,r,e,o){var u,a,i=[];if(void 0!==o)i=o,void 0!==(null===e||void 0===e?void 0:e.year)&&(i=i.filter((function(n){return n<=e.year}))),void 0!==(null===r||void 0===r?void 0:r.year)&&(i=i.filter((function(n){return n>=r.year})));else for(var c=t.year,f=null!==(u=null===e||void 0===e?void 0:e.year)&&void 0!==u?u:c,m=null!==(a=null===r||void 0===r?void 0:r.year)&&void 0!==a?a:c-100,d=f;d>=m;d--)i.push(d);return i.map((function(r){return{text:Y(n,{year:r,month:t.month,day:t.day}),value:r}}))},gn=function n(t,r){return t.month===r.month&&t.year===r.year?[t]:(0,e.ev)([t],n(G(t),r),!0)},Dn=function(n,t,r,o,a,i){var c=[],f=[],m=gn(r,o);return i&&(m=m.filter((function(n){var t=n.month;return i.includes(t)}))),m.forEach((function(i){var m={month:i.month,day:null,year:i.year},d=wn(n,m,r,o,a,{month:"short",day:"numeric",weekday:"short"}),v=[],y=[];d.forEach((function(r){var e=u(Object.assign(Object.assign({},m),{day:r.value}),t);y.push({text:e?en(n):r.text,value:"".concat(m.year,"-").concat(m.month,"-").concat(r.value)}),v.push({month:m.month,year:m.year,day:r.value})})),f=(0,e.ev)((0,e.ev)([],f,!0),v,!0),c=(0,e.ev)((0,e.ev)([],c,!0),y,!0)})),{parts:f,items:c}},On=function(n,t,r,e,o,c,m){var d=f(n,r),v=function(n,t,r,e,o,c){void 0===t&&(t="h12");var f="h23"===t,m=f?yn:vn,d=dn,v=!0,y=!0;if(o&&(m=m.filter((function(n){return o.includes(n)}))),c&&(d=d.filter((function(n){return c.includes(n)}))),r)if(u(n,r)){if(void 0!==r.hour&&(m=m.filter((function(t){var e="pm"===n.ampm?(t+12)%24:t;return(f?t:e)>=r.hour})),v=r.hour<13),void 0!==r.minute){var h=!1;void 0!==r.hour&&void 0!==n.hour&&n.hour>r.hour&&(h=!0),d=d.filter((function(n){return!!h||n>=r.minute}))}}else a(n,r)&&(m=[],d=[],v=y=!1);return e&&(u(n,e)?(void 0!==e.hour&&(m=m.filter((function(t){var r="pm"===n.ampm?(t+12)%24:t;return(f?t:r)<=e.hour})),y=e.hour>=12),void 0!==e.minute&&n.hour===e.hour&&(d=d.filter((function(n){return n<=e.minute})))):i(n,e)&&(m=[],d=[],v=y=!1)),{hours:m,minutes:d,am:v,pm:y}}(t,d?"h23":"h12",e,o,c,m),y=v.hours,h=v.minutes,l=v.am,s=v.pm,p=y.map((function(n){return{text:q(n,d),value:S(n,d,t.ampm)}})),w=h.map((function(n){return{text:$(n),value:n}})),T=[];return l&&!d&&T.push({text:cn(n,"am"),value:"am"}),s&&!d&&T.push({text:cn(n,"pm"),value:"pm"}),{minutesData:w,hoursData:p,dayPeriodData:T}}},2557:function(n,t,r){r.r(t),r.d(t,{a:function(){return a},b:function(){return u},p:function(){return o}});var e=r(6797),o=function(n){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];return console.warn.apply(console,(0,e.ev)(["[Ionic Warning]: ".concat(n)],t,!1))},u=function(n){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];return console.error.apply(console,(0,e.ev)(["[Ionic Error]: ".concat(n)],t,!1))},a=function(n){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];return console.error("<".concat(n.tagName.toLowerCase(),"> must be used inside ").concat(t.join(" or "),"."))}}}]);