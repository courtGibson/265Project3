var dataP = d3.json("distanceDataJson.json")
var mapP = d3.json("countries.geojson")
var gdpDataP = d3.json("csvjson.json")

var YEAR_INDEX = 0;

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

  var map = makeMap(geoData);

  //var formatted = format(runData);

  drawCircles(geoData);

  makeButtons(geoData)


  //window.alert("Map Navigation:\n- Click and drag to move\n- Two finger scroll to zoom in/out\n- Click country to zoom to country")
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
    .text(function(d){ return d.year;})
    .on("click", function(d)
    {
      if(d.year == "2014")
      {
        //console.log("inside 2014")
        YEAR_INDEX = 0;
      }
      else if (d.year == "2015")
      {
        //console.log("inside 2015")
        YEAR_INDEX = 1;
      }
      else if (d.year == "2016")
      {
        //console.log("inside 2016")
        YEAR_INDEX = 2;
      }
      else if (d.year == "2017")
      {
        //console.log("inside 2017")
        YEAR_INDEX = 3;
      }
      else if (d.year== "2018")
      {
        //console.log("inside 2018")
        YEAR_INDEX = 4;
      }
      console.log("select", d3.select("svg").selectAll("circle"))
      d3.select("svg").selectAll("circle").remove();
      console.log(d.year+ " button clicked");
      //console.log("year index", YEAR_INDEX)
      drawCircles(data);
    })
}

var drawCircles = function(data)
{
  var svg = d3.select("svg")
// group year
//   ^group event
//     ^group female
//     ^group male

  data.features.forEach(function(d)
  {
    var currCountryGroup = svg.select("#map").append("g")
                            .attr("id", "group"+d.id);

      // make circle for each country for current year
      // (id, year data, svg, total number athletes in country)
      //console.log("select1", svg.select("#group"+d.year.toString()))
      if (d.runData.years[YEAR_INDEX].events != null)
      {
        makeCirc("#group"+d.id, d, svg, d.runData.years[YEAR_INDEX].totalAthletesInCountry, YEAR_INDEX);


      d.runData.years[YEAR_INDEX].events.forEach(function(currE)
      {
        if(d.runData.years[YEAR_INDEX].activeEvents.includes(currE.event))
        {
          //console.log("id thing", "#"+"group"+(d.runData.years[YEAR_INDEX].year.toString()))

          var currEventGroup = svg.select("#"+"group"+d.runData.years[YEAR_INDEX].year.toString())
                                  .append("g")
                                  .attr("id", "group"+ d.runData.years[YEAR_INDEX].year.toString()+d.id+currE.event.toString());
          //add circle for # people in that event to this group

          var currMaleGroup = svg.select("#"+"group"+d.runData.years[YEAR_INDEX].year.toString()+d.id+currE.event.toString())
                                  .append("g")
                                  .attr("id", "Malegroup"+d.runData.years[YEAR_INDEX].year.toString()+d.id+currE.event.toString());
          var currMaleGroup = svg.select("#"+"group"+d.runData.years[YEAR_INDEX].year.toString()+d.id+currE.event.toString())
                                .append("g")
                                .attr("id", "Femalegroup"+d.runData.years[YEAR_INDEX].year.toString()+d.id+currE.event.toString());
      }
      })
    }
  })

  //console.log("all done");


}

var makeCirc = function(id, data, svg, size, loc, year)
{

  //console.log("select", d3.select("body"))

     //.select(id)
     d3.select(id)
        .datum(data)
        .append("circle")
        .attr("transform", function(d, year)
        {
          //var dataLoc = d.data;

          //console.log("here", d)
          var spotX = d.properties.spotData.xLoc;
          var spotY = d.properties.spotData.yLoc;
          //var location = d.locale.split("d").join(dataLoc);
         //console.log("in spot x", spotX)
         //console.log("in spot Y", spotY)
           return ("translate(" + Number(spotX)+ "," + Number(spotY) + ")");
        })
        .attr("r", function(d)
        {
        //  console.log("total", d.runData.years[0])
          return Number(Math.sqrt((d.runData.years[0].totalAthletesInCountry+40)/3.1415));
        })
        .style("opacity", .8)
        .style("stroke", "white")
        .style("stroke-width", function(d)
      {
        return Number(Math.sqrt((d.runData.years[0].totalAthletesInCountry+40)/3.1415)*0.1);
      })
        .attr("fill", "gold")
        .on("mouseover", function(d, i)
        {

          var e = d3.select("#"+[d.id]+"text");
          //console.log("e", e)
         e.attr("fill", "GreenYellow")
            .style("text-shadow","0px 0px 8px Black");
           d3.select("#countryLabel" + [d.id])
              .style("display", "block");
          //console.log(d.properties.id)

        })
        .on("mouseout", function(d, i)
        {
          var e = d3.select("#"+[d.id]+"text");
          //console.log("e", e)
         e.attr("fill", "transparent");
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

                                var e = d3.select("#"+[d.id]+"text");
                                //console.log("e", e)
                               e.attr("fill", "GreenYellow")
                                  .style("text-shadow","0px 0px 8px Black");
                                 d3.select("#countryLabel" + [d.id])
                                    .style("display", "block");
                                //console.log(d.properties.id)

                              })
                              .on("mouseout", function(d, i)
                              {
                                var e = d3.select("#"+[d.id]+"text");
                                //console.log("e", e)
                               e.attr("fill", "transparent");
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
                                 // add mouseover functionality to the label
                                 .on("mouseover", function(d, i)
                                 {
                                   //d3.select(this).attr("fill","black");
                                   //console.log(d.properties.ADMIN+"text")
                                   var e = d3.select("#"+[d.id]+"text");
                                   //console.log("e", e)
                                  e.attr("fill", "GreenYellow")

                                    //d3.select(this).attr("font-size", 7);
                                    d3.select(this).style("display", "block")


                                 })
                                 .on("mouseout", function(d, i)
                                 {
                                   var e = d3.select("#"+[d.id]+"text");
                                   //console.log("e", e)
                                  e.attr("fill", "transparent");
                                     d3.select(this).style("display", "none")

                                 })
                                 // add an onlcick action to zoom into clicked country
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

  var colorThing = d3.scaleLinear().domain([1,length])
                    .interpolate(d3.interpolateHcl)
                    .range([d3.rgb("rgb(102, 103, 119)"), d3.rgb("rgb(57, 60, 119)")]);


  var linearScale = d3.scaleLinear()
                            .domain([80000, 0])
                            .range([0,1]);


    //  console.log("color", colorThing(linearScale(c)));
  var returnColor = colorThing(linearScale(c));
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
