// tsv ���� SQL ��WHERE����쐬
main();

function main(){
	var e = Editor;
	//e.MoveHistSet();
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected() == 0){
	    e.SelectAll();
	}
	
	var text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// ���s��\n�œ���
	if (!text) return;
	
	e.InsText( modifyReturnCode(
		convertString(text)
		));
	//e.MoveHistPrev();
}

// ���s�R�[�h�����݂̕����ɍ��킹��
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}

function convertString(text) {
	if (!symbol) symbol = prompt("SQL�C���q����͂��Ă��������B","SQL�C���q�̓���","A");
	return text.replace(/([^ \t=\(']+)[ \t]*(=|\|\||BETWEEN)[ \t]*/ig,symbol+".$1 $2 ");	//')
}
// WSH�pprompt
function prompt(msg, title, def){
	alert(typeof(_g_control));
	if (typeof(_g_control) == 'undefined') {
		_g_control = new ActiveXObject("ScriptControl");
		_g_control.Language = "VBScript";
	}
	var src = 'InputBox("' + _vbescape(msg) + '", ' +
		'"' + _vbescape( title || '') + '", ' +
		'"' + _vbescape( def || '') + '")';
	_g_control.AddCode("Function Hoge() : Hoge = " + src + " : End Function");
	return _g_control.Run("Hoge");
}

function _vbescape(v) {
	return ("" + v).replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "'); // "
}

