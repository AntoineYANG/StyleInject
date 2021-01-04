/*
 * @Author: Kanata You
 * @Date: 2021-01-04 02:24:59
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-01-04 03:19:30
 */
var style = null;
/**
 * Change a set of style rules from JavaScript style to CSS style.
 *
 * @param {(Properties<string|number>)} rules
 * @exports
 * @returns
 */
export var resolveCSSRule = function (rules) {
    var ruleList = [];
    for (var key in rules) {
        if (rules.hasOwnProperty(key)) {
            var name_1 = key;
            var flag = name_1.search(/[A-Z]/);
            while (flag !== -1) {
                name_1 = name_1.slice(0, flag)
                    + "-" + name_1.charAt(flag).toLowerCase() + name_1.slice(flag + 1);
                flag = name_1.search(/[A-Z]/);
            }
            var value = rules[key];
            ruleList.push(name_1 + ": " + value + ";");
        }
    }
    return ruleList;
};
/**
 * Append new css rules.
 *
 * @param {string} selector                     CSS selector, separated by ',' .
 * @param {(Properties<string | number>)} rules CSS styles object, in JavaScript style.
 * @param {number} [index=0]                    The newly inserted rule's position in CSSStyleSheet.cssRules.
 */
var styleinject = function (selector, rules, index) {
    if (index === void 0) { index = 0; }
    if (!style) {
        // Initialize
        style = document.createElement("style");
        style.type = "text/css";
        document.head.appendChild(style);
    }
    // Append rules
    style.sheet.insertRule(selector + " { " + resolveCSSRule(rules).join("\n") + " }", Math.min(index, style.sheet.rules.length));
};
export default styleinject;
//# sourceMappingURL=styleinject.js.map