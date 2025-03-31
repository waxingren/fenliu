const { type, name } = $arguments;
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
};

let compatible = false; // 设定默认值
let config = JSON.parse($files[0]);
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
});

// 添加新代理
config.outbounds.push(...proxies);

// 处理代理分组
config.outbounds.forEach(i => {
  if (i.tag === 'all') {
    i.outbounds.push(...getTags(proxies));
  }
  if (i.tag === 'hk') {
    i.outbounds.push(...getTags(proxies, /港|hk|hongkong|kong kong|🇭🇰/i));
  }
  if (i.tag === 'tw') {
    i.outbounds.push(...getTags(proxies, /台|tw|taiwan|🇹🇼/i));
  }
  if (i.tag === 'jp') {
    i.outbounds.push(...getTags(proxies, /日本|jp|japan|🇯🇵/i));
  }
  if (i.tag === 'sg') {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(新|sg|singapore|🇸🇬)/i));
  }
  if (i.tag === 'us') {
    i.outbounds.push(...getTags(proxies, /美|us|unitedstates|united states|🇺🇸/i));
  }
});

// 处理空的出站规则
config.outbounds.forEach(outbound => {
  if (!outbound.outbounds || outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound);
      compatible = true;
    }
    outbound.outbounds = [compatible_outbound.tag]; // 直接赋值数组，避免 push 出错
  }
});

$content = JSON.stringify(config, null, 2);

// 获取代理标签
function getTags(proxies, regex) {
  return proxies
    .filter(p => p.tag && (!regex || regex.test(p.tag))) // 避免 p.tag 为空
    .map(p => p.tag);
}
