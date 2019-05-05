var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
var trips_utils = require('../src/utils/trip_utils');


describe("Price calculator tests: ", function() {
  describe("Price calculator: ", function() {
    it("In the nightly rate 1", function() {
      var tripRates =  { 
      						animalrate: '50',
						    companion: '100',
						    km: '25',
						    min: '5',
						    nighttimeend: '06:00:00',
						    nighttimestart: '18:00:00',
						    nightrate: '50',
						    idzona: 1 
						} 
      return trips_utils.getNightRange(tripRates, "2019-04-10T17:59:59.000").should.equal(0);
    });

    it("At the lower edge of the nightly rate", function() {
      var tripRates =  { 
      						animalrate: '50',
						    companion: '100',
						    km: '25',
						    min: '5',
						    nighttimeend: '06:00:00',
						    nighttimestart: '18:00:00',
						    nightrate: '50',
						    idzona: 1 
						} 
      return trips_utils.getNightRange(tripRates, "2019-04-10T18:00:00.000").should.equal("50");
    });

    it("At the top edge of the nightly rate", function() {
      var tripRates =  { 
      						animalrate: '50',
						    companion: '100',
						    km: '25',
						    min: '5',
						    nighttimeend: '06:00:00',
						    nighttimestart: '18:00:00',
						    nightrate: '50',
						    idzona: 1 
						} 
      return trips_utils.getNightRange(tripRates, "2019-04-10T06:00:00.000").should.equal("50");
    });

    it("In the nightly rate 2", function() {
      var tripRates =  { 
      						animalrate: '50',
						    companion: '100',
						    km: '25',
						    min: '5',
						    nighttimeend: '06:00:00',
						    nighttimestart: '18:00:00',
						    nightrate: '50',
						    idzona: 1 
						} 
      return trips_utils.getNightRange(tripRates, "2019-04-10T03:00:00.000").should.equal("50");
    });

    it("Price 1", function() {
      var tripRates =  { 
      						animalrate: '50',
						    companion: '100',
						    km: '25',
						    min: '5',
						    nighttimeend: '06:00:00',
						    nighttimestart: '18:00:00',
						    nightrate: '50',
						    idzona: 1 
						} 
      return trips_utils.getPrice(2,false,0.23385825736282487, 3.6, "2019-04-10T17:59:59.000",tripRates).should.equal(123.84645643407062);
    });

  });
});
