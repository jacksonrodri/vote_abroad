'use strict';
const util = require('util')
require('full-icu')
const { DateTime } = require('luxon')

var exec = require('child_process').exec;

// Set the PATH and LD_LIBRARY_PATH environment variables.
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/bin';
process.env['LD_LIBRARY_PATH'] = process.env['LAMBDA_TASK_ROOT'] + '/bin';

const pdfFiller = require('pdffiller-stream');

const nameRegex = null;

const shouldFlatten = false;

exports.handler = (event, context, callback) => {
  console.log('event', event.queryStringParameters)
  let rData = {
    'topmostSubform[0].Page1[0].last_name[0]': '',
    'topmostSubform[0].Page1[0].first_name[0]': '',
    'topmostSubform[0].Page1[0].middle_name[0]': '',
    'topmostSubform[0].Page1[0].suffix[0]': '',
    'topmostSubform[0].Page1[0].previous_name[0]': '',
    'topmostSubform[0].Page1[0].birth_mon[0]': '',
    'topmostSubform[0].Page1[0].birth_day[0]': '',
    'topmostSubform[0].Page1[0].birth_yr[0]': '',
    'topmostSubform[0].Page1[0].ssn1[0]': '',
    'topmostSubform[0].Page1[0].ssn2[0]': '',
    'topmostSubform[0].Page1[0].ssn3[0]': '',
    'topmostSubform[0].Page1[0].license_num[0]': '',
    'topmostSubform[0].Page1[0].res_street[0]': '',
    'topmostSubform[0].Page1[0].res_apt[0]': '',
    'topmostSubform[0].Page1[0].res_city[0]': '',
    'topmostSubform[0].Page1[0].res_state[0]': '',
    'topmostSubform[0].Page1[0].res_county[0]': '',
    'topmostSubform[0].Page1[0].res_zip[0]': '',
    'topmostSubform[0].Page1[0].curr_address[0]': '',
    'topmostSubform[0].Page1[0].fwd_address[0]': '',
    'topmostSubform[0].Page1[0].email[0]': '',
    'topmostSubform[0].Page1[0].alt_email[0]': '',
    'topmostSubform[0].Page1[0].tel[0]': '',
    'topmostSubform[0].Page1[0].fax[0]': '',
    'topmostSubform[0].Page1[0].party[0]': '',
    'topmostSubform[0].Page1[0].addl_info[0]': '',
    'topmostSubform[0].Page1[0].date_mon[0]': '',
    'topmostSubform[0].Page1[0].date_day[0]': '',
    'topmostSubform[0].Page1[0].date_yr[0]': '',
    'topmostSubform[0].Page2[0].return_address[0]': '',
    'topmostSubform[0].Page2[0].leo_address[0]': '',
    'topmostSubform[0].Page1[0].classification[0]': '',
    'topmostSubform[0].Page1[0].sex[0]': '',
    'topmostSubform[0].Page1[0].rec_materials[0]': ''
  };
  if(event.httpMethod === 'GET' && event.queryStringParameters){
    rData['topmostSubform[0].Page1[0].last_name[0]'] = event.queryStringParameters.lastName ? event.queryStringParameters.lastName : '';
    rData['topmostSubform[0].Page1[0].first_name[0]'] = event.queryStringParameters.firstName ? event.queryStringParameters.firstName: '';
    rData['topmostSubform[0].Page1[0].middle_name[0]'] = event.queryStringParameters.middleName ? event.queryStringParameters.middleName : '';
    rData['topmostSubform[0].Page1[0].suffix[0]'] = event.queryStringParameters.suffix ? event.queryStringParameters.suffix : '';
    rData['topmostSubform[0].Page1[0].previous_name[0]'] = event.queryStringParameters.previousName ? event.queryStringParameters.previousName : '';
    if(event.queryStringParameters.dob && DateTime.fromISO(event.queryStringParameters.dob).isValid){
      rData['topmostSubform[0].Page1[0].birth_mon[0]'] = DateTime.fromISO(event.queryStringParameters.dob).toString().substr(5,2) || ''
      rData['topmostSubform[0].Page1[0].birth_day[0]'] = DateTime.fromISO(event.queryStringParameters.dob).toString().substr(8,2) || ''
      rData['topmostSubform[0].Page1[0].birth_yr[0]'] = DateTime.fromISO(event.queryStringParameters.dob).toString().substr(0,4) || ''
    }
    if(event.queryStringParameters.ssn && Number.isInteger(parseInt(event.queryStringParameters.ssn))){
      let ssn = event.queryStringParameters.ssn
      if(event.queryStringParameters.ssn.length < 5){
        rData['topmostSubform[0].Page1[0].ssn3[0]'] = ssn
      } else if(event.queryStringParameters.ssn.length < 7){
        rData['topmostSubform[0].Page1[0].ssn3[0]'] = ssn.substr(ssn.length - 4, 4)
        rData['topmostSubform[0].Page1[0].ssn2[0]'] = ssn.substr(0, ssn.length - 4)
      } else {
        rData['topmostSubform[0].Page1[0].ssn3[0]'] = ssn.substr(ssn.length - 4, 4)
        rData['topmostSubform[0].Page1[0].ssn2[0]'] = ssn.substr(ssn.length - 6, 2)
        rData['topmostSubform[0].Page1[0].ssn1[0]'] = ssn.substr(0, ssn.length - 6)
      }
    }
    rData['topmostSubform[0].Page1[0].license_num[0]'] = event.queryStringParameters.stateId ? event.queryStringParameters.stateId : ''
    rData['topmostSubform[0].Page1[0].res_street[0]'] = event.queryStringParameters.votStreet ? event.queryStringParameters.votStreet : ''
    rData['topmostSubform[0].Page1[0].res_apt[0]'] = event.queryStringParameters.votApt ? event.queryStringParameters.votApt : ''
    rData['topmostSubform[0].Page1[0].res_city[0]'] = event.queryStringParameters.votCity ? event.queryStringParameters.votCity : ''
    rData['topmostSubform[0].Page1[0].res_state[0]'] = event.queryStringParameters.votState ? event.queryStringParameters.votState : ''
    rData['topmostSubform[0].Page1[0].res_county[0]'] = event.queryStringParameters.votCounty ? event.queryStringParameters.votCounty : ''
    rData['topmostSubform[0].Page1[0].res_zip[0]'] = event.queryStringParameters.votZip ? event.queryStringParameters.votZip : ''
    rData['topmostSubform[0].Page1[0].curr_address[0]'] = event.queryStringParameters.abrAdr ? event.queryStringParameters.abrAdr : ''
    rData['topmostSubform[0].Page1[0].fwd_address[0]'] = event.queryStringParameters.fwdAdr ? event.queryStringParameters.fwdAdr : ''
    rData['topmostSubform[0].Page1[0].email[0]'] = event.queryStringParameters.email ? event.queryStringParameters.email : ''
    rData['topmostSubform[0].Page1[0].alt_email[0]'] = event.queryStringParameters.altEmail ? event.queryStringParameters.altEmail : ''
    rData['topmostSubform[0].Page1[0].tel[0]'] = event.queryStringParameters.tel ? event.queryStringParameters.tel : ''
    rData['topmostSubform[0].Page1[0].fax[0]'] = event.queryStringParameters.fax ? event.queryStringParameters.fax : ''
    rData['topmostSubform[0].Page1[0].party[0]'] = event.queryStringParameters.party ? event.queryStringParameters.party : ''
    rData['topmostSubform[0].Page1[0].addl_info[0]'] = event.queryStringParameters.addlInfo ? event.queryStringParameters.addlInfo : ''
    if(event.queryStringParameters.date && DateTime.fromISO(event.queryStringParameters.date).isValid){
      rData['topmostSubform[0].Page1[0].date_mon[0]'] = DateTime.fromISO(event.queryStringParameters.date).toString().substr(5,2)  || ''
      rData['topmostSubform[0].Page1[0].date_day[0]'] = DateTime.fromISO(event.queryStringParameters.date).toString().substr(8,2)  || ''
      rData['topmostSubform[0].Page1[0].date_yr[0]'] = DateTime.fromISO(event.queryStringParameters.date).toString().substr(0,4)  || ''
    }
    rData['topmostSubform[0].Page2[0].return_address[0]'] = event.queryStringParameters.retAdr || event.queryStringParameters.abrAdr ? event.queryStringParameters.abrAdr : ''
    rData['topmostSubform[0].Page2[0].leo_address[0]'] = event.queryStringParameters.leoAdr ? event.queryStringParameters.leoAdr : ''
    if(event.queryStringParameters.class){
      rData['topmostSubform[0].Page1[0].classification[0]'] = (()=> {
        switch (event.queryStringParameters.class){
          case 'military':
            return "I'm on active duty in the Uniformed Services or Merchant Marine"
            break
          case 'milSpouse':
            return "I am an eligible spouse or dependent"
            break
          case 'natGuard':
            return "I am an activated National Guard member on State orders"
            break
          case 'intendToReturn':
            return "I am a U.S. citizen living outside the country, and I intend to return"
            break
          case 'uncertainReturn':
            return "I am a U.S. citizen living outside the country, and my return is uncertain"
            break
          case 'neverResided':
            return "I am a U.S. citizen living outside the country, and I have never lived in the United States"
            break
        }
      })()
    }
    if(event.queryStringParameters.sex){
      rData['topmostSubform[0].Page1[0].sex[0]'] = (()=> {
        switch (event.queryStringParameters.sex.toLowerCase()){
          case 'male':
          case 'm':
            return "Male"
            break
          case 'female':
          case 'f':
            return "Female"
            break
        }
      })()
    }
    if(event.queryStringParameters.recBallot){
      rData['topmostSubform[0].Page1[0].rec_materials[0]'] = (()=> {
        switch (event.queryStringParameters.recBallot.toLowerCase()){
          case 'm':
          case 'mail':
          case 'post':
            return "Mail"
            break
          case 'e':
          case 'email':
          case 'online':
            return "Email or online"
            break
          case 'fax':
          case 'f':
            return "Fax"
            break
        }
      })()
    }
  } else if(event.httpMethod === 'POST'){

  }
  const sourcePDF = "fpca.pdf";
  // pdfFiller.fillFormWithFlatten( sourcePDF, rData, shouldFlatten)
  pdfFiller.fillForm(sourcePDF, rData)
    .then((outputStream) => {
      return new Promise((resolve, reject) => {
        let chunks = []
        outputStream.on('data', (chunk) => {
          // console.log(`Received ${chunk.length} bytes of data.`);
          chunks.push(Buffer.from(chunk))
        })
        outputStream.on('end', () => {
          // console.log(`Received ${chunks.length} chunks.  All finished!`)
          resolve(Buffer.concat(chunks).toString('base64'))
        })
        outputStream.resume()
      })
    })
    .then((pdf) => {
      const response = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `${event.queryStringParameters.method === 'blank' ? 'inline' : 'attachment'}; filename=\"fpca.pdf\"`
        },
        isBase64Encoded: true,
        body: pdf
      };
      callback(null, response);
    })
    .catch((err) => {
      callback(null, { statusCode: 400, body: JSON.stringify(err) });
    });
};
