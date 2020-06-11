/* 用来修改webpack配置的文件 */
const CracoLessPlugin = require('craco-less');

module.exports = {
		plugins: [{
				plugin: CracoLessPlugin,
				options: {
					lessLoaderOptions: {
						lessOptions: {
							modifyVars: {
								'@primary-color': '#1DA57A'
							},
							javascriptEnabled: true,
						},
					},
				},

			}
		],
		babel: {
			"plugins": [
				["@babel/plugin-proposal-decorators", {
					"legacy": true
				}]
			]
		}
		}
		// 编译装饰器语法
	/* 	addBabelPlugins(
				[
					'@babel/plugin-proposal-decorators',
					{
						"Legacy":true
					}
				]
			)  */
			