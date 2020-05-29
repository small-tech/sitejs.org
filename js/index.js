//////////////////////////////////////////////////////////////////////
//
// ⚠ GENERATED CODE. Please do not change.
//
// These are the latest versions of the various release channels.
// They are automatically populated by the Site.js build script
// on deployment.
//
//////////////////////////////////////////////////////////////////////

const versions = {
  alphaBinaryVersion: 00000000000000,
  alphaNodeVersion: '00.00.00',
  alphaHugoVersion: '00.00.00',
  alphaPackageVersion: '00.00.00',
  alphaSourceVersion: 'bedface',

  betaBinaryVersion: 00000000000000,
  betaNodeVersion: '00.00.00',
  betaHugoVersion: '00.00.00',
  betaPackageVersion: '00.00.00',
  betaSourceVersion: 'acecafe',

  releaseBinaryVersion: 00000000000000,
  releaseNodeVersion: '00.00.00',
  releaseHugoVersion: '00.00.00',
  releasePackageVersion: '00.00.00',
  releaseSourceVersion: 'decafAF',
}

//////////////////////////////////////////////////////////////////////
// End of generated code.
//////////////////////////////////////////////////////////////////////

const $  = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function binaryVersionToHumanReadableDateString (binaryVersion) {
  console.log(binaryVersion)
  const m = moment(binaryVersion, 'YYYYMMDDHHmmss')
  return `${m.format('MMMM Do, YYYY')} at ${m.format('HH:mm:ss')}`
}

// Progressively enhance the installation instructions to only show the ones for the
// detected platform (with links to the others), if we can detect a supported platform.
let visiblePlatform = 'linux'

function displayVersionInformation () {

  const _ = version => versions[`${document.advanced.version.value}${version}`]

  $$('.humanReadableBinaryVersion').forEach(span =>
    span.innerHTML = binaryVersionToHumanReadableDateString(_('BinaryVersion'))
  )
  $$('.packageVersion').forEach(span => span.innerHTML = _('PackageVersion'))
  $$('.sourceVersion').forEach(span => span.innerHTML = _('SourceVersion'))
  $$('.nodeVersion').forEach(span => span.innerHTML = _('NodeVersion'))
  $$('.hugoVersion').forEach(span => span.innerHTML = _('HugoVersion'))
  $$('.sourceUrl').forEach(a =>
    a.setAttribute('href', `https://github.com/small-tech/site.js/-/tree/${_('SourceVersion')}`)
  )
}

const defaultInstallationString = {
  linux: $('#code-linux').innerHTML,
  mac: $('#code-mac').innerHTML,
  windows: $('#code-windows').innerHTML
}

function inputWithValue(value) {
  return $(`input[value="${value}"]`)
}
const radioButtons = {
  wget: inputWithValue('wget'),
  curl: inputWithValue('curl'),
  release: inputWithValue('release'),
  alpha: inputWithValue('alpha'),
  beta: inputWithValue('beta')
}

const userAgent = navigator.userAgent.toLowerCase()
let currentPlatform = 'unknown'
if (userAgent.includes('linux')) { currentPlatform = 'linux' }
if (userAgent.includes('mac os x')) { currentPlatform = 'mac' }
if (userAgent.includes('windows')) { currentPlatform = 'windows'}

displayInstallationInstructionsFor(currentPlatform)

function displayInstallationInstructionsFor(currentPlatform) {
  if (currentPlatform !== 'unknown') {
    visiblePlatform = currentPlatform
    // Show the instructions for the detected platform and hide the ones for the other platforms.
    ;['linux', 'mac', 'windows'].forEach(platform => {
      $(`#install-${platform}`).hidden = !(platform === currentPlatform)
      $(`#link-${platform}`).hidden = (platform === currentPlatform)
    })

    // Cosmetic: don’t show the last separator if there’s no content after it.
    $('#pipe-before-windows').hidden = (currentPlatform === 'windows')

    // Show links to instructions for other platforms.
    $('#links-to-instructions-for-other-platforms').hidden = false

    // Show all the copy to clipboard buttons.
    $$('.copy-to-clipboard').forEach(button => button.hidden = false)

    // Rewrite the view installation script section copy to simplify it and link directly
    // to the relevant script.
    $('#view-installation-script-source').innerHTML = (currentPlatform === 'windows') ? '<a href="https://should-i-pipe.it/https://sitejs.org/install.txt">view the source code</a>' : '<a href="https://should-i-pipe.it/https://sitejs.org/install">view the source code</a>'

    // Also rewrite the terminal-related bit of the copy to specify exactly the environment that
    // we support on Windows 10.
    $('#terminal-copy').innerHTML = (currentPlatform === 'windows') ? 'a PowerShell session running under <a href="https://github.com/Microsoft/Terminal">Windows Terminal</a>' : 'your terminal'

    // Hide/display any Windows-only caveats.
    $$('.windows-only').forEach(node => node.hidden = !(currentPlatform === 'windows'))

    // Set the radio button states to match the installation instructions shown.
    setRadioButtonStates()

    // Display specific version-related information for the download.
    displayVersionInformation()

    // Disable the advanced customisation if for Windows. (At least for now, given that
    // – surprise, surprise – Windows is again problematic in that you cannot pass arguments
    // to downloaded scripts. See https://github.com/PowerShell/PowerShell/issues/8816#issuecomment-460327955)
    $('#advanced-customisation').hidden = (currentPlatform === 'windows')
  }
}

function copyInstallationInstructionsToClipboardFor (platform) {
  const installationCommand = $(`#code-${platform}`)

  const selectedCode = document.createRange()
  selectedCode.selectNode(installationCommand)
  window.getSelection().addRange(selectedCode)

  try {
    const success = document.execCommand('copy')
    if (!success) console.log('Failed to copy installation command.')
  } catch(error) {
    console.log('Copy command threw an error', error)
  }

  // Remove the selections - NOTE: Should use
  // removeRange(range) when it is supported
  window.getSelection().removeRange(selectedCode)
}

function customiseDownloadMethod (type) {
  const currentInstallationString = $(`#code-${visiblePlatform}`)
  currentInstallationString.innerHTML = currentInstallationString.innerHTML.replace(type === 'wget -qO-' ? 'curl -s' : 'wget -qO-', type)
  updateTitleState(currentInstallationString)
}

function customiseVersion (version) {
  const currentInstallationString = $(`#code-${visiblePlatform}`)
  currentInstallationString.innerHTML = currentInstallationString.innerHTML.replace(/(<span class="token keyword">\| bash<\/span>).*?$/, `$1${version}`)
  updateTitleState(currentInstallationString)
}

function updateTitleState (currentInstallationString) {
  const currentInstallationSectionTitle = $(`#title-details-${visiblePlatform}`)
  currentInstallationSectionTitle.innerHTML = currentInstallationString.innerHTML === defaultInstallationString[visiblePlatform] ? '' : ' (customised)'

  console.log('current', currentInstallationString.innerHTML)
  console.log('default', defaultInstallationString[visiblePlatform])
}

function setRadioButtonStates () {
  const currentInstallationString = $(`#code-${visiblePlatform}`).innerHTML
  Object.keys(radioButtons).forEach(function(radioButtonValue) {
    if (currentInstallationString.includes(radioButtonValue)) {
      radioButtons[radioButtonValue].checked = true
    }
  })
  // Special case: release.
  if (!currentInstallationString.includes('alpha') && !currentInstallationString.includes('beta')) {
    radioButtons['release'].checked = true
  }
}