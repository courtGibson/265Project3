var dataP = d3.json("distanceDataJson.json")
var mapP = d3.json("countries.geojson")


Promise.all([dataP, mapP]).then(function(values)
{
  var runData = values[0]
  var geoData = values[1]

  console.log("data", runData);
  console.log("map", geoData);

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
      }
      else
      {
        count++;
      }
    }

  })

//console.log("all done")


  var map = makeMap();

  var womenByEvent = getWomen(data);
  var menByEvent = getMen(data);

  console.log(womenByEvent)
  console.log(menByEvent)

},
  function(err)
{
  console.log(err);
});



var getWomen = function(data)
{
  var events = []

  var eight = []
  var fifteen = []
  var steeple = []
  var fivek = []
  var tenk = []
  var marathon = []

  data.forEach(function(d,i)
{
  if (d.gender == "female")
  {
    if (d.event == "800m")
    {
      eight.push(d)
    }
    else if (d.event == "1500m")
    {
      fifteen.push(d)
    }
    else if (d.event == "3000m Steeplechase")
    {
      steeple.push(d)
    }
    else if (d.event == "5000m")
    {
      fivek.push(d)
    }
    else if (d.event == "10000m")
    {
      tenk.push(d)
    }
    else if (d.event == "marathon")
    {
      marathon.push(d)
    }
    else
    {
      console.log("whoops")
    }
  }

})
/*  console.log("women 800m", eight)
  console.log("women 1500m", fifteen)
  console.log("women steeple", steeple)
  console.log("women 5k", fivek)
  console.log("women 10k", tenk)
  console.log("women marathon", marathon)*/

  events.push(eight)
  events.push(fifteen)
  events.push(steeple)
  events.push(fivek)
  events.push(tenk)
  events.push(marathon)
  return events;
}

var getMen = function(data)
{
  var events = []

  var eight = []
  var fifteen = []
  var steeple = []
  var fivek = []
  var tenk = []
  var marathon = []

  data.forEach(function(d,i)
{
  if (d.gender == "male")
  {
    if (d.event == "800m")
    {
      eight.push(d)
    }
    else if (d.event == "1500m")
    {
      fifteen.push(d)
    }
    else if (d.event == "3000m Steeplechase")
    {
      steeple.push(d)
    }
    else if (d.event == "5000m")
    {
      fivek.push(d)
    }
    else if (d.event == "10000m")
    {
      tenk.push(d)
    }
    else if (d.event == "marathon")
    {
      marathon.push(d)
    }
    else
    {
      console.log("whoops")
    }
  }

})


/*console.log("men 800m", eight)
console.log("men 1500m", fifteen)
console.log("men steeple", steeple)
console.log("men 5k", fivek)
console.log("men 10k", tenk)
console.log("men marathon", marathon)*/

  events.push(eight)
  events.push(fifteen)
  events.push(steeple)
  events.push(fivek)
  events.push(tenk)
  events.push(marathon)

  return events;
}
