# Backend Document
Backend server - Correapp

## 1.Trips
### - Create trip
```bash
curl -X POST \
  http://localhost:5000/trips \
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
  http://localhost:5000/trips
```

### - Get one trip
```bash
curl -X GET \
  http://localhost:5000/trips/:ID
```
