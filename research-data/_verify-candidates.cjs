const fs = require('fs');
const API = 'https://redfox.hk/story/api/gzh/data/searchUser';
const KEY = 'ak_c81fd7ae8d0b46849282e05437d1db48';
const candidates = ['云中江树', '秋芝2046', 'dotey', '宝玉AI', '袋鼠帝', '苍何'];
(async () => {
  const out = {};
  for (const kw of candidates) {
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': KEY },
        body: JSON.stringify({ keyword: kw, offset: 0 })
      });
      const j = await r.json();
      out[kw] = j && j.data ? j.data : j;
      console.log(`== ${kw} ==`);
      const list = (j && (j.data || j.list)) || [];
      const arr = Array.isArray(list) ? list : (list.list || []);
      (Array.isArray(arr) ? arr : []).slice(0, 6).forEach(u => {
        console.log(`  name=${u.name} | account=${u.account} | wxId=${u.wxId} | desc=${(u.desc||'').slice(0,60)}`);
      });
    } catch (e) {
      console.log(`== ${kw} == ERROR: ${e.message}`);
      out[kw] = { error: e.message };
    }
  }
  fs.writeFileSync('E:/超体社区/research-data/redfox-verify-candidates.json', JSON.stringify(out, null, 1));
  console.log('WROTE redfox-verify-candidates.json');
})();
