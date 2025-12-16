---
title: 在 MacOS 使用 Orbstack 快速搭建 KWDB 开发环境
id: orbstack
sidebar_position: 3
---

本文介绍如何在 macOS 上借助 Orbstack 一键创建一台可用于 KWDB 源码编译与调试的 Ubuntu 开发环境。  

## Orbstack

[Orbstack](https://orbstack.dev/) 是一个功能强大的 macOS 虚拟机管理工具，支持 AMD64 和 ARM64 架构。它提供了简单的 GUI 界面，方便用户创建、管理和操作虚拟机。本文采用 Orbstack 创建一台 Ubuntu 22.04 虚拟机，用于编译和调试 KWDB 源码。

### 安装

1. 可以访问 [Orbstack 官网](https://orbstack.dev/)，下载并安装最新版本的 Orbstack。  
2. 安装完成后，启动 Orbstack，它会自动配置必要的网络和存储。
3. 或者采用 `brew install orbstack` 安装 Orbstack。

## Cloud-init

[Cloud-init](https://cloudinit.readthedocs.io) 是一个用于初始化 Linux 虚拟机的工具，它可以在虚拟机启动时自动执行一系列配置任务。KWDB 社区准备了一份 `kwdb.yaml` 标准配置文件，主要完成三件事：

1. 配置阿里云 Ubuntu 软件源（兼容 amd64 与 arm64 架构）。  
2. 安装编译和运行 KWDB 所需的基础依赖。  
3. 自动安装编译需要的 Go、CMake，并设置环境变量。

[下载 kwdb.yaml](./assets/kwdb.yaml)

## 在 Orbstack 中创建 KWDB 开发虚拟机

在 Orbstack 中创建 KWDB 开发虚拟机的步骤如下：

1. 打开 Orbstack，点击创建新的 Linux 虚拟机（选择 Ubuntu 22.04 LTS 版本）。  
2. 在高级设置（Advanced）Cloud-init user data，选择「Select User Data」，指向本地的 `kwdb.yaml`。  
3. 点击 `Create`，首次启动时，Orbstack 会将 `kwdb.yaml` 注入到 cloud-init，系统会在后台自动：
   - 切换阿里云软件源；
   - 安装所有依赖包；
   - 安装 Go、CMake；
   - 写入环境变量。
4. 根据网络速度，这一步可能需要数分钟，完成后虚拟机即可作为 KWDB 的开发编译环境使用。
5. 虚拟机创建完成且启动成功后，双击 Orbstack 中的 VM 图标，即可打开一个终端窗口，登录到该 VM。

!["Orbstack 创建 VM"](./img/orb.png)

## 在 VM 中编译 KWDB

进入 VM 后，可以参考[通过源码编译](../compilation/source-code.md)完成 KWDB 的编译和构建。以下是一个简单的示例，方便快速上手。

### 下载 KWDB 源码

```bash
mkdir -p /home/go/src/gitee.com
# 授予 /home/go 目录下的所有文件和子目录以当前用户和用户组的权限
sudo chown -R $USER:$USER /home/go
git clone https://gitee.com/kwdb/kwdb.git /home/go/src/gitee.com/kwbasedb #请勿修改目录路径中的 src/gitee.com/kwbasedb
cd /home/go/src/gitee.com/kwbasedb
git submodule update --init #适用于首次拉取代码
git submodule update --remote
```

### 编译与安装

创建构建目录并完成编译与安装：

```bash
cd /home/go/src/gitee.com/kwbasedb
mkdir build && cd build
# 运行 cmake 配置
cmake .. -DCMAKE_BUILD_TYPE=Debug
# 编译与安装
make
make install
```

## 小结

通过 Orbstack + cloud-init 的方式，可以将原本需要多步手动执行的环境准备过程（配置源、安装依赖、部署 Go/CMake、设置环境变量）固化在一份 YAML 文件中，实现：

- **一次配置，多次复用**：在多台 Mac 或多名开发者之间共享相同的 KWDB 开发环境模板。  
- **环境配置可审计、可版本化**：可将 `kwdb.yaml` 存放在仓库中，配合 Git 即可跟踪环境变更。  
- **对架构友好**：自动适配 x86_64 / arm64，Apple Silicon 用户可以直接使用。

后续如果 KWDB 的编译依赖或推荐工具链有更新，只需要修改 `kwdb.yaml` 并重新创建 VM，即可获得最新的开发环境。
