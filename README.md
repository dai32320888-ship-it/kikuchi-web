# 菊地Web制作所 LP 運用メモ

## 問い合わせフォーム

現在のフォームは GitHub Pages だけで使える暫定方式です。送信ボタンを押すと、入力内容を本文に入れたメール作成画面が開きます。

Formspree などの外部フォームサービスを使う場合は、架空IDを入れず、発行された正式なエンドポイントを確認してから次の対応をしてください。

1. `index.html` の `<form id="contact-form">` に `action="発行されたURL"` と `method="POST"` を追加する
2. `script.js` のフォーム送信処理を外部送信用に変更する
3. テスト送信を行い、通知先メールアドレスに届くか確認する

## 制作事例

現在の制作事例は、実在案件ではなく「自主制作・架空店舗のデザイン例」として作成したデモページです。

- カフェ / 編集・世界観重視: `examples/cafe.html`
- 美容室・床屋 / 予約導線重視: `examples/salon.html`
- バー / 雰囲気重視: `examples/bar.html`
- 整備工場 / 実用・症状相談重視: `examples/garage.html`
- 建設業 / 信頼・相談ハードル重視: `examples/builder.html`
- 共通CSS: `examples/example-style.css`
- 各事例のヒーロー画像: `images/examples/*-hero.webp`（1600 x 900px）
- トップページ掲載画像: `images/examples/*-demo.webp`

実在店舗の事例に差し替える場合は、掲載許可を取ったうえで、ページ内とカード内の `自主制作・架空店舗のデザイン例` 表記を適切な表現に変更してください。許可のない店名、写真、口コミ、成果数値は掲載しないでください。

デモページを更新した場合は、スマホ幅 390px 程度でスクリーンショットを撮り直し、`images/examples/*-demo.webp` を更新してください。ヒーロー画像を差し替える場合は、文字やロゴの入っていない横長画像をWebP形式で用意し、実在店舗の写真を使うときは掲載許可を確認してください。

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

## SEO・共有画像

- OGP / X共有画像: `images/ogp-v2.jpg`（1200 x 630px）
- favicon: `images/favicon.png`
- Search Console確認ファイル、`robots.txt`、`sitemap.xml` は既存構成を維持しています。
