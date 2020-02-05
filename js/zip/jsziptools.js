/*!
 * jsziptools.js 2.4.1 - MIT License. https://github.com/ukyo/jsziptools/blob/master/LICENSE
 * ES6-Promises - MIT License. https://github.com/jakearchibald/es6-promise/blob/master/LICENSE
 */
function _gerrinf(s){
	if(window._gerr){
		_gerr(s);
	}else{
		console.log(s);
	}
}
var maxunzipcount=500;

;(function(){(function() {
var define, requireModule, require, requirejs;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requirejs = require = requireModule = function(name) {
  requirejs._eak_seen = registry;

    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    if (!registry[name]) {
      throw new Error("Could not find module " + name);
    }

    var mod = registry[name],
        deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(resolve(deps[i])));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;

    function resolve(child) {
      if (child.charAt(0) !== '.') { return child; }
      var parts = child.split("/");
      var parentBase = name.split("/").slice(0, -1);

      for (var i=0, l=parts.length; i<l; i++) {
        var part = parts[i];

        if (part === '..') { parentBase.pop(); }
        else if (part === '.') { continue; }
        else { parentBase.push(part); }
      }

      return parentBase.join("/");
    }
  };
})();

define("promise/all", 
  ["./utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global toString */

    var isArray = __dependency1__.isArray;
    var isFunction = __dependency1__.isFunction;

    /**
      Returns a promise that is fulfilled when all the given promises have been
      fulfilled, or rejected if any of them become rejected. The return promise
      is fulfilled with an array that gives all the values in the order they were
      passed in the `promises` array argument.

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.resolve(2);
      var promise3 = RSVP.resolve(3);
      var promises = [ promise1, promise2, promise3 ];

      RSVP.all(promises).then(function(array){
        // The array here would be [ 1, 2, 3 ];
      });
      ```

      If any of the `promises` given to `RSVP.all` are rejected, the first promise
      that is rejected will be given as an argument to the returned promises's
      rejection handler. For example:

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.reject(new Error("2"));
      var promise3 = RSVP.reject(new Error("3"));
      var promises = [ promise1, promise2, promise3 ];

      RSVP.all(promises).then(function(array){
        // Code here never runs because there are rejected promises!
      }, function(error) {
        // error.message === "2"
      });
      ```

      @method all
      @for RSVP
      @param {Array} promises
      @param {String} label
      @return {Promise} promise that is fulfilled when all `promises` have been
      fulfilled, or rejected if any of them become rejected.
    */
    function all(promises) {
      /*jshint validthis:true */
      var Promise = this;

      if (!isArray(promises)) {
        throw new TypeError('You must pass an array to all.');
      }

      return new Promise(function(resolve, reject) {
        var results = [], remaining = promises.length,
        promise;

        if (remaining === 0) {
          resolve([]);
        }

        function resolver(index) {
          return function(value) {
            resolveAll(index, value);
          };
        }

        function resolveAll(index, value) {
          results[index] = value;
          if (--remaining === 0) {
            resolve(results);
          }
        }

        for (var i = 0; i < promises.length; i++) {
          promise = promises[i];

          if (promise && isFunction(promise.then)) {
            promise.then(resolver(i), reject);
          } else {
            resolveAll(i, promise);
          }
        }
      });
    }

    __exports__.all = all;
  });
define("promise/asap", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var browserGlobal = (typeof window !== 'undefined') ? window : {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var local = (typeof global !== 'undefined') ? global : (this === undefined? window:this);

    // node
    function useNextTick() {
      return function() {
        process.nextTick(flush);
      };
    }

    function useMutationObserver() {
      var iterations = 0;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    function useSetTimeout() {
      return function() {
        local.setTimeout(flush, 1);
      };
    }

    var queue = [];
    function flush() {
      for (var i = 0; i < queue.length; i++) {
        var tuple = queue[i];
        var callback = tuple[0], arg = tuple[1];
        callback(arg);
      }
      queue = [];
    }

    var scheduleFlush;

    // Decide what async method to use to triggering processing of queued callbacks:
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
      scheduleFlush = useMutationObserver();
    } else {
      scheduleFlush = useSetTimeout();
    }

    function asap(callback, arg) {
      var length = queue.push([callback, arg]);
      if (length === 1) {
        // If length is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        scheduleFlush();
      }
    }

    __exports__.asap = asap;
  });
define("promise/config", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var config = {
      instrument: false
    };

    function configure(name, value) {
      if (arguments.length === 2) {
        config[name] = value;
      } else {
        return config[name];
      }
    }

    __exports__.config = config;
    __exports__.configure = configure;
  });
define("promise/polyfill", 
  ["./promise","./utils","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    /*global self*/
    var RSVPPromise = __dependency1__.Promise;
    var isFunction = __dependency2__.isFunction;

    function polyfill() {
      var local;

      if (typeof global !== 'undefined') {
        local = global;
      } else if (typeof window !== 'undefined' && window.document) {
        local = window;
      } else {
        local = self;
      }

      var es6PromiseSupport = 
        "Promise" in local &&
        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        "resolve" in local.Promise &&
        "reject" in local.Promise &&
        "all" in local.Promise &&
        "race" in local.Promise &&
        // Older version of the spec had a resolver object
        // as the arg rather than a function
        (function() {
          var resolve;
          new local.Promise(function(r) { resolve = r; });
          return isFunction(resolve);
        }());

      if (!es6PromiseSupport) {
        local.Promise = RSVPPromise;
      }
    }

    __exports__.polyfill = polyfill;
  });
define("promise/promise", 
  ["./config","./utils","./all","./race","./resolve","./reject","./asap","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __exports__) {
    "use strict";
    var config = __dependency1__.config;
    var configure = __dependency1__.configure;
    var objectOrFunction = __dependency2__.objectOrFunction;
    var isFunction = __dependency2__.isFunction;
    var now = __dependency2__.now;
    var all = __dependency3__.all;
    var race = __dependency4__.race;
    var staticResolve = __dependency5__.resolve;
    var staticReject = __dependency6__.reject;
    var asap = __dependency7__.asap;

    var counter = 0;

    config.async = asap; // default async is asap;

    function Promise(resolver) {
      if (!isFunction(resolver)) {
        throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
      }

      if (!(this instanceof Promise)) {
        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
      }

      this._subscribers = [];

      invokeResolver(resolver, this);
    }

    function invokeResolver(resolver, promise) {
      function resolvePromise(value) {
        resolve(promise, value);
      }

      function rejectPromise(reason) {
        reject(promise, reason);
      }

      try {
        resolver(resolvePromise, rejectPromise);
      } catch(e) {
        rejectPromise(e);
      }
    }

    function invokeCallback(settled, promise, callback, detail) {
      var hasCallback = isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        try {
          value = callback(detail);
          succeeded = true;
        } catch(e) {
          failed = true;
          error = e;
        }
      } else {
        value = detail;
        succeeded = true;
      }

      if (handleThenable(promise, value)) {
        return;
      } else if (hasCallback && succeeded) {
        resolve(promise, value);
      } else if (failed) {
        reject(promise, error);
      } else if (settled === FULFILLED) {
        resolve(promise, value);
      } else if (settled === REJECTED) {
        reject(promise, value);
      }
    }

    var PENDING   = void 0;
    var SEALED    = 0;
    var FULFILLED = 1;
    var REJECTED  = 2;

    function subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      subscribers[length] = child;
      subscribers[length + FULFILLED] = onFulfillment;
      subscribers[length + REJECTED]  = onRejection;
    }

    function publish(promise, settled) {
      var child, callback, subscribers = promise._subscribers, detail = promise._detail;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        invokeCallback(settled, child, callback, detail);
      }

      promise._subscribers = null;
    }

    Promise.prototype = {
      constructor: Promise,

      _state: undefined,
      _detail: undefined,
      _subscribers: undefined,

      then: function(onFulfillment, onRejection) {
        var promise = this;

        var thenPromise = new this.constructor(function() {});

        if (this._state) {
          var callbacks = arguments;
          config.async(function invokePromiseCallback() {
            invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
          });
        } else {
          subscribe(this, thenPromise, onFulfillment, onRejection);
        }

        return thenPromise;
      },

      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };

    Promise.all = all;
    Promise.race = race;
    Promise.resolve = staticResolve;
    Promise.reject = staticReject;

    function handleThenable(promise, value) {
      var then = null,
      resolved;

      try {
        if (promise === value) {
          throw new TypeError("A promises callback cannot return that same promise.");
        }

        if (objectOrFunction(value)) {
          then = value.then;

          if (isFunction(then)) {
            then.call(value, function(val) {
              if (resolved) { return true; }
              resolved = true;

              if (value !== val) {
                resolve(promise, val);
              } else {
                fulfill(promise, val);
              }
            }, function(val) {
              if (resolved) { return true; }
              resolved = true;

              reject(promise, val);
            });

            return true;
          }
        }
      } catch (error) {
        if (resolved) { return true; }
        reject(promise, error);
        return true;
      }

      return false;
    }

    function resolve(promise, value) {
      if (promise === value) {
        fulfill(promise, value);
      } else if (!handleThenable(promise, value)) {
        fulfill(promise, value);
      }
    }

    function fulfill(promise, value) {
      if (promise._state !== PENDING) { return; }
      promise._state = SEALED;
      promise._detail = value;

      config.async(publishFulfillment, promise);
    }

    function reject(promise, reason) {
      if (promise._state !== PENDING) { return; }
      promise._state = SEALED;
      promise._detail = reason;

      config.async(publishRejection, promise);
    }

    function publishFulfillment(promise) {
      publish(promise, promise._state = FULFILLED);
    }

    function publishRejection(promise) {
      publish(promise, promise._state = REJECTED);
    }

    __exports__.Promise = Promise;
  });
define("promise/race", 
  ["./utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global toString */
    var isArray = __dependency1__.isArray;

    /**
      `RSVP.race` allows you to watch a series of promises and act as soon as the
      first promise given to the `promises` argument fulfills or rejects.

      Example:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 1");
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 2");
        }, 100);
      });

      RSVP.race([promise1, promise2]).then(function(result){
        // result === "promise 2" because it was resolved before promise1
        // was resolved.
      });
      ```

      `RSVP.race` is deterministic in that only the state of the first completed
      promise matters. For example, even if other promises given to the `promises`
      array argument are resolved, but the first completed promise has become
      rejected before the other promises became fulfilled, the returned promise
      will become rejected:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 1");
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          reject(new Error("promise 2"));
        }, 100);
      });

      RSVP.race([promise1, promise2]).then(function(result){
        // Code here never runs because there are rejected promises!
      }, function(reason){
        // reason.message === "promise2" because promise 2 became rejected before
        // promise 1 became fulfilled
      });
      ```

      @method race
      @for RSVP
      @param {Array} promises array of promises to observe
      @param {String} label optional string for describing the promise returned.
      Useful for tooling.
      @return {Promise} a promise that becomes fulfilled with the value the first
      completed promises is resolved with if the first completed promise was
      fulfilled, or rejected with the reason that the first completed promise
      was rejected with.
    */
    function race(promises) {
      /*jshint validthis:true */
      var Promise = this;

      if (!isArray(promises)) {
        throw new TypeError('You must pass an array to race.');
      }
      return new Promise(function(resolve, reject) {
        var results = [], promise;

        for (var i = 0; i < promises.length; i++) {
          promise = promises[i];

          if (promise && typeof promise.then === 'function') {
            promise.then(resolve, reject);
          } else {
            resolve(promise);
          }
        }
      });
    }

    __exports__.race = race;
  });
define("promise/reject", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**
      `RSVP.reject` returns a promise that will become rejected with the passed
      `reason`. `RSVP.reject` is essentially shorthand for the following:

      ```javascript
      var promise = new RSVP.Promise(function(resolve, reject){
        reject(new Error('WHOOPS'));
      });

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      var promise = RSVP.reject(new Error('WHOOPS'));

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      @method reject
      @for RSVP
      @param {Any} reason value that the returned promise will be rejected with.
      @param {String} label optional string for identifying the returned promise.
      Useful for tooling.
      @return {Promise} a promise that will become rejected with the given
      `reason`.
    */
    function reject(reason) {
      /*jshint validthis:true */
      var Promise = this;

      return new Promise(function (resolve, reject) {
        reject(reason);
      });
    }

    __exports__.reject = reject;
  });
define("promise/resolve", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function resolve(value) {
      /*jshint validthis:true */
      if (value && typeof value === 'object' && value.constructor === this) {
        return value;
      }

      var Promise = this;

      return new Promise(function(resolve) {
        resolve(value);
      });
    }

    __exports__.resolve = resolve;
  });
define("promise/utils", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function objectOrFunction(x) {
      return isFunction(x) || (typeof x === "object" && x !== null);
    }

    function isFunction(x) {
      return typeof x === "function";
    }

    function isArray(x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    }

    // Date.now is not available in browsers < IE9
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
    var now = Date.now || function() { return new Date().getTime(); };


    __exports__.objectOrFunction = objectOrFunction;
    __exports__.isFunction = isFunction;
    __exports__.isArray = isArray;
    __exports__.now = now;
  });
requireModule('promise/polyfill').polyfill();
}());
/*! zlib-asm v0.2.0 Released under the zlib license. https://github.com/ukyo/zlib-asm/LICENSE */var zlib={};(function(){
function e(a){throw a;}var h=void 0,j=!0,k=null,l=!1;function m(){return function(){}}var p={TOTAL_MEMORY:8388608},aa={},q;for(q in p)p.hasOwnProperty(q)&&(aa[q]=p[q]);var s="object"===typeof process&&"function"===typeof require,ba="object"===typeof window,ca="function"===typeof importScripts,da=!ba&&!s&&!ca;
if(s){p.print=function(a){process.stdout.write(a+"\n")};p.printErr=function(a){process.stderr.write(a+"\n")};var ea=require("fs"),fa=require("path");p.read=function(a,b){var a=fa.normalize(a),c=ea.readFileSync(a);!c&&a!=fa.resolve(a)&&(a=path.join(__dirname,"..","src",a),c=ea.readFileSync(a));c&&!b&&(c=c.toString());return c};p.readBinary=function(a){return p.read(a,j)};p.load=function(a){ga(read(a))};p.arguments=process.argv.slice(2);module.exports=p}else da?(p.print=print,"undefined"!=typeof printErr&&
(p.printErr=printErr),p.read="undefined"!=typeof read?read:function(){e("no read() available (jsc?)")},p.readBinary=function(a){return read(a,"binary")},"undefined"!=typeof scriptArgs?p.arguments=scriptArgs:"undefined"!=typeof arguments&&(p.arguments=arguments),this.Module=p,eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined")):ba||ca?(p.read=function(a){var b=new XMLHttpRequest;b.open("GET",a,l);b.send(k);return b.responseText},"undefined"!=typeof arguments&&
(p.arguments=arguments),"undefined"!==typeof console?(p.print=function(a){console.log(a)},p.printErr=function(a){console.log(a)}):p.print=m(),ba?this.Module=p:p.load=importScripts):e("Unknown runtime environment. Where are we?");function ga(a){eval.call(k,a)}"undefined"==!p.load&&p.read&&(p.load=function(a){ga(p.read(a))});p.print||(p.print=m());p.printErr||(p.printErr=p.print);p.arguments||(p.arguments=[]);p.print=p.print;p.ea=p.printErr;p.preRun=[];p.postRun=[];
for(q in aa)aa.hasOwnProperty(q)&&(p[q]=aa[q]);function ha(){return v}function ia(a){v=a}function ja(a){switch(a){case "i1":case "i8":return 1;case "i16":return 2;case "i32":return 4;case "i64":return 8;case "float":return 4;case "double":return 8;default:return"*"===a[a.length-1]?la:"i"===a[0]?(a=parseInt(a.substr(1)),w(0===a%8),a/8):0}}function ma(a,b,c){c&&c.length?(c.splice||(c=Array.prototype.slice.call(c)),c.splice(0,0,b),p["dynCall_"+a].apply(k,c)):p["dynCall_"+a].call(k,b)}var na;
function oa(){var a=[],b=0;this.Ca=function(c){c&=255;if(0==a.length){if(0==(c&128))return String.fromCharCode(c);a.push(c);b=192==(c&224)?1:224==(c&240)?2:3;return""}if(b&&(a.push(c),b--,0<b))return"";var c=a[0],d=a[1],f=a[2],g=a[3];2==a.length?c=String.fromCharCode((c&31)<<6|d&63):3==a.length?c=String.fromCharCode((c&15)<<12|(d&63)<<6|f&63):(c=(c&7)<<18|(d&63)<<12|(f&63)<<6|g&63,c=String.fromCharCode(Math.floor((c-65536)/1024)+55296,(c-65536)%1024+56320));a.length=0;return c};this.Jb=function(a){for(var a=
unescape(encodeURIComponent(a)),b=[],f=0;f<a.length;f++)b.push(a.charCodeAt(f));return b}}function pa(a){var b=v;v=v+a|0;v=v+7&-8;return b}function qa(a){var b=x;x=x+a|0;x=x+7&-8;return b}function ra(a){var b=y;y=y+a|0;y=y+7&-8;y>=sa&&B("Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value "+sa+", or (2) set Module.TOTAL_MEMORY before the program runs.");return b}function ta(a,b){return Math.ceil(a/(b?b:8))*(b?b:8)}
var la=4,ua={},va=l,wa,xa;function w(a,b){a||B("Assertion failed: "+b)}p.ccall=function(a,b,c,d){return ya(za(a),b,c,d)};function za(a){try{var b=p["_"+a];b||(b=eval("_"+a))}catch(c){}w(b,"Cannot call unknown function "+a+" (perhaps LLVM optimizations or closure removed it?)");return b}
function ya(a,b,c,d){function f(a,b){if("string"==b){if(a===k||a===h||0===a)return 0;a=C(a);b="array"}if("array"==b){g||(g=ha());var c=pa(a.length);Aa(a,c);return c}return a}var g=0,i=0,d=d?d.map(function(a){return f(a,c[i++])}):[];a=a.apply(k,d);"string"==b?b=E(a):(w("array"!=b),b=a);g&&ia(g);return b}p.cwrap=function(a,b,c){var d=za(a);return function(){return ya(d,b,c,Array.prototype.slice.call(arguments))}};
function Ba(a,b,c){c=c||"i8";"*"===c.charAt(c.length-1)&&(c="i32");switch(c){case "i1":F[a]=b;break;case "i8":F[a]=b;break;case "i16":G[a>>1]=b;break;case "i32":I[a>>2]=b;break;case "i64":xa=[b>>>0,(wa=b,1<=+Ca(wa)?0<wa?(Da(+Ea(wa/4294967296),4294967295)|0)>>>0:~~+Fa((wa-+(~~wa>>>0))/4294967296)>>>0:0)];I[a>>2]=xa[0];I[a+4>>2]=xa[1];break;case "float":Ga[a>>2]=b;break;case "double":Ha[a>>3]=b;break;default:B("invalid type for setValue: "+c)}}p.setValue=Ba;
p.getValue=function(a,b){b=b||"i8";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":return F[a];case "i8":return F[a];case "i16":return G[a>>1];case "i32":return I[a>>2];case "i64":return I[a>>2];case "float":return Ga[a>>2];case "double":return Ha[a>>3];default:B("invalid type for setValue: "+b)}return k};var Ia=2,Ja=4;p.ALLOC_NORMAL=0;p.ALLOC_STACK=1;p.ALLOC_STATIC=Ia;p.ALLOC_DYNAMIC=3;p.ALLOC_NONE=Ja;
function J(a,b,c,d){var f,g;"number"===typeof a?(f=j,g=a):(f=l,g=a.length);var i="string"===typeof b?b:k,c=c==Ja?d:[Ka,pa,qa,ra][c===h?Ia:c](Math.max(g,i?1:b.length));if(f){d=c;w(0==(c&3));for(a=c+(g&-4);d<a;d+=4)I[d>>2]=0;for(a=c+g;d<a;)F[d++|0]=0;return c}if("i8"===i)return a.subarray||a.slice?K.set(a,c):K.set(new Uint8Array(a),c),c;for(var d=0,z,r;d<g;){var t=a[d];"function"===typeof t&&(t=ua.Zd(t));f=i||b[d];0===f?d++:("i64"==f&&(f="i32"),Ba(c+d,t,f),r!==f&&(z=ja(f),r=f),d+=z)}return c}
p.allocate=J;function E(a,b){for(var c=l,d,f=0;;){d=K[a+f|0];if(128<=d)c=j;else if(0==d&&!b)break;f++;if(b&&f==b)break}b||(b=f);var g="";if(!c){for(;0<b;)d=String.fromCharCode.apply(String,K.subarray(a,a+Math.min(b,1024))),g=g?g+d:d,a+=1024,b-=1024;return g}c=new oa;for(f=0;f<b;f++)d=K[a+f|0],g+=c.Ca(d);return g}p.Pointer_stringify=E;p.UTF16ToString=function(a){for(var b=0,c="";;){var d=G[a+2*b>>1];if(0==d)return c;++b;c+=String.fromCharCode(d)}};
p.stringToUTF16=function(a,b){for(var c=0;c<a.length;++c)G[b+2*c>>1]=a.charCodeAt(c);G[b+2*a.length>>1]=0};p.UTF32ToString=function(a){for(var b=0,c="";;){var d=I[a+4*b>>2];if(0==d)return c;++b;65536<=d?(d-=65536,c+=String.fromCharCode(55296|d>>10,56320|d&1023)):c+=String.fromCharCode(d)}};p.stringToUTF32=function(a,b){for(var c=0,d=0;d<a.length;++d){var f=a.charCodeAt(d);if(55296<=f&&57343>=f)var g=a.charCodeAt(++d),f=65536+((f&1023)<<10)|g&1023;I[b+4*c>>2]=f;++c}I[b+4*c>>2]=0};
function La(a){try{"number"===typeof a&&(a=E(a));if("_"!==a[0]||"_"!==a[1]||"Z"!==a[2])return a;switch(a[3]){case "n":return"operator new()";case "d":return"operator delete()"}var b=3,c={v:"void",b:"bool",c:"char",s:"short",i:"int",l:"long",f:"float",d:"double",w:"wchar_t",a:"signed char",h:"unsigned char",t:"unsigned short",j:"unsigned int",m:"unsigned long",x:"long long",y:"unsigned long long",z:"..."},d=[],f=j,g=function(i,r,t){var r=r||Infinity,D="",A=[],n;if("N"===a[b]){b++;"K"===a[b]&&b++;for(n=
[];"E"!==a[b];)if("S"===a[b]){b++;var u=a.indexOf("_",b);n.push(d[a.substring(b,u)||0]||"?");b=u+1}else if("C"===a[b])n.push(n[n.length-1]),b+=2;else{var u=parseInt(a.substr(b)),H=u.toString().length;if(!u||!H){b--;break}var ka=a.substr(b+H,u);n.push(ka);d.push(ka);b+=H+u}b++;n=n.join("::");r--;if(0===r)return i?[n]:n}else if(("K"===a[b]||f&&"L"===a[b])&&b++,u=parseInt(a.substr(b)))H=u.toString().length,n=a.substr(b+H,u),b+=H+u;f=l;"I"===a[b]?(b++,u=g(j),H=g(j,1,j),D+=H[0]+" "+n+"<"+u.join(", ")+
">"):D=n;a:for(;b<a.length&&0<r--;)if(n=a[b++],n in c)A.push(c[n]);else switch(n){case "P":A.push(g(j,1,j)[0]+"*");break;case "R":A.push(g(j,1,j)[0]+"&");break;case "L":b++;u=a.indexOf("E",b)-b;A.push(a.substr(b,u));b+=u+2;break;case "A":u=parseInt(a.substr(b));b+=u.toString().length;"_"!==a[b]&&e("?");b++;A.push(g(j,1,j)[0]+" ["+u+"]");break;case "E":break a;default:D+="?"+n;break a}!t&&(1===A.length&&"void"===A[0])&&(A=[]);return i?A:D+("("+A.join(", ")+")")};return g()}catch(i){return a}}
function Ma(){var a=Error().stack;return a?a.replace(/__Z[\w\d_]+/g,function(a){var c=La(a);return a===c?a:a+" ["+c+"]"}):"(no stack trace available)"}var F,K,G,Na,I,Oa,Ga,Ha,Pa=0,x=0,Qa=0,v=0,Ra=0,Sa=0,y=0,sa=p.TOTAL_MEMORY||16777216;w("undefined"!==typeof Int32Array&&"undefined"!==typeof Float64Array&&!!(new Int32Array(1)).subarray&&!!(new Int32Array(1)).set,"Cannot fallback to non-typed array case: Code is too specialized");var L=new ArrayBuffer(sa);F=new Int8Array(L);G=new Int16Array(L);I=new Int32Array(L);
K=new Uint8Array(L);Na=new Uint16Array(L);Oa=new Uint32Array(L);Ga=new Float32Array(L);Ha=new Float64Array(L);I[0]=255;w(255===K[0]&&0===K[3],"Typed arrays 2 must be run on a little-endian system");p.HEAP=h;p.HEAP8=F;p.HEAP16=G;p.HEAP32=I;p.HEAPU8=K;p.HEAPU16=Na;p.HEAPU32=Oa;p.HEAPF32=Ga;p.HEAPF64=Ha;function Ta(a){for(;0<a.length;){var b=a.shift();if("function"==typeof b)b();else{var c=b.P;"number"===typeof c?b.ya===h?ma("v",c):ma("vi",c,[b.ya]):c(b.ya===h?k:b.ya)}}}
var Ua=[],M=[],Va=[],Wa=[],Ya=[],Za=l;function $a(a){Ua.unshift(a)}p.addOnPreRun=p.Pd=$a;p.addOnInit=p.Md=function(a){M.unshift(a)};p.addOnPreMain=p.Od=function(a){Va.unshift(a)};p.addOnExit=p.Ld=function(a){Wa.unshift(a)};function ab(a){Ya.unshift(a)}p.addOnPostRun=p.Nd=ab;function C(a,b,c){a=(new oa).Jb(a);c&&(a.length=c);b||a.push(0);return a}p.intArrayFromString=C;p.intArrayToString=function(a){for(var b=[],c=0;c<a.length;c++){var d=a[c];255<d&&(d&=255);b.push(String.fromCharCode(d))}return b.join("")};
p.writeStringToMemory=function(a,b,c){a=C(a,c);for(c=0;c<a.length;)F[b+c|0]=a[c],c+=1};function Aa(a,b){for(var c=0;c<a.length;c++)F[b+c|0]=a[c]}p.writeArrayToMemory=Aa;p.writeAsciiToMemory=function(a,b,c){for(var d=0;d<a.length;d++)F[b+d|0]=a.charCodeAt(d);c||(F[b+a.length|0]=0)};Math.imul||(Math.imul=function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16)*d+c*(b>>>16)<<16)|0});Math.be=Math.imul;var Ca=Math.abs,Fa=Math.ceil,Ea=Math.floor,Da=Math.min,N=0,bb=k,cb=k;
function db(){N++;p.monitorRunDependencies&&p.monitorRunDependencies(N)}p.addRunDependency=db;function eb(){N--;p.monitorRunDependencies&&p.monitorRunDependencies(N);if(0==N&&(bb!==k&&(clearInterval(bb),bb=k),cb)){var a=cb;cb=k;a()}}p.removeRunDependency=eb;p.preloadedImages={};p.preloadedAudios={};Pa=8;x=Pa+14944;M.push({P:function(){fb()}});
J([64,51,0,0,120,52,0,0,136,56,0,0,104,51,0,0,16,51,0,0,224,50,0,0,136,50,0,0,80,50,0,0,8,50,0,0,136,56,0,0,12,0,8,0,140,0,8,0,76,0,8,0,204,0,8,0,44,0,8,0,172,0,8,0,108,0,8,0,236,0,8,0,28,0,8,0,156,0,8,0,92,0,8,0,220,0,8,0,60,0,8,0,188,0,8,0,124,0,8,0,252,0,8,0,2,0,8,0,130,0,8,0,66,0,8,0,194,0,8,0,34,0,8,0,162,0,8,0,98,0,8,0,226,0,8,0,18,0,8,0,146,0,8,0,82,0,8,0,210,0,8,0,50,0,8,0,178,0,8,0,114,0,8,0,242,0,8,0,10,0,8,0,138,0,8,0,74,0,8,0,202,0,8,0,42,0,8,0,170,0,8,0,106,0,8,0,234,0,8,0,26,0,8,0,154,
0,8,0,90,0,8,0,218,0,8,0,58,0,8,0,186,0,8,0,122,0,8,0,250,0,8,0,6,0,8,0,134,0,8,0,70,0,8,0,198,0,8,0,38,0,8,0,166,0,8,0,102,0,8,0,230,0,8,0,22,0,8,0,150,0,8,0,86,0,8,0,214,0,8,0,54,0,8,0,182,0,8,0,118,0,8,0,246,0,8,0,14,0,8,0,142,0,8,0,78,0,8,0,206,0,8,0,46,0,8,0,174,0,8,0,110,0,8,0,238,0,8,0,30,0,8,0,158,0,8,0,94,0,8,0,222,0,8,0,62,0,8,0,190,0,8,0,126,0,8,0,254,0,8,0,1,0,8,0,129,0,8,0,65,0,8,0,193,0,8,0,33,0,8,0,161,0,8,0,97,0,8,0,225,0,8,0,17,0,8,0,145,0,8,0,81,0,8,0,209,0,8,0,49,0,8,0,177,0,8,
0,113,0,8,0,241,0,8,0,9,0,8,0,137,0,8,0,73,0,8,0,201,0,8,0,41,0,8,0,169,0,8,0,105,0,8,0,233,0,8,0,25,0,8,0,153,0,8,0,89,0,8,0,217,0,8,0,57,0,8,0,185,0,8,0,121,0,8,0,249,0,8,0,5,0,8,0,133,0,8,0,69,0,8,0,197,0,8,0,37,0,8,0,165,0,8,0,101,0,8,0,229,0,8,0,21,0,8,0,149,0,8,0,85,0,8,0,213,0,8,0,53,0,8,0,181,0,8,0,117,0,8,0,245,0,8,0,13,0,8,0,141,0,8,0,77,0,8,0,205,0,8,0,45,0,8,0,173,0,8,0,109,0,8,0,237,0,8,0,29,0,8,0,157,0,8,0,93,0,8,0,221,0,8,0,61,0,8,0,189,0,8,0,125,0,8,0,253,0,8,0,19,0,9,0,19,1,9,0,147,
0,9,0,147,1,9,0,83,0,9,0,83,1,9,0,211,0,9,0,211,1,9,0,51,0,9,0,51,1,9,0,179,0,9,0,179,1,9,0,115,0,9,0,115,1,9,0,243,0,9,0,243,1,9,0,11,0,9,0,11,1,9,0,139,0,9,0,139,1,9,0,75,0,9,0,75,1,9,0,203,0,9,0,203,1,9,0,43,0,9,0,43,1,9,0,171,0,9,0,171,1,9,0,107,0,9,0,107,1,9,0,235,0,9,0,235,1,9,0,27,0,9,0,27,1,9,0,155,0,9,0,155,1,9,0,91,0,9,0,91,1,9,0,219,0,9,0,219,1,9,0,59,0,9,0,59,1,9,0,187,0,9,0,187,1,9,0,123,0,9,0,123,1,9,0,251,0,9,0,251,1,9,0,7,0,9,0,7,1,9,0,135,0,9,0,135,1,9,0,71,0,9,0,71,1,9,0,199,0,9,
0,199,1,9,0,39,0,9,0,39,1,9,0,167,0,9,0,167,1,9,0,103,0,9,0,103,1,9,0,231,0,9,0,231,1,9,0,23,0,9,0,23,1,9,0,151,0,9,0,151,1,9,0,87,0,9,0,87,1,9,0,215,0,9,0,215,1,9,0,55,0,9,0,55,1,9,0,183,0,9,0,183,1,9,0,119,0,9,0,119,1,9,0,247,0,9,0,247,1,9,0,15,0,9,0,15,1,9,0,143,0,9,0,143,1,9,0,79,0,9,0,79,1,9,0,207,0,9,0,207,1,9,0,47,0,9,0,47,1,9,0,175,0,9,0,175,1,9,0,111,0,9,0,111,1,9,0,239,0,9,0,239,1,9,0,31,0,9,0,31,1,9,0,159,0,9,0,159,1,9,0,95,0,9,0,95,1,9,0,223,0,9,0,223,1,9,0,63,0,9,0,63,1,9,0,191,0,9,0,
191,1,9,0,127,0,9,0,127,1,9,0,255,0,9,0,255,1,9,0,0,0,7,0,64,0,7,0,32,0,7,0,96,0,7,0,16,0,7,0,80,0,7,0,48,0,7,0,112,0,7,0,8,0,7,0,72,0,7,0,40,0,7,0,104,0,7,0,24,0,7,0,88,0,7,0,56,0,7,0,120,0,7,0,4,0,7,0,68,0,7,0,36,0,7,0,100,0,7,0,20,0,7,0,84,0,7,0,52,0,7,0,116,0,7,0,3,0,8,0,131,0,8,0,67,0,8,0,195,0,8,0,35,0,8,0,163,0,8,0,99,0,8,0,227,0,8,0,48,0,0,0,24,15,0,0,1,1,0,0,30,1,0,0,15,0,0,0,0,0,0,0,0,0,5,0,16,0,5,0,8,0,5,0,24,0,5,0,4,0,5,0,20,0,5,0,12,0,5,0,28,0,5,0,2,0,5,0,18,0,5,0,10,0,5,0,26,0,5,0,6,
0,5,0,22,0,5,0,14,0,5,0,30,0,5,0,1,0,5,0,17,0,5,0,9,0,5,0,25,0,5,0,5,0,5,0,21,0,5,0,13,0,5,0,29,0,5,0,3,0,5,0,19,0,5,0,11,0,5,0,27,0,5,0,7,0,5,0,23,0,5,0,200,4,0,0,144,15,0,0,0,0,0,0,30,0,0,0,15,0,0,0,0,0,0,0,0,0,0,0,8,16,0,0,0,0,0,0,19,0,0,0,7,0,0,0,0,0,0,0,16,0,16,0,16,0,16,0,16,0,16,0,16,0,16,0,17,0,17,0,17,0,17,0,18,0,18,0,18,0,18,0,19,0,19,0,19,0,19,0,20,0,20,0,20,0,20,0,21,0,21,0,21,0,21,0,16,0,72,0,78,0,0,0,3,0,4,0,5,0,6,0,7,0,8,0,9,0,10,0,11,0,13,0,15,0,17,0,19,0,23,0,27,0,31,0,35,0,43,0,
51,0,59,0,67,0,83,0,99,0,115,0,131,0,163,0,195,0,227,0,2,1,0,0,0,0,0,0,16,0,16,0,16,0,16,0,17,0,17,0,18,0,18,0,19,0,19,0,20,0,20,0,21,0,21,0,22,0,22,0,23,0,23,0,24,0,24,0,25,0,25,0,26,0,26,0,27,0,27,0,28,0,28,0,29,0,29,0,64,0,64,0,1,0,2,0,3,0,4,0,5,0,7,0,9,0,13,0,17,0,25,0,33,0,49,0,65,0,97,0,129,0,193,0,1,1,129,1,1,2,1,3,1,4,1,6,1,8,1,12,1,16,1,24,1,32,1,48,1,64,1,96,0,0,0,0,16,0,17,0,18,0,0,0,8,0,7,0,9,0,6,0,10,0,5,0,11,0,4,0,12,0,3,0,13,0,2,0,14,0,1,0,15,0,0,0,96,7,0,0,0,8,80,0,0,8,16,0,20,8,115,
0,18,7,31,0,0,8,112,0,0,8,48,0,0,9,192,0,16,7,10,0,0,8,96,0,0,8,32,0,0,9,160,0,0,8,0,0,0,8,128,0,0,8,64,0,0,9,224,0,16,7,6,0,0,8,88,0,0,8,24,0,0,9,144,0,19,7,59,0,0,8,120,0,0,8,56,0,0,9,208,0,17,7,17,0,0,8,104,0,0,8,40,0,0,9,176,0,0,8,8,0,0,8,136,0,0,8,72,0,0,9,240,0,16,7,4,0,0,8,84,0,0,8,20,0,21,8,227,0,19,7,43,0,0,8,116,0,0,8,52,0,0,9,200,0,17,7,13,0,0,8,100,0,0,8,36,0,0,9,168,0,0,8,4,0,0,8,132,0,0,8,68,0,0,9,232,0,16,7,8,0,0,8,92,0,0,8,28,0,0,9,152,0,20,7,83,0,0,8,124,0,0,8,60,0,0,9,216,0,18,7,
23,0,0,8,108,0,0,8,44,0,0,9,184,0,0,8,12,0,0,8,140,0,0,8,76,0,0,9,248,0,16,7,3,0,0,8,82,0,0,8,18,0,21,8,163,0,19,7,35,0,0,8,114,0,0,8,50,0,0,9,196,0,17,7,11,0,0,8,98,0,0,8,34,0,0,9,164,0,0,8,2,0,0,8,130,0,0,8,66,0,0,9,228,0,16,7,7,0,0,8,90,0,0,8,26,0,0,9,148,0,20,7,67,0,0,8,122,0,0,8,58,0,0,9,212,0,18,7,19,0,0,8,106,0,0,8,42,0,0,9,180,0,0,8,10,0,0,8,138,0,0,8,74,0,0,9,244,0,16,7,5,0,0,8,86,0,0,8,22,0,64,8,0,0,19,7,51,0,0,8,118,0,0,8,54,0,0,9,204,0,17,7,15,0,0,8,102,0,0,8,38,0,0,9,172,0,0,8,6,0,0,
8,134,0,0,8,70,0,0,9,236,0,16,7,9,0,0,8,94,0,0,8,30,0,0,9,156,0,20,7,99,0,0,8,126,0,0,8,62,0,0,9,220,0,18,7,27,0,0,8,110,0,0,8,46,0,0,9,188,0,0,8,14,0,0,8,142,0,0,8,78,0,0,9,252,0,96,7,0,0,0,8,81,0,0,8,17,0,21,8,131,0,18,7,31,0,0,8,113,0,0,8,49,0,0,9,194,0,16,7,10,0,0,8,97,0,0,8,33,0,0,9,162,0,0,8,1,0,0,8,129,0,0,8,65,0,0,9,226,0,16,7,6,0,0,8,89,0,0,8,25,0,0,9,146,0,19,7,59,0,0,8,121,0,0,8,57,0,0,9,210,0,17,7,17,0,0,8,105,0,0,8,41,0,0,9,178,0,0,8,9,0,0,8,137,0,0,8,73,0,0,9,242,0,16,7,4,0,0,8,85,0,
0,8,21,0,16,8,2,1,19,7,43,0,0,8,117,0,0,8,53,0,0,9,202,0,17,7,13,0,0,8,101,0,0,8,37,0,0,9,170,0,0,8,5,0,0,8,133,0,0,8,69,0,0,9,234,0,16,7,8,0,0,8,93,0,0,8,29,0,0,9,154,0,20,7,83,0,0,8,125,0,0,8,61,0,0,9,218,0,18,7,23,0,0,8,109,0,0,8,45,0,0,9,186,0,0,8,13,0,0,8,141,0,0,8,77,0,0,9,250,0,16,7,3,0,0,8,83,0,0,8,19,0,21,8,195,0,19,7,35,0,0,8,115,0,0,8,51,0,0,9,198,0,17,7,11,0,0,8,99,0,0,8,35,0,0,9,166,0,0,8,3,0,0,8,131,0,0,8,67,0,0,9,230,0,16,7,7,0,0,8,91,0,0,8,27,0,0,9,150,0,20,7,67,0,0,8,123,0,0,8,59,
0,0,9,214,0,18,7,19,0,0,8,107,0,0,8,43,0,0,9,182,0,0,8,11,0,0,8,139,0,0,8,75,0,0,9,246,0,16,7,5,0,0,8,87,0,0,8,23,0,64,8,0,0,19,7,51,0,0,8,119,0,0,8,55,0,0,9,206,0,17,7,15,0,0,8,103,0,0,8,39,0,0,9,174,0,0,8,7,0,0,8,135,0,0,8,71,0,0,9,238,0,16,7,9,0,0,8,95,0,0,8,31,0,0,9,158,0,20,7,99,0,0,8,127,0,0,8,63,0,0,9,222,0,18,7,27,0,0,8,111,0,0,8,47,0,0,9,190,0,0,8,15,0,0,8,143,0,0,8,79,0,0,9,254,0,96,7,0,0,0,8,80,0,0,8,16,0,20,8,115,0,18,7,31,0,0,8,112,0,0,8,48,0,0,9,193,0,16,7,10,0,0,8,96,0,0,8,32,0,0,9,
161,0,0,8,0,0,0,8,128,0,0,8,64,0,0,9,225,0,16,7,6,0,0,8,88,0,0,8,24,0,0,9,145,0,19,7,59,0,0,8,120,0,0,8,56,0,0,9,209,0,17,7,17,0,0,8,104,0,0,8,40,0,0,9,177,0,0,8,8,0,0,8,136,0,0,8,72,0,0,9,241,0,16,7,4,0,0,8,84,0,0,8,20,0,21,8,227,0,19,7,43,0,0,8,116,0,0,8,52,0,0,9,201,0,17,7,13,0,0,8,100,0,0,8,36,0,0,9,169,0,0,8,4,0,0,8,132,0,0,8,68,0,0,9,233,0,16,7,8,0,0,8,92,0,0,8,28,0,0,9,153,0,20,7,83,0,0,8,124,0,0,8,60,0,0,9,217,0,18,7,23,0,0,8,108,0,0,8,44,0,0,9,185,0,0,8,12,0,0,8,140,0,0,8,76,0,0,9,249,0,
16,7,3,0,0,8,82,0,0,8,18,0,21,8,163,0,19,7,35,0,0,8,114,0,0,8,50,0,0,9,197,0,17,7,11,0,0,8,98,0,0,8,34,0,0,9,165,0,0,8,2,0,0,8,130,0,0,8,66,0,0,9,229,0,16,7,7,0,0,8,90,0,0,8,26,0,0,9,149,0,20,7,67,0,0,8,122,0,0,8,58,0,0,9,213,0,18,7,19,0,0,8,106,0,0,8,42,0,0,9,181,0,0,8,10,0,0,8,138,0,0,8,74,0,0,9,245,0,16,7,5,0,0,8,86,0,0,8,22,0,64,8,0,0,19,7,51,0,0,8,118,0,0,8,54,0,0,9,205,0,17,7,15,0,0,8,102,0,0,8,38,0,0,9,173,0,0,8,6,0,0,8,134,0,0,8,70,0,0,9,237,0,16,7,9,0,0,8,94,0,0,8,30,0,0,9,157,0,20,7,99,
0,0,8,126,0,0,8,62,0,0,9,221,0,18,7,27,0,0,8,110,0,0,8,46,0,0,9,189,0,0,8,14,0,0,8,142,0,0,8,78,0,0,9,253,0,96,7,0,0,0,8,81,0,0,8,17,0,21,8,131,0,18,7,31,0,0,8,113,0,0,8,49,0,0,9,195,0,16,7,10,0,0,8,97,0,0,8,33,0,0,9,163,0,0,8,1,0,0,8,129,0,0,8,65,0,0,9,227,0,16,7,6,0,0,8,89,0,0,8,25,0,0,9,147,0,19,7,59,0,0,8,121,0,0,8,57,0,0,9,211,0,17,7,17,0,0,8,105,0,0,8,41,0,0,9,179,0,0,8,9,0,0,8,137,0,0,8,73,0,0,9,243,0,16,7,4,0,0,8,85,0,0,8,21,0,16,8,2,1,19,7,43,0,0,8,117,0,0,8,53,0,0,9,203,0,17,7,13,0,0,8,
101,0,0,8,37,0,0,9,171,0,0,8,5,0,0,8,133,0,0,8,69,0,0,9,235,0,16,7,8,0,0,8,93,0,0,8,29,0,0,9,155,0,20,7,83,0,0,8,125,0,0,8,61,0,0,9,219,0,18,7,23,0,0,8,109,0,0,8,45,0,0,9,187,0,0,8,13,0,0,8,141,0,0,8,77,0,0,9,251,0,16,7,3,0,0,8,83,0,0,8,19,0,21,8,195,0,19,7,35,0,0,8,115,0,0,8,51,0,0,9,199,0,17,7,11,0,0,8,99,0,0,8,35,0,0,9,167,0,0,8,3,0,0,8,131,0,0,8,67,0,0,9,231,0,16,7,7,0,0,8,91,0,0,8,27,0,0,9,151,0,20,7,67,0,0,8,123,0,0,8,59,0,0,9,215,0,18,7,19,0,0,8,107,0,0,8,43,0,0,9,183,0,0,8,11,0,0,8,139,0,
0,8,75,0,0,9,247,0,16,7,5,0,0,8,87,0,0,8,23,0,64,8,0,0,19,7,51,0,0,8,119,0,0,8,55,0,0,9,207,0,17,7,15,0,0,8,103,0,0,8,39,0,0,9,175,0,0,8,7,0,0,8,135,0,0,8,71,0,0,9,239,0,16,7,9,0,0,8,95,0,0,8,31,0,0,9,159,0,20,7,99,0,0,8,127,0,0,8,63,0,0,9,223,0,18,7,27,0,0,8,111,0,0,8,47,0,0,9,191,0,0,8,15,0,0,8,143,0,0,8,79,0,0,9,255,0,16,5,1,0,23,5,1,1,19,5,17,0,27,5,1,16,17,5,5,0,25,5,1,4,21,5,65,0,29,5,1,64,16,5,3,0,24,5,1,2,20,5,33,0,28,5,1,32,18,5,9,0,26,5,1,8,22,5,129,0,64,5,0,0,16,5,2,0,23,5,129,1,19,5,25,
0,27,5,1,24,17,5,7,0,25,5,1,6,21,5,97,0,29,5,1,96,16,5,4,0,24,5,1,3,20,5,49,0,28,5,1,48,18,5,13,0,26,5,1,12,22,5,193,0,64,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,2,0,0,0,2,0,0,0,3,0,0,0,3,0,0,0,4,0,0,0,4,0,0,0,5,0,0,0,5,0,0,0,6,0,0,0,6,0,0,0,7,0,0,
0,7,0,0,0,8,0,0,0,8,0,0,0,9,0,0,0,9,0,0,0,10,0,0,0,10,0,0,0,11,0,0,0,11,0,0,0,12,0,0,0,12,0,0,0,13,0,0,0,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,3,0,0,0,7,0,0,0,0,0,0,0,49,46,50,46,56,0,0,0,0,0,0,0,150,48,7,119,44,97,14,238,186,81,9,153,25,196,109,7,143,244,106,112,53,165,99,233,163,149,100,158,50,136,219,14,164,184,220,121,30,233,213,224,136,217,210,151,43,76,182,9,189,124,177,126,7,45,184,231,
145,29,191,144,100,16,183,29,242,32,176,106,72,113,185,243,222,65,190,132,125,212,218,26,235,228,221,109,81,181,212,244,199,133,211,131,86,152,108,19,192,168,107,100,122,249,98,253,236,201,101,138,79,92,1,20,217,108,6,99,99,61,15,250,245,13,8,141,200,32,110,59,94,16,105,76,228,65,96,213,114,113,103,162,209,228,3,60,71,212,4,75,253,133,13,210,107,181,10,165,250,168,181,53,108,152,178,66,214,201,187,219,64,249,188,172,227,108,216,50,117,92,223,69,207,13,214,220,89,61,209,171,172,48,217,38,58,0,222,
81,128,81,215,200,22,97,208,191,181,244,180,33,35,196,179,86,153,149,186,207,15,165,189,184,158,184,2,40,8,136,5,95,178,217,12,198,36,233,11,177,135,124,111,47,17,76,104,88,171,29,97,193,61,45,102,182,144,65,220,118,6,113,219,1,188,32,210,152,42,16,213,239,137,133,177,113,31,181,182,6,165,228,191,159,51,212,184,232,162,201,7,120,52,249,0,15,142,168,9,150,24,152,14,225,187,13,106,127,45,61,109,8,151,108,100,145,1,92,99,230,244,81,107,107,98,97,108,28,216,48,101,133,78,0,98,242,237,149,6,108,123,165,
1,27,193,244,8,130,87,196,15,245,198,217,176,101,80,233,183,18,234,184,190,139,124,136,185,252,223,29,221,98,73,45,218,21,243,124,211,140,101,76,212,251,88,97,178,77,206,81,181,58,116,0,188,163,226,48,187,212,65,165,223,74,215,149,216,61,109,196,209,164,251,244,214,211,106,233,105,67,252,217,110,52,70,136,103,173,208,184,96,218,115,45,4,68,229,29,3,51,95,76,10,170,201,124,13,221,60,113,5,80,170,65,2,39,16,16,11,190,134,32,12,201,37,181,104,87,179,133,111,32,9,212,102,185,159,228,97,206,14,249,222,
94,152,201,217,41,34,152,208,176,180,168,215,199,23,61,179,89,129,13,180,46,59,92,189,183,173,108,186,192,32,131,184,237,182,179,191,154,12,226,182,3,154,210,177,116,57,71,213,234,175,119,210,157,21,38,219,4,131,22,220,115,18,11,99,227,132,59,100,148,62,106,109,13,168,90,106,122,11,207,14,228,157,255,9,147,39,174,0,10,177,158,7,125,68,147,15,240,210,163,8,135,104,242,1,30,254,194,6,105,93,87,98,247,203,103,101,128,113,54,108,25,231,6,107,110,118,27,212,254,224,43,211,137,90,122,218,16,204,74,221,
103,111,223,185,249,249,239,190,142,67,190,183,23,213,142,176,96,232,163,214,214,126,147,209,161,196,194,216,56,82,242,223,79,241,103,187,209,103,87,188,166,221,6,181,63,75,54,178,72,218,43,13,216,76,27,10,175,246,74,3,54,96,122,4,65,195,239,96,223,85,223,103,168,239,142,110,49,121,190,105,70,140,179,97,203,26,131,102,188,160,210,111,37,54,226,104,82,149,119,12,204,3,71,11,187,185,22,2,34,47,38,5,85,190,59,186,197,40,11,189,178,146,90,180,43,4,106,179,92,167,255,215,194,49,207,208,181,139,158,217,
44,29,174,222,91,176,194,100,155,38,242,99,236,156,163,106,117,10,147,109,2,169,6,9,156,63,54,14,235,133,103,7,114,19,87,0,5,130,74,191,149,20,122,184,226,174,43,177,123,56,27,182,12,155,142,210,146,13,190,213,229,183,239,220,124,33,223,219,11,212,210,211,134,66,226,212,241,248,179,221,104,110,131,218,31,205,22,190,129,91,38,185,246,225,119,176,111,119,71,183,24,230,90,8,136,112,106,15,255,202,59,6,102,92,11,1,17,255,158,101,143,105,174,98,248,211,255,107,97,69,207,108,22,120,226,10,160,238,210,13,
215,84,131,4,78,194,179,3,57,97,38,103,167,247,22,96,208,77,71,105,73,219,119,110,62,74,106,209,174,220,90,214,217,102,11,223,64,240,59,216,55,83,174,188,169,197,158,187,222,127,207,178,71,233,255,181,48,28,242,189,189,138,194,186,202,48,147,179,83,166,163,180,36,5,54,208,186,147,6,215,205,41,87,222,84,191,103,217,35,46,122,102,179,184,74,97,196,2,27,104,93,148,43,111,42,55,190,11,180,161,142,12,195,27,223,5,90,141,239,2,45,0,0,0,0,65,49,27,25,130,98,54,50,195,83,45,43,4,197,108,100,69,244,119,125,
134,167,90,86,199,150,65,79,8,138,217,200,73,187,194,209,138,232,239,250,203,217,244,227,12,79,181,172,77,126,174,181,142,45,131,158,207,28,152,135,81,18,194,74,16,35,217,83,211,112,244,120,146,65,239,97,85,215,174,46,20,230,181,55,215,181,152,28,150,132,131,5,89,152,27,130,24,169,0,155,219,250,45,176,154,203,54,169,93,93,119,230,28,108,108,255,223,63,65,212,158,14,90,205,162,36,132,149,227,21,159,140,32,70,178,167,97,119,169,190,166,225,232,241,231,208,243,232,36,131,222,195,101,178,197,218,170,
174,93,93,235,159,70,68,40,204,107,111,105,253,112,118,174,107,49,57,239,90,42,32,44,9,7,11,109,56,28,18,243,54,70,223,178,7,93,198,113,84,112,237,48,101,107,244,247,243,42,187,182,194,49,162,117,145,28,137,52,160,7,144,251,188,159,23,186,141,132,14,121,222,169,37,56,239,178,60,255,121,243,115,190,72,232,106,125,27,197,65,60,42,222,88,5,79,121,240,68,126,98,233,135,45,79,194,198,28,84,219,1,138,21,148,64,187,14,141,131,232,35,166,194,217,56,191,13,197,160,56,76,244,187,33,143,167,150,10,206,150,141,
19,9,0,204,92,72,49,215,69,139,98,250,110,202,83,225,119,84,93,187,186,21,108,160,163,214,63,141,136,151,14,150,145,80,152,215,222,17,169,204,199,210,250,225,236,147,203,250,245,92,215,98,114,29,230,121,107,222,181,84,64,159,132,79,89,88,18,14,22,25,35,21,15,218,112,56,36,155,65,35,61,167,107,253,101,230,90,230,124,37,9,203,87,100,56,208,78,163,174,145,1,226,159,138,24,33,204,167,51,96,253,188,42,175,225,36,173,238,208,63,180,45,131,18,159,108,178,9,134,171,36,72,201,234,21,83,208,41,70,126,251,104,
119,101,226,246,121,63,47,183,72,36,54,116,27,9,29,53,42,18,4,242,188,83,75,179,141,72,82,112,222,101,121,49,239,126,96,254,243,230,231,191,194,253,254,124,145,208,213,61,160,203,204,250,54,138,131,187,7,145,154,120,84,188,177,57,101,167,168,75,152,131,59,10,169,152,34,201,250,181,9,136,203,174,16,79,93,239,95,14,108,244,70,205,63,217,109,140,14,194,116,67,18,90,243,2,35,65,234,193,112,108,193,128,65,119,216,71,215,54,151,6,230,45,142,197,181,0,165,132,132,27,188,26,138,65,113,91,187,90,104,152,232,
119,67,217,217,108,90,30,79,45,21,95,126,54,12,156,45,27,39,221,28,0,62,18,0,152,185,83,49,131,160,144,98,174,139,209,83,181,146,22,197,244,221,87,244,239,196,148,167,194,239,213,150,217,246,233,188,7,174,168,141,28,183,107,222,49,156,42,239,42,133,237,121,107,202,172,72,112,211,111,27,93,248,46,42,70,225,225,54,222,102,160,7,197,127,99,84,232,84,34,101,243,77,229,243,178,2,164,194,169,27,103,145,132,48,38,160,159,41,184,174,197,228,249,159,222,253,58,204,243,214,123,253,232,207,188,107,169,128,253,
90,178,153,62,9,159,178,127,56,132,171,176,36,28,44,241,21,7,53,50,70,42,30,115,119,49,7,180,225,112,72,245,208,107,81,54,131,70,122,119,178,93,99,78,215,250,203,15,230,225,210,204,181,204,249,141,132,215,224,74,18,150,175,11,35,141,182,200,112,160,157,137,65,187,132,70,93,35,3,7,108,56,26,196,63,21,49,133,14,14,40,66,152,79,103,3,169,84,126,192,250,121,85,129,203,98,76,31,197,56,129,94,244,35,152,157,167,14,179,220,150,21,170,27,0,84,229,90,49,79,252,153,98,98,215,216,83,121,206,23,79,225,73,86,
126,250,80,149,45,215,123,212,28,204,98,19,138,141,45,82,187,150,52,145,232,187,31,208,217,160,6,236,243,126,94,173,194,101,71,110,145,72,108,47,160,83,117,232,54,18,58,169,7,9,35,106,84,36,8,43,101,63,17,228,121,167,150,165,72,188,143,102,27,145,164,39,42,138,189,224,188,203,242,161,141,208,235,98,222,253,192,35,239,230,217,189,225,188,20,252,208,167,13,63,131,138,38,126,178,145,63,185,36,208,112,248,21,203,105,59,70,230,66,122,119,253,91,181,107,101,220,244,90,126,197,55,9,83,238,118,56,72,247,
177,174,9,184,240,159,18,161,51,204,63,138,114,253,36,147,0,0,0,0,55,106,194,1,110,212,132,3,89,190,70,2,220,168,9,7,235,194,203,6,178,124,141,4,133,22,79,5,184,81,19,14,143,59,209,15,214,133,151,13,225,239,85,12,100,249,26,9,83,147,216,8,10,45,158,10,61,71,92,11,112,163,38,28,71,201,228,29,30,119,162,31,41,29,96,30,172,11,47,27,155,97,237,26,194,223,171,24,245,181,105,25,200,242,53,18,255,152,247,19,166,38,177,17,145,76,115,16,20,90,60,21,35,48,254,20,122,142,184,22,77,228,122,23,224,70,77,56,215,
44,143,57,142,146,201,59,185,248,11,58,60,238,68,63,11,132,134,62,82,58,192,60,101,80,2,61,88,23,94,54,111,125,156,55,54,195,218,53,1,169,24,52,132,191,87,49,179,213,149,48,234,107,211,50,221,1,17,51,144,229,107,36,167,143,169,37,254,49,239,39,201,91,45,38,76,77,98,35,123,39,160,34,34,153,230,32,21,243,36,33,40,180,120,42,31,222,186,43,70,96,252,41,113,10,62,40,244,28,113,45,195,118,179,44,154,200,245,46,173,162,55,47,192,141,154,112,247,231,88,113,174,89,30,115,153,51,220,114,28,37,147,119,43,79,
81,118,114,241,23,116,69,155,213,117,120,220,137,126,79,182,75,127,22,8,13,125,33,98,207,124,164,116,128,121,147,30,66,120,202,160,4,122,253,202,198,123,176,46,188,108,135,68,126,109,222,250,56,111,233,144,250,110,108,134,181,107,91,236,119,106,2,82,49,104,53,56,243,105,8,127,175,98,63,21,109,99,102,171,43,97,81,193,233,96,212,215,166,101,227,189,100,100,186,3,34,102,141,105,224,103,32,203,215,72,23,161,21,73,78,31,83,75,121,117,145,74,252,99,222,79,203,9,28,78,146,183,90,76,165,221,152,77,152,154,
196,70,175,240,6,71,246,78,64,69,193,36,130,68,68,50,205,65,115,88,15,64,42,230,73,66,29,140,139,67,80,104,241,84,103,2,51,85,62,188,117,87,9,214,183,86,140,192,248,83,187,170,58,82,226,20,124,80,213,126,190,81,232,57,226,90,223,83,32,91,134,237,102,89,177,135,164,88,52,145,235,93,3,251,41,92,90,69,111,94,109,47,173,95,128,27,53,225,183,113,247,224,238,207,177,226,217,165,115,227,92,179,60,230,107,217,254,231,50,103,184,229,5,13,122,228,56,74,38,239,15,32,228,238,86,158,162,236,97,244,96,237,228,
226,47,232,211,136,237,233,138,54,171,235,189,92,105,234,240,184,19,253,199,210,209,252,158,108,151,254,169,6,85,255,44,16,26,250,27,122,216,251,66,196,158,249,117,174,92,248,72,233,0,243,127,131,194,242,38,61,132,240,17,87,70,241,148,65,9,244,163,43,203,245,250,149,141,247,205,255,79,246,96,93,120,217,87,55,186,216,14,137,252,218,57,227,62,219,188,245,113,222,139,159,179,223,210,33,245,221,229,75,55,220,216,12,107,215,239,102,169,214,182,216,239,212,129,178,45,213,4,164,98,208,51,206,160,209,106,
112,230,211,93,26,36,210,16,254,94,197,39,148,156,196,126,42,218,198,73,64,24,199,204,86,87,194,251,60,149,195,162,130,211,193,149,232,17,192,168,175,77,203,159,197,143,202,198,123,201,200,241,17,11,201,116,7,68,204,67,109,134,205,26,211,192,207,45,185,2,206,64,150,175,145,119,252,109,144,46,66,43,146,25,40,233,147,156,62,166,150,171,84,100,151,242,234,34,149,197,128,224,148,248,199,188,159,207,173,126,158,150,19,56,156,161,121,250,157,36,111,181,152,19,5,119,153,74,187,49,155,125,209,243,154,48,
53,137,141,7,95,75,140,94,225,13,142,105,139,207,143,236,157,128,138,219,247,66,139,130,73,4,137,181,35,198,136,136,100,154,131,191,14,88,130,230,176,30,128,209,218,220,129,84,204,147,132,99,166,81,133,58,24,23,135,13,114,213,134,160,208,226,169,151,186,32,168,206,4,102,170,249,110,164,171,124,120,235,174,75,18,41,175,18,172,111,173,37,198,173,172,24,129,241,167,47,235,51,166,118,85,117,164,65,63,183,165,196,41,248,160,243,67,58,161,170,253,124,163,157,151,190,162,208,115,196,181,231,25,6,180,190,
167,64,182,137,205,130,183,12,219,205,178,59,177,15,179,98,15,73,177,85,101,139,176,104,34,215,187,95,72,21,186,6,246,83,184,49,156,145,185,180,138,222,188,131,224,28,189,218,94,90,191,237,52,152,190,0,0,0,0,101,103,188,184,139,200,9,170,238,175,181,18,87,151,98,143,50,240,222,55,220,95,107,37,185,56,215,157,239,40,180,197,138,79,8,125,100,224,189,111,1,135,1,215,184,191,214,74,221,216,106,242,51,119,223,224,86,16,99,88,159,87,25,80,250,48,165,232,20,159,16,250,113,248,172,66,200,192,123,223,173,
167,199,103,67,8,114,117,38,111,206,205,112,127,173,149,21,24,17,45,251,183,164,63,158,208,24,135,39,232,207,26,66,143,115,162,172,32,198,176,201,71,122,8,62,175,50,160,91,200,142,24,181,103,59,10,208,0,135,178,105,56,80,47,12,95,236,151,226,240,89,133,135,151,229,61,209,135,134,101,180,224,58,221,90,79,143,207,63,40,51,119,134,16,228,234,227,119,88,82,13,216,237,64,104,191,81,248,161,248,43,240,196,159,151,72,42,48,34,90,79,87,158,226,246,111,73,127,147,8,245,199,125,167,64,213,24,192,252,109,78,
208,159,53,43,183,35,141,197,24,150,159,160,127,42,39,25,71,253,186,124,32,65,2,146,143,244,16,247,232,72,168,61,88,20,155,88,63,168,35,182,144,29,49,211,247,161,137,106,207,118,20,15,168,202,172,225,7,127,190,132,96,195,6,210,112,160,94,183,23,28,230,89,184,169,244,60,223,21,76,133,231,194,209,224,128,126,105,14,47,203,123,107,72,119,195,162,15,13,203,199,104,177,115,41,199,4,97,76,160,184,217,245,152,111,68,144,255,211,252,126,80,102,238,27,55,218,86,77,39,185,14,40,64,5,182,198,239,176,164,163,
136,12,28,26,176,219,129,127,215,103,57,145,120,210,43,244,31,110,147,3,247,38,59,102,144,154,131,136,63,47,145,237,88,147,41,84,96,68,180,49,7,248,12,223,168,77,30,186,207,241,166,236,223,146,254,137,184,46,70,103,23,155,84,2,112,39,236,187,72,240,113,222,47,76,201,48,128,249,219,85,231,69,99,156,160,63,107,249,199,131,211,23,104,54,193,114,15,138,121,203,55,93,228,174,80,225,92,64,255,84,78,37,152,232,246,115,136,139,174,22,239,55,22,248,64,130,4,157,39,62,188,36,31,233,33,65,120,85,153,175,215,
224,139,202,176,92,51,59,182,89,237,94,209,229,85,176,126,80,71,213,25,236,255,108,33,59,98,9,70,135,218,231,233,50,200,130,142,142,112,212,158,237,40,177,249,81,144,95,86,228,130,58,49,88,58,131,9,143,167,230,110,51,31,8,193,134,13,109,166,58,181,164,225,64,189,193,134,252,5,47,41,73,23,74,78,245,175,243,118,34,50,150,17,158,138,120,190,43,152,29,217,151,32,75,201,244,120,46,174,72,192,192,1,253,210,165,102,65,106,28,94,150,247,121,57,42,79,151,150,159,93,242,241,35,229,5,25,107,77,96,126,215,245,
142,209,98,231,235,182,222,95,82,142,9,194,55,233,181,122,217,70,0,104,188,33,188,208,234,49,223,136,143,86,99,48,97,249,214,34,4,158,106,154,189,166,189,7,216,193,1,191,54,110,180,173,83,9,8,21,154,78,114,29,255,41,206,165,17,134,123,183,116,225,199,15,205,217,16,146,168,190,172,42,70,17,25,56,35,118,165,128,117,102,198,216,16,1,122,96,254,174,207,114,155,201,115,202,34,241,164,87,71,150,24,239,169,57,173,253,204,94,17,69,6,238,77,118,99,137,241,206,141,38,68,220,232,65,248,100,81,121,47,249,52,
30,147,65,218,177,38,83,191,214,154,235,233,198,249,179,140,161,69,11,98,14,240,25,7,105,76,161,190,81,155,60,219,54,39,132,53,153,146,150,80,254,46,46,153,185,84,38,252,222,232,158,18,113,93,140,119,22,225,52,206,46,54,169,171,73,138,17,69,230,63,3,32,129,131,187,118,145,224,227,19,246,92,91,253,89,233,73,152,62,85,241,33,6,130,108,68,97,62,212,170,206,139,198,207,169,55,126,56,65,127,214,93,38,195,110,179,137,118,124,214,238,202,196,111,214,29,89,10,177,161,225,228,30,20,243,129,121,168,75,215,
105,203,19,178,14,119,171,92,161,194,185,57,198,126,1,128,254,169,156,229,153,21,36,11,54,160,54,110,81,28,142,167,22,102,134,194,113,218,62,44,222,111,44,73,185,211,148,240,129,4,9,149,230,184,177,123,73,13,163,30,46,177,27,72,62,210,67,45,89,110,251,195,246,219,233,166,145,103,81,31,169,176,204,122,206,12,116,148,97,185,102,241,6,5,222,0,0,0,0,119,7,48,150,238,14,97,44,153,9,81,186,7,109,196,25,112,106,244,143,233,99,165,53,158,100,149,163,14,219,136,50,121,220,184,164,224,213,233,30,151,210,217,
136,9,182,76,43,126,177,124,189,231,184,45,7,144,191,29,145,29,183,16,100,106,176,32,242,243,185,113,72,132,190,65,222,26,218,212,125,109,221,228,235,244,212,181,81,131,211,133,199,19,108,152,86,100,107,168,192,253,98,249,122,138,101,201,236,20,1,92,79,99,6,108,217,250,15,61,99,141,8,13,245,59,110,32,200,76,105,16,94,213,96,65,228,162,103,113,114,60,3,228,209,75,4,212,71,210,13,133,253,165,10,181,107,53,181,168,250,66,178,152,108,219,187,201,214,172,188,249,64,50,216,108,227,69,223,92,117,220,214,
13,207,171,209,61,89,38,217,48,172,81,222,0,58,200,215,81,128,191,208,97,22,33,180,244,181,86,179,196,35,207,186,149,153,184,189,165,15,40,2,184,158,95,5,136,8,198,12,217,178,177,11,233,36,47,111,124,135,88,104,76,17,193,97,29,171,182,102,45,61,118,220,65,144,1,219,113,6,152,210,32,188,239,213,16,42,113,177,133,137,6,182,181,31,159,191,228,165,232,184,212,51,120,7,201,162,15,0,249,52,150,9,168,142,225,14,152,24,127,106,13,187,8,109,61,45,145,100,108,151,230,99,92,1,107,107,81,244,28,108,97,98,133,
101,48,216,242,98,0,78,108,6,149,237,27,1,165,123,130,8,244,193,245,15,196,87,101,176,217,198,18,183,233,80,139,190,184,234,252,185,136,124,98,221,29,223,21,218,45,73,140,211,124,243,251,212,76,101,77,178,97,88,58,181,81,206,163,188,0,116,212,187,48,226,74,223,165,65,61,216,149,215,164,209,196,109,211,214,244,251,67,105,233,106,52,110,217,252,173,103,136,70,218,96,184,208,68,4,45,115,51,3,29,229,170,10,76,95,221,13,124,201,80,5,113,60,39,2,65,170,190,11,16,16,201,12,32,134,87,104,181,37,32,111,133,
179,185,102,212,9,206,97,228,159,94,222,249,14,41,217,201,152,176,208,152,34,199,215,168,180,89,179,61,23,46,180,13,129,183,189,92,59,192,186,108,173,237,184,131,32,154,191,179,182,3,182,226,12,116,177,210,154,234,213,71,57,157,210,119,175,4,219,38,21,115,220,22,131,227,99,11,18,148,100,59,132,13,109,106,62,122,106,90,168,228,14,207,11,147,9,255,157,10,0,174,39,125,7,158,177,240,15,147,68,135,8,163,210,30,1,242,104,105,6,194,254,247,98,87,93,128,101,103,203,25,108,54,113,110,107,6,231,254,212,27,
118,137,211,43,224,16,218,122,90,103,221,74,204,249,185,223,111,142,190,239,249,23,183,190,67,96,176,142,213,214,214,163,232,161,209,147,126,56,216,194,196,79,223,242,82,209,187,103,241,166,188,87,103,63,181,6,221,72,178,54,75,216,13,43,218,175,10,27,76,54,3,74,246,65,4,122,96,223,96,239,195,168,103,223,85,49,110,142,239,70,105,190,121,203,97,179,140,188,102,131,26,37,111,210,160,82,104,226,54,204,12,119,149,187,11,71,3,34,2,22,185,85,5,38,47,197,186,59,190,178,189,11,40,43,180,90,146,92,179,106,
4,194,215,255,167,181,208,207,49,44,217,158,139,91,222,174,29,155,100,194,176,236,99,242,38,117,106,163,156,2,109,147,10,156,9,6,169,235,14,54,63,114,7,103,133,5,0,87,19,149,191,74,130,226,184,122,20,123,177,43,174,12,182,27,56,146,210,142,155,229,213,190,13,124,220,239,183,11,219,223,33,134,211,210,212,241,212,226,66,104,221,179,248,31,218,131,110,129,190,22,205,246,185,38,91,111,176,119,225,24,183,71,119,136,8,90,230,255,15,106,112,102,6,59,202,17,1,11,92,143,101,158,255,248,98,174,105,97,107,255,
211,22,108,207,69,160,10,226,120,215,13,210,238,78,4,131,84,57,3,179,194,167,103,38,97,208,96,22,247,73,105,71,77,62,110,119,219,174,209,106,74,217,214,90,220,64,223,11,102,55,216,59,240,169,188,174,83,222,187,158,197,71,178,207,127,48,181,255,233,189,189,242,28,202,186,194,138,83,179,147,48,36,180,163,166,186,208,54,5,205,215,6,147,84,222,87,41,35,217,103,191,179,102,122,46,196,97,74,184,93,104,27,2,42,111,43,148,180,11,190,55,195,12,142,161,90,5,223,27,45,2,239,141,0,0,0,0,25,27,49,65,50,54,98,
130,43,45,83,195,100,108,197,4,125,119,244,69,86,90,167,134,79,65,150,199,200,217,138,8,209,194,187,73,250,239,232,138,227,244,217,203,172,181,79,12,181,174,126,77,158,131,45,142,135,152,28,207,74,194,18,81,83,217,35,16,120,244,112,211,97,239,65,146,46,174,215,85,55,181,230,20,28,152,181,215,5,131,132,150,130,27,152,89,155,0,169,24,176,45,250,219,169,54,203,154,230,119,93,93,255,108,108,28,212,65,63,223,205,90,14,158,149,132,36,162,140,159,21,227,167,178,70,32,190,169,119,97,241,232,225,166,232,243,
208,231,195,222,131,36,218,197,178,101,93,93,174,170,68,70,159,235,111,107,204,40,118,112,253,105,57,49,107,174,32,42,90,239,11,7,9,44,18,28,56,109,223,70,54,243,198,93,7,178,237,112,84,113,244,107,101,48,187,42,243,247,162,49,194,182,137,28,145,117,144,7,160,52,23,159,188,251,14,132,141,186,37,169,222,121,60,178,239,56,115,243,121,255,106,232,72,190,65,197,27,125,88,222,42,60,240,121,79,5,233,98,126,68,194,79,45,135,219,84,28,198,148,21,138,1,141,14,187,64,166,35,232,131,191,56,217,194,56,160,197,
13,33,187,244,76,10,150,167,143,19,141,150,206,92,204,0,9,69,215,49,72,110,250,98,139,119,225,83,202,186,187,93,84,163,160,108,21,136,141,63,214,145,150,14,151,222,215,152,80,199,204,169,17,236,225,250,210,245,250,203,147,114,98,215,92,107,121,230,29,64,84,181,222,89,79,132,159,22,14,18,88,15,21,35,25,36,56,112,218,61,35,65,155,101,253,107,167,124,230,90,230,87,203,9,37,78,208,56,100,1,145,174,163,24,138,159,226,51,167,204,33,42,188,253,96,173,36,225,175,180,63,208,238,159,18,131,45,134,9,178,108,
201,72,36,171,208,83,21,234,251,126,70,41,226,101,119,104,47,63,121,246,54,36,72,183,29,9,27,116,4,18,42,53,75,83,188,242,82,72,141,179,121,101,222,112,96,126,239,49,231,230,243,254,254,253,194,191,213,208,145,124,204,203,160,61,131,138,54,250,154,145,7,187,177,188,84,120,168,167,101,57,59,131,152,75,34,152,169,10,9,181,250,201,16,174,203,136,95,239,93,79,70,244,108,14,109,217,63,205,116,194,14,140,243,90,18,67,234,65,35,2,193,108,112,193,216,119,65,128,151,54,215,71,142,45,230,6,165,0,181,197,188,
27,132,132,113,65,138,26,104,90,187,91,67,119,232,152,90,108,217,217,21,45,79,30,12,54,126,95,39,27,45,156,62,0,28,221,185,152,0,18,160,131,49,83,139,174,98,144,146,181,83,209,221,244,197,22,196,239,244,87,239,194,167,148,246,217,150,213,174,7,188,233,183,28,141,168,156,49,222,107,133,42,239,42,202,107,121,237,211,112,72,172,248,93,27,111,225,70,42,46,102,222,54,225,127,197,7,160,84,232,84,99,77,243,101,34,2,178,243,229,27,169,194,164,48,132,145,103,41,159,160,38,228,197,174,184,253,222,159,249,214,
243,204,58,207,232,253,123,128,169,107,188,153,178,90,253,178,159,9,62,171,132,56,127,44,28,36,176,53,7,21,241,30,42,70,50,7,49,119,115,72,112,225,180,81,107,208,245,122,70,131,54,99,93,178,119,203,250,215,78,210,225,230,15,249,204,181,204,224,215,132,141,175,150,18,74,182,141,35,11,157,160,112,200,132,187,65,137,3,35,93,70,26,56,108,7,49,21,63,196,40,14,14,133,103,79,152,66,126,84,169,3,85,121,250,192,76,98,203,129,129,56,197,31,152,35,244,94,179,14,167,157,170,21,150,220,229,84,0,27,252,79,49,90,
215,98,98,153,206,121,83,216,73,225,79,23,80,250,126,86,123,215,45,149,98,204,28,212,45,141,138,19,52,150,187,82,31,187,232,145,6,160,217,208,94,126,243,236,71,101,194,173,108,72,145,110,117,83,160,47,58,18,54,232,35,9,7,169,8,36,84,106,17,63,101,43,150,167,121,228,143,188,72,165].concat([164,145,27,102,189,138,42,39,242,203,188,224,235,208,141,161,192,253,222,98,217,230,239,35,20,188,225,189,13,167,208,252,38,138,131,63,63,145,178,126,112,208,36,185,105,203,21,248,66,230,70,59,91,253,119,122,220,
101,107,181,197,126,90,244,238,83,9,55,247,72,56,118,184,9,174,177,161,18,159,240,138,63,204,51,147,36,253,114,0,0,0,0,1,194,106,55,3,132,212,110,2,70,190,89,7,9,168,220,6,203,194,235,4,141,124,178,5,79,22,133,14,19,81,184,15,209,59,143,13,151,133,214,12,85,239,225,9,26,249,100,8,216,147,83,10,158,45,10,11,92,71,61,28,38,163,112,29,228,201,71,31,162,119,30,30,96,29,41,27,47,11,172,26,237,97,155,24,171,223,194,25,105,181,245,18,53,242,200,19,247,152,255,17,177,38,166,16,115,76,145,21,60,90,20,20,254,
48,35,22,184,142,122,23,122,228,77,56,77,70,224,57,143,44,215,59,201,146,142,58,11,248,185,63,68,238,60,62,134,132,11,60,192,58,82,61,2,80,101,54,94,23,88,55,156,125,111,53,218,195,54,52,24,169,1,49,87,191,132,48,149,213,179,50,211,107,234,51,17,1,221,36,107,229,144,37,169,143,167,39,239,49,254,38,45,91,201,35,98,77,76,34,160,39,123,32,230,153,34,33,36,243,21,42,120,180,40,43,186,222,31,41,252,96,70,40,62,10,113,45,113,28,244,44,179,118,195,46,245,200,154,47,55,162,173,112,154,141,192,113,88,231,
247,115,30,89,174,114,220,51,153,119,147,37,28,118,81,79,43,116,23,241,114,117,213,155,69,126,137,220,120,127,75,182,79,125,13,8,22,124,207,98,33,121,128,116,164,120,66,30,147,122,4,160,202,123,198,202,253,108,188,46,176,109,126,68,135,111,56,250,222,110,250,144,233,107,181,134,108,106,119,236,91,104,49,82,2,105,243,56,53,98,175,127,8,99,109,21,63,97,43,171,102,96,233,193,81,101,166,215,212,100,100,189,227,102,34,3,186,103,224,105,141,72,215,203,32,73,21,161,23,75,83,31,78,74,145,117,121,79,222,99,
252,78,28,9,203,76,90,183,146,77,152,221,165,70,196,154,152,71,6,240,175,69,64,78,246,68,130,36,193,65,205,50,68,64,15,88,115,66,73,230,42,67,139,140,29,84,241,104,80,85,51,2,103,87,117,188,62,86,183,214,9,83,248,192,140,82,58,170,187,80,124,20,226,81,190,126,213,90,226,57,232,91,32,83,223,89,102,237,134,88,164,135,177,93,235,145,52,92,41,251,3,94,111,69,90,95,173,47,109,225,53,27,128,224,247,113,183,226,177,207,238,227,115,165,217,230,60,179,92,231,254,217,107,229,184,103,50,228,122,13,5,239,38,
74,56,238,228,32,15,236,162,158,86,237,96,244,97,232,47,226,228,233,237,136,211,235,171,54,138,234,105,92,189,253,19,184,240,252,209,210,199,254,151,108,158,255,85,6,169,250,26,16,44,251,216,122,27,249,158,196,66,248,92,174,117,243,0,233,72,242,194,131,127,240,132,61,38,241,70,87,17,244,9,65,148,245,203,43,163,247,141,149,250,246,79,255,205,217,120,93,96,216,186,55,87,218,252,137,14,219,62,227,57,222,113,245,188,223,179,159,139,221,245,33,210,220,55,75,229,215,107,12,216,214,169,102,239,212,239,216,
182,213,45,178,129,208,98,164,4,209,160,206,51,211,230,112,106,210,36,26,93,197,94,254,16,196,156,148,39,198,218,42,126,199,24,64,73,194,87,86,204,195,149,60,251,193,211,130,162,192,17,232,149,203,77,175,168,202,143,197,159,200,201,123,198,201,11,17,241,204,68,7,116,205,134,109,67,207,192,211,26,206,2,185,45,145,175,150,64,144,109,252,119,146,43,66,46,147,233,40,25,150,166,62,156,151,100,84,171,149,34,234,242,148,224,128,197,159,188,199,248,158,126,173,207,156,56,19,150,157,250,121,161,152,181,111,
36,153,119,5,19,155,49,187,74,154,243,209,125,141,137,53,48,140,75,95,7,142,13,225,94,143,207,139,105,138,128,157,236,139,66,247,219,137,4,73,130,136,198,35,181,131,154,100,136,130,88,14,191,128,30,176,230,129,220,218,209,132,147,204,84,133,81,166,99,135,23,24,58,134,213,114,13,169,226,208,160,168,32,186,151,170,102,4,206,171,164,110,249,174,235,120,124,175,41,18,75,173,111,172,18,172,173,198,37,167,241,129,24,166,51,235,47,164,117,85,118,165,183,63,65,160,248,41,196,161,58,67,243,163,124,253,170,
162,190,151,157,181,196,115,208,180,6,25,231,182,64,167,190,183,130,205,137,178,205,219,12,179,15,177,59,177,73,15,98,176,139,101,85,187,215,34,104,186,21,72,95,184,83,246,6,185,145,156,49,188,222,138,180,189,28,224,131,191,90,94,218,190,152,52,237,0,0,0,0,184,188,103,101,170,9,200,139,18,181,175,238,143,98,151,87,55,222,240,50,37,107,95,220,157,215,56,185,197,180,40,239,125,8,79,138,111,189,224,100,215,1,135,1,74,214,191,184,242,106,216,221,224,223,119,51,88,99,16,86,80,25,87,159,232,165,48,250,
250,16,159,20,66,172,248,113,223,123,192,200,103,199,167,173,117,114,8,67,205,206,111,38,149,173,127,112,45,17,24,21,63,164,183,251,135,24,208,158,26,207,232,39,162,115,143,66,176,198,32,172,8,122,71,201,160,50,175,62,24,142,200,91,10,59,103,181,178,135,0,208,47,80,56,105,151,236,95,12,133,89,240,226,61,229,151,135,101,134,135,209,221,58,224,180,207,143,79,90,119,51,40,63,234,228,16,134,82,88,119,227,64,237,216,13,248,81,191,104,240,43,248,161,72,151,159,196,90,34,48,42,226,158,87,79,127,73,111,246,
199,245,8,147,213,64,167,125,109,252,192,24,53,159,208,78,141,35,183,43,159,150,24,197,39,42,127,160,186,253,71,25,2,65,32,124,16,244,143,146,168,72,232,247,155,20,88,61,35,168,63,88,49,29,144,182,137,161,247,211,20,118,207,106,172,202,168,15,190,127,7,225,6,195,96,132,94,160,112,210,230,28,23,183,244,169,184,89,76,21,223,60,209,194,231,133,105,126,128,224,123,203,47,14,195,119,72,107,203,13,15,162,115,177,104,199,97,4,199,41,217,184,160,76,68,111,152,245,252,211,255,144,238,102,80,126,86,218,55,
27,14,185,39,77,182,5,64,40,164,176,239,198,28,12,136,163,129,219,176,26,57,103,215,127,43,210,120,145,147,110,31,244,59,38,247,3,131,154,144,102,145,47,63,136,41,147,88,237,180,68,96,84,12,248,7,49,30,77,168,223,166,241,207,186,254,146,223,236,70,46,184,137,84,155,23,103,236,39,112,2,113,240,72,187,201,76,47,222,219,249,128,48,99,69,231,85,107,63,160,156,211,131,199,249,193,54,104,23,121,138,15,114,228,93,55,203,92,225,80,174,78,84,255,64,246,232,152,37,174,139,136,115,22,55,239,22,4,130,64,248,
188,62,39,157,33,233,31,36,153,85,120,65,139,224,215,175,51,92,176,202,237,89,182,59,85,229,209,94,71,80,126,176,255,236,25,213,98,59,33,108,218,135,70,9,200,50,233,231,112,142,142,130,40,237,158,212,144,81,249,177,130,228,86,95,58,88,49,58,167,143,9,131,31,51,110,230,13,134,193,8,181,58,166,109,189,64,225,164,5,252,134,193,23,73,41,47,175,245,78,74,50,34,118,243,138,158,17,150,152,43,190,120,32,151,217,29,120,244,201,75,192,72,174,46,210,253,1,192,106,65,102,165,247,150,94,28,79,42,57,121,93,159,
150,151,229,35,241,242,77,107,25,5,245,215,126,96,231,98,209,142,95,222,182,235,194,9,142,82,122,181,233,55,104,0,70,217,208,188,33,188,136,223,49,234,48,99,86,143,34,214,249,97,154,106,158,4,7,189,166,189,191,1,193,216,173,180,110,54,21,8,9,83,29,114,78,154,165,206,41,255,183,123,134,17,15,199,225,116,146,16,217,205,42,172,190,168,56,25,17,70,128,165,118,35,216,198,102,117,96,122,1,16,114,207,174,254,202,115,201,155,87,164,241,34,239,24,150,71,253,173,57,169,69,17,94,204,118,77,238,6,206,241,137,
99,220,68,38,141,100,248,65,232,249,47,121,81,65,147,30,52,83,38,177,218,235,154,214,191,179,249,198,233,11,69,161,140,25,240,14,98,161,76,105,7,60,155,81,190,132,39,54,219,150,146,153,53,46,46,254,80,38,84,185,153,158,232,222,252,140,93,113,18,52,225,22,119,169,54,46,206,17,138,73,171,3,63,230,69,187,131,129,32,227,224,145,118,91,92,246,19,73,233,89,253,241,85,62,152,108,130,6,33,212,62,97,68,198,139,206,170,126,55,169,207,214,127,65,56,110,195,38,93,124,118,137,179,196,202,238,214,89,29,214,111,
225,161,177,10,243,20,30,228,75,168,121,129,19,203,105,215,171,119,14,178,185,194,161,92,1,126,198,57,156,169,254,128,36,21,153,229,54,160,54,11,142,28,81,110,134,102,22,167,62,218,113,194,44,111,222,44,148,211,185,73,9,4,129,240,177,184,230,149,163,13,73,123,27,177,46,30,67,210,62,72,251,110,89,45,233,219,246,195,81,103,145,166,204,176,169,31,116,12,206,122,102,185,97,148,222,5,6,241,0,0,0,0,0,0,0,0,4,0,0,0,4,0,4,0,8,0,4,0,2,0,0,0,4,0,5,0,16,0,8,0,2,0,0,0,4,0,6,0,32,0,32,0,2,0,0,0,4,0,4,0,16,0,16,
0,6,0,0,0,8,0,16,0,32,0,32,0,6,0,0,0,8,0,16,0,128,0,128,0,6,0,0,0,8,0,32,0,128,0,0,1,6,0,0,0,32,0,128,0,2,1,0,4,6,0,0,0,32,0,2,1,2,1,0,16,6,0,0,0,16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15,0,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,10,0,0,0,12,0,0,0,14,0,0,0,16,0,0,0,20,0,0,0,24,0,0,0,28,0,0,0,32,0,0,0,40,0,0,0,48,0,0,0,56,0,0,0,64,0,0,0,80,0,0,0,96,0,0,0,112,0,0,0,128,0,0,0,160,0,0,0,192,0,0,0,224,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,
0,0,0,6,0,0,0,8,0,0,0,12,0,0,0,16,0,0,0,24,0,0,0,32,0,0,0,48,0,0,0,64,0,0,0,96,0,0,0,128,0,0,0,192,0,0,0,0,1,0,0,128,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,6,0,0,0,8,0,0,0,12,0,0,0,16,0,0,0,24,0,0,0,32,0,0,0,48,0,0,0,64,0,0,0,96,0,0,105,110,118,97,108,105,100,32,99,111,100,101,32,108,101,110,103,116,104,115,32,115,101,116,0,0,0,0,0,0,0,0,49,46,50,46,56,0,0,0,105,110,99,111,109,112,97,116,105,98,108,101,32,118,101,114,115,105,111,110,0,0,0,0,116,111,111,32,109,97,110,121,32,108,101,110,103,116,104,32,111,
114,32,100,105,115,116,97,110,99,101,32,115,121,109,98,111,108,115,0,0,0,0,0,119,0,0,0,0,0,0,0,98,117,102,102,101,114,32,101,114,114,111,114,0,0,0,0,105,110,118,97,108,105,100,32,115,116,111,114,101,100,32,98,108,111,99,107,32,108,101,110,103,116,104,115,0,0,0,0,111,117,116,112,117,116,0,0,105,110,115,117,102,102,105,99,105,101,110,116,32,109,101,109,111,114,121,0,0,0,0,0,105,110,118,97,108,105,100,32,98,108,111,99,107,32,116,121,112,101,0,0,0,0,0,0,105,110,118,97,108,105,100,32,100,105,115,116,97,
110,99,101,32,116,111,111,32,102,97,114,32,98,97,99,107,0,0,0,114,0,0,0,0,0,0,0,100,97,116,97,32,101,114,114,111,114,0,0,0,0,0,0,104,101,97,100,101,114,32,99,114,99,32,109,105,115,109,97,116,99,104,0,0,0,0,0,105,110,112,117,116,0,0,0,115,116,114,101,97,109,32,101,114,114,111,114,0,0,0,0,117,110,107,110,111,119,110,32,104,101,97,100,101,114,32,102,108,97,103,115,32,115,101,116,0,0,0,0,0,0,0,0,110,101,101,100,32,100,105,99,116,105,111,110,97,114,121,0,114,101,116,32,61,61,32,90,95,83,84,82,69,65,77,
95,69,78,68,0,0,0,0,0,102,105,108,101,32,101,114,114,111,114,0,0,0,0,0,0,105,110,118,97,108,105,100,32,119,105,110,100,111,119,32,115,105,122,101,0,0,0,0,0,115,116,114,109,46,97,118,97,105,108,95,105,110,32,61,61,32,48,0,0,0,0,0,0,105,110,118,97,108,105,100,32,108,105,116,101,114,97,108,47,108,101,110,103,116,104,32,99,111,100,101,0,0,0,0,0,117,110,107,110,111,119,110,32,99,111,109,112,114,101,115,115,105,111,110,32,109,101,116,104,111,100,0,0,0,0,0,0,115,114,99,47,122,112,105,112,101,46,99,0,0,0,
0,0,105,110,99,111,114,114,101,99,116,32,108,101,110,103,116,104,32,99,104,101,99,107,0,0,105,110,99,111,114,114,101,99,116,32,100,97,116,97,32,99,104,101,99,107,0,0,0,0,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,32,99,111,100,101,0,0,0,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,32,116,111,111,32,102,97,114,32,98,97,99,107,0,0,0,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,32,99,111,100,101,0,0,0,115,116,114,101,97,109,32,101,110,100,0,0,0,0,0,0,105,
110,118,97,108,105,100,32,108,105,116,101,114,97,108,47,108,101,110,103,116,104,32,99,111,100,101,0,0,0,0,0,105,110,118,97,108,105,100,32,100,105,115,116,97,110,99,101,115,32,115,101,116,0,0,0,105,110,118,97,108,105,100,32,108,105,116,101,114,97,108,47,108,101,110,103,116,104,115,32,115,101,116,0,0,0,0,0,105,110,99,111,114,114,101,99,116,32,104,101,97,100,101,114,32,99,104,101,99,107,0,0,105,110,118,97,108,105,100,32,99,111,100,101,32,45,45,32,109,105,115,115,105,110,103,32,101,110,100,45,111,102,
45,98,108,111,99,107,0,0,0,0,105,110,118,97,108,105,100,32,98,105,116,32,108,101,110,103,116,104,32,114,101,112,101,97,116,0,0,0,0,0,0,0,114,101,116,32,33,61,32,90,95,83,84,82,69,65,77,95,69,82,82,79,82,0,0,0,49,46,50,46,53,0,0,0,0,1,2,3,4,5,6,7,8,8,9,9,10,10,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,16,16,16,16,17,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,
21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,28,0,1,2,3,4,4,5,5,6,
6,6,6,7,7,7,7,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,
14,14,14,14,14,14,14,14,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,0,0,16,17,18,18,19,19,20,20,20,20,21,21,21,21,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,
27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,105,110,102,0,0,0,0,0,
100,101,102,0,0,0,0,0]),"i8",Ja,8);var gb=ta(J(12,"i8",Ia),8);w(0==gb%8);
var O={Z:1,ha:2,xd:3,uc:4,O:5,La:6,Rb:7,Rc:8,B:9,ec:10,Y:11,Hd:11,rb:12,kb:13,pc:14,cd:15,cc:16,Ia:17,Id:18,Ja:19,dd:20,ga:21,q:22,Mc:23,qb:24,hd:25,Ed:26,qc:27,Zc:28,ja:29,ud:30,Fc:31,nd:32,mc:33,rd:34,Vc:42,sc:43,fc:44,wc:45,xc:46,yc:47,Ec:48,Fd:49,Pc:50,vc:51,kc:35,Sc:37,Wb:52,Zb:53,Jd:54,Nc:55,$b:56,ac:57,lc:35,bc:59,ad:60,Qc:61,Bd:62,$c:63,Wc:64,Xc:65,td:66,Tc:67,Ub:68,yd:69,gc:70,od:71,Hc:72,nc:73,Yb:74,jd:76,Xb:77,sd:78,zc:79,Ac:80,Dc:81,Cc:82,Bc:83,bd:38,Ka:39,Ic:36,va:40,wa:95,md:96,jc:104,
Oc:105,Vb:97,qd:91,fd:88,Yc:92,vd:108,ic:111,Sb:98,hc:103,Lc:101,Jc:100,Cd:110,rc:112,nb:113,ob:115,lb:114,mb:89,Gc:90,pd:93,wd:94,Tb:99,Kc:102,pb:106,ia:107,Dd:109,Gd:87,oc:122,zd:116,gd:95,Uc:123,tc:84,kd:75,dc:125,ed:131,ld:130,Ad:86},hb={"0":"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",
12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",
34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",
53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",
74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",
90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",
107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"},ib=0;function P(a){return I[ib>>2]=a}
function jb(a,b){for(var c=0,d=a.length-1;0<=d;d--){var f=a[d];"."===f?a.splice(d,1):".."===f?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c--;c)a.unshift("..");return a}function R(a){var b="/"===a.charAt(0),c="/"===a.substr(-1),a=jb(a.split("/").filter(function(a){return!!a}),!b).join("/");!a&&!b&&(a=".");a&&c&&(a+="/");return(b?"/":"")+a}function kb(a){if("/"===a)return"/";var b=a.lastIndexOf("/");return-1===b?a:a.substr(b+1)}
function lb(){for(var a="",b=l,c=arguments.length-1;-1<=c&&!b;c--){var d=0<=c?arguments[c]:"/";"string"!==typeof d&&e(new TypeError("Arguments to path.resolve must be strings"));d&&(a=d+"/"+a,b="/"===d.charAt(0))}a=jb(a.split("/").filter(function(a){return!!a}),!b).join("/");return(b?"/":"")+a||"."}var mb=[];function nb(a,b){mb[a]={input:[],S:[],ca:b};ob[a]={g:pb}}
var pb={open:function(a){var b=mb[a.e.ra];b||e(new S(O.Ja));a.F=b;a.seekable=l},close:function(a){a.F.S.length&&a.F.ca.qa(a.F,10)},D:function(a,b,c,d){(!a.F||!a.F.ca.Ya)&&e(new S(O.La));for(var f=0,g=0;g<d;g++){var i;try{i=a.F.ca.Ya(a.F)}catch(z){e(new S(O.O))}i===h&&0===f&&e(new S(O.Y));if(i===k||i===h)break;f++;b[c+g]=i}f&&(a.e.timestamp=Date.now());return f},write:function(a,b,c,d){(!a.F||!a.F.ca.qa)&&e(new S(O.La));for(var f=0;f<d;f++)try{a.F.ca.qa(a.F,b[c+f])}catch(g){e(new S(O.O))}d&&(a.e.timestamp=
Date.now());return f}},T={H:k,jb:1,ua:2,Ha:3,G:function(){return T.createNode(k,"/",16895,0)},createNode:function(a,b,c,d){(24576===(c&61440)||4096===(c&61440))&&e(new S(O.Z));T.H||(T.H={dir:{e:{N:T.k.N,A:T.k.A,aa:T.k.aa,R:T.k.R,R:T.k.R,rename:T.k.rename,hb:T.k.hb,gb:T.k.gb,eb:T.k.eb,ta:T.k.ta},I:{Q:T.g.Q}},file:{e:{N:T.k.N,A:T.k.A},I:{Q:T.g.Q,D:T.g.D,write:T.g.write,Oa:T.g.Oa,ab:T.g.ab}},link:{e:{N:T.k.N,A:T.k.A,sa:T.k.sa},I:{}},Ra:{e:{N:T.k.N,A:T.k.A},I:qb}});c=rb(a,b,c,d);16384===(c.mode&61440)?
(c.k=T.H.dir.e,c.g=T.H.dir.I,c.o={}):32768===(c.mode&61440)?(c.k=T.H.file.e,c.g=T.H.file.I,c.o=[],c.la=T.ua):40960===(c.mode&61440)?(c.k=T.H.link.e,c.g=T.H.link.I):8192===(c.mode&61440)&&(c.k=T.H.Ra.e,c.g=T.H.Ra.I);c.timestamp=Date.now();a&&(a.o[b]=c);return c},za:function(a){a.la!==T.ua&&(a.o=Array.prototype.slice.call(a.o),a.la=T.ua)},k:{N:function(a){var b={};b.Xd=8192===(a.mode&61440)?a.id:1;b.ce=a.id;b.mode=a.mode;b.he=1;b.uid=0;b.ae=0;b.ra=a.ra;b.size=16384===(a.mode&61440)?4096:32768===(a.mode&
61440)?a.o.length:40960===(a.mode&61440)?a.link.length:0;b.Rd=new Date(a.timestamp);b.ge=new Date(a.timestamp);b.Wd=new Date(a.timestamp);b.vb=4096;b.Td=Math.ceil(b.size/b.vb);return b},A:function(a,b){b.mode!==h&&(a.mode=b.mode);b.timestamp!==h&&(a.timestamp=b.timestamp);if(b.size!==h){T.za(a);var c=a.o;if(b.size<c.length)c.length=b.size;else for(;b.size>c.length;)c.push(0)}},aa:function(){e(sb[O.ha])},R:function(a,b,c,d){return T.createNode(a,b,c,d)},rename:function(a,b,c){if(16384===(a.mode&61440)){var d;
try{d=tb(b,c)}catch(f){}if(d)for(var g in d.o)e(new S(O.Ka))}delete a.parent.o[a.name];a.name=c;b.o[c]=a;a.parent=b},hb:function(a,b){delete a.o[b]},gb:function(a,b){var c=tb(a,b),d;for(d in c.o)e(new S(O.Ka));delete a.o[b]},eb:function(a){var b=[".",".."],c;for(c in a.o)a.o.hasOwnProperty(c)&&b.push(c);return b},ta:function(a,b,c){a=T.createNode(a,b,41471,0);a.link=c;return a},sa:function(a){40960!==(a.mode&61440)&&e(new S(O.q));return a.link}},g:{D:function(a,b,c,d,f){a=a.e.o;if(f>=a.length)return 0;
d=Math.min(a.length-f,d);w(0<=d);if(8<d&&a.subarray)b.set(a.subarray(f,f+d),c);else for(var g=0;g<d;g++)b[c+g]=a[f+g];return d},write:function(a,b,c,d,f,g){var i=a.e;i.timestamp=Date.now();a=i.o;if(d&&0===a.length&&0===f&&b.subarray)return g&&0===c?(i.o=b,i.la=b.buffer===F.buffer?T.jb:T.Ha):(i.o=new Uint8Array(b.subarray(c,c+d)),i.la=T.Ha),d;T.za(i);for(a=i.o;a.length<f;)a.push(0);for(g=0;g<d;g++)a[f+g]=b[c+g];return d},Q:function(a,b,c){1===c?b+=a.position:2===c&&32768===(a.e.mode&61440)&&(b+=a.e.o.length);
0>b&&e(new S(O.q));a.Ga=[];return a.position=b},Oa:function(a,b,c){T.za(a.e);a=a.e.o;for(b+=c;b>a.length;)a.push(0)},ab:function(a,b,c,d,f,g,i){32768!==(a.e.mode&61440)&&e(new S(O.Ja));a=a.e.o;if(!(i&2)&&(a.buffer===b||a.buffer===b.buffer))f=l,d=a.byteOffset;else{if(0<f||f+d<a.length)a=a.subarray?a.subarray(f,f+d):Array.prototype.slice.call(a,f,f+d);f=j;(d=Ka(d))||e(new S(O.rb));b.set(a,d)}return{ke:d,Qd:f}}}},ub=J(1,"i32*",Ia),vb=J(1,"i32*",Ia),wb=J(1,"i32*",Ia),xb=k,yb=[],ob=[k],U=[k],zb=1,V=k,
Ab=j,S=k,sb={};function Bb(a){a instanceof S||e(a+" : "+Ma());P(a.Ua)}
function W(a,b){a=lb("/",a);b=b||{Da:0};8<b.Da&&e(new S(O.va));for(var c=jb(a.split("/").filter(function(a){return!!a}),l),d=xb,f="/",g=0;g<c.length;g++){var i=g===c.length-1;if(i&&b.parent)break;d=tb(d,c[g]);f=R(f+"/"+c[g]);d.Hb&&(d=d.G.root);if(!i||b.$)for(i=0;40960===(d.mode&61440);){d=W(f,{$:l}).e;d.k.sa||e(new S(O.q));var d=d.k.sa(d),z=lb;var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(f).slice(1),f=r[0],r=r[1];!f&&!r?f=".":(r&&(r=r.substr(0,r.length-1)),f+=r);f=z(f,
d);d=W(f,{Da:b.Da}).e;40<i++&&e(new S(O.va))}}return{path:f,e:d}}function X(a){for(var b;;){if(a===a.parent)return a=a.G.Ib,!b?a:"/"!==a[a.length-1]?a+"/"+b:a+b;b=b?a.name+"/"+b:a.name;a=a.parent}}function Cb(a,b){for(var c=0,d=0;d<b.length;d++)c=(c<<5)-c+b.charCodeAt(d)|0;return(a+c>>>0)%V.length}function Db(a){var b=Cb(a.parent.id,a.name);if(V[b]===a)V[b]=a.T;else for(b=V[b];b;){if(b.T===a){b.T=a.T;break}b=b.T}}
function tb(a,b){var c=Eb(a,"x");c&&e(new S(c));for(c=V[Cb(a.id,b)];c;c=c.T){var d=c.name;if(c.parent.id===a.id&&d===b)return c}return a.k.aa(a,b)}
function rb(a,b,c,d){Fb||(Fb=function(a,b,c,d){this.id=zb++;this.name=b;this.mode=c;this.k={};this.g={};this.ra=d;this.G=this.parent=k;a||(a=this);this.parent=a;this.G=a.G;a=Cb(this.parent.id,this.name);this.T=V[a];V[a]=this},Fb.prototype={},Object.defineProperties(Fb.prototype,{D:{get:function(){return 365===(this.mode&365)},set:function(a){a?this.mode|=365:this.mode&=-366}},write:{get:function(){return 146===(this.mode&146)},set:function(a){a?this.mode|=146:this.mode&=-147}},Fb:{get:function(){return 16384===
(this.mode&61440)}},Eb:{get:function(){return 8192===(this.mode&61440)}}}));return new Fb(a,b,c,d)}var Gb={r:0,rs:1052672,"r+":2,w:577,wx:705,xw:705,"w+":578,"wx+":706,"xw+":706,a:1089,ax:1217,xa:1217,"a+":1090,"ax+":1218,"xa+":1218};function Hb(a){var b=Gb[a];"undefined"===typeof b&&e(Error("Unknown file open mode: "+a));return b}function Eb(a,b){return Ab?0:-1!==b.indexOf("r")&&!(a.mode&292)||-1!==b.indexOf("w")&&!(a.mode&146)||-1!==b.indexOf("x")&&!(a.mode&73)?O.kb:0}
function Ib(a,b){try{return tb(a,b),O.Ia}catch(c){}return Eb(a,"wx")}
function Jb(a,b,c){Kb||(Kb=m(),Kb.prototype={},Object.defineProperties(Kb.prototype,{object:{get:function(){return this.e},set:function(a){this.e=a}},ee:{get:function(){return 1!==(this.M&2097155)}},fe:{get:function(){return 0!==(this.M&2097155)}},de:{get:function(){return this.M&1024}}}));if(a.__proto__)a.__proto__=Kb.prototype;else{var d=new Kb,f;for(f in a)d[f]=a[f];a=d}var g;a:{b=b||1;for(c=c||4096;b<=c;b++)if(!U[b]){g=b;break a}e(new S(O.qb))}a.C=g;return U[g]=a}
var qb={open:function(a){a.g=ob[a.e.ra].g;a.g.open&&a.g.open(a)},Q:function(){e(new S(O.ja))}};function Lb(a,b){var c;b&&(c=W(b,{$:l}),b=c.path);var d={type:a,je:{},Ib:b,root:k},f=a.G(d);f.G=d;d.root=f;c&&(c.e.G=d,c.e.Hb=j,"/"===b&&(xb=d.root));yb.push(d);return f}function Mb(a,b,c){var d=W(a,{parent:j}).e,a=kb(a),f=Ib(d,a);f&&e(new S(f));d.k.R||e(new S(O.Z));return d.k.R(d,a,b,c)}function Nb(a,b){b=(b!==h?b:438)&4095;b|=32768;return Mb(a,b,0)}
function Ob(a,b){b=(b!==h?b:511)&1023;b|=16384;return Mb(a,b,0)}function Pb(a,b,c){"undefined"===typeof c&&(c=b,b=438);return Mb(a,b|8192,c)}function Qb(a,b){var c=W(b,{parent:j}).e,d=kb(b),f=Ib(c,d);f&&e(new S(f));c.k.ta||e(new S(O.Z));return c.k.ta(c,d,a)}function Rb(a,b){var c;c="string"===typeof a?W(a,{$:j}).e:a;c.k.A||e(new S(O.Z));c.k.A(c,{mode:b&4095|c.mode&-4096,timestamp:Date.now()})}
function Sb(a,b,c){var b="string"===typeof b?Hb(b):b,c=b&64?("undefined"===typeof c?438:c)&4095|32768:0,d;if("object"===typeof a)d=a;else{a=R(a);try{d=W(a,{$:!(b&131072)}).e}catch(f){}}b&64&&(d?b&128&&e(new S(O.Ia)):d=Mb(a,c,0));d||e(new S(O.ha));8192===(d.mode&61440)&&(b&=-513);d?40960===(d.mode&61440)?c=O.va:16384===(d.mode&61440)&&(0!==(b&2097155)||b&512)?c=O.ga:(c=["r","w","rw"][b&2097155],b&512&&(c+="w"),c=Eb(d,c)):c=O.ha;c&&e(new S(c));if(b&512){c=d;c="string"===typeof c?W(c,{$:j}).e:c;c.k.A||
e(new S(O.Z));16384===(c.mode&61440)&&e(new S(O.ga));32768!==(c.mode&61440)&&e(new S(O.q));var g=Eb(c,"w");g&&e(new S(g));c.k.A(c,{size:0,timestamp:Date.now()})}b&=-641;d=Jb({e:d,path:X(d),M:b,seekable:j,position:0,g:d.g,Ga:[],error:l},h,h);d.g.open&&d.g.open(d);p.logReadFiles&&!(b&1)&&(Tb||(Tb={}),a in Tb||(Tb[a]=1,p.printErr("read file: "+a)));return d}function Ub(a){try{a.g.close&&a.g.close(a)}catch(b){e(b)}finally{U[a.C]=k}}
function Vb(a,b,c,d){var f=F;(0>c||0>d)&&e(new S(O.q));1===(a.M&2097155)&&e(new S(O.B));16384===(a.e.mode&61440)&&e(new S(O.ga));a.g.D||e(new S(O.q));var g=j;"undefined"===typeof d?(d=a.position,g=l):a.seekable||e(new S(O.ja));b=a.g.D(a,f,b,c,d);g||(a.position+=b);return b}
function Wb(a,b,c,d,f,g){(0>d||0>f)&&e(new S(O.q));0===(a.M&2097155)&&e(new S(O.B));16384===(a.e.mode&61440)&&e(new S(O.ga));a.g.write||e(new S(O.q));var i=j;"undefined"===typeof f?(f=a.position,i=l):a.seekable||e(new S(O.ja));a.M&1024&&((!a.seekable||!a.g.Q)&&e(new S(O.ja)),a.g.Q(a,0,2));b=a.g.write(a,b,c,d,f,g);i||(a.position+=b);return b}
function Xb(){S||(S=function(a){this.Ua=a;for(var b in O)if(O[b]===a){this.code=b;break}this.message=hb[a];this.stack=Ma()},S.prototype=Error(),[O.ha].forEach(function(a){sb[a]=new S(a);sb[a].stack="<generic error, no stack>"}))}var Yb;function Zb(a,b){var c=0;a&&(c|=365);b&&(c|=146);return c}function $b(a,b,c,d){a=R(("string"===typeof a?a:X(a))+"/"+b);return Nb(a,Zb(c,d))}
function ac(a,b,c,d,f,g){a=b?R(("string"===typeof a?a:X(a))+"/"+b):a;d=Zb(d,f);f=Nb(a,d);if(c){if("string"===typeof c){for(var a=Array(c.length),b=0,i=c.length;b<i;++b)a[b]=c.charCodeAt(b);c=a}Rb(f,d|146);a=Sb(f,"w");Wb(a,c,0,c.length,0,g);Ub(a);Rb(f,d)}return f}
function bc(a,b,c,d){a=R(("string"===typeof a?a:X(a))+"/"+b);b=Zb(!!c,!!d);bc.$a||(bc.$a=64);var f;f=bc.$a++<<8|0;ob[f]={g:{open:function(a){a.seekable=l},close:function(){d&&(d.buffer&&d.buffer.length)&&d(10)},D:function(a,b,d,f){for(var t=0,D=0;D<f;D++){var A;try{A=c()}catch(n){e(new S(O.O))}A===h&&0===t&&e(new S(O.Y));if(A===k||A===h)break;t++;b[d+D]=A}t&&(a.e.timestamp=Date.now());return t},write:function(a,b,c,f){for(var t=0;t<f;t++)try{d(b[c+t])}catch(D){e(new S(O.O))}f&&(a.e.timestamp=Date.now());
return t}}};return Pb(a,b,f)}function cc(a){if(a.Eb||a.Fb||a.link||a.o)return j;var b=j;"undefined"!==typeof XMLHttpRequest&&e(Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."));if(p.read)try{a.o=C(p.read(a.url),j)}catch(c){b=l}else e(Error("Cannot load without read() or XMLHttpRequest."));b||P(O.O);return b}
var Fb,Kb,Tb,Y={G:function(){return rb(k,"/",16895,0)},yb:function(a,b,c){c&&w(1==b==(6==c));a={Bb:a,type:b,protocol:c,p:k,da:{},Ba:[],U:[],W:Y.u};b=Y.pa();c=rb(Y.root,b,49152,0);c.V=a;b=Jb({path:b,e:c,M:Hb("r+"),seekable:l,g:Y.g});a.I=b;return a},Wa:function(a){a=U[a];return!a||49152!==(a.e.mode&49152)?k:a.e.V},g:{cb:function(a){a=a.e.V;return a.W.cb(a)},Za:function(a,b,c){a=a.e.V;return a.W.Za(a,b,c)},D:function(a,b,c,d){a=a.e.V;d=a.W.Kb(a,d);if(!d)return 0;b.set(d.buffer,c);return d.buffer.length},
write:function(a,b,c,d){a=a.e.V;return a.W.Mb(a,b,c,d)},close:function(a){a=a.e.V;a.W.close(a)}},pa:function(){Y.pa.Ta||(Y.pa.Ta=0);return"socket["+Y.pa.Ta++ +"]"},u:{ma:function(a,b,c){var d;"object"===typeof b&&(d=b,c=b=k);if(d)d.Ma?(b=d.Ma.le,c=d.Ma.me):((c=/ws[s]?:\/\/([^:]+):(\d+)/.exec(d.url))||e(Error("WebSocket URL must be in the format ws(s)://address:port")),b=c[1],c=parseInt(c[2],10));else try{var f=s?{headers:{"websocket-protocol":["binary"]}}:["binary"];d=new (s?require("ws"):window.WebSocket)("ws://"+
b+":"+c,f);d.binaryType="arraybuffer"}catch(g){e(new S(O.nb))}b={J:b,port:c,n:d,na:[]};Y.u.Na(a,b);Y.u.Db(a,b);2===a.type&&"undefined"!==typeof a.X&&b.na.push(new Uint8Array([255,255,255,255,112,111,114,116,(a.X&65280)>>8,a.X&255]));return b},oa:function(a,b,c){return a.da[b+":"+c]},Na:function(a,b){a.da[b.J+":"+b.port]=b},fb:function(a,b){delete a.da[b.J+":"+b.port]},Db:function(a,b){function c(){try{for(var a=b.na.shift();a;)b.n.send(a),a=b.na.shift()}catch(c){b.n.close()}}function d(c){w("string"!==
typeof c&&c.byteLength!==h);var c=new Uint8Array(c),d=f;f=l;d&&10===c.length&&255===c[0]&&255===c[1]&&255===c[2]&&255===c[3]&&112===c[4]&&111===c[5]&&114===c[6]&&116===c[7]?(c=c[8]<<8|c[9],Y.u.fb(a,b),b.port=c,Y.u.Na(a,b)):a.U.push({J:b.J,port:b.port,data:c})}var f=j;s?(b.n.ba("open",c),b.n.ba("message",function(a,b){b.Sd&&d((new Uint8Array(a)).buffer)}),b.n.ba("error",m())):(b.n.onopen=c,b.n.onmessage=function(a){d(a.data)})},cb:function(a){if(1===a.type&&a.p)return a.Ba.length?65:0;var b=0,c=1===
a.type?Y.u.oa(a,a.K,a.L):k;if(a.U.length||!c||c&&c.n.readyState===c.n.fa||c&&c.n.readyState===c.n.CLOSED)b|=65;if(!c||c&&c.n.readyState===c.n.OPEN)b|=4;if(c&&c.n.readyState===c.n.fa||c&&c.n.readyState===c.n.CLOSED)b|=16;return b},Za:function(a,b,c){switch(b){case 21531:return b=0,a.U.length&&(b=a.U[0].data.length),I[c>>2]=b,0;default:return O.q}},close:function(a){if(a.p){try{a.p.close()}catch(b){}a.p=k}for(var c=Object.keys(a.da),d=0;d<c.length;d++){var f=a.da[c[d]];try{f.n.close()}catch(g){}Y.u.fb(a,
f)}return 0},bind:function(a,b,c){("undefined"!==typeof a.Fa||"undefined"!==typeof a.X)&&e(new S(O.q));a.Fa=b;a.X=c||h();if(2===a.type){a.p&&(a.p.close(),a.p=k);try{a.W.Gb(a,0)}catch(d){d instanceof S||e(d),d.Ua!==O.wa&&e(d)}}},Vd:function(a,b,c){a.p&&e(new S(ERRNO_CODS.wa));if("undefined"!==typeof a.K&&"undefined"!==typeof a.L){var d=Y.u.oa(a,a.K,a.L);d&&(d.n.readyState===d.n.CONNECTING&&e(new S(O.lb)),e(new S(O.pb)))}b=Y.u.ma(a,b,c);a.K=b.J;a.L=b.port;e(new S(O.ob))},Gb:function(a){s||e(new S(O.wa));
a.p&&e(new S(O.q));var b=require("ws").Kd;a.p=new b({host:a.Fa,port:a.X});a.p.ba("connection",function(b){if(1===a.type){var d=Y.yb(a.Bb,a.type,a.protocol),b=Y.u.ma(d,b);d.K=b.J;d.L=b.port;a.Ba.push(d)}else Y.u.ma(a,b)});a.p.ba("closed",function(){a.p=k});a.p.ba("error",m())},accept:function(a){a.p||e(new S(O.q));var b=a.Ba.shift();b.I.M=a.I.M;return b},$d:function(a,b){var c,d;b?((a.K===h||a.L===h)&&e(new S(O.ia)),c=a.K,d=a.L):(c=a.Fa||0,d=a.X||0);return{J:c,port:d}},Mb:function(a,b,c,d,f,g){if(2===
a.type){if(f===h||g===h)f=a.K,g=a.L;(f===h||g===h)&&e(new S(O.mb))}else f=a.K,g=a.L;var i=Y.u.oa(a,f,g);1===a.type&&((!i||i.n.readyState===i.n.fa||i.n.readyState===i.n.CLOSED)&&e(new S(O.ia)),i.n.readyState===i.n.CONNECTING&&e(new S(O.Y)));b=b instanceof Array||b instanceof ArrayBuffer?b.slice(c,c+d):b.buffer.slice(b.byteOffset+c,b.byteOffset+c+d);if(2===a.type&&(!i||i.n.readyState!==i.n.OPEN)){if(!i||i.n.readyState===i.n.fa||i.n.readyState===i.n.CLOSED)i=Y.u.ma(a,f,g);i.na.push(b);return d}try{return i.n.send(b),
d}catch(z){e(new S(O.q))}},Kb:function(a,b){1===a.type&&a.p&&e(new S(O.ia));var c=a.U.shift();if(!c){if(1===a.type){var d=Y.u.oa(a,a.K,a.L);if(d){if(d.n.readyState===d.n.fa||d.n.readyState===d.n.CLOSED)return k;e(new S(O.Y))}e(new S(O.ia))}e(new S(O.Y))}var d=c.data.byteLength||c.data.length,f=c.data.byteOffset||0,g=c.data.buffer||c.data,i=Math.min(b,d),z={buffer:new Uint8Array(g,f,i),J:c.J,port:c.port};1===a.type&&i<d&&(c.data=new Uint8Array(g,f+i,d-i),a.U.unshift(c));return z}}};
function dc(a,b,c){a=U[a];if(!a)return P(O.B),-1;try{return Vb(a,b,c)}catch(d){return Bb(d),-1}}function ec(a,b,c){a=U[a];if(!a)return P(O.B),-1;try{return Wb(a,F,b,c)}catch(d){return Bb(d),-1}}function fc(a,b,c){c=I[c>>2];a=E(a);try{return Sb(a,b,c).C}catch(d){return Bb(d),-1}}function gc(a){a=U[a];if(!a)return P(O.B),-1;try{return Ub(a),0}catch(b){return Bb(b),-1}}function hc(a){if(U[a])return 0;P(O.B);return-1}p._memset=ic;p._memcpy=jc;
function kc(a){kc.wb||(y=y+4095&-4096,kc.wb=j,w(ra),kc.ub=ra,ra=function(){B("cannot dynamically allocate, sbrk now has control")});var b=y;0!=a&&kc.ub(a);return b}p._strlen=lc;var mc=l,nc=l,oc=l,pc=l,qc=h,rc=h;function sc(a){return{jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",bmp:"image/bmp",ogg:"audio/ogg",wav:"audio/wav",mp3:"audio/mpeg"}[a.substr(a.lastIndexOf(".")+1)]}var tc=[];function uc(){var a=p.canvas;tc.forEach(function(b){b(a.width,a.height)})}
function vc(){var a=p.canvas;this.Qb=a.width;this.Pb=a.height;a.width=screen.width;a.height=screen.height;"undefined"!=typeof SDL&&(a=Oa[SDL.screen+0*la>>2],I[SDL.screen+0*la>>2]=a|8388608);uc()}function wc(){var a=p.canvas;a.width=this.Qb;a.height=this.Pb;"undefined"!=typeof SDL&&(a=Oa[SDL.screen+0*la>>2],I[SDL.screen+0*la>>2]=a&-8388609);uc()}var xc,yc,zc,Ac;Xb();V=Array(4096);xb=rb(k,"/",16895,0);Lb(T,"/");Ob("/tmp");Ob("/dev");ob[259]={g:{D:function(){return 0},write:function(){return 0}}};
Pb("/dev/null",259);nb(1280,{Ya:function(a){if(!a.input.length){var b=k;if(s){if(b=process.stdin.read(),!b){if(process.stdin._readableState&&process.stdin._readableState.ended)return k;return}}else"undefined"!=typeof window&&"function"==typeof window.prompt?(b=window.prompt("Input: "),b!==k&&(b+="\n")):"function"==typeof readline&&(b=readline(),b!==k&&(b+="\n"));if(!b)return k;a.input=C(b,j)}return a.input.shift()},qa:function(a,b){b===k||10===b?(p.print(a.S.join("")),a.S=[]):a.S.push(Bc.Ca(b))}});
nb(1536,{qa:function(a,b){b===k||10===b?(p.printErr(a.S.join("")),a.S=[]):a.S.push(Bc.Ca(b))}});Pb("/dev/tty",1280);Pb("/dev/tty1",1536);Ob("/dev/shm");Ob("/dev/shm/tmp");
M.unshift({P:function(){if(!p.noFSInit&&!Yb){w(!Yb,"FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");Yb=j;Xb();p.stdin=p.stdin;p.stdout=p.stdout;p.stderr=p.stderr;p.stdin?bc("/dev","stdin",p.stdin):Qb("/dev/tty","/dev/stdin");p.stdout?bc("/dev","stdout",k,p.stdout):Qb("/dev/tty","/dev/stdout");p.stderr?bc("/dev","stderr",k,p.stderr):Qb("/dev/tty1","/dev/stderr");var a=Sb("/dev/stdin",
"r");I[ub>>2]=a.C;w(1===a.C,"invalid handle for stdin ("+a.C+")");a=Sb("/dev/stdout","w");I[vb>>2]=a.C;w(2===a.C,"invalid handle for stdout ("+a.C+")");a=Sb("/dev/stderr","w");I[wb>>2]=a.C;w(3===a.C,"invalid handle for stderr ("+a.C+")")}}});Va.push({P:function(){Ab=l}});Wa.push({P:function(){Yb=l;for(var a=0;a<U.length;a++){var b=U[a];b&&Ub(b)}}});p.FS_createFolder=function(a,b,c,d){a=R(("string"===typeof a?a:X(a))+"/"+b);return Ob(a,Zb(c,d))};
p.FS_createPath=function(a,b){for(var a="string"===typeof a?a:X(a),c=b.split("/").reverse();c.length;){var d=c.pop();if(d){var f=R(a+"/"+d);try{Ob(f)}catch(g){}a=f}}return f};p.FS_createDataFile=ac;
p.FS_createPreloadedFile=function(a,b,c,d,f,g,i,z,r){function t(){oc=document.pointerLockElement===n||document.mozPointerLockElement===n||document.webkitPointerLockElement===n}function D(c){function t(c){z||ac(a,b,c,d,f,r);g&&g();eb()}var n=l;p.preloadPlugins.forEach(function(a){!n&&a.canHandle(u)&&(a.handle(c,u,t,function(){i&&i();eb()}),n=j)});n||t(c)}p.preloadPlugins||(p.preloadPlugins=[]);if(!xc&&!ca){xc=j;try{new Blob,yc=j}catch(A){yc=l,console.log("warning: no blob constructor, cannot create blobs with mimetypes")}zc=
"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:!yc?console.log("warning: no BlobBuilder"):k;Ac="undefined"!=typeof window?window.URL?window.URL:window.webkitURL:h;!p.bb&&"undefined"===typeof Ac&&(console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."),p.bb=j);p.preloadPlugins.push({canHandle:function(a){return!p.bb&&/\.(jpg|jpeg|png|bmp)$/i.test(a)},handle:function(a,b,
c,d){var f=k;if(yc)try{f=new Blob([a],{type:sc(b)}),f.size!==a.length&&(f=new Blob([(new Uint8Array(a)).buffer],{type:sc(b)}))}catch(g){var i="Blob constructor present but fails: "+g+"; falling back to blob builder";na||(na={});na[i]||(na[i]=1,p.ea(i))}f||(f=new zc,f.append((new Uint8Array(a)).buffer),f=f.getBlob());var t=Ac.createObjectURL(f),n=new Image;n.onload=function(){w(n.complete,"Image "+b+" could not be decoded");var d=document.createElement("canvas");d.width=n.width;d.height=n.height;d.getContext("2d").drawImage(n,
0,0);p.preloadedImages[b]=d;Ac.revokeObjectURL(t);c&&c(a)};n.onerror=function(){console.log("Image "+t+" could not be decoded");d&&d()};n.src=t}});p.preloadPlugins.push({canHandle:function(a){return!p.ie&&a.substr(-4)in{".ogg":1,".wav":1,".mp3":1}},handle:function(a,b,c,d){function f(d){i||(i=j,p.preloadedAudios[b]=d,c&&c(a))}function g(){i||(i=j,p.preloadedAudios[b]=new Audio,d&&d())}var i=l;if(yc){try{var n=new Blob([a],{type:sc(b)})}catch(t){return g()}var n=Ac.createObjectURL(n),u=new Audio;u.addEventListener("canplaythrough",
function(){f(u)},l);u.onerror=function(){if(!i){console.log("warning: browser could not fully decode audio "+b+", trying slower base64 approach");for(var c="",d=0,g=0,n=0;n<a.length;n++){d=d<<8|a[n];for(g+=8;6<=g;)var t=d>>g-6&63,g=g-6,c=c+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[t]}2==g?(c+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(d&3)<<4],c+="=="):4==g&&(c+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(d&15)<<2],c+="=");
u.src="data:audio/x-"+b.substr(-3)+";base64,"+c;f(u)}};u.src=n;setTimeout(function(){va||f(u)},1E4)}else return g()}});var n=p.canvas;n.Ea=n.requestPointerLock||n.mozRequestPointerLock||n.webkitRequestPointerLock;n.Va=document.exitPointerLock||document.mozExitPointerLock||document.webkitExitPointerLock||m();n.Va=n.Va.bind(document);document.addEventListener("pointerlockchange",t,l);document.addEventListener("mozpointerlockchange",t,l);document.addEventListener("webkitpointerlockchange",t,l);p.elementPointerLock&&
n.addEventListener("click",function(a){!oc&&n.Ea&&(n.Ea(),a.preventDefault())},l)}var u=b?lb(R(a+"/"+b)):a;db();if("string"==typeof c){var H=i,ka=function(){H?H():e('Loading data file "'+c+'" failed.')},Q=new XMLHttpRequest;Q.open("GET",c,j);Q.responseType="arraybuffer";Q.onload=function(){if(200==Q.status||0==Q.status&&Q.response){var a=Q.response;w(a,'Loading data file "'+c+'" failed (no arrayBuffer).');a=new Uint8Array(a);D(a);eb()}else ka()};Q.onerror=ka;Q.send(k);db()}else D(c)};
p.FS_createLazyFile=function(a,b,c,d,f){var g,i;"undefined"!==typeof XMLHttpRequest?(ca||e("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc"),g=function(){this.Aa=l;this.ka=[]},g.prototype.get=function(a){if(!(a>this.length-1||0>a)){var b=a%this.xb;return this.Cb(Math.floor(a/this.xb))[b]}},g.prototype.Nb=function(a){this.Cb=a},g.prototype.Pa=function(){var a=new XMLHttpRequest;a.open("HEAD",c,l);a.send(k);200<=a.status&&300>a.status||
304===a.status||e(Error("Couldn't load "+c+". Status: "+a.status));var b=Number(a.getResponseHeader("Content-length")),d,f=1048576;if(!((d=a.getResponseHeader("Accept-Ranges"))&&"bytes"===d))f=b;var g=this;g.Nb(function(a){var d=a*f,i=(a+1)*f-1,i=Math.min(i,b-1);if("undefined"===typeof g.ka[a]){var t=g.ka;d>i&&e(Error("invalid range ("+d+", "+i+") or no bytes requested!"));i>b-1&&e(Error("only "+b+" bytes available! programmer error!"));var r=new XMLHttpRequest;r.open("GET",c,l);b!==f&&r.setRequestHeader("Range",
"bytes="+d+"-"+i);"undefined"!=typeof Uint8Array&&(r.responseType="arraybuffer");r.overrideMimeType&&r.overrideMimeType("text/plain; charset=x-user-defined");r.send(k);200<=r.status&&300>r.status||304===r.status||e(Error("Couldn't load "+c+". Status: "+r.status));d=r.response!==h?new Uint8Array(r.response||[]):C(r.responseText||"",j);t[a]=d}"undefined"===typeof g.ka[a]&&e(Error("doXHR failed!"));return g.ka[a]});this.tb=b;this.sb=f;this.Aa=j},g=new g,Object.defineProperty(g,"length",{get:function(){this.Aa||
this.Pa();return this.tb}}),Object.defineProperty(g,"chunkSize",{get:function(){this.Aa||this.Pa();return this.sb}}),i=h):(i=c,g=h);var z=$b(a,b,d,f);g?z.o=g:i&&(z.o=k,z.url=i);var r={};Object.keys(z.g).forEach(function(a){var b=z.g[a];r[a]=function(){cc(z)||e(new S(O.O));return b.apply(k,arguments)}});r.D=function(a,b,c,d,f){cc(z)||e(new S(O.O));a=a.e.o;if(f>=a.length)return 0;d=Math.min(a.length-f,d);w(0<=d);if(a.slice)for(var g=0;g<d;g++)b[c+g]=a[f+g];else for(g=0;g<d;g++)b[c+g]=a.get(f+g);return d};
z.g=r;return z};p.FS_createLink=function(a,b,c){a=R(("string"===typeof a?a:X(a))+"/"+b);return Qb(c,a)};p.FS_createDevice=bc;ib=qa(4);I[ib>>2]=0;M.unshift({P:m()});Wa.push({P:m()});var Bc=new oa;s&&(require("fs"),process.platform.match(/^win/));M.push({P:function(){Y.root=Lb(Y,k)}});
p.requestFullScreen=function(a,b){function c(){nc=l;(document.webkitFullScreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.mozFullscreenElement||document.fullScreenElement||document.fullscreenElement)===d?(d.Qa=document.cancelFullScreen||document.mozCancelFullScreen||document.webkitCancelFullScreen,d.Qa=d.Qa.bind(document),qc&&d.Ea(),nc=j,rc&&vc()):rc&&wc();if(p.onFullScreen)p.onFullScreen(nc)}qc=a;rc=b;"undefined"===typeof qc&&(qc=j);"undefined"===typeof rc&&
(rc=l);var d=p.canvas;pc||(pc=j,document.addEventListener("fullscreenchange",c,l),document.addEventListener("mozfullscreenchange",c,l),document.addEventListener("webkitfullscreenchange",c,l));d.Lb=d.requestFullScreen||d.mozRequestFullScreen||(d.webkitRequestFullScreen?function(){d.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)}:k);d.Lb()};
p.requestAnimationFrame=function(a){"undefined"===typeof window?setTimeout(a,1E3/60):(window.requestAnimationFrame||(window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame||window.setTimeout),window.requestAnimationFrame(a))};p.setCanvasSize=function(a,b,c){var d=p.canvas;d.width=a;d.height=b;c||uc()};p.pauseMainLoop=m();p.resumeMainLoop=function(){mc&&(mc=l,k())};
p.getUserMedia=function(){window.Xa||(window.Xa=navigator.getUserMedia||navigator.mozGetUserMedia);window.Xa(h)};Qa=v=ta(x);Ra=Qa+5242880;Sa=y=ta(Ra);w(Sa<sa);Da=Math.min;
var Z=(function(global,env,buffer) {
// EMSCRIPTEN_START_ASM
"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=+env.NaN;var n=+env.Infinity;var o=0;var p=0;var q=0;var r=0;var s=0,t=0,u=0,v=0,w=0.0,x=0,y=0,z=0,A=0.0;var B=0;var C=0;var D=0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=global.Math.floor;var M=global.Math.abs;var N=global.Math.sqrt;var O=global.Math.pow;var P=global.Math.cos;var Q=global.Math.sin;var R=global.Math.tan;var S=global.Math.acos;var T=global.Math.asin;var U=global.Math.atan;var V=global.Math.atan2;var W=global.Math.exp;var X=global.Math.log;var Y=global.Math.ceil;var Z=global.Math.imul;var _=env.abort;var $=env.assert;var aa=env.asmPrintInt;var ab=env.asmPrintFloat;var ac=env.min;var ad=env.invoke_ii;var ae=env.invoke_vi;var af=env.invoke_vii;var ag=env.invoke_iiii;var ah=env.invoke_v;var ai=env.invoke_iii;var aj=env.___assert_fail;var ak=env._fread;var al=env._fclose;var am=env._abort;var an=env._pread;var ao=env._close;var ap=env._fflush;var aq=env._fopen;var ar=env._open;var as=env._sysconf;var at=env.___setErrNo;var au=env._feof;var av=env._send;var aw=env._write;var ax=env._read;var ay=env._ferror;var az=env._time;var aA=env._recv;var aB=env._pwrite;var aC=env._sbrk;var aD=env._fsync;var aE=env.___errno_location;var aF=env._fwrite;var aG=0.0;
// EMSCRIPTEN_START_FUNCS
function aN(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+7&-8;return b|0}function aO(){return i|0}function aP(a){a=a|0;i=a}function aQ(a,b){a=a|0;b=b|0;if((o|0)==0){o=a;p=b}}function aR(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0]}function aS(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0];a[k+4|0]=a[b+4|0];a[k+5|0]=a[b+5|0];a[k+6|0]=a[b+6|0];a[k+7|0]=a[b+7|0]}function aT(a){a=a|0;B=a}function aU(a){a=a|0;C=a}function aV(a){a=a|0;D=a}function aW(a){a=a|0;E=a}function aX(a){a=a|0;F=a}function aY(a){a=a|0;G=a}function aZ(a){a=a|0;H=a}function a_(a){a=a|0;I=a}function a$(a){a=a|0;J=a}function a0(a){a=a|0;K=a}function a1(){}function a2(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;j=i;i=i+56|0;k=j|0;c[k+32>>2]=0;c[k+36>>2]=0;c[k+40>>2]=0;l=a6(k,d,8,e*15|0,9,0,13656,56)|0;if((l|0)!=0){m=l;i=j;return m|0}l=k+4|0;e=k|0;d=k+16|0;n=k+12|0;L4:while(1){c[l>>2]=ak(f|0,1,h|0,a|0)|0;if((ay(a|0)|0)!=0){o=4;break}p=(au(a|0)|0)!=0;q=p?4:0;c[e>>2]=f;do{c[d>>2]=h;c[n>>2]=g;r=bc(k,q)|0;if((r|0)==-2){o=7;break L4}s=h-(c[d>>2]|0)|0;if((aF(g|0,1,s|0,b|0)|0)!=(s|0)){o=10;break L4}if((ay(b|0)|0)!=0){o=10;break L4}}while((c[d>>2]|0)==0);if((c[l>>2]|0)!=0){o=13;break}if(p){o=15;break}}if((o|0)==4){a7(k)|0;m=-1;i=j;return m|0}else if((o|0)==7){aj(13632,13288,59,14440);return 0}else if((o|0)==10){a7(k)|0;m=-1;i=j;return m|0}else if((o|0)==13){aj(13200,13288,66,14440);return 0}else if((o|0)==15){if((r|0)!=1){aj(13136,13288,70,14440);return 0}a7(k)|0;m=0;i=j;return m|0}return 0}function a3(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;h=i;i=i+56|0;j=h|0;c[j+32>>2]=0;c[j+36>>2]=0;c[j+40>>2]=0;k=j+4|0;c[k>>2]=0;l=j|0;c[l>>2]=0;m=bp(j,d*15|0,13656,56)|0;if((m|0)!=0){n=m;i=h;return n|0}m=j+16|0;d=j+12|0;o=0;L30:while(1){p=ak(e|0,1,g|0,a|0)|0;c[k>>2]=p;if((ay(a|0)|0)!=0){q=26;break}if((p|0)==0){r=o;q=38;break}c[l>>2]=e;do{c[m>>2]=g;c[d>>2]=f;s=bq(j,0)|0;if((s|0)==(-2|0)){q=30;break L30}else if((s|0)==(-3|0)|(s|0)==(-4|0)){q=31;break L30}else if((s|0)==2){t=-3;break L30}p=g-(c[m>>2]|0)|0;if((aF(f|0,1,p|0,b|0)|0)!=(p|0)){q=35;break L30}if((ay(b|0)|0)!=0){q=35;break L30}}while((c[m>>2]|0)==0);if((s|0)==1){r=1;q=38;break}else{o=s}}if((q|0)==30){aj(13632,13288,115,14432);return 0}else if((q|0)==31){t=s}else if((q|0)==35){bt(j)|0;n=-1;i=h;return n|0}else if((q|0)==38){bt(j)|0;n=(r|0)==1?0:-3;i=h;return n|0}else if((q|0)==26){bt(j)|0;n=-1;i=h;return n|0}bt(j)|0;n=t;i=h;return n|0}function a4(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0;d=bX(c)|0;e=bX(c)|0;f=aq(13064,13016)|0;g=aq(12928,12872)|0;h=a2(f,g,a,b,d,e,c)|0;bY(d);bY(e);al(f|0)|0;al(g|0)|0;return h|0}function a5(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0;c=bX(b)|0;d=bX(b)|0;e=aq(13064,13016)|0;f=aq(12928,12872)|0;g=a3(e,f,a,c,d,b)|0;bY(c);bY(d);al(e|0)|0;al(f|0)|0;return g|0}function a6(b,d,e,f,g,h,i,j){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;j=j|0;var k=0,l=0,m=0,n=0,o=0;k=b;b=d;d=e;e=f;f=g;g=h;h=i;i=j;j=1;do{if((h|0)!=0){if((a[h|0]|0)!=(a[4184]|0)){break}if((i|0)!=56){break}if((k|0)==0){l=-2;m=l;return m|0}c[k+24>>2]=0;if((c[k+32>>2]|0)==0){c[k+32>>2]=2;c[k+40>>2]=0}if((c[k+36>>2]|0)==0){c[k+36>>2]=2}if((b|0)==-1){b=6}if((e|0)<0){j=0;e=-e|0}else{if((e|0)>15){j=2;e=e-16|0}}do{if((f|0)>=1){if((f|0)>9){break}if((d|0)!=8){break}if((e|0)<8){break}if((e|0)>15){break}if((b|0)<0){break}if((b|0)>9){break}if((g|0)<0){break}if((g|0)>4){break}if((e|0)==8){e=9}n=aK[c[k+32>>2]&3](c[k+40>>2]|0,1,5828)|0;if((n|0)==0){l=-4;m=l;return m|0}c[k+28>>2]=n;c[n>>2]=k;c[n+24>>2]=j;c[n+28>>2]=0;c[n+48>>2]=e;c[n+44>>2]=1<<c[n+48>>2];c[n+52>>2]=(c[n+44>>2]|0)-1;c[n+80>>2]=f+7;c[n+76>>2]=1<<c[n+80>>2];c[n+84>>2]=(c[n+76>>2]|0)-1;c[n+88>>2]=(((c[n+80>>2]|0)+3-1|0)>>>0)/3|0;c[n+56>>2]=aK[c[k+32>>2]&3](c[k+40>>2]|0,c[n+44>>2]|0,2)|0;c[n+64>>2]=aK[c[k+32>>2]&3](c[k+40>>2]|0,c[n+44>>2]|0,2)|0;c[n+68>>2]=aK[c[k+32>>2]&3](c[k+40>>2]|0,c[n+76>>2]|0,2)|0;c[n+5824>>2]=0;c[n+5788>>2]=1<<f+6;o=aK[c[k+32>>2]&3](c[k+40>>2]|0,c[n+5788>>2]|0,4)|0;c[n+8>>2]=o;c[n+12>>2]=c[n+5788>>2]<<2;do{if((c[n+56>>2]|0)!=0){if((c[n+64>>2]|0)==0){break}if((c[n+68>>2]|0)==0){break}if((c[n+8>>2]|0)==0){break}c[n+5796>>2]=o+((((c[n+5788>>2]|0)>>>0)/2|0)<<1);c[n+5784>>2]=(c[n+8>>2]|0)+((c[n+5788>>2]|0)*3|0);c[n+132>>2]=b;c[n+136>>2]=g;a[n+36|0]=d&255;l=a8(k)|0;m=l;return m|0}}while(0);c[n+4>>2]=666;c[k+24>>2]=c[8];o=k;a7(o)|0;l=-4;m=l;return m|0}}while(0);l=-2;m=l;return m|0}}while(0);l=-6;m=l;return m|0}function a7(a){a=a|0;var b=0,d=0,e=0;b=a;do{if((b|0)!=0){if((c[b+28>>2]|0)==0){break}a=c[(c[b+28>>2]|0)+4>>2]|0;do{if((a|0)!=42){if((a|0)==69){break}if((a|0)==73){break}if((a|0)==91){break}if((a|0)==103){break}if((a|0)==113){break}if((a|0)==666){break}d=-2;e=d;return e|0}}while(0);if((c[(c[b+28>>2]|0)+8>>2]|0)!=0){aJ[c[b+36>>2]&3](c[b+40>>2]|0,c[(c[b+28>>2]|0)+8>>2]|0)}if((c[(c[b+28>>2]|0)+68>>2]|0)!=0){aJ[c[b+36>>2]&3](c[b+40>>2]|0,c[(c[b+28>>2]|0)+68>>2]|0)}if((c[(c[b+28>>2]|0)+64>>2]|0)!=0){aJ[c[b+36>>2]&3](c[b+40>>2]|0,c[(c[b+28>>2]|0)+64>>2]|0)}if((c[(c[b+28>>2]|0)+56>>2]|0)!=0){aJ[c[b+36>>2]&3](c[b+40>>2]|0,c[(c[b+28>>2]|0)+56>>2]|0)}aJ[c[b+36>>2]&3](c[b+40>>2]|0,c[b+28>>2]|0);c[b+28>>2]=0;d=(a|0)==113?-3:0;e=d;return e|0}}while(0);d=-2;e=d;return e|0}function a8(a){a=a|0;var b=0,d=0;b=a;a=ba(b)|0;if((a|0)!=0){d=a;return d|0}bb(c[b+28>>2]|0);d=a;return d|0}function a9(a){a=a|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;f=a;a=c[f+44>>2]|0;do{g=(c[f+60>>2]|0)-(c[f+116>>2]|0)-(c[f+108>>2]|0)|0;if((c[f+108>>2]|0)>>>0>=(a+((c[f+44>>2]|0)-262)|0)>>>0){h=c[f+56>>2]|0;i=(c[f+56>>2]|0)+a|0;j=a;b_(h|0,i|0,j)|0;j=f+112|0;c[j>>2]=(c[j>>2]|0)-a;j=f+108|0;c[j>>2]=(c[j>>2]|0)-a;j=f+92|0;c[j>>2]=(c[j>>2]|0)-a;k=c[f+76>>2]|0;j=(c[f+68>>2]|0)+(k<<1)|0;do{i=j-2|0;j=i;l=e[i>>1]|0;if(l>>>0>=a>>>0){m=l-a|0}else{m=0}b[j>>1]=m&65535;i=k-1|0;k=i;}while((i|0)!=0);k=a;j=(c[f+64>>2]|0)+(k<<1)|0;do{i=j-2|0;j=i;l=e[i>>1]|0;if(l>>>0>=a>>>0){n=l-a|0}else{n=0}b[j>>1]=n&65535;i=k-1|0;k=i;}while((i|0)!=0);g=g+a|0}if((c[(c[f>>2]|0)+4>>2]|0)==0){o=136;break}k=bh(c[f>>2]|0,(c[f+56>>2]|0)+(c[f+108>>2]|0)+(c[f+116>>2]|0)|0,g)|0;j=f+116|0;c[j>>2]=(c[j>>2]|0)+k;if(((c[f+116>>2]|0)+(c[f+5812>>2]|0)|0)>>>0>=3>>>0){j=(c[f+108>>2]|0)-(c[f+5812>>2]|0)|0;c[f+72>>2]=d[(c[f+56>>2]|0)+j|0]|0;c[f+72>>2]=(c[f+72>>2]<<c[f+88>>2]^(d[(c[f+56>>2]|0)+(j+1)|0]|0))&c[f+84>>2];while(1){if((c[f+5812>>2]|0)==0){break}c[f+72>>2]=(c[f+72>>2]<<c[f+88>>2]^(d[(c[f+56>>2]|0)+(j+3-1)|0]|0))&c[f+84>>2];b[(c[f+64>>2]|0)+((j&c[f+52>>2])<<1)>>1]=b[(c[f+68>>2]|0)+(c[f+72>>2]<<1)>>1]|0;b[(c[f+68>>2]|0)+(c[f+72>>2]<<1)>>1]=j&65535;j=j+1|0;i=f+5812|0;c[i>>2]=(c[i>>2]|0)-1;if(((c[f+116>>2]|0)+(c[f+5812>>2]|0)|0)>>>0<3>>>0){o=141;break}}if((o|0)==141){o=0}}if((c[f+116>>2]|0)>>>0<262>>>0){p=(c[(c[f>>2]|0)+4>>2]|0)!=0}else{p=0}}while(p);if((c[f+5824>>2]|0)>>>0>=(c[f+60>>2]|0)>>>0){return}p=(c[f+108>>2]|0)+(c[f+116>>2]|0)|0;if((c[f+5824>>2]|0)>>>0<p>>>0){q=(c[f+60>>2]|0)-p|0;if(q>>>0>258>>>0){q=258}o=(c[f+56>>2]|0)+p|0;k=q;bZ(o|0,0,k|0)|0;c[f+5824>>2]=p+q}else{if((c[f+5824>>2]|0)>>>0<(p+258|0)>>>0){q=p+258-(c[f+5824>>2]|0)|0;if(q>>>0>((c[f+60>>2]|0)-(c[f+5824>>2]|0)|0)>>>0){q=(c[f+60>>2]|0)-(c[f+5824>>2]|0)|0}p=(c[f+56>>2]|0)+(c[f+5824>>2]|0)|0;k=q;bZ(p|0,0,k|0)|0;k=f+5824|0;c[k>>2]=(c[k>>2]|0)+q}}return}function ba(a){a=a|0;var b=0,d=0,e=0,f=0;b=a;do{if((b|0)!=0){if((c[b+28>>2]|0)==0){break}if((c[b+32>>2]|0)==0){break}if((c[b+36>>2]|0)==0){break}c[b+20>>2]=0;c[b+8>>2]=0;c[b+24>>2]=0;c[b+44>>2]=2;a=c[b+28>>2]|0;c[a+20>>2]=0;c[a+16>>2]=c[a+8>>2];if((c[a+24>>2]|0)<0){c[a+24>>2]=-(c[a+24>>2]|0)}c[a+4>>2]=(c[a+24>>2]|0)!=0?42:113;if((c[a+24>>2]|0)==2){d=bT(0,0,0)|0}else{d=bS(0,0,0)|0}c[b+48>>2]=d;c[a+40>>2]=0;bv(a);e=0;f=e;return f|0}}while(0);e=-2;f=e;return f|0}function bb(a){a=a|0;var d=0,f=0;d=a;c[d+60>>2]=c[d+44>>2]<<1;b[(c[d+68>>2]|0)+((c[d+76>>2]|0)-1<<1)>>1]=0;a=c[d+68>>2]|0;f=(c[d+76>>2]|0)-1<<1;bZ(a|0,0,f|0)|0;c[d+128>>2]=e[12386+((c[d+132>>2]|0)*12|0)>>1]|0;c[d+140>>2]=e[12384+((c[d+132>>2]|0)*12|0)>>1]|0;c[d+144>>2]=e[12388+((c[d+132>>2]|0)*12|0)>>1]|0;c[d+124>>2]=e[12390+((c[d+132>>2]|0)*12|0)>>1]|0;c[d+108>>2]=0;c[d+92>>2]=0;c[d+116>>2]=0;c[d+5812>>2]=0;c[d+120>>2]=2;c[d+96>>2]=2;c[d+104>>2]=0;c[d+72>>2]=0;return}function bc(e,f){e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;g=e;e=f;do{if((g|0)!=0){if((c[g+28>>2]|0)==0){break}if((e|0)>5){break}if((e|0)<0){break}f=c[g+28>>2]|0;do{if((c[g+12>>2]|0)!=0){if((c[g>>2]|0)==0){if((c[g+4>>2]|0)!=0){break}}if((c[f+4>>2]|0)==666){if((e|0)!=4){break}}if((c[g+16>>2]|0)==0){c[g+24>>2]=c[9];h=-5;i=h;return i|0}c[f>>2]=g;j=c[f+40>>2]|0;c[f+40>>2]=e;if((c[f+4>>2]|0)==42){if((c[f+24>>2]|0)==2){c[g+48>>2]=bT(0,0,0)|0;k=f+20|0;l=c[k>>2]|0;c[k>>2]=l+1;a[(c[f+8>>2]|0)+l|0]=31;l=f+20|0;k=c[l>>2]|0;c[l>>2]=k+1;a[(c[f+8>>2]|0)+k|0]=-117;k=f+20|0;l=c[k>>2]|0;c[k>>2]=l+1;a[(c[f+8>>2]|0)+l|0]=8;if((c[f+28>>2]|0)==0){l=f+20|0;k=c[l>>2]|0;c[l>>2]=k+1;a[(c[f+8>>2]|0)+k|0]=0;k=f+20|0;l=c[k>>2]|0;c[k>>2]=l+1;a[(c[f+8>>2]|0)+l|0]=0;l=f+20|0;k=c[l>>2]|0;c[l>>2]=k+1;a[(c[f+8>>2]|0)+k|0]=0;k=f+20|0;l=c[k>>2]|0;c[k>>2]=l+1;a[(c[f+8>>2]|0)+l|0]=0;l=f+20|0;k=c[l>>2]|0;c[l>>2]=k+1;a[(c[f+8>>2]|0)+k|0]=0;if((c[f+132>>2]|0)==9){m=2}else{if((c[f+136>>2]|0)>=2){n=1}else{n=(c[f+132>>2]|0)<2}m=n?4:0}k=f+20|0;l=c[k>>2]|0;c[k>>2]=l+1;a[(c[f+8>>2]|0)+l|0]=m&255;l=f+20|0;k=c[l>>2]|0;c[l>>2]=k+1;a[(c[f+8>>2]|0)+k|0]=3;c[f+4>>2]=113}else{k=((c[c[f+28>>2]>>2]|0)!=0?1:0)+((c[(c[f+28>>2]|0)+44>>2]|0)!=0?2:0)+((c[(c[f+28>>2]|0)+16>>2]|0)==0?0:4)+((c[(c[f+28>>2]|0)+28>>2]|0)==0?0:8)+((c[(c[f+28>>2]|0)+36>>2]|0)==0?0:16)&255;l=f+20|0;o=c[l>>2]|0;c[l>>2]=o+1;a[(c[f+8>>2]|0)+o|0]=k;k=c[(c[f+28>>2]|0)+4>>2]&255;o=f+20|0;l=c[o>>2]|0;c[o>>2]=l+1;a[(c[f+8>>2]|0)+l|0]=k;k=(c[(c[f+28>>2]|0)+4>>2]|0)>>>8&255;l=f+20|0;o=c[l>>2]|0;c[l>>2]=o+1;a[(c[f+8>>2]|0)+o|0]=k;k=(c[(c[f+28>>2]|0)+4>>2]|0)>>>16&255;o=f+20|0;l=c[o>>2]|0;c[o>>2]=l+1;a[(c[f+8>>2]|0)+l|0]=k;k=(c[(c[f+28>>2]|0)+4>>2]|0)>>>24&255;l=f+20|0;o=c[l>>2]|0;c[l>>2]=o+1;a[(c[f+8>>2]|0)+o|0]=k;if((c[f+132>>2]|0)==9){p=2}else{if((c[f+136>>2]|0)>=2){q=1}else{q=(c[f+132>>2]|0)<2}p=q?4:0}k=f+20|0;o=c[k>>2]|0;c[k>>2]=o+1;a[(c[f+8>>2]|0)+o|0]=p&255;o=c[(c[f+28>>2]|0)+12>>2]&255;k=f+20|0;l=c[k>>2]|0;c[k>>2]=l+1;a[(c[f+8>>2]|0)+l|0]=o;if((c[(c[f+28>>2]|0)+16>>2]|0)!=0){o=c[(c[f+28>>2]|0)+20>>2]&255;l=f+20|0;k=c[l>>2]|0;c[l>>2]=k+1;a[(c[f+8>>2]|0)+k|0]=o;o=(c[(c[f+28>>2]|0)+20>>2]|0)>>>8&255;k=f+20|0;l=c[k>>2]|0;c[k>>2]=l+1;a[(c[f+8>>2]|0)+l|0]=o}if((c[(c[f+28>>2]|0)+44>>2]|0)!=0){c[g+48>>2]=bT(c[g+48>>2]|0,c[f+8>>2]|0,c[f+20>>2]|0)|0}c[f+32>>2]=0;c[f+4>>2]=69}}else{o=((c[f+48>>2]|0)-8<<4)+8<<8;do{if((c[f+136>>2]|0)>=2){r=212}else{if((c[f+132>>2]|0)<2){r=212;break}if((c[f+132>>2]|0)<6){s=1}else{if((c[f+132>>2]|0)==6){s=2}else{s=3}}}}while(0);if((r|0)==212){s=0}o=o|s<<6;if((c[f+108>>2]|0)!=0){o=o|32}o=o+(31-((o>>>0)%31|0))|0;c[f+4>>2]=113;bd(f,o);if((c[f+108>>2]|0)!=0){bd(f,(c[g+48>>2]|0)>>>16);bd(f,c[g+48>>2]&65535)}c[g+48>>2]=bS(0,0,0)|0}}if((c[f+4>>2]|0)==69){if((c[(c[f+28>>2]|0)+16>>2]|0)!=0){l=c[f+20>>2]|0;while(1){if((c[f+32>>2]|0)>>>0>=(c[(c[f+28>>2]|0)+20>>2]&65535)>>>0){break}if((c[f+20>>2]|0)==(c[f+12>>2]|0)){do{if((c[(c[f+28>>2]|0)+44>>2]|0)!=0){if((c[f+20>>2]|0)>>>0<=l>>>0){break}c[g+48>>2]=bT(c[g+48>>2]|0,(c[f+8>>2]|0)+l|0,(c[f+20>>2]|0)-l|0)|0}}while(0);be(g);l=c[f+20>>2]|0;if((c[f+20>>2]|0)==(c[f+12>>2]|0)){r=235;break}}k=a[(c[(c[f+28>>2]|0)+16>>2]|0)+(c[f+32>>2]|0)|0]|0;t=f+20|0;u=c[t>>2]|0;c[t>>2]=u+1;a[(c[f+8>>2]|0)+u|0]=k;k=f+32|0;c[k>>2]=(c[k>>2]|0)+1}do{if((c[(c[f+28>>2]|0)+44>>2]|0)!=0){if((c[f+20>>2]|0)>>>0<=l>>>0){break}c[g+48>>2]=bT(c[g+48>>2]|0,(c[f+8>>2]|0)+l|0,(c[f+20>>2]|0)-l|0)|0}}while(0);if((c[f+32>>2]|0)==(c[(c[f+28>>2]|0)+20>>2]|0)){c[f+32>>2]=0;c[f+4>>2]=73}}else{c[f+4>>2]=73}}if((c[f+4>>2]|0)==73){if((c[(c[f+28>>2]|0)+28>>2]|0)!=0){l=c[f+20>>2]|0;do{if((c[f+20>>2]|0)==(c[f+12>>2]|0)){do{if((c[(c[f+28>>2]|0)+44>>2]|0)!=0){if((c[f+20>>2]|0)>>>0<=l>>>0){break}c[g+48>>2]=bT(c[g+48>>2]|0,(c[f+8>>2]|0)+l|0,(c[f+20>>2]|0)-l|0)|0}}while(0);be(g);l=c[f+20>>2]|0;if((c[f+20>>2]|0)==(c[f+12>>2]|0)){r=254;break}}o=f+32|0;k=c[o>>2]|0;c[o>>2]=k+1;v=d[(c[(c[f+28>>2]|0)+28>>2]|0)+k|0]|0;k=f+20|0;o=c[k>>2]|0;c[k>>2]=o+1;a[(c[f+8>>2]|0)+o|0]=v&255;}while((v|0)!=0);if((r|0)==254){v=1}do{if((c[(c[f+28>>2]|0)+44>>2]|0)!=0){if((c[f+20>>2]|0)>>>0<=l>>>0){break}c[g+48>>2]=bT(c[g+48>>2]|0,(c[f+8>>2]|0)+l|0,(c[f+20>>2]|0)-l|0)|0}}while(0);if((v|0)==0){c[f+32>>2]=0;c[f+4>>2]=91}}else{c[f+4>>2]=91}}if((c[f+4>>2]|0)==91){if((c[(c[f+28>>2]|0)+36>>2]|0)!=0){l=c[f+20>>2]|0;do{if((c[f+20>>2]|0)==(c[f+12>>2]|0)){do{if((c[(c[f+28>>2]|0)+44>>2]|0)!=0){if((c[f+20>>2]|0)>>>0<=l>>>0){break}c[g+48>>2]=bT(c[g+48>>2]|0,(c[f+8>>2]|0)+l|0,(c[f+20>>2]|0)-l|0)|0}}while(0);be(g);l=c[f+20>>2]|0;if((c[f+20>>2]|0)==(c[f+12>>2]|0)){r=274;break}}o=f+32|0;k=c[o>>2]|0;c[o>>2]=k+1;w=d[(c[(c[f+28>>2]|0)+36>>2]|0)+k|0]|0;k=f+20|0;o=c[k>>2]|0;c[k>>2]=o+1;a[(c[f+8>>2]|0)+o|0]=w&255;}while((w|0)!=0);if((r|0)==274){w=1}do{if((c[(c[f+28>>2]|0)+44>>2]|0)!=0){if((c[f+20>>2]|0)>>>0<=l>>>0){break}c[g+48>>2]=bT(c[g+48>>2]|0,(c[f+8>>2]|0)+l|0,(c[f+20>>2]|0)-l|0)|0}}while(0);if((w|0)==0){c[f+4>>2]=103}}else{c[f+4>>2]=103}}if((c[f+4>>2]|0)==103){if((c[(c[f+28>>2]|0)+44>>2]|0)!=0){if(((c[f+20>>2]|0)+2|0)>>>0>(c[f+12>>2]|0)>>>0){be(g)}if(((c[f+20>>2]|0)+2|0)>>>0<=(c[f+12>>2]|0)>>>0){l=c[g+48>>2]&255;o=f+20|0;k=c[o>>2]|0;c[o>>2]=k+1;a[(c[f+8>>2]|0)+k|0]=l;l=(c[g+48>>2]|0)>>>8&255;k=f+20|0;o=c[k>>2]|0;c[k>>2]=o+1;a[(c[f+8>>2]|0)+o|0]=l;c[g+48>>2]=bT(0,0,0)|0;c[f+4>>2]=113}}else{c[f+4>>2]=113}}do{if((c[f+20>>2]|0)!=0){be(g);if((c[g+16>>2]|0)!=0){break}c[f+40>>2]=-1;h=0;i=h;return i|0}else{do{if((c[g+4>>2]|0)==0){if(((e<<1)-((e|0)>4?9:0)|0)>((j<<1)-((j|0)>4?9:0)|0)){break}if((e|0)==4){break}c[g+24>>2]=c[9];h=-5;i=h;return i|0}}while(0)}}while(0);do{if((c[f+4>>2]|0)==666){if((c[g+4>>2]|0)==0){break}c[g+24>>2]=c[9];h=-5;i=h;return i|0}}while(0);do{if((c[g+4>>2]|0)!=0){r=311}else{if((c[f+116>>2]|0)!=0){r=311;break}if((e|0)==0){break}if((c[f+4>>2]|0)!=666){r=311}}}while(0);L404:do{if((r|0)==311){if((c[f+136>>2]|0)==2){x=bf(f,e)|0}else{if((c[f+136>>2]|0)==3){y=bg(f,e)|0}else{y=aM[c[12392+((c[f+132>>2]|0)*12|0)>>2]&7](f,e)|0}x=y}j=x;if((j|0)==2){r=319}else{if((j|0)==3){r=319}}if((r|0)==319){c[f+4>>2]=666}do{if((j|0)!=0){if((j|0)==2){break}do{if((j|0)==1){if((e|0)==1){bC(f)}else{if((e|0)!=5){by(f,0,0,0);if((e|0)==3){b[(c[f+68>>2]|0)+((c[f+76>>2]|0)-1<<1)>>1]=0;l=c[f+68>>2]|0;o=(c[f+76>>2]|0)-1<<1;bZ(l|0,0,o|0)|0;if((c[f+116>>2]|0)==0){c[f+108>>2]=0;c[f+92>>2]=0;c[f+5812>>2]=0}}}}be(g);if((c[g+16>>2]|0)!=0){break}c[f+40>>2]=-1;h=0;i=h;return i|0}}while(0);break L404}}while(0);if((c[g+16>>2]|0)==0){c[f+40>>2]=-1}h=0;i=h;return i|0}}while(0);if((e|0)!=4){h=0;i=h;return i|0}if((c[f+24>>2]|0)<=0){h=1;i=h;return i|0}if((c[f+24>>2]|0)==2){j=c[g+48>>2]&255;o=f+20|0;l=c[o>>2]|0;c[o>>2]=l+1;a[(c[f+8>>2]|0)+l|0]=j;j=(c[g+48>>2]|0)>>>8&255;l=f+20|0;o=c[l>>2]|0;c[l>>2]=o+1;a[(c[f+8>>2]|0)+o|0]=j;j=(c[g+48>>2]|0)>>>16&255;o=f+20|0;l=c[o>>2]|0;c[o>>2]=l+1;a[(c[f+8>>2]|0)+l|0]=j;j=(c[g+48>>2]|0)>>>24&255;l=f+20|0;o=c[l>>2]|0;c[l>>2]=o+1;a[(c[f+8>>2]|0)+o|0]=j;j=c[g+8>>2]&255;o=f+20|0;l=c[o>>2]|0;c[o>>2]=l+1;a[(c[f+8>>2]|0)+l|0]=j;j=(c[g+8>>2]|0)>>>8&255;l=f+20|0;o=c[l>>2]|0;c[l>>2]=o+1;a[(c[f+8>>2]|0)+o|0]=j;j=(c[g+8>>2]|0)>>>16&255;o=f+20|0;l=c[o>>2]|0;c[o>>2]=l+1;a[(c[f+8>>2]|0)+l|0]=j;j=(c[g+8>>2]|0)>>>24&255;l=f+20|0;o=c[l>>2]|0;c[l>>2]=o+1;a[(c[f+8>>2]|0)+o|0]=j}else{bd(f,(c[g+48>>2]|0)>>>16);bd(f,c[g+48>>2]&65535)}be(g);if((c[f+24>>2]|0)>0){c[f+24>>2]=-(c[f+24>>2]|0)}h=(c[f+20>>2]|0)!=0?0:1;i=h;return i|0}}while(0);c[g+24>>2]=c[6];h=-2;i=h;return i|0}}while(0);h=-2;i=h;return i|0}function bd(b,d){b=b|0;d=d|0;var e=0,f=0;e=b;b=d;d=e+20|0;f=c[d>>2]|0;c[d>>2]=f+1;a[(c[e+8>>2]|0)+f|0]=b>>>8&255;f=e+20|0;d=c[f>>2]|0;c[f>>2]=d+1;a[(c[e+8>>2]|0)+d|0]=b&255;return}function be(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=a;a=c[b+28>>2]|0;bA(a);d=c[a+20>>2]|0;if(d>>>0>(c[b+16>>2]|0)>>>0){d=c[b+16>>2]|0}if((d|0)==0){return}e=c[b+12>>2]|0;f=c[a+16>>2]|0;g=d;b_(e|0,f|0,g)|0;g=b+12|0;c[g>>2]=(c[g>>2]|0)+d;g=a+16|0;c[g>>2]=(c[g>>2]|0)+d;g=b+20|0;c[g>>2]=(c[g>>2]|0)+d;g=b+16|0;c[g>>2]=(c[g>>2]|0)-d;g=a+20|0;c[g>>2]=(c[g>>2]|0)-d;if((c[a+20>>2]|0)!=0){return}c[a+16>>2]=c[a+8>>2];return}function bf(d,e){d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;f=d;d=e;while(1){if((c[f+116>>2]|0)==0){a9(f);if((c[f+116>>2]|0)==0){break}}c[f+96>>2]=0;e=a[(c[f+56>>2]|0)+(c[f+108>>2]|0)|0]|0;b[(c[f+5796>>2]|0)+(c[f+5792>>2]<<1)>>1]=0;g=f+5792|0;h=c[g>>2]|0;c[g>>2]=h+1;a[(c[f+5784>>2]|0)+h|0]=e;h=f+148+((e&255)<<2)|0;b[h>>1]=(b[h>>1]|0)+1&65535;h=(c[f+5792>>2]|0)==((c[f+5788>>2]|0)-1|0)|0;e=f+116|0;c[e>>2]=(c[e>>2]|0)-1;e=f+108|0;c[e>>2]=(c[e>>2]|0)+1;if((h|0)!=0){if((c[f+92>>2]|0)>=0){i=(c[f+56>>2]|0)+(c[f+92>>2]|0)|0}else{i=0}bD(f,i,(c[f+108>>2]|0)-(c[f+92>>2]|0)|0,0);c[f+92>>2]=c[f+108>>2];be(c[f>>2]|0);if((c[(c[f>>2]|0)+16>>2]|0)==0){j=384;break}}}if((j|0)==384){k=0;l=k;return l|0}if((d|0)==0){k=0;l=k;return l|0}c[f+5812>>2]=0;if((d|0)==4){if((c[f+92>>2]|0)>=0){m=(c[f+56>>2]|0)+(c[f+92>>2]|0)|0}else{m=0}bD(f,m,(c[f+108>>2]|0)-(c[f+92>>2]|0)|0,1);c[f+92>>2]=c[f+108>>2];be(c[f>>2]|0);if((c[(c[f>>2]|0)+16>>2]|0)==0){k=2;l=k;return l|0}else{k=3;l=k;return l|0}}do{if((c[f+5792>>2]|0)!=0){if((c[f+92>>2]|0)>=0){n=(c[f+56>>2]|0)+(c[f+92>>2]|0)|0}else{n=0}bD(f,n,(c[f+108>>2]|0)-(c[f+92>>2]|0)|0,0);c[f+92>>2]=c[f+108>>2];be(c[f>>2]|0);if((c[(c[f>>2]|0)+16>>2]|0)!=0){break}k=0;l=k;return l|0}}while(0);k=1;l=k;return l|0}function bg(e,f){e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;g=e;e=f;while(1){if((c[g+116>>2]|0)>>>0<=258>>>0){a9(g);if((c[g+116>>2]|0)>>>0<=258>>>0){if((e|0)==0){h=413;break}}if((c[g+116>>2]|0)==0){h=415;break}}c[g+96>>2]=0;do{if((c[g+116>>2]|0)>>>0>=3>>>0){if((c[g+108>>2]|0)>>>0<=0>>>0){break}f=(c[g+56>>2]|0)+(c[g+108>>2]|0)-1|0;i=d[f]|0;j=f+1|0;f=j;do{if((i|0)==(d[j]|0|0)){k=f+1|0;f=k;if((i|0)!=(d[k]|0|0)){break}k=f+1|0;f=k;if((i|0)!=(d[k]|0|0)){break}k=(c[g+56>>2]|0)+(c[g+108>>2]|0)+258|0;do{l=f+1|0;f=l;do{if((i|0)==(d[l]|0|0)){m=f+1|0;f=m;if((i|0)!=(d[m]|0|0)){n=0;break}m=f+1|0;f=m;if((i|0)!=(d[m]|0|0)){n=0;break}m=f+1|0;f=m;if((i|0)!=(d[m]|0|0)){n=0;break}m=f+1|0;f=m;if((i|0)!=(d[m]|0|0)){n=0;break}m=f+1|0;f=m;if((i|0)!=(d[m]|0|0)){n=0;break}m=f+1|0;f=m;if((i|0)!=(d[m]|0|0)){n=0;break}m=f+1|0;f=m;if((i|0)!=(d[m]|0|0)){n=0;break}n=f>>>0<k>>>0}else{n=0}}while(0)}while(n);c[g+96>>2]=258-(k-f);if((c[g+96>>2]|0)>>>0>(c[g+116>>2]|0)>>>0){c[g+96>>2]=c[g+116>>2]}}}while(0)}}while(0);if((c[g+96>>2]|0)>>>0>=3>>>0){f=(c[g+96>>2]|0)-3&255;i=1;b[(c[g+5796>>2]|0)+(c[g+5792>>2]<<1)>>1]=i;j=g+5792|0;l=c[j>>2]|0;c[j>>2]=l+1;a[(c[g+5784>>2]|0)+l|0]=f;i=i-1&65535;l=g+148+((d[13664+(f&255)|0]|0)+257<<2)|0;b[l>>1]=(b[l>>1]|0)+1&65535;if((i&65535|0)<256){o=d[13920+(i&65535)|0]|0}else{o=d[((i&65535)>>7)+14176|0]|0}i=g+2440+(o<<2)|0;b[i>>1]=(b[i>>1]|0)+1&65535;p=(c[g+5792>>2]|0)==((c[g+5788>>2]|0)-1|0)|0;i=g+116|0;c[i>>2]=(c[i>>2]|0)-(c[g+96>>2]|0);i=g+108|0;c[i>>2]=(c[i>>2]|0)+(c[g+96>>2]|0);c[g+96>>2]=0}else{i=a[(c[g+56>>2]|0)+(c[g+108>>2]|0)|0]|0;b[(c[g+5796>>2]|0)+(c[g+5792>>2]<<1)>>1]=0;l=g+5792|0;f=c[l>>2]|0;c[l>>2]=f+1;a[(c[g+5784>>2]|0)+f|0]=i;f=g+148+((i&255)<<2)|0;b[f>>1]=(b[f>>1]|0)+1&65535;p=(c[g+5792>>2]|0)==((c[g+5788>>2]|0)-1|0)|0;f=g+116|0;c[f>>2]=(c[f>>2]|0)-1;f=g+108|0;c[f>>2]=(c[f>>2]|0)+1}if((p|0)!=0){if((c[g+92>>2]|0)>=0){q=(c[g+56>>2]|0)+(c[g+92>>2]|0)|0}else{q=0}bD(g,q,(c[g+108>>2]|0)-(c[g+92>>2]|0)|0,0);c[g+92>>2]=c[g+108>>2];be(c[g>>2]|0);if((c[(c[g>>2]|0)+16>>2]|0)==0){h=449;break}}}if((h|0)==413){r=0;s=r;return s|0}else if((h|0)==415){c[g+5812>>2]=0;if((e|0)==4){if((c[g+92>>2]|0)>=0){t=(c[g+56>>2]|0)+(c[g+92>>2]|0)|0}else{t=0}bD(g,t,(c[g+108>>2]|0)-(c[g+92>>2]|0)|0,1);c[g+92>>2]=c[g+108>>2];be(c[g>>2]|0);if((c[(c[g>>2]|0)+16>>2]|0)==0){r=2;s=r;return s|0}else{r=3;s=r;return s|0}}do{if((c[g+5792>>2]|0)!=0){if((c[g+92>>2]|0)>=0){u=(c[g+56>>2]|0)+(c[g+92>>2]|0)|0}else{u=0}bD(g,u,(c[g+108>>2]|0)-(c[g+92>>2]|0)|0,0);c[g+92>>2]=c[g+108>>2];be(c[g>>2]|0);if((c[(c[g>>2]|0)+16>>2]|0)!=0){break}r=0;s=r;return s|0}}while(0);r=1;s=r;return s|0}else if((h|0)==449){r=0;s=r;return s|0}return 0}function bh(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;e=a;a=b;b=d;d=c[e+4>>2]|0;if(d>>>0>b>>>0){d=b}if((d|0)==0){f=0;g=f;return g|0}b=e+4|0;c[b>>2]=(c[b>>2]|0)-d;b=a;h=c[e>>2]|0;i=d;b_(b|0,h|0,i)|0;if((c[(c[e+28>>2]|0)+24>>2]|0)==1){c[e+48>>2]=bS(c[e+48>>2]|0,a,d)|0}else{if((c[(c[e+28>>2]|0)+24>>2]|0)==2){c[e+48>>2]=bT(c[e+48>>2]|0,a,d)|0}}a=e|0;c[a>>2]=(c[a>>2]|0)+d;a=e+8|0;c[a>>2]=(c[a>>2]|0)+d;f=d;g=f;return g|0}function bi(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;d=a;a=b;b=65535;if(b>>>0>((c[d+12>>2]|0)-5|0)>>>0){b=(c[d+12>>2]|0)-5|0}while(1){if((c[d+116>>2]|0)>>>0<=1>>>0){a9(d);if((c[d+116>>2]|0)==0){if((a|0)==0){e=493;break}}if((c[d+116>>2]|0)==0){e=495;break}}f=d+108|0;c[f>>2]=(c[f>>2]|0)+(c[d+116>>2]|0);c[d+116>>2]=0;f=(c[d+92>>2]|0)+b|0;if((c[d+108>>2]|0)==0){e=499}else{if((c[d+108>>2]|0)>>>0>=f>>>0){e=499}}if((e|0)==499){e=0;c[d+116>>2]=(c[d+108>>2]|0)-f;c[d+108>>2]=f;if((c[d+92>>2]|0)>=0){g=(c[d+56>>2]|0)+(c[d+92>>2]|0)|0}else{g=0}bD(d,g,(c[d+108>>2]|0)-(c[d+92>>2]|0)|0,0);c[d+92>>2]=c[d+108>>2];be(c[d>>2]|0);if((c[(c[d>>2]|0)+16>>2]|0)==0){e=503;break}}if(((c[d+108>>2]|0)-(c[d+92>>2]|0)|0)>>>0>=((c[d+44>>2]|0)-262|0)>>>0){if((c[d+92>>2]|0)>=0){h=(c[d+56>>2]|0)+(c[d+92>>2]|0)|0}else{h=0}bD(d,h,(c[d+108>>2]|0)-(c[d+92>>2]|0)|0,0);c[d+92>>2]=c[d+108>>2];be(c[d>>2]|0);if((c[(c[d>>2]|0)+16>>2]|0)==0){e=510;break}}}if((e|0)==493){i=0;j=i;return j|0}else if((e|0)==495){c[d+5812>>2]=0;if((a|0)==4){if((c[d+92>>2]|0)>=0){k=(c[d+56>>2]|0)+(c[d+92>>2]|0)|0}else{k=0}bD(d,k,(c[d+108>>2]|0)-(c[d+92>>2]|0)|0,1);c[d+92>>2]=c[d+108>>2];be(c[d>>2]|0);if((c[(c[d>>2]|0)+16>>2]|0)==0){i=2;j=i;return j|0}else{i=3;j=i;return j|0}}do{if((c[d+108>>2]|0)>(c[d+92>>2]|0)){if((c[d+92>>2]|0)>=0){l=(c[d+56>>2]|0)+(c[d+92>>2]|0)|0}else{l=0}bD(d,l,(c[d+108>>2]|0)-(c[d+92>>2]|0)|0,0);c[d+92>>2]=c[d+108>>2];be(c[d>>2]|0);if((c[(c[d>>2]|0)+16>>2]|0)!=0){break}i=0;j=i;return j|0}}while(0);i=1;j=i;return j|0}else if((e|0)==503){i=0;j=i;return j|0}else if((e|0)==510){i=0;j=i;return j|0}return 0}function bj(e,f){e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;g=e;e=f;while(1){if((c[g+116>>2]|0)>>>0<262>>>0){a9(g);if((c[g+116>>2]|0)>>>0<262>>>0){if((e|0)==0){h=540;break}}if((c[g+116>>2]|0)==0){h=542;break}}f=0;if((c[g+116>>2]|0)>>>0>=3>>>0){c[g+72>>2]=(c[g+72>>2]<<c[g+88>>2]^(d[(c[g+56>>2]|0)+((c[g+108>>2]|0)+2)|0]|0))&c[g+84>>2];i=b[(c[g+68>>2]|0)+(c[g+72>>2]<<1)>>1]|0;b[(c[g+64>>2]|0)+((c[g+108>>2]&c[g+52>>2])<<1)>>1]=i;f=i&65535;b[(c[g+68>>2]|0)+(c[g+72>>2]<<1)>>1]=c[g+108>>2]&65535}do{if((f|0)!=0){if(((c[g+108>>2]|0)-f|0)>>>0>((c[g+44>>2]|0)-262|0)>>>0){break}c[g+96>>2]=bl(g,f)|0}}while(0);if((c[g+96>>2]|0)>>>0>=3>>>0){i=(c[g+96>>2]|0)-3&255;j=(c[g+108>>2]|0)-(c[g+112>>2]|0)&65535;b[(c[g+5796>>2]|0)+(c[g+5792>>2]<<1)>>1]=j;k=g+5792|0;l=c[k>>2]|0;c[k>>2]=l+1;a[(c[g+5784>>2]|0)+l|0]=i;j=j-1&65535;l=g+148+((d[13664+(i&255)|0]|0)+257<<2)|0;b[l>>1]=(b[l>>1]|0)+1&65535;if((j&65535|0)<256){m=d[13920+(j&65535)|0]|0}else{m=d[((j&65535)>>7)+14176|0]|0}j=g+2440+(m<<2)|0;b[j>>1]=(b[j>>1]|0)+1&65535;n=(c[g+5792>>2]|0)==((c[g+5788>>2]|0)-1|0)|0;j=g+116|0;c[j>>2]=(c[j>>2]|0)-(c[g+96>>2]|0);do{if((c[g+96>>2]|0)>>>0<=(c[g+128>>2]|0)>>>0){if((c[g+116>>2]|0)>>>0<3>>>0){h=559;break}j=g+96|0;c[j>>2]=(c[j>>2]|0)-1;do{j=g+108|0;c[j>>2]=(c[j>>2]|0)+1;c[g+72>>2]=(c[g+72>>2]<<c[g+88>>2]^(d[(c[g+56>>2]|0)+((c[g+108>>2]|0)+2)|0]|0))&c[g+84>>2];j=b[(c[g+68>>2]|0)+(c[g+72>>2]<<1)>>1]|0;b[(c[g+64>>2]|0)+((c[g+108>>2]&c[g+52>>2])<<1)>>1]=j;f=j&65535;b[(c[g+68>>2]|0)+(c[g+72>>2]<<1)>>1]=c[g+108>>2]&65535;j=g+96|0;l=(c[j>>2]|0)-1|0;c[j>>2]=l;}while((l|0)!=0);l=g+108|0;c[l>>2]=(c[l>>2]|0)+1}else{h=559}}while(0);if((h|0)==559){h=0;f=g+108|0;c[f>>2]=(c[f>>2]|0)+(c[g+96>>2]|0);c[g+96>>2]=0;c[g+72>>2]=d[(c[g+56>>2]|0)+(c[g+108>>2]|0)|0]|0;c[g+72>>2]=(c[g+72>>2]<<c[g+88>>2]^(d[(c[g+56>>2]|0)+((c[g+108>>2]|0)+1)|0]|0))&c[g+84>>2]}}else{f=a[(c[g+56>>2]|0)+(c[g+108>>2]|0)|0]|0;b[(c[g+5796>>2]|0)+(c[g+5792>>2]<<1)>>1]=0;l=g+5792|0;j=c[l>>2]|0;c[l>>2]=j+1;a[(c[g+5784>>2]|0)+j|0]=f;j=g+148+((f&255)<<2)|0;b[j>>1]=(b[j>>1]|0)+1&65535;n=(c[g+5792>>2]|0)==((c[g+5788>>2]|0)-1|0)|0;j=g+116|0;c[j>>2]=(c[j>>2]|0)-1;j=g+108|0;c[j>>2]=(c[j>>2]|0)+1}if((n|0)!=0){if((c[g+92>>2]|0)>=0){o=(c[g+56>>2]|0)+(c[g+92>>2]|0)|0}else{o=0}bD(g,o,(c[g+108>>2]|0)-(c[g+92>>2]|0)|0,0);c[g+92>>2]=c[g+108>>2];be(c[g>>2]|0);if((c[(c[g>>2]|0)+16>>2]|0)==0){h=567;break}}}if((h|0)==567){p=0;q=p;return q|0}else if((h|0)==540){p=0;q=p;return q|0}else if((h|0)==542){if((c[g+108>>2]|0)>>>0<2>>>0){r=c[g+108>>2]|0}else{r=2}c[g+5812>>2]=r;if((e|0)==4){if((c[g+92>>2]|0)>=0){s=(c[g+56>>2]|0)+(c[g+92>>2]|0)|0}else{s=0}bD(g,s,(c[g+108>>2]|0)-(c[g+92>>2]|0)|0,1);c[g+92>>2]=c[g+108>>2];be(c[g>>2]|0);if((c[(c[g>>2]|0)+16>>2]|0)==0){p=2;q=p;return q|0}else{p=3;q=p;return q|0}}do{if((c[g+5792>>2]|0)!=0){if((c[g+92>>2]|0)>=0){t=(c[g+56>>2]|0)+(c[g+92>>2]|0)|0}else{t=0}bD(g,t,(c[g+108>>2]|0)-(c[g+92>>2]|0)|0,0);c[g+92>>2]=c[g+108>>2];be(c[g>>2]|0);if((c[(c[g>>2]|0)+16>>2]|0)!=0){break}p=0;q=p;return q|0}}while(0);p=1;q=p;return q|0}return 0}function bk(e,f){e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;g=e;e=f;L771:while(1){if((c[g+116>>2]|0)>>>0<262>>>0){a9(g);if((c[g+116>>2]|0)>>>0<262>>>0){if((e|0)==0){h=599;break}}if((c[g+116>>2]|0)==0){h=601;break}}f=0;if((c[g+116>>2]|0)>>>0>=3>>>0){c[g+72>>2]=(c[g+72>>2]<<c[g+88>>2]^(d[(c[g+56>>2]|0)+((c[g+108>>2]|0)+2)|0]|0))&c[g+84>>2];i=b[(c[g+68>>2]|0)+(c[g+72>>2]<<1)>>1]|0;b[(c[g+64>>2]|0)+((c[g+108>>2]&c[g+52>>2])<<1)>>1]=i;f=i&65535;b[(c[g+68>>2]|0)+(c[g+72>>2]<<1)>>1]=c[g+108>>2]&65535}c[g+120>>2]=c[g+96>>2];c[g+100>>2]=c[g+112>>2];c[g+96>>2]=2;do{if((f|0)!=0){if((c[g+120>>2]|0)>>>0>=(c[g+128>>2]|0)>>>0){break}if(((c[g+108>>2]|0)-f|0)>>>0>((c[g+44>>2]|0)-262|0)>>>0){break}c[g+96>>2]=bl(g,f)|0;do{if((c[g+96>>2]|0)>>>0<=5>>>0){if((c[g+136>>2]|0)!=1){if((c[g+96>>2]|0)!=3){break}if(((c[g+108>>2]|0)-(c[g+112>>2]|0)|0)>>>0<=4096>>>0){break}}c[g+96>>2]=2}}while(0)}}while(0);do{if((c[g+120>>2]|0)>>>0>=3>>>0){if((c[g+96>>2]|0)>>>0>(c[g+120>>2]|0)>>>0){h=632;break}i=(c[g+108>>2]|0)+(c[g+116>>2]|0)-3|0;j=(c[g+120>>2]|0)-3&255;k=(c[g+108>>2]|0)-1-(c[g+100>>2]|0)&65535;b[(c[g+5796>>2]|0)+(c[g+5792>>2]<<1)>>1]=k;l=g+5792|0;m=c[l>>2]|0;c[l>>2]=m+1;a[(c[g+5784>>2]|0)+m|0]=j;k=k-1&65535;m=g+148+((d[13664+(j&255)|0]|0)+257<<2)|0;b[m>>1]=(b[m>>1]|0)+1&65535;if((k&65535|0)<256){n=d[13920+(k&65535)|0]|0}else{n=d[((k&65535)>>7)+14176|0]|0}k=g+2440+(n<<2)|0;b[k>>1]=(b[k>>1]|0)+1&65535;o=(c[g+5792>>2]|0)==((c[g+5788>>2]|0)-1|0)|0;k=g+116|0;c[k>>2]=(c[k>>2]|0)-((c[g+120>>2]|0)-1);k=g+120|0;c[k>>2]=(c[k>>2]|0)-2;do{k=g+108|0;m=(c[k>>2]|0)+1|0;c[k>>2]=m;if(m>>>0<=i>>>0){c[g+72>>2]=(c[g+72>>2]<<c[g+88>>2]^(d[(c[g+56>>2]|0)+((c[g+108>>2]|0)+2)|0]|0))&c[g+84>>2];m=b[(c[g+68>>2]|0)+(c[g+72>>2]<<1)>>1]|0;b[(c[g+64>>2]|0)+((c[g+108>>2]&c[g+52>>2])<<1)>>1]=m;f=m&65535;b[(c[g+68>>2]|0)+(c[g+72>>2]<<1)>>1]=c[g+108>>2]&65535}m=g+120|0;k=(c[m>>2]|0)-1|0;c[m>>2]=k;}while((k|0)!=0);c[g+104>>2]=0;c[g+96>>2]=2;i=g+108|0;c[i>>2]=(c[i>>2]|0)+1;if((o|0)!=0){if((c[g+92>>2]|0)>=0){p=(c[g+56>>2]|0)+(c[g+92>>2]|0)|0}else{p=0}bD(g,p,(c[g+108>>2]|0)-(c[g+92>>2]|0)|0,0);c[g+92>>2]=c[g+108>>2];be(c[g>>2]|0);if((c[(c[g>>2]|0)+16>>2]|0)==0){h=629;break L771}}}else{h=632}}while(0);if((h|0)==632){h=0;if((c[g+104>>2]|0)!=0){f=a[(c[g+56>>2]|0)+((c[g+108>>2]|0)-1)|0]|0;b[(c[g+5796>>2]|0)+(c[g+5792>>2]<<1)>>1]=0;i=g+5792|0;k=c[i>>2]|0;c[i>>2]=k+1;a[(c[g+5784>>2]|0)+k|0]=f;k=g+148+((f&255)<<2)|0;b[k>>1]=(b[k>>1]|0)+1&65535;o=(c[g+5792>>2]|0)==((c[g+5788>>2]|0)-1|0)|0;if((o|0)!=0){if((c[g+92>>2]|0)>=0){q=(c[g+56>>2]|0)+(c[g+92>>2]|0)|0}else{q=0}bD(g,q,(c[g+108>>2]|0)-(c[g+92>>2]|0)|0,0);c[g+92>>2]=c[g+108>>2];be(c[g>>2]|0)}k=g+108|0;c[k>>2]=(c[k>>2]|0)+1;k=g+116|0;c[k>>2]=(c[k>>2]|0)-1;if((c[(c[g>>2]|0)+16>>2]|0)==0){h=639;break}}else{c[g+104>>2]=1;k=g+108|0;c[k>>2]=(c[k>>2]|0)+1;k=g+116|0;c[k>>2]=(c[k>>2]|0)-1}}}if((h|0)==599){r=0;s=r;return s|0}else if((h|0)==601){if((c[g+104>>2]|0)!=0){q=a[(c[g+56>>2]|0)+((c[g+108>>2]|0)-1)|0]|0;b[(c[g+5796>>2]|0)+(c[g+5792>>2]<<1)>>1]=0;p=g+5792|0;n=c[p>>2]|0;c[p>>2]=n+1;a[(c[g+5784>>2]|0)+n|0]=q;n=g+148+((q&255)<<2)|0;b[n>>1]=(b[n>>1]|0)+1&65535;o=(c[g+5792>>2]|0)==((c[g+5788>>2]|0)-1|0)|0;c[g+104>>2]=0}if((c[g+108>>2]|0)>>>0<2>>>0){t=c[g+108>>2]|0}else{t=2}c[g+5812>>2]=t;if((e|0)==4){if((c[g+92>>2]|0)>=0){u=(c[g+56>>2]|0)+(c[g+92>>2]|0)|0}else{u=0}bD(g,u,(c[g+108>>2]|0)-(c[g+92>>2]|0)|0,1);c[g+92>>2]=c[g+108>>2];be(c[g>>2]|0);if((c[(c[g>>2]|0)+16>>2]|0)==0){r=2;s=r;return s|0}else{r=3;s=r;return s|0}}do{if((c[g+5792>>2]|0)!=0){if((c[g+92>>2]|0)>=0){v=(c[g+56>>2]|0)+(c[g+92>>2]|0)|0}else{v=0}bD(g,v,(c[g+108>>2]|0)-(c[g+92>>2]|0)|0,0);c[g+92>>2]=c[g+108>>2];be(c[g>>2]|0);if((c[(c[g>>2]|0)+16>>2]|0)!=0){break}r=0;s=r;return s|0}}while(0);r=1;s=r;return s|0}else if((h|0)==629){r=0;s=r;return s|0}else if((h|0)==639){r=0;s=r;return s|0}return 0}function bl(b,f){b=b|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;g=b;b=f;f=c[g+124>>2]|0;h=(c[g+56>>2]|0)+(c[g+108>>2]|0)|0;i=c[g+120>>2]|0;j=c[g+144>>2]|0;if((c[g+108>>2]|0)>>>0>((c[g+44>>2]|0)-262|0)>>>0){k=(c[g+108>>2]|0)-((c[g+44>>2]|0)-262)|0}else{k=0}l=k;k=c[g+64>>2]|0;m=c[g+52>>2]|0;n=(c[g+56>>2]|0)+(c[g+108>>2]|0)+258|0;o=a[h+(i-1)|0]|0;p=a[h+i|0]|0;if((c[g+120>>2]|0)>>>0>=(c[g+140>>2]|0)>>>0){f=f>>>2}if(j>>>0>(c[g+116>>2]|0)>>>0){j=c[g+116>>2]|0}L883:do{q=(c[g+56>>2]|0)+b|0;do{if((d[q+i|0]|0|0)!=(p&255|0)){r=684}else{if((d[q+(i-1)|0]|0|0)!=(o&255|0)){r=684;break}if((d[q]|0|0)!=(d[h]|0|0)){r=684;break}s=q+1|0;q=s;if((d[s]|0|0)!=(d[h+1|0]|0|0)){r=684;break}h=h+2|0;q=q+1|0;do{s=h+1|0;h=s;t=q+1|0;q=t;do{if((d[s]|0|0)==(d[t]|0|0)){u=h+1|0;h=u;v=q+1|0;q=v;if((d[u]|0|0)!=(d[v]|0|0)){w=0;break}v=h+1|0;h=v;u=q+1|0;q=u;if((d[v]|0|0)!=(d[u]|0|0)){w=0;break}u=h+1|0;h=u;v=q+1|0;q=v;if((d[u]|0|0)!=(d[v]|0|0)){w=0;break}v=h+1|0;h=v;u=q+1|0;q=u;if((d[v]|0|0)!=(d[u]|0|0)){w=0;break}u=h+1|0;h=u;v=q+1|0;q=v;if((d[u]|0|0)!=(d[v]|0|0)){w=0;break}v=h+1|0;h=v;u=q+1|0;q=u;if((d[v]|0|0)!=(d[u]|0|0)){w=0;break}u=h+1|0;h=u;v=q+1|0;q=v;if((d[u]|0|0)!=(d[v]|0|0)){w=0;break}w=h>>>0<n>>>0}else{w=0}}while(0)}while(w);t=258-(n-h)|0;h=n-258|0;if((t|0)>(i|0)){c[g+112>>2]=b;i=t;if((t|0)>=(j|0)){r=699;break L883}o=a[h+(i-1)|0]|0;p=a[h+i|0]|0}}}while(0);if((r|0)==684){r=0}q=e[k+((b&m)<<1)>>1]|0;b=q;if(q>>>0>l>>>0){q=f-1|0;f=q;x=(q|0)!=0}else{x=0}}while(x);if(i>>>0<=(c[g+116>>2]|0)>>>0){y=i;z=y;return z|0}else{y=c[g+116>>2]|0;z=y;return z|0}return 0}function bm(a){a=a|0;var b=0,d=0,e=0,f=0;b=a;do{if((b|0)!=0){if((c[b+28>>2]|0)==0){break}a=c[b+28>>2]|0;c[a+28>>2]=0;c[b+20>>2]=0;c[b+8>>2]=0;c[b+24>>2]=0;if((c[a+8>>2]|0)!=0){c[b+48>>2]=c[a+8>>2]&1}c[a>>2]=0;c[a+4>>2]=0;c[a+12>>2]=0;c[a+20>>2]=32768;c[a+32>>2]=0;c[a+56>>2]=0;c[a+60>>2]=0;d=a+1328|0;c[a+108>>2]=d;c[a+80>>2]=d;c[a+76>>2]=d;c[a+7104>>2]=1;c[a+7108>>2]=-1;e=0;f=e;return f|0}}while(0);e=-2;f=e;return f|0}function bn(a){a=a|0;var b=0,d=0,e=0;b=a;do{if((b|0)!=0){if((c[b+28>>2]|0)==0){break}a=c[b+28>>2]|0;c[a+40>>2]=0;c[a+44>>2]=0;c[a+48>>2]=0;d=bm(b)|0;e=d;return e|0}}while(0);d=-2;e=d;return e|0}function bo(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=a;a=b;do{if((d|0)!=0){if((c[d+28>>2]|0)==0){break}b=c[d+28>>2]|0;if((a|0)<0){e=0;a=-a|0}else{e=(a>>4)+1|0;if((a|0)<48){a=a&15}}do{if((a|0)!=0){if((a|0)>=8){if((a|0)<=15){break}}f=-2;g=f;return g|0}}while(0);do{if((c[b+52>>2]|0)!=0){if((c[b+36>>2]|0)==(a|0)){break}aJ[c[d+36>>2]&3](c[d+40>>2]|0,c[b+52>>2]|0);c[b+52>>2]=0}}while(0);c[b+8>>2]=e;c[b+36>>2]=a;f=bn(d)|0;g=f;return g|0}}while(0);f=-2;g=f;return g|0}function bp(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0;g=b;b=d;d=e;e=f;do{if((d|0)!=0){if((a[d|0]|0)!=(a[12800]|0)){break}if((e|0)!=56){break}if((g|0)==0){h=-2;i=h;return i|0}c[g+24>>2]=0;if((c[g+32>>2]|0)==0){c[g+32>>2]=2;c[g+40>>2]=0}if((c[g+36>>2]|0)==0){c[g+36>>2]=2}f=aK[c[g+32>>2]&3](c[g+40>>2]|0,1,7116)|0;if((f|0)==0){h=-4;i=h;return i|0}c[g+28>>2]=f;c[f+52>>2]=0;j=bo(g,b)|0;if((j|0)!=0){aJ[c[g+36>>2]&3](c[g+40>>2]|0,f);c[g+28>>2]=0}h=j;i=h;return i|0}}while(0);h=-6;i=h;return i|0}function bq(f,g){f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;h=i;i=i+24|0;j=h|0;k=h+8|0;l=h+16|0;m=f;f=g;do{if((m|0)!=0){if((c[m+28>>2]|0)==0){break}if((c[m+12>>2]|0)==0){break}if((c[m>>2]|0)==0){if((c[m+4>>2]|0)!=0){break}}g=c[m+28>>2]|0;if((c[g>>2]|0)==11){c[g>>2]=12}n=c[m+12>>2]|0;o=c[m+16>>2]|0;p=c[m>>2]|0;q=c[m+4>>2]|0;r=c[g+56>>2]|0;s=c[g+60>>2]|0;t=q;u=o;v=0;L1002:while(1){L1004:do{switch(c[g>>2]|0){case 7:{w=933;break};case 0:{if((c[g+8>>2]|0)==0){c[g>>2]=12;break L1004}while(1){if(s>>>0>=16>>>0){break}if((q|0)==0){w=786;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}do{if((c[g+8>>2]&2|0)!=0){if((r|0)!=35615){break}c[g+24>>2]=bT(0,0,0)|0;a[l|0]=r&255;a[l+1|0]=r>>>8&255;c[g+24>>2]=bT(c[g+24>>2]|0,l|0,2)|0;r=0;s=0;c[g>>2]=1;break L1004}}while(0);c[g+16>>2]=0;if((c[g+32>>2]|0)!=0){c[(c[g+32>>2]|0)+48>>2]=-1}do{if((c[g+8>>2]&1|0)!=0){if((((((r&255)<<8)+(r>>>8)|0)>>>0)%31|0|0)!=0){break}if((r&15|0)!=8){c[m+24>>2]=13256;c[g>>2]=29;break L1004}r=r>>>4;s=s-4|0;y=(r&15)+8|0;do{if((c[g+36>>2]|0)==0){c[g+36>>2]=y}else{if(y>>>0>(c[g+36>>2]|0)>>>0){c[m+24>>2]=13176;c[g>>2]=29;break L1004}else{break}}}while(0);c[g+20>>2]=1<<y;x=bS(0,0,0)|0;c[g+24>>2]=x;c[m+48>>2]=x;c[g>>2]=(r&512|0)!=0?9:11;r=0;s=0;break L1004}}while(0);c[m+24>>2]=13536;c[g>>2]=29;break};case 8:{w=954;break};case 9:{while(1){if(s>>>0>=32>>>0){break}if((q|0)==0){w=977;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}x=(r>>>24&255)+(r>>>8&65280)+((r&65280)<<8)+((r&255)<<24)|0;c[g+24>>2]=x;c[m+48>>2]=x;r=0;s=0;c[g>>2]=10;w=984;break};case 4:{w=872;break};case 10:{w=984;break};case 11:{w=989;break};case 12:{w=993;break};case 13:{r=r>>>((s&7)>>>0);s=s-(s&7)|0;while(1){if(s>>>0>=32>>>0){break}if((q|0)==0){w=1027;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}if((r&65535|0)!=(r>>>16^65535|0)){c[m+24>>2]=12896;c[g>>2]=29;break L1004}c[g+64>>2]=r&65535;r=0;s=0;c[g>>2]=14;if((f|0)==6){w=1036;break L1002}w=1038;break};case 6:{w=912;break};case 3:{w=854;break};case 14:{w=1038;break};case 15:{w=1039;break};case 16:{while(1){if(s>>>0>=14>>>0){break}if((q|0)==0){w=1053;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}c[g+96>>2]=(r&31)+257;r=r>>>5;s=s-5|0;c[g+100>>2]=(r&31)+1;r=r>>>5;s=s-5|0;c[g+92>>2]=(r&15)+4;r=r>>>4;s=s-4|0;do{if((c[g+96>>2]|0)>>>0<=286>>>0){if((c[g+100>>2]|0)>>>0>30>>>0){break}c[g+104>>2]=0;c[g>>2]=17;w=1067;break L1004}}while(0);c[m+24>>2]=12832;c[g>>2]=29;break};case 17:{w=1067;break};case 18:{w=1087;break};case 2:{w=836;break};case 5:{w=895;break};case 1:{while(1){if(s>>>0>=16>>>0){break}if((q|0)==0){w=819;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}c[g+16>>2]=r;if((c[g+16>>2]&255|0)!=8){c[m+24>>2]=13256;c[g>>2]=29;break L1004}if((c[g+16>>2]&57344|0)!=0){c[m+24>>2]=13088;c[g>>2]=29;break L1004}if((c[g+32>>2]|0)!=0){c[c[g+32>>2]>>2]=r>>>8&1}if((c[g+16>>2]&512|0)!=0){a[l|0]=r&255;a[l+1|0]=r>>>8&255;c[g+24>>2]=bT(c[g+24>>2]|0,l|0,2)|0}r=0;s=0;c[g>>2]=2;w=836;break};case 19:{w=1166;break};case 20:{w=1167;break};case 21:{w=1206;break};case 22:{w=1220;break};case 23:{w=1245;break};case 24:{w=1259;break};case 25:{if((o|0)==0){w=1282;break L1002}x=n;n=x+1|0;a[x]=c[g+64>>2]&255;o=o-1|0;c[g>>2]=20;break};case 26:{if((c[g+8>>2]|0)!=0){while(1){if(s>>>0>=32>>>0){break}if((q|0)==0){w=1290;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}u=u-o|0;x=m+20|0;c[x>>2]=(c[x>>2]|0)+u;x=g+28|0;c[x>>2]=(c[x>>2]|0)+u;if((u|0)!=0){if((c[g+16>>2]|0)!=0){z=bT(c[g+24>>2]|0,n+(-u|0)|0,u)|0}else{z=bS(c[g+24>>2]|0,n+(-u|0)|0,u)|0}c[g+24>>2]=z;c[m+48>>2]=z}u=o;if((c[g+16>>2]|0)!=0){A=r}else{A=(r>>>24&255)+(r>>>8&65280)+((r&65280)<<8)+((r&255)<<24)|0}if((A|0)!=(c[g+24>>2]|0)){c[m+24>>2]=13328;c[g>>2]=29;break L1004}r=0;s=0}c[g>>2]=27;w=1308;break};case 27:{w=1308;break};case 28:{w=1325;break L1002;break};case 29:{w=1326;break L1002;break};case 30:{w=1327;break L1002;break};case 31:{w=1328;break L1002;break};default:{w=1329;break L1002}}}while(0);do{if((w|0)==984){w=0;if((c[g+12>>2]|0)==0){w=985;break L1002}x=bS(0,0,0)|0;c[g+24>>2]=x;c[m+48>>2]=x;c[g>>2]=11;w=989}else if((w|0)==1038){w=0;c[g>>2]=15;w=1039}else if((w|0)==1067){w=0;while(1){if((c[g+104>>2]|0)>>>0>=(c[g+92>>2]|0)>>>0){break}while(1){if(s>>>0>=3>>>0){break}if((q|0)==0){w=1074;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}x=g+104|0;B=c[x>>2]|0;c[x>>2]=B+1;b[g+112+((e[1648+(B<<1)>>1]|0)<<1)>>1]=r&7;r=r>>>3;s=s-3|0}while(1){if((c[g+104>>2]|0)>>>0>=19>>>0){break}B=g+104|0;x=c[B>>2]|0;c[B>>2]=x+1;b[g+112+((e[1648+(x<<1)>>1]|0)<<1)>>1]=0}c[g+108>>2]=g+1328;c[g+76>>2]=c[g+108>>2];c[g+84>>2]=7;v=bu(0,g+112|0,19,g+108|0,g+84|0,g+752|0)|0;if((v|0)!=0){c[m+24>>2]=12768;c[g>>2]=29;break}else{c[g+104>>2]=0;c[g>>2]=18;w=1087;break}}else if((w|0)==836){w=0;while(1){if(s>>>0>=32>>>0){break}if((q|0)==0){w=841;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}if((c[g+32>>2]|0)!=0){c[(c[g+32>>2]|0)+4>>2]=r}if((c[g+16>>2]&512|0)!=0){a[l|0]=r&255;a[l+1|0]=r>>>8&255;a[l+2|0]=r>>>16&255;a[l+3|0]=r>>>24&255;c[g+24>>2]=bT(c[g+24>>2]|0,l|0,4)|0}r=0;s=0;c[g>>2]=3;w=854}else if((w|0)==1308){w=0;if((c[g+8>>2]|0)==0){w=1324;break L1002}if((c[g+16>>2]|0)==0){w=1324;break L1002}while(1){if(s>>>0>=32>>>0){break}if((q|0)==0){w=1315;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}if((r|0)==(c[g+28>>2]|0)){w=1321;break L1002}c[m+24>>2]=13304;c[g>>2]=29}}while(0);do{if((w|0)==989){w=0;if((f|0)==5){w=991;break L1002}if((f|0)==6){w=991;break L1002}w=993}else if((w|0)==854){w=0;while(1){if(s>>>0>=16>>>0){break}if((q|0)==0){w=859;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}if((c[g+32>>2]|0)!=0){c[(c[g+32>>2]|0)+8>>2]=r&255;c[(c[g+32>>2]|0)+12>>2]=r>>>8}if((c[g+16>>2]&512|0)!=0){a[l|0]=r&255;a[l+1|0]=r>>>8&255;c[g+24>>2]=bT(c[g+24>>2]|0,l|0,2)|0}r=0;s=0;c[g>>2]=4;w=872}else if((w|0)==1039){w=0;C=c[g+64>>2]|0;if((C|0)==0){c[g>>2]=11;break}if(C>>>0>q>>>0){C=q}if(C>>>0>o>>>0){C=o}if((C|0)==0){w=1045;break L1002}x=n;B=p;D=C;b_(x|0,B|0,D)|0;q=q-C|0;p=p+C|0;o=o-C|0;n=n+C|0;D=g+64|0;c[D>>2]=(c[D>>2]|0)-C}else if((w|0)==1087){w=0;while(1){if((c[g+104>>2]|0)>>>0>=((c[g+96>>2]|0)+(c[g+100>>2]|0)|0)>>>0){break}while(1){D=j;B=(c[g+76>>2]|0)+((r&(1<<c[g+84>>2])-1)<<2)|0;b[D>>1]=b[B>>1]|0;b[D+2>>1]=b[B+2>>1]|0;if((d[j+1|0]|0)>>>0<=s>>>0){break}if((q|0)==0){w=1094;break L1002}q=q-1|0;B=p;p=B+1|0;r=r+((d[B]|0)<<s)|0;s=s+8|0}if((e[j+2>>1]|0|0)<16){r=r>>>((d[j+1|0]|0)>>>0);s=s-(d[j+1|0]|0)|0;B=b[j+2>>1]|0;D=g+104|0;x=c[D>>2]|0;c[D>>2]=x+1;b[g+112+(x<<1)>>1]=B}else{if((e[j+2>>1]|0|0)==16){while(1){if(s>>>0>=((d[j+1|0]|0)+2|0)>>>0){break}if((q|0)==0){w=1107;break L1002}q=q-1|0;B=p;p=B+1|0;r=r+((d[B]|0)<<s)|0;s=s+8|0}r=r>>>((d[j+1|0]|0)>>>0);s=s-(d[j+1|0]|0)|0;if((c[g+104>>2]|0)==0){w=1114;break}y=e[g+112+((c[g+104>>2]|0)-1<<1)>>1]|0;C=(r&3)+3|0;r=r>>>2;s=s-2|0}else{if((e[j+2>>1]|0|0)==17){while(1){if(s>>>0>=((d[j+1|0]|0)+3|0)>>>0){break}if((q|0)==0){w=1124;break L1002}q=q-1|0;B=p;p=B+1|0;r=r+((d[B]|0)<<s)|0;s=s+8|0}r=r>>>((d[j+1|0]|0)>>>0);s=s-(d[j+1|0]|0)|0;y=0;C=(r&7)+3|0;r=r>>>3;s=s-3|0}else{while(1){if(s>>>0>=((d[j+1|0]|0)+7|0)>>>0){break}if((q|0)==0){w=1138;break L1002}q=q-1|0;B=p;p=B+1|0;r=r+((d[B]|0)<<s)|0;s=s+8|0}r=r>>>((d[j+1|0]|0)>>>0);s=s-(d[j+1|0]|0)|0;y=0;C=(r&127)+11|0;r=r>>>7;s=s-7|0}}if(((c[g+104>>2]|0)+C|0)>>>0>((c[g+96>>2]|0)+(c[g+100>>2]|0)|0)>>>0){w=1149;break}while(1){B=C;C=B-1|0;if((B|0)==0){break}B=g+104|0;x=c[B>>2]|0;c[B>>2]=x+1;b[g+112+(x<<1)>>1]=y&65535}}}if((w|0)==1114){w=0;c[m+24>>2]=13600;c[g>>2]=29}else if((w|0)==1149){w=0;c[m+24>>2]=13600;c[g>>2]=29}if((c[g>>2]|0)==29){break}if((e[g+624>>1]|0|0)==0){c[m+24>>2]=13560;c[g>>2]=29;break}c[g+108>>2]=g+1328;c[g+76>>2]=c[g+108>>2];c[g+84>>2]=9;v=bu(1,g+112|0,c[g+96>>2]|0,g+108|0,g+84|0,g+752|0)|0;if((v|0)!=0){c[m+24>>2]=13504;c[g>>2]=29;break}c[g+80>>2]=c[g+108>>2];c[g+88>>2]=6;v=bu(2,g+112+(c[g+96>>2]<<1)|0,c[g+100>>2]|0,g+108|0,g+88|0,g+752|0)|0;if((v|0)!=0){c[m+24>>2]=13480;c[g>>2]=29;break}c[g>>2]=19;if((f|0)==6){w=1164;break L1002}w=1166}}while(0);do{if((w|0)==872){w=0;if((c[g+16>>2]&1024|0)!=0){while(1){if(s>>>0>=16>>>0){break}if((q|0)==0){w=878;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}c[g+64>>2]=r;if((c[g+32>>2]|0)!=0){c[(c[g+32>>2]|0)+20>>2]=r}if((c[g+16>>2]&512|0)!=0){a[l|0]=r&255;a[l+1|0]=r>>>8&255;c[g+24>>2]=bT(c[g+24>>2]|0,l|0,2)|0}r=0;s=0}else{if((c[g+32>>2]|0)!=0){c[(c[g+32>>2]|0)+16>>2]=0}}c[g>>2]=5;w=895}else if((w|0)==993){w=0;if((c[g+4>>2]|0)!=0){r=r>>>((s&7)>>>0);s=s-(s&7)|0;c[g>>2]=26;break}while(1){if(s>>>0>=3>>>0){break}if((q|0)==0){w=1002;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}c[g+4>>2]=r&1;r=r>>>1;s=s-1|0;x=r&3;if((x|0)==0){c[g>>2]=13}else if((x|0)==1){br(g);c[g>>2]=19;if((f|0)==6){w=1011;break L1002}}else if((x|0)==2){c[g>>2]=16}else if((x|0)==3){c[m+24>>2]=12960;c[g>>2]=29}r=r>>>2;s=s-2|0}else if((w|0)==1166){w=0;c[g>>2]=20;w=1167}}while(0);L1392:do{if((w|0)==895){w=0;if((c[g+16>>2]&1024|0)!=0){C=c[g+64>>2]|0;if(C>>>0>q>>>0){C=q}if((C|0)!=0){do{if((c[g+32>>2]|0)!=0){if((c[(c[g+32>>2]|0)+16>>2]|0)==0){break}y=(c[(c[g+32>>2]|0)+20>>2]|0)-(c[g+64>>2]|0)|0;x=(c[(c[g+32>>2]|0)+16>>2]|0)+y|0;B=p;if((y+C|0)>>>0>(c[(c[g+32>>2]|0)+24>>2]|0)>>>0){E=(c[(c[g+32>>2]|0)+24>>2]|0)-y|0}else{E=C}b_(x|0,B|0,E)|0}}while(0);if((c[g+16>>2]&512|0)!=0){c[g+24>>2]=bT(c[g+24>>2]|0,p,C)|0}q=q-C|0;p=p+C|0;B=g+64|0;c[B>>2]=(c[B>>2]|0)-C}if((c[g+64>>2]|0)!=0){w=909;break L1002}}c[g+64>>2]=0;c[g>>2]=6;w=912}else if((w|0)==1167){w=0;do{if(q>>>0>=6>>>0){if(o>>>0<258>>>0){break}c[m+12>>2]=n;c[m+16>>2]=o;c[m>>2]=p;c[m+4>>2]=q;c[g+56>>2]=r;c[g+60>>2]=s;bW(m,u);n=c[m+12>>2]|0;o=c[m+16>>2]|0;p=c[m>>2]|0;q=c[m+4>>2]|0;r=c[g+56>>2]|0;s=c[g+60>>2]|0;if((c[g>>2]|0)==11){c[g+7108>>2]=-1}break L1392}}while(0);c[g+7108>>2]=0;while(1){B=j;x=(c[g+76>>2]|0)+((r&(1<<c[g+84>>2])-1)<<2)|0;b[B>>1]=b[x>>1]|0;b[B+2>>1]=b[x+2>>1]|0;if((d[j+1|0]|0)>>>0<=s>>>0){break}if((q|0)==0){w=1181;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}do{if((d[j|0]|0|0)!=0){if((a[j|0]&240|0)!=0){break}x=k;B=j;b[x>>1]=b[B>>1]|0;b[x+2>>1]=b[B+2>>1]|0;while(1){B=j;x=(c[g+76>>2]|0)+((e[k+2>>1]|0)+((r&(1<<(d[k+1|0]|0)+(d[k|0]|0))-1)>>>((d[k+1|0]|0)>>>0))<<2)|0;b[B>>1]=b[x>>1]|0;b[B+2>>1]=b[x+2>>1]|0;if(((d[k+1|0]|0)+(d[j+1|0]|0)|0)>>>0<=s>>>0){break}if((q|0)==0){w=1191;break L1002}q=q-1|0;x=p;p=x+1|0;r=r+((d[x]|0)<<s)|0;s=s+8|0}r=r>>>((d[k+1|0]|0)>>>0);s=s-(d[k+1|0]|0)|0;x=g+7108|0;c[x>>2]=(c[x>>2]|0)+(d[k+1|0]|0)}}while(0);r=r>>>((d[j+1|0]|0)>>>0);s=s-(d[j+1|0]|0)|0;x=g+7108|0;c[x>>2]=(c[x>>2]|0)+(d[j+1|0]|0);c[g+64>>2]=e[j+2>>1]|0;if((d[j|0]|0|0)==0){c[g>>2]=25;break}if((a[j|0]&32|0)!=0){c[g+7108>>2]=-1;c[g>>2]=11;break}if((a[j|0]&64|0)!=0){c[m+24>>2]=13448;c[g>>2]=29;break}else{c[g+72>>2]=a[j|0]&15;c[g>>2]=21;w=1206;break}}}while(0);if((w|0)==912){w=0;if((c[g+16>>2]&2048|0)!=0){if((q|0)==0){w=914;break}C=0;do{x=C;C=x+1|0;y=d[p+x|0]|0;do{if((c[g+32>>2]|0)!=0){if((c[(c[g+32>>2]|0)+28>>2]|0)==0){break}if((c[g+64>>2]|0)>>>0>=(c[(c[g+32>>2]|0)+32>>2]|0)>>>0){break}x=g+64|0;B=c[x>>2]|0;c[x>>2]=B+1;a[(c[(c[g+32>>2]|0)+28>>2]|0)+B|0]=y&255}}while(0);if((y|0)!=0){F=C>>>0<q>>>0}else{F=0}}while(F);if((c[g+16>>2]&512|0)!=0){c[g+24>>2]=bT(c[g+24>>2]|0,p,C)|0}q=q-C|0;p=p+C|0;if((y|0)!=0){w=927;break}}else{if((c[g+32>>2]|0)!=0){c[(c[g+32>>2]|0)+28>>2]=0}}c[g+64>>2]=0;c[g>>2]=7;w=933}else if((w|0)==1206){w=0;if((c[g+72>>2]|0)!=0){while(1){if(s>>>0>=(c[g+72>>2]|0)>>>0){break}if((q|0)==0){w=1212;break L1002}q=q-1|0;B=p;p=B+1|0;r=r+((d[B]|0)<<s)|0;s=s+8|0}B=g+64|0;c[B>>2]=(c[B>>2]|0)+(r&(1<<c[g+72>>2])-1);r=r>>>((c[g+72>>2]|0)>>>0);s=s-(c[g+72>>2]|0)|0;B=g+7108|0;c[B>>2]=(c[B>>2]|0)+(c[g+72>>2]|0)}c[g+7112>>2]=c[g+64>>2];c[g>>2]=22;w=1220}do{if((w|0)==933){w=0;if((c[g+16>>2]&4096|0)!=0){if((q|0)==0){w=935;break L1002}C=0;do{B=C;C=B+1|0;y=d[p+B|0]|0;do{if((c[g+32>>2]|0)!=0){if((c[(c[g+32>>2]|0)+36>>2]|0)==0){break}if((c[g+64>>2]|0)>>>0>=(c[(c[g+32>>2]|0)+40>>2]|0)>>>0){break}B=g+64|0;x=c[B>>2]|0;c[B>>2]=x+1;a[(c[(c[g+32>>2]|0)+36>>2]|0)+x|0]=y&255}}while(0);if((y|0)!=0){G=C>>>0<q>>>0}else{G=0}}while(G);if((c[g+16>>2]&512|0)!=0){c[g+24>>2]=bT(c[g+24>>2]|0,p,C)|0}q=q-C|0;p=p+C|0;if((y|0)!=0){w=948;break L1002}}else{if((c[g+32>>2]|0)!=0){c[(c[g+32>>2]|0)+36>>2]=0}}c[g>>2]=8;w=954}else if((w|0)==1220){w=0;while(1){x=j;B=(c[g+80>>2]|0)+((r&(1<<c[g+88>>2])-1)<<2)|0;b[x>>1]=b[B>>1]|0;b[x+2>>1]=b[B+2>>1]|0;if((d[j+1|0]|0)>>>0<=s>>>0){break}if((q|0)==0){w=1225;break L1002}q=q-1|0;B=p;p=B+1|0;r=r+((d[B]|0)<<s)|0;s=s+8|0}if((a[j|0]&240|0)==0){B=k;x=j;b[B>>1]=b[x>>1]|0;b[B+2>>1]=b[x+2>>1]|0;while(1){x=j;B=(c[g+80>>2]|0)+((e[k+2>>1]|0)+((r&(1<<(d[k+1|0]|0)+(d[k|0]|0))-1)>>>((d[k+1|0]|0)>>>0))<<2)|0;b[x>>1]=b[B>>1]|0;b[x+2>>1]=b[B+2>>1]|0;if(((d[k+1|0]|0)+(d[j+1|0]|0)|0)>>>0<=s>>>0){break}if((q|0)==0){w=1234;break L1002}q=q-1|0;B=p;p=B+1|0;r=r+((d[B]|0)<<s)|0;s=s+8|0}r=r>>>((d[k+1|0]|0)>>>0);s=s-(d[k+1|0]|0)|0;B=g+7108|0;c[B>>2]=(c[B>>2]|0)+(d[k+1|0]|0)}r=r>>>((d[j+1|0]|0)>>>0);s=s-(d[j+1|0]|0)|0;B=g+7108|0;c[B>>2]=(c[B>>2]|0)+(d[j+1|0]|0);if((a[j|0]&64|0)!=0){c[m+24>>2]=13408;c[g>>2]=29;break}else{c[g+68>>2]=e[j+2>>1]|0;c[g+72>>2]=a[j|0]&15;c[g>>2]=23;w=1245;break}}}while(0);do{if((w|0)==954){w=0;if((c[g+16>>2]&512|0)!=0){while(1){if(s>>>0>=16>>>0){break}if((q|0)==0){w=960;break L1002}q=q-1|0;B=p;p=B+1|0;r=r+((d[B]|0)<<s)|0;s=s+8|0}if((r|0)!=(c[g+24>>2]&65535|0)){c[m+24>>2]=13040;c[g>>2]=29;break}r=0;s=0}if((c[g+32>>2]|0)!=0){c[(c[g+32>>2]|0)+44>>2]=c[g+16>>2]>>9&1;c[(c[g+32>>2]|0)+48>>2]=1}B=bT(0,0,0)|0;c[g+24>>2]=B;c[m+48>>2]=B;c[g>>2]=11}else if((w|0)==1245){w=0;if((c[g+72>>2]|0)!=0){while(1){if(s>>>0>=(c[g+72>>2]|0)>>>0){break}if((q|0)==0){w=1251;break L1002}q=q-1|0;B=p;p=B+1|0;r=r+((d[B]|0)<<s)|0;s=s+8|0}B=g+68|0;c[B>>2]=(c[B>>2]|0)+(r&(1<<c[g+72>>2])-1);r=r>>>((c[g+72>>2]|0)>>>0);s=s-(c[g+72>>2]|0)|0;B=g+7108|0;c[B>>2]=(c[B>>2]|0)+(c[g+72>>2]|0)}c[g>>2]=24;w=1259}}while(0);L1591:do{if((w|0)==1259){w=0;if((o|0)==0){w=1260;break L1002}C=u-o|0;if((c[g+68>>2]|0)>>>0>C>>>0){C=(c[g+68>>2]|0)-C|0;do{if(C>>>0>(c[g+44>>2]|0)>>>0){if((c[g+7104>>2]|0)!=0){c[m+24>>2]=13376;c[g>>2]=29;break L1591}else{break}}}while(0);if(C>>>0>(c[g+48>>2]|0)>>>0){C=C-(c[g+48>>2]|0)|0;H=(c[g+52>>2]|0)+((c[g+40>>2]|0)-C)|0}else{H=(c[g+52>>2]|0)+((c[g+48>>2]|0)-C)|0}if(C>>>0>(c[g+64>>2]|0)>>>0){C=c[g+64>>2]|0}}else{H=n+(-(c[g+68>>2]|0)|0)|0;C=c[g+64>>2]|0}if(C>>>0>o>>>0){C=o}o=o-C|0;B=g+64|0;c[B>>2]=(c[B>>2]|0)-C;do{B=H;H=B+1|0;x=n;n=x+1|0;a[x]=a[B]|0;B=C-1|0;C=B;}while((B|0)!=0);if((c[g+64>>2]|0)==0){c[g>>2]=20}}}while(0)}if((w|0)!=927)if((w|0)!=935)if((w|0)!=786)if((w|0)!=948)if((w|0)!=960)if((w|0)!=878)if((w|0)!=977)if((w|0)==985){c[m+12>>2]=n;c[m+16>>2]=o;c[m>>2]=p;c[m+4>>2]=q;c[g+56>>2]=r;c[g+60>>2]=s;I=2;J=I;i=h;return J|0}else if((w|0)!=991)if((w|0)!=1002)if((w|0)==1011){r=r>>>2;s=s-2|0}else if((w|0)!=909)if((w|0)!=914)if((w|0)!=859)if((w|0)!=1027)if((w|0)!=1036)if((w|0)!=1045)if((w|0)!=1053)if((w|0)!=1074)if((w|0)!=1094)if((w|0)!=841)if((w|0)!=819)if((w|0)!=1107)if((w|0)!=1124)if((w|0)!=1138)if((w|0)!=1164)if((w|0)!=1181)if((w|0)!=1191)if((w|0)!=1212)if((w|0)!=1225)if((w|0)!=1234)if((w|0)!=1251)if((w|0)!=1260)if((w|0)!=1282)if((w|0)!=1290)if((w|0)!=1315)if((w|0)==1321){r=0;s=0;w=1324}else if((w|0)==1326){v=-3}else if((w|0)==1327){I=-4;J=I;i=h;return J|0}else if((w|0)==1328){w=1329}if((w|0)==1324){c[g>>2]=28;w=1325}else if((w|0)==1329){I=-2;J=I;i=h;return J|0}if((w|0)==1325){v=1}c[m+12>>2]=n;c[m+16>>2]=o;c[m>>2]=p;c[m+4>>2]=q;c[g+56>>2]=r;c[g+60>>2]=s;do{if((c[g+40>>2]|0)!=0){w=1338}else{if((u|0)==(c[m+16>>2]|0)){break}if((c[g>>2]|0)>>>0>=29>>>0){break}if((c[g>>2]|0)>>>0<26>>>0){w=1338;break}if((f|0)!=4){w=1338}}}while(0);do{if((w|0)==1338){if((bs(m,c[m+12>>2]|0,u-(c[m+16>>2]|0)|0)|0)==0){break}c[g>>2]=30;I=-4;J=I;i=h;return J|0}}while(0);t=t-(c[m+4>>2]|0)|0;u=u-(c[m+16>>2]|0)|0;s=m+8|0;c[s>>2]=(c[s>>2]|0)+t;s=m+20|0;c[s>>2]=(c[s>>2]|0)+u;s=g+28|0;c[s>>2]=(c[s>>2]|0)+u;do{if((c[g+8>>2]|0)!=0){if((u|0)==0){break}if((c[g+16>>2]|0)!=0){K=bT(c[g+24>>2]|0,(c[m+12>>2]|0)+(-u|0)|0,u)|0}else{K=bS(c[g+24>>2]|0,(c[m+12>>2]|0)+(-u|0)|0,u)|0}c[g+24>>2]=K;c[m+48>>2]=K}}while(0);if((c[g>>2]|0)==19){L=1}else{L=(c[g>>2]|0)==14}c[m+44>>2]=(c[g+60>>2]|0)+((c[g+4>>2]|0)!=0?64:0)+((c[g>>2]|0)==11?128:0)+(L?256:0);if((t|0)==0){if((u|0)==0){w=1352}else{w=1351}}else{w=1351}if((w|0)==1351){if((f|0)==4){w=1352}}do{if((w|0)==1352){if((v|0)!=0){break}v=-5}}while(0);I=v;J=I;i=h;return J|0}}while(0);I=-2;J=I;i=h;return J|0}function br(a){a=a|0;var b=0;b=a;c[b+76>>2]=1688;c[b+84>>2]=9;c[b+80>>2]=3736;c[b+88>>2]=5;return}function bs(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=a;a=b;b=d;d=c[e+28>>2]|0;do{if((c[d+52>>2]|0)==0){c[d+52>>2]=aK[c[e+32>>2]&3](c[e+40>>2]|0,1<<c[d+36>>2],1)|0;if((c[d+52>>2]|0)!=0){break}f=1;g=f;return g|0}}while(0);if((c[d+40>>2]|0)==0){c[d+40>>2]=1<<c[d+36>>2];c[d+48>>2]=0;c[d+44>>2]=0}if(b>>>0>=(c[d+40>>2]|0)>>>0){e=c[d+52>>2]|0;h=a+(-(c[d+40>>2]|0)|0)|0;i=c[d+40>>2]|0;b_(e|0,h|0,i)|0;c[d+48>>2]=0;c[d+44>>2]=c[d+40>>2]}else{i=(c[d+40>>2]|0)-(c[d+48>>2]|0)|0;if(i>>>0>b>>>0){i=b}h=(c[d+52>>2]|0)+(c[d+48>>2]|0)|0;e=a+(-b|0)|0;j=i;b_(h|0,e|0,j)|0;b=b-i|0;if((b|0)!=0){j=c[d+52>>2]|0;e=a+(-b|0)|0;a=b;b_(j|0,e|0,a)|0;c[d+48>>2]=b;c[d+44>>2]=c[d+40>>2]}else{b=d+48|0;c[b>>2]=(c[b>>2]|0)+i;if((c[d+48>>2]|0)==(c[d+40>>2]|0)){c[d+48>>2]=0}if((c[d+44>>2]|0)>>>0<(c[d+40>>2]|0)>>>0){b=d+44|0;c[b>>2]=(c[b>>2]|0)+i}}}f=0;g=f;return g|0}function bt(a){a=a|0;var b=0,d=0,e=0;b=a;do{if((b|0)!=0){if((c[b+28>>2]|0)==0){break}if((c[b+36>>2]|0)==0){break}a=c[b+28>>2]|0;if((c[a+52>>2]|0)!=0){aJ[c[b+36>>2]&3](c[b+40>>2]|0,c[a+52>>2]|0)}aJ[c[b+36>>2]&3](c[b+40>>2]|0,c[b+28>>2]|0);c[b+28>>2]=0;d=0;e=d;return e|0}}while(0);d=-2;e=d;return e|0}function bu(d,f,g,h,j,k){d=d|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0;l=i;i=i+72|0;m=l|0;n=l+8|0;o=l+40|0;p=d;d=f;f=g;g=h;h=j;j=k;k=0;while(1){if(k>>>0>15>>>0){break}b[n+(k<<1)>>1]=0;k=k+1|0}q=0;while(1){if(q>>>0>=f>>>0){break}r=n+((e[d+(q<<1)>>1]|0)<<1)|0;b[r>>1]=(b[r>>1]|0)+1&65535;q=q+1|0}r=c[h>>2]|0;s=15;while(1){if(s>>>0<1>>>0){break}if((e[n+(s<<1)>>1]|0|0)!=0){t=1406;break}s=s-1|0}if(r>>>0>s>>>0){r=s}if((s|0)==0){a[m|0]=64;a[m+1|0]=1;b[m+2>>1]=0;u=g;v=c[u>>2]|0;c[u>>2]=v+4;u=v;v=m;b[u>>1]=b[v>>1]|0;b[u+2>>1]=b[v+2>>1]|0;v=g;u=c[v>>2]|0;c[v>>2]=u+4;v=u;u=m;b[v>>1]=b[u>>1]|0;b[v+2>>1]=b[u+2>>1]|0;c[h>>2]=1;w=0;x=w;i=l;return x|0}u=1;while(1){if(u>>>0>=s>>>0){break}if((e[n+(u<<1)>>1]|0|0)!=0){t=1416;break}u=u+1|0}if(r>>>0<u>>>0){r=u}v=1;k=1;while(1){if(k>>>0>15>>>0){break}v=v<<1;v=v-(e[n+(k<<1)>>1]|0)|0;if((v|0)<0){t=1424;break}k=k+1|0}if((t|0)==1424){w=-1;x=w;i=l;return x|0}do{if((v|0)>0){if((p|0)!=0){if((s|0)==1){break}}w=-1;x=w;i=l;return x|0}}while(0);b[o+2>>1]=0;k=1;while(1){if(k>>>0>=15>>>0){break}b[o+(k+1<<1)>>1]=(e[o+(k<<1)>>1]|0)+(e[n+(k<<1)>>1]|0)&65535;k=k+1|0}q=0;while(1){if(q>>>0>=f>>>0){break}if((e[d+(q<<1)>>1]|0|0)!=0){y=o+((e[d+(q<<1)>>1]|0)<<1)|0;z=b[y>>1]|0;b[y>>1]=z+1&65535;b[j+((z&65535)<<1)>>1]=q&65535}q=q+1|0}o=p;if((o|0)==0){f=j;A=f;B=f;C=19}else if((o|0)==1){B=1456;B=B-514|0;A=1392;A=A-514|0;C=256}else{B=1584;A=1520;C=-1}o=0;q=0;k=u;f=c[g>>2]|0;z=r;y=0;D=-1;E=1<<r;F=E-1|0;if((p|0)==1){if(E>>>0<=852>>>0){t=1447}}else{t=1447}do{if((t|0)==1447){if((p|0)==2){if(E>>>0>592>>>0){break}}L1833:while(1){a[m+1|0]=k-y&255;if((e[j+(q<<1)>>1]|0|0)<(C|0)){a[m|0]=0;b[m+2>>1]=b[j+(q<<1)>>1]|0}else{if((e[j+(q<<1)>>1]|0|0)>(C|0)){a[m|0]=b[A+((e[j+(q<<1)>>1]|0)<<1)>>1]&255;b[m+2>>1]=b[B+((e[j+(q<<1)>>1]|0)<<1)>>1]|0}else{a[m|0]=96;b[m+2>>1]=0}}G=1<<k-y;H=1<<z;u=H;do{H=H-G|0;I=f+((o>>>(y>>>0))+H<<2)|0;J=m;b[I>>1]=b[J>>1]|0;b[I+2>>1]=b[J+2>>1]|0;}while((H|0)!=0);G=1<<k-1;while(1){if((o&G|0)==0){break}G=G>>>1}if((G|0)!=0){o=o&G-1;o=o+G|0}else{o=0}q=q+1|0;H=n+(k<<1)|0;J=(b[H>>1]|0)-1&65535;b[H>>1]=J;if((J&65535|0)==0){if((k|0)==(s|0)){break}k=e[d+((e[j+(q<<1)>>1]|0)<<1)>>1]|0}do{if(k>>>0>r>>>0){if((o&F|0)==(D|0)){break}if((y|0)==0){y=r}f=f+(u<<2)|0;z=k-y|0;v=1<<z;while(1){if((z+y|0)>>>0>=s>>>0){break}v=v-(e[n+(z+y<<1)>>1]|0)|0;if((v|0)<=0){t=1477;break}z=z+1|0;v=v<<1}if((t|0)==1477){t=0}E=E+(1<<z)|0;if((p|0)==1){if(E>>>0>852>>>0){t=1483;break L1833}}if((p|0)==2){if(E>>>0>592>>>0){t=1483;break L1833}}D=o&F;a[(c[g>>2]|0)+(D<<2)|0]=z&255;a[(c[g>>2]|0)+(D<<2)+1|0]=r&255;b[(c[g>>2]|0)+(D<<2)+2>>1]=((f-(c[g>>2]|0)|0)/4|0)&65535}}while(0)}if((t|0)==1483){w=1;x=w;i=l;return x|0}if((o|0)!=0){a[m|0]=64;a[m+1|0]=k-y&255;b[m+2>>1]=0;G=f+(o<<2)|0;J=m;b[G>>1]=b[J>>1]|0;b[G+2>>1]=b[J+2>>1]|0}J=g;c[J>>2]=(c[J>>2]|0)+(E<<2);c[h>>2]=r;w=0;x=w;i=l;return x|0}}while(0);w=1;x=w;i=l;return x|0}function bv(a){a=a|0;var d=0;d=a;bw();c[d+2840>>2]=d+148;c[d+2848>>2]=1200;c[d+2852>>2]=d+2440;c[d+2860>>2]=1344;c[d+2864>>2]=d+2684;c[d+2872>>2]=1368;b[d+5816>>1]=0;c[d+5820>>2]=0;bx(d);return}function bw(){return}function bx(a){a=a|0;var d=0;d=a;a=0;while(1){if((a|0)>=286){break}b[d+148+(a<<2)>>1]=0;a=a+1|0}a=0;while(1){if((a|0)>=30){break}b[d+2440+(a<<2)>>1]=0;a=a+1|0}a=0;while(1){if((a|0)>=19){break}b[d+2684+(a<<2)>>1]=0;a=a+1|0}b[d+1172>>1]=1;c[d+5804>>2]=0;c[d+5800>>2]=0;c[d+5808>>2]=0;c[d+5792>>2]=0;return}function by(d,f,g,h){d=d|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;i=d;d=f;f=g;g=h;h=3;if((c[i+5820>>2]|0)>(16-h|0)){j=g|0;k=i+5816|0;b[k>>1]=(e[k>>1]|0|(j&65535)<<c[i+5820>>2])&65535;k=(e[i+5816>>1]|0)&255;l=i+20|0;m=c[l>>2]|0;c[l>>2]=m+1;a[(c[i+8>>2]|0)+m|0]=k;k=(e[i+5816>>1]|0)>>8&255;m=i+20|0;l=c[m>>2]|0;c[m>>2]=l+1;a[(c[i+8>>2]|0)+l|0]=k;b[i+5816>>1]=(j&65535)>>16-(c[i+5820>>2]|0)&65535;j=i+5820|0;c[j>>2]=(c[j>>2]|0)+(h-16);n=i;o=d;p=f;bz(n,o,p,1);return}else{j=i+5816|0;b[j>>1]=(e[j>>1]|0|(g&65535)<<c[i+5820>>2])&65535;g=i+5820|0;c[g>>2]=(c[g>>2]|0)+h;n=i;o=d;p=f;bz(n,o,p,1);return}}function bz(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=b;b=d;d=e;bJ(g);if((f|0)!=0){f=g+20|0;e=c[f>>2]|0;c[f>>2]=e+1;a[(c[g+8>>2]|0)+e|0]=d&65535&255;e=g+20|0;f=c[e>>2]|0;c[e>>2]=f+1;a[(c[g+8>>2]|0)+f|0]=(d&65535)>>8&255;f=g+20|0;e=c[f>>2]|0;c[f>>2]=e+1;a[(c[g+8>>2]|0)+e|0]=~d&65535&255;e=g+20|0;f=c[e>>2]|0;c[e>>2]=f+1;a[(c[g+8>>2]|0)+f|0]=(~d&65535)>>8&255}while(1){f=d;d=f-1|0;if((f|0)==0){break}f=b;b=f+1|0;e=a[f]|0;f=g+20|0;h=c[f>>2]|0;c[f>>2]=h+1;a[(c[g+8>>2]|0)+h|0]=e}return}function bA(a){a=a|0;bB(a);return}function bB(d){d=d|0;var f=0,g=0,h=0;f=d;if((c[f+5820>>2]|0)==16){d=(e[f+5816>>1]|0)&255;g=f+20|0;h=c[g>>2]|0;c[g>>2]=h+1;a[(c[f+8>>2]|0)+h|0]=d;d=(e[f+5816>>1]|0)>>8&255;h=f+20|0;g=c[h>>2]|0;c[h>>2]=g+1;a[(c[f+8>>2]|0)+g|0]=d;b[f+5816>>1]=0;c[f+5820>>2]=0;return}if((c[f+5820>>2]|0)>=8){d=b[f+5816>>1]&255;g=f+20|0;h=c[g>>2]|0;c[g>>2]=h+1;a[(c[f+8>>2]|0)+h|0]=d;d=f+5816|0;b[d>>1]=(e[d>>1]|0)>>8&65535;d=f+5820|0;c[d>>2]=(c[d>>2]|0)-8}return}function bC(d){d=d|0;var f=0,g=0,h=0,i=0,j=0,k=0;f=d;d=3;if((c[f+5820>>2]|0)>(16-d|0)){g=2;h=f+5816|0;b[h>>1]=(e[h>>1]|0|(g&65535)<<c[f+5820>>2])&65535;h=(e[f+5816>>1]|0)&255;i=f+20|0;j=c[i>>2]|0;c[i>>2]=j+1;a[(c[f+8>>2]|0)+j|0]=h;h=(e[f+5816>>1]|0)>>8&255;j=f+20|0;i=c[j>>2]|0;c[j>>2]=i+1;a[(c[f+8>>2]|0)+i|0]=h;b[f+5816>>1]=(g&65535)>>16-(c[f+5820>>2]|0)&65535;g=f+5820|0;c[g>>2]=(c[g>>2]|0)+(d-16)}else{g=f+5816|0;b[g>>1]=(e[g>>1]|0|2<<c[f+5820>>2])&65535;g=f+5820|0;c[g>>2]=(c[g>>2]|0)+d}d=e[537]|0;if((c[f+5820>>2]|0)>(16-d|0)){g=e[536]|0;h=f+5816|0;b[h>>1]=(e[h>>1]|0|(g&65535)<<c[f+5820>>2])&65535;h=(e[f+5816>>1]|0)&255;i=f+20|0;j=c[i>>2]|0;c[i>>2]=j+1;a[(c[f+8>>2]|0)+j|0]=h;h=(e[f+5816>>1]|0)>>8&255;j=f+20|0;i=c[j>>2]|0;c[j>>2]=i+1;a[(c[f+8>>2]|0)+i|0]=h;b[f+5816>>1]=(g&65535)>>16-(c[f+5820>>2]|0)&65535;g=f+5820|0;c[g>>2]=(c[g>>2]|0)+(d-16);k=f;bB(k);return}else{g=f+5816|0;b[g>>1]=(e[g>>1]|0|(e[536]|0)<<c[f+5820>>2])&65535;g=f+5820|0;c[g>>2]=(c[g>>2]|0)+d;k=f;bB(k);return}}function bD(d,f,g,h){d=d|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0;i=d;d=f;f=g;g=h;h=0;if((c[i+132>>2]|0)>0){if((c[(c[i>>2]|0)+44>>2]|0)==2){j=bE(i)|0;c[(c[i>>2]|0)+44>>2]=j}bF(i,i+2840|0);bF(i,i+2852|0);h=bG(i)|0;k=((c[i+5800>>2]|0)+10|0)>>>3;l=((c[i+5804>>2]|0)+10|0)>>>3;if(l>>>0<=k>>>0){k=l}}else{j=f+5|0;l=j;k=j}do{if((f+4|0)>>>0<=k>>>0){if((d|0)==0){m=1551;break}by(i,d,f,g)}else{m=1551}}while(0);if((m|0)==1551){do{if((c[i+136>>2]|0)==4){m=1553}else{if((l|0)==(k|0)){m=1553;break}f=3;if((c[i+5820>>2]|0)>(16-f|0)){d=g+4|0;j=i+5816|0;b[j>>1]=(e[j>>1]|0|(d&65535)<<c[i+5820>>2])&65535;j=(e[i+5816>>1]|0)&255;n=i+20|0;o=c[n>>2]|0;c[n>>2]=o+1;a[(c[i+8>>2]|0)+o|0]=j;j=(e[i+5816>>1]|0)>>8&255;o=i+20|0;n=c[o>>2]|0;c[o>>2]=n+1;a[(c[i+8>>2]|0)+n|0]=j;b[i+5816>>1]=(d&65535)>>16-(c[i+5820>>2]|0)&65535;d=i+5820|0;c[d>>2]=(c[d>>2]|0)+(f-16)}else{d=i+5816|0;b[d>>1]=(e[d>>1]|0|(g+4&65535)<<c[i+5820>>2])&65535;d=i+5820|0;c[d>>2]=(c[d>>2]|0)+f}bI(i,(c[i+2844>>2]|0)+1|0,(c[i+2856>>2]|0)+1|0,h+1|0);bH(i,i+148|0,i+2440|0)}}while(0);if((m|0)==1553){m=3;if((c[i+5820>>2]|0)>(16-m|0)){h=g+2|0;k=i+5816|0;b[k>>1]=(e[k>>1]|0|(h&65535)<<c[i+5820>>2])&65535;k=(e[i+5816>>1]|0)&255;l=i+20|0;f=c[l>>2]|0;c[l>>2]=f+1;a[(c[i+8>>2]|0)+f|0]=k;k=(e[i+5816>>1]|0)>>8&255;f=i+20|0;l=c[f>>2]|0;c[f>>2]=l+1;a[(c[i+8>>2]|0)+l|0]=k;b[i+5816>>1]=(h&65535)>>16-(c[i+5820>>2]|0)&65535;h=i+5820|0;c[h>>2]=(c[h>>2]|0)+(m-16)}else{h=i+5816|0;b[h>>1]=(e[h>>1]|0|(g+2&65535)<<c[i+5820>>2])&65535;h=i+5820|0;c[h>>2]=(c[h>>2]|0)+m}bH(i,48,1224)}}bx(i);if((g|0)==0){return}bJ(i);return}function bE(a){a=a|0;var b=0,c=0,d=0,f=0,g=0;b=a;a=-201342849;c=0;while(1){if((c|0)>31){break}if((a&1|0)!=0){if((e[b+148+(c<<2)>>1]|0|0)!=0){d=1571;break}}c=c+1|0;a=a>>>1}if((d|0)==1571){f=0;g=f;return g|0}do{if((e[b+184>>1]|0|0)==0){if((e[b+188>>1]|0|0)!=0){break}if((e[b+200>>1]|0|0)!=0){break}c=32;while(1){if((c|0)>=256){d=1584;break}if((e[b+148+(c<<2)>>1]|0|0)!=0){d=1581;break}c=c+1|0}if((d|0)==1584){f=0;g=f;return g|0}else if((d|0)==1581){f=1;g=f;return g|0}}}while(0);f=1;g=f;return g|0}function bF(f,g){f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;h=f;f=g;g=c[f>>2]|0;i=c[c[f+8>>2]>>2]|0;j=c[(c[f+8>>2]|0)+12>>2]|0;k=-1;c[h+5200>>2]=0;c[h+5204>>2]=573;l=0;while(1){if((l|0)>=(j|0)){break}if((e[g+(l<<2)>>1]|0|0)!=0){m=l;k=m;n=h+5200|0;o=(c[n>>2]|0)+1|0;c[n>>2]=o;c[h+2908+(o<<2)>>2]=m;a[h+5208+l|0]=0}else{b[g+(l<<2)+2>>1]=0}l=l+1|0}while(1){if((c[h+5200>>2]|0)>=2){break}if((k|0)<2){m=k+1|0;k=m;p=m}else{p=0}m=h+5200|0;o=(c[m>>2]|0)+1|0;c[m>>2]=o;c[h+2908+(o<<2)>>2]=p;q=p;b[g+(q<<2)>>1]=1;a[h+5208+q|0]=0;o=h+5800|0;c[o>>2]=(c[o>>2]|0)-1;if((i|0)!=0){o=h+5804|0;c[o>>2]=(c[o>>2]|0)-(e[i+(q<<2)+2>>1]|0)}}c[f+4>>2]=k;l=(c[h+5200>>2]|0)/2|0;while(1){if((l|0)<1){break}bM(h,g,l);l=l-1|0}q=j;do{l=c[h+2912>>2]|0;j=h+5200|0;i=c[j>>2]|0;c[j>>2]=i-1;c[h+2912>>2]=c[h+2908+(i<<2)>>2];bM(h,g,1);i=c[h+2912>>2]|0;j=h+5204|0;p=(c[j>>2]|0)-1|0;c[j>>2]=p;c[h+2908+(p<<2)>>2]=l;p=h+5204|0;j=(c[p>>2]|0)-1|0;c[p>>2]=j;c[h+2908+(j<<2)>>2]=i;b[g+(q<<2)>>1]=(e[g+(l<<2)>>1]|0)+(e[g+(i<<2)>>1]|0)&65535;if((d[h+5208+l|0]|0|0)>=(d[h+5208+i|0]|0|0)){r=d[h+5208+l|0]|0}else{r=d[h+5208+i|0]|0}a[h+5208+q|0]=r+1&255;j=q&65535;b[g+(i<<2)+2>>1]=j;b[g+(l<<2)+2>>1]=j;j=q;q=j+1|0;c[h+2912>>2]=j;bM(h,g,1);}while((c[h+5200>>2]|0)>=2);q=c[h+2912>>2]|0;l=h+5204|0;r=(c[l>>2]|0)-1|0;c[l>>2]=r;c[h+2908+(r<<2)>>2]=q;bN(h,f);bO(g,k,h+2876|0);return}function bG(a){a=a|0;var b=0,f=0;b=a;bL(b,b+148|0,c[b+2844>>2]|0);bL(b,b+2440|0,c[b+2856>>2]|0);bF(b,b+2864|0);a=18;while(1){if((a|0)<3){break}if((e[b+2684+((d[12504+a|0]|0)<<2)+2>>1]|0|0)!=0){f=1619;break}a=a-1|0}f=b+5800|0;c[f>>2]=(c[f>>2]|0)+(((a+1|0)*3|0)+14);return a|0}function bH(f,g,h){f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;i=f;f=g;g=h;h=0;if((c[i+5792>>2]|0)!=0){do{j=e[(c[i+5796>>2]|0)+(h<<1)>>1]|0;k=h;h=k+1|0;l=d[(c[i+5784>>2]|0)+k|0]|0;if((j|0)==0){k=e[f+(l<<2)+2>>1]|0;if((c[i+5820>>2]|0)>(16-k|0)){m=e[f+(l<<2)>>1]|0;n=i+5816|0;b[n>>1]=(e[n>>1]|0|(m&65535)<<c[i+5820>>2])&65535;n=(e[i+5816>>1]|0)&255;o=i+20|0;p=c[o>>2]|0;c[o>>2]=p+1;a[(c[i+8>>2]|0)+p|0]=n;n=(e[i+5816>>1]|0)>>8&255;p=i+20|0;o=c[p>>2]|0;c[p>>2]=o+1;a[(c[i+8>>2]|0)+o|0]=n;b[i+5816>>1]=(m&65535)>>16-(c[i+5820>>2]|0)&65535;m=i+5820|0;c[m>>2]=(c[m>>2]|0)+(k-16)}else{m=i+5816|0;b[m>>1]=(e[m>>1]|0|(e[f+(l<<2)>>1]|0)<<c[i+5820>>2])&65535;m=i+5820|0;c[m>>2]=(c[m>>2]|0)+k}}else{k=d[13664+l|0]|0;m=e[f+(k+257<<2)+2>>1]|0;if((c[i+5820>>2]|0)>(16-m|0)){n=e[f+(k+257<<2)>>1]|0;o=i+5816|0;b[o>>1]=(e[o>>1]|0|(n&65535)<<c[i+5820>>2])&65535;o=(e[i+5816>>1]|0)&255;p=i+20|0;q=c[p>>2]|0;c[p>>2]=q+1;a[(c[i+8>>2]|0)+q|0]=o;o=(e[i+5816>>1]|0)>>8&255;q=i+20|0;p=c[q>>2]|0;c[q>>2]=p+1;a[(c[i+8>>2]|0)+p|0]=o;b[i+5816>>1]=(n&65535)>>16-(c[i+5820>>2]|0)&65535;n=i+5820|0;c[n>>2]=(c[n>>2]|0)+(m-16)}else{n=i+5816|0;b[n>>1]=(e[n>>1]|0|(e[f+(k+257<<2)>>1]|0)<<c[i+5820>>2])&65535;n=i+5820|0;c[n>>2]=(c[n>>2]|0)+m}m=c[3864+(k<<2)>>2]|0;if((m|0)!=0){l=l-(c[12528+(k<<2)>>2]|0)|0;n=m;if((c[i+5820>>2]|0)>(16-n|0)){o=l;p=i+5816|0;b[p>>1]=(e[p>>1]|0|(o&65535)<<c[i+5820>>2])&65535;p=(e[i+5816>>1]|0)&255;q=i+20|0;r=c[q>>2]|0;c[q>>2]=r+1;a[(c[i+8>>2]|0)+r|0]=p;p=(e[i+5816>>1]|0)>>8&255;r=i+20|0;q=c[r>>2]|0;c[r>>2]=q+1;a[(c[i+8>>2]|0)+q|0]=p;b[i+5816>>1]=(o&65535)>>16-(c[i+5820>>2]|0)&65535;o=i+5820|0;c[o>>2]=(c[o>>2]|0)+(n-16)}else{o=i+5816|0;b[o>>1]=(e[o>>1]|0|(l&65535)<<c[i+5820>>2])&65535;l=i+5820|0;c[l>>2]=(c[l>>2]|0)+n}}j=j-1|0;if(j>>>0<256>>>0){s=d[13920+j|0]|0}else{s=d[(j>>>7)+14176|0]|0}k=s;n=e[g+(k<<2)+2>>1]|0;if((c[i+5820>>2]|0)>(16-n|0)){l=e[g+(k<<2)>>1]|0;o=i+5816|0;b[o>>1]=(e[o>>1]|0|(l&65535)<<c[i+5820>>2])&65535;o=(e[i+5816>>1]|0)&255;p=i+20|0;q=c[p>>2]|0;c[p>>2]=q+1;a[(c[i+8>>2]|0)+q|0]=o;o=(e[i+5816>>1]|0)>>8&255;q=i+20|0;p=c[q>>2]|0;c[q>>2]=p+1;a[(c[i+8>>2]|0)+p|0]=o;b[i+5816>>1]=(l&65535)>>16-(c[i+5820>>2]|0)&65535;l=i+5820|0;c[l>>2]=(c[l>>2]|0)+(n-16)}else{l=i+5816|0;b[l>>1]=(e[l>>1]|0|(e[g+(k<<2)>>1]|0)<<c[i+5820>>2])&65535;l=i+5820|0;c[l>>2]=(c[l>>2]|0)+n}m=c[3984+(k<<2)>>2]|0;if((m|0)!=0){j=j-(c[12648+(k<<2)>>2]|0)|0;k=m;if((c[i+5820>>2]|0)>(16-k|0)){m=j;n=i+5816|0;b[n>>1]=(e[n>>1]|0|(m&65535)<<c[i+5820>>2])&65535;n=(e[i+5816>>1]|0)&255;l=i+20|0;o=c[l>>2]|0;c[l>>2]=o+1;a[(c[i+8>>2]|0)+o|0]=n;n=(e[i+5816>>1]|0)>>8&255;o=i+20|0;l=c[o>>2]|0;c[o>>2]=l+1;a[(c[i+8>>2]|0)+l|0]=n;b[i+5816>>1]=(m&65535)>>16-(c[i+5820>>2]|0)&65535;m=i+5820|0;c[m>>2]=(c[m>>2]|0)+(k-16)}else{m=i+5816|0;b[m>>1]=(e[m>>1]|0|(j&65535)<<c[i+5820>>2])&65535;j=i+5820|0;c[j>>2]=(c[j>>2]|0)+k}}}}while(h>>>0<(c[i+5792>>2]|0)>>>0)}h=e[f+1026>>1]|0;if((c[i+5820>>2]|0)>(16-h|0)){g=e[f+1024>>1]|0;s=i+5816|0;b[s>>1]=(e[s>>1]|0|(g&65535)<<c[i+5820>>2])&65535;s=(e[i+5816>>1]|0)&255;k=i+20|0;j=c[k>>2]|0;c[k>>2]=j+1;a[(c[i+8>>2]|0)+j|0]=s;s=(e[i+5816>>1]|0)>>8&255;j=i+20|0;k=c[j>>2]|0;c[j>>2]=k+1;a[(c[i+8>>2]|0)+k|0]=s;b[i+5816>>1]=(g&65535)>>16-(c[i+5820>>2]|0)&65535;g=i+5820|0;c[g>>2]=(c[g>>2]|0)+(h-16);return}else{g=i+5816|0;b[g>>1]=(e[g>>1]|0|(e[f+1024>>1]|0)<<c[i+5820>>2])&65535;f=i+5820|0;c[f>>2]=(c[f>>2]|0)+h;return}}function bI(f,g,h,i){f=f|0;g=g|0;h=h|0;i=i|0;var j=0,k=0,l=0,m=0,n=0,o=0;j=f;f=g;g=h;h=i;i=5;if((c[j+5820>>2]|0)>(16-i|0)){k=f-257|0;l=j+5816|0;b[l>>1]=(e[l>>1]|0|(k&65535)<<c[j+5820>>2])&65535;l=(e[j+5816>>1]|0)&255;m=j+20|0;n=c[m>>2]|0;c[m>>2]=n+1;a[(c[j+8>>2]|0)+n|0]=l;l=(e[j+5816>>1]|0)>>8&255;n=j+20|0;m=c[n>>2]|0;c[n>>2]=m+1;a[(c[j+8>>2]|0)+m|0]=l;b[j+5816>>1]=(k&65535)>>16-(c[j+5820>>2]|0)&65535;k=j+5820|0;c[k>>2]=(c[k>>2]|0)+(i-16)}else{k=j+5816|0;b[k>>1]=(e[k>>1]|0|(f-257&65535)<<c[j+5820>>2])&65535;k=j+5820|0;c[k>>2]=(c[k>>2]|0)+i}i=5;if((c[j+5820>>2]|0)>(16-i|0)){k=g-1|0;l=j+5816|0;b[l>>1]=(e[l>>1]|0|(k&65535)<<c[j+5820>>2])&65535;l=(e[j+5816>>1]|0)&255;m=j+20|0;n=c[m>>2]|0;c[m>>2]=n+1;a[(c[j+8>>2]|0)+n|0]=l;l=(e[j+5816>>1]|0)>>8&255;n=j+20|0;m=c[n>>2]|0;c[n>>2]=m+1;a[(c[j+8>>2]|0)+m|0]=l;b[j+5816>>1]=(k&65535)>>16-(c[j+5820>>2]|0)&65535;k=j+5820|0;c[k>>2]=(c[k>>2]|0)+(i-16)}else{k=j+5816|0;b[k>>1]=(e[k>>1]|0|(g-1&65535)<<c[j+5820>>2])&65535;k=j+5820|0;c[k>>2]=(c[k>>2]|0)+i}i=4;if((c[j+5820>>2]|0)>(16-i|0)){k=h-4|0;l=j+5816|0;b[l>>1]=(e[l>>1]|0|(k&65535)<<c[j+5820>>2])&65535;l=(e[j+5816>>1]|0)&255;m=j+20|0;n=c[m>>2]|0;c[m>>2]=n+1;a[(c[j+8>>2]|0)+n|0]=l;l=(e[j+5816>>1]|0)>>8&255;n=j+20|0;m=c[n>>2]|0;c[n>>2]=m+1;a[(c[j+8>>2]|0)+m|0]=l;b[j+5816>>1]=(k&65535)>>16-(c[j+5820>>2]|0)&65535;k=j+5820|0;c[k>>2]=(c[k>>2]|0)+(i-16)}else{k=j+5816|0;b[k>>1]=(e[k>>1]|0|(h-4&65535)<<c[j+5820>>2])&65535;k=j+5820|0;c[k>>2]=(c[k>>2]|0)+i}i=0;while(1){if((i|0)>=(h|0)){break}k=3;if((c[j+5820>>2]|0)>(16-k|0)){l=e[j+2684+((d[12504+i|0]|0)<<2)+2>>1]|0;m=j+5816|0;b[m>>1]=(e[m>>1]|0|(l&65535)<<c[j+5820>>2])&65535;m=(e[j+5816>>1]|0)&255;n=j+20|0;o=c[n>>2]|0;c[n>>2]=o+1;a[(c[j+8>>2]|0)+o|0]=m;m=(e[j+5816>>1]|0)>>8&255;o=j+20|0;n=c[o>>2]|0;c[o>>2]=n+1;a[(c[j+8>>2]|0)+n|0]=m;b[j+5816>>1]=(l&65535)>>16-(c[j+5820>>2]|0)&65535;l=j+5820|0;c[l>>2]=(c[l>>2]|0)+(k-16)}else{l=j+5816|0;b[l>>1]=(e[l>>1]|0|(e[j+2684+((d[12504+i|0]|0)<<2)+2>>1]|0)<<c[j+5820>>2])&65535;l=j+5820|0;c[l>>2]=(c[l>>2]|0)+k}i=i+1|0}bK(j,j+148|0,f-1|0);bK(j,j+2440|0,g-1|0);return}function bJ(d){d=d|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0;f=d;if((c[f+5820>>2]|0)>8){d=(e[f+5816>>1]|0)&255;g=f+20|0;h=c[g>>2]|0;c[g>>2]=h+1;a[(c[f+8>>2]|0)+h|0]=d;d=(e[f+5816>>1]|0)>>8&255;h=f+20|0;g=c[h>>2]|0;c[h>>2]=g+1;a[(c[f+8>>2]|0)+g|0]=d;i=f;j=i+5816|0;b[j>>1]=0;k=f;l=k+5820|0;c[l>>2]=0;return}if((c[f+5820>>2]|0)>0){d=b[f+5816>>1]&255;g=f+20|0;h=c[g>>2]|0;c[g>>2]=h+1;a[(c[f+8>>2]|0)+h|0]=d}i=f;j=i+5816|0;b[j>>1]=0;k=f;l=k+5820|0;c[l>>2]=0;return}function bK(d,f,g){d=d|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;h=d;d=f;f=g;g=-1;i=e[d+2>>1]|0;j=0;k=7;l=4;if((i|0)==0){k=138;l=3}m=0;while(1){if((m|0)>(f|0)){break}n=i;i=e[d+(m+1<<2)+2>>1]|0;o=j+1|0;j=o;do{if((o|0)<(k|0)){if((n|0)!=(i|0)){p=1691;break}}else{p=1691}}while(0);if((p|0)==1691){p=0;if((j|0)<(l|0)){do{o=e[h+2684+(n<<2)+2>>1]|0;if((c[h+5820>>2]|0)>(16-o|0)){q=e[h+2684+(n<<2)>>1]|0;r=h+5816|0;b[r>>1]=(e[r>>1]|0|(q&65535)<<c[h+5820>>2])&65535;r=(e[h+5816>>1]|0)&255;s=h+20|0;t=c[s>>2]|0;c[s>>2]=t+1;a[(c[h+8>>2]|0)+t|0]=r;r=(e[h+5816>>1]|0)>>8&255;t=h+20|0;s=c[t>>2]|0;c[t>>2]=s+1;a[(c[h+8>>2]|0)+s|0]=r;b[h+5816>>1]=(q&65535)>>16-(c[h+5820>>2]|0)&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+(o-16)}else{q=h+5816|0;b[q>>1]=(e[q>>1]|0|(e[h+2684+(n<<2)>>1]|0)<<c[h+5820>>2])&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+o}o=j-1|0;j=o;}while((o|0)!=0)}else{if((n|0)!=0){if((n|0)!=(g|0)){o=e[h+2684+(n<<2)+2>>1]|0;if((c[h+5820>>2]|0)>(16-o|0)){q=e[h+2684+(n<<2)>>1]|0;r=h+5816|0;b[r>>1]=(e[r>>1]|0|(q&65535)<<c[h+5820>>2])&65535;r=(e[h+5816>>1]|0)&255;s=h+20|0;t=c[s>>2]|0;c[s>>2]=t+1;a[(c[h+8>>2]|0)+t|0]=r;r=(e[h+5816>>1]|0)>>8&255;t=h+20|0;s=c[t>>2]|0;c[t>>2]=s+1;a[(c[h+8>>2]|0)+s|0]=r;b[h+5816>>1]=(q&65535)>>16-(c[h+5820>>2]|0)&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+(o-16)}else{q=h+5816|0;b[q>>1]=(e[q>>1]|0|(e[h+2684+(n<<2)>>1]|0)<<c[h+5820>>2])&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+o}j=j-1|0}o=e[h+2750>>1]|0;if((c[h+5820>>2]|0)>(16-o|0)){q=e[h+2748>>1]|0;r=h+5816|0;b[r>>1]=(e[r>>1]|0|(q&65535)<<c[h+5820>>2])&65535;r=(e[h+5816>>1]|0)&255;s=h+20|0;t=c[s>>2]|0;c[s>>2]=t+1;a[(c[h+8>>2]|0)+t|0]=r;r=(e[h+5816>>1]|0)>>8&255;t=h+20|0;s=c[t>>2]|0;c[t>>2]=s+1;a[(c[h+8>>2]|0)+s|0]=r;b[h+5816>>1]=(q&65535)>>16-(c[h+5820>>2]|0)&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+(o-16)}else{q=h+5816|0;b[q>>1]=(e[q>>1]|0|(e[h+2748>>1]|0)<<c[h+5820>>2])&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+o}o=2;if((c[h+5820>>2]|0)>(16-o|0)){q=j-3|0;r=h+5816|0;b[r>>1]=(e[r>>1]|0|(q&65535)<<c[h+5820>>2])&65535;r=(e[h+5816>>1]|0)&255;s=h+20|0;t=c[s>>2]|0;c[s>>2]=t+1;a[(c[h+8>>2]|0)+t|0]=r;r=(e[h+5816>>1]|0)>>8&255;t=h+20|0;s=c[t>>2]|0;c[t>>2]=s+1;a[(c[h+8>>2]|0)+s|0]=r;b[h+5816>>1]=(q&65535)>>16-(c[h+5820>>2]|0)&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+(o-16)}else{q=h+5816|0;b[q>>1]=(e[q>>1]|0|(j-3&65535)<<c[h+5820>>2])&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+o}}else{if((j|0)<=10){o=e[h+2754>>1]|0;if((c[h+5820>>2]|0)>(16-o|0)){q=e[h+2752>>1]|0;r=h+5816|0;b[r>>1]=(e[r>>1]|0|(q&65535)<<c[h+5820>>2])&65535;r=(e[h+5816>>1]|0)&255;s=h+20|0;t=c[s>>2]|0;c[s>>2]=t+1;a[(c[h+8>>2]|0)+t|0]=r;r=(e[h+5816>>1]|0)>>8&255;t=h+20|0;s=c[t>>2]|0;c[t>>2]=s+1;a[(c[h+8>>2]|0)+s|0]=r;b[h+5816>>1]=(q&65535)>>16-(c[h+5820>>2]|0)&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+(o-16)}else{q=h+5816|0;b[q>>1]=(e[q>>1]|0|(e[h+2752>>1]|0)<<c[h+5820>>2])&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+o}o=3;if((c[h+5820>>2]|0)>(16-o|0)){q=j-3|0;r=h+5816|0;b[r>>1]=(e[r>>1]|0|(q&65535)<<c[h+5820>>2])&65535;r=(e[h+5816>>1]|0)&255;s=h+20|0;t=c[s>>2]|0;c[s>>2]=t+1;a[(c[h+8>>2]|0)+t|0]=r;r=(e[h+5816>>1]|0)>>8&255;t=h+20|0;s=c[t>>2]|0;c[t>>2]=s+1;a[(c[h+8>>2]|0)+s|0]=r;b[h+5816>>1]=(q&65535)>>16-(c[h+5820>>2]|0)&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+(o-16)}else{q=h+5816|0;b[q>>1]=(e[q>>1]|0|(j-3&65535)<<c[h+5820>>2])&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+o}}else{o=e[h+2758>>1]|0;if((c[h+5820>>2]|0)>(16-o|0)){q=e[h+2756>>1]|0;r=h+5816|0;b[r>>1]=(e[r>>1]|0|(q&65535)<<c[h+5820>>2])&65535;r=(e[h+5816>>1]|0)&255;s=h+20|0;t=c[s>>2]|0;c[s>>2]=t+1;a[(c[h+8>>2]|0)+t|0]=r;r=(e[h+5816>>1]|0)>>8&255;t=h+20|0;s=c[t>>2]|0;c[t>>2]=s+1;a[(c[h+8>>2]|0)+s|0]=r;b[h+5816>>1]=(q&65535)>>16-(c[h+5820>>2]|0)&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+(o-16)}else{q=h+5816|0;b[q>>1]=(e[q>>1]|0|(e[h+2756>>1]|0)<<c[h+5820>>2])&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+o}o=7;if((c[h+5820>>2]|0)>(16-o|0)){q=j-11|0;r=h+5816|0;b[r>>1]=(e[r>>1]|0|(q&65535)<<c[h+5820>>2])&65535;r=(e[h+5816>>1]|0)&255;s=h+20|0;t=c[s>>2]|0;c[s>>2]=t+1;a[(c[h+8>>2]|0)+t|0]=r;r=(e[h+5816>>1]|0)>>8&255;t=h+20|0;s=c[t>>2]|0;c[t>>2]=s+1;a[(c[h+8>>2]|0)+s|0]=r;b[h+5816>>1]=(q&65535)>>16-(c[h+5820>>2]|0)&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+(o-16)}else{q=h+5816|0;b[q>>1]=(e[q>>1]|0|(j-11&65535)<<c[h+5820>>2])&65535;q=h+5820|0;c[q>>2]=(c[q>>2]|0)+o}}}}j=0;g=n;if((i|0)==0){k=138;l=3}else{if((n|0)==(i|0)){k=6;l=3}else{k=7;l=4}}}m=m+1|0}return}function bL(a,c,d){a=a|0;c=c|0;d=d|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;f=a;a=c;c=d;d=-1;g=e[a+2>>1]|0;h=0;i=7;j=4;if((g|0)==0){i=138;j=3}b[a+(c+1<<2)+2>>1]=-1;k=0;while(1){if((k|0)>(c|0)){break}l=g;g=e[a+(k+1<<2)+2>>1]|0;m=h+1|0;h=m;do{if((m|0)<(i|0)){if((l|0)!=(g|0)){n=1746;break}}else{n=1746}}while(0);if((n|0)==1746){n=0;if((h|0)<(j|0)){m=f+2684+(l<<2)|0;b[m>>1]=(e[m>>1]|0)+h&65535}else{if((l|0)!=0){if((l|0)!=(d|0)){m=f+2684+(l<<2)|0;b[m>>1]=(b[m>>1]|0)+1&65535}m=f+2748|0;b[m>>1]=(b[m>>1]|0)+1&65535}else{if((h|0)<=10){m=f+2752|0;b[m>>1]=(b[m>>1]|0)+1&65535}else{m=f+2756|0;b[m>>1]=(b[m>>1]|0)+1&65535}}}h=0;d=l;if((g|0)==0){i=138;j=3}else{if((l|0)==(g|0)){i=6;j=3}else{i=7;j=4}}}k=k+1|0}return}function bM(a,b,f){a=a|0;b=b|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;g=a;a=b;b=f;f=c[g+2908+(b<<2)>>2]|0;h=b<<1;while(1){if((h|0)>(c[g+5200>>2]|0)){i=1780;break}do{if((h|0)<(c[g+5200>>2]|0)){if((e[a+(c[g+2908+(h+1<<2)>>2]<<2)>>1]|0|0)>=(e[a+(c[g+2908+(h<<2)>>2]<<2)>>1]|0|0)){if((e[a+(c[g+2908+(h+1<<2)>>2]<<2)>>1]|0|0)!=(e[a+(c[g+2908+(h<<2)>>2]<<2)>>1]|0|0)){break}if((d[g+5208+(c[g+2908+(h+1<<2)>>2]|0)|0]|0|0)>(d[g+5208+(c[g+2908+(h<<2)>>2]|0)|0]|0|0)){break}}h=h+1|0}}while(0);if((e[a+(f<<2)>>1]|0|0)<(e[a+(c[g+2908+(h<<2)>>2]<<2)>>1]|0|0)){break}if((e[a+(f<<2)>>1]|0|0)==(e[a+(c[g+2908+(h<<2)>>2]<<2)>>1]|0|0)){if((d[g+5208+f|0]|0|0)<=(d[g+5208+(c[g+2908+(h<<2)>>2]|0)|0]|0|0)){break}}c[g+2908+(b<<2)>>2]=c[g+2908+(h<<2)>>2];b=h;h=h<<1}if((i|0)==1780){j=f;k=b;l=g;m=l+2908|0;n=m+(k<<2)|0;c[n>>2]=j;return}j=f;k=b;l=g;m=l+2908|0;n=m+(k<<2)|0;c[n>>2]=j;return}function bN(a,d){a=a|0;d=d|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;f=a;a=d;d=c[a>>2]|0;g=c[a+4>>2]|0;h=c[c[a+8>>2]>>2]|0;i=c[(c[a+8>>2]|0)+4>>2]|0;j=c[(c[a+8>>2]|0)+8>>2]|0;k=c[(c[a+8>>2]|0)+16>>2]|0;a=0;l=0;while(1){if((l|0)>15){break}b[f+2876+(l<<1)>>1]=0;l=l+1|0}b[d+(c[f+2908+(c[f+5204>>2]<<2)>>2]<<2)+2>>1]=0;m=(c[f+5204>>2]|0)+1|0;while(1){if((m|0)>=573){break}n=c[f+2908+(m<<2)>>2]|0;l=(e[d+((e[d+(n<<2)+2>>1]|0)<<2)+2>>1]|0)+1|0;if((l|0)>(k|0)){l=k;a=a+1|0}b[d+(n<<2)+2>>1]=l&65535;if((n|0)<=(g|0)){o=f+2876+(l<<1)|0;b[o>>1]=(b[o>>1]|0)+1&65535;o=0;if((n|0)>=(j|0)){o=c[i+(n-j<<2)>>2]|0}p=b[d+(n<<2)>>1]|0;q=Z(p&65535,l+o|0)|0;r=f+5800|0;c[r>>2]=(c[r>>2]|0)+q;if((h|0)!=0){q=Z(p&65535,(e[h+(n<<2)+2>>1]|0)+o|0)|0;o=f+5804|0;c[o>>2]=(c[o>>2]|0)+q}}m=m+1|0}if((a|0)==0){return}do{l=k-1|0;while(1){if((e[f+2876+(l<<1)>>1]|0|0)!=0){break}l=l-1|0}h=f+2876+(l<<1)|0;b[h>>1]=(b[h>>1]|0)-1&65535;h=f+2876+(l+1<<1)|0;b[h>>1]=(e[h>>1]|0)+2&65535;h=f+2876+(k<<1)|0;b[h>>1]=(b[h>>1]|0)-1&65535;a=a-2|0;}while((a|0)>0);l=k;while(1){if((l|0)==0){break}n=e[f+2876+(l<<1)>>1]|0;while(1){if((n|0)==0){break}k=m-1|0;m=k;a=c[f+2908+(k<<2)>>2]|0;if((a|0)>(g|0)){continue}if((e[d+(a<<2)+2>>1]|0|0)!=(l|0)){k=Z(l-(e[d+(a<<2)+2>>1]|0)|0,e[d+(a<<2)>>1]|0)|0;h=f+5800|0;c[h>>2]=(c[h>>2]|0)+k;b[d+(a<<2)+2>>1]=l&65535}n=n-1|0}l=l-1|0}return}function bO(a,c,d){a=a|0;c=c|0;d=d|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+32|0;g=f|0;h=a;a=c;c=d;d=0;j=1;while(1){if((j|0)>15){break}k=(d&65535)+(e[c+(j-1<<1)>>1]|0)<<1&65535;d=k;b[g+(j<<1)>>1]=k;j=j+1|0}j=0;while(1){if((j|0)>(a|0)){break}d=e[h+(j<<2)+2>>1]|0;if((d|0)!=0){c=g+(d<<1)|0;k=b[c>>1]|0;b[c>>1]=k+1&65535;b[h+(j<<2)>>1]=(bP(k&65535,d)|0)&65535}j=j+1|0}i=f;return}function bP(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=b;b=0;do{b=b|c&1;c=c>>>1;b=b<<1;d=a-1|0;a=d;}while((d|0)>0);return b>>>1|0}function bQ(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;d=b;b=c;if((a|0)!=0){d=d+(b-b)|0}return bX(Z(d,b)|0)|0}function bR(a,b){a=a|0;b=b|0;bY(b);if((a|0)==0){return}return}function bS(a,b,c){a=a|0;b=b|0;c=c|0;var e=0,f=0,g=0,h=0,i=0;e=a;a=b;b=c;c=e>>>16&65535;e=e&65535;if((b|0)==1){e=e+(d[a|0]|0)|0;if(e>>>0>=65521>>>0){e=e-65521|0}c=c+e|0;if(c>>>0>=65521>>>0){c=c-65521|0}f=e|c<<16;g=f;return g|0}if((a|0)==0){f=1;g=f;return g|0}if(b>>>0<16>>>0){while(1){h=b;b=h-1|0;if((h|0)==0){break}h=a;a=h+1|0;e=e+(d[h]|0)|0;c=c+e|0}if(e>>>0>=65521>>>0){e=e-65521|0}c=(c>>>0)%65521|0;f=e|c<<16;g=f;return g|0}while(1){if(b>>>0<5552>>>0){break}b=b-5552|0;h=347;do{e=e+(d[a|0]|0)|0;c=c+e|0;e=e+(d[a+1|0]|0)|0;c=c+e|0;e=e+(d[a+2|0]|0)|0;c=c+e|0;e=e+(d[a+3|0]|0)|0;c=c+e|0;e=e+(d[a+4|0]|0)|0;c=c+e|0;e=e+(d[a+5|0]|0)|0;c=c+e|0;e=e+(d[a+6|0]|0)|0;c=c+e|0;e=e+(d[a+7|0]|0)|0;c=c+e|0;e=e+(d[a+8|0]|0)|0;c=c+e|0;e=e+(d[a+9|0]|0)|0;c=c+e|0;e=e+(d[a+10|0]|0)|0;c=c+e|0;e=e+(d[a+11|0]|0)|0;c=c+e|0;e=e+(d[a+12|0]|0)|0;c=c+e|0;e=e+(d[a+13|0]|0)|0;c=c+e|0;e=e+(d[a+14|0]|0)|0;c=c+e|0;e=e+(d[a+15|0]|0)|0;c=c+e|0;a=a+16|0;i=h-1|0;h=i;}while((i|0)!=0);e=(e>>>0)%65521|0;c=(c>>>0)%65521|0}if((b|0)!=0){while(1){if(b>>>0<16>>>0){break}b=b-16|0;e=e+(d[a|0]|0)|0;c=c+e|0;e=e+(d[a+1|0]|0)|0;c=c+e|0;e=e+(d[a+2|0]|0)|0;c=c+e|0;e=e+(d[a+3|0]|0)|0;c=c+e|0;e=e+(d[a+4|0]|0)|0;c=c+e|0;e=e+(d[a+5|0]|0)|0;c=c+e|0;e=e+(d[a+6|0]|0)|0;c=c+e|0;e=e+(d[a+7|0]|0)|0;c=c+e|0;e=e+(d[a+8|0]|0)|0;c=c+e|0;e=e+(d[a+9|0]|0)|0;c=c+e|0;e=e+(d[a+10|0]|0)|0;c=c+e|0;e=e+(d[a+11|0]|0)|0;c=c+e|0;e=e+(d[a+12|0]|0)|0;c=c+e|0;e=e+(d[a+13|0]|0)|0;c=c+e|0;e=e+(d[a+14|0]|0)|0;c=c+e|0;e=e+(d[a+15|0]|0)|0;c=c+e|0;a=a+16|0}while(1){h=b;b=h-1|0;if((h|0)==0){break}h=a;a=h+1|0;e=e+(d[h]|0)|0;c=c+e|0}e=(e>>>0)%65521|0;c=(c>>>0)%65521|0}f=e|c<<16;g=f;return g|0}function bT(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;f=i;i=i+8|0;g=f|0;h=b;b=d;d=e;do{if((b|0)==0){j=0}else{c[g>>2]=1;if((a[g]|0)!=0){j=bU(h,b,d)|0;break}else{j=bV(h,b,d)|0;break}}}while(0);i=f;return j|0}function bU(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;f=b;b=e;e=a;e=~e;while(1){if((b|0)!=0){g=(f&3|0)!=0}else{g=0}if(!g){break}a=f;f=a+1|0;e=c[4192+(((e^(d[a]|0))&255)<<2)>>2]^e>>>8;b=b-1|0}g=f;while(1){if(b>>>0<32>>>0){break}a=g;g=a+4|0;e=e^c[a>>2];e=c[7264+((e&255)<<2)>>2]^c[6240+((e>>>8&255)<<2)>>2]^c[5216+((e>>>16&255)<<2)>>2]^c[4192+(e>>>24<<2)>>2];a=g;g=a+4|0;e=e^c[a>>2];e=c[7264+((e&255)<<2)>>2]^c[6240+((e>>>8&255)<<2)>>2]^c[5216+((e>>>16&255)<<2)>>2]^c[4192+(e>>>24<<2)>>2];a=g;g=a+4|0;e=e^c[a>>2];e=c[7264+((e&255)<<2)>>2]^c[6240+((e>>>8&255)<<2)>>2]^c[5216+((e>>>16&255)<<2)>>2]^c[4192+(e>>>24<<2)>>2];a=g;g=a+4|0;e=e^c[a>>2];e=c[7264+((e&255)<<2)>>2]^c[6240+((e>>>8&255)<<2)>>2]^c[5216+((e>>>16&255)<<2)>>2]^c[4192+(e>>>24<<2)>>2];a=g;g=a+4|0;e=e^c[a>>2];e=c[7264+((e&255)<<2)>>2]^c[6240+((e>>>8&255)<<2)>>2]^c[5216+((e>>>16&255)<<2)>>2]^c[4192+(e>>>24<<2)>>2];a=g;g=a+4|0;e=e^c[a>>2];e=c[7264+((e&255)<<2)>>2]^c[6240+((e>>>8&255)<<2)>>2]^c[5216+((e>>>16&255)<<2)>>2]^c[4192+(e>>>24<<2)>>2];a=g;g=a+4|0;e=e^c[a>>2];e=c[7264+((e&255)<<2)>>2]^c[6240+((e>>>8&255)<<2)>>2]^c[5216+((e>>>16&255)<<2)>>2]^c[4192+(e>>>24<<2)>>2];a=g;g=a+4|0;e=e^c[a>>2];e=c[7264+((e&255)<<2)>>2]^c[6240+((e>>>8&255)<<2)>>2]^c[5216+((e>>>16&255)<<2)>>2]^c[4192+(e>>>24<<2)>>2];b=b-32|0}while(1){if(b>>>0<4>>>0){break}a=g;g=a+4|0;e=e^c[a>>2];e=c[7264+((e&255)<<2)>>2]^c[6240+((e>>>8&255)<<2)>>2]^c[5216+((e>>>16&255)<<2)>>2]^c[4192+(e>>>24<<2)>>2];b=b-4|0}f=g;if((b|0)==0){h=e;i=~h;e=i;j=e;return j|0}do{g=f;f=g+1|0;e=c[4192+(((e^(d[g]|0))&255)<<2)>>2]^e>>>8;g=b-1|0;b=g;}while((g|0)!=0);h=e;i=~h;e=i;j=e;return j|0}function bV(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;f=a;a=b;b=e;e=(f>>>24&255)+(f>>>8&65280)+((f&65280)<<8)+((f&255)<<24)|0;e=~e;while(1){if((b|0)!=0){g=(a&3|0)!=0}else{g=0}if(!g){break}f=a;a=f+1|0;e=c[8288+((e>>>24^(d[f]|0))<<2)>>2]^e<<8;b=b-1|0}g=a;g=g-4|0;while(1){if(b>>>0<32>>>0){break}f=g+4|0;g=f;e=e^c[f>>2];e=c[8288+((e&255)<<2)>>2]^c[9312+((e>>>8&255)<<2)>>2]^c[10336+((e>>>16&255)<<2)>>2]^c[11360+(e>>>24<<2)>>2];f=g+4|0;g=f;e=e^c[f>>2];e=c[8288+((e&255)<<2)>>2]^c[9312+((e>>>8&255)<<2)>>2]^c[10336+((e>>>16&255)<<2)>>2]^c[11360+(e>>>24<<2)>>2];f=g+4|0;g=f;e=e^c[f>>2];e=c[8288+((e&255)<<2)>>2]^c[9312+((e>>>8&255)<<2)>>2]^c[10336+((e>>>16&255)<<2)>>2]^c[11360+(e>>>24<<2)>>2];f=g+4|0;g=f;e=e^c[f>>2];e=c[8288+((e&255)<<2)>>2]^c[9312+((e>>>8&255)<<2)>>2]^c[10336+((e>>>16&255)<<2)>>2]^c[11360+(e>>>24<<2)>>2];f=g+4|0;g=f;e=e^c[f>>2];e=c[8288+((e&255)<<2)>>2]^c[9312+((e>>>8&255)<<2)>>2]^c[10336+((e>>>16&255)<<2)>>2]^c[11360+(e>>>24<<2)>>2];f=g+4|0;g=f;e=e^c[f>>2];e=c[8288+((e&255)<<2)>>2]^c[9312+((e>>>8&255)<<2)>>2]^c[10336+((e>>>16&255)<<2)>>2]^c[11360+(e>>>24<<2)>>2];f=g+4|0;g=f;e=e^c[f>>2];e=c[8288+((e&255)<<2)>>2]^c[9312+((e>>>8&255)<<2)>>2]^c[10336+((e>>>16&255)<<2)>>2]^c[11360+(e>>>24<<2)>>2];f=g+4|0;g=f;e=e^c[f>>2];e=c[8288+((e&255)<<2)>>2]^c[9312+((e>>>8&255)<<2)>>2]^c[10336+((e>>>16&255)<<2)>>2]^c[11360+(e>>>24<<2)>>2];b=b-32|0}while(1){if(b>>>0<4>>>0){break}f=g+4|0;g=f;e=e^c[f>>2];e=c[8288+((e&255)<<2)>>2]^c[9312+((e>>>8&255)<<2)>>2]^c[10336+((e>>>16&255)<<2)>>2]^c[11360+(e>>>24<<2)>>2];b=b-4|0}g=g+4|0;a=g;if((b|0)==0){h=e;i=~h;e=i;j=e;k=j>>>24;l=k&255;m=e;n=m>>>8;o=n&65280;p=l+o|0;q=e;r=q&65280;s=r<<8;t=p+s|0;u=e;v=u&255;w=v<<24;x=t+w|0;return x|0}do{g=a;a=g+1|0;e=c[8288+((e>>>24^(d[g]|0))<<2)>>2]^e<<8;g=b-1|0;b=g;}while((g|0)!=0);h=e;i=~h;e=i;j=e;k=j>>>24;l=k&255;m=e;n=m>>>8;o=n&65280;p=l+o|0;q=e;r=q&65280;s=r<<8;t=p+s|0;u=e;v=u&255;w=v<<24;x=t+w|0;return x|0}function bW(f,g){f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0;h=i;i=i+8|0;j=h|0;k=f;f=c[k+28>>2]|0;l=(c[k>>2]|0)-1|0;m=l+((c[k+4>>2]|0)-5)|0;n=(c[k+12>>2]|0)-1|0;o=n+(-(g-(c[k+16>>2]|0)|0)|0)|0;g=n+((c[k+16>>2]|0)-257)|0;p=c[f+40>>2]|0;q=c[f+44>>2]|0;r=c[f+48>>2]|0;s=c[f+52>>2]|0;t=c[f+56>>2]|0;u=c[f+60>>2]|0;v=c[f+76>>2]|0;w=c[f+80>>2]|0;x=(1<<c[f+84>>2])-1|0;y=(1<<c[f+88>>2])-1|0;L2438:do{if(u>>>0<15>>>0){z=l+1|0;l=z;t=t+((d[z]|0)<<u)|0;u=u+8|0;z=l+1|0;l=z;t=t+((d[z]|0)<<u)|0;u=u+8|0}z=j;A=v+((t&x)<<2)|0;b[z>>1]=b[A>>1]|0;b[z+2>>1]=b[A+2>>1]|0;while(1){B=d[j+1|0]|0;t=t>>>(B>>>0);u=u-B|0;B=d[j|0]|0;if((B|0)==0){C=1927;break}if((B&16|0)!=0){C=1929;break}if((B&64|0)!=0){C=1995;break L2438}A=j;z=v+((e[j+2>>1]|0)+(t&(1<<B)-1)<<2)|0;b[A>>1]=b[z>>1]|0;b[A+2>>1]=b[z+2>>1]|0}if((C|0)==1927){C=0;z=n+1|0;n=z;a[z]=b[j+2>>1]&255}else if((C|0)==1929){C=0;D=e[j+2>>1]|0;B=B&15;if((B|0)!=0){if(u>>>0<B>>>0){z=l+1|0;l=z;t=t+((d[z]|0)<<u)|0;u=u+8|0}D=D+(t&(1<<B)-1)|0;t=t>>>(B>>>0);u=u-B|0}if(u>>>0<15>>>0){z=l+1|0;l=z;t=t+((d[z]|0)<<u)|0;u=u+8|0;z=l+1|0;l=z;t=t+((d[z]|0)<<u)|0;u=u+8|0}z=j;A=w+((t&y)<<2)|0;b[z>>1]=b[A>>1]|0;b[z+2>>1]=b[A+2>>1]|0;while(1){B=d[j+1|0]|0;t=t>>>(B>>>0);u=u-B|0;B=d[j|0]|0;if((B&16|0)!=0){break}if((B&64|0)!=0){C=1991;break L2438}A=j;z=w+((e[j+2>>1]|0)+(t&(1<<B)-1)<<2)|0;b[A>>1]=b[z>>1]|0;b[A+2>>1]=b[z+2>>1]|0}z=e[j+2>>1]|0;B=B&15;if(u>>>0<B>>>0){A=l+1|0;l=A;t=t+((d[A]|0)<<u)|0;u=u+8|0;if(u>>>0<B>>>0){A=l+1|0;l=A;t=t+((d[A]|0)<<u)|0;u=u+8|0}}z=z+(t&(1<<B)-1)|0;t=t>>>(B>>>0);u=u-B|0;B=n-o|0;if(z>>>0>B>>>0){B=z-B|0;if(B>>>0>q>>>0){if((c[f+7104>>2]|0)!=0){C=1944;break}}E=s-1|0;if((r|0)==0){E=E+(p-B)|0;if(B>>>0<D>>>0){D=D-B|0;do{A=E+1|0;E=A;F=n+1|0;n=F;a[F]=a[A]|0;A=B-1|0;B=A;}while((A|0)!=0);E=n+(-z|0)|0}}else{if(r>>>0<B>>>0){E=E+(p+r-B)|0;B=B-r|0;if(B>>>0<D>>>0){D=D-B|0;do{A=E+1|0;E=A;F=n+1|0;n=F;a[F]=a[A]|0;A=B-1|0;B=A;}while((A|0)!=0);E=s-1|0;if(r>>>0<D>>>0){B=r;D=D-B|0;do{A=E+1|0;E=A;F=n+1|0;n=F;a[F]=a[A]|0;A=B-1|0;B=A;}while((A|0)!=0);E=n+(-z|0)|0}}}else{E=E+(r-B)|0;if(B>>>0<D>>>0){D=D-B|0;do{A=E+1|0;E=A;F=n+1|0;n=F;a[F]=a[A]|0;A=B-1|0;B=A;}while((A|0)!=0);E=n+(-z|0)|0}}}while(1){if(D>>>0<=2>>>0){break}A=E+1|0;E=A;F=n+1|0;n=F;a[F]=a[A]|0;A=E+1|0;E=A;F=n+1|0;n=F;a[F]=a[A]|0;A=E+1|0;E=A;F=n+1|0;n=F;a[F]=a[A]|0;D=D-3|0}if((D|0)!=0){A=E+1|0;E=A;F=n+1|0;n=F;a[F]=a[A]|0;if(D>>>0>1>>>0){A=E+1|0;E=A;F=n+1|0;n=F;a[F]=a[A]|0}}}else{E=n+(-z|0)|0;do{A=E+1|0;E=A;F=n+1|0;n=F;a[F]=a[A]|0;A=E+1|0;E=A;F=n+1|0;n=F;a[F]=a[A]|0;A=E+1|0;E=A;F=n+1|0;n=F;a[F]=a[A]|0;D=D-3|0;}while(D>>>0>2>>>0);if((D|0)!=0){z=E+1|0;E=z;A=n+1|0;n=A;a[A]=a[z]|0;if(D>>>0>1>>>0){z=E+1|0;E=z;A=n+1|0;n=A;a[A]=a[z]|0}}}}if(l>>>0<m>>>0){G=n>>>0<g>>>0}else{G=0}}while(G);do{if((C|0)==1991){c[k+24>>2]=13352;c[f>>2]=29}else if((C|0)==1995){if((B&32|0)!=0){c[f>>2]=11;break}else{c[k+24>>2]=13224;c[f>>2]=29;break}}else if((C|0)==1944){c[k+24>>2]=12984;c[f>>2]=29}}while(0);D=u>>>3;l=l+(-D|0)|0;u=u-(D<<3)|0;t=t&(1<<u)-1;c[k>>2]=l+1;c[k+12>>2]=n+1;if(l>>>0<m>>>0){H=m-l+5|0}else{H=5-(l-m)|0}c[k+4>>2]=H;if(n>>>0<g>>>0){I=g-n+257|0;J=k;K=J+16|0;c[K>>2]=I;L=t;M=f;N=M+56|0;c[N>>2]=L;O=u;P=f;Q=P+60|0;c[Q>>2]=O;i=h;return}else{I=257-(n-g)|0;J=k;K=J+16|0;c[K>>2]=I;L=t;M=f;N=M+56|0;c[N>>2]=L;O=u;P=f;Q=P+60|0;c[Q>>2]=O;i=h;return}}function bX(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,an=0,ao=0,ap=0,aq=0,ar=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,aA=0,aB=0,aD=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0;do{if(a>>>0<245>>>0){if(a>>>0<11>>>0){b=16}else{b=a+11&-8}d=b>>>3;e=c[3620]|0;f=e>>>(d>>>0);if((f&3|0)!=0){g=(f&1^1)+d|0;h=g<<1;i=14520+(h<<2)|0;j=14520+(h+2<<2)|0;h=c[j>>2]|0;k=h+8|0;l=c[k>>2]|0;do{if((i|0)==(l|0)){c[3620]=e&~(1<<g)}else{if(l>>>0<(c[3624]|0)>>>0){am();return 0}m=l+12|0;if((c[m>>2]|0)==(h|0)){c[m>>2]=i;c[j>>2]=l;break}else{am();return 0}}}while(0);l=g<<3;c[h+4>>2]=l|3;j=h+(l|4)|0;c[j>>2]=c[j>>2]|1;n=k;return n|0}if(b>>>0<=(c[3622]|0)>>>0){o=b;break}if((f|0)!=0){j=2<<d;l=f<<d&(j|-j);j=(l&-l)-1|0;l=j>>>12&16;i=j>>>(l>>>0);j=i>>>5&8;m=i>>>(j>>>0);i=m>>>2&4;p=m>>>(i>>>0);m=p>>>1&2;q=p>>>(m>>>0);p=q>>>1&1;r=(j|l|i|m|p)+(q>>>(p>>>0))|0;p=r<<1;q=14520+(p<<2)|0;m=14520+(p+2<<2)|0;p=c[m>>2]|0;i=p+8|0;l=c[i>>2]|0;do{if((q|0)==(l|0)){c[3620]=e&~(1<<r)}else{if(l>>>0<(c[3624]|0)>>>0){am();return 0}j=l+12|0;if((c[j>>2]|0)==(p|0)){c[j>>2]=q;c[m>>2]=l;break}else{am();return 0}}}while(0);l=r<<3;m=l-b|0;c[p+4>>2]=b|3;q=p;e=q+b|0;c[q+(b|4)>>2]=m|1;c[q+l>>2]=m;l=c[3622]|0;if((l|0)!=0){q=c[3625]|0;d=l>>>3;l=d<<1;f=14520+(l<<2)|0;k=c[3620]|0;h=1<<d;do{if((k&h|0)==0){c[3620]=k|h;s=f;t=14520+(l+2<<2)|0}else{d=14520+(l+2<<2)|0;g=c[d>>2]|0;if(g>>>0>=(c[3624]|0)>>>0){s=g;t=d;break}am();return 0}}while(0);c[t>>2]=q;c[s+12>>2]=q;c[q+8>>2]=s;c[q+12>>2]=f}c[3622]=m;c[3625]=e;n=i;return n|0}l=c[3621]|0;if((l|0)==0){o=b;break}h=(l&-l)-1|0;l=h>>>12&16;k=h>>>(l>>>0);h=k>>>5&8;p=k>>>(h>>>0);k=p>>>2&4;r=p>>>(k>>>0);p=r>>>1&2;d=r>>>(p>>>0);r=d>>>1&1;g=c[14784+((h|l|k|p|r)+(d>>>(r>>>0))<<2)>>2]|0;r=g;d=g;p=(c[g+4>>2]&-8)-b|0;while(1){g=c[r+16>>2]|0;if((g|0)==0){k=c[r+20>>2]|0;if((k|0)==0){break}else{u=k}}else{u=g}g=(c[u+4>>2]&-8)-b|0;k=g>>>0<p>>>0;r=u;d=k?u:d;p=k?g:p}r=d;i=c[3624]|0;if(r>>>0<i>>>0){am();return 0}e=r+b|0;m=e;if(r>>>0>=e>>>0){am();return 0}e=c[d+24>>2]|0;f=c[d+12>>2]|0;do{if((f|0)==(d|0)){q=d+20|0;g=c[q>>2]|0;if((g|0)==0){k=d+16|0;l=c[k>>2]|0;if((l|0)==0){v=0;break}else{w=l;x=k}}else{w=g;x=q}while(1){q=w+20|0;g=c[q>>2]|0;if((g|0)!=0){w=g;x=q;continue}q=w+16|0;g=c[q>>2]|0;if((g|0)==0){break}else{w=g;x=q}}if(x>>>0<i>>>0){am();return 0}else{c[x>>2]=0;v=w;break}}else{q=c[d+8>>2]|0;if(q>>>0<i>>>0){am();return 0}g=q+12|0;if((c[g>>2]|0)!=(d|0)){am();return 0}k=f+8|0;if((c[k>>2]|0)==(d|0)){c[g>>2]=f;c[k>>2]=q;v=f;break}else{am();return 0}}}while(0);L2637:do{if((e|0)!=0){f=d+28|0;i=14784+(c[f>>2]<<2)|0;do{if((d|0)==(c[i>>2]|0)){c[i>>2]=v;if((v|0)!=0){break}c[3621]=c[3621]&~(1<<c[f>>2]);break L2637}else{if(e>>>0<(c[3624]|0)>>>0){am();return 0}q=e+16|0;if((c[q>>2]|0)==(d|0)){c[q>>2]=v}else{c[e+20>>2]=v}if((v|0)==0){break L2637}}}while(0);if(v>>>0<(c[3624]|0)>>>0){am();return 0}c[v+24>>2]=e;f=c[d+16>>2]|0;do{if((f|0)!=0){if(f>>>0<(c[3624]|0)>>>0){am();return 0}else{c[v+16>>2]=f;c[f+24>>2]=v;break}}}while(0);f=c[d+20>>2]|0;if((f|0)==0){break}if(f>>>0<(c[3624]|0)>>>0){am();return 0}else{c[v+20>>2]=f;c[f+24>>2]=v;break}}}while(0);if(p>>>0<16>>>0){e=p+b|0;c[d+4>>2]=e|3;f=r+(e+4)|0;c[f>>2]=c[f>>2]|1}else{c[d+4>>2]=b|3;c[r+(b|4)>>2]=p|1;c[r+(p+b)>>2]=p;f=c[3622]|0;if((f|0)!=0){e=c[3625]|0;i=f>>>3;f=i<<1;q=14520+(f<<2)|0;k=c[3620]|0;g=1<<i;do{if((k&g|0)==0){c[3620]=k|g;y=q;z=14520+(f+2<<2)|0}else{i=14520+(f+2<<2)|0;l=c[i>>2]|0;if(l>>>0>=(c[3624]|0)>>>0){y=l;z=i;break}am();return 0}}while(0);c[z>>2]=e;c[y+12>>2]=e;c[e+8>>2]=y;c[e+12>>2]=q}c[3622]=p;c[3625]=m}f=d+8|0;if((f|0)==0){o=b;break}else{n=f}return n|0}else{if(a>>>0>4294967231>>>0){o=-1;break}f=a+11|0;g=f&-8;k=c[3621]|0;if((k|0)==0){o=g;break}r=-g|0;i=f>>>8;do{if((i|0)==0){A=0}else{if(g>>>0>16777215>>>0){A=31;break}f=(i+1048320|0)>>>16&8;l=i<<f;h=(l+520192|0)>>>16&4;j=l<<h;l=(j+245760|0)>>>16&2;B=14-(h|f|l)+(j<<l>>>15)|0;A=g>>>((B+7|0)>>>0)&1|B<<1}}while(0);i=c[14784+(A<<2)>>2]|0;L2685:do{if((i|0)==0){C=0;D=r;E=0}else{if((A|0)==31){F=0}else{F=25-(A>>>1)|0}d=0;m=r;p=i;q=g<<F;e=0;while(1){B=c[p+4>>2]&-8;l=B-g|0;if(l>>>0<m>>>0){if((B|0)==(g|0)){C=p;D=l;E=p;break L2685}else{G=p;H=l}}else{G=d;H=m}l=c[p+20>>2]|0;B=c[p+16+(q>>>31<<2)>>2]|0;j=(l|0)==0|(l|0)==(B|0)?e:l;if((B|0)==0){C=G;D=H;E=j;break}else{d=G;m=H;p=B;q=q<<1;e=j}}}}while(0);if((E|0)==0&(C|0)==0){i=2<<A;r=k&(i|-i);if((r|0)==0){o=g;break}i=(r&-r)-1|0;r=i>>>12&16;e=i>>>(r>>>0);i=e>>>5&8;q=e>>>(i>>>0);e=q>>>2&4;p=q>>>(e>>>0);q=p>>>1&2;m=p>>>(q>>>0);p=m>>>1&1;I=c[14784+((i|r|e|q|p)+(m>>>(p>>>0))<<2)>>2]|0}else{I=E}if((I|0)==0){J=D;K=C}else{p=I;m=D;q=C;while(1){e=(c[p+4>>2]&-8)-g|0;r=e>>>0<m>>>0;i=r?e:m;e=r?p:q;r=c[p+16>>2]|0;if((r|0)!=0){p=r;m=i;q=e;continue}r=c[p+20>>2]|0;if((r|0)==0){J=i;K=e;break}else{p=r;m=i;q=e}}}if((K|0)==0){o=g;break}if(J>>>0>=((c[3622]|0)-g|0)>>>0){o=g;break}q=K;m=c[3624]|0;if(q>>>0<m>>>0){am();return 0}p=q+g|0;k=p;if(q>>>0>=p>>>0){am();return 0}e=c[K+24>>2]|0;i=c[K+12>>2]|0;do{if((i|0)==(K|0)){r=K+20|0;d=c[r>>2]|0;if((d|0)==0){j=K+16|0;B=c[j>>2]|0;if((B|0)==0){L=0;break}else{M=B;N=j}}else{M=d;N=r}while(1){r=M+20|0;d=c[r>>2]|0;if((d|0)!=0){M=d;N=r;continue}r=M+16|0;d=c[r>>2]|0;if((d|0)==0){break}else{M=d;N=r}}if(N>>>0<m>>>0){am();return 0}else{c[N>>2]=0;L=M;break}}else{r=c[K+8>>2]|0;if(r>>>0<m>>>0){am();return 0}d=r+12|0;if((c[d>>2]|0)!=(K|0)){am();return 0}j=i+8|0;if((c[j>>2]|0)==(K|0)){c[d>>2]=i;c[j>>2]=r;L=i;break}else{am();return 0}}}while(0);L2735:do{if((e|0)!=0){i=K+28|0;m=14784+(c[i>>2]<<2)|0;do{if((K|0)==(c[m>>2]|0)){c[m>>2]=L;if((L|0)!=0){break}c[3621]=c[3621]&~(1<<c[i>>2]);break L2735}else{if(e>>>0<(c[3624]|0)>>>0){am();return 0}r=e+16|0;if((c[r>>2]|0)==(K|0)){c[r>>2]=L}else{c[e+20>>2]=L}if((L|0)==0){break L2735}}}while(0);if(L>>>0<(c[3624]|0)>>>0){am();return 0}c[L+24>>2]=e;i=c[K+16>>2]|0;do{if((i|0)!=0){if(i>>>0<(c[3624]|0)>>>0){am();return 0}else{c[L+16>>2]=i;c[i+24>>2]=L;break}}}while(0);i=c[K+20>>2]|0;if((i|0)==0){break}if(i>>>0<(c[3624]|0)>>>0){am();return 0}else{c[L+20>>2]=i;c[i+24>>2]=L;break}}}while(0);do{if(J>>>0<16>>>0){e=J+g|0;c[K+4>>2]=e|3;i=q+(e+4)|0;c[i>>2]=c[i>>2]|1}else{c[K+4>>2]=g|3;c[q+(g|4)>>2]=J|1;c[q+(J+g)>>2]=J;i=J>>>3;if(J>>>0<256>>>0){e=i<<1;m=14520+(e<<2)|0;r=c[3620]|0;j=1<<i;do{if((r&j|0)==0){c[3620]=r|j;O=m;P=14520+(e+2<<2)|0}else{i=14520+(e+2<<2)|0;d=c[i>>2]|0;if(d>>>0>=(c[3624]|0)>>>0){O=d;P=i;break}am();return 0}}while(0);c[P>>2]=k;c[O+12>>2]=k;c[q+(g+8)>>2]=O;c[q+(g+12)>>2]=m;break}e=p;j=J>>>8;do{if((j|0)==0){Q=0}else{if(J>>>0>16777215>>>0){Q=31;break}r=(j+1048320|0)>>>16&8;i=j<<r;d=(i+520192|0)>>>16&4;B=i<<d;i=(B+245760|0)>>>16&2;l=14-(d|r|i)+(B<<i>>>15)|0;Q=J>>>((l+7|0)>>>0)&1|l<<1}}while(0);j=14784+(Q<<2)|0;c[q+(g+28)>>2]=Q;c[q+(g+20)>>2]=0;c[q+(g+16)>>2]=0;m=c[3621]|0;l=1<<Q;if((m&l|0)==0){c[3621]=m|l;c[j>>2]=e;c[q+(g+24)>>2]=j;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}if((Q|0)==31){R=0}else{R=25-(Q>>>1)|0}l=J<<R;m=c[j>>2]|0;while(1){if((c[m+4>>2]&-8|0)==(J|0)){break}S=m+16+(l>>>31<<2)|0;j=c[S>>2]|0;if((j|0)==0){T=2162;break}else{l=l<<1;m=j}}if((T|0)==2162){if(S>>>0<(c[3624]|0)>>>0){am();return 0}else{c[S>>2]=e;c[q+(g+24)>>2]=m;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}}l=m+8|0;j=c[l>>2]|0;i=c[3624]|0;if(m>>>0<i>>>0){am();return 0}if(j>>>0<i>>>0){am();return 0}else{c[j+12>>2]=e;c[l>>2]=e;c[q+(g+8)>>2]=j;c[q+(g+12)>>2]=m;c[q+(g+24)>>2]=0;break}}}while(0);q=K+8|0;if((q|0)==0){o=g;break}else{n=q}return n|0}}while(0);K=c[3622]|0;if(o>>>0<=K>>>0){S=K-o|0;J=c[3625]|0;if(S>>>0>15>>>0){R=J;c[3625]=R+o;c[3622]=S;c[R+(o+4)>>2]=S|1;c[R+K>>2]=S;c[J+4>>2]=o|3}else{c[3622]=0;c[3625]=0;c[J+4>>2]=K|3;S=J+(K+4)|0;c[S>>2]=c[S>>2]|1}n=J+8|0;return n|0}J=c[3623]|0;if(o>>>0<J>>>0){S=J-o|0;c[3623]=S;J=c[3626]|0;K=J;c[3626]=K+o;c[K+(o+4)>>2]=S|1;c[J+4>>2]=o|3;n=J+8|0;return n|0}do{if((c[3612]|0)==0){J=as(30)|0;if((J-1&J|0)==0){c[3614]=J;c[3613]=J;c[3615]=-1;c[3616]=-1;c[3617]=0;c[3731]=0;c[3612]=(az(0)|0)&-16^1431655768;break}else{am();return 0}}}while(0);J=o+48|0;S=c[3614]|0;K=o+47|0;R=S+K|0;Q=-S|0;S=R&Q;if(S>>>0<=o>>>0){n=0;return n|0}O=c[3730]|0;do{if((O|0)!=0){P=c[3728]|0;L=P+S|0;if(L>>>0<=P>>>0|L>>>0>O>>>0){n=0}else{break}return n|0}}while(0);L2827:do{if((c[3731]&4|0)==0){O=c[3626]|0;L2829:do{if((O|0)==0){T=2192}else{L=O;P=14928;while(1){U=P|0;M=c[U>>2]|0;if(M>>>0<=L>>>0){V=P+4|0;if((M+(c[V>>2]|0)|0)>>>0>L>>>0){break}}M=c[P+8>>2]|0;if((M|0)==0){T=2192;break L2829}else{P=M}}if((P|0)==0){T=2192;break}L=R-(c[3623]|0)&Q;if(L>>>0>=2147483647>>>0){W=0;break}m=aC(L|0)|0;e=(m|0)==((c[U>>2]|0)+(c[V>>2]|0)|0);X=e?m:-1;Y=e?L:0;Z=m;_=L;T=2201}}while(0);do{if((T|0)==2192){O=aC(0)|0;if((O|0)==-1){W=0;break}g=O;L=c[3613]|0;m=L-1|0;if((m&g|0)==0){$=S}else{$=S-g+(m+g&-L)|0}L=c[3728]|0;g=L+$|0;if(!($>>>0>o>>>0&$>>>0<2147483647>>>0)){W=0;break}m=c[3730]|0;if((m|0)!=0){if(g>>>0<=L>>>0|g>>>0>m>>>0){W=0;break}}m=aC($|0)|0;g=(m|0)==(O|0);X=g?O:-1;Y=g?$:0;Z=m;_=$;T=2201}}while(0);L2849:do{if((T|0)==2201){m=-_|0;if((X|0)!=-1){aa=Y;ab=X;T=2212;break L2827}do{if((Z|0)!=-1&_>>>0<2147483647>>>0&_>>>0<J>>>0){g=c[3614]|0;O=K-_+g&-g;if(O>>>0>=2147483647>>>0){ac=_;break}if((aC(O|0)|0)==-1){aC(m|0)|0;W=Y;break L2849}else{ac=O+_|0;break}}else{ac=_}}while(0);if((Z|0)==-1){W=Y}else{aa=ac;ab=Z;T=2212;break L2827}}}while(0);c[3731]=c[3731]|4;ad=W;T=2209}else{ad=0;T=2209}}while(0);do{if((T|0)==2209){if(S>>>0>=2147483647>>>0){break}W=aC(S|0)|0;Z=aC(0)|0;if(!((Z|0)!=-1&(W|0)!=-1&W>>>0<Z>>>0)){break}ac=Z-W|0;Z=ac>>>0>(o+40|0)>>>0;Y=Z?W:-1;if((Y|0)!=-1){aa=Z?ac:ad;ab=Y;T=2212}}}while(0);do{if((T|0)==2212){ad=(c[3728]|0)+aa|0;c[3728]=ad;if(ad>>>0>(c[3729]|0)>>>0){c[3729]=ad}ad=c[3626]|0;L2869:do{if((ad|0)==0){S=c[3624]|0;if((S|0)==0|ab>>>0<S>>>0){c[3624]=ab}c[3732]=ab;c[3733]=aa;c[3735]=0;c[3629]=c[3612];c[3628]=-1;S=0;do{Y=S<<1;ac=14520+(Y<<2)|0;c[14520+(Y+3<<2)>>2]=ac;c[14520+(Y+2<<2)>>2]=ac;S=S+1|0;}while(S>>>0<32>>>0);S=ab+8|0;if((S&7|0)==0){ae=0}else{ae=-S&7}S=aa-40-ae|0;c[3626]=ab+ae;c[3623]=S;c[ab+(ae+4)>>2]=S|1;c[ab+(aa-36)>>2]=40;c[3627]=c[3616]}else{S=14928;while(1){af=c[S>>2]|0;ag=S+4|0;ah=c[ag>>2]|0;if((ab|0)==(af+ah|0)){T=2224;break}ac=c[S+8>>2]|0;if((ac|0)==0){break}else{S=ac}}do{if((T|0)==2224){if((c[S+12>>2]&8|0)!=0){break}ac=ad;if(!(ac>>>0>=af>>>0&ac>>>0<ab>>>0)){break}c[ag>>2]=ah+aa;ac=c[3626]|0;Y=(c[3623]|0)+aa|0;Z=ac;W=ac+8|0;if((W&7|0)==0){ai=0}else{ai=-W&7}W=Y-ai|0;c[3626]=Z+ai;c[3623]=W;c[Z+(ai+4)>>2]=W|1;c[Z+(Y+4)>>2]=40;c[3627]=c[3616];break L2869}}while(0);if(ab>>>0<(c[3624]|0)>>>0){c[3624]=ab}S=ab+aa|0;Y=14928;while(1){aj=Y|0;if((c[aj>>2]|0)==(S|0)){T=2234;break}Z=c[Y+8>>2]|0;if((Z|0)==0){break}else{Y=Z}}do{if((T|0)==2234){if((c[Y+12>>2]&8|0)!=0){break}c[aj>>2]=ab;S=Y+4|0;c[S>>2]=(c[S>>2]|0)+aa;S=ab+8|0;if((S&7|0)==0){ak=0}else{ak=-S&7}S=ab+(aa+8)|0;if((S&7|0)==0){al=0}else{al=-S&7}S=ab+(al+aa)|0;Z=S;W=ak+o|0;ac=ab+W|0;_=ac;K=S-(ab+ak)-o|0;c[ab+(ak+4)>>2]=o|3;do{if((Z|0)==(c[3626]|0)){J=(c[3623]|0)+K|0;c[3623]=J;c[3626]=_;c[ab+(W+4)>>2]=J|1}else{if((Z|0)==(c[3625]|0)){J=(c[3622]|0)+K|0;c[3622]=J;c[3625]=_;c[ab+(W+4)>>2]=J|1;c[ab+(J+W)>>2]=J;break}J=aa+4|0;X=c[ab+(J+al)>>2]|0;if((X&3|0)==1){$=X&-8;V=X>>>3;L2904:do{if(X>>>0<256>>>0){U=c[ab+((al|8)+aa)>>2]|0;Q=c[ab+(aa+12+al)>>2]|0;R=14520+(V<<1<<2)|0;do{if((U|0)!=(R|0)){if(U>>>0<(c[3624]|0)>>>0){am();return 0}if((c[U+12>>2]|0)==(Z|0)){break}am();return 0}}while(0);if((Q|0)==(U|0)){c[3620]=c[3620]&~(1<<V);break}do{if((Q|0)==(R|0)){an=Q+8|0}else{if(Q>>>0<(c[3624]|0)>>>0){am();return 0}m=Q+8|0;if((c[m>>2]|0)==(Z|0)){an=m;break}am();return 0}}while(0);c[U+12>>2]=Q;c[an>>2]=U}else{R=S;m=c[ab+((al|24)+aa)>>2]|0;P=c[ab+(aa+12+al)>>2]|0;do{if((P|0)==(R|0)){O=al|16;g=ab+(J+O)|0;L=c[g>>2]|0;if((L|0)==0){e=ab+(O+aa)|0;O=c[e>>2]|0;if((O|0)==0){ao=0;break}else{ap=O;aq=e}}else{ap=L;aq=g}while(1){g=ap+20|0;L=c[g>>2]|0;if((L|0)!=0){ap=L;aq=g;continue}g=ap+16|0;L=c[g>>2]|0;if((L|0)==0){break}else{ap=L;aq=g}}if(aq>>>0<(c[3624]|0)>>>0){am();return 0}else{c[aq>>2]=0;ao=ap;break}}else{g=c[ab+((al|8)+aa)>>2]|0;if(g>>>0<(c[3624]|0)>>>0){am();return 0}L=g+12|0;if((c[L>>2]|0)!=(R|0)){am();return 0}e=P+8|0;if((c[e>>2]|0)==(R|0)){c[L>>2]=P;c[e>>2]=g;ao=P;break}else{am();return 0}}}while(0);if((m|0)==0){break}P=ab+(aa+28+al)|0;U=14784+(c[P>>2]<<2)|0;do{if((R|0)==(c[U>>2]|0)){c[U>>2]=ao;if((ao|0)!=0){break}c[3621]=c[3621]&~(1<<c[P>>2]);break L2904}else{if(m>>>0<(c[3624]|0)>>>0){am();return 0}Q=m+16|0;if((c[Q>>2]|0)==(R|0)){c[Q>>2]=ao}else{c[m+20>>2]=ao}if((ao|0)==0){break L2904}}}while(0);if(ao>>>0<(c[3624]|0)>>>0){am();return 0}c[ao+24>>2]=m;R=al|16;P=c[ab+(R+aa)>>2]|0;do{if((P|0)!=0){if(P>>>0<(c[3624]|0)>>>0){am();return 0}else{c[ao+16>>2]=P;c[P+24>>2]=ao;break}}}while(0);P=c[ab+(J+R)>>2]|0;if((P|0)==0){break}if(P>>>0<(c[3624]|0)>>>0){am();return 0}else{c[ao+20>>2]=P;c[P+24>>2]=ao;break}}}while(0);ar=ab+(($|al)+aa)|0;at=$+K|0}else{ar=Z;at=K}J=ar+4|0;c[J>>2]=c[J>>2]&-2;c[ab+(W+4)>>2]=at|1;c[ab+(at+W)>>2]=at;J=at>>>3;if(at>>>0<256>>>0){V=J<<1;X=14520+(V<<2)|0;P=c[3620]|0;m=1<<J;do{if((P&m|0)==0){c[3620]=P|m;au=X;av=14520+(V+2<<2)|0}else{J=14520+(V+2<<2)|0;U=c[J>>2]|0;if(U>>>0>=(c[3624]|0)>>>0){au=U;av=J;break}am();return 0}}while(0);c[av>>2]=_;c[au+12>>2]=_;c[ab+(W+8)>>2]=au;c[ab+(W+12)>>2]=X;break}V=ac;m=at>>>8;do{if((m|0)==0){aw=0}else{if(at>>>0>16777215>>>0){aw=31;break}P=(m+1048320|0)>>>16&8;$=m<<P;J=($+520192|0)>>>16&4;U=$<<J;$=(U+245760|0)>>>16&2;Q=14-(J|P|$)+(U<<$>>>15)|0;aw=at>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);m=14784+(aw<<2)|0;c[ab+(W+28)>>2]=aw;c[ab+(W+20)>>2]=0;c[ab+(W+16)>>2]=0;X=c[3621]|0;Q=1<<aw;if((X&Q|0)==0){c[3621]=X|Q;c[m>>2]=V;c[ab+(W+24)>>2]=m;c[ab+(W+12)>>2]=V;c[ab+(W+8)>>2]=V;break}if((aw|0)==31){ax=0}else{ax=25-(aw>>>1)|0}Q=at<<ax;X=c[m>>2]|0;while(1){if((c[X+4>>2]&-8|0)==(at|0)){break}ay=X+16+(Q>>>31<<2)|0;m=c[ay>>2]|0;if((m|0)==0){T=2307;break}else{Q=Q<<1;X=m}}if((T|0)==2307){if(ay>>>0<(c[3624]|0)>>>0){am();return 0}else{c[ay>>2]=V;c[ab+(W+24)>>2]=X;c[ab+(W+12)>>2]=V;c[ab+(W+8)>>2]=V;break}}Q=X+8|0;m=c[Q>>2]|0;$=c[3624]|0;if(X>>>0<$>>>0){am();return 0}if(m>>>0<$>>>0){am();return 0}else{c[m+12>>2]=V;c[Q>>2]=V;c[ab+(W+8)>>2]=m;c[ab+(W+12)>>2]=X;c[ab+(W+24)>>2]=0;break}}}while(0);n=ab+(ak|8)|0;return n|0}}while(0);Y=ad;W=14928;while(1){aA=c[W>>2]|0;if(aA>>>0<=Y>>>0){aB=c[W+4>>2]|0;aD=aA+aB|0;if(aD>>>0>Y>>>0){break}}W=c[W+8>>2]|0}W=aA+(aB-39)|0;if((W&7|0)==0){aF=0}else{aF=-W&7}W=aA+(aB-47+aF)|0;ac=W>>>0<(ad+16|0)>>>0?Y:W;W=ac+8|0;_=ab+8|0;if((_&7|0)==0){aG=0}else{aG=-_&7}_=aa-40-aG|0;c[3626]=ab+aG;c[3623]=_;c[ab+(aG+4)>>2]=_|1;c[ab+(aa-36)>>2]=40;c[3627]=c[3616];c[ac+4>>2]=27;c[W>>2]=c[3732];c[W+4>>2]=c[3733];c[W+8>>2]=c[3734];c[W+12>>2]=c[3735];c[3732]=ab;c[3733]=aa;c[3735]=0;c[3734]=W;W=ac+28|0;c[W>>2]=7;if((ac+32|0)>>>0<aD>>>0){_=W;while(1){W=_+4|0;c[W>>2]=7;if((_+8|0)>>>0<aD>>>0){_=W}else{break}}}if((ac|0)==(Y|0)){break}_=ac-ad|0;W=Y+(_+4)|0;c[W>>2]=c[W>>2]&-2;c[ad+4>>2]=_|1;c[Y+_>>2]=_;W=_>>>3;if(_>>>0<256>>>0){K=W<<1;Z=14520+(K<<2)|0;S=c[3620]|0;m=1<<W;do{if((S&m|0)==0){c[3620]=S|m;aH=Z;aI=14520+(K+2<<2)|0}else{W=14520+(K+2<<2)|0;Q=c[W>>2]|0;if(Q>>>0>=(c[3624]|0)>>>0){aH=Q;aI=W;break}am();return 0}}while(0);c[aI>>2]=ad;c[aH+12>>2]=ad;c[ad+8>>2]=aH;c[ad+12>>2]=Z;break}K=ad;m=_>>>8;do{if((m|0)==0){aJ=0}else{if(_>>>0>16777215>>>0){aJ=31;break}S=(m+1048320|0)>>>16&8;Y=m<<S;ac=(Y+520192|0)>>>16&4;W=Y<<ac;Y=(W+245760|0)>>>16&2;Q=14-(ac|S|Y)+(W<<Y>>>15)|0;aJ=_>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);m=14784+(aJ<<2)|0;c[ad+28>>2]=aJ;c[ad+20>>2]=0;c[ad+16>>2]=0;Z=c[3621]|0;Q=1<<aJ;if((Z&Q|0)==0){c[3621]=Z|Q;c[m>>2]=K;c[ad+24>>2]=m;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}if((aJ|0)==31){aK=0}else{aK=25-(aJ>>>1)|0}Q=_<<aK;Z=c[m>>2]|0;while(1){if((c[Z+4>>2]&-8|0)==(_|0)){break}aL=Z+16+(Q>>>31<<2)|0;m=c[aL>>2]|0;if((m|0)==0){T=2342;break}else{Q=Q<<1;Z=m}}if((T|0)==2342){if(aL>>>0<(c[3624]|0)>>>0){am();return 0}else{c[aL>>2]=K;c[ad+24>>2]=Z;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}}Q=Z+8|0;_=c[Q>>2]|0;m=c[3624]|0;if(Z>>>0<m>>>0){am();return 0}if(_>>>0<m>>>0){am();return 0}else{c[_+12>>2]=K;c[Q>>2]=K;c[ad+8>>2]=_;c[ad+12>>2]=Z;c[ad+24>>2]=0;break}}}while(0);ad=c[3623]|0;if(ad>>>0<=o>>>0){break}_=ad-o|0;c[3623]=_;ad=c[3626]|0;Q=ad;c[3626]=Q+o;c[Q+(o+4)>>2]=_|1;c[ad+4>>2]=o|3;n=ad+8|0;return n|0}}while(0);c[(aE()|0)>>2]=12;n=0;return n|0}function bY(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0;if((a|0)==0){return}b=a-8|0;d=b;e=c[3624]|0;if(b>>>0<e>>>0){am()}f=c[a-4>>2]|0;g=f&3;if((g|0)==1){am()}h=f&-8;i=a+(h-8)|0;j=i;L3086:do{if((f&1|0)==0){k=c[b>>2]|0;if((g|0)==0){return}l=-8-k|0;m=a+l|0;n=m;o=k+h|0;if(m>>>0<e>>>0){am()}if((n|0)==(c[3625]|0)){p=a+(h-4)|0;if((c[p>>2]&3|0)!=3){q=n;r=o;break}c[3622]=o;c[p>>2]=c[p>>2]&-2;c[a+(l+4)>>2]=o|1;c[i>>2]=o;return}p=k>>>3;if(k>>>0<256>>>0){k=c[a+(l+8)>>2]|0;s=c[a+(l+12)>>2]|0;t=14520+(p<<1<<2)|0;do{if((k|0)!=(t|0)){if(k>>>0<e>>>0){am()}if((c[k+12>>2]|0)==(n|0)){break}am()}}while(0);if((s|0)==(k|0)){c[3620]=c[3620]&~(1<<p);q=n;r=o;break}do{if((s|0)==(t|0)){u=s+8|0}else{if(s>>>0<e>>>0){am()}v=s+8|0;if((c[v>>2]|0)==(n|0)){u=v;break}am()}}while(0);c[k+12>>2]=s;c[u>>2]=k;q=n;r=o;break}t=m;p=c[a+(l+24)>>2]|0;v=c[a+(l+12)>>2]|0;do{if((v|0)==(t|0)){w=a+(l+20)|0;x=c[w>>2]|0;if((x|0)==0){y=a+(l+16)|0;z=c[y>>2]|0;if((z|0)==0){A=0;break}else{B=z;C=y}}else{B=x;C=w}while(1){w=B+20|0;x=c[w>>2]|0;if((x|0)!=0){B=x;C=w;continue}w=B+16|0;x=c[w>>2]|0;if((x|0)==0){break}else{B=x;C=w}}if(C>>>0<e>>>0){am()}else{c[C>>2]=0;A=B;break}}else{w=c[a+(l+8)>>2]|0;if(w>>>0<e>>>0){am()}x=w+12|0;if((c[x>>2]|0)!=(t|0)){am()}y=v+8|0;if((c[y>>2]|0)==(t|0)){c[x>>2]=v;c[y>>2]=w;A=v;break}else{am()}}}while(0);if((p|0)==0){q=n;r=o;break}v=a+(l+28)|0;m=14784+(c[v>>2]<<2)|0;do{if((t|0)==(c[m>>2]|0)){c[m>>2]=A;if((A|0)!=0){break}c[3621]=c[3621]&~(1<<c[v>>2]);q=n;r=o;break L3086}else{if(p>>>0<(c[3624]|0)>>>0){am()}k=p+16|0;if((c[k>>2]|0)==(t|0)){c[k>>2]=A}else{c[p+20>>2]=A}if((A|0)==0){q=n;r=o;break L3086}}}while(0);if(A>>>0<(c[3624]|0)>>>0){am()}c[A+24>>2]=p;t=c[a+(l+16)>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[3624]|0)>>>0){am()}else{c[A+16>>2]=t;c[t+24>>2]=A;break}}}while(0);t=c[a+(l+20)>>2]|0;if((t|0)==0){q=n;r=o;break}if(t>>>0<(c[3624]|0)>>>0){am()}else{c[A+20>>2]=t;c[t+24>>2]=A;q=n;r=o;break}}else{q=d;r=h}}while(0);d=q;if(d>>>0>=i>>>0){am()}A=a+(h-4)|0;e=c[A>>2]|0;if((e&1|0)==0){am()}do{if((e&2|0)==0){if((j|0)==(c[3626]|0)){B=(c[3623]|0)+r|0;c[3623]=B;c[3626]=q;c[q+4>>2]=B|1;if((q|0)!=(c[3625]|0)){return}c[3625]=0;c[3622]=0;return}if((j|0)==(c[3625]|0)){B=(c[3622]|0)+r|0;c[3622]=B;c[3625]=q;c[q+4>>2]=B|1;c[d+B>>2]=B;return}B=(e&-8)+r|0;C=e>>>3;L3188:do{if(e>>>0<256>>>0){u=c[a+h>>2]|0;g=c[a+(h|4)>>2]|0;b=14520+(C<<1<<2)|0;do{if((u|0)!=(b|0)){if(u>>>0<(c[3624]|0)>>>0){am()}if((c[u+12>>2]|0)==(j|0)){break}am()}}while(0);if((g|0)==(u|0)){c[3620]=c[3620]&~(1<<C);break}do{if((g|0)==(b|0)){D=g+8|0}else{if(g>>>0<(c[3624]|0)>>>0){am()}f=g+8|0;if((c[f>>2]|0)==(j|0)){D=f;break}am()}}while(0);c[u+12>>2]=g;c[D>>2]=u}else{b=i;f=c[a+(h+16)>>2]|0;t=c[a+(h|4)>>2]|0;do{if((t|0)==(b|0)){p=a+(h+12)|0;v=c[p>>2]|0;if((v|0)==0){m=a+(h+8)|0;k=c[m>>2]|0;if((k|0)==0){E=0;break}else{F=k;G=m}}else{F=v;G=p}while(1){p=F+20|0;v=c[p>>2]|0;if((v|0)!=0){F=v;G=p;continue}p=F+16|0;v=c[p>>2]|0;if((v|0)==0){break}else{F=v;G=p}}if(G>>>0<(c[3624]|0)>>>0){am()}else{c[G>>2]=0;E=F;break}}else{p=c[a+h>>2]|0;if(p>>>0<(c[3624]|0)>>>0){am()}v=p+12|0;if((c[v>>2]|0)!=(b|0)){am()}m=t+8|0;if((c[m>>2]|0)==(b|0)){c[v>>2]=t;c[m>>2]=p;E=t;break}else{am()}}}while(0);if((f|0)==0){break}t=a+(h+20)|0;u=14784+(c[t>>2]<<2)|0;do{if((b|0)==(c[u>>2]|0)){c[u>>2]=E;if((E|0)!=0){break}c[3621]=c[3621]&~(1<<c[t>>2]);break L3188}else{if(f>>>0<(c[3624]|0)>>>0){am()}g=f+16|0;if((c[g>>2]|0)==(b|0)){c[g>>2]=E}else{c[f+20>>2]=E}if((E|0)==0){break L3188}}}while(0);if(E>>>0<(c[3624]|0)>>>0){am()}c[E+24>>2]=f;b=c[a+(h+8)>>2]|0;do{if((b|0)!=0){if(b>>>0<(c[3624]|0)>>>0){am()}else{c[E+16>>2]=b;c[b+24>>2]=E;break}}}while(0);b=c[a+(h+12)>>2]|0;if((b|0)==0){break}if(b>>>0<(c[3624]|0)>>>0){am()}else{c[E+20>>2]=b;c[b+24>>2]=E;break}}}while(0);c[q+4>>2]=B|1;c[d+B>>2]=B;if((q|0)!=(c[3625]|0)){H=B;break}c[3622]=B;return}else{c[A>>2]=e&-2;c[q+4>>2]=r|1;c[d+r>>2]=r;H=r}}while(0);r=H>>>3;if(H>>>0<256>>>0){d=r<<1;e=14520+(d<<2)|0;A=c[3620]|0;E=1<<r;do{if((A&E|0)==0){c[3620]=A|E;I=e;J=14520+(d+2<<2)|0}else{r=14520+(d+2<<2)|0;h=c[r>>2]|0;if(h>>>0>=(c[3624]|0)>>>0){I=h;J=r;break}am()}}while(0);c[J>>2]=q;c[I+12>>2]=q;c[q+8>>2]=I;c[q+12>>2]=e;return}e=q;I=H>>>8;do{if((I|0)==0){K=0}else{if(H>>>0>16777215>>>0){K=31;break}J=(I+1048320|0)>>>16&8;d=I<<J;E=(d+520192|0)>>>16&4;A=d<<E;d=(A+245760|0)>>>16&2;r=14-(E|J|d)+(A<<d>>>15)|0;K=H>>>((r+7|0)>>>0)&1|r<<1}}while(0);I=14784+(K<<2)|0;c[q+28>>2]=K;c[q+20>>2]=0;c[q+16>>2]=0;r=c[3621]|0;d=1<<K;do{if((r&d|0)==0){c[3621]=r|d;c[I>>2]=e;c[q+24>>2]=I;c[q+12>>2]=q;c[q+8>>2]=q}else{if((K|0)==31){L=0}else{L=25-(K>>>1)|0}A=H<<L;J=c[I>>2]|0;while(1){if((c[J+4>>2]&-8|0)==(H|0)){break}M=J+16+(A>>>31<<2)|0;E=c[M>>2]|0;if((E|0)==0){N=2519;break}else{A=A<<1;J=E}}if((N|0)==2519){if(M>>>0<(c[3624]|0)>>>0){am()}else{c[M>>2]=e;c[q+24>>2]=J;c[q+12>>2]=q;c[q+8>>2]=q;break}}A=J+8|0;B=c[A>>2]|0;E=c[3624]|0;if(J>>>0<E>>>0){am()}if(B>>>0<E>>>0){am()}else{c[B+12>>2]=e;c[A>>2]=e;c[q+8>>2]=B;c[q+12>>2]=J;c[q+24>>2]=0;break}}}while(0);q=(c[3628]|0)-1|0;c[3628]=q;if((q|0)==0){O=14936}else{return}while(1){q=c[O>>2]|0;if((q|0)==0){break}else{O=q+8|0}}c[3628]=-1;return}function bZ(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=b+e|0;if((e|0)>=20){d=d&255;g=b&3;h=d|d<<8|d<<16|d<<24;i=f&~3;if(g){g=b+4-g|0;while((b|0)<(g|0)){a[b]=d;b=b+1|0}}while((b|0)<(i|0)){c[b>>2]=h;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}return b-e|0}function b_(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function b$(b){b=b|0;var c=0;c=b;while(a[c]|0){c=c+1|0}return c-b|0}function b0(a,b){a=a|0;b=b|0;return aH[a&1](b|0)|0}function b1(a,b){a=a|0;b=b|0;aI[a&1](b|0)}function b2(a,b,c){a=a|0;b=b|0;c=c|0;aJ[a&3](b|0,c|0)}function b3(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return aK[a&3](b|0,c|0,d|0)|0}function b4(a){a=a|0;aL[a&1]()}function b5(a,b,c){a=a|0;b=b|0;c=c|0;return aM[a&7](b|0,c|0)|0}function b6(a){a=a|0;_(0);return 0}function b7(a){a=a|0;_(1)}function b8(a,b){a=a|0;b=b|0;_(2)}function b9(a,b,c){a=a|0;b=b|0;c=c|0;_(3);return 0}function ca(){_(4)}function cb(a,b){a=a|0;b=b|0;_(5);return 0}
// EMSCRIPTEN_END_FUNCS
var aH=[b6,b6];var aI=[b7,b7];var aJ=[b8,b8,bR,b8];var aK=[b9,b9,bQ,b9];var aL=[ca,ca];var aM=[cb,cb,bj,cb,bi,cb,bk,cb];return{_strlen:b$,_free:bY,_deflate_file:a4,_memset:bZ,_malloc:bX,_memcpy:b_,_inflate_file:a5,runPostSets:a1,stackAlloc:aN,stackSave:aO,stackRestore:aP,setThrew:aQ,setTempRet0:aT,setTempRet1:aU,setTempRet2:aV,setTempRet3:aW,setTempRet4:aX,setTempRet5:aY,setTempRet6:aZ,setTempRet7:a_,setTempRet8:a$,setTempRet9:a0,dynCall_ii:b0,dynCall_vi:b1,dynCall_vii:b2,dynCall_iiii:b3,dynCall_v:b4,dynCall_iii:b5}
// EMSCRIPTEN_END_ASM
})({Math:Math,Int8Array:Int8Array,Int16Array:Int16Array,Int32Array:Int32Array,Uint8Array:Uint8Array,Uint16Array:Uint16Array,Uint32Array:Uint32Array,Float32Array:Float32Array,Float64Array:Float64Array},{abort:B,assert:w,asmPrintInt:function(a,b){p.print("int "+a+","+b)},asmPrintFloat:function(a,b){p.print("float "+a+","+b)},min:Da,invoke_ii:function(a,b){try{return p.dynCall_ii(a,b)}catch(c){"number"!==typeof c&&"longjmp"!==c&&e(c),Z.setThrew(1,0)}},invoke_vi:function(a,
b){try{p.dynCall_vi(a,b)}catch(c){"number"!==typeof c&&"longjmp"!==c&&e(c),Z.setThrew(1,0)}},invoke_vii:function(a,b,c){try{p.dynCall_vii(a,b,c)}catch(d){"number"!==typeof d&&"longjmp"!==d&&e(d),Z.setThrew(1,0)}},invoke_iiii:function(a,b,c,d){try{return p.dynCall_iiii(a,b,c,d)}catch(f){"number"!==typeof f&&"longjmp"!==f&&e(f),Z.setThrew(1,0)}},invoke_v:function(a){try{p.dynCall_v(a)}catch(b){"number"!==typeof b&&"longjmp"!==b&&e(b),Z.setThrew(1,0)}},invoke_iii:function(a,b,c){try{return p.dynCall_iii(a,
b,c)}catch(d){"number"!==typeof d&&"longjmp"!==d&&e(d),Z.setThrew(1,0)}},___assert_fail:function(a,b,c,d){va=j;e("Assertion failed: "+E(a)+", at: "+[b?E(b):"unknown filename",c,d?E(d):"unknown function"]+" at "+Ma())},_fread:function(a,b,c,d){c*=b;if(0==c)return 0;var f=0,g=U[d];if(!g)return P(O.B),0;for(;g.Ga.length&&0<c;)F[a++|0]=g.Ga.pop(),c--,f++;a=dc(d,a,c);if(-1==a)return g&&(g.error=j),0;f+=a;f<c&&(g.zb=j);return Math.floor(f/b)},_fclose:function(a){hc(a);return gc(a)},_abort:function(){p.abort()},
_pread:function(a,b,c,d){a=U[a];if(!a)return P(O.B),-1;try{return Vb(a,b,c,d)}catch(f){return Bb(f),-1}},_close:gc,_fflush:m(),_fopen:function(a,b){var c,b=E(b);if("r"==b[0])c=-1!=b.indexOf("+")?2:0;else if("w"==b[0])c=-1!=b.indexOf("+")?2:1,c|=576;else if("a"==b[0])c=-1!=b.indexOf("+")?2:1,c|=64,c|=1024;else return P(O.q),0;c=fc(a,c,J([511,0,0,0],"i32",1));return-1==c?0:c},_open:fc,_sysconf:function(a){switch(a){case 30:return 4096;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 79:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;
case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;
case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1E3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:return 1}P(O.q);return-1},___setErrNo:P,_feof:function(a){a=U[a];return Number(a&&a.zb)},
_send:function(a,b,c){return!Y.Wa(a)?(P(O.B),-1):ec(a,b,c)},_write:ec,_read:dc,_ferror:function(a){a=U[a];return Number(a&&a.error)},_time:function(a){var b=Math.floor(Date.now()/1E3);a&&(I[a>>2]=b);return b},_recv:function(a,b,c){return!Y.Wa(a)?(P(O.B),-1):dc(a,b,c)},_pwrite:function(a,b,c,d){a=U[a];if(!a)return P(O.B),-1;try{return Wb(a,F,b,c,d)}catch(f){return Bb(f),-1}},_sbrk:kc,_fsync:hc,___errno_location:function(){return ib},_fwrite:function(a,b,c,d){c*=b;if(0==c)return 0;a=ec(d,a,c);if(-1==
a){if(b=U[d])b.error=j;return 0}return Math.floor(a/b)},STACKTOP:v,STACK_MAX:Ra,tempDoublePtr:gb,ABORT:va,NaN:NaN,Infinity:Infinity},L),lc=p._strlen=Z._strlen;p._free=Z._free;var Cc=p._deflate_file=Z._deflate_file,ic=p._memset=Z._memset,Ka=p._malloc=Z._malloc,jc=p._memcpy=Z._memcpy,Dc=p._inflate_file=Z._inflate_file,fb=p.runPostSets=Z.runPostSets;p.dynCall_ii=Z.dynCall_ii;p.dynCall_vi=Z.dynCall_vi;p.dynCall_vii=Z.dynCall_vii;p.dynCall_iiii=Z.dynCall_iiii;p.dynCall_v=Z.dynCall_v;p.dynCall_iii=Z.dynCall_iii;
pa=function(a){return Z.stackAlloc(a)};ha=function(){return Z.stackSave()};ia=function(a){Z.stackRestore(a)};function Ec(a){this.name="ExitStatus";this.message="Program terminated with exit("+a+")";this.status=a}Ec.prototype=Error();var Fc,Gc=k,cb=function Hc(){!p.calledRun&&Ic&&Jc();p.calledRun||(cb=Hc)};
p.callMain=p.Ud=function(a){function b(){for(var a=0;3>a;a++)d.push(0)}w(0==N,"cannot call main when async dependencies remain! (listen on __ATMAIN__)");w(0==Ua.length,"cannot call main when preRun functions remain to be called");a=a||[];ba&&Gc!==k&&p.ea("preload time: "+(Date.now()-Gc)+" ms");Za||(Za=j,Ta(M));var c=a.length+1,d=[J(C("/bin/this.program"),"i8",0)];b();for(var f=0;f<c-1;f+=1)d.push(J(C(a[f]),"i8",0)),b();d.push(0);d=J(d,"i32",0);Fc=v;try{var g=p._main(c,d,0);p.noExitRuntime||Kc(g)}catch(i){i instanceof
Ec||("SimulateInfiniteLoop"==i?p.noExitRuntime=j:(i&&("object"===typeof i&&i.stack)&&p.ea("exception thrown: "+[i,i.stack]),e(i)))}finally{}};
function Jc(a){function b(){Za||(Za=j,Ta(M));Ta(Va);p.calledRun=j;p._main&&Ic&&p.callMain(a);if(p.postRun)for("function"==typeof p.postRun&&(p.postRun=[p.postRun]);p.postRun.length;)ab(p.postRun.shift());Ta(Ya)}a=a||p.arguments;Gc===k&&(Gc=Date.now());if(0<N)p.ea("run() called, but dependencies remain, so not running");else{if(p.preRun)for("function"==typeof p.preRun&&(p.preRun=[p.preRun]);p.preRun.length;)$a(p.preRun.shift());Ta(Ua);0<N||(p.setStatus?(p.setStatus("Running..."),setTimeout(function(){setTimeout(function(){p.setStatus("")},
1);va||b()},1)):b())}}p.run=p.ne=Jc;function Kc(a){va=j;v=Fc;Ta(Wa);e(new Ec(a))}p.exit=p.Yd=Kc;function B(a){a&&(p.print(a),p.ea(a));va=j;e("abort() at "+Ma())}p.abort=p.abort=B;if(p.preInit)for("function"==typeof p.preInit&&(p.preInit=[p.preInit]);0<p.preInit.length;)p.preInit.pop()();var Ic=j;p.noInitialRun&&(Ic=l);Jc();
var $={G:function(){return $.createNode(k,"/",16895,0)},k:{A:function(a,b){b.mode!==h&&(a.mode=b.mode);b.timestamp!==h&&(a.timestamp=b.timestamp);if(b.size!==h){var c=a.o,c=c.length>b.size?c.subarray(0,b.size):$.Ab(c,b.size);a.o=c;a.size=b.size}},aa:T.k.aa,R:function(a,b,c,d){return $.createNode(a,b,c,d)}},g:{D:function(a,b,c,d,f){a=a.e.o;d=Math.min(a.length-f,d);if(8<d&&a.subarray)b.set(a.subarray(f,f+d),c);else for(var g=0;g<d;g++)b[c+g]=a[f+g];return d},write:function(a,b,c,d){a=new Uint8Array(b.buffer,
c,d);$.Ob||(a=new Uint8Array(a));$.ib(a);return d}},createNode:function(a,b,c,d){c=rb(a,b,c,d);c.k=$.k;c.g=$.g;c.o=[];c.timestamp=Date.now();a&&(a.o[b]=c);return c},Sa:function(a,b,c,d,f){a=$b(a,b,d,f);a.o=c;a.k=$.k;a.g=$.g;return a},Ab:function(a,b){if(a.length>=b)return a;for(var c=a.length;c<b;)c*=2;c=new Uint8Array(c);c.set(a);return c},ib:k};Lb($,"/");function Lc(a){e(Error("zlib-asm: "+a))}
function Mc(a){switch(a){case -2:Lc("invalid compression level");case -3:_gerrinf("invalid or incomplete deflate data, or password protected");case -4:Lc("out of memory");case -6:Lc("zlib version mismatch")}}function Nc(a,b,c){try{var d=W("/input").e;Db(d)}catch(f){}try{var g=W("/output").e;Db(g)}catch(i){}$.Sa("/","input",a,j,j);$.Sa("/","output",new Uint8Array(0),j,j);$.ib=b;$.Ob=c}var Oc=6,Pc=32768,Qc=this;
function Rc(a){var b=a.map(function(a){return a.length}).reduce(function(a,b){return a+b}),c=new Uint8Array(b),d=0;a.forEach(function(a){c.set(a,d);d+=a.length});return c}function Sc(a,b,c,d){var f=[],g=f.push.bind(f);Nc(b,g,l);a=Cc(c||Oc,a,d||Pc);Mc(a);return Rc(f)}function Tc(a,b,c){var d=[],f=d.push.bind(d);Nc(b,f,l);a=Dc(a,c||Pc);Mc(a);return Rc(d)}Qc.deflate=Sc.bind(k,1);Qc.rawDeflate=Sc.bind(k,-1);Qc.inflate=Tc.bind(k,1);Qc.rawInflate=Tc.bind(k,-1);var Uc=Qc.stream={};
function Vc(a,b){var c;c=b.level;var d=b.chunkSize;Nc(b.input,b.streamFn,b.shareMemory);c=Cc(c||Oc,a,d||Pc);Mc(c)}function Wc(a,b){var c;c=b.chunkSize;Nc(b.input,b.streamFn,b.shareMemory);c=Dc(a,c||Pc);Mc(c)}Uc.deflate=Vc.bind(k,1);Uc.rawDeflate=Vc.bind(k,-1);Uc.inflate=Wc.bind(k,1);Uc.rawInflate=Wc.bind(k,-1);"undefined"!==typeof define&&define.amd?define("zlib",function(){return Qc}):s&&(module.exports=Qc);

}).call(zlib);

/////////////////////////////////////////////////////////////
function expose(a, b) {
    var c = a.split("."),
        d = c.pop(),
        e = global;
    c.forEach(function(a) {
        e[a] = e[a] || {}, e = e[a]
    }), e[d] = b
}

function exposeProperty(a, b, c) {
    b.prototype[a] = c
}

function defun(a, b) {
    return function() {
        var c, d = arguments[0];
        return c = "[object Object]" === Object.prototype.toString.call(d) ? a.map(function(a) {
            return d[a]
        }) : arguments, b.apply(this, c)
    }
}

function createLocalFileHeader(a, b, c) {
    var d = new DataView(new ArrayBuffer(30 + a.length)),
        e = new Uint8Array(d.buffer),
        f = 0;
    return d.setUint32(f, zip.LOCAL_FILE_SIGNATURE, !0), f += 4, d.setUint16(f, 20, !0), f += 2, d.setUint16(f, 8), f += 2, d.setUint16(f, c ? 8 : 0, !0), f += 2, d.setUint16(f, createDosFileTime(b), !0), f += 2, d.setUint16(f, createDosFileDate(b), !0), f += 2, f += 12, d.setUint16(f, a.length, !0), f += 2, f += 2, e.set(a, f), e
}

function createCentralDirHeader(a, b, c, d, e, f, g) {
    var h = new DataView(new ArrayBuffer(46 + a.length)),
        i = new Uint8Array(h.buffer),
        j = 0;
    return h.setUint32(j, zip.CENTRAL_DIR_SIGNATURE, !0), j += 4, h.setUint16(j, 20, !0), j += 2, h.setUint16(j, 20, !0), j += 2, h.setUint16(j, 8), j += 2, h.setUint16(j, c ? 8 : 0, !0), j += 2, h.setUint16(j, createDosFileTime(b), !0), j += 2, h.setUint16(j, createDosFileDate(b), !0), j += 2, h.setUint32(j, g, !0), j += 4, h.setUint32(j, f, !0), j += 4, h.setUint32(j, e, !0), j += 4, h.setUint16(j, a.length, !0), j += 2, j += 12, h.setUint32(j, d, !0), j += 4, i.set(a, j), i
}

function createEndCentDirHeader(a, b, c) {
    var d = new DataView(new ArrayBuffer(22));
    return d.setUint32(0, zip.END_SIGNATURE, !0), d.setUint16(4, 0, !0), d.setUint16(6, 0, !0), d.setUint16(8, a, !0), d.setUint16(10, a, !0), d.setUint32(12, b, !0), d.setUint32(16, c, !0), d.setUint16(20, 0, !0), new Uint8Array(d.buffer)
}

function createDosFileDate(a) {
    return a.getFullYear() - 1980 << 9 | a.getMonth() + 1 << 5 | a.getDay()
}

function createDosFileTime(a) {
    return a.getHours() << 11 | a.getMinutes() << 5 | a.getSeconds() >> 1
}
var utils = {},
    algorithms = {},
    gz = {},
    zip = {},
    env = {},
    zpipe = {},
    stream = {
        algorithms: {},
        zlib: {},
        gz: {},
        zip: {}
    },
    global = this;
zip.LOCAL_FILE_SIGNATURE = 67324752, zip.CENTRAL_DIR_SIGNATURE = 33639248, zip.END_SIGNATURE = 101010256, env.isWorker = "function" == typeof importScripts, expose("jz.algos", algorithms), expose("jz.stream.algos", stream.algorithms);
var mimetypes = function() {
    var a = "application/epub+zip	epub\napplication/x-gzip	gz\napplication/andrew-inset	ez\napplication/annodex	anx\napplication/atom+xml	atom\napplication/atomcat+xml	atomcat\napplication/atomserv+xml	atomsrv\napplication/bbolin	lin\napplication/cap	cap pcap\napplication/cu-seeme	cu\napplication/davmount+xml	davmount\napplication/dsptype	tsp\napplication/ecmascript	es\napplication/futuresplash	spl\napplication/hta	hta\napplication/java-archive	jar\napplication/java-serialized-object	ser\napplication/java-vm	class\napplication/javascript	js\napplication/json	json\napplication/m3g	m3g\napplication/mac-binhex40	hqx\napplication/mac-compactpro	cpt\napplication/mathematica	nb nbp\napplication/msaccess	mdb\napplication/msword	doc dot\napplication/mxf	mxf\napplication/octet-stream	bin\napplication/oda	oda\napplication/ogg	ogx\napplication/onenote	one onetoc2 onetmp onepkg\napplication/pdf	pdf\napplication/pgp-keys	key\napplication/pgp-signature	pgp\napplication/pics-rules	prf\napplication/postscript	ps ai eps epsi epsf eps2 eps3\napplication/rar	rar\napplication/rdf+xml	rdf\napplication/rss+xml	rss\napplication/rtf	rtf\napplication/sla	stl\napplication/smil	smi smil\napplication/xhtml+xml	xhtml xht\napplication/xml	xml xsl xsd\napplication/xspf+xml	xspf\napplication/zip	zip\napplication/vnd.android.package-archive	apk\napplication/vnd.cinderella	cdy\napplication/vnd.google-earth.kml+xml	kml\napplication/vnd.google-earth.kmz	kmz\napplication/vnd.mozilla.xul+xml	xul\napplication/vnd.ms-excel	xls xlb xlt\napplication/vnd.ms-excel.addin.macroEnabled.12	xlam\napplication/vnd.ms-excel.sheet.binary.macroEnabled.12	xlsb\napplication/vnd.ms-excel.sheet.macroEnabled.12	xlsm\napplication/vnd.ms-excel.template.macroEnabled.12	xltm\napplication/vnd.ms-officetheme	thmx\napplication/vnd.ms-pki.seccat	cat\napplication/vnd.ms-powerpoint	ppt pps\napplication/vnd.ms-powerpoint.addin.macroEnabled.12	ppam\napplication/vnd.ms-powerpoint.presentation.macroEnabled.12	pptm\napplication/vnd.ms-powerpoint.slide.macroEnabled.12	sldm\napplication/vnd.ms-powerpoint.slideshow.macroEnabled.12	ppsm\napplication/vnd.ms-powerpoint.template.macroEnabled.12	potm\napplication/vnd.ms-word.document.macroEnabled.12	docm\napplication/vnd.ms-word.template.macroEnabled.12	dotm\napplication/vnd.oasis.opendocument.chart	odc\napplication/vnd.oasis.opendocument.database	odb\napplication/vnd.oasis.opendocument.formula	odf\napplication/vnd.oasis.opendocument.graphics	odg\napplication/vnd.oasis.opendocument.graphics-template	otg\napplication/vnd.oasis.opendocument.image	odi\napplication/vnd.oasis.opendocument.presentation	odp\napplication/vnd.oasis.opendocument.presentation-template	otp\napplication/vnd.oasis.opendocument.spreadsheet	ods\napplication/vnd.oasis.opendocument.spreadsheet-template	ots\napplication/vnd.oasis.opendocument.text	odt\napplication/vnd.oasis.opendocument.text-master	odm\napplication/vnd.oasis.opendocument.text-template	ott\napplication/vnd.oasis.opendocument.text-web	oth\napplication/vnd.openxmlformats-officedocument.presentationml.presentation	pptx\napplication/vnd.openxmlformats-officedocument.presentationml.slide	sldx\napplication/vnd.openxmlformats-officedocument.presentationml.slideshow	ppsx\napplication/vnd.openxmlformats-officedocument.presentationml.template	potx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet	xlsx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet	xlsx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.template	xltx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.template	xltx\napplication/vnd.openxmlformats-officedocument.wordprocessingml.document	docx\napplication/vnd.openxmlformats-officedocument.wordprocessingml.template	dotx\napplication/vnd.rim.cod	cod\napplication/vnd.smaf	mmf\napplication/vnd.stardivision.calc	sdc\napplication/vnd.stardivision.chart	sds\napplication/vnd.stardivision.draw	sda\napplication/vnd.stardivision.impress	sdd\napplication/vnd.stardivision.math	sdf\napplication/vnd.stardivision.writer	sdw\napplication/vnd.stardivision.writer-global	sgl\napplication/vnd.sun.xml.calc	sxc\napplication/vnd.sun.xml.calc.template	stc\napplication/vnd.sun.xml.draw	sxd\napplication/vnd.sun.xml.draw.template	std\napplication/vnd.sun.xml.impress	sxi\napplication/vnd.sun.xml.impress.template	sti\napplication/vnd.sun.xml.math	sxm\napplication/vnd.sun.xml.writer	sxw\napplication/vnd.sun.xml.writer.global	sxg\napplication/vnd.sun.xml.writer.template	stw\napplication/vnd.symbian.install	sis\napplication/vnd.visio	vsd\napplication/vnd.wap.wbxml	wbxml\napplication/vnd.wap.wmlc	wmlc\napplication/vnd.wap.wmlscriptc	wmlsc\napplication/vnd.wordperfect	wpd\napplication/vnd.wordperfect5.1	wp5\napplication/x-123	wk\napplication/x-7z-compressed	7z\napplication/x-abiword	abw\napplication/x-apple-diskimage	dmg\napplication/x-bcpio	bcpio\napplication/x-bittorrent	torrent\napplication/x-cab	cab\napplication/x-cbr	cbr\napplication/x-cbz	cbz\napplication/x-cdf	cdf cda\napplication/x-cdlink	vcd\napplication/x-chess-pgn	pgn\napplication/x-comsol	mph\napplication/x-cpio	cpio\napplication/x-csh	csh\napplication/x-debian-package	deb udeb\napplication/x-director	dcr dir dxr\napplication/x-dms	dms\napplication/x-doom	wad\napplication/x-dvi	dvi\napplication/x-font	pfa pfb gsf pcf pcf.Z\napplication/x-freemind	mm\napplication/x-futuresplash	spl\napplication/x-ganttproject	gan\napplication/x-gnumeric	gnumeric\napplication/x-go-sgf	sgf\napplication/x-graphing-calculator	gcf\napplication/x-gtar	gtar\napplication/x-gtar-compressed	tgz taz\napplication/x-hdf	hdf\napplication/x-httpd-eruby	rhtml\napplication/x-httpd-php	phtml pht php\napplication/x-httpd-php-source	phps\napplication/x-httpd-php3	php3\napplication/x-httpd-php3-preprocessed	php3p\napplication/x-httpd-php4	php4\napplication/x-httpd-php5	php5\napplication/x-ica	ica\napplication/x-info	info\napplication/x-internet-signup	ins isp\napplication/x-iphone	iii\napplication/x-iso9660-image	iso\napplication/x-jam	jam\napplication/x-java-jnlp-file	jnlp\napplication/x-jmol	jmz\napplication/x-kchart	chrt\napplication/x-killustrator	kil\napplication/x-koan	skp skd skt skm\napplication/x-kpresenter	kpr kpt\napplication/x-kspread	ksp\napplication/x-kword	kwd kwt\napplication/x-latex	latex\napplication/x-lha	lha\napplication/x-lyx	lyx\napplication/x-lzh	lzh\napplication/x-lzx	lzx\napplication/x-maker	frm maker frame fm fb book fbdoc\napplication/x-mif	mif\napplication/x-mpegURL	m3u8\napplication/x-ms-wmd	wmd\napplication/x-ms-wmz	wmz\napplication/x-msdos-program	com exe bat dll\napplication/x-msi	msi\napplication/x-netcdf	nc\napplication/x-ns-proxy-autoconfig	pac dat\napplication/x-nwc	nwc\napplication/x-object	o\napplication/x-oz-application	oza\napplication/x-pkcs7-certreqresp	p7r\napplication/x-pkcs7-crl	crl\napplication/x-python-code	pyc pyo\napplication/x-qgis	qgs shp shx\napplication/x-quicktimeplayer	qtl\napplication/x-rdp	rdp\napplication/x-redhat-package-manager	rpm\napplication/x-ruby	rb\napplication/x-scilab	sci sce\napplication/x-sh	sh\napplication/x-shar	shar\napplication/x-shockwave-flash	swf swfl\napplication/x-silverlight	scr\napplication/x-sql	sql\napplication/x-stuffit	sit sitx\napplication/x-sv4cpio	sv4cpio\napplication/x-sv4crc	sv4crc\napplication/x-tar	tar\napplication/x-tcl	tcl\napplication/x-tex-gf	gf\napplication/x-tex-pk	pk\napplication/x-texinfo	texinfo texi\napplication/x-trash	~ % bak old sik\napplication/x-troff	t tr roff\napplication/x-troff-man	man\napplication/x-troff-me	me\napplication/x-troff-ms	ms\napplication/x-ustar	ustar\napplication/x-wais-source	src\napplication/x-wingz	wz\napplication/x-x509-ca-cert	crt\napplication/x-xcf	xcf\napplication/x-xfig	fig\napplication/x-xpinstall	xpi\naudio/amr	amr\naudio/amr-wb	awb\naudio/amr	amr\naudio/amr-wb	awb\naudio/annodex	axa\naudio/basic	au snd\naudio/csound	csd orc sco\naudio/flac	flac\naudio/midi	mid midi kar\naudio/mpeg	mpga mpega mp2 mp3 m4a\naudio/mpegurl	m3u\naudio/ogg	oga ogg spx\naudio/prs.sid	sid\naudio/x-aiff	aif aiff aifc\naudio/x-gsm	gsm\naudio/x-mpegurl	m3u\naudio/x-ms-wma	wma\naudio/x-ms-wax	wax\naudio/x-pn-realaudio	ra rm ram\naudio/x-realaudio	ra\naudio/x-scpls	pls\naudio/x-sd2	sd2\naudio/x-wav	wav\nchemical/x-alchemy	alc\nchemical/x-cache	cac cache\nchemical/x-cache-csf	csf\nchemical/x-cactvs-binary	cbin cascii ctab\nchemical/x-cdx	cdx\nchemical/x-cerius	cer\nchemical/x-chem3d	c3d\nchemical/x-chemdraw	chm\nchemical/x-cif	cif\nchemical/x-cmdf	cmdf\nchemical/x-cml	cml\nchemical/x-compass	cpa\nchemical/x-crossfire	bsd\nchemical/x-csml	csml csm\nchemical/x-ctx	ctx\nchemical/x-cxf	cxf cef\nchemical/x-embl-dl-nucleotide	emb embl\nchemical/x-galactic-spc	spc\nchemical/x-gamess-input	inp gam gamin\nchemical/x-gaussian-checkpoint	fch fchk\nchemical/x-gaussian-cube	cub\nchemical/x-gaussian-input	gau gjc gjf\nchemical/x-gaussian-log	gal\nchemical/x-gcg8-sequence	gcg\nchemical/x-genbank	gen\nchemical/x-hin	hin\nchemical/x-isostar	istr ist\nchemical/x-jcamp-dx	jdx dx\nchemical/x-kinemage	kin\nchemical/x-macmolecule	mcm\nchemical/x-macromodel-input	mmd mmod\nchemical/x-mdl-molfile	mol\nchemical/x-mdl-rdfile	rd\nchemical/x-mdl-rxnfile	rxn\nchemical/x-mdl-sdfile	sd sdf\nchemical/x-mdl-tgf	tgf\nchemical/x-mmcif	mcif\nchemical/x-mol2	mol2\nchemical/x-molconn-Z	b\nchemical/x-mopac-graph	gpt\nchemical/x-mopac-input	mop mopcrt mpc zmt\nchemical/x-mopac-out	moo\nchemical/x-mopac-vib	mvb\nchemical/x-ncbi-asn1	asn\nchemical/x-ncbi-asn1-ascii	prt ent\nchemical/x-ncbi-asn1-binary	val aso\nchemical/x-ncbi-asn1-spec	asn\nchemical/x-pdb	pdb ent\nchemical/x-rosdal	ros\nchemical/x-swissprot	sw\nchemical/x-vamas-iso14976	vms\nchemical/x-vmd	vmd\nchemical/x-xtel	xtel\nchemical/x-xyz	xyz\nimage/gif	gif\nimage/ief	ief\nimage/jpeg	jpeg jpg jpe\nimage/pcx	pcx\nimage/png	png\nimage/svg+xml	svg svgz\nimage/tiff	tiff tif\nimage/vnd.djvu	djvu djv\nimage/vnd.wap.wbmp	wbmp\nimage/x-canon-cr2	cr2\nimage/x-canon-crw	crw\nimage/x-cmu-raster	ras\nimage/x-coreldraw	cdr\nimage/x-coreldrawpattern	pat\nimage/x-coreldrawtemplate	cdt\nimage/x-corelphotopaint	cpt\nimage/x-epson-erf	erf\nimage/x-icon	ico\nimage/x-jg	art\nimage/x-jng	jng\nimage/x-ms-bmp	bmp\nimage/x-nikon-nef	nef\nimage/x-olympus-orf	orf\nimage/x-photoshop	psd\nimage/x-portable-anymap	pnm\nimage/x-portable-bitmap	pbm\nimage/x-portable-graymap	pgm\nimage/x-portable-pixmap	ppm\nimage/x-rgb	rgb\nimage/x-xbitmap	xbm\nimage/x-xpixmap	xpm\nimage/x-xwindowdump	xwd\nmessage/rfc822	eml\nmodel/iges	igs iges\nmodel/mesh	msh mesh silo\nmodel/vrml	wrl vrml\nmodel/x3d+vrml	x3dv\nmodel/x3d+xml	x3d\nmodel/x3d+binary	x3db\ntext/cache-manifest	manifest\ntext/calendar	ics icz\ntext/css	css\ntext/csv	csv\ntext/h323	323\ntext/html	html htm shtml\ntext/iuls	uls\ntext/mathml	mml\ntext/plain	asc txt text pot brf\ntext/richtext	rtx\ntext/scriptlet	sct wsc\ntext/texmacs	tm\ntext/tab-separated-values	tsv\ntext/vnd.sun.j2me.app-descriptor	jad\ntext/vnd.wap.wml	wml\ntext/vnd.wap.wmlscript	wmls\ntext/x-bibtex	bib\ntext/x-boo	boo\ntext/x-c++hdr	h++ hpp hxx hh\ntext/x-c++src	c++ cpp cxx cc\ntext/x-chdr	h\ntext/x-component	htc\ntext/x-csh	csh\ntext/x-csrc	c\ntext/x-dsrc	d\ntext/x-diff	diff patch\ntext/x-haskell	hs\ntext/x-java	java\ntext/x-literate-haskell	lhs\ntext/x-moc	moc\ntext/x-pascal	p pas\ntext/x-pcs-gcd	gcd\ntext/x-perl	pl pm\ntext/x-python	py\ntext/x-scala	scala\ntext/x-setext	etx\ntext/x-sfv	sfv\ntext/x-sh	sh\ntext/x-tcl	tcl tk\ntext/x-tex	tex ltx sty cls\ntext/x-vcalendar	vcs\ntext/x-vcard	vcf\nvideo/3gpp	3gp\nvideo/annodex	axv\nvideo/dl	dl\nvideo/dv	dif dv\nvideo/fli	fli\nvideo/gl	gl\nvideo/mpeg	mpeg mpg mpe\nvideo/MP2T	ts\nvideo/mp4	mp4\nvideo/quicktime	qt mov\nvideo/ogg	ogv\nvideo/webm	webm\nvideo/vnd.mpegurl	mxu\nvideo/x-flv	flv\nvideo/x-la-asf	lsf lsx\nvideo/x-mng	mng\nvideo/x-ms-asf	asf asx\nvideo/x-ms-wm	wm\nvideo/x-ms-wmv	wmv\nvideo/x-ms-wmx	wmx\nvideo/x-ms-wvx	wvx\nvideo/x-msvideo	avi\nvideo/x-sgi-movie	movie\nvideo/x-matroska	mpv mkv\nx-conference/x-cooltalk	ice\nx-epoc/x-sisx-app	sisx\nx-world/x-vrml	vrm vrml wrl",
        b = a.split("\n"),
        c = {};
    return b.forEach(function(a) {
        var b = a.split("	"),
            d = b[0],
            e = b[1].split(" ");
        e.forEach(function(a) {
            c[a] = d
        })
    }), {
        set: function(a, b) {
            "object" == typeof a ? Object.keys(a).forEach(function(b) {
                c[b] = a[b]
            }) : c[a] = b
        },
        guess: function(a) {
			var x=a.split(".").pop() || ''; //edit
			if(!c[x]) x=x.toLowerCase();
            return c[x] || "aplication/octet-stream";
        }
    }
}();
utils.toArray = function(a) {
    return Array.prototype.slice.call(a)
}, utils.getParams = function(a, b) {
    if ("[object Object]" === Object.prototype.toString.call(a[0])) return a[0];
    var c = {};
    return b.forEach(function(b, d) {
        c[b] = a[d]
    }), c
}, utils.toBytes = function(a) {
    switch (Object.prototype.toString.call(a)) {
        case "[object String]":
            return utils.stringToBytes(a);
        case "[object Array]":
        case "[object ArrayBuffer]":
            return new Uint8Array(a);
        case "[object Uint8Array]":
            return a;
        case "[object Int8Array]":
        case "[object Uint8ClampedArray]":
        case "[object CanvasPixelArray]":
            return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
        default:
            throw new Error("jz.utils.toBytes: not supported type.")
    }
}, expose("jz.utils.toBytes", utils.toBytes), utils.readFileAs = function(a, b, c) {
    var d;
    return d = env.isWorker ? function(d) {
        var e = new FileReaderSync;
        d(e["readAs" + a].call(e, b, c))
    } : function(d, e) {
        var f = new FileReader;
        f.onload = function() {
            d(f.result)
        }, f.onerror = e, f["readAs" + a].call(f, b, c)
    }, new Promise(d)
}, utils.readFileAsText = function(a, b) {
    return utils.readFileAs("Text", a, b || "UTF-8")
}, utils.readFileAsArrayBuffer = utils.readFileAs.bind(null, "ArrayBuffer"), utils.readFileAsDataURL = utils.readFileAs.bind(null, "DataURL"), utils.readFileAsBinaryString = utils.readFileAs.bind(null, "BinaryString"), expose("jz.utils.readFileAsArrayBuffer", utils.readFileAsArrayBuffer), expose("jz.utils.readFileAsText", utils.readFileAsText), expose("jz.utils.readFileAsDataURL", utils.readFileAsDataURL), expose("jz.utils.readFileAsBinaryString", utils.readFileAsBinaryString), utils.stringToBytes = function(a) {
    var b, c, d, e = a.length,
        f = -1,
        g = 32,
        h = new Uint8Array(g);
    for (b = 0; e > b; ++b) c = a.charCodeAt(b), 127 >= c ? h[++f] = c : 2047 >= c ? (h[++f] = 192 | c >>> 6, h[++f] = 128 | 63 & c) : 65535 >= c ? (h[++f] = 224 | c >>> 12, h[++f] = 128 | c >>> 6 & 63, h[++f] = 128 | 63 & c) : (h[++f] = 240 | c >>> 18, h[++f] = 128 | c >>> 12 & 63, h[++f] = 128 | c >>> 6 & 63, h[++f] = 128 | 63 & c), 4 >= g - f && (d = h, g *= 2, h = new Uint8Array(g), h.set(d));
    return h.subarray(0, ++f)
}, utils.bytesToString = function(a, b) {
    return utils.readFileAsText(new Blob([utils.toBytes(a)]), b)
}, expose("jz.utils.bytesToString", utils.bytesToString), utils.bytesToStringSync = null, env.isWorker && (utils.bytesToStringSync = function(a, b) {
    return (new FileReaderSync).readAsText(new Blob([utils.toBytes(a)]), b || "UTF-8")
}, expose("jz.utils.bytesToStringSync", utils.bytesToStringSync)), utils.detectEncoding = function(a) {
    a = utils.toBytes(a);
    for (var b = 0, c = a.length; c > b; ++b)
        if (!(a[b] < 128))
            if (192 === (224 & a[b])) {
                if (128 === (192 & a[++b])) continue
            } else if (224 === (240 & a[b])) {
        if (128 === (192 & a[++b]) && 128 === (192 & a[++b])) continue
    } else {
        if (240 !== (248 & a[b])) return "Shift_JIS";
        if (128 === (192 & a[++b]) && 128 === (192 & a[++b]) && 128 === (192 & a[++b])) continue
    }
    return "UTF-8"
}, expose("jz.utils.detectEncoding", utils.detectEncoding), Promise.prototype.spread = function(a, b) {
    return Promise.prototype.then.call(this, Function.prototype.apply.bind(a, null), b)
}, utils.load = function(a) {
    return a = Array.isArray(a) ? a : utils.toArray(arguments), Promise.all(a.map(function(a) {
        return new Promise(function(b, c) {
            var d = new XMLHttpRequest;
            d.open("GET", a), d.responseType = "arraybuffer", d.onloadend = function() {
                var e = d.status;
                200 === e || 206 === e || 0 === e ? b(new Uint8Array(d.response)) : c(new Error("Load Error: " + e + " " + a))
            }, d.onerror = c, d.send()
        })
    }))
}, expose("jz.utils.load", utils.load), utils.concatBytes = function(a) {
    var b, c, d, a = Array.isArray(a) ? a : utils.toArray(arguments),
        e = 0,
        f = 0;
    for (b = 0, c = a.length; c > b; ++b) e += a[b].length;
    for (d = new Uint8Array(e), b = 0; c > b; ++b) d.set(a[b], f), f += a[b].length;
    return d
}, expose("jz.utils.concatBytes", utils.concatBytes), algorithms.adler32 = function(a) {
    for (var b, a = utils.toBytes(a), c = 1, d = 0, e = 0, f = 65521, g = a.length; g > 0;) {
        b = g > 5550 ? 5550 : g, g -= b;
        do c += a[e++], d += c; while (--b);
        c %= f, d %= f
    }
    return (d << 16 | c) >>> 0
}, expose("jz.algorithms.adler32", algorithms.adler32), algorithms.crc32 = function() {
    var a = function() {
        var a, b, c, d = 3988292384,
            e = new Uint32Array(256);
        for (b = 0; 256 > b; ++b) {
            for (a = b, c = 0; 8 > c; ++c) a = 1 & a ? a >>> 1 ^ d : a >>> 1;
            e[b] = a >>> 0
        }
        return e
    }();
    return defun(["buffer", "crc"], function(b, c) {
        for (var d = utils.toBytes(b), c = null == c ? 4294967295 : ~c >>> 0, e = 0, f = d.length, g = a; f > e; ++e) c = c >>> 8 ^ g[d[e] ^ 255 & c];
        return ~c >>> 0
    })
}(), expose("jz.algorithms.crc32", algorithms.crc32), algorithms.deflate = defun(["buffer", "level", "chunkSize"], function(a, b, c) {
    return zlib.rawDeflate(utils.toBytes(a), b, c)
}), expose("jz.algorithms.deflate", algorithms.deflate), algorithms.inflate = defun(["buffer", "chunkSize"], function(a, b) {
    return zlib.rawInflate(utils.toBytes(a), b)
}), expose("jz.algorithms.inflate", algorithms.inflate);
var ZipArchiveWriter = defun(["shareMemory", "chunkSize"], function(a, b) {
    this.shareMemory = a, this.chunkSize = b, this.dirs = {}, this.centralDirHeaders = [], this.offset = 0, this.date = new Date, this.listners = {}
});
ZipArchiveWriter.prototype.write = function(a, b, c) {
    var d = this;
    return a.split("/").reduce(function(a, b) {
        return d.writeDir(a + "/"), a + "/" + b
    }), this.writeFile(a, b, c), this
}, ZipArchiveWriter.prototype.writeDir = function(a) {
    var b;
    return a += /.+\/$/.test(a) ? "" : "/", this.dirs[a] || (this.dirs[a] = !0, a = utils.toBytes(a), b = createLocalFileHeader(a, this.date, !1), this.centralDirHeaders.push(createCentralDirHeader(a, this.date, !1, this.offset, 0, 0, 0)), this.trigger("data", b), this.offset += b.length), this
}, ZipArchiveWriter.prototype.writeFile = function(a, b, c) {
    a = utils.toBytes(a);
    var d = this.offset,
        e = createLocalFileHeader(a, this.date, c),
        f = 0,
        g = this;
    return this.trigger("data", e), c ? stream.algorithms.deflate({
        buffer: b,
        level: c,
        streamFn: function(a) {
            f += a.length, g.trigger("data", a)
        },
        shareMemory: this.shareMemory,
        chunkSize: this.chunkSize
    }) : (f = b.length, this.trigger("data", b)), this.centralDirHeaders.push(createCentralDirHeader(a, this.date, c, d, b.length, f, algorithms.crc32(b))), this.offset += e.length + f, this
}, ZipArchiveWriter.prototype.writeEnd = function() {
    var a = 0,
        b = this;
    this.centralDirHeaders.forEach(function(c) {
        a += c.length, b.trigger("data", c)
    }), this.trigger("data", createEndCentDirHeader(this.centralDirHeaders.length, a, this.offset)), this.trigger("end", null)
}, ZipArchiveWriter.prototype.on = function(a, b) {
    return this.listners[a] || (this.listners[a] = []), this.listners[a].push(b), this
}, ZipArchiveWriter.prototype.trigger = function(a, b) {
    this.listners[a] && this.listners[a].forEach(function(a) {
        a(b)
    })
}, expose("jz.zip.ZipArchiveWriter", ZipArchiveWriter), exposeProperty("write", ZipArchiveWriter, ZipArchiveWriter.prototype.write), exposeProperty("writeDir", ZipArchiveWriter, ZipArchiveWriter.prototype.writeDir), exposeProperty("writeFile", ZipArchiveWriter, ZipArchiveWriter.prototype.writeFile), exposeProperty("writeEnd", ZipArchiveWriter, ZipArchiveWriter.prototype.writeEnd), exposeProperty("on", ZipArchiveWriter, ZipArchiveWriter.prototype.on);
var ZipArchiveReader = defun(["buffer", "encoding", "chunkSize"], function(a, b, c) {
    this.bytes = utils.toBytes(a), this.buffer = this.bytes.buffer, this.encoding = b, this.chunkSize = c
});
ZipArchiveReader.prototype.init = function() {
    var a, b, c, d, e = this.bytes,
        f = [],
        g = [],
        h = [],
        i = [],
        j = e.byteLength - 4,
        k = new DataView(e.buffer, e.byteOffset, e.byteLength),
        l = this;
    if (this.files = h, this.folders = i, this.localFileHeaders = f, this.centralDirHeaders = g, k.getUint32(0, !0) !== zip.LOCAL_FILE_SIGNATURE){
		_gerrinf('zip.unpack: invalid zip file'); 
		throw new Error("zip.unpack: invalid zip file");
	}
    for (;;) {
        if (k.getUint32(j, !0) === zip.END_SIGNATURE) {
            b = l._getEndCentDirHeader(j);
            break
        }
        if (j--, 0 === j) throw new Error("zip.unpack: invalid zip file")
    }
    for (j = b.startpos, c = 0, d = b.direntry; d > c; ++c) a = l._getCentralDirHeader(j), g.push(a), j += a.allsize;
    for (c = 0; d > c; ++c) j = g[c].headerpos, a = l._getLocalFileHeader(j), a.crc32 = g[c].crc32, a.compsize = g[c].compsize, a.uncompsize = g[c].uncompsize, f.push(a);
    return this._completeInit()
}, ZipArchiveReader.prototype._completeInit = function() {
    var a = this.files,
        b = this.folders,
        c = this.localFileHeaders,
        d = this;
    return c.forEach(function(c) {
        (47 !== c.filename[c.filename.length - 1] ? a : b).push(c)
    }), null == d.encoding && Promise.resolve(c.map(function(a) {
        return a.filename
    })).then(utils.concatBytes).then(utils.detectEncoding).then(function(a) {
        d.encoding = a
    }), Promise.all(c.map(function(a) {
        return utils.bytesToString(a.filename, d.encoding).then(function(b) {
            a.filename = b
        })
    })).then(function() {
        return d
    })
}, ZipArchiveReader.prototype._getLocalFileHeader = function(a) {
    var b = new DataView(this.buffer, a),
        c = new Uint8Array(this.buffer, a),
        d = {};
    return d.signature = b.getUint32(0, !0), d.needver = b.getUint16(4, !0), d.option = b.getUint16(6, !0), d.comptype = b.getUint16(8, !0), d.filetime = b.getUint16(10, !0), d.filedate = b.getUint16(12, !0), d.crc32 = b.getUint32(14, !0), d.compsize = b.getUint32(18, !0), d.uncompsize = b.getUint32(22, !0), d.fnamelen = b.getUint16(26, !0), d.extralen = b.getUint16(28, !0), d.headersize = 30 + d.fnamelen + d.extralen, d.allsize = d.headersize + d.compsize, d.filename = c.subarray(30, 30 + d.fnamelen), d
}, ZipArchiveReader.prototype._getCentralDirHeader = function(a) {
    var b = new DataView(this.buffer, a),
        c = {};
    return c.signature = b.getUint32(0, !0), c.madever = b.getUint16(4, !0), c.needver = b.getUint16(6, !0), c.option = b.getUint16(8, !0), c.comptype = b.getUint16(10, !0), c.filetime = b.getUint16(12, !0), c.filedate = b.getUint16(14, !0), c.crc32 = b.getUint32(16, !0), c.compsize = b.getUint32(20, !0), c.uncompsize = b.getUint32(24, !0), c.fnamelen = b.getUint16(28, !0), c.extralen = b.getUint16(30, !0), c.commentlen = b.getUint16(32, !0), c.disknum = b.getUint16(34, !0), c.inattr = b.getUint16(36, !0), c.outattr = b.getUint32(38, !0), c.headerpos = b.getUint32(42, !0), c.allsize = 46 + c.fnamelen + c.extralen + c.commentlen, c
}, ZipArchiveReader.prototype._getEndCentDirHeader = function(a) {
    var b = new DataView(this.buffer, a);
	//console.log(b)
    return {
        signature: b.getUint32(0, !0),
        disknum: b.getUint16(4, !0),
        startdisknum: b.getUint16(6, !0),
        diskdirentry: b.getUint16(8, !0),
        direntry: b.getUint16(10, !0),
        dirsize: b.getUint32(12, !0),
        startpos: b.getUint32(16, !0),
        commentlen: b.getUint16(20, !0)
    }
}, ZipArchiveReader.prototype.getFileNames = function() {
    return this.files.map(function(a) {
        return a.filename
    })
}, ZipArchiveReader.prototype._getFileIndex = function(a) {
    for (var b = 0, c = this.localFileHeaders.length; c > b; ++b)
        if (a === this.localFileHeaders[b].filename) return b;
    throw new Error("File is not found.")
}, ZipArchiveReader.prototype._getFileInfo = function(a) {
    var b = this._getFileIndex(a),
        c = this.centralDirHeaders[b],
        d = this.localFileHeaders[b];
    return {
        offset: c.headerpos + d.headersize,
        length: d.compsize,
        isCompressed: d.comptype
    }
}, ZipArchiveReader.prototype._decompress = function(a, b) {
    return b ? algorithms.inflate({
        buffer: a,
        chunkSize: this.chunkSize
    }) : a
}, ZipArchiveReader.prototype._decompressFile = function(a) {
    var b = this._getFileInfo(a);
    return this._decompress(new Uint8Array(this.buffer, b.offset, b.length), b.isCompressed)
}, ZipArchiveReader.prototype.readFileAsArrayBuffer = function(a) {
    return new Promise(function(b) {
        b(this._decompressFile(a).buffer)
    }.bind(this))
}, ZipArchiveReader.prototype._readFileAs = function(a, b, c) {
    return this.readFileAsBlob(b).then(function(b) {
        return utils.readFileAs.call(null, a, b, c)
    })
}, ZipArchiveReader.prototype.readFileAsText = function(a, b) {
    return this._readFileAs("Text", a, b || "UTF-8")
}, ZipArchiveReader.prototype.readFileAsBinaryString = function(a) {
    return this._readFileAs("BinaryString", a)
}, ZipArchiveReader.prototype.readFileAsDataURL = function(a) {
    return this._readFileAs("DataURL", a)
}, ZipArchiveReader.prototype.readFileAsBlob = function(a, b) {
    return new Promise(function(c) {
        c(new Blob([this._decompressFile(a, !1)], {
            type: b || mimetypes.guess(a)
        }))
    }.bind(this))
}, env.isWorker && (ZipArchiveReader.prototype.readFileAsArrayBufferSync = function(a) {
    return this._decompressFile(a, !0).buffer
}, ZipArchiveReader.prototype.readFileAsBlobSync = function(a, b) {
    return new Blob([this._decompressFile(a, !1)], {
        type: b || mimetypes.guess(a)
    })
}, ZipArchiveReader.prototype.readFileAsTextSync = function(a, b) {
    return (new FileReaderSync).readAsText(this.readFileAsBlobSync(a), b || "UTF-8")
}, ZipArchiveReader.prototype.readFileAsBinaryStringSync = function(a) {
    return (new FileReaderSync).readAsBinaryString(this.readFileAsBlobSync(a))
}, ZipArchiveReader.prototype.readFileAsDataURLSync = function(a) {
    return (new FileReaderSync).readAsDataURL(this.readFileAsBlobSync(a))
}, exposeProperty("readFileAsArrayBufferSync", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsArrayBufferSync), exposeProperty("readFileAsBlobSync", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsBlobSync), exposeProperty("readFileAsTextSync", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsTextSync), exposeProperty("readFileAsBinaryStringSync", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsBinaryStringSync), exposeProperty("readFileAsDataURLSync", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsDataURLSync)), exposeProperty("getFileNames", ZipArchiveReader, ZipArchiveReader.prototype.getFileNames), exposeProperty("readFileAsArrayBuffer", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsArrayBuffer), exposeProperty("readFileAsText", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsText), exposeProperty("readFileAsBinaryString", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsBinaryString), exposeProperty("readFileAsDataURL", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsDataURL), exposeProperty("readFileAsBlob", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsBlob);
var ZipArchiveReaderBlob = defun(["buffer", "encoding", "chunkSize"], function(a, b, c) {
    this.blob = a, this.encoding = b, this.chunkSize = c
});
ZipArchiveReaderBlob.prototype = Object.create(ZipArchiveReader.prototype), ZipArchiveReaderBlob.prototype.constructor = ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.init = function() {
function a(a, b) {
    return utils.readFileAsArrayBuffer(c.slice(a, b))
}
	
var gcount=0;
var b, c = this.blob,
    d = [],
    e = [],
    f = [],
    g = [];

return this.files = f, this.folders = g, this.localFileHeaders = e, this.centralDirHeaders = d,
    function() {
        return a(0, 4).then(function(a) {
            if (new DataView(a).getUint32(0, !0) === zip.LOCAL_FILE_SIGNATURE) return Math.max(0, c.size - 32768);
			_gerrinf('zip.unpack: invalid zip file.');
            //throw new Error("zip.unpack: invalid zip file.")
        })
    }().then(function h(b) {
        return a(b, Math.min(c.size, b + 32768)).then(function(a) {
            var c, d = new DataView(a);
            for (c = a.byteLength - 4; c--;)
                if (d.getUint32(c, !0) === zip.END_SIGNATURE) return b + c;
            if (b) return h(Math.max(b - 32768 + 3, 0));
			_gerrinf('zip.unpack: invalid zip file.');
            //throw new Error("zip.unpack: invalid zip file.")
        })
    }).then(function(d) {
        return a(d, c.size).then(function(a) {
			try{
				return b = ZipArchiveReader.prototype._getEndCentDirHeader.call({ buffer: a }, 0), d;
			}catch(err){
				_gerrinf(err+''); //edit
			}
        })
    }).then(function(c) {
        return a(b.startpos, c).then(function(a) {
            var c, e, f, g = 0,
                h = {
                    buffer: a
                };
            for (c = 0, e = b.direntry; e > c; ++c) f = ZipArchiveReader.prototype._getCentralDirHeader.call(h, g), d.push(f), g += f.allsize
        })
    }).then(function i(b) {
        if (b !== d.length) {
            var c = d[b].headerpos;
            return a(c + 26, c + 30).then(function(b) {
                var d = new DataView(b),
                    e = d.getUint16(0, !0),
                    f = d.getUint16(2, !0);
                return a(c, c + 30 + e + f)
            }).then(function(a) {
				gcount++;
				if(gcount>maxunzipcount){
					alert('Too many number of files. (around '+maxunzipcount+' files limit in a zip)');
					return false;
				}
                var c = ZipArchiveReader.prototype._getLocalFileHeader.call({
                    buffer: a
                }, 0);
                return c.crc32 = d[b].crc32, c.compsize = d[b].compsize, c.uncompsize = d[b].uncompsize, e.push(c), i(b + 1)
            })
        }
    }.bind(null, 0)).then(this._completeInit.bind(this))
}, ZipArchiveReaderBlob.prototype.readFileAsArrayBuffer = function(a) {
return this._readFileAs("ArrayBuffer", a)
}, ZipArchiveReaderBlob.prototype.readFileAsBlob = function(a, b) {
b = b || mimetypes.guess(a);
var c = this._getFileInfo(a),
    //d = this.blob.slice(c.offset, c.offset + c.length, { type: b});
	d = this.blob.slice(c.offset, c.offset + c.length, b); //edit

return c.isCompressed ? utils.readFileAsArrayBuffer(d).then(function(a) {
    return new Blob([algorithms.inflate(new Uint8Array(a))], {
        type: b
    })
}) : Promise.resolve(d)
}, env.isWorker && (ZipArchiveReaderBlob.prototype._decompressFile = function(a) {
var b = this._getFileInfo(a),
    c = this.blob.slice(b.offset, b.offset + b.length),
    d = new Uint8Array((new FileReaderSync).readAsArrayBuffer(c));
return this._decompress(d, b.isCompressed)
}, ZipArchiveReaderBlob.prototype.readFileAsArrayBufferSync = function(a) {
return this._decompressFile(a, !0).buffer
}, ZipArchiveReaderBlob.prototype.readFileAsBlobSync = function(a, b) {
return new Blob([this._decompressFile(a, !1)], {
    type: b || mimetypes.guess(a)
})
}, exposeProperty("readFileAsArrayBufferSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsArrayBufferSync), exposeProperty("readFileAsBlobSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsBlobSync), exposeProperty("readFileAsTextSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsTextSync), exposeProperty("readFileAsBinaryStringSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsBinaryStringSync), exposeProperty("readFileAsDataURLSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsDataURLSync)), exposeProperty("readFileAsArrayBuffer", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsArrayBuffer), exposeProperty("readFileAsText", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsText), exposeProperty("readFileAsBinaryString", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsBinaryString), exposeProperty("readFileAsDataURL", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsDataURL), exposeProperty("readFileAsBlob", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsBlob), exposeProperty("readFileAsTextSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsTextSync), exposeProperty("readFileAsBinaryStringSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsBinaryStringSync), exposeProperty("readFileAsDataURLSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsDataURLSync), stream.algorithms.deflate = defun(["buffer", "streamFn", "level", "shareMemory", "chunkSize"], function(a, b, c, d, e) {
zlib.stream.rawDeflate({
    input: utils.toBytes(a),
    streamFn: b,
    level: c,
    shareMemory: d,
    chunkSize: e
})
}), expose("jz.stream.algorithms.deflate", stream.algorithms.deflate), stream.algorithms.inflate = defun(["buffer", "streamFn", "shareMemory", "chunkSize"], function(a, b, c, d) {
zlib.stream.rawInflate({
    input: utils.toBytes(a),
    streamFn: b,
    shareMemory: c,
    chunkSize: d
})
}), expose("jz.stream.algorithms.inflate", stream.algorithms.inflate), stream.zlib.compress = defun(["buffer", "streamFn", "level", "shareMemory", "chunkSize"], function(a, b, c, d, e) {
zlib.stream.deflate({
    input: utils.toBytes(a),
    streamFn: b,
    level: c,
    shareMemory: d,
    chunkSize: e
})
}), expose("jz.stream.zlib.compress", stream.zlib.compress), stream.zlib.decompress = defun(["buffer", "streamFn", "shareMemory", "chunkSize"], function(a, b, c, d) {
zlib.stream.inflate({
    input: a,
    streamFn: b,
    shareMemory: c,
    chunkSize: d
})
}), expose("jz.stream.zlib.decompress", stream.zlib.decompress), stream.gz.compress = defun(["buffer", "streamFn", "level", "shareMemory", "chunkSize", "fname", "fcomment"], function(a, b, c, d, e, f, g) {
var h, i, j, k = utils.toBytes(a),
    f = f && utils.toBytes(f),
    g = g && utils.toBytes(g),
    l = 0,
    m = 10,
    n = 0,
    o = Date.now();
f && (m += f.length + 1, l |= 8), g && (m += g.length + 1, l |= 16), h = new Uint8Array(m), j = new DataView(h.buffer), j.setUint32(n, 529205248 | l), n += 4, j.setUint32(n, o, !0), n += 4, j.setUint16(n, 1279), n += 2, f && (h.set(f, n), n += f.length, h[n++] = 0), g && (h.set(g, n), n += g.length, h[n++] = 0), b(h), stream.algorithms.deflate({
    buffer: k,
    streamFn: b,
    shareMemory: d,
    chunkSize: e
}), i = new Uint8Array(8), j = new DataView(i.buffer), j.setUint32(0, algorithms.crc32(k), !0), j.setUint32(4, k.length, !0), b(i)
}), expose("jz.stream.gz.compress", stream.gz.compress), stream.gz.decompress = defun(["buffer", "streamFn", "shareMemory", "chunkSize"], function(a, b, c, d) {
var e, f, g = utils.toBytes(a),
    h = 10,
    i = new DataView(g.buffer, g.byteOffset, g.byteLength);
if (8075 !== i.getUint16(0)) throw new Error("jz.gz.decompress: invalid gzip file.");
if (8 !== g[2]) throw new Error("jz.gz.decompress: not deflate.");
if (e = g[3], 4 & e && (h += i.getUint16(h, !0) + 2), 8 & e)
    for (; g[h++];);
if (16 & e)
    for (; g[h++];);
if (2 & e && (h += 2), stream.algorithms.inflate({
    buffer: g.subarray(h, g.length - 8),
    streamFn: function(a) {
        f = algorithms.crc32(a, f), b(a)
    },
    shareMemory: c,
    chunkSize: d
}), f !== i.getUint32(g.length - 8, !0)) throw new Error("js.stream.gz.decompress: file is broken.")
}), expose("jz.stream.gz.decompress", stream.gz.decompress), stream.zip.pack = defun(["files", "streamFn", "level", "shareMemory", "chunkSize"], function(a, b, c, d, e) {
function f(a, b, c) {
    var d, e = c.children || c.dir || c.folder;
    if (a = "number" == typeof c.level ? c.level : a, e) b += c.name + (/.+\/$/.test(c.name) ? "" : "/"), i.writeDir(b), e.forEach(f.bind(null, a, b));
    else {
        if (null != c.buffer && (d = c.buffer), null != c.str && (d = c.str), null == d) throw new Error("jz.zip.pack: This type is not supported.");
        b += c.name, i.writeFile(b, utils.toBytes(d), a)
    }
}

function g(a) {
    var b = a.children || a.dir || a.folder;
    b ? b.forEach(g) : a.url && h.push(utils.load(a.url).then(function(b) {
        a.buffer = b[0], a.url = null
    }))
}
var h = [],
    i = new ZipArchiveWriter(d, e);
return i.on("data", b), a.forEach(g), Promise.all(h).then(function() {
    a.forEach(f.bind(null, c, "")), i.writeEnd()
})
}), expose("jz.stream.zip.pack", stream.zip.pack), expose("jz.zlib.compress", defun(["buffer", "level", "chunkSize"], function(a, b, c) {
return zlib.deflate(utils.toBytes(a), b, c)
})), expose("jz.zlib.decompress", defun(["buffer", "chunkSize"], function(a, b) {
return zlib.inflate(utils.toBytes(a), b)
})), gz.compress = defun(["buffer", "level", "chunkSize", "fname", "fcomment"], function(a, b, c, d, e) {
var f = [];
return stream.gz.compress({
    buffer: a,
    level: b,
    chunkSize: c,
    fname: d,
    fcomment: e,
    streamFn: function(a) {
        f.push(a)
    }
}), utils.concatBytes(f)
}), expose("jz.gz.compress", gz.compress), gz.decompress = defun(["buffer", "chunkSize"], function(a, b) {
var c = [];
return stream.gz.decompress({
    buffer: a,
    streamFn: function(a) {
        c.push(a)
    },
    chunkSize: b
}), utils.concatBytes(c)
}), expose("jz.gz.decompress", gz.decompress), zip.pack = defun(["files", "level", "chunkSize"], function(a, b, c) {
var d = [];
return stream.zip.pack({
    files: a,
    shareMemory: !1,
    level: b,
    chunkSize: c,
    streamFn: function(a) {
        d.push(a)
    }
}).then(function() {
    return utils.concatBytes(d)
})
}), expose("jz.zip.pack", zip.pack), zip.unpack = defun(["buffer", "encoding", "chunkSize"], function(a, b, c) {
return new(a instanceof Blob ? ZipArchiveReaderBlob : ZipArchiveReader)({
    buffer: a,
    encoding: b,
    chunkSize: c
}).init()
}), expose("jz.zip.unpack", zip.unpack);
}).call(this);