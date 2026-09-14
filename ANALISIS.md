# Análisis Técnico — Panel de Control de Clientes
Grupo 21 — Legislación y Ejercicio Profesional (LyEP) 2026 - Día 1-2



## 1. Resumen ejecutivo

El prototipo es un panel de administración de clientes construido en React 19 + Vite, con React Router para la navegación, Context API + localStorage para la sesión, y react-bootstrap como framework de UI (parcialmente adoptado). Los datos no provienen de un backend propio, sino de la FakeStoreAPI pública, lo que significa que las operaciones de alta y baja de clientes no persisten realmente entre sesiones.

La estructura general del código es clara y modular (componentes, páginas, servicios y contexto separados), pero el proyecto está en una etapa temprana: la capa de servicios está incompleta (se meclan axios y fetch directo en los componentes), el control de acceso por rol se resuelve enteramente en el cliente sin ninguna verificación real, y no existe ningún tipo de testing automatizado.

En síntesis, es una base funcional y prolija a nivel de UI, pero con deuda técnica relevante en seguridad, consistencia arquitectónica y cobertura de pruebas antes de poder considerarse apta para un entorno real.



## 2. Arquitectura del proyecto

Stack tecnológico: React 19 (librería de UI), Vite 6 (herramienta de build y servidor de desarrollo), React Router Dom 7 (navegación entre vistas), React Bootstrap + Bootstrap 5 (componentes visuales), Axios (cliente HTTP, usado parcialmente), y Context API de React (manejo de estado global de sesión, sin librerías externas como Redux).

# Estructura de carpetas:

| Carpeta | Contenido / Responsabilidad |
| `src/components` | Piezas de UI reutilizables: Header, Footer, Nav, FormCliente, RutaProtegida |
| `src/pages` | Vistas de cada ruta: Login, Dashboard, ListaClientes, DetalleCliente, ErrorPage |
| `src/context` | AutorizacionesContext: estado global de sesión (usuario logueado) |
| `src/hooks` | useAutorizaciones: hook que envuelve el acceso al contexto de sesión |
| `src/services` | clientesService.js y autorizacionesServices.js: acceso a datos (incompleto) |
| `src/routes` | routes.jsx: definición centralizada de todas las rutas de la app |
| `src/css` | Hojas de estilo, un archivo por vista/componente |

## Flujo de datos

1. Autenticación: `Login.jsx` valida las credenciales contra un arreglo fijo de usuarios definido en `autorizacionesServices.js` (no hay backend de autenticación real). Si coinciden, se guarda el usuario en `AutorizacionesContext`, que a su vez lo persiste en `localStorage`.
2.  Protección de rutas: `RutaProtegida.jsx` consulta ese contexto (a través del hook `useAutorizaciones`) y redirige a `/login` si no hay un usuario autenticado.
3. Datos de clientes: No tienen una fuente única. `ListaClientes.jsx` hace `GET` directo con `fetch`, `FormCliente.jsx` hace `POST` a través de `clientesService.js` (axios), y `DetalleCliente.jsx` hace `GET` y `DELETE` directo con `fetch`. Los tres apuntan a la misma FakeStoreAPI externa, pero con tres formas distintas de acceder a ella.
4. Persistencia real: Al ser una API pública de demostración, las altas y bajas de clientes no se guardan de forma permanente; cada recarga puede devolver el set de datos original.


## 3. Metodología de análisis (Día 1 y Día 2)

Día 1 — Exploración individual: cada integrante clonó el fork del repositorio docente y revisó el código completo sin modificarlo, tomando nota de hallazgos propios sobre seguridad, arquitectura, manejo de errores, validaciones, accesibilidad y calidad general.

Día 2 — Consolidación grupal: los hallazgos individuales se pusieron en común, se eliminaron duplicados, y se clasificaron por dimensión (Seguridad, Arquitectura, Manejo de errores, Validación de datos, UX/Accesibilidad, Calidad de código/Testing, Documentación) y por impacto (Alto/Medio/Bajo), dando como resultado la tabla y el backlog siguientes.

## Tabla de Hallazgos


Problema detectado
Dimensión
Impacto
Propuesta de solución
1
Credenciales de administradores (email + contraseña en texto plano) hardcodeadas en autorizacionesServices.js
Seguridad
Alto
Aplicar hashing de contraseñas (SHA-256 mediante la Web Crypto API del
navegador) para no exponerlas en texto plano en el código fuente. En una
futura iteración, migrar la autenticación a un backend propio con base de
datos y hashing server-side (bcrypt), dado que el proyecto actualmente no
cuenta con un servidor propio.


2
El control de acceso por rol se resuelve 100% en el cliente (localStorage), sin verificación real
Seguridad
Alto
La autorización debe validarse en el backend en cada operación sensible
3
La contraseña del cliente se muestra en texto plano en DetalleCliente.jsx
Seguridad
Medio
No mostrar contraseñas en pantalla; usar placeholder u ocultar el campo
4
Doble fuente de verdad para la sesión: admin en localStorage vs. role en otra clave separada
Arquitectura
Alto
Unificar el estado de sesión en el contexto único; derivar role desde admin.sector
5
Capa de servicios incompleta: se mezclan axios y fetch directo dentro de los componentes
Arquitectura
Medio
Completar clientesService.js con todas las operaciones; usar un único cliente HTTP
6
URL de la API hardcodeada y repetida en varios archivos
Arquitectura
Medio
Centralizar en una constante o variable de entorno
7
Los bloques catch descartan el error real sin loguearlo
Manejo de errores
Medio
Loguear el error real y diferenciar mensajes según el tipo de fallo
8
DetalleCliente.jsx no maneja el fallo del fetch por id (queda cargando indefinidamente)
Manejo de errores
Bajo
Agregar el mismo patrón de estado de error que ya existe en ListaClientes.jsx
9
Inconsistencia de validación entre Login.jsx (estricta) y FormCliente.jsx (mínima)
Validación de datos
Medio
Extraer validaciones a un módulo compartido reutilizable
10
El botón "Eliminar Cliente" borra sin ninguna confirmación previa
UX / Accesibilidad
Medio
Agregar diálogo de confirmación antes de ejecutar la baja
11
Inconsistencia de UI kit: Login.jsx usa HTML nativo, el resto usa react-bootstrap
UX / Accesibilidad
Bajo
Migrar Login.jsx a componentes de react-bootstrap
12
Labels sin asociar (htmlFor/id) a sus inputs en Login.jsx
UX / Accesibilidad
Bajo
Agregar los atributos de asociación label-input
13
No existe ningún test automatizado ni framework de testing configurado
Calidad / Testing
Alto
Incorporar Vitest + React Testing Library, empezando por login y alta de cliente
14
Dashboard.jsx muestra contadores hardcodeados en vez de datos reales
Calidad de código
Bajo
Calcular los contadores a partir de la lista real de clientes
15
Discrepancia entre la consigna (React+Node+Express) y la arquitectura real (frontend puro sin backend propio)
Documentación / Proceso
Medio
Documentar explícitamente esta limitación en el README
16
Ausencia de .gitattributes; todo el proyecto está en CRLF
Calidad de código
Bajo
Agregar .gitattributes para normalizar finales de línea




## 4. Mejores propuestas (Backlog priorizado)

| Prioridad | Mejora propuesta | Por qué importa | Complejidad estimada |
|---|---|---|---|
| Alto | Eliminar credenciales hardcodeadas / autenticación segura | El proyecto no puede ir a producción con contraseñas en texto plano en el código fuente | Media |
| Alto | Corregir el control de acceso resuelto solo en el cliente | Cualquier usuario puede otorgarse permisos de Gerencia desde la consola del navegador | Alta |
| Alto | Unificar la fuente de verdad de la sesión (admin/role) | Dos estados de sesión desincronizados generan bugs difíciles de reproducir | Media |
| Alto | Incorporar tests automatizados mínimos | Sin tests, cualquier cambio futuro puede romper funcionalidad sin que nadie lo note | Alta |
| Medio | Completar la capa de servicios y eliminar duplicación fetch/axios | Hoy la lógica de acceso a datos está repartida entre 3 archivos distintos | Media |
| **Medio | Centralizar la URL de la API en variable de entorno | Cambiar de API implicaría hoy editar 3 archivos a mano | Baja |
| Medio | Ocultar la contraseña del cliente en la ficha | Expone datos sensibles sin ninguna necesidad funcional | Baja |
| Medio| Loguear errores reales y diferenciar mensajes | Hoy es imposible diagnosticar por qué falló una petición | Baja |
| Medio | Unificar validaciones de formularios en un módulo compartido | Evita mantener dos criterios de validación distintos para el mismo tipo de dato | Media |
| Medio | Agregar confirmación antes de eliminar un cliente | Una acción irreversible no debería ejecutarse con un solo clic accidental | Baja |
| Medio | Documentar en el README la naturaleza mock de la API | Evita que el equipo o el docente asuman una persistencia de datos que no existe | Baja |
| Bajo | Manejar el estado de error en `DetalleCliente.jsx` | Mejora puntual de UX ante fallos de red | Baja |
| Bajo | Migrar `Login.jsx` a react-bootstrap | Consistencia visual con el resto de la aplicación | Media |
| Bajo | Asociar labels con inputs en `Login.jsx` | Accesibilidad para lectores de pantalla | Baja |
| Bajo | Calcular dinámicamente los contadores del Dashboard | Hoy muestra números fijos que no reflejan la realidad | Baja |
| Bajo | Agregar `.gitattributes` para normalizar finales de línea | Evita diffs ruidosos al trabajar en distintos sistemas operativos | Baja |

## 5. Mejora Seleccionada por Participante

* Participante: Keila Lopez
* Mejora elegida: N° 10 - Agregar diálogo de confirmación antes de eliminar un cliente.
* Justificación técnica:
  La eliminación directa mediante un solo clic en la interfaz representa una falla de Usabilidad (UX) y un riesgo directo a la integridad de los datos por borrados accidentales. Se seleccionó esta mejora por sobre otras de prioridad media dado que permite incorporar una barrera defensiva en el cliente, mediante un componente Modal reutilizable, sin requerir modificaciones complejas en la API, mejorando sensiblemente la experiencia del usuario con una baja probabilidad de introducir regresiones en el código.