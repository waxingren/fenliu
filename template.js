// https://raw.githubusercontent.com/xream/scripts/main/surge/modules/sub-store-scripts/sing-box/template.js
// 修改版：支持自建 Reality/XTLS 节点，同时保留以前机场节点识别
// 使用方法：
// 1. URL 参数中加上 type=组合订阅、name=你的订阅名称、outbound=你的分组规则
// 2. 支持 includeUnsupportedProxy=true（默认已强制开启）
// 3. 可以传入聚合订阅 URL 参数 url，需要 encodeURIComponent

log(`🚀 开始`)

let { type, name, outbound, includeUnsupportedProxy = true, url } = $arguments

log(`传入参数 type: ${type}, name: ${name}, outbound: ${outbound}, includeUnsupportedProxy: ${includeUnsupportedProxy}`)

// 判断是组合订阅还是单订阅
type = /^1$|col|组合/i.test(type) ? 'collection' : 'subscription'

// 解析 JSON/JSON5 配置
const parser = ProxyUtils.JSON5 || JSON
log(`① 使用 ${ProxyUtils.JSON5 ? 'JSON5' : 'JSON'} 解析配置文件`)
let config
try {
  config = parser.parse($content ?? $files[0])
} catch (e) {
  log(`${e.message ?? e}`)
  throw new Error(`配置文件不是合法的 ${ProxyUtils.JSON5 ? 'JSON5' : 'JSON'} 格式`)
}

log(`② 获取订阅节点`)
let proxies
if (url) {
  log(`直接从 URL ${url} 读取订阅`)
  proxies = await produceArtifact({
    name,
    type,
    platform: 'sing-box',
    produceType: 'internal',
    produceOpts: {
      'include-unsupported-proxy': true, // ⚠️ 强制开启，支持 Reality/XTLS 节点
    },
    subscription: {
      name,
      url,
      source: 'remote',
    },
  })
} else {
  log(`读取名称为 ${name} 的 ${type === 'collection' ? '组合' : ''}订阅`)
  proxies = await produceArtifact({
    name,
    type,
    platform: 'sing-box',
    produceType: 'internal',
    produceOpts: {
      'include-unsupported-proxy': true, // ⚠️ 强制开启
    },
  })
}

// 解析 outbound 参数
log(`③ outbound 规则解析`)
const outbounds = outbound
  .split('🕳')
  .filter(i => i)
  .map(i => {
    let [outboundPattern, tagPattern = '.*'] = i.split('🏷')
    const tagRegex = createTagRegExp(tagPattern)
    log(`匹配 🏷 ${tagRegex} 的节点将插入匹配 🕳 ${createOutboundRegExp(outboundPattern)} 的 outbound 中`)
    return [outboundPattern, tagRegex]
  })

// 插入节点到对应 outbound
log(`④ outbound 插入节点`)
config.outbounds.map(outbound => {
  outbounds.map(([outboundPattern, tagRegex]) => {
    const outboundRegex = createOutboundRegExp(outboundPattern)
    if (outboundRegex.test(outbound.tag)) {
      if (!Array.isArray(outbound.outbounds)) outbound.outbounds = []
      // ⚠️ 修改 getTags，让 Reality/XTLS 节点也能加入
      const tags = getTags(proxies, tagRegex)
      log(`🕳 ${outbound.tag} 匹配 ${outboundRegex}, 插入 ${tags.length} 个 🏷 匹配 ${tagRegex} 的节点`)
      outbound.outbounds.push(...tags)
    }
  })
})

// 空 outbound 检查，自动插入 COMPATIBLE
const compatible_outbound = { tag: 'COMPATIBLE', type: 'direct' }
let compatible
log(`⑤ 空 outbounds 检查`)
config.outbounds.map(outbound => {
  outbounds.map(([outboundPattern, tagRegex]) => {
    const outboundRegex = createOutboundRegExp(outboundPattern)
    if (outboundRegex.test(outbound.tag)) {
      if (!Array.isArray(outbound.outbounds)) outbound.outbounds = []
      if (outbound.outbounds.length === 0) {
        if (!compatible) config.outbounds.push(compatible_outbound), (compatible = true)
        log(`🕳 ${outbound.tag} 的 outbounds 为空, 自动插入 COMPATIBLE(direct)`)
        outbound.outbounds.push(compatible_outbound.tag)
      }
    }
  })
})

// 最后把所有节点加入配置，保证自建节点也在最外层
config.outbounds.push(...proxies)

// 输出最终配置
$content = JSON.stringify(config, null, 2)

// ----------------- 工具函数 -----------------
function getTags(proxies, regex) {
  // 返回匹配 regex 的所有节点 tag，包括 Reality/XTLS 节点
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}

function log(v) {
  console.log(`[📦 sing-box 模板脚本] ${v}`)
}

function createTagRegExp(tagPattern) {
  return new RegExp(tagPattern.replace('ℹ️', ''), tagPattern.includes('ℹ️') ? 'i' : undefined)
}

function createOutboundRegExp(outboundPattern) {
  return new RegExp(outboundPattern.replace('ℹ️', ''), outboundPattern.includes('ℹ️') ? 'i' : undefined)
}

log(`🔚 结束`)
