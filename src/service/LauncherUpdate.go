package service

import (
	"azoriumlauncher/src"
	"azoriumlauncher/src/utils"
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type LauncherUpdate struct{}

func (u *LauncherUpdate) CheckFilesForUpdate(ctx context.Context) {
	bodyBytes, _ := json.Marshal(src.LauncherUpdate)
	req, _ := http.NewRequest("POST", src.LauncherCheckUpdateUrl+"?checkType=files", bytes.NewReader(bodyBytes))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, _ := client.Do(req)

	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	filesCheckObj := struct {
		RuntimeZipIsNeeded   bool `json:"runtimeZipIsNeeded"`
		LauncherFileIsNeeded bool `json:"launcherFileIsNeeded"`
	}{}

	json.Unmarshal(body, &filesCheckObj)

	if filesCheckObj.RuntimeZipIsNeeded {
		u.DownloadRuntimeZip(ctx)
	}

	if filesCheckObj.LauncherFileIsNeeded {
		u.DownloadLauncher(ctx)
		return
	}

	cmd := exec.Command(src.ExecPath)
	if err := cmd.Start(); err != nil {
		return
	}

	runtime.Quit(ctx)
}

func (u *LauncherUpdate) DownloadRuntimeZip(ctx context.Context) {
	stage := utils.SetCurrentStage{Stage: "Установка Runtime", ShowProgress: true}

	reqBytes := fileUtils.DownloadBytesWithProgress(ctx, src.LauncherComponentsUrl+"runtime_dist.zip", stage, "GET", nil)

	runtime.LogInfo(ctx, src.LauncherComponentsUrl+"runtime_dist.zip")

	stage = utils.SetCurrentStage{Stage: "Обновление Runtime", ShowProgress: false}
	runtime.EventsEmit(ctx, "setCurrentStage", stage)

	fileUtils.CreateFileFromBytes(src.RuntimeZipPath, reqBytes)

	filepath.WalkDir(src.DistPath, func(path string, d os.DirEntry, err error) error {
		os.Remove(path)
		return nil
	})

	zipUtils.UnzipFromBytes(reqBytes, src.DistPath)
}

func (u *LauncherUpdate) DownloadLauncher(ctx context.Context) {
	systemInfo := systemUtils.GetSystemInfo()
	osInfo := systemInfo.OS + "-" + systemInfo.Architecture

	body := struct {
		OsInfo string `json:"osInfo"`
	}{
		OsInfo: osInfo,
	}

	bodyBytes, _ := json.Marshal(body)

	stage := utils.SetCurrentStage{Stage: "Установка лаунчера", ShowProgress: true}
	reqBytes := fileUtils.DownloadBytesWithProgress(ctx, src.LauncherUpdateUrl, stage, "POST", bodyBytes)

	stage = utils.SetCurrentStage{Stage: "Обновление лаунчера", ShowProgress: false}
	runtime.EventsEmit(ctx, "setCurrentStage", stage)

	reader, _ := zipUtils.ReadZipFromBytes(reqBytes)
	os.Rename(src.ExecPath, src.ExecPath+"old")

	for _, file := range reader.File {
		reader, _ := file.Open()

		fileBytes, _ := io.ReadAll(reader)
		reader.Close()

		err := os.WriteFile(src.ExecPath, fileBytes, 0775)
		if err != nil {
			runtime.LogError(ctx, err.Error())
		}
	}

	cmd := exec.Command(src.ExecPath, src.ExecPath+"old")
	if err := cmd.Start(); err != nil {
		return
	}

	runtime.Quit(ctx)
}

func (u *LauncherUpdate) CheckNeedUpdate() bool {
	bodyBytes, _ := json.Marshal(src.LauncherUpdate)
	req, _ := http.NewRequest("POST", src.LauncherCheckUpdateUrl+"?checkType=need", bytes.NewReader(bodyBytes))

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
