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

function fadeIn(el, time, cb) {
    el.style.opacity = 0;

    var last = +new Date();
    var tick = function() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / time;
        last = +new Date();

        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) ||
                setTimeout(tick, 16);
        } else {
            return cb();
        }
    };

    tick();
}

/**
 * Computer the outer height of an element.
 *
 * Source: https://stackoverflow.com/a/47536372
 * @param {HTMLElement} el
 */
function outerHeight(el) {
    let style = window.getComputedStyle(el);
    return [
        "height",
        "padding-top",
        "padding-bottom",
        "margin-top",
        "margin-bottom"
    ]
        .map(key => parseInt(style.getPropertyValue(key), 10))
        .reduce((prev, cur) => prev + cur);
}

function outerWidth(el) {
    let style = window.getComputedStyle(el);
    return [
        "width",
        "padding-left",
        "padding-right",
        "margin-left",
        "margin-right"
    ]
        .map(key => parseInt(style.getPropertyValue(key), 10))
        .reduce((prev, cur) => prev + cur);
}
export default {
    hasClass,
    addClass,
    removeClass,
    fadeIn,
    outerHeight,
    outerWidth
};
