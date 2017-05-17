// This function takes in a generator function and runs it. It allows for yielding
// to promises making asych programming more readable.
/* eslint-disable */
module.exports = function async(makeGenerator) {
  return function runGen() {
    const generator = makeGenerator.apply(this, arguments);

    function handle(result) {
      // result => { done: [Boolean], value: [Object] }
      if (result.done) return Promise.resolve(result.value);

      return Promise.resolve(result.value).then(function (res) {
        return handle(generator.next(res));
      },
      (err) => handle(generator.throw(err))
      );
    }

    try {
      return handle(generator.next());
    } catch (ex) {
      return Promise.reject(ex);
    }
  };
}
