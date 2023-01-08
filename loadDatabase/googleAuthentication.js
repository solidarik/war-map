import fs from 'fs'
import readline from 'readline'
import {google} from 'googleapis'

// source https://www.voidcanvas.com/node-js-googleapis-v4-spreadsheet/

let SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const TOKEN_DIR = process.cwd() + '/.credentials/'
const TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json'

class Authentication {
  authenticate(){
    return new Promise((resolve, reject)=>{
      let credentials = this.getClientSecret()
      let authorizePromise = this.authorize(credentials)
      authorizePromise.then(resolve, reject)
    })
  }
  getClientSecret(){
    const content = fs.readFileSync('./credentials.json')
    return JSON.parse(content)
    // return import('./credentials.json')
  }
  authorize(credentials) {
    var clientSecret = credentials.installed.client_secret
    var clientId = credentials.installed.client_id
    var redirectUrl = credentials.installed.redirect_uris[0]
    var oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl)

    return new Promise((resolve, reject)=>{
      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          console.log(`Error read token file: ${err}`)
          this.getNewToken(oAuth2Client).then((oAuth2ClientNew)=>{
            resolve(oAuth2ClientNew)
          }, (err)=>{
            reject(err)
          })
        } else {
          oAuth2Client.credentials = JSON.parse(token)
          resolve(oAuth2Client)
        }
      })
    })
  }
  getNewToken(oAuth2Client, callback) {
    return new Promise((resolve, reject)=>{

      var authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
      })
      console.log('Authorize this app by visiting this url: \n ', authUrl)
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      rl.question('\n\nEnter the code from that page here: ', (code) => {
        rl.close()
        oAuth2Client.getToken(code, (err, token) => {
          if (err) {
            console.log('Error while trying to retrieve access token', err)
            reject()
          }
          oAuth2Client.credentials = token
          this.storeToken(token)
          resolve(oAuth2Client)
        })
      })
    })
  }
  storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR)
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err
      }
    }
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token))
    console.log('Token stored to ' + TOKEN_PATH)
  }
}

export default new Authentication()