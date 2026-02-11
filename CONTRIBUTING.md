# 贡献指南

欢迎你参与贡献！在此之前请先阅读本文。

## 启动项目

安装依赖：

```bash
$ yarn
# Or
$ npm i
```

启动项目：

```bash
$ yarn run dev
```

项目启动后，在浏览器中打开 http://127.0.0.1:3000 即可。

如果要更新 Native App 仓库，可以运行：

```bash
$ yarn run build:cap
```

为了能正常运行，需要配置环境变量。

## 配置环境变量

项目需要以下环境变量：

|             Name              |                     Description                      |
| :---------------------------: | :--------------------------------------------------: |
|        RESEND_API_KEY         | Your Resend key. Used to send feedback to your email |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Your Resend key. Used to send feedback to your email |
|   NEXT_PUBLIC_SUPABASE_URL    | Your Resend key. Used to send feedback to your email |

## 添加一个工具

在`/src/apps`下创建一个**以工具名命名、采用小蛇型命名法**的目录，并在根目录创建一个`README.zh-CN.md`文件，该文件的头部描述工具信息，内容则会展示给用户。

示例如下：

```markdown
---
name: "日期&时间计算"
status: "stable"
icon: "/icon/Google_Calendar_icon_(2020).svg"
description: "计算两个日期间隔的天数和时间，或推算几天前后是哪一天，可以算算你活了多久"
channel: life
freeSize: true
---

这里是帮助文本，提供必要的说明。
```

支持的属性如下：

| 属性名      | 类型    | 描述                                             | 是否必填 |
| ----------- | ------- | ------------------------------------------------ | -------- |
| name        | string  | 工具名                                           | 是       |
| status      | string  | 工具状态，可选值为`stable`、`beta`、`alpha`      | 是       |
| icon        | string  | 工具图标路径                                     | 是       |
| description | string  | 工具描述                                         | 是       |
| channel     | number  | 工具所属频道，可选值为`life`、`ai`、`media`、`4` | 是       |
| freeSize    | boolean | 消除默认的居中样式                               | 否       |

接着，在[appEntry.ts](/src/utils/appEntry.ts)中，根据已有的示例，添加引入函数。完成。

之后，你可以像开发常规 React app 一样编写代码。在`components`文件夹中有一些预先写好的组件。你也可以自己编写组件，但需要遵循 Material Design 的规范。

## 翻译

除工具文档之外，App 所有的需要翻译的字段都位于`/src/data/i18n/i18n.xlsx`这个表格中。你可以打开自由编辑。

编辑完成后，请先[提交 Pull Request](https://github.com/RiverTwilight/Toolkits/pulls)，代码审查完后，你可以运行`yarn run i18n:update`命令输出 json 格式文件。

目前需要翻译的语言有：

-   繁体中文（香港）
-   English
-   Francis

## 提交新设计

如果你有新的设计创意，可以把设计原型提交在这个[issue](https://github.com/RiverTwilight/YgkTool/issues/63)中。

## 测试用例

-   打开首页，点击头像登录，登陆完成后再次点击头像，确认用户信息正常显示
-   依次点击侧栏的关于 - 捐赠 - 首页，确认页面均能正常切换
-   打开任意一个工具，点击「收藏」，回到首页确认已被加入收藏，再从收藏进入此工具，取消收藏，回到首页，检查收藏是否被取消
