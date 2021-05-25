# Site.js web site

Source code for [the Site.js web site](https://sitejs.org).

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

  * [Inline CSS and JS](_build/inline-css-and-js.js): script that inlines CSS and JS into the HTML during the build process.

  * [Inline SVG](_build/inline-svg.js): script that inlines SVG into the HTML during the build process.

## Like this? Fund us!

[Small Technology Foundation](https://small-tech.org) is a tiny, independent not-for-profit.

We exist in part thanks to patronage by people like you. If you share [our vision](https://small-tech.org/about/#small-technology) and want to support our work, please [become a patron or donate to us](https://small-tech.org/fund-us) today and help us continue to exist.

## Copyright

&copy; 2019-present [Aral Balkan](https://ar.al), [Small Technology Foundation](https://small-tech.org).

## License

[AGPL version 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html)

<!-- Yes, this has to be coded like it’s 1999 for it to work, sadly. -->
<p align='center'><img width='76' src='images/illustrations/site.js-logo.svg' alt='Site.js logo: a small sprouting plant with a green leaf on either side of a brown stem'></p>
