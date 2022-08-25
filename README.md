# Fingerprint SOAP

A NodeJS Package to communicate with the standalone fingerprint machine through its SOAP interface

## Install

```sh
npm install fingerprint-soap
```

## Usage

```js
const FPSoap = require('fingerprint-soap')
const fp = new FPSoap('192.168.1.1')

fp.getUserInfo(2376).then(console.log)

async function getAllLog() {
  const logs = await fp.getAttLog()
  console.log(logs)
}
getAllLog()
```
