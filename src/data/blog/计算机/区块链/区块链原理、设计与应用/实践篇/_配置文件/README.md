# 配置文件说明

这个目录只保留博客文章需要引用的配置、脚本和示例文件。

`fabric-bin/` 是 Hyperledger Fabric 官方发行包解压后的本地工具目录，包含 `peer`、`orderer`、`configtxgen`、`fabric-ca-server` 等二进制文件。它体积较大，而且可以从官方发行包重新下载，因此不再提交到仓库。

如果需要复现实验，请在本目录下自行准备对应版本：

```bash
mkdir -p fabric-bin
```

然后下载 Hyperledger Fabric 2.3.1 对应的 release 包，并解压成如下结构：

```text
fabric-bin/
└── 2.3.1/
    ├── bin/
    └── config/
```

文章中的示例命令默认使用：

```bash
export FABRIC_VERSION=2.3.1
export FABRIC_CFG_PATH=${PWD}/fabric-bin/${FABRIC_VERSION}/config
```

不要把重新下载或生成的 `fabric-bin/` 提交回博客仓库。
