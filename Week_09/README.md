# 学习笔记

## CSS 总体结构

* at-rules

  * @charset: 用于提示 CSS 文件使用的字符编码方式

    ```javascript
    @charset "utf-8";
    ```

  * @import: 用于引入一个 CSS 文件，不会引入@chartset

    ```javascript
    @import "mystyle.css";
    @import url("mystyle.css");
    ```

  * @page：用于分页媒体访问网页时的表现设置

    ```javascript
    @page {
      size: 8.5in 11in;
      margin: 10%;
    
      @top-left {
        content: "Hamlet";
      }
      @top-right {
        content: "Page " counter(page);
      }
    }
    ```

  * @media：能够对设备的类型进行一些判断

    ```javascript
    @media print {
        body { font-size: 10pt }
    }
    ```

  * @counter-style：产生一种数据，用于定义列表项的表现

    ```javascript
    @counter-style triangle {
      system: cyclic;
      symbols: ‣;
      suffix: " ";
    }
    ```

  * @keyframes: 产生一种数据，用于定义动画关键帧

    ```javascript
    @keyframes diagonal-slide {
    
      from {
        left: 0;
        top: 0;
      }
    
      to {
        left: 100px;
        top: 100px;
      }
    
    }
    ```

  * @fontface: 用于定义一种字体，icon font 技术就是利用这个特性来实现的

    ```javascript
    @font-face {
      font-family: Gentium;
      src: url(http://example.com/fonts/Gentium.woff);
    }
    
    p { font-family: Gentium, serif; }
    ```

  * @supports: support 检查环境的特性

  * @namespace: 用于跟 XML 命名空间配合的一个规则，表示内部的 CSS 选择器全都带上特定命名空间

  * @ viewport: 用于设置视口的一些特性，不过兼容性目前不是很好，多数时候被 HTML 的 meta 代替

* rule

  * Selector
    * selector_group
    * selector
      * `>`
      * `<sp>`
      * `+`
      * `-`
    * simple_selector
      * `type`: 例`div` `svg|a`
      * `*` 
      * `.`: class选择器，例 `.cls`
      * `#`: id选择器, 例`#id`
      * `[attr=value]`: 熟悉选择器, 例`[title="a"]`
      * `:`:伪类
        * :hover
        * 
      * `::`：伪元素
      * `:not()`：反选伪类
  * Declaration
    * key
      * variables
      * properties
    * value
      * calc
      * number
      * length