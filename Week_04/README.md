## 产生式

参考资料：https://blog.csdn.net/u014287775/article/details/56014778

## Js类型

* Undefined: 表示未定义，值为undefined。变量在赋值前是Undefined类型，而undefined是变量，并非关键字，所以可以使用void 0来获取undefined值。
* Null：表示定义了但是为空，值为null，是关键字
* Boolean：表示逻辑上的真和假，值为true和false
* String：表示文本数据，最大长度为2^53 - 1。String的意义并非是“字符串”，而是字符串的UTF-16编码，我们字符串的操作charAt、charCodeAt、length等方法都是针对UTF-16编码。所以字符串的的最大长度，实际受字符串编码长度的影响。字符串一旦构造无法变更。
* Number：表示通常意义上的“数字”，值为2^64 - 2^53 + 3个。根据双精度浮点数的定义，Number有效整数范围-(2^53 - 1) -- 2^53 -1，所以number无法表示此范围外的整数
  * NaN
  * Infinity：1/0
  * -Infinity：1/-0
  * 比较浮点数的方法：`Math.abs(0.1+0.2-0.3) <= Number.EPSILON`
* Object：属性的集合，属性分为数据属性和访问器属性，二者都是key-value结构。
  * 为什么基础类型能用对象上的方法？因为`.` 运算符提供了装箱操作，它会根据基础类型构造一个临时对象，使得我们能在基础类型上调用对应对象的方法。
  * 关于Symbol.toPrimitive: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive
* Symbol：一切非字符串的对象key的集合

## JS对象

* 对象特征：

  * 对象具有唯一标识性：即使完全相同的两个对象，也并非同一个对象
  * 对象有状态：对象具有状态，同一对象可能处于不同状态之下
  * 对象具有行为：即对象的状态，可能因为它的行为产生变迁

* 对象的两类属性

  * 数据属性: 可通过`Object.defineProperty`设置， 通过`Object.getOwnPropertyDescripter`查看属性
    * value：属性的值
    * writable: 决定属性能否被赋值
    * enumerable：决定for in能否枚举该属性
    * configurable：决定该属性能否被删除或者改变特征值
  * 访问器(getter/setter)属性
    * getter：函数或undefined，取属性值时被调用
    * setter：函数或undefined，设置属性值时被调用
    * enumerable：决定for in 能否枚举该属性
    * configurable：决定该属性能否被删除或者改变特征值

* 面向对象：

  * js原型：`Object.create()`

    * Object.create 根据指定的原型创建新对象，原型可以是 null
    * Object.getPrototypeOf 获得一个对象的原型；
    * Object.setPrototypeOf 设置一个对象的原型

     ```javascript
    
    var cat = {
        say(){
            console.log("meow~");
        },
        jump(){
            console.log("jump");
        }
    }
    
    var tiger = Object.create(cat,  {
        say:{
            writable:true,
            configurable:true,
            enumerable:true,
            value:function(){
                console.log("roar!");
            }
        }
    })
    
    
    var anotherCat = Object.create(cat);
    
    anotherCat.say();
    
    var anotherTiger = Object.create(tiger);
    
    anotherTiger.say();
    
     ```

    

  * 早期版本的`new function`

    * 第一种方式: 修改构造器的 prototype 属性指向的对象，它是从这个构造器构造出来的所有对象的原型。

      ```javascript
      Object.create = function(prototype){
          var cls = function(){}
          cls.prototype = prototype;
          return new cls;
      }
      ```

      

    * 第二种方式:直接在构造器中修改 this，给 this 添加属性

      ```javascript
      function c1(){
          this.p1 = 1;
          this.p2 = function(){
              console.log(this.p1);
          }
      } 
      var o1 = new c1;
      o1.p2();
      
      
      
      function c2(){
      }
      c2.prototype.p1 = 1;
      c2.prototype.p2 = function(){
          console.log(this.p1);
      }
      
      var o2 = new c2;
      o2.p2();
      ```

      

  * ES6的class和extends关键字：基于分类的方式描述对象

    ```javascript
    class Animal { 
      constructor(name) {
        this.name = name;
      }
      
      speak() {
        console.log(this.name + ' makes a noise.');
      }
    }
    
    class Dog extends Animal {
      constructor(name) {
        super(name); // call the super class constructor and pass in the name parameter
      }
    
      speak() {
        console.log(this.name + ' barks.');
      }
    }
    
    let d = new Dog('Mitzie');
    d.speak(); // Mitzie barks.
    ```


  * `{} . [] Object.defindProperty`:提供了基本的对象机制，能够通过语法创建对象、访问属性和定义新的属性，以及改变属性的特征值，基本面向对象的能力

* 其他内置对象：Array、Date Error Function JSON Math Map Set

