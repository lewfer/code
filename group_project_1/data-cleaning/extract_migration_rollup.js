/* 
Process the undesa_by_destination.csv file.
Extract the totals by country for 2020 and save it to a file.

You need to run the following to install the necessary packages:
    npm install objects-to-csv
    npm install csv-parser

*/

// Load the modules we need
const fs = require('fs'); 
const csv = require('csv-parser');
const ObjectsToCsv = require('objects-to-csv')

// Call the function to filter the data
extract_data("migration.csv")

// Function to filter the csv file
function extract_data(output_filename) {
    let filtered_migration_data = {}

    fs.createReadStream("undesa_by_destination.csv")
    .pipe(csv())
    .on('data', function(data){
        //console.log(data.year)

        // Add the country to our filtered list if it does not exist
        if (filtered_migration_data[data.country_name] == undefined)
            filtered_migration_data[data.country_name] = 0;

        // If the year is 2020 add the migration data to the total for the country
        if (data.year==2020)
            filtered_migration_data[data.country_name] += parseInt(data.migrants_by_destination,10)
    })
    .on('end',function(){
        // We have the filtered data now, so output it to the file
        //some final operation
        console.log(filtered_migration_data)
        //console.log(Object.entries(filtered_migration_data).map(e => ({[e[0]]: e[1]})))

        // We have a json obect that looks like this:
        // {
        //     Burundi: 344767,
        //     Comoros: 12496,
        //     Djibouti: 119738,
        //     Eritrea: 13934,
        //     Ethiopia: 1085517,
        //     ...
        // }
        //
        // We need to turn it into one that looks like this so that it can be output to csv:
        //
        // [
        //     {country:Burundi, migrants:344767},
        //     {country:Comoros. migrants:12496},
        //     {country:Djibouti, migrants:119738},
        //     {country:Eritrea, migrants:13934},
        //     {country:Ethiopia, migrants:1085517},
        //     ...
        // ]
        filtered_migration_data = Object.entries(filtered_migration_data).map(e => ({country:e[0], migrants:e[1]}))
  
        // Now output to csv
        const csv = new ObjectsToCsv(filtered_migration_data)
        csv.toDisk(output_filename)
    });  

}

