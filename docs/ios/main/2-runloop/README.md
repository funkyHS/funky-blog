---
title: 2. Runloop
---

[[TOC]]

# Runloop

## 1. 基础知识

### 如果没有RunLoop

### 如果有Runloop


### main函数中的RunLoop

- UIApplicationMain函数内部就启动了一个RunLoop，所以UIApplicationMain函数一直没有返回，保持了程序的持续运行
- 这个默认启动的RunLoop是跟主线程相关联的

### Runloop作用
- 保持程序的持续运行
- 处理app中的各种事件（比如触摸事件、定时器事件【NSTimer】、selector事件【选择器performSelector···】）
- 节省CPU资源，提高程序性能，有事情就做事情，没事情就休息


## 2. RunLoop对象

### iOS中有2套API来访问和使用RunLoop
- Foundation：NSRunLoop
- Core Foundation：CFRunLoopRef
- NSRunLoop和CFRunLoopRef都代表着RunLoop对象，NSRunLoop是基于CFRunLoopRef的一层OC包装，所以要了解RunLoop内部结构，需要多研究CFRunLoopRef层面的API（Core Foundation层面）


## 3. RunLoop与线程
- 每条线程都有唯一的一个与之对应的RunLoop对象
- 如何让子线程不死：给这条子线程开启一个Runloop
- 主线程的RunLoop已经自动创建好了，子线程的RunLoop需要主动创建，如果不主动获取Runloop的话，那么子线程内部是不会创建Runloop的。可以下载CFRunloopRef的源码，搜索_CFRunloopGet0,查看代码
- Runloop的生命周期：RunLoop在第一次获取时创建，在线程结束时销毁
- Runloop对象是利用字典来进行存储，而且key是对应的线程Value为该线程对应的Runloop。


## 4. 获得RunLoop对象
```oc
// Foundation
[NSRunLoop currentRunLoop];  // 获得当前线程的RunLoop对象
[NSRunLoop mainRunLoop];       // 获得主线程的RunLoop对象

// Core Foundation
CFRunLoopGetCurrent();  // 获得当前线程的RunLoop对象
CFRunLoopGetMain();     // 获得主线程的RunLoop对象 
```

## 5. RunLoop相关类
### Core Foundation中关于RunLoop的5个类
    - CFRunLoopRef:它自己,也就代表一个RunLoop对象
    - CFRunLoopModeRef :RunLoop的运行模式
    - CFRunLoopSourceRef :事件源
    - CFRunLoopTimerRef :时间的触发器
    - CFRunLoopObserverRef :观察者 监听CFRunLoopRef的状态改变

### CFRunLoopModeRef
- CFRunLoopModeRef代表RunLoop的运行模式
- 一个 RunLoop 包含若干个 Mode，每个Mode又包含若干个Source/Timer/Observer
- 每次RunLoop启动时，只能指定其中一个 Mode，这个Mode被称作 CurrentMode
- 如果需要切换Mode，只能退出Loop，再重新指定一个Mode进入，这样做主要是为了分隔开不同组的Source/Timer/Observer，让其互不影响
- 系统默认注册了5个Mode模式:
    - `kCFRunLoopDefaultMode`：App的默认Mode，通常主线程是在这个Mode下运行
    - `UITrackingRunLoopMode`：界面跟踪 Mode，用于 ScrollView 追踪触摸滑动，保证界面滑动时不受其他 Mode 影响
    - `UIInitializationRunLoopMode`: 在刚启动 App 时第进入的第一个 Mode，启动完成后就不再使用
    - `GSEventReceiveRunLoopMode`: 接受系统事件的内部 Mode，通常用不到
    - `kCFRunLoopCommonModes`: 这是一个占位用的Mode，不是一种真正的Mode

### CFRunLoopSourceRef
- CFRunLoopSourceRef是事件源（输入源）
- 以前的分法： Port-Based Sources、Custom Input Sources、Cocoa Perform Selector Sources
- 现在的分法：
    - Source0：不基于Port的（用户主动触发的事件）
    - Source1：基于Port的（系统内部的消息事件）
- (Port是线程间通信的一种方式，如果两个线程之间想通信，可以通过Port来通信。)


### CFRunLoopTimerRef
- CFRunLoopTimerRef是基于时间的触发器，基本上说的就是NSTimer

### CFRunLoopObserverRef
- CFRunLoopObserverRef是观察者，能够监听RunLoop的状态改变
- 可以监听的时间点有一下几个：




## 6. RunLoop处理逻辑




## 7. 自动释放池与RunLoop

- `kCFRunLoopEntry;` 即将进入loop，此时创建一个自动释放池
- `kCFRunLoopBeforeWaiting;` 即将进入休眠，此时销毁自动释放池，创建一个新的自动释放池
- `kCFRunLoopExit;`  即将退出loop，此时销毁自动释放池
- 自动释放池的创建和销毁
    - 第一次创建:当runloop启动的时候
    - 最后一次销毁:当runloop退出的时候
    - 其它创建和销毁:当runloop进入到睡觉状态的时候会把之前的自动释放池销毁,重新创建一个新的



## 8. 视频学习记录
- 链接：https://www.bilibili.com/video/BV1Bv411z774?from=search&seid=7583525792558693256

### 为什么点击屏幕会唤醒RunLoop？
- 首先是硬件，把触摸/锁屏/摇晃等事件 通过IOKit.framework，将用户的行为封装成IOHIDEvent，传递给iOS的桌面管理系统SpringBoard，SpringBoard通过跨进程通讯mach port传递给App，App触发Source1回调方法__IOHIDEventSystemClientQueueCallback，通过Source1在触发Source0回调方法_UIApplicationHandleEventQueue，将其包装成UIEvent，最后发送给UIWindow，UIWindow在去分发，最后响应到TouchBegin方法
- mach port其实是跨线程通讯，但是跨进程通讯本质上也是基于mach port，例如iOS上的剪切板
- 通过lldb调试台打断点查看__IOHIDEventSystemClientQueueCallback方法的回调：

- bt可以查看当前调用栈


### 可以唤醒Runloop的事件
- timer
- source，到底是source0唤醒的还是source1唤醒的

- Source0：不能主动触发，先调用CFRunLoopSourceSignal(source)，将这个Source标记为待处理。CFRunLoopWakeUp(runloop)来唤醒Runloop，让其处理这个事件
- Source1：基于mach_port，用于通过内核和其他线程相互发送消息，这种Source能主动唤醒RunLoop的线程

## 9. Runloop的mode是如何切换的？Runloop的mode切换时，上一个mode是需要退出吗？
- UITableView滑动时，Runloop会进行切换mode，由kCFRunLoopDefaultMode切换为UITrackingRunLoopMode，根据源码，切换mode实际是调用CFRunLoopRunSpecific 这个函数
- Runloop的mode切换时，上一个mode会退出



