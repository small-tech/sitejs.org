#!/usr/local/bin/node

////////////////////////////////////////////////////////////////////////////////
//
// Inline the minified assets.
//
////////////////////////////////////////////////////////////////////////////////

const fs = require('fs')
const path = require('path')

let index = fs.readFileSync('index.html', 'utf-8')
const styles = fs.readFileSync('tmp/styles.css', 'utf-8')
const scripts = fs.readFileSync('tmp/scripts.js', 'utf-8')

index = index.replace(/<\!-- Start: styles -->.*?<\!-- End: styles -->/s, `<style>${styles}</style>`)
index = index.replace(/<\!-- Start: scripts -->.*?<\!-- End: scripts -->/s, `<script>${scripts}</script>`)

fs.writeFileSync('tmp/index.html', index)
