---
title: 【6. jetpack-Navigation组件】
---

[[TOC]]

## 1. 页面导航 Navigation组件基础

- 创建HomeFragment,DetailFragment
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/33.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/34.png" width="400"/>


- 对`fragment_home`进行布局
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/35.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/36.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/37.png" width="600"/>

- 同上步骤，对`fragment_detail`进行布局
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/38.png" width="600"/>


- 创建资源文件 Navigation my_nav_graph.xml
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/39.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/40.png" width="600"/>

- 添加依赖提示
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/41.png" width="600"/>

- 编辑导航逻辑的图形化界面
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/42.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/43.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/44.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/45.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/46.png" width="600"/>

- 此时就制作好了Navigation，这里提示
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/47.png" width="600"/>

- 进入activity_main.xml页面
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/48.png" width="700"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/49.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/50.png" width="600"/>

- 给button设定动作，让其按照my_nav_graph设定的导航动作，进行页面的跳转
- HomeFragment.java
```java
public class HomeFragment extends Fragment {
    public HomeFragment() {
    }
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_home, container, false);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        Button button;
        button = getView().findViewById(R.id.btnHome);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // 创建NavController对象，相当于找到了button所归属的Controller
                NavController controller = Navigation.findNavController(view);
                controller.navigate(R.id.action_homeFragment_to_detailFragment);
            }
        });
    }
}
```

- DetailFragment.java
```java
public class DetailFragment extends Fragment {
    // 省略其他...

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        // 简化的写法
        getView().findViewById(R.id.btnDetail)
                .setOnClickListener(Navigation.createNavigateOnClickListener(R.id.action_detailFragment_to_homeFragment));
    }
}
```


- 选中线条，可以设置页面进入和退出的动画效果
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/51.png" width="600"/>

- 使导航栏有返回按钮，在 `MainActivity.java`中
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/52.png" width="700"/>

- 修改导航栏上的标题
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/53.png" width="600"/>






## 2. Navigation 静态参数传递

- 按照上面步骤，创建FirstFragment，SecondFragment，点击FirstFragment上的按钮，将参数传递到SecondFragment页面中显示
- 在资源文件my_nav.xml中，选中secondFragment，添加Arguments
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/54.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/55.png" width="400"/>

- 在FirstFragment中
```java
public class FirstFragment extends Fragment {
    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        getView().findViewById(R.id.button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // 从First跳转到Second
                NavController controller = Navigation.findNavController(view);
                controller.navigate(R.id.action_firstFragment_to_secondFragment);
            }
        });
    }
}
```

- 在SecondFragment中
```java
public class SecondFragment extends Fragment {
    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        String nameValue = getArguments().getString("name");
        TextView textView = getView().findViewById(R.id.textView4);
        textView.setText(nameValue);
    }
}
```
- 此时从FirstFragment跳转到SecondFragment，SecondFragment会显示Arguments中设定的默认参数 Funky



## 3. Navigation 动态参数传递

- FirstFragment添加EditText控件，将输入的内容，传到SecondFragment中

- FirstFragment
```java
public class FirstFragment extends Fragment {

    // 省略其他...

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        getView().findViewById(R.id.button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                EditText editText = getView().findViewById(R.id.editText);
                String string = editText.getText().toString();
                if (string.isEmpty()) {
                    Toast.makeText(getActivity(), "请输入名字", Toast.LENGTH_LONG).show();
                    return;
                }

                Bundle bundle = new Bundle();
                bundle.putString("my_name", string);

                // 从First跳转到Second
                NavController controller = Navigation.findNavController(view);
                controller.navigate(R.id.action_firstFragment_to_secondFragment, bundle);
            }
        });
    }
}
```

- SecondFragment
```java
public class SecondFragment extends Fragment {

    // 省略其他...

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        // String nameValue = getArguments().getString("name");
        String nameValue = getArguments().getString("my_name");
        TextView textView = getView().findViewById(R.id.textView4);
        textView.setText(nameValue);
    }
}
```



## 4. 跳转动画过渡

- 创建动画资源文件 slide_from_left.xml, slide_to_right.xml
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/39.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/56.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/57.png" width="600"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/58.png" width="600"/>

- 使用动画资源
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/59.png" width="600"/>

- 其他缩放旋转动画
```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <translate
        android:fromXDelta="-100%"
        android:toXDelta="0"
        android:duration="1000" />
    <scale
        android:fromXScale="0.0"
        android:toXScale="1.0"
        android:fromYScale="0.0"
        android:toYScale="1.0"
        android:pivotX="50%"
        android:pivotY="50%"
        android:duration="1000" />
    <rotate 
        android:fromDegrees="0"
        android:toDegrees="360"
        android:pivotY="50%"
        android:pivotX="50%"
        android:duration="1000" />
</set>
```




## 参考
- [Android开发教程](https://www.bilibili.com/video/BV1f4411a74h)
