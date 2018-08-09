const debounceTimeout = 500;

module.exports = function (fn, delay) {
    if (typeof fn !== 'function')
        throw new ReferenceError('function expected');

    let t; //eslint-disable-line init-declarations

    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), (delay || debounceTimeout))
    };
}