#!/usr/bin/env node

////////////////////////////////////////////////////////////////////////////////
//
// Highlight the code.
//
////////////////////////////////////////////////////////////////////////////////

const fs = require('fs')
const highlightJs = require('highlight.js')

function unescapeHtml(code) {
  return code.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

function unescapeReplacementString(str) {
  return str.replace(/\$/g, '$$$$')
}

let index = fs.readFileSync('index.html', 'utf-8')

const codeRegExp = /<code class='language-(.*?)'>(.*?)<\/code>/gs

let codeMatch = codeRegExp.exec(index)

while (codeMatch !== null) {
  const fullMatch = codeMatch[0]
  const language = codeMatch[1]
  let code = codeMatch[2]

  if (language === 'mixed' ) {
    // There is a mix of languages. Loop through the segments demarcated by
    // span tags and highlight each in its own language.
    const nestedCodeRegExp = /<span class='language-(.*?)'>(.*?)<\/span>/gs
    let nestedCodeMatch = nestedCodeRegExp.exec(code)

    while (nestedCodeMatch !== null) {
      const fullNestedMatch = nestedCodeMatch[0]
      const nestedLanguage = nestedCodeMatch[1]
      let nestedCode = nestedCodeMatch[2]

      console.log(nestedLanguage, nestedCode, fullNestedMatch)

      const highlightedCode = highlightJs.highlight(nestedLanguage, unescapeHtml(nestedCode)).value
      index = index.replace(fullNestedMatch, unescapeReplacementString(highlightedCode))

      // Update the conditional for the next check of the loop.
      nestedCodeMatch = nestedCodeRegExp.exec(code)
    }
  } else {
    // Single language. Highlight it.
    const highlightedCode = highlightJs.highlight(language, unescapeHtml(code)).value
    index = index.replace(fullMatch, `<code>${unescapeReplacementString(highlightedCode)}</code>`)
  }

  // Update the conditional for the next check of the loop.
  codeMatch = codeRegExp.exec(index)
}

// console.log(index)

fs.writeFileSync('tmp/index.html', index)
