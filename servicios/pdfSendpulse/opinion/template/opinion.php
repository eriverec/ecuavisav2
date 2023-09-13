
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    $datosRecibidos = array();
    parse_str($data, $datosRecibidos);
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

    function getImgParrafo($dataImg){
        if(!is_array($dataImg)){
            return "";
        }
        $convertList = $dataImg;
        $cutline = "";
        $byline = "";
        foreach ($convertList as $key => $value) {
            if($value["name"] == "Cutline"){
                $cutline = $value["__text"];
            }
            if($value["name"] == "Byline"){
                $byline = "(".$value['__text'].")";
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

    function getUltimaSeccion($data){
    	$html = '';
    	// $html .= '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;padding-top:20px;display:block" border="0" width="100%"><tbody><tr style="border-color:transparent"><td style="border-collapse:collapse; border-color:transparent; padding-left:0; padding-right:0; padding-top:0; padding-bottom:0; vertical-align:top" border="0" cellpadding="0" cellspacing="0" valign="top"><table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%" border="0" width="100%"><tbody><tr style="border-color:transparent"><th width="500" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc responsive " align="left" valign="top"><table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0"><tbody><tr style="border-color:transparent"><td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top"><table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_48" style="border-collapse:separate; font-size:14px; line-height:1.2; text-color:black; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; margin:0; overflow:hidden"><tbody><tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif"><td class="content-cell" width="470" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:15px; padding-bottom:15px" valign="top"><p style="line-height:1; margin:0 0 10px; font-size:inherit; color:inherit; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0"><span style="color: #000000;"><strong><span style="font-size: 18px;font-style: italic;">También te puede interesar...</span></strong></span></p><div style="font-size:14px; line-height:1.2; clear:both"></div></td></tr></tbody></table></td></tr></tbody></table></th></tr></tbody></table></td></tr></tbody></table>';
    	for ($i=0; $i < count($data) ; $i++) { 
    		$b = $data[$i];

    		$html .= '<table  width="<?= $anchoArchivo ?>" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2;" border="0">
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
			                                             <td class="content-cell" width="220" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-top:15px; padding-bottom:15px" valign="top">
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
			                                             <td class="content-cell" width="220" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-top:15px; padding-bottom:0px" valign="top">
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

    $anchoArchivo = "100%";
?>
<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<title></title>
			<style>
			    @page {
			    	margin-top: 0.5cm;
			    	margin-left: 0.5cm;
			    	margin-right: 0.5cm;
			        size: auto;
			        odd-header-name: MyHeader1;
			        odd-footer-name: MyFooter1;
		/*	        sheet-size: 180mm 370mm;*/
/*					background-color: #eee;*/
			    }
			    .content{
			    	padding-top:0px;
			    }
			    table { 
		            border-collapse:collapse; 
		            line-height:1.2; 
		            border-top-right-radius:0; 
		            border-top-left-radius:0; 
		            border-bottom-left-radius:0; 
		            border-bottom-right-radius:0;
		            width: <?= $anchoArchivo ?>;
/*		            background: red;*/
		            padding: 10px;
		        }
		        table td{
		        	padding-top: 10px;
		        	padding-bottom: 10px;
		        }
			</style>
		</head>
    </div>
    <body>
    	<htmlpageheader name="MyHeader1" class="header" ></htmlpageheader>
    	<table style="background-color: #fff;" width="<?= $anchoArchivo ?>" align="center" border="0" cellpadding="0" cellspacing="0">
    		<tbody>
    			<tr>
    				<td align="center">
    					<a style="text-decoration: none;text-align: center;" href="https://www.ecuavisa.com/?utm_source=SendPulse&utm_medium=bannerHeader&utm_campaign=N_CodigoRojas&utm_id=Newsletter">
    						<img border="0" width="500" height="auto" class="desktop  sp-img " align="center" alt="Ecuavisa.com" src="https://s7844538.sendpul.se/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/portada-carlos-rojas.jpg" iout_block_15_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; display:block; -ms-interpolation-mode:bicubic">
    					</a>
    				</td>
    			</tr>
    		</tbody>
    	</table>

    	<table width="<?= $anchoArchivo ?>" align="center" border="0" cellpadding="0" cellspacing="0">
    		<tbody>
    			<tr>
    				<td align="center">
    					<strong style="color: #444;"><?= $datosRecibidos["fechaFormateada"] ?></strong>
    				</td>
    			</tr>
    		</tbody>
    	</table>

    	<table width="<?= $anchoArchivo ?>" align="center" border="0" cellpadding="0" cellspacing="0">
    		<tbody>
    			<tr>
    				<td>
    					<?php 

		            	$getFristNota = $datosRecibidos['data'][2]['notaPrincipalDefault'];
			            $content = "";
			            for ($i=0; $i < count($datosRecibidos['data'][4]['notaPrincipalTodosDatos']); $i++) { 
			            	$value =  $datosRecibidos['data'][4]['notaPrincipalTodosDatos'][$i];
			            	$value = (object) $value;
			            	if($value->name == "Headline"){
			                    $titulo = $value->__text;
			                    $content .= '
			                    	<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
							        	<tr>
							        		<td style="">
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


			                if($value->name == "Quotecv"){
			                	$content.= '<table align="center" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;line-height:1.2;width:<?= $anchoArchivo ?>;display: block;" border="0" width="<?= $anchoArchivo ?>">
								   <tbody>
								      <tr style="border-color:transparent">
								         <td width="10%" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc no-responsive " align="left" valign="top">
								            <div id="wout_block_33_element_0" style="font-size:14px; line-height:1.2; width:100%; height:168.285714; display:block" width="100%" height="168.285714">
		                                       <img border="0" width="19" height="auto" class="desktop  sp-img small_img smallImg " align="right" alt="linea-vertical-opinion" src="https://s7844538.sendpul.se/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/linea-vertical-opinion.png" iout_block_33_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; margin:0; display:block; -ms-interpolation-mode:bicubic"><!--[if !mso]><!-->
		                                       <!--<![endif]-->
		                                    </div>
								         </td>
								         <td width="80%" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc no-responsive " align="left" valign="top">
								            <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_24" style="border-collapse:separate; font-size:14px; line-height:1.2; text-color:black; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; color:#333; margin:0; overflow:hidden">
					                           <tbody>
					                              <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
					                                 <td class="content-cell padding-lr-0 padding-top-0 padding-bottom-0" width="430" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:0; padding-right:15px; padding-top:0; padding-bottom:0;font-weight:bold" valign="top">
					                                    <p style="line-height:1.5; margin:0 0 10px; font-size:inherit; color:#333; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:bold; padding:0"><span style="font-size: 18px;font-weight:bold">'.$value->__text.'</span></p>
					                                    <div style="font-size:14px; line-height:1.2; clear:both"></div>
					                                 </td>
					                              </tr>
					                           </tbody>
					                        </table>
								         </td>
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
						        		<td style="">
						        			<div>'.$value->__text.'</div>
						        		<td>
						        	<tr>
						        </table>';
			                }

			                if($value->name == "h2" || $value->name == "H2"){
			                    $content.= '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
						        	<tr>
						        		<td style="">
						        			'."<h2 style='margin-bottom: 0px; padding-bottom: 0px;margin-top: 10px; padding-top: 10px;'>$value->__text</h2>".'
						        		<td>
						        	<tr>
						        </table>';
			                }

			                if($value->name == "bullet"){
			                    $content.= '
			                    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.2; width:100%;font-family: Lucida Grande,Lucida Sans Unicode,Lucida Sans,Geneva,Verdana,sans-serif;" border="0" width="100%">
						        	<tr>
						        		<td style="padding-bottom:0px;padding-top:0px;font-weight: 400;">
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
			            }
			            // echo json_encode($datosRecibidos);
		            ?>
		            <?= $content ?>
    				</td>
    			</tr>
    		</tbody>
    	</table>

    	<table width="<?= $anchoArchivo ?>" align="center" border="0" cellpadding="0" cellspacing="0" >
    		<tbody>
    			<tr>
    				<td>
    					<table style="padding:12px" align="center" border="0" cellpadding="0" cellspacing="0">
				    		<tbody>
				    			<tr>
				    				<td align="center" style="background: #141061;width: 45%;padding-left: 10px;padding-right: 10px;">
				    					<a style="text-decoration:none; color:#fff; display:block; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-size:16px; font-weight:bold;text-align: center;" href="https://www.ecuavisa.com/noticias/?utm_source=SendPulse&utm_medium=SeccionPolitica&utm_campaign=N_CodigoRojas&utm_id=Newsletter">
							            	Ver otras noticias
							            </a>
				    				</td>
				    				<td></td>
				    			</tr>
				    		</tbody>
				    	</table>
    				</td>
    			</tr>
    		</tbody>
    	</table>

    	<table width="<?= $anchoArchivo ?>" align="center" border="0" cellpadding="0" cellspacing="0">
    		<tbody>
    			<tr>
    				<td>
    					<table width="100%" align="center" border="0" cellpadding="0" cellspacing="0">
				    		<tbody>
				    			<tr>
				    				<td>
				    					<?= getOpinionesBloquesURL($datosRecibidos['data'][4]['notaPrincipalTodosDatos']) ?>
				    					
				    				</td>
				    			</tr>
				    		</tbody>
				    	</table>
    				</td>
    			</tr>
    		</tbody>
    	</table>

    	<table width="<?= $anchoArchivo ?>" align="center" border="0" cellpadding="0" cellspacing="0">
    		<tbody>
    			<tr>
    				<td>
    					<p style="line-height:1; margin:0 0 10px; font-size:inherit; color:inherit; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0"><span style="color: #000000;"><strong><span style="font-size: 18px;font-style: italic;">También te puede interesar...</span></strong></span></p>
    				</td>
    			</tr>
    		</tbody>
    	</table>

    	<table width="<?= $anchoArchivo ?>" align="center" border="0" cellpadding="0" cellspacing="0">
    		<tbody>
    			<tr>
    				<td>
    					<?= getUltimaSeccion($datosRecibidos['data'][3]['notasFinal']) ?>
    				</td>
    			</tr>
    		</tbody>
    	</table>

    	<div>
    		<table width="<?= $anchoArchivo ?>" style="background-color: #060026;" align="center" border="0" cellpadding="0" cellspacing="0">
	    		<tbody>
	    			<tr>
	    				<td align="center" style="padding-top: 50px;">
	    					<p style="line-height:inherit; margin:0 0 10px; font-size:inherit; color:#23dcd1; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; text-align:center; font-weight:normal; padding:0" align="center"><span style="font-size: 20px;"><b>Síguenos en</b></span></p>
	    				</td>
	    			</tr>
	    		</tbody>
	    	</table>
	    	<table width="<?= $anchoArchivo ?>" style="background-color: #060026;" align="center" border="0" cellpadding="0" cellspacing="0">
	    		<tbody>
	    			<tr>
	    				<td align="center">
	    					<table width="200px" class="social" cellpadding="0" border="0" style="border-collapse:collapse; font-size:14px; line-height:1; border-color:transparent; border-width:0; border-style:none; border:0 none transparent; display:inline-block; border-spacing:0;width: 80%;">
							   <tbody>
							      <tr style="border-color:transparent">
							         <td align="center" class="social_element social_element_h_i" style="border-color:transparent; padding:2px 5px; font-size:13px; font-family:Arial, sans-serif; line-height:32px; font-weight:400; border-width:0; border-style:none; border:0 none transparent">
							         	<a href="https://www.facebook.com/ecuavisa/" target="blank" style="text-decoration:none; color:#0089bf"> <img style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0 none transparent; display:block; margin:5px" src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2F001-facebook%201.png" alt="" height="auto"> </a>
							         </td>
							         <td class="social_element social_element_h_i" style="border-color:transparent; padding:2px 5px; font-size:13px; font-family:Arial, sans-serif; line-height:32px; font-weight:400; border-width:0; border-style:none; border:0 none transparent">
							         	<a href="https://twitter.com/ecuavisa" target="blank" style="text-decoration:none; color:#0089bf"> <img style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0 none transparent; display:block; margin:5px" src="https://s7844538.sendpul.se/image/747991a0e145ac2bbe69f063a9402e69/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/icon-x.png" alt="twitter" height="auto"> </a>
							         </td>
							         <td class="social_element social_element_h_i" style="border-color:transparent; padding:2px 5px; font-size:13px; font-family:Arial, sans-serif; line-height:32px; font-weight:400; border-width:0; border-style:none; border:0 none transparent">
							         	<a href="https://www.instagram.com/ecuavisatv/" target="blank" style="text-decoration:none; color:#0089bf"> <img style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0 none transparent; display:block; margin:5px" src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2F005-instagram%201.png" alt="" height="auto"> </a>
							         </td>
							         <td class="social_element social_element_h_i" style="border-color:transparent; padding:2px 5px; font-size:13px; font-family:Arial, sans-serif; line-height:32px; font-weight:400; border-width:0; border-style:none; border:0 none transparent">
							         	<a href="https://www.youtube.com/user/ecuavisatube" style="text-decoration:none; color:#0089bf"> <img style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0 none transparent; display:block; margin:5px" src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2F004-youtube%201.png" alt="" height="auto"> </a>
							         </td>
							         <td class="social_element social_element_h_i" style="border-color:transparent; padding:2px 5px; font-size:13px; font-family:Arial, sans-serif; line-height:32px; font-weight:400; border-width:0; border-style:none; border:0 none transparent">
							         	<a href="https://www.tiktok.com/@ecuavisaec" style="text-decoration:none; color:#0089bf"> <img style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0 none transparent; display:block; margin:5px" src="https://s7844538.sendpul.se/image/747991a0e145ac2bbe69f063a9402e69/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/Group_1.png" alt="" height="auto"> </a>
							         </td>
							         <td class="social_element social_element_h_i" style="border-color:transparent; padding:2px 5px; font-size:13px; font-family:Arial, sans-serif; line-height:32px; font-weight:400; border-width:0; border-style:none; border:0 none transparent">
							         	<a href="https://www.threads.net/@ecuavisatv" style="text-decoration:none; color:#0089bf"> <img style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0 none transparent; display:block; margin:5px" src="https://s7844538.sendpul.se/image/747991a0e145ac2bbe69f063a9402e69/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/Group_2.png" alt="" height="auto"> </a>
							         </td>
							      </tr>
							   </tbody>
							 </table>
	    				</td>
	    			</tr>
	    		</tbody>
	    	</table>
	    	<table width="<?= $anchoArchivo ?>" style="background-color: #060026;" align="center" border="0" cellpadding="0" cellspacing="0">
	    		<tbody>
	    			<tr>
	    				<td align="center">
	    					<table width="300px" class="social" cellpadding="0" border="0" style="border-collapse:collapse; font-size:14px; line-height:1; border-color:transparent; border-width:0; border-style:none; border:0 none transparent; display:inline-block; border-spacing:0;width: 80%;">
							   <tbody>
							      <tr style="border-bottom:1px solid #23dcd1;">
							         <td align="center" style="border-bottom:1px solid #23dcd1;padding-top: 5px;padding-bottom: 5px;height: 5px;">
							         	a
							         </td>
							      </tr>
							   </tbody>
							 </table>
	    				</td>
	    			</tr>
	    		</tbody>
	    	</table>
	    	<table width="<?= $anchoArchivo ?>" style="background-color: #060026;" align="center" border="0" cellpadding="0" cellspacing="0">
	    		<tbody>
	    			<tr>
	    				<td align="center">
	    					<table width="300px" class="social" cellpadding="0" border="0" style="border-collapse:collapse; font-size:14px; line-height:1; border-color:transparent; border-width:0; border-style:none; border:0 none transparent; display:inline-block; border-spacing:0;width: 80%;">
							   <tbody>
							      <tr>
							         <td align="center" style="padding-top: 5px;padding-bottom: 5px;height: 5px;">
							         	<a class="link_img" href="https://www.ecuavisa.com/" style="text-decoration:none; color:#0089bf; display:block"><center><img border="0" width="43" height="auto" class="desktop  sp-img small_img smallImg " align="center" alt="Logo Ecuavisa.com" src="https://s7844538.sendpul.se/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/loeqweqwgo.png" iout_block_19_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; display:block; -ms-interpolation-mode:bicubic"><!--[if !mso]><!--><div style="font-size:14px; line-height:1.2; mso-hide:all"><img border="0" width="100%" height="auto" class="mobile  sp-img small_img smallImg " align="center" alt="Logo Ecuavisa.com" src="https://s7844538.sendpul.se/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/loeqweqwgo.png" iout_block_19_element_0="" style="height:auto; line-height:100%; outline:0; text-decoration:none; border:0; -ms-interpolation-mode:bicubic; display:none; width:100%; max-width:43px !important"></div><!--<![endif]--></center></a>
							         </td>
							      </tr>
							   </tbody>
							 </table>
	    				</td>
	    			</tr>
	    		</tbody>
	    	</table>
	    	<table width="<?= $anchoArchivo ?>" style="background-color: #060026;" align="center" border="0" cellpadding="0" cellspacing="0">
	    		<tbody>
	    			<tr>
	    				<td align="center">
	    					<table width="300px" class="social" cellpadding="0" border="0" style="border-collapse:collapse; font-size:14px; line-height:1; border-color:transparent; border-width:0; border-style:none; border:0 none transparent; display:inline-block; border-spacing:0;width: 80%;">
							   <tbody>
							      <tr>
							         <td align="center" style="padding-top: 5px;padding-bottom: 5px;height: 5px;">
							         	<p style="line-height:1; margin:0 0 10px; font-size:inherit; color:#23dcd1; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; text-align:center; font-weight:normal; padding:0" align="center"><span style="font-size: 16px;"><strong>©Copyright</strong></span></p>
							         	<p style="line-height:1; margin:0 0 10px; font-size:inherit; color:#23dcd1; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; text-align:center; font-weight:normal; padding:0" align="center"><span style="font-size: 16px;"><strong>Todos los derechos reservados</strong></span></p>
							         </td>
							      </tr>
							   </tbody>
							 </table>
	    				</td>
	    			</tr>
	    		</tbody>
	    	</table>

	    	<table width="<?= $anchoArchivo ?>" style="background-color: #060026;" align="center" border="0" cellpadding="0" cellspacing="0">
	    		<tbody>
	    			<tr>
	    				<td align="center">
	    					<table width="300px" class="social" cellpadding="0" border="0" style="border-collapse:collapse; font-size:14px; line-height:1; border-color:transparent; border-width:0; border-style:none; border:0 none transparent; display:inline-block; border-spacing:0;width: 80%;">
							   <tbody>
							      <tr style="border-bottom:1px solid #23dcd1;">
							         <td align="center" style="border-bottom:1px solid #23dcd1;padding-top: 5px;padding-bottom: 5px;height: 5px;">
							         	a
							         </td>
							      </tr>
							   </tbody>
							 </table>
	    				</td>
	    			</tr>
	    		</tbody>
	    	</table>
	    	<table width="<?= $anchoArchivo ?>" style="background-color: #060026;" align="center" border="0" cellpadding="0" cellspacing="0">
	    		<tbody>
	    			<tr>
	    				<td align="center">
	    					<table width="300px" class="social" cellpadding="0" border="0" style="border-collapse:collapse; font-size:14px; line-height:1; border-color:transparent; border-width:0; border-style:none; border:0 none transparent; display:inline-block; border-spacing:0;width: 80%;">
							   <tbody>
							      <tr style="">
							         <td align="center" style="padding-top: 5px;padding-bottom: 5px;height: 5px;">
							         	<p style="line-height:inherit; margin:0 0 10px; font-size:inherit; color:#fff; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; text-align:center; font-weight:normal; padding:0" align="center"><strong><span style="font-size: 16px;">Cumplimos con lo establecido en la</span></strong><br><strong><span style="font-size: 16px;">Ley Orgánica de Protección de</span></strong><br><strong><span style="font-size: 16px;">Datos de Ecuador</span></strong></p>
							         </td>
							      </tr>
							   </tbody>
							 </table>
	    				</td>
	    			</tr>
	    		</tbody>
	    	</table>
	    	<table width="<?= $anchoArchivo ?>" style="background-color: #060026;" align="center" border="0" cellpadding="0" cellspacing="0">
	    		<tbody>
	    			<tr>
	    				<td>
	    					
	    				</td>
	    			</tr>
	    		</tbody>
	    	</table>
    	</div>
	</body>
</html>

<?php
}
