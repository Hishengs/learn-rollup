# 入口文件指定

一般来说，一个 npm 包的入口文件按是由 `main` 字段来指定的：

```json
{
  "name": "my-pkg",
  "version": "1.0.0",
  "description": "",
  "main": "cjs.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

譬如以上，指定了 `cjs.js` 作为入口文件

## commonjs 的模块入口寻找逻辑

如果指定了 `main` 则以其作为入口文件解析，如果未指定，则会查找当前目录下的 `index.js`, `index.json` 作为入口文件

## 在 es module 出现之后

在 es module 出现之后，我们的代码可以用两个模块化方式去写，commonjs 或者 esm，此时 npm 新增了一个 `module` 字段，用于指定 esm 模块化下的入口文件。

```json
{
  "name": "my-pkg",
  "version": "1.0.0",
  "description": "",
  "main": "cjs.js",
  "module": "esm.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## 在 node 下引入一个包时

会根据你当前模块的格式，使用不同模块系统的入口文件，譬如当前是普通的 commonjs 模块，则引入 `main` 指定的文件；当前是 esm 则引入 `module` 指定的入口文件。

## 在 webpack

webpack 在 resolve npm 包时，有自己的解析策略，一般查找顺序是：`module` => `main`

如果用户配置了 resolve 顺序，则以用户为准：

```js
module.exports = {
  // 其他配置
  // ...
  resolve: {
    mainFields: ['main', 'module']
  }
}
```

## 在 rollup

rollup 是面向 es module 的，所以核心库不会处理这样的逻辑，默认也不会去处理 npm 包；所以这部分工作是交给了一个插件去处理，也是我们使用 rollup 几乎都会安装的一个插件：[node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve#mainfields)