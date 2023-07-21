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
         <td class="content-cell" width="220" style="border-collapse:collapse; border-color:transparent; vertical-align:top; padding-left:2px; padding-right:2px; padding-top:2px; padding-bottom:2px" valign="top">
            <div id="" style="font-size:14px; line-height:1.5; width:100%; height:165; display:block" width="100%" height="165">
               <a class="link_img" href="<?= $datosRecibidos["link"] ?>" style="text-decoration:none; color:#0089bf; display:block;height: 175px;width: 100%;">
                  <div style="height: 175px;width: 100%;background-image: url('<?= $datosRecibidos["image"] ?>');background-position: center;background-repeat: no-repeat;background-size: cover;">.</div>
               </a>
            </div>
         </td>
      </tr>
   </tbody>

</table>
<?php
}



