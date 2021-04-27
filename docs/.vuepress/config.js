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
    nav:[ // nav
        {text: '首页', link: '/' },
        // {text: '归档', link: '/guide/' },
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
        // { // BigData
        //     text: 'BigData',
        //     ariaLabel: 'BigData Menu',
        //     items: [
        //         { text: 'Python', link: '/bigdata/python/' },
        //         { text: 'Spark', link: '/bigdata/spark/' }
        //     ]
        // }
    ],
    // sidebar: 'auto', // 侧边栏配置
    sidebarDepth: 2, // 侧边栏显示2级
    logo: '/logo.jpg',
    sidebar: {
        /*'/guide/': [
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
        ],*/
        '/ios/': [
            {
                title: 'iOS核心',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    ['/ios/main/', '【开篇】'],
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
                title: 'Objc知识归纳',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    ['/ios/objc/', '【开篇】'],
                ]
            },
            {
                title: 'Swift知识归纳',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    ['/ios/swift/', '【开篇】'],
                    // '/ios/swift/',
                ]
            }
        ],
        '/server/': [
            {
                title: 'Java Server',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/server/jdbc/',
                    '/server/maven/',
                    '/server/mybatis/'
                ]
            },
            {
                title: 'Spring',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/server/spring1/',
                    '/server/springmvc1/',
                    '/server/springboot1/'
                ]
            },
            {
                title: 'Nodejs Server',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/server/express/',
                    // '/server/koa/',
                ]
            },
            {
                title: 'Python Server',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/server/flask/',
                    // '/server/django/',
                ]
            },
            {
                title: 'Other',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/server/nginx/',
                ]
            }
        ],
        '/web/': [
            {
                title: '第一部分：Html',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/web/html/'
                ]
            },
            {
                title: '第二部分：Css',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/web/css/'
                ]
            },
            {
                title: '第三部分：Javascript',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/web/js/'
                ]
            },
            {
                title: '第四部分：Vue',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/web/vue1/',
                    '/web/vue2/',
                    '/web/vue3/'
                ]
            },
            {
                title: '第五部分：微信公众平台',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/web/wxpublic1/',
                    '/web/wxpublic2/'
                ]
            }
        ],
        '/database/': [
            {
                title: 'Mysql',
                collapsable: false,
                sidebarDepth: 1,
                children: [
                    '/database/mysql/1',
                    '/database/mysql/2'
                ]
            },
            {
                title: 'MongoDB',
                collapsable: false,
                sidebarDepth: 1,
                children: [
                    '/database/mongodb/1'
                ]
            },
            {
                title: 'Redis',
                collapsable: false,
                sidebarDepth: 1,
                children: [
                    '/database/redis/1'
                ]
            }
        ],    
    }
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