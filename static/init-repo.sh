#!/bin/bash

# Git仓库初始化和推送脚本
# 用途：初始化本地Git仓库，添加远程源，并强制推送到master分支
# 作者：KWDB开发团队
# 创建时间：$(date +"%Y-%m-%d")

set -e  # 遇到错误时立即退出

echo "开始初始化Git仓库..."

# 初始化Git仓库
echo "1. 初始化Git仓库"
git init

# 添加远程仓库源
echo "2. 添加远程仓库源"
git remote add origin https://openatom.tech/kwdb/dev.git

# 添加所有文件到暂存区
echo "3. 添加所有文件到暂存区"
git add .

# 提交初始化信息
echo "4. 提交初始化信息"
git commit -m 'init'

# 强制推送到远程master分支
echo "5. 强制推送到远程master分支"
git push -u origin master -f

echo "Git仓库初始化和推送完成！"