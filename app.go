package main

import (
	"azoriumlauncher/src"
	"azoriumlauncher/src/service"
	"azoriumlauncher/src/utils"
	"context"
	"fmt"
	"os"
	"os/exec"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var fileUtils = utils.FileUtils{}
var systemUtils = utils.SystemUtils{}
var profilesService = service.ProfilesService{}
var settingsService = service.SettingsService{}
var clientProcessesService = service.ClientProcessesService{}
var launcherUpdateService = service.LauncherUpdate{}
var consts = src.Consts{}
var StartPage string
var isReachableServer bool

type App struct {
	ctx context.Context
}

func NewApp() *App {
	isReachableServer = consts.LoadConsts()
	if isReachableServer {
		if update := launcherUpdateService.CheckUpdate(src.Hash); update {
			StartPage = "update"
		} else {
			StartPage = "main"
		}
	} else {
		StartPage = "error"
		return &App{}
	}

	fileUtils.CreateFolder(src.RootPath)
	fileUtils.CreateFolder(src.UpdatesPath)
	fileUtils.CreateFolder(src.HashesPath)
	fileUtils.CreateFolder(src.TmpPath)
	fileUtils.CreateFolder(src.JavaPath)
	fileUtils.CreateFolder(src.ClientsPath)
	fileUtils.CreateFolder(src.AssetsPath)
	fileUtils.CreateFolder(src.ObjectsPath)
	fileUtils.CreateFolder(src.IndexesPath)
	settingsService.CreateSettingsFile()

	return &App{}
}

func (a *App) startup(ctx context.Context) {
	if len(os.Args) > 1 {
		os.Remove(os.Args[1])
	}

	a.ctx = ctx

	if runtime.Environment(a.ctx).BuildType == "dev" {
		if !isReachableServer {
			return
		}

		StartPage = "main"
		runtime.WindowSetSize(a.ctx, 1200, 720)
		runtime.WindowCenter(a.ctx)
	}
}

func (a *App) GetStartPage() string {
	return StartPage
}

func (a *App) GetProjectName() string {
	return src.ProjectName
}

func (a *App) OpenLauncherRootFolder() error {
	var cmd *exec.Cmd
	switch systemUtils.GetSystemInfo().OS {
	case "windows":
		cmd = exec.Command("explorer", src.RootPath)
	case "darwin":
		cmd = exec.Command("open", src.RootPath)
	case "linux":
		cmd = exec.Command("xdg-open", src.RootPath)
	default:
		return fmt.Errorf("неподдерживаемая операционная система: %s", systemUtils.GetSystemInfo().OS)
	}

	err := cmd.Start()
	if err != nil {
		return fmt.Errorf("не удалось открыть папку '%s': %w", src.RootPath, err)
	}
	return nil
}

func (a *App) GetProfiles() ([]map[string]interface{}, error) {
	return profilesService.LoadProfiles(a.ctx)
}

func (a *App) GetSettings() interface{} {
	return fileUtils.GetJsonObjFromFile(settingsService.SettingsPath, nil)
}

func (a *App) GetRootPath() string {
	return src.RootPath
}

func (a *App) SaveSettings(s service.SettingsObj) {
	settingsService.SaveSettings(s)
}

func (a *App) StartClientProcesses(profile service.Profile) {
	clientProcesses := clientProcessesService.NewClientProcesses(profile)
	clientProcesses.DownloadJava(a.ctx)
	clientProcesses.DownloadAsset(a.ctx)
	clientProcesses.DownloadClient(a.ctx)
	clientProcesses.CheckAndDeleteOptionalMods(a.ctx)
	clientProcesses.MinecraftStart(a.ctx)
	runtime.EventsEmit(a.ctx, "offDownloadBytesEvents")
}

func (a *App) SetUser(user src.UserType) {
	src.User = user
}

func (a *App) LauncherUpdateGO() {
	launcherUpdateService.DownloadLauncher(a.ctx)
	runtime.EventsEmit(a.ctx, "offLUEvents")
}
