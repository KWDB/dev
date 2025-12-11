---
title: 通过容器编译
id: container
sidebar_position: 2
---

通过 Docker 编译 KWDB

## 编译步骤

### 拉取代码

```bash
git clone https://gitee.com/kwdb/kwdb.git
cd kwdb
```

### 初始化&拉取子代码库

```bash
git submodule init
git submodule update
```

### 创建容器并将项目目录映射到容器中

```bash
cd ..
docker run -it --privileged -v .kwdb:/home/inspur/src/gitee.com/kwbasedb kwdb/kwdb_comp_env bash
```

### 开始编译

```bash
cd kwbasedb
GOPATH=/home/inspur GO111MODEL=off make BUILD_TYPE=Release install -j
```

## 国内镜像

同样的，我们也提供了编译工具的国内镜像，只需替换上述 docker 命令中的 `kwdb/kwdb_comp_env` 即可：

- AMR64 版本：`swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/kwdb/kwdb_comp_env:latest-linuxarm64`
- X86 版本：`swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/kwdb/kwdb_comp_env:latest`

## 已知问题

- 编译报错 `c++: fatal error: Killed signal terminated program cc1plus`，docker 运行内容不够导致，建议给容器分配至少 8G 内存，如果依旧报错请继续调大内存。
