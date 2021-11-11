---
title: 【5. ViewModel,LiveData,DataBinding,SharedPreferences】
---

[[TOC]]


## 1. ViewModel 加减数实例
- [jetpack](https://developer.android.com/jetpack)

- 将数据放在viewModel中处理，当翻转屏幕方向，或者重新设置语言（Activity被重新创建的时候），不需要处理保存数据等操作
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/26.png" width="400"/>


- MyViewModel.java
```java
package com.funky.a3_viewmodel;

import androidx.lifecycle.ViewModel;

public class MyViewModel extends ViewModel {
    public int number = 0;
}
```

- MainActivity.java
```java
package com.funky.a3_viewmodel;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.lifecycle.ViewModelProviders;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    MyViewModel myViewModel;
    TextView textView;
    Button addBtn, reduceBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 创建viewmodel对象
        // myViewModel = ViewModelProvider(this)[MyViewModel::class.java] // Kotlin
        // myViewModel = ViewModelProviders.of(this).get(MyViewModel.class); // java 废弃
        myViewModel = new ViewModelProvider(this).get(MyViewModel.class);

        textView = findViewById(R.id.textView);
        addBtn = findViewById(R.id.add_btn);
        reduceBtn = findViewById(R.id.reduce_btn);

        // 翻转屏幕方向，Activity会重新创建，这里重新赋值
        textView.setText(String.valueOf(myViewModel.number));

        addBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myViewModel.number++;
                textView.setText(String.valueOf(myViewModel.number));
            }
        });
        reduceBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myViewModel.number--;
                textView.setText(String.valueOf(myViewModel.number));
            }
        });
    }
}
```



---------------------------------------------



## 2. ViewModel+LiveData 加减数实例
- 底层数据改变时，自动通知界面

- ViewModelWithLiveData.java
```java
package com.funky.a3_viewmodel;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class ViewModelWithLiveData extends ViewModel {

    // 使用LiveData
    private MutableLiveData<Integer> likedNumber;

    public MutableLiveData<Integer> getLikedNumber() {
        if (likedNumber == null) {
            likedNumber = new MutableLiveData<>();
            likedNumber.setValue(0);
        }
        return likedNumber;
    }

    public void addLikedNumber(int a) {
        likedNumber.setValue(likedNumber.getValue() + a);
    }
}
```

- MainActivity.java
```java
package com.funky.a3_viewmodel;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    ViewModelWithLiveData viewModelWithLiveData;
    TextView textView;
    Button addBtn, reduceBtn;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        textView = findViewById(R.id.textView);
        addBtn = findViewById(R.id.add_btn);
        reduceBtn = findViewById(R.id.reduce_btn);

        // 创建viewmodel
        viewModelWithLiveData = new ViewModelProvider(this).get(ViewModelWithLiveData.class);

        // 观察LiveData值的改变
        viewModelWithLiveData.getLikedNumber().observe(this, new Observer<Integer>() {
            @Override
            public void onChanged(Integer integer) {
                textView.setText(String.valueOf(integer));
            }
        });

        addBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // 修改LiveData值
                viewModelWithLiveData.addLikedNumber(1);
            }
        });
        reduceBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // 修改LiveData值
                viewModelWithLiveData.addLikedNumber(-1);
            }
        });
    }
}
```




---------------------------------------------



## 3. ViewModel+LiveData+DataBinging 加减数实例
- 将数据绑定到View

- 在build.gradle(Module)中添加
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/27.png" width="400"/>


- 具体实现（ActivityMainBinding 名称取决于 layout的名称）
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/28.png" width="700"/>



---------------------------------------------



## 4. 篮球记分实例

- 运行效果
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/29.png" width="400"/>

- 创建矢量图
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/30.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/31.png" width="500"/>


- 创建ViewModel，ScoreViewModel.java
```java
package com.funky.a3_viewmodel;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class ScoreViewModel extends ViewModel {

    private MutableLiveData<Integer> aTeamScore;
    private MutableLiveData<Integer> bTeamScore;
    private int aBack,bBack;

    public MutableLiveData<Integer> getaTeamScore() {
        if (aTeamScore == null) {
            aTeamScore = new MutableLiveData<>();
            aTeamScore.setValue(0);
        }
        return aTeamScore;
    }
    public MutableLiveData<Integer> getbTeamScore() {
        if (bTeamScore == null) {
            bTeamScore = new MutableLiveData<>();
            bTeamScore.setValue(0);
        }
        return bTeamScore;
    }
    // a队分数增加
    public void aTeamAdd(int p) {
        aBack = aTeamScore.getValue();
        bBack = bTeamScore.getValue();
        aTeamScore.setValue(aTeamScore.getValue() + p);
    }
    // b队分数增加
    public void bTeamAdd(int p) {
        aBack = aTeamScore.getValue();
        bBack = bTeamScore.getValue();
        bTeamScore.setValue(bTeamScore.getValue() + p);
    }
    // 重置
    public void reset() {
        aBack = aTeamScore.getValue();
        bBack = bTeamScore.getValue();
        aTeamScore.setValue(0);
        bTeamScore.setValue(0);
    }
    // 撤销
    public void undo() {
        aTeamScore.setValue(aBack);
        bTeamScore.setValue(bBack);
    }
}
```


- 在module的 build.gradle中添加如下
```java
android {
    //...
    defaultConfig {
        //....
        android.defaultConfig.vectorDrawables.useSupportLibrary = true
        dataBinding {
            enabled true
        }
    }
}
```


- layout布局，activity_score.java
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/32.png" width="500"/>

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools">

    <!--生成一个变量，变量名为data，类型为ScoreViewModel-->
    <data>
        <variable
            name="data"
            type="com.funky.a3_viewmodel.ScoreViewModel" />
    </data>

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        tools:context=".ScoreActivity">

        <androidx.constraintlayout.widget.Guideline
            android:id="@+id/guideline"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            app:layout_constraintGuide_percent="0.5" />

        <androidx.constraintlayout.widget.Guideline
            android:id="@+id/guideline11"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            app:layout_constraintGuide_percent="0.95" />

        <androidx.constraintlayout.widget.Guideline
            android:id="@+id/guideline10"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            app:layout_constraintGuide_percent="0.05" />

        <androidx.constraintlayout.widget.Guideline
            android:id="@+id/guideline2"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            app:layout_constraintGuide_percent="0.05" />

        <androidx.constraintlayout.widget.Guideline
            android:id="@+id/guideline3"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            app:layout_constraintGuide_percent="0.15" />

        <androidx.constraintlayout.widget.Guideline
            android:id="@+id/guideline4"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            app:layout_constraintGuide_percent="0.35" />

        <androidx.constraintlayout.widget.Guideline
            android:id="@+id/guideline5"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            app:layout_constraintGuide_percent="0.500684" />

        <androidx.constraintlayout.widget.Guideline
            android:id="@+id/guideline8"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            app:layout_constraintGuide_percent="0.65" />

        <androidx.constraintlayout.widget.Guideline
            android:id="@+id/guideline6"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            app:layout_constraintGuide_percent="0.8" />

        <androidx.constraintlayout.widget.Guideline
            android:id="@+id/guideline7"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            app:layout_constraintGuide_percent="0.9" />

        <TextView
            android:id="@+id/left_tv"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/left_textview"
            android:textSize="@dimen/teamTextSize"
            app:layout_constraintBottom_toTopOf="@+id/guideline3"
            app:layout_constraintEnd_toStartOf="@+id/guideline"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="@+id/guideline2" />

        <TextView
            android:id="@+id/right_tv"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/right_textview"
            android:textSize="@dimen/teamTextSize"
            app:layout_constraintBottom_toTopOf="@+id/guideline3"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="@+id/guideline"
            app:layout_constraintTop_toTopOf="@+id/guideline2" />

        <!-- @{String.valueOf(data.getaTeamScore())} -->
        <TextView
            android:id="@+id/left_score_tv"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@{String.valueOf(data.getaTeamScore())}"
            android:textColor="@android:color/holo_red_dark"
            android:textSize="@dimen/scoreTextSize"
            app:layout_constraintBottom_toTopOf="@+id/guideline4"
            app:layout_constraintEnd_toStartOf="@+id/guideline"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="@+id/guideline3" />

        <!-- @{String.valueOf(data.getbTeamScore())} -->
        <TextView
            android:id="@+id/right_score_tv"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@{String.valueOf(data.getbTeamScore())}"
            android:textColor="@android:color/holo_green_dark"
            android:textSize="@dimen/scoreTextSize"
            app:layout_constraintBottom_toTopOf="@+id/guideline4"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="@+id/guideline"
            app:layout_constraintTop_toTopOf="@+id/guideline3" />
        <!-- @{()->data.aTeamAdd(1)} -->
        <Button
            android:id="@+id/left_btn1"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/button1"
            android:onClick="@{()->data.aTeamAdd(1)}"
            android:textSize="@dimen/buttonTextSize"
            app:backgroundTint="@android:color/holo_red_dark"
            app:layout_constraintBottom_toTopOf="@+id/guideline5"
            app:layout_constraintEnd_toStartOf="@+id/guideline"
            app:layout_constraintStart_toStartOf="@+id/guideline10"
            app:layout_constraintTop_toTopOf="@+id/guideline4" />
        <!-- @{()->data.bTeamAdd(1)} -->
        <Button
            android:id="@+id/right_btn1"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/button1"
            android:onClick="@{()->data.bTeamAdd(1)}"
            android:textSize="@dimen/buttonTextSize"
            app:backgroundTint="@android:color/holo_green_dark"
            app:layout_constraintBottom_toTopOf="@+id/guideline5"
            app:layout_constraintEnd_toStartOf="@+id/guideline11"
            app:layout_constraintStart_toStartOf="@+id/guideline"
            app:layout_constraintTop_toTopOf="@+id/guideline4" />
        <!-- @{()->data.aTeamAdd(2)} -->
        <Button
            android:id="@+id/left_btn2"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/button2"
            android:onClick="@{()->data.aTeamAdd(2)}"
            android:textSize="@dimen/buttonTextSize"
            app:backgroundTint="@android:color/holo_red_dark"
            app:layout_constraintBottom_toTopOf="@+id/guideline8"
            app:layout_constraintEnd_toStartOf="@+id/guideline"
            app:layout_constraintStart_toStartOf="@+id/guideline10"
            app:layout_constraintTop_toTopOf="@+id/guideline5"
            app:layout_constraintVertical_bias="0.442" />
        <!-- @{()->data.bTeamAdd(2)} -->
        <Button
            android:id="@+id/right_btn2"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/button2"
            android:onClick="@{()->data.bTeamAdd(2)}"
            android:textSize="@dimen/buttonTextSize"
            app:backgroundTint="@android:color/holo_green_dark"
            app:layout_constraintBottom_toTopOf="@+id/guideline8"
            app:layout_constraintEnd_toStartOf="@+id/guideline11"
            app:layout_constraintStart_toStartOf="@+id/guideline"
            app:layout_constraintTop_toTopOf="@+id/guideline5" />
        <!-- @{()->data.aTeamAdd(3)} -->
        <Button
            android:id="@+id/left_btn3"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/button3"
            android:onClick="@{()->data.aTeamAdd(3)}"
            android:textSize="@dimen/buttonTextSize"
            app:backgroundTint="@android:color/holo_red_dark"
            app:layout_constraintBottom_toTopOf="@+id/guideline6"
            app:layout_constraintEnd_toStartOf="@+id/guideline"
            app:layout_constraintStart_toStartOf="@+id/guideline10"
            app:layout_constraintTop_toTopOf="@+id/guideline8" />
        <!-- @{()->data.bTeamAdd(3)} -->
        <Button
            android:id="@+id/right_btn3"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/button3"
            android:onClick="@{()->data.bTeamAdd(3)}"
            android:textSize="@dimen/buttonTextSize"
            app:backgroundTint="@android:color/holo_green_dark"
            app:layout_constraintBottom_toTopOf="@+id/guideline6"
            app:layout_constraintEnd_toStartOf="@+id/guideline11"
            app:layout_constraintStart_toStartOf="@+id/guideline"
            app:layout_constraintTop_toTopOf="@+id/guideline8" />
        <!-- @{()->data.undo()} -->
        <ImageButton
            android:id="@+id/imageButton"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:onClick="@{()->data.undo()}"
            android:contentDescription="@string/resetButton"
            app:layout_constraintBottom_toTopOf="@+id/guideline7"
            app:layout_constraintEnd_toStartOf="@+id/guideline"
            app:layout_constraintHorizontal_bias="0.759"
            app:layout_constraintStart_toStartOf="@+id/guideline10"
            app:layout_constraintTop_toTopOf="@+id/guideline6"
            app:srcCompat="@drawable/ic_baseline_undo_24" />
        <!-- @{()->data.reset()} -->
        <ImageButton
            android:id="@+id/imageButton2"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:onClick="@{()->data.reset()}"
            android:contentDescription="@string/undoButton"
            app:layout_constraintBottom_toTopOf="@+id/guideline7"
            app:layout_constraintEnd_toStartOf="@+id/guideline11"
            app:layout_constraintHorizontal_bias="0.233"
            app:layout_constraintStart_toStartOf="@+id/guideline"
            app:layout_constraintTop_toTopOf="@+id/guideline6"
            app:srcCompat="@drawable/ic_baseline_loop_24" />

    </androidx.constraintlayout.widget.ConstraintLayout>
</layout>
```


- ScoreActivity.java
```java
package com.funky.a3_viewmodel;

import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;
import androidx.lifecycle.ViewModelProvider;
import android.os.Bundle;
import com.funky.a3_viewmodel.databinding.ActivityScoreBinding;

public class ScoreActivity extends AppCompatActivity {

    ScoreViewModel scoreViewModel;
    ActivityScoreBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // setContentView(R.layout.activity_score);
        binding = DataBindingUtil.setContentView(this, R.layout.activity_score);
        scoreViewModel = new  ViewModelProvider(this).get(ScoreViewModel.class);
        binding.setData(scoreViewModel);
        binding.setLifecycleOwner(this);
    }
}
```


---------------------------------------------


## 5. ViewModel状态保存

- 当app在后台，系统内存紧张的时候，app会被系统销毁，此时再次进入app，之前viewmodel中存储的数据，都没有了
- 需求：使用之前 篮球记分实例，当app在后台被系统销毁后，再次进入app，之前记录的数据仍然存在
- 下面的两种方式，当点击`返回`退出app的时候，再次进入app，数据不会恢复，如果需要恢复，就需要做数据的持久化

### 5.1 方式一：之前的处理方式
- ScoreActivity.java
```java
public class ScoreActivity extends AppCompatActivity {
    ScoreViewModel scoreViewModel;
    ActivityScoreBinding binding;

    final static String KEY_ATEAM_SCORE = "aTeam_Score";
    final static String KEY_BTEAM_SCORE = "bTeam_Score";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // setContentView(R.layout.activity_score);
        binding = DataBindingUtil.setContentView(this, R.layout.activity_score);
        scoreViewModel = new  ViewModelProvider(this).get(ScoreViewModel.class);
        binding.setData(scoreViewModel);
        binding.setLifecycleOwner(this);

        // 判断之前是否保存的有数据
        if (savedInstanceState != null) {
            scoreViewModel.getaTeamScore().setValue(savedInstanceState.getInt(KEY_ATEAM_SCORE));
            scoreViewModel.getbTeamScore().setValue(savedInstanceState.getInt(KEY_BTEAM_SCORE));
        }
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        // app被杀死前 保存数据
        outState.putInt(KEY_ATEAM_SCORE, scoreViewModel.getaTeamScore().getValue());
        outState.putInt(KEY_BTEAM_SCORE, scoreViewModel.getbTeamScore().getValue());
    }
}
```


### 5.2 方式二：ViewModel SavedState
- ScoreActivity.java
```java
public class ScoreActivity extends AppCompatActivity {

    ScoreViewModel scoreViewModel;
    ActivityScoreBinding binding;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // setContentView(R.layout.activity_score);

        binding = DataBindingUtil.setContentView(this, R.layout.activity_score);

        // 这里要创建 SavedStateViewModelFactory，作为参数
        scoreViewModel = new  ViewModelProvider(this, new SavedStateViewModelFactory(getApplication(), this)).get(ScoreViewModel.class);

        binding.setData(scoreViewModel);
        binding.setLifecycleOwner(this);
    }
}
```

- ScoreViewModel.java
```java
public class ScoreViewModel extends ViewModel {

    final static String KEY_ATEAM_SCORE = "aTeamScore";
    final static String KEY_BTEAM_SCORE = "bTeamScore";

    private int aBack,bBack;

    private SavedStateHandle handle;
    public ScoreViewModel(SavedStateHandle handle) {
        this.handle = handle;
    }

    public MutableLiveData<Integer> getaTeamScore() {
        if (!handle.contains(KEY_ATEAM_SCORE)) {
            handle.set(KEY_ATEAM_SCORE, 0);
        }
        return handle.getLiveData(KEY_ATEAM_SCORE);
    }

    public MutableLiveData<Integer> getbTeamScore() {
        if (!handle.contains(KEY_BTEAM_SCORE)) {
            handle.set(KEY_BTEAM_SCORE, 0);
        }
        return handle.getLiveData(KEY_BTEAM_SCORE);
    }

    public void aTeamAdd(int p) {
        aBack = getaTeamScore().getValue();
        bBack = getbTeamScore().getValue();
        getaTeamScore().setValue(getaTeamScore().getValue() + p);
    }
    public void bTeamAdd(int p) {
        aBack = getaTeamScore().getValue();
        bBack = getbTeamScore().getValue();
        getbTeamScore().setValue(getbTeamScore().getValue() + p);
    }

    public void reset() {
        aBack = getaTeamScore().getValue();
        bBack = getbTeamScore().getValue();
        getaTeamScore().setValue(0);
        getbTeamScore().setValue(0);
    }

    public void undo() {
        getaTeamScore().setValue(aBack);
        getbTeamScore().setValue(bBack);
    }
}
```



---------------------------------------------


## 6. SharedPreferences数据永久保存

```java
// 1. 使用 getPreferences
// 不允许传入名称，系统会以activity的名称创建一个文件，activity独有的数据
// SharedPreferences sp = getPreferences(Context.MODE_PRIVATE);

// 2. 使用 getSharedPreferences
// 可以指定名称，做为共享的数据，允许应用程序中其他的class，activity等访问
SharedPreferences sp = getSharedPreferences("MY_DATA", MODE_PRIVATE);

// 存数据
SharedPreferences.Editor editor = sp.edit();
editor.putInt("NUMBER",100);
editor.apply(); // 非同步的方式提交操作，
// editor.commit();

// 读数据
int x = sp.getInt("NUMBER", 0);    
```

- 简单封装 MyData.java
```java
public class MyData {
    public int number;
    private Context context;
    public MyData(Context context) {
        this.context = context;
    }

    public void save() {
        String name = context.getResources().getString(R.string.MY_DATA);
        SharedPreferences sp = context.getSharedPreferences(name, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        String key = context.getResources().getString(R.string.MY_KEY);
        editor.putInt(key, number);
        editor.apply();
    }
    public int load() {
        String name = context.getResources().getString(R.string.MY_DATA);
        SharedPreferences sp = context.getSharedPreferences(name, Context.MODE_PRIVATE);
        String key = context.getResources().getString(R.string.MY_KEY);
        int x = sp.getInt(key, context.getResources().getInteger(R.integer.defValue));
        number = x;
        return x;
    }
}
```

- 外部使用
```java
// 不能传入 this作为参数，防止内存泄漏，Activity有可能会被系统销毁
MyData myData = new MyData(getApplicationContext());
myData.number = 1000;
myData.save();
int y = myData.load();
Log.d("myLog", "y = " + y);
```



---------------------------------------------


## 7. 可以访问SharedPreferences的ViewModel
- 让ViewModel继承AndroidViewModel，重写构造方法
```java
public class MyViewModel extends AndroidViewModel {

    private SavedStateHandle handle;
    private String key = getApplication().getResources().getString(R.string.MY_KEY);
    private String spName = getApplication().getResources().getString(R.string.MY_DATA);

    public MyViewModel(@NonNull Application application, SavedStateHandle handle) {
        super(application);
        this.handle = handle;
        if (!handle.contains(key)) {
            load();
        }
    }
    public LiveData<Integer> getNumber() {
        return handle.getLiveData(key);
    }

    private void load() {
        SharedPreferences sp = getApplication().getSharedPreferences(spName, Context.MODE_PRIVATE);
        int x = sp.getInt(key, 0);
        handle.set(key, x);
    }

    void save() {
        SharedPreferences sp = getApplication().getSharedPreferences(spName, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.putInt(key, getNumber().getValue());
        editor.apply();
    }
    public void add(int x) {
        handle.set(key, getNumber().getValue() + x);
        // save(); 可以在这里保存，也可以放在MainActivity的onPause方法中调用保存
    }
}

```


- MainActivity.jave
```java
public class MainActivity extends AppCompatActivity {
    //...
    @Override
    protected void onPause() {
        super.onPause();
        myViewModel.save();
    }
}
```


## 8. ViewModel实例化的新方式 加减数实例

- MyViewModel.kt
```kotlin
private val _number = MutableLiveData<Int>().also{
    it.value = 0
}
val number : LiveData<Int> = _number
fun addOne() {
    _number.value = _number.value?.plus(1)
}
```

- MainActivity.kt
```kotlin
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activitu_main)
        val myViewModel: MyViewModel = ViewModelProvider(this, ViewModelProvider.NewInstanceFactory()).get(MyViewModel::class.java)
    }
}
```



## 参考
- [Android开发教程](https://www.bilibili.com/video/BV1f4411a74h)

