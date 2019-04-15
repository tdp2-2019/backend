# Backend Document
https://correapp-api.herokuapp.com

## 1.Trips
### - Create trip
```bash
curl -X POST \
  https://correapp-api.herokuapp.com/trips \
  -H 'Content-Type: application/json' \
  -d '{
	"client" : "Gus",
	"source" : {
		"lat" : "-34.567448",
		"long" : "-58.435109"
	},
	"destination" : {
		"lat" : "-34.526351",
		"long" : "-58.471460"
	},
	"start_time" : "2019-04-10T12:00:00Z",
	"pets" : "Lo que quieran poner"
}'
```

### - Get all trips
```bash
curl -X GET \
  https://correapp-api.herokuapp.com/trips
```

### - Get one trip
```bash
curl -X GET \
  https://correapp-api.herokuapp.com/trips/:ID
```

### - Create a driver
```bash
curl -X POST \
  http://localhost:5000/drivers/ \
  -H 'Content-Type: application/json' \
  -d '{
	"DNI" : "1234",
	"name" : "Gus",
	"lastName": "Gimenez",
	"email" : "gustavo@gmail.com",
     "telephone": "123123123",
     "celphone" : "1534343434",
     "address" : "Libertador 7200",
     "brand" : "Ford",
     "model" : "Fiesta",
     "licenseNumber" : 12312312,
     "insurancePolicyNumber" : "AAADDDSS",
      "startWorkTime" : "",
      "endWorkTime" :"",
      "carLicensePlate": "ABC123",
      "carColour" : "Rojo"
}'
```