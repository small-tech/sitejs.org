//
// The terminal presentation.
//
const NEW_LINE = '\n'
const EMPTY_LINE = '\n\n'
const WAIT_ONE_SEC = '^1000'
const WAIT_QUARTER_SEC = '^250'
const VERSION = '1.0.0'
const NBSP = '&nbsp;'

function comment (text) { return `<span style="color: #ccc"># ${text}</span>` }
function inGreen (text) { return `<span style="color: #849900">${text}</span>` }
function inCyan (text) { return `<span style="color: #29A097">${text}</span>` }

// We use our own Next button to step through the presentation as we have
// more than one terminal window and we don’t want the button to jump around
// between the windows as we switch between them.
const nextButton = document.querySelector('#next-button')

let nextButtonFirstTerminalPresentationHandler, nextButtonSecondTerminalPresentationHandler

const firstTerminalPresentation = new TerminalPresentation('terminal-presentation', [
  [
    // Slide 0
    `⯈ ${comment('Install')}${WAIT_ONE_SEC}`,
    `⯈ wget -q0- https://sitejs.org/install | bash`,
  ],
  [
    // Slide 1
    '',
    ` 📡 Downloading Site.js v${VERSION}…${WAIT_QUARTER_SEC}`,
    ` 📦 Installing…${WAIT_QUARTER_SEC}`,
    ` 🎉 Done!`,
    '',
    `⯈ ${WAIT_ONE_SEC}${comment('Run local development server')} ${WAIT_ONE_SEC}`,
    `⯈ site`
  ],
  [
    // Slide 2
    '',
    ` 💖 Site.js v${VERSION} (running on Node.js v10.15.3)`,
    '',
    ' 🚧 [Site.js] Using locally-trusted certificates.',
    ' 📜 [Nodecert] Local development TLS certificate exists.',
    '',
    ` 🎉 Serving ${inCyan('.')} on ${inGreen('https://localhost')}`,
    '',
    NBSP
  ],
  [
    // Slide 3: Exit local server and show command to start a global server.
    '^C',
    ' 💃 Preparing to exit gracefully, please wait…',
    '',
    ' 💖 Goodbye!',
    '',
    `⯈ ${WAIT_ONE_SEC}${comment('Run a globally-reachable staging server')}`,
    '⯈ site global '
  ],
  [
    // Slide 4: The global server output.
    '',
    ` 💖 Site.js v${VERSION} (running on Node.js v10.15.3)`,
    '',
    ' 🌍 [Site.js] Using globally-trusted certificates.',
    ' 👉 [Site.js] HTTP → HTTPS redirection active.',
    '',
    ` 🎉 Serving ${inCyan('.')} on ${inGreen('https://dev.ar.al')}`,
    '',
    NBSP
  ],
  [
    // Slide 5: Break out of global server.
    '^C',
    ' 💃 Preparing to exit gracefully, please wait…',
    '',
    ' 💖 Goodbye!',
    '',
    `⯈ ${comment('Start a local server and sync to remote server')}`,
    '⯈ site sync my-demo.site '
  ],
  [
    // Slide 6: Sync output.
    '',
    `💞 [Sync] Will sync folder ${inCyan('./')} to host ${inCyan('my-demo.site')}`,
    '',
    '💞 [Sync] Starting…',
    '',
    '💖 Site.js v1.0.0 (running on Node v10.15.3)',
    '',
    '🚧 [Site.js] Using locally-trusted certificates.',
    '📜 [Nodecert] Local development TLS certificate exists.',
    '',
    `🎉 Serving ${inCyan('./')} on ${inGreen('https://localhost')}`,
    '',
    '💞 [Sync] Calculating changes…',
    '💞 [Sync] ↑ 140 bytes ↓ 12 bytes (101.33 bytes/sec)',
    '💞 [Sync] total size is 497  speedup is 3.27',
    '💞 [Sync] Complete.',
    '',
    `💞 [Sync] Local folder ${inCyan('./')} synced to ${inCyan('my-demo.site')}`,
    '',
    `🔎 [Watch] Watching ${inCyan('./')} for changes to sync to ${inCyan('my-demo.site')}…`,
    '',
    NBSP
  ],
  [
    // Slide 7: Break out of local server with sync.
    '^C',
    ' 💞 [Sync] Exit request detected.',
    ' 🔎 [Watch] Removing watcher.',
    '',
    ' 💃 Preparing to exit gracefully, please wait…',
    '',
    ' 💖 Goodbye!',
    '',
    `⯈ ${comment('Start a production server (startup daemon)')}`,
    '⯈ site enable '
  ],
  [
    // Slide 8: Last slide – output of starting startup daemon.
    '',
    ` 💖 Site.js v${VERSION} (running on Node.js v10.15.3)`,
    '',
    ` 😈 Launched as daemon on ${inGreen('https://ar.al')} serving ${inCyan('.')}`,
    '',
    ' 😈 Installed for auto-launch at startup.',
    '',
    ` 😁👍 You’re all set!`,
    '',
    '⯈ '
  ]
], {
  controls: false,
  onReady: () => {
    console.log('>>> On ready')
    nextButtonFirstTerminalPresentationHandler = event => { firstTerminalPresentation.start() }
    nextButton.addEventListener('click', nextButtonFirstTerminalPresentationHandler)
  },
  onStart: () => {
    console.log('>>> On start')
    nextButton.disabled = true
  },
  onStop: () => {
    console.log('>>> On stop')
    nextButton.disabled = false
  },
  onSlide: (slide) => {
    //
    // Split the terminals and create a second terminal animation.
    //
    if (slide === 4) {
      //
      // This sequence runs after slide 4.
      //
      nextButton.removeEventListener('click', nextButtonFirstTerminalPresentationHandler)

      document.querySelector('#presentation').style.gridTemplateColumns = '50% 50%'

      const secondTerminalPresentation = new TerminalPresentation('second-terminal-presentation', [
        [
          // Slide 1.
          `⯈ ${comment('Expose local server globally')}${WAIT_ONE_SEC}`,
          `⯈ ngrok start --all`,
        ],
        [
          // An empty slide to ensure we pause on the first slide.
          ''
        ]
      ], {
        controls: false,
        onReady: () => {
          console.log('Second terminal presentation is ready.')
          nextButtonSecondTerminalPresentationHandler = event => { secondTerminalPresentation.start() }
          nextButton.addEventListener('click', nextButtonSecondTerminalPresentationHandler)
        },
        onComplete: () => {
          const ngrokInterfaceMock = [
            `${inCyan('ngrok')} by ${inCyan('@inconshreveable')}`,
            '',
            `${inGreen('Status      online')}`,
            'Account     Pro (Plan: Ind.ie)',
            'Region      Europe (eu)',
            'Forwarding  dev.ar.al -> localhost'
          ].join('\n')

          const secondPresentationTerminalCode = document.querySelector('#second-terminal-presentation .terminal-code-second-terminal-presentation')

          secondPresentationTerminalCode.innerHTML = ngrokInterfaceMock

          // Return control to the first terminal presentation.
          nextButton.removeEventListener('click', nextButtonSecondTerminalPresentationHandler)
          nextButton.addEventListener('click', nextButtonFirstTerminalPresentationHandler)
        }
      })

    } else if (slide === 5) {
      //
      // This sequence runs after slide 5.
      //

      // Hide the second terminal window.
      setTimeout(() => {
        document.querySelector('#presentation').style.gridTemplateColumns = '100%'
        document.querySelector('#second-terminal-presentation').style.display = 'none'
      }, 1000)
    }
  }
})
