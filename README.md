<p align="center">
  <a href="https://github.com/explodingcamera/snowstorm">
    <img src="./logo.svg" height="128">
    <h1 align="center">Snowstorm.js</h1>
  </a>
</p>

## Important: Snowstorm isn't Production-Ready yet
# The lightning-fast and minimalist React Framework

## What?
Snowstorm is a "framework" for react, which handles the heavy lifting involved with shipping a react project so you can focus on creating awesome things!

## Why?
* Develop faster, with a dev server that starts up in less then 100ms
* Unbloated: only includes features which you actually use
* Builds thousands of pages in minutes
* Versitile: supports everything from complex server side code to blazing fast, javascript free static websites
* File system based routing (which can also be disabled)
* Multi-Site support: route not only based on path but also domain

## How?

```bash
$ npm install -S @snowstorm/core @snowstorm/cli
$ mkdir pages
$ echo "export const Index = () => <h1>Hello World</h1>" > pages/index.ts
$ npx snowstorm dev
>> listening on http://localhost:2020/
```

### Visit [snowstorm.js.org/docs](https://snowstorm.js.org/docs/getting-started) for the full documentation

<br/>

> License: [MIT](LICENSE.md)