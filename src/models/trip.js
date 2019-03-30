class Trip {
  
  constructor(id, client, driver, source, destination, start_time, end_time, pets) {
    this._id = id;
    this._client = client;
    this._driver = driver;
    this._source = source;
    this._destination = destination;
    this._start_time = start_time;
    this._end_time = end_time;
    this._current_position = source;
    this._pets = pets;
  }
  
  get id() {
    return this._id;
  }
  
  set id(new_id) {
    this._id = new_id;
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
  
}

module.exports = Trip;