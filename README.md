#一、如何在craco 中配置mobx呢？

##1、下载依赖
    npm install --save @craco/craco
    npm install --save @babel/plugin-proposal-decorators
##2、在项目根目录创建一个 craco.config.js 用于修改默认配置

    module.exports = {
    babel: {
        "plugins": [
            ["@babel/plugin-proposal-decorators", { "legacy": true }]
        ]
    }
    };
##3.修改package.json 启动配置

    "scripts": {
      "start": "craco start",
       "build": "craco build",
       "test": "craco test",
    }
##然后重新 npm start 一下就可以了。

#二、代理服务器
##服务器代理模式：
	1.作用:解决开发环境下的跨域问题，生产环境不能使用
	2.配置:在package.json中添加 proxy":"目标服务器地址"
	3.工作原理:
	原因：客户端和服务端有跨域问题，而服务端和服务端之间没有跨域问题
	解决方案:让开发(代理)服务器运行当前项目,项目和开发服务器就不会有跨域问题(遵循了同源策略),在开发(代理)服务器去访问目标服务器,(服务器和服务器之间是没有跨域问题的),所以开发(代理)服务器将请求目标服务器的资源返回当前页面
