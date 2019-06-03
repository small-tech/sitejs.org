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
        setTimeout(() => { nextButton.disabled = true }, 0)

        setTimeout(() => {
          firstTerminalPresentation.unfocus()
          browserPresentation.browseTo('https://localhost', '<p>Hello, development!</p>', () => {
            setTimeout(() => {
              browserPresentation.unfocus()
              firstTerminalPresentation.focus()
              nextButton.disabled = false
            }, 1000)
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
      NBSP,
      () => {
        setTimeout(() => { nextButton.disabled = true }, 0)

        //
        // Split the terminal (create a second terminal presentation) to show
        // ngrok running.
        //
        document.querySelector('#presentation').style.gridTemplateColumns = '49.5% 49.5%'

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
              console.log('Second: ready')
              // Pause proxying Next button events to the first terminal presentation.
              nextButton.removeEventListener('click', nextButtonFirstTerminalPresentationHandler)

              // Hide cursor in first terminal.
              document.querySelector('.typed-cursor').style.opacity = 0

              // Wire up the next button to effect the second terminal presentation.
              nextButtonSecondTerminalPresentationHandler = event => { secondTerminalPresentation.start() }
              nextButton.addEventListener('click', nextButtonSecondTerminalPresentationHandler)
              nextButton.disabled = true
            },
            onStart: () => {
              console.log('Second: on start, disabling next button')
              // Disable the Next button while typing animations are in effect.
              nextButton.disabled = true
            },
            onStop: () => {
              console.log('Second: on stop, enabling next button')
              // Enable the Next button when typing animations end.
              nextButton.disabled = false
            },
            onComplete: () => {
              console.log('Second: on complete')
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

              nextButton.disabled = true

              // On the next Next button click, remove the second terminal presentation and return
              // control to the first terminal presentation.
              const clearUpSecondTerminalPresentation = event => {
                nextButton.removeEventListener('click', clearUpSecondTerminalPresentation)
                nextButton.addEventListener('click', nextButtonFirstTerminalPresentationHandler)

                document.querySelector('#presentation').style.gridTemplateColumns = '100%'
                document.querySelector('#second-terminal-presentation').style.display = 'none'

                // Show cursor in first terminal.
                document.querySelector('.typed-cursor').style.opacity = 1

                // Restart the first terminal presentation.
                firstTerminalPresentation.start()
              }

              nextButton.removeEventListener('click', nextButtonSecondTerminalPresentationHandler)
              nextButton.addEventListener('click', clearUpSecondTerminalPresentation)

              setTimeout(() => {
                firstTerminalPresentation.unfocus()
                secondTerminalPresentation.unfocus()
                browserPresentation.browseTo('https://dev.ar.al', '<p>Hello, staging!</p>', () => {
                  setTimeout(() => {
                    browserPresentation.unfocus()
                    firstTerminalPresentation.focus()
                    secondTerminalPresentation.focus()
                    nextButton.disabled = false
                  }, 1000)
                })
              }, 1000)
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
      `⯈ ${comment('SSH to production server')}`,
      '⯈ ssh my-demo.site',
    ],
    [
      '',
      `my-demo.site ⯈ ${WAIT_ONE_SEC}${comment('Create a web page')} `,
      `my-demo.site ⯈ echo 'Hello, production!' > index.html`,
      '',
      `my-demo.site ⯈ ${comment('Start production server (startup daemon)')}`,
      'my-demo.site ⯈ site enable '
    ],
    [
      // Last slide – output of starting startup daemon.
      '',
      ` 💖 Site.js v${VERSION} (running on Node.js v10.15.3)`,
      '',
      ` 😈 Launched as daemon on ${inGreen('https://my-demo.site')} serving ${inCyan('.')}`,
      '',
      ' 😈 Installed for auto-launch at startup.',
      '',
      ` 😁👍 You’re all set!`,
      '',
      'my-demo.site ⯈ ',
      () => {
        // After the production server is run, simulate it being loaded in the browser.
        nextButton.disabled = true

        setTimeout(() => {
          firstTerminalPresentation.unfocus()
          browserPresentation.browseTo('https://my-demo.site', '<p>Hello, production!</p>', () => {
            setTimeout(() => {
              browserPresentation.unfocus()
              firstTerminalPresentation.focus()
              nextButton.disabled = false
            }, 1000)
          })
        }, 1000)
      }
    ],
    [
      `my-demo.site ⯈ ${comment('Close the SSH session')}`,
      `my-demo.site ⯈ logout`,
    ],
    [
      '',
      'Connection to my-demo.site closed.',
      '',
      `⯈ ${WAIT_ONE_SEC}${comment('Update the web page')} `,
      `⯈ echo '🎈 🏃‍♀️ There is always hope!' > index.html`,
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
      NBSP,
      () => {
        // After the sync server is run, simulate the browser being refreshed in the browser.
        nextButton.disabled = true

        setTimeout(() => {
          firstTerminalPresentation.unfocus()
          browserPresentation.refreshWith('<p>🎈 🏃‍♀️ There is always hope!</p>', () => {
            setTimeout(() => {
              browserPresentation.unfocus()
              firstTerminalPresentation.focus()
              nextButton.disabled = false
            }, 1000)
          })
        }, 1000)
      }
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
      `⯈ `,
    ],
  ],
  // Options.
  {
    controls: false,
    onReady: () => {
      console.log('First: Ready')
      // The first time the next button is pressed, blur out the background and kick things off.

      const initialClickEventHandler = (event) => {
        // Remove the initial click event handler after the first run.
        nextButton.removeEventListener('click', initialClickEventHandler)

        // Unfocus the browser so attention is on the terminal.
        browserPresentation.unfocus()

        // Wire up the correct handler and kick things off.
        nextButtonFirstTerminalPresentationHandler = event => {
          browserPresentation.unfocus()
          firstTerminalPresentation.start()
        }
        nextButton.addEventListener('click', nextButtonFirstTerminalPresentationHandler)
        firstTerminalPresentation.start()
      }
      nextButton.addEventListener('click', initialClickEventHandler)
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
      browserPresentation.focus()
      nextButton.hidden = true
    }
  }
)
