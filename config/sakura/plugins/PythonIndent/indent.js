// PythonIndent�v���O�C�� indent.js
// @date 2010.03.24 syat �V�K�쐬

//�J�[�\���̂���s�ԍ�
var nCurLine = parseInt(Editor.ExpandParameter("$y"));
var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
//�^�u��
var nTabSize = Editor.ChangeTabWidth( 0 );
//�C���f���g������̍쐬
var indentUnit = "";
for (var i=0; i<nTabSize; i++) {
	indentUnit += " ";
}
var do_indent = false;
var prev_indent = "####";

//�ҏW��������1�s���ǂݍ���ŉ�͂���
for ( var line_no = 1; line_no <= Editor.GetLineCount( 0 ) + 1; line_no++ ) {
	var line_str = Editor.GetLineStr( line_no );
	line_str = line_str.replace(/[\r\n]/g, "");			//���s����菜��

	//�J�[�\���s�ɗ�����C���f���g���ďI������
	if (line_no == nCurLine && do_indent && line_str == prev_indent) {
		Editor.InsText( indentUnit );
		break;
	}

	prev_indent = line_str.replace(/^( *).*$/, "$1");

	if (/^ *(if|elif|else|for|while|try|except|finally|def|class) /.test(line_str)) {
		do_indent = true;
	} else {
		do_indent = false;
	}

}

