db = db.getSiblingDB('photoApp')
db.createCollection('photos')
photosCollection = db.getCollection("photos")
photosCollection.remove({})
photosCollection.insert(
{
"name": "Photo 1",
"id": "1",
"location": "http://oi61.tinypic.com/b6zhtv.jpg",
"tags": [
	"landscapes"
]
}
)
photosCollection.insert(
{
"name": "Photo 2",
"id": "2",
"location": "http://oi59.tinypic.com/9jp3xv.jpg",
"tags": [
	"landscapes"
]
}
)
photosCollection.insert(
{
"name": "Photo 3",
"id": "3",
"location": "http://oi61.tinypic.com/syb9s3.jpg",
"tags": [
	"landscapes"
]
}
)
photosCollection.insert(
{
"name": "Photo 4",
"id": "4",
"location": "http://oi58.tinypic.com/2v3iq1j.jpg",
"tags": [
	"birds",
	"landscapes"
]
}
)
photosCollection.insert(
{
"name": "Photo 5",
"id": "5",
"location": "http://oi58.tinypic.com/34sgyt0.jpg",
"tags": [
	"birds",
	"landscapes"
]
}
)
photosCollection.insert(
{
"name": "Photo 6",
"id": "6",
"location": "http://oi57.tinypic.com/2j307jc.jpg",
"tags": [
	"birds",
	"landscapes"
]
}
)
photosCollection.insert(
{
"name": "Photo 7",
"id": "7",
"location": "http://oi62.tinypic.com/29ur4gk.jpg",
"tags": [
	"birds",
	"landscapes"
]
}
)
photosCollection.insert(
{
"name": "Photo 8",
"id": "8",
"location": "http://oi58.tinypic.com/11vt8w9.jpg",
"tags": [
	"birds",
	"landscapes"
]
}
)
photosCollection.insert(
{
"name": "Photo 9",
"id": "9",
"location": "http://oi57.tinypic.com/fxt3lh.jpg",
"tags": [
	"landscapes"
]
}
)
photosCollection.insert(
{
"name": "Photo 10",
"id": "10",
"location": "http://oi62.tinypic.com/2isctc9.jpg",
"tags": [
	"birds",
	"landscapes"
]
}
)
photosCollection.insert(
{
"name": "Photo 11",
"id": "11",
"location": "http://oi62.tinypic.com/2ziuiaw.jpg",
"tags": [
	"birds",
	"landscapes"
]
}
)
photosCollection.insert(
{
"name": "Photo 12",
"id": "12",
"location": "http://oi58.tinypic.com/1z32tro.jpg",
"tags": [
	"birds",
	"landscapes"
]
}
)
photosCollection.insert(
{
"name": "Photo 13",
"id": "13",
"location": "http://oi57.tinypic.com/e97x37.jpg",
	"tags": [
		"untagged"
	]
}
)
photosCollection.insert(
{
"name": "Photo 14",
"id": "14",
"location": "http://img3.wikia.nocookie.net/__cb20150128072637/kancolle/images/1/1e/Anime_episode_1_Yuudachi,_Fubuki.jpg",
	"tags": [
		"needs_tags"
	]
}
)
db.createCollection('tags')
tagsCollection = db.getCollection("tags")
tagsCollection.remove({})
tagsCollection.insert(
{
"name" : "birds",
"id":"1"
}
)
tagsCollection.insert(
{
"name" : "landscapes",
"id":"2"
}
)
tagsCollection.insert(
{
"name" : "untagged",
"id":"3"
}
)