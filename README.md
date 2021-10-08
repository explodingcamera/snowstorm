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

Snowstorm is a "framework" for react, which handles the heavy lifting involved with shipping a react project so you can focus on creating awesome things!

## Why?

- Develop faster, with a dev server that starts up in less then 100ms
- Unbloated: only includes features which you actually use
- Builds thousands of pages in seconds
- Versitile: supports everything from complex server side code to blazing fast, javascript free static websites
- File system based routing (which can also be disabled)
- Multi-Site support: routes can not only based on the path but also your domain

## How?

```bash
$ npm install -S @snowstorm/core @snowstorm/cli react react-dom
$ mkdir pages
$ echo "export const Index = () => <h1>Hello World</h1>" > pages/index.tsx
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
