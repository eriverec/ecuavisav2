<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    $datosRecibidos = array();
    parse_str($data, $datosRecibidos);
    // Trabaja con los datos recibidos
    // Por ejemplo, para acceder al nombre: $nombre = $datosRecibidos['nombre'];
    //echo json_encode($data);
?>

<table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
   <tbody>
      <tr style="border-color:transparent">
         <td cellpadding="0" cellspacing="0" style="background-color: white;background: white;border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
            <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_23_element_0" style="border-collapse:separate; font-size:14px; line-height:1.5; overflow:hidden">
               <tbody>
                  <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
                     <td class="content-cell padding-lr-0 padding-top-0" width="500" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:0; padding-right:0; padding-top:0; padding-bottom:15px" valign="top">
                        <div id="wout_block_23_element_0" style="font-size:14px; line-height:1.5; width:100%; height:auto; display:block; text-align:center" width="100%" height="375" align="center">
                           <a class="link_img" href="<?= $datosRecibidos["link"] ?>" style="text-decoration:none; color:#0089bf; display:block">
                              
                              <center>
                                 <img border="0" width="100%" height="250" class="desktop  sp-img " align="center" alt="<?= $datosRecibidos["titulo"] ?>" src="<?= $datosRecibidos["image"] ?>" iout_block_23_element_0="" style="line-height:100%; outline:0; text-decoration:none; border:0; display:block; -ms-interpolation-mode:bicubic"><!--[if !mso]><!-->
                                 <div style="font-size:14px; line-height:1.5; mso-hide:all">
                                    <img border="0" width="100%" height="250" class="mobile  sp-img " align="center" alt="<?= $datosRecibidos["titulo"] ?>" src="<?= $datosRecibidos["image"] ?>" iout_block_23_element_0="" style="height: 225px;object-fit: cover; line-height:100%; outline:0; text-decoration:none; border:0; -ms-interpolation-mode:bicubic; display:none; width:100%; max-width:100% !important">
                                 </div>
                                 <!--<![endif]-->
                              </center>
                           </a>
                        </div>
                        <div style="font-size:14px; line-height:1.5; clear:both"></div>
                     </td>
                  </tr>
               </tbody>
            </table>
         </td>
      </tr>
   </tbody>
</table>
<table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
   <tbody>
      <tr style="border-color:transparent">
         <td cellpadding="0" cellspacing="0" style="background-color: white;background: white;border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
            <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_24" style="border-collapse:separate; font-size:14px; line-height:1.5; text-color:black; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; color:#2927b9; margin:0; overflow:hidden">
               <tbody>
                  <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
                     <td class="content-cell padding-bottom-0" width="470" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:0px; padding-right:0px; padding-top:15px; padding-bottom:0" valign="top">
                        <p style="line-height:inherit; margin:0 0 10px; font-size:inherit; color:#2927b9; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0"><strong><a style="text-decoration:none; color:<?= $datosRecibidos["color"][0] ?>" href="<?= $datosRecibidos["subseccion"]["link"] ?>"><?= $datosRecibidos["subseccion"]["titulo"] ?></a></strong></p>
                        <div style="font-size:14px; line-height:1.5; clear:both"></div>
                     </td>
                  </tr>
               </tbody>
            </table>
         </td>
      </tr>
   </tbody>
</table>
<table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
   <tbody>
      <tr style="border-color:transparent">
         <td cellpadding="0" cellspacing="0" style="background-color: white;background: white;border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
            <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_25" style="border-collapse:separate; font-size:14px; line-height:1.5; text-color:black; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; color:#000; margin:0; overflow:hidden">
               <tbody>
                  <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
                     <td class="content-cell padding-top-0 padding-bottom-0" width="470" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:0px; padding-right:0px; padding-top:0; padding-bottom:0" valign="top">
                        <p style="line-height:inherit; margin:0 0 10px; font-size:inherit; color:#000; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0"><strong><span style="font-size: 24px;"><a style="text-decoration:none; color:#060127;line-height: 1.2;" href="<?= $datosRecibidos["link"]  ?>"><?= $datosRecibidos["titulo"]  ?></a></span></strong></p>
                        <div style="font-size:14px; line-height:1.5; clear:both"></div>
                     </td>
                  </tr>
               </tbody>
            </table>
         </td>
      </tr>
   </tbody>
</table>
<table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
   <tbody>
      <tr style="border-color:transparent">
         <td cellpadding="0" cellspacing="0" style="background-color: white;background: white;border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
            <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_26" style="border-collapse:separate; font-size:14px; line-height:1.5; text-color:black; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; color:#060127; margin:0; overflow:hidden">
               <tbody>
                  <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
                     <td class="content-cell" width="470" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:0px; padding-right:0px; padding-top:0px; padding-bottom:15px" valign="top">
                        <p style="line-height:inherit; margin:0 0 10px; font-size:inherit; color:#060127; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0"><span style="font-size: 14px;"><?= $datosRecibidos["descripcion"] ?></span></p>
                        <div style="font-size:14px; line-height:1.5; clear:both"></div>
                     </td>
                  </tr>
               </tbody>
            </table>
         </td>
      </tr>
   </tbody>
</table>
<table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
   <tbody>
      <tr style="border-color:transparent">
         <td cellpadding="0" cellspacing="0" style="background-color: white;background: white;border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; font-size:14px; line-height:1.5; overflow:hidden">
               <tbody>
                  <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
                     <td class="content-cell padding-top-0" width="570" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:0px; padding-right:0px; padding-top:0; padding-bottom:15px" valign="top">
                        <table cellpadding="0" border="0" cellspacing="0" align="left" class="sp-button flat auto-width" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-color:#ddd; border-width:1px; border-style:solid; border:0; width:auto !important; border-radius:5px; box-shadow:none; background:#141061" width="auto !important">
                           <tbody>
                              <tr style="border-color:transparent">
                                 <td class="sp-button-text" style="border-collapse:collapse; border-color:transparent; padding:0; border-width:0; border-style:none; border:0; align:left; border-radius:5px; width:auto; height:40px; vertical-align:middle; text-align:center" width="auto" height="40" valign="middle" align="center">
                                    <table cellpadding="0" border="0" cellspacing="0" width="100%" style="border-collapse:collapse; font-size:14px; line-height:1.5; border:0">
                                       <tbody>
                                          <tr style="border-color:transparent">
                                             <td align="center" style="border-collapse:collapse; border-color:transparent; padding:0; border:0; line-height:1"><a style="text-decoration:none; color:#FFF; display:block; padding:12px 18px; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-size:16px; font-weight:bold" href="<?= $datosRecibidos["link"] ?>">Seguir leyendo</a></td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                        <div style="font-size:14px; line-height:1.5; clear:both"></div>
                     </td>
                  </tr>
               </tbody>
            </table>
         </td>
      </tr>
   </tbody>
</table>
<table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0;">
   <tbody>
      <tr style="border-color:transparent">
         <td cellpadding="0" cellspacing="0" style="background-color: white;background: white;border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
            <div class="block-divider" style="font-size:14px; line-height:1.5; padding-left:0px; padding-right:0px; padding-top:10px; padding-bottom:10px">
               <hr id="iout_block_13_element_0" style="margin:0; border-top-style:solid; border-top-width:1px; border-top-color:#2927b9; border-bottom:0; border-left:0; border-right:0">
            </div>
         </td>
      </tr>
   </tbody>
</table>

<?php
}



