// import './style.css'

const SENTENCE_PUNCTUATION = [" — ", ". ", "... "];
const PUNCTUATION = [...SENTENCE_PUNCTUATION, "; "];
const CONJUNCTIONS = [" and ", ", and ", ", but ", ", though ", " & ", ", & "]; // through?
const SEPARATORS = [...PUNCTUATION, ...CONJUNCTIONS, "\n\n"];
const WRAPPERS = [["(", ")"]];

const MIN_WORDS = 50000;

fetch("tracery.json")
  .then(res => res.json())
  .then(g => init(g));

function init(g) {
  const grammar = tracery.createGrammar(g);
  console.log(grammar);

  console.log(grammar.flatten("#origin#"));
  console.log(grammar.expand("#origin#"));

  // const NUM_STRINGS = 50;
  const strings = [];
  // for (let i = 0; i < NUM_STRINGS; i++) {
  let numWords = 0;
  while (numWords < MIN_WORDS) {
    const str = grammar.flatten("#origin#");
    const length = str.split(" ").length;
    numWords += length;
    strings.push(str);
  }

  let text = strings[0];
  // for (let i = 1; i < NUM_STRINGS; i++) {
  for (let i = 1; i < strings.length; i++) {
    let str = strings[i];
    const words = str.split(/, /);

    const hasWrapper = Math.random() < 0.1;
    const wrapper = hasWrapper ? WRAPPERS[Math.floor(Math.random() * WRAPPERS.length)] : ["", ""];
    const hasParaBreak = hasWrapper ? Math.random() < 0.2 : false;
    // const hasSeparator = (!hasWrapper || hasParaBreak);
    // const separator = hasSeparator ?
    //   (hasParaBreak ? "\n\n" : SEPARATORS[Math.floor(Math.random() * SEPARATORS.length)]) : " ";
    let separator = hasParaBreak ? "\n\n" : SEPARATORS[Math.floor(Math.random() * SEPARATORS.length)];
    if (words[0] === "take" || words[0] === "consider" || words[0] === "still") {
      separator = hasParaBreak ? "\n\n" : PUNCTUATION[Math.floor(Math.random() * PUNCTUATION.length)];
    }
    if (text[text.length - 1] === ")") {
      text = text.slice(0, text.length - 1);
      const punct = SENTENCE_PUNCTUATION[Math.floor(Math.random() * SENTENCE_PUNCTUATION.length)];
      separator = punct.slice(0, punct.length - 1) + ") ";
    }
    if (hasWrapper && !hasParaBreak) {
      separator = Math.random() < 0.5 ? ". " : " ";
    }
    // if (hasSeparator) {
    //   str += separator + s;
    // } else if (hasWrapper) {
    //   str += " " + wrapper[0] + s + wrapper[1];
    // } else {
    //   str += " " + s;
    // }

    let prefix = "";
    if (words[0].includes("here")) { // also catches "there"
      if (Math.random() < 0.5) {
        prefix = "it’s ";
      } else if (Math.random() < 0.5) {
        str = str.replace("here in", "here is");
      }
    } else if (words[1] === "practice") {
      if (Math.random() < 0.5) {
        prefix = "in ";
      }
    }

    if (str.includes(" as ")) {
      if (Math.random() < 0.5) {
        str = str.replace(" as ", " is ");
      }
    }

    text += separator + wrapper[0] + prefix + str + wrapper[1];
  }

  const container = document.querySelector(".text");
  container.innerHTML = text;
}