# CommonJS 实现原理

## 模块定义

CommonJS 模块定义一般是这样：

```js
const axios = require('axios');

function getUserInfo (id) {
  return axios.get('/user/' + id);
}

// 统一导出
module.exports = {
  getUserInfo
};
// 或者单个导出
exports.getUserInfo = getUserInfo;
```

基本上就是通过 `require` 导入模块，通过 `module.exports` 或者 `exports` 导出模块。

> `exports` 是 `module.exports` 的一个引用，因此，如果已经改变了 `module.exports`，就不要使用 `exports` 导出变量了。反之，直接对 `exports` 重新赋值，会切断二者引用关系，最终无法导出

## 模块查找

CommonJS 模块使用这样的方式导入：

```ts
const xxx = require(ID);
```

模块的标识 ID 可以是一个文件路径 Path（相对/绝对路径），也可以是一个 npm 包名称。当 ID 是 npm 包名时，遵循这样的查询逻辑：

- 在当前的 node_modules 目录下查找该包
  - 存在，查找 package.json 下 main 指定的入口文件，有则加载
    - main 未指定，默认加载 index.js => index.json => index.node 
  - 不存在，下一步
- 往上级目录 node_modules 查找该包，同样遵循上一步逻辑
- 递归向上查找 node_modules，直到全局的 node_modules 目录

> 全局目录可通过 `npm root -g` 查看

> 其实，模块分为 Node 内置的**核心模块**，以及用户的**文件模块**，前者是不需要遵循上述的模块定位的

> 此外，模块一旦被定位到，就会被缓存起来，下一次 require 同样模块时，直接使用缓存。

> require 语句是同步的

## CommonJS 的实现原理

CommonJS 的模块实现较为简单，可以理解为是这么一个外层函数的包裹：

```js
(function (exports, require, module, __filename, __dirname) {
  // 你的模块代码
  const axios = require('axios');

  function getUserInfo (id) {
    return axios.get('/user/' + id);
  }

  module.exports = {
    getUserInfo
  };
});
```

> 通过函数包裹，还达到了作用域隔离的目的

当第一次 require 一个模块时，node 会创建一个类似这样的模块对象 ( `new Module()` ) 传递给上述函数执行

```js
function Module (id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  if (this.parent && this.parent.children) {
    this.parent.children.push(this);
  }
  this.filename = null;
  this.children = [];
  this.load = false;
}
```

执行模块代码并得到模块导出，然后挂载到模块对象的 exports 上，同时缓存该模块：

```js
Module._cache['xxx'] = module;
```

下次 require 直接使用缓存对象，返回其 exports