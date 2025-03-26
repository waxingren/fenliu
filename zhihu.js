let body = JSON.parse($response.body);

// 过滤广告字段
if (body.data) {
    body.data = body.data.filter(item => 
        !(item.ad || item.is_ad || item.type === 'ad' || item.hasOwnProperty('adjson'))
    );
}

$done({ body: JSON.stringify(body) });
