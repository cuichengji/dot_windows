// javascript eval
// vbs �֐�
var vbs = {
	_control : new ActiveXObject("ScriptControl"),
	_lang    : "VBScript",
	_escape  : function(v){
		return(("" + v).replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "')); // "
	},
	prompt   : function (msg, title, def){
		return(this.eval('InputBox(' +
			'"' + this._escape(msg)         + '", ' +
			'"' + this._escape(title || '') + '", ' +
			'"' + this._escape(def   || '') + '")'));
	},
	alert    : function (msg){
		this.exec('MsgBox("' + this._escape(msg) + '")');
	},
	exec     : function (src){
		this._control.Language = this._lang;
		this._control.AddCode(src);
	},
	eval     : function (src){
		this._control.Language = this._lang;
		this._control.AddCode("Function Hoge() : Hoge = " + src + " : End Function");
		return(this._control.Run("Hoge"));
	}
};


main();

function main(){
	var e = Editor;
	// ���ʒu�����p
	e.MoveHistSet();
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected == 0) e.SelectAll();
   
	text = e.GetSelectedString(0).replace(/\r\n/g,"\n").replace(/\r/g,"\n");	// ���s��\n�œ���
   
	try {
		e.InsText( modifyReturnCode(
			convertString(text)
			));
	} catch (exp) {
	}
	// ���ʒu�𕜌�
	e.MoveHistPrev();
}

// ���s�R�[�h�����݂̕����ɍ��킹��
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
	return text.replace(/\n/g,l[e.GetLineCode()]);
}

// �����񐶐�
function convertString(text){
	return vbs.eval(text);
}

