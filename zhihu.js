# -------------------- MITM 及重写规则 --------------------
# 开启 MITM
[MITM]
hostname = *.zhihu.com
# 过滤知乎 APP 内广告（去除推广信息）
[Rewrite]
^https://api\.zhihu\.com/moments\? script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https://api\.zhihu\.com/topstory/recommend script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https://api\.zhihu\.com/v4/questions/\d+/related-readings script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https://api\.zhihu\.com/market/popovers script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https://api\.zhihu\.com/ab/api/v1/products/zhihu/platforms/ios/config script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https://api\.zhihu\.com/ad-style-service/request script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
# 过滤网页端知乎广告
^https://www\.zhihu\.com/api/v4/mcn/v2/linkcards\? script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https://www\.zhihu\.com/api/v4/hot_recommendation script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https://www\.zhihu\.com/api/v4/(answers|questions)/\d+/related-readings script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https://www\.zhihu\.com/commercial_api/banners_v3/mobile_banner script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
^https://zhuanlan\.zhihu\.com/api/articles/\d+/recommendation script-response-body https://github.com/waxingren/fenliu/raw/refs/heads/main/yinyong.js
# 处理知乎外链跳转
^https://link\.zhihu\.com/\?target=(.+) url 302 %1
