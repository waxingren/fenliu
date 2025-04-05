(function() {
  let body = $response.body;
  try {
    let obj = JSON.parse(body);
    if (obj.data) {
      obj.data = obj.data.filter(item => {
        // 过滤广告相关内容
        return !item.source?.includes('sugar.zhihu.com') &&
               !item.ad_info && 
               !item.promo_content && 
               !item.commercial_info && 
               !item.type?.includes('ad') &&
               !item.url?.includes('commercial');
      });
    }
    $done({ body: JSON.stringify(obj) });
  } catch (e) {
    console.log("脚本错误: " + e.message);
    $done({ body: body }); // 出错时返回原始数据
  }
})();
