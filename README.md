# kong-rate-limit

## Postgres Config to Update

Make sure to update the following environment variables in the `test-kong.yml` file to connect to the Postgres database.

```yaml
      - KONG_DATABASE=postgres
      - KONG_PG_HOST=host.docker.internal
      - KONG_PG_PORT=5432
      - KONG_PG_PASSWORD=
      - KONG_PG_USER=irfan.baig
      - KONG_PG_DATABASE=kong
```

## Download and Install

`docker compose -f test-kong.yml up -d`

##  Create a service 
```bash
curl -i -X POST "http://localhost:8001/services/" \
 --data-urlencode "name=httpbin" --data-urlencode "url=http://httpbin.org"
```

## Create a route

```bash
curl -i -X POST "http://localhost:8001/services/httpbin/routes" \
 --data-urlencode "name=httpbin" --data-urlencode "paths[]=/httpbin" 
```

## Add  Rate Limiting Plugin Configuration 

```bash
curl -i -X POST "http://localhost:8001/plugins" \
--data-urlencode "name=rate-limiting" --data-urlencode "config.minute=5"
```


## Test

```bash
curl -i -X GET http://localhost:8000/httpbin/get
```
