// http://blogs.wankuma.com/pinzolo/archive/2007/11/10/107472.aspx
// ��EmEditor���T�N���G�f�B�^�ł��c


/*
 * XML ���t�H�[�}�b�g���܂��B
 */
// �t�H�[�}�b�g��̕�����o�b�t�@
var _buff = "";

// �C���f���g�K�w
var _indentLevel = 0;

// �e�L�X�g�m�[�h���ǉ����ꂽ���ǂ���
var _isTextAppend = false;

// �C���f���g�Ɏg�p���镶����
var _indent = "\t"

// ���s����
var _newLine = getReturnCode();		//"\r\n";

var dom = new ActiveXObject("Microsoft.XMLDOM");
// XPath ���g�p�ł���悤��
dom.setProperty("SelectionLanguage", "XPath");
dom.async = false;

main();

function main(){
	var e = Editor;
	//var activeDoc = editor.activeDocument;
	//activeDoc.selection.selectAll();

	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}

	// �ϊ�
	var text = e.GetSelectedString(0);		 // �I��͈͂̕�������擾
	
	try {
		dom.loadXML(text);
	} catch (exp) {
		e.TraceOut(exp.description);
	}

	var root = dom.documentElement;
	if (!root) return;
	
	// XML �錾�Ȃǃ��[�g�v�f�ȑO�̗v�f��ǉ�
	_buff += text.substring(0, text.indexOf("<" + root.nodeName));
	
	// �t�H�[�}�b�g��� XML ���쐬
	formatNode(root);
	//activeDoc.selection.text = _buff;
	e.InsText(_buff);
}

// �����g�p�֐��錾
/*
 * �w��̃m�[�h�� XML ���t�H�[�}�b�g���ăo�b�t�@�ɒǉ����܂��B
 */
function formatNode(node) {
	if (node.nodeType == 1) { // ELEMENT �m�[�h
		_buff += _newLine;
		// �C���f���g��ǉ�
		for (var ti = 0; ti < _indentLevel; ti++) {
			_buff += _indent;
		}
		// �J�n�^�O��ǉ�
		_buff += node.xml.substring(0, node.xml.indexOf(">") + 1);
		_isTextAppend = false;

		// �q�m�[�h������΁A�S�q�m�[�h�ɑ΂��čċN�������s��
		if (node.childNodes.length > 0) {
			// �C���f���g���x�����C���N�������g
			_indentLevel++;
			for (var ci = 0; ci < node.childNodes.length; ci++) {
				// �e�q�v�f�ɂ��čċN����
				formatNode(node.childNodes.item(ci));
			}
			// �C���f���g���x�����f�N�������g
			_indentLevel--;

			// �e�L�X�g�m�[�h�̒���͉��s���C���f���g���ǉ����Ȃ�
			if (! _isTextAppend) {
				_buff += _newLine;
				for (var ti = 0; ti < _indentLevel; ti++) {
					_buff += _indent;
				}
			}

			// �I���^�O
			_buff += "</" + node.nodeName + ">";
			_isTextAppend = false;
		} else if (! _buff.substring(0, _buff.length - 2) == "/>") {
			// �I���^�O�̂����v�f�̏ꍇ
			_buff += "</" + node.nodeName + ">";
			_isTextAppend = false;
		}
	} else if (node.nodeType == 3) { // TEXT �m�[�h
		// �e�L�X�g�m�[�h�͂��̂܂ܒǉ�
		_buff += node.nodeValue;
		_isTextAppend = true;
	} else {
		// ���̑��̃m�[�h�̓C���f���g���Ă��̂܂ܒǉ�
		_buff += _newLine;
		// �^�u��ǉ�
		for (var i = 0; i < _indentLevel; i++) {
			_buff += _indent;
		}
		_buff += node.xml;
		_isTextAppend = false;
	}
}

function getReturnCode(){
	var l = new Array("\r\n","\r","\n");
	return l[Editor.GetLineCode()];
}

function alert(msg){
	var script = new ActiveXObject("ScriptControl");
	script.Language = "VBScript";
	var m=(''+msg).replace(/"/g, '""').replace(/[\r\n]+/g, '" & vbCrLf & "'); // "
	script.AddCode('MsgBox("'+m+'")');
}
