@if(0)==(0) ECHO OFF
CScript.exe //NoLogo //E:JScript "%~f0" %*
GOTO :EOF
@end

// �t�@�C�����S�~���ɑ���B
// �V�F�����O��ԂŃS�~�����w�肵��MoveHere����
var sh = WScript.CreateObject("Shell.Application");
var ssfBITBUCKET = 10;
var trash = sh.NameSpace(ssfBITBUCKET);
var fso = WScript.CreateObject("Scripting.FileSystemObject");

var filePath, filePaths = [];
for (var i=0, len = WScript.Arguments.Count(); i<len ; i++) {
  filePath = WScript.Arguments(i);
  if (fso.FileExists(filePath)) {
    trash.MoveHere(filePath);
    filePaths.push(filePath);
    WScript.Echo('moving "' + filePath + '" to the trash...');
  } else {
    WScript.Echo("cannot delete file:"+filePath);
  }
}
// �폜�����܂ő҂iMoveHere�͔񓯊��Ȃ̂Łj
while ( !isCompleteTransfer( filePaths ) ){
	WScript.Sleep(100);
}
WScript.Echo("complete");

function filter(arr, fn) {
  var ret = [];
  for (var i=0, l = arr.length; i<l ; i++) {
    fn(arr[i]) && ret.push(arr[i]);
  }
  return ret;
}

function isCompleteTransfer(filePaths) {
  return filter(filePaths, function(f) {
    return fso.FileExists(f);
  }).length <= 0;
}