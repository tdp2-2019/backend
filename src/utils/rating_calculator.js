var driver_intervals =[
  {factor: 1.3, min: 1, max: 14},
  {factor: 1.4, min: 15, max: 29},
  {factor: 1.6, min: 30, max: 89},
  {factor: 1.8, min: 90, max: 149},
  {factor: 2, min: 150, max: Infinity},
]

var user_intervals =[
  {factor: 1.3, min: 1, max: 3},
  {factor: 1.4, min: 4, max: 6},
  {factor: 1.6, min: 7, max: 9},
  {factor: 1.8, min: 9, max: 12},
  {factor: 2, min: 12, max: Infinity},
]

var driver_penalty = 3;

var rating_calculator = module.exports = {
    
    driver_rating: function(trips, number_of_rejected_trips) {
      return this.rating(trips, driver_intervals, number_of_rejected_trips);
    },
    
    user_rating: function(trips) {
      return this.rating(trips, user_intervals, 0);
    },
    
    rating: function(trips, intervals, number_of_rejected_trips) {
      return new Promise(resolve => {
        if ((trips == null || trips.length == 0) && number_of_rejected_trips == 0) resolve(null);
        var number_of_trips = trips.length + number_of_rejected_trips;
        var total_score = driver_penalty * number_of_rejected_trips;
        trips.forEach(trip =>{
          if (trip.driver_rating && trip.driver_rating.rating) {
            total_score += trip.driver_rating.rating;
          }
        });
        total_score = total_score / number_of_trips;
        resolve(this.factor(intervals, number_of_trips).then(factor =>{
          return factor * total_score;
        }));
      });
    },
    
    factor: function(intervals, number_of_trips) {
      return new Promise(resolve => {
        var factor = 1;
        driver_intervals.forEach(interval => {
          if (interval.min <= number_of_trips && interval.max >= number_of_trips) {
            factor = interval.factor;
          }
        });
        resolve(factor);
      });
    },
    
}