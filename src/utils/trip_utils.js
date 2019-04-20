function trip_utils(){}

trip_utils.calculate_position = function(start_time, points, duration) {
  var now = Date.now()
  var seconds_from_begginig = (now - start_time) / 1000
  if (seconds_from_begginig <= 0) {
    return points[0];
  }
  var seconds_per_interval = duration / points.length;
  var index = Math.round(seconds_from_begginig/seconds_per_interval)
  
  return points[index]
}

module.exports = trip_utils;