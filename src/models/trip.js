class Trip {
  
  constructor(client, source, destination, start_time, pets) {
    this._client = client;
    this._source = source;
    this._destination = destination;
    this._start_time = Date.now();
    this._end_time = null;
    this._driver_id = null;
    this._rejecteds = [];
    this._current_position = source;
    this._pets = pets;
    this._driver_rating = {}
    this._client_rating = {}
    this._status = 'created'
  }
  
  get id() {
    return this._id;
  }
  
  set id(new_id) {
    this._id = new_id;
  }
  
  get rejecteds()
  {
      return this._rejecteds;
  }

  set current_position(position) {
    this._current_position = position;
  }
  
  get current_position() {
    return this._current_position;
  }
  
  get client() {
    return this._client;
  }
  
  set client(client) {
    this._client = client;
  }
  
  get driver() {
    return this._driver;
  }
  
  set driver(driver) {
    this._driver = driver;
  }
  
  set driver_rating(rating) {
    this._driver_rating.rating = rating;
  }
  
  set client_rating(rating) {
    this._client_rating.rating = rating;
  }
  
  set client_rating_comment(comment) {
    this._client_rating.comment = comment;
  }
  
  get status() {
    return this._status;
  }
  
  set status(status) {
    this._status = status;
  }
  
  set driver_rating_comment(comment) {
    this._driver_rating.comment = comment;
  }
  
  calculate_price() {
    this._price = this._duration * 20;
  }
  
  to_json() {
    return {
      id: this._id,
      current_position: this._current_position,
      client: this._client,
      driver: this._driver,
      source: this._source,
      destination: this._destination,
      duration: this._duration,
      pets: this._pets,
      price: this._price,
      driver_rating: this._driver_rating,
      client_rating: this._client_rating,
      driver_id : this._driver_id,
      start_time : this._start_time,
      end_time: this._end_time,
      rejecteds: this._rejecteds,
      status: this._status
    }
  }

  get end_time()
  {
      return this._end_time;
  }
  
  set end_time(end_time)
  {
      this._end_time = end_time;
  }
  
  get driver_id()
  {
      return this._driver_id;
  }
  
  set driver_id(driver_id)
  {
      this._driver_id = driver_id;
  }
  
  get source() {
    return this._source;
  }

  get destination() {
    return this._destination;
  }

  get pets() {
    return this._pets;
  }

  get price() {
    return this._price;
  }
  
  get start_time() {
    return this._start_time;
  }


}

module.exports = Trip;
