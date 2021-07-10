---
title: 5. 加载图片 设置圆角图片
---

[[TOC]]


## 1. 加载远程图片
```dart
// 1. 加载网络图片
Widget networkImage() {
  return Container(
    width: 300,
    height: 300,
    child: Image.network( // 加载远程图片
      "http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png",
      // alignment: Alignment.bottomRight, // 在容器中的显示位置,默认显示在中间
      // fit: BoxFit.cover, // 重要！ 全屏显示,会对图片进行剪切,图片不会变形
      // fit: BoxFit.fill, // 全图显示，图片会被拉伸，并充满容器
      // fit: BoxFit.fitWidth, // 横向充满
      // fit: BoxFit.contain, // 全图显示，显示原比例，可能会有空隙
      fit: BoxFit.fitHeight, // 纵向充满
      repeat: ImageRepeat.noRepeat, // 图片平铺
    ),
  );
}
```


## 2. 加载本地图片
```dart
Widget localImage() {
  return Container(
    width: 300,
    height: 300,
    child: Image.asset( // 加载本地图片
      "images/a.jpg",
      fit: BoxFit.cover, // 全屏显示,会对图片进行剪切,图片不会变形
      repeat: ImageRepeat.noRepeat, // 图片平铺
    ),
    decoration: BoxDecoration(
      color: Colors.yellow,
    ),
  );
}
```


## 3. 使用Container生成圆角图片
```dart
Widget radiusImageContainer() {
  return Container(
    width: 300,
    height: 300,
    decoration: BoxDecoration(
      color: Colors.yellow,
      // borderRadius: BorderRadius.all(Radius.circular(150)), 设置图片圆角
      borderRadius: BorderRadius.circular(150),
      image: DecorationImage(
        image: NetworkImage("http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png"),
        fit: BoxFit.cover,
      ),
    ),
  );
}
```


## 4. 使用ClipOval生成圆角图片（推荐）
```dart
Widget radiusImageClipOval() {
  return Container(
    child: ClipOval(
      child: Image.network(
        "http://funky_hs.gitee.io/imgcloud/funkyblog/myself/2019-05-03.png",
        width: 100,
        height: 100,
        fit: BoxFit.cover,
      ),
    ),
  );
}
```


## 参考
- [Dart Flutter教程](https://www.bilibili.com/video/BV1S4411E7LY)