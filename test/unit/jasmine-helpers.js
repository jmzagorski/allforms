export function setupSpy(name, prototype) {

  if (!prototype) throw Error("obj to fake required");
  if (!name) throw Error("name for the fake obj required");

  var keys = [];
  for (var key in prototype) keys.push(key);

  return keys.length > 0 ? jasmine.createSpyObj(name, keys) : {};
};
