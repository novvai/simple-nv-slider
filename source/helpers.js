/**
 * Retrieve element node from the DOM
 */
export function e(selector) {
    let fetchedDOM = document.querySelectorAll(selector), elemCount = fetchedDOM.length;

    return (elemCount == 1) ? fetchedDOM[0] : (elemCount > 1) ? fetchedDOM : null;
}

/**
 * @param {string} selector
 * 
 * @return {Array} 
 */
export function e_l(selector) {
    let fetchedDOM = e(selector);

    return (fetchedDOM === null) ? [] : (fetchedDOM.length == undefined) ? [fetchedDOM] : fetchedDOM;
}

/**
 * Retrieve element node from the DOM
 */
export function findIn(el, selector) {
    let fetchedDOM = el.querySelectorAll(selector), elemCount = fetchedDOM.length;

    return (elemCount == 1) ? fetchedDOM[0] : (elemCount > 1) ? fetchedDOM : null;
}

/**
 * Retrieve element node from the DOM
 */
export function existsInDOM(el) {
    return (el != null && el != undefined);
}

export function hasClass(el, classStyle){
    return existsInDOM(el) && el.classList !== undefined && el.classList.contains(classStyle);
}