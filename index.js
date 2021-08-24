const { readFileSync } = require("fs");
const { google } = require("googleapis");
const { authorize } = require("./utils/google.js");
const services = require('./services');
const { promisify } = require('util');

Number.prototype.formatMonth = function () {
  return (this < 10 ? `0${(this)}` : this);
}

const credentialsData = readFileSync("credentials.json");
const date = new Date();
const actualYear = date.getUTCFullYear();
const actualMonth = date.getUTCMonth() + 1;
let yearSearch = (actualMonth == 12 ? actualYear + 1 : actualYear).toString();
let monthSearch = (actualMonth == 12 ? '01' : (actualMonth + 1).formatMonth()).toString();

const rangeDateGet = `${monthSearch}/${yearSearch}!`;

if (!credentialsData) {
  return console.log("Error loading client secret file:", credentialsData);
}

authorize(JSON.parse(credentialsData), updateSheet);

async function updateSheet(auth) {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const servicesUpdate = JSON.parse(process.env.SERVICES_UPDATE || "{}");
    const keysServices = Object.keys(servicesUpdate);
    
    await Promise.all([
      keysServices.forEach(async (item) => {
        const serviceExec = services[item];

        if (!serviceExec) {
          return;
        }

        if (typeof serviceExec.getValue === "function") {
          console.log(`Putting value to ${item}`);

          let serviceValue = await serviceExec.getValue(
            actualMonth.formatMonth().toString(),
            actualYear.toString()
          );
          serviceValue = !serviceValue ? '0,00' : serviceValue;

          const dataCell = {
            spreadsheetId: process.env.SPREADSHEET_ID,
            valueInputOption: "USER_ENTERED",
            range: `${rangeDateGet}${servicesUpdate[item]}`,
            resource: {
              range: `${rangeDateGet}${servicesUpdate[item]}`,
              majorDimension: "ROWS",
              values: [[`R$ ${serviceValue}`]],
            }
          };

          const sheetsUpdate = promisify(sheets.spreadsheets.values.update)
            .bind(sheets.spreadsheets.values);

          await sheetsUpdate(dataCell);

          console.log(`${item} updated!`);
        }
      })
    ]
    );

    console.log('Finished');
    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
}
