# Rollup 由浅入深

## 安装
将 rollup 安装为项目的开发依赖
```js
npm i rollup -D
```

## 开始打包
先创建一个 `rollup.config.js` 并写入以下配置：
```js
export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/iife.js',
      format: 'iife',
      name: 'MyBundle'
    }
  ],
};
```
这个配置告诉 rollup 我们打包入口为 `src/index.js` 并计划输出一个 iife 的文件

创建入口文件 `src/index.js`
> 这个文件经 rollup 打包后会输出什么呢？

```js
export const name = 'a';

export const showName = () => {
  console.log(name);
};

console.log('I am a.js');
```

接着我们将 rollup 打包命令加入到 npm script (package.json)

```json
...
"scripts": {
  "build": "rollup -c ./rollup.config.js"
},
...
```

打开终端，运行 `npm run build` 即可打包我们的脚本了

## 带着疑问学习

### 第一个问题：rollup 会输出什么？
我们只是简单地告诉 rollup 打包入口文件，并输出格式为 iife, 最终 rollup 会怎么处理，输出什么呢？

执行命令后，找到 `dist/iife.js`:

```js
var MyBundle = (function (exports) {
  'use strict';

  const name = 'a';

  const showName = () => {
    console.log(name);
  };

  console.log('I am a.js');

  exports.name = name;
  exports.showName = showName;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
```

可以看到，十分简单，跟我们的源文件差异不大，我们针对这些细微差异一个个看：

1. rollup 把我们的代码用一个立即执行函数（iife）包裹了起来
2. 给函数传递一个空对象，模拟内部的 exports (commonjs)
3. 将我们导出的内容挂载在 exports 对象上
4. 函数顶部声明严格模式（`use strict`）
5. 为 exports 设置一个 `__esModule` 标识
6. 将 exports 返回给我们设置的 `MyBundle` 变量

对于第 1 点，因为我们指定了输出格式为 iife，所以很好理解，那假如我们希望输出格式是 commonjs 可以在 node 环境下运行呢？我们将 `format` 改为 `cjs` 重新打包：

```js
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const name = 'a';

const showName = () => {
  console.log(name);
};

console.log('I am a.js');

exports.name = name;
exports.showName = showName;
```

可以看到，iife 没有了，就是一个简单的 node module

接着，第 2, 3 点，为什么需要构造一个 exports 对象呢？

通常我们写代码，一般是模块化，要么是 commonjs 要么是 es module，不管是哪种，都需要导入/导出变量、函数等。

即使是 iife 的方式，也可以通过 exports 将导出的内容传递给外部变量（`MyBundle`）当然，如果你不需要，`output.name` 也可以不指定

我们试试其他格式输出：

`es`

```js
const name = 'a';

const showName = () => {
  console.log(name);
};

console.log('I am a.js');

export { name, showName };
```
> 朴实无华，你用 es 的方式写，输出输入基本没差别

`umd`

```js
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MyBundle = {}));
})(this, (function (exports) { 'use strict';

  const name = 'a';

  const showName = () => {
    console.log(name);
  };

  console.log('I am a.js');

  exports.name = name;
  exports.showName = showName;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
```
> `umd` 格式因为需要兼容多种运行环境，相对而言会复杂些

第 4 点，默认输出代码运行在严格模式下，如果想去掉这个限制，设置 `output.strict` 为 `false` 即可。

第 5 点，为什么要设置一个 `__esModule` 标识呢，很有意思

其实 `__esModule` 用于标识该输出文件由一个 es module 构建而来，假如我们的代码用 commonjs 的方式去写，是不是这句就不存在了呢？

`a.js` (commonjs)

```js
const name = 'a';

const showName = () => {
  console.log(name);
};

module.exports = {
  name,
  showName
};

console.log('I am a.js');
```

再次打包：

```js
(function () {
  'use strict';

  const name = 'a';

  const showName = () => {
    console.log(name);
  };

  module.exports = {
    name,
    showName
  };

  console.log('I am a.js');

})();
```

> 注意，这里的导出由 `exports` 挂载，直接变成了 `module.exports`，这样在浏览器环境不久运行不了吗？先留个伏笔，下面会讲到

果然，找不到 `__esModule` 的定义了，那这个标识到底有什么用呢？

可以看下 stackoverflow 这个回答：[What's the purpose of `Object.defineProperty(exports, "__esModule", { value: !0 })`?](https://stackoverflow.com/questions/50943704/whats-the-purpose-of-object-definepropertyexports-esmodule-value-0)

第 6 点，很显然，我们需要将导出的内容进行挂载，不管是在 node 环境，或者浏览器环境全局对象

### 第 2 次探索：模块引用
我们使用 es module / commonjs 当然是为了模块化的方式去写代码，当出现模块之间的引用，rollup 是怎么打包和处理的呢？

我们重新改写下我们的入口文件为 `index.js`

```js
import * as a from './a';
import * as aa from './aa';

export {
  a,
  aa,
};
```
简单地，引入 `a` 和 `aa` 两个模块，然后导出

`a.js`

```js
export const name = 'aa';

export const showName = () => {
  console.log(name);
};

console.log('I am a.js');
```

`aa.js`

```js
export const name = 'a';

export const showName = () => {
  console.log(name);
};

console.log('I am aa.js');
```

按照我们的设置，最终代码是会输出在一个文件中的，可是，这里很明显有一个问题：

`a.js` 和 `aa.js` 存在同名的变量和函数，rollup 会怎么处理这个问题的呢？我们直接看输出的代码：

```js
```