# Documentación del controlador `LogToFile.php`

## Estructura base del registro

Cada registro gestionado por el controlador debe tener la siguiente estructura base:

```json
{
    "ip": "::1",
    "user_agent": "Mozilla/5.0 ...",
    "action": "create_campaign",
    "datetime": "2025-08-11 16:27:04",
    "file": "boletin-diario.json",
    "campaign": "Newsletter 7AM",
    "campaign_title": "Ecuavisa Informa 7AM 2025-08-11, 16:26:59",
    "description": "Error al crear campaña ...",
    "send_method": "Forzado",
    "type": "error"
}
```

### Valores posibles para los campos principales

- **type:**
  - `error`
  - `success`
- **action:**
  - `create_campaign`
  - `send_email`
  - `view_campaign`
- **send_method:**
  - `manual`
  - `Forzado`
  - `automático`

---

## Clase `LogToFile`

Ubicación: `app/controllers/LogToFile.php`

### Métodos principales

#### `add(array $registro)`

Agrega un registro al archivo JSON correspondiente. Si el archivo supera los 10 MB, se limpia y se inicia con el nuevo registro. Además, si el registro es un error de tipo `create_campaign`, se dispara el envío de un email de notificación y se registra un nuevo evento de tipo `success` con acción `send_email`.

**Parámetro:**
- `$registro` (array): Debe contener al menos la clave `file` (nombre del archivo JSON destino) y el resto de la estructura base.

**Funcionamiento:**
1. Verifica que exista la clave `file`.
2. Si el archivo no existe, lo crea como un array vacío.
3. Si el archivo supera los 10 MB, lo limpia y escribe solo el nuevo registro, además de enviar un email de notificación si corresponde.
4. Si el archivo está dentro del tamaño permitido, agrega el nuevo registro al final del array y guarda el archivo.
5. Si el registro es un error de tipo `create_campaign`, llama internamente a `envioEmailNuevoRegistro()` para gestionar el email y el registro de tipo `success`.

**Ejemplo de uso:**
```php
$log = new LogToFile();
$log->add([
    "ip" => "::1",
    "user_agent" => "Mozilla/5.0 ...",
    "action" => "create_campaign",
    "datetime" => "2025-08-11 16:27:04",
    "file" => "boletin-diario.json",
    "campaign" => "Newsletter 7AM",
    "campaign_title" => "Ecuavisa Informa 7AM 2025-08-11, 16:26:59",
    "description" => "Error al crear campaña ...",
    "send_method" => "Forzado",
    "type" => "error"
]);
```

#### `listar(int $page = 1, int $limit = 10, ?string $fechai = null, ?string $fechaf = null, ?string $newsletter = null, ?string $search = null)`

Lista los registros almacenados, permitiendo paginación, filtrado por fecha, newsletter y búsqueda por coincidencias en los campos `campaign`, `campaign_title`, `type` y `action`.

**Parámetros:**
- `$page` (int): Página de resultados (por defecto 1).
- `$limit` (int): Cantidad de registros por página (por defecto 10).
- `$fechai` (string|null): Fecha inicial de filtro (formato `Y-m-d`).
- `$fechaf` (string|null): Fecha final de filtro (formato `Y-m-d`).
- `$newsletter` (string|null): Nombre del archivo JSON a consultar. Si es null, busca en todos los archivos.
- `$search` (string|null): Texto a buscar en los campos principales.

**Funcionamiento:**
1. Si se especifica un newsletter, solo consulta ese archivo; si no, consulta todos.
2. Aplica filtros de búsqueda y de fecha si se proporcionan.
3. Ordena los resultados por fecha descendente.
4. Devuelve la página solicitada con el límite indicado.

**Ejemplo de uso:**
```php
$log = new LogToFile();
$resultados = $log->listar(1, 10, "2025-08-01", "2025-08-11", "boletin-diario.json", "error");
```

---

## Notas adicionales

- El controlador crea el directorio `/json` automáticamente si no existe.
- El método `add` puede disparar el envío de un email automático si se detecta un error en la creación de campañas.
- Los archivos de log tienen un tamaño máximo de 10 MB; al superar este límite, se reinician automáticamente.

---

