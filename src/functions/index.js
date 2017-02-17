import * as excel from './excel'

export function evaluate(type, funcName, ...args) {
  const pattern = patterns[type];

  if (!pattern) throw new Error(`${type} is not a supported function group.`);

  const funcNameClean = funcName.toLowerCase().trim();
  const func = pattern[pattern.PREFIX + funcNameClean];

  if (!func) throw new Error(`Unsupported function ${funcNameClean} from ${type}.`);

  return func(...args);
}

const patterns =  {
  excel
}

