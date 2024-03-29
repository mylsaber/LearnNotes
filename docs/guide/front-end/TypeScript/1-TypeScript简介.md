# 1 什么是TypeScript
全称为Typed JavaScript at Any Scale。是添加了类型系统的 JavaScript，适用于任何规模的项目。

- TypeScript 是添加了类型系统的 JavaScript，适用于任何规模的项目。
- TypeScript 是一门静态类型、弱类型的语言。
- TypeScript 是完全兼容 JavaScript 的，它不会修改 JavaScript 运行时的特性。
- TypeScript 可以编译为 JavaScript，然后运行在浏览器、Node.js 等任何能运行 JavaScript 的环境中。
- TypeScript 拥有很多编译选项，类型检查的严格程度由你决定。
- TypeScript 可以和 JavaScript 共存，这意味着 JavaScript 项目能够渐进式的迁移到 TypeScript。
- TypeScript 增强了编辑器（IDE）的功能，提供了代码补全、接口提示、跳转到定义、代码重构等能力。
- TypeScript 拥有活跃的社区，大多数常用的第三方库都提供了类型声明。
- TypeScript 与标准同步发展，符合最新的 ECMAScript 标准（stage 3）。
# 2 安装TypeScript
TypeScript的命令行工具安装方法如下：
```shell
npm install -g typescript
```
以上命令会在全局环境下安装`tsc`命令，安装完成后，我们就可以在任何地方执行`tsc`命令了。
编译一个TypeScript文件：
```shell
tsc hello.ts 
```
约定使用TypeScript编写的文件以`.ts`为后缀，用TypeScript编写React时，以`.tsx`为后缀。
