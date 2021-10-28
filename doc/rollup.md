# 以 Rollup 窥：模块化，打包工具

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

> 注意，这里的导出由 `exports` 挂载，直接变成了 `module.exports`，这样在浏览器环境不就运行不了吗？先留个伏笔，下面会讲到

果然，找不到 `__esModule` 的定义了，那这个标识到底有什么用呢？

可以看下 stackoverflow 这个回答：[What's the purpose of `Object.defineProperty(exports, "__esModule", { value: !0 })`?](https://stackoverflow.com/questions/50943704/whats-the-purpose-of-object-definepropertyexports-esmodule-value-0)

第 6 点，很显然，我们需要将导出的内容进行挂载，不管是在 node 环境，或者浏览器环境全局对象。

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
var MyBundle = (function (exports) {
  'use strict';

  const name$1 = 'a';

  const showName$1 = () => {
    console.log(name$1);
  };

  console.log('I am a.js');

  var a = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$1,
    showName: showName$1
  });

  const name = 'aa';

  const showName = () => {
    console.log(name);
  };

  console.log('I am aa.js');

  var aa = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name,
    showName: showName
  });

  exports.a = a;
  exports.aa = aa;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
```

可以看到，当遇到重名的变量和函数时，rollup 会对变量名进行重写，解决方式简单粗暴、有效。


### 第 3 次探索：循环引用

如果模块之间存在循环引用，例如模块 c 引用了 模块 d，模块 d 又引用了模块 c，我们使用以下代码模拟：

`c.js`

```js
import { name as _name } from './d';

export const name = 'c';

export const showName = () => {
  console.log(_name);
};

console.log('I am c.js');
showName();
```

`d.js`

```js
import { name as _name } from './c';

export const name = 'd';

export const showName = () => {
  console.log(_name);
};

console.log('I am d.js');
showName();
```

改写下 `index.js`

```js
import * as c from './c';
import * as d from './d';

export {
  c,
  d
};
```

很简单，两个模块分别都定义了 `name` 和 `showName` 函数，各自引用对方的 `name`, 并分别在 `showName` 中打印出各自的名字。

按照 `index.js` 的顺序，控制台最终会打印出什么呢？

答案是：

会报错...

```js
Uncaught ReferenceError: Cannot access 'name' before initialization
```

我们分析下，执行 `index.js` 第一行时：`import * as c from './c';` 脚本暂时挂起

`c.js` 会被执行，从上到下，执行第一行：`import { name as _name } from './d';` 脚本暂时挂起

`d.js` 被执行，开始执行 `import { name as _name } from './c';`

由于此时在 `c.js` 中脚本只执行了第一行，并未导出任何变量，所以在 `d.js` 中，这句导入的 `name as _name` 是不存在的；

继续执行，分别导出了 `name` 和函数 `showName`，然后在执行 `console.log('I am d.js', showName());` 时，由于 `_name` 在 `c.js` 暂未导出，因此报错。

当我们使用 rollup 打包时，也明确给出了警告，存在循环引用风险：

```sh
(!) Circular dependency
src\c.js -> src\d.js -> src\c.js
```

想想看，如果我们在 `c.js` 模块的 `name` 导出之后，再引用 `d.js` 是不是就没问题了呢，像这样：

```js
export const name = 'c';
// 挪下位置
import { name as _name } from './d';

export const showName = () => {
  console.log(_name);
};

console.log('I am c.js');
showName()
```

再次执行：

```js
Uncaught ReferenceError: Cannot access 'name' before initialization
```

依然报错... 看了下我们的输出文件内容，发现跟之前打包的一模一样...

为什么呢？

其实是因为 es module 是会进行静态分析的，所有的 import 语句，只能在最外层作用域定义，且无论在哪一行，都会被提到顶部进行解析。所以，即使挪了位置也没用。

不过... commonjs 是可以的！

我们改写下：

```js
const name = 'c';

exports.name = name;

const { name: _name } = require('./d.js');

function showName () {
  console.log(_name);
};

exports.showName = showName;

console.log('I am c.js');
showName();
```

再次执行：
> 在 node 环境执行

```js
I am d.js
undefined // showName() in d.js
I am c.js
d         // showName() in c.js
```

确实可以，没有报错，但为什么在 `d.js` `showName()` 打出的是 undefined 呢？

因为在 commonjs 中，模块得在完整执行后才有导出。

综上，可以看出，不同的模块化方案，在解析和执行代码时，存在一些差异，值得关注，这里可以参考：[ES6-模块与-CommonJS-模块的差异](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)；下面章节，再单独讨论下这个问题。

### 第 4 次探索：我们应该用什么模块化方案写我们的代码，用什么格式输出呢？

我们日常写代码，接触最多的模块化方案，一个是 node 环境下的 commonjs，一个是现代浏览器下的 es module. 至于像 amd, cmd 等已经接触很少，属于历史遗留产物了。

那么，假如我们写应用程序，或者写组件库，写工具库，应该选择哪种模块化方案呢？打包输出时，又该选择哪种输出格式呢？

这里涉及到两个问题：写代码时使用的模块化方案，以及打包时的输出格式。

写代码的时候，其实不管是 commonjs 还是 es module 都可以，但最好统一一种，别在一个文件内，穿插使用两种方式；并且，小心注意两种模块化方案之间的区别即可。

> 当然，还是推荐用 es module, 毕竟 node 新版本也支持 esm 了

打包代码时，输出格式可选就比较多了：`es`, `cjs`, `umd`, `amd`, `iife`, `system`