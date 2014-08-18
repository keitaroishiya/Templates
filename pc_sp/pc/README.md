# About Responsive Page Base

## 全般

* レスポンシブページのベースのコード一式です。
* /css/src/display/ ディレクトリに、画面サイズ別のsassファイルが分かれており、それぞれを編集します。
* htmlでは、grunt.watchでコンパイルしたstyle.cssを読み込みます

## セットアップ

### Node packages

* `npm`を入れてください。
* Gruntが入っていなければグローバルにインストールします。

```
$ npm install -g grunt-cli
```

Grunt導入後、その他のパッケージを以下のコマンドでインストールします。node_modules/ディレクトリにインストールされます。

```
$ npm install
```

### その他必要なモジュール

* ruby
* compass


## ディレクトリ構成

### 全体

* `/`
    * `css/`
        * `src/`
          * `base/` ... 基礎設定用Sassを格納
          * `display/` ... 画面サイズ別の設定用Sassを格納
            * `_large.scss` ... PCなどの大きな画面用
            * `_middle.scss` ... タブレットなどの中サイズ画面用
            * `_small.scss` ... スマートフォンなどの小さな画面用
          * `style.scss` ... メインのSass
        * `style.css` ... Sassから生成したCSS
    * `img/` ... 画像類
    * `js/` ... JSファイルを格納
      * `libs/` ... JSのライブラリ
        * `jquery.min.js` ... jQuery
        * `response.min.js` ... 画面サイズ別に読み込む画像を調整するライブラリ
    * `index.html` ... Topページ
    * `README.md` ... この文書
