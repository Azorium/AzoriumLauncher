package service

import (
	"azoriumlauncher/src"
	"path/filepath"
)

type SettingsService struct {
	SettingsPath string
}

type SettingsObj struct {
	DedicatedRAMGB int              `json:"dedicatedRamGB"`
	Base           Base             `json:"base"`
	Profiles       ProfilesSettings `json:"profiles"`
}

type ProfilesSettings map[string]ProfileSettings

type ProfileSettings struct {
	OptionalMods `json:"optionalMods"`
}

type OptionalMods []Mod

type Mod struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	FileName    string `json:"fileName"`
	Value       bool   `json:"value"`
}

type Base struct {
	AutoClose BaseItem `json:"autoClose"`
	Debug     BaseItem `json:"debug"`
}

type BaseItem struct {
	Index       int    `json:"index"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Value       bool   `json:"value"`
}

func (s *SettingsService) NewSettings() *SettingsObj {
	return &SettingsObj{
		DedicatedRAMGB: 6,
		Base: Base{
			AutoClose: BaseItem{
				Index:       0,
				Name:        "Автоматическое завершение",
				Description: "После запуска игры лаунчер автоматически завершит свою работу",
				Value:       true,
			},
			Debug: BaseItem{
				Index:       1,
				Name:        "Режим отладки",
				Description: "Позволяет увидеть информацию о запуске игры и различных ошибках",
				Value:       false,
			},
		},
	}
}

func (s *SettingsService) CreateSettingsFile() {
	s.SettingsPath = filepath.Join(src.RootPath, "settings.json")

	if !fileUtils.Exist(s.SettingsPath) {
		so := s.NewSettings()
		fileUtils.CreateJsonFile(s.SettingsPath, so)
	}
}

func (s *SettingsService) SaveSettings(settings SettingsObj) {
	fileUtils.CreateJsonFile(s.SettingsPath, settings)
}
