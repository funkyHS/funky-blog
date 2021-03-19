---
title: 【多线程】
---

[[TOC]]

# 多线程

## 1. 基本概念

### 进程
- 进程是指在系统中正在运行的一个应用程序。每个进程之间是独立的，每个进程均运行在其专用且受保护的内存空间内。



### 线程

- 基本概念: 1个进程要想执行任务，必须得有线程（每1个进程至少要有1条线程），线程是进程的基本执行单元，一个进程（程序）的所有任务都在线程中执行。

- 线程的串行: 1个线程中任务的执行是串行的，如果要在1个线程中执行多个任务，那么只能一个一个地按顺序执行这些任务。也就是说，在同一时间内，1个线程只能执行1个任务。



### 多线程


- 基本概念：即1个进程中可以开启多条线程，每条线程可以并行（同时）执行不同的任务。

- 线程的并行：并行即同时执行。比如同时开启3条线程分别下载3个文件

- 多线程并发执行的原理：在同一时间里，CPU只能处理1条线程，只有1条线程在工作（执行）。多线程并发（同时）执行，其实是CPU快速地在多条线程之间调度（切换），如果CPU调度线程的时间足够快，就造成了多线程并发执行的假象

- 多线程优点：

    - 能适当提高程序的执行效率。

    - 能适当提高资源利用率（CPU、内存利用率）

- 多线程缺点

    - 开启线程需要占用一定的内存空间（默认情况下，主线程占用1M，子线程占用512KB），如果开启大量的线程，会占用大量的内存空间，降低程序的性能。

    - 线程越多，CPU在调度线程上的开销就越大。

    - 程序设计更加复杂：比如线程之间的通信、多线程的数据共享



### 多线程在iOS开发中的应用


- 主线程

    - 一个iOS程序运行后，默认会开启1条线程，称为“主线程”或“UI线程”。

    - 作用：刷新显示UI,处理UI事件。

    - 注意：不要将耗时操作放到主线程中去处理，会卡住线程。



---

## 2. iOS中多线程的实现方案


### pthread

- 特点：一套通用的多线程API、适用于Unix\Linux\Windows等系统、跨平台\可移植、使用难度大

- 线程生命周期：由程序员进行管理



### NSThread

- 特点：使用更加面向对象、简单易用，可直接操作线程对象

- 线程生命周期：由程序员进行管理



### GCD

- 特点：旨在替代NSThread等线程技术、充分利用设备的多核(自动)

- 线程生命周期：自动管理



### NSOperation

- 特点：基于GCD（底层是GCD）、比GCD多了一些更简单实用的功能、使用更加面向对象

- 线程生命周期：自动管理





---



## 3. pthread


- pthread的基本使用（需要包含头文件）

```objc

    //使用pthread创建线程

   pthread_t thread;

    NSString *name = @"wendingding";

    //使用pthread创建线程

    //第一个参数：线程对象地址

    //第二个参数：线程属性

    //第三个参数：指向函数的执行

    //第四个参数：传递给该函数的参数

    pthread_create(&thread, NULL, run, (__bridge void *)(name));

```





---





## 4. NSThread
### NSThread的基本使用
```objc

//第一种创建线程的方式：alloc init.

//特点：需要手动开启线程，可以拿到线程对象进行详细设置

    //创建线程

    /*

     第一个参数：目标对象

     第二个参数：选择器，线程启动要调用哪个方法

     第三个参数：前面方法要接收的参数（最多只能接收一个参数，没有则传nil）

     */

    NSThread *thread = [[NSThread alloc]initWithTarget:self selector:@selector(run:) object:@"wendingding"];

     //启动线程

    [thread start];



//第二种创建线程的方式：分离出一条子线程

//特点：自动启动线程，无法对线程进行更详细的设置

    /*

     第一个参数：线程启动调用的方法

     第二个参数：目标对象

     第三个参数：传递给调用方法的参数

     */

    [NSThread detachNewThreadSelector:@selector(run:) toTarget:self withObject:@"我是分离出来的子线程"];



//第三种创建线程的方式：后台线程

//特点：自动启动线程，无法进行更详细设置

    [self performSelectorInBackground:@selector(run:) withObject:@"我是后台线程"];

```



### 设置线程的属性
```objc

   //设置线程的属性

    //设置线程的名称

    thread.name = @"线程A";



    //设置线程的优先级,注意线程优先级的取值范围为0.0~1.0之间，1.0表示线程的优先级最高,如果不设置该值，那么理想状态下默认为0.5

    thread.threadPriority = 1.0;

```

### 线程的状态
```objc

//线程的各种状态：新建-就绪-运行-阻塞-死亡

//常用的控制线程状态的方法

[NSThread exit];//退出当前线程

[NSThread sleepForTimeInterval:2.0];//阻塞线程

[NSThread sleepUntilDate:[NSDate dateWithTimeIntervalSinceNow:2.0]];//阻塞线程

//注意：线程死了不能复生

```



### 线程安全
- 前提：多个线程访问同一块资源会发生数据安全问题

- 解决方案：加互斥锁

- 相关代码：@synchronized(self){}

- 专业术语-线程同步

- 原子和非原子属性（是否对setter方法加锁）



### 线程间通信
```objc

-(void)touchesBegan:(nonnull NSSet<UITouch *> *)touches withEvent:(nullable UIEvent *)event

{

//    [self download2];

   //开启一条子线程来下载图片

    [NSThread detachNewThreadSelector:@selector(downloadImage) toTarget:self withObject:nil];

}

-(void)downloadImage

{

    //1.确定要下载网络图片的url地址，一个url唯一对应着网络上的一个资源

    NSURL *url = [NSURL URLWithString:@"http://p6.qhimg.com/t01d2954e2799c461ab.jpg"];



    //2.根据url地址下载图片数据到本地（二进制数据

    NSData *data = [NSData dataWithContentsOfURL:url];



    //3.把下载到本地的二进制数据转换成图片

    UIImage *image = [UIImage imageWithData:data];



    //4.回到主线程刷新UI

    //4.1 第一种方式

//    [self performSelectorOnMainThread:@selector(showImage:) withObject:image waitUntilDone:YES];



    //4.2 第二种方式

//    [self.imageView performSelectorOnMainThread:@selector(setImage:) withObject:image waitUntilDone:YES];



    //4.3 第三种方式

    [self.imageView performSelector:@selector(setImage:) onThread:[NSThread mainThread] withObject:image waitUntilDone:YES];

}

```

### 如何计算代码段的执行时间
```objc

//第一种方法

    NSDate *start = [NSDate date];

    //2.根据url地址下载图片数据到本地（二进制数据）

    NSData *data = [NSData dataWithContentsOfURL:url];



    NSDate *end = [NSDate date];

    NSLog(@"第二步操作花费的时间为%f",[end timeIntervalSinceDate:start]);



//第二种方法

    CFTimeInterval start = CFAbsoluteTimeGetCurrent();

    NSData *data = [NSData dataWithContentsOfURL:url];



    CFTimeInterval end = CFAbsoluteTimeGetCurrent();

    NSLog(@"第二步操作花费的时间为%f",end - start);

```





## 5. GCD

### GCD基本知识
- 两个核心概念-队列和任务

- 同步函数和异步函数



### GCD基本使用【重点】
- 异步函数+并发队列：开启多条线程，并发执行任务

- 异步函数+串行队列：开启一条线程，串行执行任务

- 同步函数+并发队列：不开线程，串行执行任务

- 同步函数+串行队列：不开线程，串行执行任务

- 异步函数+主队列：不开线程，在主线程中串行执行任务

- 同步函数+主队列：不开线程，串行执行任务（注意死锁发生）

- 注意同步函数和异步函数在执行顺序上面的差异



### GCD线程间通信
```objc

 //0.获取一个全局的队列

    dispatch_queue_t queue = dispatch_get_global_queue(0, 0);



    //1.先开启一个线程，把下载图片的操作放在子线程中处理

    dispatch_async(queue, ^{



       //2.下载图片

        NSURL *url = [NSURL URLWithString:@"http://h.hiphotos.baidu.com/zhidao/pic/item/6a63f6246b600c3320b14bb3184c510fd8f9a185.jpg"];

        NSData *data = [NSData dataWithContentsOfURL:url];

        UIImage *image = [UIImage imageWithData:data];



        NSLog(@"下载操作所在的线程--%@",[NSThread currentThread]);



        //3.回到主线程刷新UI

        dispatch_async(dispatch_get_main_queue(), ^{

           self.imageView.image = image;

           //打印查看当前线程

            NSLog(@"刷新UI---%@",[NSThread currentThread]);

        });

   });

```



### GCD其它常用函数
```objc



    // 栅栏函数（控制任务的执行顺序）

    dispatch_barrier_async(queue, ^{

        NSLog(@"--dispatch_barrier_async-");

    });



    // 延迟执行（延迟·控制在哪个线程执行）

      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2.0 * NSEC_PER_SEC)), dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{

        NSLog(@"---%@",[NSThread currentThread]);

    });



    // 一次性代码（注意不能放到懒加载）

    -(void)once

    {

        //整个程序运行过程中只会执行一次

        //onceToken用来记录该部分的代码是否被执行过

        static dispatch_once_t onceToken;

        dispatch_once(&onceToken, ^{

           NSLog(@"-----");

        });

    }



    // 快速迭代（开多个线程并发完成迭代操作）

    dispatch_apply(subpaths.count, queue, ^(size_t index) {

    });



    // 队列组（同栅栏函数）

    //创建队列组

    dispatch_group_t group = dispatch_group_create();

    //队列组中的任务执行完毕之后，执行该函数

    dispatch_group_notify(dispatch_group_t group,

dispatch_queue_t queue,

dispatch_block_t block);

```



### 关于GCD中的创建和释放
- 在iOS6.0之前，在GCD中每当使用带creat单词的函数创建对象之后，都应该对其进行一次release操作。在iOS6.0之后，GCD被纳入到了ARC的内存管理机制中，在使用GCD的时候我们就像对待普通OC对象一样对待GCD,因此不再需要我们调用release方法。

- GCD中设置队列的优先级

    - 使用create函数创建出来的队列不论是串行队列还是并发队列，其执行任务线程的优先级都是默认优先级。

    - 可以通过set_target_queue来变更队列的优先级。第一个参数传通过creat创建出来的队列，后面一个参数传指定了优先级的全局并发队列。第一个参数如果传主队列或者全局并发队列的话，那么执行结果是未知的。



- 暂停和恢复：GCD中的队列也是可以暂停和恢复的，直接把相应的队列作为参数就传递就可以。使用 dispatch_resume(queue1);和dispatch_suspend(queue1);

- GCD中可以不使用block而使用函数。

- 在NSOperation中关于main方法的调用问题：先调用start方法，在start方法内部会调用main方法。可以通过代码来进行验证。



- 参考资料：https://developer.apple.com/library/ios/documentation/Performance/Reference/GCD_libdispatch_Ref/index.html#//apple_ref/c/func/dispatch_queue_create




## 6. NSOperation
### NSOperation基本使用


- 相关概念：NSOperation是对GCD的包装，两个核心概念【队列+操作】

- 基本使用

    - NSOperation本身是抽象类，只能只有它的子类

    - 三个子类分别是：NSBlockOperation、NSInvocationOperation以及自定义继承自NSOperation的类

    - NSOperation和NSOperationQueue结合使用实现多线程并发

- NSInvocationOperation

```objc

//  01 NSInvocationOperation

    //1.封装操作

    /*

     第一个参数：目标对象

     第二个参数：该操作要调用的方法，最多接受一个参数

     第三个参数：调用方法传递的参数，如果方法不接受参数，那么该值传nil

     */

    NSInvocationOperation *operation = [[NSInvocationOperation alloc]

                                        initWithTarget:self selector:@selector(run) object:nil];



    //2.启动操作

    [operation start];

```



- NSBlockOperation

```objc

    //1.封装操作

    /*

     NSBlockOperation提供了一个类方法，在该类方法中封装操作

     */

    NSBlockOperation *operation = [NSBlockOperation blockOperationWithBlock:^{

        //在主线程中执行

        NSLog(@"---download1--%@",[NSThread currentThread]);

    }];



    //2.追加操作，追加的操作在子线程中执行

    [operation addExecutionBlock:^{

        NSLog(@"---download2--%@",[NSThread currentThread]);

    }];



    [operation addExecutionBlock:^{

         NSLog(@"---download3--%@",[NSThread currentThread]);

    }];



    //3.启动执行操作

    [operation start];

```



- 自定义NSOperation

```objc

    //如何封装操作？

    //自定义的NSOperation,通过重写内部的main方法实现封装操作

    -(void)main

    {

        NSLog(@"--main--%@",[NSThread currentThread]);

    }



    //如何使用？

    //1.实例化一个自定义操作对象

    XMGOperation *op = [[XMGOperation alloc]init];



    //2.执行操作

    [op start];

```


### NSOperationQueue基本使用


- NSOperation中的两种队列

    - 主队列 通过mainQueue获得，凡是放到主队列中的任务都将在主线程执行

    - 非主队列 直接alloc init出来的队列。非主队列同时具备了并发和串行的功能，通过设置最大并发数属性来控制任务是并发执行还是串行执行



- 自定义NSOperation

```objc

-(void)customOperation

{

    //1.创建队列

    NSOperationQueue *queue = [[NSOperationQueue alloc]init];



    //2.封装操作

    //好处：1.信息隐蔽、2.代码复用

   XMGOperation *op1 = [[XMGOperation alloc]init];

    XMGOperation *op2 = [[XMGOperation alloc]init];



    //3.添加操作到队列中

    [queue addOperation:op1];

    [queue addOperation:op2];

}

```



- NSBlockOperation

```objc

- (void)block

{

    //1.创建队列

    NSOperationQueue *queue = [[NSOperationQueue alloc]init];



    //2.封装操作

    NSBlockOperation *op1 = [NSBlockOperation blockOperationWithBlock:^{

        NSLog(@"1----%@",[NSThread currentThread]);

    }];



    NSBlockOperation *op2 = [NSBlockOperation blockOperationWithBlock:^{

        NSLog(@"2----%@",[NSThread currentThread]);

   }];



    [op2 addExecutionBlock:^{

        NSLog(@"3----%@",[NSThread currentThread]);

    }];



    [op2 addExecutionBlock:^{

        NSLog(@"4----%@",[NSThread currentThread]);

    }];



    //3.添加操作到队列中

    [queue addOperation:op1];

    [queue addOperation:op2];



    //补充：简便方法

    [queue addOperationWithBlock:^{

        NSLog(@"5----%@",[NSThread currentThread]);

    }];

}

```



- NSInvocationOperation

```objc

- (void)invocation

{

    /*

     GCD中的队列：

     串行队列：自己创建的，主队列

     并发队列：自己创建的，全局并发队列



     NSOperationQueue

     主队列：[NSOperationQueue mainqueue];凡事放在主队列中的操作都在主线程中执行

     非主队列：[[NSOperationQueue alloc]init]，并发和串行，默认是并发执行的

     */



    //1.创建队列

    NSOperationQueue *queue = [[NSOperationQueue alloc]init];



    //2.封装操作

    NSInvocationOperation *op1 = [[NSInvocationOperation alloc]initWithTarget:self selector:@selector(download1) object:nil];

   NSInvocationOperation *op2 = [[NSInvocationOperation alloc]initWithTarget:self selector:@selector(download2) object:nil];

  NSInvocationOperation *op3 = [[NSInvocationOperation alloc]initWithTarget:self selector:@selector(download3) object:nil];



    //3.把封装好的操作添加到队列中

    [queue addOperation:op1];//[op1 start]

    [queue addOperation:op2];

    [queue addOperation:op3];

}

```



### NSOperation其它用法


- 设置最大并发数【控制任务并发和串行】

```objc

//1.创建队列

    NSOperationQueue *queue = [[NSOperationQueue alloc]init];



    //2.设置最大并发数

    //注意点：该属性需要在任务添加到队列中之前进行设置

    //该属性控制队列是串行执行还是并发执行

    //如果最大并发数等于1，那么该队列是串行的，如果大于1那么是并行的

    //系统的最大并发数有个默认的值，为-1，如果该属性设置为0，那么不会执行任何任务

    queue.maxConcurrentOperationCount = 2;

```



- 暂停和恢复以及取消

```objc

    //设置暂停和恢复

    //suspended设置为YES表示暂停，suspended设置为NO表示恢复

    //暂停表示不继续执行队列中的下一个任务，暂停操作是可以恢复的

    if (self.queue.isSuspended) {

        self.queue.suspended = NO;

    }else

    {

        self.queue.suspended = YES;

    }



    //取消队列里面的所有操作

    //取消之后，当前正在执行的操作的下一个操作将不再执行，而且永远都不在执行，就像后面的所有任务都从队列里面移除了一样

    //取消操作是不可以恢复的

    [self.queue cancelAllOperations];



---------自定义NSOperation取消操作--------------------------

-(void)main

{

    //耗时操作1

    for (int i = 0; i<1000; i++) {

        NSLog(@"任务1-%d--%@",i,[NSThread currentThread]);

    }

    NSLog(@"+++++++++++++++++++++++++++++++++");



    //苹果官方建议，每当执行完一次耗时操作之后，就查看一下当前队列是否为取消状态，如果是，那么就直接退出

    //好处是可以提高程序的性能

    if (self.isCancelled) {

        return;

    }



    //耗时操作2

    for (int i = 0; i<1000; i++) {

        NSLog(@"任务1-%d--%@",i,[NSThread currentThread]);

    }



    NSLog(@"+++++++++++++++++++++++++++++++++");

}

```



### NSOperation实现线程间通信


- 开子线程下载图片

```objc

 //1.创建队列

    NSOperationQueue *queue = [[NSOperationQueue alloc]init];



    //2.使用简便方法封装操作并添加到队列中

    [queue addOperationWithBlock:^{



        //3.在该block中下载图片

        NSURL *url = [NSURL URLWithString:@"http://news.51sheyuan.com/uploads/allimg/111001/133442IB-2.jpg"];

        NSData *data = [NSData dataWithContentsOfURL:url];

        UIImage *image = [UIImage imageWithData:data];

        NSLog(@"下载图片操作--%@",[NSThread currentThread]);



        //4.回到主线程刷新UI

        [[NSOperationQueue mainQueue] addOperationWithBlock:^{

            self.imageView.image = image;

            NSLog(@"刷新UI操作---%@",[NSThread currentThread]);

        }];

    }];



```



- 下载多张图片合成综合案例（设置操作依赖）

```objc

//02 综合案例

- (void)download2

{

    NSLog(@"----");

    //1.创建队列

    NSOperationQueue *queue = [[NSOperationQueue alloc]init];



    //2.封装操作下载图片1

    NSBlockOperation *op1 = [NSBlockOperation blockOperationWithBlock:^{



        NSURL *url = [NSURL URLWithString:@"http://h.hiphotos.baidu.com/zhidao/pic/item/6a63f6246b600c3320b14bb3184c510fd8f9a185.jpg"];

        NSData *data = [NSData dataWithContentsOfURL:url];



        //拿到图片数据

        self.image1 = [UIImage imageWithData:data];

    }];





    //3.封装操作下载图片2

    NSBlockOperation *op2 = [NSBlockOperation blockOperationWithBlock:^{

        NSURL *url = [NSURL URLWithString:@"http://pic.58pic.com/58pic/13/87/82/27Q58PICYje_1024.jpg"];

        NSData *data = [NSData dataWithContentsOfURL:url];



        //拿到图片数据

        self.image2 = [UIImage imageWithData:data];

    }];



    //4.合成图片

    NSBlockOperation *combine = [NSBlockOperation blockOperationWithBlock:^{

        //4.1 开启图形上下文
        UIGraphicsBeginImageContext(CGSizeMake(200, 200));

        //4.2 画image1
        [self.image1 drawInRect:CGRectMake(0, 0, 200, 100)];

        //4.3 画image2
        [self.image2 drawInRect:CGRectMake(0, 100, 200, 100)];

        //4.4 根据图形上下文拿到图片数据
        UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
//        NSLog(@"%@",image);

        //4.5 关闭图形上下文
        UIGraphicsEndImageContext();

        //7.回到主线程刷新UI
        [[NSOperationQueue mainQueue]addOperationWithBlock:^{
            self.imageView.image = image;
            NSLog(@"刷新UI---%@",[NSThread currentThread]);
        }];

    }];



    //5.设置操作依赖
    [combine addDependency:op1];
    [combine addDependency:op2];



    //6.添加操作到队列中执行
    [queue addOperation:op1];
    [queue addOperation:op2];
    [queue addOperation:combine];

    }

```




