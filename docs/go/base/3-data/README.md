---
title: 【3.数据类型】
---

[[TOC]]



## 1. 整型
- Go语言同时提供了有符号和无符号的整数类型。
- 有符号整型：int、int8、int64、int32、int64
- 无符号整型：uint、uint8、uint64、uint32、uint64、uintptr
- 有符号整型范围：`-2^(n-1) 到 2^(n-1)-1`
- 无符号整型范围: ` 0 到 2^n-1`
- 用来表示 Unicode 字符的 `rune 类型`和 `int32 类型`是等价的，通常用于表示一个 `Unicode 码点`。这两个名称可以互换使用。同样，`byte` 和 `uint8` 也是等价类型，byte 类型一般用于强调数值是一个`原始的数据`而不是一个小的整数。
- 无符号的整数类型 `uintptr`，它没有指定具体的 bit 大小但是足以容纳指针。uintptr 类型只有在`底层编程`时才需要，特别是Go语言和C语言函数库或操作系统接口相交互的地方。
- 在二进制传输、读写文件的结构描述时，为了保持文件的结构不会受到不同编译目标平台字节长度的影响，不要使用 int 和 uint


## 2. 浮点型
- Go语言支持两种浮点型数：
	- `float32` ： 范围 约1.4e-45 到 约3.4e38
	- `float64` ：范围约4.9e-324 到 约1.8e308
```go
floatNum := 3.2
// .2f 表示保留的小数点位数
fmt.Printf("%.2f\n", floatNum)
```

- 通常应该优先使用 float64 类型，因为 float32 类型的累计计算误差很容易扩散，并且 float32 能精确表示的正整数并不是很大
```go
var f float32 = 1 << 24;
fmt.Println(f == f+1) // true
```

- 浮点数在声明的时候可以只写整数部分或者小数部分
~~~go
var e = .71828 // 0.71828
var f = 1.     // 1
fmt.Printf("%.5f,%.1f",e,f)
~~~

- 很小或很大的数最好用科学计数法书写，通过 e 或 E 来指定指数部分




## 3. 布尔型
- 在Go语言中，以bool类型进行声明：
~~~go
var 变量名 bool
~~~


## 4. 字符类型
Go语言的字符有以下两种：
- 一种是 uint8 类型，或者叫 byte 型，代表了 ASCII 码的一个字符。
- 另一种是 rune 类型，代表一个 UTF-8 字符，当需要处理中文、日文或者其他复合字符时，则需要用到 rune 类型。rune 类型等价于 int32 类型。

byte 类型是 uint8 的别名，rune 类型是int32的别名
ASCII 码的一个字符占一个字节
- **ASCII** 定义 128 个字符，由码位 0 – 127 标识。它涵盖英文字母，拉丁数字和其他一些字符
~~~go
// 使用单引号 表示一个字符
var ch byte = 'A'
// 在 ASCII 码表中，A 的值是 65,也可以这么定义
var ch byte = 65
// 65使用十六进制表示是41，所以也可以这么定义 \x 总是紧跟着长度为 2 的 16 进制数
var ch byte = '\x41'
// 65的八进制表示是101，所以使用八进制定义 \后面紧跟着长度为 3 的八进制数
var ch byte = '\101'

fmt.Printf("%c",ch)
~~~

Unicode 包中内置了一些用于测试字符的函数，这些函数的返回值都是一个布尔值，如下所示（其中 ch 代表字符）：
- 判断是否为字母：unicode.IsLetter(ch)
- 判断是否为数字：unicode.IsDigit(ch)
- 判断是否为空白符号：unicode.IsSpace(ch)


### UTF-8 和 Unicode 有何区别？
- Unicode 与 ASCII 类似，都是一种字符集。

- 字符集为每个字符分配一个唯一的 ID，我们使用到的所有字符在 Unicode 字符集中都有一个唯一的 ID，例如 a 在 Unicode 与 ASCII 中的编码都是 97。汉字“你”在 Unicode 中的编码为 20320，在不同国家的字符集中，字符所对应的 ID 也会不同。而无论任何情况下，Unicode 中的字符的 ID 都是不会变化的。

- UTF-8 是编码规则，将 Unicode 中字符的 ID 以某种方式进行编码，UTF-8 的是一种变长编码规则，从 1 到 4 个字节不等。编码规则如下：

- 0xxxxxx 表示文字符号 0～127，兼容 ASCII 字符集。
- 从 128 到 0x10ffff 表示其他字符。


- 根据这个规则，拉丁文语系的字符编码一般情况下每个字符占用一个字节，而中文每个字符占用 3 个字节。

- 广义的 Unicode 指的是一个标准，它定义了字符集及编码规则，即 Unicode 字符集和 UTF-8、UTF-16 编码等。



## 5. 字符串型


### 字符串定义
- 一个字符串是一个不可改变的字节序列，字符串可以包含任意的数据，但是通常是用来包含可读的文本，字符串是 UTF-8 字符的一个序列。
~~~go
// 字符串的定义：
var mystr string = "hello"
~~~

### 转义字符
- 字符串中可以使用转义字符来实现换行、缩进等效果，常用的转义字符包括:
- `\n：`换行符
- `\r：`回车符
- `\t：`tab 键
- `\u 或 \U：`Unicode 字符
- `\\：`反斜杠自身


### 字符串是字节的定长数组
- 字符串是字节的定长数组，byte 和 rune 都是字符类型，若多个字符放在一起，就组成了字符串
~~~go
func main() {
	// hello 对照 ascii 编码表，每个字母对应的编号是：104,101,108,108,111
    var mystr01 string = "hello"
    var mystr02 [5]byte = [5]byte{104, 101, 108, 108, 111}
    fmt.Printf("myStr01: %s\n", mystr01)
    fmt.Printf("myStr02: %s", mystr02)

	// 中文占三个字节，字母一个字节
	fmt.Printf("mystr01: %d\n", len(myStr01))
}
~~~


### 字符串长度
- ASCII字符使用`len()`函数，获取字符串长度
- Unicode字符串长度使用`utf8.RuneCountInString()`函数
~~~go
// 计算字符串的长度
str1 := "hello"
str2 := "你好"
fmt.Println(len(str1))  // 1个字母占1个字节
fmt.Println(len(str2))  // 1个中文占3个字节，go从底层支持utf8
fmt.Println(utf8.RuneCountInString(str2)) // 2
~~~


### 字符串拼接
- 字符串拼接符“+”：两个字符串 s1 和 s2 可以通过 s := s1 + s2 拼接在一起。将 s2 追加到 s1 尾部并生成一个新的字符串 s
- 也可以使用“+=”来对字符串进行拼接：
~~~go
s := "hel" + "lo,"
s += "world!"
fmt.Println(s) //输出 “hello, world!”
~~~

- 使用`WriteString()`，可以节省内存分配，提高处理效率
~~~go
str1 := "hello,"
str2 := "你好"
var stringBuilder bytes.Buffer
// 节省内存分配，提高处理效率
stringBuilder.WriteString(str1)
stringBuilder.WriteString(str2)
fmt.Println(stringBuilder.String())
~~~


### 获取字符串中某个字符
~~~go
// 对于ASCII字符串，字节数组
s1 := "hello"
u := s1[0]
fmt.Println("%c", u) // 输出：h

// Unicode字符串，rune数组
s2 := "hello 你好"
fmt.Printf("%s\n", string([]rune(s2)[6])) // 输出：你



// 查找 一个中文 3个字符
tracer := "你好,世界！你好"

// 正向搜索字符串
comma := strings.Index(tracer, ",")
fmt.Println(",所在的位置:", comma) // ,所在的位置: 6
// 冒号后面，可以写长度，不写长度表示到结尾
fmt.Println(tracer[comma+1:]) // 世界！你好

add := strings.Index(tracer, "+")
fmt.Println("+所在的位置:", add) // +所在的位置: -1

pos := strings.Index(tracer[comma:], "你好")
fmt.Println("你好，所在的位置", pos) // 你好，所在的位置 10

fmt.Println(comma, pos, tracer[7:]) // 6 10 世界！你好
~~~


### 遍历
- unicode字符集使用`for range`进行遍历，ascii字符集可以使用`for range`或者`for`循环遍历
~~~go
var str1 string = "hello"
var str2 string = "hello,你好！"
// 遍历
for i :=0; i< len(str1); i++{
	fmt.Printf("ascii: %c %d\n", str1[i], str1[i])
}
for _, s := range  str1{
	fmt.Printf("unicode: %c %d\n ", s, s)
}
// 中文只能用 for range
for _, s := range  str2{
	fmt.Printf("unicode: %c %d\n ", s, s)
}
~~~


### 字符串的格式化

- `print：` 结果写到标准输出
- `Sprint：`结果会以字符串形式返回

~~~go
str1 := "你好,"
str2 := "世界"
var stringBuilder bytes.Buffer
stringBuilder.WriteString(str1)
stringBuilder.WriteString(str2)

// Sprint 以字符串形式返回
result := fmt.Sprintf(stringBuilder.String())
fmt.Println(result)

/*
	%c  单一字符
	%T  动态类型
	%v  本来值的输出
	%+v 字段名+值打印
	%d  十进制打印数字
	%p  指针，十六进制
	%f  浮点数
	%b 二进制
	%s string
*/
~~~

### 修改字符串
- 将8080改为8081
```go
func main() {
s1 := "localhost:8080"
fmt.Println(s1)
// 强制类型转换 string to byte
strByte := []byte(s1)

// 下标修改
strByte[len(s1)-1] = '1'
fmt.Println(strByte)

// 强制类型转换 []byte to string
s2 := string(strByte)
fmt.Println(s2)
}
```

- 字符串替换, 比如将 "Hello, Java教程" 替换为  "Hello, Go教程"
```go
func main() {
	str1 := "Hello, Java教程"
	source := "Java"
	target := "Go"
	
	index := strings.Index(str1, source)
	fmt.Println("index = ", index) // index =  7

	sourceLength := len(source) // sourceLength =  4
	fmt.Println("sourceLength = ", sourceLength)

	start := str1[:index]
	end := str1[index+sourceLength:]
	fmt.Println("start = ", start) // start =  Hello,
	fmt.Println("end = ", end)     // end =  教程

	var stringBuilder bytes.Buffer
	stringBuilder.WriteString(start)
	stringBuilder.WriteString(target)
	stringBuilder.WriteString(end)
	fmt.Println(stringBuilder.String()) // Hello, Go教程
}
```


### 字符串与其它数据类型的转换
- 整数与字符串
~~~go
// 字符串与其他类型的转换
// str 转 int
newStr1 := "1"
intValue, _ := strconv.Atoi(newStr1)
fmt.Printf("%T,%d\n", intValue, intValue)  // int,1

// int 转 str
intValue2 := 1
strValue := strconv.Itoa(intValue2)
fmt.Printf("%T, %s\n", strValue, strValue)
~~~

- 浮点数与字符串
~~~go
// str 转  float
string3 := "3.1415926"
f,_ := strconv.ParseFloat(string3, 32)
fmt.Printf("%T, %f\n", f, f)  // float64, 3.141593

//float 转 string
floatValue := 3.1415926
// 4个参数:
// 参数1：要转换的浮点数 
// 参数2. 格式标记（b、e、E、f、g、G）
// 参数3. 精度 
// 参数4. 指定浮点类型（32:float32、64:float64）
// 格式标记：
// ‘b’ (-ddddp±ddd，二进制指数)
// ‘e’ (-d.dddde±dd，十进制指数)
// ‘E’ (-d.ddddE±dd，十进制指数)
// ‘f’ (-ddd.dddd，没有指数)
// ‘g’ (‘e’:大指数，‘f’:其它情况)
// ‘G’ (‘E’:大指数，‘f’:其它情况)
//
// 如果格式标记为 ‘e’，‘E’和’f’，则 prec 表示小数点后的数字位数
// 如果格式标记为 ‘g’，‘G’，则 prec 表示总的数字位数（整数部分+小数部分）
formatFloat := strconv.FormatFloat(floatValue, 'f', 2, 64)
fmt.Printf("%T,%s",formatFloat,formatFloat)
~~~






## 6. 类型转换
- 在必要以及可行的情况下，一个类型的值可以被转换成另一种类型的值。由于Go语言不存在隐式类型转换，因此所有的类型转换都必须显式的声明：
~~~go
a := 5.0
b := int(a)
fmt.Printf("%T,%d",b,b)
~~~

- 类型转换只能在定义正确的情况下转换成功，例如从一个取值范围较小的类型转换到一个取值范围较大的类型（将 int16 转换为 int32）。
- 当从一个取值范围较大的类型转换到取值范围较小的类型时（将 int32 转换为 int16 或将 float32 转换为 int），会发生`精度丢失`的情况。
- 只有相同底层类型的变量之间可以进行相互转换（如将 int16 类型转换成 int32 类型），不同底层类型的变量相互转换时会引发编译错误（如将 bool 类型转换为 int 类型）



## 参考
- [Go基础教程](https://www.bilibili.com/video/BV1SS4y1T7kJ)