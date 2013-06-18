// sqlplus �Ŏ��s
var _CMD = "sqlplus sst1/sst1@xe";

var _SETLINES = 1000;		// �o�͐���
var _ROWNUM = 10;			// �o�͐����p(�o�͐������s��Ȃ��ꍇ�A���̒l��ݒ�)

main();

function main(){
	var e = Editor;
	//e.MoveHistSet();

	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}
	
	var header = "set lines "+_SETLINES+"\n";
	// �ϊ�
	var text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// ���s��\n�œ���
	if (!text) return;
	
	text = getCleanSqlText(text);
	//if ( _ROWNUM >= 0 ) text = text.replace(/;/gm, "");

	if ( _ROWNUM >= 0 && isSelectSql(text) && text.indexOf(";") < 0){
		header+="SELECT * FROM (";
		text = text + ") WHERE ROWNUM <= " + _ROWNUM;
	}
	text = header + text + ";\nexit";
	text = text.replace(/([ \t\r\n]*;)+/g, ";");
	var path = getTempPath();
	saveFile( path, text);

	var cmd = _CMD + ' "@' + path + '"';

	e.TraceOut(text);
	e.ExecCommand(cmd, 1);
	e.ActivateWinOutput();
	deleteFile( path );

	//e.MoveHistPrev();
}

// �e���|�����t�@�C���p�X�擾
function getTempPath(){
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	return fs.GetSpecialFolder(2) + "\\" + fs.getTempName();
}

// �t�@�C���ۑ�
function saveFile(path, text){
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	stream = fs.CreateTextFile( path, true);
	stream.Write( text );
	stream.Close();
	return;
}

// �t�@�C����������
function deleteFile(path) {
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	fs.DeleteFile(path, true);
}

// select �����ǂ����𔻒�
function isSelectSql(sql) {
	ret = text.search(/^[ \t\r\n]*SELECT/i)
	if (ret < 0) return false;
	return true;
}

// ��s�폜
function getCleanSqlText(text) {
	text = text.replace(/[ \t]+([\r\n]+)$/gm, "$1");
	text = text.replace(/^[ \t]*[\r\n]+/gm, "");
	//text = text.replace(/^[ \t]*[\r\n]+/gm, "-- \n");
	return text;
}

