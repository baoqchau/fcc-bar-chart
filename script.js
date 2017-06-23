//parse data
var svg = d3.select("svg"),
    margin = {top: 10, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width")  - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(10, "B");

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

$.getJSON("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(json){
  var data = json.data;
  data.forEach(function(d){
    d.date = parseDate(d[0]);
    d.value = +d[1];
  });

  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(40,10)")
      .call(yAxis);
   

  svg.selectAll("rect")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("transform", "translate(5,10)");
});
