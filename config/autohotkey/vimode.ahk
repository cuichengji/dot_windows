; vim: set sw=4 sts=4 ts=4 tw=0 noet ai:
#Include %A_ScriptDir%
#Include IME.ahk


;�����l
;####################################################################

; �� #if �Ɏg�p�ł���͉̂p���̂݁H blank�͔���s�\

;0 (VI���[�h����)
;1 normal
;2 insert
;3 Number
;4 Command
;5 Command line
;6 Search
;7 Replace
vimode=0

;0:�ʏ�i�I�����[�h�ł͂Ȃ��j
;1:�����I�����[�h  2:�s�I�����[�h  3:��`�I�����[�h(�Ή��A�v���̂�)
visualmode=0

;�J�b�g�o�b�t�@�����s�P�ʂ̏ꍇ�ɁA1
yankmode = 0

;[vimode=4]
;0 -
;1 delete
;2 yank
;3 g   gg(�t�@�C���擪)
;4 c   change
;5 r   replace
;(�ȉ��������@���聦���G�f�B�^��z��H������,eclipse,sakura,hidemaru���H)
;6 m   bookmark 
;7 '   bookmark
;8 f   ����
;9 F   �O������
;10 q   macro
;11 @   macro
command=0

n_count=
commandline=
ex_commandline=

;"/" or  "?"
searchmode=
searchword=


;####################################################################
;�L��/���� �g�O��
;####################################################################
#IfWinNotActive ahk_class Vim
;vimode on/off
^]:: 
	if vimode=0
	{
		vimode=1
		gosub,mode_end
		settimer,draw_tooltip ,100
	}
	else
	{
		gosub,mode_end
		vimode=0
		settimer,draw_tooltip,off
		tooltip,
	}
	return
#IfWinNotActive

;vi�n�̃E�B���h�E�ł͖������̂�
#IfWinActive ahk_class Vim
^]:: 
	vimode=0
	settimer,draw_tooltip,off
	tooltip,
	return
#IfWinNotActive

;####################################################################
;��ԕ`��
;####################################################################
draw_tooltip:
	WinGetActiveStats, title,myWide,myHigh,myX,myY
	myWide=10 ;�Œ�ʒu
	myHigh -= 20

	;MouseGetPos, myWide, myHigh
	;myWide+=10
	;myHigh+=5

	if vimode=0
		;tooltip,novimode, %myWide%,%myHigh%
		tooltip,
	else if vimode=1
	{
		if visualmode=0
			tooltip,vimode, %myWide%,%myHigh%
		else if visualmode=1
			tooltip,vimode[-visual-], %myWide%,%myHigh%
		else if visualmode=2
			tooltip,vimode[-visual line-], %myWide%,%myHigh%
		else if visualmode=3
			tooltip,vimode[-visual box-], %myWide%,%myHigh%
	}
	else if vimode=2
		tooltip,vimode[-insert-], %myWide%,%myHigh%
	else if vimode=3
		tooltip,vimode[%n_count%], %myWide%,%myHigh%
	else if vimode=31 ;replace�p
		tooltip,vimode[%n_count%%commandline%], %myWide%,%myHigh%
	else if vimode=4
		tooltip,vimode[%commandline%%n_count%], %myWide%,%myHigh%
	else if vimode=5
		tooltip,vimode[:], %myWide%,%myHigh%
	else if vimode=6
		tooltip,vimode[%searchmode%%searchword%], %myWide%,%myHigh%
	else if vimode=7
		tooltip,vimode[-replace-], %myWide%,%myHigh%
	else
		msgbox,error(%vimode%)
	return
	
;####################################################################
;�ʏ탂�[�h
;####################################################################
#If ( vimode=1 )
	ESC::
	^[::
		gosub,input_escape
		return

	Enter::
		Send,{down}
		return

	;################################
	;�J�[�\���ړ��n
	;################################
	h::gosub,move_h
	j::gosub,move_j
	k::gosub,move_k
	l::gosub,move_l
	w::gosub,move_w
	e::gosub,move_e
	b::gosub,move_b
	0::gosub,move_0
	$::gosub,move_$
	^::gosub,move_^
	+::gosub,move_+
	-::gosub,move_-
	^f::gosub,move_^f
	^b::gosub,move_^b

	+G::
		if visualmode=0
			Send,^{End}
		else
			Send,+^{End}
		return

	;�Z���e���X�ړ��͓���̂ŃG�N�Z�����ŕ֗���Ctrl�㉺��ݒ肵�Ă���
	(::Send,^{UP}
	)::Send,^{Down}

	;################################
	;�s����
	;################################
	+j::
		Send,{End}
		Send,{End}
		Send,{Delete}
		return


	;################################
	;undo/redo
	;################################
	u::
		Send,^z
		return

	^r::
		Send,^y

	;################################
	;�}�����[�h�ڍs
	;################################
	;�J�[�\���ʒu�ɑ}��
	i::gosub,insert_start

	;�s���ɑ}��
	+i::
		if visualmode=1
			return
		Send,{Home}
		gosub,insert_start
		return

	;�J�[�\���ʒu�̉E�ɒǉ�
	a::
		if visualmode=1
			return

		IfWinActive ahk_class XLMAIN 
		{
			ControlGetFocus, temp
			if temp=EXCEL61
			{
				Send,{Right}
			}
			gosub,insert_start
			return
		}
		Send,{Right}
		gosub,insert_start
		return

	;�s�����ɒǉ�
	+a::
		if visualmode=1
			return
		Send,{end}
		gosub,insert_start
		return

	;1�s�ǉ�
	o::
		if visualmode=1
			return
		Send,{end}
		Send,{end}
		gosub,input_enter
		gosub,insert_start
		return

	;1�s�}��
	+o::
		if visualmode=1
			return
		Send,{Home}
		Send,{Home}
		gosub,input_enter
		Send,{Up}
		gosub,insert_start
		return

	;1�����ύX
	s::
		Send,{Delete}
		gosub,insert_start
		return

	;1�s�ύX
	+s::
		Send,{Home}
		Send,+{End}
		Send,{Delete}
		gosub,insert_start
		return

	;�s���܂ŕύX
	+c::
		Send,+{End}
		Send,{Delete}
		gosub,insert_start
		return

	;################################
	;�ύX���[�h
	;################################
	r::
		IfWinActive ahk_class XLMAIN 
		{
			ControlGetFocus, temp
			if temp!=EXCEL61
			{
				Send,{F2}
				Send,^{Home}
				return
			}
		}

		vimode=4	;�c�[���`�b�v�\���p�ɃR�}���h���[�h�֕ύX
		command=5	;#if�ő��̃}�b�v�ɔ��肳��Ȃ��悤��
					;�i���̃}�b�v�ɔ��肳���ƁAinput�����z�b�g�L�[�̕����D�悳���j
		commandline=r
		input, temp, 'B C L1', {ESC}, 
		;msgbox,%ErrorLevel%
		if ErrorLevel=Max
		{
			Send,+{Right}
			Send,{%temp%}
			Send,{Left}
		}
		gosub,mode_end
		return

	+r::
		vimode=7
		Send,{insert}
		return


	;################################
	;visual���[�h�i�͈͑I���J�n�j
	;################################
	v:: 
		if visualmode=1
		{
			visualmode=0
			gosub,select_cancel
		}
		else 
		{
			visualmode=1
			;�f�t�H���g��1�����I��
			Send,+{Right}
		}
		return

	+v::
		if visualmode=2
			visualmode=0
		else
		{
			visualmode=2
			Send,{Home}
			Send,+{Down}
		}
		return

	;^v::visualmode=3
	


	;################################
	;�R�}���h�J�n
	;################################
	d::
		vimode=4
		command=1

		commandline=d
		return

	y::
		;�ʏ탂�[�h
		if visualmode=0
		{
			;�����N�J�n
			vimode=4
			command=2
			commandline=y
		}
		;�����I��
		if visualmode=1
		{
			Send,^c
			gosub,select_cancel
			yankmode=0
		}
		;�s�I��
		if visualmode=2
		{
			Send,^c
			gosub,select_cancel
			Send,{Home}
			yankmode=1
		}
		visualmode=0
		return

	g::
		vimode=4
		command=3
		commandline=g
		return

	c::
		if visualmode<>0
		{
			Send,{Delete}
			gosub,insert_start
		}
		vimode=4
		command=4
		commandline=c
		return
		return
	
	;################################
	;�N���b�v�{�[�h����
	;################################
	x::
		;�G�N�Z���̃Z���O�̏ꍇ�A���e���R�s�[���Ă�����e�폜
		IfWinActive ahk_class XLMAIN 
		{
			ControlGetFocus, temp
			if temp!=EXCEL61
			{
				Send,{F2}
				Send,^{home}
				Send,+^{End}
				Send,^c
				;Send,{F2}	;F2���ƃZ���ҏW���I�����Ă��Ȃ��l�Ɍ�����
				Send,{ESC}
				Send,{Delete}
				return
			}
		}
		if visualmode=0
			Send,+{Right}
		Send,^x
		return

	+x::
		if visualmode=0
			Send,+{Left}
		Send,^x
		return
	
	+d::
		if visualmode=0
			Send,+{End}
		else
		{
			Send,{Home}
			Send,+{End}
		}
		Send,^x
		return
	
	p::
		if yankmode=0
		{
			Send,{Right}
			Send,^v
			Send,{Left}
		}
		else if yankmode=1
		{
			Send,{Home}
			Send,{Home}
			Send,{Down}
			Send,^v
			Send,{Up}
		}
		else if yankmode=excelline
		{
			Send,{Down}
			Send,+{Space}
			Send,+{F10}
			Send,e
		}
		return

	+p::
		if yankmode=0
		{
			Send,^v
			Send,{Left}
		}
		else if yankmode=1
		{
			Send,{Home}
			Send,{Home}
			Send,^v
			Send,{Up}
		}
		else if yankmode=excelline
		{
			Send,+{Space}
			Send,+{F10}
			Send,e
		}
		return

	;################################
	;���l�w��(�J�n)��2���ڈڍs�͕ʓr
	;################################
	1::
	2::
	3::
	4::
	5::
	6::
	7::
	8::
	9::
		vimode=3
		;vimode=4
		;command=0
		n_count=%A_ThisHotkey%
		return

	;################################
	;�R�}���h���C�����[�h
	;################################
	::: 
		vimode=5	;�c�[���`�b�v�\���ύX�ƁAinputbox�ɕ��������͂ł���悤�ɁB
		inputbox ex_commandline ,vimode:,,,,100
		vimode=1	;�ʏ탂�[�h�ɖ߂�
		if ErrorLevel != 0
			return
		gosub,run_command
	`;::return
		
	;################################
	;����
	;################################
	/::
		Send,^f
		sleep,20
		gosub,insert_start
		return

	;?::
		
#If

;####################################################################
;�}�����[�h or �u�����[�h
;####################################################################
#if ( vimode=2 or vimode=7)

	ESC:: 
	^[:: 
		if vimode=7	;reprace�̏ꍇ�́A
		{
			Send,{insert}	;insert�L�[�������ăG�f�B�^�̃��[�h��}�����[�h�ɖ߂��Btodo:���܂Ƀ��[�h���ꂪ�N����
		}

		;todo ime���I���̏ꍇ�A���̓L�����Z��������insert���[�h���I�� or ���̓L�����Z������insert���[�h���I�� �̓���B
		; IME OFF���A�C���T�[�g���[�h�I���Ƃ������B�G�N�Z���ゾ�ƃZ���܂Ŕ����適�Ή��ς�
		gosub,input_escape
		return


	^h::Send,{BS}
	^i::Send,{Tab}

	^j::
	^m::
	enter::
		gosub,input_enter
		return

	;�C���f���g(�J�[�\���ʒu���ێ��ł��Ȃ��̂Ŏg��������������)
	^t::
		Send,{Home}
		Send,{Tab}
		return

	;�⊮(�G�f�B�^�ɂ��)
	;^n::
	;^p::
#if

;####################################################################
;�������͈ȍ~����
;####################################################################
#if ( vimode=3 )
	ESC:: 
	^[:: 
		gosub,input_escape
		return

	^h::
		StringLen, len, n_count
		len--
		;MsgBox, %len%
		if len = 0
			gosub,mode_end
		else
			StringLeft, n_count, n_count, %len%
		return

	;################################
	;���l����
	;################################
	1::
	2::
	3::
	4::
	5::
	6::
	7::
	8::
	9::
	0::
		n_count=%n_count%%A_ThisHotkey%
		return

	;################################
	;�J�[�\���ړ�
	;################################
	h::
	j::
	k::
	l::
	w::
	e::
	b::
	+::
	-::
	^f::
	^b::
		loop %n_count%
		{
			gosub,move_cursor
		}
		n_count=
		gosub,mode_end
		return

	

	;################################
	;�ύX
	;################################
	s::
		loop %n_count%
		{
			Send,+{Right}
		}
		n_count=
		Send,^x
		gosub,mode_end
		gosub,insert_start
		return

	;################################
	;�u��
	;################################
	r::
		vimode=31 ;�c�[���`�b�v�\���A�}�b�v�u��
		commandline=r
		input, temp, 'B C L1', {ESC}, 
		if ErrorLevel=Max
		{
			loop %n_count%
			{
				Send,+{Right}
			}
			loop %n_count%
			{
				Send,{%temp%}
			}
			Send,{Left}
		}
		n_count=
		gosub,mode_end
		return

	;################################
	;�폜
	;################################
	x::
		loop %n_count%
		{
			Send,+{Right}
		}
		n_count=
		Send,^x
		gosub,mode_end
		return
	+x::
		loop %n_count%
		{
			Send,+{Left}
		}
		n_count=
		Send,^x
		gosub,mode_end
		return

	;################################
	;�w��s�W�����v
	;################################
	g::
		IfWinActive ahk_class Hidemaru32Class
		{
			Send,^g
			Send,%n_count%
			n_count=
			Send,{Enter}
			return
		}
		return

#if


;####################################################################
;delete��
;####################################################################
#if ( vimode=4 and command=1 )
	ESC::
	^[::
		gosub,input_escape
		return

	d::
		;�G�N�Z���̃Z�����ɓ����ClassNN���uEXCEL61�v�ɂȂ�
		IfWinActive ahk_class XLMAIN
		{
			ControlGetFocus, temp
			if temp!=EXCEL61
			{
				yankmode=excelline
				Send,+{space}
				Send,^x
				gosub,mode_end
				return
			}
		}
		yankmode=1
		Send,{Home}
		Send,+{Down}
		Send,^x
		gosub,mode_end
		return

	;################################
	;���l����
	;################################
	1::
	2::
	3::
	4::
	5::
	6::
	7::
	8::
	9::
	0::
		n_count=%n_count%%A_ThisHotkey%
		return

	;################################
	;�͈͍폜
	;################################
	h::
	j::
	k::
	l::
	w::
	e::
	b::
	+::
	-::
		yankmode=0
		visualmode=1

		if n_count= 
			n_count=1
		loop %n_count%
		{
			gosub,move_cursor
		}
		n_count=

		Send,^x
		gosub,mode_end
		return
#if

;####################################################################
;yank��
;####################################################################
#if ( vimode=4 and command=2 )
	ESC::
	^[::
		gosub,input_escape
		return

	y::

		;excel�ōs�I���R�s�[
		;�G�N�Z���̃Z�����ɓ����ClassNN���uEXCEL61�v�ɂȂ�
		IfWinActive ahk_class XLMAIN
		{
			ControlGetFocus, temp
			if temp!=EXCEL61
			{
				yankmode=excelline
				Send,+{space}		;todo���{����̓��[�h���Ƃ��������Ȃ�(�Z�����ɔ��p�X�y�[�X����)
				Send,^c
				gosub,mode_end
				return
			}
		}
		yankmode=1
		Send,{Home}
		Send,+{Down}
		Send,^c
		Send,{Up}
		gosub,mode_end
		return

	;################################
	;���l����
	;################################
	1::
	2::
	3::
	4::
	5::
	6::
	7::
	8::
	9::
	0::
		n_count=%n_count%%A_ThisHotkey%
		return

	;################################
	;�͈̓R�s�[
	;################################
	h::
	j::
	k::
	l::
	w::
	e::
	b::
	+::
	-::
		yankmode=0
		visualmode=1

		if n_count= 
			n_count=1
		loop %n_count%
		{
			gosub,move_cursor
		}
		n_count=

		Send,^c
		gosub,mode_end
		return
#if

;####################################################################
;command g gg 
;####################################################################
#if ( vimode=4 and command=3 )
	ESC::
	^[::
		gosub,input_escape
		return

	g::
		if visualmode =0
			Send,^{Home}
		else
			Send,+^{Home}
		gosub,mode_end
		return
#if

;####################################################################
;command c change
;####################################################################
#if (vimode=4 and command=4 )
	ESC::
	^[::
		gosub,input_escape
		return

	;1�s�ύX(S�Ɠ���)
	c::
		Send,{Home}
		Send,+{End}
		Send,{Delete}
		gosub,insert_start
		return

	;################################
	;���l����
	;################################
	1::
	2::
	3::
	4::
	5::
	6::
	7::
	8::
	9::
	0::
		n_count=%n_count%%A_ThisHotkey%
		return

	h::
	j::
	k::
	l::
	w::
	e::
	b::
	+::
	-::
		yankmode=0
		visualmode=1

		if n_count= 
			n_count=1
		loop %n_count%
		{
			gosub,move_cursor
		}
		n_count=

		Send,^x
		gosub,mode_end
		gosub,insert_start
		return
#if


;####################################################################
;�J�[�\���ړ��n
;####################################################################
move_h:
	if visualmode=0
		Send,{Left}
	else if visualmode=1
		Send,+{Left}
	return

move_j:
	if visualmode=0
		Send,{Down}
	else
		Send,+{Down}
	return

move_k:
	if visualmode=0
		Send,{Up}
	else 
		Send,+{Up}
	return

move_l:
	if visualmode=0
		Send,{Right}
	else if visualmode=1
		Send,+{Right}
	return

move_w:
	if visualmode=0
		Send,^{Right}
	else if visualmode=1
		Send,^+{Right}
	return

move_e:
	if visualmode=0
	{
		Send,{Right}
		Send,^{Right}
		Send,{Left}
	}
	else if visualmode=1
	{
		Send,+{Right}
		Send,^+{Right}
		Send,+{Left}
	}
	return

move_b:
	if visualmode=0
		Send,^{Left}
	else if visualmode=1
		Send,^+{Left}
	return

move_0:
	if visualmode=0
		Send,{Home}
	else if visualmode=1
		Send,+{Home}
	return

move_$:
	if visualmode=0
		Send,{End}
	else if visualmode=1
		Send,+{End}
	return

move_^:
	if visualmode=0
	{
		Send,{Home}
		Send,{Home}
	}
	else if visualmode=1
	{
		Send,+{Home}
		Send,+{Home}
	}
	return

move_+:
	if visualmode=0
	{
		Send,{Home}
		Send,{Down}
	}
	else if visualmode=1
	{
		Send,{Home}
		Send,{Down}
	}
	return

move_-:
	if visualmode=0
	{
		Send,{Home}
		Send,{Up}
	}
	else if visualmode=1
	{
		Send,+{Home}
		Send,+{Up}
	}
	return

move_^f:
	if visualmode=0
		Send,{PgDn}
	else
		Send,+{PgDn}
	return

move_^b:
	if visualmode=0
		Send,{PgUp}
	else
		Send,+{PgUp}
	return

move_cursor:
	if      A_ThisHotkey = h
		gosub,move_h
	else if A_ThisHotkey = j
		gosub,move_j
	else if A_ThisHotkey = k
		gosub,move_k
	else if A_ThisHotkey = l
		gosub,move_l
	else if A_ThisHotkey = w
		gosub,move_w
	else if A_ThisHotkey = e
		gosub,move_e
	else if A_ThisHotkey = b
		gosub,move_b
	else if A_ThisHotkey = +
		gosub,move_+
	else if A_ThisHotkey = -
		gosub,move_-
	else if command=0 ;�J�b�g�A�����N���ɂ͕ňړ��͊܂܂Ȃ�
	{
		if      A_ThisHotkey = ^f
			gosub,move_^f
		else if A_ThisHotkey = ^b
			gosub,move_^b
	}
	return

;####################################################################
;�ʏ탂�[�h(vimode=1)�ŌĂ΂�邱�Ƃ͖����͂��H
input_enter:

	;excel
	IfWinActive ahk_class XLMAIN 
	{					;excel�̏ꍇ
		ControlGetFocus, temp
		if temp=EXCEL61	;�Z����
		{
			;Send,!{Enter}
			;todo ���{��̊m�肪���������Ȃ�B���m�蕶���񂪂���΁A�m��̂�(enter�̂�)�B
			;���m�蕶���񖳂����ALT-Enter�̂݁B�Ƃ������B
			StringCaseSense, On
			if A_ThisHotkey in o,+o	;�b��Ώ�
			Send,!{Enter}
			else
				Send,{Enter}	;���{��m�� or �Z���m��(����insert���[�h�̂܂܃Z���𔲂��Ă��܂�)
		}
		else			;�Z���O
			Send,{enter}
	}
	else				;excel�ȊO
	{
		Send,{enter}
	}
	return

;####################################################################
input_escape:

	;�Z���̕ҏW���e���L�������킹�������Ĕ߂����v�������Ȃ����߂�
	IfWinActive ahk_class XLMAIN
	{
		ControlGetFocus, temp
		if temp=EXCEL61		;�Z����
		{
			if vimode=1		;�ʏ탂�[�h
			{
				vimode=0	;���̃_�C�A���O�ŁAyn��������悤��
				msgbox,3,vimode,�Z���ҏW���e���m�肵�܂����H
				vimode=1	;���[�h�I������̂ŕK�v�Ȃ����A�ꉞ�ʏ탂�[�h�ɖ߂��Ă���

				ifmsgbox,Yes
					Send,{Enter}
				ifmsgbox,No
					Send,{ESC}
				ifmsgbox,Cancel	;�L�����Z���̓Z���ҏW���[�h�̂܂�
					return
			}
			;�Z�����Œʏ탂�[�h�ȊO�̏ꍇ�́AESC�𔭍s�����Ɍ㑱��mode_end�����s
			;(todo:���m��̓��{����͂��L�����Z�����ꂸ�}�����[�h���I��)
		}
		else				;�Z���O
			Send,{ESC}
	}
	else	;�G�N�Z���ȊO
	{	
		if IME_GET()=1 and IME_GetConverting()!=0
		{
			;���{����͒�
		Send,{ESC}
		}else{
			;Send,{ESC}
			gosub,mode_end
		}
	}

	return

;####################################################################
run_command:
	if ex_commandline = w
		Send,^s
	else if ex_commandline = x
		Send,^w
	else if ex_commandline = q
	{
		IfWinActive ahk_class XLMAIN
		{
			Send,^w
			return
		}
		Send,!{F4}
	}
	else
		;todo �������F�X
		msgbox, %ex_commandline% �͖������ł��B
	return

;####################################################################
insert_start:
	;�G�N�Z���̏ꍇ�A�Z���̊O��������Z���ҏW��
	IfWinActive ahk_class XLMAIN
	{
		ControlGetFocus, temp
		if temp!=EXCEL61
		{
			Send,{F2}
			if A_ThisHotkey = i
			{
			Send,^{Home}
			}
			;�}�����[�h�ɂ͂Ȃ�Ȃ����������ꍇ�́A����return���R�����g�B
			;�ʏ탂�[�h�̂܂܃Z�����ɓ����������Acw�Ƃ��o���ĕ֗��H
			return
		}
	}
	vimode=2
	return

;####################################################################
mode_end:
	vimode=1
	visualmode=0
	command=0
	n_count=
	commandline=
	return

;####################################################################
;#IfWinActive ahk_class Hidemaru32Class
;select_cancel:
;	;Send,{Esc}
;	;�I���J�n�ʒu�ɖ߂�
;	Send,{Left}
;	return
;
;#IfWinActive 
;select_cancel:
;	Send,{Left}
;	Send,{Right}
;	return


;####################################################################
select_cancel:
	IfWinActive ahk_class Hidemaru32Class
	{
		;Send,{Esc}
		;�I���J�n�ʒu�ɖ߂�
		Send,{Left}
		return
	}
	Send,{Left}
	Send,{Right}
	return
