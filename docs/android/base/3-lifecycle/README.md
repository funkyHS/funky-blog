---
title: 【3. Activity生命周期,UI控件基础】
---

[[TOC]]


## 1. Activity生命周期
- [android文档-了解 Activity 生命周期](https://developer.android.com/guide/components/activities/activity-lifecycle?hl=zh-cn)


<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/15.png" width="500"/>


- 当系统资源紧张的时候，onPause和onStop 阶段的Activity，有可能会被系统杀掉
- Android四大组件：Activity、Broadcast Receiver、Service、Content Provider



### 1.1 onCreate
- 在系统首次创建 Activity 时触发
- 在 Activity 的整个生命周期中只应发生一次
- onCreate方法会接收 savedInstanceState 参数，后者是包含 Activity 先前保存状态的 Bundle 对象。如果 Activity 此前未曾存在，Bundle 对象的值为 null。
- 对一些控件和变量进行初始化等，此时Activity还在后台，不可见。所以动画不应该在这里初始化，因为看不到
```java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // 创建对象
    }
}
```

### 1.2 onStart
- Activity呈现到屏幕上的时候，回调此方法
- `onStart()` 方法会非常快速地完成，并且与“已创建”状态一样，Activity 不会一直处于“已开始”状态。
- 一旦此回调结束，Activity 便会进入“已恢复”状态，系统将调用 `onResume()` 方法
```java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onStart() {
        super.onStart();
        // 呈现到屏幕上
    }
}
```


### 1.3 onResume
- Activity可见，允许与用户进行交互
```java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onResume() {
        super.onResume();
        // 允许用户交互
    }
}
```


### 1.4 onPause
- 当前Activity不可见，失去焦点，用户没法交互
```java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onPause() {
        super.onPause();
        // 其他的Activity来到前台，会使当前Activity处于 onPause阶段
        // 当前Activity只是不可见，失去了焦点，用户没法交互
    }
}
```

### 1.5 onStop
```java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onStop() {
        super.onStop();
        // 当前Activity退到后台了，App不可见了，会进入onStop
    }
}
```

### 1.6 onDestroy
- 代码调用：`finish()`的时候，会回调`onDestroy()`
- 当屏幕翻转的时候，会将Activity销毁，重新创建
```java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Activity被摧毁
    }
}
```

### 1.7 onRestart
```java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onRestart() {
        super.onRestart();
        // 重新回到前台
    }
}
```




## 2. UI控件基础

- 控件样式
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/16.png" width="500"/>

- 运行效果
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/17.png" width="500"/>


- 界面布局
```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".UIControllerActivity">

    <TextView
        android:id="@+id/display_tv"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="32dp"
        android:text="TextView"
        android:textAlignment="center"
        android:textSize="30sp"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <Button
        android:id="@+id/left_btn"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="60dp"
        android:layout_marginTop="44dp"
        android:text="@string/left"
        app:layout_constraintBottom_toTopOf="@+id/guideline8"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="@+id/guideline8" />

    <Button
        android:id="@+id/right_btn"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/right"
        app:layout_constraintBottom_toTopOf="@+id/guideline8"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="@+id/guideline9"
        app:layout_constraintTop_toTopOf="@+id/guideline8" />

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline8"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_percent="0.15046297" />

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline10"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_percent="0.22" />

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline11"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_percent="0.29" />

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline12"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_percent="0.35" />

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline13"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_percent="0.41" />

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline14"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintDimensionRatio="w,1:1"
        app:layout_constraintGuide_percent="0.51" />

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline15"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_percent="0.61" />

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline16"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_percent="0.69" />

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline17"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_percent="0.77" />

    <androidx.constraintlayout.widget.Barrier
        android:id="@+id/barrier"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:barrierDirection="left" />

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline9"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        app:layout_constraintGuide_percent="0.5" />

    <Switch
        android:id="@+id/open_switch"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/open"
        app:layout_constraintBottom_toTopOf="@+id/guideline10"
        app:layout_constraintEnd_toStartOf="@+id/guideline9"
        app:layout_constraintStart_toStartOf="@+id/guideline9"
        app:layout_constraintTop_toTopOf="@+id/guideline10" />

    <ProgressBar
        android:id="@+id/cycle_progress_bar"
        style="?android:attr/progressBarStyle"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:layout_constraintBottom_toTopOf="@+id/guideline11"
        app:layout_constraintEnd_toStartOf="@+id/guideline9"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="@+id/guideline11" />
    
    <ProgressBar
        android:id="@+id/progressBar3"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:indeterminate="true"
        app:layout_constraintBottom_toTopOf="@+id/guideline11"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="@+id/guideline9"
        app:layout_constraintTop_toTopOf="@+id/guideline11" />

    <ProgressBar
        android:id="@+id/line_progress_bar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_marginStart="24dp"
        android:layout_marginEnd="24dp"
        app:layout_constraintBottom_toTopOf="@+id/guideline12"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="@+id/guideline12" />

    <EditText
        android:id="@+id/number_et"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_marginStart="24dp"
        android:layout_marginEnd="24dp"
        android:ems="10"
        android:hint="请输入数值"
        android:inputType="number"
        android:textAlignment="center"
        app:layout_constraintBottom_toTopOf="@+id/guideline13"
        app:layout_constraintEnd_toStartOf="@+id/guideline9"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="@+id/guideline13" />

    <Button
        android:id="@+id/confirm_btn"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/confirm"
        app:layout_constraintBottom_toTopOf="@+id/guideline13"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="@+id/guideline9"
        app:layout_constraintTop_toTopOf="@+id/guideline13" />

    <RadioGroup
        android:id="@+id/radioGroup"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:layout_constraintBottom_toTopOf="@+id/guideline14"
        app:layout_constraintEnd_toStartOf="@+id/guideline9"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="@+id/guideline14">

        <RadioButton
            android:id="@+id/discover_radio_button"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="发现" />

        <RadioButton
            android:id="@+id/check_radio_button"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="审核" />

    </RadioGroup>

    <ImageView
        android:id="@+id/imageView2"
        android:layout_width="0dp"
        android:layout_height="80dp"
        app:layout_constraintBottom_toTopOf="@+id/guideline14"
        app:layout_constraintDimensionRatio="w,1:1"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="@+id/guideline9"
        app:layout_constraintTop_toTopOf="@+id/guideline14"
        app:srcCompat="@drawable/review" />

    <SeekBar
        android:id="@+id/seekBar"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_marginStart="24dp"
        android:layout_marginEnd="24dp"
        app:layout_constraintBottom_toTopOf="@+id/guideline15"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="@+id/guideline15" />

    <CheckBox
        android:id="@+id/chinese_check_box"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="语文"
        app:layout_constraintBottom_toTopOf="@+id/guideline16"
        app:layout_constraintEnd_toStartOf="@+id/math_check_box"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="@+id/guideline16" />

    <CheckBox
        android:id="@+id/math_check_box"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="数学"
        app:layout_constraintBottom_toBottomOf="@+id/chinese_check_box"
        app:layout_constraintEnd_toStartOf="@+id/english_check_box"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toEndOf="@+id/chinese_check_box"
        app:layout_constraintTop_toTopOf="@+id/chinese_check_box" />

    <CheckBox
        android:id="@+id/english_check_box"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="英语"
        app:layout_constraintBottom_toBottomOf="@+id/math_check_box"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.5"
        app:layout_constraintStart_toEndOf="@+id/math_check_box"
        app:layout_constraintTop_toTopOf="@+id/math_check_box" />

    <RatingBar
        android:id="@+id/ratingBar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:layout_constraintBottom_toTopOf="@+id/guideline17"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="@+id/guideline17" />

</androidx.constraintlayout.widget.ConstraintLayout>
```


- Activity绑定布局
```java
public class UIControllerActivity extends AppCompatActivity {

    TextView displayTextView;
    Button buttonLeft,buttonRight, buttonConfirm;
    Switch openSwitch;
    ProgressBar lineProgressBar;
    EditText numberEditText;
    RadioGroup radioGroup;
    ImageView imageView;
    SeekBar seekBar;
    CheckBox checkBoxChinese, checkBoxMath, checkBoxEnglish;
    RatingBar ratingBar;

    String chinese = "";
    String math = "";
    String english = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_uicontroller);

        displayTextView = findViewById(R.id.display_tv);
        buttonLeft = findViewById(R.id.left_btn);
        buttonRight = findViewById(R.id.right_btn);
        buttonConfirm = findViewById(R.id.confirm_btn);
        openSwitch = findViewById(R.id.open_switch);
        lineProgressBar = findViewById(R.id.line_progress_bar);
        numberEditText = findViewById(R.id.number_et);
        radioGroup = findViewById(R.id.radioGroup);
        imageView = findViewById(R.id.imageView2);
        seekBar = findViewById(R.id.seekBar);
        checkBoxChinese = findViewById(R.id.chinese_check_box);
        checkBoxMath = findViewById(R.id.math_check_box);
        checkBoxEnglish = findViewById(R.id.english_check_box);
        ratingBar = findViewById(R.id.ratingBar);

        // 匿名内部类的方式 添加点击事件
        buttonLeft.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                displayTextView.setText(R.string.left);
            }
        });
        buttonRight.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                displayTextView.setText(R.string.right);
            }
        });
        // switch按钮
        openSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (b) {
                    displayTextView.setText(R.string.open);
                } else {
                    displayTextView.setText(R.string.close);
                }
            }
        });

        // 按钮点击，获取数值，改变lineProgressBar的进度值
        buttonConfirm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String s = numberEditText.getText().toString();
                if (TextUtils.isEmpty(s)) {
                    s = "0";
                }
                lineProgressBar.setProgress(Integer.valueOf(s));
                displayTextView.setText(s);
            }
        });
        // radioGroup
        radioGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup radioGroup, int i) {
                // i 是radiobutton的编号（is）
                if (i == R.id.discover_radio_button) {
                    imageView.setImageResource(R.drawable.search);
                    displayTextView.setText("search");
                } else {
                    imageView.setImageResource(R.drawable.review);
                    displayTextView.setText("review");
                }
            }
        });
        // 可以拖动的进度
        seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int i, boolean b) {
                displayTextView.setText(String.valueOf(i));
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {

            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {

            }
        });

        // checkBox 语文
        checkBoxChinese.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (b) {
                    chinese = "语文";
                } else {
                    chinese = "";
                }
                displayTextView.setText(chinese + math + english);
            }
        });
        // checkBox 数学
        checkBoxMath.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (b) {
                    math = "数学";
                } else {
                    math = "";
                }
                displayTextView.setText(chinese + math + english);
            }
        });
        // checkBox 英语
        checkBoxEnglish.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (b) {
                    english = "英语";
                } else {
                    english = "";
                }
                displayTextView.setText(chinese + math + english);
            }
        });

        // 星星评分
        ratingBar.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            @Override
            public void onRatingChanged(RatingBar ratingBar, float v, boolean b) {
                Toast.makeText(getApplicationContext(), String.valueOf(v)+"星评价！", Toast.LENGTH_LONG).show();
            }
        });
    }
}
```





## 参考
- [Android开发教程](https://www.bilibili.com/video/BV1f4411a74h)


