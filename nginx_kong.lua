local jwt = require "resty.jwt"

-- Get JWT from Authorization header
local auth_header = ngx.var.http_authorization
if auth_header and auth_header:find("Bearer ") then
    local token = auth_header:sub(8)  -- Remove "Bearer " prefix
    local decoded = jwt:load_jwt(token)

    if decoded and decoded.payload and decoded.payload.apikey then
        -- Set extracted API key as a request header for Kong to use
        ngx.req.set_header("apikey", decoded.payload.apikey)
    end
end
