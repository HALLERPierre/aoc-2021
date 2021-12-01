run:
	deno run --import-map=import_map.json --allow-env --allow-read --allow-net src/index.ts

watch:
	deno run --watch --import-map=import_map.json --allow-env --allow-read --allow-net src/index.ts
