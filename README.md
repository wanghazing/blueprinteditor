# 蓝图编辑器

[在线预览](http://159.75.210.117:8033/ugi/)

`qdz-tool`包含一系列便于前端开发者使用的提效工具：表格表单代码生成、动画代码生成、base64 预览、devServer 配置、文件自动同步...
众所周知，在实际项目开发中，我们经常会启动一个开发服务器，我们用它来托管文件、监听代码变化、转发请求、处理跨域，多数时候，`vue-cli`和`vite`自带的 devServer 就能满足要求。
但是在某些情况下，我们需要对 devServer 进行一些定制，例如：一个前端对接多个后端，需要频繁切换；数据珍贵，用完就没，但是前端还有样式没调...
我们可以将 cli 中的 devServer 独立出来，单独起一个服务，做到以下事情：

- 多服务间快速切换
- http 报文数据存储
- 模拟网络异常
- 自定义网络链路

为了达到这些目的，我们可以使用`express`或`koa`，基于[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)这个中间件，定制属于我们自己的 devServer.
在一开始的时候，做一些简单的配置，可以通过代码、命令行做简单的配置。
后来，需要管理多个 devServer，需要做一个图形界面，以列表-表单的形式维护 devServer 配置。
再后来，需要对网络链路配置，列表-表单就力不从心了，在此背景下，本工具诞生了。

本项目仅提供蓝图编辑功能，完整的`qdz-tool`工具箱包含大量业务相关代码、不适合开源。

# 使用方法

用户可在蓝图编辑器中自由创建多种类型的节点和关系，某些节点可支持添加自定义规则，以下是节点列表

- 客户端(每张蓝图仅支持一个客户端，不支持添加自定义规则)
- 服务端(仅支持修改 host)
- -<拦截器(允许添加出口规则)
- \->拦截器(允许添加入口规则)
- 延时(允许添加延时规则)
- 资源(可通过右键菜单或拖拽文件到画布来创建，不可编辑)
- 异常(允许添加 http 异常规则)
- 标注(可编辑文本信息，无输入输出端口)

关系操作方式：
点击一个节点的一个端口并按住鼠标拖动

- 如果当前端口没有连接线，则会生成一条新的连接线，连接线的一端连接出发的端口，另一端随鼠标移动移动
- 如果鼠标在另一个空闲端口松开
- 如果该空闲端口类型和出发端口的类型不一致(颜色不一样)，则产生一个新的关系
- 如果该空闲端口类型和出发端口的类型一致(颜色一样)，则关系无效，连接线消失
- 如果鼠标在另一个非空闲端口松开，关系无效，连接线消失
- 如果鼠标松开时的位置附件没有端口，则未产生关系，连接线消失
- 如果当前端口已经有连接线，则该连接线会离开当前端口，随鼠标移动，之后的规则参考上面的描述

关于资源节点
资源节点支持读取用户置入的文件，并按照注入的`Resolver`解析文件内容，生成端口，目前提供了解析 http 报文 json 文件的`Resolver`，如果你需要解析其他类型的文件，可以参考`/src/utils/resolver`目录下的文件，创建自己的`Resolver`，然后在`/src/store/blueprint/index.ts`的`resolverList`中，注入你的`Resolver`.
