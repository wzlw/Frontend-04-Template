/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
  if (haystack == needle || needle.length == 0) {
      return 0;
  }
  let table = new Array(needle.length).fill(0);
  {
      let i=1, j=0;
      while(i < needle.length) {
          if (needle[i] === needle[j]) {
              ++i, ++j;
              table[i] = j;
          } else {
              if (j > 0)
                  j = table[j];
              else
                  ++i;
          }
      }
  }
  {
      let i=0, j=0;
      while(i < haystack.length) {
          if (haystack[i] === needle[j]) {
              ++i, ++j;
          } else {
              if (j > 0)
                  j = table[j];
              else
                  ++i;
          }

          if (j === needle.length) {
              return i - j;
          }
      }
  }
  return -1;
};
// console.log("mississippi".indexOf('issip'))
// "issip"
// console.log(strStr('mississippi', 'issip'))
// console.log(strStr('babbb', 'bbb'))
console.log(strStr('bacbababaabcbab', 'abababca'))