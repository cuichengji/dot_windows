// �S�u��
var SOURCE = '';
var REPLACE_STR = '';
var DLG_STATE = '0010110100';
//				 9876543210
//bit ���e 
//0 �P��P�ʂŒT��  
//1 �p�啶���Ə���������ʂ���  
//2 ���K�\��  
//3 ������Ȃ��Ƃ��Ƀ��b�Z�[�W��\��  
//4 �u���_�C�A���O�������I�ɕ���  
//5 �擪�i�����j����Č�������  
//6 �N���b�v�{�[�h����\��t����  
//7 0=�t�@�C���S�� / 1=�I��͈�  
//9,8 00=�I�𕶎� / 01=�I���n�_�}�� / 10=�I���I�_�ǉ�  

main();

function main(){
	var e = Editor;
	//e.TraceOut(parseInt(DLG_STATE, 2));
	e.ReplaceAll(SOURCE, REPLACE_STR, parseInt(DLG_STATE, 2) );
}
