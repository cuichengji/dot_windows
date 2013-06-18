// �����񐶐�
(function(){	//}}
var fso = new ActiveXObject("Scripting.FileSystemObject");
main();

function main(){
	var e = Editor;
	e.MoveHistSet();

	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}

	var text = e.GetSelectedString(0);		 // �I��͈͂̕�������擾

	var ext = fso.GetExtensionName(Editor.GetFilename);
	var result = null;
	if (ext.length <= 0) result = getProgramString(text, ext);
	if (!result){
		ext = InputBox("�g���q����͂��ĉ������B");
		if (!ext) return;
		result = getProgramString(text, ext);
		if (!result) return;
	}

	// ���ʂ����
	e.InsText(modifyReturnCode(
		result
	));
	//e.InsText(convertMain(result));

	e.MoveHistPrev();
}

// Javascript �� InputBox
function InputBox( msg ){
	var VBS_CODE = 'InputBox("' + msg + '")';
	var scriptCtl = new ActiveXObject("ScriptControl");
	scriptCtl.Language = "VBScript";
	return scriptCtl.Eval(VBS_CODE);
}

// ���s�R�[�h�����݂̕����ɍ��킹��
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}

function getProgramString(result){
	var ext;
	if (arguments.length >= 2) ext = arguments[1];
	else ext = fso.GetExtensionName(Editor.GetFilename);
	result = result.replace(/\r\n/g,"\n").replace(/\r/g,"\n");
	
	switch (ext.toLowerCase()){
	case 'cpp': case 'c': case 'h': case 'java': case 'php': case 'pl': case 'cs': case 'js': case 'dms':
		result = result.replace(/([\\"%])/g, "\\$1");//"
		result = result.replace(/^(.+)/gm, "\"$1").replace(/\t/gm, "\\t").replace(/^([^\r\n]+)/gm, "$1\\n\" +");
		var i = result.lastIndexOf(" +");
		if (i >= 0) result = result.substring( 0, i) + ";\n";
		break;
	case 'bas': case 'frm': case 'cls': case 'vbs':
		var RETCODE = " & vbCrLf & _";
		result = result.replace(/\"/gi, '""');//"
		result = result.replace(/^(.+)/gm, "\"$1").replace(/\t/gm, "\" & vbTab & \"")
						.replace(/^([^\r\n]+)/gm, "$1\""+RETCODE).replace(/"" & /gm, "");
		var i = result.lastIndexOf(RETCODE);
		if (i >= 0) result = result.substring( 0, i) + "\n";
		break;
	case 'html': case 'htm':
		result = result.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g,'&nbsp;');
		break;
	case 'sql':	// sql(prompt)
		//result = result.replace(/^([^\r\n]+)/gm, "prompt $1;");
		result = "'" + result.replace(/'/g,'') + "'";	//"
		break;
	case 'bat':	// bat(echo)
		result = result.replace(/%/g,'%%').replace(/([&\(\)\[\]\{\}^=;!\+\',`~\|<>])/gi, "^$1");//'
		result = result.replace(/^(.+)/gim, "echo $1").replace(/^echo $/gim, "echo.").replace(/([^\r\n]+)/gm, "$1 >> %FILE%");
		break;
	default:
		return '';
		break;
	}
	return result;
}
})();

