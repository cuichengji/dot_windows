/**
 *  �R�����g�𐶐��}�N��
 * @author 
 * @copyright 
 * @license 
 * @version 
 * @filesource 
 * @link 
 * @see 
 * @since 
 */

// �f�t�H���g�l
var defaultVal = {
	'version'	: '1.00',
	'copyright'	: '',
	'license'	: '',
	'author'	: '',
	'date'		: today()
};

// �R�����g�����I�u�W�F�N�g(Template)
// start, end, header, dispatch �͕K����`���K�v
// dispatch �̖߂�� null �� ret.type ���i�[���ԋp���邱�ƁB
// ret.type �Ɏw�肵���n�b�V���֐��ŃR�����g�𐶐����܂��B(ret.type==''�͎��s���Ȃ�)
// �R�����g�쐬�p�̃n�b�V���֐��ł� dispatch �̖߂�l���󂯎��܂��B
//var creatorTemplate = {
//	'start'		: "" ,
//	'end'		: "" ,
//	'header'	: function() {
//		return ''
//	},
//	'dispatch'	: function(text) {
//		if (text.length <=0) return null;
//		var ret = new Array;
//		ret.type = '';
//		ret.param = new Array();
//	},
//	'function'	: function(info) {
//		return '';
//	}
//};

// js,php �p
var jsCreator = {
	'start'		: "/**\n" ,
	'end'		: " */\n" ,
	'header'	: function(){
		return	" * \n"
				+" * @package \n"
				+" * @author " + defaultVal.author + "\n"
				+" * @copyright " + defaultVal.copyright + "\n"
				+" * @license " + defaultVal.license + "\n"
				+" * @version " + defaultVal.version + "\n"
				+" * @filesource \n"
				+" * @link \n"
				+" * @see \n"
				+" * @since " + defaultVal.date + "\n";
	} ,
	'dispatch'	: function(text){
		var item = text.match(/[\$a-zA-Z0-9_]+|\(|\)/g);
		var len = item.length;
		if (len <= 0) return null;
		
		var ret = new Array;
		ret.type = item[0];
		ret.param = new Array();
		if (ret.type == 'function'){
			for (var i=3; i<len && item[i] != ')';i++) ret.param.push( item[i] );
		} else if (ret.type == 'class'){
		} else if (ret.type == 'var'){
			if (len > 1) ret.param.push( item[1] );
		} else {
			ret.type = '';
		}
		return ret;
	} ,
	'class'		: function(info){
		return   " * \n"
				+" * @package \n";
	} ,
	'function'	: function(info){
		var s='';
		objtrace(info.param.length);
		for (var i=0;i<info.param.length;i++) s+= " * @param " + info.param[i] +" : \n";
		return   " * \n"
				+" * @return \n"
				+" * @throws \n"
				+s;
	} ,
	'var'		: function(info){
		var s="";
		for (var i=0;i<info.param.length;i++) s+= " * @var " + info.param[i] +" : \n";
		return s;
	} 
};
// cpp �p
var cppCreator = {
	'start'		: "/**\n" ,
	'end'		: " */\n" ,
	'header'	: function() {
		return   " * \n"
				+" * @file \n" + Editor.ExpandParameter("$N");
				+" * @author " + defaultVal.author + "\n"
				+" * @date " + defaultVal.date + " " + "\n"
				+" * @note " + defaultVal.date + " " + defaultVal.author + "\n"
				+" * @version $Id: " + defaultVal.version + "\n"
	},
	'dispatch'	: function(text) {
		text = text.replace(/[\r\n]+|^\s+/g,"");
		var item = text.match(/[_a-zA-Z0-9:]+|\(|\)/g);
		if (!item) return null;
		
		var len = item.length;
		var ret = new Array;
		ret.type = '';
		ret.param = new Array();
		
		var keyword = new Array('if','switch','else','return','for');
		var keylen = keyword.length;
		
		if (item[0] == 'class'){
			ret.type = 'class';
		} else {
			var p = -1;
			for (var i=1; i<len && item[i] != ')'; i++){
				if (item[i] == '('){
					ret.type = 'function';
					ret.name = item[i-1];
					if (i>1) ret.ret = item[i-2];
					else ret.ret = '';
					p = i;
				} else if ( p > -1 &&(i-p)%2 == 0) {
					ret.param.push(item[i]);
				} else {
					for (var j=0; j<keylen; j++) {
						if (item[i] == keyword[j]) return ret;
					}
				}
			}
		}
		return ret;
	},
	'function'	: function(info) {
		var s='';
		objtrace(info.param.length);
		var tmp = info.ret.toLowerCase();
		if (tmp == 'bool')  s+= " * @return true  :\n" + " * @return false :\n";
		else if (tmp != '') s+= " * @return \n";
		for (var i=0;i<info.param.length;i++) s+= " * @param " + info.param[i] +" : \n";
		
		return  " * \n"
				+s
				+" * @date " + defaultVal.date + " " + "\n"
				+" * @note " + defaultVal.date + " " + defaultVal.author + "\n";
	}
};

// ��������R�����g�Ώۂ̊g���q��
// �R�����g�쐬�I�u�W�F�N�g���Z�b�g
var commentCreator = {
	'js' : jsCreator,
	'php': jsCreator,
	'cpp': cppCreator,
	'c'  : cppCreator,
	'h'  : cppCreator,
	'cc' : cppCreator,
	'cp' : cppCreator,
	'c++': cppCreator
};
main();

/**
 * �f�o�b�O�o��
 * @return �Ȃ�
 * @param msg : 
 */
function trace(msg){
//	return;
	var e = Editor;
	e.TraceOut(msg);
}

/**
 * �f�o�b�O�o��
 * @return �Ȃ�
 * @param obj : �I�u�W�F�N�g
 */
function objtrace(obj){
	return;
	var s;
	for (key in obj){
		s += key + "=" + obj[key] + ",";
	}
	trace("-----------------------------------------------");
	trace(s);
	trace("-----------------------------------------------");
}

/**
 * ���C���֐�
 * @return �Ȃ�
 */
function main(){
	try {
		var e = Editor;
		var ext = new ActiveXObject("Scripting.FileSystemObject").GetExtensionName(Editor.GetFilename).toLowerCase();
		var creator = commentCreator[ext];
		
		objtrace(creator)
		
		if (!creator) throw("�Ή����Ă��Ȃ��`���ł�");
		
		var line;
		if ( e.IsTextSelected() ) {
			line = e.GetSelectedString(0);
		} else {
			line = e.GetLineStr(0);
		}
		if (line.length == 0) throw("���ݍs�ɕ���������܂���");
		var indent = getIndentString(line);
		
		var text = '';
		if ( isFileHeader() ) {
			text = creator.start + creator.header() + creator.end;
			putText(indent,text);
			return;
		}
		
		var info = creator.dispatch(line);
		if (!info || info.type.length<=0) throw("�R�����g�t���Ώۂł͂���܂���");
		
		objtrace(info);
		
		text = creator.start + creator[info.type](info) + creator.end;
		putText(indent,text);
	} catch (e) {
		var m;
		if (e.description) m = e.name + ":" + e.description + "(" + e.number + ")" + e.message;
		else m = e;
		alert(m);
	}
	return;
}

/**
 * �C���f���g���擾
 * @return �C���f���g������
 * @param text : �I�𕶎��� or ���ݍs������
 */
function getIndentString(text){
	return text.match(/^[ \t]*/);
}

/**
 * �e�L�X�g���o��
 * @return �Ȃ�
 * @param indent : �C���f���g������
 * @param text : �o�͕�����
 */
function putText(indent, text){
	var e = Editor;
	if ( e.IsTextSelected() ) e.Left();
	else e.GoLineTop(1);
	text = text.replace(/^(.+)/gm,indent+"$1");
	e.InsText( modifyReturnCode(text) );
}

/**
 * ���s�R�[�h�����݂̕����ɍ��킹��
 * @return ���s�R�[�h���C������������
 * @param text : ������
 */
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
}

/**
 * �t�@�C���̐擪�t�߂��ǂ����𔻒�
 * @return true  : �w�b�_�[
 * @return false : �w�b�_�[�ȊO
 */
function isFileHeader(){
	var e = Editor;
	if ( !e.IsTextSelected() ) {
		e.GoLineTop();
		e.GoLineEnd_Sel();
	}
	if (e.GetSelectLineFrom() <= 2) return true;
	return false;
}

/**
 * �����̓��t��ԋp
 * @return �����̓��t
 */
function today(){
	var d = new Date();
	var mm = "0"+(d.getMonth()+1);
	var dd = "0"+d.getDate();
	var today = d.getYear() +"/"+ mm.substr(mm.length-2) +"/"+ dd.substr(dd.length-2);
	return today;
}

// WSH�palert
function alert(msg) {
	if (typeof(_g_control) == 'undefined') {
		_g_control = new ActiveXObject("ScriptControl");
		_g_control.Language = "VBScript";
	}
	_g_control.AddCode('Call MsgBox("' + _vbescape(msg) +'")');
}

function _vbescape(v) {
	return ("" + v).replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "'); // "
}
