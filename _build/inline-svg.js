#!/usr/bin/env node

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

const illustrations =  fs.readdirSync('../images/illustrations').map(f => `/images/illustrations/${f}`)

const SVGs = emoji.concat(illustrations)

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

SVGs.forEach(svg => {
  // Inline SVGs used as CSS background images.
  if (svg.includes('emoji')) {
    console.log('Adding emoji', svg)
    index = index.replace(new RegExp(escapeRegExp(`background-image:url(${svg})`), 'g'), `background-image:url('data:image/svg+xml;utf8,${encodeURIComponent(fs.readFileSync(svg, 'utf8'))}')`)
  } else if (svg.includes('illustrations')) {
    // Inline SVGs in image tags.
    // Note: no quotes around the src attribute as HtML has already been minified.
    console.log('Adding illustration', svg, new RegExp(escapeRegExp(`img src=${svg}`), 'g'))
    index = index.replace(new RegExp(escapeRegExp(`img src=${svg}`), 'g'), `img src=data:image/svg+xml;utf8,${encodeURIComponent(fs.readFileSync(`../${svg}`, 'utf8'))}`)
  } else {
    throw new Error('Unknown SVG type encountered:', svg)
  }
})

// console.log(index)

fs.writeFileSync('../dist/index.html', index)
