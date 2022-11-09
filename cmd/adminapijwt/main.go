package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/lestrrat-go/jwx/jwa"
	"github.com/lestrrat-go/jwx/jwk"
	"github.com/lestrrat-go/jwx/jws"
	"github.com/lestrrat-go/jwx/jwt"
	"sigs.k8s.io/yaml"
)

func main() {
	var projectIDFlag = flag.String("project-id", "", "Project ID")
	var jwkFlag = flag.String("jwk", "", "Path to the Admin API JWK. Either YAML or JSON")
	flag.Parse()

	f, err := os.Open(*jwkFlag)
	if err != nil {
		panic(err)
	}
	defer f.Close()

	yamlBytes, err := io.ReadAll(f)
	if err != nil {
		panic(err)
	}

	jsonBytes, err := yaml.YAMLToJSON(yamlBytes)
	if err != nil {
		panic(err)
	}

	jwkSet, err := jwk.ParseReader(bytes.NewReader(jsonBytes))
	if err != nil {
		panic(err)
	}
	key, _ := jwkSet.Get(0)

	now := time.Now().UTC()
	payload := jwt.New()
	_ = payload.Set(jwt.AudienceKey, *projectIDFlag)
	_ = payload.Set(jwt.IssuedAtKey, now.Unix())
	_ = payload.Set(jwt.ExpirationKey, now.Add(24*time.Hour).Unix())

	// The alg MUST be RS256.
	alg := jwa.RS256
	hdr := jws.NewHeaders()
	hdr.Set("typ", "JWT")
	hdr.Set("alg", alg.String())
	hdr.Set("kid", key.KeyID())

	buf, err := json.Marshal(payload)
	if err != nil {
		panic(err)
	}

	token, err := jws.Sign(buf, alg, key, jws.WithHeaders(hdr))
	if err != nil {
		panic(err)
	}

	fmt.Printf("%v\n", string(token))
}
