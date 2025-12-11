---
sidebar_position: 2
---

# 体验您的第一个查询

以下是一个综合展示 KWDB 多模融合能力的典型查询，展示了如何跨多个模式（时序、关系）进行数据关联和分析。

## 创建数据库和表

### 时序数据库和表

- 创建了一个名为 `factory_iot` 的时序数据库
- 创建了时序表 `machine_sensors`，包含：
  - 时间戳字段 `ts` (TIMESTAMPTZ，非空)
  - 三个测量值字段：振动(vibration)、温度(temperature)、功耗(power_consumption)
  - 三个标签字段：机器ID(machine_id)、生产线(production_line)、设备类型(machine_type)
  - 指定 `machine_id` 为主标签(PRIMARY TAGS)

```sql
-- 创建时序数据库
CREATE TS DATABASE factory_iot;

-- 创建带标签的时序表
CREATE TABLE factory_iot.machine_sensors (
    ts TIMESTAMPTZ NOT NULL,
    vibration FLOAT,
    temperature FLOAT,
    power_consumption FLOAT
) TAGS (
    machine_id INT NOT NULL,
    production_line VARCHAR(50),
    machine_type VARCHAR(50)
) PRIMARY TAGS(machine_id);
```

### 关系数据库和表

- 创建了一个名为 `factory_management` 的关系数据库
- 创建了关系表 `production_orders`，包含：
  - 订单ID(order_id，主键)
  - 机器ID(machine_id，逻辑上引用时序表的machine_id)
  - 产品编码(product_code)
  - 生产起止时间(start_time, end_time)
  - 质量评分(quality_rating)

```sql
-- 创建关系数据库
CREATE DATABASE factory_management;

-- 创建关系表
CREATE TABLE factory_management.production_orders (
    order_id VARCHAR(20) PRIMARY KEY,
    machine_id INT,  -- 逻辑上引用machine_sensors.machine_id
    product_code VARCHAR(20),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    quality_rating FLOAT
);
```

## 插入数据

### 时序数据插入

```sql
-- 插入时序数据（设备传感器数据）
INSERT INTO factory_iot.machine_sensors VALUES
('2023-08-01 08:00:00', 2.3, 65.2, 1200, 101, 'LineA', 'CNC'),
('2023-08-01 09:15:00', 2.5, 66.1, 1250, 101, 'LineA', 'CNC'),
('2023-08-01 10:30:00', 2.7, 67.0, 1300, 101, 'LineA', 'CNC'),
('2023-08-01 11:45:00', 2.6, 66.5, 1280, 102, 'LineB', 'CNC'),
('2023-08-01 13:00:00', 2.8, 67.2, 1320, 102, 'LineB', 'CNC');
```

### 关系数据插入

```sql
-- 插入关系数据（生产订单数据）
INSERT INTO factory_management.production_orders VALUES
('ORD-2023-101', 101, 'PROD-A100', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '2 hours', 0.98),
('ORD-2023-102', 101, 'PROD-A200', NOW() - INTERVAL '7 hours 30 minutes', NOW() - INTERVAL '1 hour', 0.95),
('ORD-2023-103', 102, 'PROD-B100', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '3 hours', 0.92),
('ORD-2023-104', 102, 'PROD-B200', NOW() - INTERVAL '7 hours', NOW() - INTERVAL '2 hours 30 minutes', 0.90);
```

## 执行查询

查询分析：

 1. 关联关系：通过 `machine_id` 关联生产订单和设备传感器数据
 2. 时间过滤：只查询2023-08-01当天的传感器数据
 3. 聚合计算：计算每个订单期间设备的平均温度、振动和功耗
 4. 分组：按订单、产品、设备等维度分组
 5. 排序：按订单开始时间降序排列

预期结果：

- 展示每个订单的基本信息和对应的设备运行状态平均值
- 可以分析设备运行参数与产品质量的关系
- 可以比较不同生产线或设备类型的生产表现

```sql
-- 执行跨模分析查询
SELECT
    po.order_id,
    po.product_code,
    ms.machine_id,
    ms.production_line,
    ms.machine_type,
    po.start_time,
    po.end_time,
    po.quality_rating,
    AVG(ms.temperature) AS avg_temperature,
    AVG(ms.vibration) AS avg_vibration,
    AVG(ms.power_consumption) AS avg_power
FROM
    factory_management.production_orders AS po
JOIN
    factory_iot.machine_sensors AS ms
    ON po.machine_id = ms.machine_id
WHERE
    ms.ts BETWEEN '2023-08-01 00:00:00' AND '2023-08-02 00:00:00'
GROUP BY
    po.order_id,
    po.product_code,
    ms.machine_id,
    ms.production_line,
    ms.machine_type,
    po.start_time,
    po.end_time,
    po.quality_rating
ORDER BY
    po.start_time DESC;
```

### 查询结果

```sql
    order_id   | product_code | machine_id | production_line | machine_type |            start_time            |             end_time             | quality_rating |  avg_temperature  | avg_vibration | avg_power
---------------+--------------+------------+-----------------+--------------+----------------------------------+----------------------------------+----------------+-------------------+---------------+------------
  ORD-2023-104 | PROD-B200    |        102 | LineB           | CNC          | 2025-09-02 01:05:41.060688+00:00 | 2025-09-02 05:35:41.060688+00:00 |            0.9 |             66.85 |           2.7 |      1300
  ORD-2023-102 | PROD-A200    |        101 | LineA           | CNC          | 2025-09-02 00:35:41.060688+00:00 | 2025-09-02 07:05:41.060688+00:00 |           0.95 | 66.10000000000001 |           2.5 |      1250
  ORD-2023-101 | PROD-A100    |        101 | LineA           | CNC          | 2025-09-02 00:05:41.060688+00:00 | 2025-09-02 06:05:41.060688+00:00 |           0.98 | 66.10000000000001 |           2.5 |      1250
  ORD-2023-103 | PROD-B100    |        102 | LineB           | CNC          | 2025-09-02 00:05:41.060688+00:00 | 2025-09-02 05:05:41.060688+00:00 |           0.92 |             66.85 |           2.7 |      1300
(4 rows)

Time: 15.168875ms
```
