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
	"pets" : [{"key1": "value", "key2":"value"}, {"key1": "value", "key2":"value"}]
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
  https://correapp-api.herokuapp.com/trips/:id
```

### - Create a driver
```bash
curl -X POST \
  https://correapp-api.herokuapp.com/drivers/ \
  -H 'Content-Type: application/json' \
  -d '{
    	"dni" : "1234",
    	"name" : "Gus",
    	"lastname": "Gimenez",
    	"email" : "gustavo@gmail.com",
      "telephone": "123123123",
      "celphone" : "1534343434",
      "address" : "Libertador 7200",
      "brand" : "Ford",
      "model" : "Fiesta",
      "licensenumber" : 12312312,
      "insurancepolicynumber" : "AAADDDSS",
      "startworktime" : "1555679093",
      "endworktime" :"1555707893",
      "carlicenseplate": "ABC123",
      "carcolour" : "Rojo"
  }'
```

### - Get all drivers
```bash
curl -X GET \
  https://correapp-api.herokuapp.com/drivers
```

### - Get one driver
```bash
curl -X GET \
  https://correapp-api.herokuapp.com/drivers/:id
```



### - Create a user
```bash
curl -X POST \
  https://correapp-api.herokuapp.com/users \
  -H 'Content-Type: application/json' \
  -d '{
    	"name": "Lucas",
    	"lastname" : "Pratto",
    	"dni" : "28999999",
    	"telephone" : "313131313",
    	"celphone" : "1531313131",
    	"email" : "lucas.pratto@gmail.com",
    	"address" : "Jorge Newbery 1764 5to D"
    }'
```