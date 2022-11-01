# Authgear xk6 extension

## What is this

This is a xk6 extension to help writing k6 scripts for Authgear.

## Build instructions

1. Clone this repository.
2. Follow the official guide to set things up.
3. Run `make build` in this repository to build a custom build of `k6`.

## How to use the prepared scripts

There are 2 prepared scripts:

- [./biometric_setup.js](./biometric_setup.js): This script enables biometric and prints the kid to the command output. Note that it is not possible to run this concurrently for the same user.
- [./biometric_authenticate.js](./biometric_authenticate.js): This script authenticates with biometric. Note that it is very easy to hit rate limit if k6 virtual users is higher than 1.

The Makefile contains 2 targets to demonstrate how to run the prepared scripts.

Each script expects some environment variable to be present.

- `ENDPOINT`: The endpoint of Authgear
- `CLIENT_ID`: The client ID of one application of Authgear. It can be found on the portal.
- `ACCESS_TOKEN`: A valid access token of a user. This implies you need to sign up a user first. Here we assume the reader knows how to use `/oauth2/authorize` and `/oauth2/token` to obtain an access token.
- `KID`: This should be the output of [./biometric_setup.js](./biometric_setup.js).
