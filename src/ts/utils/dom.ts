import { Class } from "./typescript";

interface HasQuerySelector {
    querySelector(selector: string): Element | null;
}

export function get_element_by_query_selector(root: HasQuerySelector, selector: string): HTMLElement;
export function get_element_by_query_selector<T extends HTMLElement>(root: HasQuerySelector, selector: string, class_type: Class<T>): T;
export function get_element_by_query_selector<T extends HTMLElement>(
    root: HasQuerySelector,
    selector: string,
    class_type?: Class<T>
): T {
    const element = root.querySelector(selector);
    if (!element) throw new Error("Element not found" + selector);
    if (class_type) {
        if (!(element instanceof class_type)) throw new Error("Element not of required type " + selector);
        return element;
    } else {
        if (!(element instanceof HTMLElement)) throw new Error("Element not of required type " + selector);
        return element as T;
    }
}