import http from "k6/http";

const ENDPOINT = __ENV.ENDPOINT;
const CLIENT_ID = __ENV.CLIENT_ID;
const ACCESS_TOKEN = __ENV.ACCESS_TOKEN;

export const device_info = {
  ios: {
    uname: {
      machine: "iPhone13,1",
      release: "22.0.0",
      sysname: "Darwin",
      version:
        "Darwin Kernel Version 22.0.0: Tue Aug 16 20:52:01 PDT 2022; root:xnu-8792.2.11.0.1~1/RELEASE_ARM64_T8101",
      nodename: "iPhone",
    },
    NSBundle: {
      CFBundleName: "reactNativeExample",
      CFBundleVersion: "1",
      CFBundleExecutable: "reactNativeExample",
      CFBundleIdentifier: "com.authgear.exampleapp.reactnative",
      CFBundleDisplayName: "reactNativeExample",
      CFBundleShortVersionString: "1.0",
    },
    UIDevice: {
      name: "iPhone",
      model: "iPhone",
      systemName: "iOS",
      systemVersion: "16.0.2",
      userInterfaceIdiom: "phone",
    },
    NSProcessInfo: { isiOSAppOnMac: false, isMacCatalystApp: false },
  },
};

export function makeJWK(kid) {
  return {
    kid,
    d: "VT6t8ro8HwlOzoPMK8owqBzz4IR4q14uLyMs-17S9MP0qj1bZOmuXeJjKNi6VjqzWDwUWR9zHkkam2ogRVbhRJOc_q_kgOlZW78_b9sNxMK9MV2LT_153e76qhtROLhfk15Sini6qD8fokRXFTKTx1_u24iWLBXpbcPAposkHJMTKUvXKzXCoYVPaY4Om8zEpgDRdEBVxdSJEICiXPzix7Vsw4vA3_u8lq5FzRY2emI-f_uwoLTjS6uGdJdfNVZrJeA6TbF4uPIau-HsVJaXMH0YUvWHlJZYImdzhwvY47mTFIKdip09c7_n09w-MJoRV2MHFkGKYSnscyIGjtV3AQ",
    dp: "HySuV05eEuq18hQuzeR37sTx6DBtaeDzefr4cDwE7KGAogMST-YdNG9M1gm1q7izTytU4s4h3nq64ENuE4vJrB73_u0Q4gHQOnalJGBKBkb8GZb0FMYjUILnbMC_m2fRKexcrQQzEdawQEddttzed7gAZZvsUKlfX420OfvgKU8",
    dq: "ESphSk2nXJTlULcWelcREK9uLTncOpU-U-PcsRuJetpYT66JKPJLsK7_vDZe72t3kWaYi_fCBInPen_ALFPcOWQfe-BjLN7yfHGar4hUl9h16PIijNnhD7D9GWpsQpwXySfiwdyrzweoBxr2SZ8tU-gxkc11kDeDuVsEDcw57Ek",
    e: "AQAB",
    kty: "RSA",
    n: "sz6UpN0qQs3pl4uFYnvD9h_FGr8GLN6RMY4pQMEJn3ckH_NuJV0zk9mihgLq1VS2CVNr75qlkQ2b5cFo_2bSfhGfbXHVS89UJgzW2_JQKanOfVQUWW-FvqCH1AZFBumYiju2N0mis7ompeF06GyfwNGpOkdflBMZybOiQMEB5zpP7QlDXAqlkfmF-oYlNaOZr7-X8G-iSQrwC2AkD-GGgxiWegCmU3JpyZXO-xI9sbYtPeNukHQtmlV7hPdQsjF1Oh-aT081YksIlRW0k9wgBrpu81NIDzi2xKrEjZkSih7ckHG2nbs_syIAHwhEAUXWg2LnmvLCZiilN39MPmMcyQ",
    qi: "VLSW2vPVkK77lFoOPtXa_r_3hcOtFJrDZ5JzeGpqmMUeHPOOeMcjqfKMg2_H9M0LFffw0_G7_JIyzv9mkCo0eSfIYd4Z11NQ8nS4wUfcAWfMu7i_Lk4qwlGbw5xk5X2eS0_QZwDh6BwAWzQLs28viNaa-K4UT4BwtAuIPQe2EFI",
    p: "0vW_ESNp2Om3ktRkEtH7RRwynxYH1xpB9nx6ipv8UBQ_s-SzsFBckkixUSrHLOmQEishlM-s7pQonagOXfttnwPJb9JFq8UbPA-MSoyQ21OmXm_dK-chRv9xUaIuu3reXM8XZo4yssHLh3A3acad-z_nYccpemwCq6XRlLvsIis",
    q: "2YNjbKTPNRLnIhL3jqDvjfuWgRc8m0vf-1tNQ4aQDnHNakNbpLM2MtF-Ry6u6b8CazggmNzbME0ExF36qH2NbRv1tFycq_WsOG5vU4Cy_a0hIkEdDeFoBaUpf63q3cPuC3eUxsC55aQWHQ3tnawAJxREmmIr1qxyFbdoYWyupts",
  };
}

export function getChallenge() {
  const url = `${ENDPOINT}/oauth2/challenge`;
  const payload = JSON.stringify({
    purpose: "biometric_request",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = http.post(url, payload, params);
  return res.json().result.token;
}

export function enableBiometric(jwt) {
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

export function authenticateBiometric(jwt) {
  const url = `${ENDPOINT}/oauth2/token`;
  const form = {
    jwt,
    grant_type: "urn:authgear:params:oauth:grant-type:biometric-request",
    client_id: CLIENT_ID,
  };
  const res = http.post(url, form);
  return res.json();
}
