BROWSERIFY = ./node_modules/.bin/browserify
UGLIFY = ./node_modules/.bin/uglifyjs
TRANSFORM_SWITCH = -t [ babelify --presets [ es2015 ] ]

run:
	wzrd app.js:index.js -- \
		-d \
		$(TRANSFORM_SWITCH)

build:
	$(BROWSERIFY) $(TRANSFORM_SWITCH) app.js | $(UGLIFY) -c -m -o index.js

test:
	node tests/parse-map-tests.js

pushall:
	git push origin gh-pages

lint:
	eslint .

diagrams:
	cat docs/soul-figure-relationship.dot | dot -Tpng -o docs/soul-figure-relationship.png