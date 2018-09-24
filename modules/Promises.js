/*
  This is a class for dealing with a series of Promises that must be done in order.
  It has a single static public method, chain(), which will run each Promise
    in the order provided. See details for this below:

  chain (functions : Dictionary) : Promise(results : Dictionary)
    Purpose: Runs each of the provided functions in order, resolving when completed.
    Arguments:
      functions: The list of functions to call. Should be given in the format:
                   name: function
                 Where the given name represents the given function.
                 Each will be passed a list of results for the promises which
                   have been resolved so far.
     Returns:
       A promise. Resolves with a dictionary of results, where:
         The key ties the result to the function call (will be the function's name);
         The value is the result that was returned from the function.
*/
class Promises {
  static chain (functions) {
    functions = this._mapToArray (functions);
    return this._runThroughPromises (functions, 0, [])
  }

  // For ease of use, we accept dictionaries - this maps it back to an array,
  //  so it can be used with the Promise loop
  static _mapToArray (functions) {
    let results = [ ];
    for (let key in functions) {
      results.push ({
        functionCall: functions [key],
        name: key
      });
    }
    return results;
  }

  static _runThroughPromises (functions, curIndex, results) {
    return new Promise ((fulfill, reject) => {
      if (curIndex >= functions.length)
        return fulfill (results);

      let functionData = functions [curIndex];
      let {func, name} = this._parseFunctionData (curIndex, functionData);

      func(results).then ((result) => {
        results [name] = result;
        this._runThroughPromises(functions, curIndex + 1, results).then (fulfill).catch (reject);
      }).catch ((err) => {
        reject ([name, err]);
      });
    });
  }

  // Parse function - Parses a single value of the array into function & name
  //  Allows for providing a name to values, if wanted
  static _parseFunctionData (index, data) {
    var func, name;

    if (typeof (data) == 'function') {
      func = data;
      name = index;
    } else {
      func = data.functionCall;
      name = data.name;
    }

    return { func, name }
  }
}

module.exports.Promises = Promises;
