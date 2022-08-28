## HITsz 课程日历生成

### 如何使用

首先请确保你的环境中安装了：

1. nodejs

2. ts-node (可使用 `npm i ts-node -g` 安装)

然后在根目录中安装依赖：

```bash
npm install
```

从教务处网站上下载课程 json 数据，填入 payload.json 中。

![image-20220828100404037](https://img.tanknee.cn/blogpicbed/2022/08/28/220828630acd1d3da18.png)

>   点击左侧的已选标签，可以自动请求已选课程数据，数据的请求后缀是 `/queryYxkc`，打开 devtools 中的网络标签页，找到对应的请求，复制其中的响应体即可。

运行命令：

```bash
ts-node index.ts
```

即可在根目录下生成课程日历。

