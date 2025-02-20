// const jwt = require("jsonwebtoken");
//
// const token = jwt.sign(
//   { apikey: "API_KEY_TENANT_A" }, // API key inside JWT
//   "tenantA-secret",
//   { algorithm: "HS256" }
// );
//
// console.log(token);

const jwt = require("jsonwebtoken");

// Secret should match the one configured in Kong JWT plugin
const secret = "your-jwt-secret";

const token = jwt.sign(
  {
    sub: "user123",
    apikey: "API_KEY_TENANT_A", // API key for TenantA
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expires in 1 hour
  },
  secret,
  { algorithm: "HS256" }
);

console.log("Generated JWT Token:", token);

/**
 * npm -g i jsonwebtoken
 * npm link jsonwebtoken
 * node gen-token.js
 * */
