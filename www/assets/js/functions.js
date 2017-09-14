!function(a,b,c,d){"use strict";function k(a,b,c){return setTimeout(s(a,c),b)}function l(a,b,c){return!!Array.isArray(a)&&(m(a,c[b],c),!0)}function m(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function n(b,c,d){var e="DEPRECATED METHOD: "+c+"\n"+d+" AT \n";return function(){var c=new Error("get-stack-trace"),d=c&&c.stack?c.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",f=a.console&&(a.console.warn||a.console.log);return f&&f.call(a.console,e,d),b.apply(this,arguments)}}function r(a,b,c){var e,d=b.prototype;e=a.prototype=Object.create(d),e.constructor=a,e._super=d,c&&o(e,c)}function s(a,b){return function(){return a.apply(b,arguments)}}function t(a,b){return typeof a==g?a.apply(b?b[0]||d:d,b):a}function u(a,b){return a===d?b:a}function v(a,b,c){m(z(b),function(b){a.addEventListener(b,c,!1)})}function w(a,b,c){m(z(b),function(b){a.removeEventListener(b,c,!1)})}function x(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function y(a,b){return a.indexOf(b)>-1}function z(a){return a.trim().split(/\s+/g)}function A(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function B(a){return Array.prototype.slice.call(a,0)}function C(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];A(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(c,d){return c[b]>d[b]}):d.sort()),d}function D(a,b){for(var c,f,g=b[0].toUpperCase()+b.slice(1),h=0;h<e.length;){if(c=e[h],f=c?c+g:b,f in a)return f;h++}return d}function F(){return E++}function G(b){var c=b.ownerDocument||b;return c.defaultView||c.parentWindow||a}function ca(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){t(a.options.enable,[a])&&c.handler(b)},this.init()}function da(a){var b,c=a.options.inputClass;return new(b=c?c:J?ya:K?Ga:I?Ka:ta)(a,ea)}function ea(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&Q&&d-e===0,g=b&(S|T)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,fa(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function fa(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=ia(b)),e>1&&!c.firstMultiple?c.firstMultiple=ia(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,k=b.center=ja(d);b.timeStamp=j(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=na(h,k),b.distance=ma(h,k),ga(c,b),b.offsetDirection=la(b.deltaX,b.deltaY);var l=ka(b.deltaTime,b.deltaX,b.deltaY);b.overallVelocityX=l.x,b.overallVelocityY=l.y,b.overallVelocity=i(l.x)>i(l.y)?l.x:l.y,b.scale=g?pa(g.pointers,d):1,b.rotation=g?oa(g.pointers,d):0,b.maxPointers=c.prevInput?b.pointers.length>c.prevInput.maxPointers?b.pointers.length:c.prevInput.maxPointers:b.pointers.length,ha(c,b);var m=a.element;x(b.srcEvent.target,m)&&(m=b.srcEvent.target),b.target=m}function ga(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};b.eventType!==Q&&f.eventType!==S||(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function ha(a,b){var f,g,h,j,c=a.lastInterval||b,e=b.timeStamp-c.timeStamp;if(b.eventType!=T&&(e>P||c.velocity===d)){var k=b.deltaX-c.deltaX,l=b.deltaY-c.deltaY,m=ka(e,k,l);g=m.x,h=m.y,f=i(m.x)>i(m.y)?m.x:m.y,j=la(k,l),a.lastInterval=b}else f=c.velocity,g=c.velocityX,h=c.velocityY,j=c.direction;b.velocity=f,b.velocityX=g,b.velocityY=h,b.direction=j}function ia(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:h(a.pointers[c].clientX),clientY:h(a.pointers[c].clientY)},c++;return{timeStamp:j(),pointers:b,center:ja(b),deltaX:a.deltaX,deltaY:a.deltaY}}function ja(a){var b=a.length;if(1===b)return{x:h(a[0].clientX),y:h(a[0].clientY)};for(var c=0,d=0,e=0;e<b;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:h(c/b),y:h(d/b)}}function ka(a,b,c){return{x:b/a||0,y:c/a||0}}function la(a,b){return a===b?U:i(a)>=i(b)?a<0?V:W:b<0?X:Y}function ma(a,b,c){c||(c=aa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function na(a,b,c){c||(c=aa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function oa(a,b){return na(b[1],b[0],ba)+na(a[1],a[0],ba)}function pa(a,b){return ma(b[0],b[1],ba)/ma(a[0],a[1],ba)}function ta(){this.evEl=ra,this.evWin=sa,this.pressed=!1,ca.apply(this,arguments)}function ya(){this.evEl=wa,this.evWin=xa,ca.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function Ca(){this.evTarget=Aa,this.evWin=Ba,this.started=!1,ca.apply(this,arguments)}function Da(a,b){var c=B(a.touches),d=B(a.changedTouches);return b&(S|T)&&(c=C(c.concat(d),"identifier",!0)),[c,d]}function Ga(){this.evTarget=Fa,this.targetIds={},ca.apply(this,arguments)}function Ha(a,b){var c=B(a.touches),d=this.targetIds;if(b&(Q|R)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=B(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return x(a.target,i)}),b===Q)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(S|T)&&delete d[g[e].identifier],e++;return h.length?[C(f.concat(h),"identifier",!0),h]:void 0}function Ka(){ca.apply(this,arguments);var a=s(this.handler,this);this.touch=new Ga(this.manager,a),this.mouse=new ta(this.manager,a),this.primaryTouch=null,this.lastTouches=[]}function La(a,b){a&Q?(this.primaryTouch=b.changedPointers[0].identifier,Ma.call(this,b)):a&(S|T)&&Ma.call(this,b)}function Ma(a){var b=a.changedPointers[0];if(b.identifier===this.primaryTouch){var c={x:b.clientX,y:b.clientY};this.lastTouches.push(c);var d=this.lastTouches,e=function(){var a=d.indexOf(c);a>-1&&d.splice(a,1)};setTimeout(e,Ia)}}function Na(a){for(var b=a.srcEvent.clientX,c=a.srcEvent.clientY,d=0;d<this.lastTouches.length;d++){var e=this.lastTouches[d],f=Math.abs(b-e.x),g=Math.abs(c-e.y);if(f<=Ja&&g<=Ja)return!0}return!1}function Xa(a,b){this.manager=a,this.set(b)}function Ya(a){if(y(a,Ta))return Ta;var b=y(a,Ua),c=y(a,Va);return b&&c?Ta:b||c?b?Ua:Va:y(a,Sa)?Sa:Ra}function Za(){if(!Pa)return!1;var b={},c=a.CSS&&a.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(d){b[d]=!c||a.CSS.supports("touch-action",d)}),b}function fb(a){this.options=o({},this.defaults,a||{}),this.id=F(),this.manager=null,this.options.enable=u(this.options.enable,!0),this.state=$a,this.simultaneous={},this.requireFail=[]}function gb(a){return a&db?"cancel":a&bb?"end":a&ab?"move":a&_a?"start":""}function hb(a){return a==Y?"down":a==X?"up":a==V?"left":a==W?"right":""}function ib(a,b){var c=b.manager;return c?c.get(a):a}function jb(){fb.apply(this,arguments)}function kb(){jb.apply(this,arguments),this.pX=null,this.pY=null}function lb(){jb.apply(this,arguments)}function mb(){fb.apply(this,arguments),this._timer=null,this._input=null}function nb(){jb.apply(this,arguments)}function ob(){jb.apply(this,arguments)}function pb(){fb.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function qb(a,b){return b=b||{},b.recognizers=u(b.recognizers,qb.defaults.preset),new tb(a,b)}function tb(a,b){this.options=o({},qb.defaults,b||{}),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=a,this.input=da(this),this.touchAction=new Xa(this,this.options.touchAction),ub(this,!0),m(this.options.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function ub(a,b){var c=a.element;if(c.style){var d;m(a.options.cssProps,function(e,f){d=D(c.style,f),b?(a.oldCssProps[d]=c.style[d],c.style[d]=e):c.style[d]=a.oldCssProps[d]||""}),b||(a.oldCssProps={})}}function vb(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var o,e=["","webkit","Moz","MS","ms","o"],f=b.createElement("div"),g="function",h=Math.round,i=Math.abs,j=Date.now;o="function"!=typeof Object.assign?function(b){if(b===d||null===b)throw new TypeError("Cannot convert undefined or null to object");for(var c=Object(b),e=1;e<arguments.length;e++){var f=arguments[e];if(f!==d&&null!==f)for(var g in f)f.hasOwnProperty(g)&&(c[g]=f[g])}return c}:Object.assign;var p=n(function(b,c,e){for(var f=Object.keys(c),g=0;g<f.length;)(!e||e&&b[f[g]]===d)&&(b[f[g]]=c[f[g]]),g++;return b},"extend","Use `assign`."),q=n(function(b,c){return p(b,c,!0)},"merge","Use `assign`."),E=1,H=/mobile|tablet|ip(ad|hone|od)|android/i,I="ontouchstart"in a,J=D(a,"PointerEvent")!==d,K=I&&H.test(navigator.userAgent),L="touch",M="pen",N="mouse",O="kinect",P=25,Q=1,R=2,S=4,T=8,U=1,V=2,W=4,X=8,Y=16,Z=V|W,$=X|Y,_=Z|$,aa=["x","y"],ba=["clientX","clientY"];ca.prototype={handler:function(){},init:function(){this.evEl&&v(this.element,this.evEl,this.domHandler),this.evTarget&&v(this.target,this.evTarget,this.domHandler),this.evWin&&v(G(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&w(this.element,this.evEl,this.domHandler),this.evTarget&&w(this.target,this.evTarget,this.domHandler),this.evWin&&w(G(this.element),this.evWin,this.domHandler)}};var qa={mousedown:Q,mousemove:R,mouseup:S},ra="mousedown",sa="mousemove mouseup";r(ta,ca,{handler:function(b){var c=qa[b.type];c&Q&&0===b.button&&(this.pressed=!0),c&R&&1!==b.which&&(c=S),this.pressed&&(c&S&&(this.pressed=!1),this.callback(this.manager,c,{pointers:[b],changedPointers:[b],pointerType:N,srcEvent:b}))}});var ua={pointerdown:Q,pointermove:R,pointerup:S,pointercancel:T,pointerout:T},va={2:L,3:M,4:N,5:O},wa="pointerdown",xa="pointermove pointerup pointercancel";a.MSPointerEvent&&!a.PointerEvent&&(wa="MSPointerDown",xa="MSPointerMove MSPointerUp MSPointerCancel"),r(ya,ca,{handler:function(b){var c=this.store,d=!1,e=b.type.toLowerCase().replace("ms",""),f=ua[e],g=va[b.pointerType]||b.pointerType,h=g==L,i=A(c,b.pointerId,"pointerId");f&Q&&(0===b.button||h)?i<0&&(c.push(b),i=c.length-1):f&(S|T)&&(d=!0),i<0||(c[i]=b,this.callback(this.manager,f,{pointers:c,changedPointers:[b],pointerType:g,srcEvent:b}),d&&c.splice(i,1))}});var za={touchstart:Q,touchmove:R,touchend:S,touchcancel:T},Aa="touchstart",Ba="touchstart touchmove touchend touchcancel";r(Ca,ca,{handler:function(b){var c=za[b.type];if(c===Q&&(this.started=!0),this.started){var d=Da.call(this,b,c);c&(S|T)&&d[0].length-d[1].length===0&&(this.started=!1),this.callback(this.manager,c,{pointers:d[0],changedPointers:d[1],pointerType:L,srcEvent:b})}}});var Ea={touchstart:Q,touchmove:R,touchend:S,touchcancel:T},Fa="touchstart touchmove touchend touchcancel";r(Ga,ca,{handler:function(b){var c=Ea[b.type],d=Ha.call(this,b,c);d&&this.callback(this.manager,c,{pointers:d[0],changedPointers:d[1],pointerType:L,srcEvent:b})}});var Ia=2500,Ja=25;r(Ka,ca,{handler:function(b,c,d){var e=d.pointerType==L,f=d.pointerType==N;if(!(f&&d.sourceCapabilities&&d.sourceCapabilities.firesTouchEvents)){if(e)La.call(this,c,d);else if(f&&Na.call(this,d))return;this.callback(b,c,d)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Oa=D(f.style,"touchAction"),Pa=Oa!==d,Qa="compute",Ra="auto",Sa="manipulation",Ta="none",Ua="pan-x",Va="pan-y",Wa=Za();Xa.prototype={set:function(a){a==Qa&&(a=this.compute()),Pa&&this.manager.element.style&&Wa[a]&&(this.manager.element.style[Oa]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return m(this.manager.recognizers,function(b){t(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),Ya(a.join(" "))},preventDefaults:function(a){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=y(d,Ta)&&!Wa[Ta],f=y(d,Va)&&!Wa[Va],g=y(d,Ua)&&!Wa[Ua];if(e){var h=1===a.pointers.length,i=a.distance<2,j=a.deltaTime<250;if(h&&i&&j)return}return g&&f?void 0:e||f&&c&Z||g&&c&$?this.preventSrc(b):void 0},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var $a=1,_a=2,ab=4,bb=8,cb=bb,db=16,eb=32;fb.prototype={defaults:{},set:function(a){return o(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(l(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=ib(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return l(a,"dropRecognizeWith",this)?this:(a=ib(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(l(a,"requireFailure",this))return this;var b=this.requireFail;return a=ib(a,this),A(b,a)===-1&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(l(a,"dropRequireFailure",this))return this;a=ib(a,this);var b=A(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function d(c){b.manager.emit(c,a)}var b=this,c=this.state;c<bb&&d(b.options.event+gb(c)),d(b.options.event),a.additionalEvent&&d(a.additionalEvent),c>=bb&&d(b.options.event+gb(c))},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=eb)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(eb|$a)))return!1;a++}return!0},recognize:function(a){var b=o({},a);return t(this.options.enable,[this,b])?(this.state&(cb|db|eb)&&(this.state=$a),this.state=this.process(b),void(this.state&(_a|ab|bb|db)&&this.tryEmit(b))):(this.reset(),void(this.state=eb))},process:function(a){},getTouchAction:function(){},reset:function(){}},r(jb,fb,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(_a|ab),e=this.attrTest(a);return d&&(c&T||!e)?b|db:d||e?c&S?b|bb:b&_a?b|ab:_a:eb}}),r(kb,jb,{defaults:{event:"pan",threshold:10,pointers:1,direction:_},getTouchAction:function(){var a=this.options.direction,b=[];return a&Z&&b.push(Va),a&$&&b.push(Ua),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Z?(e=0===f?U:f<0?V:W,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?U:g<0?X:Y,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return jb.prototype.attrTest.call(this,a)&&(this.state&_a||!(this.state&_a)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=hb(a.direction);b&&(a.additionalEvent=this.options.event+b),this._super.emit.call(this,a)}}),r(lb,jb,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[Ta]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&_a)},emit:function(a){if(1!==a.scale){var b=a.scale<1?"in":"out";a.additionalEvent=this.options.event+b}this._super.emit.call(this,a)}}),r(mb,fb,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[Ra]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,e=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(S|T)&&!e)this.reset();else if(a.eventType&Q)this.reset(),this._timer=k(function(){this.state=cb,this.tryEmit()},b.time,this);else if(a.eventType&S)return cb;return eb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===cb&&(a&&a.eventType&S?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=j(),this.manager.emit(this.options.event,this._input)))}}),r(nb,jb,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[Ta]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&_a)}}),r(ob,jb,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Z|$,pointers:1},getTouchAction:function(){return kb.prototype.getTouchAction.call(this)},attrTest:function(a){var c,b=this.options.direction;return b&(Z|$)?c=a.overallVelocity:b&Z?c=a.overallVelocityX:b&$&&(c=a.overallVelocityY),this._super.attrTest.call(this,a)&&b&a.offsetDirection&&a.distance>this.options.threshold&&a.maxPointers==this.options.pointers&&i(c)>this.options.velocity&&a.eventType&S},emit:function(a){var b=hb(a.offsetDirection);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),r(pb,fb,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[Sa]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,e=a.deltaTime<b.time;if(this.reset(),a.eventType&Q&&0===this.count)return this.failTimeout();if(d&&e&&c){if(a.eventType!=S)return this.failTimeout();var f=!this.pTime||a.timeStamp-this.pTime<b.interval,g=!this.pCenter||ma(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,g&&f?this.count+=1:this.count=1,this._input=a;var h=this.count%b.taps;if(0===h)return this.hasRequireFailures()?(this._timer=k(function(){this.state=cb,this.tryEmit()},b.interval,this),_a):cb}return eb},failTimeout:function(){return this._timer=k(function(){this.state=eb},this.options.interval,this),eb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==cb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),qb.VERSION="2.0.8",qb.defaults={domEvents:!1,touchAction:Qa,enable:!0,inputTarget:null,inputClass:null,preset:[[nb,{enable:!1}],[lb,{enable:!1},["rotate"]],[ob,{direction:Z}],[kb,{direction:Z},["swipe"]],[pb],[pb,{event:"doubletap",taps:2},["tap"]],[mb]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var rb=1,sb=2;tb.prototype={set:function(a){return o(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?sb:rb},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&cb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===sb||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(_a|ab|bb)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof fb)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(l(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(l(a,"remove",this))return this;if(a=this.get(a)){var b=this.recognizers,c=A(b,a);c!==-1&&(b.splice(c,1),this.touchAction.update())}return this},on:function(a,b){if(a!==d&&b!==d){var c=this.handlers;return m(z(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this}},off:function(a,b){if(a!==d){var c=this.handlers;return m(z(a),function(a){b?c[a]&&c[a].splice(A(c[a],b),1):delete c[a]}),this}},emit:function(a,b){this.options.domEvents&&vb(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&ub(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},o(qb,{INPUT_START:Q,INPUT_MOVE:R,INPUT_END:S,INPUT_CANCEL:T,STATE_POSSIBLE:$a,STATE_BEGAN:_a,STATE_CHANGED:ab,STATE_ENDED:bb,STATE_RECOGNIZED:cb,STATE_CANCELLED:db,STATE_FAILED:eb,DIRECTION_NONE:U,DIRECTION_LEFT:V,DIRECTION_RIGHT:W,DIRECTION_UP:X,DIRECTION_DOWN:Y,DIRECTION_HORIZONTAL:Z,DIRECTION_VERTICAL:$,DIRECTION_ALL:_,Manager:tb,Input:ca,TouchAction:Xa,TouchInput:Ga,MouseInput:ta,PointerEventInput:ya,TouchMouseInput:Ka,SingleTouchInput:Ca,Recognizer:fb,AttrRecognizer:jb,Tap:pb,Pan:kb,Swipe:ob,Pinch:lb,Rotate:nb,Press:mb,on:v,off:w,each:m,merge:q,extend:p,assign:o,inherit:r,bindFn:s,prefixed:D});var wb="undefined"!=typeof a?a:"undefined"!=typeof self?self:{};wb.Hammer=qb,"function"==typeof define&&define.amd?define(function(){return qb}):"undefined"!=typeof module&&module.exports?module.exports=qb:a[c]=qb}(window,document,"Hammer");


$( document ).ready(function() {

  // DOMMouseScroll included for firefox support
  var canScroll = true,
      scrollController = null;
  $(this).on('mousewheel DOMMouseScroll', function(e){

    if (!($('.outer-nav').hasClass('is-vis'))) {

      e.preventDefault();

      var delta = (e.originalEvent.wheelDelta) ? -e.originalEvent.wheelDelta : e.originalEvent.detail * 20;

	  if($(".section--is-active").find(".intro").size() > 0) {
		canScroll = false;
	  } 
	  else {
		canScroll = true;
	  }

      if (delta > 50 && canScroll) {
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function(){
          canScroll = true;
        }, 800);
        updateHelper(1);
      }
      else if (delta < -50 && canScroll) {
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function(){
          canScroll = true;
        }, 800);
        updateHelper(-1);
      }

    }

  });

  $('.side-nav li, .outer-nav li').click(function(){

    if (!($(this).hasClass('is-active'))) {

      var $this = $(this),
          curActive = $this.parent().find('.is-active'),
          curPos = $this.parent().children().index(curActive),
          nextPos = $this.parent().children().index($this),
          lastItem = $(this).parent().children().length - 1;

	  if(curPos !== 0) {
	      updateNavs(nextPos);
    	  updateContent(curPos, nextPos, lastItem);
	  }
	  else {
		  alert('Faça o login para acessar as funcionalidades.')
	  }

    }

  });

  $('.cta').click(function(){

    var curActive = $('.side-nav').find('.is-active'),
        curPos = $('.side-nav').children().index(curActive),
        lastItem = $('.side-nav').children().length - 1,
        nextPos = curPos + 1;

    var d = new Date();
	var cookieName = 'sessionlogin';
	var cookieValue = $("#user-login").val() + '-' + $("#user-pass").val();

	var expirationDays = 2;
    d.setTime(d.getTime() + (expirationDays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";

	var successLogin = function(offline = false) {
		alert('offline: ' + offline);
		loadCustomerFromBackup(db, offline);
		loadScheduledTimeFromBackup(db, offline);
		loadBlockedTimeFromBackup(db, offline);

		updateNavs(nextPos);
		updateContent(curPos, nextPos, lastItem);
		$("#user-pass").val("");
	}

	//TODO fazer validacao backend
	if(cookieValue === 'f-' || cookieValue === 'rodrigo-admin123') {
		$( "#dialog-offline" ).dialog({
		  resizable: true,
		  height: "auto",
		  width: "auto",
		  modal: true,
		  buttons: {
			"Baixar versão online": function() {
			  successLogin(false);
			  $( this ).dialog( "close" );
			},
			"Trabalhar offline": function() {
			  successLogin(true);
			  $( this ).dialog( "close" );
			}
		  }
		});
		
	} else {
		alert('Ops! Login incorreto.');
	}

  });

  // swipe support for touch devices
  var targetElement = document.getElementById('viewport'),
      mc = new Hammer(targetElement);
  mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
  mc.on('swipeup swipedown', function(e) {

    updateHelper(e);

  });

  $(document).keyup(function(e){

    if (!($('.outer-nav').hasClass('is-vis'))) {
      e.preventDefault();
      updateHelper(e);
    }

  });

  // determine scroll, swipe, and arrow key direction
  function updateHelper(param) {

    var curActive = $('.side-nav').find('.is-active'),
        curPos = $('.side-nav').children().index(curActive),
        lastItem = $('.side-nav').children().length - 1,
        nextPos = 0;

    if (param.type === "swipeup" || param.keyCode === 40 || param > 0) {
      if (curPos !== lastItem && curPos !== 0) {
        nextPos = curPos + 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
      else {
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    }
    else if (param.type === "swipedown" || param.keyCode === 38 || param < 0){
      if (curPos !== 0){
        nextPos = curPos - 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
      else {
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    }

  }

  // sync side and outer navigations
  function updateNavs(nextPos) {

    $('.side-nav, .outer-nav').children().removeClass('is-active');
    $('.side-nav').children().eq(nextPos).addClass('is-active');
    $('.outer-nav').children().eq(nextPos).addClass('is-active');

  }

  // update main content area
  function updateContent(curPos, nextPos, lastItem) {

    $('.main-content').children().removeClass('section--is-active');
    $('.main-content').children().eq(nextPos).addClass('section--is-active');
    $('.main-content .section').children().removeClass('section--next section--prev');

    if (curPos === lastItem && nextPos === 0 || curPos === 0 && nextPos === lastItem) {
      $('.main-content .section').children().removeClass('section--next section--prev');
    }
    else if (curPos < nextPos) {
      $('.main-content').children().eq(curPos).children().addClass('section--next');
    }
    else {
      $('.main-content').children().eq(curPos).children().addClass('section--prev');
    }

    if (nextPos !== 0 && nextPos !== lastItem) {
      $('.header--cta').addClass('is-active');
    }
    else {
      $('.header--cta').removeClass('is-active');
    }

  }

  function outerNav() {

    $('.header--nav-toggle').click(function(){

      $('.perspective').addClass('perspective--modalview');
      setTimeout(function(){
        $('.perspective').addClass('effect-rotate-left--animate');
      }, 25);
      $('.outer-nav, .outer-nav li, .outer-nav--return').addClass('is-vis');

    });

    $('.outer-nav--return, .outer-nav li').click(function(){

      $('.perspective').removeClass('effect-rotate-left--animate');
      setTimeout(function(){
        $('.perspective').removeClass('perspective--modalview');
      }, 400);
      $('.outer-nav, .outer-nav li, .outer-nav--return').removeClass('is-vis');

    });

  }

  function transitionLabels() {

    $('.work-request--information input').focusout(function(){

      var textVal = $(this).val();

      if (textVal === "") {
        $(this).removeClass('has-value');
      }
      else {
        $(this).addClass('has-value');
      }

      // correct mobile device window position
      window.scrollTo(0, 0);

    });

  }

  outerNav();
  transitionLabels();

});
