//go:build !dev

package reach

import (
	"azoriumlauncher/src"
	"azoriumlauncher/src/utils"
	"time"
)

func CheckHostReachable() bool {
	for _, url := range src.LSApiUrls {
		if isReachable := utils.IsReachableServer(url, 8080, 1*time.Second); isReachable {
			src.LaunchServerApiUrl = "https://" + url
			break
		}
	}

	if src.LaunchServerApiUrl == "" {
		return false
	}

	return true
}
