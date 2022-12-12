# LearnNotes

#### 介绍
java开发常用知识笔记

#### 使用说明

部署到Nginx
1. 先编译项目，把编译结果推送到github上
    ```shell
    npm run docs:build
    ```

2. 删除以前docker镜像

    ```shell
    docker rmi vuepress/learn-notes:latest
    ```

3. 构建docker镜像

   ```shell
   docker build -f Dockerfile -t vuepress/learn-notes .
   ```

4. 运行docker镜像

   ```shell
   docker run --rm -it -d -p 80:80 --name=learn-notes -v $(pwd)/docs/.vuepress/dist:/usr/share/nginx/html vuepress/learn-notes
   ```
