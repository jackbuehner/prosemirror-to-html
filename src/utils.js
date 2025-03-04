// @ts-check

/**
 * Replace common HTML entities with entity names.
 *
 * @param {string} text
 * @returns {string}
 */
function htmlEntities(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Recursively find a key in array of nested objects.
 *
 * _Adapted from https://stackoverflow.com/a/5447398/9861747_
 *
 * @param {{ [key: string]: any }} obj
 * @param {{ [key: string]: any }} keyObj
 * @returns
 */
function findKey(obj, keyObj) {
  try {
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
          tRet = findKey(obj[p], keyObj);
          if (tRet) {
            return tRet;
          }
        }
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Converts a string with spaces and other special characters to a slug.
 *
 * _Adapted from codeguy's gist at https://gist.github.com/codeguy/6684588_
 *
 * @param {string} str
 * @param {string} replacement
 * @returns {string}
 */
function slugify(str, replacement = '-') {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  const to = 'aaaaeeeeiiiioooouuuunc------';
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, replacement) // collapse whitespace and replace by -
    .replace(new RegExp(`[${replacement}]+`, 'g'), replacement); // collapse replacement

  return str;
}

module.exports = {
  htmlEntities,
  findKey,
  slugify,
};
