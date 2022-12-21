module.exports = {
    title: "迪",
    description: "迪的文档",
    head: [
        ["link", {rel: "icon", href: "/logo.jpg"}]
    ],
    themeConfig: {
        logo: "/logo.jpg",
        nav: [
            {text: "Home", link: "/"},
            {text: "后端", link: "/guide/back-end/java/java集合"},
            {text: "前端", link: "/guide/前端/JavaScript/ES6"},
            {text: "其他", link: "/guide/other/docker/Docker"},
            {text: "百度", link: "https://www.baidu.com", target: "_blank"},
            {
                text: "语言",
                ariaLabel: "Language Menu",
                items: [
                    {text: "中文", link: "/language/chinese"},
                    {text: "English", link: "/language/english"}
                ]
            }
        ],
        sidebar: [
            {
                title: '后端',
                collapsable: false,
                children: [
                    {
                        title: '设计模式',
                        collapsable: false,
                        children: [
                            ["/guide/back-end/design-mode/创建型模式.md", "创建型模式"],
                        ]
                    },
                    {
                        title: 'Mybatis',
                        collapsable: false,
                        children: [
                            ["/guide/back-end/Mybatis/Mybatis.md", "Mybatis"],
                            ["/guide/back-end/Mybatis/mybatis1-基本使用.md", "mybatis-基本使用"],
                            ["/guide/back-end/Mybatis/mybatis2-插件原理-责任链模式.md", "mybatis-插件原理"],
                            ["/guide/back-end/Mybatis/mybatis3-多数据源.md", "mybatis-多数据源"],
                        ]
                    },
                ]
            },
            {
                title: '其他',
                collapsable: false,
                children: [
                    {
                        title: 'Docker',
                        collapsable: false,
                        children: [
                            ["/guide/other/docker/Docker", "Docker"],
                            ["/guide/other/docker/docker-compose", "Docker-compose"],
                            ["/guide/other/docker/docker-swarm", "Docker-swarm"],
                        ]
                    },
                    {
                        title: 'Kubernetes',
                        collapsable: false,
                        children: [
                            ["/guide/other/Kubernetes/1.Kubernetes部署", "1.Kubernetes部署"],
                            ["/guide/other/Kubernetes/2-Kubernetes资源管理方式", "2.Kubernetes资源管理方式"],
                            ["/guide/other/Kubernetes/3-Kubernetes的对象", "3.Kubernetes的对象"],
                            ["/guide/other/Kubernetes/4-Kubernetes的Pod", "4.Kubernetes的Pod"],
                            ["/guide/other/Kubernetes/5-Kubernetes的控制器", "5.Kubernetes的控制器"],
                            ["/guide/other/Kubernetes/6-Kubernetes的Service", "6.Kubernetes的Service"],
                            ["/guide/other/Kubernetes/7-Kubernetes的数据存储", "7.Kubernetes的数据存储"],
                        ]
                    },
                    {
                        title: 'Linux',
                        collapsable: false,
                        children: [
                            ["/guide/other/Linux/Linux", "Linux"],
                            ["/guide/other/Linux/Linux基础", "Linux基础"],
                            ["/guide/other/Linux/Shell脚本", "Shell脚本"],
                        ]
                    },
                    {
                        title: '项目管理',
                        collapsable: false,
                        children: [
                            ["/guide/other/project-manage/git", "Git"],
                            ["/guide/other/project-manage/maven", "Maven"],
                        ]
                    }
                ]
            },
        ],
        sidebarDepth: 2
    }
};