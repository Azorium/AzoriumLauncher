//go:build dev

package reach

import (
	"azoriumlauncher/src"
)

func CheckHostReachable() bool {
	src.LaunchServerApiUrl = "http://localhost:8080"

	return true
}
