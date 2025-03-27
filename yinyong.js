// Quantumult X 知乎去广告脚本

const removeAds = (obj) => {
  try {
    if (obj?.data?.length > 0) {
      obj.data = obj.data.filter((item) => {
        const isAd =
          item?.resource_type === "ad" ||
          item?.extra?.recommend_start === true ||
          item?.type === "ad" ||
          item?.paid_info;
        return !isAd;
      });
    }
  } catch (err) {
    console.log(`[ERROR] 移除广告失败：${err}`);
  }
};

const processResponse = (response) => {
  try {
    let obj = JSON.parse(response.body);
    removeAds(obj);
    response.body = JSON.stringify(obj);
  } catch (err) {
    console.log(`[ERROR] 处理响应失败：${err}`);
  }
  return response;
};

$done(processResponse($response));
