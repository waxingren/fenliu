# > 知乎
hostname = api.zhihu.com, www.zhihu.com, appcloud2.zhihu.com, m-cloud.zhihu.com, zhuanlan.zhihu.com, link.zhihu.com, sugar.zhihu.com, zhihu-web-analytics.zhihu.com, datahub.zhihu.com, 118.89.204.198, 103.41.167.237, 2402:4e00:1200:ed00:0:9089:6dac:96b6, 103.41.167.236, 103.41.167.234, 103.41.167.235, 103.41.167.226
# 首页悬浮图标、顶部横幅、开屏广告、关注页推荐、推荐信息流、热榜信息流、热榜直播、回答底部卡片
^https:\/\/api\.zhihu\.com\/(answers|articles)\/v2\/\d+ url script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https:\/\/api\.zhihu\.com\/commercial_api\/app_float_layer url script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https:\/\/api\.zhihu\.com\/commercial_api\/(answer\/\d+\/bottom-v2|article\/\d+\/bottom-v2|banners_v3\/app_topstory_banner|launch_v2|real_time_launch_v2) url reject-dict
^https:\/\/api\.zhihu\.com\/content-distribution-core\/bubble\/common\/settings url reject-dict
^https:\/\/api\.zhihu\.com\/feed\/render\/tab\/config\? url script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https:\/\/api\.zhihu\.com\/(moments\/lastread|drama\/hot-drama-list) url reject-dict
^https:\/\/api\.zhihu\.com\/(moments_v3|topstory\/hot-lists\/total|topstory\/recommend) url script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https:\/\/api\.zhihu\.com\/root\/window url reject-dict
^https:\/\/api\.zhihu\.com\/v2\/topstory\/hot-lists\/everyone-seeing\? url script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js

# 会员页面弹窗、悬浮动图
^https:\/\/api\.zhihu\.com\/(bazaar\/float_window|market\/popovers_v2) url reject-dict
^https:\/\/api\.zhihu\.com\/bazaar\/vip_tab\/header\? url script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js

# 我的页面项目列表、会员卡片
^https:\/\/api\.zhihu\.com\/me\/guides url reject-dict
^https:\/\/api\.zhihu\.com\/unlimited\/go\/my_card url reject

# 搜索页关键词、猜你想搜
^https:\/\/api\.zhihu\.com\/search\/preset_words url reject-dict
^https:\/\/api\.zhihu\.com\/search\/recommend_query\/v2\? url response-body "recommend_queries":\{.+\} response-body "recommend_queries":{}
^https:\/\/www\.zhihu\.com\/api\/v4\/search\/related_queries\/(article|answer)\/\d+ url reject-dict

# 回答详情页、评论区顶部、下一个回答
^https:\/\/api\.zhihu\.com\/comment_v5\/(articles|answers)\/\d+\/list-headers url reject-dict
^https:\/\/api\.zhihu\.com\/next-(bff|data|render)\? url script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https:\/\/api\.zhihu\.com\/prague\/related_suggestion_native\/feed\? url reject-dict
^https:\/\/api\.zhihu\.com\/questions\/\d+(\/answers|\/feeds|\?include=) url script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https:\/\/api\.zhihu\.com\/v5\.1\/topics\/answer\/\d+\/relation url reject-dict
^https:\/\/www\.zhihu\.com\/api\/v4\/(articles|answers)\/\d+\/recommendations?\? url script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js

# 其他、服务器推送配置
^https:\/\/api\.zhihu\.com\/ab\/api\/v1\/products\/zhihu\/platforms\/ios\/config url reject
^https:\/\/api\.zhihu\.com\/ad-style-service\/request url reject-dict
^https:\/\/appcloud2\.zhihu\.com\/v3\/config url script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https:\/\/appcloud2\.zhihu\.com\/v3\/resource\?group_name=mp url reject-dict
^https:\/\/link\.zhihu\.com\/\?target=(https?)?(%3A|:)?(\/\/|%2F%2F)?(.*?)(&source.*)?$ url 302 http://$4
^https:\/\/m-cloud\.zhihu\.com\/api\/cloud\/config\/all\? url script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js

# 新增规则（基于抓取内容）
# 开屏广告
^https?:\/\/sugar\.zhihu\.com\/plutus_adreaper url reject

# 日志上报接口
^https?:\/\/zhihu-web-analytics\.zhihu\.com\/api\/v.*\/za\/logs\/batch url reject

# 数据收集接口
^https?:\/\/datahub\.zhihu\.com\/collector\/zlab url reject

# 横幅广告接口
^https?:\/\/www\.zhihu\.com\/commercial_api\/banners_v3 url reject

# 推荐信息流广告
^https?:\/\/api\.zhihu\.com\/topstory\/recommend url script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js

# 热榜广告
^https?:\/\/api\.zhihu\.com\/topstory\/hot-lists\/total url script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js

# 屏蔽广告图片
^https?:\/\/sugar\.zhihu\.com\/.*\.(jpg|png|gif) url reject

# 屏蔽第三方广告 SDK
^https?:\/\/ad\.mcloud\.139\.com\/.* url reject

# 屏蔽知乎日志上报
^https?:\/\/zhihu-web-analytics\.zhihu\.com\/.* url reject

# 网页版去广告
^https:\/\/api\.zhihu\.com\/distribute\/rhea\/qa_ad_card\/h5\/recommendation\? url reject-dict
^https:\/\/www\.zhihu\.com\/api\/v4\/hot_recommendation url reject
^https:\/\/www\.zhihu\.com\/api\/v4\/mcn\/v2\/linkcards\? url reject
^https:\/\/www\.zhihu\.com\/api\/v4/(answers|questions)\/\d+/related-readings url reject
^https:\/\/www\.zhihu\.com\/commercial_api\/banners_v3\/mobile_banner url reject
^https:\/\/zhuanlan\.zhihu\.com\/api\/articles\/\d+\/recommendation url reject
