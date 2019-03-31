class Driver {

	constructor(id, DNI, name, lastName, userName,email,
		telephone,celphone,address,brand,model,licenseNumber,insurancePolicyNumber,
		startWorkTime,endWorkTime ) {
		this._id = id;
		this._DNI = DNI;
		this._name = name;
		this._lastName = lastName;
		this._userName = userName;
		this._email = email;
		this._telephone = telephone;
		this._celphone = celphone;
		this._address = address;
	    this._brand = brand; //marca
	    this._model = model; //modelo
	    this._licenseNumber = licenseNumber;
	    this._insurancePolicyNumber = insurancePolicyNumber;
	    this._startWorkTime = startWorkTime;
	    this._endWorkTime = endWorkTime;
	}

	get id() {
		return this._id;
	}

	set id(new_id) {
		this._id = new_id;
	}

	set DNI(	DNI) {
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
		this._address = address;
	}

	get brand()
	{
		return this._brand;
	}

	set brand(brand)
	{
		this._brand = brand;
	}

	get model()
	{
		return this._model;
	}

	set model(model)
	{
		this._model = model;
	}

	get licenceNumber()
	{
		return this._licenceNumber;
	}

	set licenceNumber(licenceNumber)
	{
		this._licenceNumber = licenceNumber;
	}

	get insurancePolicyNumber()
	{
		return this._insurancePolicyNumber;
	}

	set insurancePolicyNumber(insurancePolicyNumber)
	{
		this._insurancePolicyNumber = insurancePolicyNumber;
	}

	get startWorkTime()
	{
		return this._startWorkTime;
	}

	set startWorkTime(startWorkTime)
	{
		this._startWorkTime = startWorkTime;
	}

	get endWorkTime()
	{
		return this._endWorkTime;
	}

	set endWorkTime(endWorkTime)
	{
		this._endWorkTime = endWorkTime;
	}

	toJSON(){
        return {
            id: this.id,
            DNI: this.DNI,
            name: this.name
        };
    }

    static fromJSON(obj) {
        return new this(obj);
    }

}
module.exports = Driver;