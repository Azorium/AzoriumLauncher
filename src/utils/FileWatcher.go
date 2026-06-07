package utils

import (
	"context"
	"fmt"

	"github.com/fsnotify/fsnotify"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var watcher *fsnotify.Watcher

type FileWatcher struct{}

func (f *FileWatcher) Run(ctx context.Context, guardFilePath string) {
	watcher, _ = fsnotify.NewWatcher()
	watcher.Add(guardFilePath)

	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}

				if event.Has(fsnotify.Write) {
					runtime.Quit(ctx)
				}
				if event.Has(fsnotify.Create) {
					runtime.Quit(ctx)
				}
				if event.Has(fsnotify.Remove) {
					runtime.Quit(ctx)
				}
				if event.Has(fsnotify.Rename) {
					runtime.Quit(ctx)
				}

			case err, ok := <-watcher.Errors:
				if !ok {
					fmt.Println(err.Error())
				}
				fmt.Println("Error:", err)
			}
		}

	}()
}

func (f *FileWatcher) Close() {
	watcher.Close()
}
