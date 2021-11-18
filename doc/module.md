# 前端的模块化

模块化：cut into small pieces, bundle into one app.

模块化的意义：复用，可测，易读。

前端的模块化，一般指的是 Javascript 的模块化；但是 Javascript 语言标准（[ECMAScript](https://tc39.es/ecma262/)）并没有定义模块化；不像其他语言自带模块化支持。

但是，当 Node 出现时，带来了自身的模块化标准：CommonJS.

CommonJS 的出现，使得模块化书写代码成了可能；也带来了包管理系统 npm 及其繁荣生态。

于是，开始有人想着，把 CommonJS 带到浏览器端。但在浏览器端要支持 CommonJS，需要一些 hack 操作，并且与 Node 的本地模块同步 require 不同，浏览器端需要支持模块的异步加载。

先思考下，为什么 CommonJS 不能直接在浏览器用，类似这样的代码：

index.js

```js
const add = require('./add.js'); // 同步获取

add(1, 2);
```

add.js

```js
function add (a, b) {
  return a + b;
}

module.exports = add;
```

如上述代码：

CommonJS 的 require 是同步操作，会先加载完模块后，才开始执行接下来的语句；

而且，由于模块都在本地，所以加载会很快；但是浏览器要做到这点，需要先将所有模块下载下来，显然是不现实的（会触发很多请求等），因此只能通过异步的方式获取模块；

另一种方式是，将所有的模块都打包在一起，但只执行 entry 模块，其他模块代码只在 require 的时候才执行导出，然后 cache 起来；
这个虽然避免了请求过多，但弊端在于，暂时不需要的模块，也会被打包进去；

所以，最好的方式是：浏览器只加载 entry 模块，然后按需加载和执行其他模块。但就没法像 CommonJS 一样**同步**地去执行代码。

> 可以思考下，现在 webpack 一系列工具是怎么做的。

## 浏览器的模块化

针对浏览器，第一个比较出名的模块化方案是 AMD. 它的代码是这样的：

```js
define(['add', 'mul'] , function (add, mul) {
  add(1, 2);
  mul(2, 1);
});
```

AMD 的加载逻辑是：需要显式声明模块的依赖，在模块代码执行前，AMD 会先帮你获取依赖模块，再将依赖模块的**导出** (exports) 作为参数传递给当前模块，然后执行模块。

在 AMD 的规范下，代码的执行逻辑依旧可以保持同步，和 CommonJS 一样，只是需要提前声明好依赖即可。但也带来了其它问题：

首先，依赖即使最终没使用，也被加载并执行了，不是按需的，例如

```js
define(['add', 'mul'] , function (add, mul) {
  // 可能不会执行 但是模块 add 还是提前被加载并执行了
  if (window.xxx) {
    add(1, 2);
  }
  mul(2, 1);
});
```

而且，AMD 规范对于有依赖的模块间加载顺序是有要求的。

尽管如此，AMD 还是很受欢迎，特别是在 requirejs 的推广下。

在 AMD 规范之后，国内推出了一个 CMD 规范，解决了 AMD 的一些问题，其模块定义方式是这样的：

```js
define(function(require, exports, module) {
  // 模块代码
});
```

其模块的定义和 CommonJS 几乎一致，同样支持同步执行 require：

```js
define(function(require, exports, module) {
  const add = require('add.js');
  add(1, 2);
  if (window.xx) {
    // 只有条件为真才加载执行
    require('mul.js');
  }
});
```

除了在最外层包裹了一个 define 函数外，其行为和导出方式与 CommonJS 十分接近，并解决了 AMD 规范存在的问题。

不管是 AMD 还是 CMD 规范，都需要在模块定义之前，执行其模块加载器逻辑，并在执行模块前，对模块依赖进行分析；

例如，AMD 通过显式声明依赖，可以在模块执行前，处理（加载并执行，然后缓存）依赖；

而 CMD 选择了另一条路：它会对模块的源码进行静态分析，找出所有的 require 语句，得到模块的依赖列表，提前加载（但不执行）；当执行模块代码时，遇到真正 require 语句再去执行模块得到导出（并缓存）。所以，不被真正 require 的模块是不会被执行的。

还有另外一个经常看到的：UMD，但 UMD 是模块化方案吗？

其实不是的，UMD 只是一个代码输出格式而已。可以理解为，为模块加了一层 wrapper, 然后根据环境进行判断，包装成环境所在模块化系统的模块。其包装代码是这样的：

```js
(function (global, factory) {
  // commonjs
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    // AMD
    : typeof define === 'function' && define.amd
      ? define(['exports'], factory)
      : (global = typeof globalThis !== 'undefined'
        ? globalThis
        : global || self, factory(global.MyLib = {}));
})(this, (function (exports) { 'use strict';

  // 你的模块代码

}));
```

## 参考文章

[从 CommonJS 到 Sea.js](https://github.com/seajs/seajs/issues/269)

[CMD 模块定义规范](https://github.com/seajs/seajs/issues/242)

[前端模块化开发那点历史](https://github.com/seajs/seajs/issues/588)
