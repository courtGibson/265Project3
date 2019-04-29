var dataP = d3.json("distanceDataJson.json")

dataP.then(function(data)
{
  console.log("data", data);
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
  console.log("women 800m", eight)
  console.log("women 1500m", fifteen)
  console.log("women steeple", steeple)
  console.log("women 5k", fivek)
  console.log("women 10k", tenk)
  console.log("women marathon", marathon)

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


console.log("men 800m", eight)
console.log("men 1500m", fifteen)
console.log("men steeple", steeple)
console.log("men 5k", fivek)
console.log("men 10k", tenk)
console.log("men marathon", marathon)

  events.push(eight)
  events.push(fifteen)
  events.push(steeple)
  events.push(fivek)
  events.push(tenk)
  events.push(marathon)

  return events;
}
