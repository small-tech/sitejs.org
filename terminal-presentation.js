// Requires Typed.js

class TerminalPresentation {
  constructor (containerId, originalSteps, options = {}) {
    console.log(`Creating terminal presentation in element with id ${containerId}.`)

    this.onStepComplete = options.onSlide
    this.onComplete = options.onComplete
    this.onStart = options.onStart
    this.onStop = options.onStop
    this.onReady = options.onReady

    // The way Typed.js works, if you want to add to the text area instead of having it
    // replaced, the string that follows the current string must start with the current
    // string. Since we want to emulate a Terminal window where text is always appended,
    // this means that each string has to include the cumulative aggregate of all
    // previous strings. Since we don’t want the person to do this, we accept an array
    // of steps, each containing the lines to be show in the step and calculate and prefix
    // the cumulative text to each entry here.
    let cumulative = ''
    const steps = originalSteps.map(lines => lines.join('\n') + '\n').map ((step, index, theArray) => {
      if (index > 0) {
        const lastStep = theArray[index-1]
        const lastStepWithoutTimingDirectives = lastStep.replace(/\^\d+/g, '')
        cumulative += lastStepWithoutTimingDirectives
        return cumulative + step
      } else {
        // Don’t massage the first entry.
        return step
      }
    })

    const initialiseInterface = () => {
      const container = document.getElementById(containerId)

      // Ensure the container is showing.
      container.style.display = 'block'

      // We are going to position the presentation controls relative to the
      // container’s bounds.
      container.style.position = 'relative'

      const terminal = document.createElement('div')
      terminal.className = 'terminal'
      const _pre = document.createElement('pre')
      const _code = document.createElement('code')
      _code.className = `terminal-code-${containerId}`
      const nextButton = document.createElement('button')
      nextButton.className = 'next-button'
      nextButton.appendChild(document.createTextNode('Next'))
      nextButton.disabled = true
      _pre.appendChild(_code)
      terminal.appendChild(_pre)
      container.appendChild(terminal)
      container.appendChild(nextButton)

      this.nextButton = nextButton

      if (options.controls === false) {
        this.nextButton.hidden = true
      }

      // Always keep the console at the end of the output.
      let currentStep = -1, scrollToBottomInterval
      const terminalScrollHandler = () => {
        terminal.scrollTop = terminal.scrollHeight
      }

      // Create the typing animation and start the first frame.
      var typed = new Typed(`.${_code.className}`, {
        strings: steps,
        backDelay: 0,
        preStringTyped: () => {
          // Gets called once, at the start of the animation.
          scrollToBottomInterval = setInterval(terminalScrollHandler, 50)
          if (typeof this.onReady === 'function') {
            this.onReady(this)
          }
        },
        onStringTyped: (arrayPosition) => {
          console.log('On string typed:', arrayPosition)
          if (arrayPosition !== currentStep) {
            console.log(`Array position ${arrayPosition} !== current step ${currentStep}`)
            // A new step has ended. Make sure we’re scrolled to the
            // bottom. Toggle the typing off and stop forcing the
            // terminal to the bottom so that the person can scroll back
            // if they want to review any of the steps.
            clearInterval(scrollToBottomInterval)
            terminal.scrollTop = terminal.scrollHeight

            // Is the presentation over?
            if (arrayPosition === steps.length - 1) {
              nextButton.hidden = true
              return
            }

            typed.stop()

          }
          currentStep = arrayPosition
        },
        onStart: () => {
          console.log('Start')
          nextButton.disabled = true
          scrollToBottomInterval = setInterval(terminalScrollHandler, 50)
          if (typeof this.onStart === 'function') {
            this.onStart()
          }
        },
        onStop: () => {
          console.log('Stop', currentStep)
          if (typeof this.onStepComplete === 'function') {
            this.onStepComplete(currentStep+1)
          }
          nextButton.disabled = false
          if (typeof this.onStop === 'function') {
            this.onStop()
          }
        },
        onComplete: () => {
          console.log('Complete!')
          if (typeof this.onComplete === 'function') {
            this.onComplete()
          }
        }
      })

      this.typed = typed

      // When the next button is clicked, toggle the typing animation (off).
      nextButton.addEventListener('click', event => {
        typed.start()
      })
    }

    // Make sure we initialise the interface regardless of whether we are
    // created before page load or after.
    if (document.readyState === 'complete') {
      initialiseInterface()
    } else {
      window.addEventListener('load', initialiseInterface)
    }
  }

  showControls () {
    this.nextButton.hidden = false
  }

  hideControls () {
    this.nextButton.hidden = true
  }

  start () {
    this.typed.start()
  }
}
