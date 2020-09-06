# 学习笔记

## 正则表达式

* 创建方式：
  * 实例方式创建：`new RegExp(pattern,flags)`
  * 字面量方式创建：`/pattern/flags`
    * pattern:正则表达式
    * flags：标示
      * i 忽略大小写匹配
      * m 多行匹配，即在到达一行文本末尾时还会继续寻常下一行中是否与正则匹配的项
      * g 全局匹配 模式应用于所有字符串，而非在找到第一个匹配项时停止
* 相关方法：
  * **reg.test(str)** 用来验证字符串是否符合正则 符合返回true 否则返回false
  * **reg.exec()** 用来捕获符合规则的字符串
  * **str.match(reg)** 如果匹配成功，就返回匹配成功的数组，如果匹配不成功，就返回null
  * **str.replace()** 这个方法大家肯定不陌生，现在我们要说的就是和这个方法和正则相关的东西了
* 常用属性：
  * lastIndex：表示开始搜索下一个匹配项的字符位置，从0开始，返回整型

## 数组

* 常用方法
  * push(data): 向数组尾部追加元素，返回数组的元素个数(长度)
  * pop(): 从数组尾部删除一个元素，返回删除的元素
  * unshift(): 从数组头部插入元素，括号内写多个元素，元素之间用`,`分隔，返回数组的元素个数
  * shift(): 从数组头部删除一个元素，返回删除的元素
  * slice(index[, index1]):截取数组
  * splice():同上
  * sort(compare): 排序，可以指定排序函数

## 抽象语法树(AST)

* 参考资料：
  * ast的介绍http://blog.chinaunix.net/uid-26750235-id-3139100.html（https://blog.csdn.net/weixin_39408343/article/details/95984062）

## A*寻路算法

* 资料
  * https://blog.csdn.net/hitwhylz/article/details/41383561
  * https://blog.csdn.net/hitwhylz/article/details/23089415