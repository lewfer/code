/*
 * textwrap.js
 * Illustrates text wrapping
 */

function drawTextWrap(container, data, parameters={}) {
    // Create our chart object
    let chart = new D3SI(container, data, parameters)
   
    // Create our scales to map data values to screen position 
    let xScale = chart.xScaleBand("player")

    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    let circleSelection = chart.bind("circle") 

    // Add the circles svg elements to the chart, one for each item in the selection
    circleSelection
        // Handle 'entered' data items by creating a circle for each one
        .enter()
        .append("circle")
            .attr("cx", function (d) { return xScale(d["player"]) })    // place the circle on the x axis based on the player
            .attr("cy", chart.height / 4)
            .attr("r",  20)

    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    let textSelection = chart.bind("text") 

    // Add the circles svg elements to the chart, one for each item in the selection
    textSelection
        // Handle 'entered' data items by creating a circle for each one
        .enter()
        .append("text")
            .attr("x", function (d) { return xScale(d["player"]) - xScale.bandwidth()/2 })    // place the circle on the x axis based on the player
            .attr("y", chart.height / 4+20)
            .text(function (d) { return d.description })

    chart.svg
            .selectAll("text")
            //.attr('transform', "translate(" + x + ",0)")
            .call(wrap,xScale.bandwidth())
}

function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = 1.1 //parseFloat(text.attr("y")),
          xx = parseFloat(text.attr("x")),
          tspan = text.text(null).append("tspan").attr("x", xx).attr("y", y).attr("dy", dy + "em");

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", xx).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }
        