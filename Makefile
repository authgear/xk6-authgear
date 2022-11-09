ENDPOINT ?= 'http://localhost:3100'
CLIENT_ID ?= 'portal'
ADMIN_API_TOKEN ?= 'replaceme'
VUS ?= 5
DURATION ?= '5s'

.PHONY: build
build:
	xk6 build --with github.com/authgear/xk6-authgear=.

.PHONY: run
run:
	./k6 run -e ENDPOINT=$(ENDPOINT) -e CLIENT_ID=$(CLIENT_ID) -e ADMIN_API_TOKEN=$(ADMIN_API_TOKEN) --vus $(VUS) --duration $(DURATION) biometric.js

.PHONY: admin-api-token
admin-api-token:
	go run ./cmd/adminapijwt/ --project-id loadtest --jwk jwk.yaml
