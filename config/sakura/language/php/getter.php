<?
	function skip($data , $ser)
	{
		return substr( strstr($data , $ser) , strlen($ser) );
	}

	function cut($data , $ser)
	{
		return substr($data , 0 , strlen($data) - strlen( skip($data , $ser) ) - strlen($ser) );
	}

	//start �` end �܂ł̎擾.
	function bitween($data , $start ,$end)
	{
		return cut( skip($data , $start ) ,$end );
	}

	//
	function getFunction($url , $func)
	{
		$data =  `curl $url`;

		$setumei = bitween($data ,'CLASS="refnamediv"' , 'CLASS="refsect1"' );
		$setumei = bitween($setumei ,'&nbsp;--&nbsp;' , '</DIV' );

		$teige = bitween($data ,'CLASS="refsect1"' , 'CLASS="function"' );
		$teige = bitween($teige ,'</H2' , '<BR' );
		$teige = skip($teige ,'>' );
		//�^�O�𔲂�.
		$teige = preg_replace(  "'<[\/\!]*?[^<>]*?>'si" , '' , $teige  );
		
		echo "${func} /// $teige\\n$setumei<br>";
		flush();
	}
	

	function getKeyWord($dir , $url)
	{
		$ret = "";
		$data = `curl '$url'`;
		$data = bitween($data , 'CLASS="TOC"' , '></DIV' );

		while($data)
		{
			$data = skip($data , 'HREF="');
			$next = skip($data , '"');
			$p = substr($data , 0 , strlen($data) - strlen($next) - 1);
			
			$func = bitween($next , '>' ,  '<');

			if (strlen($func) >= 1)
			{
				//�L�[���[�h�w���v�t�@�C���̏ꍇ�ʒu�����s
				getFunction($dir.$p , $func) ;

				//�L�[���[�h�t�@�C���̏ꍇ�͂����������s
				//echo $func . '<br>';
			}
		}
	}

	function getIndex($dir , $url)
	{
		$data = `curl '$url'`;
		$data = bitween($data , 'CLASS="TOC"' , '></DIV' );

		while($data)
		{
			$data = skip($data , 'HREF="');
			$next = skip($data , '"');
			$p = substr($data , 0 , strlen($data) - strlen($next) - 1);

			getKeyWord($dir , $dir.$p );
		}
	}
	

//�e�X�g	
//	getKeyWord("http://www.php.net/manual/ja/" , "http://www.php.net/manual/ja/ref.apache.php");
//��ɍאS�����Ǐd��
//	getIndex("http://www.php.net/manual/ja/" , "http://www.php.net/manual/ja/funcref.php");
//���[�J���ɓW�J���Ă�����s�̏ꍇ
	getIndex("http://192.168.1.30/b/" , "http://192.168.1.30/b/funcref.html");

?>