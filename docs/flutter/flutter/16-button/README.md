---
title: 16. Button按钮组件
---

[[TOC]]



## 1. Flutter 中按钮组件

- Flutter1.x 中常见的按钮有
  - RaisedButton 凸起的按钮 -----> ElevatedButton（Flutter2.x）
  - FlatButton 扁平化按钮   -----> TextButton（Flutter2.x）
  - OutlineButton 线框按钮  -----> OutlinedButton（Flutter2.x）
  - IconButton 图标按钮
  - ButtonBar 按钮组
  - FloatingActionButton 浮动按钮


## 2. 各种按钮组件
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/16/1.png" width="300"/>


- 在`ButtonDemo.dart`组件中
```dart
import 'package:flutter/material.dart';

class ButtonPage extends StatelessWidget {
  const ButtonPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("按钮演示页面"),
        actions: [
          // 12. 图标按钮 IconButton
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text("============== Flutter 1.x =============="),
          SizedBox(height: 10),

          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // 1. 普通按钮
              RaisedButton(
                  child: Text("普通按钮"),
                  onPressed: () {
                    print("普通按钮");
                  }),
              SizedBox(width: 5),

              // 2. 普通有颜色按钮
              RaisedButton(
                  child: Text("有颜色按钮"),
                  color: Colors.blue,
                  textColor: Colors.white,
                  onPressed: () {
                    print("普通有颜色按钮");
                  }),
              SizedBox(width: 5),

              // 3. 有阴影的按钮
              RaisedButton(
                  child: Text("有阴影按钮"),
                  color: Colors.blue,
                  textColor: Colors.white,
                  elevation: 20,
                  onPressed: () {
                    print("有阴影按钮");
                  }),
              SizedBox(width: 5),

              // 4.按钮前加图标
              RaisedButton.icon(
                icon: Icon(Icons.search),
                label: Text("图标按钮"),
                color: Colors.blue,
                textColor: Colors.white,
                onPressed: null, // 点击禁用
              ),
            ],
          ),
          SizedBox(height: 10),

          // 5. 设置按钮宽度高度
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                height: 50,
                width: 200,
                child: RaisedButton(
                  child: Text("设置按钮宽度高度"),
                  color: Colors.blue,
                  textColor: Colors.white,
                  elevation: 20,
                  onPressed: () {
                    print("设置按钮宽度高度");
                  },
                ),
              ),
            ],
          ),
          SizedBox(height: 10),

          // 6. 自适应按钮
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Expanded(
                child: Container(
                  height: 40,
                  margin: EdgeInsets.all(10),
                  child: RaisedButton(
                    child: Text("自适应按钮"),
                    color: Colors.blue,
                    textColor: Colors.white,
                    elevation: 20,
                    onPressed: () {
                      print("自适应按钮");
                    },
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 10),

          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // 7. 圆角按钮
              RaisedButton(
                child: Text("圆角按钮"),
                color: Colors.blue,
                textColor: Colors.white,
                // 配置圆角
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                onPressed: () {
                  print("圆角按钮");
                },
              ),

              // 8. 圆形按钮
              Container(
                height: 80,
                child: RaisedButton(
                  child: Text("圆形按钮"),
                  color: Colors.blue,
                  textColor: Colors.white,
                  // 长按，水波纹效果
                  splashColor: Colors.red,
                  // 圆形按钮
                  shape: CircleBorder(
                    side: BorderSide(
                      color: Colors.white,
                    ),
                  ),
                  onPressed: () {
                    print("圆形按钮");
                  },
                ),
              ),

              // 9. 扁平化按钮
              FlatButton(
                  onPressed: () {},
                  color: Colors.blue,
                  textColor: Colors.yellow,
                  child: Text("扁平化按钮")),
              SizedBox(width: 5),

              // 10. 线框按钮
              OutlineButton(
                onPressed: () {},
                // color: Colors.red, // 背景修改不了，没有效果
                textColor: Colors.yellow,
                child: Text("线框按钮"),
              ),
            ],
          ),
          SizedBox(height: 5),

          // 11. 线框按钮 注册
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Expanded(
                child: Container(
                  margin: EdgeInsets.all(10),
                  height: 50,
                  child: OutlineButton(
                    onPressed: () {},
                    child: Text("注册"),
                  ),
                ),
              )
            ],
          ),

          // 13. 按钮组 可以同时调整按钮位置
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              ButtonBar(
                children: [
                  RaisedButton(
                    child: Text("aaa"),
                    color: Colors.blue,
                    textColor: Colors.white,
                    onPressed: () {},
                  ),
                  RaisedButton(
                    child: Text("bbb"),
                    color: Colors.blue,
                    textColor: Colors.white,
                    onPressed: () {},
                  ),

                  // 14. 自定义按钮组件
                  MyButton(
                      text: "自定义按钮",
                      height: 60.0,
                      width: 100.0,
                      pressed: () {
                        print("自定义按钮");
                      }),
                ],
              )
            ],
          ),

          Text("============== Flutter 2.x =============="),
          SizedBox(height: 10),

          Row(
            children: [
              // 15. 普通按钮 默认就有背景颜色 等于 RaisedButton
              ElevatedButton(
                  child: Text("普通按钮"),
                  onPressed: () {
                    print("普通按钮");
                  }),
              SizedBox(width: 5),

              // 16. 有颜色按钮
              ElevatedButton(
                  child: Text("有颜色和阴影的按钮"),
                  style: ButtonStyle(
                      // 按钮背景颜色
                      backgroundColor: MaterialStateProperty.all(Colors.red),
                      // 按钮字体颜色
                      foregroundColor: MaterialStateProperty.all(Colors.white),
                      // 按钮阴影效果
                      elevation: MaterialStateProperty.all(50)),
                  onPressed: () {
                    print("普通按钮");
                  }),
              SizedBox(width: 5),

              // 17. 按钮前加图标
              ElevatedButton.icon(
                icon: Icon(Icons.search),
                label: Text("图标按钮"),
                onPressed: null, // 点击禁用
              ),
            ],
          ),
          SizedBox(width: 5),

          // 18. 设置按钮宽度高度
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                height: 50,
                width: 200,
                child: ElevatedButton(
                  child: Text("设置按钮宽度高度"),
                  style: ButtonStyle(
                      // 按钮背景颜色
                      backgroundColor: MaterialStateProperty.all(Colors.red),
                      // 按钮字体颜色
                      foregroundColor: MaterialStateProperty.all(Colors.white),
                      // 按钮阴影效果
                      elevation: MaterialStateProperty.all(50)),
                  onPressed: () {
                    print("设置按钮宽度高度");
                  },
                ),
              ),
            ],
          ),
          SizedBox(height: 10),

          // 19. 自适应按钮
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Expanded(
                child: Container(
                  height: 40,
                  margin: EdgeInsets.all(10),
                  child: ElevatedButton(
                    child: Text("自适应按钮"),
                    onPressed: () {
                      print("自适应按钮");
                    },
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 10),

          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // 20. 圆角按钮
              ElevatedButton(
                child: Text("圆角按钮"),
                style: ButtonStyle(
                    // 按钮背景颜色
                    backgroundColor: MaterialStateProperty.all(Colors.red),
                    // 按钮字体颜色
                    foregroundColor: MaterialStateProperty.all(Colors.white),
                    // 按钮阴影效果
                    elevation: MaterialStateProperty.all(50),
                    // 配置圆角
                    shape: MaterialStateProperty.all(RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ))),
                onPressed: () {
                  print("圆角按钮");
                },
              ),

              // 21. 圆形按钮
              Container(
                height: 80,
                child: ElevatedButton(
                  child: Text("圆形按钮"),
                  style: ButtonStyle(
                    // 按钮背景颜色
                    backgroundColor: MaterialStateProperty.all(Colors.red),
                    // 按钮字体颜色
                    foregroundColor: MaterialStateProperty.all(Colors.white),
                    // 按钮阴影效果
                    elevation: MaterialStateProperty.all(50),
                    // 配置圆角
                    shape: MaterialStateProperty.all(
                      CircleBorder(
                        side: BorderSide(
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  onPressed: () {
                    print("圆形按钮");
                  },
                ),
              ),

              // 22. 扁平化按钮
              TextButton(
                  onPressed: () {},
                  child: Text("扁平化按钮"),
                  style: ButtonStyle(foregroundColor: MaterialStateProperty.all(Colors.black)),),
              SizedBox(width: 5),

              // 23. 线框按钮
              OutlinedButton(
                onPressed: () {},
                child: Text("线框按钮"),
                style: ButtonStyle(
                  foregroundColor: MaterialStateProperty.all(Colors.black),
                  // 线框按钮颜色
                  side: MaterialStateProperty.all(BorderSide(width:1, color: Colors.red))
                ),
              ),
            ],
          ),
          SizedBox(height: 5),
        ],
      ),
    );
  }
}

// 14. 自定义按钮组件
class MyButton extends StatelessWidget {
  final text;
  final pressed;
  final double width;
  final double height;
  const MyButton(
      {this.text, this.pressed = null, this.width = 80.0, this.height = 60.0});

  @override
  Widget build(BuildContext context) {
    return Container(
        height: this.height,
        width: this.width,
        child: RaisedButton(child: Text(this.text), onPressed: this.pressed));
  }
}      
```


## 3. FloatingActionButton浮动按钮
```dart
class ButtonPage extends StatelessWidget {
  const ButtonPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("按钮演示页面"),
        actions: [
          // 12. 图标按钮 IconButton
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () {},
          ),
        ],
      ),
      // 浮动按钮
      floatingActionButton: FloatingActionButton(
        child: Icon(
          Icons.add, 
          color: Colors.black, // 浮动按钮图标的颜色
          size: 40, // 浮动按钮中间图标的大小
        ),
        onPressed: (){
          print("FloatingActionButton");
        },
        backgroundColor: Colors.yellow,
      ),
      // 浮动按钮的位置
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}
```

## 4. FloatingActionButton实现类似咸鱼App底部导航中间Item

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/16/2.png" width="300"/>

- 在`Tabs.dart`中实现
```dart
import 'package:flutter/material.dart';

import 'tabs/Home.dart';
import 'tabs/Category.dart';
import 'tabs/Setting.dart';

class Tabs extends StatefulWidget {
  final index;
  Tabs({Key? key, this.index = 0}) : super(key: key);

  @override
  _TabsState createState() => _TabsState(this.index);
}

class _TabsState extends State<Tabs> {

  int _currentIndex = 0;
  List _pageList = [
    HomePage(),
    CategoryPage(),
    SettingPage()
  ];

  _TabsState(index) {
    this._currentIndex = index;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Scaffold(
        // 顶部导航栏
        appBar: AppBar( 
          title: Text('Flutter Demo'),
        ),

        // 底部中间按钮
        floatingActionButton: Container(
          width: 80,
          height: 80,
          padding: EdgeInsets.all(8), // 内边距
          margin: EdgeInsets.only(top: 10), //  上外边距10，将按钮挤下一点
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(40),
            color: Colors.white,
          ),
          
          child: FloatingActionButton(
            child: Icon(Icons.add),
            onPressed: (){
              // 点击跳转到分类页面
              setState(() {
                this._currentIndex = 1;
              });
            },
            // 选中背景变为红色
            backgroundColor: this._currentIndex == 1 ? Colors.red : Colors.yellow,
          ),
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,

        // 内容区
        body: this._pageList[this._currentIndex],

        // 底部tabbar
        bottomNavigationBar: BottomNavigationBar(
          // 当前选中的index
          currentIndex: this._currentIndex,
          // 点击index
          onTap: (int index) {
            setState(() {
              this._currentIndex = index;
            });
          },
          // icon大小
          iconSize: 36.0, 
          // 选中的颜色
          fixedColor: Colors.red, 
          // 配置底部tabs可以有多个按钮，不会被挤压
          type: BottomNavigationBarType.fixed, 
          items: [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: "首页",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.category),
              label: "分类",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.settings),
              label: "设置",
            ),
          ],
        ),
      
        // 左侧侧边栏，直接可以从左边缘滑出
        drawer: Drawer(
          child: Column(
            children: [
              // 使用 Row+Expanded 为了撑满宽度
              Row(
                children: [
                  Expanded(
                    // 1. DrawerHeader 自带的头部区域
                    // child: DrawerHeader(
                    //   child: Text("你好flutter"),
                    //   decoration: BoxDecoration(
                    //     // 头部区域背景改为灰色
                    //     // color: Colors.grey, 
                    //     // 头部区域设置背景图片
                    //     image: DecorationImage(
                    //       image: NetworkImage("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png"),
                    //       fit: BoxFit.cover,
                    //     ),
                    //   ),
                    // ),

                    // 2. UserAccountsDrawerHeader 头部区域
                    child: UserAccountsDrawerHeader(
                      // 账户名称
                      accountName: Text("Funky",style: TextStyle(color: Colors.white),),
                      // 账户邮箱
                      accountEmail: Text("hs1024942667@163.com",style: TextStyle(color: Colors.white),),
                      // 头像
                      currentAccountPicture: CircleAvatar(
                        backgroundImage: NetworkImage("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png"),
                      ),
                      // 装饰
                      decoration: BoxDecoration(
                        // 头部区域背景改为灰色
                        // color: Colors.grey, 
                        // 头部区域设置背景图片
                        image: DecorationImage(
                          image: NetworkImage("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-11-18.png"),
                          fit: BoxFit.cover,
                        ),
                      ),
                      // 右侧组件
                      otherAccountsPictures: [
                        Image.network("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png"),
                        Image.network("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png")
                      ],
                    ),
                  ),
                ],
              ),
              ListTile(
                leading: CircleAvatar(child: Icon(Icons.home),),
                title: Text("我的空间"),
              ),
              Divider(), // 分割线
              ListTile(
                leading: CircleAvatar(child: Icon(Icons.people),),
                title: Text("用户中心"),
                onTap: () {
                  // 先让侧边栏消失
                  Navigator.of(context).pop();
                  // 再跳转到用户中心
                  Navigator.pushNamed(context, "/user");
                },
              ),
              Divider(), // 分割线
              ListTile(
                leading: CircleAvatar(child: Icon(Icons.settings),),
                title: Text("设置中心")
              )
            ],
          ),
        ),

        // 右侧侧边栏，直接可以从右边缘滑出
        endDrawer: Drawer(
          child: Text('你好flutter'),
        ),
      ),
    );
  }
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)