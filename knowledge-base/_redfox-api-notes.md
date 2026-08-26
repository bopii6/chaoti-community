# RedFoxHub 公众号 API 使用备忘（2026-08-23 已验证跑通）

> 用途：按「作者维度」获取公众号文章（解决搜狗关键词混入他人文章的问题）。
> 鉴权：HTTP 请求头 `X-API-KEY: ak_c81fd7ae8d0b46849282e05437d1db48`（或 `REDFOX_API_KEY`）。
> 计价：接口按次计费（如 queryWorkList ¥0.04/次），累计量有阶梯价；当前用免费积分。

## 已验通的 3 个接口（公众号平台）

| 接口 | 路径 | 用途 |
|---|---|---|
| 搜索公众号账号（广域库） | POST /story/api/gzh/data/searchUser | 按关键词找账号 → 拿到 account/wxId/bizInfo |
| 获取账号作品列表（广域库） | POST /story/api/gzh/data/queryWorkList | 按账号拉文章列表（含阅读/点赞/收藏/分享） |
| 获取作品详情（广域库） | POST /story/api/gzh/data/workDetail | 按 workUuid 取文章全文（content 字段） |

## 请求示例

```bash
# 1) 找账号
curl -X POST https://redfox.hk/story/api/gzh/data/searchUser \
  -H "Content-Type: application/json" -H "X-API-KEY: ak_..." \
  -d '{"keyword":"数字生命卡兹克","offset":0}'

# 2) 拉文章列表（sortType: 0默认/2最新/4最热；offset 每页+20）
curl -X POST https://redfox.hk/story/api/gzh/data/queryWorkList \
  -H "Content-Type: application/json" -H "X-API-KEY: ak_..." \
  -d '{"account":"Rockhazix","offset":0,"sortType":"2"}'

# 3) 取全文
curl -X POST https://redfox.hk/story/api/gzh/data/workDetail \
  -H "Content-Type: application/json" -H "X-API-KEY: ak_..." \
  -d '{"workUuid":"5395139559ed6f35e576b883a624102a"}'
```

## 账号标识（数字生命卡兹克，已验证）

- account（微信号）：Rockhazix
- wxId（原始ID）：gh_94dba26f8ca0
- bizInfo：MzIyMzA5NjEyMA==
- 作品总数：543 篇（queryWorkList total）

## 推荐收录流程（省积分）

1. searchUser 建「账号→标识」映射表（一次调用，长期复用）；
2. queryWorkList 拉列表（20 条/页，看标题+数据，先只拉标题级索引）；
3. 只对**高价值文章**（高阅读/高收藏/课程相关标题）调 workDetail 取全文；
4. 全文 → 收录库 articles/ 归档 → 提炼知识点。

## 原始响应存档（research-data/）

- redfox-test-searchUser.json（搜索卡兹克账号）
- redfox-kazike-worklist.json（卡兹克文章列表，543 条 total）
- redfox-kazike-latest-article.json（最新一篇全文，10,941 字）
- redfox-doc-workDetail.json（workDetail 接口文档）
