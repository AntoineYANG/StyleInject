/*
 * @Author: Kanata You 
 * @Date: 2021-01-04 02:24:59 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-01-04 03:19:30
 */

import { Properties } from 'csstype';


let style: HTMLStyleElement | null = null;

/**
 * Change a set of style rules from JavaScript style to CSS style.
 *
 * @param {(Properties<string|number>)} rules
 * @exports
 * @returns
 */
export const resolveCSSRule = (rules: Properties<string|number>) => {
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


export default styleinject;
