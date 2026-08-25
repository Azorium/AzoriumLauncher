package main

import (
	"azoriumlauncher/src"
	"fmt"
	"os"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

func main() {
	app := NewApp()

	var width int
	var height int

	if StartPage == "update" {
		width = 800
		height = 500
	} else {
		width = 1100
		height = 620
	}

	err := wails.Run(&options.App{
		Title:         src.ProjectName + "Launcher",
		DisableResize: true,
		Width:         width,
		Frameless:     true,
		Height:        height,
		AssetServer: &assetserver.Options{
			Assets: getAssets(),
		},
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 0},
		Windows: &windows.Options{
			WebviewUserDataPath:               fmt.Sprintf("C:\\Users\\%s\\AppData\\Roaming\\%sLauncher", os.Getenv("USERNAME"), src.ProjectName),
			WebviewIsTransparent:              true,
			WindowIsTranslucent:               true,
			BackdropType:                      windows.None,
			DisableFramelessWindowDecorations: true,
		},
		Mac: &mac.Options{
			TitleBar:             mac.TitleBarHidden(),
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
		},
		Linux: &linux.Options{
			WindowIsTranslucent: true,
			WebviewGpuPolicy:    linux.WebviewGpuPolicyNever,
		},
		OnStartup: app.startup,
		Bind: []interface{}{
			app,
		},
		Debug: options.Debug{
			OpenInspectorOnStartup: true,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
