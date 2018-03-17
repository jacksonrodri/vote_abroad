'use strict';
// const fs = require("fs");
const util = require('util')
const fs = require("fs");

var exec = require('child_process').exec;

// Set the PATH and LD_LIBRARY_PATH environment variables.
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/bin';
process.env['LD_LIBRARY_PATH'] = process.env['LAMBDA_TASK_ROOT'] + '/bin';

const pdfFiller = require('pdffiller-stream');


// const sourcePDF = fs.readFileSync("fpca.pdf");

// Override the default field name regex. Default: /FieldName: ([^\n]*)/
const nameRegex = null;  

const shouldFlatten = false;

const data = {
  'topmostSubform[0].Page1[0].last_name[0]': 'Monty',
  'topmostSubform[0].Page1[0].first_name[0]': 'ale',
  'topmostSubform[0].Page1[0].middle_name[0]': 'p',
  'topmostSubform[0].Page1[0].suffix[0]': 'sr',
  'topmostSubform[0].Page1[0].previous_name[0]': 'grilled',
  'topmostSubform[0].Page1[0].birth_mon[0]': '10',
  'topmostSubform[0].Page1[0].birth_day[0]': '31',
  'topmostSubform[0].Page1[0].birth_yr[0]': '18',
  'topmostSubform[0].Page1[0].ssn1[0]': '123',
  'topmostSubform[0].Page1[0].ssn2[0]': '45',
  'topmostSubform[0].Page1[0].ssn3[0]': '6789',
  'topmostSubform[0].Page1[0].license_num[0]': '12345678',
  'topmostSubform[0].Page1[0].res_street[0]': '711 MCCULLOCH ST',
  'topmostSubform[0].Page1[0].res_apt[0]': '1223',
  'topmostSubform[0].Page1[0].res_city[0]': 'Raleigh',
  'topmostSubform[0].Page1[0].res_state[0]': 'NC',
  'topmostSubform[0].Page1[0].res_county[0]': 'WAKE',
  'topmostSubform[0].Page1[0].res_zip[0]': '27603',
  'topmostSubform[0].Page1[0].curr_address[0]': 'Flat 7 27th floor',
  'topmostSubform[0].Page1[0].fwd_address[0]': '',
  'topmostSubform[0].Page1[0].email[0]': 'alexpm@gmail.com',
  'topmostSubform[0].Page1[0].alt_email[0]': 'alex@mon.tg',
  'topmostSubform[0].Page1[0].tel[0]': '+85296699279',
  'topmostSubform[0].Page1[0].fax[0]': '',
  'topmostSubform[0].Page1[0].party[0]': 'Democraty',
  'topmostSubform[0].Page1[0].addl_info[0]': 'Hi there from here',
  'topmostSubform[0].Page1[0].date_mon[0]': '12',
  'topmostSubform[0].Page1[0].date_day[0]': '11',
  'topmostSubform[0].Page1[0].date_yr[0]': '17',
  'topmostSubform[0].Page2[0].return_address[0]': 'return me',
  'topmostSubform[0].Page2[0].leo_address[0]': 'hi there leo',
  'topmostSubform[0].Page1[0].classification[0]': "I am a U.S. citizen living outside the country, and my return is uncertain",
  'topmostSubform[0].Page1[0].sex[0]': 'Female',
  'topmostSubform[0].Page1[0].rec_materials[0]': 'Fax' 
};

module.exports.fpcapdf = (event, context, callback) => {
  const sourcePDF = "fpca.pdf";
  pdfFiller.fillFormWithFlatten( sourcePDF, data, shouldFlatten)
  .toFile('outputFile.pdf')
  .then(() => {
    // const content = fs.readFileSync("tmp/outputFile.pdf", 'utf8').toString("base64");
    // const body = new Buffer(content).toString("base64")
    let content;
    fs.readFile('outputFile.pdf', (err, data) => {
      content = data.toString('base64')

      const response = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline; filename=\"outputFile.pdf\""
        },
        body: content,
        isBase64Encoded: true
      };
      
        return callback(null, response);
    })
    
  }).catch((err) => {
      console.log(err);
  });
};