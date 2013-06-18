// sql in form �N��

var url = "http://www.sqlinform.com/";
var cmd = "SQLinForm_2008.jar";
var bRunDesktop = true;

main();

function main(){
	if (bRunDesktop) {
		if ( !runDesktopSqlInForm() ) runOnlineSqlInForm();
	} else {
		runOnlineSqlInForm();
	}
}

// ���s�t�@�C���̃t�H���_�p�X�擾
function getCommandPath(){
	return Editor.ExpandParameter("$S").replace(/[^\\]+$/g,"")+"bin\\";
}

// desktop �ł��N��
function runDesktopSqlInForm(){
	var d = getCommandPath();
	var path = d + cmd;
	if ( bRunDesktop && new ActiveXObject("Scripting.FileSystemObject").FileExists(path) ){
		var sh = new ActiveXObject("WScript.Shell");
		sh.CurrentDirectory = d;
		sh.Run( 'java -jar "' + path + '"', 0, false);
		return true;
	}
	return false;
}

// online �ł��N��
function runOnlineSqlInForm(){
	var ie = new ActiveXObject("InternetExplorer.Application");
	ie.Visible = true;
	ie.Navigate(url);
	return true;
}
