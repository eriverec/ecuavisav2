<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subir Archivos</title>
</head>
<body>
    <h2>Subir Archivos</h2>
    <form action="./upload.php" method="POST" enctype="multipart/form-data">
    	<input type="hidden" name="token" value="IDmR8FmTVHuO7j6IruVuKhR+Vp/mz+tDUnDfb7TkgOWtxmaNf6QjvMJu6YZasopt">
    	<input type="hidden" name="idUser" value="223433">
        <input type="file" name="files[]" required multiple>
        <button type="submit" name="submit">Subir Archivos</button>
    </form>
</body>
</html>