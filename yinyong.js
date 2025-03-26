// ==UserScript==
// @name         Quantumult X 版知乎去广告与黑名单管理
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
  // 配置管理
  // =======================

  const blockedUsersKey = "zhihu_blocked_users";
  const killArticleKey = "zhihu_kill_article";
  const killVideoKey = "zhihu_kill_video";

  let customBlockedUsers = JSON.parse($persistentStore.read(blockedUsersKey) || "{}");
  let killArticleOn = $persistentStore.read(killArticleKey) === "true";
  let killVideoOn = $persistentStore.read(killVideoKey) === "true";

  function toggleKillArticle() {
    killArticleOn = !killArticleOn;
    $persistentStore.write(killArticleOn.toString(), killArticleKey);
    $notification.post("屏蔽文章", "", killArticleOn ? "已启用" : "已禁用");
  }

  function toggleKillVideo() {
    killVideoOn = !killVideoOn;
    $persistentStore.write(killVideoOn.toString(), killVideoKey);
    $notification.post("屏蔽视频", "", killVideoOn ? "已启用" : "已禁用");
  }

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
            item?.type === "ad";
          return !isAd;
        });
      }
    } catch (err) {
      console.error(`[ERROR] 移除广告失败：${err}`);
    }
  }

  // =======================
  // 屏蔽文章或视频
  // =======================

  function removeArticlesAndVideos(obj) {
    try {
      if (obj?.data?.length > 0) {
        obj.data = obj.data.filter((item) => {
          const isArticle = killArticleOn && item?.type === "article";
          const isVideo = killVideoOn && item?.type === "video";
          return !isArticle && !isVideo;
        });
      }
    } catch (err) {
      console.error(`[ERROR] 屏蔽文章或视频失败：${err}`);
    }
  }

  // =======================
  // 黑名单过滤
  // =======================

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
  // 自动调用「不感兴趣」接口
  // =======================

  function dismissRecommendation(id, type) {
    const headers = {
      "Content-Type": "application/json",
    };
    fetch("https://www.zhihu.com/api/v4/feed/dismiss_recommendation", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ id, type }),
    })
      .then((response) => {
        if (response.ok) {
          console.log(`[INFO] 已屏蔽推荐内容：${id}`);
        } else {
          console.error(`[ERROR] 屏蔽推荐内容失败：${id}`);
        }
      })
      .catch((err) => {
        console.error(`[ERROR] 请求失败：${err}`);
      });
  }

  // =======================
  // 主逻辑
  // =======================

  function processResponse(response) {
    try {
      let obj = JSON.parse(response.body);

      // 移除广告
      removeAds(obj);

      // 屏蔽文章或视频
      removeArticlesAndVideos(obj);

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
