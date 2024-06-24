#!/bin/bash

# 检测Linux发行版
if [ -f /etc/os-release ]; then
    # 使用source命令加载os-release文件，以便读取ID_LIKE或ID字段
    source /etc/os-release
    if [[ "$ID" == "centos" ]] || [[ "$ID_LIKE" == "centos" ]]; then
        PACKAGE_MANAGER="yum"
        CRON_PACKAGE="cronie"

    elif [[ "$ID" == "debian" ]] || [[ "$ID" == "ubuntu" ]] || [[ "$ID_LIKE" == "debian" ]]; then
        PACKAGE_MANAGER="apt"
        CRON_PACKAGE="cron"
    else
        echo "未知的Linux发行版: $ID"
        exit 1
    fi
else
    echo "无法确定Linux发行版。"
    exit 1
fi

# 检查是否已安装cron
if command -v crontab >/dev/null 2>&1; then
    echo "已安装Cron，正在卸载..."
    if [ "$PACKAGE_MANAGER" == "yum" ]; then
        sudo yum remove -y "$CRON_PACKAGE"
    elif [ "$PACKAGE_MANAGER" == "apt" ]; then
        sudo apt-get remove -y "$CRON_PACKAGE"
    fi
else
    echo "Cron未安装。"
fi

# 安装cron
echo "正在安装Cron..."
if [ "$PACKAGE_MANAGER" == "yum" ]; then
    sudo yum install -y "$CRON_PACKAGE"
elif [ "$PACKAGE_MANAGER" == "apt" ]; then
    sudo apt-get update && sudo apt-get install -y "$CRON_PACKAGE"
fi

echo "Cron安装完毕。"

# 启动cron服务
echo "正在启动Cron服务..."
if [ "$PACKAGE_MANAGER" == "yum" ]; then
    sudo systemctl start crond.service
    sudo systemctl enable crond.service
elif [ "$PACKAGE_MANAGER" == "apt" ]; then
    sudo systemctl start cron
    sudo systemctl enable cron
fi

echo "Cron服务启动完毕。"
echo "successful"
