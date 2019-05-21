// this is a tagged template function
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates
// Example
// pluralize`You have ${events.length} ${["meeting","meetings"]} today`

export default function pluralize(strings, num, [singularWord, pluralWord]) {
  let word, emptyWord;
  let result = "";

  if (num.length) {
    emptyWord = num[1];
    num = num[0];
  }

  if (num === 0) {
    num = emptyWord;
    word = singularWord;
  } else if (num > 1) {
    word = pluralWord;
  } else {
    word = singularWord;
  }

  const interpolatedParts = [num < 1 ? emptyWord : num, word, ""];

  for (let i in strings) {
    result += strings[i] + interpolatedParts[i];
  }

  return result;
}
