# 画像出典・ロケーション監査（2026-09-01）

判定は A＝熊本での撮影を確認、B＝日本だが熊本か不明、C＝熊本以外、D＝場所不明です。最適化した WebP は、同名の JPG 原本からトリミング・圧縮した派生ファイルです。

| 原本ファイル | 現在の用途 | Unsplash 原ページ | 写真タイトル / description | Photographer | 撮影場所の確認 | 判定 |
|---|---|---|---|---|---|---|
| `hero-tram.jpg` | Hero（`hero-tram-mobile.webp` / `hero-tram-desktop.webp`） | https://unsplash.com/photos/6agoesD8cLM | 原ページの title / description は取得不能 | Tuan P. (`@tuan_p`) | 写真内の「水前寺公園」「八代・宇土」道路標識、鶴屋、熊本市電の車両・軌道から熊本市中心部と確認。公式 download endpoint のファイル名も `tuan-p-6agoesD8cLM-unsplash.jpg` と一致 | A |
| `tram-yellow.jpg` | 悩み・診断（`tram-yellow.webp`） | https://unsplash.com/photos/z94jGvQGXvs | “yellow and black tram on road during daytime” | Syuichi Shiina (`@superidol`) | Unsplash の Kumamoto 検索結果に掲載。写真内の熊本市電の車両・道路景観とも一致 | A |
| `tram-yellow-2.jpg` | 未使用（上記と同一写真） | https://unsplash.com/photos/z94jGvQGXvs | 同上 | 同上 | 同上 | A |
| `tram-street.jpg` | 悩み・プロフィール（`tram-street.webp`） | https://unsplash.com/photos/mOfUlVSvcb8 | “white and red tram on road during daytime” | Xie lipton (`@sanarara`) | Unsplash の Kumamoto 検索結果に掲載。写真内の熊本市電と熊本城を確認 | A |
| `tram-white.jpg` | 悩み（`tram-white.webp`） | https://unsplash.com/photos/mOfUlVSvcb8 | 同上（`tram-street.jpg` と同一写真） | 同上 | 同上。旧記録の `1611550045527-a8daf50aef25` は写真ページ ID ではなく CDN の photo ID だったため訂正 | A |
| `castle-trees.jpg` | 無料診断〜プロフィール間の地域帯（`castle-kumamoto.webp` / `castle-kumamoto.jpg`） | https://unsplash.com/photos/kumamoto-castle-framed-by-trees-under-a-bright-sky-kvl6jf3nL_A | “Kumamoto castle framed by trees under a bright sky” | Unsplash contributor（ページ記載要確認） | 天守・石垣・黒壁白線の意匠から熊本城と確認。Unsplash タイトルにも Kumamoto castle と明記 | A |
| `restaurant-interior.jpg` | 悩み（一般的な店舗写真としてのみ使用、`restaurant-interior.webp`） | https://unsplash.com/photos/nmpW_WwwVSc | restaurant interior | Shawn Ang (`@shawnanggg`) | 撮影場所を確認できない。熊本写真としては扱わない | D |
| `restaurant-dining.jpg` | 未使用 | CDN photo ID: `photo-1517248135467-4c7edcad34c4`（原ページ ID・作者を特定できず） | restaurant dining | 不明 | 撮影場所・原ページ・作者の裏付けが不足 | D |
| `japan-street-night.jpg` | **未使用・熊本表現への使用禁止** | https://unsplash.com/photos/YV-E4JC4ek4 | “white and gray box fan” | T. Penguin（ダウンロードファイル名由来） | 夜の街ではなく屋外の空調室外機。場所不明 | D |

## ライセンス確認

- 適用ライセンス: Unsplash License（https://unsplash.com/license）
- 商用利用: 可
- 改変・トリミング: 可
- クレジット: 必須ではないが推奨
- 禁止事項: 未改変画像そのものの販売、Unsplash と競合する画像サービスの構築
- 注意: Unsplash の著作権ライセンスは、写真に写る商標・ロゴ・人物・美術作品などの第三者権利を自動的に許諾するものではない。Hero の店舗看板・ロゴは街路風景の一部として写り込むため、公開判断ではこの点を別途考慮する
- 利用規約: https://unsplash.com/terms

## 運用ルール

- B〜D の画像を「熊本」「熊本市電」「熊本の街」と説明しない
- `restaurant-interior.webp` は業種を示す一般的な店舗イメージに限定する
- `restaurant-dining.jpg` と `japan-street-night.jpg` は現行 HTML から除外済み
- 本人写真は未提供のため、現行ページでは人物写真を使わず、ブランドカードで成立させる
- 将来的には、ユーザー自身が撮影・権利処理した熊本の店舗街・人物写真への差し替えを推奨する
- `castle-kumamoto.jpg` / `.webp` は `castle-trees.jpg` から Web 用にリサイズした派生。ユーザー撮影の熊本城・街並み写真へ差し替え可（HTML コメント参照）

## 未使用・禁止

- くまモン正式素材: 権利未確認のため未使用
- 自治体・観光協会画像: 個別の利用条件を確認していないため未使用
