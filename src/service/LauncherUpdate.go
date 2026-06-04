package service

import (
	"azoriumlauncher/src"
	"azoriumlauncher/src/utils"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type LauncherUpdate struct{}

func (u *LauncherUpdate) DownloadLauncher(ctx context.Context) {
	systemInfo := systemUtils.GetSystemInfo()
	osInfo := systemInfo.OS + "-" + systemInfo.Architecture

	body := struct {
		OsInfo string `json:"osInfo"`
	}{
		OsInfo: osInfo,
	}

	bodyBytes, _ := json.Marshal(body)

	stage := utils.SetCurrentStage{Stage: "Установка обновлений", ShowProgress: true}
	bytes := fileUtils.DownloadBytesWithProgress(ctx, src.LauncherUpdateUrl, stage, "POST", bodyBytes)

	stage = utils.SetCurrentStage{Stage: "Обновление лаунчера", ShowProgress: false}
	runtime.EventsEmit(ctx, "setCurrentStage", stage)

	reader, _ := zipUtils.ReadZipFromBytes(bytes)
	os.Rename(src.Path, src.Path+"old")

	for _, file := range reader.File {
		reader, _ := file.Open()

		fileBytes, _ := io.ReadAll(reader)
		reader.Close()

		err := os.WriteFile(src.Path, fileBytes, 0775)
		if err != nil {
			runtime.LogError(ctx, err.Error())
		}
	}

	cmd := exec.Command(src.Path, src.Path+"old")
	if err := cmd.Start(); err != nil {
		return
	}

	runtime.Quit(ctx)
}

func (u *LauncherUpdate) CheckUpdate(hash string) bool {
	req, _ := http.NewRequest("POST", src.LauncherCheckUpdateUrl, strings.NewReader(hash))

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var bodyVar bool
	json.Unmarshal(body, &bodyVar)

	return bodyVar
}
