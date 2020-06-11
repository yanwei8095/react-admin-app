##如何在craco 中配置mobx呢？

#1、下载依赖
``npm install --save @craco/craco
npm install --save @babel/plugin-proposal-decorators ``
#2、在项目根目录创建一个 craco.config.js 用于修改默认配置

module.exports = {
    babel: {
        "plugins": [
            ["@babel/plugin-proposal-decorators", { "legacy": true }]
        ]
    }
};
#3.修改package.json 启动配置

"scripts": {
  "start": "craco start",
   "build": "craco build",
   "test": "craco test",
}
然后重新 npm start 一下就可以了。