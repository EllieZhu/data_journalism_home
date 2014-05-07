var tip = d3.tip()
  .attr('class', 'd3-tip')
  .html (function(d) {
    // return d.properties[currentProperty];
    return "<span style='color: red; font-family: helvetica'>"+d.close+"</span>";
  })

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 750 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(tip)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", function(error, data) {
  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.close = +d.close;
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.close; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Complaints (000)");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .attr("d", line);
});

//bubble map

var currentProperty = "fraud1";

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .html (function(d) {
    // return d.properties[currentProperty];
    return "<span style='color: black; font-family: helvetica'>" + d.properties.name+ "</span>" + ": " + "<br><span style='color: red; font-family: helvetica'>"+d.properties[currentProperty]+"</span>";
  })

var width = 1160,
    height = 700;

var radius = d3.scale.sqrt()
    .domain([0, 500])
    .range([0, 25]);

var path = d3.geo.path();

var svg = d3.select("#second").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(tip)
    .append("g") 
      .attr("transform", "translate(100,0)");

queue()
    .defer(d3.json, "us.json")
    .defer(d3.json, "us-state-centroids.json")
    .await(ready);

function ready(error, us, centroid) {
  svg.append("path")
      .attr("class", "states")
      .datum(topojson.feature(us, us.objects.states))
      .attr("d", path);

  svg.selectAll(".symbol")
      .data(centroid.features.sort(function(a, b) { return b.properties.fraud1 - a.properties.fraud1; }))
    .enter().append("path")
      .attr("class", "symbol")
      .attr("d", path.pointRadius(function(d) { return radius(d.properties.fraud1) ; }))
      .attr("fill","steelblue")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
      
}


update1 = function(variable){
d3.selectAll(".symbol")
  .transition()
  .duration(750)
  .attr("d", path.pointRadius(function(d) { return radius(d.properties.identity1); }))
  .attr("fill", "#A347A3");
}

update2 = function(variable){
d3.selectAll(".symbol")
  .transition()
  .duration(750)
  .attr("d", path.pointRadius(function(d) { return radius(d.properties.fraud1); }))
  .attr("fill", "steelblue");
}

d3.selectAll('#identity1').on('click', function() {
   update1(this.id)
});

d3.selectAll('#fraud1').on('click', function() {
   update2(this.id)
});

document.querySelector("#fraud").addEventListener("change", dataUpdate1);
document.querySelector("#identity").addEventListener("change", dataUpdate2);


function dataUpdate1() {

    var menuvalue = document.querySelector("#fraud");

    if (menuvalue.selectedIndex == 0) {

      currentProperty = "fraud1";

      d3.selectAll(".symbol")
      .transition()
      .duration(750)
      .attr("d", path.pointRadius(function(d) { return radius(d.properties.fraud1); }))
      .attr("fill", "steelblue");

    }

    if (menuvalue.selectedIndex == 1) {

      currentProperty = "fraud2";

      d3.selectAll(".symbol")
      .transition()
      .duration(750)
      .attr("d", path.pointRadius(function(d) { return radius(d.properties.fraud2); }))
      .attr("fill", "steelblue");

    }

    if (menuvalue.selectedIndex == 2) {

      currentProperty = "fraud3";
      d3.selectAll(".symbol")
      .transition()
      .duration(750)
      .attr("d", path.pointRadius(function(d) { return radius(d.properties.fraud3); }))
      .attr("fill", "steelblue");
    }
}

function dataUpdate2() {

  var menuvalue2 = document.querySelector("#identity");

    if (menuvalue2.selectedIndex == 0) {

      currentProperty = "identity1";

      d3.selectAll(".symbol")
      .transition()
      .duration(750)
      .attr("d", path.pointRadius(function(d) { return radius(d.properties.identity1); }))
      .attr("fill", "#A347A3");

    }

    if (menuvalue2.selectedIndex == 1) {

      currentProperty = "identity2";


      d3.selectAll(".symbol")
      .transition()
      .duration(750)
      .attr("d", path.pointRadius(function(d) { return radius(d.properties.identity2); }))
      .attr("fill", "#A347A3");

    }

    if (menuvalue2.selectedIndex == 2) {

      currentProperty = "identity3";


      d3.selectAll(".symbol")
      .transition()
      .duration(750)
      .attr("d", path.pointRadius(function(d) { return radius(d.properties.identity3); }))
      .attr("fill", "#A347A3");
    }

    console.log("A New Option is selected");

}