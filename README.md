# Kong API Gateway with Redis Rate Limiting with Custom Token Authentication

* Use Pre-Function Plugin to extract the apikey from the JWT.
* Use Key-Auth Plugin for API key authentication.
* Use Rate-Limiting Plugin (Redis) to apply limits per API key.

##  Create a service
```shell
curl -i -X POST "http://localhost:8001/services/" \
 --data-urlencode "name=httpbin" --data-urlencode "url=http://httpbin.org"
 
 # list services 
 curl -i http://localhost:8001/services
```

## Create a route

```shell
curl -i -X POST "http://localhost:8001/services/httpbin/routes" \
 --data-urlencode "name=httpbin" --data-urlencode "paths[]=/httpbin" 
```

## Enable Key-Auth Plugin for Authentication


```shell
curl -X POST http://localhost:8001/services/httpbin/plugins \
     --data "name=key-auth"
```

## Enable pre-function plugin to extract the apikey from the JWT

```shell
curl --location 'http://localhost:8001/services/httpbin/plugins' \
--form 'name="pre-function"' \
--form 'config.access[1]="local a=ngx.var.http_authorization;if a and a:find('\''Bearer '\'')then local b=a:sub(8)local c={}for d in b:gmatch('\''[^%.]+'\'')do table.insert(c,d)end;if\#c==3 then local e=ngx.decode_base64(c[2])local f=require('\''cjson.safe'\'')local g=f.decode(e)if g and g.apikey then ngx.req.set_header('\''apikey'\'',g.apikey)end end end"'
```


## Create Consumers and Assign API Keys

Each tenant should have a consumer with an API key.

```shell
curl -X POST http://localhost:8001/consumers \
     --data "username=tenantA"
```

### Assign API Key:

```shell
curl -X POST http://localhost:8001/consumers/tenantA/key-auth \
     --data "key=API_KEY_TENANT_A"
```
Now, Kong recognizes tenants based on API keys extracted from JWT.

## Apply Rate Limiting Per Tenant Using Redis

```shell
curl -X POST http://localhost:8001/consumers/tenantA/plugins \
     --data "name=rate-limiting" \
     --data "config.minute=10" \
     --data "config.policy=redis" \
     --data "config.redis_host=host.docker.internal"
```

## Test with a JWT Token

Generate a JWT token with the API key in the payload.

```shell
node gen-token.js
```

Use the generated token to access the API.

```shell
curl -X GET http://localhost:8000/api \
     -H "Authorization: Bearer YOUR_GENERATED_JWT_TOKEN"
```
