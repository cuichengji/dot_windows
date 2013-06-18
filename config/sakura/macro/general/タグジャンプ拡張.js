// �^�O�W�����v�g��
// 1��5�̏��Ɏ��s����B
// 1. Grep�t�@�C�����`�F�b�N���^�O�W�����v�B(�ł��͈͑I�����Ă���W�����v���Ȃ��B)
// 2. �I�𕶎���Ńt�@�C��������(URL�܂�)
// 3. pattern ����
//    �� ./ + env �W�J + findDirs ���g�p���� action ���\�b�h�Ō���
//       (�f�t�H���g�͒P���Ƀ}�b�`����������Ō����B�f�B���N�g���̋�؂�� /,\ ���g�p���Ă��Ȃ��ꍇ�́Aaction���\�b�h���`����K�v������B)
// 4. jump �Ō������A���݂���ΊY���s�ɃW�����v
// 5. �^�O�W�����v����B

(function(){	//}}

var e = Editor;
// ActiveX����
var fso = new ActiveXObject('Scripting.FileSystemObject');
var sh = new ActiveXObject('WScript.Shell');
var urlregex = /^h?ttps?:\/\/|^www/;
var pathregex = /["']([^"']+)["']|([a-zA-Z]:\\)?[a-zA-Z_\. \\/]+/;

// �ݒ�(�g���q���L�[�ƂȂ�B�w�肳��Ă��Ȃ����ڂ́A�Ȃ��Ă�����Ȃ�ɓ����͂��B)
var setting = {
	initialize: function(){
		this.copy('cpp'		,['c','h']);
		this.copy('java'	,['jav','jsp','jad']);
		this.copy('pl'		,['cgi','pm']);
		this.copy('vbs'		,['bas','cls','frm']);
	},
	cpp: {
		pattern: /include\s+["']([^"']+)["']/,
		env:['INCLUDE'],
		findDirs:['./inc']
	},
	java: {
		patterm: /import\s+["']([^"']+)["']/,
		action: function(str, dirs){		// str=pattern.\1, dirs = ./ + env + findDirs
			var names = str.split(".");
			var bases = e.GetFilename().split('\\');
			for (var i=0, dir='', l=bases.length; i<l ;i++){
				if (bases[i] == names[0]){
					var fp = dir + str.replace(/\./g,'\\');
					var path = getFilePath( fp+'.java');
					path = path ? path: getFilePath( fp+'.jav' );
					path = path ? path: getFilePath( fp );
					return path;
				}
				dir += bases[i]+'\\';
			}
			return false;
		}
	},
	pl: {
		jump: 'sub\\s+%WORD%'
	}, 
	rb: {
		jump: 'def\\s+%WORD%'
	},
	js: {
		jump: '\\s*%WORD%\\s*:\\s*function|function\\s+%WORD%\\s*\\('
	}, dms: this.js, html: this.js, htm: this.js, php: this.js, sh: this.js,
	vbs: {
		jump: '(Function|Sub|Private|Public|Protected)\\s+%WORD%\\s*\\('	//}
	},
	_default: {
		pattern: pathregex			//}
	},
	copy: function( src, list) {
		for (var i=0,l=list.length; i<l; i++) this[list[i]] = this[src];
	}
};
setting.initialize();

		
// �^�O�t�@�C����������f���ɃW�����v����B
if ( !e.GetFileName() && !e.IsTextSelected() && /^[A-Z]:.+\(\d+,\d+\)/.test(e.GetLineStr(0)) ){
	e.TagJump();
	return;
}
var path = findPathByCurrentLine();
if (path == null) return;
else if (path){
	if (urlregex.test(path)) getHtmlSource(path);
	else if (fso.FolderExists(path)) sh.Run('"'+path+'"', 1);
	else if (fso.FileExists(path)) {
		e.MoveHistSet();
		e.FileOpen(path);
	} 
	return;
}
e.TagJump();
return;

// ���ݍs����p�X���擾
function findPathByCurrentLine(){
	if (e.IsTextSelected()){
		var path = getFilePath(e.GetSelectedString().replace(/["']/g,''));	//"
		if (path) return path;
	}
	var ext = fso.GetExtensionName(e.GetFilename());
	var mode = setting[ext] ? setting[ext] : setting['_default'];
	var line = e.GetLineStr(0);
	if (mode.pattern) {
		mode.pattern.test(line);
		var str = RegExp.$1;
		if (str) {
			var dirs = expandSearchDir(mode.env, mode.findDirs);
			if (mode.action) {
				var path = mode.action( str, dirs );
				if (path) return path;
			} else {
				var path = getFilePath(str);
				if (path) return path;
				for (var i=0,l=dirs.length; i<l ;i++){
					var path = getFilePath(dirs[i]+'\\'+str);
					if (path) return path;
				}
			}
		}
	}
	if (mode.jump && jumpByKeyword(mode.jump)) return null;
	if (line.match(pathregex)) {
		var path = getFilePath(RegExp.$1);
		if (path) return path;
	}
	if (line.match(/urlregex/)) return RegExp.$1;
	return false;
}

// ���ϐ��W�J
function expandSearchDir(envlist, findDirs){
	var list = [''];
	if (findDirs) list = list.concat( findDirs );
	if (envlist)
		for (var i=0,l=envlist.length; i<l ;i++)
			list = list.concat(sh.ExpandEnvironmentStrings('%INCLUDE%').split(';'));
	return list;
}

// �L�[���[�h�ŃW�����v����
function jumpByKeyword(key){
	var word = e.ExpandParameter('$C');
	var y = e.ExpandParameter('$y');
	e.SearchNext( key.replace(/%WORD%/g, word.replace(/([^0-9a-zA-Z_])/g,'\\$1')) , 52);
	if (y != e.ExpandParameter('$y')){
		e.GoLineTop();
		e.SearchClearMark();
		return true;
	}
	return false;
}

// �t�@�C���p�X�`�F�b�N�������ɒT��
function getFilePath(path) {
	if (!path) return false;
	if (urlregex.test(path)) return path;
	if (typeof arguments.callee.cdir_cache == 'undefined')
		arguments.callee.cdir_cache = fso.GetParentFolderName(e.GetFilename());
	var cdir = arguments.callee.cdir_cache;
	
	var f = fso.GetAbsolutePathName(path);
	if (f != path.replace(/\\$/,'')) f = fso.GetAbsolutePathName(cdir + '\\' + path);
	if (fso.FileExists(f)) return f;
	if (fso.FolderExists(f)) return f;
	return false;
}

// �w�肳�ꂽURL�̃\�[�X���擾(���������S�~�����邯��)
function getHtmlSource(url){
	url = url.replace(/^(ttps?:)/,'h$1');
	url = url.replace(/^(www)/,'http://$1');
	httpRequest = new ActiveXObject('Msxml2.XMLHTTP');

	var http = null;
	if (typeof XMLHttpRequest == 'undefined') {
		try {
			http = new ActiveXObject('Msxml2.XMLHTTP')
		} catch (exp) {
			http = new ActiveXObject('Microsoft.XMLHTTP');
		}
	} else {
		http = new XMLHttpRequest();
	}
	try {
		http.open('GET', url, false);
		http.send(null);
	} catch (exp) {
		e.TraceOut( 'Error-http(' + exp.number + ') - ' + exp.message);
		return;
	}
	var result = [
	  '----------------------------------------------------- Info -'
	, url 
	, 'HTTP STATUS : ' + http.status + ' ' + http.statusText + ''
	, '---------------------------------------------- HTTP Header -'
	, http.getAllResponseHeaders()
	, '------------------------------------------------- Contents -'
	, http.responseText
	, '------------------------------------------------------------'
	].join('\n').replace(/\r\n/g,'\n');
	
	var temp = fso.GetSpecialFolder(2) + '\\' + fso.getTempName();
	var stream = fso.CreateTextFile(temp, true);
	try {
		stream.Write( result );
//		var line = result.split("\n");
//		for (var i=0, l=line.length; i<l ;i++ ){
//			stream.WriteLine(line[i]);
//		}
	} catch (exp) {
		stream.Close();
		fso.DeleteFile(temp, true);
		e.TraceOut("Error-file: " + exp.message+'('+exp.number+')');
		var line = result.split('\n');
		for (var i=0, l=line.length; i<l; i+=5) {
			e.TraceOut([
				line[i] , line[i+1] , line[i+2], line[i+3], line[i+4]
			].join('\n'));
		}
		return;
	}
	stream.Close();
	e.ExecCommand('type "'+temp+'"',0x01);
	//e.FileOpen(tempPath);
	fso.DeleteFile(temp, true);
}

})();
