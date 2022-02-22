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

    // Just extract the values we want
    newElement.country = item.country.value;
    newElement.personal_remittances = item.value;

      // Return the object
    return newElement                                       // return the object
  }
}