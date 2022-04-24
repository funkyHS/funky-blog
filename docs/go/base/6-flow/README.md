---
title: 【6.if，for，switch等流程控制相关】
---

[[TOC]]


## 1. if else

在Go语言中，关键字` if `是用于测试某个条件（布尔型或逻辑型）的语句，如果该条件成立，则会执行 if 后由大括号`{}`括起来的代码块，否则就忽略该代码块继续执行后续的代码。

~~~go
// condition 条件表达式或者布尔表达式，执行结果需返回true或false。
// 注意：{ 必须在条件表达式的尾部
if condition {
    // 条件为真执行
}

// 如果存在第二个分支，则可以在上面代码的基础上添加 else 关键字以及另一代码块，这个代码块中的代码只有在条件不满足时才会执行，if 和 else 后的两个代码块是相互独立的分支，只能执行其中一个。
// 注意：go语言格式要求很严，else必须写在 } 后面
if condition {
    // 条件为真 执行
} else { 
    // 条件不满足 执行
}

// 如果存在第三个分支，则可以使用下面这种三个独立分支的形式
if condition1 {
    // condition1 满足 执行
} else if condition2 {
    // condition1 不满足 condition2满足 执行
} else {
    // condition1和condition2都不满足 执行
}
~~~


### if语句特殊写法

- if 还有一种特殊的写法，可以在 if 表达式之前添加一个执行语句，再根据变量值进行判断，代码如下：
~~~go
// 这种写法可以将返回值与判断放在一行进行处理，而且返回值的作用范围被限制在 if、else 语句组合中。
if a := 10; a >5 {
    fmt.Println(a)
    return
}
~~~



## 2. for

- go语言中的循环语句只支持 for 关键字，这个其他语言是不同的。
~~~go
// 第一种写法：i := 0; 赋初值，i<10 循环条件 如果为真就继续执行 ；i++ 后置执行 执行后继续循环
sum := 0
for i := 0; i < 10; i++ {
    sum += i
}

// 第二种写法：for不写条件，表示死循环
sum := 0
for {
    sum++
    if sum > 100 {
        //break是跳出循环
        break
    }
}

// 第三种写法
n := 10
for n>0 {
    n--
    fmt.Println(n)
}
~~~

- 初值可以省略
~~~go
// 初值可以省略，但是;必须有，但是这样写step的作用域就比较大了，脱离了for循环
step := 2
for ; step > 0; step-- {
    fmt.Println(step)
}

// 简化代码，将 if 判断整合到 for 中，变为下面的代码：
step := 2
for step > 0 {
    step--
    fmt.Println(step)
}
~~~



### return
~~~go
step := 2
for step > 0 {
    step--
    fmt.Println(step)
    // 执行一次就结束了
    return
}
//不会执行
fmt.Println("结束之后的语句....")
~~~

### break
~~~go
step := 2
for step > 0 {
    step--
    fmt.Println(step)
    //跳出循环,还会继续执行循环外的语句
    break
}
//会执行
fmt.Println("结束之后的语句....")
~~~

   

### painc
~~~go
step := 2
for step > 0 {
    step--
    fmt.Println(step)
    //报错了，直接结束
    panic("出错了")
}
//不会执行
fmt.Println("结束之后的语句....")		
~~~

   

### goto
~~~go
package main
import "fmt"
func main() {
    for x := 0; x < 10; x++ {
        for y := 0; y < 10; y++ {
            if y == 2 {
                // 跳转到标签
                goto breakHere
            }
        }
    }
    // 手动返回, 避免执行进入标签
    return

    // 标签
breakHere:
    fmt.Println("done")
}
~~~







## 3. for range

- for range 结构是Go语言特有的一种的迭代结构，for range 可以遍历数组、切片、字符串、map 及管道（channel）
~~~go
// val 始终为集合中对应索引的 值拷贝，因此它一般只具有只读性质，对它所做的任何修改都不会影响到集合中原有的值
for key, val := range coll {
    ...
}
~~~

- 遍历map
~~~go
m := map[string]int{
    "hello": 100,
    "world": 200,
}
for key, value := range m {
    fmt.Println(key, value)
}
~~~

- 遍历字符串
~~~go
str := "你好！世界"
// 因为一个字符串是 Unicode 编码的字符（或称之为 rune ）集合
// char 实际类型是 rune 类型
for pos, char := range str {
    fmt.Println(pos,char)
}
~~~

- 每个 rune 字符和索引在 for range 循环中是一一对应的，它能够自动根据 UTF-8 规则识别 Unicode 编码的字符。
- 通过 for range 遍历的返回值有一定的规律：
    - 数组、切片、字符串返回索引和值。
    - map 返回键和值。
    - channel只返回管道内的值。



## 4. switch

- switch 语句用于基于不同条件执行不同动作，每一个 case 分支都是唯一的，从上至下逐一测试，直到匹配为止。
- switch 分支表达式可以是任意类型，不限于常量。可省略 break，默认自动终止。

- switch 语句的语法如下：
~~~go
// 变量 var1 可以是任何类型，而 val1 和 val2 则可以是 同类型的任意值
// 类型不被局限于常量或整数，但必须是相同的类型；或者最终结果为相同类型的表达式。
switch var1 {
    case val1:
        ...
    case val2:
        ...
    default:
        ...
}
~~~


- 可以同时测试多个可能符合条件的值，使用逗号分割它们，例如：case val1, val2, val3。
~~~go
/* 定义局部变量 */
var grade string = "B"
var score int = 90
switch score {
    case 90: grade = "A"
    case 80: grade = "B"
    case 50,60,70 : grade = "C"
    default: grade = "D"
}

// swtich后面如果没有条件表达式，则会对true进行匹配
switch {
    case grade == "A" :
        fmt.Printf("优秀!\n" )
    case grade == "B", grade == "C" :
        fmt.Printf("良好\n" )
    case grade == "D" :
        fmt.Printf("及格\n" )
    case grade == "F":
        fmt.Printf("不及格\n" )
    default:
        fmt.Printf("差\n" )
}
fmt.Printf("你的等级是 %s\n", grade )
~~~

- Go里面switch默认相当于每个case最后带有break，匹配成功后不会自动向下执行其他case，而是跳出整个switch
- 使用fallthrough，可以使执行完一个case之后，进入下一个case而不是跳出swtich
- 加了fallthrough后，会直接运行【紧跟的后一个】case或default语句，不论条件是否满足都会执行
~~~go
var s = "hello"
switch {
case s == "hello":
    fmt.Println("hello")
    fallthrough
case s == "world":
    fmt.Println("world")
}
// 打印 hello world
~~~



## 5. goto

- goto 语句通过标签进行代码间的无条件跳转，同时 goto 语句在快速跳出循环、避免重复退出上也有一定的帮助，使用 goto 语句能简化一些代码的实现过程。
- 使用 goto 退出多层循环

- 传统写法：
~~~go
package main
import "fmt"
func main() {
    var breakAgain bool
    // 外循环
    for x := 0; x < 10; x++ {
        // 内循环
        for y := 0; y < 10; y++ {
            // 满足某个条件时, 退出循环
            if y == 2 {
                // 设置退出标记
                breakAgain = true
                // 退出本次循环
                break
            }
        }
        // 根据标记, 还需要退出一次循环
        if breakAgain {
                break
        }
    }
    fmt.Println("done")
}
~~~

- 使用goto的写法：使用 goto 语句后，无须额外的变量就可以快速退出所有的循环
~~~go
package main
import "fmt"
func main() {
    for x := 0; x < 10; x++ {
        for y := 0; y < 10; y++ {
            if y == 2 {
                // 跳转到标签
                goto breakHere
            }
        }
    }
    // 手动返回, 避免执行进入标签
    return
    // 标签
breakHere:
    fmt.Println("done")
}
~~~


- 使用 goto 集中处理错误，多处错误处理 `存在代码重复` 例如：
~~~go
package main
import (
	"errors"
	"fmt"
	"os"
)
func main() {
	err := firstCheckError()
	if err != nil {
		fmt.Println(err)
		exitProcess()
	}
	err = secondCheckError()
	if err != nil {
		fmt.Println(err)
		exitProcess()
	}
	fmt.Println("done")
}
func secondCheckError() interface{} {
	return errors.New("错误2")
}
func exitProcess() {
	//退出
	os.Exit(1)
}
func firstCheckError() interface{} {
	return errors.New("错误1")
}
~~~

- 使用goto：
~~~go
package main
import (
	"errors"
	"fmt"
	"os"
)

func main() {
	err := firstCheckError()
	if err != nil {
		fmt.Println(err)
		goto onExit
	}
	err = secondCheckError()
	if err != nil {
		fmt.Println(err)
		goto onExit
	}
	fmt.Println("done")
	return
	onExit:
		exitProcess()
}
func secondCheckError() interface{} {
	return errors.New("错误2")
}
func exitProcess() {
	fmt.Println("exit")
	//退出
	os.Exit(1)
}
func firstCheckError() interface{} {
	return errors.New("错误1")
}
~~~



## 6. break

- break 语句可以结束 for、switch 和 select 的代码块，另外 break 语句还可以在语句后面添加`标签`，表示退出某个标签对应的代码块，`标签`要求必须定义在对应的 `for`、`switch` 和 `select `的代码块上。
~~~go
package main
import "fmt"
func main() {
OuterLoop:
    for i := 0; i < 2; i++ {
        for j := 0; j < 5; j++ {
            switch j {
            case 2:
                fmt.Println(i, j)
                // 直接跳出整个代码块
                break OuterLoop
            case 3:
                fmt.Println(i, j)
                break OuterLoop
            }
        }
    }
}
~~~

 


## 7. continue
- continue 语句可以结束当前循环，开始下一次的循环迭代过程，仅限在 for 循环内使用，在 continue 语句后添加`标签`时，表示开始`标签对应的循环`
~~~go
package main
import "fmt"
func main() {
OuterLoop:
    for i := 0; i < 2; i++ {
        for j := 0; j < 5; j++ {
            switch j {
            case 2:
                fmt.Println(i, j)
                continue OuterLoop
            }
        }
    }
}
~~~





## 参考
- [Go基础教程-码神之路](https://www.bilibili.com/video/BV1SS4y1T7kJ)