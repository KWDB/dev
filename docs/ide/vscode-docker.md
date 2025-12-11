---
sidebar_position: 2
id: vscode-docker
---
# VS Code Dev Containers 开发环境配置

## 功能介绍

VS Code Dev Containers 扩展允许您使用 Docker 容器作为功能齐全的开发环境。它可以让您在本地运行应用程序，同时将您的代码与本地文件系统隔离，从而实现：

- **环境一致性**：确保团队成员在相同的开发环境中工作，避免因环境差异导致的问题。
- **快速上手**：新成员可以快速启动和运行项目，无需在本地配置复杂的开发环境。
- **多项目隔离**：在不同项目之间轻松切换，每个项目都有自己独立的开发环境。
- **访问本地文件**：容器内的开发环境可以无缝访问本地文件系统中的代码。

## 使用步骤

### 1. 安装必备软件

在开始之前，请确保您已在本地安装并配置好以下软件：

- **Visual Studio Code**：最新版本。
- **Docker Desktop**：适用于 Windows、macOS 或 Linux 的最新版本。
- **Remote - Containers 扩展**：在 VS Code 扩展市场中搜索并安装 `ms-vscode-remote.remote-containers`。

### 2. 配置 `.devcontainer` 和 `.vscode`

KWDB 社区提供了一个基于 Docker 的开发环境镜像 `kwdb/devcontainer` 和相应的 `devcontainer.json`、`launch.json`  配置文件。

:::tip
如果您想自定义开发环境，也可以基于该镜像进行定制。
:::

在您的项目根目录下，创建一个名为 `.devcontainer` 的文件夹，并在其中添加以下文件：

- `devcontainer.json`：定义开发容器的配置，如使用的 Docker 镜像、扩展、端口转发等。

[下载 devcontainer.json](./assets/devcontainer.json)

```json title="devcontainer.json"
// For format details, see https://aka.ms/devcontainer.json. For config options, see the
// README at: https://github.com/devcontainers/templates/tree/main/src/javascript-node
{
	"name": "KWDB",
	// Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile
	"image": "kwdb/devcontainer",

	// Features to add to the dev container. More info: https://containers.dev/features.
	// "features": {},

	// Configure tool-specific properties.
	"customizations": {
		// Configure properties specific to VS Code.
		"vscode": {
			"settings": {},
			"extensions": [
				"streetsidesoftware.code-spell-checker",
				"ms-vscode.cpptools",
				"ms-vscode.cpptools-extension-pack",
				"golang.go@0.37.0"
			]
		}
	},

	"workspaceMount": "source=${localWorkspaceFolder}/,target=/home/inspur/src/gitee.com/kwbasedb,type=bind,consistency=cached",
	"workspaceFolder": "/home/inspur/src/gitee.com/kwbasedb",

	"containerEnv": {
		// Set environment variables here. More info: https://aka.ms/devcontainers-remote-env
		"GOPATH": "/home/inspur",
		"GO111MODEL": "off"
	},
	// Use 'forwardPorts' to make a list of ports inside the container available locally.
	"forwardPorts": [
		26257, // kwbase SQL port
		8080   // kwbase HTTP/RESTful port
	],

	// Use 'portsAttributes' to set default properties for specific forwarded ports. 
	// More info: https://containers.dev/implementors/json_reference/#port-attributes
	"portsAttributes": {
		"26257": {
			"label": "kwbase SQL"
		},
		"8080": {
			"label": "kwbase HTTP/RESTful"
		}
	},

	// Uncomment to connect as root instead. More info: https://aka.ms/dev-containers-non-root.
	"remoteUser": "root",
	"privileged": true
}

```

在您的项目根目录下，创建一个名为 `.vscode` 的文件夹，并在其中添加以下文件：

- `launch.json`：定义调试配置，如启动参数、环境变量等。

[下载 launch.json](./assets/launch.json)

```json title="launch.json"
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "(gdb) Attach AE V1.2",
            "type": "cppdbg",
            "request": "attach",
            "program": "${workspaceRoot}/install/bin/kwdbts_server",
            "MIMode": "gdb",
            "setupCommands": [
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                },
                {
                    "description": "Set Disassembly Flavor to Intel",
                    "text": "-gdb-set disassembly-flavor intel",
                    "ignoreFailures": true
                }
            ]
        },
        {
            "name": "(gdb) Attach kwbase",
            "type": "cppdbg",
            "request": "attach",
            "program": "${workspaceRoot}/install/bin/kwbase",
            "MIMode": "gdb",
            "setupCommands": [
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                },
                {
                    "description": "Set Disassembly Flavor to Intel",
                    "text": "-gdb-set disassembly-flavor intel",
                    "ignoreFailures": true
                }
            ]
        },
        {
            "name": "(Go) Launch kwbase V2.0",
            "type": "go",
            "request": "launch",
            "cwd": "${workspaceRoot}/install/bin",
            "mode": "exec",
            "env": {"KWDB_ROOT":"${workspaceRoot}/install",
            "LD_LIBRARY_PATH":"/usr/local/lib:${workspaceRoot}/install/lib"},
            "program": "${workspaceRoot}/install/bin/kwbase",
            "args": ["start",
                    "--insecure",
                    "--listen-addr=0.0.0.0:20257",
                    "--http-addr=0.0.0.0:20080",
                    "--store=/home2/dev2/kwbase_data/n31",
                    "--join=0.0.0.0:20257"
                    ],
            "dlvFlags": [
                        "--check-go-version=false"
                    ]
        },
        {
            "name": "(gdb) Launch kwbase V2.0",
            "type": "cppdbg",
            "request": "launch",
            "program": "${workspaceRoot}/install/bin/kwbase",
            "args": ["start",
                    "--insecure",
                    "--listen-addr=0.0.0.0:20257",
                    "--http-addr=0.0.0.0:20080",
                    "--store=/home2/dev2/kwbase_data/n31",
                    "--join=0.0.0.0:20257"
                    ],
            "stopAtEntry": false,
            "cwd": "${workspaceRoot}/install/bin",
            "environment": [{"name":"KWDB_ROOT", "value":"${workspaceRoot}/install"},
                            {"name":"LD_LIBRARY_PATH", "value":"${workspaceRoot}/install/lib"}],
            "externalConsole": false,
            "MIMode": "gdb",
            "setupCommands": [
                //{"text": "set detach-on-fork off"},
                //{"text": "set follow-fork-mode child"},
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                },
                {
                    "description": "Set Disassembly Flavor to Intel",
                    "text": "-gdb-set disassembly-flavor intel",
                    "ignoreFailures": true
                }
            ]
        },
        {
            "name": "(Go) Attach to Process",
            "type": "go",
            "request": "attach",
            "mode": "local",
            "processId": 0
        }
]
}
```

### 3. 启动开发容器

1. **打开项目**：在 VS Code 中打开您的项目文件夹。
2. **启动容器**：
   - 点击 VS Code 左下角的小箭头图标（正常情况下不点击图标也会自动弹出面板）。
   - 在弹出的命令面板中选择 **"Reopen in Container"**。
   - VS Code 将根据 `.devcontainer` 中的配置构建并启动开发容器。

首次启动可能需要一些时间，因为需要下载 Docker 镜像和构建环境。

### 4. 在容器中开发

容器启动后，VS Code 会自动连接到容器环境。您可以像在本地一样编辑代码、使用终端、调试应用程序。所有操作都在容器内执行，但您的代码文件仍然保存在本地文件系统中。

### 5. 在容器中调试

在 `launch.json` 中，我们已经预配置了多个调试配置，包括 Go 和 C++ 的启动和附加调试。您可以通过以下步骤使用这些配置：

1. 点击 VS Code 左侧的 `运行和调试` 按钮（或使用快捷键 `Ctrl+Shift+D`）
2. 在顶部下拉菜单中选择合适的调试配置
3. 点击绿色的运行按钮或按 `F5` 开始调试

所有调试配置都已针对容器环境进行了优化，可以直接使用。

## 常见问题解答 (FAQ)

**Q1: 如何在容器中访问本地文件？**

A1: VS Code Dev Containers 会自动将您的项目文件夹挂载到容器中，您可以在容器内直接访问和修改这些文件。

**Q2: 如何添加更多的 VS Code 扩展到开发环境中？**

A2: 在 `devcontainer.json` 文件的 `extensions` 数组中添加您需要的扩展 ID。

**Q3: 如何解决容器构建失败的问题？**

A3: 检查 `devcontainer.json` 中的配置是否正确。查看 VS Code 的输出日志，通常会提供详细的错误信息。

## 相关配置说明

- **`forwardPorts`**：将容器内的端口转发到本地，方便在本地浏览器中访问应用程序。
- **`postCreateCommand`**：在容器创建后自动执行的命令，如安装依赖项。
- **`mounts`**：除了项目文件夹外，还可以挂载其他本地目录到容器中。

有关更多高级配置，请参阅 [VS Code Dev Containers 官方文档](https://code.visualstudio.com/docs/remote/containers)。
