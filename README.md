# catcat-cloud

An ipfs file management

## Request examples

### Upload a private file

__request:__

`POST` `http://localhost:9086/${userKey}/upload`

`http://localhost:9086/75ec6c73f3580fbb3dc8dff2353a011d/upload`

__response:__

```json
{
  "hash": "QmYiHTWNPg2uA8HCGweVsPXPwA1UM5bSzR5rV9LHrcaaej",
  "path": "QmYiHTWNPg2uA8HCGweVsPXPwA1UM5bSzR5rV9LHrcaaej",
  "size": 466788,
  "fileId": "d9b07510-cd1c-4c7c-9a66-33e185d3ff62"
}
```

### Upload a public file

A public file can be download by any user

__request:__

`POST` `http://localhost:9086/${userKey}/upload?isPublic=true`

`http://localhost:9086/75ec6c73f3580fbb3dc8dff2353a011d/upload?isPublic=true`

__response:__

```json
{
  "hash": "QmYiHTWNPg2uA8HCGweVsPXPwA1UM5bSzR5rV9LHrcaaej",
  "path": "QmYiHTWNPg2uA8HCGweVsPXPwA1UM5bSzR5rV9LHrcaaej",
  "size": 466788,
  "fileId": "d9b07510-cd1c-4c7c-9a66-33e185d3ff62"
}
```

### Download a file

__request:__

`GET` `http://localhost:9086/${userKey}/download/${fileid}`

`http://localhost:9086/75ec6c73f3580fbb3dc8dff2353a011d/download/d9b07510-cd1c-4c7c-9a66-33e185d3ff62`

``

__response:__

`200` `file content`

`400` `Error decrypting message: Session key decryption failed.`

### Grant permission to user

__request:__

`GET` `http://localhost:9086/${userKey}/grant/${fileid}/${grantToUserKey}`

`http://localhost:9086/75ec6c73f3580fbb3dc8dff2353a011d/grant/d9b07510-cd1c-4c7c-9a66-33e185d3ff62/a03d51bd7f225c03e47d176e362db56c`

__response:__

`200` `true`

`400` `Unauthorized`

`400` `File not found`

`400` `File is public`

Granted user can download the file via download url
`http://localhost:9086/a03d51bd7f225c03e47d176e362db56c/download/d9b07510-cd1c-4c7c-9a66-33e185d3ff62`

### Revoke permission from user

__request:__

`GET` `http://localhost:9086/${userKey}/revoke/${fileid}/${revokeFromUserKey}`

`http://localhost:9086/75ec6c73f3580fbb3dc8dff2353a011d/revoke/d9b07510-cd1c-4c7c-9a66-33e185d3ff62/a03d51bd7f225c03e47d176e362db56c`

__response:__

`200` `true`

`400` `Unauthorized`

`400` `File not found`

`400` `File is public`

Revoked user cannot download the file via download url
`http://localhost:9086/a03d51bd7f225c03e47d176e362db56c/download/d9b07510-cd1c-4c7c-9a66-33e185d3ff62`

### List uploaded files

__request:__

`GET` `http://localhost:9086/${userKey}/uploaded`

`http://localhost:9086/75ec6c73f3580fbb3dc8dff2353a011d/uploaded`

__response:__

`200`

```json
[
  {
    "id": "d9b07510-cd1c-4c7c-9a66-33e185d3ff62"
  }
]
```

### List permissioned files

__request:__

`GET` `http://localhost:9086/${userKey}/permissioned`

`http://localhost:9086/a03d51bd7f225c03e47d176e362db56c/permissioned`

__response:__

`200`

```json
[
  {
    "id": "d9b07510-cd1c-4c7c-9a66-33e185d3ff62"
  }
]
```

## Development

create a `.env` file, see `.env.sample`

```bash

mkdir pg_data       # storing data files for postgres

docker-compose up   # start db and ipfs nodes

```

_Note:_

>pgAdminweb ui: http://localhost:9087
username: `user@example.com`
password: `password`


open `http://localhost:9086/uploadfile.html` in browser to start uploading a file

## TODO

- [X] Change MongoDB to PostgreSql
- [X] Producer submit a file https://github.com/ipfs/js-ipfs-api
- [X] Consumer subscribe a file
- [ ] Producer remove a file
- [X] Producer update a file
- [X] Producer revoke consumer
- [ ] Consumer unsubscribe a file
- [ ] Able to PIN / UNPIN ipfs file
- [ ] Manageable folder structure
- [ ] Support API key for security

