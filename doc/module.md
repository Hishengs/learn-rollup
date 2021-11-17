# 前端的模块化

模块化：cut into small pieces, bundle into one app.

前端的模块化，一般指的是 Javascript 的模块化；但是 Javascript 语言标准并没有定义模块化；不像其他语言自带模块化支持；

但是，当 Node 出现时，带来了自身的模块化标准：CommonJS.

CommonJS 的出现，使得模块化书写代码成了可能；也带来了 npm 的繁荣生态。

于是，开始有人想着，把 CommonJS 带到浏览器端。但要支持 CommonJS，需要一些 hack 操作，并且与 Node 的本地模块同步 require 不同，浏览器端需要支持模块的异步加载。

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

而且，由于模块都在本地，所以加载会很快；但是浏览器要做到这点，需要先将所有模块下载下来，显然是不现实的（会触发很多请求），因此只能通过异步的方式获取模块；

另一种方式是，将所有的模块都打包在一起，但只执行 entry 模块，其他模块代码只在 require 的时候才执行导出，然后 cache 起来；
这个虽然避免了请求过多，但弊端在于，暂时不需要的模块，也会被打包进去；

所以，最好的方式是：浏览器只加载 entry 模块，然后按需加载其他模块。但就没法像 CommonJS 一样**同步**地去执行代码。

> 可以思考下，现在 webpack 一系列工具是怎么做的。

第一个比较出名的模块化方案是 AMD. 它的代码是这样的：

```js
define(['add', 'mul'] , function (add, mul) {
  add(1, 2);
  mul(2, 1);
});
```

AMD 的加载逻辑是：先显式声明模块的依赖，在模块代码执行前，AMD 会先帮你获取依赖模块，再将依赖模块导出作为参数传递给当前模块，然后执行模块。

在 AMD 的规范下，代码的执行逻辑依旧可以保持同步，和 CommonJS 一样，只是需要提前声明好依赖即可。但也带来了其它问题：

依赖即使最终没使用，也被加载并执行了，不是按需的：

```js
define(['add', 'mul'] , function (add, mul) {
  //可能不会执行
  if (window.xxx) {
    add(1, 2);
  }
  mul(2, 1);
});
```
