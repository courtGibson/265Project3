var dataP = d3.json("distanceDataJson.json")
var mapP = d3.json("countries.geojson")
var gdpDataP = d3.json("csvjson.json")

var YEAR_INDEX = 0;
var PREV_INDEX = 0;

Promise.all([dataP, mapP, gdpDataP]).then(function(values)
{
  var runData = values[0]
  var geoData = values[1]
  var gdpData = values[2]
  //var keyedData = values[2]


  putRunDataInMapData(runData, geoData, gdpData);

  //console.log("all done")
  console.log("gdp", gdpData)
  console.log("data", runData);
  console.log("map", geoData);

  makeDiv();
  var map = makeMap(geoData);
  makeGroup();


  makeCircles(geoData);
  makeLegend();
  makeButtons(geoData);


//  window.alert("Map Navigation:\n    - Click and drag to move\n    - Two finger scroll to zoom in/out\n    - Click to zoom to country")
},
  function(err)
{
  console.log(err);
});



var makeButtons = function(data)
{
  d3.select("body").selectAll("button")
    .data(data.features[0].runData.years)
    .enter()
    .append("button")
    .text(function(d)
    {
      return d.year;

    })
    .style("float", "right")
    .style("display", "block")
    .style("clear", "right")
    .style("position", "relative")
    .style("top", "-420px")
    .style("margin", "0px 100px 10px 0px")
    .style("padding", "10px 30px 10px")
    .on("click", function(d)
    {
      PREV_INDEX = YEAR_INDEX;
      YEAR_INDEX = Number(d.year)-2014;
      console.log(YEAR_INDEX);
      console.log(d.year+ " button clicked");


        makeCircles(data);
        d3.select("#circleGroup").style("opacity", 1);

        drawButtonLabel(d);

        /*d3.select(".tooltip")
              .transition()
              .duration(500)
              .style("opacity", 0);*/

    })

    d3.select("body")
      .append("button")
      .text("Map Only")
      .style("float", "right")
      .style("display", "block")
      .style("clear", "right")
      .style("position", "relative")
      .style("top", "-420px")
      .style("margin", "0px 100px 10px 0px")
      .style("padding", "10px 16px 10px")
      .on("click", function(d)
      {
        YEAR_INDEX = -1;
        console.log(YEAR_INDEX);
        console.log("map only button clicked");
        d3.select("#circleGroup").style("opacity", 0);
        drawButtonLabel(d);

        d3.select(".tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);

      })
}


var drawButtonLabel = function(d)
{
  var svg = d3.select("#svg2")

  svg.select("#prevText").remove();
  svg.select("#currText").remove();
  for (var i = 0; i<5; i++)
  {
    if (i == PREV_INDEX)
    {
      svg.append("text")
          .attr("id", "prevText")
          .attr("x", 10)
          .attr("y", ((50*i)+395))
          .text("Previous:")
    }
    else if(i == YEAR_INDEX)
    {
      svg.append("text")
          .attr("id", "currText")
          .attr("x", 10)
          .attr("y", ((50*i)+395))
          .text("Current:")
    }
  }
}

var makeDiv = function()
{
   var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

}

var makeGroup = function()
{
  var svg = d3.select("svg")

    svg.select("#map").append("g")
      .attr("id", "circleGroup")
      .style("opacity", 1);
}

var makeLegend = function()
{

  d3.select("body").append("svg")
    .attr("id", "svg2")
    .attr("width", 280)
    .attr("height", 700)
    .style("float", "right")
    //.attr("fill", "white")//"rgb(23, 25, 32)")


  var svg2 = d3.select("#svg2")



    svg2.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 280)
        .attr("height", 300)
        .attr("fill","white")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("opacity", 1)
        .attr("rx", 6)
        .attr("ry", 6)

    svg2.append("rect")
        .attr("x", 0)
        .attr("y", 310)
        .attr("width", 280)
        .attr("height", 390)
        .attr("fill","white")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("opacity", 1)
        .attr("rx", 6)
        .attr("ry", 6)

    svg2.append("text")
        .text("Legend")
        .attr("x", 95)
        .attr("y", 25)
        .style("text-decoration", "underline")
        .style("font-weight", "bold")

        svg2.append("rect")
            .attr("x", 20)
            .attr("y", 80)
            .attr("width", 38)
            .attr("height", 20)
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("fill", getColor(1))

        svg2.append("rect")
            .attr("x", 58)
            .attr("y", 80)
            .attr("width", 38)
            .attr("height", 20)
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("fill", getColor(300))

        svg2.append("rect")
            .attr("x", 96)
            .attr("y", 80)
            .attr("width", 38)
            .attr("height", 20)
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("fill", getColor(3000))

        svg2.append("rect")
            .attr("x", 134)
            .attr("y", 80)
            .attr("width", 38)
            .attr("height", 20)
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("fill", getColor(10000))


        svg2.append("rect")
            .attr("x", 172)
            .attr("y", 80)
            .attr("width", 38)
            .attr("height", 20)
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("fill", getColor(30000))


        svg2.append("rect")
            .attr("x", 210)
            .attr("y", 80)
            .attr("width", 38)
            .attr("height", 20)
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("fill", getColor(90000))


    svg2.append("text")
        .text("GDP per Capita")
        .attr("x", 60)
        .attr("y", 70)

    svg2.append("text")
        .text("200")
        .attr("x", 58-15)
        .attr("y", 120)
        .style("font-size", "15px")

    svg2.append("text")
        .text("2000")
        .attr("x", 96-20)
        .attr("y", 120)
        .style("font-size", "15px")

        svg2.append("text")
            .text("5000")
            .attr("x", 134-20)
            .attr("y", 120)
            .style("font-size", "15px")

            svg2.append("text")
                .text("20000")
                .attr("x", 172-20)
                .attr("y", 120)
                .style("font-size", "15px")

                svg2.append("text")
                    .text("80000")
                    .attr("x", 210-10)
                    .attr("y", 120)
                    .style("font-size", "15px")
//20000, 80000
    svg2.append("circle")
        .attr("cx", 240)
        .attr("cy", 167)
        .attr("r", 20)
        .style("opacity", 1)
        .style("stroke", "black")
        .style("stroke-width", 10*0.1)
        .attr("fill", "gold")

    svg2.append("text")
        .text("Number of athletes:")
        .attr("x", 15)
        .attr("y", 175)


    svg2.append("text")
        .text("View:")
        .attr("x", 105)
        .attr("y", 350)


        svg2.append("circle")
            .attr("cx", 240)
            .attr("cy", 212)
            .attr("r", 20)
            .style("opacity", 1)
            .style("stroke", "black")
            .style("stroke-width", 10*0.1)
            .attr("fill", "cyan")

        svg2.append("text")
            .text("Increase from previous:")
            .attr("x", 15)
            .attr("y", 220)


            svg2.append("circle")
                .attr("cx", 240)
                .attr("cy", 257)
                .attr("r", 20)
                .style("opacity", 1)
                .style("stroke", "black")
                .style("stroke-width", 10*0.1)
                .attr("fill", "orangered")

            svg2.append("text")
                .text("Decrease from previous:")
                .attr("x", 15)
                .attr("y", 265)


}



var makeCircles = function(data)
{

    //console.log("select", d3.select("body"))

    var svg = d3.select("svg")

    var total = 1;


    var circ =  d3.select("#circleGroup")

    circ.selectAll("circle").remove();


    circ.selectAll("circle")
        .data(data.features)
        .enter()
        .append("circle")
        .attr("id", function(d){return "circle"+YEAR_INDEX+d.countryName})
        .attr("transform", function(d)
        {
          var spotX = d.properties.spotData.xLoc;
          var spotY = d.properties.spotData.yLoc;
         //console.log("in spot x", spotX)
         //console.log("in spot Y", spotY)
           return ("translate(" + Number(spotX)+ "," + Number(spotY) + ")");
        })
        .attr("r", function(d)
        {
        //  console.log("total", d.runData.years[0])
          if (d.runData.years[YEAR_INDEX].events != null && d.runData.years[YEAR_INDEX].totalAthletesInCountry != 0)
          {
            return Number(Math.sqrt((d.runData.years[YEAR_INDEX].totalAthletesInCountry+40)/3.1415));
          }
          else
          {
            return 0;
          }

        })
        .style("opacity", 0.8)
        .style("stroke", "black")
        .style("stroke-width", function(d)
        {
          return Number(Math.sqrt((d.runData.years[YEAR_INDEX].totalAthletesInCountry+40)/3.1415)*0.1);
        })
        .attr("fill", function(d)
        {
          if (d.runData.years[YEAR_INDEX].totalAthletesInCountry < d.runData.years[PREV_INDEX].totalAthletesInCountry)
          {
            return "orangered"
          }
          else if (d.runData.years[YEAR_INDEX].totalAthletesInCountry > d.runData.years[PREV_INDEX].totalAthletesInCountry)
          {
            return "cyan"
          }
          else
          {
            return "gold";
          }
        })
        .on("mouseover", function(d, i)
        {


              d3.select(".tooltip").transition()
                 .duration(200)
                 .style("opacity", 1);

                 if(d.runData.years[YEAR_INDEX].events != null)
                 {
                   var totAth = d.runData.years[YEAR_INDEX].totalAthletesInCountry;
                 }
                 else
                 {
                   var totAth = 0;
                 }

                 if(d.runData.years[YEAR_INDEX].gdp == 0)
                 {
                   var gdpS = "N/A";
                 }
                 else
                 {
                   var gdpS= Math.round(d.runData.years[YEAR_INDEX].gdp);

                 }
            d3.select(".tooltip").html(d.countryName + "<br/></br>"  + "GDP per Capita: "+ gdpS + "<br/>"  +"Total Athletes: "+totAth+"<br/>"+"<svg id='smallsvg1'></svg>"+"<svg id='smallsvg2'></svg>")
                 .style("left", "0px")//(d3.event.pageX) + "px")
                 .style("top", "100px")//(d3.event.pageY - 28) + "px");

                 makeGraphs(d);
          //console.log(d.properties.id)

        })
        .on("mouseout", function(d, i)
        {
          d3.select(".tooltip").transition()
             .duration(500)
             .style("opacity", 0);

           d3.select("#countryLabel" + [d.id])
           .style("display", "none");
        })



  var t = d3.transition()
      .duration(200)
      .ease(d3.easeLinear);


  circ.selectAll("circle")
    .transition()
    .duration(4000)
    .ease(d3.easeQuadInOut)
    .attr("fill", "gold");






}



var makeGraphs = function(data)
{
  var svg1 = d3.select("#smallsvg1")
  var svg2 = d3.select("#smallsvg2")

  makeGenderGraph(data, svg1);
  makeEventGraph(data, svg2);
}

var makeGenderGraph = function(data, svg)
{
  var margins =
    {
      top: 10,
      bottom: 10,
      left: 50,
      right: 10
    }


  var width = 230;
  var height = 100;
  var svg = svg.attr("width", width+margins.left+margins.right)
                .attr("height", height+margins.top+margins.bottom)


  var xScale = d3.scaleLinear()
                .domain([0,100])
                .range([0,width-margins.left-margins.right])

var numFemale = 0;
    if (data.runData.years[YEAR_INDEX].events)
    {
      data.runData.years[YEAR_INDEX].events.forEach(function(d)
      {
        numFemale = numFemale + d.gender.female.length;
      })
    }
    console.log("numFemale", numFemale)


var numMale = 0
    if (data.runData.years[YEAR_INDEX].events)
    {
      data.runData.years[YEAR_INDEX].events.forEach(function(d)
      {
        numMale = numMale + d.gender.male.length;
      })
    }

  console.log("numMale", numMale)

  var mFPercent = [numFemale/data.runData.years[YEAR_INDEX].totalAthletesInCountry,numMale/data.runData.years[YEAR_INDEX].totalAthletesInCountry];

  var yScale = d3.scaleLinear()
          .domain([0, 100])
          .range([0, 85])


  var xAxis  = d3.axisBottom(xScale)
                  .tickValues([0,25,50,75,100])
                  .tickFormat(function(n) { return n+"%";})


  var yAxis  = d3.axisLeft(yScale)
                  .tickValues([25, 75])
                  .tickFormat(function(n) { console.log("n", n); if(n == 25){return "Males";}else{return "Female";}})


  svg.append("g")
         .classed(xAxis,true)
         .call(xAxis)
         .attr("transform","translate("+margins.left+","
         +(margins.top+height-margins.top-margins.bottom)+")"
      );


   svg.append("g")
     .classed(yAxis,true)
     .call(yAxis)
     .attr("transform","translate("+(margins.left)+","
     + 5 +")");

     var bars = svg.selectAll(".bar")
                 .data(mFPercent)
                 .enter()
                 .append("g")

     bars.append("rect")
           .attr("class", "bar")
           .attr("x", 0+margins.left+1)
           .attr("y", function(d,i)
           {
             if(i == 1)
             {
               return yScale(25);
             }
             else
             {
               return yScale(75);
             }
           })
           .attr("height", 20)
           .attr("width", function(d)
           {
               return xScale(d*100);
           })
           .attr("fill", function(d,i)
           {
             if(i == 0)
             {
               return "pink";
             }
             else
             {
               return "lightblue";
             }
           })

   bars.append("text")
          .attr("class", "label")
          .attr("y", function (d, i)
          {
            if(i == 0)
            {
              return yScale(75+15);
            }
            else
            {
              return yScale(25+15);
            }
          })
          .attr("x", function (d)
          {
            if(d == 0)
            {
              return margins.left+3;
            }
            else if (isNaN(d))
            {
              return margins.left+3;
            }
              return xScale(d*100)+margins.left+3;
          })
          .text(function (d)
          {
            if (isNaN(d))
            {
              return "0%";
            }
              return Math.round(d*100)+"%";
          });



}

var makeEventGraph = function(data, svg)
{
  var margins =
    {
      top: 10,
      bottom: 10,
      left: 70,
      right: 0
    }


  var width = 230;
  var height = 250;
  var svg = svg.attr("width", width+margins.left+margins.right)
                .attr("height", height+margins.top+margins.bottom)


  var xScale = d3.scaleLinear()
                .domain([0,45])
                .range([0,width-margins.left-margins.right])

  var num800 = 0;
    if (data.runData.years[YEAR_INDEX].events)
    {
      num800 = data.runData.years[YEAR_INDEX].events[0].totalAthletesInEvent;
    }
    console.log("num800", num800)

var num1500 = 0;
  if (data.runData.years[YEAR_INDEX].events)
  {
    num1500 = data.runData.years[YEAR_INDEX].events[1].totalAthletesInEvent;
  }
  console.log("num1500", num1500)

  var num3k = 0;
    if (data.runData.years[YEAR_INDEX].events)
    {
      num3k = data.runData.years[YEAR_INDEX].events[2].totalAthletesInEvent;
    }
    console.log("num3k", num3k)

  var num5k = 0;
    if (data.runData.years[YEAR_INDEX].events)
    {
      num5k = data.runData.years[YEAR_INDEX].events[3].totalAthletesInEvent;
    }
    console.log("num5k", num5k)

  var num10k = 0;
    if (data.runData.years[YEAR_INDEX].events)
    {
      num10k = data.runData.years[YEAR_INDEX].events[4].totalAthletesInEvent;
    }
    console.log("num10k", num10k)

  var numMar = 0;
    if (data.runData.years[YEAR_INDEX].events)
    {
      numMar = data.runData.years[YEAR_INDEX].events[5].totalAthletesInEvent;
    }
    console.log("numMar", numMar)

  var tots = [num800, num1500, num3k, num5k, num10k, numMar];


  var yScale = d3.scaleLinear()
          .domain([0, 100])
          .range([0, 250-margins.bottom])


  var xAxis  = d3.axisBottom(xScale)
                  .tickValues([0,15,30,45])
                  .tickFormat(function(n) { return n;})


  var yAxis  = d3.axisLeft(yScale)
                  .tickValues([10,25,40,55,70,85])
                  .tickFormat(function(n)
                  {
                    if(n == 10){return "800m";}
                    else if(n==25){return "1500m";}
                    else if(n==40){return "3k Steeplechase";}
                    else if(n==55){return "5k";}
                    else if(n==70){return "10k";}
                    else{return "Marathon";}

                  })


  svg.append("g")
         .classed(xAxis,true)
         .call(xAxis)
         .attr("transform","translate("+margins.left+","
         +(margins.top+height-margins.top-margins.bottom)+")"
      );


   svg.append("g")
     .classed(yAxis,true)
     .call(yAxis)
     .attr("transform","translate("+(margins.left)+","
     + 5 +")");

     var bars = svg.selectAll(".bar")
                 .data(tots)
                 .enter()
                 .append("g")

var colorScale = d3.scaleOrdinal(d3.schemeCategory10);


     bars.append("rect")
           .attr("class", "bar")
           .attr("x", 0+margins.left+1)
           .attr("y", function(d,i)
           {
             return yScale((i*15)+8);
           })
           .attr("height", 20)
           .attr("width", function(d)
           {
               return xScale(d);
           })
           .attr("fill", function(d,i)
           {
              return colorScale(i);
           })

   bars.append("text")
          .attr("class", "label")
          .attr("y", function (d, i)
          {
              return yScale((i*15)+15);

          })
          .attr("x", function (d)
          {
            if(d == 0)
            {
              return margins.left+3;
            }
            else if (isNaN(d))
            {
              return margins.left+3;
            }
              return xScale(d)+margins.left+3;
          })
          .text(function (d)
          {
            if (isNaN(d))
            {
              return "0";
            }
              return d+"";
          });



}

var getInfo = function(data)
{
  var string = "";
  var curr = data.runData.years[YEAR_INDEX];

  string = string+"Country: "+data.countryName+"\n";
  string = string+"Year: "+(YEAR_INDEX+2014)+"\n";
  if(curr.gdp == 0)
  {
    string = string+"\tGDP per Capita: N/A\n";
  }
  else
  {
    string = string+"\tGDP per Capita: "+Math.round(curr.gdp)+"\n";

  }
  string = string+"\tTotal Athletes: "+curr.totalAthletesInCountry+"\n";

  curr.events.forEach(function(d)
  {
    string = string +"\nEvent "+d.event+":\n";
    string = string +"\tFemales: \n";
    d.gender.female.forEach(function(d)
    {
      string = string +"\t\t"+d.name+": "+d.time+"\n";
    })
    string = string +"\tMales: \n";
    d.gender.male.forEach(function(d)
    {
      string = string +"\t\t"+d.name+": "+d.time+"\n";
    })
  })

  return string;
}


var makeMap = function(geoData, gdpData)
{
  var w = 900;
  var h = 600;

  var zoom = d3
     .zoom()
     .on("zoom", zoomed)
     //.passive = true;

  var svg = d3.select("body").append("svg")
                             .attr("id", "svg1")
                             .attr("width", w)
                             .attr("height", h)
                             .attr("fill", "rgb(23, 25, 32)")
                             .call(zoom)

  var projection = d3
   .geoEquirectangular()
   .center([0, 15])
   .scale([w/(2*Math.PI)])
   .translate([w/2,h/2])

   var path = d3
      .geoPath()
      .projection(projection)

  var countriesGroup = svg.append("g")
                      .attr("id", "map")

  countriesGroup.append("rect")
               .attr("x", 0)
               .attr("y", 0)
               .attr("width", w)
               .attr("height", h)

function initiateZoom()
               {
                  // Define a "min zoom"
                  minZoom = Math.max(w/w,h/h);
                  // Define a "max zoom"
                  maxZoom = 20*minZoom;
                  //apply these limits of
                  zoom
                     .scaleExtent([minZoom, maxZoom]) // set min/max extent of zoom
                     .translateExtent([[0, 0], [w, h]]) // set extent of panning
                  ;
                  // define X and Y offset for centre of map
                  midX = ($("#map-holder").width() - (minZoom*w))/2;
                  midY = ($("#map-holder").height() - (minZoom*h))/2;
                 // change zoom transform to min zoom and centre offsets
                  svg.call(zoom.transform,d3.zoomIdentity.translate(midX, midY).scale(minZoom));

                  // on window resize
               $(window).resize(function() {
                  // Resize SVG
                  svg
                     .attr("width", $("#map-holder").width())
                     .attr("height", $("#map-holder").height())
                     //.attr("fill", "lightskyblue")
                  ;
                  initiateZoom();
               });
               }

               // zoom to show a bounding box, with optional additional padding as percentage of box size
           function boxZoom(box, centroid, paddingPerc)
           {
             minZoom = Math.max(w/w,h/h);
             maxZoom = 20*minZoom;
             minXY = box[0];
             maxXY = box[1];
             // find size of map area defined
             zoomWidth = Math.abs(minXY[0] - maxXY[0]);
             zoomHeight = Math.abs(minXY[1] - maxXY[1]);
             // find midpoint of map area defined
             zoomMidX = centroid[0];
             zoomMidY = centroid[1];
             // increase map area to include padding
             zoomWidth = zoomWidth * (1 + paddingPerc / 100);
             zoomHeight = zoomHeight * (1 + paddingPerc / 100);
             // find scale required for area to fill svg
             maxXscale = w / zoomWidth;
             maxYscale = h/ zoomHeight;
             zoomScale = Math.min(maxXscale, maxYscale);
             // handle some edge cases
             // limit to max zoom (handles tiny countries)
             zoomScale = Math.min(zoomScale, maxZoom);
             // limit to min zoom (handles large countries and countries that span the date line)
             zoomScale = Math.max(zoomScale, minZoom);
             // Find screen pixel equivalent once scaled
             offsetX = zoomScale * zoomMidX;
             offsetY = zoomScale * zoomMidY;
             // Find offset to centre, making sure no gap at left or top of holder
             dleft = Math.min(0, w/ 2 - offsetX);
             dtop = Math.min(0, h / 2 - offsetY);
             // Make sure no gap at bottom or right of holder
             dleft = Math.max(w - w * zoomScale, dleft);
             dtop = Math.max(h - h * zoomScale, dtop);
             // set zoom
             svg
               .transition()
               .duration(500)
               .call(
                 zoom.transform,
                 d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
               );
           }

var count = 1;

   countries = countriesGroup.selectAll("path")
                              .data(geoData.features)
                              .enter()
                              .append("path")
                              .attr("d", path)
                              .attr("id", function(d, i)
                              {
                                 return "country" + [d.id];
                              })
                              .attr("class", "country")
                              .attr("fill", /*"rgb(48, 52, 67)"*/ function(d)
                            {
                                var color =  getColor(d.runData.years[YEAR_INDEX].gdp)
                                return color;
                            })
                              .attr("stroke", "Black")
                              .attr("stroke-width", .1)
                              // add a mouseover action to show name label for feature/country
                              .on("mouseover", function(d, i)
                              {


                                d3.select(".tooltip").transition()
                                   .duration(200)
                                   .style("opacity", 1);

                                   if(d.runData.years[YEAR_INDEX].events != null)
                                   {
                                     var totAth = d.runData.years[YEAR_INDEX].totalAthletesInCountry;
                                   }
                                   else
                                   {
                                     var totAth = 0;
                                   }


                                   if(d.runData.years[YEAR_INDEX].gdp == 0)
                                   {
                                     var gdpS = "N/A";
                                   }
                                   else
                                   {
                                     var gdpS= Math.round(d.runData.years[YEAR_INDEX].gdp);

                                   }
                              d3.select(".tooltip").html(d.countryName + "<br/></br>"  + "GDP per Capita: "+ gdpS + "<br/>"  +"Total Athletes: "+totAth+"<br/>"+"<svg id='smallsvg1'></svg>"+"<svg id='smallsvg2'></svg>")
                                   .style("left", "0px")//(d3.event.pageX) + "px")
                                   .style("top", "100px")//(d3.event.pageY - 28) + "px");

                                   makeGraphs(d);
                                //console.log(d.properties.id)

                              })
                              .on("mouseout", function(d, i)
                              {
                                d3.select(".tooltip").transition()
                                   .duration(500)
                                   .style("opacity", 0);

                                 d3.select("#countryLabel" + [d.id])
                                 .style("display", "none");
                              })
                              // add an onclick action to zoom into clicked country
                              .on("click", function(d, i)
                              {
                                 d3.selectAll(".country").classed("country-on", false);
                                 d3.select(this).classed("country-on", true);
                                 boxZoom(path.bounds(d), path.centroid(d), 20);
                              })

  countryLabels = countriesGroup.selectAll("g")
                                 .data(geoData.features)
                                 .enter()
                                 .append("g")
                                 .attr("class", "countryLabel")
                                 .attr("id", function(d)
                                 {
                                    return "countryLabel" + [d.id];
                                 })
                                 .attr("transform", function(d)
                                 {
                                    d.properties.spotData = {xLoc: path.centroid(d)[0], yLoc: path.centroid(d)[1]};
                                    return ("translate(" + path.centroid(d)[0] + "," + (path.centroid(d)[1]+20) + ")");
                                 })
                                 .on("mouseover", function(d, i)
                                 {


                                   d3.select(".tooltip").transition()
                                      .duration(200)
                                      .style("opacity", 1);

                                      if(d.runData.years[YEAR_INDEX].events != null)
                                      {
                                        var totAth = d.runData.years[YEAR_INDEX].totalAthletesInCountry;
                                      }
                                      else
                                      {
                                        var totAth = 0;
                                      }

                                      if(d.runData.years[YEAR_INDEX].gdp == 0)
                                      {
                                        var gdpS = "N/A";
                                      }
                                      else
                                      {
                                        var gdpS= Math.round(d.runData.years[YEAR_INDEX].gdp);

                                      }
                                 d3.select(".tooltip").html(d.countryName + "<br/></br>"  + "GDP per Capita: "+ gdpS + "<br/>"  +"Total Athletes: "+totAth+"<br/>"+"<svg id='smallsvg1'></svg>"+"<svg id='smallsvg2'></svg>")
                                      .style("left", "0px")//(d3.event.pageX) + "px")
                                      .style("top", "100px")//(d3.event.pageY - 28) + "px");

                                      makeGraphs(d);
                                   //console.log(d.properties.id)

                                 })
                                 .on("mouseout", function(d, i)
                                 {
                                   d3.select(".tooltip").transition()
                                      .duration(500)
                                      .style("opacity", 0);

                                    d3.select("#countryLabel" + [d.id])
                                    .style("display", "none");
                                 })
                                 .on("click", function(d, i)
                                 {
                                    d3.selectAll(".country")
                                      .classed("country-on", false);
                                    d3.select("#country" + [d.id])
                                      .classed("country-on", true);
                                    boxZoom(path.bounds(d), path.centroid(d), 20);
                                 })

   function zoomed()
   {
      t = d3
         .event
         .transform
      ;
      countriesGroup.attr(
         "transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")"
      );

   }

function getTextBox(selection)
   {
     selection.each(function(d)
     {
       d.bbox = this.getBBox();
     });
   }
      // add the text to the label group showing country name
      countryLabels.append("text")
                   .attr("class", "countryName")
                   .attr("id", function(d)
                   {
                      return [d.id]+"text";
                   })
                   .style("text-anchor", "middle")
                   .attr("dx", 0)
                   .attr("dy", 0)
                   .attr("fill", "transparent")
                   .attr("font-size", 7)
                   .text(function(d)
                   {
                      return [d.countryName];
                   })
                   .call(getTextBox)

      // add a background rectangle the same size as the text
      countryLabels.insert("rect", "text")
                   .attr("class", "countryBg")
                   .attr("fill", "transparent")
                   .attr("transform", function(d)
                   {
                    return "translate(" + (d.bbox.x - 2) + "," + d.bbox.y + ")";
                   })
                   .attr("width", function(d)
                   {
                      return d.bbox.width + 4;
                   })
                   .attr("height", function(d)
                   {
                     return d.bbox.height;
                  })

}

var getColor = function(c)
{
  //# d3.interpolatePuBu(t) <>
  //# d3.schemePuBu[k]
  //var colorThing = d3.scaleSequential(d3.interpolateRdBu);


 var colorThing = d3.scaleThreshold()
      .domain([200, 2000, 5000, 20000, 80000])
      .range(d3.schemePurples[6])

/*  var colorThing = d3.scaleLinear().domain([1,length])
                    //.interpolate(d3.interpolateHcl)
                    .range([d3.rgb("rgb(102, 103, 119)"), d3.rgb("rgb(57, 60, 119)")]);*/


  /*var logScale = d3.scaleLinear()
                    .domain([0,80000])
                    .range([0,1]);*/


    //  console.log("color", colorThing(linearScale(c)));
  var returnColor = colorThing(c);
  return returnColor;
}



var putRunDataInMapData = function(runData, geoData, gdpData)
{
  //runData.forEach(function(d,i)
  //{

    var years = []
    var countries = []
    var events = []


    runData.forEach(function(d)
    {
      if(!years.includes(d.year))
      {
        years.push(d.year);
      }
      if (!countries.includes(d.country))
      {
        countries.push(d.country);
      }
      if (!events.includes(d.event))
      {
        events.push(d.event);
      }
    })



    years.reverse()

    geoData.features.forEach(function(d)
    {
      var currCountry = d.properties.ADMIN;
      d.id = currCountry.split(" ").join("_");
      d.countryName = currCountry;


      if (countries.includes(currCountry))
      {
        var newData = {years: []}
        //console.log("countries", countries)
        //console.log("currCountry", countries[currCountry])

          //newData.countries[currCountry].local.X = runData



        for (var currYear = 0; currYear<years.length; currYear++)
        {
            var newYObj = {year: years[currYear], events: []}
            newData.years.push(newYObj);

            for (var currEvent = 0; currEvent<events.length; currEvent++)
            {
              var newEObj = {event: events[currEvent], gender: {male: [], female: []}};
              newData.years[currYear].events.push(newEObj);

              for (var i = 0; i<runData.length; i++)
              {

                if (runData[i].year == years[currYear] && runData[i].country == currCountry && runData[i].event == events[currEvent])
                {
                  var athlete = {name: runData[i].name.split(" (")[0], time: runData[i].time, data: runData[i]}
                  if (runData[i].gender == "female")
                  {
                      newData.years[currYear].events[currEvent].gender.female.push(athlete);
                  }
                  else
                  {
                    newData.years[currYear].events[currEvent].gender.male.push(athlete);
                  }
                }

              }



              var totalMale = newData.years[currYear].events[currEvent].gender.male.length
              var totalFemale = newData.years[currYear].events[currEvent].gender.female.length
              var totalAthletes = totalMale + totalFemale;

              newData.years[currYear].events[currEvent].totalMale = totalMale;
              newData.years[currYear].events[currEvent].totalFemale = totalFemale;
              newData.years[currYear].events[currEvent].totalAthletesInEvent = totalAthletes;

            }


            var listEvents = []
            var totalAthletesInCountry = 0;
            newData.years[currYear].events.forEach(function(d)
            {
              if(d.gender.male.length > 0 || d.gender.female.length > 0)
              {
                listEvents.push(d.event)
              }
              totalAthletesInCountry = totalAthletesInCountry + d.totalAthletesInEvent

            })
            newData.years[currYear].totalAthletesInCountry = totalAthletesInCountry;
            newData.years[currYear].activeEvents = listEvents;


        }

        d.runData = newData;
      }
      else
      {
        d.runData = {years: [{year: 2014, events: null}, {year: 2015, events: null}, {year: 2016, events: null}, {year: 2017, events: null}, {year: 2018, events: null}]};
      }

      for (var cY = 0; cY < years.length; cY++)
      {
        //if (d.properties.ADMIN == "Aruba"){console.log("Hello Aruba"); console.log("aruba data", gdpData);}
        //console.log("gdpData before", gdpData);
         var currGDP = getGDP(d.properties.ADMIN, years[cY], gdpData);
         //console.log("returned GDP", currGDP)
         d.runData.years[cY].gdp = currGDP;
         //console.log("gdp after", d.runData.years[cY].gdp)

      }

    })


}

var getGDP = function(cName, year, gdpData)
{
  //console.log("country", cName)
//  console.log("gdpData", gdpData)
  /*if(cName == "Aruba" || cName == "Afghanistan" || cName == "Angola", "")
  {
    return 0;
  }*/
  //console.log("year", year)


  var sendGDP = 0;

  gdpData.forEach(function(d)
  {


    if (d.Country == cName)
    {
      //console.log("year here", year)
      if (year == "2014")
      {
        //if (typeof(d.d2014) == 'undefined') {console.log("its undefined here      -------------------")}
        //console.log("curr gdp", d.d2014)
        sendGDP = d.d2014;
      }
      else if (year == "2015")
      {
        //console.log("curr gdp", d.d2015)
        sendGDP = d.d2015;
      }
      else if (year == "2016")
      {
        //console.log("curr gdp", d.d2016)
        sendGDP = d.d2016;
      }
      else if (year == "2017")
      {
        //console.log("curr gdp", d.d2017)
        sendGDP = d.d2017;
      }
      else if (year == "2018")
      {
        //console.log("curr gdp", d.d2018)
        sendGDP = d.d2018;
      }

    }
  })

  return sendGDP;
}
