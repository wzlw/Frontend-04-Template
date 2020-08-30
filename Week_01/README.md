# 学习笔记
* 深拷贝：`JSON.parse(JSON.stringify(pattern))`
* 浅拷贝：`Object.create()`
* Promise:
    ```javascript
     new Promise((resolve, reject) =>
      // ... some code
    
      if (/* 异步操作成功 */){
        resolve(value);
      } else {
        reject(error);
      }
    });
    ```
    
    + resolve函数：将Promise状态从pending -> resolved
    + reject函数：将Promise状态从pending -> rejected
    + then: Promise状态变成resolved调用
    + catch: Promise状态变成rejected调用
    + finally: 不管Promise状态如何都会执行
* async 和 await：
  + async：函数里有异步操作
  + await：紧跟后面的表达式需要等待结果
* Generator：
  + 特征：
    - function关键字与函数名之间有一个星号
    - 函数体内部使用yield表达式，定义不同的内部状态
  + 语法：
  ```
  function* funcName(){
    yield value;
    return value;
  }
  ```
  + next(): 使指针移到下一个状态
  + 如果Generator函数内没有yeild则会变成一个暂缓执行函数，必须调用next()函数才会执行
  