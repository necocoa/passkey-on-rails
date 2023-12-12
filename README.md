# Passkeys を試せるサンプルアプリ

Rails と Remix を使って、Passkeys を試せるアプリケーションです。

こちらの記事で詳細を書きました。

https://product.st.inc/entry/2023/12/12/222708

## Setup
### Backend

```
cd backend
bin/rails s
```

### Frontend

```
cd frontend
npm run dev
```

### DB

```
docker run -d -p 5432:5432 --name passkey-on-rails-db \
-v passkey-on-rails-db:/var/lib/postgresql/data \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=password \
postgres
```

### Redis

```
docker run -d -p 6379:6379 --name passkey-on-rails-redis \
-v passkey-on-rails-redis:/data \
redis
```
