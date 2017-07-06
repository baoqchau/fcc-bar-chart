//parse data
var svg = d3.select("svg"),
    margin = {top: 10, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width")  - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);


var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(10, "B");

 var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>$" + d.value + "</strong> Billions <br>"
                                + d.year + " - " + d.month;  
            });

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

$.getJSON("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(json){
  var data = json.data;
  var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  data.forEach(function(d){
    d.date = parseDate(d[0]);
    d.value = +d[1];
    d.year = d.date.getFullYear();
    d.month = monthName[d.date.getMonth()];
  });

  var xAxisScale = d3.time.scale()
                     .domain([d3.min(data, function(d){
                        return d.date;
                      }), d3.max(data, function(d){
                        return d.date;
                      })])
                      .range([margin.left, width - margin.right]);

  var xAxis = d3.svg.axis()
    .scale(xAxisScale)
    .orient("bottom")
    .ticks(d3.time.year, 5)
    .tickFormat(d3.time.format("%Y"));

   x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height - margin.bottom + 43) + ")")
      .call(xAxis);
  
  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(40,10)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end") 
      .text("Gross Domestic Product, USA");

  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .attr("transform", "translate(-70, 60)")
        .style("font-size", "30px") 
        .style("text-decoration", "underline")  
        .text("Gross Domestic Product");

  svg.selectAll("rect")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("transform", "translate(5,10)")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

});
