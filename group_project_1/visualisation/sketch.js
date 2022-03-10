// Define variables for holding our canvas and maps
let myMap
let canvas
const mappa = new Mappa('Leaflet')
let mapHasChanged = false
let reds = ['#fff5f0','#fee0d2','#fcbba1','#fc9272','#fb6a4a','#ef3b2c','#cb181d','#a50f15','#67000d']

// Set up the options for our map
const options = {
  lat: 0,
  lng: 0,
  zoom: 2,
  style: tiles_library.stamen_toner.url
}

function preload() {
  worldGeoJson = loadJSON('world.geo.json')
  
  // Load data from the csv file
  table = loadTable('migration.csv', 'csv', 'header');
  long_lat = loadTable('world_country_and_usa_states_latitude_and_longitude_values.csv','csv','header')
  remittances = loadTable('world_bank.csv','csv','header')
  //loadAllCountries()
}

function setup() {
  // Create a canvas on which to draw the map
  let canvas = createCanvas(1200, 600)
  
  // Create map with the options
  myMap = mappa.tileMap(options)

  // Draw the map on the canvas
  myMap.overlay(canvas)
  myMap.onChange(mapChanged);
  
  // Load world map outlines
  world = new GeoJSON(myMap, worldGeoJson)
  
  print(world)
  
}

function mapChanged() {
  clear()
  print("map changed")
  mapHasChanged = true
}


function draw() {
  if (mapHasChanged) {
    drawChloropleth()
    drawCircles()

    mapHasChanged = false
  }
}

function drawChloropleth() {

    // Draw countries
    //noFill()
    fill(200, 30, 70, 150)
    stroke("red")
    for (let i = 0; i < world.numGeoJSONFeatures(); i++) {
        // TODO!! solve issue with mismatches between geojson and csv
        value = table.findRow(world.names[i], "country")
        if (value != null) {
          //print(value, world.names[i])
          migrants = value.get("migrants")
          colourIndex = map(migrants, 0, 50000000, 0, 8) // !!
          colourIndex = Math.round(colourIndex)
          //print(colourIndex, reds[colourIndex])
          fill(reds[colourIndex])      
      }
      
      /*
      
      if (world.names[i]=="Belize") {
        value = table.findRow("Belize", "country")
        migrants = value.get("migrants")
        colourIndex = map(migrants, 0, 10000000, 0, 8)
        colourIndex = Math.round(colourIndex)
        print(colourIndex, reds[colourIndex])
        fill(reds[colourIndex])
      }
      else if (world.names[i]=="Mexico")
        fill(50, 200, 70, 150)
      else
        noFill()
        */
      strokeWeight(2)
      world.drawFeature(i)
    }
}

function drawCircles() {
  // Find the max remittances
  r = remittances.getColumn("personal_remittances")
  print(r)
  maxr = max(r)
  print(maxr)

  // Cycle through the table
  for (let r = 0; r < long_lat.getRowCount(); r++) {
    let country = long_lat.getString(r, "country_code")
    let lat = long_lat.getString(r, "latitude")
    let long = long_lat.getString(r, "longitude")

    value = remittances.findRow(country, "countryid")
    if (value != null) {
        //print(value, world.names[i])
        rem = value.get("personal_remittances")
        diam = map(rem, 0, maxr, 5, 50) // !!
        pix = myMap.latLngToPixel(lat, long);

        fill("green")
        circle(pix.x, pix.y, diam)
    }

    //print(country,long,lat)
  }
}