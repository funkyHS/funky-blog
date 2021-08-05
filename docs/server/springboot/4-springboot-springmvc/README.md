---
title: 4. SpringMVC常用注解以及RESTful
---


[[TOC]]

## 1. SpringMVC常用注解以及RESTful

- 工作中用的最多的还是POST和GET请求

### 1.1 @Controller
```java
@Controller
public class StudentController {

    @RequestMapping(value = "/student")
    @ResponseBody // 表示返回的是json对象
    public Object student() {
        Student student = new Student();
        student.setId(1001);
        student.setName("zhangsan");
        return student; 
    }
}
```

### 1.2 @RestController

- 使用`@RestController`， 意味着当前控制层类中所有方法返还的都是JSON对象
```java
// @Controller
@RestController  // 相当于控制层类上加@Controller + 方法上加@ResponseBody
public class StudentController {

    @RequestMapping(value = "/student")
    // @ResponseBody // 使用了@RestController注解，不需要在每个方法上添加@ResponseBody
    public Object student() {
        Student student = new Student();
        student.setId(1001);
        student.setName("zhangsan");
        return student; // 返回的是json对象
    }


    // 使用@RequestMapping注解，该方法请求方式支持:GET和POST请求，method可写可不写
    @RequestMapping(value = "/queryStudentById",method = {RequestMethod.GET,RequestMethod.POST})
    public Object queryStudentById(Integer id) {
        Student student = new Student();
        student.setId(id);
        return student;
    }
}
```

### 1.3 @RequestMapping
```java
@RestController
public class StudentController {

    // 使用@RequestMapping注解，该方法请求方式支持:GET和POST请求，method可写可不写
    @RequestMapping(value = "/queryStudentById",method = {RequestMethod.GET,RequestMethod.POST})
    public Object queryStudentById(Integer id) {
        Student student = new Student();
        student.setId(id);
        return student;
    }

    // 只支持Get请求
    @RequestMapping(value = "/queryStudentById2",method = RequestMethod.GET)
    public Object queryStudentById2() {
        return "Ony GET Method";
    }
}
```


### 1.4 @GetMapping

- 只接收GET请求,如果请求方式不对会报405错误
- 该注解通常在查询数据的时候使用
```java
@RestController
public class StudentController {

    // 只支持Get请求
    // @RequestMapping(value = "/queryStudentById2",method = RequestMethod.GET)
    @GetMapping(value = "/queryStudentById2") //相当于上一句话
    public Object queryStudentById2() {
        return "Ony GET Method";
    }
}
```

### 1.5 @PostMapping
- 该注解通常在新增数据的时候使用
```java
@RestController
public class StudentController {

    // @RequestMapping(value = "/insert",method = RequestMethod.POST)
    @PostMapping(value = "/insert") // 相当于一句话
    public Object insert() {
        return "Insert success";
    }
}
```

### 1.6 @PutMapping
- 该注解通常在修改数据的时候使用
```java
@RestController
public class StudentController {

    // @RequestMapping(value = "/update",method = RequestMethod.PUT)
    @PutMapping(value = "/update") // 相当于上一句话
    public Object update() {
        return "update student info1";
    }
}
```

### 1.7 @DeleteMapping
- 该注解通常在删除数据的时候使用
```java
@RestController
public class StudentController {

    // @RequestMapping(value = "/delete",method = RequestMethod.DELETE)
    @DeleteMapping(value = "/delete")// 相当于上一句话
    public Object delete() {
        return "delete Student";
    }
}
```


---------------------------------------------------------



## 2. RESTful

- REST（英文：Representational State Transfer，简称 REST）
- 一种互联网软件架构设计的风格，但它并不是标准，它只是提出了一组客户端和服务器
交互时的架构理念和设计原则，基于这种理念和原则设计的接口可以更简洁，更有层次，REST
这个词，是 Roy Thomas Fielding 在他 2000 年的博士论文中提出的
- 任何的技术都可以实现这种理念，如果一个架构符合 REST 原则，就称它为 RESTFul 架构
- 比如我们要访问一个 http 接口：`http://localhost:8080/boot/order?id=1021&status=1`
- 采用 RESTFul 风格则 http 地址为：`http://localhost:8080/boot/order/1021/1`


### @GetMapping，@DeleteMapping，@PathVariable注解

- RESUful请求风格要求路径中使用的单词都是名称,最好不要出现动词
- 注意：student1与student2会出现请求路径“迷糊”冲突的问题
    - 通常在RESTful风格中方法的请求方式会按增删改查的请求方式来区分：@GetMapping，@DeleteMapping
    - 或者修改请求路径
- 一般传的参数不是数据库表的字段，可以不采用斜杠传参。如分页排序等操作 `/boot/order?page=1&sort=desc`
```java
@RestController
public class StudentController {

    // 请求url：localhost:8080/student?id=1002&age=23
    @RequestMapping(value = "/student")
    public Object student(Integer id,Integer age) {
        Student student = new Student();
        student.setId(id);
        student.setAge(age);
        return student;
    }

    // 请求url：localhost:8080/student/1002/23
    // @RequestMapping(value = "/student/detail/{id}/{age}")
    @GetMapping(value = "/student/detail/{id}/{age}")
    public Object student1(@PathVariable("id") Integer id,
                           @PathVariable("age") Integer age) {
        Map<String,Object> retMap = new HashMap<>();
        retMap.put("id",id);
        retMap.put("age",age);
        return retMap;
    }

    // 请求url：localhost:8080/student/1002/23
    // @RequestMapping(value = "/student/detail/{id}/{status}")
    @DeleteMapping(value = "/student/detail/{id}/{status}")
    public Object student2(@PathVariable("id") Integer id,
                           @PathVariable("status") Integer status) {
        Map<String,Object> retMap = new HashMap<>();
        retMap.put("id",id);
        retMap.put("status",status);
        return retMap;
    }

    // 注意：student1与student2会出现请求路径“迷糊”冲突的问题
    // 通常在RESTful风格中方法的请求方式会按增删改查的请求方式来区分：@GetMapping，@DeleteMapping
    // 或者修改请求路径

    @DeleteMapping(value = "/student/{id}/detail/{city}")
    public Object student3(@PathVariable("id") Integer id,
                           @PathVariable("city") Integer city) {
        Map<String,Object> retMap = new HashMap<>();
        retMap.put("id",id);
        retMap.put("city",city);
        return retMap;
    }

    @PostMapping(value = "/student/{id}")
    public String addStudent(@PathVariable("id") Integer id) {
        return "add student ID:" + id;
    }

    @PutMapping(value = "/student/{id}")
    public String updateStudent(@PathVariable("id") Integer id) {
        return "update Student ID:" +id;
    }
}
```






## 参考
- [Spring框架从入门到精通](https://www.bilibili.com/video/BV1PZ4y1j7QK?p=37)


