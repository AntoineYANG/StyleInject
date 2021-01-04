import { Properties } from 'csstype';
/**
 * Change a set of style rules from JavaScript style to CSS style.
 *
 * @param {(Properties<string|number>)} rules
 * @exports
 * @returns
 */
export declare const resolveCSSRule: (rules: Properties<string | number, string & {}>) => string[];
/**
 * Append new css rules.
 *
 * @param {string} selector                     CSS selector, separated by ',' .
 * @param {(Properties<string | number>)} rules CSS styles object, in JavaScript style.
 * @param {number} [index=0]                    The newly inserted rule's position in CSSStyleSheet.cssRules.
 */
declare const styleinject: (selector: string, rules: Properties<string | number, string & {}>, index?: number) => void;
export default styleinject;
