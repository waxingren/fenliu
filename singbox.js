const { type, name } = $arguments;
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
};

let compatible;
let config = JSON.parse($files[0]);

// 验证 config 是否为合法对象
if (!config || typeof config !== 'object') {
  throw new Error('Invalid configuration file');
}

// 生成代理列表
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
});

// 验证 proxies 是否有效
if (!Array.isArray(proxies) || proxies.length === 0) {
  throw new Error('Failed to generate proxies or proxies is empty');
}

// 将生成的代理插入到 outbounds
config.outbounds.push(...proxies);

// 动态分配代理到不同出站
config.outbounds.map(i => {
  if (['all'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies));
  }
  if (['hk'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /港|hk|hongkong|kong kong|🇭🇰/i));
  }
  if (['tw'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /台|tw|taiwan|🇹🇼/i));
  }
  if (['jp'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日本|jp|japan|🇯🇵/i));
  }
  if (['sg'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(新|sg|singapore|🇸🇬)/i));
  }
  if (['us'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美|us|unitedstates|united states|🇺🇸/i));
  }
});

// 处理空出站
config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!config.outbounds.some(o => o.tag === 'COMPATIBLE')) {
      config.outbounds.push(compatible_outbound);
    }
    outbound.outbounds.push('COMPATIBLE');
  }
});

// 格式化输出
$content = JSON.stringify(config, null, 2);

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag);
}
