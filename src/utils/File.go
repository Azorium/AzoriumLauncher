package utils

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type FileUtils struct{}

type ProgressReader struct {
	r          io.Reader
	total      int64
	loaded     int64
	onProgress func(loaded, total int64)
}

func (pr *ProgressReader) Read(p []byte) (int, error) {
	n, err := pr.r.Read(p)
	pr.loaded += int64(n)
	if pr.onProgress != nil {
		pr.onProgress(pr.loaded, pr.total)
	}
	return n, err
}

type SetCurrentStage struct {
	Stage        string `json:"stage"`
	ShowProgress bool   `json:"showProgress"`
}

func (f *FileUtils) CreateFolder(path string) error {
	err := os.MkdirAll(path, 0755)

	if err != nil {
		return fmt.Errorf("не удалось создать папку: %w", err)
	}

	return nil
}

func (f *FileUtils) Exist(path string) bool {
	_, err := os.Stat(path)
	if err != nil {
		return false
	}

	return !os.IsNotExist(err)
}

func (f *FileUtils) CreateJsonFile(pathToSave string, jsonObj interface{}) {
	data, err := json.MarshalIndent(jsonObj, "", "   ")
	if err != nil {
		panic(err)
	}

	err = os.WriteFile(pathToSave, data, 0644)
	if err != nil {
		panic(err)
	}
}

func (f *FileUtils) GetJsonObjFromFile(pathToFile string, bytes []byte) json.RawMessage {
	var data []byte

	if bytes == nil {
		data, _ = os.ReadFile(pathToFile)
	} else {
		data = bytes
	}

	var obj json.RawMessage
	err := json.Unmarshal(data, &obj)

	if err != nil {
		return nil
	}

	return obj
}

func (f *FileUtils) DeleteFile(pathToFile string) error {
	err := os.RemoveAll(pathToFile)
	if err != nil {
		return err
	}
	return nil
}

func (f *FileUtils) DownloadFromUrl(url string) ([]byte, error) {
	res, err := http.Get(url)

	if err != nil {
		return nil, fmt.Errorf("download: http: %s", err)
	}

	bytes, err := io.ReadAll(res.Body)

	if err != nil {
		return nil, fmt.Errorf("download: read: %s", err)
	}

	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("bad status: %s", res.Status)
	}

	return bytes, nil
}

func (f *FileUtils) CreateFileFromBytes(filePath string, bytes []byte) error {
	_, err := os.Create(filePath)

	if err != nil {
		return fmt.Errorf("create: create: %s", err)
	}

	err = os.WriteFile(filePath, bytes, 0775)

	if err != nil {
		return fmt.Errorf("create: write: %s", err)
	}

	return nil
}

func (f *FileUtils) DownloadBytesWithProgress(ctx context.Context, url string, stage SetCurrentStage, reqType string, bodyJsonData []byte) []byte {

	req, err := http.NewRequest(reqType, url, bytes.NewReader(bodyJsonData))
	if err != nil {
		runtime.LogInfo(ctx, err.Error())
		panic(err)
	}

	if reqType == "POST" {
		req.Header.Set("Content-Type", "application/json")
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		runtime.LogInfo(ctx, err.Error())
		panic(err)
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			runtime.LogInfo(ctx, err.Error())
		}
	}(resp.Body)

	totalSize := resp.ContentLength
	if totalSize <= 0 {
		fmt.Println("Content-Length неизвестен, прогресс будет без общего размера")
	}

	if totalSize < 200 {
		stage.ShowProgress = false
		runtime.EventsEmit(ctx, "setCurrentStage", stage)
		return nil
	}

	progressReader := &ProgressReader{
		r:     resp.Body,
		total: totalSize,
		onProgress: func(loaded, total int64) {

			percent := int(float64(loaded) / float64(total) * 100)
			concurrentPercentValue := 0

			if percent != concurrentPercentValue {
				concurrentPercentValue = percent
				runtime.EventsEmit(ctx, "setProgress", percent)
			}
		},
	}

	runtime.EventsEmit(ctx, "setCurrentStage", stage)
	runtime.EventsEmit(ctx, "setProgress", 0)

	bodyBytes, err := io.ReadAll(progressReader)
	if err != nil {
		runtime.LogInfo(ctx, err.Error())
		panic(err)
	}

	return bodyBytes
}
