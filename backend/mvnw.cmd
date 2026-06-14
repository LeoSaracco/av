@REM Maven Wrapper startup script for Windows
@REM Required: JAVA_HOME or java in PATH
@echo off
set MAVEN_OPTS=-Xmx1024m
if exist "%USERPROFILE%\.m2\wrapper\dists" (
  set "MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists"
)
java %MAVEN_OPTS% -jar "%~dp0.mvn\wrapper\maven-wrapper.jar" %*
