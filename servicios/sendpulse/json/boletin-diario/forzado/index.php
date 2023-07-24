<?php 
  // Ruta al archivo JSON
  $rutaArchivo = './../../boletines.json';
  // Leer el contenido del archivo JSON
  $contenidoJSON = file_get_contents($rutaArchivo);
  // Decodificar el contenido JSON en un array asociativo
  $datos = json_decode($contenidoJSON, true);

?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title></title>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>
<body>
	<main role="main">

  <section class="jumbotron text-center">
    <div class="container">
      <h1 class="jumbotron-heading">¿Cómo cambiar el subject?</h1>
      <p class="lead text-muted">Buscar el nombre del boletín que desea ser cambiado luego de clic en el botón de guardado ingresando la clave.</p>
    </div>
  </section>
  <div class="album py-5">
    <div class="container">
      <div class="row" id="contenedor">
        <?php foreach ($datos as $key => $value): ?>
          <div class="col-md-4">
            <div class="card">
              <div class="card-header">
                <?=$value["nombre"]?>
              </div>
              <div class="card-body">
                <form data-id="boletindiario-<?=$value["id"]?>" class="miFormulario">
                  <input type="hidden" name="id" value="<?=$value["id"]?>">
                  <input type="hidden" name="action" value="edit">
                  <div class="form-group">
                    <label for="pass-<?=$value["id"]?>">Debes escribir la contraseña de seguridad</label>
                    <input required name="pass" type="password" class="form-control" id="pass-<?=$value["id"]?>" aria-describedby="passHelp" placeholder="Contraseña de seguridad">
                    <small id="passHelp-<?=$value["id"]?>" class="form-text text-muted">Se debe ingresar la contraseña de seguridad para que el cambio se haga correctamente</small>
                  </div>
                  <div class="form-group">
                    <label for="subject">Escribir el subject</label>
                    <input required name="subject" type="text" maxlength="100" class="form-control" id="subject-<?=$value["id"]?>" placeholder="Ingrese el Subject para este correo" value="<?=$value["subject"]?>">
                    <small id="subject-<?=$value["id"]?>" class="form-text text-muted">Añade esto para que la fecha sea dinámica <b>{{fecha}}</b></small>
                  </div>
                  <button type="submit" class="btn btn-primary">Guardar subject</button>
                  <div class="alert alert-success mt-2 d-none" data-id="alert" role="alert">
                    A simple success alert—check it out!
                  </div>
                </form>
              </div>
            </div>
          </div>
        <?php endforeach ?>
      </div>
    </div>
  </div>

</main>

<footer class="text-muted">
  <div class="container" style="display:flex;align-items: center;justify-content: space-between;;">
    <p>Cambiar el nombre de subject en los newsletter de ecuavisa.com</p>
    <p>Ir a <a href="https://www.ecuavisa.com/" target="_blank">Ecuavisa</a>.</p>
  </div>
</footer>
	<script src="https://code.jquery.com/jquery-3.7.0.min.js" integrity="sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g=" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  <script type="text/javascript">
    $(function(){
      $("#contenedor").on("submit", ".miFormulario", function(event) {
        // Prevenir el comportamiento predeterminado del formulario (envío normal)
        event.preventDefault();
        // Obtener el formulario que se envió
        var formulario = $(this);
        // Obtener los datos del formulario utilizando .serialize()
        var formData = formulario.serialize();
        // Acceder al valor de los campos del formulario
        var nombre = formulario.find('input[name="subject"]').val();

        var btn = formulario.find('button[type="submit"]');

        btn.addClass("disabled");
        $.ajax({
            // la URL para la petición
            url : './ajax.php',
            // la información a enviar
            // (también es posible utilizar una cadena de datos)
            data : formData,
            // especifica si será una petición POST o GET
            type : 'POST',
            // el tipo de información que se espera de respuesta
            dataType : 'json',
            // código a ejecutar si la petición es satisfactoria;
            // la respuesta es pasada como argumento a la función
            success : function(json) {
                formulario.find('div[data-id="alert"]').removeClass("d-none");
                formulario.find('div[data-id="alert"]').removeClass("alert-success");
                formulario.find('div[data-id="alert"]').removeClass("alert-danger");
                if(json){
                  formulario.find('div[data-id="alert"]').addClass("alert-success");
                  formulario.find('div[data-id="alert"]').html("Dato guardado con éxito!!");
                }else{
                  formulario.find('div[data-id="alert"]').addClass("alert-danger");
                  formulario.find('div[data-id="alert"]').html("Al parecer la contraseña no es la correcta");
                }
                setTimeout(function(){
                    formulario.find('div[data-id="alert"]').addClass("d-none");
                }, 2000);
            },
         
            // código a ejecutar si la petición falla;
            // son pasados como argumentos a la función
            // el objeto jqXHR (extensión de XMLHttpRequest), un texto con el estatus
            // de la petición y un texto con la descripción del error que haya dado el servidor
            error : function(jqXHR, status, error) {
              alert('Disculpe, existió un problema');
            },
         
            // código a ejecutar sin importar si la petición falló o no
            complete : function(jqXHR, status) {
              btn.removeClass("disabled");
                // alert('Petición realizada');
            }
        });
      });
    })
  </script>

</body>
</html>