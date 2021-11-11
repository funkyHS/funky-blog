---
title: 【4. 本地化与多语言支持,屏幕方向旋转】
---

[[TOC]]


## 1. 本地化与多语言支持
- app在不同语言下，可以自动适配

- 选择`string.xml` --> `open editor`
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/18.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/19.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/20.png" width="500"/>


## 2. 屏幕方向旋转
- 可以看到系统拨打电话的页面，横竖屏幕，页面的布局是不同的
- 锁定屏幕处于竖直状态
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/21.png" width="500"/>

- 不同屏幕方向，对应不同界面布局
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/22.png" width="400"/>
- 会自动生成 land方向的xml布局文件
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/23.png" width="300"/>

- 竖版布局，横版布局
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/24.png" width="400"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/25.png" width="400"/>


- 当屏幕发生翻转，系统会销毁Activity，然后重新创建新的Activity，一些临时的信息会丢失
```java
public class OrientationActivity extends AppCompatActivity {

    private static final String TAG = "OrientationActivity";
    TextView textView;
    Button button;

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        // 当横竖屏的时候，在这里进行保存，这里保存不是永久保存
        outState.putString("KEY",textView.getText().toString());
        Log.d(TAG, "value: " + textView.getText().toString());
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_orientation);

        textView = findViewById(R.id.textView);
        button = findViewById(R.id.button3);

        // 在这里取出 翻转屏幕前存储的值
        if (savedInstanceState != null) {
            textView.setText(savedInstanceState.getString("KEY"));
        }

        // 点击按钮，更改textView的值
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                textView.setText("Funky");
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "onDestroy: ");
    }
}
```






## 参考
- [Android开发教程](https://www.bilibili.com/video/BV1f4411a74h)

