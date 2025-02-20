# kong-rate-limit

## Postgres Config to Update

Make sure to update the following environment variables in the [test-kong.yml](https://github.com/irfanbaigse/kong-rate-limit/blob/main/test-kong.yml) file to connect to the Postgres database.

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
```shell
curl -i -X POST "http://localhost:8001/services/" \
 --data-urlencode "name=httpbin" --data-urlencode "url=http://httpbin.org"
 
 curl -i http://localhost:8001/services
```

## Create a route

```shell
curl -i -X POST "http://localhost:8001/services/httpbin/routes" \
 --data-urlencode "name=httpbin" --data-urlencode "paths[]=/httpbin" 
```

## Add  Rate Limiting Plugin Configuration 

```shell
curl -i -X POST "http://localhost:8001/plugins" \
--data-urlencode "name=rate-limiting" --data-urlencode "config.minute=5"
```


## Test

```shell
curl -i -X GET http://localhost:8000/httpbin/get
```

```shell
curl -X POST http://localhost:8001/services/httpbin/plugins \
     --data "name=key-auth"
```

```shell
curl -X POST http://localhost:8001/consumers \
     --data "username=tenantA"
```

```shell
curl -X POST http://localhost:8001/consumers/tenantA/key-auth \
     --data "key=API_KEY_TENANT_A"
```

```shell
curl -X POST http://localhost:8001/consumers/tenantA/plugins \
     --data "name=rate-limiting" \
     --data "config.minute=10" \
     --data "config.policy=redis" \
     --data "config.redis_host=host.docker.internal"
```

```shell
curl -X POST http://localhost:8001/consumers/tenantB/plugins \
     --data "name=rate-limiting" \
     --data "config.minute=10" \
     --data "config.policy=redis" \
     --data "config.redis_host=host.docker.internal"
```

## Test

```shell
curl -i -X GET http://localhost:8000/httpbin/get \
     -H "apikey: API_KEY_TENANT_A"
     
 for i in {1..11}; do
    curl -i -X GET http://localhost:8000/httpbin/get \
     -H "apikey: API_KEY_TENANT_A"
done    

 for i in {1..201}; do
    curl -i -X GET http://localhost:8000/httpbin/get \
     -H "apikey: API_KEY_TENANT_B"
done  

for i in {1..11}; do
    curl -i -X GET http://localhost:8000/httpbin/get \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiYXBpa2V5IjoiQVBJX0tFWV9URU5BTlRfQSIsImV4cCI6MTc0MDA4MjA3NSwiaWF0IjoxNzQwMDc4NDc1fQ.NJbD29tYKBgF-YEMRhr4Uw-yPm0JBj7alUHzHinE-XU"
done  
```

## Enable the JWT Plugin

```shell
curl -X POST http://localhost:8001/services/httpbin/plugins \
     --data "name=jwt" \
     --data "config.run_on_preflight=true"
```

## Use Kong's Pre-Function Plugin to Extract API Key

```shell
curl -X POST http://localhost:8001/services/httpbin/plugins \
     --data "name=pre-function"
```

```shell

curl -X GET http://localhost:8000/httpbin/get \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJBUElfS0VZX1RFTkFOVF9BIiwiaWF0IjoxNzQwMDQ1NjEzfQ.IvOojDj_VTTMDsNBKHZlKowECXiPyGVvY7aLTvS2aqc"


```


## References

* http://jwtbuilder.jamiekurtz.com/

* https://docs.konghq.com/gateway/

* https://docs.konghq.com/gateway/api/admin-oss/latest/#/Debug/put-debug-node-log-level-log_level



