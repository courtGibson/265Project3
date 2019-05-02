var dataP = d3.json("distanceDataJson.json")
var mapP = d3.json("countries.geojson")
var gdpDataP = d3.json("csvjson.json")


Promise.all([dataP, mapP, gdpDataP]).then(function(values)
{
  var runData = values[0]
  var geoData = values[1]
  var gdpData = values[2]
  //var keyedData = values[2]


  putRunDataInMapData(runData, geoData, gdpData);

  //console.log("all done")
  console.log("data", runData);
  console.log("map", geoData);

  var map = makeMap(geoData);

  //var formatted = format(runData);

  drawCircles(formatted);


  //window.alert("Map Navigation:\n- Click and drag to move\n- Two finger scroll to zoom in/out\n- Click country to zoom to country")
},
  function(err)
{
  console.log(err);
});


var drawCircles = function(data)
{
  var svg = d3.select("svg")
// group year
//   ^group event
//     ^group female
//     ^group male

  data.years.forEach(function(d)
  {
    var currYearGroup = svg.select("#map").append("g")
                          .attr("id", "group"+d.year.toString());



    d.countries.forEach(function(currC)
    {

      // make circle for each country for current year
      // (id, year data, svg, total number athletes in country)
      //console.log("select1", svg.select("#group"+d.year.toString()))
      makeCirc("#group"+d.year.toString(), d, svg, currC.totalAthletesInCountry);

      currC.events.forEach(function(currE)
      {
        if(currC.activeEvents.includes(currE.event))
        {

          var currEventGroup = svg.select("#"+"group"+d.year.toString())
                                  .append("g")
                                  .attr("id", "group"+d.year.toString()+currC.country.toString().split(" ").join("_")+currE.event.toString());
          //add circle for # people in that event to this group

          var currMaleGroup = svg.select("#"+"group"+d.year.toString()+currC.country.toString().split(" ").join("_")+currE.event.toString())
                                  .append("g")
                                  .attr("id", "Malegroup"+d.year.toString()+currC.country.toString().split(" ").join("_")+currE.event.toString());
          var currMaleGroup = svg.select("#"+"group"+d.year.toString()+currC.country.toString().split(" ").join("_")+currE.event.toString())
                                .append("g")
                                .attr("id", "Femalegroup"+d.year.toString()+currC.country.toString().split(" ").join("_")+currE.event.toString());
      }
      })
    })


  })

  //console.log("all done");


}

var makeCirc = function(id, data, svg, size, loc)
{

  //console.log("select", d3.select("body"))

     //.select(id)
     d3.select(id).selectAll("circle")
        .data(data.countries)
        .enter()
        .append("circle")
        .attr("transform", function(d)
        {
          //var dataLoc = d.data;


          // spent over 8 hours trying to fix this problem. . .
          // decided to hard code out of frustration
          // console.logs showed it should not have been a problem.
          // For some reason it works for some countries and not others.
          if(d.country == "Burkina Faso")
          {
            var xL="693.1729479724455";
            var yL="310.6184014665162";

            d.spotData = {xLoc: xL, yLoc: yL};
            /*console.log("B_F spotData to make circle", d.spotData);*/
          }
          else if (d.country == "Luxembourg")
          {
            d.spotData = {xLoc: 723.6124154266108, yLoc: 164.79568337146478};
          }
          else if (d.country == "Slovenia")
          {
            d.spotData = {xLoc: 757.587015633938, yLoc: 178.99290138204546};
          }
          else if (d.country == "Israel")
          {
            d.spotData = {xLoc: 836.0956877282948, yLoc: 236.05126729381396};
          }
          else if (d.country == "Hungary")
          {
            d.spotData = {xLoc: 775.4318415950419, yLoc: 174.9207189965249};
          }
          else if (d.country == "South Africa")
          {
            d.spotData = {xLoc: 797.5619728036181, yLoc: 471.1151251376089};
          }
          else if (d.country == "Romania")
          {
            d.spotData = {xLoc: 797.1169962301684, yLoc: 180.01430630343904};
          }
          else if (d.country == "Kiribati")
          {
            d.spotData = {xLoc: 499.6256455872072, yLoc: 355.9408855124802};
          }
          else if (d.country == "Rwanda")
          {
            d.spotData = {xLoc: 816.3519027367568, yLoc: 366.08291871813367};
          }
          else if (d.country == "Iceland")
          {
            d.spotData = {xLoc: 627.6804880584277, yLoc: 105.56210514259887};
          }
          else if (d.country == "United Republic of Tanzania")
          {
            d.spotData = {xLoc: 835.3861694132053, yLoc: 382.73649020426814};
          }
          else if (d.country == "Greece")
          {
            d.spotData = {xLoc: 789.3465183191397, yLoc: 206.4676287960682};
          }
          else if (d.country == "Burundi")
          {
            d.spotData = {xLoc: 816.1808771436675, yLoc: 371.3899874187575};
          }
          else if (d.country == "Republic of Serbia")
          {
            d.spotData = {xLoc: 780.851565262343, yLoc: 186.36131607717792};
          }
          else if (d.country == "Austria")
          {
            d.spotData = {xLoc: 754.952616708411, yLoc: 173.27800085555168};
          }
          else if (d.country == "Peru")
          {
            d.spotData = {xLoc: 410.7519711138336, yLoc: 393.9337329898923};
          }
          else if (d.country == "Iran")
          {
            d.spotData = {xLoc: 911.0770148885363, yLoc: 231.66958514263897};
          }
          else if (d.country == "Bosnia and Herzegovina")
          {
            d.spotData = {xLoc: 769.1188089909155, yLoc: 186.55436745241033};
          }
          else if (d.country == "Ghana")
          {
            d.spotData = {xLoc: 695.269074112958, yLoc: 327.40128702030387};
          }
          else if (d.country == "Egypt")
          {
            d.spotData = {xLoc: 816.126922759685, yLoc: 255.30531264746853};
          }
          else if (d.country == "Benin")
          {
            d.spotData = {xLoc: 709.0562140102215, yLoc: 320.83971256304835};
          }
          else if (d.country == "Ireland")
          {
            d.spotData = {xLoc: 668.3248264871987, yLoc: 151.52913903356736};
          }
          else if (d.country == "Denmark")
          {
            d.spotData = {xLoc: 739.0887380624838, yLoc: 140.69019852710227};
          }
          else if (d.country == "China")
          {
            d.spotData = {xLoc: 1103.7894456730664, yLoc: 216.15510773743645};
          }
          else if (d.country == "Finland")
          {
            d.spotData = {xLoc: 802.1642030718106, yLoc: 107.51804861523622};
          }
          else if (d.country == "Kazakhstan")
          {
            d.spotData = {xLoc: 961.7065292653507, yLoc: 171.04190959031033};
          }
          else if (d.country == "Uzbekistan")
          {
            d.spotData = {xLoc: 945.5440901289833, yLoc: 195.94874920459029};
          }
          else if (d.country == "Brazil")
          {
            d.spotData = {xLoc: 493.52923525738106, yLoc: 400.25889544574005};
          }

          //
          else
          {
            //console.log("current country", d.country)
          }
          console.log("current country", d.country)
          var spotX = d.spotData.xLoc;
          var spotY = d.spotData.yLoc;
          //var location = d.locale.split("d").join(dataLoc);
         //console.log("in spot x", spotX)
         //console.log("in spot Y", spotY)
           return ("translate(" + Number(spotX)+ "," + Number(spotY) + ")");
        })
        .attr("r", function(d)
      {
        return Math.sqrt(d.totalAthletesInCountry/3.1415)+3;
      })
        .style("opacity", .5)
        .style("stroke", "white")
        .style("stroke-width", function(d)
      {
        return (Math.sqrt(d.totalAthletesInCountry/3.1415)+3)*0.05;
      })
        .attr("fill", "orange")

}

var makeMap = function(geoData, gdpData)
{
  var w = 1400;
  var h = 600;

  var zoom = d3
     .zoom()
     .on("zoom", zoomed)
     //.passive = true;

  var svg = d3.select("body").append("svg")
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


   countries = countriesGroup.selectAll("path")
                              .data(geoData.features)
                              .enter()
                              .append("path")
                              .attr("d", path)
                              .attr("id", function(d, i)
                              {
                                 return "country" + [d.properties.id];
                              })
                              .attr("class", "country")
                              .attr("fill", /*"rgb(48, 52, 67)"*/ function(d)
                            {
                                var gdp = getGDP(d.properties.ADMIN, gdpData);
                            })
                              .attr("stroke", "Black")
                              .attr("stroke-width", .1)
                              // add a mouseover action to show name label for feature/country
                              .on("mouseover", function(d, i)
                              {

                                var e = d3.select("#"+[d.properties.id]+"text");
                                //console.log("e", e)
                               e.attr("fill", "GreenYellow");
                                 d3.select("#countryLabel" + [d.properties.id])
                                    .style("display", "block");
                                //console.log(d.properties.id)

                              })
                              .on("mouseout", function(d, i)
                              {
                                var e = d3.select("#"+[d.properties.id]+"text");
                                //console.log("e", e)
                               e.attr("fill", "transparent");
                                 d3.select("#countryLabel" + [d.properties.id])
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
                                    return "countryLabel" + [d.properties.id];
                                 })
                                 .attr("transform", function(d)
                                 {
                                   //console.log("data", d)
                                   //console.log("spot", ("translate(" + path.centroid(d)[0] + "," + path
                                    //                         .centroid(d)[1] + ")"))
                                   //d.properties.data = d;

                                   d.properties.spot = {xLoc: (path.centroid(d)[0])/*.toString()*/, yLoc:  (path.centroid(d)[1])/*.toString()*/}

                                   if (d.properties.ADMIN == "Burkina Faso")
                                   {
                                     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                                     console.log("original spot grab B_F", d.properties.spot)
                                   }
                                   //d.properties.X = path.centroid(d)[0];
                                   //console.log(d.properties.spot)
                                   //d.properties.Y = path.centroid(d)[1];
                                   //d.properties.loc = ("translate(" + path.centroid(d)[0] + "," + path
                                    //                         .centroid(d)[1] + ")");

                                    return ("translate(" + path.centroid(d)[0] + "," + (path.centroid(d)[1]+20) + ")");
                                 })
                                 // add mouseover functionality to the label
                                 .on("mouseover", function(d, i)
                                 {
                                   //d3.select(this).attr("fill","black");
                                   //console.log(d.properties.ADMIN+"text")
                                   var e = d3.select("#"+[d.properties.id]+"text");
                                   //console.log("e", e)
                                  e.attr("fill", "GreenYellow");
                                    //d3.select(this).attr("font-size", 7);
                                    d3.select(this).style("display", "block")


                                 })
                                 .on("mouseout", function(d, i)
                                 {
                                   var e = d3.select("#"+[d.properties.id]+"text");
                                   //console.log("e", e)
                                  e.attr("fill", "transparent");
                                     d3.select(this).style("display", "none")

                                 })
                                 // add an onlcick action to zoom into clicked country
                                 .on("click", function(d, i)
                                 {
                                    d3.selectAll(".country")
                                      .classed("country-on", false);
                                    d3.select("#country" + [d.properties.id])
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
                      return [d.properties.id]+"text";
                   })
                   .style("text-anchor", "middle")
                   .attr("dx", 0)
                   .attr("dy", 0)
                   .attr("fill", "transparent")
                   .attr("font-size", 7)
                   .text(function(d)
                   {
                      return [d.properties.ADMIN];
                   })
                   .call(getTextBox)

      // add a background rectangle the same size as the text
      countryLabels.insert("rect", "text")
                   .attr("class", "countryBg")
                   .attr("fill", "none")
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



var getGDP = function(countryName, gdpData)
{
  gdpData.forEach(function(d)
{
  if (countryName == d.Country)
  {

  }
})
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
      if (countries.includes(currCountry))
      {
        var newData = {years: []}
        //console.log("countries", countries)
        //console.log("currCountry", countries[currCountry])

          //newData.countries[currCountry].local.X = runData
          newData.id = currCountry.split(" ").join("_");
          newData.countryName = currCountry;


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
        d.id = d.properties.ADMIN.split(" ").join("_");
        d.countryName = d.properties.ADMIN;
      }

      for (var cY = 0; cY < years.length; cY++)
      {
        if (d.properties.ADMIN == "Aruba"){console.log("Hello Aruba"); console.log("aruba data", gdpData);}
         d.runData.years[cY].gdp = getGDP(d.properties.ADMIN, years[cY], gdpData);

      }

    })


}

var getGDP = function(cName, year, data)
{
  console.log("gdp", data)
  console.log("country", cName)

  data.forEach(function(d)
  {
    if (d.Country == cName)
    {
      if (year == "2014")
      {
        return d.d2014;
      }
      else if (year == "2015")
      {
        return d.d2015;
      }
      else if (year == "2016")
      {
        return d.d2016;
      }
      else if (year == "2017")
      {
        return d.d2017;
      }
      else if (year == "2018")
      {
        return d.d2018;
      }

    }
  })
}
