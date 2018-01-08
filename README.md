# Mono Chrome
Library to manage Chrome instance spawned by Puppeteer

## Background
Puppeteer offers two kinds of Chrome initiation method, by launching a new instance or connecting to an already running process using web socket.

When utilizing Puppeteer, it's not advisable to keep launching and closing Chrome instance over and over again since it will consume a lot of resources. So Monochrome helps managing the spawned instances and allow user to connect to an existing one if possible and only launches a new one if no Chrome instance is available.

## Installation

```bash
$ npm install monochrome
```

## Usage
```js
const Monochrome = require("monochrome-js");
const monochrome = new Monochrome();

// get a browser instance
const browser = await monochrome.getBrowser();

// call Puppeteer functions
await browser.newPage();

// close instance
await browser.disconnect();
```

**NOTE**: **ALWAYS** use `disconnect()` instead of `close()` to make the browser instance reusable