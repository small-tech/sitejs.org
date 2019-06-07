#!/usr/local/bin/node

////////////////////////////////////////////////////////////////////////////////
//
// Inline SVG
//
// Inlines SVG assets into an already-minified index.html. (We need to do this
// last as, otherwise, minify chokes on inlined SVGs.)
//
////////////////////////////////////////////////////////////////////////////////

const fs = require('fs')

let index = fs.readFileSync('../tmp/index-minified.html', 'utf8')

const emoji = fs.readdirSync('../images/emoji').map(f => `../images/emoji/${f}`)
const icons = fs.readdirSync('../images/icons').map(f => `../images/icons/${f}`)

const SVGs = emoji.concat(icons)

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

SVGs.forEach(svg => {
  index = index.replace(new RegExp(escapeRegExp(`background-image:url(${svg})`), 'g'), `background-image:url('data:image/svg+xml;utf8,${encodeURIComponent(fs.readFileSync(svg, 'utf8'))}')`)
})

fs.writeFileSync('../dist/index.html', index)
