////////////////////////////////////////////////////////////////////////////////
//
// Site.js
//
// JavaScript for the index file. None of this JavaScript is required.
// It’s all just progressive enhancement.
//
// Copyright ⓒ 2020 Aral Balkan. Licensed under AGPLv3 or later.
// Shared with ♥ by the Small Technology Foundation.
//
// Like this? Fund us!
// https://small-tech.org/fund-us
//
////////////////////////////////////////////////////////////////////////////////

// Start the syntax highlighter.
// TODO: Move this to the server side build script.
hljs.initHighlightingOnLoad()

// Useful shortcuts for DOM lookups.
const $  = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// Add copy buttons to all code segments.
// Note: only supported on evergreen browsers.
if (navigator.clipboard !== undefined) {
  $('#copy-tip').className = 'tip shown'
  const copyAlert = $('#copy-alert')
  const codeSegments = $$('pre code')
  codeSegments.forEach(codeSegment => {
    codeSegment.addEventListener('click', (event) => {
      // If there is a selection, copy that. If not, copy the whole code section.
      const selection = document.getSelection()
      const codeToCopy = selection.toString() === '' ? event.target.innerText : selection.toString();
      navigator.clipboard.writeText(codeToCopy).then(() => {
        copyAlert.className = 'show-copy-alert'
        setTimeout(() => { copyAlert.className = 'hide-copy-alert' }, 1000)
      }, error => {
        alert('Copy to clipboard failed. People copy the code manually.', error)
      })
    })
  })
}

// Platform detection.
const userAgent = navigator.userAgent.toLowerCase()
let currentPlatform = 'unknown'
if (userAgent.includes('linux')) { currentPlatform = 'linux' }
if (userAgent.includes('mac os x')) { currentPlatform = 'macos' }
if (userAgent.includes('windows')) { currentPlatform = 'windows'}

// If we know the platform, remove instructions that are not
// relevant for the current platform.
if (currentPlatform !== 'unknown') {

  function displayInstructionsForPlatform(platform) {
    console.log('displaying instructions for', platform, $$)
    ;['.linux', '.macos', '.windows'].forEach(className => {
      $$(className).forEach(node => {
        if (node.classList.contains(platform)) {
          node.classList.remove('hidden')
        } else {
          node.classList.add('hidden')
        }
      })
    })
  }

  // Display the tab control that allows people to see instructions for
  // platforms other than their own.
  const platformTabsControl = $('#platform-tabs')
  const platformTabs = $$('#platform-tabs li button')

  platformTabs.forEach(platformTab => {
    if (platformTab.dataset.platform === currentPlatform) {
      platformTab.className = 'active'
    }

    platformTab.addEventListener('click', event => {
      const requestedPlatform = event.target.dataset.platform
      platformTabs.forEach(platformTab => {
        platformTab.className = requestedPlatform === platformTab.dataset.platform ? 'active' : ''
      })
      displayInstructionsForPlatform(requestedPlatform)
    })
  })

  platformTabsControl.classList.remove('hidden')

  // Hide all the elements that only make sense to show if JavaScript
  // is not being executed.
  $$('.no-js').forEach(node => node.className='hidden')

  // Show only the elements that pertain to the current platform.
  displayInstructionsForPlatform(currentPlatform)
}
