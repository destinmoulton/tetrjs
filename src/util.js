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

/**
 * https://stackoverflow.com/a/6121270
 * @param {HTMLElement} element
 * @param {function} cb
 */
function fadeIn(element, cb) {
    var op = 0.1; // initial opacity
    element.style.display = "block";
    var timer = setInterval(function() {
        if (op >= 1) {
            clearInterval(timer);
            return cb();
        }
        element.style.opacity = op;
        element.style.filter = "alpha(opacity=" + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

/**
 * https://stackoverflow.com/a/6121270
 * @param {HTMLElement} element
 * @param {function} cb
 */
function fadeOut(element, cb) {
    var op = 1; // initial opacity
    var timer = setInterval(function() {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = "none";
            return cb();
        }
        element.style.opacity = op;
        element.style.filter = "alpha(opacity=" + op * 100 + ")";
        op -= op * 0.1;
    }, 10);
}

export default {
    hasClass,
    addClass,
    removeClass,
    fadeIn,
    fadeOut,
    outerHeight,
    outerWidth
};
