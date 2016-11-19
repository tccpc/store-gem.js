#store-gem.js

本地存储localstorage/sessionstorage的封装,cookie完美解决方案.

## 安装


### npm

```
$ npm install store-gem.js --save
```

## 导入

```javascript
import store from 'store-gem.js';		// ES6 导入
var store = require('store-gem.js');	// CommonJS规范导入
```

## 本地存储APIs

```javascript
var myStore = new store()			//可选参数：sessionStorage和localStorage 默认localStorageq
```
```javascript
myStore.set(key, data,timeouts);	//单个存储字符串数据 timeouts 为过期时间
```
```javascript
myStore.set({key: data, key2: data2},timeouts);	//批量存储多个字符串数据
```
```javascript
myStore.get(key);               	//获取key的字符串数据 没有获取到返回null
```
```javascript
myStore.get();                  	//获取所有key/data
```
```javascript
myStore.get(key1,key2,key3);    	//获取对应{key: data, key2: data2,key3:data3}对象
```
```javascript
myStore.has(key)					//判断key是否存在
```
```javascript
myStore.keys()						//返回所有key的数组
```
```javascript
myStore.remove(key)					//删除key/data
```
```javascript
myStore.remove(key1，key2)			//删除key1/data1,key2/data2
```
```javascript
myStore.clear()						//清空所有key/data
```
```javascript
myStore.clearExpires()				//删除缓存中所有超时值
```
```javascript
myStore.setTimeout(key,timeouts)	//根据key为已存在的（未超时的）缓存值以当前时间为基准设置新的超时时间。
```
```javascript
myStore.add(key, data, timeouts)	//根据key做插入操作，如果key对应的值不存在或者已超时则插入该值，反之什么都不做。
```
```javascript
myStore.replace(key,data,timeouts)	//根据key做插入操作，如果key对应的值存在并且未超时则插入该值，反之什么都不做
```
```javascript
myStore.each(callback);         	//循环遍历，返回false结束遍历
```
```javascript
myStore.length()					//返回缓存中key的数量
```

###Constructor
实例化store
```js
var myStore = new store('localStorage'// [可选] 'localStorage', 'sessionStorage', 默认 'localStorage')
```

### set
向缓存中插入一条或多条数据

插入单条`myStore.set(key, data,timeouts);`
//key [必填]必须要为String类型 data [必填] 支持所有类型
//timeouts [选填] 支持Number和Date类型 Number类型单位为秒数
//默认为 new Date('Fri Dec 31 9999 00:00:00 GMT+0800')   
插入多条`myStore.set({key: data, key2: data2},timeouts);//过期时间相同`  

```js
myStore.set('a0','name1',200)   					//a0 ⇒  name1 过期时间200秒后
```
```javascript
myStore.set('a1','name2')     						//a1 ⇒  name2 过期时间无限大
```
```javascript
myStore.set({'a4':'string',a5:['array1',2]},50);
```
```javascript
//存储两条字符串数据
//	a4⇒'string' 过期时间50秒后
//  a5⇒['array1',2]过期时间50秒后
```

### get
获取key的字符串数据  

`myStore.get()`无参数为获取全部key/data 返回Object对象
`myStore.get(key)`返回对应data
`myStore.get(key1,key2)`返回Object {key1: data1, key2: data2}   

```js
console.log(myStore.get());    		//⇒Object {a0: 'name1', a1: 'name2', a4: 'string', a5: ['array1',2]}
```
```javascript
console.log(myStore.get('a0'));    	//⇒name1
```
```javascript
console.log(myStore.get('a0','a3'));//⇒Object {a0: 'name1', a3: 3}
```

### clear
清空所有key/data  
`myStore.clear()`  

```js
myStore.clear()
```

### remove
删除key包括key的字符串数据
`myStore.remove(key)`
`myStore.remove(key1,key2)`

```js
myStore.remove("a0"); //删除a0
```
```javascript
myStore.remove("a1","a2"); //删除a1,a2
```

### keys
返回所有key的数组  
`myStore.keys()`  

```js
myStore.keys() //⇒["a3", "a4", "a5"]
```

### search
搜索所有key中包含string的key/data 返回object对象

搜索方法 `myStore.search(string)`

```js
myStore.search('key') //⇒ {"key":"keytest","key1":{"a":1},"keyaev":"fff"}
```

### has
判断是否存在返回true/false  
`myStore.has(key)`  

```js
myStore.has("a3"); //⇒true
```

### each
循环遍历，返回false结束遍历

```js
myStore.each(function(key,data){
    console.log(key,data)
    if (key== 3) return false
})
```

### clearExpires
删除缓存中所有通过WebStorageCache存储的超时值

`myStore.clearExpires();`

###setTimeout
根据key为已存在的（未超时的）缓存值以当前时间为基准设置新的超时时间。设置成功返回true失败返回false。

`myStore.setTimeout(key,timeouts);`

```js
myStore.setTimeout("a0",500)//设置过期时间为500秒后
```

###add
根据key做插入操作，如果key对应的值不存在或者已超时则插入该值，反之什么都不做。插入成功返回true失败返回false。

`myStore.add();`

###replace
根据key做替换操作，如果key对应的值存在并且未超时则替换该值，反之什么都不做。替换成功返回true失败返回false。

`myStore.replace();`



## 链式书写

```js
myStore.remove('a0','a2').clear().set('a0','name1',200).set('a1','name2').get('a1')
```

## 兼容

来源：[sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

| 特性 | Chrome | Firefox (Gecko) | Internet Explorer |  Opera  | Safari (WebKit)| iPhone(IOS) | Android | Opera Mobile | Window Phone |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
|localStorage|4+|3.5+| 8+ |10.50+|4+| 3.2+ | 2.1+ | 11+ | 8+ |
|sessionStorage|5+|2+| 8+ |10.50+|4+| 3.2+ | 2.1+ | 11+ | 8+ |


## 本地存储大小

`JSON.stringify(localStorage).length` 当前占用多大容量  

[检测localstore容量上限](https://arty.name/localstorage.html)  
