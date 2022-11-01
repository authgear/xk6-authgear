# Authgear xk6 extension

## How to use this

1. Clone this repository.
2. Follow the official guide to set things up.
3. Run `make build` in this repository to build a custom build of `k6`.

The Makefile contains 2 more targets to demonstrate how to use the prepared scripts to test biometric.

First of all we need the following things:

1. The endpoint of Authgear
2. The client ID of one application of Authgear. It can be found on the portal.
3. Sign up a user first. We need a user to enable biometric, right?

Assuming the reader knows how to use `/oauth2/authorize` and `/oauth2/token` to obtain an access token,
Run `make biometric_setup` to enable biometric and obtain the kid in the command output. Note that it is not possible to run this concurrently for the same user.

Run `make biometric_authenticate` to authenticate with biometric. Note that it is very easy to hit rate limit if k6 virtual users is higher than 1.
