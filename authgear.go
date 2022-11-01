package authgear

import (
	"crypto/rand"
	"crypto/rsa"
	"encoding/json"

	"github.com/google/uuid"
	"github.com/lestrrat-go/jwx/v2/jwa"
	"github.com/lestrrat-go/jwx/v2/jwk"
	"github.com/lestrrat-go/jwx/v2/jws"
	"go.k6.io/k6/js/modules"
)

func init() {
	modules.Register("k6/x/authgear", new(Authgear))
}

func toJavaScript(v interface{}) interface{} {
	b, err := json.Marshal(v)
	if err != nil {
		panic(err)
	}
	var out interface{}
	err = json.Unmarshal(b, &out)
	if err != nil {
		panic(err)
	}
	return out
}

func toJSONBytes(v interface{}) []byte {
	b, err := json.Marshal(v)
	if err != nil {
		panic(err)
	}
	return b
}

type Authgear struct{}

func (*Authgear) Uuid() string {
	return uuid.Must(uuid.NewRandom()).String()
}

func (*Authgear) GenerateRsaPrivateKey(kid string) map[string]interface{} {
	rsaPrivateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		panic(err)
	}
	jwkKey, err := jwk.FromRaw(rsaPrivateKey)
	if err != nil {
		panic(err)
	}
	jwkKey.Set(jwk.KeyIDKey, kid)
	return toJavaScript(jwkKey).(map[string]interface{})
}

func (*Authgear) SignJWT(jwkValue map[string]interface{}, payload map[string]interface{}, headers map[string]interface{}) string {
	jwkBytes := toJSONBytes(jwkValue)
	jwkPrivateKey, err := jwk.ParseKey(jwkBytes)
	if err != nil {
		panic(err)
	}
	jwkPublicKey, err := jwkPrivateKey.PublicKey()
	if err != nil {
		panic(err)
	}

	hdr := jws.NewHeaders()
	for k, v := range headers {
		hdr.Set(k, v)
	}
	hdr.Set("jwk", jwkPublicKey)

	payloadBytes := toJSONBytes(payload)

	b, err := jws.Sign(
		payloadBytes,
		jws.WithKey(
			jwa.RS256,
			jwkPrivateKey,
			jws.WithProtectedHeaders(hdr),
		),
	)
	if err != nil {
		panic(err)
	}

	return string(b)
}
