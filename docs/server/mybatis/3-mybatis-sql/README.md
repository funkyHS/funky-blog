---
title: 3. 动态sql,if,where,foreach
---

[[TOC]]


<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/java/mybatis/0.png" width="900"/>


## MyBatis框架动态SQL
- 动态sql：sql的内容是变化的，可以根据条件获取到不同的sql语句，主要是where部分发生变化
- 动态sql的实现，使用的是mybatis提供的标签：`<if>`,`<where>`,`<foreach>`

### 接口类

```java
public interface StudentDao {

    // 动态sql--if， 要使用java对象作为参数
    List<Student> selectStudentIf(Student student);

    // 动态sql--where， 用来包含多个<if>,当多个if有一个成立的，where会自动增加一个where关键字，并去掉if中多余的and，or等
    List<Student> selectStudentWhere(Student student);

    // 动态sql--foreach 循环java中的数组，list集合的，主要用在sql的in语句中。
    // foreach 用法1：
    List<Student> selectForeachOne(List<Integer> idlist);

    // foreach 用法2：
    List<Student> selectForeachTwo(List<Student> stulist);
}
```

### mapper文件
```xml
<mapper namespace="com.funky.dao.StudentDao">

    <!--定义sql片段-->
    <sql id="studentSql">
        select id,name,age,email from student
    </sql>

    <sql id="studentSqlOne">
        id,name,age,email
    </sql>

    <!--动态sql if-->
    <select id="selectStudentIf" resultType="com.funky.domain.Student">
        select <include refid="studentSqlOne"></include> from student
        where 1=1
        <if test="name != null and name !='' ">
            and name = #{name}
        </if>
        <if test="age > 0">
            or age > #{age}
        </if>
    </select>


    <!--动态sql where-->
    <select id="selectStudentWhere" resultType="com.funky.domain.Student">
        <include refid="studentSql"></include>
        <where>
            <if test="name != null and name !='' ">
                and name = #{name}
            </if>
            <if test="age > 0">
                or age > #{age}
            </if>
        </where>

    </select>

    <!--foreach 用法1
            collection：表示接口中的方法参数的类型，如果是数组使用array，如果是list集合使用list
            item：自定义的，表示数组和集合成员的变量
            open：循环开始时的字符
            close：循环结束时的字符
            separator：集合成员之间的分隔符
    -->
    <select id="selectForeachOne" resultType="com.funky.domain.Student">
        <include refid="studentSql"></include> where id in
        <foreach collection="list" item="myid" open="(" close=")" separator=",">
            #{myid}
        </foreach>
    </select>

    <!--foreach 用法2-->
    <select id="selectForeachTwo" resultType="com.funky.domain.Student">
        <include refid="studentSql"></include> where id in
        <foreach collection="list" item="stu" open="(" close=")" separator=",">
            #{stu.id}
        </foreach>
    </select>
</mapper>
```

### 测试类
```java
public class TestMyBatis {

    @Test
    public void testSelectStudentIf() {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        StudentDao dao = sqlSession.getMapper(StudentDao.class);

        Student stu = new Student();
        stu.setName("lisi");
        stu.setAge(10);
        List<Student> students = dao.selectStudentIf(stu);
        for (Student s : students) {
            System.out.println("----- 学生 =" + s);
        }
    }

    @Test
    public void testSelectStudentWhere() {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        StudentDao dao = sqlSession.getMapper(StudentDao.class);

        Student stu = new Student();
//        stu.setName("lisi");
//        stu.setAge(10);
        List<Student> students = dao.selectStudentWhere(stu);
        for (Student s : students) {
            System.out.println("where=== 学生 =" + s);
        }
    }

    @Test
    public void testfor() {
        List<Integer> list = new ArrayList<>();
        list.add(1001);
        list.add(1002);
        list.add(1003);

        String sql = "select * from student where id in ";
        StringBuilder builder = new StringBuilder("");
        int init = 0;
        int len = list.size();
        builder.append("(");
        for (Integer i:list) {
            builder.append(i).append(",");
        }
        builder.deleteCharAt(builder.length()-1);
        builder.append(")");
        sql = sql + builder.toString();
        System.out.println("sql = " + sql);

    }

    @Test
    public void testSelectForeachOne() {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        StudentDao dao = sqlSession.getMapper(StudentDao.class);

        List<Integer> list = new ArrayList<>();
        list.add(1001);
        list.add(1002);
        list.add(1003);

        List<Student> students = dao.selectForeachOne(list);
        for (Student stu:students) {
            System.out.println("foreach--one ===" + stu);
        }
    }
    @Test
    public void testSelectForeachTwo() {
        SqlSession sqlSession = MyBatisUtils.getSqlSession();
        StudentDao dao = sqlSession.getMapper(StudentDao.class);

        List<Student> list = new ArrayList<>();
        Student s1 = new Student();
        s1.setId(1002);
        list.add(s1);

        s1 = new Student();
        s1.setId(1003);
        list.add(s1);

        List<Student> students = dao.selectForeachTwo(list);
        for (Student stu:students) {
            System.out.println("foreach--two ===" + stu);
        }
    }
}
```



## 参考
- [MyBatis从入门到精通](https://www.bilibili.com/video/BV185411s7Ry)