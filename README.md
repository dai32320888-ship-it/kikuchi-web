# 菊地Web制作所 LP 運用メモ

熊本の個人店・小規模店舗向けに、Web制作・集客改善・みせシリーズを案内する営業サイトです。

## 問い合わせフォーム

現在のフォームは GitHub Pages だけで使える暫定方式です。送信ボタンを押すと、入力内容を本文に入れたメール作成画面が開きます。

Formspree などの外部フォームサービスを使う場合は、架空IDを入れず、発行された正式なエンドポイントを確認してから次の対応をしてください。

1. `index.html` の `<form id="contact-form">` に `action="発行されたURL"` と `method="POST"` を追加する
2. `script.js` のフォーム送信処理を外部送信用に変更する
3. テスト送信を行い、通知先メールアドレスに届くか確認する

## 制作事例

現在の制作事例は、実在案件ではなく「自主制作・架空店舗」として作成したデモページです。

- カフェ: `examples/cafe.html`
- 美容室: `examples/salon.html`
- バー: `examples/bar.html`
- 整備工場: `examples/garage.html`
- 工務店: `examples/builder.html`
- 共通CSS: `examples/example-style.css`
- 各事例のヒーロー画像: `images/examples/*-hero.webp`
- トップページ掲載画像: `images/examples/*-demo.webp`

実在店舗の事例に差し替える場合は、掲載許可を取ったうえで、ページ内とカード内の `自主制作・架空店舗` 表記を適切な表現に変更してください。許可のない店名、写真、口コミ、成果数値は掲載しないでください。

## みせシリーズ

店舗向けWindows業務アプリの販売ページです。単品、3商品、4商品、全6商品の正式料金と先着3店舗モニターを案内しています。

- 案内ページ: `mise/index.html`
- 商品: みせ日報 / みせシフト / みせ在庫 / みせ予約 / みせカルテ / みせボトル
- 単品: 月980円（税込）、導入費11,000円（税込）
- 3商品: 月2,480円（税込）、導入費22,000円（税込）
- 4商品: 月2,980円（税込）、導入費27,500円（税込）
- 全6商品: 月3,980円（税込）、導入費33,000円（税込）
- みせシリーズの掲載料金はすべて税込です

## SEO・共有画像

- OGP / X共有画像: `images/ogp-v2.jpg`（1200 x 630px）
- favicon: `images/favicon.png`
- Search Console確認ファイル、`robots.txt`、`sitemap.xml` は既存構成を維持しています。

## 計測

Google Analytics などの解析IDは未設定です。架空IDは追加していません。

クリック計測しやすいよう、主要リンクには `data-track` を付けています。

- 無料診断CTA: `diagnosis-cta`
- Instagram DM: `instagram-dm`
- メール: `email-click`
- 問い合わせフォーム送信: `contact-form-submit`
- 制作事例: `example-click`
- 料金を見る: `pricing-nav`
- サービス・料金詳細: `pricing-detail`

## ローカル確認

静的サイトのためproduction buildは不要です。公開前に以下を実行します。

```powershell
node --check script.js
node scripts/check-site.mjs
node scripts/check-contact.mjs
```

`check-site.mjs` は、HTMLの基本SEO要素、見出し、重複ID、ローカルリンク、ページ内アンカー、みせシリーズ6商品、正式料金、旧販売表現、CSSの波括弧を検査します。`check-contact.mjs` は通常相談と無料モニターの選択、相談文、メール作成リンクを検査します。
