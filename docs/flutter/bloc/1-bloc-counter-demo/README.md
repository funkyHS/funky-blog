---
title: 1. Bloc基础-实现加减计数器
---

[[TOC]]




## 1. 为什么要用bloc
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/bloc/1/1.png" width="400"/>
- 三层分离
  - UI：表现层（Presentation)
  - bloc：业务逻辑（Business Logic)
  - data：数据层（Data)
    - 数据源/库（Repository)
    - 数据提供者（Data Provider)



## 2. 安装bloc vscode插件
- 有代码提示，并且可以快速生成代码
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/bloc/1/2.png" width="400"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/bloc/1/3.png" width="300"/>

## 3. 创建项目

- 新建flutter项目 bloc_counter_demo
- 创建`lib/counter/counter_page.dart`页面
- 创建bloc文件夹
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/bloc/1/4.png" width="300"/>
- 导入依赖
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/flutter/bloc/1/5.png" width="300"/>
```yaml
bloc: ^6.1.0
flutter_bloc: ^6.1.0
equatable: ^1.2.5  # 用来做类比较 ==
```



## 4. 编写bloc
- `/counter/bloc/counter_event.dart`

```dart
part of 'counter_bloc.dart';

@immutable
abstract class CounterEvent extends Equatable {
  // 实现抽象类Equatable中的方法
  @override
  List<Object?> get props => [];
}

// 事件 - 加法操作
class CounterIncrementEvent extends CounterEvent {}

// 事件 - 减法操作
class CounterSubductionEvent extends CounterEvent {}
```

- `/counter/bloc/counter_state.dart`
```dart
part of 'counter_bloc.dart';

@immutable
abstract class CounterState extends Equatable{
  final int value;

  // 构造函数
  const CounterState(this.value);

  // 实现抽象类Equatable中的方法
  @override
  List<Object> get props => [value];
}

// 初始的状态 
class CounterInitial extends CounterState {
  CounterInitial(int value) : super(value);
}

// 值发生变化的状态 
class CounterChange extends CounterState {
  CounterChange(int value) : super(value);
}
```

- `/counter/bloc/counter_bloc.dart`
```dart
import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

part 'counter_event.dart';
part 'counter_state.dart';

class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(CounterInitial(0));

  // 计数的值，累加或者累减
  int counterNum = 0;

  // 接收到事件，转成状态
  @override
  Stream<CounterState> mapEventToState(CounterEvent event,) async* {
    if (event is CounterIncrementEvent) {
      yield* _mapIncrementEventToState(event);
    }
  }

  // 加法
  Stream<CounterState> _mapIncrementEventToState(CounterIncrementEvent event) async* {
    this.counterNum += 1;
    yield CounterChange(this.counterNum);
  }

  // 减法
  Stream<CounterState> _mapSubductionEventToState(CounterSubductionEvent event) async* {
    this.counterNum -= 1;
    yield CounterChange(this.counterNum);
  }
}
```

## 5. 编写view
- `/counter/counter_page.dart`
```dart
import 'package:bloc_counter_demo/counter/bloc/counter_bloc.dart';
import 'package:bloc_counter_demo/counter/counter_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CounterPage extends StatelessWidget {
  const CounterPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      // 1. BlocProvider
      child: BlocProvider(
        create: (context) => CounterBloc(),
        child: CounterView(),
      ),
    );
  }
}
```

- `/counter/counter_page.dart`
```dart
import 'package:bloc_counter_demo/counter/bloc/counter_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CounterView extends StatelessWidget {
  const CounterView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("计数器")),
      body: Center(
        child: Column(
          children: [
            // 2. BlocBuilder
            BlocBuilder<CounterBloc, CounterState>(
              builder: (context, state) {
                return Text("${state.value}");
              },
            ),
            ElevatedButton(
              child: Text("加法"),
              onPressed: () {
                // 3. BlocProvider.of
                BlocProvider.of<CounterBloc>(context)
                  .add(CounterIncrementEvent());
              },
            ),
            ElevatedButton(
              child: Text("减法"),
              onPressed: () {
                // 3. BlocProvider.of
                BlocProvider.of<CounterBloc>(context)
                  .add(CounterSubductionEvent());
              },
            )
          ],
        ),
      ),
    );
  }
}
```



## 参考
- [Flutter Bloc 01 - 快速上手 计算器 - 猫哥](https://www.bilibili.com/video/BV1ef4y1e79o)