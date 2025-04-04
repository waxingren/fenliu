const scriptName = "Zhihu Ad Blocker";

function removeAdsFromResponse(response) {
    try {
        let obj = JSON.parse(response.body);

        // 移除广告字段
        if (obj.data && Array.isArray(obj.data)) {
            obj.data = obj.data.filter(item => {
                const isAd = item["resource_type"] === "ad" || item["extra"]["recommend_start"] === true;
                return !isAd;
            });
        }

        response.body = JSON.stringify(obj);
    } catch (err) {
        console.error(`动态过滤广告接口数据失败：${err}`);
    }

    return response;
}

function deepRemoveAds(data) {
    if (Array.isArray(data)) {
        return data.map(item => deepRemoveAds(item)).filter(item => !item.is_ad);
    } else if (typeof data === "object" && data !== null) {
        for (let key in data) {
            if (key === "ad_info" || key === "ad") {
                delete data[key];
            } else {
                data[key] = deepRemoveAds(data[key]);
            }
        }
    }
    return data;
}

// 主函数
(async () => {
    if ($.isResponse) {
        $.response = removeAdsFromResponse($.response);
    }
})();
