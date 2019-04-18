var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
var rating_calculator = require('../src/utils/rating_calculator');

describe("Rating_calculator tests: ", function() {
  describe("Check Driver Rating calculator: ", function() {
    it("First example: ", function() {
      var trips = [
        {driver_rating: {rating: 5.0 }},
        {driver_rating: {rating: 3.2 }},
        {driver_rating: {rating: 2.3 }}
      ];
      return rating_calculator.driver_rating(trips).should.eventually.equal(4.55);
    });
    
    it("second example: ", function() {
      var trips = [
        {driver_rating: {rating: 5.0 }},
      ];
      return rating_calculator.driver_rating(trips).should.eventually.equal(5*1.3);
    });
    
    it("Third example: ", function() {
      var trips = [];
      return rating_calculator.driver_rating(trips).should.eventually.equal(null);
    });
    
    it("Forth example: ", function() {
      var trips = null;
      return rating_calculator.driver_rating(trips).should.eventually.equal(null);
    });
  });
});
