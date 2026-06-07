//go:build windows

package service

import (
	"fmt"
	"os/exec"
	"strconv"
	"syscall"
)

func setProcessGroup(cmd *exec.Cmd) {
	cmd.SysProcAttr = &syscall.SysProcAttr{
		CreationFlags: 0x08000000,
	}
}

func killProcessGroup(cmd *exec.Cmd) error {
	pid := cmd.Process.Pid

	taskkill := exec.Command("taskkill", "/F", "/T", "/PID", strconv.Itoa(pid))
	if err := taskkill.Run(); err != nil {
		return fmt.Errorf("taskkill failed: %w", err)
	}
	return nil
}
