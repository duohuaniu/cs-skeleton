@ECHO off
ECHO Compiling JS (this might take a while)...
cd requirejs && java -Xss128M -classpath js.jar;compiler.jar org.mozilla.javascript.tools.shell.Main r.js -o build.js
ECHO Finished compiling JS!
REM ECHO Compiling CSS...
REM cd ../cs/css && type *.css > app.x.x.x.css
REM java -jar ../../opt/yuicompressor/yuicompressor-2.4.7.jar -o app.x.x.x.css app.x.x.x.css
REM ECHO Finished compiling CSS!
PAUSE