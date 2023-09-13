
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    $datosRecibidos = array();
    parse_str($data, $datosRecibidos);
    // Trabaja con los datos recibidos
    // Por ejemplo, para acceder al nombre: $nombre = $datosRecibidos['nombre'];
    //echo json_encode($data);
    function UTMLinks($id, $link){
		$utm = [
			"utm_source=SendPulse&utm_medium=bannerHeader&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//0
			"utm_source=SendPulse&utm_medium=SeccionPolitica&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//1
			"utm_source=SendPulse&utm_medium=es&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//2
			"utm_source=SendPulse&utm_medium=noEs&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//3
			"utm_source=SendPulse&utm_medium=noEs&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//4
			"utm_source=SendPulse&utm_medium=Nota1&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//5
			"utm_source=SendPulse&utm_medium=Nota2&utm_campaign=N_CodigoRojas&utm_id=Newsletter",//6
			"utm_source=SendPulse&utm_medium=Nota3&utm_campaign=N_CodigoRojas&utm_id=Newsletter"//7
		];

		//utm_source_ecuavisa=Prueba
		if(count($utm) < $id + 1){
			return $link;
		}
		
		// Obtener la URL actual
	    $urlActual = $link;

	    // Verificar si la URL ya tiene parámetros
	    if (strpos($urlActual, '?') !== false) {
	        // Si ya tiene parámetros, agregamos los UTM con un '&'
	        $urlActual .= '&' . $utm[$id];
	    } else {
	        // Si no tiene parámetros, agregamos los UTM con un '?'
	        $urlActual .= '?' . $utm[$id];
	    }

	    return $urlActual;
	}

    function getUltimaSeccion($data){
    	$html = '<br>';
    	$html .= '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;padding-top:20px;display:block" border="0" width="100%"><tbody><tr style="border-color:transparent"><td style="border-collapse:collapse; border-color:transparent; padding-left:0; padding-right:0; padding-top:0; padding-bottom:0; vertical-align:top" border="0" cellpadding="0" cellspacing="0" valign="top"><table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%" border="0" width="100%"><tbody><tr style="border-color:transparent"><th width="500" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc responsive " align="left" valign="top"><table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0"><tbody><tr style="border-color:transparent"><td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top"><table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_48" style="border-collapse:separate; font-size:14px; line-height:1.2; text-color:black; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; margin:0; overflow:hidden"><tbody><tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif"><td class="content-cell" width="470" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:15px; padding-bottom:15px" valign="top"><p style="line-height:1; margin:0 0 10px; font-size:inherit; color:inherit; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0"><span style="color: #000000;"><strong><span style="font-size: 18px;font-style: italic;">También te puede interesar...</span></strong></span></p><div style="font-size:14px; line-height:1.2; clear:both"></div></td></tr></tbody></table></td></tr></tbody></table></th></tr></tbody></table></td></tr></tbody></table>';
    	for ($i=0; $i < count($data) ; $i++) { 
    		$b = $data[$i];

    		$html .= '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%" border="0" width="100%">
			   <tbody>
			      <tr style="border-color:transparent">
			         <td style="border-collapse:collapse; border-color:transparent; padding-left:0; padding-right:0; padding-top:0; padding-bottom:0; vertical-align:top" border="0" cellpadding="0" cellspacing="0" valign="top">
			            <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%" border="0" width="100%">
			               <tbody>
			                  <tr style="border-color:transparent">
			                     <th width="250" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc no-responsive " align="left" valign="top">
			                        <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
			                           <tbody>
			                              <tr style="border-color:transparent">
			                                 <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
			                                    <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_22" style="border-collapse:separate; font-size:14px; line-height:1.2; text-color:black; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; margin:0; overflow:hidden">
			                                       <tbody>
			                                          <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
			                                             <td class="content-cell" width="220" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:15px; padding-bottom:15px" valign="top">
			                                                <p canonicalurl="'.$b['link'].'" idart="5741040" style="line-height:1.2; margin:0 0 10px; font-size:inherit; color:inherit; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0;padding-top: 5px;"><span style="font-size: 20px; color: #000000;"><strong><span mlnid="idcon1084747order30"><a href="'.$b['link'].'" style="text-decoration:none; color:#000">
			                                                '.$b['titulo'].'</a></span></strong></span></p>
			                                                <div style="font-size:14px; line-height:1.2; clear:both"></div>
			                                             </td>
			                                          </tr>
			                                       </tbody>
			                                    </table>
			                                 </td>
			                              </tr>
			                           </tbody>
			                        </table>
			                     </th>
			                     <th width="250" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc no-responsive " align="left" valign="top">
			                        <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
			                           <tbody>
			                              <tr style="border-color:transparent">
			                                 <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
			                                    <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_27_element_0" style="border-collapse:separate; font-size:14px; line-height:1.2; overflow:hidden">
			                                       <tbody>
			                                          <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
			                                             <td class="content-cell" width="220" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:15px; padding-bottom:0px" valign="top">
			                                                <div id="wout_block_27_element_0" style="font-size:14px; line-height:1.2; width:100%; height:145; display:block; text-align:center" width="100%" height="145" align="center">
			                                                   <center>
			                                                   	<a href="'.$b['link'].'" style="text-decoration:none; color:#000">
			                                                      <img border="0" width="220" height="auto" class="desktop  sp-img small_img " align="center" alt="'.$b['titulo'].'" src="'.$b['image'].'" iout_block_27_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; display:block; -ms-interpolation-mode:bicubic"><!--[if !mso]><!-->
			                                                      <div style="font-size:14px; line-height:1.2; mso-hide:all"><img border="0" width="100%" height="auto" class="mobile  sp-img small_img " align="center" alt="'.$b['titulo'].'" src="'.$b['image'].'" iout_block_27_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; -ms-interpolation-mode:bicubic; display:none; width:100%; max-width:250px !important"></div>
			                                                      <!--<![endif]-->
			                                                    </a>
			                                                   </center>
			                                                </div>
			                                                <div style="font-size:14px; line-height:1.2; clear:both"></div>
			                                             </td>
			                                          </tr>
			                                       </tbody>
			                                    </table>
			                                 </td>
			                              </tr>
			                           </tbody>
			                        </table>
			                     </th>
			                  </tr>
			               </tbody>
			            </table>
			         </td>
			      </tr>
			   </tbody>
			</table>';
    	}

    	return $html;
    }

    function getImgParrafo($dataImg){
        if(!is_array($dataImg)){
            return "";
        }
        $convertList = $dataImg;
        $cutline = "";
        $byline = "";
        foreach ($convertList as $key => $value) {
            if($value->name == "Cutline"){
                $cutline = $value->__text;
            }
            if($value->name == "Byline"){
                $byline = "($value->__text)";
            }
        }
        
        if($cutline == ""){
            return "";
        }
        
        return '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%; font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
        	<tr>
        		<td>
        			<p style="
				        display:block;
						text-align: center;
						margin-top: 0px;
						padding: 10px;
						margin-bottom: 5px;
						font-style: italic;
					    color: #fff;
					    font-size: 12px;
					    background-color:#2e22b6;font-weight: 400;line-height: 1.2;" >'.$cutline.' '.$byline.'</p>
        		</td>
        	</tr>
        </table>';
    }

    function getOpinionesBloquesURL($list2){
        $content = [];
        $titulosOpinionEs = [];
        $titulosOpinionNoEs = [];
		$titulosUrl = [];
		$bloquesN = [];
		$html = '';
		$existe = false;
		$existeNoEs = false;
		$existeEs = false;
		$coloresList = ["#00a1d3", "#2927b9"];
		$list = $list2;
		if(is_array($list)){
            foreach ($list as $key => $value) {
            	if ($value["name"] === "esUnMejor") {
			        $titulosOpinionEs[] = $value["__text"];
					$existe = true;
			    }
            }

            foreach ($list as $key => $value) {
            	if ($value["name"] === "noEsUnMejor") {
			        $titulosOpinionNoEs[] = $value["__text"];
					$existe = true;
			    }
            }
        }


        if(count($titulosOpinionNoEs) < 1 && count($titulosOpinionEs) < 1){ // Si no existe ningun bloque no se pinta la sección
        	return "";
        }
        
        $ecuadirEsList = [];//Es un mejor
        $ecuadirNoEsList = [];//No es un mejor

        // print_r($ecuadirEsList);

        $ecuadorEs = '';

        if(count($titulosOpinionEs) > 0){
        	$ecuadirEsList = explode("*", $titulosOpinionEs[0]); //Es un mejor
        	$ecuadorEs.= '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;border-collapse:separate; font-size:14px; line-height:1.2; text-color:black; background-color:'.$coloresList[0].'; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; color:#fff; margin:0; overflow:hiddenpadding-right: 15px;
		    padding-left: 10px;
		    padding-right: 10px;
		    padding-top: 20px;
		    padding-bottom: 20px;" border="0" width="100%">';
	    	$ecuadorEs.= '<tbody>';
	    	$ecuadorEs.= '<tr>';

	    	$ecuadorEs.= '<td style="padding-left: 10px;
		    padding-right: 10px;
		    padding-top: 0px;
		    padding-bottom: 10px;" align="center">';
	    	$ecuadorEs.= '  <div style="display:block;text-align:center;padding-left:20px;padding-right:20px;padding-bottom:15px;padding-top:20px">
			            		<p style="line-height:1.2; margin:0 0 10px;padding-bottom:10px; font-size:inherit; color:#fff; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0;padding-bottom:20px">
			            			<span style="font-size: 23px;">
			            				<strong>Ecuador hoy es un mejor país por...</strong>
			            				<br>
			            			</span>
			            		</p>';
			for ($i=1; $i < count($ecuadirEsList); $i++) {
				$existeEs = true;
				$dataJsonList = explode("https://", $ecuadirEsList[$i]);

				if(count($dataJsonList) < 2){
					$ecuadorEs.= '';
				}else{
					$ecuadorEs.= '<br> <a href="'.UTMLinks(2, 'https://'.$dataJsonList[1]).'" style="text-decoration: none;font-style: italic;line-height:1.2; margin:0 0 10px; font-size:14px; color:#fff; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0;display:block;padding-bottom:10px">
			            			<span>'.$dataJsonList[0].'.</span>
			            		</a>';
				}

			}
		    $ecuadorEs.=   '</div>';
	    	$ecuadorEs.= '</td>';
	    	$ecuadorEs.= '</tr>';
	    	$ecuadorEs.= '</tbody>';
	    	$ecuadorEs.= '</table>';
        }
        

        $ecuadorNoEs = '';

        if(count($titulosOpinionNoEs) > 0){
        	$ecuadirNoEsList = explode("*", $titulosOpinionNoEs[0]);//No es un mejor
        	// echo json_encode($ecuadirNoEsList);
        	$ecuadorNoEs.= '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;border-collapse:separate; font-size:14px; line-height:1.2; text-color:black; background-color:'.$coloresList[1].'; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; color:#fff; margin:0; overflow:hiddenpadding-right: 15px;
		    padding-left: 10px;
		    padding-right: 10px;
		    padding-top: 20px;
		    padding-bottom: 20px;" border="0" width="100%">';
	    	$ecuadorNoEs.= '<tbody>';
	    	$ecuadorNoEs.= '<tr>';
	    	$ecuadorNoEs.= '<td style="padding-left: 10px;
		    padding-right: 10px;
		    padding-top: 0px;
		    padding-bottom: 10px;" align="center">';
	    	$ecuadorNoEs.= '  <div style="display:block;text-align:center;padding-left:20px;padding-right:20px;padding-bottom:15px;padding-top:20px">
			            		<p style="line-height:1.2;padding-bottom:10px; margin:0 0 10px; font-size:inherit; color:#fff; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0;padding-bottom:20px">
			            			<span style="font-size: 23px;">
			            				<strong>Ecuador hoy no es un mejor país por...</strong>
			            			</span>
			            		</p>';

			for ($i=1; $i < count($ecuadirNoEsList); $i++) {
				$existeNoEs = true;
				$dataJsonList = explode("https://", $ecuadirNoEsList[$i]);
				if(count($dataJsonList) < 2){
					$ecuadorEs.= '';
				}
				else{
					$ecuadorNoEs.= '<br><a href="'.UTMLinks(3, 'https://'.$dataJsonList[1]).'" style="text-decoration: none;font-style: italic;line-height:1.2; margin:0 0 10px; font-size:14px; color:#fff; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0;display:block;padding-bottom:10px">
			            			<span>'.$dataJsonList[0].'.</span>
			            		</a>';
				}
			}

		    $ecuadorNoEs.=   '</div>';
	    	$ecuadorNoEs.= '</td>';
	    	$ecuadorNoEs.= '</tr>';
	    	$ecuadorNoEs.= '</tbody>';
	    	$ecuadorNoEs.= '</table>';
        }
		
        return ($existeEs?$ecuadorEs:'').($existeNoEs?$ecuadorNoEs:'');
    }
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title></title>
	<style>
	    @page {
	    	margin-top: 1cm;
	    	margin-left: 1cm;
	    	margin-right: 1cm;
	        size: auto;
	        odd-header-name: MyHeader1;
	        odd-footer-name: MyFooter1;
/*	        sheet-size: 180mm 370mm;*/
	    }
	    .content{
	    	padding-top:0px;
	    }
	    .table-reporte { 
            border-collapse: collapse; 
        }
        .table-reporte th { 
            background: #fefefe; 
            color: rgb(0, 0, 0); 
            font-weight: bold; 
        }
        .table-reporte th, .table-reporte td { 
            padding: 10px; 
            border: 1px solid #ccc; 
            text-align: left; 
            font-size: 12px;
        }
        .table-reporte tr:nth-of-type(odd) { 
            background: #eee; 
        }
        
        
	</style>
</head>
<body>
    <htmlpageheader name="MyHeader1" class="header" ></htmlpageheader>
    <div class="content">
    	<table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
		   <tbody>
		      <tr style="border-color:transparent">
		         <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
		            <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_15_element_0" style="border-collapse:separate; font-size:14px; line-height:1.2; background-color:transparent; overflow:hidden">
		               <tbody>
		                  <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
		                     <td class="content-cell padding-lr-0 padding-top-0 padding-bottom-0" width="500" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:0; padding-right:0; padding-top:0; padding-bottom:0" valign="top">
		                        <div id="wout_block_15_element_0" style="font-size:14px; line-height:1.2; width:100%; height:137; display:block; text-align:center" width="100%" height="137" align="center">
		                           <a class="link_img" href="https://www.ecuavisa.com/?utm_source=SendPulse&amp;utm_medium=bannerHeader&amp;utm_campaign=N_CodigoRojas&amp;utm_id=Newsletter" style="text-decoration:none; color:#0089bf; display:block">
		                              <center>
		                                 <img border="0" width="500" height="auto" class="desktop  sp-img " align="center" alt="Ecuavisa.com" src="https://s7844538.sendpul.se/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/portada-carlos-rojas.jpg" iout_block_15_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; display:block; -ms-interpolation-mode:bicubic"><!--[if !mso]><!-->
		                                 <div style="font-size:14px; line-height:1.2; mso-hide:all"><img border="0" width="100%" height="auto" class="mobile  sp-img " align="center" alt="Ecuavisa.com" src="https://s7844538.sendpul.se/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/portada-carlos-rojas.jpg" iout_block_15_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; -ms-interpolation-mode:bicubic; display:none; width:100%; max-width:100% !important"></div>
		                                 <!--<![endif]-->
		                              </center>
		                           </a>
		                        </div>
		                        <div style="font-size:14px; line-height:1.2; clear:both"></div>
		                     </td>
		                  </tr>
		               </tbody>
		            </table>
		         </td>
		      </tr>
		   </tbody>
		</table>

		<table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
		   <tbody>
		      <tr style="border-color:transparent">
		         <td align="center" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
		            <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_51" style="border-collapse:separate; font-size:14px; line-height:1.2; text-color:black; font-weight:normal; margin:0; overflow:hidden">
		               <tbody>
		                  <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
		                     <td align="center" class="content-cell" width="470" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:15px; padding-bottom:5px" valign="top">
		                        <p style="line-height:inherit; margin:0 0 10px; font-size:inherit; color:inherit; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif; text-align:center; font-weight:normal; padding:0" align="center">
		                        	<span style="font-size: 15px;"><strong><?= $datosRecibidos["fechaFormateada"] ?></strong></span></p>
		                        <div style="font-size:14px; line-height:1.2; clear:both"></div>
		                     </td>
		                  </tr>
		               </tbody>
		            </table>
		         </td>
		      </tr>
		   </tbody>
		</table>
		<table width="500px" align="center" style="border-collapse:collapse; font-size:14px; line-height:1.2;">
			<tbody>
		      <tr style="border-color:transparent">
		         <td align="left" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
		            <?php 

		            	$getFristNota = $datosRecibidos['data'][2]['notaPrincipalDefault'];
			            $content = "";
			            for ($i=0; $i < count($datosRecibidos['data'][4]['notaPrincipalTodosDatos']); $i++) { 
			            	$value =  $datosRecibidos['data'][4]['notaPrincipalTodosDatos'][$i];
			            	$value = (object) $value;
			            	if($value->name == "Image"){
			                    $content .= '
			                    <a style="text-decoration:none;color: black;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" href="'.$getFristNota["link"].'">
			                    	<img width="200" style="width:100%;height:auto" src="'.$value->remoteContent->href.'" alt="Imagen de twitter">

							    </a>
			                    ';
			                }
			                if($value->name == "Headline"){
			                    $titulo = $value->__text;
			                    $content .= '
			                    	<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
			                    		
							        	<tr>
							        		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;">
							        			<a style="text-decoration:none;color: black;" href="'.$getFristNota["link"].'">
							        				<h1 style="margin-top: 0px;
							        					padding-bottom:5px;
							        					color:black;
													    font-size: 30px;
													    line-height: 1.2;
													    margin-bottom: 0px;
													 ">'.$value->__text.'</h1>
							        			</a>
							        		<td>
							        	<tr>
							        </table>';
			                }
			                if($value->name == "Subheadline"){
			                    $content.= '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
							        	<tr>
							        		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;">
							        			<small>'.$value->__text.'</small>
							        		<td>
							        	<tr>
						        	</table>';
			                }
			                if($value->name == "Quotecv"){
			                	$content.= '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;line-height:1.2;width:100%;padding-left: 20px;padding-right: 20px;display: block;" border="0" width="100%">
								   <tbody>
								      <tr style="border-color:transparent">
								         <th width="55" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc no-responsive " align="left" valign="top">
								            <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
								               <tbody>
								                  <tr style="border-color:transparent">
								                     <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
								                        <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_33_element_0" style="border-collapse:separate; font-size:14px; line-height:1.2; overflow:hidden">
								                           <tbody>
								                              <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
								                                 <td class="content-cell" width="25" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:15px; padding-bottom:15px" valign="top">
								                                    <div id="wout_block_33_element_0" style="font-size:14px; line-height:1.2; width:100%; height:168.285714; display:block" width="100%" height="168.285714">
								                                       <img border="0" width="19" height="auto" class="desktop  sp-img small_img smallImg " align="right" alt="linea-vertical-opinion" src="https://s7844538.sendpul.se/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/linea-vertical-opinion.png" iout_block_33_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; margin:0; display:block; -ms-interpolation-mode:bicubic"><!--[if !mso]><!-->
								                                       <div style="font-size:14px; line-height:1.2; mso-hide:all"><img border="0" width="100%" height="auto" class="mobile  sp-img small_img smallImg " align="right" alt="linea-vertical-opinion" src="https://s7844538.sendpul.se/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/linea-vertical-opinion.png" iout_block_33_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; -ms-interpolation-mode:bicubic; display:none; width:100%; max-width:21px !important"></div>
								                                       <!--<![endif]-->
								                                    </div>
								                                    <div style="font-size:14px; line-height:1.2; clear:both"></div>
								                                 </td>
								                              </tr>
								                           </tbody>
								                        </table>
								                     </td>
								                  </tr>
								               </tbody>
								            </table>
								         </th>
								         <th width="445" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc no-responsive " align="left" valign="top">
								            <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
								               <tbody>
								                  <tr style="border-color:transparent">
								                     <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
								                        <table class="separator" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; font-size:14px; line-height:1.2; padding-left:0; padding-right:0; padding-top:0; padding-bottom:0; height:31px" height="31">
								                           <tbody>
								                              <tr style="border-color:transparent">
								                                 <td height="31" style="border-collapse:collapse; border-color:transparent"></td>
								                              </tr>
								                           </tbody>
								                        </table>
								                     </td>
								                  </tr>
								               </tbody>
								            </table>
								            <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
								               <tbody>
								                  <tr style="border-color:transparent">
								                     <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
								                        <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_24" style="border-collapse:separate; font-size:14px; line-height:1.2; text-color:black; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; color:#333; margin:0; overflow:hidden">
								                           <tbody>
								                              <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
								                                 <td class="content-cell padding-lr-0 padding-top-0 padding-bottom-0" width="430" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:0; padding-right:15px; padding-top:0; padding-bottom:0" valign="top">
								                                    <p style="line-height:1.5; margin:0 0 10px; font-size:inherit; color:#333; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0"><strong><span style="font-size: 18px;">'.$value->__text.'</span></strong></p>
								                                    <div style="font-size:14px; line-height:1.2; clear:both"></div>
								                                 </td>
								                              </tr>
								                           </tbody>
								                        </table>
								                     </td>
								                  </tr>
								               </tbody>
								            </table>
								            <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
								               <tbody>
								                  <tr style="border-color:transparent">
								                     <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
								                        <table class="separator" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; font-size:14px; line-height:1.2; padding-left:0; padding-right:0; padding-top:0; padding-bottom:0; height:31px" height="31">
								                           <tbody>
								                              <tr style="border-color:transparent">
								                                 <td height="31" style="border-collapse:collapse; border-color:transparent"></td>
								                              </tr>
								                           </tbody>
								                        </table>
								                     </td>
								                  </tr>
								               </tbody>
								            </table>
								         </th>
								      </tr>
								   </tbody>
								</table>';
			                }
			                if($value->name == "Cita"){
			                    $content.= '
			                    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
						        	<tr>
						        		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;">
						        			<p style="display:block;
			                                	text-align: left;
			                                	font-weight: 700;
			                                	margin-top: 0px;
			                                	padding: 10px;
			                                	margin-bottom: 5px;font-style: italic;
			                                    color: #4a4663;
			                                    font-size: 12px;line-height: 1.2;">'.$value->__text.'</p>
						        		<td>
						        	<tr>
						        </table>
			                    ';
			                }
			                if($value->name == "SabiasQue"){
			                    $content.= '
			                    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
						        	<tr>
						        		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;">
			                    			<div style="display:block;
			                                	text-align: center;
			                                	margin-top: 0px;
			                                	padding: 25px 10px;
			                                	margin-bottom: 5px;
			                                    color: #fff;
			                                    font-size: 12px;background-color:#2e22b6 "><b style="font-size: 17px;color:#23DCD1">¿SABÍAS QUE?</b><p style="font-style: italic;font-weight: 400;">'.$value->__text.'</p>
			                                </div>
			                            <td>
						        	<tr>
						        </table>
			                    ';
			                }
			                if($value->name == "Text"){
			                    $content.= '
			                    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;font-weight: 400;" border="0" width="100%">
						        	<tr>
						        		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;">
						        			<div>'.$value->__text.'</div>
						        		<td>
						        	<tr>
						        </table>';
			                }
			                if($value->name == "h2" || $value->name == "H2"){
			                    $content.= '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
						        	<tr>
						        		<td style="padding: 10px;padding-left: 20px;padding-right: 20px;">'."<h2 style='margin-bottom: 0px; padding-bottom: 0px;margin-top: 10px; padding-top: 10px;'>$value->__text</h2>".'
						        		<td>
						        	<tr>
						        </table>';
			                }
			                if($value->name == "bullet"){
			                    $content.= '
			                    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
						        	<tr>
						        		<td style="padding-left: 20px;padding-right: 20px;padding-bottom:0px;padding-top:0px;font-weight: 400;">
						        			<ul>
											  <li>'.$value->__text.'</li>
											</ul>
						        		<td>
						        	<tr>
						        </table>';
			                }
			                if($value->name == "Image_Text"){
			                    $content.= '<div style="margin-top: 10px;">
			                    '.'<div style="background-image: url('.$value->remoteContent->href.'); background-repeat: no-repeat; background-size: cover; width: 100%; height: 320px;">
			                    </div>'.(isset($value->component)?getImgParrafo($value->component):"").'
			                    </div>';
			                }
			                if($value->name == "HTML_Text"){
			                    $html = $value->__text;
			                    if (preg_match('/<blockquote class="twitter-tweet">(.*?)<\/blockquote>/is', $html, $matches)) {
			                        $blockquoteContent = $matches[1];
			                    
			                        // Encontrar el último enlace dentro del contenido del bloque
			                        if (preg_match_all('/<a href="(.*?)"/i', $blockquoteContent, $linkMatches)) {
			                            $lastHref = end($linkMatches[1]);
			                            $content.= '<div  style="display:block;width: 100%;text-align: center">
			                            <a style="display:block;width: 100%;text-align: center" target="_blank" href="'.$lastHref.'">
			                                <img width="35%" src="https://ecuavisapdfs.phpdemo.site/uploads/imagen-twitter.png" alt="Imagen de twitter">
			                            </a>
			                            </div>';
			                        } else {
			                            // echo "No se encontraron enlaces dentro del bloque 'twitter-tweet'.";
			                        }
			                    } else {
			                        // echo "No se encontró el bloque 'twitter-tweet'.";
			                        $pattern = '/<blockquote[^>]*class="([^"]*instagram-media[^"]*)"[^>]*data-instgrm-permalink="([^"]*)"[^>]*>/i';
			                        preg_match($pattern, $html, $matches);
			                        if (count($matches) >= 3) {
			                          $class = $matches[1];  // Clase "instagram-media"
			                          $permalink = $matches[2];  // Enlace "data-instgrm-permalink"
			                        
			                          $content.= '<div  style="display:block;width: 100%;text-align: center">
			                                <a style="display:block;width: 100%;text-align: center" target="_blank" href="'.$permalink.'">
			                                    <img width="40%" src="https://ecuavisapdfs.phpdemo.site/uploads/instagram.png" alt="Imagen de instagram">
			                                </a>
			                                </div>';
			                        } else {

			                        }
			                    }
			                    
			                }
			            }
			            $content .= '<table style="padding-left: 17px">
			            <tr>
			            	<td style="background: #141061;padding:12px">
			            		<a style="text-decoration:none; color:#fff; display:block; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-size:16px; font-weight:bold" href="https://www.ecuavisa.com/noticias/?utm_source=SendPulse&utm_medium=SeccionPolitica&utm_campaign=N_CodigoRojas&utm_id=Newsletter">
					            	Ver otras noticias
					            </a>
			            	</td>
			            </tr>
			            </table>';
			            // echo json_encode($datosRecibidos);
			            $content .= '<br>';
			            $content .= getOpinionesBloquesURL($datosRecibidos['data'][4]['notaPrincipalTodosDatos']);
		            	$content .= getUltimaSeccion($datosRecibidos['data'][3]['notasFinal']);
		            ?>
		            <?= $content ?>
		            <table width="500px" align="center" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2;background-color: #060026;padding: 20px;" border="0">
				      <tbody>
				         <tr>
				         	<td style="padding:20px;text-align: center;line-height: inherit;
							    margin: 0 0 10px;
							    font-size: 20px;
							    color: #23dcd1;
							    text-align: center;
							    font-weight: bold;">
				         		<table width="500px" align="center" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2;background-color: #060026;padding: 20px;" border="0">
							      <tbody>
							         <tr>
							         	<td style="padding:20px;text-align: center;line-height: inherit;
										    margin: 0 0 10px;
										    font-size: 20px;
										    color: #23dcd1;
										    text-align: center;
										    font-weight: bold;">
							         		Síguenos en
							         	</td>
							         </tr>
							      </tbody>
							   </table>
				         	</td>
				         </tr>
				      </tbody>
				   </table>
		         </td>
		      </tr>
		   </tbody>
		</table>
		
    </div>
    <pagefooter name="MyFooter1" content-left="{DATE j-m-Y}" content-center="{PAGENO}/{nbpg}" footer-style="font-size: 8pt;" />
    

</body>
</html>

<?php
}
