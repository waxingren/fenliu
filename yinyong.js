// ==UserScript==
// @name         Quantumult X 版知乎去广告
// @namespace    https://github.com/fmz200/wool_scripts/
// @version      1.0.0
// @description  去除知乎广告、过滤推荐内容、屏蔽黑名单用户。
// @author       YourName
// @match        *://*.zhihu.com/*
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  // =======================
  // 广告屏蔽
  // =======================

  function removeAds(obj) {
    try {
      if (obj?.data?.length > 0) {
        obj.data = obj.data.filter((item) => {
          const isAd =
            item?.resource_type === "ad" ||
            item?.extra?.recommend_start === true ||
            item?.type === "ad" ||
            item?.paid_info; // 针对盐选专栏广告
          return !isAd;
        });
      }
    } catch (err) {
      console.error(`[ERROR] 移除广告失败：${err}`);
    }
  }

  // =======================
  // 黑名单过滤
  // =======================

  const blockedUsersKey = "zhihu_blocked_users";
  let customBlockedUsers = JSON.parse($persistentStore.read(blockedUsersKey) || "{}");

  function filterBlacklist(obj) {
    try {
      if (obj?.data?.length > 0) {
        obj.data = obj.data.filter((item) => {
          const authorName = item?.author?.fullname;
          const isBlackUser = customBlockedUsers[authorName];
          if (isBlackUser) {
            console.log(`[INFO] 已屏蔽黑名单用户“${authorName}”的内容`);
          }
          return !isBlackUser;
        });
      }
    } catch (err) {
      console.error(`[ERROR] 过滤黑名单失败：${err}`);
    }
  }

  // =======================
  // 主逻辑
  // =======================

  function processResponse(response) {
    try {
      let obj = JSON.parse(response.body);

      // 移除广告
      removeAds(obj);

      // 黑名单过滤
      filterBlacklist(obj);

      // 更新响应数据
      response.body = JSON.stringify(obj);
    } catch (err) {
      console.error(`[ERROR] 处理响应失败：${err}`);
    }
    return response;
  }

  function handleRequest(request) {
    try {
      // 取消二次跳转链接
      if (request.url.includes("link.zhihu.com")) {
        const regRet = request.url.match(/target=(.+?)(&|$)/);
        if (regRet && regRet.length === 3) {
          const targetUrl = decodeURIComponent(regRet[1]);
          $done({ redirect: targetUrl });
          return;
        }
      }
    } catch (err) {
      console.error(`[ERROR] 处理请求失败：${err}`);
    }
  }

  // =======================
  // 初始化
  // =======================

  function init() {
    console.log("[INFO] 脚本已启动...");

    // 监听请求
    if ($request) {
      handleRequest($request);
    }

    // 处理响应
    if ($response) {
      processResponse($response);
    }
  }

  init();
})();
