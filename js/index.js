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
if (userAgent.includes('mac os x')) { currentPlatform = 'mac' }
if (userAgent.includes('windows')) { currentPlatform = 'windows'}

// If we know the platform, remove instructions that are not
// relevant for the current person
if (currentPlatform !== 'unknown') {

}

// TODO: Add option to display the page as if the person was on a different platform.


// displayInstallationInstructionsFor(currentPlatform)

// function displayInstallationInstructionsFor(currentPlatform) {
//   if (currentPlatform !== 'unknown') {
//     visiblePlatform = currentPlatform
//     // Show the instructions for the detected platform and hide the ones for the other platforms.
//     ;['linux', 'mac', 'windows'].forEach(platform => {
//       $(`#install-${platform}`).hidden = !(platform === currentPlatform)
//       $(`#link-${platform}`).hidden = (platform === currentPlatform)
//     })

//     // Cosmetic: don’t show the last separator if there’s no content after it.
//     $('#pipe-before-windows').hidden = (currentPlatform === 'windows')

//     // Show links to instructions for other platforms.
//     $('#links-to-instructions-for-other-platforms').hidden = false

//     // Show all the copy to clipboard buttons.
//     $$('.copy-to-clipboard').forEach(button => button.hidden = false)

//     // Rewrite the view installation script section copy to simplify it and link directly
//     // to the relevant script.
//     $('#view-installation-script-source').innerHTML = (currentPlatform === 'windows') ? '<a href="https://should-i-pipe.it/https://sitejs.org/install.txt">view the source code</a>' : '<a href="https://should-i-pipe.it/https://sitejs.org/install">view the source code</a>'

//     // Also rewrite the terminal-related bit of the copy to specify exactly the environment that
//     // we support on Windows 10.
//     $('#terminal-copy').innerHTML = (currentPlatform === 'windows') ? 'a PowerShell session running under <a href="https://github.com/Microsoft/Terminal">Windows Terminal</a>' : 'your terminal'

//     // Hide/display any Windows-only caveats.
//     $$('.windows-only').forEach(node => node.hidden = !(currentPlatform === 'windows'))

//     // Set the radio button states to match the installation instructions shown.
//     setRadioButtonStates()

//     // Display specific version-related information for the download.
//     displayVersionInformation()

//     // Disable the advanced customisation if for Windows. (At least for now, given that
//     // – surprise, surprise – Windows is again problematic in that you cannot pass arguments
//     // to downloaded scripts. See https://github.com/PowerShell/PowerShell/issues/8816#issuecomment-460327955)
//     $('#advanced-customisation').hidden = (currentPlatform === 'windows')
//   }
// }

// function copyInstallationInstructionsToClipboardFor (platform) {
//   const installationCommand = $(`#code-${platform}`)

//   const selectedCode = document.createRange()
//   selectedCode.selectNode(installationCommand)
//   window.getSelection().addRange(selectedCode)

//   try {
//     const success = document.execCommand('copy')
//     if (!success) console.log('Failed to copy installation command.')
//   } catch(error) {
//     console.log('Copy command threw an error', error)
//   }

//   // Remove the selections - NOTE: Should use
//   // removeRange(range) when it is supported
//   window.getSelection().removeRange(selectedCode)
// }

// function customiseDownloadMethod (type) {
//   const currentInstallationString = $(`#code-${visiblePlatform}`)
//   currentInstallationString.innerHTML = currentInstallationString.innerHTML.replace(type === 'wget -qO-' ? 'curl -s' : 'wget -qO-', type)
//   updateTitleState(currentInstallationString)
// }

// function customiseVersion (version) {
//   const currentInstallationString = $(`#code-${visiblePlatform}`)
//   currentInstallationString.innerHTML = currentInstallationString.innerHTML.replace(/(<span class="token keyword">\| bash<\/span>).*?$/, `$1${version}`)
//   updateTitleState(currentInstallationString)
// }

// function updateTitleState (currentInstallationString) {
//   const currentInstallationSectionTitle = $(`#title-details-${visiblePlatform}`)
//   currentInstallationSectionTitle.innerHTML = currentInstallationString.innerHTML === defaultInstallationString[visiblePlatform] ? '' : ' (customised)'

//   console.log('current', currentInstallationString.innerHTML)
//   console.log('default', defaultInstallationString[visiblePlatform])
// }

// function setRadioButtonStates () {
//   const currentInstallationString = $(`#code-${visiblePlatform}`).innerHTML
//   Object.keys(radioButtons).forEach(function(radioButtonValue) {
//     if (currentInstallationString.includes(radioButtonValue)) {
//       radioButtons[radioButtonValue].checked = true
//     }
//   })
//   // Special case: release.
//   if (!currentInstallationString.includes('alpha') && !currentInstallationString.includes('beta')) {
//     radioButtons['release'].checked = true
//   }
// }