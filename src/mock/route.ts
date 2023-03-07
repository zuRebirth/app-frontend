export default [
    // 获取路由信息
    {
        url: '/api/getRoute',
        method: 'post',
        response: () => {
            return {
                code: 200,
                data: [
                    {
                      "path": "/basic",
                      "component": "Layout",
                      "redirect": "/basic/detection",
                      "name": "/basic",
                      "meta": {
                        "title": "基础设置",
                        "icon": "system",
                        "hidden": false,
                        "alwaysShow": true,
                        "roles": ["ADMIN"],
                        "keepAlive": true
                      },
                      "children": [
                        {
                          "path": "detection",
                          "component": "basic/detection/index",
                          "name": "detection",
                          "meta": {
                            "title": "检测项目设置",
                            "icon": "system",
                            "hidden": false,
                            "alwaysShow": false,
                            "roles": ["ADMIN"],
                            "keepAlive": true
                          }
                        },
                        {
                          "path": "price",
                          "component": "basic/price/index",
                          "name": "price",
                          "meta": {
                            "title": "预约单价设置",
                            "icon": "system",
                            "hidden": false,
                            "alwaysShow": false,
                            "roles": ["ADMIN"],
                            "keepAlive": true
                          }
                        },
                        {
                          "path": "shop",
                          "component": "basic/shop/index",
                          "name": "shop",
                          "meta": {
                            "title": "商铺管理",
                            "icon": "system",
                            "hidden": false,
                            "alwaysShow": false,
                            "roles": ["ADMIN"],
                            "keepAlive": true
                          }
                        },
                        {
                          "path": "goods",
                          "component": "basic/goods/index",
                          "name": "goods",
                          "meta": {
                            "title": "商品管理",
                            "icon": "system",
                            "hidden": false,
                            "alwaysShow": false,
                            "roles": ["ADMIN"],
                            "keepAlive": true
                          }
                        }
                      ]
                    },
                    {
                      "path": "/sampling",
                      "component": "Layout",
                      "redirect": "/sampling/list",
                      "name": "sampling",
                      "meta": {
                        "title": "日常抽检管理",
                        "icon": "system",
                        "hidden": false,
                        "alwaysShow": true,
                        "roles": ["ADMIN"],
                        "keepAlive": true
                      },
                      "children": [
                        {
                          "path": "sampleList",
                          "component": "sampling/sampleList/index",
                          "name": "sampleList",
                          "meta": {
                            "title": "样品列表",
                            "icon": "system",
                            "hidden": false,
                            "alwaysShow": false,
                            "roles": ["ADMIN"],
                            "keepAlive": true
                          }
                        }
                      ]
                    },
                    {
                      "path": "/appt",
                      "component": "Layout",
                      "redirect": "/appt/list",
                      "name": "/appt",
                      "meta": {
                        "title": "预约送检管理",
                        "icon": "system",
                        "hidden": false,
                        "alwaysShow": true,
                        "roles": ["ADMIN"],
                        "keepAlive": true
                      },
                      "children": [
                        {
                          "path": "list",
                          "component": "appt/list/index",
                          "name": "list",
                          "meta": {
                            "title": "预约送检列表",
                            "icon": "system",
                            "hidden": false,
                            "alwaysShow": false,
                            "roles": ["ADMIN"],
                            "keepAlive": true
                          }
                        },
                        // {
                        //   "path": "detail",
                        //   "component": "appt/detail/index",
                        //   "name": "detail",
                        //   "meta": {
                        //     "title": "预约送检支付明细",
                        //     "icon": "system",
                        //     "hidden": false,
                        //     "alwaysShow": false,
                        //     "roles": ["ADMIN"],
                        //     "keepAlive": true
                        //   }
                        // },
                      ]
                    },
                    {
                      "path": "/check",
                      "component": "Layout",
                      "meta": {
                        "title": "检测管理",
                        "icon": "system",
                        "hidden": false,
                        "alwaysShow": true,
                        "roles": ["ADMIN"],
                        "keepAlive": true
                      },
                      "children": [
                        {
                          "path": "task",
                          "component": "check/task/index",
                          "name": "task",
                          "meta": {
                            "title": "检测任务",
                            "icon": "system",
                            "hidden": false,
                            "alwaysShow": false,
                            "roles": ["ADMIN"],
                            "keepAlive": true
                          }
                        },
                        {
                          "path": "recheck",
                          "component": "check/recheck/index",
                          "name": "recheck",
                          "meta": {
                            "title": "复检列表",
                            "icon": "system",
                            "hidden": false,
                            "alwaysShow": false,
                            "roles": ["ADMIN"],
                            "keepAlive": true
                          }
                        },
                        {
                          "path": "result",
                          "component": "check/result/index",
                          "name": "result",
                          "meta": {
                            "title": "检测结果",
                            "icon": "system",
                            "hidden": false,
                            "alwaysShow": false,
                            "roles": ["ADMIN"],
                            "keepAlive": true
                          }
                        },
                        {
                          "path": "analysis",
                          "component": "check/analysis/index",
                          "name": "analysis",
                          "meta": {
                            "title": "检测分析",
                            "icon": "system",
                            "hidden": false,
                            "alwaysShow": false,
                            "roles": ["ADMIN"],
                            "keepAlive": true
                          }
                        }
                      ]
                    }
                  ]
                  
            }
        },
    },
]