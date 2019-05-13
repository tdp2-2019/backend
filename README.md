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
	"pets" : [{"key1": "value", "key2":"value"}, {"key1": "value", "key2":"value"}],
  "companion" : "false"
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
    "name": "Gus",
    "lastname": "Gimenez",
    "id": 117,
    "telephone": "123123123",
    "celphone": "1534343434",
    "email": "gustavo@gmail.com",
    "dni": "1234",
    "brand": "Ford",
    "model": "Fiesta",
    "carcolour": "Rojo",
    "carlicenseplate": "ABC123",
    "insurancepolicynumber": "AAADDDSS",
    "startworktime": "13:04:53+00",
    "endworktime": "21:04:53+00",
    "address": "Libertador 7200",
    "licensenumber": "12312312",
    "currentposition": null,
    "rating": null,
    "signup_date": "2019-04-10T12:00:00.000Z",
    "photo_url": "www.google.com.ar",
    "license_photo_url": "http://photo.com",
    "car_plate_photo_url": "http://foto.com",
    "status": "No confirmado",
    "firebase_id": "",
    "active": "S",
    "comment": "nada para comentar"
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


# Database info

## Trips

```sql
-- Table: public.trips

-- DROP TABLE public.trips;

CREATE TABLE public.trips
(
    id integer NOT NULL DEFAULT nextval('trips_id_seq'::regclass),
    source json NOT NULL,
    destination json NOT NULL,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    rejecteds json[],
    pets json[],
    driver_rating json,
    user_rating json,
    status text COLLATE pg_catalog."default",
    driver_id integer,
    user_id integer,
    price double precision,
    points json[],
    duration double precision,
    client text COLLATE pg_catalog."default",
    CONSTRAINT trips_pkey PRIMARY KEY (id),
    CONSTRAINT driver_id FOREIGN KEY (driver_id)
        REFERENCES public.drivers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.trips
    OWNER to ckpxmqgdcaigzi;
```

## Drivers

```sql
-- Table: public.drivers

-- DROP TABLE public.drivers;

CREATE TABLE public.drivers
(
    name text COLLATE pg_catalog."default" NOT NULL,
    lastname text COLLATE pg_catalog."default" NOT NULL,
    id integer NOT NULL DEFAULT nextval('drivers_id_seq'::regclass),
    telephone text COLLATE pg_catalog."default",
    celphone text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default" NOT NULL,
    dni text COLLATE pg_catalog."default" NOT NULL,
    brand text COLLATE pg_catalog."default" NOT NULL,
    model text COLLATE pg_catalog."default" NOT NULL,
    carcolour text COLLATE pg_catalog."default" NOT NULL,
    carlicenseplate text COLLATE pg_catalog."default" NOT NULL,
    insurancepolicynumber text COLLATE pg_catalog."default" NOT NULL,
    startworktime time with time zone NOT NULL,
    endworktime time with time zone NOT NULL,
    address text COLLATE pg_catalog."default",
    licensenumber text COLLATE pg_catalog."default",
    CONSTRAINT drivers_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.drivers
    OWNER to ckpxmqgdcaigzi;
```

## Users
```sql
-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    name text COLLATE pg_catalog."default" NOT NULL,
    lastname text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    dni text COLLATE pg_catalog."default" NOT NULL,
    telephone text COLLATE pg_catalog."default" NOT NULL,
    celphone text COLLATE pg_catalog."default",
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    address text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to ckpxmqgdcaigzi;
```
