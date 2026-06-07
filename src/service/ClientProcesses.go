package service

import (
	"azoriumlauncher/src"
	"azoriumlauncher/src/utils"
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var systemUtils = utils.SystemUtils{}
var hashUtils = utils.HashUtils{}
var zipUtils = utils.ZipUtils{}
var fileWatcherUtils = utils.FileWatcher{}

type FileHashes map[string]map[string]string

type FilesToDelete struct {
	ToDelete []string `json:"toDelete"`
}

type UpdateRequest struct {
	ClientFolderName string            `json:"clientFolderName"`
	McVersion        string            `json:"mcVersion"`
	Date             int               `json:"date"`
	UpdateTarget     string            `json:"updateTarget"`
	Data             map[string]string `json:"data"`
	OptionalMods     OptionalMods      `json:"optionalMods"`
}

type Asset struct {
	Objects map[string]AssetObject `json:"objects"`
}

type AssetObject struct {
	Hash string `json:"hash"`
}

type Profile struct {
	McVersion     string  `json:"mcVersion"`
	LoaderType    string  `json:"loaderType"`
	LoaderVersion string  `json:"loaderVersion"`
	Backend       Backend `json:"backend"`
}

type Backend struct {
	FolderName  string          `json:"folderName"`
	JavaVersion string          `json:"javaVersion"`
	MainClass   string          `json:"mainClass"`
	Arguments   ClientArguments `json:"arguments"`
	Classpaths  Classpaths      `json:"classpaths"`
}

type ClientArguments struct {
	Game json.RawMessage `json:"game"`
	Jvm  []string        `json:"jvm"`
}

type Classpaths struct {
	Windows string `json:"windows"`
	Linux   string `json:"linux"`
	Macos   string `json:"macos"`
}

type ClientProcessesService struct {
	Profile    Profile
	ClientPath string
	FolderName string
	SystemInfo utils.SystemInfo
	Settings   SettingsObj
}

func (c *ClientProcessesService) NewClientProcesses(profile Profile) *ClientProcessesService {
	cps := &ClientProcessesService{
		Profile: profile,
	}

	settingsRaw := fileUtils.GetJsonObjFromFile(filepath.Join(src.RootPath, "settings.json"), nil)
	var settings SettingsObj
	json.Unmarshal(settingsRaw, &settings)

	cps.Settings = settings
	cps.FolderName = cps.Profile.Backend.FolderName
	cps.ClientPath = filepath.Join(src.ClientsPath, cps.FolderName)
	cps.SystemInfo = systemUtils.GetSystemInfo()

	return cps
}

func (c *ClientProcessesService) DownloadJava(ctx context.Context) {
	javaFolderName := fmt.Sprintf("java%s-%s-%s", c.Profile.Backend.JavaVersion, c.SystemInfo.OS, c.SystemInfo.Architecture)
	javaPathForClient := filepath.Join(src.JavaPath, javaFolderName)

	if !fileUtils.Exist(javaPathForClient) {
		stage := utils.SetCurrentStage{Stage: "Установка Java", ShowProgress: true}
		bytes := fileUtils.DownloadBytesWithProgress(ctx, src.JavaUrl+javaFolderName+".zip", stage, "GET", nil)

		stage = utils.SetCurrentStage{Stage: "Обработка Java", ShowProgress: false}
		runtime.EventsEmit(ctx, "setCurrentStage", stage)

		_, err := zipUtils.UnzipFromBytes(bytes, javaPathForClient)
		if err != nil {
			runtime.LogError(ctx, err.Error())
			return
		}
	}
}

func (c *ClientProcessesService) DownloadAsset(ctx context.Context) {
	if !fileUtils.Exist(filepath.Join(src.IndexesPath, c.Profile.McVersion+".json")) {
		stage := utils.SetCurrentStage{Stage: "Установка ассетов", ShowProgress: true}
		bytes := fileUtils.DownloadBytesWithProgress(ctx, src.AssetsUrl+c.Profile.McVersion+".zip", stage, "GET", nil)

		stage = utils.SetCurrentStage{Stage: "Обработка ассетов", ShowProgress: false}
		runtime.EventsEmit(ctx, "setCurrentStage", stage)

		_, err := zipUtils.UnzipFromBytes(bytes, src.AssetsPath)
		if err != nil {
			return
		}

		fileUtils.CreateJsonFile(src.AssetsHashPath, FileHashes{})
		return
	}

	c.updateAssets(ctx)
}

func (c *ClientProcessesService) DownloadClient(ctx context.Context) {
	c.downloadComponent(ctx, src.AuthlibPath, src.AuthlibUrl, filepath.Base(src.AuthlibPath), 1)
	c.downloadComponent(ctx, src.LauncherGuardPath, src.LauncherGuardUrl, filepath.Base(src.LauncherGuardPath), 2)

	stage := utils.SetCurrentStage{Stage: "Обработка компонентов", ShowProgress: false}
	runtime.EventsEmit(ctx, "setCurrentStage", stage)

	fileWatcherUtils.Run(ctx, src.LauncherGuardPath)

	if !fileUtils.Exist(c.ClientPath) {
		stage = utils.SetCurrentStage{Stage: "Установка Minecraft", ShowProgress: true}

		body := struct {
			ClientFolderName string       `json:"clientfolderName"`
			OptionalMods     OptionalMods `json:"optionalMods"`
		}{
			ClientFolderName: c.FolderName,
			OptionalMods:     c.Settings.Profiles[c.FolderName].OptionalMods,
		}

		bodyBytes, _ := json.Marshal(body)

		bytes := fileUtils.DownloadBytesWithProgress(ctx, src.ClientsUrl, stage, "GET", bodyBytes)

		stage = utils.SetCurrentStage{Stage: "Обработка Minecraft", ShowProgress: false}
		runtime.EventsEmit(ctx, "setCurrentStage", stage)

		_, err := zipUtils.UnzipFromBytes(bytes, c.ClientPath)
		if err != nil {
			return
		}
		return
	}

	c.updateClient(ctx)
}

func (c *ClientProcessesService) downloadComponent(ctx context.Context, path string, url string, fileName string, stageNum int) {
	downloadStageText := fmt.Sprintf("Установка компонентов: Стадия %d", stageNum)

	if !fileUtils.Exist(path) {
		stage := utils.SetCurrentStage{Stage: downloadStageText, ShowProgress: true}
		bytes := fileUtils.DownloadBytesWithProgress(ctx, src.DownloadUrl+"updates/"+fileName, stage, "GET", nil)

		fileUtils.CreateFile(path, bytes)
		return
	}

	stage := utils.SetCurrentStage{Stage: fmt.Sprintf("Проверка компонентов: Стадия %d", stageNum), ShowProgress: false}
	runtime.EventsEmit(ctx, "setCurrentStage", stage)

	hash, _ := hashUtils.Md5(path)

	body := struct {
		Hash          string `json:"hash"`
		FileExtension string `json:"fileExtension"`
	}{
		Hash:          hash,
		FileExtension: src.FileExtension,
	}
	bodyBytes, _ := json.Marshal(body)

	stage = utils.SetCurrentStage{Stage: downloadStageText, ShowProgress: true}
	bytes := fileUtils.DownloadBytesWithProgress(ctx, url, stage, "POST", bodyBytes)

	if len(bytes) > 0 {
		fileUtils.CreateFile(path, bytes)
	}
}

func (c *ClientProcessesService) updateClient(ctx context.Context) {
	fileHashes := c.addClientToManifest()

	requestBody := &UpdateRequest{
		ClientFolderName: c.FolderName,
		Date:             time.Now().Nanosecond(),
		UpdateTarget:     "client",
		Data:             fileHashes[c.FolderName],
		OptionalMods:     c.Settings.Profiles[c.FolderName].OptionalMods,
	}

	jsonData, _ := json.Marshal(requestBody)

	stage := utils.SetCurrentStage{Stage: "Обновление Minecraft", ShowProgress: true}
	bytes := fileUtils.DownloadBytesWithProgress(ctx, src.GameFilesUpdateUrl, stage, "POST", jsonData)

	stage = utils.SetCurrentStage{Stage: "Обработка Minecraft", ShowProgress: false}
	runtime.EventsEmit(ctx, "setCurrentStage", stage)

	if bytes != nil {
		clientExtractedPath := filepath.Join(src.TmpPath, "client_extracted")
		fileUtils.CreateFolder(clientExtractedPath)
		zipUtils.UnzipFromBytes(bytes, clientExtractedPath)
		c.deleteExtraneousFiles(filepath.Join(clientExtractedPath, "tmp"), c.ClientPath)
		c.moveFilesToFolder(clientExtractedPath)
		fileUtils.DeleteFile(clientExtractedPath)
	}

	return
}

func (c *ClientProcessesService) updateAssets(ctx context.Context) {
	fileHashes := c.addAssetToManifest()

	requestBody := &UpdateRequest{
		McVersion:    c.Profile.McVersion,
		Date:         time.Now().Nanosecond(),
		UpdateTarget: "assets",
		Data:         fileHashes[c.Profile.McVersion+".json"],
	}

	jsonData, _ := json.Marshal(requestBody)

	stage := utils.SetCurrentStage{Stage: "Обновление ассетов", ShowProgress: true}
	bytes := fileUtils.DownloadBytesWithProgress(ctx, src.GameFilesUpdateUrl, stage, "POST", jsonData)

	stage = utils.SetCurrentStage{Stage: "Обработка ассетов", ShowProgress: false}
	runtime.EventsEmit(ctx, "setCurrentStage", stage)

	if bytes != nil {
		assetsExtractedPath := filepath.Join(src.TmpPath, "assets_extracted")
		fileUtils.CreateFolder(assetsExtractedPath)
		zipUtils.UnzipFromBytes(bytes, assetsExtractedPath)
		c.deleteExtraneousFiles(filepath.Join(assetsExtractedPath, "tmp"), src.ObjectsPath)
		c.moveFilesToFolder(assetsExtractedPath)
		fileUtils.DeleteFile(assetsExtractedPath)
	}

	return
}

func (c *ClientProcessesService) deleteExtraneousFiles(folderWithExtractedFilesPath string, pathToDelete string) {
	entries, _ := os.ReadDir(folderWithExtractedFilesPath)

	var filesToDeleteData FilesToDelete

	for _, entry := range entries {
		if strings.Contains(entry.Name(), "files") && !entry.IsDir() {
			rawData := fileUtils.GetJsonObjFromFile(filepath.Join(folderWithExtractedFilesPath, entry.Name()), nil)
			json.Unmarshal(rawData, &filesToDeleteData)
			break
		}
	}

	for _, s := range filesToDeleteData.ToDelete {
		fileUtils.DeleteFile(filepath.Join(pathToDelete, s))
	}
}

func (c *ClientProcessesService) moveFilesToFolder(pathWithCopyFiles string) {
	filepath.WalkDir(pathWithCopyFiles, func(path string, d os.DirEntry, err error) error {
		if d.IsDir() || (strings.Contains(d.Name(), "files") && strings.HasSuffix(d.Name(), ".json")) {
			return err
		}

		pathWithoutCopyFolder, _ := strings.CutPrefix(path, pathWithCopyFiles)
		pathIntoCopyWithFile := filepath.Join(src.RootPath, pathWithoutCopyFolder)
		pathIntoCopyFileParent := filepath.Dir(pathIntoCopyWithFile)

		if !fileUtils.Exist(pathIntoCopyFileParent) {
			fileUtils.CreateFolder(pathIntoCopyFileParent)
		}

		os.Rename(path, pathIntoCopyWithFile)

		return nil
	})
}

func (c *ClientProcessesService) addAssetToManifest() FileHashes {
	rawJson := fileUtils.GetJsonObjFromFile(filepath.Join(src.IndexesPath, c.Profile.McVersion+".json"), nil)
	var versionManifestJsonData Asset
	json.Unmarshal(rawJson, &versionManifestJsonData)

	if !fileUtils.Exist(src.AssetsHashPath) {
		fileUtils.CreateJsonFile(src.AssetsHashPath, &FileHashes{})
	}

	rawJson = fileUtils.GetJsonObjFromFile(src.AssetsHashPath, nil)
	var manifestJsonData FileHashes
	json.Unmarshal(rawJson, &manifestJsonData)

	inner := make(map[string]string)

	for _, object := range versionManifestJsonData.Objects {
		substring := object.Hash[:2]
		assetPath := substring + "/" + object.Hash
		if fileUtils.Exist(filepath.Join(src.ObjectsPath, assetPath)) {
			inner[assetPath], _ = hashUtils.Md5(filepath.Join(src.ObjectsPath, assetPath))
		}
	}

	manifestJsonData[c.Profile.McVersion+".json"] = inner
	fileUtils.CreateJsonFile(src.AssetsHashPath, manifestJsonData)

	return manifestJsonData
}

func (c *ClientProcessesService) addClientToManifest() FileHashes {
	if !fileUtils.Exist(src.ClientsHashPath) {
		fileUtils.CreateJsonFile(src.ClientsHashPath, &FileHashes{})
	}

	rawJson := fileUtils.GetJsonObjFromFile(src.ClientsHashPath, nil)
	var manifestJsonData FileHashes
	json.Unmarshal(rawJson, &manifestJsonData)

	inner := make(map[string]string)

	filepath.WalkDir(c.ClientPath, func(path string, d os.DirEntry, err error) error {
		if d.IsDir() {
			return err
		}

		pathWithoutClient, _ := strings.CutPrefix(path, c.ClientPath+string(os.PathSeparator))
		inner[strings.ReplaceAll(pathWithoutClient, "\\", "/")], _ = hashUtils.Md5(path)
		return err
	})

	manifestJsonData[c.FolderName] = inner
	fileUtils.CreateJsonFile(src.ClientsHashPath, manifestJsonData)

	return manifestJsonData
}

func (c *ClientProcessesService) MinecraftStart(ctx context.Context) {
	stage := utils.SetCurrentStage{Stage: "Запуск Minecraft", ShowProgress: false}
	runtime.EventsEmit(ctx, "setCurrentStage", stage)

	commandGuard := "C:/Users/lost/soxr/files/GolandProjects/LauncherGuard/go_build_LauncherGuard.exe"
	javaBinName := "java"

	if systemUtils.GetSystemInfo().OS == "windows" {
		javaBinName = javaBinName + ".exe"
	}

	commandGame := filepath.Join(src.JavaPath, fmt.Sprintf("java%s-%s-%s", c.Profile.Backend.JavaVersion, systemUtils.GetSystemInfo().OS, systemUtils.GetSystemInfo().Architecture), "bin", javaBinName)

	if systemUtils.GetSystemInfo().OS == "linux" {
		os.Chmod(commandGame, 0755)
	}

	nativePath := c.getNativePath()
	var commandArgs []string

	commandArgs = append(commandArgs, commandGame)
	commandArgs = append(commandArgs,
		"-Xms1G",
		fmt.Sprintf("-Xmx%dG", c.Settings.DedicatedRAMGB),
		"-XX:-UseAdaptiveSizePolicy",
		"-XX:+DisableExplicitGC",
		"-XX:+UseG1GC",
		"-XX:G1HeapRegionSize=16M",
		"-XX:G1ReservePercent=20",
		"-XX:InitiatingHeapOccupancyPercent=15",
		"-XX:+ParallelRefProcEnabled",
		"-XX:+AlwaysPreTouch",
		"-XX:+UseStringDeduplication",
		"-XX:+OptimizeStringConcat",
		"-XX:+UseCompressedOops",
		"-XX:+UseCompressedClassPointers",
		"-Dfile.encoding=UTF-8",
		"-Djava.library.path="+nativePath,
	)

	commandArgs = append(commandArgs, fmt.Sprintf("-javaagent:%s=%s", src.AuthlibPath, src.YggdrasilApiUrl))

	jvmArgs := c.Profile.Backend.Arguments.Jvm
	if jvmArgs != nil {
		jvmArgsValues := make(map[string]string)
		jvmArgsValues["${natives_directory}"] = nativePath
		jvmArgsValues["${version_name}"] = fmt.Sprintf("forge-%s-%s-client", c.Profile.McVersion, c.Profile.LoaderVersion)
		jvmArgsValues["${library_directory}"] = filepath.Join(c.ClientPath, "libraries")
		jvmArgsValues["${classpath_separator}"] = string(os.PathListSeparator)
		jvmArgsValues["${launcher_name}"] = src.ProjectName + "Launcher"
		jvmArgsValues["${launcher_version}"] = "1.0.0"

		for i, jvmArg := range jvmArgs {
			for jvmArgValueKey, jvmArgValue := range jvmArgsValues {
				if strings.Contains(jvmArg, jvmArgValueKey) {
					jvmArgs[i] = strings.ReplaceAll(jvmArgs[i], jvmArgValueKey, jvmArgValue)
				}
			}
		}

		for _, arg := range jvmArgs {
			commandArgs = append(commandArgs, arg)
		}
	}

	commandArgs = append(commandArgs, "-cp")
	var classpath string
	switch osName := systemUtils.GetSystemInfo().OS; osName {
	case "windows":
		classpath = c.Profile.Backend.Classpaths.Windows
	case "linux":
		classpath = c.Profile.Backend.Classpaths.Linux
	case "darwin":
		classpath = c.Profile.Backend.Classpaths.Macos
	}

	classpath = strings.ReplaceAll(strings.ReplaceAll(classpath, "${client_path}", c.ClientPath), "${classpath_separator}", string(os.PathListSeparator))
	commandArgs = append(commandArgs, classpath)
	commandArgs = append(commandArgs, c.Profile.Backend.MainClass)

	gameArgsValues := make(map[string]string)
	gameArgsValues["${auth_player_name}"] = src.User.Username
	gameArgsValues["${version_name}"] = c.Profile.McVersion
	gameArgsValues["${game_directory}"] = c.ClientPath
	gameArgsValues["${assets_root}"] = filepath.Join(c.ClientPath, "..", "assets")
	gameArgsValues["${assets_index_name}"] = c.Profile.McVersion
	gameArgsValues["${auth_uuid}"] = src.User.Uuid
	gameArgsValues["${auth_access_token}"] = src.User.JWToken
	gameArgsValues["${user_properties}"] = "{}"
	gameArgsValues["${user_type}"] = "mojang"
	gameArgsValues["${version_type}"] = "release"
	gameArgsValues["${clientid}"] = "1"
	gameArgsValues["${auth_xuid}"] = "1"

	gameArgsRaw := c.Profile.Backend.Arguments.Game
	var gameArgsUnidentified interface{}
	var replacedGameArgsArray []string
	json.Unmarshal(gameArgsRaw, &gameArgsUnidentified)

	var argsArray []string
	switch v := gameArgsUnidentified.(type) {
	case string:
		argsArray = strings.Split(gameArgsUnidentified.(string), " ")
		replacedGameArgsArray = make([]string, len(v))
	case []interface{}:
		argsArray = make([]string, len(v))
		for i, item := range v {
			if s, ok := item.(string); ok {
				argsArray[i] = s
			}
		}
	}

	replacedGameArgsArray = make([]string, len(argsArray))

	for i, s := range argsArray {
		if !strings.HasPrefix(s, "${") {
			replacedGameArgsArray[i] = s
		} else {
			replacedGameArgsArray[i] = gameArgsValues[s]
		}
	}

	commandArgs = append(commandArgs, replacedGameArgsArray...)
	cmd := exec.CommandContext(ctx, commandGuard, commandArgs...)
	setProcessGroup(cmd)

	stdoutPipe, _ := cmd.StdoutPipe()
	stderrPipe, _ := cmd.StderrPipe()

	cmd.Dir = c.ClientPath
	cmd.Env = os.Environ()

	fileWatcherUtils.Close()
	err := cmd.Start()

	if err != nil {
		runtime.LogError(ctx, fmt.Errorf("ошибка выполнения: %w", err).Error())
	}

	debug := c.Settings.Base.Debug.Value

	var vers []string
	var trigger string
	vers = strings.Split(c.Profile.McVersion, ".")
	ver, _ := strconv.Atoi(vers[1])

	switch c.Profile.LoaderType {
	case "fabric":
		{
			trigger = "Backend library"
			break
		}
	case "forge":
		{
			if ver < 16 {
				trigger = "LWJGL Version"
				break
			}
			if ver < 18 {
				trigger = "SpongePowered MIXIN"
			}
			if ver >= 18 {
				trigger = "GL info"
			}
			break
		}
	case "neoforge":
		{
			trigger = "GL info"
		}
	}

	go func() {
		if debug {
			runtime.EventsEmit(ctx, "navToDebugPage", nil)
		}

		scanner := bufio.NewScanner(stdoutPipe)
		for scanner.Scan() {
			text := scanner.Text()
			if debug {
				runtime.EventsEmit(ctx, "setText", text)
			}

			if c.Settings.Base.AutoClose.Value {
				if strings.Contains(text, trigger) {
					runtime.Quit(ctx)
				}
			}

			runtime.LogInfo(ctx, "[STDOUT] "+text)
		}
		if err := scanner.Err(); err != nil {
			runtime.LogError(ctx, fmt.Sprintf("stdout scan error: %v", err))
		}
	}()

	go func() {
		scanner := bufio.NewScanner(stderrPipe)
		for scanner.Scan() {
			if debug {
				runtime.EventsEmit(ctx, "setText", scanner.Text())
			}
		}
		if err := scanner.Err(); err != nil {
			runtime.LogError(ctx, fmt.Sprintf("stderr scan error: %v", err))
		}
	}()

	runtime.EventsOn(ctx, "killProcess", func(optionalData ...interface{}) {
		err := killProcessGroup(cmd)
		if err != nil {
			runtime.LogInfo(ctx, fmt.Sprintf("не удалось завершить группу процессов: %v\n", err))
		}
		runtime.EventsEmit(ctx, "setText", "[Launcher] Запуск Minecraft остановлен")
		runtime.EventsOff(ctx, "killProcess")
	})
}

func (c *ClientProcessesService) getNativePath() string {
	nativesFolderPath := filepath.Join(c.ClientPath, "natives")
	var osName string
	if systemUtils.GetSystemInfo().OS == "darwin" {
		osName = "osx"
	} else {
		osName = systemUtils.GetSystemInfo().OS
	}

	//var arch string
	//if systemUtils.GetSystemInfo().Architecture == "amd64" {
	//	arch = "64"
	//} else {
	//	arch = "32"
	//}

	return fmt.Sprintf("%s%s%s-default", nativesFolderPath, string(os.PathSeparator), osName)
}

func (c *ClientProcessesService) CheckAndDeleteOptionalMods(ctx context.Context) {
	stage := utils.SetCurrentStage{Stage: "Обработка опциональных модов", ShowProgress: false}
	runtime.EventsEmit(ctx, "setCurrentStage", stage)

	for _, mod := range c.Settings.Profiles[c.FolderName].OptionalMods {
		if !mod.Value {
			fileUtils.DeleteFile(filepath.Join(c.ClientPath, "mods", mod.FileName))
		}
	}
}
