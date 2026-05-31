package src

import (
	"azoriumlauncher-prestarter/src/utils"
	"os"
	"path/filepath"
	"strings"
)

type Consts struct{}

var DownloadUrl string
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

type UserType struct {
	Username string `json:"username"`
	Uuid     string `json:"uuid"`
	JWToken  string `json:"jwt_token"`
}

var User UserType

func (c *Consts) LoadConsts() {
	var osUtils = utils.SystemUtils{}
	var hashUtils = utils.HashUtils{}
	var homePath, _ = osUtils.GetUserHomeDir()

	DownloadUrl = "http://localhost:8080/download/"

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
