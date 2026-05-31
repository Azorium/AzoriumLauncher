package utils

import (
	"fmt"
	"os"
	"runtime"
)

type SystemUtils struct{}

type SystemInfo struct {
	OS           string `json:"os"`
	Architecture string `json:"architecture"`
}

func (a *SystemUtils) GetSystemInfo() SystemInfo {
	return SystemInfo{
		OS:           runtime.GOOS,
		Architecture: runtime.GOARCH,
	}
}

func (a *SystemUtils) GetUserHomeDir() (string, error) {
	path, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("не удалось получить домашнюю директорию: %w", err)
	}
	return path, err
}
