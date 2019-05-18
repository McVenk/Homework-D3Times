// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};


var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Creating SVG wrapper, appending SVG group for holding chart and shifting purposes
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// Reading CSV Data
d3.csv("assets/data/data.csv", function(err, data) {
    if (err) throw err;
  console.log(data)
    // Step 1: Parse Data/Cast as numbers
     // ==============================
    data.forEach(function(d) {
      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
    });

// Creating Scales & axes

var xLinearScale = d3.scaleLinear().range([0, width]);
var yLinearScale = d3.scaleLinear().range([height, 0]);

var baxis = d3.axisBottom(xLinearScale);
var laxis = d3.axisLeft(yLinearScale);

// Declaring limits
  var xlowerlimit;
  var xhigherlimit;
  var ylowerlimit;
  var yhigherlimit;
  
  xlowerlimit = d3.min(data, function(d) {
      return d.healthcare;
  });
  
  xhigherlimit = d3.max(data, function(d) {
      return d.healthcare;
  });
  
  ylowerlimit = d3.min(data, function(d) {
      return d.poverty;
  });
  
  yhigherlimit = d3.max(data, function(d) {
      return d.poverty;
  });
  
  xLinearScale.domain([xlowerlimit, xhigherlimit]);
  yLinearScale.domain([ylowerlimit, yhigherlimit]);
  console.log(xlowerlimit);
  console.log(yhigherlimit);

  // Adding axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(baxis);

  chartGroup.append("g")
    .call(laxis);

// Definign circles for scatter plot
var circlesGroup = chartGroup.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.healthcare +1.5))
  .attr("cy", d => yLinearScale(d.poverty +0.3))
  .attr("r", "12")
  .attr("fill", "blue")
  .attr("opacity", .5)

  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });

// Declaring & creating tool tip for the chart
var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (abbr + '%');
      });
chartGroup.call(toolTip);

// Creating events for displaying/hiding tooltip
circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })
     .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });


// Setting labels for axes
chartGroup.append("text")
  .style("font-size", "12px")
  .selectAll("tspan")
  .data(data)
  .enter()
  .append("tspan")
      .attr("x", function(d) {
          return xLinearScale(d.healthcare +1.3);
      })
      .attr("y", function(d) {
          return yLinearScale(d.poverty +.1);
      })
      .text(function(d) {
          return d.abbr
      });

      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healtcare(%)");
  
    chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  });
