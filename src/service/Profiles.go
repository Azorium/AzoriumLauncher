package service

import (
	"azoriumlauncher/src"
	"azoriumlauncher/src/utils"
	"context"
	"encoding/json"
	"io"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type ProfilesService struct{}

var fileUtils = utils.FileUtils{}

func (p *ProfilesService) LoadProfiles(ctx context.Context) ([]map[string]interface{}, error) {
	bytes, err := fileUtils.DownloadFromUrl(src.DownloadUrl + "profiles/profiles.zip")

	if err != nil {
		runtime.LogError(ctx, err.Error())
		return nil, err
	}

	reader, err := zipUtils.ReadZipFromBytes(bytes)

	if err != nil {
		runtime.LogError(ctx, err.Error())
		return nil, err
	}

	var jsonsArray []map[string]interface{}

	for _, file := range reader.File {
		reader, _ := file.Open()

		fileBytes, _ := io.ReadAll(reader)
		reader.Close()

		rawObj := fileUtils.GetJsonObjFromFile("", fileBytes)
		var obj map[string]interface{}

		json.Unmarshal(rawObj, &obj)
		jsonsArray = append(jsonsArray, obj)
	}

	return jsonsArray, nil
}
