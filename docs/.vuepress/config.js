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
        {text: '归档', link: '/guide/' },
        { // iOS
            text: 'iOS',
            ariaLabel: 'iOS Menu',
            items: [
                { text: 'Objc', link: '/ios/objc/' },
                { text: 'Swift', link: '/ios/swift/'},
                { text: '组件化', link: '/ios/module/' },
                { text: 'BLE', link: '/ios/ble/' }
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
                        { text: 'Mybatis', link: '/server/mybatis/' },
                        { text: 'SpringBoot', link: '/server/springboot/' }
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
                { text: 'Vue.js', link: '/web/vue/' }
            ]
        },
        { // Database
            text: 'Database',
            ariaLabel: 'Database Menu',
            items: [
                { text: 'Mysql', link: '/database/mysql/' },
                { text: 'Mongodb', link: '/database/mongodb/' },
                { text: 'Redis', link: '/database/redis/' }
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
    ],
    // sidebar: 'auto', // 侧边栏配置
    sidebarDepth: 2, // 侧边栏显示2级
    logo: '/logo.jpg',
    sidebar: {
        '/guide/': [
            { // ios
                title: 'iOS',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    ['/ios/objc/', '第一部分：Objc知识归纳'],
                    ['/ios/swift/', '第二部分：Swift知识归纳'],
                    ['/ios/module/', '第三部分：iOS组件化'],
                    ['/ios/ble/', '第四部分：iOS BLE技术'],
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
                    '/server/springboot/',
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
                    '/web/vue/'
                ]
            },
            { // database
                title: 'Database',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/database/mysql/',
                    '/database/mongodb/',
                    '/database/redis/'
                ]
            },
            { // bigdata
                title: 'BigData',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/bigdata/python/',
                    '/bigdata/spark/',
                ]
            }
        ],
        '/ios/': [
            {
                title: '第一部分：Objc知识归纳',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    ['/ios/objc/', '【学习资料】'],
                    '/ios/objc/base/1',
                    '/ios/objc/base/2',
                    '/ios/objc/base/3'
                ]
            },
            {
                title: '第二部分：Swift知识归纳',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    ['/ios/swift/', '【学习资料】'],
                    '/ios/swift/base/1',
                    '/ios/swift/base/2',
                    '/ios/swift/base/3'
                ]
            },
            {
                title: '第三部分：iOS组件化',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    ['/ios/module/', '【学习资料】'],
                    '/ios/module/1',
                    '/ios/module/2',
                    '/ios/module/3'
                ]
            },
            {
                title: '第四部分：iOS BLE技术',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    ['/ios/ble/', '【学习资料】'],
                    '/ios/ble/1',
                    '/ios/ble/2',
                    '/ios/ble/3'
                ]
            }
        ],
            
    
    }
  }
};