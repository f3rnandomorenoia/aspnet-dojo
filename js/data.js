// Curso de ASP.NET Core (.NET 10) — contenido de módulos y ejercicios.
//
// Tipos de ejercicio:
//  - quiz:    pregunta con opciones, una correcta (índice `correcta`).
//  - huecos:  código con ranuras `{0}`, `{1}`… que se rellenan tocando fichas.
//             `respuestas` = token correcto de cada ranura, `banco` incluye distractores.
//  - ordenar: construir la secuencia correcta tocando fichas.
//             `items` en orden correcto; `tokens:true` = fichas en línea (código),
//             sin él = líneas apiladas.

const CURSO = [
  {
    id: "fundamentos",
    icono: "🚀",
    titulo: "Fundamentos",
    descripcion: "Qué es ASP.NET Core y cómo nace un proyecto",
    ejercicios: [
      {
        tipo: "quiz",
        pregunta: "¿Qué es ASP.NET Core?",
        opciones: [
          "Un framework web multiplataforma y de código abierto para .NET",
          "Un lenguaje de programación de Microsoft",
          "Una base de datos relacional",
          "Un editor de código para C#",
        ],
        correcta: 0,
        explicacion:
          "ASP.NET Core es el framework de .NET para construir APIs y aplicaciones web. Funciona en Windows, Linux y macOS.",
      },
      {
        tipo: "quiz",
        pregunta: "¿Qué comando crea una Web API nueva con .NET 10?",
        opciones: [
          "dotnet new webapi -n MiApi",
          "dotnet create api MiApi",
          "npm init webapi MiApi",
          "dotnet build webapi MiApi",
        ],
        correcta: 0,
        explicacion:
          "`dotnet new` crea proyectos desde plantillas. `webapi` es la plantilla de API y `-n` le da nombre.",
      },
      {
        tipo: "ordenar",
        enunciado: "Ordena los pasos para crear y ejecutar tu primera API:",
        items: [
          "dotnet new webapi -n MiApi",
          "cd MiApi",
          "dotnet run",
          "Abrir http://localhost:5000 en el navegador",
        ],
        explicacion:
          "Primero se crea el proyecto, luego entras a su carpeta, lo ejecutas y ya puedes probarlo en el navegador.",
      },
      {
        tipo: "huecos",
        enunciado: "Completa el Program.cs mínimo de ASP.NET Core:",
        codigo:
          "var builder = WebApplication.{0}(args);\nvar app = builder.{1}();\n\napp.MapGet(\"/\", () => \"¡Hola .NET 10!\");\n\napp.{2}();",
        respuestas: ["CreateBuilder", "Build", "Run"],
        banco: ["CreateBuilder", "Build", "Run", "Start", "New", "Compile"],
        explicacion:
          "El patrón es siempre: CreateBuilder() configura, Build() crea la app y Run() la pone a escuchar peticiones.",
      },
      {
        tipo: "quiz",
        pregunta: "¿En qué archivo se guarda la configuración de la aplicación (cadenas de conexión, ajustes…)?",
        opciones: ["appsettings.json", "web.config", "config.yaml", "settings.cs"],
        correcta: 0,
        explicacion:
          "appsettings.json es el archivo de configuración estándar. Puede tener variantes por entorno, como appsettings.Development.json.",
      },
    ],
  },
  {
    id: "minimal-apis",
    icono: "🛣️",
    titulo: "Minimal APIs",
    descripcion: "Endpoints, rutas y respuestas HTTP",
    ejercicios: [
      {
        tipo: "huecos",
        enunciado: "Crea un endpoint GET que salude:",
        codigo: "app.{0}(\"/hola\", () => {1});",
        respuestas: ["MapGet", "\"Hola Mundo\""],
        banco: ["MapGet", "MapPost", "\"Hola Mundo\"", "GetRoute", "return"],
        explicacion:
          "MapGet asocia una ruta con una función. Lo que devuelve la lambda se convierte en la respuesta HTTP.",
      },
      {
        tipo: "ordenar",
        tokens: true,
        enunciado: "Construye un endpoint que recibe un id por la ruta:",
        items: ["app.MapGet(", "\"/usuarios/{id}\"", ",", "(int id)", "=>", "$\"Usuario {id}\"", ");"],
        explicacion:
          "Los segmentos entre llaves, como {id}, se capturan de la URL y se pasan como parámetros a la lambda con su tipo.",
      },
      {
        tipo: "quiz",
        pregunta: "Quieres un endpoint para CREAR un recurso. ¿Qué método usas?",
        opciones: ["app.MapPost(...)", "app.MapGet(...)", "app.MapDelete(...)", "app.MapPut(...)"],
        correcta: 0,
        explicacion:
          "En REST cada verbo tiene su intención: POST crea, GET lee, PUT actualiza y DELETE elimina.",
      },
      {
        tipo: "huecos",
        enunciado: "Completa el POST que devuelve 201 Created:",
        codigo:
          "app.MapPost(\"/productos\", ({0} producto) =>\n{\n    lista.Add(producto);\n    return Results.{1}($\"/productos/{producto.Id}\", producto);\n});",
        respuestas: ["Producto", "Created"],
        banco: ["Producto", "Created", "Ok", "string", "NotFound"],
        explicacion:
          "El cuerpo JSON de la petición se convierte automáticamente al tipo del parámetro (model binding). Results.Created devuelve 201 con la URL del nuevo recurso.",
      },
      {
        tipo: "quiz",
        pregunta: "Si buscas un producto y no existe, ¿qué deberías devolver?",
        opciones: ["Results.NotFound()", "Results.Ok(null)", "Results.Created()", "throw new Exception()"],
        correcta: 0,
        explicacion:
          "Results.NotFound() devuelve un 404, el código HTTP correcto cuando el recurso no existe. Devolver Ok(null) confunde al cliente.",
      },
      {
        tipo: "ordenar",
        enunciado: "Ordena la lógica de un GET por id:",
        items: [
          "app.MapGet(\"/productos/{id}\", (int id) =>",
          "{",
          "    var producto = lista.FirstOrDefault(p => p.Id == id);",
          "    return producto is null ? Results.NotFound() : Results.Ok(producto);",
          "});",
        ],
        explicacion:
          "Un patrón muy común: buscar el recurso y devolver 404 si no existe u Ok con el dato si existe.",
      },
    ],
  },
  {
    id: "di",
    icono: "💉",
    titulo: "Inyección de dependencias",
    descripcion: "Servicios, interfaces y tiempos de vida",
    ejercicios: [
      {
        tipo: "quiz",
        pregunta: "¿Para qué sirve la inyección de dependencias (DI)?",
        opciones: [
          "Para que las clases reciban lo que necesitan en vez de crearlo ellas mismas",
          "Para inyectar código JavaScript en el servidor",
          "Para acelerar las consultas a la base de datos",
          "Para compilar más rápido el proyecto",
        ],
        correcta: 0,
        explicacion:
          "Con DI el framework crea y entrega las dependencias. Tu código depende de interfaces, lo que facilita cambiar implementaciones y hacer tests.",
      },
      {
        tipo: "huecos",
        enunciado: "Registra un servicio en el contenedor:",
        codigo: "builder.{0}.AddScoped<{1}, UserService>();",
        respuestas: ["Services", "IUserService"],
        banco: ["Services", "IUserService", "UserService", "App", "Configuration"],
        explicacion:
          "builder.Services es el contenedor de DI. Se registra la interfaz junto a su implementación: quien pida IUserService recibirá un UserService.",
      },
      {
        tipo: "quiz",
        pregunta: "¿Qué tiempo de vida crea UNA sola instancia para toda la aplicación?",
        opciones: ["AddSingleton", "AddScoped", "AddTransient", "AddStatic"],
        correcta: 0,
        explicacion:
          "Singleton: una instancia para siempre. Scoped: una por petición HTTP. Transient: una nueva cada vez que se pide.",
      },
      {
        tipo: "quiz",
        pregunta: "Un servicio que usa DbContext, ¿qué tiempo de vida debería tener normalmente?",
        opciones: [
          "Scoped: una instancia por petición HTTP",
          "Singleton: compartirlo ahorra memoria",
          "Transient: cuantas más instancias mejor",
          "Da igual, no afecta en nada",
        ],
        correcta: 0,
        explicacion:
          "El DbContext de EF Core es Scoped por diseño: cada petición trabaja con su propio contexto y no se pisa con otras.",
      },
      {
        tipo: "ordenar",
        tokens: true,
        enunciado: "Inyecta el servicio en un endpoint:",
        items: ["app.MapGet(", "\"/usuarios\"", ",", "(IUserService servicio)", "=>", "servicio.ObtenerTodos()", ");"],
        explicacion:
          "En Minimal APIs basta con declarar el servicio como parámetro de la lambda: el contenedor de DI lo entrega automáticamente.",
      },
    ],
  },
  {
    id: "middleware",
    icono: "🧅",
    titulo: "Middleware",
    descripcion: "El pipeline por el que viaja cada petición",
    ejercicios: [
      {
        tipo: "quiz",
        pregunta: "¿Qué es un middleware en ASP.NET Core?",
        opciones: [
          "Un componente que procesa la petición y decide si pasa al siguiente",
          "Una tabla intermedia de la base de datos",
          "Un tipo de controlador especial",
          "El hilo principal de la aplicación",
        ],
        correcta: 0,
        explicacion:
          "Cada petición atraviesa una cadena de middlewares (el pipeline). Cada uno puede actuar antes y después de pasar el control al siguiente, como capas de cebolla.",
      },
      {
        tipo: "ordenar",
        enunciado: "Ordena el pipeline correctamente (¡el orden importa!):",
        items: [
          "app.UseHttpsRedirection();",
          "app.UseAuthentication();",
          "app.UseAuthorization();",
          "app.MapGet(\"/\", () => \"Hola\");",
        ],
        explicacion:
          "Primero seguridad de transporte, luego saber QUIÉN eres (Authentication), después QUÉ puedes hacer (Authorization) y por último los endpoints.",
      },
      {
        tipo: "huecos",
        enunciado: "Crea un middleware propio que registra cada petición:",
        codigo:
          "app.Use(async (context, {0}) =>\n{\n    Console.WriteLine($\"Petición: {context.Request.Path}\");\n    await {1}();\n});",
        respuestas: ["next", "next"],
        banco: ["next", "next", "context", "app", "Run"],
        explicacion:
          "`next` representa el siguiente middleware del pipeline. Si no llamas a await next(), la petición se corta ahí (short-circuit).",
      },
      {
        tipo: "quiz",
        pregunta: "¿Qué middleware sirve archivos como imágenes, CSS o JS desde wwwroot?",
        opciones: ["app.UseStaticFiles()", "app.UseFiles()", "app.MapAssets()", "app.UseWwwRoot()"],
        correcta: 0,
        explicacion:
          "UseStaticFiles expone el contenido de la carpeta wwwroot directamente, sin pasar por ningún endpoint.",
      },
    ],
  },
  {
    id: "efcore",
    icono: "🗄️",
    titulo: "Datos con EF Core",
    descripcion: "DbContext, migraciones y consultas",
    ejercicios: [
      {
        tipo: "huecos",
        enunciado: "Define el contexto de base de datos:",
        codigo:
          "public class TiendaDb : {0}\n{\n    public TiendaDb(DbContextOptions<TiendaDb> options) : base(options) { }\n\n    public {1}<Producto> Productos => Set<Producto>();\n}",
        respuestas: ["DbContext", "DbSet"],
        banco: ["DbContext", "DbSet", "Database", "List", "DbTable"],
        explicacion:
          "El DbContext representa la sesión con la base de datos y cada DbSet<T> equivale a una tabla que puedes consultar con LINQ.",
      },
      {
        tipo: "huecos",
        enunciado: "Registra EF Core con SQLite en el contenedor:",
        codigo: "builder.Services.{0}<TiendaDb>(opt =>\n    opt.{1}(\"Data Source=tienda.db\"));",
        respuestas: ["AddDbContext", "UseSqlite"],
        banco: ["AddDbContext", "UseSqlite", "AddDatabase", "UseSqlServer", "Connect"],
        explicacion:
          "AddDbContext registra el contexto como Scoped. El proveedor (UseSqlite, UseSqlServer, UseNpgsql…) define contra qué base de datos hablas.",
      },
      {
        tipo: "quiz",
        pregunta: "¿Qué es una migración en EF Core?",
        opciones: [
          "Un archivo de código que describe cambios del modelo para aplicarlos a la base de datos",
          "Mover la base de datos a otro servidor",
          "Copiar datos de una tabla a otra",
          "Un backup automático",
        ],
        correcta: 0,
        explicacion:
          "Las migraciones convierten los cambios de tus clases (el modelo) en cambios de esquema SQL, de forma versionada y repetible.",
      },
      {
        tipo: "ordenar",
        enunciado: "Ordena los comandos para crear la base de datos:",
        items: [
          "dotnet tool install --global dotnet-ef",
          "dotnet ef migrations add Inicial",
          "dotnet ef database update",
        ],
        explicacion:
          "Se instala la herramienta una vez, se genera la migración a partir del modelo y update la aplica creando la base de datos.",
      },
      {
        tipo: "ordenar",
        tokens: true,
        enunciado: "Consulta todos los productos de forma asíncrona:",
        items: ["await", "db.Productos", ".Where(p => p.Precio > 10)", ".ToListAsync()", ";"],
        explicacion:
          "Las consultas se escriben con LINQ y se ejecutan al materializarlas (ToListAsync). Usa siempre los métodos async en endpoints.",
      },
    ],
  },
  {
    id: "seguridad",
    icono: "🔐",
    titulo: "Seguridad",
    descripcion: "Autenticación, autorización y CORS",
    ejercicios: [
      {
        tipo: "quiz",
        pregunta: "¿Cuál es la diferencia entre autenticación y autorización?",
        opciones: [
          "Autenticación = quién eres; autorización = qué puedes hacer",
          "Son sinónimos, se usan indistintamente",
          "Autenticación = qué puedes hacer; autorización = quién eres",
          "La autorización solo existe en aplicaciones móviles",
        ],
        correcta: 0,
        explicacion:
          "Primero el sistema verifica tu identidad (login, token) y después decide a qué recursos tienes acceso según tus roles o permisos.",
      },
      {
        tipo: "huecos",
        enunciado: "Configura autenticación con tokens JWT:",
        codigo: "builder.Services.{0}(\"Bearer\")\n    .{1}(opciones => { /* clave, emisor… */ });",
        respuestas: ["AddAuthentication", "AddJwtBearer"],
        banco: ["AddAuthentication", "AddJwtBearer", "AddAuthorization", "AddLogin", "UseJwt"],
        explicacion:
          "AddAuthentication define el esquema por defecto y AddJwtBearer enseña a la app a validar los tokens JWT que llegan en la cabecera Authorization.",
      },
      {
        tipo: "ordenar",
        tokens: true,
        enunciado: "Protege un endpoint para que exija usuario autenticado:",
        items: ["app.MapGet(\"/perfil\", ...)", ".", "RequireAuthorization", "()", ";"],
        explicacion:
          "RequireAuthorization() en Minimal APIs equivale al atributo [Authorize]: sin token válido, la respuesta es 401.",
      },
      {
        tipo: "quiz",
        pregunta: "Tu frontend en otro dominio recibe errores al llamar a tu API. ¿Qué necesitas configurar?",
        opciones: ["CORS con AddCors y UseCors", "HTTPS", "Un middleware de logging", "Migraciones de EF Core"],
        correcta: 0,
        explicacion:
          "Los navegadores bloquean peticiones entre orígenes distintos. CORS le dice al navegador qué orígenes, métodos y cabeceras permite tu API.",
      },
      {
        tipo: "quiz",
        pregunta: "¿Dónde viaja normalmente el token JWT en cada petición?",
        opciones: [
          "En la cabecera: Authorization: Bearer <token>",
          "En la URL como ?token=...",
          "En una cookie llamada jwt siempre",
          "En el cuerpo de todas las peticiones GET",
        ],
        correcta: 0,
        explicacion:
          "El estándar es la cabecera Authorization con el esquema Bearer. El middleware de autenticación la lee y valida el token automáticamente.",
      },
    ],
  },
  {
    id: "proyecto",
    icono: "🏗️",
    titulo: "Proyecto real",
    descripcion: "Organización, validación y despliegue",
    ejercicios: [
      {
        tipo: "quiz",
        pregunta: "¿Qué patrón de organización separa endpoints, servicios y acceso a datos?",
        opciones: [
          "Arquitectura en capas: API → Servicios → Repositorio/Datos",
          "Meter todo en Program.cs",
          "Una clase por verbo HTTP",
          "Un proyecto por endpoint",
        ],
        correcta: 0,
        explicacion:
          "Separar responsabilidades hace el código testeable y mantenible: los endpoints orquestan, los servicios contienen la lógica y la capa de datos habla con la base de datos.",
      },
      {
        tipo: "huecos",
        enunciado: "Valida el modelo con DataAnnotations:",
        codigo:
          "public class CrearProductoDto\n{\n    [{0}]\n    public string Nombre { get; set; } = \"\";\n\n    [{1}(0, 10000)]\n    public decimal Precio { get; set; }\n}",
        respuestas: ["Required", "Range"],
        banco: ["Required", "Range", "NotNull", "MaxValue", "Valid"],
        explicacion:
          "[Required] exige que el campo llegue relleno y [Range] limita valores numéricos. Así rechazas datos inválidos antes de tocar la lógica.",
      },
      {
        tipo: "quiz",
        pregunta: "¿Qué formato estándar usa ASP.NET Core para devolver errores HTTP con detalle?",
        opciones: [
          "ProblemDetails (RFC 7807)",
          "Un string con el mensaje de la excepción",
          "HTML con la traza completa",
          "Código 200 con { error: true }",
        ],
        correcta: 0,
        explicacion:
          "ProblemDetails es un JSON estándar con type, title, status y detail. Se activa con AddProblemDetails() y da errores consistentes a los clientes.",
      },
      {
        tipo: "ordenar",
        enunciado: "Ordena el flujo de un despliegue con Docker:",
        items: [
          "dotnet publish -c Release",
          "Escribir el Dockerfile",
          "docker build -t miapi .",
          "docker run -p 8080:8080 miapi",
        ],
        explicacion:
          "Se publica la app optimizada, se define la imagen en el Dockerfile, se construye y se ejecuta el contenedor exponiendo el puerto.",
      },
      {
        tipo: "quiz",
        pregunta: "Terminaste el curso 🎉 ¿Cuál es el mejor siguiente paso?",
        opciones: [
          "Crear tu propia API real: dotnet new webapi y aplicar todo esto",
          "Memorizar la documentación entera antes de programar",
          "Esperar a .NET 11 para empezar",
          "Volver a hacer solo quizzes",
        ],
        correcta: 0,
        explicacion:
          "Se aprende construyendo. Empieza con una API pequeña (tareas, gastos, recetas…) con EF Core y autenticación, y súbela a GitHub.",
      },
    ],
  },
];
