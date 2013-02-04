run:
	python -m SimpleHTTPServer &
	node test1.js &

kill:
	killall python
	killall node
