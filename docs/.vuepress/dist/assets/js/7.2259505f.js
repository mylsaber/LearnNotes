(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{278:function(a,s,e){"use strict";e.r(s);var t=e(13),r=Object(t.a)({},(function(){var a=this,s=a._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[s("h1",{attrs:{id:"learnnotes"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#learnnotes"}},[a._v("#")]),a._v(" LearnNotes")]),a._v(" "),s("h4",{attrs:{id:"介绍"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#介绍"}},[a._v("#")]),a._v(" 介绍")]),a._v(" "),s("p",[a._v("java开发常用知识笔记")]),a._v(" "),s("h4",{attrs:{id:"使用说明"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#使用说明"}},[a._v("#")]),a._v(" 使用说明")]),a._v(" "),s("p",[a._v("部署到Nginx")]),a._v(" "),s("ol",[s("li",[s("p",[a._v("先编译项目，把编译结果推送到github上")]),a._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("npm")]),a._v(" run docs:build\n")])])])]),a._v(" "),s("li",[s("p",[a._v("删除以前docker镜像")]),a._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("docker")]),a._v(" rmi vuepress/learn-notes:latest\n")])])])]),a._v(" "),s("li",[s("p",[a._v("构建docker镜像")]),a._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("docker")]),a._v(" build "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-f")]),a._v(" Dockerfile "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-t")]),a._v(" vuepress/learn-notes "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v(".")]),a._v("\n")])])])]),a._v(" "),s("li",[s("p",[a._v("运行docker镜像")]),a._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("docker")]),a._v(" run "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--rm")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-it")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-d")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-p")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("80")]),a._v(":80 "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("--name")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v("learn-notes "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-v")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[s("span",{pre:!0,attrs:{class:"token variable"}},[a._v("$(")]),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("pwd")]),s("span",{pre:!0,attrs:{class:"token variable"}},[a._v(")")])]),a._v("/docs/.vuepress/dist:/usr/share/nginx/html vuepress/learn-notes\n")])])])])])])}),[],!1,null,null,null);s.default=r.exports}}]);