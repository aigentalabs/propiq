# Manual de Instalación y Personalización: BrokerInsight

Este documento está dirigido a administradores y desarrolladores que necesiten instalar, configurar o personalizar esta herramienta de tasación.

## 🛠️ Requisitos Previos

- **Node.js:** Versión 18 o superior.
- **npm:** Incluido con Node.js.
- **Vercel Account:** Para el hosting (opcional, pero recomendado).
- **Google AI Studio Key:** Para acceder al modelo Gemini 2.5 Flash.

---

## 💻 Instalación Local

1. **Clonar/Extraer:** Descarga el código y abre una terminal en la carpeta raíz.
2. **Instalar Dependencias:**
   ```bash
   npm install
   ```
3. **Variables de Entorno:**
   Crea un archivo llamado `.env.local` en la raíz (o renombra `.env.example`) y agrega tu API Key:
   ```env
   GEMINI_API_KEY=tu_api_key_aqui
   ```
4. **Ejecutar en Desarrollo:**
   - Si solo quieres ver el diseño: `npm run dev`
   - Si quieres que funcione el API localmente: Necesitas Vercel CLI.
     ```bash
     npm install -g vercel
     vercel dev
     ```

---

## 🚀 Despliegue en Vercel

La aplicación está optimizada para **Vercel Serverless Functions**.

1. **Subir a GitHub:** Sube tu código a un repositorio privado.
2. **Conectar a Vercel:** Importa el repositorio en Vercel.
3. **Configurar API Key:**
   - En el dashboard de Vercel, ve a **Settings > Environment Variables**.
   - Agrega `GEMINI_API_KEY` con tu llave.
4. **Deploy:** Vercel detectará automáticamente que es un proyecto de Vite y hará el build.

---

## 🎨 Personalización

### 1. Cambiar el "Cerebro" (Prompt de IA)
Si quieres que la IA use otros criterios o sea más/menos agresiva en los precios:
- Edita el archivo `api/valuation.ts`.
- Busca la variable `textPrompt`. Allí puedes cambiar las instrucciones en lenguaje natural que recibe la IA.

### 2. Branding (Logo y Colores)
- **Logotipo:** Edita `components/icons/LogoIcon.tsx` para cambiar la forma del icono.
- **Nombre de la App:** Cambia los textos "BrokerInsight" en `App.tsx` y `index.html`.
- **Colores:** El proyecto usa **Tailwind CSS**. Puedes cambiar las clases `bg-indigo-600` por `bg-red-600` (o el color que prefieras) en archivos como `App.tsx`, `PropertyForm.tsx` y `ValuationReport.tsx`.

### 3. Categorías de Lugares Cercanos
Si quieres agregar más categorías (ej: Comisarías o Bancos):
- Actualiza el schema en `api/valuation.ts` (variable `schema`).
- Agrega las instrucciones en el prompt de la misma carpeta.
- Crea el componente visual correspondiente en `ValuationReport.tsx`.

---

## 📁 Estructura del Proyecto

- `/api`: Servidor (Serverless Functions) - Lógica de tasación con Gemini.
- `/components`: Interfaz de usuario dividida en componentes React.
- `/services`: Conexión con el API.
- `types.ts`: Definiciones de datos que usa toda la app.

---
*Mantenido por Aigenta Labs*
