# 远古时代的前端开发

很早之前的前端开发，并不是独立的，都必须依附于某一个后端框架，例如 ASP, JSP 以及最火的 PHP.

此时的前端，仅仅是后端 MVC 中的一个 VIEW 层，且只是 VIEW 层的一部分。一般，会使用一个渲染引擎，通过模板产生 HTML 给到浏览器，后端在模板内进行插值，而前端在模板内直接写 JS/CSS，或者嵌入 SCRIPT/STYLE 标签。

即使是外联 JS 脚本，几乎也是一个页面写一个 JS，一个 CSS. 代码之间的复用，也只能通过一个个 JS 脚本，并注意顺序，在依赖脚本之前引入。

当完成开发后，再手动通过 FTP 上传到服务器特定的静态目录。

以上，是最原始、简单粗暴的前端开发模式，这其中暴露了很多问题：

- 代码的低效复用
- 代码手动压缩优化
- 静态资源的引用与优化
- 冲突与污染
- 与后端强耦合，互相依赖，互相影响
- 代码的管理，版本的发布与管理
- 部署与维护
- 等等...

当然，慢慢地，前端出现了很多的工具和框架，解决了以上一些问题，但几乎都是针对特定问题的单一解决方案，并不是一个完整通用的前端解决方案，即后来所谓的“前端工程化”。

首先，node 的出现，是一个划时代的标志，它不仅仅为前端带来了前后端分离的可能性，也为前端开发人员赋能，基于 node 开发了大量的前端工具。不再局限于，很多的自动化，脚本处理需要通过后端去实现。

慢慢地，越来越多的优秀工具开始出现，爆发。前端开发的地位，开始提高，不再是“切图仔”了。

罗列一些在前端工程化发展过程中的工具：

- bower
- grunt
- gulp
- fis
- requirejs (AMD)
- seajs (CMD)
- browserify
- babel
- webpack
- rollup
- snowpack, vite
- esbuild, swc
- eslint, stylelint
- mocha, jest

> 有些工具已经消失在历史长河中了