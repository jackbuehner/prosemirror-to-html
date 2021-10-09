/**
 * Replace common HTML entities with entity names.
 *
 * @param {*} text
 * @returns
 */
module.exports.htmlEntities = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Convert input to an array unless it is already an array.
 *
 * @param {*} element
 * @returns
 */
module.exports.arrayify = (element) => {
  if (!element) return [];
  if (element instanceof Array) {
    return element;
  }
  return [element];
};

/**
 * Recursivley find a key in array of nested objects.
 *
 * _Adapted from https://stackoverflow.com/a/5447398/9861747_
 *
 * @param {*} obj
 * @param {*} keyObj
 * @returns
 */
module.exports.findKey = (obj, keyObj) => {
  var p, key, val, tRet;
  for (p in keyObj) {
    if (keyObj.hasOwnProperty(p)) {
      key = p;
      val = keyObj[p];
    }
  }

  for (p in obj) {
    if (p == key) {
      if (obj[p] == val) {
        return obj;
      }
    } else if (obj[p] instanceof Object) {
      if (obj.hasOwnProperty(p)) {
        tRet = this.findKey(obj[p], keyObj);
        if (tRet) {
          return tRet;
        }
      }
    }
  }

  return false;
};
