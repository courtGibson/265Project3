var dataP = d3.json("runningDatajson.json")

dataP.then(function(data)
{
  console.log(data);

  fifteen = getEventList(data, "1500m")
  steeple = getEventList(data, "3000m Steeplechase")
  fivek = getEventList(data, "fivek")
  tenk = getEventList(data, "tenk")
  marathon = getEventList(data, "Marathon")

  var events = [fifteen, steeple, fivek, tenk, marathon]

  console.log("events", events)


})

var getEventList = function(data, event)
{
  var femaleArray = []
  var maleArray = []

  data.forEach(function(d,i)
  {
    if (d.event==event)
    {
      if (d.gender == "male")
      {
        maleArray.push(d);
      }
      else
      {
        femaleArray.push(d);
      }
    }
  })

  var event = {female:femaleArray, male:maleArray};

  return event;
}
