const { connect } = require('net')
const { XMLParser } = require('fast-xml-parser')

class FingerprintSOAP {

  /**
   * FingerprintSOAP constructor
   * @param {string} host device IP address
   * @param {number} port device port (default 80)
   * @param {number} comKey device communication key/password
   * @param {number} timeout connection timeout in milliseconds
   */
  constructor(host, port = 80, comKey = 0, timeout = 5000) {
    this.client = null
    this.host = host
    this.port = port
    this.comKey = comKey
    this.timeout = timeout
    this.data = []
  }

  /**
   * Get user information by user id
   * @param {number} userId user ID
   * @returns {Promise} Object user data { PIN, Name, Password, Group, Privilege, Card, PIN2, TZ1, TZ2, TZ3 }
   */
  async getUserInfo(userId) {
    return this.makeRequest('GetUserInfo', { PIN: userId })
  }

  /**
   * Get all users ini device
   * @returns {Promise} array of users [{ PIN, Name, Password, Group, Privilege, Card, PIN2, TZ1, TZ2, TZ3 }, ...]
   */
  async getAllUserInfo() {
    return this.makeRequest('GetAllUserInfo')
  }

  async deleteUser(userId) {
    return this.makeRequest('DeleteUser', { PIN: userId })
  }

  /**
   * Get a fingerprint template of user
   * @param {number} userId user ID
   * @param {number} fingerId finger index
   * @returns {Promise} Object user data with template { PIN, FingerID, Size, Valid, Template }
   */
  async getUserTemplate(userId, fingerId) {
    return this.makeRequest('GetUserTemplate', { PIN: userId, FingerID: fingerId })
  }

  /**
   * Read out the attendance record from attendance machines
   * @param {number=} userId user ID. If empty, get all users log
   * @returns {Promise} array attendance data [{PIN: 2376, DateTime(yyyy-mm-dd hh:mm:ss), Verified, Status, WorkCode }, ...]
   */
  async getAttLog(userId) {
    const jsonData = { PIN: !userId ? 'All': userId }
    return this.makeRequest('GetAttLog', jsonData)
  }

  async clearAttLog() {
    return this.makeRequest('ClearData', { Value: 1 })
  }

  /**
   * Send SOAP request
   * @param {string} command request command (pascal case)
   * @param {Object} args request parameters
   * @returns {Promise} string raw response
   */
  async makeRequest(command, args) {
    const thisClass = this
    const xmlContent = this.generateXMLContent(command, args)
    const requestContent = "POST /iWsService HTTP/1.0\r\n" +
      "Content-Length: " + xmlContent.length + "\r\n" +
      "Content-Type: text/xml;\r\n" +
      "\r\n" + xmlContent

    return new Promise((resolve, reject) => {
      try {
        const client = connect(thisClass.port, thisClass.host, () => {
          clearTimeout(timer)
          client.end(requestContent)
        })

        const timer = setTimeout(() => {
          client.destroy()
          const error = new Error('Connection timeout')
          error.code = 'ETIMEDOUT'
          reject(error)
        }, this.timeout)
      
        client.on('data', data => {
          clearTimeout(timer)
          thisClass.data.push(data)
          client.end()
        })

        client.on('error', (error) => {
          clearTimeout(timer)
          reject(error)
        })

        client.on('end', function() {
          clearTimeout(timer)
          const result = Buffer.concat(thisClass.data).toString()
          resolve(thisClass.parseResponse(result, command))
        })

      } catch(error) {
        reject(error)
      }
    })
  }

  /**
   * Parse XML response into javascript object
   * @param {string} response raw response
   * @param {string} command request command
   * @returns {Object|Array|null}
   */
  parseResponse(response, command) {
    const parser = new XMLParser()
    const json = parser.parse(response)
    return json[`${command}Response`]?.Row || null
  }

  /**
   * Generate XML string from command and parameters
   * @param {string} command request command
   * @param {Object} jsonData request parameters
   * @returns {string} XML formatted string
   */
  generateXMLContent(command, jsonData) {
    let content = `<${command}><ArgComKey xsi:type="xsd:integer">${this.comKey}</ArgComKey>`
    if (jsonData) {
      content += '<Arg>'
      for (const key in jsonData) {
        content += `<${key}>${jsonData[key]}</${key}>`
      }
      content += '</Arg>'
    }
    content += `</${command}>`
    return content
  }

}

module.exports = FingerprintSOAP