# StyleInject - React 组件样式依赖的内聚解决方案

Inject css rules in js/ts/react, without scss.

![](https://img.shields.io/badge/npm-v1.0.0-brightgreen)

## 痛点

在实际业务中，我们创造了大量的 Presentational Components 来为我们渲染 UI。很多时候，我们希望这样的组件能够表现出某种样式风格。基于其复用的需求，我们会想到对元素设置 `className`，然后在样式表文件中制定对应的规则。

```css
textarea.rc-MarkDown, section.rc-MarkDown {
    padding: 0.6rem 1rem;
    text-align: left;
    font-family: var(--sans-serif);
    /* more */
}
section.rc-MarkDown, {
    lineHeight: 1.5;
}
```

但是，这样带来另一个问题：按照 React 对组件复用的理念，我们希望能通过简单的 `import` 语句导入一个组件，在不同的环境中使用它。然而，如果我们像上面那样做，组件的样式与其渲染逻辑分离，就会面临不得不将样式文件一同导入的问题。

于是，我们又常常选择 **css in js**，把样式定义到标签里。

```jsx
<section
    style={
        padding: "0.6rem 1rem",
        textAlign: "left",
        fontFamily: "var(--sans-serif)",
        /* more */
    }
 />
```
这是一般组件开发时推崇的写法，但是它违背了样式的复用性，生成了很长的标签内容。

另一方面，我们希望对组件使用优雅的 **CSS transition**，这就让操作样式规则成为一个应考虑的方向。

## 解决

最重要的问题，就是解决在导入组件文件的同时，其样式依赖也一并生效。因此，我采用添加标签的方式，动态地将 js 中的样式信息添加到文档中。（*为什么使用 js 格式？*在 js 的格式下，我们更容易获取样式的类型信息，包括枚举，这也符合 react 的标签语法）

命名转换部分

```typescript
/**
 * Change a set of style rules from JavaScript style to CSS style.
 *
 * @param {(Properties<string|number>)} rules
 * @returns
 */
const resolveCSSRule = (rules: Properties<string|number>) => {
    let ruleList: string[] = [];

    for (const key in rules) {
        if (rules.hasOwnProperty(key)) {
            let name: string = key;
            let flag: number = name.search(/[A-Z]/);
            while (flag !== -1) {
                name = name.slice(0, flag)
                        + "-" + name.charAt(flag).toLowerCase() + name.slice(flag + 1);
                flag = name.search(/[A-Z]/);
            }
            const value = rules[key as keyof Properties<string|number>];
            ruleList.push(`${ name }: ${ value };`);
        }
    }

    return ruleList;
};
```

绑定接口

```typescript
let style: HTMLStyleElement | null = null;

/**
 * Append new css rules.
 *
 * @param {string} selector                     CSS selector, separated by ',' .
 * @param {(Properties<string | number>)} rules CSS styles object, in JavaScript style.
 * @param {number} [index=0]                    The newly inserted rule's position in CSSStyleSheet.cssRules.
 */
const styleinject = (selector: string, rules: Properties<string|number>, index: number=0) => {
    if (!style) {
        // Initialize
        style = document.createElement("style");
        style.type = "text/css";
        document.head.appendChild(style);
    }

    // Append rules
    (style.sheet as CSSStyleSheet).insertRule(
        `${ selector } { ${
            resolveCSSRule(rules).join("\n")
        } }`, Math.min(index, (style.sheet as CSSStyleSheet).rules.length)
    );
};

```
## 实际使用

使用时，只需要给组件的渲染内容加上 `className`，然后在组件文件中直接调用此方法，加入对应样式规则即可。

```typescript
import styleinject from "styleinject";

const MarkDown: React.FC<MarkDownProps> = props => (
    <div className="rc-MarkDown" >
        // ...
    </div>
);

// Additional css rules
styleinject("div.rc-MarkDown", {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    width: "80vw",
    minHeight: "500px",
    maxHeight: "90vh"
});
styleinject("section.rc-MarkDown, textarea.rc-MarkDown", {
    lineHeight: 1.5
});
```

这样一来，当组件被导入的时候，样式就会进行初始化，从而与组件的样式绑定。
