//
// The terminal presentation.
// Copyright ⓒ 2019 Aral Balkan. License: AGPLv3 or later.
//
// Requires terminal-presentation and browser-presentation.
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

// Initialise the Browser Presentation.
const browserPresentation = new BrowserPresentation(
  'browser',
  'https://sitejs.org/demo-instructions',
  '<p>Use the <strong>Next</strong> button to progress through the demo.</p>'
)

// We use our own Next button to step through the presentation as we have
// more than one terminal window and we don’t want the button to jump around
// between the windows as we switch between them.
const nextButton = document.querySelector('#next-button')

let nextButtonFirstTerminalPresentationHandler, nextButtonSecondTerminalPresentationHandler

const firstTerminalPresentation = new TerminalPresentation(
  // Id.
  'terminal-presentation',
  // Slides
  [
    [
      `⯈ ${comment('Install')}${WAIT_QUARTER_SEC}`,
      `⯈ wget -q0- https://sitejs.org/install | bash`,
    ],
    [
      '',
      ` 📡 Downloading Site.js v${VERSION}…${WAIT_QUARTER_SEC}`,
      ` 📦 Installing…${WAIT_QUARTER_SEC}`,
      ` 🎉 Done!`,
      '',
      `⯈ ${WAIT_ONE_SEC}${comment('Create a web page')} `,
      `⯈ echo 'Hello, development' > index.html`,
    ],
    [
      '',
      `⯈ ${comment('Run local development server')} ${WAIT_QUARTER_SEC}`,
      `⯈ site`
    ],
    [
      '',
      ` 💖 Site.js v${VERSION} (running on Node.js v10.15.3)`,
      '',
      ' 🚧 [Site.js] Using locally-trusted certificates.',
      ' 📜 [Nodecert] Local development TLS certificate exists.',
      '',
      ` 🎉 Serving ${inCyan('.')} on ${inGreen('https://localhost')}`,
      '',
      NBSP,
      () => {
        // After the local server is run, simulate it being loaded in the browser.
        nextButton.disabled = true

        setTimeout(() => {
          browserPresentation.browseTo('https://localhost', '<p>Hello, development!</p>', () => {
            nextButton.disabled = false
          })
        }, 1000)
      }
    ],
    [
      // Exit local server and show command to start a global server.
      '^C',
      ' 💃 Preparing to exit gracefully, please wait…',
      '',
      ' 💖 Goodbye!',
      '',
      `⯈ ${WAIT_ONE_SEC}${comment('Update the web page')} `,
      `⯈ echo 'Hello, staging!' > index.html`,
      '',
      `⯈ ${WAIT_ONE_SEC}${comment('Run a globally-reachable staging server')}`,
      '⯈ site global '
    ],
    [
      // The global server output.
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
      // An empty step to ensure we pause before splitting the screen
      // so as not to jar the person watching.
      '',
      () => {
        // Pause proxying Next button events to the first terminal presentation.
        nextButton.removeEventListener('click', nextButtonFirstTerminalPresentationHandler)

        //
        // Split the terminal (create a second terminal presentation) to show
        // ngrok running.
        //
        document.querySelector('#presentation').style.gridTemplateColumns = '50% 50%'

        const secondTerminalPresentation = new TerminalPresentation(
          // Id.
          'second-terminal-presentation',
          // Slides.
          [
            [
              // Slide 1.
              `⯈ ${comment('Expose local server globally')}${WAIT_ONE_SEC}`,
              `⯈ ngrok start --all`,
            ],
            [
              // An empty slide to ensure we pause on the first slide.
              ''
            ]
          ],
          // Options.
          {
            controls: false,
            onReady: () => {
              // Wire up the next button to effect the second terminal presentation.
              nextButtonSecondTerminalPresentationHandler = event => { secondTerminalPresentation.start() }
              nextButton.addEventListener('click', nextButtonSecondTerminalPresentationHandler)
            },
            onComplete: () => {
              // Display a mocked up ngrok interface as fullscreen
              // (without the typing effect).
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

              // After the local server is run, simulate it being loaded in the browser.
              nextButton.disabled = true

              setTimeout(() => {
                browserPresentation.browseTo('https://dev.ar.al', '<p>Hello, staging!</p>', () => {
                  nextButton.disabled = false
                })
              }, 1000)

              // On the next Next button click, remove the second terminal presentation and return
              // control to the first terminal presentation.
              const clearUpSecondTerminalPresentation = event => {
                nextButton.removeEventListener('click', clearUpSecondTerminalPresentation)
                nextButton.addEventListener('click', nextButtonFirstTerminalPresentationHandler)

                document.querySelector('#presentation').style.gridTemplateColumns = '100%'
                document.querySelector('#second-terminal-presentation').style.display = 'none'

                firstTerminalPresentation.start()
              }
              nextButton.addEventListener('click', clearUpSecondTerminalPresentation)
            }
          }
        )
      }
    ],
    [
      // Break out of global server.
      '^C',
      ' 💃 Preparing to exit gracefully, please wait…',
      '',
      ' 💖 Goodbye!',
      '',
      `⯈ ${comment('Start a local server and sync to remote server')}`,
      '⯈ site sync my-demo.site '
    ],
    [
      // Sync output.
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
      // Break out of local server with sync.
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
      // Last slide – output of starting startup daemon.
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
  ],
  // Options.
  {
    controls: false,
    onReady: () => {
      nextButtonFirstTerminalPresentationHandler = event => { firstTerminalPresentation.start() }
      nextButton.addEventListener('click', nextButtonFirstTerminalPresentationHandler)
    },
    onStart: () => {
      // Disable the Next button while typing animations are in effect.
      nextButton.disabled = true
    },
    onStop: () => {
      // Enable the Next button when typing animations end.
      nextButton.disabled = false
    },
    onComplete: () => {
      // We’re done with the whole presentation; hide the Next button.
      nextButton.hidden = true
    }
  }
)
