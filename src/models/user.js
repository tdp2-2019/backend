class User {
  constructor(id, DNI, name, lastName, userName,email,
    telephone,celphone,address) {
    this._id = id;
    this._DNI = DNI;
    this._name = name;
    this._lastName = lastName;
    this._userName = userName;
    this._email = email;
    this._telephone = telephone;
    this._celphone = celphone;
    this._address = address;
  }

  get id() {
    return this._id;
  }

  set id(new_id) {
    this._id = new_id;
  }

  set DNI(  DNI) {
    this._DNI = DNI;
  }

  get DNI() {
    return this._DNI;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get lastName() {
    return this._lastName;
  }

  set lastName(lastName) {
    this._lastName = lastName;
  }

  get email() {
    return this._email;
  }

  set email(email) {
    this._email = email;
  }

  get telephone() {
    return this._telephone;
  }

  set telephone(telephone) {
    this._telephone = telephone;
  }

  get celphone() {
    return this._celphone;
  }

  set celphone(celphone) {
    this._celphone = celphone;
  }

  get address()
  {
    return this._address;
  }

  set address(address)
  {
    this._address = $address;
  }

}

module.exports = User;