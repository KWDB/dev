---
id: kwbase-reference
---

# kwbase 命令参考

## kwbase start

### 功能描述

`kwbase start` 命令用于启动 KWDB 节点。

### 命令格式

```bash
./kwbase start [flags]
```

### 参数说明

<details>
    <summary>参数详情</summary>
    | 参数 | 说明 |
    | --- | --- |
    | `--advertise-addr`        | 节点使用的 IP 地址或主机名，与其他节点通过该地址进行通信，采用 `\<addr/host\>[:\<port\>]` 格式。如果是主机名，则要求能正常解析地址。如果是 IP 地址，则要求能正常访问 IP 地址。对于 IPv6 地址，使用 `[...]` 表示法，例如：`[::1]:26257` 或 `[fe80::f6f2::1]:26257`。如未指定，则默认使用 `listen-addr` 参数的取值。如只指定部分参数值，未指定的部分则使用 `listen-addr` 参数中相同部分的取值。参数的效果取决于与 `--listen-addr` 参数的组合使用。例如，如果端口号与 `--listen-addr` 参数中使用的端口号不同，则需要设置端口转发。<br/>默认值：`--listen-addr` 参数的取值。 |
    | `--attrs`| 有序的、使用冒号（`:`）隔开的节点属性列表。节点属性可以是任意字符串，用于指定机器的能力。机器的能力可能包括专有硬件或内核数量（例如 gpu、x16c）。例如，`--attrs=x16c:gpu`。|
    | `--background` | 在后台启动 KWDB 节点。该功能与在直接在命令行末尾添加 `&` 类似。但是，当使用 `--background` 选项启动 KWDB 节点时，直到 KWDB 节点准备好接受请求后，控制权才会返回给 shell。<br />**说明** <br /> `--background` 参数适用于短时间运行和测试服务的场景。目前，由于无法从当前终端完全分离，不推荐在长时间的服务运行中使用该参数。这种情况下，推荐使用服务管理器或者 daemon(8) 等工具。|
    | `--brpc-addr`| 指定时序引擎间的 brpc 通信地址，格式为 `<host>:<port>` 或 `:<port>`: <br />- 必须包含端口号，否则系统会报错 `failed to start server: --brpc-addr's port not specified`。<br />- IP 地址可省略，若未指定，系统将依次使用 `--advertise-addr` 或 `--listen-addr` 的 IP。<br />**说明**<br />`--advertise-addr` 与 `--brpc-addr` 均为节点间通信地址，因此需确保各节点间网络互通。推荐使用 `--brpc-addr=:<port>` 格式，由系统自动获取 IP 地址。|
    | `--buffer-pool-size` | AE executor 缓冲池大小。<br />默认值：4096 |
    | `--cache` | 缓存大小，多个物理存储设备共享使用。参数值支持准确的内存值（单位：字节）、带小数点的十进制数值（转换为百分比数值）、百分比值：<br />- `--cache=.25` <br />- `--cache=25%` <br />- `--cache=1000000000`：1000000000 字节 <br />- `--cache=1GB`：1000000000 字节 <br />- `--cache=1GiB`：1073741824 字节<br />默认值：`128 MiB` <br />**说明** <br />如果使用带百分比符号（%）的格式，确保系统能够正常识别转义的百分比符号（%）。例如，在某些配置文件中，百分比符号（%）可能被识别为注解符。因此，推荐使用带小数点的十进制数值。 |
    | `--certs-dir` | 安全证书目录的路径，用于访问、验证以安全模式部署的集群。<br />默认值：`${HOME}/.kaiwudb-certs/` |
    | `-h`, `--help` | `kwbase start` 命令的帮助信息。|
    | `--http-addr`  | 对外开放的 Admin 界面的 IP 地址或主机名。IPv6 地址使用 `[...]` 表示法，例如：`[::1]:8080` 或 `[fe80::f6f2::1]:8080`。<br />默认值：与 `--listen-addr` 参数一致，端口为 `8080`。 |
    | `--import-path` | 导入文件所在的路径。|
    | `--insecure` | 以非安全模式启动集群。如未指定，以安全模式启动集群。|
    | `-j, --join` | 节点连接集群的地址。初始化时，需要指定集群 3-5 个节点的地址和端口，然后执行 `kwbase init` 命令启动集群。如未指定该参数时，则启动一个单节点集群。此时，无需执行 `kwbase init` 命令。如需向已有集群添加新节点，支持使用该参数指定集群 3-5 个节点的地址和端口。|
    | `--listen-addr` | 侦听来自其他节点和客户端连接的 IP 地址/主机名和端口。IPv6 地址使用 `[...]` 表示法，例如：`[::1]` 或 `[fe80::f6f2::1]`。参数的效果取决于与 `--advertise-addr` 参数的组合使用。如未指定 `--advertise-addr` 参数，使用 `canonical hostname` 与其他节点进行通信。<br />默认值：侦听所有 IP 地址，端口为 `26257`。|
    | `--log-dir` | 启动日志功能并在指定的目录下记录日志。`--log-dir` 配置为空字符串（`--log-dir=""`）时，表示关闭日志功能。 |
    | `--log-dir-max-size` | 所有日志文件大小达到阈值以后，KWDB 将删除最早的日志。<br />默认值：`100 MiB` |
    | `--log-file-verbosity` | 将指定日志级别及以上的日志输出到日志文件，例如：`--log-file-verbosity=WARNING`。<br />默认值：`INFO` |
    | `--max-disk-temp-storage` | 磁盘上可用于存储超出内存预算的 SQL 查询临时数据的最大存储空间。这可确保 JOIN、SORT 和其他内存密集型 SQL 操作能够将中间结果溢出到磁盘。该值可以是百分数或者准确的值（单位：字节），例如：<br />- `--max-disk-temp-storage=.25` <br />- `--max-disk-temp-storage=25%` <br />- `--max-disk-temp-storage=10000000000`：1000000000 字节 <br />- `--max-disk-temp-storage=1GB`：1000000000 字节 <br />- `--max-disk-temp-storage=1GiB`：1073741824 字节。<br />这些临时文件存储在 `--store` 参数取值的第一个存储目录的子目录中。<br />默认值：`32GiB`<br />**说明** <br /> 如果使用带百分比符号（%）的格式，确保系统能够正常识别转义的百分比符号（%）。例如，在某些配置文件中，百分比符号（%）可能被识别为注解符。因此，推荐使用带小数点的十进制数值。 |
    | `--max-offset` | 群集允许的最大时钟偏移。如果观察到的时钟偏移超过此限制，服务器将会崩溃，以最大限度降低读取不一致数据的可能性。增加此值会延长故障恢复时间和基于不确定性的读取重启频率。请注意，此值必须在集群的所有节点上保持一致。如需更改此值，必须同时停止集群中的所有节点，然后使用新值重新启动。<br />默认值：`500ms` |
    | `--max-sql-memory` | SQL 查询缓存的临时数据支持使用的最大内存空间，包括准备好的查询和在查询执行期间中间数据行。该值可以是百分数或者准确的值（单位：字节），例如：<br />- `--max-sql-memory=.25` <br />- `--max-sql-memory=25%` <br />- `--max-sql-memory=10000000000`：1000000000 字节 <br />- `--max-sql-memory=1GB`：1000000000 字节 <br />- `--max-sql-memory=1GiB`：1073741824 字节。<br />这些临时文件存储在 `--temp-dir` 文件夹当中。<br />**说明** <br /> 如果使用带百分比符号（%）的格式，确保系统能够正常识别转义的百分比符号（%）。例如，在某些配置文件中，百分比符号（%）可能被识别为注解符。因此，推荐使用带小数点的十进制数值。 |
    | `--restful-port` | RESTful 端口，取值范围为 `[0, 65535]`。<br />默认值：`8080` |
    | `--restful-timeout` | RESTful API 超时时间。<br />默认值：60 |
    | `--sql-audit-dir` | 安全审计日志的位置。默认情况下，SQL 审核日志与 KWDB 生成的其他日志写入同一目录。|
    | `-s, --store` | 存储设备路径，用于存储数据库数据。支持同时指定设备属性和空间大小。若使用多个设备存储数据，则使用 `--store=/mnt/ssd01 --store=/mnt/ssd02` 方式。|
    | `--thread-pool-size` | AE executor 线程池大小。<br />默认值：10 |
    | `--upgrade-complete`      | 节点升级完成。|
</details>

### 使用举例

以下示例开启一个多节点 KWDB 集群。

- TLS 安全模式

    以下示例假设已为 `root` 用户生成证书。有关生成证书的详细信息，参见 `kwbase cert` 命令的[使用举例](#使用举例-4)章节。

    ```bash
    ./kwbase start \
    --certs-dir=/root/certs \
    --store=/opt/node1 \
    --advertise-addr=<node1_address>:26257 \
    --brpc-addr=:27257 \
    --listen-addr=<node1_address>:26257 \
    --http-addr=<node1_address>:8080 \
    --join=<node1_address>,<node2_address>,<node3_address> \
    --cache=.25 \
    --max-sql-memory=.25 \
    --background
    ```

- 非安全模式

    ```bash
    ./kwbase start \
    --insecure \
    --store=/opt/node1 \
    --advertise-addr=<node1_address>:26257 \
    --brpc-addr=:27257 \
    --listen-addr=<node1_address>:26257 \
    --http-addr=<node1_address>:8080 \
    --join=<node1_address>,<node2_address>,<node3_address> \
    --cache=.25 \
    --max-sql-memory=.25 \
    --background
    ```

## kwbase start-single-replica

### 功能描述

`kwbase start-single-replica` 命令用于启动一个单副本节点。

### 命令格式

```bash
./kwbase start-single-replica [flags]
```

### 参数说明

<details>
    <summary>参数详情</summary>
    | 参数 | 说明 |
    |------|------|
    | `--advertise-addr` | 节点使用的 IP 地址或主机名，与其他节点通过该地址进行通信。格式为 `<addr/host>[:<port>]`。<br/>- 主机名需要能正常解析地址<br/>- IP 地址需要能正常访问<br/>- IPv6 地址使用 `[...]` 表示法，如 `[::1]:26257`<br/>- 未指定时默认使用 `--listen-addr` 的值<br/>- 仅指定部分值时,未指定部分使用 `--listen-addr` 对应值<br/>- 与 `--listen-addr` 配合使用,端口不同时需要端口转发<br/>默认值：`--listen-addr` 的值 |
    | `--attrs` | 节点属性列表，用冒号(`:`)分隔。可以是任意字符串，用于指定机器能力，如专有硬件或内核数量。<br/>示例：`--attrs=x16c:gpu` |
    | `--background` | 在后台启动节点。与在命令行末尾添加 `&` 类似，但会等待节点就绪后才返回控制权。<br/>**说明**：适用于短期测试，不建议用于长期运行。长期运行建议使用服务管理器或 daemon(8) |
    | `--brpc-addr` | 时序引擎间的 brpc 通信地址。格式为 `<host>:<port>` 或 `:<port>`。<br/>- 必须指定端口号<br/>- IP 可省略，未指定时使用 `--advertise-addr` 或 `--listen-addr` 的 IP<br/>**说明**：与 `--advertise-addr` 都是节点间通信地址，需确保网络互通。建议使用 `:<port>` 格式 |
    | `--buffer-pool-size` | AE executor 缓冲池大小。默认值：4096 |
    | `--cache` | 多存储设备共享的缓存大小。支持以下格式：<br/>- 小数：`--cache=.25`<br/>- 百分比：`--cache=25%`<br/>- 字节数：`--cache=1000000000`<br/>- GB：`--cache=1GB`（1000000000字节）<br/>- GiB：`--cache=1GiB`（1073741824字节）<br/>默认值：`128 MiB`<br/>**说明**：建议使用小数格式，避免百分号转义问题 |
    | `--certs-dir` | 安全证书目录路径。默认值：`${HOME}/.kaiwudb-certs/` |
    | `-h`, `--help` | 显示帮助信息 |
    | `--http-addr` | Admin 界面的 IP 地址或主机名。IPv6 使用 `[...]` 表示法。<br/>默认值：与 `--listen-addr` 一致，端口为 8080 |
    | `--import-path` | 导入文件路径 |
    | `--insecure` | 以非安全模式启动。未指定时使用安全模式 |
    | `-j`, `--join` | 连接集群的节点地址。初始化时需指定 3-5 个节点地址和端口。未指定时启动单节点集群 |
    | `--listen-addr` | 监听地址，用于接收其他节点和客户端连接。IPv6 使用 `[...]` 表示法。<br/>默认值：监听所有 IP，端口 26257 |
    | `--log-dir` | 日志目录。设为空字符串时关闭日志功能 |
    | `--log-dir-max-size` | 日志文件总大小上限，超过后删除最早的日志。默认值：`100 MiB` |
    | `--log-file-verbosity` | 日志文件的记录级别。默认值：`INFO` |
    | `--max-offset` | 允许的最大时钟偏移。超过后服务器会崩溃。所有节点必须一致。默认值：`500ms` |
    | `--max-sql-memory` | SQL 查询临时数据的最大内存。支持与 `--cache` 相同的格式。数据存储在 `--temp-dir` 目录 |
    | `--restful-port` | RESTful 端口。范围：[0,65535]。默认值：8080 |
    | `--restful-timeout` | RESTful API 超时时间。默认值：60 |
    | `--sql-audit-dir` | SQL 审计日志目录。默认与其他日志在同一目录 |
    | `-s`, `--store` | 数据存储路径。可指定多个：`--store=/mnt/ssd01 --store=/mnt/ssd02` |
    | `--thread-pool-size` | AE executor 线程池大小。默认值：10 |
    | `--upgrade-complete` | 标记节点升级完成 |
</details>

### 使用举例

以下示例开启一个单副本节点。

```bash
./kwbase start-single-replica \
--insecure \
--store=/opt/node1 \
--advertise-addr=<node1_address>:26257 \
--brpc-addr=:27257 \
--listen-addr=<node1_address>:26257 \
--http-addr=<node1_address>:8080 \
--join=<node1_address>
```

## kwbase start-single-node

### 功能描述

`kwbase start-single-node` 命令用于启动一个单节点集群。

### 命令格式

```bash
./kwbase start-single-node [flags]
```

### 参数说明

<details>
    <summary>参数详情</summary>
    | 参数 | 说明 |
    |------|------|
    | `--attrs` | 节点属性列表，使用冒号(`:`)分隔。可以是任意字符串，用于指定机器能力，如专有硬件或内核数量。<br/>示例：`--attrs=x16c:gpu` |
    | `--background` | 在后台启动节点。与命令行末尾添加 `&` 类似，但会等待节点就绪后才返回控制权。<br/>**说明**：适用于短期测试，不建议用于长期运行。长期运行建议使用服务管理器或 daemon(8) |
    | `--buffer-pool-size` | AE executor 缓冲池大小。<br/>默认值：4096 |
    | `--cache` | 多存储设备共享的缓存大小。支持以下格式：<br/>- 小数：`--cache=.25`<br/>- 百分比：`--cache=25%`<br/>- 字节数：`--cache=1000000000`<br/>- GB：`--cache=1GB`（1000000000字节）<br/>- GiB：`--cache=1GiB`（1073741824字节）<br/>默认值：`128 MiB`<br/>**说明**：建议使用小数格式，避免百分号转义问题 |
    | `--certs-dir` | 安全证书目录路径。<br/>默认值：`${HOME}/.kaiwudb-certs/` |
    | `-h`, `--help` | `kwbase start-single-node` 命令的帮助信息 |
    | `--http-addr` | Admin 界面的 IP 地址或主机名。IPv6 使用 `[...]` 表示法。<br/>默认值：与 `--listen-addr` 一致，端口为 8080 |
    | `--import-path` | 导入文件路径 |
    | `--insecure` | 以非安全模式启动。未指定时使用安全模式 |
    | `--listen-addr` | 监听地址，用于接收其他节点和客户端连接。IPv6 使用 `[...]` 表示法。<br/>默认值：监听所有 IP，端口 26257 |
    | `--log-dir` | 日志目录。设为空字符串时关闭日志功能 |
    | `--log-dir-max-size` | 日志文件总大小上限，超过后删除最早的日志。<br/>默认值：`100 MiB` |
    | `--log-file-verbosity` | 日志文件的记录级别。<br/>默认值：`INFO` |
    | `--max-disk-temp-storage` | SQL 查询临时数据的最大磁盘存储空间。支持以下格式：<br/>- 小数：`--max-disk-temp-storage=.25`<br/>- 百分比：`--max-disk-temp-storage=25%`<br/>- 字节数：`--max-disk-temp-storage=10000000000`<br/>- GB：`--max-disk-temp-storage=1GB`<br/>- GiB：`--max-disk-temp-storage=1GiB`<br/>临时文件存储在第一个 `--store` 目录下。<br/>默认值：`32GiB`<br/>**说明**：建议使用小数格式，避免百分号转义问题 |
    | `--max-sql-memory` | SQL 查询临时数据的最大内存空间。支持以下格式：<br/>- 小数：`--max-sql-memory=.25`<br/>- 百分比：`--max-sql-memory=25%`<br/>- 字节数：`--max-sql-memory=10000000000`<br/>- GB：`--max-sql-memory=1GB`<br/>- GiB：`--max-sql-memory=1GiB`<br/>临时文件存储在 `--temp-dir` 目录。<br/>**说明**：建议使用小数格式，避免百分号转义问题 |
    | `--restful-port` | RESTful 端口。范围：[0,65535]。<br/>默认值：8080 |
    | `--restful-timeout` | RESTful API 超时时间。<br/>默认值：60 |
    | `--sql-audit-dir` | SQL 审计日志目录。默认与其他日志在同一目录 |
    | `-s`, `--store` | 数据存储路径。可指定多个：`--store=/mnt/ssd01 --store=/mnt/ssd02` |
    | `--thread-pool-size` | AE executor 线程池大小。<br/>默认值：10 |
    | `--upgrade-complete` | 标记节点升级完成 |
</details>

### 使用举例

以下示例开启一个单节点 KWDB 集群。

- TLS 安全模式

    以下示例假设已为 `root` 用户生成证书。有关生成证书的详细信息，参见 `kwbase cert` 命令的[使用举例](#使用举例-4)章节。

    ```bash
    ./kwbase start-single-node \
    --certs-dir=/root/certs \
    --listen-addr=0.0.0.0:26257 \
    --advertise-addr=127.0.0.1:26257 \
    --http-addr=0.0.0.0:8080 \
    --store=/kaiwudb/deploy/kaiwudb
    ```

- 非安全模式

    ```bash
    ./kwbase start-single-node \
    --insecure \
    --listen-addr=0.0.0.0:26257 \
    --advertise-addr=127.0.0.1:26257 \
    --http-addr=0.0.0.0:8080 \
    --store=/kaiwudb/deploy/kaiwudb
    ```

## kwbase init

### 功能描述

`kwbase init` 命令用于初始化 KWDB 集群。

### 命令格式

```bash
./kwbase init [flags]
```

### 参数说明

<details>
    <summary>参数详情</summary>
    | 参数 | 说明 |
    |------|------|
    | `--certs-dir` | 安全证书目录的路径，用于访问、验证以安全模式部署的集群。<br/>默认值：`${HOME}/.kaiwudb-certs/` |
    | `-h`, `--help` | `kwbase init` 命令的帮助信息。 |
    | `--host` | 连接的 KWDB 节点。支持 IP 地址/主机名，格式为 `<addr/host>[:<port>]`。<br/>- 未指定端口号时默认使用 26257<br/>- IPv6 地址使用 `[...]` 表示法，如 `[::1]:26257`<br/>环境变量：`KWBASE_HOST` |
    | `--insecure` | 以非安全模式启动集群。未指定时使用安全模式。 |
    | `--url` | 连接 URL，格式为 `postgresql://[user[:passwd]@]host[:port]/[db][?parameters...]`<br/>示例：postgresql://myuser@localhost:26257/mydb<br/>未指定时使用 host、port、user、database、insecure、certs-dir 等连接参数。<br/>环境变量：`KWBASE_URL` |
</details>

### 使用举例

以下示例假设已启动 KWDB。有关详细信息，参见 `kwbase start` 命令的[使用举例](#使用举例)章节。

用户可以在集群的任意节点执行 `kwbase init` 命令。

```bash
./kwbase init \
--certs-dir=/root/certs \
--host=<address_of_any_node>
```

## kwbase cert

### 功能描述

`kwbase cert` 命令用于生成 Certificate Authority（CA）、节点和客户端证书。

### 命令格式

```bash
./kwbase cert <subcommand> [flags]
```

- `create-ca`

    ```bash
    ./kwbase cert create-ca --certs-dir=<path-to-kaiwudb-certs-dir> --ca-key=<path-to-ca-key> [flags]
    ```

- `create-client-ca`

    ```bash
    ./kwbase cert create-client-ca --certs-dir=<path-to-kaiwudb-certs-dir> --ca-key=<path-to-client-ca-key> [flags]
    ```

- `create-node`

    ```bash
    ./kwbase cert create-node --certs-dir=<path-to-kaiwudb-certs-dir> --ca-key=<path-to-ca-key> <host1> <host2> ... <hostN> [flags]
    ```

- `create-client`

    ```bash
    ./kwbase cert create-client --certs-dir=<path-to-kaiwudb-certs-dir> --ca-key=<path-to-ca-key> <username> [flags]
    ```

- `list`

    ```bash
    ./kwbase cert list [flags]
    ```

### 子命令

| 子命令 | 说明 |
|--------|------|
| `create-ca` | 生成 CA 证书和密钥。 |
| `create-client-ca` | 生成客户端 CA 证书和密钥。 |
| `create-node` | 生成节点证书和密钥。 |
| `create-client` | 生成客户端证书和密钥。 |
| `list` | 查看 `--cert-dir` 目录中的证书。 |

### 参数说明

<details>
    <summary>参数详情</summary>
    | 参数 | 说明 | 支持的命令 |
    |------|------|----------------------------------------------|
    | `--allow-ca-key-reuse` | 使用已存在的 CA 密钥。 | - `kwbase cert create-ca`<br/>- `kwbase cert create-client-ca` |
    | `--ca-key` | CA 密钥的路径。<br/>环境变量：`KWBASE_CA_KEY` | - `kwbase cert create-ca`<br/>- `kwbase cert create-client-ca`<br/>- `kwbase cert create-node`<br/>- `kwbase cert create-client` |
    | `--cert-principal-map` | 使用逗号（`,`）隔开的 `<cert-principal>:<db-principal>` 映射列表，允许将证书中的主体映射到数据库主体，如节点、root 或任何 SQL 用户。这适用于证书管理系统对证书中的 `Subject.CommonName` 或 `SubjectAlternateName` 字段有限制的情况（例如，不允许使用节点或 root 等 `CommonName`）。如果同一证书主体有多个映射项，列表中最后指定的映射项优先生效。映射中未指明的主体将按原样传递。如果数据库主体的名称包含在映射的 `CommonName` 或 DNS 类型的 `SubjectAlternateName` 字段中，则允许证书对数据库主体进行身份验证。 | - `kwbase cert create-ca`<br/>- `kwbase cert create-client-ca`<br/>- `kwbase cert create-node`<br/>- `kwbase cert create-client`<br/>- `kwbase cert list` |
    | `--certs-dir` | 安全证书目录的路径，用于访问、验证以安全模式部署的集群。<br/>默认值：`${HOME}/.kaiwudb-certs/` | - `kwbase cert create-ca`<br/>- `kwbase cert create-client-ca`<br/>- `kwbase cert create-node`<br/>- `kwbase cert create-client`<br/>- `kwbase cert list` |
    | `-h`, `--help` | 命令的帮助信息。 | - `kwbase cert`<br/>- `kwbase cert create-ca`<br/>- `kwbase cert create-client-ca`<br/>- `kwbase cert create-node`<br/>- `kwbase cert create-client`<br/>- `kwbase cert list` |
    | `--key-size` | CA、节点、客户端证书密钥的大小（单位：比特）。<br/>默认值：2048 比特 | - `kwbase cert create-ca`<br/>- `kwbase cert create-client-ca`<br/>- `kwbase cert create-node`<br/>- `kwbase cert create-client` |
    | `--lifetime` | 证书的生命周期。<br/>默认值：`43920h0m0s` | - `kwbase cert create-ca`<br/>- `kwbase cert create-client-ca`<br/>- `kwbase cert create-node`<br/>- `kwbase cert create-client` |
    | `--overwrite` | 覆写存在的证书和密钥文件。 | - `kwbase cert create-ca`<br/>- `kwbase cert create-client-ca`<br/>- `kwbase cert create-node`<br/>- `kwbase cert create-client` |
</details>

### 使用举例

1. 新建 `/opt/certs` 和 `/opt/my-safe-directory` 目录。

    ```bash
    mkdir /opt/certs
    mkdir /opt/my-safe-directory
    ```

    - `/opt/certs`：用于存放生成的 CA 证书以及所有节点和客户端的证书和密钥文件，其中部分文件会传输到节点机器上。
    - `/opt/my-safe-directory`：用于存放生成的 CA 密钥文件，节点和用户创建证书和密钥的时候使用。

2. 创建 CA 证书和密钥。

    ```bash
    ./ kwbase cert create-ca \
    --certs-dir=/opt/certs \
    --ca-key=/opt/my-safe-directory/ca.key
    ```

    建议备份生成的 CA 证书和密钥对。

3. 为集群的第一个节点创建证书和密钥。

    ```bash
    ./kwbase cert create-node <IP_address_of_node1> [<node1_hostname>]   [<other_common_names_for_ node1>] localhost 127.0.0.1 [<load_balancer_IP_address>]   [<load_balancer hostname>] [<other_common_names_for_load_balancer>] \
    --certs-dir=/opt/certs \
    --ca-key=/opt/my-safe-directory/ca.key
    ```

    ::: warning 说明

    节点的 IP 地址为生成证书的内网或外网 IP 地址。示例：

    ```bash
    ./kwbase cert create-node 117.73.10.12 localhost   127.0.0.1 \
    --certs-dir=/opt/certs \
    --ca-key=/opt/my-safe-directory/ca.key
    ```

    :::

4. 将 CA 证书、节点证书和密钥传送到第一个节点。

    ```bash
    ssh <username>@<node1_address>   "mkdir /root/certs"
    scp /opt/certs/ca.crt /opt/certs/node.crt /opt/certs/node.key   <username>@<node1_address>:/root/certs
    ```

5. 删除本地的节点证书和密钥。

    ```bash
    rm /opt/certs/node.crt /opt/certs/node.key
    ```

6. 重复第 3-5 步，为集群其他节点创建证书和密钥。

7. 为 `root` 用户创建客户端证书和密钥。

    ```bash
    ./kwbase cert create-client root   \
    --certs-dir=/opt/certs \
    --ca-key=/opt/my-safe-directory/ca.key
    ```

8. 将证书和密钥传输到执行 KWDB 命令的机器上，该机器可以是集群内或集群外的节点。拥有证书的机器能够使用 root 账户执行 KWDB 命令，并可以通过该节点访问集群。

    ```bash
    ssh <username>@<workload address>   "mkdir /root/certs"
    scp /opt/certs/ca.crt /opt/certs/client.root.crt   /opt/certs/client.root.key <username>@<workload   address>:/root/certs
    ```

    ::: warning 说明
    如果以后需要在其它机器上运行 KWDB 客户端命令，需要将 `root` 用户的证书和密钥复制到该节点。只有拥有 `root` 用户证书和密钥的节点，才能够访问集群。
    :::

## kwbase sql

### 功能描述

`kwbase sql` 命令用于开启交互式 SQL Shell。

### 命令格式

```bash
./kwbase sql [flags]
```

### 参数说明

<details>
    <summary>参数详情</summary>
    | 参数 | 说明 |
    |------|------|
    | `--cert-principal-map` | 使用逗号（`,`）分隔的 `<cert-principal>:<db-principal>` 映射列表。用于将证书主体映射到数据库主体（如节点、root 或其他 SQL 用户）。适用于证书系统对 `Subject.CommonName` 或 `SubjectAlternateName` 字段有限制的情况。多个映射时，以最后一个为准。未映射的主体按原样传递。数据库主体名称需包含在映射的 `CommonName` 或 DNS 类型的 `SubjectAlternateName` 字段中。 |
    | `--certs-dir` | 安全证书目录路径，用于访问和验证安全模式集群。<br/>默认值：`${HOME}/.kaiwudb-certs/` |
    | `-d`, `--database` | 要连接的数据库名称。<br/>环境变量：`KWBASE_DATABASE` |
    | `--debug-sql-cli` | 简化 SQL CLI 以便调试。回显 SQL 语句，移除提示符中的数据库名和事务状态，使行为独立于事务状态。 |
    | `--echo-sql` | 显示命令行工具隐式发送的 SQL 语句。 |
    | `-e`, `--execute` | 执行 SQL 语句后退出。可多次使用，支持多个以分号分隔的语句。语句出错时以非零状态码退出。结果输出到标准输出。 |
    | `--format` | 设置表格显示格式：<br/>- `tsv`<br/>- `csv`<br/>- `table`<br/>- `records`<br/>- `sql`<br/>- `raw`<br/>- `html`<br/>非交互式默认为 `tsv`，交互式默认为 `table`。<br/>默认值：`table` |
    | `-h`, `--help` | 显示 `kwbase sql` 命令帮助信息。 |
    | `--insecure` | 以非安全模式启动集群。默认使用安全模式。 |
    | `--safe-updates` | 禁用可能有意外副作用的 SQL 语句（如无 WHERE 子句的 DELETE/UPDATE）。默认启用（`true`）。可通过 `SET sql_safe_updates = FALSE` 禁用。 |
    | `--set` | 在启动 SQL Shell 前设置客户端配置参数。 |
    | `--url` | 连接 URL，格式：`postgresql://[user[:passwd]@]host[:port]/[db][?parameters...]`<br/>示例：postgresql://myuser@localhost:26257/mydb<br/>未指定时使用其他连接参数。<br/>环境变量：`KWBASE_URL` |
    | `-u`, `--user` | KWDB 数据库用户名。<br/>环境变量：`KWBASE_USER` |
    | `--watch` | 按指定间隔重复执行 `--execute` 指定的 SQL 语句。执行失败时停止监控。 |
</details>

### 使用举例

- TLS 安全模式

  以下示例假设已为 `root` 用户生成证书。有关生成证书的详细信息，参见 `kwbase cert` 命令的[使用举例](#使用举例-4)章节。

    ```bash
    ./kwbase sql --certs-dir=certs --host=<address_of_any node>
    ```

- 非安全模式

    ```bash
    ./kwbase sql --insecure --host=<address_of_any_node>
    ```

## kwbase auth-session

### 功能描述

`kwbase auth-session` 命令用于创建和管理 HTTP 接口的会话和认证令牌。

### 所需权限

用户是 `admin` 角色的成员。默认情况下，`root` 用户属于 `admin` 角色。

### 命令格式

```bash
./kwbase auth-session <subcommand> [flags]
```

- `login`

    ```bash
    ./kwbase auth-session login <session-username> [flags]
    ```

- `logout`

    ```bash
    ./kwbase auth-session logout <session-username> [flags]
    ```

- `list`

    ```bash
    ./kwbase auth-session list [flags]
    ```

### 子命令

| 子命令 | 说明 |
|--------|------|
| `login` | 为指定用户创建 HTTP 会话和令牌。 |
| `logout` | 撤回之前为指定用户创建的所有 HTTP 会话令牌。 |
| `list` | 查看当前活跃的 HTTP 会话。 |

### 参数说明

<details>
    <summary>参数详情</summary>
    | 参数 | 说明 | 支持的命令 |
    |------|------|------------|
    | `--cert-principal-map` | 使用逗号（`,`）分隔的 `<cert-principal>:<db-principal>` 映射列表。用于将证书主体映射到数据库主体（如节点、root 或其他 SQL 用户）。适用于证书系统对 `Subject.CommonName` 或 `SubjectAlternateName` 字段有限制的情况。多个映射时，后面的优先。未映射的主体按原样传递。 | - `kwbase auth-session login`<br/>- `kwbase auth-session logout`<br/>- `kwbase auth-session list` |
    | `--certs-dir` | 安全证书目录路径，用于访问和验证安全模式集群。<br/>默认值：`${HOME}/.kaiwudb-certs/` | - `kwbase auth-session login`<br/>- `kwbase auth-session logout`<br/>- `kwbase auth-session list` |
    | `--echo-sql` | 显示命令行工具隐式发送的 SQL 语句。 | - `kwbase auth-session login`<br/>- `kwbase auth-session logout`<br/>- `kwbase auth-session list` |
    | `--expire-after` | HTTP 认证令牌的有效期。使用数值加 `h`（小时）、`m`（分钟）、`s`（秒）指定。<br/>默认值：`1h0m0s` | `kwbase auth-session login` |
    | `--format` | 结果表格显示格式：<br/>- `tsv`<br/>- `csv`<br/>- `table`<br/>- `records`<br/>- `sql`<br/>- `raw`<br/>- `html`<br/>默认值：非交互式为 `tsv`，交互式为 `table` | - `kwbase auth-session login`<br/>- `kwbase auth-session logout`<br/>- `kwbase auth-session list` |
    | `-h`, `--help` | 显示命令帮助信息。 | - `kwbase auth-session`<br/>- `kwbase auth-session login`<br/>- `kwbase auth-session logout`<br/>- `kwbase auth-session list` |
    | `--insecure` | 以非安全模式启动集群。未指定时使用安全模式。 | - `kwbase auth-session login`<br/>- `kwbase auth-session logout`<br/>- `kwbase auth-session list` |
    | `--only-cookie` | 仅显示新创建的 HTTP 认证令牌（cookie），用于输出到其他命令。 | `kwbase auth-session login` |
    | `--url` | 连接 URL，格式：`postgresql://[user[:passwd]@]host[:port]/[db][?parameters...]`<br/>示例：`postgresql://myuser@localhost:26257/mydb`<br/>未指定时使用其他连接参数。<br/>环境变量：`KWBASE_URL` | - `kwbase auth-session login`<br/>- `kwbase auth-session logout`<br/>- `kwbase auth-session list` |
    | `-u`, `--user` | KWDB 数据库用户名。<br/>环境变量：`KWBASE_USER` | - `kwbase auth-session login`<br/>- `kwbase auth-session logout`<br/>- `kwbase auth-session list` |
</details>

### 返回字段说明

#### auth-session login

| 字段 | 说明 |
|------|------|
| `username` | 认证用户的用户名。 |
| `session ID` | 为指定用户创建的 HTTP 接口的会话 ID。 |
| `authentication cookie` | 用于用户通过 CLI 工具或其他工具访问 HTTP 接口时进行身份认证时使用的认证令牌。 |

#### auth-session logout

| 字段 | 说明 |
|------|------|
| `username` | 撤销会话的用户的用户名 |
| `session ID` | 为指定用户创建的 HTTP 接口的会话 ID |
| `revoked` | 撤销指定用户认证会话的日期和时间 |

#### auth-session list

| 字段 | 说明 |
|------|------|
| `username` | 认证用户的用户名 |
| `session ID` | 为指定用户创建的 HTTP 接口的会话 ID |
| `created` | 认证会话创建的时间和日期 |
| `expired` | 认证会话过期的时间和日期 |
| `revoked` | 撤销指定用户认证会话的日期和时间。如果认证会话依旧活跃，则显示 `NULL` |
| `last used` | 上一次使用该会话令牌访问 HTTP 接口的时间和日期 |

## kwbase node

### 功能描述

`kwbase node` 命令用于查看、检查、排空或移除 KWDB 集群中每个节点。

### 命令格式

```bash
./kwbase node <subcommand> [flags]
```

- `ls`

    ```bash
    ./kwbase node ls [flags]
    ```

- `status`

    ```bash
    ./kwbase node status [<node_id>] [flags]
    ```

- `decommission`

    ```bash
    ./kwbase node decommission <node_id 1> [<node_id 2> ...] [flags]
    ```

- `recommission`

    ```bash
    ./kwbase node recommission <node_id 1> [<node_id 2> ...] [flags]
    ```

- `drain`

    ```bash
    ./kwbase node drain [flags]
    ```

- `upgrade`

    ```bash
    ./kwbase node upgrade <node_id 1> [<node_id 2> ...] [flags]
    ```

### 子命令

| 子命令 | 说明 |
|--------|------|
| `ls` | 列出集群中所有节点的 ID。 |
| `status` | 查看集群中单个或所有节点的状态。 |
| `decommission` | 停用集群节点。 |
| `recommission` | 重新配置停用的集群节点。 |
| `drain` | 排空节点。 |
| `upgrade` | 升级节点。 |

### 参数说明

<details>
    <summary>参数详情</summary>
    | 参数 | 说明 | 支持的命令 |
    |------|------|------------|
    | `--all` | 查看所有节点的详细信息。如未指定节点 ID，查看集群内所有已停用的节点。 | `kwbase node status` |
    | `--cert-principal-map` | 使用逗号（`,`）隔开的 `<cert-principal>:<db-principal>` 映射列表，允许将证书中的主体映射到数据库主体，如节点、root 或任何 SQL 用户。这适用于证书管理系统对证书中的 `Subject.CommonName` 或 `SubjectAlternateName` 字段有限制的情况（例如，不允许使用节点或 root 等 `CommonName`）。如果同一证书主体有多个映射项，列表中最后指定的映射项优先生效。映射中未指明的主体将按原样传递。如果数据库主体的名称包含在映射的 `CommonName` 或 DNS 类型的 `SubjectAlternateName` 字段中，则允许证书对数据库主体进行身份验证。 | `kwbase node ls`<br/>`kwbase node status`<br/>`kwbase node decommission`<br/>`kwbase node recommission`<br/>`kwbase node drain`<br/>`kwbase node upgrade` |
    | `--certs-dir` | 安全证书目录的路径，用于访问、验证以安全模式部署的集群。<br/>默认值：`${HOME}/.kaiwudb-certs/` | `kwbase node ls`<br/>`kwbase node status`<br/>`kwbase node decommission`<br/>`kwbase node recommission`<br/>`kwbase node drain`<br/>`kwbase node upgrade` |
    | `--cluster-name` | 为远程节点或集群设置名称，以验证其身份。该值必须与此节点和通过 `--join` 参数指定的远程节点相匹配。当节点或集群或两者都尚未初始化，也不知道其集群 ID 时，可以使用此名称作为额外的验证手段。要将集群名称加入已初始化的集群中，请将此参数与 `--disable-cluster-name-verification` 搭配使用。 | `kwbase node ls`<br/>`kwbase node status`<br/>`kwbase node decommission`<br/>`kwbase node recommission`<br/>`kwbase node drain`<br/>`kwbase node upgrade` |
    | `--decommission` | 查看节点停用的详细信息。如未指定节点 ID，查看集群内所有已停用的节点。 | `kwbase node status` |
    | `--disable-cluster-name-verification` | 配置服务器忽略群集名称不匹配。适用于启动现有集群，或更改群集名称后启动集群的情况。应使用 `--cluster-name` 和 `--disable-cluster-name-verification` 参数重新启动集群。一旦所有节点都已更新为知道新的集群名称，就可以移除该参数并再次重启集群。 | `kwbase node ls`<br/>`kwbase node status`<br/>`kwbase node decommission`<br/>`kwbase node recommission`<br/>`kwbase node drain`<br/>`kwbase node upgrade` |
    | `--drain-wait` | 系统等待节点排空所有活动的客户端连接以及迁移数据分片租约的时间。<br/>默认值：`10m0s` | `kwbase node drain` |
    | `--format` | 选择如何在结果中显示表格行。支持以下取值：<br/>- `tsv`<br/>- `csv`<br/>- `table`<br/>- `records`<br/>- `sql`<br/>- `raw`<br/>- `html`<br/>如未指定，对于非交互式会话，默认为 `tsv`；对于交互式会话，默认为 `table`。<br/>默认值：`table` | `kwbase node ls`<br/>`kwbase node status`<br/>`kwbase node decommission`<br/>`kwbase node recommission`<br/>`kwbase node drain`<br/>`kwbase node upgrade` |
    | `-h`, `--help` | 命令的帮助信息。 | `kwbase node`<br/>`kwbase node ls`<br/>`kwbase node status`<br/>`kwbase node decommission`<br/>`kwbase node recommission`<br/>`kwbase node drain`<br/>`kwbase node upgrade` |
    | `--host` | 连接的 KWDB 节点。支持 IP 地址/主机名，采用 `<addr/host>[:<port>]` 格式。如果未指定端口号，默认使用 `26257`。对于 IPv6 地址，使用 `[...]` 表示法，例如：`[::1]:26257` 或 `[fe80::f6f2::1]:26257`。<br/>环境变量：`KWBASE_HOST` | `kwbase node ls`<br/>`kwbase node status`<br/>`kwbase node decommission`<br/>`kwbase node recommission`<br/>`kwbase node drain`<br/>`kwbase node upgrade` |
    | `--insecure` | 以非安全模式启动集群。如未指定，以安全模式启动集群。 | `kwbase node ls`<br/>`kwbase node status`<br/>`kwbase node decommission`<br/>`kwbase node recommission`<br/>`kwbase node drain`<br/>`kwbase node upgrade` |
    | `--ranges` | 查看节点数据分片和副本的详细信息。 | `kwbase node status` |
    | `--stats` | 查看节点磁盘使用的详细信息。 | `kwbase node status` |
    | `--timeout` | 设置子命令运行的超时时间。如果未在规定时间内完成操作，
    | `--url` | 连接 URL，采用 `postgresql://[user[:passwd]@]host[:port]/[db][?parameters...]` 格式，例如 "postgresql://myuser@localhost:26257/mydb"。如未指定，使用 `host`、`port`、`user`、`databse`、`insecure`、`certs-dir` 等连接参数。<br/>环境变量：`KWBASE_URL` | - `kwbase node ls` <br/>- `kwbase node decommission` <br/>- `kwbase node recommission` <br/>- `kwbase node drain` <br />- `kwbase node upgrade` |
    | `--wait` | 指定在将目标节点标记为停用状态后要何时返回。该参数支持以下取值：<br/>- `all`：直到所有目标节点的副本数量降至零。<br/>- `none`：将目标节点标记为停用状态，但无需等待整个过程完成。当从外部系统手动轮询时，使用该参数取值。<br/>默认值：`all` | - `kwbase node decommission` <br/>- `kwbase node upgrade` |
</details>

## kwbase gen

### 功能描述

`kwbase gen` 命令用于生成 CLI 工具信息、SQL Shell 配置举例、数据库举例等信息。

### 命令格式

```bash
./kwbase gen <subcommand> [flags]
```

- `haproxy`

    ```bash
    ./kwbase gen haproxy [flags]
    ```

- `encryption-key`

    ```bash
    ./kwbase gen encryption-key [flags]
    ```

### 子命令

| 子命令 | 说明 |
|--------|------|
| `haproxy` | 为连接的集群生成 `haproxy.cfg` 文件。 |
| `encryption-key` | 为静态加密生成存储键。 |

### 参数说明

<details>
    <summary>参数详情</summary>
    | 参数 | 说明 | 支持的命令 |
    |------|------|------------|
    | `--cert-principal-map` | 使用逗号（`,`）分隔的 `<cert-principal>:<db-principal>` 映射列表，用于将证书主体映射到数据库主体（如节点、root 或 SQL 用户）。适用于证书系统对 `Subject.CommonName` 或 `SubjectAlternateName` 字段有限制的情况。多个映射时，最后一个生效。未映射的主体按原样传递。 | `kwbase gen haproxy` |
    | `--certs-dir` | 安全证书目录路径。<br/>默认值：`${HOME}/.kaiwudb-certs/` | `kwbase gen haproxy` |
    | `--cluster-name` | 设置远程节点/集群名称用于身份验证。必须与本节点和 `--join` 指定的远程节点匹配。用于未初始化节点的额外验证。加入已初始化集群时需配合 `--disable-cluster-name-verification` 使用。 | `kwbase gen haproxy` |
    | `--disable-cluster-name-verification` | 忽略集群名称不匹配。用于启动现有集群或更改集群名称后。需与 `--cluster-name` 一起使用重启集群。所有节点更新后可移除此参数重启。 | `kwbase gen haproxy` |
    | `-h`, `--help` | 显示帮助信息。 | - `kwbase gen`<br/>- `kwbase gen haproxy`<br/>- `kwbase gen encryption-key` |
    | `--host` | 连接节点的地址。格式：`<addr/host>[:<port>]`。<br/>- 默认端口：26257<br/>- IPv6 格式：`[::1]:26257`<br/>环境变量：`KWBASE_HOST` | `kwbase gen haproxy` |
    | `--insecure` | 使用非安全模式启动。默认使用安全模式。 | `kwbase gen haproxy` |
    | `--out` | HAProxy 配置文件路径。<br/>默认值：`haproxy.cfg` | `kwbase gen haproxy` |
    | `--overwrite` | 覆盖现有密钥。 | `kwbase gen encryption-key` |
    | `-s`, `--size` | AES 静态加密密钥大小：<br/>- 128<br/>- 192<br/>- 256<br/>默认值：128 | `kwbase gen encryption-key` |
    | `--url` | 连接 URL。格式：`postgresql://[user[:passwd]@]host[:port]/[db][?parameters...]`<br/>示例：postgresql://myuser@localhost:26257/mydb<br/>未指定时使用独立连接参数。<br/>环境变量：`KWBASE_URL` | `kwbase gen haproxy` |
</details>

## kwbase version

### 功能描述

`kwbase version` 命令用于查看 KWDB 的版本信息。

### 命令格式

```bash
./kwbase version [flags]
```

### 参数说明

| 参数 | 说明 |
|------|------|
| `-h`, `--help` | `kwbase version` 命令的帮助信息。|

### 使用举例

以下示例查看 KWDB 的版本信息。

```bash
./kwbase version
KWDB Version:  2.1.1
Build Time:       2024/12/02 06:42:24
Distribution:
Platform:         linux amd64 (x86_64-linux-gnu)
Go Version:       go1.16.15
C Compiler:       gcc 11.4.0
Build SHA-1:      83c35a67ab352611ce97300307ebe7d704d24888
```

## kwbase help

### 功能描述

`kwbase help` 命令用于查看 kwbase CLI 工具的帮助信息。

### 命令格式

```bash
./kwbase help
```

### 参数说明

无

### 使用举例

```bash
./kwbase help
KwDB command-line interface and server.

Usage:
  kwbase [command]

Available Commands:
  start                start a node in a multi-node cluster
  start-single-replica start a single-replica node in a multi-node cluster
  start-single-node    start a single-node cluster
  init                 initialize a cluster
  cert                 create ca, node, and client certs
  sql                  open a sql shell
  statement-diag       commands for managing statement diagnostics bundles
  auth-session         log in and out of HTTP sessions
  node                 list, inspect, drain or remove nodes
  nodelocal            upload and delete nodelocal files
  demo                 open a demo sql shell (not suitable for time-series scenario)
  gen                  generate auxiliary files
  version              output version information
  debug                debugging commands
  sqlfmt               format SQL statements
  workload             generators for data and query loads
  systembench          Run systembench
  help                 Help about any command

Flags:
  -h, --help                             help for kwbase
      --logtostderr Severity[=DEFAULT]   logs at or above this threshold go to stderr (default NONE)
      --no-color                         disable standard error log colorization
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging (significantly hurts performance)

Use "kwbase [command] --help" for more information about a command.
```
