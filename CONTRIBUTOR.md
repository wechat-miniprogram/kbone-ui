# 贡献规范

如果有兴趣一起参与开发和维护 kbone-ui，可遵循此规范进行代码贡献。

## 开发流程

首先需要将代码仓库 clone 下来：https://github.com/wechat-miniprogram/kbone-ui，然后切到 develop 分支。

初次将代码 clone 下来后，需要先运行 `npm run install` 来完成 lerna 的初始化，之后才能进入开发的流程：

1. 完成代码开发
2. 补充单元测试
3. 在包内执行 `npm run test` 确保单元测试没有问题
4. 在 kbone-ui 根目录执行 `npm run check` 确保代码检查和所有包单元测试正常
5. 在包内的 CHANGELOG.md 中补充版本更新日志，具体格式可参考 packages/miniprogram-element/CHANGELOG.md
6. 如有必要，需要修改 docs 目录下的文档
7. 提交到 git
8. 在 kbone-ui 根目录执行 `npm run publish` 打标签并发布到 npm

具体规范下面进行说明：

## 目录规范


```sh
.
├── .babelrc
├── .eslintignore
├── .eslintrc.js
├── .git
├── .gitignore
├── .npmignore
├── CONTRIBUTOR.md
├── LICENSE
├── README.md
├── build # 编译文件
├── examples # 对外示例
├── index.html # 模板文件
├── package.json
├── packages # 组件模板
├── src # 源代码
├── test
└── typings
```

## 其他规范

### 代码检查

统一走 eslint 来约束，在 kbone-ui 根目录下执行：`npm run lint` 会对各个包内的 src、test、tool 目录下的 js 文件进行检查，确保无任何规则失败提示。

### 单元测试

各个包内部实现单元测试和覆盖率检查，统一使用 jest 工具链；如果涉及到自定义组件则使用 miniprogram-simulate；如果有 CI 需求，则使用 codecov 来管理覆盖率检查。

包内命令统一为：

```
# 执行单元测试
npm run test

# 调试单元测试
npm run test-debug

# 执行覆盖率检查
npm run coverage

# 接入 CI 覆盖率检查
npm run codecov
```

> PS：可参考 packages/miniprogram-element 的实现。

在包内实现完单元测试后，需要在 kbone-ui 根目录下的 package.json 中补充相应的执行命令，确保在 kbone-ui 根目录下执行 `npm run test` 可以执行所有包内的单元测试。

### 版本规范

参考：https://semver.org/lang/zh-CN/

### commit 信息

格式为 `[变化]: 具体操作`，一条完整的示例：`feature: support camera inner component`。

变化支持如下枚举值：

* feature：新增特性
* fixed：修复 bug
* docs：文档更新
* update：demo、更新日志、构建代码等源码之外的一些更新调整
* refactor：重构
* lint：调整代码以通过代码检查

### 分支

默认开发分支为 develop 分支，如果需要提 pr，则以此分支为基准。当 develop 分支稳定后会合入 master 分支。

创建其他分支的命名规范：

* feature-xxx：新特性分支
* fixed-xxx：bugfix 分支
* refactor-xxx：重构分支

合入流程：

其他分支 ---> develop 分支 ---> master 分支

### CI

目前未接入，待补充。
