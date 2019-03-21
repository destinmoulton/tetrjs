/**
 * Determine if an element has a class.
 *
 * @param {HTMLElement} ele
 * @param {string} cls
 */
function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add a class to an element.
 *
 * @param {HTMLElement} ele
 * @param {string} cls
 */
function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove a class from an element
 *
 * @param {HTMLElement} ele
 * @param {string} cls
 */
function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
        ele.className = ele.className.replace(reg, " ");
    }
}

export default {
    hasClass,
    addClass,
    removeClass
};
