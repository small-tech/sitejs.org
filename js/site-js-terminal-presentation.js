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
const VERSION = '12.10.0'
const NBSP = '&nbsp;'

//
// Prepare the emoji used in the header presentation.
//

let imagesToPreload = ''

const ZERO_WIDTH_SPACE = '\u200B'

const emoji = (name) => {
  const _ = `${ZERO_WIDTH_SPACE}<span class="emoji emoji-${name}"></span>`
  imagesToPreload += _
  return _
};

const EMOJI_SATELLITE = emoji('satellite')
const EMOJI_PACKAGE = emoji('package')
const EMOJI_PARTY_POPPER = emoji('party-popper')
const EMOJI_SPARKLING_HEART = emoji('sparkling-heart')
const EMOJI_CONSTRUCTION_SIGN = emoji('construction-sign')
const EMOJI_SCROLL = emoji('scroll')
const EMOJI_DANCER = emoji('dancer')
const EMOJI_EARTH_GLOBE_EUROPE_AFRICA = emoji('earth-globe-europe-africa')
const EMOJI_WHITE_RIGHT_HAND_POINTING_BACKHAND_INDEX = emoji('white-right-hand-pointing-backhand-index')
const EMOJI_SMILING_FACE_WITH_HORNS = emoji('smiling-face-with-horns')
const EMOJI_GRINNING_FACE_WITH_SMILING_EYES = emoji('grinning-face-with-smiling-eyes')
const EMOJI_THUMBS_UP_SIGN = emoji('thumbs-up-sign')
const EMOJI_BALLOON = emoji('balloon')
const EMOJI_WOMAN_RUNNING = emoji('woman-running')
const EMOJI_REVOLVING_HEARTS = emoji('revolving-hearts')
const EMOJI_MAGNIFYING_GLASS_TILTED_RIGHT = emoji('magnifying-glass-tilted-right')
const EMOJI_NEW_BUTTON = emoji('new-button')
const EMOJI_PEN = emoji('pen')
const EMOJI_SMILING_FACE_WITH_HALO = emoji('smiling-face-with-halo')
const EMOJI_BAR_CHART = emoji('bar-chart')

// Other icons

// Note: we start the prompt with a zero-width space so that Typed doesn’t
// ===== get confused because our strings start with an HTML element and thus
//       refuse to fire the onReady event.
const PROMPT = `${ZERO_WIDTH_SPACE}<span class="icon icon-right-triangle"></span>`
const REMOTE_PROMPT = `(<span class="icon icon-cloud"></span>)`

imagesToPreload += PROMPT + REMOTE_PROMPT

// Create and add the image preloader to the page.
const imagePreloader = document.createElement('div')
imagePreloader.className = 'image-preloader'
imagePreloader.innerHTML = imagesToPreload
document.querySelector('main').appendChild(imagePreloader)

//
// Helper functions for colourising text.
//

function comment (text) { return `${ZERO_WIDTH_SPACE}<span style="color: #ccc"># ${text}</span>` }
function inGreen (text) { return `${ZERO_WIDTH_SPACE}<span style="color: #849900">${text}</span>` }
function inCyan (text) { return `${ZERO_WIDTH_SPACE}<span style="color: #29A097">${text}</span>` }

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
      `${PROMPT} ${comment('Install')}${WAIT_QUARTER_SEC}`,
      `${PROMPT} ${navigator.userAgent.toLowerCase().includes('mac os x') ? 'curl -s' : 'wget -qO-'} https://sitejs.org/install | bash`,
    ],
    [
      '',
      ` ${EMOJI_SATELLITE} Downloading Site.js v${VERSION}…${WAIT_QUARTER_SEC}`,
      ` ${EMOJI_PACKAGE} Installing…${WAIT_QUARTER_SEC}`,
      ` ${EMOJI_PARTY_POPPER} Done!`,
      '',
      `${PROMPT} ${WAIT_ONE_SEC}${comment('Create a web page')} `,
      `${PROMPT} echo 'Hello, &lt;strong&gt;development!&lt;/strong&gt;' > index.html`,
    ],
    [
      '',
      `${PROMPT} ${comment('Run local development server')} ${WAIT_QUARTER_SEC}`,
      `${PROMPT} site`
    ],
    [
      '',
      ` ${EMOJI_SPARKLING_HEART} Site.js v${VERSION} (running on Node.js v10.15.3)`,
      '',
      ` ${EMOJI_SMILING_FACE_WITH_HALO} [Site.js] First run on Linux: got privileges to bind to ports < 1024.`,
      '',
      ` ${EMOJI_CONSTRUCTION_SIGN} [Site.js] Using locally-trusted certificates.`,
      '',
      ` ${EMOJI_NEW_BUTTON} [Nodecert] Setting up…`,
      ` ${EMOJI_PEN} [Nodecert] Creating local certificate authority (local CA) using mkcert…`,
      ` ${EMOJI_PARTY_POPPER} [Nodecert] Local certificate authority created.`,
      '',
      ` ${EMOJI_SCROLL} [Nodecert] Creating local TLS certificates using mkcert…`,
      ` ${EMOJI_PARTY_POPPER} [Nodecert] Local TLS certificates created.`,
      '',
      ` ${EMOJI_PARTY_POPPER} Serving ${inCyan('.')} on ${inGreen('https://localhost')}`,
      '',
      ` ${EMOJI_BAR_CHART} For statistics, see https://localhost/909b721d634e89c44754cc036fb379e1`,
      '',
      NBSP,
      () => {
        // After the local server is run, simulate it being loaded in the browser.
        setTimeout(() => { nextButton.disabled = true }, 0)

        setTimeout(() => {
          firstTerminalPresentation.unfocus()
          browserPresentation.browseTo('https://localhost', '<p>Hello, <strong>development!</strong></p>', () => {
            setTimeout(() => {
              nextButton.disabled = false
            }, 1000)
          })
        }, 1000)
      }
    ],
    [
      // Exit local server and show command to start a global server.
      '^C',
      ` ${EMOJI_DANCER} Preparing to exit gracefully, please wait…`,
      '',
      ` ${EMOJI_SPARKLING_HEART} Goodbye!`,
      '',
      `${PROMPT} ${WAIT_ONE_SEC}${comment('Update the web page')} `,
      `${PROMPT} echo 'Hello, &lt;strong&gt;testing!&lt;/strong&gt;' > index.html`,
      '',
      `${PROMPT} ${WAIT_ONE_SEC}${comment('Run a globally-reachable testing server')}`,
      `${PROMPT} site @hostname`
    ],
    [
      // The global server output.
      '',
      ` ${EMOJI_SPARKLING_HEART} Site.js v${VERSION} (running on Node.js v10.15.3)`,
      '',
      ` ${EMOJI_EARTH_GLOBE_EUROPE_AFRICA} [Site.js] Using globally-trusted certificates.`,
      ` ${EMOJI_WHITE_RIGHT_HAND_POINTING_BACKHAND_INDEX} [Site.js] HTTP → HTTPS redirection active.`,
      '',
      ` ${EMOJI_PARTY_POPPER} Serving ${inCyan('.')} on ${inGreen('https://dev.ar.al')}`,
      '',
      ` ${EMOJI_BAR_CHART} For statistics, see https://localhost/909b721d634e89c44754cc036fb379e1`,
      NBSP,
      () => {
        setTimeout(() => { nextButton.disabled = true }, 0)

        //
        // Split the terminal (create a second terminal presentation) to show
        // ngrok running.
        //
        setTimeout(() => {
          firstTerminalPresentation.unfocus()
          //document.querySelector('#presentation').style.gridTemplateColumns = '49.5% 49.5%'
          document.querySelector('#presentation').classList.add('split-terminals')

          const secondTerminalPresentation = new TerminalPresentation(
            // Id.
            'second-terminal-presentation',
            // Slides.
            [
              [
                // Slide 1.
                `${PROMPT} ^1000${comment('Expose local server globally')}${WAIT_ONE_SEC}`,
                `${PROMPT} ngrok start --all`,
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
                // Disable the Next button while typing animations are in effect.
                nextButton.disabled = true
              },
              onStop: () => {
                // Enable the Next button when typing animations end.
                nextButton.disabled = false
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

                nextButton.disabled = true

                // On the next Next button click, remove the second terminal presentation and return
                // control to the first terminal presentation.
                const clearUpSecondTerminalPresentation = event => {
                  nextButton.disabled = true
                  nextButton.removeEventListener('click', clearUpSecondTerminalPresentation)
                  nextButton.addEventListener('click', nextButtonFirstTerminalPresentationHandler)

                  document.querySelector('#presentation').classList.remove('split-terminals')
                  document.querySelector('#second-terminal-presentation').style.display = 'none'

                  // Show cursor in first terminal.
                  document.querySelector('.typed-cursor').style.opacity = 1

                  // Restart the first terminal presentation.
                  firstTerminalPresentation.focus()
                  browserPresentation.unfocus()
                  setTimeout(() => {
                    firstTerminalPresentation.start()
                  }, 1000)
                }

                nextButton.removeEventListener('click', nextButtonSecondTerminalPresentationHandler)
                nextButton.addEventListener('click', clearUpSecondTerminalPresentation)

                setTimeout(() => {
                  firstTerminalPresentation.unfocus()
                  secondTerminalPresentation.unfocus()
                  browserPresentation.browseTo('https://dev.ar.al', '<p>Hello, <strong>testing!</strong></p>', () => {
                    setTimeout(() => {
                      nextButton.disabled = false
                    }, 1000)
                  })
                }, 2000)
              }
            }
          )
        }, 1000)
      }
    ],
    [
      // Break out of global server.
      '^C',
      ` ${EMOJI_DANCER} Preparing to exit gracefully, please wait…`,
      '',
      ` ${EMOJI_SPARKLING_HEART} Goodbye!`,
      '',
      `${PROMPT} ${comment('SSH to production server')}`,
      `${PROMPT} ssh my-demo.site `
    ],
    [
      () => {
        firstTerminalPresentation.setTitle('my-demo.site: ~/demo')
      },
      '',
      `${REMOTE_PROMPT} ${WAIT_ONE_SEC}${comment('Create a web page')} `,
      `${REMOTE_PROMPT} echo 'Hello, &lt;strong&gt;production!&lt;/strong&gt;' > index.html`,
      '',
      `${REMOTE_PROMPT} ${comment('Start production server (startup daemon)')}`,
      `${REMOTE_PROMPT} site enable `
    ],
    [
      // Last slide – output of starting startup daemon.
      '',
      ` ${EMOJI_SPARKLING_HEART} Site.js v${VERSION} (running on Node.js v10.15.3)`,
      '',
      ` ${EMOJI_SMILING_FACE_WITH_HORNS} Launched as daemon on ${inGreen('https://my-demo.site')} serving ${inCyan('.')}`,
      '',
      ` ${EMOJI_SMILING_FACE_WITH_HORNS} Installed for auto-launch at startup.`,
      '',
      ` ${EMOJI_GRINNING_FACE_WITH_SMILING_EYES}${EMOJI_THUMBS_UP_SIGN} You’re all set!`,
      '',
      `${REMOTE_PROMPT} `,
      () => {
        // After the production server is run, simulate it being loaded in the browser.
        setTimeout(() => { nextButton.disabled = true }, 0)

        setTimeout(() => {
          firstTerminalPresentation.unfocus()
          browserPresentation.browseTo('https://my-demo.site', '<p>Hello, <strong>production!</strong></p>', () => {
            setTimeout(() => {
              nextButton.disabled = false
            }, 1000)
          })
        }, 1000)
      }
    ],
    [
      `${REMOTE_PROMPT} ${comment('Close the SSH session')}`,
      `${REMOTE_PROMPT} logout`,
    ],
    [
      () => {
        firstTerminalPresentation.setTitle('~/demo')
      },
      '',
      'Connection to my-demo.site closed.',
      '',
      `${PROMPT} ${WAIT_ONE_SEC}${comment('Update the web page')} `,
      `${PROMPT} echo '${EMOJI_BALLOON}&lt;br&gt;&amp;nbsp; ${EMOJI_WOMAN_RUNNING} There is always hope!' > index.html`,
      '',
      `${PROMPT} ${comment('Start a local server and sync to remote server')}`,
      `${PROMPT} site --sync-to=my-demo.site `
    ],
    [
      // Sync output.
      '',
      ` ${EMOJI_SPARKLING_HEART} Site.js v${VERSION} (running on Node v10.15.3)`,
      '',
      ` ${EMOJI_CONSTRUCTION_SIGN} [Site.js] Using locally-trusted certificates.`,
      ` ${EMOJI_SCROLL} [Nodecert] Local development TLS certificate exists.`,
      '',
      ` ${EMOJI_REVOLVING_HEARTS} [Sync] Syncing folder ${inCyan('./')} to account ${inCyan('demo')} on host ${inCyan('my-demo.site')}`,
      '',
      ` ${EMOJI_REVOLVING_HEARTS} [Sync] Starting…`,
      '',
      ` ${EMOJI_PARTY_POPPER} Serving ${inCyan('./')} on ${inGreen('https://localhost')}`,
      '',
      ` ${EMOJI_BAR_CHART} For statistics, see https://localhost/909b721d634e89c44754cc036fb379e1`,
      '',
      ` ${EMOJI_REVOLVING_HEARTS} [Sync] Calculating changes…`,
      ` ${EMOJI_REVOLVING_HEARTS} [Sync] ↑ 140 bytes ↓ 12 bytes (101.33 bytes/sec)`,
      ` ${EMOJI_REVOLVING_HEARTS} [Sync] total size is 497  speedup is 3.27`,
      ` ${EMOJI_REVOLVING_HEARTS} [Sync] Complete.`,
      '',
      ` ${EMOJI_REVOLVING_HEARTS} [Sync] Local folder ${inCyan('./')} synced to ${inCyan('my-demo.site')}`,
      '',
      ` ${EMOJI_MAGNIFYING_GLASS_TILTED_RIGHT} [Watch] Watching ${inCyan('./')} for changes to sync to ${inCyan('my-demo.site')}…`,
      '',
      NBSP,
      () => {
        // After the sync server is run, simulate the browser being refreshed in the browser.
        setTimeout(() => { nextButton.disabled = true }, 0)

        setTimeout(() => {
          firstTerminalPresentation.unfocus()
          browserPresentation.refreshWith(`<p>${EMOJI_BALLOON}<br>&nbsp; ${EMOJI_WOMAN_RUNNING} There is always hope!</p>`, () => {
            setTimeout(() => {
              nextButton.disabled = false
            }, 1000)
          })
        }, 1000)
      }
    ],
    [
      // Break out of local server with sync.
      '^C',
      ` ${EMOJI_REVOLVING_HEARTS} [Sync] Exit request detected.`,
      ` ${EMOJI_MAGNIFYING_GLASS_TILTED_RIGHT} [Watch] Removing watcher.`,
      '',
      ` ${EMOJI_DANCER} Preparing to exit gracefully, please wait…`,
      '',
      ` ${EMOJI_SPARKLING_HEART} Goodbye!`,
      '',
      `${PROMPT} `,
    ],
  ],
  // Options.
  {
    controls: false,
    onReady: () => {
      // Don’t auto run; wait for the person to read the instructions in the browser window
      // (which has focus), and to press the Next button.
      firstTerminalPresentation.stop()

      // This is run the first time the Next button is presssed.
      const initialClickEventHandler = (event) => {
        // Remove the initial click event handler after the first run.
        nextButton.removeEventListener('click', initialClickEventHandler)

        // Wire up the new button handler.
        nextButtonFirstTerminalPresentationHandler = event => {
          browserPresentation.unfocus()
          firstTerminalPresentation.focus()
          firstTerminalPresentation.start()
        }
        nextButton.addEventListener('click', nextButtonFirstTerminalPresentationHandler)

        // Kick things off.
        browserPresentation.unfocus()
        firstTerminalPresentation.focus()
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
