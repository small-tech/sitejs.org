# Site.js web site

The web site for Site.js with an interactive presentation to demonstrate it in use.

## Install

```sh
./install
```

## Build

```sh
./build
```

The following features require [Site.js](https://sitejs.org):

## Test locally

Test the source:

```sh
site
```

Test the distribution build:

```sh
site dist
```

## Stage

Stage the source:

```sh
site @hostname
```

Stage the distribution build:

```
site dist @hostname
```

## Deploy

If you have SSH access to the Site.js web site:

```sh
./deploy
```

__Note:__ The scripts use the latest Site.js syntax.

## Useful components

You might find these components useful in your own projects:

  * [Browser presentation](js/browser-presentation.js): an in-browser browser with location-bar typing animations and animated refresh.

  * [Terminal presentation](js/terminal-presentation.js): an in-browser terminal presentation system with Typed.js for typing animations.

  * [Inline CSS and JS](_build/inline-css-and-js.js): script that inlines CSS and JS into the HTML during the build process.

  * [Inline SVG](_build/inline-svg.js): script that inlines SVG into the HTML during the build process.

## License

Copyright ⓒ 2019 Aral Balkan. Released under AGPLv3 or later.

Made with ♥ by [Ind.ie](https://ind.ie).