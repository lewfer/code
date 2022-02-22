function preload() {
  table = loadTable('migration_percent.csv', 'csv', 'header');
}
  
function setup() {
  createCanvas(800, 800);
  print(table.getColumn("1990"))
  noLoop()
  angleMode(DEGREES); 
}

function draw() {
  angle = 360/8
  translate(400, 400);
  background(220);
  drawRegionCircles("1990")
  rotate(angle);
  drawRegionCircles("1995")
  rotate(angle);
  drawRegionCircles("2020")
}

function drawRegionCircles(year) {
  let numCircles = table.getColumn("Region").length
  values = table.getColumn(year)
  y = 0
  for (let i=0; i<numCircles; i++) {
    y += values[i]*5 / 2
    circle(0, y, values[i]*5)
    y += values[i]*5 / 2
    console.log(y)
  }
}