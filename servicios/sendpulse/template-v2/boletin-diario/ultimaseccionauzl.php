<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    $datosRecibidos = array();
    parse_str($data, $datosRecibidos);
    // Trabaja con los datos recibidos
    // Por ejemplo, para acceder al nombre: $nombre = $datosRecibidos['nombre'];
    //echo json_encode($data);
?>

<table width="100%" cellpadding="0" cellspacing="0" id="" style="border-collapse:separate; font-size:14px; line-height:1.5; overflow:hidden">
   <tbody>
      <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
         <td class="content-cell" width="220" style="background-color: white;background: white;border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:2px; padding-right:2px; padding-top:2px; padding-bottom:2px" valign="top">
            <div id="" style="font-size:14px; line-height:1.5; width:100%; height:auto; display:block;" width="100%" height="165">
               <a class="link_img" href="<?= $datosRecibidos["link"] ?>" style="text-decoration:none; color:#0089bf; display:block;height: auto;width: 100%;padding-left: 0px;padding-right: 0px;">
                  <center>
                     <img border="0" width="100%" height="auto" class="desktop  sp-img " align="center" alt="<?= $datosRecibidos["titulo"] ?>" src="<?= $datosRecibidos["image"] ?>" iout_block_23_element_0="" style="line-height:100%; outline:0; text-decoration:none; border:0; display:block; -ms-interpolation-mode:bicubic"><!--[if !mso]><!-->
                     <div style="font-size:14px; line-height:1.5; mso-hide:all">
                        <img border="0" width="100%" height="auto" class="mobile  sp-img " align="center" alt="<?= $datosRecibidos["titulo"] ?>" src="<?= $datosRecibidos["image"] ?>" iout_block_23_element_0="" style=" line-height:100%; outline:0; text-decoration:none; border:0; -ms-interpolation-mode:bicubic; display:none; width:100%; max-width:100% !important">
                     </div>
                     <!--<![endif]-->
                  </center>
               </a>
            </div>
         </td>
      </tr>
   </tbody>

</table>
<?php
}



