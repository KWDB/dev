---
sidebar_position: 1
---

# 5 分钟快速体验 KWDB

本示例将带您快速体验 KWDB 的基本功能。您将学习如何：

- 使用 Docker 快速部署 KWDB
- 连接到 KWDB 数据库
- 创建时序数据库和关系数据库
- 插入示例数据
- 执行跨模查询

通过这个示例，您可以了解 KWDB 如何同时处理时序数据和关系数据，以及如何利用其强大的跨模查询能力。整个过程只需要 5 分钟即可完成。

## 下载安装

推荐使用 Docker 快速体验 KWDB

```bash
# Docker 安装（推荐）
docker run -d --privileged --name kwdb   
  -p 26257:26257   
  -p 8080:8080   
  -v /var/lib/kaiwudb:/kaiwudb/deploy/kaiwudb-container   
  --ipc shareable   
  -w /kaiwudb/bin   
  kwdb/kwdb   
  ./kwbase start-single-node   
    --insecure   
    --listen-addr=0.0.0.0:26257   
    --http-addr=0.0.0.0:8080   
    --store=/kaiwudb/deploy/kaiwudb-container
```

## 连接数据库

使用 Docker 连接 KWDB

```bash
# 开启交互式 SQL Shell
docker exec -it kwdb ./kwbase sql --insecure --host=127.0.0.1
```

## 创建数据库

创建时序数据库和关系数据库

```sql
-- 创建时序数据库
CREATE TS DATABASE sensor_data;

-- 创建关系数据库
CREATE DATABASE device_management;

-- 在时序数据库中创建传感器读数表
CREATE TABLE sensor_data.readings (
    ts TIMESTAMPTZ NOT NULL,         -- 时间戳(主列)
    temperature FLOAT,               -- 温度值
    humidity FLOAT                   -- 湿度值
) TAGS (
    device_id INT NOT NULL,          -- 设备ID(标签)
    location VARCHAR(256) NOT NULL   -- 设备位置(标签)
) PRIMARY TAGS(device_id);          -- 主标签设为device_id

-- 在关系数据库中创建设备信息表
CREATE TABLE device_management.devices (
    device_id INT PRIMARY KEY,       -- 设备ID(主键)
    device_name VARCHAR(100),       -- 设备名称
    device_type VARCHAR(50),        -- 设备类型
    installation_date DATE,         -- 安装日期
    warranty_period INT             -- 保修期(月)
);
```

## 插入数据

开始写入您的时序数据和关系数据

```sql
-- 向关系表插入设备信息
INSERT INTO device_management.devices VALUES
(101, '温度传感器-101', '温度传感器', '2023-01-15', 24),
(102, '湿度传感器-102', '湿度传感器', '2023-02-20', 36),
(103, '多功能传感器-103', '复合传感器', '2023-03-10', 12);

-- 向时序表插入传感器读数数据
INSERT INTO sensor_data.readings VALUES
('2025-08-15 13:00:00', 23.5, 45.2, 101, '机房A'),
('2025-08-15 13:30:00', 24.1, 46.8, 101, '机房A'),
('2025-08-15 14:00:00', 22.9, 47.5, 101, '机房A'),
('2025-08-15 14:30:00', 19.8, 65.3, 102, '机房B'),
('2025-08-15 15:00:00', 20.2, 64.7, 102, '机房B'),
('2025-08-15 15:30:00', 20.5, 63.9, 102, '机房B'),
('2025-08-15 16:00:00', 25.3, 42.1, 103, '走廊'),
('2025-08-15 16:30:00', 25.8, 41.7, 103, '走廊');
```

## 查询数据

跨模查询数据

```sql
-- 查询设备最新读数及其详细信息
SELECT 
    r.ts AS timestamp,
    r.temperature,
    r.humidity,
    d.device_name,
    d.device_type,
    r.location
FROM 
    sensor_data.readings AS r
INNER JOIN 
    device_management.devices AS d 
ON 
    r.device_id = d.device_id
WHERE 
    r.ts > '2025-08-15 10:00:00'
ORDER BY 
    r.ts DESC;
```
