import http from "k6/http";
import authgear from "k6/x/authgear";
import { device_info, makeJWK, getChallenge } from "./biometric_common.js";

const ENDPOINT = __ENV.ENDPOINT;
const CLIENT_ID = __ENV.CLIENT_ID;
const ACCESS_TOKEN = __ENV.ACCESS_TOKEN;

function enableBiometric(jwt) {
  const url = `${ENDPOINT}/oauth2/token`;
  const form = {
    jwt,
    grant_type: "urn:authgear:params:oauth:grant-type:biometric-request",
    client_id: CLIENT_ID,
  };
  const params = {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  };
  http.post(url, form, params);
}

export default function () {
  const kid = authgear.uuid();
  const jwk = makeJWK(kid);
  const challenge = getChallenge();
  const now = new Date().getTime() / 1000;
  const payload = {
    iat: now,
    exp: now + 300,
    challenge: challenge,
    action: "setup",
    device_info: device_info,
  };
  const headers = {
    typ: "vnd.authgear.biometric-request",
  };
  const jwt = authgear.signJWT(jwk, payload, headers);
  enableBiometric(jwt);
  console.log("kid:", kid);
}
