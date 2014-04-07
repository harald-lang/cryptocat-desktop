all: update desktop

dev: devtools desktop

releaseDir:
	@mkdir -p release
	@rm -rf release/cryptocat.nw
	

indexhtml: releaseDir
	@cp src/cryptocat/src/core/index.html release/index-desktop.html
	@node patch.js release/index-desktop.html > release/index-desktop.html.patched
	@rm release/index-desktop.html
	@mv release/index-desktop.html.patched release/index-desktop.html
    
devtools: indexhtml
	@node patch_dev_tools.js release/index-desktop.html > release/index-desktop.html.patched
	@rm release/index-desktop.html
	@mv release/index-desktop.html.patched release/index-desktop.html

desktop: indexhtml	
	@zip -q -r9 release/cryptocat.nw package.json
	@cd src/cryptocat/src/core/ && zip -q -r9 ../../../../release/cryptocat.nw * -x "*/\.*" -x "\.*" -x "*.mp3"
	@cd src/desktop/ && zip -q -r9 ../../release/cryptocat.nw * -x "*/\.*" -x "\.*" -x "*.xcf" -x "*.ico"
	@cd release && zip -q -r9 cryptocat.nw index-desktop.html
	@rm release/index-desktop.html
	
	@if [ -a release/nw.exe ]; then cmd.exe "/c build_exe.bat"; fi
	@/bin/echo "[Cryptocat] Windows app available in release/"
	
update:
	@git submodule update --init src/cryptocat

lint:
	@/bin/echo -n "[Cryptocat] Linting code... "
	@node_modules/.bin/jshint --verbose --config .jshintrc \
		src/desktop/js/cryptocat-desktop.js
	@/bin/echo ""


