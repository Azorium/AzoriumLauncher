//go:build dev

package main

import (
	"embed"
	"io/fs"
)

//go:embed all:frontend/dist/dev
var embeddedAssets embed.FS

func getAssets() fs.FS {
	return embeddedAssets
}
