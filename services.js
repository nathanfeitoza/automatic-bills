module.exports = {
    energia: {
        module: require("./webscrap-energisa/index"),
        getValue: async function(month, year) {
            const data = await this.module();
            const monthsNumber = {
              "JAN": "01",
              "FEV": "02",
              "MAR": "03",
              "ABR": "04",
              "MAI": "05",
              "JUN": "06",
              "JUL": "07",
              "AGO": "08",
              "SET": "09",
              "OUT": "10",
              "NOV": "11",
              "DEZ": "12",
            };

            const dataReturn = (await Promise.all(
              data.map(async (item) => {
                const monthNumber = monthsNumber[item.month];
                return monthNumber === month && item.year === year ? item : null;
              }),
            )).filter((item) => item !== null);

            return dataReturn[0] ? dataReturn[0].value.replace(/R\$\s?/ig, '') : false;
        },
    },
    agua: {
        module: require("./webscrap-deso/index"),
        getValue: async function(month, year) {
          const data = await this.module();

          const dataReturn = (await Promise.all(
            data.map(async (item) => {
              return item.month === month && item.year === year ? item : null;
            }),
          )).filter((item) => item !== null);

          return dataReturn[0] ? dataReturn[0].value.replace(/R\$\s?/ig, '') : false;
        },
    }
}