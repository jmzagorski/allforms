"use strict";

(function () {

  jasmine.setupSpy = function(name, realObj) {
    if (!realObj) throw Error("obj to fake required");
    if (!name) throw Error("name for the fake obj required");

    var keys = [];
    for (var key in realObj) keys.push(key);

    return keys.length > 0 ? jasmine.createSpyObj(name, keys) : {};
  }

})();
