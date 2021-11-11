---
title: 【2. ConstraintLayout布局】
---

[[TOC]]


## 1. 基础使用
- 默认布局使用的是ConstraintLayout，ConstraintLayout是RelativeLayout改良的版本
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/7.png" width="700"/>

- 点击“魔法棒”，智能的生成约束
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/8.png" width="400"/>

- 约束设置
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/9.png" width="700"/>



## 2. 设置按照基线对齐
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/10.png" width="400"/>
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/11.png" width="400"/>



## 3. 设置多个控件排列方式
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/12.png" width="500"/>



## 4. 可见与隐藏visibility
- visibility：visible （可见）
- visibility：invisible （不可见，物理上还是存在的，仍然占据着空间）
- visibility：gone （不可见，不占据空间）


## 5. 添加辅助线Guideline
- 辅助线可以添加多条
- 改变辅助线位置的时候，相对于辅助线位置进行布局的控件，位置都会改变
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/13.png" width="600"/>

- 利用辅助线约束页面布局
<br/><img src="http://funky_hs.gitee.io/imgcloud/funkyblog/android/base/14.png" width="400"/>



## 参考
- [Android开发教程](https://www.bilibili.com/video/BV1f4411a74h)

