main();

function main(){
	var e = Editor;
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}

	// �ϊ�
	var text = e.GetSelectedString(0);		 // �I��͈͂̕�������擾

	var dom = new ActiveXObject("Microsoft.XMLDOM");
	dom.async = false;
	//if (!dom.load(text)) {
	if (!dom.loadXML(text)) {
		var error = dom.parseError;
		alert("XML���@�G���[���������܂��� :"+ error.reason +
		     "\nURL :"+ error.reason +
		     "\n�s :"+ error.line +", �� :"+ error.linepos);
		//    document.selection.SetActivePoint(eePosLogicalA, error.linepos, error.line);
		e.Jump(error.line,0);//error.line)
		for (var i=0;i<error.linepos-1;i++) e.Right();

	} else {
		alert("���̕�����XML�̕��@�𖞂����Ă��܂�");
	}
}

function alert(msg){
	var script = new ActiveXObject("ScriptControl");
	script.Language = "VBScript";
	var m=(''+msg).replace(/"/g, '""').replace(/[\r\n]+/g, '" & vbCrLf & "'); // "
	script.AddCode('MsgBox("'+m+'")');
}
