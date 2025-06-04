# 3D - Quotes - Frontend

**Descripción:** Este es el frontend del proyecto "3D - Quotes", desarrollado como parte de un trabajo universitario personal. Está construido con **React** y **TypeScript** usando el bundler **Vite**. Ofrece una interfaz de usuario para iniciar sesión/registrarse y crear/mostrar cotizaciones de impresión 3D consumiendo la API del backend. Utiliza React Router para navegación de páginas y Axios/Fetch para comunicarse con el backend.

**Tecnologías principales:**  
- **React** (biblioteca de JavaScript para interfaces de usuario).  
- **Vite** (herramienta de construcción rápida para web) con React.  
- **TypeScript** (superset tipado de JavaScript).  
- **React Router v7.6.1** para rutas en la SPA.  
- **Axios** (o `fetch`) para peticiones HTTP.  
- **Otras:** ESLint, CSS, etc.

**Versiones destacadas (según `package.json` / `package-lock.json`):**  
- React 19.1.0, React-DOM 19.1.0.  
- Vite 6.3.5.  
- TypeScript 5.8.3.  
- React Router DOM 7.6.1.  
- Axios 1.9.0.

## Estructura del proyecto

- **`public/`**: Archivos públicos estáticos. Contiene `index.html` (punto de entrada HTML) y otros assets públicos (imagen de Vite).
- **`src/`**: Código fuente de React:
  - **`main.tsx`**: Punto de entrada principal. Renderiza el componente `<App />` dentro de `BrowserRouter`.
  - **`App.tsx`**: Componente raíz. Define las rutas de la aplicación usando React Router. Maneja el estado de `token` (si el usuario está autenticado) y redirecciones. Por ejemplo:
    - `/` redirige a `/login` o `/quotes` según token.  
    - `/login` muestra el componente `LoginPage`.  
    - `/register` muestra `RegisterPage`.  
    - `/quotes` ruta protegida (`ProtectedRoute`) que muestra `QuotePage`.  
  - **`components/`**: Componentes reutilizables:
    - `RegisterForm.tsx`: Formulario de registro.
    - `QuoteForm.tsx`: Formulario para crear o editar cotizaciones.
    - `QuoteList.tsx`: Lista de cartas (`QuoteCard`) mostrando cotizaciones.
    - `QuoteCard.tsx`: Carta individual con datos básicos de la cotización.
    - `OptimizationPanel.tsx`: Panel que muestra los resultados de optimización.
  - **`pages/`**: Componentes de página (usados en rutas):
    - `RegisterPage.tsx`: Página de registro (muestra `RegisterForm`).
    - `LoginPage.tsx`: Página de inicio de sesión.
    - `QuotePage.tsx`: Página principal de cotizaciones. Muestra el listado de cotizaciones, formulario para añadir una nueva, y panel de optimización. Incluye opción de cerrar sesión.
  - **`api/quoteApi.ts`**: Funciones para llamar a los endpoints del backend (`fetchAllQuotes`, `fetchQuoteById`, `createQuote`, `updateQuote`, `deleteQuote`, `optimizeQuote`). Usa la URL base de la API, definida como:
    ```ts
    const API_URL = "http://localhost:8000/api/quotes/";
    ```
    Es decir, apunta al backend (configurable si el backend corre en otro puerto/servidor).
  - **`types/`**: Definiciones de tipos TypeScript:
    - `quote.ts`, `schema.ts`: Interfaces/Tipos que corresponden con las estructuras de datos (cotización, optimización, etc.).
  - **Estilos:** `App.css`, `index.css` para estilos globales y de componentes.
  - **Otros:** `vite-env.d.ts`, archivos de configuración TypeScript, ESLint, etc.

## Conexión con el Backend

El frontend se comunica con el backend mediante HTTP. La base de la API está en `src/api/quoteApi.ts` con `API_URL = "http://localhost:8000/api/quotes/"`. Para que las llamadas funcionen, debe apuntar a la URL donde el backend está corriendo (por defecto `localhost:8000`). El frontend incluye el token JWT en la cabecera `Authorization: Bearer <token>` al hacer peticiones protegidas (por ejemplo, en `QuotePage` tras iniciar sesión). Si en producción el backend estuviera en otra URL, se podría usar una variable de entorno (`import.meta.env`) o cambiar `API_URL`.

## Instalación y ejecución

1. **Clonar o descomprimir** este repositorio. Navegar a la carpeta del frontend (`3d-quotes-frontend`).
2. **Instalar dependencias:**  
   ```bash
   npm install
   ```  
   o usando yarn:
   ```bash
   yarn install
   ```
3. **Configurar variables:** No hay archivo `.env` proporcionado por defecto. Si se desea, se puede usar un `.env` con la URL base de la API, p.ej. `VITE_API_URL=http://localhost:8000/api/quotes/`, y luego usarlo en `quoteApi.ts`. De lo contrario, está codificada en el archivo.
4. **Iniciar el servidor de desarrollo:**  
   ```bash
   npm run dev
   ```  
   Por defecto, Vite iniciará en `http://localhost:5173`.
5. **Abrir en navegador:** `http://localhost:5173` mostrará la aplicación. Al navegar, se podrá registrar un usuario (que llama a `POST /auth/register`), iniciar sesión, y luego acceder a la página de cotizaciones.
6. **Construir para producción (opcional):**  
   ```bash
   npm run build
   ```  
   Generará archivos estáticos en `dist/`.

## Rutas y páginas principales

La aplicación usa **React Router** (un enrutador estándar para React). Las rutas principales son:

- **`/` (root):** Redirige automáticamente a `/login` o `/quotes` según el estado de autenticación.
- **`/register`** (Registro): Muestra la página de registro (`RegisterPage` con formulario).  
- **`/login`**: Muestra la página de inicio de sesión (`LoginPage`).  
- **`/quotes`**: Página protegida (solo accesible si el usuario está autenticado). Muestra:
  - Formulario para crear nuevas cotizaciones (`QuoteForm`).
  - Lista de cotizaciones existentes (`QuoteList` con `QuoteCard`).
  - Panel de optimización (`OptimizationPanel`) que aparece al solicitar optimización de una cotización.
  - Botón para cerrar sesión (que elimina el token y redirige a login).
- **`*` (cualquiera otra ruta):** Redirige a `/quotes` si está autenticado, o a `/login` si no.

La navegación entre estas rutas se hace sin recargar la página (SPA). Por ejemplo, al hacer click en un enlace de registro o iniciar sesión, React Router cambia de componente sin recargar el navegador.

**Link al repo backend:** [https://github.com/der-matt02/3D-Platform-Backend](https://github.com/der-matt02/3D-Platform-Backend)
