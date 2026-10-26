// AI研修（Nickさん・みっちさん）の資料を暗号化して GitHub Pages に置く
// 使い方: node build.mjs   （鍵は .key。送るURLは https://mm738966m-boop.github.io/ai-kenshu-mn/<page>/#k=<鍵>）
// 中身はリポジトリには暗号文だけ。鍵はURLの # の後ろ＝サーバーに送られない
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';
import { homedir } from 'node:os';
const KEY = readFileSync('.key', 'utf8').trim();
const BASE = 'https://mm738966m-boop.github.io/ai-kenshu-mn/';
const SRC = homedir() + '/Desktop/AI研修_Nick社_みっちさん/';
const PAGES = [
  { out: 'dai1', src: '第1回まとめ/index.html', title: 'AI研修 第1回のまとめ', art: 'DLj7BrPLvwP77btqxKGJLv' },
  { out: 'dai1/slide', src: '第1回/スライド.html', title: 'AI研修 第1回 スライド', art: 'MraBbkiAw7vni1CvviuqwZ' },
  { out: 'dai1/sheet', src: '第1回/作業シート.html', title: 'AI研修 第1回 作業シート', art: 'BZpCMeT8ysfMr2eduMZFPs' },
  { out: 'dai2/sheet', src: '第2回/作業シート.html', title: 'AI研修 第2回 作業シート', art: 'XFEkrm9xrRpmQSQc8Uhmg5' },
  { out: 'dai2/slide', src: '第2回/スライド.html', title: 'AI研修 第2回 スライド', art: '1VaMNwSZcuVDHDBy8ZTiaS' },
  { out: 'dai2', src: '第2回まとめ/index.html', title: 'AI研修 第2回のまとめ', art: 'PJsMFLmm7HsCD5cgE1Meya' },
  { out: 'jcxas', src: 'JCXAS構想/index.html', title: 'JCXASの構想', art: 'Ui7ouNuagyieLTJ43da1qo' },
  { out: 'dai3/sheet', src: '第3回/作業シート.html', title: 'AI研修 第3回 作業シート', art: 'NArZLAmp6PvPZpgxCcvArM' },
  { out: 'dai3/slide', src: '第3回/スライド.html', title: 'AI研修 第3回 スライド', art: 'DwLSyHvEU4tTJnUHvoD3Fo' },
];
const b64 = u8 => Buffer.from(u8).toString('base64');
const salt = crypto.getRandomValues(new Uint8Array(16));
const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(KEY), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const enc = async s => { const iv = crypto.getRandomValues(new Uint8Array(12)); const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(s))); const o = new Uint8Array(12 + ct.length); o.set(iv); o.set(ct, 12); return b64(o); };
for (const p of PAGES) {
  let h = readFileSync(SRC + p.src, 'utf8').replace(/^<meta charset="utf-8">\n?/, '');
  for (const q of PAGES) h = h.split('https://claude.ai/artifact/' + q.art).join(BASE + q.out + '/#k=' + KEY);
  h = h.replace(/src="img\//g, 'src="' + BASE + 'img/');
  const doc = '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow,noarchive"><style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + h + '</body></html>';
  const C = await enc(doc);
  const shell = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow,noarchive"><title>AI研修の資料</title>
<meta property="og:title" content="AI研修の資料"><meta property="og:description" content="リンクを知っている方だけが見られるページです"><meta property="og:image" content="${BASE}img/mascot_invite.webp">
<style>body{margin:0;font-family:"Hiragino Sans","Yu Gothic",sans-serif;background:#EEF6F7;color:#1C3236}#g{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;text-align:center}#g .in{max-width:420px;background:#fff;border-radius:20px;padding:26px 22px;border:1px solid #D5E4E6}#g img{width:110px}#g p{font-size:17px;line-height:1.8;color:#4A6468}#g input{width:100%;box-sizing:border-box;font-size:18px;padding:10px;border:2px solid #D5E4E6;border-radius:10px}#g button{width:100%;margin-top:10px;font-size:18px;font-weight:800;color:#fff;background:#0E7C86;border:0;border-radius:10px;padding:12px}#m{color:#B4442F;font-weight:700;min-height:1.5em}</style></head>
<body><div id="g"><form class="in" id="f"><img src="${BASE}img/mascot_invite.webp" alt=""><p id="t">ひらいています…</p><div id="ask" hidden><p>お送りしたリンクから開いてください。<br>合言葉があれば、こちらに。</p><input id="pw" autocomplete="off"><button>ひらく</button></div><div id="m"></div></form></div>
<script>
const SALT="${b64(salt)}",C="${C}";const u=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function open_(pw){const k0=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']);
const k=await crypto.subtle.deriveKey({name:'PBKDF2',salt:u(SALT),iterations:120000,hash:'SHA-256'},k0,{name:'AES-GCM',length:256},false,['decrypt']);
const d=u(C);const buf=await crypto.subtle.decrypt({name:'AES-GCM',iv:d.slice(0,12)},k,d.slice(12));
const html=new TextDecoder().decode(buf);document.open();document.write(html);document.close();}
const m=location.hash.match(/k=([^&]+)/);
function ask(msg){document.getElementById('t').hidden=true;document.getElementById('ask').hidden=false;document.getElementById('m').textContent=msg||''}
if(m){open_(decodeURIComponent(m[1])).catch(()=>ask('リンクが正しくないようです。もう一度お送りしたリンクから開いてください。'))}else ask();
document.getElementById('f').addEventListener('submit',e=>{e.preventDefault();open_(document.getElementById('pw').value.trim()).catch(()=>ask('合言葉が違うようです。'))});
</script></body></html>`;
  mkdirSync(p.out, { recursive: true });
  writeFileSync(p.out + '/index.html', shell);
  console.log(p.out, Math.round(shell.length / 1024) + 'KB');
}
writeFileSync('index.html', '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>.</title>');
console.log('URL:', BASE + 'dai1/#k=' + KEY);
