---
title: 【7. 通用的响应结果，统一异常捕获】
---


[[TOC]]

## 1. 通用的响应结果

### 1.1 常用API返回对象的接口
```java
/**
 * 常用API返回对象接口
 */
public interface IErrorCode {

    /**
     * 返回码
     */
    long getCode();

    /**
     * 返回信息
     */
    String getMessage();
}
```



### 1.2 响应的错误码枚举
```java
/**
 * 错误码枚举
 */
public enum ResponseCode implements IErrorCode {

    SUCCESS(200, "操作成功"),
    FAILED(500, "操作失败"),
    UNAUTHORIZED(401, "暂未登录或token已经过期"),
    FORBIDDEN(403, "没有相关权限"),
    VALIDATE_FAILED(404, "参数非法");

    private long code;
    private String message;

    ResponseCode(long code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public long getCode() {
        return code;
    }
    @Override
    public String getMessage() {
        return message;
    }
}
```


### 1.3 通用返回对象 工具类
```java
/**
 * 通用返回对象
 */
public class ResponseUtil<T> {
    // 状态码
    private long code;
    // 提示信息
    private String message;
    // 数据封装
    private T data;

    protected ResponseUtil() {
    }
    protected ResponseUtil(long code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /**
     * 成功返回结果
     * @param data 获取的数据
     */
    public static <T> ResponseUtil<T> success(T data) {
        return new ResponseUtil<T>(ResponseCode.SUCCESS.getCode(), ResponseCode.SUCCESS.getMessage(), data);
    }
    /**
     * 成功返回结果
     * @param data 获取的数据
     * @param  message 提示信息
     */
    public static <T> ResponseUtil<T> success(T data, String message) {
        return new ResponseUtil<T>(ResponseCode.SUCCESS.getCode(), message, data);
    }

    /**
     * 失败返回结果
     * @param errorCode 错误码
     */
    public static <T> ResponseUtil<T> failed(IErrorCode errorCode) {
        return new ResponseUtil<T>(errorCode.getCode(), errorCode.getMessage(), null);
    }
    /**
     * 失败返回结果
     * @param errorCode 错误码
     * @param message 错误信息
     */
    public static <T> ResponseUtil<T> failed(IErrorCode errorCode, String message) {
        return new ResponseUtil<T>(errorCode.getCode(), message, null);
    }
    /**
     * 失败返回结果
     * @param message 提示信息
     */
    public static <T> ResponseUtil<T> failed(String message) {
        return new ResponseUtil<T>(ResponseCode.FAILED.getCode(), message, null);
    }
    /**
     * 失败返回结果
     */
    public static <T> ResponseUtil<T> failed() {
        return failed(ResponseCode.FAILED);
    }

    /**
     * 参数验证失败返回结果
     */
    public static <T> ResponseUtil<T> validateFailed() {
        return failed(ResponseCode.VALIDATE_FAILED);
    }
    /**
     * 参数验证失败返回结果
     * @param message 提示信息
     */
    public static <T> ResponseUtil<T> validateFailed(String message) {
        return new ResponseUtil<T>(ResponseCode.VALIDATE_FAILED.getCode(), message, null);
    }

    /**
     * 未登录返回结果
     */
    public static <T> ResponseUtil<T> unauthorized(T data) {
        return new ResponseUtil<T>(ResponseCode.UNAUTHORIZED.getCode(), ResponseCode.UNAUTHORIZED.getMessage(), data);
    }

    /**
     * 未授权返回结果
     */
    public static <T> ResponseUtil<T> forbidden(T data) {
        return new ResponseUtil<T>(ResponseCode.FORBIDDEN.getCode(), ResponseCode.FORBIDDEN.getMessage(), data);
    }

    public long getCode() {
        return code;
    }
    public void setCode(long code) {
        this.code = code;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public T getData() {
        return data;
    }
    public void setData(T data) {
        this.data = data;
    }
}
```

### 1.4 外部使用
```java
ResponseUtil.success(null);
ResponseUtil.failed();
``` 




------------------------------------------------


## 2. 异常捕获

### 2.1 异常抛出及处理流程
- 如果service层的代码报异常了，可以使用try catch捕获异常，也可以在统一异常处理类中去捕获异常
- 自己写的代码，可以抛出`自定义异常`。除了自定义异常以外的异常都是 `不可预知异常`
- 不可预知的异常中有些异常是知道原因的，例如数据库连接不上等，可以从自己配置的异常Map中找到异常类型对应的错误代码以及错误信息，响应错误信息到外部
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/springboot/45.png" width="700"/>



### 2.2 创建自定义异常类
- 自定义异常（可预知的异常）CustomException，继承 RuntimeException，对代码没有侵入性
```java
/**
 * 自定义异常类型
 */
public class CustomException extends RuntimeException {

    // 错误码
    private IErrorCode errorCode;

    // 外部可以使用 throw new CustomException(ResponseCode.FAILED) 抛出异常
    public CustomException(IErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
    public CustomException(String message) {
        super(message);
    }


    public IErrorCode getErrorCode() {
        return errorCode;
    }
    public void setErrorCode(IErrorCode errorCode) {
        this.errorCode = errorCode;
    }
}
```



### 2.3 定义异常抛出类
```java
/**
 * 异常抛出类，用于抛出各种异常
 */
public class ExceptionCastUtil {

    // 抛出自定义异常  ExceptionCastUtil.cast(ResponseCode.FAILED)
    public static void cast(IErrorCode errorCode) {
        throw new CustomException(errorCode);
    }

    // 抛出自定义异常  ExceptionCastUtil.fail("错误原因")
    public static void fail(String message) {
        throw new CustomException(message);
    }
}
```

### 2.4 全局异常捕获
```java
import com.google.common.collect.ImmutableMap;
import com.funky.product.common.http.IErrorCode;
import com.funky.product.common.http.ResponseCode;
import com.funky.product.common.http.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 统一异常捕获类
 */

@ControllerAdvice // 控制器增强
public class GlobalExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);


    /**
     * 1. 对可预知的异常处理
     *      捕获自定义异常 CustomException
     */
    @ResponseBody // 将返回的结果转为json
    @ExceptionHandler(CustomException.class) // 只要遇到 CustomException，就会捕获到，调用 customException 方法
    public Object customException(CustomException customException) {
        IErrorCode errorCode = customException.getErrorCode();
        if (errorCode != null) {
            LOGGER.error("catch customException: {}",errorCode.getMessage());
            return ResponseUtil.failed(errorCode);
        }
        return ResponseUtil.failed(customException.getMessage());
    }


    /**
     * 2. 对不可预知的异常处理
     *       捕获Exception异常
     *
     *       捕获系统异常的步骤:
     *          1) 在GlobalExceptionHandler类中定义捕获Exception异常的方法
     *          2) 创建一个Map(ImmutableBiMap不可修改,且线程安全)，存放一些已知异常类和其对应的异常信息
     *          3) 捕获异常先判断Map集合是否包含指定异常,若包含，则返回对应的异常信息
     *          4) 若不包含，则统一返回 500异常
     */

    // 使用ImmutableMap 要导入com.google.guava依赖
    // 定义map，配置异常类型所对应的错误代码
    private static ImmutableMap<Class<? extends Throwable>, IErrorCode> EXCEPTIONS;
    // 定义map的builder对象，去构建ImmutableMap
    protected static ImmutableMap.Builder<Class<? extends Throwable>,IErrorCode> builder = ImmutableMap.builder();

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public Object exception(Exception exception){
        exception.printStackTrace();
        // 记录日志
        LOGGER.error("catch exception:{}",exception.getMessage());
        if(EXCEPTIONS == null){
            EXCEPTIONS = builder.build(); // EXCEPTIONS构建成功，构建成功以后就不可更改了
        }
        // 从EXCEPTIONS中找异常类型所对应的错误代码，如果找到了将错误代码响应给用户，如果找不到给用户响应99999异常
        IErrorCode resultCode = EXCEPTIONS.get(exception.getClass());
        if(resultCode != null){
            return ResponseUtil.failed(resultCode);
        }else{
            // 返回500，操作异常
            return ResponseUtil.failed();
        }
    }


    static {
        // 定义异常类型所对应的错误代码
        builder.put(HttpMessageNotReadableException.class, ResponseCode.VALIDATE_FAILED); // 参数非法
    }
}
```

### 2.5 在启动类中添加扫描
```java
@SpringBootApplication
// 扫描common包下的类，扫描到GlobalExceptionHandler就可以捕获全局异常了
@ComponentScan(basePackages = {"com.funky.product"}) 
public class FunkyApplication {
    public static void main(String[] args) {
        SpringApplication.run(FunkyApplication.class, args);
    }
}
```

### 2.6 在Service层使用
```java
// 抛出异常 - 使用异常的枚举
ExceptionCastUtil.cast(ResponseCode.FAILED)
// 抛出异常 - 直接描述失败原因
ExceptionCastUtil.fail("这里填写异常的原因");

// 具体不同功能模块的异常，可以创建新的类，实现IErrorCode接口，重新定义异常类型
```






## 参考
- [异常处理](https://www.bilibili.com/video/BV1Z54y1m7Ao?p=65)


