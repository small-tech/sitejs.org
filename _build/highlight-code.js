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
      let boldface = false

      const fullNestedMatch = nestedCodeMatch[0]
      let nestedLanguage = nestedCodeMatch[1]
      let nestedCode = nestedCodeMatch[2]

      if (nestedLanguage.includes('strong')) {
        nestedLanguage = nestedLanguage.replace('strong', '').trim()
        boldface = true
      }

      let highlightedCode = highlightJs.highlight(nestedLanguage, unescapeHtml(nestedCode)).value

      let boldfaceStart = '<span style="font-weight: 100;">'
      let boldfaceEnd = '</span>'
      if (boldface) {
        boldfaceStart = '<strong>'
        boldfaceEnd = '</strong>'
      }

      index = index.replace(fullNestedMatch, boldfaceStart + unescapeReplacementString(highlightedCode) + boldfaceEnd)

      // Update the conditional for the next check of the loop.
      nestedCodeMatch = nestedCodeRegExp.exec(code)
    }
  } else {
    // Single language. Highlight it.
    const highlightedCode = highlightJs.highlight(language, unescapeHtml(code)).value
    index = index.replace(fullMatch, `<code style='font-weight: 100;'>${unescapeReplacementString(highlightedCode)}</code>`)
  }

  // Update the conditional for the next check of the loop.
  codeMatch = codeRegExp.exec(index)
}

fs.writeFileSync('tmp/index.html', index)
