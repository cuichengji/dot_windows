;;
;; WindowsでEmacs風キーバインド
;;
#InstallKeybdHook
#UseHook
 
; C-x が押されると1になる
is_pre_x = 0
; C-Space が押されると1になる
is_pre_spc = 0
 
; Emacs風キーバインドを無効にしたいウィンドウ一覧
; 必要の無い部分はコメントアウトして下さい
is_target()
{
	IfWinActive,ahk_class ConsoleWindowClass ;Cygwin
		Return 1 
	IfWinActive,ahk_class MEADOW ;Meadow
		Return 1 
	IfWinActive,ahk_class cygwin/x X rl-xterm-XTerm-0
		Return 1
	IfWinActive,ahk_class Vim ;Windows上のGVIM
		Return 1
;	IfWinActive,ahk_class Xming X
;		Return 1
;	IfWinActive,ahk_class SunAwtFrame
;		Return 1
	IfWinActive,ahk_class Emacs ;NTEmacs
		Return 1  
	IfWinActive,ahk_class XEmacs ;Cygwin上のXEmacs
		Return 1
	SetTitleMatchMode, 2
	IfWinActive, - Microsoft Visual C++ 2010 Express
		Return 0
	Return 1
;	Return 0
}
 
delete_char()
{
	Send {Del}
	global is_pre_spc = 0
	Return
}
delete_backward_char()
{
	Send {BS}
	global is_pre_spc = 0
	Return
}
kill_line()
{
	Send {ShiftDown}{END}{SHIFTUP}
	Sleep 10 ;[ms]
	Send ^x
	global is_pre_spc = 0
	Return
}
open_line()
{
	Send {END}{Enter}{Up}
	global is_pre_spc = 0
	Return
}
quit()
{
	Send {ESC}
	global is_pre_spc = 0
	Return
}
newline()
{
	Send {Enter}
	global is_pre_spc = 0
	Return
}
indent_for_tab_command()
{
	Send {Tab}
	global is_pre_spc = 0
	Return
}
newline_and_indent()
{
	Send {Enter}{Tab}
	global is_pre_spc = 0
	Return
}
isearch_forward()
{
	Send ^f
	global is_pre_spc = 0
	Return
}
isearch_backward()
{
	Send ^f
	global is_pre_spc = 0
	Return
}
kill_region()
{
	Send ^x
	global is_pre_spc = 0
	Return
}
kill_ring_save()
{
	Send ^c
	global is_pre_spc = 0
	Return
}
yank()
{
	Send ^v
	global is_pre_spc = 0
	Return
}
undo()
{
	Send ^z
	global is_pre_spc = 0
	Return
}
find_file()
{
	Send ^o
	global is_pre_x = 0
	Return
}
save_buffer()
{
	Send, ^s
	global is_pre_x = 0
	Return
}
kill_emacs()
{
	Send !{F4}
	global is_pre_x = 0
	Return
}
 
move_beginning_of_line()
{
	global
	if is_pre_spc
		Send +{HOME}
	Else
		Send {HOME}
	Return
}
move_end_of_line()
{
	global
	if is_pre_spc
		Send +{END}
	Else
		Send {END}
	Return
}
previous_line()
{
	global
	if is_pre_spc
		Send +{Up}
	Else
		Send {Up}
	Return
}
next_line()
{
	global
	if is_pre_spc
		Send +{Down}
	Else
		Send {Down}
	Return
}
forward_char()
{
	global
	if is_pre_spc
		Send +{Right}
	Else
		Send {Right}
	Return
}
backward_char()
{
	global
	if is_pre_spc
		Send +{Left} 
	Else
		Send {Left}
	Return
}
scroll_up()
{
	global
	if is_pre_spc
		Send +{PgUp}
	Else
		Send {PgUp}
	Return
}
scroll_down()
{
	global
	if is_pre_spc
		Send +{PgDn}
	Else
		Send {PgDn}
	Return
}
 
 
^x::
	If is_target()
		Send %A_ThisHotkey%
	Else
		is_pre_x = 1
	Return 
^f::
	If is_target()
		Send %A_ThisHotkey%
	Else
	{
		If is_pre_x
		find_file()
		Else
		forward_char()
	}
	Return  
^c::
	If is_target()
		Send %A_ThisHotkey%
	Else
	{
		If is_pre_x
		kill_emacs()
	}
	Return  
^d::
	If is_target()
		Send %A_ThisHotkey%
	Else
		delete_char()
	Return
^h::
	If is_target()
		Send %A_ThisHotkey%
	Else
		delete_backward_char()
	Return
^k::
	If is_target()
		Send %A_ThisHotkey%
	Else
		kill_line()
	Return
^o::
	If is_target()
		Send %A_ThisHotkey%
	Else
		open_line()
	Return
^g::
	If is_target()
		Send %A_ThisHotkey%
	Else
		quit()
	Return
^j::
	If is_target()
		Send %A_ThisHotkey%
	Else
		newline_and_indent()
	Return
^m::
	If is_target()
		Send %A_ThisHotkey%
	Else
		newline()
	Return
^i::
	If is_target()
		Send %A_ThisHotkey%
	Else
		indent_for_tab_command()
	Return
^s::
	If is_target()
		Send %A_ThisHotkey%
	Else
	{
		If is_pre_x
			save_buffer()
		Else
			isearch_forward()
	}
	Return
^r::
	If is_target()
		Send %A_ThisHotkey%
	Else
		isearch_backward()
	Return
^w::
	If is_target()
		Send %A_ThisHotkey%
	Else
		kill_region()
	Return
!w::
	If is_target()
		Send %A_ThisHotkey%
	Else
		kill_ring_save()
	Return
^y::
	If is_target()
		Send %A_ThisHotkey%
	Else
		yank()
	Return
^/::
	If is_target()
		Send %A_ThisHotkey%
	Else
		undo()
	Return
 
;$^{Space}::
^vk20sc039::
	If is_target()
		Send {CtrlDown}{Space}{CtrlUp}
	Else
	{
		If is_pre_spc
			is_pre_spc = 0
		Else
			is_pre_spc = 1
	}
	Return
^@::
	If is_target()
		Send %A_ThisHotkey%
	Else
	{
		If is_pre_spc
			is_pre_spc = 0
		Else
			is_pre_spc = 1
	}
	Return
^a::
	If is_target()
		Send %A_ThisHotkey%
	Else
		move_beginning_of_line()
	Return
^e::
	If is_target()
		Send %A_ThisHotkey%
	Else
		move_end_of_line()
	Return
^p::
	If is_target()
		Send %A_ThisHotkey%
	Else
		previous_line()
	Return
^n::
	If is_target()
		Send %A_ThisHotkey%
	Else
		next_line()
	Return
^b::
	If is_target()
		Send %A_ThisHotkey%
	Else
		backward_char()
	Return
^v::
	If is_target()
		Send %A_ThisHotkey%
	Else
		scroll_down()
	Return
!v::
	If is_target()
		Send %A_ThisHotkey%
	Else
		scroll_up()
	Return
 
#k::
	MsgBox, 4,, スクリプトを終了しますか?,
	IfMsgBox, Yes
		ExitApp
	Return
