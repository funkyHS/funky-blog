---
title: 4. Blocks
---

[[TOC]]


## Block的基础用法

### 1 block作用
保存一段代码块

### 2 block声明

    // 返回值(^block变量名)(参数)
    void(^block)()

    // block快捷方式 inline
    返回值类型(^变量名)(参数类型) = ^(参数) {
         <#statements#>
    };

### 3 block定义（三种定义方式）
#### 3.1 格式： ^(参数){ }

    void(^block1)() = ^(){   

    };


#### 3.2 如果没有参数，参数可以隐藏，如果有参数，定义的时候必须要写参数，而且要写参数的变量名

    void(^block2)() = ^{
            
    };
    void(^block3)(int) = ^(int a){
            
    };

#### 3.3 block的返回值可以省略，不管有没有返回值，都可以省略

    int(^block4)() = ^int{
        return 3;
    };

### 4 block类型

    // block类型：int(^block5)(NSString *)
    int(^block5)(NSString *) = ^(NSString *name){
        return 8;
    };

### 5 block调用

    // block类型：int(^block5)(NSString *)
    int(^block5)(NSString *) = ^(NSString *name){
        return 8;
    };
    block5(@"Funky");

-------------------

## Block变量传递

* 如果是局部变量 block 是值传递

        int a1 = 3;

        void(^block1)() = ^{
            NSLog(@"%d",a1); // 此时仍然输出3
        };

        a1 = 5;
        block1();


* 如果是静态变量/全局变量/__block修饰的变量，block是指针传递

        static int a2 = 3;

        void(^block2)() = ^{
            NSLog(@"%d",a1); // 此时输出5
        };

        a2 = 5;
        block2();

-------------------
## Block使用场景

### 1. block保存代码

#### 1.1 在一个方法中定义，在另一个方法调用 （使用较少）

首先我们定义一个block属性
方式一：

#import "ViewController.h"

    // BlockType :类型的别名
    typedef void(^BlockType)();

    @interface ViewController ()

    @property (nonatomic,strong) BlockType block1;

    @end


方式二：


    #import "ViewController.h"

    @interface ViewController ()

    // block怎么声明就怎么定义属性
    @property (nonatomic,strong) void(^block)();

    @end

然后保存代码，在其他方法中使用

    - (void)viewDidLoad {
        [super viewDidLoad];

        void(^block)() = ^{
        NSLog(@"调用block");
        };
        _block = block;

    }
    -(void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
        _block();
    }


#### 1.2 在一个类中定义在另外一个类中调用 （常用）

模仿个人中心的一些使用场景，具体的需求是：在不使用 if else 判断行的情况下，完成点击不同页面的跳转需求！页面我就简单模拟一下,具体写法的优点我就不说了，自己体会吧。。。
![](/images/block/image01.png)

不扯淡，直接上代码。。。

**TableViewController.m文件**

    #import "TableViewController.h"
    #import "CellModel.h"

    @interface TableViewController ()

    @property (nonatomic,strong) NSArray *dataArr;

    @end

    @implementation TableViewController

    - (void)viewDidLoad {
        [super viewDidLoad];

        [self setupModel];
    }

    #pragma mark - 创建模型

    -(void)setupModel {

        CellModel *model1 = [CellModel cellModelWithTitle:@"我的收藏"];
        model1.cellCallBack = ^{
        NSLog(@"我的收藏");
        };

        CellModel *model2 = [CellModel cellModelWithTitle:@"我的回复"];
        model2.cellCallBack = ^{
        NSLog(@"我的回复");
        };

        CellModel *model3 = [CellModel cellModelWithTitle:@"我的订单"];
        model3.cellCallBack = ^{
        NSLog(@"我的订单");

        };

        _dataArr = @[model1,model2,model3];
    }

    #pragma mark - Table view data source


    - (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
        return self.dataArr.count;
    }


    - (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {

        static NSString *cellId = @"cellId";

        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellId];

        if (cell == nil) {
        cell = [[UITableViewCell alloc]initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellId];
        }

        CellModel *model = self.dataArr[indexPath.row];
        cell.textLabel.text = model.title;

        return cell;
    }

    -(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{

        CellModel *model = self.dataArr[indexPath.row];
        model.cellCallBack ? model.cellCallBack():nil;
    }


    @end


**CellModel.h文件**

    @interface CellModel : NSObject

    @property (nonatomic,strong) NSString *title;
    // 定义一个block 用来保存代码
    @property (nonatomic,strong) void(^cellCallBack)();

    +(instancetype)cellModelWithTitle:(NSString *)title;

    @end


**CellModel.m文件**

    @implementation CellModel

    +(instancetype)cellModelWithTitle:(NSString *)title {

        CellModel *model = [[self alloc]init];
        model.title = title;
        return model;
    }

    @end



### 2. block传值

- 传值：（只要可以拿到对方就可以传值）
- 顺传：给需要传值的对象，直接定义属性就能传值
- 逆传：使用代理，block等

场景： 点击vc1屏幕跳转至vc2  在vc2的textField上输入值，点击屏幕后回传给vc1
上代码
**CurrentViewController.m**

    -(void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{

        UIStoryboard *board = [UIStoryboard storyboardWithName: @"Main" bundle: nil];

        NextViewController *vc = [board instantiateViewControllerWithIdentifier: @"NextViewController"];
        vc.view.backgroundColor = [UIColor grayColor];
        vc.callBack = ^(NSString *inputStr){
            NSLog(@"我收到了你的输入-----%@",inputStr);
        };

        [self presentViewController:vc animated:YES completion:nil];

    }


**NextViewController.h**

    @property (nonatomic,strong) void(^callBack)(NSString *inputStr);


**NextViewController.m**

    -(void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
        // textField 是拖出的控件
        self.callBack ? self.callBack(self.textField.text) : nil;
    }



### 3. block当参数使用

什么时候需要把block当作参数使用：做的事情由外界决定，但是什么时候做由内部决定

**HttpTool.m**

    +(void)sendHttpRequestWithToken:(NSString *)token success:(void(^)(NSDictionary *dataDic))success {

        NSDictionary *responseData = @{@"name":@"Funky"};
        if (success) {
            success(responseData);
        }
    }

其他类中调用

    [HttpTool sendHttpRequestWithToken:@"token" success:^(NSDictionary *dataDic) {

        // 获得响应数据
        NSLog(@"%@",dataDic);
    }];



### 4. block当作返回值使用（链式编程）

场景：加法计算器
**CalculatorManager.m**

    -(CalculatorManager* (^)(int value))add {

        return ^(int value) {
            _result += value;

            return self;
        };
    }

**CalculatorManager.h**

    @property (nonatomic,assign) int result;

    -(CalculatorManager* (^)(int))add;

使用

    CalculatorManager *mgr = [[CalculatorManager alloc]init];
    mgr.add(10).add(10);


具体的加法计算器在[这篇文章](http://www.jianshu.com/p/87ef6720a096)有具体的实现


------------------------------------------------------------------------------------
## Block内存管理

block是不是对象？答案：是！官方文档显示如下
![](/images/block/Snip20170604_1.png)

如何判断当前文件是MRC还是ARC？
* dealloc 能否调用super，只有MRC才能调用super
* 能否使用retain，release，如果能用就是MRC


### 1. MRC环境下
MRC没有strong，weak，局部变量对象就是相当于基本数据类型
MRC给成员属性赋值，一定要使用 set 方法，不能直接访问下划线成员属性赋值

    int a = 3
    void(^block)() = ^{
    NSLog(@"%d",a)
    };
    NSLog(@"%@",block);

总结：
* 只要block没有引用外部局部变量，block放在内存的全局区
* 只要block引用了外部的局部变量，block放在栈里面
* block只能使用copy，不能使用retain，因为使用retain，block还是放在栈里面，出了方法会被释放，如何在其他地方调用，会crash

### 2. ARC环境下

总结：
* 只要block没有引用外部局部变量，block放在内存的全局区 (同MRC)
* 只要block引用了外部的局部变量，block放在堆里面 ，ARC环境下外部的局部变量默认都是强指针（不同于MRC）
* block使用strong，最好不要使用copy


------------------------------------------------------------------------------------
## Block循环引用

循环引用：我引用你，你引用我，就会造成循环引用，双方都不会被销毁，导致内存泄漏问题
`block造成循环引用：block会对里面所有强指针变量都强引用一次`

假如在 NextViewController.m 文件中，我定义一个block属性

    @property(nonatomic,strong) void(^block)();

使用：

    /*
    分析：
    NextViewController的对象 有个block属性，指向了_block的内存
    block对象 保存了一段代码！所以block对self这个外部对象变量进行了强引用
    self的指针指向NextViewController的对象
    self 对 block 强引用，block 又对 self 进行了强引用----> 造成循环引用

    */
    _block = ^{
        NSLog(@"%@",self);   // 此时会造成循环引用
    };


解决：将self变成弱指针变量,这样 block 就不会对 self 强引用

    __weak typeof(self) weakSelf = self;
    _block = ^{
        NSLog(@"%@",weakSelf);
    };
    _block();


假如工作中我们需要在 block 里面做耗时的请求操作，如果用 __weak 来修饰，会被释放，可能会出现问题
解决：

    __weak typeof(self) weakSelf = self;
    _block = ^{        
        __strong typeof(weakSelf) strongSelf = weakSelf;

        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            NSLog(@"%@",strongSelf);
        });

    };

    _block();


理解：
- NextViewController对象有一个block属性，指向了 _block对象 ---> self 对block 强引用
- _block 内部使用了 weakSelf 弱指针变量 ------> block对self弱引用
- __strong typeof(weakSelf) strongSelf 是一个局部变量指针，它在一个新的栈里面，它是一个强指针，指向NextViewController对象
- dispatch_after 是由系统管理的block，在这个block中 强引用了strongSelf，strongSelf又指向NextViewController对象
dispatch_after这个block会在10秒以后，系统会自动销毁
- 调用_block,当执行完代码块，strongSelf这个指针会没有了，但是NextViewController对象不会被销毁，因为dispatch_after里面的strongSelf强引用着，当10秒以后dispatch_after block会被销毁，那strongSelf强引用就没有了，此时NextViewController对象就会被销毁，执行dealloc方法

