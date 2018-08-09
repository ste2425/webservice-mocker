function promisify(fn) {
    if (typeof fn !== 'function')
        throw new ReferenceError('function expected');
        
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn(...args, function (e, d) {
                if (e)
                    reject(e);
                else
                    resolve(d);
            });
        });
    }
}

module.exports = promisify;
