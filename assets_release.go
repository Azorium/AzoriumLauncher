//go:build !dev

package main

import (
	"azoriumlauncher/src"
	"embed"
	"io/fs"
	"os"
	"path/filepath"
)

//go:embed all:frontend/dist/release
var embeddedAssets embed.FS

func getAssets() fs.FS {
	var assets fs.FS

	if _, err := os.Stat(
		filepath.Join(src.RuntimePath, "runtime.zip"),
	); err == nil && !isNeedUpdate {
		assets = os.DirFS(src.DistPath)
	} else {
		assets = embeddedAssets
	}

	return assets
}
