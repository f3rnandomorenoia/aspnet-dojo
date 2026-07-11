# ASP.NET Dojo 🥋

Aprende **ASP.NET Core de .NET 10** desde el móvil, con ejercicios interactivos al estilo Duolingo.

**➡️ Pruébala: https://f3rnandomorenoia.github.io/aspnet-dojo/**

## ¿Qué es?

Una app web (PWA) 100 % estática pensada para el móvil. En vez de leer documentación, aprendes tocando:

- 🧩 **Completa el código** — rellena los huecos de fragmentos reales de C#.
- 🔀 **Ordena el código** — construye endpoints y pipelines línea a línea.
- ❓ **Quizzes** — afianza los conceptos de backend.
- ⚡ **XP y racha diaria** — tu progreso se guarda en el dispositivo (localStorage).
- 📴 **Funciona sin conexión** — instálala como app desde el navegador.

## Temario

1. 🚀 Fundamentos — proyecto, `Program.cs`, CLI de .NET
2. 🛣️ Minimal APIs — rutas, parámetros, `Results`
3. 💉 Inyección de dependencias — servicios y tiempos de vida
4. 🧅 Middleware — el pipeline de peticiones
5. 🗄️ Datos con EF Core — `DbContext`, migraciones, LINQ
6. 🔐 Seguridad — JWT, autorización, CORS
7. 🏗️ Proyecto real — validación, `ProblemDetails`, Docker

## Desarrollo

Sin dependencias ni build: HTML + CSS + JavaScript.

```bash
# Servir en local
python3 -m http.server 8000
# y abrir http://localhost:8000
```

El contenido del curso vive en [`js/data.js`](js/data.js): añadir un módulo o ejercicio es añadir un objeto a ese archivo.
