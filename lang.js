
var svg;
var select;
var margin = { top: 20, right: 10, bottom: 40, left: 80 };
var width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

function key(lang) {
    return lang.name;
}
function init() {
    svg = d3.select("#vis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
       // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function draw(data) {

    var year = function (d) { return d.year; }
    var nbRepos = function (d) { return d.nbRepos; };
    var domain = [d3.min(data, year), d3.max(data, year)];
    var range = [margin.left, width];
    xScale = d3.scale.linear()
        .domain(domain)
        .range(range);

    var domain = [d3.min(data, nbRepos), d3.max(data, nbRepos)];
    var range = [height, margin.top];
    yScale = d3.scale.log()
        .domain(domain)
        .range(range);
        
    var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(10);  //Set rough # of ticks    
    //Define Y axis
    var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(5);
    var padding=10;
    //Create X axis
    svg.selectAll("g").remove();
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height-padding+margin.top) + ")")
        .call(xAxis);              
    //Create Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" +(margin.left/2+padding)+ ",0)")
        .call(yAxis);
    var duration = 500;
    var delay = 500;
    var circle = svg.selectAll("circle")
        .data(data, key);
    var text = svg.selectAll(".datatext")
        .data(data, key);

    var cordX = function (d) { return xScale(d.year); };
    var cordY = function (d) { return yScale(d.nbRepos); };
    // remove 
    circle
        .exit()
        .transition().delay(delay * 0).duration(function (d, i) { return duration; })
        .attr("fill", "white")
        .remove();
    text
        .exit()
        .transition().delay(delay * 0).duration(function (d, i) { return duration; })
        .attr("fill", "white")
        .remove();
    //update
    circle
        .transition().delay(delay).duration(function (d, i) { return duration; })
        .attr("cx", cordX)
        .attr("cy", cordY);

    text
        .transition().delay(delay).duration(function (d, i) { return duration; })
        .attr("x", function (d) { return 5 + cordX(d); })
        .attr("y", function (d) { return cordY(d) + 2.5; });
        
     
    //add new 
    circle
        .enter()
        .append("circle")
        .attr("cx", cordX)
        .attr("cy", cordY)
        .attr("r", 0)
        .transition().delay(delay * 2).duration(function (d, i) { return duration; })
        .attr("r", "5");

    text
        .enter()
        .append("text")
        .attr("class","datatext")
        .text(function (d) { return d.name; })
        .attr("x", function (d) { return 5 + cordX(d); })
        .attr("y", function (d) { return cordY(d) + 2.5; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "6px")
        .attr("fill", "white")
        .transition().delay(delay * 2).duration(function (d, i) { return duration; })
        .attr("fill", "red");

}

function getParadigms(data) {
    return _.uniq(_.flatten(_.map(data, function (d) { return d.paradigms; })));
}

function addSelects(data) {
    var paradigms = getParadigms(data);
    console.log(paradigms);
    select = d3.select("#paradigmSelect")
        .selectAll("option")
        .data(paradigms)
        .enter()
        .append("option")
        .text(function (d) {
        return d;
    });

    d3.selectAll("option")
        .data(paradigms)
        .exit()
        .remove();
}