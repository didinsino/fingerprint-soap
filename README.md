# Fingerprint SOAP

A NodeJS Package to communicate with the standalone fingerprint machine through its SOAP interface. Compatible with ZKTeco and [Solution](https://solution.co.id/) biometric products that have webserver feature.

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


## API Documentation

***

<a name="FingerprintSOAP"></a>

### FingerprintSOAP
**Kind**: global class  

* [FingerprintSOAP](#FingerprintSOAP)
    * [new FingerprintSOAP(host, port, comKey, timeout)](#new_FingerprintSOAP_new)
    * [.getUserInfo(userId)](#FingerprintSOAP+getUserInfo) ⇒ <code>Promise</code>
    * [.getAllUserInfo()](#FingerprintSOAP+getAllUserInfo) ⇒ <code>Promise</code>
    * [.deleteUser(userId)](#FingerprintSOAP+deleteUser) ⇒ <code>Promise</code>
    * [.getUserTemplate(userId, fingerId)](#FingerprintSOAP+getUserTemplate) ⇒ <code>Promise</code>
    * [.getAttLog([userId])](#FingerprintSOAP+getAttLog) ⇒ <code>Promise</code>
    * [.clearAttLog()](#FingerprintSOAP+clearAttLog) ⇒ <code>Promise</code>
    * [.makeRequest(command, args)](#FingerprintSOAP+makeRequest) ⇒ <code>Promise</code>
    * [.parseResponse(response, command)](#FingerprintSOAP+parseResponse) ⇒ <code>Object</code> \| <code>Array</code> \| <code>null</code>
    * [.generateXMLContent(command, jsonData)](#FingerprintSOAP+generateXMLContent) ⇒ <code>string</code>

***

<a name="new_FingerprintSOAP_new"></a>

### new FingerprintSOAP(host, port, comKey, timeout)
FingerprintSOAP constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| host | <code>string</code> |  | device IP address |
| port | <code>number</code> | <code>80</code> | device port (default 80) |
| comKey | <code>number</code> | <code>0</code> | device communication key/password (default 0) |
| timeout | <code>number</code> | <code>5000</code> | connection timeout in milliseconds |

***

<a name="FingerprintSOAP+getUserInfo"></a>

### fingerprintSOAP.getUserInfo(userId) ⇒ <code>Promise</code>
Get user information by user id from device

**Kind**: instance method of [<code>FingerprintSOAP</code>](#FingerprintSOAP)
**Returns**: <code>Promise</code> - Object user data { PIN, Name, Password, Group, Privilege, Card, PIN2, TZ1, TZ2, TZ3 }

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>number</code> | user ID |

***

<a name="FingerprintSOAP+getAllUserInfo"></a>

### fingerprintSOAP.getAllUserInfo() ⇒ <code>Promise</code>
Get all users in device

**Kind**: instance method of [<code>FingerprintSOAP</code>](#FingerprintSOAP)
**Returns**: <code>Promise</code> - array of users [{ PIN, Name, Password, Group, Privilege, Card, PIN2, TZ1, TZ2, TZ3 }, ...]
***

<a name="FingerprintSOAP+deleteUser"></a>

### fingerprintSOAP.deleteUser(userId) ⇒ <code>Promise</code>
Delete user from device

**Kind**: instance method of [<code>FingerprintSOAP</code>](#FingerprintSOAP)
**Returns**: <code>Promise</code> - boolean true if success

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>number</code> | user ID |

***

<a name="FingerprintSOAP+getUserTemplate"></a>

### fingerprintSOAP.getUserTemplate(userId, fingerId) ⇒ <code>Promise</code>
Get a fingerprint template of user

**Kind**: instance method of [<code>FingerprintSOAP</code>](#FingerprintSOAP)
**Returns**: <code>Promise</code> - Object user data with template { PIN, FingerID, Size, Valid, Template }

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>number</code> | user ID |
| fingerId | <code>number</code> | finger index |

***

<a name="FingerprintSOAP+getAttLog"></a>

### fingerprintSOAP.getAttLog([userId]) ⇒ <code>Promise</code>
Read out the attendance record from device

**Kind**: instance method of [<code>FingerprintSOAP</code>](#FingerprintSOAP)
**Returns**: <code>Promise</code> - array attendance data [{PIN: 2376, DateTime(yyyy-mm-dd hh:mm:ss), Verified, Status, WorkCode }, ...]

| Param | Type | Description |
| --- | --- | --- |
| [userId] | <code>number</code> | user ID. If empty, get all users log |

***

<a name="FingerprintSOAP+clearAttLog"></a>

### fingerprintSOAP.clearAttLog() ⇒ <code>Promise</code>
Delete all attendance record from attendance device

**Kind**: instance method of [<code>FingerprintSOAP</code>](#FingerprintSOAP)
**Returns**: <code>Promise</code> - boolean true if success
***

<a name="FingerprintSOAP+makeRequest"></a>

### fingerprintSOAP.makeRequest(command, args) ⇒ <code>Promise</code>
Make SOAP request to device

**Kind**: instance method of [<code>FingerprintSOAP</code>](#FingerprintSOAP)
**Returns**: <code>Promise</code> - string raw response

| Param | Type | Description |
| --- | --- | --- |
| command | <code>string</code> | request command (pascal case) |
| args | <code>Object</code> | request parameters |

***

<a name="FingerprintSOAP+parseResponse"></a>

### fingerprintSOAP.parseResponse(response, command) ⇒ <code>Object</code> \| <code>Array</code> \| <code>null</code>
Parse XML response into javascript object

**Kind**: instance method of [<code>FingerprintSOAP</code>](#FingerprintSOAP)
***Return***: <code>any</code> - object/array/null

| Param | Type | Description |
| --- | --- | --- |
| response | <code>string</code> | raw response |
| command | <code>string</code> | request command |

***

<a name="FingerprintSOAP+generateXMLContent"></a>

### fingerprintSOAP.generateXMLContent(command, jsonData) ⇒ <code>string</code>
Generate XML string from command and parameters

**Kind**: instance method of [<code>FingerprintSOAP</code>](#FingerprintSOAP)
**Returns**: <code>string</code> - XML formatted string

| Param | Type | Description |
| --- | --- | --- |
| command | <code>string</code> | request command |
| jsonData | <code>Object</code> | request parameters |