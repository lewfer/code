// Define a list of tile options
let tiles_library = {
  osm: {
    url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  },
  stamen_toner: {
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://maps.stamen.com/">Stamen Design</a>'
  },
  stamen_terrain: {
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://maps.stamen.com/">Stamen Design</a>'
  },
  stamen_watercolor: {
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://maps.stamen.com/">Stamen Design</a>'
  },
}

// Function to plot a route
function plotRoute(route, closed = false, points = false) {
  if (route.length > 0) {
    beginShape()
    for (let i = 0; i < route.length; i++) {
      pos = myMap.latLngToPixel(route[i].lat, route[i].lng)
      vertex(pos.x, pos.y)
      if (points)
        circle(pos.x, pos.y, 5)
    }
    closed ? endShape(CLOSE) : endShape()
  }
}

// Function to plot text
function plotText(txt, coord, xoffs = 0, yoffs = 0, angle = 0) {
  push()
  angleMode(DEGREES)
  pos = myMap.latLngToPixel(coord.lat, coord.lng)
  translate(pos.x, pos.y)
  rotate(angle)
  text(txt, 0 + xoffs, 0 + yoffs)
  pop()
}

// Function called when the map changes
function mapChanged() {
  clear()
  print("map changed")
  mapHasChanged = true
}

// Class to make handling of Geojson easier
class GeoJSON {

  constructor(mappaMap, geoData) {
    this.names = null
    this.mappaMap = mappaMap
    this.loadGeoJSON(geoData)
  }

  // Load a geoJSON file (loaded with a call to loadJSON())
  loadGeoJSON(geoData) {
    this.geoData = geoData
    this.loadNames()
  }

  // Number of features in this file
  numGeoJSONFeatures() {
    return this.geoData.features.length;
  }

  // Load the feature names
  loadNames() {
    if (this.names === null) {
      this.names = []
      for (let i = 0; i < this.geoData.features.length; i++) {
        //print(this.geoData.features[i].properties.name)
        this.names.push(this.geoData.features[i].properties.name)
      }
      return this.names
    }
  }

  // Draw a single polygon
  // A polygon can have 2 parts - a solid part and an optional hole
  // See https://en.wikipedia.org/wiki/GeoJSON
  drawPolygon(polygon) {
    // Get the solid part and hole
    let solid = polygon[0]
    let hole = null
    if (polygon.length>1)
      hole = polygon[1] // do nothing with a hole for now.  May want to cut out the hole!
    
    // Draw the solid part
    if (solid.length > 0) {
      beginShape()
      for (let i = 0; i < solid.length; i++) {
        let pos = this.mappaMap.latLngToPixel(solid[i][1], solid[i][0])
        //print(pos)
        vertex(pos.x, pos.y)
      }
      endShape(CLOSE)
    }
  }

  // Draw a feature
  // Handles Polygon and MultiPolygon features
  // Does not currently handle Point, LineString, MultiPoint, MultiLineString or GeometryCollection
  drawFeature(index) {
    // Get the feature type
    let featureType = this.geoData.features[index].geometry.type

    if (featureType == "Polygon") {
      // A single polygon
      let polygon = this.geoData.features[index].geometry.coordinates 
      this.drawPolygon(polygon)
      
    } else if (featureType == "MultiPolygon") {
      // A list of polygons, so plot each one
      let polygons = this.geoData.features[index].geometry.coordinates
      for (let p = 0; p < polygons.length; p++) {
        let polygon = polygons[p]
        this.drawPolygon(polygon)
      }
    }
  }
}
