
const topNav = [ // nav
    {text: '概述', link: '/' },
    //{text: 'iOS', link: '/ios/' },
    //{text: 'Android', link: '/android/' },
    {text: 'Flutter', link: '/flutter/' },
    {text: '服务端', link: '/server/' },
    {text: '前端', link: '/web/' },
    //{text: '数据库', link: '/database/' },

/*
    {text: '归档', link: '/guide/' },

    { // iOS
        text: 'iOS',
        ariaLabel: 'iOS Menu',
        items: [
            { text: 'iOS核心', link: '/ios/main/' },
            { text: 'Objc', link: '/ios/objc/' },
            { text: 'Swift', link: '/ios/swift/'}
        ]
    },

    { // Server
        text: 'Server',
        items: [
            { 
                text: '-- Java --', 
                items: [
                    { text: 'JDBC', link: '/server/jdbc/' },
                    { text: 'Maven', link: '/server/maven/' },
                    { text: 'Mybatis', link: '/server/mybatis/' }
                ] 
            },
            { 
                text: '-- Spring --', 
                items: [
                    { text: 'Spring', link: '/server/spring1/' },
                    { text: 'SpringMVC', link: '/server/springmvc1/' },
                    { text: 'SpringBoot', link: '/server/springboot1/' }
                ] 
            },
            { 
                text: '-- Node --', 
                items: [ 
                    { text: 'Express', link: '/server/express/' } 
                ] 
            },
            { 
                text: '-- Python --', 
                items: [ 
                    { text: 'Flask', link: '/server/flask/' } 
                ] 
            },
            { 
                text: '-- Other --', 
                items: [ 
                    { text: 'Nginx', link: '/server/nginx/' } 
                ] 
            }
        ]
    },

    { // Web
        text: 'Web',
        ariaLabel: 'Web Menu',
        items: [
            { text: 'Html', link: '/web/html/' },
            { text: 'Css', link: '/web/css/' },
            { text: 'Javascript', link: '/web/js/' },
            { text: 'Vue', link: '/web/vue1/' },
            { text: '微信公众平台', link: '/web/wxpublic1/' }
        ]
    },

    { // Database
        text: 'Database',
        ariaLabel: 'Database Menu',
        items: [
            { text: 'Mysql', link: '/database/mysql/1' },
            { text: 'Mongodb', link: '/database/mongodb/1' },
            { text: 'Redis', link: '/database/redis/1' }
        ]
    },

    { // BigData
        text: 'BigData',
        ariaLabel: 'BigData Menu',
        items: [
            { text: 'Python', link: '/bigdata/python/' },
            { text: 'Spark', link: '/bigdata/spark/' }
        ]
    }
*/
];



const sidebar = {
/*
    '/guide/': [
        { // ios
            title: 'iOS',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                ['/ios/objc/', '【Objc知识归纳】'],
                ['/ios/swift/', '【Swift知识归纳】'],
                ['/ios/module/', '【iOS 组件化】'],
                ['/ios/ble/', '【iOS BLE技术】'],
                // ['/ios/objc/', 'Objectice-C'] // 如果使用这种方式定义title，就不能在README文件中使用title
            ]
        },
        { // server
            title: 'Server',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/server/jdbc/',
                '/server/maven/',
                '/server/mybatis/',
                '/server/spring1/',
                '/server/springmvc1/',
                '/server/springboot1/',
                '/server/express/',
                '/server/flask/'
            ]
        },
        { // web
            title: 'Web',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/web/html/',
                '/web/css/',
                '/web/js/',
                '/web/vue1/',
                '/web/vue2/',
                '/web/vue3/',
                '/web/wxpublic1/',
                '/web/wxpublic2/'
            ]
        },
        { // database
            title: 'Database',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/database/mysql1/',
                '/database/mysql2/',
                '/database/mongodb/',
                '/database/redis/'
            ]
        },
        // { // bigdata
        //     title: 'BigData',
        //     collapsable: true,
        //     sidebarDepth: 1,
        //     children: [
        //         '/bigdata/python/',
        //         '/bigdata/spark/',
        //     ]
        // }
    ],
*/
    '/ios/': [
        {
            title: 'iOS基础',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                // ['/ios/main/', '【开篇】'],
                '/ios/main/1-runtime/',
                '/ios/main/2-runloop/',
                '/ios/main/3-thread/',
                '/ios/main/4-block/',
                '/ios/main/5-kvc-kvo/',
                '/ios/main/6-arc/',
                '/ios/main/7-instrument/',
                '/ios/main/8-copy/',
                '/ios/main/9-llvm/',
                '/ios/main/10-module/',
                '/ios/main/11-ble/',
            ]
        },
        {
            title: 'OC学习',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                ['/ios/objc/', '【开篇】'],
            ]
        },
        {
            title: 'Swift学习',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                ['/ios/swift/', '【开篇】'],
                // '/ios/swift/',
            ]
        }
    ],
    '/android/': [
        {
            title: 'Android基础',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/android/base/1-helloworld/',
            ]
        },
        {
            title: '第一行代码（第2版）',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/android/main/1-android/',
                '/android/main/2-activity/',
            ]
        }
    ],
    '/flutter/': [
        {
            title: 'Dart学习',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/flutter/dart/1-dart/',
                '/flutter/dart/2-var-final-const/',
                '/flutter/dart/3-type/',
                '/flutter/dart/4-operator/',
                '/flutter/dart/5-loop/',
                '/flutter/dart/6-list-set-map/',
                '/flutter/dart/7-func/',
                '/flutter/dart/8-class/',
                '/flutter/dart/9-super/',
                '/flutter/dart/10-abstract/',
                '/flutter/dart/11-genericity/',
                '/flutter/dart/12-lib/',
            ]
        },
        {
            title: 'Flutter学习',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/flutter/flutter/1-run/',
                '/flutter/flutter/2-custom-widget/',
                '/flutter/flutter/3-materialapp-scaffold/',
                '/flutter/flutter/4-container-text/',
                '/flutter/flutter/5-image/',
                '/flutter/flutter/6-listview/',
                '/flutter/flutter/7-gridview/',
                '/flutter/flutter/8-padding-row-column/',
                '/flutter/flutter/9-stack-align-positioned/',
                '/flutter/flutter/10-aspectratio-card-button-wrap/',
                '/flutter/flutter/11-statefulwidget/',
                '/flutter/flutter/12-bottomtabbar/',
                '/flutter/flutter/13-router-normal/',
                '/flutter/flutter/14-appbar/',
                '/flutter/flutter/15-drawer/',
                '/flutter/flutter/16-button/',
                '/flutter/flutter/17-form/',
                '/flutter/flutter/18-provider/',
            ]
        },
        {
            title: 'Flutter Bloc架构学习',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/flutter/bloc/1-bloc-counter-demo/',
            ]
        }
    ],
    '/server/': [
        {
            title: 'JDBC',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/server/jdbc/',
            ]
        },
        {
            title: 'Maven',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/server/maven/',
            ]
        },
        {
            title: 'MyBatis',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/server/mybatis/'
            ]
        },        
        {
            title: 'Nginx',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/server/nginx/',
            ]
        },
        // {
        //     title: 'SpringMVC',
        //     collapsable: true,
        //     sidebarDepth: 1,
        //     children: [
        //         '/server/springmvc1/'
        //     ]
        // },
        // {
        //     title: 'SpringBoot',
        //     collapsable: true,
        //     sidebarDepth: 1,
        //     children: [
        //         '/server/springboot1/'
        //     ]
        // },
        // {
        //     title: 'Spring',
        //     collapsable: true,
        //     sidebarDepth: 1,
        //     children: [
        //         '/server/spring1/'
        //     ]
        // },
        // {
        //     title: 'Express',
        //     collapsable: true,
        //     sidebarDepth: 1,
        //     children: [
        //         '/server/express/',
        //         // '/server/koa/',
        //     ]
        // },
        // {
        //     title: 'Flask',
        //     collapsable: true,
        //     sidebarDepth: 1,
        //     children: [
        //         '/server/flask/',
        //         // '/server/django/',
        //     ]
        // },
        
    ],
    '/web/': [
        // {
        //     title: 'Html',
        //     collapsable: true,
        //     sidebarDepth: 1,
        //     children: [
        //         '/web/html/'
        //     ]
        // },
        // {
        //     title: 'CSS',
        //     collapsable: true,
        //     sidebarDepth: 1,
        //     children: [
        //         '/web/css/'
        //     ]
        // },
        // {
        //     title: 'Javascript',
        //     collapsable: true,
        //     sidebarDepth: 1,
        //     children: [
        //         '/web/js/'
        //     ]
        // },
        {
            title: 'Vue',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/web/vue/vue1/',
                '/web/vue/vue2/',
                '/web/vue/vue3/'
            ]
        },
        {
            title: '微信公众平台',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/web/wxpublic/wxpublic1/',
                '/web/wxpublic/wxpublic2/'
            ]
        }
    ],
    '/database/': [
        {
            title: 'Mysql',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/database/mysql/1',
                '/database/mysql/2'
            ]
        },
        {
            title: 'MongoDB',
            collapsable: true,
            sidebarDepth: 1,
            children: [
                '/database/mongodb/1'
            ]
        },
        // {
        //     title: 'Redis',
        //     collapsable: true,
        //     sidebarDepth: 1,
        //     children: [
        //         '/database/redis/1'
        //     ]
        // }
    ],    
};




module.exports = {
  title: 'Funky\'s blog',
  description: 'Funky的个人技术博客',
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  base: '/funkyblog/', // 这是部署到github相关的配置
  markdown: {
    lineNumbers: false, // 代码块显示行号
    extractHeaders: [ 'h2', 'h3', 'h4' ] // 提取出的标题级别
  },
  themeConfig: {
    nav: topNav,
    // sidebar: 'auto', // 侧边栏配置
    sidebarDepth: 2, // 侧边栏显示2级
    logo: '/logo.jpg',
    sidebar: sidebar,
  },
  plugins: [
    ['image'],
    {
        loading: true, // 是否显示loading 默认：true
        loadingSrc: 'http://tangxiaomi.top/markdown-it-image-loading/loading.gif', // loading 图片 src
        loadingWidth: 30, // loading 图片宽度  默认：30
        loadingHeight: 30, // loading 图片高度 默认：30
        minWidth: 100, // 图片最小宽度
        minHeight: 100, // 图片最小高度
        bgColor: '#000' // 图片背景颜色

        // markdown 单独设置 loading 样式
        // ![](/){loadingSrc=http://tangxiaomi.top/markdown-it-image-loading/loading.gif loadingWidth=50 loadingHeight=50 minWidth=200 minHeight=200  bgColor=#ccc} 
    }
  ]
};