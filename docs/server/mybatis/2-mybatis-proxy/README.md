---
title: 2. 动态代理与mapper中的参数
---

[[TOC]]


<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/0.png" width="900"/>






## 1. IDEA中创建代码模版
- IntelliJ IDEA --> Preferences --> Editor --> File and Code Templates 
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/4.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/5.png" width="700"/>


## 2. 传统Dao使用方式
- dao/StudentDao.java接口
```java
package com.funky.dao;
import com.funky.domain.Student;
import java.util.List;

public interface StudentDao {
    List<Student> selectStudents();
    int insertStudent(Student stu);
}
```



- dao/StudentDao.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.funky.dao.StudentDao">
    <select id="selectStudents" resultType="com.funky.domain.Student">
        select id,name,email,age from student order by id
    </select>

    <insert id="insertStudent">
        insert into student values(#{id},#{name},#{email},#{age})
    </insert>
</mapper>
```

- dao/impl/StudentImpl.java 接口实现类
```java
package com.funky.dao.impl;
import com.funky.dao.StudentDao;
import com.funky.domain.Student;
import com.funky.utils.MyBatisUtils;
import org.apache.ibatis.session.SqlSession;
import java.util.List;

public class StudentImpl implements StudentDao {
    @Override
    public List<Student> selectStudents() {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        String sqlId = "com.funky.dao.StudentDao.selectStudents";
        List<Student> studentList = sqlSession.selectList(sqlId);
        //studentList.forEach(stu -> System.out.println(stu));
        sqlSession.close();
        return studentList;
    }

    @Override
    public int insertStudent(Student stu) {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        String sqlId = "com.funky.dao.StudentDao.insertStudent";
        int num = sqlSession.insert(sqlId,stu);
        sqlSession.commit(); // 提交事务
        sqlSession.close();
        return num;
    }
}
```

- TestMyBatis测试类
```java
package com.funky;

import com.funky.dao.StudentDao;
import com.funky.dao.impl.StudentImpl;
import com.funky.domain.Student;
import org.junit.Test;
import java.util.List;

public class TestMyBatis {
    @Test
    public void testSelectStudents() {
        StudentDao dao = new StudentImpl();
        List<Student> studentList = dao.selectStudents();
        for (Student stu:studentList) {
            System.out.println(stu);
        }
    }
    @Test
    public void testInsertStudent() {
        StudentDao dao = new StudentImpl();
        Student stu = new Student();
        stu.setId(1004);
        stu.setName("funky");
        stu.setEmail("funky@163.com");
        stu.setAge(20);

        int num = dao.insertStudent(stu);
        System.out.println(num == 1 ? "添加成功" : "添加失败");
    }
}
```




## 3. Mybatis的动态代理
- mybatis的动态代理：mybatis根据dao的方法调用，获取执行sql语句的信息。mybatis根据dao接口，创建出一个dao接口的实现类，并创建这个类的对象。完成SqlSession调用方法，访问数据库。这样就不需要实现接口的实现类
- 直接删除上面3.2步骤创建的StudentDaoImpl实现类
- 重新实现TestMyBatis测试类
```java
package com.funky;

import com.funky.dao.StudentDao;
import com.funky.domain.Student;
import com.funky.utils.MyBatisUtils;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;
import java.util.List;

public class TestMyBatis {

    @Test
    public void testSelectStudents() {
        /*
            使用mybatis的动态代理机制，使用SqlSession.getMapper(dao接口)
            getMapper能获取dao接口对应的实现类对象
         */
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        StudentDao dao = sqlSession.getMapper(StudentDao.class);

        // dao = com.sun.proxy.$Proxy2  : jdk的动态代理
        System.out.println("dao = " + dao.getClass().getName());

        // 调用dao的方法，执行数据库的操作
        List<Student> students = dao.selectStudents();
        for (Student stu: students) {
            System.out.println("学生 =" + stu);
        }
        sqlSession.close();
    }

    @Test
    public void testInsertStudent() {

        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        StudentDao dao = sqlSession.getMapper(StudentDao.class);

        Student stu = new Student();
        stu.setId(1004);
        stu.setName("lifeifei");
        stu.setEmail("lifeifei@163.com");
        stu.setAge(28);
        int num = dao.insertStudent(stu);
        sqlSession.commit();
        System.out.println(num == 1 ? "添加成功" : "添加失败");
        sqlSession.close();
    }
}

```





## 4. mapper文件中sql语句的参数

- 从java代码中把数据传入到mapper文件的sql语句中

### 4.1 parameterType：表示dao接口中方法参数的数据类型

- dao/StudentDao.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.funky.dao.StudentDao">

<!--
    parameterType : dao接口中方法参数的数据类型
        它的值是java的数据类型全限定名称或者是mybatis定义的别名
        parameterType="java.lang.Integer"
        parameterType="int"
    注意：parameterType不是强制的，mybatis通过反射机制能够发现接口参数的数据类型
        所以可以没有，一般我们不写
-->
    <select id="selectStudentById" parameterType="java.lang.Integer" resultType="com.funky.domain.Student">
        select id,name,email,age from student where id=#{id}
    </select>
</mapper>
```

- 测试类：
```java
@Test
public void testSelectStudentById() {
   SqlSession sqlSession = MyBatisUtils.getSqlSession();
   StudentDao dao = sqlSession.getMapper(StudentDao.class);
   Student student = dao.selectStudentById(1002);
   System.out.println("学生 =" + student);
   sqlSession.close();
}
```


### 4.2 一个简单类型的参数
```java
public interface StudentDao {
    /*
        一个简单类型的参数：
            简单类型：mybatis把java的基本数据类型和string都叫简单类型
            在mapper文件获取简单类型的一个参数的值，使用  #{任意字符}
     */
    public Student selectStudentById(Integer id);
}
```


### 4.3 mybatis内部机制，其实是封装的jdbc
```xml
<!--
    使用 #{}之后，mybatis执行sql是使用的jdbc中的PreparedStatement对象，由mybatis执行下面的代码：
    1 mybatis创建Connection，PreparedStatement对象
        String sql = "select id,name,email,age from student where id=?"
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1,1001);
    2 执行sql封装为resultType="com.funky.domain.Student"这个对象
        ResultSet rs = ps.executeQuery();
        Student stu = null;
        while(rs.next()) {
            // 从数据库取表的一行数据，存到一个java对象的属性中
            stu = new Student();
            stu.setId(rs.getInt("id"));
            stu.setName(rs.getString("name"));
            stu.setEmail(rs.getString("email"));
            stu.setAge(rs.getInt("age"));
        }
        return stu; // 给了dao方法调用的返回值
-->
    <select id="selectStudentById" parameterType="java.lang.Integer" resultType="com.funky.domain.Student">
        select id,name,email,age from student where id=#{id}
    </select>
```



### 4.4 多个参数@Param

- 接口类StudentDao
```java
public interface StudentDao {
    /*
        多个参数：命名参数，在形参定义的前面加入 @Param("自定义参数名称")
    */
    List<Student> selectMulitParam(@Param("myname") String name,
                                    @Param("myage") Integer age);
}
```

- mapper类
```xml
<select id="selectMulitParam" resultType="com.funky.domain.Student">
    select id,name,email,age from student where name=#{myname} or age=#{myage}
</select>
```

- 测试类
```java
@Test
public void testSelectMultiParam() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    List<Student> students = dao.selectMulitParam("lisi", 20);
    for (Student stu: students) {
        System.out.println("学生 =" + stu);
    }
    sqlSession.close();
}
```


### 4.5 多个参数，使用对象

- 创建QueryParam类
```java
public class QueryParam {
    private String paramName;
    private Integer paramAge;

    public String getParamName() { return paramName; }
    public void setParamName(String paramName) { this.paramName = paramName; }
    public Integer getParamAge() { return paramAge; }
    public void setParamAge(Integer paramAge) { this.paramAge = paramAge; }
}
```

- 接口类
```java
public interface StudentDao {
    /*
        多个参数：使用java对象作为接口中方法的参数
    */
    List<Student> selectMultiObject(QueryParam param);
    List<Student> selectMultiStudent(Student param);
}
```

- mapper文件
```xml
<!--
    多个参数，使用java对象的属性值，作为参数实际值
    使用对象语法：#{属性名，javaType=类型名称，jdbcType=数据类型} 很少用
                javaType：指java中的属性属性类型
                jdbcType：在数据库中的数据类型
                例如：#{ paramName, javaType=java.lang.String, jdbcType=VARCHAR }

            <select id="selectMultiObject" resultType="com.funky.domain.Student">
                select id,name,email,age from student where name=#{paramName, javaType=java.lang.String, jdbcType=VARCHAR}
                or age=#{paramAge, javaType=java.lang.Interger, jdbcType=INTEGER}
            </select>

    使用简化方式：#{属性名}
        javaType，jdbcType的值mybatis反射能获取。不用提供
-->
    <select id="selectMultiObject" resultType="com.funky.domain.Student">
        select id,name,email,age from student where name=#{paramName}
        or age=#{paramAge}
    </select>

    <select id="selectMultiStudent" resultType="com.funky.domain.Student">
        select id,name,email,age from student where name=#{name}
        or age=#{age}
    </select>
```

- 测试类
```java
@Test
public void testSelectMultiObject() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    QueryParam qp = new QueryParam();
    qp.setParamName("lisi");
    qp.setParamAge(20);
    List<Student> students = dao.selectMultiObject(qp);
    for (Student stu: students) {
        System.out.println("学生 =" + stu);
    }
    sqlSession.close();
}
@Test
public void testSelectMultiStudent() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    Student stu = new Student();
    stu.setName("lisi");
    stu.setAge(20);
    List<Student> students = dao.selectMultiStudent(stu);
    for (Student s: students) {
        System.out.println("学生 =" + s);
    }
    sqlSession.close();
}
```

### 4.6 多个参数，按位置(不建议使用)
- 接口类
```java
public interface StudentDao {
    /*
        多个参数-简单类型的，按位置
        mybatis 3.4之前，使用 #{0}, #{1}
                3.4之后，使用 #{arg0}, #{arg1}
    */
    List<Student> selectMultiPosition(String name, Integer age);
}
```

- mapper文件
```xml
<select id="selectMultiPosition" resultType="com.funky.domain.Student">
    select id,name,email,age from student where name=#{arg0}
    or age=#{arg1}
</select>
```

### 4.7 多个参数，Map(不建议使用)
- 可读性差，看不到参数的个数，阿里巴巴的手册，不建议使用map

- 接口类
```java
public interface StudentDao {
    /*
        多个参数-Map
    */
    List<Student> selectMultiByMap(Map<String,Object> map);
}
```

- mapper文件
```xml
<select id="selectMultiByMap" resultType="com.funky.domain.Student">
    select id,name,email,age from student where name=#{myname}
    or age=#{age}
</select>
```

- 测试类
```java
@Test
public void testSelectMultiByMap() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    Map<String,Object> data = new HashMap<>();
    data.put("myname","lisi");
    data.put("age",28);

    List<Student> students = dao.selectMultiByMap(data);
    for (Student s: students) {
        System.out.println("学生 =" + s);
    }
    sqlSession.close();
}
```

### 4.8 # 和 $
    - `#`：告诉mybatis使用实际的参数值代替，并使用PrepareStatement对象执行sql语句，`#{...}`代替sql语句的“？”，这样做更安全，更迅速，通常也是首选的做法。
    - `$`：字符串替换，告诉mybatis使用$包含的“字符串”替换所在位置。使用Statement把sql语句和${}的内容连接起来。主要用在替换表名，列名，不同列排序等操作，有sql注入的风险，缺乏安全性








## 5. 封装MyBatis输出结果
- resultType结果类型
    - 指sql语句执行完毕后，数据转为的java对象，java类型是任意的
- 处理方式：
    - mybatis执行sql语句，然后mybatis调用类的无参数构造方法，创建对象。          
    - mybatis把ResultSet指定列值赋给同名的属性
- resultType结果类型的值：
    - 可以是类型的全限定名称，也可以是类型的别名。例如：java.lang.Interger别名是int


### 5.1 定义自定义类型的别名

- 在mybatis.xml主配置文件中使用`<typeAlias>`定义别名
```xml
<!--定义别名-->
<typeAliases>
    <!--方式一：可以指定一个类型一个自定义别名 type：自定义类型的全限定名称，alias：别名（短小，容易记忆）-->
    <typeAlias type="com.funky.domain.Student" alias="stu"/>

    <!--方式二：name是包名，这个包中的所有类，类名就是别名（类名不区分大小写）-->
    <package name="com.funky.domain"/>
</typeAliases>
```

- mapper.xml文件，在resultType中使用自定义别名
```xml
<!--使用方式一-->
<select id="selectStudentById" resultType="stu">
    select id,name,email,age from student where id=#{studentId}
</select>

<!--使用方式二-->
<select id="selectStudentById" resultType="Student">
    select id,name,email,age from student where id=#{studentId}
</select>
```

### 5.2 返回Map

- 定义接口
```java
public Map<Object,Object> selectMapById(Integer id);
```

- mapper.xml
```xml
<!--    <select id="selectMapById" resultType="java.util.HashMap">-->
<select id="selectMapById" resultType="map">
    select id,name from student where id=#{stuid}
</select>
```


### 5.3 resultMap：结果映射，指定列名和java对象的属性对应关系
- 自定义列值赋值给那个属性
- 当你的列名和属性名不一样时，一定使用resultMap
- resultMap和resultType不要一起用，二选一

- 接口类
```java
public List<Student> selectAllStudents();
public List<MyStudent> selectMyStudents();
public List<MyStudent> selectDiffColProperty();
```

- mapper文件
```xml

<!--id：自定义名称，表示你定义的这个resultMap。type：java类型的全限定名称-->
<resultMap id="studentMap" type="com.funky.domain.Student">
    <!--列名和java属性的关系-->
    <!--主键列，使用id标签，column是列名，property是java类型的属性名-->
    <id column="id" property="id"/>
    <!--非主键列，使用result-->
    <result column="name" property="name"/>
    <result column="email" property="email"/>
    <result column="age" property="age"/>
</resultMap>
<select id="selectAllStudents" resultMap="studentMap">
    select * from student
</select>


<resultMap id="myStudentMap" type="com.funky.domain.MyStudent">
    <id column="id" property="stuid"/>
    <result column="name" property="stuname"/>
    <result column="email" property="stuemail"/>
    <result column="age" property="stuage"/>
</resultMap>
<!--列名和属性名不一样：方式一：-->
<select id="selectMyStudents" resultMap="myStudentMap">
    select id,name,email,age from student
</select>

<!--列名和属性名不一样：方式二：
    resultType的默认原则是 同名的列值赋值给同名的属性，使用列别名
-->
<select id="selectDiffColProperty" resultType="com.funky.domain.MyStudent">
    select id as stuid,  name as stuname ,email as stuemail,age as stuage from student
</select>
```

- 测试类
```java
@Test
public void testSelectAllStudents() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    List<Student> students = dao.selectAllStudents();
    for (Student stu: students) {
        System.out.println("学生 =" + stu);
    }
    sqlSession.close();
}

@Test
public void testSelectMyStudents() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);
    List<MyStudent> students = dao.selectMyStudents();
    for (MyStudent stu: students) {
        System.out.println("学生 =" + stu);
    }
    sqlSession.close();
}
@Test
public void testSelectDiffColProperty() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);
    List<MyStudent> students = dao.selectDiffColProperty();
    for (MyStudent stu: students) {
        System.out.println("学生 =" + stu);
    }
    sqlSession.close();
}
```

- MyStudent.java
```java
public class MyStudent {
    private Integer stuid;
    private String stuname;
    private String stuemail;
    private Integer stuage;

    // setter & getter...
}
```




### 5.4 模糊查询like

- 接口定义类
```java
// 推荐：第一种方式，模糊查询，在java代码中指定like内容
List<Student> selectLikeOne(String name);

// 第二种方式，name就是li值，在mapper中拼接 like "%" li "%"
List<Student> selectLikeTwo(String name);
```

- mapper文件
```xml
<!--第一种like-->
<select id="selectLikeOne" resultType="com.funky.domain.Student">
    select id,name,email,age from student where name like #{name}
</select>

<!--第二种like-->
<select id="selectLikeTwo" resultType="com.funky.domain.Student">
    select id,name,email,age from student where name like "%" #{name} "%"
</select>
```

- 测试类
```java
@Test
public void testSelectLikeOne() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    String name = "%li%";
    List<Student> students = dao.selectLikeOne(name);
    for (Student stu: students) {
        System.out.println(">>>>> 学生 =" + stu);
    }
    sqlSession.close();
}
@Test
public void testSelectLikeTwo() {
    SqlSession sqlSession = MyBatisUtils.getSqlSession();
    StudentDao dao = sqlSession.getMapper(StudentDao.class);

    String name = "li";
    List<Student> students = dao.selectLikeTwo(name);
    for (Student stu: students) {
        System.out.println("******* 学生 =" + stu);
    }
    sqlSession.close();
}
```




## 参考
- [MyBatis从入门到精通](https://www.bilibili.com/video/BV185411s7Ry)