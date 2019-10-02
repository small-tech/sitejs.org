Write-Output "Installing site.js site for development…"

# Install build dependencies.
Write-Output " > Build dependencies"
npm install --global minify
npm install --global imagemin-cli
npm install --global svg-sprite

# Install Node dependencies.
Write-Output " > Node dependencies."
npm install

Write-Output " Done."
