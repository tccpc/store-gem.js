/**
 * Created by Tccpc on 2016/9/22.
 *
 *https://github.com/tccpc/store-gem.js
 */
 (function(f) {
     if (typeof exports === "object" && typeof module !== "undefined") {
         module.exports = f();
     } else if (typeof define === "function" && define.amd) {
         define([], f);
     } else {
         var g;
         if (typeof window !== "undefined") {
             g = window;
         } else if (typeof global !== "undefined") {
             g = global;
         } else if (typeof self !== "undefined") {
             g = self;
         } else {
             g = this;
         }
         g.store = f();
     }
 })(function() {
     var win = (typeof window != 'undefined' ? window : global);
     function checkString(key) {
         if (typeof key !== 'string') {
             console.warn(key + ' used as a key, but it is not a string.');
             key = String(key);
         }
         return key;
     }
     function serialize(val) {
         return val === undefined || typeof val === "function" ? val + "" : JSON.stringify(val);
     }
     function deserialize(val) {
         if (typeof val !== "string") {
             return undefined;
         }
         try {
             return JSON.parse(val);
         } catch (e) {
             return val || undefined
         }
     }
     function isJSON(obj) {
         return typeof obj === "object" && typeof obj === Object.prototype.toString.call(obj).slice(8,-1).toLowerCase() && !obj.length;
     }
     function createTimeouts(timeouts){
         timeouts = timeouts || new Date('Fri Dec 31 9999 00:00:00 GMT+0800');
         if(timeouts instanceof Date) return timeouts.getTime();
         times = new Date();
         times.setSeconds(times.getSeconds()+timeouts);
        return times.getTime();

     }
     function store(storeName){
        var storage = win[storeName] || win.localStorage;
        this.set = function(key,val,timeouts){
            if(key && isJSON(key)){
                for (var keyIndex in key) this.set(keyIndex, key[keyIndex],val); //此时的 val = timeouts
            }else if(key){
                key = checkString(key);
                val = val || null;
                timeouts = createTimeouts(timeouts);
                var valObj = {
                    value:val,
                    timeouts:timeouts
                }
                storage.setItem(key,serialize(valObj));
                return this
            }else return this
        }
        this.get = function(key){
            this.clearExpires();
            if(!key){
                var returnObj = {}
                this.each(function(key, val) {
                    returnObj[key] = val;
                });
                return returnObj
            }else if(arguments.length>1){
                var returnObj = {}
                for(var index in arguments){
                    returnObj[arguments[index]] = this.get(arguments[index])
                }
                return returnObj
            }else{
                key = checkString(key);
                var valObj = storage.getItem(key);
                if (valObj){
                  return deserialize(valObj).value
                }else{
                  return null
                }
            }
        },
        // Clear all keys
        this.clear = function() {
            storage.clear();
            return this;
        },
        this.remove = function(key) {
            for(var index in arguments){
                storage.removeItem(arguments[index]);
            }
            return this;
        },
        this.has = function(key) {
            this.clearExpires();
            return storage.hasOwnProperty(key);
        },
        this.keys = function() {
            this.clearExpires();
            var arrayKeys = [];
            this.each(function(key, list) {
                arrayKeys.push(key);
            });
            return arrayKeys;
        },
        this.each = function(callback) {
            this.clearExpires();
            for (var i = 0; i < storage.length; i++) {
                var key = storage.key(i);
                if (callback(key, this.get(key)) === false) break;
            }
            return this;
        },
        // Try the best to clean All expires CacheItem.
        this.clearExpires = function() {
            var clearKeys = [];
            for (var i = 0; i < storage.length; i++) {
                var key = storage.key(i);
                var cacheItem = null;
                try {
                    cacheItem = deserialize(storage.getItem(key));
                } catch (e) {}
                if(cacheItem !== null && cacheItem.timeouts !== undefined) {
                    var timeNow = (new Date()).getTime();
                    if(timeNow >= cacheItem.timeouts) {
                        clearKeys.push(key);
                    }
                }
            }
            for (var index in clearKeys){
                storage.removeItem(clearKeys[index])
            }
            return clearKeys;
        },
        this.length = function() {
            return storage.length;
        },
        this.search = function(str) {
            var arr = this.keys(), returnObj = {};
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].indexOf(str) > -1) returnObj[arr[i]] = this.get(arr[i]);
            }
            return returnObj;
        },
        this.setTimeout = function(key,timeouts){
            this.clearExpires();
            key = checkString(key);
            if(this.has(key)){
                timeouts = createTimeouts(timeouts);
                var valObj = {
                    value:this.get(key),
                    timeouts:timeouts
                }
                storage.setItem(key,serialize(valObj));
                return true
            }else{
                return false
            }
        },
        // Add key-value item to memcached, success only when the key is not exists in memcached.
        this.add = function(key,val,timeouts){
            this.clearExpires();
            key = checkString(key);
            if(!this.has(key)){
                timeouts = createTimeouts(timeouts);
                var valObj = {
                    value:val,
                    timeouts:timeouts
                }
                storage.setItem(key,serialize(valObj));
                return true
            }else{
                return false
            }
        },
        this.replace = function(key,val,timeouts){
            this.clearExpires();
            key = checkString(key);
            if(this.has(key)){
                timeouts = createTimeouts(timeouts);
                var valObj = {
                    value:val,
                    timeouts:timeouts
                }
                storage.setItem(key,serialize(valObj));
                return true
            }else{
                return false
            }
        }
    }
     return store
 })
