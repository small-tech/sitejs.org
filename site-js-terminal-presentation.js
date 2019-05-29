class BrowserPresentation {

  /*
  <!-- Spinner, courtesy https://tobiasahlin.com/spinkit/ -->
  <div style='display: none' id='spinner' class='spinner'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div>

  <!-- Content -->
  <div id='content'>
    <p>Use the <strong>Next</strong> button to progress through the demo.</p>
  </div>
  */


  constructor (containerId, initialUrl = 'https://localhost', initialContent = '<p>Hello, world!</p>') {

    const initialiseInterface = () => {
      const container = document.getElementById(containerId)
      container.classList.add('facade-minimal')
      container.setAttribute('data-url', initialUrl)

      this.container = container

      const progressIndicator = document.createElement('div')
      progressIndicator.id = 'spinner'
      progressIndicator.className = 'spinner'
      progressIndicator.style.display = 'none';

      [1, 2, 3].forEach(i => {
        const innerDot = document.createElement('div')
        innerDot.className = `bounce${i}`
        progressIndicator.appendChild(innerDot)
      })

      this.progressIndicator = progressIndicator

      const content = document.createElement('div')
      content.innerHTML = initialContent

      this.content = content

      container.appendChild(progressIndicator)
      container.appendChild(content)
    }

    // Make sure we initialise the interface regardless of whether we are
    // created before page load or after.
    if (document.readyState === 'complete') {
      initialiseInterface()
    } else {
      window.addEventListener('load', initialiseInterface)
    }
  }

  // Simulates entering a URL, waiting for it to load, and having its content load.
  browseTo (url, content, readyCallback = () => {}) {
    let i = 0
    const interval = setInterval(() => {
      if (i === url.length + 1) {
        // URL entry is complete.
        clearInterval(interval)

        setTimeout(() => {
          // After a brief breath, to simulate the time taken to press return, how the spinner.
          this.progressIndicator.style.display = 'block'

          // Two seconds later, show the content.
          setTimeout(() => {
            this.content.innerHTML = content
            this.progressIndicator.style.display = 'none'
            readyCallback()
          }, 2000)
        }, 250)
      }
      const urlSubstr = url.substr(0, i++)
      this.container.setAttribute('data-url', urlSubstr)
    }, 100)
  }

}


//
// The terminal presentation.
// Copyright ⓒ 2019 Aral Balkan. License: AGPLv3 or later.
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
    // Slide 5: An empty slide to ensure we pause before splitting the screen
    // so as not to jar the person watching.
    ''
  ],
  [
    // Slide 6: Break out of global server.
    '^C',
    ' 💃 Preparing to exit gracefully, please wait…',
    '',
    ' 💖 Goodbye!',
    '',
    `⯈ ${comment('Start a local server and sync to remote server')}`,
    '⯈ site sync my-demo.site '
  ],
  [
    // Slide 7: Sync output.
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
    // Slide 8: Break out of local server with sync.
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
    // Slide 9: Last slide – output of starting startup daemon.
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
  onSlide: (slide) => {
    //
    // These additional sequences are added after certain slides in the first
    // terminal presentation have concluded.
    //
    if (slide === 2) {
      //
      // After the local server is run, simulate someone hitting it in the browser.
      //
      nextButton.disabled = true

      setTimeout(() => {
        browserPresentation.browseTo('https://localhost', '<p>Hello, world!</p>', () => {
          nextButton.disabled = false
        })
      }, 1000)
    }

    if (slide === 5) {
      //
      // This sequence runs after slide 5 in the first terminal presentation.
      //

      // Pause proxying Next button events to the first terminal presentation.
      nextButton.removeEventListener('click', nextButtonFirstTerminalPresentationHandler)

      //
      // Split the terminal (create a second terminal presentation) to show
      // ngrok running.
      //
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

          // On the next Next button click, remove the second terminal presentation and return
          // control to the first terminal presentation.
          const clearUpSecondTerminalPresentation = event => {
            nextButton.removeEventListener('click', clearUpSecondTerminalPresentation)
            nextButton.addEventListener('click', nextButtonFirstTerminalPresentationHandler)

            document.querySelector('#presentation').style.gridTemplateColumns = '100%'
            document.querySelector('#second-terminal-presentation').style.display = 'none'
          }
          nextButton.addEventListener('click', clearUpSecondTerminalPresentation)
        }
      })
    }
  },
  onComplete: () => {
    // We’re done with the whole presentation; hide the Next button.
    nextButton.hidden = true
  }
})
