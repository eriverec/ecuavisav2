<?php
function esConsedido($data, $url, $controller) {
	$login = session('usuario');
	if ($login['idlogin']!='2') {
		foreach ($data as $x):
			if($x->url==$url){
				return $x;
			}
		endforeach;
		if($url!='menu'){
			$list = array(
				'iddetallerol'=>'0',
				'url'=> $url,
				'idpagina'=>'0',
				'idgrupo'=>'0',
				'editar'=>'0',
				'crear'=>'0',
				'eliminar'=>'0',
				'ver'=>'0',
				'listar'=>'0'
			); 
			return (object) $list;
		}
	} else { 
		$list = array(
			'iddetallerol'=>'all',
			'url'=> $url,
			'idpagina'=>'all',
			'idgrupo'=>'all',
			'editar'=>'1',
			'crear'=>'1',
			'ver'=>'0',
			'eliminar'=>'1',
			'listar'=>'1'
		); 
		return (object) $list;
	}
}

function esVisible($data, $url) {
	$CI =& get_instance();
    // We need to use $CI->session instead of $this->session
    $user = $CI->session->userdata('login');
	if ($user->idlogin!='1') { 
		foreach ($data as $x):
			if($x->url==$url){
				if($x->listar==1){
					return 'style="display:block"';
				}else{
					return 'style="display:none"';
				}
			}
		endforeach;
	} else {
		return 'style="display:block"';
	}
}

if ( ! function_exists('excluirCR()')){
	function excluirCR($data, $excluir){
		for ($i=0; $i < count($data); $i++) { 
            for ($j=0; $j < count($excluir) ; $j++) { 
                if($data[$i]['name']==$excluir[$j]){
                    \array_splice($data, $i, 1);
                }
            }
        }
        return $data;
	}
}

if ( ! function_exists('btn_acciones()')){
	function btn_acciones($accionesList = ['all'], $url = '', $id = 0){
		$acciones = '';
		$num = 0;
		$restore = false;
		$elim = false;
		$editar = false;

		$restoreBtn = '<a class="btn btn-warning btn-sm" data-action="restore" data-id="'.$id.'" href="#">Recuperar</a>';
		$elimBtn = '<a class="btn btn-danger btn-sm" data-action="elim" data-id="'.$id.'" href="#">Eliminar</a>';
		$editarBtn = '<a class="btn btn-info btn-sm" href="'.$url.'">Editar</a>';

		if (in_array("restore", $accionesList)) {
			$restore = true;
			$acciones .= $restoreBtn;
			$num++;
		}

		if (in_array("all", $accionesList)) {
			$elim = true;
			$editar = true;

			$acciones .= $editarBtn;
        	$acciones .= $elimBtn;
			$num++;
		}

		if(!in_array("all", $accionesList)){
			if(in_array("editar", $accionesList)){
				$editar = true;
				$acciones .= $editarBtn;
				$num++;
			}
			if(in_array("elim", $accionesList)){
				$elim = true;
				$acciones .= $elimBtn;
				$num++;
			}
		}

        return $acciones;
	}
}

if ( ! function_exists('listarDetPag()')){
	function listarDetPag($idrol, $modelPrincipal){
		//$modelPrincipal = $controller->load->model('Accesopaginas');
        /**/
        $modelPrincipal->select('pagina.url, pagina.nombre, detallerol.*');
        $modelPrincipal->where([
            "detallerol.idrol" => $idrol
        ]);
        $modelPrincipal->join('pagina', 'pagina.idpagina = detallerol.idpagina');
        $modelPrincipal->orderBy('pagina.nombre', 'ASC');
        $resultados = $modelPrincipal->get()->getResult();
        return $resultados;
	}
}