#!/usr/bin/env node

////////////////////////////////////////////////////////////////////////////////
//
// Inline the minified assets.
//
////////////////////////////////////////////////////////////////////////////////

const fs = require('fs')

let index = fs.readFileSync('tmp/index.html', 'utf-8')
const styles = fs.readFileSync('tmp/styles.css', 'utf-8')

// Note: the odd-looking replace is necessary because, after 24 years of using JavaScript, I just discovered
// ===== that string.replace is actually broken. Its default behaviour is to use dollar-denoted patterns in
//       the replacement script to affect replacement behaviour. Until now, I was not bitten by this. What it
//       means is, if you’re loading in content you don’t necessarily control and it has the dollar-denoted
//       patterns in it, your replacement will not work as you thought it would. In this case, it broke on:
//
//       const $  = document.querySelector.bind(document)
//       const $$ = document.querySelectorAll.bind(document)
//
//       The code after the replacement (without the hack below) would read:
//
//       const $  = document.querySelector.bind(document)
//       const $ = document.querySelectorAll.bind(document)
//
//       This, of course, would then throw a JavaScript error.
//
//       The way replace() should be designed is to default to not using patterns in the replacement string
//       unless specifically told to do so.
//
const scripts = fs.readFileSync('tmp/scripts.js', 'utf-8').replace(/\$/g, '$$$$')

index = index.replace(/<\!-- Start: styles -->.*?<\!-- End: styles -->/s, `<style>${styles}</style>`)
index = index.replace(/<\!-- Start: scripts -->.*?<\!-- End: scripts -->/s, `<script>${scripts}</script>`)

fs.writeFileSync('tmp/index.html', index)
