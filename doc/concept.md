# 打包工具的一些概念

## tree-shaking

即 "live code inclusion"，源于 rollup 内置提供的一种去除无用代码的方式，但仅限于 es module，因为 esm 可在编译阶段做静态分析；在 ast 树阶段对语句进行标记，则未标记的语句（节点）作为无效代码（枝叶）被移除（摇掉）。反之，对应的移除无效代码的方式是 DCE (dead code elimination)

> Tree-shaking, also known as "live code inclusion", is Rollup's process of eliminating code that is not actually used in a given project. It is a form of dead code elimination but can be much more efficient than other approaches with regard to output size. The name is derived from the abstract syntax tree of the modules (not the module graph). The algorithm first marks all relevant statements and then "shakes the syntax tree" to remove all dead code. It is similar in idea to the mark-and-sweep garbage collection algorithm. Even though this algorithm is not restricted to ES modules, they make it much more efficient as they allow Rollup to treat all modules together as a big abstract syntax tree with shared bindings.

参考：[如何评价 Webpack 2 新引入的 Tree-shaking 代码优化技术？](https://www.zhihu.com/question/41922432)

## live reload

监听文件，在文件发生变化时，重新构建代码，并通知浏览器刷新页面的一种技术手段

## HMR

即 hot module reload，可理解为 live reload 的升级版，更加精确地在文件变动时，通知浏览器仅替换发生变化的模块，无需刷新浏览器，且可以保持页面状态（state）。

参考：[Webpack HMR 原理解析](https://zhuanlan.zhihu.com/p/30669007)

## live bindings

实时绑定，即模块导出的变量变化后，导入该变量的模块依然保持变化，类似于“引用”。ESM 就是这种，但是 CommonJS 不是，CJS 模块导入一个变量，相当于在模块内声明一个同名变量，并复制给它；当导入变量所在模块修改了变量的值，当前模块的同名变量仍然是原始导入值。

## circular references

即模块间发生了循环引用。

## code-splitting

即代码分割。主要目的是为了按需加载代码（dynamic imports），或者减少入口文件的大小。

## preset, polyfill

babel 的转换包含两部分，一部分是 preset，作语法转换；一部分是 polyfill，作 API 转换。
