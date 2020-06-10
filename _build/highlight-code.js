#!/usr/bin/env node

////////////////////////////////////////////////////////////////////////////////
//
// Highlight the code.
//
////////////////////////////////////////////////////////////////////////////////

const fs = require('fs')
const highlightJs = require('highlight.js')

let index = fs.readFileSync('index.html', 'utf-8')

const codeRegExp = /<code class='language-(.*?)'>(.*?)<\/code>/gs

let codeSegment = codeRegExp.exec(index)
while (codeSegment !== null) {
  const highlightedCode = highlightJs.highlight(codeSegment[1], codeSegment[2].replace(/&lt;/g, '<').replace(/&gt;/g, '>')).value

  // Note: the $ escaping is done in case the code being replaced contains $$ or $<n>, etc.
  index = index.replace(codeSegment[0], highlightedCode.replace(/\$/g, '$$$$'))

  codeSegment = codeRegExp.exec(index)
}

fs.writeFileSync('tmp/index.html', index)
