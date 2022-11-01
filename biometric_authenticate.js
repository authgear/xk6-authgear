import http from "k6/http";
import authgear from "k6/x/authgear";
import {
  device_info,
  makeJWK,
  getChallenge,
  authenticateBiometric,
} from "./biometric_common.js";

const KID = __ENV.KID;

export default function () {
  const jwk = makeJWK(KID);
  const challenge = getChallenge();
  const now = new Date().getTime() / 1000;
  const payload = {
    iat: now,
    exp: now + 300,
    challenge: challenge,
    action: "authenticate",
    device_info: device_info,
  };
  const headers = {
    typ: "vnd.authgear.biometric-request",
  };
  const jwt = authgear.signJWT(jwk, payload, headers);
  const body = authenticateBiometric(jwt);
  console.log(body);
}
