// �S�u��
var e = Editor;
var SOURCE = '^[ \\t]*[\\r\\n]+';
var SEARCH_FILE = '*.*;!entries;!all-wcprops;!*.svn*;!*.bak;!*.tmp;!*.dat;!*.~???;!*.*~';		// �t�@�C���}�X�N
//var SEARCH_FILE = e.ExpandParameter('$F').replace(/(^\\]+)$/g,'$1');							// ���t�@�C����
var SEARCH_DIR = e.ExpandParameter('$F').replace(/[^\\]+$/g,'');
var DLG_STATE = '0110001101111001';
//				 5432109876543210
//bit ���e 
//0 �T�u�t�H���_������������� 
//1 - No Use - 
//2 �p�啶���Ə���������ʂ��� 
//3 ���K�\�� 
//4 �����R�[�h�Z�b�g�����I�� 
//5 0=�Y������ / 1=�Y���s 
//6 0=�m�[�}�� / 1=�t�@�C���� 
//15�`8 �����R�[�h�Z�b�g 
//		00000000(0) Shift_JIS 
//		00000001(1) JIS 
//		00000010(2) EUC 
//		00000011(3) Unicode 
//		00000100(4) UTF-8 
//		00000101(5) UTF-7 
//		00000110(6) UnicodeBE 
//		01100011(99) �����I�� 

var NOFILE = '(����)';

main();

function main(){
	//e.TraceOut(parseInt(DLG_STATE, 2));
	if (SEARCH_DIR && SEARCH_FILE && SEARCH_FILE != NOFILE) 
		e.Grep(SOURCE, SEARCH_FILE, SEARCH_DIR, parseInt(DLG_STATE, 2) );
}
