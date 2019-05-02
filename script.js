var dataP = d3.json("distanceDataJson.json")
var mapP = d3.json("countries.geojson")
//var keyedDataP = d3.json("newJson.json")


Promise.all([dataP, mapP/*, keyedDataP*/]).then(function(values)
{
  var runData = values[0]
  var geoData = values[1]
  //var keyedData = values[2]


  putMapDataInRunData(runData, geoData);

  //console.log("all done")
  console.log("data", runData);
  console.log("map", geoData);

  var map = makeMap(geoData);

  var formatted = format(runData);

  drawCircles(formatted);


  //window.alert("Map Navigation:\n- Click and drag to move\n- Two finger scroll to zoom in/out\n- Click country to zoom to country")
},
  function(err)
{
  console.log(err);
});

var format = function(runData)
{

//console.log("newData", newData)
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
  var newData = {years: []}

  for (var currYear = 0; currYear<years.length; currYear++)
  {
    var newYObj = {year: years[currYear], countries: []}
    newData.years.push(newYObj);

    for (var currCountry = 0; currCountry<countries.length; currCountry++)
    {
        //newData.countries[currCountry].local.X = runData
        var newCObj = {country: countries[currCountry], id : countries[currCountry].split(" ").join("_"), events: []}
        newData.years[currYear].countries.push(newCObj);

        for (var currEvent = 0; currEvent<events.length; currEvent++)
        {
          var newEObj = {event: events[currEvent], gender: {male: [], female: []}};
          newData.years[currYear].countries[currCountry].events.push(newEObj);

          for (var i = 0; i<runData.length; i++)
          {
            if (runData[i].year == years[currYear] && runData[i].country == countries[currCountry] && runData[i].event == events[currEvent])
            {
              var athlete = {name: runData[i].name.split(" (")[0], time: runData[i].time, data: runData[i]}
              if (runData[i].gender == "female")
              {
                  newData.years[currYear].countries[currCountry].events[currEvent].gender.female.push(athlete);
              }
              else
              {
                newData.years[currYear].countries[currCountry].events[currEvent].gender.male.push(athlete);
              }
            }

            //var location = {x: runData[i].mapInfo.bbox.x, y: runData[i].mapInfo.bbox.y};
            //newData.years[currYear].countries[currCountry].location = location;
            newData.years[currYear].countries[currCountry].locale = runData[i].mapInfo.properties.loc;
            newData.years[currYear].countries[currCountry].locData = runData[i].mapInfo.properties.data;
            newData.years[currYear].countries[currCountry].spotData = runData[i].mapInfo.properties.spot;
            //console.log("data in format", newData.years[currYear].countries[currCountry].spotData)
            //console.log("data in map", runData[i].mapInfo.properties.spot)
          }



          var totalMale = newData.years[currYear].countries[currCountry].events[currEvent].gender.male.length
          var totalFemale = newData.years[currYear].countries[currCountry].events[currEvent].gender.female.length
          var totalAthletes = totalMale + totalFemale;

          newData.years[currYear].countries[currCountry].events[currEvent].totalMale = totalMale;
          newData.years[currYear].countries[currCountry].events[currEvent].totalFemale = totalFemale;
          newData.years[currYear].countries[currCountry].events[currEvent].totalAthletesInEvent = totalAthletes;

        }


        var listEvents = []
        var totalAthletesInCountry = 0;
        newData.years[currYear].countries[currCountry].events.forEach(function(d)
        {
          if(d.gender.male.length > 0 || d.gender.female.length > 0)
          {
            listEvents.push(d.event)
          }
          totalAthletesInCountry = totalAthletesInCountry + d.totalAthletesInEvent

        })
        newData.years[currYear].countries[currCountry].totalAthletesInCountry = totalAthletesInCountry;
        newData.years[currYear].countries[currCountry].activeEvents = listEvents;

    }





  }

  console.log("newData", newData)
  return newData;

}

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
          var dataLoc = d.data;
          var spotX = d.spotData.x;
          var spotY = d.spotData.y;
          //var location = d.locale.split("d").join(dataLoc);
        //  console.log("location", location)
           return ("translate(" + spotX+ "," + spotY + ")");
        })
        .attr("r", 100)
        .style("stroke", "white")
        .style("stroke-width", 3)
        .attr("fill", "salmon")

}

var makeMap = function(geoData)
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
                              .attr("fill", "rgb(48, 52, 67)")
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
                                   d.properties.data = d;
                                   d.properties.spot = {x: (path.centroid(d)[0]).toString(), y:  (path.centroid(d)[1]).toString()}
                                   //d.properties.X = path.centroid(d)[0];
                                   //d.properties.Y = path.centroid(d)[1];
                                   d.properties.loc = ("translate(" + path.centroid(d)[0] + "," + path
                                                             .centroid(d)[1] + ")");

                                    return ("translate(" + path.centroid(d)[0] + "," + path
                                                              .centroid(d)[1] + ")");
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







var putMapDataInRunData = function(runData, geoData)
{
  runData.forEach(function(d,i)
  {
    var countryFound = false;
    var count = 0;
    var currSpot;
    var country;

    //console.log("len", geoData.features.length)

    while (countryFound == false)
    {
      if (count==geoData.features.length)
      {
        console.log("map whoops");
        console.log("data name: ", d.country)
      }
      //console.log("currSpot", geoData.features[count])
      currSpot = geoData.features[count];
      currCountry = currSpot.properties.ADMIN;
      //console.log("name: ", currCountry)

      if (d.country == currCountry)
      {
        countryFound = true;
        d.mapInfo = currSpot;
        currSpot.properties.id = d.country.split(" ").join("_")
        //d.country.local = currSpot.properties.loc;
        //console.log("ADMIN= ", currCountry, "     id= ", currSpot.properties.id)

      }
      else
      {
        count++;
      }
    }

  })

  geoData.features.forEach(function(d)
{
  d.properties.id = d.properties.ADMIN.split(" ").join("_");
})

}
