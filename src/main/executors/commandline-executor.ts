import { executeCommand } from "./command-executor";
import { MacOsShell, WindowsShell } from "../plugins/commandline-plugin/shells";

const unsupportedShellRejection = (shell: WindowsShell|MacOsShell) => {
    return Promise.reject(`Unsupported shell: ${shell.toString()}`);
};

export const macOsCommandLineExecutor = (command: string, shell: MacOsShell): Promise<void> => {
    let osaScript: string;
    switch (shell) {
        case MacOsShell.Terminal:
            osaScript = `
                tell application "Terminal"
                    if not (exists window 1) then reopen
                        activate
                    do script "${command}" in window 1
                end tell
                `;
            break;
        default:
            return unsupportedShellRejection(shell);
    }

    return executeCommand(`osascript -e '${osaScript}'`);
};

export const windowsCommandLineExecutor = (command: string, shell: WindowsShell): Promise<void> => {
    switch (shell) {
        case WindowsShell.Powershell:
            return executeCommand(`start powershell -NoExit -Command "&${command}"`);
        case WindowsShell.Cmd:
            return executeCommand(`start cmd.exe /k "${command}"`);
        default:
            return unsupportedShellRejection(shell);
    }
};
