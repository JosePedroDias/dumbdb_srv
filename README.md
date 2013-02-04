# dumbdb_srv.js



## Summary

HTTP API for dumbdb](https://github.com/JosePedroDias/dumbdb). Kinda inspired on couchdb.



## TODO

* improve this doc ASAP



## API

`GET /`

`{"msg":"hello from dumbdb"}`

----

`POST /person`

`{"status": ok", "msg":"collection person created."}`

----

`GET /person`

`[]`

----

`POST /person {"name":"Johnny Bravo", "age":33}`

`{"name":"Johnny Bravo", "age":33, "_id":"1"}`

----

`GET /person/1`

`{"name":"Johnny Bravo", "age":33, "_id":"1"}`

----

`GET /person/1/delete`

`{"status":"ok"}`
