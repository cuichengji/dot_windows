// �Ή����銇�ʂ܂ł�I��

var e = Editor;

main();

function main() {
	// �ړ��O�̈ʒu���L��
	var y1 = Number(e.ExpandParameter('$y'));
	var x1 = Number(e.ExpandParameter('$x'));

	e.BracketPair();	// �Ή����銇�ʂɈړ�

	// �ړ���̈ʒu���L��
	var y2 = Number(e.ExpandParameter('$y'));
	var x2 = Number(e.ExpandParameter('$x'));

	// ���ɖ߂�
	e.BracketPair();

	if ( y1 == y2 && x1 == x2 ) {
		return;
	} else {
		if (y1 > y2 || (y1 == y2 && x1 > x2)) e.BracketPair();	// �����ʂɂ���ꍇ�i�ړ��O > �ړ���j
		
		e.BeginSelect();	// �I���J�n
		
		e.BracketPair();	// �I��͈̖͂����Ɉړ�
		e.Right_Sel();		// �E�ɃJ�[�\���ړ�
		
		e.BeginSelect();	// �I��͈͕ύX���ɂȂ�̂ŉ���
	}
}
