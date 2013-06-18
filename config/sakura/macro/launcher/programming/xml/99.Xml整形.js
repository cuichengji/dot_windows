function XmlFormatter() {
	this.buff = "";				// �t�H�[�}�b�g��̕�����o�b�t�@
	this.dom;
	this.initialize.apply(this, arguments);
}

XmlFormatter.prototype = {
	initialize : function(){
		this.dom = new ActiveXObject("Microsoft.XMLDOM");
		this.dom.setProperty("SelectionLanguage", "XPath");	// XPath ���g�p�ł���悤��
		this.dom.async = false;
	},
	fso : new ActiveXObject("Scripting.FileSystemObject"),
	indentLevel : 0,		// �C���f���g�K�w
	isTextAppend : false,	// �e�L�X�g�m�[�h���ǉ����ꂽ���ǂ���
	indent : "\t",			// �C���f���g�Ɏg�p���镶����
	newLine : "\n",			// ���s����
	formatXml : function(text) {
		this.buff = "";
		this.dom.loadXML(text);
		return this.formatMain(text);
	},
	// �t�@�C���p�X
	formatFile : function(path) {
		var ForReading = 1;
		this.buff = "";
		//if (!fso.FileExists(path)) return;
		var s = this.fso.OpenTextFile(path, ForReading);
		var text = s.ReadAll();
		s.Close();
		return this.formatMain(text);
	},
	// �t�H�[�}�b�g
	formatMain : function(text) {
		var root = this.dom.documentElement;
		if (!root) return;
		//if (!text) text = root.xml;
		
		// XML �錾�Ȃǃ��[�g�v�f�ȑO�̗v�f��ǉ�
		this.buff += text.substring(0, text.indexOf("<" + root.nodeName));
		
		// �t�H�[�}�b�g��� XML ���쐬
		this.formatNode(root);
		return this.buff;
	},
	// �C�ӂ̗v�f�𐮌`
	formatNode : function(node) {
		if (node.nodeType == 1) { // ELEMENT �m�[�h
			this.buff += this.newLine;
			// �C���f���g��ǉ�
			for (var ti = 0; ti < this.indentLevel; ti++) {
				this.buff += this.indent;
			}
			// �J�n�^�O��ǉ�
			this.buff += node.xml.substring(0, node.xml.indexOf(">") + 1);
			this.isTextAppend = false;

			// �q�m�[�h������΁A�S�q�m�[�h�ɑ΂��čċN�������s��
			if (node.childNodes.length > 0) {
				// �C���f���g���x�����C���N�������g
				this.indentLevel++;
				for (var ci = 0; ci < node.childNodes.length; ci++) {
					// �e�q�v�f�ɂ��čċN����
					this.formatNode(node.childNodes.item(ci));
				}
				// �C���f���g���x�����f�N�������g
				this.indentLevel--;

				// �e�L�X�g�m�[�h�̒���͉��s���C���f���g���ǉ����Ȃ�
				if (! this.isTextAppend) {
					this.buff += this.newLine;
					for (var ti = 0; ti < this.indentLevel; ti++) {
						this.buff += this.indent;
					}
				}

				// �I���^�O
				this.buff += "</" + node.nodeName + ">";
				this.isTextAppend = false;
			} else if (! this.buff.substring(0, this.buff.length - 2) == "/>") {
				// �I���^�O�̂����v�f�̏ꍇ
				this.buff += "</" + node.nodeName + ">";
				this.isTextAppend = false;
			}
		} else if (node.nodeType == 3) { // TEXT �m�[�h
			// �e�L�X�g�m�[�h�͂��̂܂ܒǉ�
			this.buff += node.nodeValue;
			this.isTextAppend = true;
		} else {
			// ���̑��̃m�[�h�̓C���f���g���Ă��̂܂ܒǉ�
			this.buff += this.newLine;
			// �^�u��ǉ�
			for (var i = 0; i < this.indentLevel; i++) {
				this.buff += this.indent;
			}
			this.buff += node.xml;
			this.isTextAppend = false;
		}
	}
}

function main(){
	var e = Editor;

	e.MoveHistSet();
	// �I��͈͂��Ȃ���ΑS�I��
	if (e.IsTextSelected() == 0){
		e.SelectAll();
	}

	// �ϊ�
	var text = e.GetSelectedString(0);		 // �I��͈͂̕�������擾
//	try {
		var formatter = new XmlFormatter();
		text = formatter.formatXml(text);
//	} catch (exp) {
//		e.TraceOut(exp.description);
//		e.MoveHistPrev();
//		return;
//	}
	e.InsText(modifyReturnCode(text));
	e.MoveHistPrev();
}

// ���s�R�[�h�����݂̕����ɍ��킹��
function modifyReturnCode(text){
	var e = Editor;
	var l = new Array("\r\n","\r","\n");
//	return text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g, l[e.GetLineCode()]);
	return text.replace(/\n/g,l[e.GetLineCode()]);
}

main();
