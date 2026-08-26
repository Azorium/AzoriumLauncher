package src

import (
	"azoriumlauncher/src/utils"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

type Consts struct{}

var ProjectName = "Azorium"

// UserResourcesApiUrl Ссылка на API, которое выдаёт скин и плащ игрока
var UserResourcesApiUrl = "http://localhost:3001"

var DownloadUrl string
var ClientsUrl string
var AssetsUrl string
var JavaUrl string
var AuthlibUrl string
var LauncherComponentsUrl string
var LauncherGuardUrl string
var GameFilesUpdateUrl string
var LauncherUpdateUrl string
var LauncherCheckUpdateUrl string
var YggdrasilApiUrl string
var LaunchServerApiUrl string

var RootPath string
var TmpPath string
var HashesPath string
var UpdatesPath string
var ClientsPath string
var AssetsPath string
var IndexesPath string
var ObjectsPath string
var JavaPath string
var AssetsHashPath string
var ClientsHashPath string
var AuthlibPath string
var LauncherGuardPath string
var RuntimePath string
var DistPath string
var RuntimeZipPath string

var ExecPath string
var User UserType
var FileExtension string
var LauncherUpdate LauncherUpdateType

type LauncherUpdateType struct {
	RuntimeZipHash   string `json:"runtimeZipHash"`
	LauncherFileHash string `json:"launcherFileHash"`
}

type UserType struct {
	Username string `json:"username"`
	Uuid     string `json:"uuid"`
	JWToken  string `json:"jwt_token"`
}

func (c *Consts) LoadConsts() bool {
	// localhost должен быть в самом конце, это запасной вариант для разработки
	apiUrls := []string{"launcher.projectname.ru", "localhost"}

	for _, apiUrl := range apiUrls {
		if isReachable := utils.IsReachableServer(apiUrl, 8080, 1*time.Second); isReachable {
			if apiUrl == "localhost" {
				LaunchServerApiUrl = "http://" + apiUrl + ":8080"
				break
			}

			LaunchServerApiUrl = "https://" + apiUrl
			break
		}
	}

	if LaunchServerApiUrl == "" {
		return false
	}

	if strings.Contains(runtime.GOOS, "win") {
		FileExtension = ".exe"
	}

	DownloadUrl = LaunchServerApiUrl + "/download/"
	ClientsUrl = LaunchServerApiUrl + "/download/client/cached"
	AssetsUrl = LaunchServerApiUrl + "/download/caches/assets/"
	JavaUrl = LaunchServerApiUrl + "/download/updates/java/"
	LauncherComponentsUrl = DownloadUrl + "updates/launcher/components/"
	AuthlibUrl = LaunchServerApiUrl + "/update/authlib"
	GameFilesUpdateUrl = LaunchServerApiUrl + "/update/game_files"
	LauncherUpdateUrl = LaunchServerApiUrl + "/update/launcher"
	LauncherGuardUrl = LaunchServerApiUrl + "/update/launcheguard"
	LauncherCheckUpdateUrl = LaunchServerApiUrl + "/update/launcher/check"
	YggdrasilApiUrl = LaunchServerApiUrl + "/api/auth/yggdrasil"

	var osUtils = utils.SystemUtils{}
	var hashUtils = utils.HashUtils{}
	var homePath, _ = osUtils.GetUserHomeDir()

	RootPath = filepath.Join(homePath, ProjectName+"Launcher")

	if strings.Contains(osUtils.GetSystemInfo().OS, "win") {
		RootPath = filepath.Join(homePath, "AppData", "Roaming", ProjectName+"Launcher")
	} else {
		RootPath = filepath.Join(homePath, ProjectName+"Launcher")
	}

	TmpPath = filepath.Join(RootPath, "tmp")
	HashesPath = filepath.Join(RootPath, "hashes")
	UpdatesPath = filepath.Join(RootPath, "updates")
	JavaPath = filepath.Join(UpdatesPath, "java")
	ClientsPath = filepath.Join(UpdatesPath, "clients")
	AssetsPath = filepath.Join(ClientsPath, "assets")
	IndexesPath = filepath.Join(AssetsPath, "indexes")
	ObjectsPath = filepath.Join(AssetsPath, "objects")
	AuthlibPath = filepath.Join(UpdatesPath, "authlib-injector.jar")
	LauncherGuardPath = filepath.Join(UpdatesPath, "LauncherGuard"+FileExtension)
	RuntimePath = filepath.Join(RootPath, "runtime")
	RuntimeZipPath = filepath.Join(RuntimePath, "runtime.zip")
	DistPath = filepath.Join(RuntimePath, "dist")

	AssetsHashPath = filepath.Join(HashesPath, "assets.json")
	ClientsHashPath = filepath.Join(HashesPath, "clients.json")

	ExecPath, _ = os.Executable()

	launcherFileHash, _ := hashUtils.Md5(ExecPath)
	runtimeZipHash, _ := hashUtils.Md5(RuntimeZipPath)

	LauncherUpdate = LauncherUpdateType{
		LauncherFileHash: launcherFileHash,
		RuntimeZipHash:   runtimeZipHash,
	}

	return true
}
