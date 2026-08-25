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
	var mainApiUrl string
	// localhost должен быть в самом конце, это запасной вариант для разработки
	apiUrls := []string{"launcher.notex.su", "localhost"}

	for _, apiUrl := range apiUrls {
		if isReachable := utils.IsReachableServer(apiUrl, 8080, 1*time.Second); isReachable {
			if apiUrl == "localhost" {
				mainApiUrl = "http://" + apiUrl + ":8080"
				break
			}

			mainApiUrl = "https://" + apiUrl
			break
		}
	}

	if mainApiUrl == "" {
		return false
	}

	if strings.Contains(runtime.GOOS, "win") {
		FileExtension = ".exe"
	}

	DownloadUrl = mainApiUrl + "/download/"
	ClientsUrl = mainApiUrl + "/download/client/cached"
	AssetsUrl = mainApiUrl + "/download/caches/assets/"
	JavaUrl = mainApiUrl + "/download/updates/java/"
	LauncherComponentsUrl = DownloadUrl + "updates/launcher/components/"
	AuthlibUrl = mainApiUrl + "/update/authlib"
	GameFilesUpdateUrl = mainApiUrl + "/update/game_files"
	LauncherUpdateUrl = mainApiUrl + "/update/launcher"
	LauncherGuardUrl = mainApiUrl + "/update/launcheguard"
	LauncherCheckUpdateUrl = mainApiUrl + "/update/launcher/check"
	YggdrasilApiUrl = mainApiUrl + "/api/auth/yggdrasil"

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
