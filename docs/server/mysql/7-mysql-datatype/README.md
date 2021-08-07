---
title: 【7. MySQL字段类型】
---


[[TOC]]


## 1. 数值类型
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/7/1.png" width="500"/>

### 1.1 整型
- tinyint、smallint、mediumint、int、integer、bigint
- 关键字int是integer的同义词
- 整型主要用于存储整数值。默认是有符号的，若只需存储无符号值，可增加 unsigned 属性
- 存储字节越小，占用空间越小。本着最小化存储的原则，尽量选择合适的整型，例如：存储一些状态值或人的年龄可以用 tinyint ；主键列，无负数，建议使用 int unsigned 或者 bigint unsigned，预估字段数字取值会超过 42 亿，使用 bigint 类型。


### 1.2 浮点型
- float、double
- 浮点型在数据库中存放的是近似值，例如float(6,3)，如果插入一个数123.45678，实际数据库里存的是123.457，但总个数还以实际为准，即6位，整数部分最大是3位。 float 和 double 平时用的不太多


### 1.3 定点型
- decimal
- 主要用于存储有精度要求的小数
- DECIMAL 从 MySQL 5.1 引入，列的声明语法是 DECIMAL(M,D) 
- NUMERIC 与 DECIMAL 同义，如果字段类型定义为 NUMERIC ，则将自动转成 DECIMAL
- 对于声明语法 DECIMAL(M,D) ，自变量的值范围如下：
    - M是最大位数（精度），范围是1到65。可不指定，默认值是10
    - D是小数点右边的位数（小数位）。范围是0到30，并且不能大于M，可不指定，默认值是0
- 例如字段 salary DECIMAL(5,2)，能够存储具有五位数字和两位小数的任何值，因此可以存储在salary列中的值的范围是从-999.99到999.99


## 2. 字符串类型
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/7/3.png" width="500"/>
- char、varchar、tinyblob、tinytext、blob、text、mediumblob、mediumtext、longblob、longtext
- 其中 char 和 varchar 是最常用到的
    - char 类型是定长的，MySQL 总是根据定义的字符串长度分配足够的空间。当保存 char 值时，在它们的右边填充空格以达到指定的长度，当检索到 char 值时，尾部的空格被删除掉。
    - varchar 类型用于存储可变长字符串，存储时，如果字符没有达到定义的位数，也不会在后面补空格。
    - char(M) 与 varchar(M) 中的的 M 表示保存的最大字符数，单个字母、数字、中文等都是占用一个字符。char 适合存储很短的字符串，或者所有值都接近同一个长度。例如，char 非常适合存储密码的 MD5 值，因为这是一个定长的值。对于字符串很长或者所要存储的字符串长短不一的情况，varchar 更加合适。
- 我们在定义字段最大长度时应该按需分配，提前做好预估，能使用 varchar 类型就尽量不使用 text 类型。除非有存储长文本数据需求时，再考虑使用 text 类型
- BLOB 类型主要用于存储二进制大对象，例如可以存储图片，音视频等文件。日常很少用到，有存储二进制字符串时可以考虑使用。


## 3. 日期时间类型
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/database/mysql/7/2.png" width="500"/>
- date、time、year、datetime、timestamp
- 关于 DATETIME 与 TIMESTAMP 两种类型如何选用，可以按照存储需求来，比如要求存储范围更广，则推荐使用 DATETIME ，如果只是存储当前时间戳，则可以使用 TIMESTAMP 类型。不过值得注意的是，TIMESTAMP 字段数据会随着系统时区而改变但 DATETIME 字段数据不会。总体来说 DATETIME 使用范围更广

## 参考
- [MySQL数据类型](https://www.runoob.com/mysql/mysql-data-types.html)
- [MySQL字段类型最全解析](https://segmentfault.com/a/1190000039139882)