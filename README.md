# Authgear xk6 extension

## What is this

This is a xk6 extension to help writing k6 scripts for Authgear.

## Preparation

### Build k6

1. Clone this repository.
1. Follow the [official guide](https://k6.io/docs/extensions/get-started/create/javascript-extensions/) to set things up.
1. Run `make build` in this repository to build a custom build of `k6`.

### Prepare a tenant for testing purpose

1. We are going to use `loadtest` as the project ID (or app ID).
1. Run `./authgear init -o ./tmp` to generate `authgear.secrets.yaml`. We do not need the generated `authgear.yaml`.
1. Add a row in `_portal_config_source` to add this tenant. Use [./authgear.yaml](./authgear.yaml), [./authgear.features.yaml](./authgear.features.yaml), and the generated `authgear.secrets.yaml`.

### Prepare the Admin API token

1. Inspect the content of `authgear.secrets.yaml`. Move the JWK of Admin API to a new file called `jwk.yaml`.

```yaml
# authgear.secrets.yaml
# other contents omitted...
    keys:
    - alg: RS256
      created_at: 1627551836
      d: oJP9r8semY_yVCbUPWjfcBQvJ3NgXIZ0JnB4TYbvckd6XbLED_s8gwBazmq88kqyVZneZ900xmcygkYckXlk8VysNm2GRHDY9n0ISbJCjpKoDI5zsx4JODoqNbSX5O1Jz3DsUCpCvdvoQU-LPcrnIDUn9Hq8oNPGqAA2O4SGbZ96qRaAImMVp6WzBeGmttrBHrGXa16Q2_qSOzhdokfYUn0D5Ejybxp7-wPlHYbF_npiTS3cWg103YqhBOFVow_NywxUf18UN9BLaMV1sSsVz4gTN2q8y8eYmHr6nrxzCW2YBvP_oNKtQhQ9lLZ3KbZ05sfWYQxZvniMPHdV2kcEAQ
      dp: 5pdEfAA3eSlOmcjXXl3zJa66JBHvWqloln7jtSgDPZH_-7CeRrtVFiJClD--aMKeB8oUL91wAAOaigsbsJn2Ps6gzkfgsZ1D8iTalZRL2wvqJichcwjbIFkfeeq71CPtlK1JQ2wocjZRmkjiG6-3SJtIp9g5TTzqXFLrUcO7C4E
      dq: bxKtRDrR71WF4en1TsjauNC63RBXl03yr-C5cIkxUpRWzT9O30i_1PDymruxceuw7oQSiKS9icB8Dy60ZtkFbzr95YbCsK_2KkFPV4a21pAbhWSH4hF6_okp6fXiw8_1Ms62GgIZ2bky5ZNHufXCbhAQ_ZaGEXmyQw1k2dwgWJE
      e: AQAB
      kid: 8fce2c32-0a96-4431-ba40-a7f068eed276
      kty: RSA
      "n": xIfD5TGAeMYr40hh7iASyIqZnRHNefrqn-3J8uDB85pnBXl_PRhAF4tqYCOL8n9X3yquwSjtJJAnXLsEh7m8Av2srTmGgG0Qur706_O-TBipgLW_GpvCOWxrjBvU52nXBdh4tbNBCbonV4ZwAo25pGIGgnhdmurnot2NDNhApWk85khab_2wGxxhJrsq4vTXyi4oXz5XkDXAa8wXMZPXyLkr5KAXMJo6TF1WKo3yqTf9Xm_ImOpobo_Q2YiN4oP5BCKjlxnDx_EYW6jG3K25ez2310IDoNj8VFN1Le2XTB1_ZC7JqPT8Xprd-mIqLWjGZlzxciW6Ct3gXtwXbDvhRQ
      p: -NfOgiPhDE3DqmiYy7Wlp4kXgiEL0GLjv4T0NJ-lgsql9UukADWI2IhppeKN26ryBgUgNIweX6urYQUKXDSrp0uUgvuwA-c8rHaFznB0nIqXAOyiA7xx6-bxa06-AfjGDtVXEUOFejLags4mjD60IgmQ2F7mxdzGS_MdxZrEUME
      q: yi7Jz8OicYij_Qp9Qr0Wn2jVEQCSz7e3ZwKY91gYiw-uU_H6sy1qGRc7uXQZPSgmo5Kt3d2EJ-rhiXn0CYm29u4lmmJLbB_KCMGVLjQJMhPd6NlixEEqojOnDtEFKPJFIcmgcUEvuSVgUmjt3P_VBiHzwOntV67MWx-Y-vkMLYU
      qi: vLeBmXYV_Lz-s1T2a4RYR2uvuoysGAhKUAKznCxMl01DVbx2LwOcfqPdY0gK1BzAhMv9UC7vCYpQNkzyt_a0UVTRY-UGg45L_kf0PLBflc2PuOVsKNrkqHAO-zRSLiLi55ln1G77iWxrTP5B-dHFbWLPCPhHIVRQ6KCH_mGxZts
  key: admin-api.auth
# other contents omitted...
```

```yaml
# In jwk.yaml
alg: RS256
created_at: 1627551836
d: oJP9r8semY_yVCbUPWjfcBQvJ3NgXIZ0JnB4TYbvckd6XbLED_s8gwBazmq88kqyVZneZ900xmcygkYckXlk8VysNm2GRHDY9n0ISbJCjpKoDI5zsx4JODoqNbSX5O1Jz3DsUCpCvdvoQU-LPcrnIDUn9Hq8oNPGqAA2O4SGbZ96qRaAImMVp6WzBeGmttrBHrGXa16Q2_qSOzhdokfYUn0D5Ejybxp7-wPlHYbF_npiTS3cWg103YqhBOFVow_NywxUf18UN9BLaMV1sSsVz4gTN2q8y8eYmHr6nrxzCW2YBvP_oNKtQhQ9lLZ3KbZ05sfWYQxZvniMPHdV2kcEAQ
dp: 5pdEfAA3eSlOmcjXXl3zJa66JBHvWqloln7jtSgDPZH_-7CeRrtVFiJClD--aMKeB8oUL91wAAOaigsbsJn2Ps6gzkfgsZ1D8iTalZRL2wvqJichcwjbIFkfeeq71CPtlK1JQ2wocjZRmkjiG6-3SJtIp9g5TTzqXFLrUcO7C4E
dq: bxKtRDrR71WF4en1TsjauNC63RBXl03yr-C5cIkxUpRWzT9O30i_1PDymruxceuw7oQSiKS9icB8Dy60ZtkFbzr95YbCsK_2KkFPV4a21pAbhWSH4hF6_okp6fXiw8_1Ms62GgIZ2bky5ZNHufXCbhAQ_ZaGEXmyQw1k2dwgWJE
e: AQAB
kid: 8fce2c32-0a96-4431-ba40-a7f068eed276
kty: RSA
"n": xIfD5TGAeMYr40hh7iASyIqZnRHNefrqn-3J8uDB85pnBXl_PRhAF4tqYCOL8n9X3yquwSjtJJAnXLsEh7m8Av2srTmGgG0Qur706_O-TBipgLW_GpvCOWxrjBvU52nXBdh4tbNBCbonV4ZwAo25pGIGgnhdmurnot2NDNhApWk85khab_2wGxxhJrsq4vTXyi4oXz5XkDXAa8wXMZPXyLkr5KAXMJo6TF1WKo3yqTf9Xm_ImOpobo_Q2YiN4oP5BCKjlxnDx_EYW6jG3K25ez2310IDoNj8VFN1Le2XTB1_ZC7JqPT8Xprd-mIqLWjGZlzxciW6Ct3gXtwXbDvhRQ
p: -NfOgiPhDE3DqmiYy7Wlp4kXgiEL0GLjv4T0NJ-lgsql9UukADWI2IhppeKN26ryBgUgNIweX6urYQUKXDSrp0uUgvuwA-c8rHaFznB0nIqXAOyiA7xx6-bxa06-AfjGDtVXEUOFejLags4mjD60IgmQ2F7mxdzGS_MdxZrEUME
q: yi7Jz8OicYij_Qp9Qr0Wn2jVEQCSz7e3ZwKY91gYiw-uU_H6sy1qGRc7uXQZPSgmo5Kt3d2EJ-rhiXn0CYm29u4lmmJLbB_KCMGVLjQJMhPd6NlixEEqojOnDtEFKPJFIcmgcUEvuSVgUmjt3P_VBiHzwOntV67MWx-Y-vkMLYU
qi: vLeBmXYV_Lz-s1T2a4RYR2uvuoysGAhKUAKznCxMl01DVbx2LwOcfqPdY0gK1BzAhMv9UC7vCYpQNkzyt_a0UVTRY-UGg45L_kf0PLBflc2PuOVsKNrkqHAO-zRSLiLi55ln1G77iWxrTP5B-dHFbWLPCPhHIVRQ6KCH_mGxZts
```

1. Run `make admin-api-token` to generate the Admin API token. You can set it as `ADMIN_API_TOKEN` in [Makefile](./Makefile).

### Prepare other variables

1. Open [Makefile](./Makefile)
1. Set `ENDPOINT` to the endpoint of Authgear.
1. Set `CLIENT_ID` to the client ID. You can find it in `authgear.yaml`.
1. Follow [Prepare the Admin API token](#prepare-the-admin-api-token) to set up `ADMIN_API_TOKEN`.

### Tweak load test parameters

1. Open [Makefile](./Makefile)
1. `VUS` represents the number of concurrent user in the test.
1. `DURATION` is how long the test should run.

## Run the test

Make sure you follow [Preparation](#preparation) first.

Run `make run` to run the test.
