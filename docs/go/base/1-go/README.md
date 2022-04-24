---
title: 【1.Go介绍】
---

[[TOC]]



## 1. Go介绍
- [Go官方下载](https://go.dev/dl/)
- 2007年，谷歌工程师Ken Thompson、Rob Pike、Robert Griesemer开始设计一门全新的语言，这是Go语言的最初原型。
- 2009.11.10 ，Google将Go语言以开放源代码的形式向全球发布。
- 2015年8月19日 ，Go1.5版本发布，本次更新中移除了“最后残余的C代码”，请内存管理方面权威专家Rick Hudson对GC进行重新设计（重要的修正）
- 2017年2月16日 ， Go1.8版本发布
- 2017年8月24日 ， Go1.9版本发布
- 2018年2月16日 ， Go1.10版本发布
- 2018年8月24日 ， Go1.11版本发布
- 2019年2月25日 ， Go1.12版本发布
- 2019年9月03日 ， Go1.13版本发布
- 2020年2月25日 ， Go1.14版本发布
- 2020年8月11日 ， Go1.15版本发布
- 2021年2月16日 ， Go1.16版本发布
- 2021年8月16日 ， Go1.17版本发布



## 2. 为什么使用Go
- 简单好记的关键词和语法。轻松上手，简单易学。
- 更高的效率。比Java，C++等拥有更高的编译速度，同时运行效率媲美C，同时开发效率非常高。
- 生态强大，网络上库很丰富，很多功能使用Go开发非常简单。
- 语法检查严格，高安全性。
- 严格的依赖管理，go mod命令。
- Go拥有强大的编译检查、严格的编码规范和完整的软件生命周期工具，具有很强的稳定性，稳定压倒一切。
- 跨平台交叉编译，windows就可以编译出mac，linux上可执行的程序。
- 异步编程复杂度低，易维护，GO 语言中 Channel 设计，异步程序写起来非常自然。
- 语言层面支持并发，`go关键字（协程）`使得go的并发效率极高。
- 严格的语法规范，所有程序员写出来的代码都是一样的，对大团队来说，非常友好。
- Go 的并发、性能、安全性、易于部署等特性，使它很容易成为“云原生语言”。容器和云的使用上非常广



## 3. 环境变量配置
- 下载go：[Go官方下载](https://go.dev/dl/)
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/go/base/1.png" width="300"/>

- `GOROOT`：go语言所在的目录，用于全局执行go相关的命令，在`.zshrc`配置文件中添加如下：
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/go/base/2.png" width="300"/>

- `GOPATH`：工作目录，工程代码存放的位置，此目录下，一个文件夹就是一个工程：默认的 Go 工作区目录: `～/go`

- `GOPROXY`：代理，由于go需要翻墙使用，需要配置代理，[相关文档](https://goproxy.io/zh/)，配置代理后，下载go依赖的时候就直接走代理下载
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/go/base/3.png" width="300"/>

- 查看go的版本：`go version`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/go/base/4.png" width="300"/>

- 查看go的环境：`go env`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/go/base/5.png" width="400"/>



## 4. 入门案例 Hello World

- 在`GOPATH`(~/go)路径下，新建一个文件夹，hello
```shell
$ cd ~/go
$ mkdir hello
$ cd hello
# 初始化，此时会自动生成 go.mod文件，用于管理依赖的。
$ go mod init hello
# 创建main.go文件
$ touch main.go
```

- 编写`main.go`文件
```go
// package 定义包名 main 包名
package main

// import 引用库 fmt 库名
import "fmt"

// func 定义函数 main 函数名
func main() {
	// fmt 包名 . 调用 Print 函数,并且输出定义的字符串
	fmt.Print("Hello Golang From Funky")
}
```

- 执行`main.go`： `go run main.go`



## 参考
- [Go基础教程](https://www.bilibili.com/video/BV1SS4y1T7kJ)