dumbdb_srv.js
=============



summary
-------

[dumbdb](https://github.com/JosePedroDias/dumbdb) ain't couchdb. dumbdb_srv ain't couchdb either, but attempts a clone-enough HTTP interface.

as in dumbdb, there are no _revs or attachments. mapReduce will be exposed ASAP O:)

it's running on port 3000 but configuration parameteres will be exposed too.



api
---

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

`DELETE /person/1`

`{"status":"ok"}`
