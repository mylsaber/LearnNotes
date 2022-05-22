# LearnNotes

#### 介绍
java开发常用知识笔记

#### 使用说明

可以使用docsify部署

1. 构建docker镜像

   ```shell
   docker build -f Dockerfile -t docsify/learn-notes:1.0 .
   ```

2. 运行docker镜像

   ```shell
   docker run -it -d -p 3000:3000 --name=learnNotes -v $(pwd):/docs docsify/learn-notes:1.0
   ```
