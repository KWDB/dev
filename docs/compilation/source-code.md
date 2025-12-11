---
title: 通过源码编译
id: source-code
sidebar_position: 1
---

本文介绍在 Ubuntu 22.04 操作系统上通过源码编译 KWDB 的方法。

## 操作系统和软件依赖

KWDB 支持在 Linux 操作系统进行安装部署，下表列出了编译和运行 KWDB 所需的软件依赖。

**编译依赖：**

| 依赖              | 版本    | 说明                                                         |
| :---------------- | :------ | ------------------------------------------------------------ |
| ca-certificates   | any     |                                                              |
| Go                | v1.15+  |                                                              |
| CMake             | v3.23   |                                                              |
| Autoconf          | v2.68+  |                                                              |
| goyacc            | v0.8.0+ |                                                              |
| dpkg-dev          | any     | 仅适用Ubuntu系统。                                           |
| devscripts        | any     | 仅适用Ubuntu系统。                                           |
| build-essential   | any     |                                                              |
| checkinstall      | any     |                                                              |
| libssl            | v1.1.1+ | - Ubuntu系统该依赖名为libssl-dev。<br/>- RHEL, CentOS, Kylin, UOS, AnolisOS系统该依赖名为libssl-devel。 |
| libprotobuf       | v3.6.1+ | - Ubuntu系统该依赖名为libprotobuf-dev。<br/>- RHEL, CentOS, Kylin, UOS, AnolisOS系统该依赖名为libprotobuf-devel。 |
| liblzma           | v5.2.0+ | - Ubuntu系统该依赖名为liblzma-dev。<br>- RHEL, CentOS, Kylin, UOS, AnolisOS系统该依赖名为liblzma-devel。 |
| libncurses        | v6.2.0+ | - Ubuntu系统该依赖名为libncurses5-dev。<br>- RHEL, CentOS, Kylin, UOS, AnolisOS系统该依赖名为libncurses-devel。 |
| libatomic         | v7.3.0+ | 仅 GCC 和 G++ 7.3.0 版本需要增加此依赖。                     |
| libstdc++-static  | v7.3.0+ | 仅 GCC 和 G++ 7.3.0 版本需要增加此依赖。                     |
| protobuf-compiler | any     |                                                              |
| git               | any     |                                                              |
| libprotoc-dev     | v3.6.1+ |- Ubuntu系统该依赖名为libprotoc-dev。<br/>- RHEL, CentOS, Kylin, UOS, AnolisOS系统该依赖名为libprotobuf-devel。 |
| gflags            | V2.2.2  |                                                              |
| libz4             | V1.9.2  |                                                              |

**运行依赖：**

| 依赖           | 版本    |
| :-------------| :------ |
| openssl        | v1.1.1+ |
| libprotobuf    | v3.6.1+  <br>**注意**：Ubuntu 18.04 默认的 libprotobuf 版本不满足要求，用户需要提前安装所需版本（推荐 3.6.1 和 3.12.4），并在编译时通过 `make PROTOBUF_DIR=<protobuf_directory>` 指定高版本路径。|
| geos           | v3.3.8+ |
| xz-libs        | v5.2.0+ |
| squashfs-tools | any     |
| libgcc         | v7.3.0+ |
| mount          | any     |
| squashfuse     | any     |

## 环境准备

1. 下载和解压 [CMake 安装包](https://github.com/Kitware/CMake/releases/tag/v3.23.4)。

   ```bash
   tar -C /usr/local/ -xvf cmake-3.23.4-linux-x86_64.tar.gz 
   mv /usr/local/cmake-3.23.4-linux-x86_64 /usr/local/cmake
   ```

2. 下载和解压 [Go 安装包](https://golang.google.cn/dl/)。

   ```bash
   tar -C /usr/local -xvf go1.22.5.linux-amd64.tar.gz
   ```

3. 创建用于存放项目代码的代码目录。

   ```bash
   mkdir -p /home/go/src/gitee.com
   ```

4. 设置 Go 和 CMake 的环境变量。

   - 个人用户设置：修改`~/.bashrc` 文件
   - 系统全局设置（需要 root 权限）：修改`/etc/profile`文件

      ```bash
      export GOROOT=/usr/local/go
      export GOPATH=/home/go      #请以实际代码下载存放路径为准，在此以home/go目录为例
      export PATH=$PATH:/usr/local/go/bin:/usr/local/cmake/bin
      ```

5. 使变量设置立即生效：

    - 个人用户设置：

      ```bash
      source ~/.bashrc                           
      ```

    - 系统全局设置：

      ```bash
      source /etc/profile                           
      ```

6. 安装依赖包（ubuntu）

   ```bash
   sudo apt install -y build-essential libprotobuf-dev protobuf-compiler libssl-dev libgflags-dev libprotoc-dev liblz4-dev autoconf automake libtool
   ```

## 下载代码

在 [KWDB 代码仓库](https://gitee.com/kwdb/kwdb)下载代码，并将其存储到 `GOPATH` 声明的目录。

- 使用 git clone 命令：

   ```bash
   git clone https://gitee.com/kwdb/kwdb.git /home/go/src/gitee.com/kwbasedb #请勿修改目录路径中的 src/gitee.com/kwbasedb
   cd /home/go/src/gitee.com/kwbasedb 
   git submodule update --init  #适用于首次拉取代码
   git submodule update --remote
   ```

- 下载代码压缩包，并将其解压缩到指定目录。

## 构建和安装

1. 在项目目录下创建并切换到构建目录。

   ```bash
   cd /home/go/src/gitee.com/kwbasedb
   mkdir build && cd build
   ```

2. 运行 CMake 配置。

   ```bash
   cmake .. -DCMAKE_BUILD_TYPE= [Release | Debug]
   ```

   参数说明：
   `CMAKE_BUILD_TYPE`：指定构建类型，默认为 `Debug`。可选值为 `Debug` 或 `Release`，首字母需大写。

3. 禁用Go模块功能。

   1. 设置环境变量

      - 个人用户设置：修改`~/.bashrc` 文件

      - 系统全局设置（需要 root 权限）：修改`/etc/profile`文件

         ```bash
         export GO111MODULE=off
         ```

   2. 使变量设置立即生效：

      - 个人用户设置：

         ```bash
         source ~/.bashrc                           
         ```

      - 系统全局设置：

        ```bash
        source /etc/profile                           
        ```

4. 编译和安装项目。

   :::warning
   - 如果编译时出现遗留的 protobuf 自动生成的文件导致报错，可使用`make clean` 清理编译目录。
   - 如果需要额外指定 protobuf 的文件路径，请使用 `make PROTOBUF_DIR=<protobuf_directory>`。
   :::

      ```bash
      make
      make install
      ```

   编译和安装成功后的文件清单如下：

      ```text
      /home/go/src/gitee.com/kwbasedb
      ├── install
      │   ├── bin
      │   │   ├── err_inject.sh
      │   │   ├── query_kwbase_status.sh
      │   │   ├── query_status.sh
      │   │   ├── setup_cert_file.sh
      │   │   ├── utils.sh
      │   │   └── kwbase
      │   └── lib
      │       ├── libcommon.so
      │       └── libkwdbts2.so
      ```

5. （可选）进入 kwbase 脚本所在目录，查看数据库版本，验证是否安装成功。

      ```bash
      ./kwbase version
      KaiwuDB Version:  V2.0.3.2_RC3-3-gfe5eeb853e-dirty
      Build Time:       2024/07/19 06:24:00
      Distribution:
      Platform:         linux amd64 (x86_64-linux-gnu)
      Go Version:       go1.22.5
      C Compiler:       gcc 11.4.0
      Build SHA-1:      fe5eeb853e0884a963fd43b380a0b0057f88fb19
   ```

## 启动数据库

1. 进入 `kwbase` 脚本所在目录。

   ```bash
   cd /home/go/src/gitee.com/kwbasedb/install/bin
   ```

2. 设置共享库的搜索路径。

   ```bash
   export LD_LIBRARY_PATH=../lib
   ```

3. 启动数据库。

   ```bash
   ./kwbase start-single-node --insecure --listen-addr=:26257 --background
   ```

4. 数据库启动后即可通过 kwbase CLI 工具、KaiwuDB 开发者中心或 JDBC 等连接器连接和使用 KWDB，具体连接和使用内容见[使用 kwbase CLI 工具连接 KWDB](https://www.kaiwudb.com/kaiwudb_docs/#/oss_dev/quickstart/access-kaiwudb/access-kaiwudb-cli.html)、[使用 KDC 连接 KWDB](https://www.kaiwudb.com/template_version/pc/doc/oss_dev/quickstart/access-kaiwudb/access-kaiwudb-kdc.html)和[使用 JDBC 连接 KWDB](https://www.kaiwudb.com/template_version/pc/doc/oss_dev/quickstart/access-kaiwudb/access-kaiwudb-jdbc.html)。
