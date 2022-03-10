/* 
Retrieve required indicator data from World Bank API and save it to a file.

See:

  https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation
  https://datahelpdesk.worldbank.org/knowledgebase/articles/898581-api-basic-call-structures
  https://data.worldbank.org/indicator

You need to run the following to install the necessary packages:
  npm install axios
  npm install objects-to-csv

*/

valid_countries = ['AD',
'AE',
'AF',
'AG',
'AI',
'AL',
'AM',
'AN',
'AO',
'AQ',
'AR',
'AS',
'AT',
'AU',
'AW',
'AZ',
'BA',
'BB',
'BD',
'BE',
'BF',
'BG',
'BH',
'BI',
'BJ',
'BM',
'BN',
'BO',
'BR',
'BS',
'BT',
'BV',
'BW',
'BY',
'BZ',
'CA',
'CC',
'CD',
'CF',
'CG',
'CH',
'CI',
'CK',
'CL',
'CM',
'CN',
'CO',
'CR',
'CU',
'CV',
'CX',
'CY',
'CZ',
'DE',
'DJ',
'DK',
'DM',
'DO',
'DZ',
'EC',
'EE',
'EG',
'EH',
'ER',
'ES',
'ET',
'FI',
'FJ',
'FK',
'FM',
'FO',
'FR',
'GA',
'GB',
'GD',
'GE',
'GF',
'GG',
'GH',
'GI',
'GL',
'GM',
'GN',
'GP',
'GQ',
'GR',
'GS',
'GT',
'GU',
'GW',
'GY',
'GZ',
'HK',
'HM',
'HN',
'HR',
'HT',
'HU',
'ID',
'IE',
'IL',
'IM',
'IN',
'IO',
'IQ',
'IR',
'IS',
'IT',
'JE',
'JM',
'JO',
'JP',
'KE',
'KG',
'KH',
'KI',
'KM',
'KN',
'KP',
'KR',
'KW',
'KY',
'KZ',
'LA',
'LB',
'LC',
'LI',
'LK',
'LR',
'LS',
'LT',
'LU',
'LV',
'LY',
'MA',
'MC',
'MD',
'ME',
'MG',
'MH',
'MK',
'ML',
'MM',
'MN',
'MO',
'MP',
'MQ',
'MR',
'MS',
'MT',
'MU',
'MV',
'MW',
'MX',
'MY',
'MZ',
'NA',
'NC',
'NE',
'NF',
'NG',
'NI',
'NL',
'NO',
'NP',
'NR',
'NU',
'NZ',
'OM',
'PA',
'PE',
'PF',
'PG',
'PH',
'PK',
'PL',
'PM',
'PN',
'PR',
'PS',
'PT',
'PW',
'PY',
'QA',
'RE',
'RO',
'RS',
'RU',
'RW',
'SA',
'SB',
'SC',
'SD',
'SE',
'SG',
'SH',
'SI',
'SJ',
'SK',
'SL',
'SM',
'SN',
'SO',
'SR',
'ST',
'SV',
'SY',
'SZ',
'TC',
'TD',
'TF',
'TG',
'TH',
'TJ',
'TK',
'TL',
'TM',
'TN',
'TO',
'TR',
'TT',
'TV',
'TW',
'TZ',
'UA',
'UG',
'UM',
'US',
'UY',
'UZ',
'VA',
'VC',
'VE',
'VG',
'VI',
'VN',
'VU',
'WF',
'WS',
'XK',
'YE',
'YT',
'ZA',
'ZM',
'ZW']

// Load the modules we need
const axios = require('axios');                     // for sending web requests
const api_helper = require("./api-helper")          // for making api calls easier to work with

// Call the function to pull the data
pull_data("world_bank.csv")

// Function to pull the data from the api
function pull_data(output_filename) {

  // Create a new csv
  api_helper.initialiseCsv(output_filename)

  // Call the API to retrieve the data
  CallPagedApi(1)

  // Function to call the OpenWeatherMap API
  function CallPagedApi(pageNo) {

    // Build the search URL.  See the api documentation for details of what's allowed
    // BX.TRF.PWKR.CD.DT is the indicator code for personal remittances received (https://data.worldbank.org/indicator/BX.TRF.PWKR.CD.DT)
    url = new URL("https://api.worldbank.org/v2/countries/all/indicators/BX.TRF.PWKR.CD.DT")
    url.searchParams.append("date", "2020")      // add the date parameter, specifying 2020
    url.searchParams.append("format", "json")    // add the format parameter, specifying json
    url.searchParams.append("page", pageNo)      // add the page parameter, specifying which page we want
    console.log(url.href)

    // Submit the URL and get the response
    axios.get(url.href).then(response => {
        // Get the api's response
        data = response.data
        pages = data[0].pages
        indicators = data[1]
        console.log("Page " + pageNo + " of " + pages)
        //console.log(data)

        // Store the data found to the csv, filtering for the info we want
        api_helper.storeCsv(output_filename, indicators, filter)

        // Do we want more pages?  If so, call the URL again with the next page number
        if (pageNo < pages) {
            // Get the next page
            return CallPagedApi(++pageNo);
        }      
    });
  }

  // Function to filter for the info we want from the response
  function filter(item) {
    // Create a new object for this item
    newElement = {} 

    if (valid_countries.includes(item.country.id)) {
      // Just extract the values we want
      newElement.country = item.country.value;
      newElement.country_id = item.country.id;
      newElement.iso_code = item.countryiso3code
      newElement.personal_remittances = item.value;
    }

      // Return the object
    return newElement                                       // return the object
  }
}