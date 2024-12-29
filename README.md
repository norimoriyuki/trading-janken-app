# Trading Janken App

## 起動方法
yarn install
yarn start

## 環境構築
### リポジトリのclone
```
# 指定のディレクトリに移動
git clone https://github.com/norimoriyuki/trading-janken-app.git
```

### homebrewのインストール
homebrewインストールされていない向け、されている場合はスキップ

```
brew -v # バージョンが表示されれば導入済みなので、スキップ
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew -v # バージョンが表示されればOK
```

### nodeのインストール
nodeインストールされていない向け、されている場合はスキップ

```
node -v # バージョンが表示されれば導入済みなので、スキップ
brew install node
node -v # バージョンが表示されればOK
```

## 推奨プログラミング環境
Cursor
[インストール方法](https://www.cursor.com/)
([brewでもinstallできるよ](https://formulae.brew.sh/cask/cursor))
