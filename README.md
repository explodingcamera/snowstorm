<p align="center">
  <a href="https://github.com/explodingcamera/snowstorm">
    <img src="./logo.svg" height="128">
    <h1 align="center">Snowstorm.js</h1>
  </a>
</p>

# The lightning-fast and minimalist React Framework

## Warning

Important: Snowstorm isn't Production-Ready yet. Documentation is rough, outdated and inconsistent and only the latest alpha versions of react 18 are supported.

## What?

Snowstorm is a framework (or Static-Site-Generator) for react, which handles the heavy lifting involved with shipping a react project so you can focus on creating awesome things!

## Why?

- **Develop faster**: with a dev server that starts up in less then 30ms and build thousands of pages in seconds
- **Open**: not VC-backed, no upsell, no cloud-platform exclusive features
- **Unbloated**: only includes features which you actually use
- **Multi-Site support**: develop for multiple domains at the same time
- **Great UX**: file system based routing, react suspense support, great TypeScript support, CSS-Modules

## How?

Getting started with snowstorm takes less than a minute and doesn't any require confusing `init` commands:

```bash
# install the required dependencies
$ npm install -S @snowstorm/core @snowstorm/cli react react-dom

# this folder will contain all webpages
$ mkdir pages
$ echo 'export const Index = () => <h1>Hello World</h1>' > pages/index.tsx

# (optional) enable typescript support
$ echo '{ "extends": "@snowstorm/core/tsconfig.base.json" }' > tsconfig.json

# start the development server
$ npx snowstorm dev
```

<pre><code><b>INFO</b> starting snowstorm v0.0.1 (development mode)
<b>INFO</b> listening on <u>http://localhost:2020/</u>
<b>INFO</b> started in 19ms</code></pre>

### Visit [snowstorm.js.org/docs](https://snowstorm.js.org/docs/getting-started) for the full documentation

<br/>

## FAQ

<details>
  <summary>Why are issues disabled?</summary>
  I'm not responding to bug reports and other issues.
  For smaller things, you can open a pr, outside of that discussions are available to ask questions and paid support is also available at (henrygressmann.de)[https://henrygressmann.de].
</details>

> License: [MIT](LICENSE.md)
