# Girag_GLPI_MobileForms — app PWA para GLPI + Formcreator

Prototipo funcional de una app web instalable (PWA) que muestra los formularios
de Formcreator de GLPI y permite enviarlos como tickets, sin usar el navegador
completo (ícono propio, pantalla completa, funciona en Android y iOS).

## Cómo probarlo ya mismo (sin servidor)

1. Abre `index.html` en el celular (o súbelo a cualquier hosting simple).
2. Toca **"Probar con datos de ejemplo (modo demo)"**.
3. Verás formularios de ejemplo, con un formulario completo funcional
   ("Reporte de incidencia") para probar la experiencia real de llenar
   y enviar.

## Cómo conectarlo al GLPI real de Girag

### 1. En el servidor GLPI
- **Configuración > General > API**: activar la API REST.
- Crear un **cliente de API** (esto genera el `App-Token`, uno solo para
  todos los usuarios de la app).
- Cada usuario inicia sesión con su **usuario y contraseña normales de GLPI**
  (los mismos que usa para entrar por el navegador) — no necesita generar
  ningún token personal.
- Confirmar que el perfil del usuario tenga habilitada la pestaña **API**
  en Administración > Perfiles, para que la autenticación por login/password
  funcione.
- Confirmar que el plugin **Formcreator** está instalado y activo, y que
  los formularios que quieres mostrar están publicados/visibles para
  ese usuario.

### 2. Alojar la app
Sube estos archivos (`index.html`, `manifest.json`, `sw.js`, íconos) a
cualquier servidor web con HTTPS (puede ser un subdominio de Girag,
ej. `formularios.girag.com`). **Debe ser HTTPS** — los navegadores móviles
no permiten instalar como PWA ni acceder a APIs externas sin él.

### 3. En el celular
1. Abrir la URL una vez desde el navegador.
2. En la pantalla de login, ingresar:
   - URL del GLPI (ej. `https://soporte.girag.com/glpi`)
   - App-Token
   - Usuario y contraseña de GLPI
3. Instalar como app ("Agregar a pantalla de inicio" / "Instalar app").
4. A partir de ahí se abre como una app normal, con ícono propio.

## Convertirla en app nativa (Play Store / App Store) más adelante

Esta misma PWA se puede empaquetar sin reescribir el código, usando
**Capacitor** (de Ionic) o **PWABuilder** (de Microsoft). Genera un
proyecto Android/iOS nativo que simplemente carga esta app por dentro.
Es el camino más rápido de PWA → app de tienda.

## Cosas que un desarrollador debe validar antes de producción

Este prototipo usa los endpoints de la API documentados por la comunidad
de GLPI/Formcreator, pero **no ha sido probado contra un servidor GLPI
real de Girag** (no tengo acceso a él). Antes de usarlo en producción,
alguien con acceso al servidor debe verificar:

1. **Nombres de campos al enviar respuestas**: Formcreator espera los
   campos como `formcreator_field_<id_pregunta>`. Esto está documentado
   en el foro oficial, pero puede variar según la versión del plugin.
2. **Filtrado de secciones/preguntas por formulario**: la app trae todas
   las secciones y preguntas del servidor y las filtra en el propio
   celular (`plugin_formcreator_forms_id`, `plugin_formcreator_sections_id`).
   Funciona bien con pocos formularios; si Girag tiene muchos, conviene
   optimizar con los filtros server-side de la API de búsqueda de GLPI.
3. **Permisos por perfil**: confirmar que un usuario con el rol de
   "Self-Service" puede leer `PluginFormcreatorForm`, `PluginFormcreatorSection`
   y `PluginFormcreatorQuestion`, y crear `PluginFormcreatorFormAnswer`,
   vía API — algunos perfiles restringidos pueden no tener ese acceso.
4. **Tipos de pregunta soportados**: el prototipo cubre texto, texto largo,
   selección simple, radio, checkboxes, fecha y número. Formcreator tiene
   más tipos (archivos adjuntos, tablas de datos, firma, etc.) que no
   están implementados aún.
5. **GLPI 11**: si Girag migra a GLPI 11, la comunidad reportó que el
   soporte de formularios vía la nueva API core todavía está en
   desarrollo — habría que revisar si sigue funcionando por la vía del
   plugin Formcreator clásico o si cambia el enfoque.

## Estructura de archivos

```
glpi-forms-app/
├── index.html      # toda la app (UI + lógica + llamadas a la API)
├── manifest.json    # metadatos de instalación como PWA
├── sw.js            # service worker mínimo (permite instalar la app)
├── icon-192.png     # ícono (placeholder, reemplazar por el de Girag)
└── icon-512.png     # ícono (placeholder, reemplazar por el de Girag)
```
