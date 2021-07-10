---
title: 17. Flutter中的表单
---

[[TOC]]



## 1. TextField文本框
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/17/1.png" width="300"/>

```dart
// TextField文本框演示
class TextFieldDemo extends StatelessWidget {
  const TextFieldDemo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: [
          // 单行文本框
          TextField(
            decoration: InputDecoration(
              hintText: "请输入搜索的内容",
              // 边框
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(
            height: 20,
          ),

          // 多行文本框
          TextField(
            maxLines: 4,
            decoration: InputDecoration(
              hintText: "多行文本框",
              // 边框
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(
            height: 20,
          ),

          // 密码框
          TextField(
            obscureText: true, // 模糊不清
            decoration: InputDecoration(
              hintText: "密码框",
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(
            height: 20,
          ),

          // 用户名（当输入的时候，会在输入框旁边提示 用户名）
          TextField(
            decoration: InputDecoration(
              labelText: "用户名",
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(
            height: 20,
          ),

          // 密码（当输入的时候，会在输入框旁边提示 密码）
          TextField(
            obscureText: true, // 模糊不清
            decoration: InputDecoration(
              labelText: "密码",
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(
            height: 20,
          ),

          // 输入框前面有图标
          TextField(
            decoration: InputDecoration(
              hintText: "请输入用户名",
              icon: Icon(Icons.people),
            ),
          ),
        ],
      ),
    );
  }
}
```



## 2. 获取TextField文本框输入内容  TextEditingController
```dart
import 'package:flutter/material.dart';

class FormDemoPage extends StatefulWidget {
  const FormDemoPage({Key? key}) : super(key: key);

  @override
  _FormDemoPageState createState() => _FormDemoPageState();
}

class _FormDemoPageState extends State<FormDemoPage> {

  // 初始化的时候给表单赋值
  var _username = new TextEditingController();
  // 初始化的时候不需要给表单赋值
  var _password;

  @override
  void initState() {
    super.initState();
    _username.text = "初始值";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("表单演示页面"),
      ),
      body: Padding(
        padding: EdgeInsets.all(20),
        // 获取TextField文本框输入内容 
        child: Column(
          children: [
            TextField(
              decoration: InputDecoration(
                hintText: "请输入用户名",
              ),
              controller: _username,
              onChanged: (value){
                setState(() {
                  _username.text = value;
                });
              },
            ),
            SizedBox(height: 20),

            TextField(
              obscureText: true,
              decoration: InputDecoration(
                hintText: "密码",
              ),
              onChanged: (value){
                setState(() {
                  this._password = value;
                });
              },
            ),
            SizedBox(height: 20),

            Container(
              width: double.infinity, // 表示宽度是自适应宽度
              height: 40,
              child: ElevatedButton(
                child: Text("获取TextField输入内容"),
                onPressed: () {
                  print(this._username.text);
                  print(this._password);
                }
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 3. Checkbox、CheckboxListTile多选框组件
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/17/2.png" width="300"/>

```dart
class CheckBoxDemo extends StatefulWidget {
  CheckBoxDemo({Key? key}) : super(key: key);

  @override
  _CheckBoxDemoState createState() => _CheckBoxDemoState();
}

class _CheckBoxDemoState extends State<CheckBoxDemo> {

  var flag = true; 

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Row(
          children: [
            Checkbox(
              // 当前是否选中
              value: this.flag,
              onChanged: (v) {
                setState(() {
                  this.flag = v!;
                });
              },
              // 选中的颜色
              activeColor: Colors.red,
            ),
          ],
        ),
        Row(
          children: [
            Text(this.flag ? "选中" : "未选中"),
          ],
        ),

        SizedBox(height: 40),

        CheckboxListTile(
          value: this.flag, 
          onChanged: (v) {
            setState(() {
              this.flag = v!;
            });
          },
          title: Text("标题"),
          subtitle: Text("二级标题"),
        ),
        Divider(),

        CheckboxListTile(
          value: this.flag, 
          onChanged: (v) {
            setState(() {
              this.flag = v!;
            });
          },
          title: Text("标题"),
          subtitle: Text("二级标题"),
          secondary: Icon(Icons.help),
        ),

      ],
    );
  }
}
```

## 4. Radio, RadioListTile, Switch组件
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/flutter/17/3.png" width="300"/>

```dart
class RadioDemo extends StatefulWidget {
  RadioDemo({Key? key}) : super(key: key);

  @override
  _RadioDemoState createState() => _RadioDemoState();
}
class _RadioDemoState extends State<RadioDemo> {
  int sex = 1;
  bool flag = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Text("男："),
            Radio(
              value: 1, 
              groupValue: this.sex, 
              onChanged: (v) {
                setState(() {
                  this.sex = v as int;
                });
              }
            ),
            SizedBox(width: 20),
            Text("女："),
            Radio(
              value: 2, 
              groupValue: this.sex, 
              onChanged: (v) {
                setState(() {
                  this.sex = v as int;
                });
              }
            )
          ],
        ),
        Row(
          children: [
            Text("${this.sex}"),
            Text("${this.sex == 1? "男" : "女"}"),
          ],
        ),
        SizedBox(height:40),


        RadioListTile(
          value: 1, 
          groupValue: this.sex, 
          onChanged: (v) {
            setState(() {
              this.sex = v as int;
            });
          },
          title: Text("标题"),
          subtitle: Text("二级标题"),
          secondary: Icon(Icons.help),
          selected: this.sex == 1,
        ),
        RadioListTile(
          value: 2, 
          groupValue: this.sex, 
          onChanged: (v) {
            setState(() {
              this.sex = v as int;
            });
          },
          title: Text("标题"),
          subtitle: Text("二级标题"),
          secondary: Image.network("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2018-11-10.png"),
          selected: this.sex == 2,
        ),

        SizedBox(height:40),

        Switch(
          value: this.flag, 
          onChanged: (v) {
            setState(() {
              this.flag = v;
            });
          },
        )
      ],
    );
  }
}
```







## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)