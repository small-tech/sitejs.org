class BrowserPresentation {

  constructor (containerId, initialUrl = 'https://localhost', initialContent = '<p>Hello, world!</p>') {

    const initialiseInterface = () => {
      const container = document.getElementById(containerId)
      container.classList.add('facade-minimal')
      container.setAttribute('data-url', initialUrl)

      this.container = container

      const refreshButton = document.createElement('div')
      refreshButton.className = 'refresh-button'
      container.appendChild(refreshButton)

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

  // Simulates the refresh button being hit and loads the specified content after a loading period.
  refreshWith (content, readyCallback = () => {}) {
    const refreshButton = document.querySelector('.refresh-button')
    refreshButton.classList.add('rotates')
    setTimeout(() => {
      refreshButton.classList.remove('rotates')
      this.content.innerHTML = content
      readyCallback()
    }, 2500)
  }

}
