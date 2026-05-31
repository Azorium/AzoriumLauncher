package utils

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"os"
	"path/filepath"
)

type ZipUtils struct{}

func (z *ZipUtils) Unzip(zipPath, destDir string) (string, error) {
	reader, err := zip.OpenReader(zipPath)
	if err != nil {
		return "", fmt.Errorf("не удалось открыть архив для чтения: %w", err)
	}
	defer reader.Close()

	for _, file := range reader.File {
		filePath := filepath.Join(destDir, file.Name)

		if file.FileInfo().IsDir() {
			if err := os.MkdirAll(filePath, os.ModePerm); err != nil {
				return "", fmt.Errorf("не удалось создать директорию: %w", err)
			}
			continue
		}

		if err := os.MkdirAll(filepath.Dir(filePath), os.ModePerm); err != nil {
			return "", fmt.Errorf("не удалось создать родительские директории: %w", err)
		}

		rc, err := file.Open()
		if err != nil {
			return "", fmt.Errorf("не удалось открыть файл '%s' в архиве: %w", file.Name, err)
		}

		outFile, err := os.Create(filePath)
		if err != nil {
			rc.Close()
			return "", fmt.Errorf("не удалось создать файл '%s': %w", filePath, err)
		}

		_, err = io.Copy(outFile, rc)
		outFile.Close()
		rc.Close()

		if err != nil {
			return "", fmt.Errorf("ошибка при распаковке файла '%s': %w", file.Name, err)
		}
	}

	return fmt.Sprintf("Архив успешно распакован в: %s", destDir), nil
}

func (z *ZipUtils) ReadZipFromBytes(data []byte) (*zip.Reader, error) {
	readerAt := bytes.NewReader(data)

	return zip.NewReader(readerAt, int64(len(data)))
}

func (z *ZipUtils) UnzipFromBytes(bytes []byte, destDir string) (string, error) {
	reader, err := z.ReadZipFromBytes(bytes)

	if err != nil {
		return "", fmt.Errorf("не удалось открыть архив для чтения: %w", err)
	}

	for _, file := range reader.File {
		filePath := filepath.Join(destDir, file.Name)

		if file.FileInfo().IsDir() {
			if err := os.MkdirAll(filePath, os.ModePerm); err != nil {
				return "", fmt.Errorf("не удалось создать директорию: %w", err)
			}
			continue
		}

		if err := os.MkdirAll(filepath.Dir(filePath), os.ModePerm); err != nil {
			return "", fmt.Errorf("не удалось создать родительские директории: %w", err)
		}

		rc, err := file.Open()
		if err != nil {
			return "", fmt.Errorf("не удалось открыть файл '%s' в архиве: %w", file.Name, err)
		}

		outFile, err := os.Create(filePath)
		if err != nil {
			rc.Close()
			return "", fmt.Errorf("не удалось создать файл '%s': %w", filePath, err)
		}

		_, err = io.Copy(outFile, rc)
		outFile.Close()
		rc.Close()

		if err != nil {
			return "", fmt.Errorf("ошибка при распаковке файла '%s': %w", file.Name, err)
		}
	}

	return fmt.Sprintf("Архив успешно распакован в: %s", destDir), nil
}
