---
title: 【7. 滑动分页TabLayout,ViewPager2】
---

[[TOC]]


## 1. TabLayout与ViewPager2基本使用
- 系统中自带的是ViewPager，使用ViewPager2需要添加依赖
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/60.png" width="400"/>


- 创建三个Fragment
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/61.png" width="300"/>


- 创建一个矢量图
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/62.png" width="500"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/63.png" width="500"/>

- 在三个Fragment中添加如下相同的布局
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/64.png" width="500"/>

- 在activity_main布局中，拖入TabLayout以及ViewPager2
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/65.png" width="500"/>


- MainActivity实现，将TabLayout与ViewPager2进行关联
```java
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val tabLayout = findViewById<TabLayout>(R.id.tabLayout)
        val viewPager2 = findViewById<ViewPager2>(R.id.viewPager2)

        viewPager2.adapter = object : FragmentStateAdapter(this) {
            override fun getItemCount() = 3
            override fun createFragment(position: Int) =
                    when(position) {
                        0 -> ScaleFragment()
                        1 -> RotateFragment()
                        else -> TranslateFragment()
                    }
        }

        // 将TabLayout与ViewPager2进行关联
        TabLayoutMediator(tabLayout, viewPager2) { tab, position ->
            when(position) {
                0 -> tab.text = "缩放"
                1 -> tab.text = "旋转"
                else -> tab.text = "移动"
            }
        }.attach()
    }
}
```

- RotateFragment实现
```java
class RotateFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_rotate, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        // 点击图片 旋转角度30
        val imageViewRotate: ImageView = view!!.findViewById(R.id.imageViewRotate)
        imageViewRotate.setOnClickListener {
            ObjectAnimator.ofFloat(it, "rotation", it.rotation + 30f).start()
        }
    }
}
```


- ScaleFragment实现
```kotlin
class ScaleFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_scale, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        // 点击图片 X轴Y轴缩放
        val imageViewScale: ImageView = view!!.findViewById(R.id.imageViewScale)
        imageViewScale.setOnClickListener {
            val factor: Float = if (Random.nextBoolean()) 0.1f else -0.1f
            ObjectAnimator.ofFloat(it, "scaleX", it.scaleX + factor).start()
            ObjectAnimator.ofFloat(it, "scaleY", it.scaleY + factor).start()
        }
    }
}
```


- TranslateFragment实现
```kotlin
class TranslateFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_translate, container, false)
    }
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        // 点击图片 在X轴左右移动
        val imageViewTranslate: ImageView = view!!.findViewById(R.id.imageViewTranslate)
        imageViewTranslate.setOnClickListener {
            ObjectAnimator.ofFloat(it, "translationX", it.translationX + Random.nextInt(-100, 100)).start()
        }
    }
}
```


- 效果图
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/66.png" width="300"/>


- 修改指示器颜色，添加分割线
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/67.png" width="600"/>









## 参考
- [Android开发教程](https://www.bilibili.com/video/BV1f4411a74h)

<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/14.png" width="400"/>
