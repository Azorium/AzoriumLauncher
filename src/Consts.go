package src

import (
	"azoriumlauncher-prestarter/src/utils"
	"os"
	"path/filepath"
	"strings"
)

type Consts struct{}

var mainApiUrl = "http://localhost:8080"
var DownloadUrl = mainApiUrl + "/download/"
var ClientsUrl = mainApiUrl + "/download/client/cached"
var AssetsUrl = mainApiUrl + "/download/caches/assets/"
var JavaUrl = mainApiUrl + "/download/updates/java/"
var AuthlibUrl = mainApiUrl + "/download/updates/authlib-injector.jar"
var GameFilesUpdateUrl = mainApiUrl + "/update/game_files"
var LauncherUpdateUrl = mainApiUrl + "/update/launcher"
var LauncherCheckUpdateUrl = mainApiUrl + "/update/launcher/check"

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
var Hash string
var Path string
var User UserType

type UserType struct {
	Username string `json:"username"`
	Uuid     string `json:"uuid"`
	JWToken  string `json:"jwt_token"`
}

func (c *Consts) LoadConsts() {
	var osUtils = utils.SystemUtils{}
	var hashUtils = utils.HashUtils{}
	var homePath, _ = osUtils.GetUserHomeDir()

	RootPath = filepath.Join(homePath, "AzoriumLauncher")

	if strings.Contains(osUtils.GetSystemInfo().OS, "win") {
		RootPath = filepath.Join(homePath, "AppData", "Roaming", "AzoriumLauncher")
	} else {
		RootPath = filepath.Join(homePath, "AzoriumLauncher")
	}

	TmpPath = filepath.Join(RootPath, "tmp")
	HashesPath = filepath.Join(RootPath, "hashes")
	UpdatesPath = filepath.Join(RootPath, "updates")
	JavaPath = filepath.Join(UpdatesPath, "java")
	ClientsPath = filepath.Join(UpdatesPath, "clients")
	AssetsPath = filepath.Join(ClientsPath, "assets")
	IndexesPath = filepath.Join(AssetsPath, "indexes")
	ObjectsPath = filepath.Join(AssetsPath, "objects")

	AssetsHashPath = filepath.Join(HashesPath, "assets.json")
	ClientsHashPath = filepath.Join(HashesPath, "clients.json")

	Path, _ = os.Executable()
	Hash, _ = hashUtils.Md5(Path)
}
