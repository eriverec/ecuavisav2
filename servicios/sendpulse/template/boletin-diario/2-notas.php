<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    $datosRecibidos_1 = array();
    parse_str($data, $datosRecibidos_1);
    // Trabaja con los datos recibidos
    // Por ejemplo, para acceder al nombre: $nombre = $datosRecibidos['nombre'];
    //echo json_encode($data);
?>

<table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; width:100%" border="0" width="100%">
   <tbody>
      <tr style="border-color:transparent">
         <td style="border-collapse:collapse; border-color:transparent; padding-left:0; padding-right:0; padding-top:0; padding-bottom:0; vertical-align:top" border="0" cellpadding="0" cellspacing="0" valign="top">
            <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; width:100%" border="0" width="100%">
               <tbody>
                  <tr style="border-color:transparent">
                     <?php foreach ($datosRecibidos_1 as $key => $datosRecibidos) {  ?>
                        <th width="250" style="border-color:transparent; font-weight:400; text-align:left; vertical-align:top" cellpadding="0" cellspacing="0" class="tc no-responsive " align="left" valign="top">
                           <table border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px; line-height:1.5; border-top-right-radius:0; border-top-left-radius:0; border-bottom-left-radius:0; border-bottom-right-radius:0">
                              <tbody>
                                 <tr style="border-color:transparent">
                                    <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
                                       <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_31_element_0" style="border-collapse:separate; font-size:14px; line-height:1.5; overflow:hidden">
                                          <tbody>
                                             <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
                                                <td class="content-cell" width="220" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:15px; padding-bottom:15px" valign="top">
                                                   <div id="wout_block_31_element_0" style="font-size:14px; line-height:1.5; width:100%; height:165; display:block" width="100%" height="165">
                                                      <a class="link_img" href="<?= $datosRecibidos["link"] ?>" style="text-decoration:none; color:#0089bf; display:block">
                                                         <div style="height: 175px;width: 100%;background-image: url('<?= $datosRecibidos["image"] ?>');background-position: center;background-repeat: no-repeat;background-size: cover;"></div>
                                                      </a>
                                                   </div>
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
                                    <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
                                       <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_24" style="border-collapse:separate; font-size:14px; line-height:1.5; text-color:black; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; color:#2927b9; margin:0; overflow:hidden">
                                          <tbody>
                                             <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
                                                <td class="content-cell padding-bottom-0" width="220" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:15px; padding-bottom:0" valign="top">
                                                   <p style="line-height:inherit; margin:0 0 10px; font-size:inherit; color:#2927b9; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0"><strong><a style="text-decoration:none; color:#2927b9" href="<?= $datosRecibidos["subseccion"]["link"] ?>"><?= $datosRecibidos["subseccion"]["titulo"] ?></a></strong></p>
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
                                    <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
                                       <table width="100%" cellpadding="0" cellspacing="0" id="wout_block_out_block_25" style="border-collapse:separate; font-size:14px; line-height:1.5; text-color:black; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-family-short:lucida; font-weight:normal; color:#000; margin:0; overflow:hidden">
                                          <tbody>
                                             <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
                                                <td class="content-cell padding-top-0 padding-bottom-0" width="220" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:0; padding-bottom:0" valign="top">
                                                   <p style="line-height:inherit; margin:0 0 10px; font-size:inherit; color:#000; font-family:&quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif; font-weight:normal; padding:0"><span style="font-size: 14px;"><strong><a style="text-decoration:none; color:#060127" href="<?= $datosRecibidos["link"] ?>"><?= $datosRecibidos["titulo"] ?></a></strong></span></p>
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
                                    <td cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
                                       <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; font-size:14px; line-height:1.5; overflow:hidden">
                                          <tbody>
                                             <tr class="content-row" style="border-color:transparent; color:#444; font-family:&quot;Segoe UI&quot;, Segoe, &quot;Avenir Next&quot;, &quot;Open Sans&quot;, Corbel, sans-serif">
                                                <td class="content-cell padding-top-0" width="270" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:15px; padding-right:15px; padding-top:0; padding-bottom:15px" valign="top">
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
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </th>
                     <?php } ?>
                  </tr>
               </tbody>
            </table>
         </td>
      </tr>
   </tbody>
</table>

<?php
}



