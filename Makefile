ENDPOINT ?= 'http://192.168.1.123.nip.io:3100'
CLIENT_ID ?= 'portal'
ACCESS_TOKEN ?= ''
KID ?= ''

.PHONY: build
build:
	xk6 build --with github.com/authgear/xk6-authgear=.

.PHONY: biometric_setup
biometric_setup:
	./k6 run -e ENDPOINT=$(ENDPOINT) -e CLIENT_ID=$(CLIENT_ID) -e ACCESS_TOKEN=$(ACCESS_TOKEN) biometric_setup.js

.PHONY: biometric_authenticate
biometric_authenticate:
	./k6 run -e ENDPOINT=$(ENDPOINT) -e CLIENT_ID=$(CLIENT_ID) -e KID=$(KID) biometric_authenticate.js
