// Curso de ASP.NET Core (.NET 10) — contenido de módulos y ejercicios.
//
// Tipos de ejercicio:
//  - quiz:    pregunta con opciones, una correcta (índice `correcta`).
//  - huecos:  código con ranuras `{0}`, `{1}`… que se rellenan tocando fichas.
//             `respuestas` = token correcto de cada ranura, `banco` incluye distractores.
//  - ordenar: construir la secuencia correcta tocando fichas.
//             `items` en orden correcto; `tokens:true` = fichas en línea (código),
//             sin él = líneas apiladas.
//
// Cualquier ejercicio puede llevar `parte`: subtítulo de sección que se muestra
// bajo el nombre del módulo (para módulos largos divididos en partes).

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
        pregunta: "Fin de la teoría 🎓 ¿Qué toca ahora?",
        opciones: [
          "El módulo final: construir GastosAPI, una aplicación completa de principio a fin 🏆",
          "Memorizar la documentación entera antes de programar",
          "Esperar a .NET 11 para empezar",
          "Volver a hacer solo quizzes",
        ],
        correcta: 0,
        explicacion:
          "Se aprende construyendo. En el siguiente módulo montarás una API real pieza a pieza: modelo, base de datos, registro, login con JWT y endpoints protegidos.",
      },
    ],
  },
  {
    id: "app-completa",
    icono: "🏆",
    titulo: "App completa: GastosAPI",
    descripcion: "Construye una API real de principio a fin",
    ejercicios: [
      // ---- Parte 1 · El plan y el modelo de datos ----
      {
        tipo: "quiz",
        parte: "Parte 1 · El plan y el modelo de datos",
        pregunta: "Vas a construir GastosAPI: cada usuario registra sus gastos y solo puede ver los suyos. ¿Qué piezas necesita como mínimo?",
        opciones: [
          "Modelo de datos, base de datos, registro/login y endpoints protegidos",
          "Solo endpoints GET, el resto es opcional",
          "Un frontend en Angular antes que nada",
          "Un servidor dedicado y Kubernetes",
        ],
        correcta: 0,
        explicacion:
          "Antes de escribir código, piensa las piezas: QUÉ datos guardas (modelo), DÓNDE (base de datos), QUIÉN entra (auth) y CÓMO se accede (endpoints). Este módulo las construye en ese orden.",
      },
      {
        tipo: "huecos",
        parte: "Parte 1 · El plan y el modelo de datos",
        enunciado: "Define las dos entidades del dominio:",
        codigo:
          "public class Usuario\n{\n    public int Id { get; set; }\n    public string Email { get; set; } = \"\";\n    public string {0} { get; set; } = \"\";\n    public List<Gasto> Gastos { get; set; } = new();\n}\n\npublic class Gasto\n{\n    public int Id { get; set; }\n    public string Concepto { get; set; } = \"\";\n    public decimal Cantidad { get; set; }\n    public int {1} { get; set; }\n}",
        respuestas: ["PasswordHash", "UsuarioId"],
        banco: ["PasswordHash", "UsuarioId", "Password", "UsuarioEmail", "Clave"],
        explicacion:
          "Nunca se guarda la contraseña, solo su hash. UsuarioId es la clave foránea: cada gasto pertenece a un usuario.",
      },
      {
        tipo: "quiz",
        parte: "Parte 1 · El plan y el modelo de datos",
        pregunta: "¿Qué relación hay entre Usuario y Gasto?",
        opciones: [
          "Uno a muchos: un usuario tiene muchos gastos, cada gasto tiene un usuario",
          "Muchos a muchos: hace falta una tabla intermedia",
          "Uno a uno: un usuario, un gasto",
          "Ninguna, son tablas independientes",
        ],
        correcta: 0,
        explicacion:
          "La lista Gastos en Usuario y la FK UsuarioId en Gasto definen la relación 1:N. EF Core la detecta por convención, sin configuración extra.",
      },
      // ---- Parte 2 · La base de datos ----
      {
        tipo: "huecos",
        parte: "Parte 2 · La base de datos",
        enunciado: "Crea el DbContext con sus dos tablas:",
        codigo:
          "public class GastosDb : DbContext\n{\n    public GastosDb(DbContextOptions<GastosDb> options) : base(options) { }\n\n    public {0}<Usuario> Usuarios => Set<Usuario>();\n    public {1}<Gasto> Gastos => Set<Gasto>();\n}",
        respuestas: ["DbSet", "DbSet"],
        banco: ["DbSet", "DbSet", "DbTable", "List", "Entity"],
        explicacion:
          "Cada DbSet es una tabla consultable con LINQ. Con esto EF Core ya conoce el modelo completo de GastosAPI.",
      },
      {
        tipo: "huecos",
        parte: "Parte 2 · La base de datos",
        enunciado: "Registra el contexto con SQLite en Program.cs:",
        codigo: "builder.Services.{0}<GastosDb>(opt =>\n    opt.{1}(\"Data Source=gastos.db\"));",
        respuestas: ["AddDbContext", "UseSqlite"],
        banco: ["AddDbContext", "UseSqlite", "AddDatabase", "UseSqlServer", "OpenDb"],
        explicacion:
          "SQLite es perfecto para desarrollar: un archivo, sin servidor. Cambiar a SQL Server o PostgreSQL en producción es cambiar esta línea.",
      },
      {
        tipo: "ordenar",
        parte: "Parte 2 · La base de datos",
        enunciado: "Crea la base de datos a partir del modelo:",
        items: [
          "dotnet ef migrations add ModeloInicial",
          "dotnet ef database update",
          "Comprobar que se creó el archivo gastos.db",
        ],
        explicacion:
          "La migración captura el modelo en código; update lo aplica creando las tablas Usuarios y Gastos en gastos.db.",
      },
      // ---- Parte 3 · Registro de usuarios ----
      {
        tipo: "quiz",
        parte: "Parte 3 · Registro de usuarios",
        pregunta: "¿Por qué guardamos PasswordHash en vez de la contraseña?",
        opciones: [
          "Si roban la base de datos no obtienen contraseñas: el hash no se puede revertir",
          "Porque el hash ocupa menos espacio",
          "Porque las contraseñas no caben en un string",
          "Es solo una convención de nombres",
        ],
        correcta: 0,
        explicacion:
          "Un hash (con BCrypt, Argon2…) es de un solo sentido: al hacer login se vuelve a hashear lo que escribe el usuario y se comparan hashes. La contraseña original nunca se almacena.",
      },
      {
        tipo: "huecos",
        parte: "Parte 3 · Registro de usuarios",
        enunciado: "Completa el endpoint de registro:",
        codigo:
          "app.MapPost(\"/auth/registro\", async (RegistroDto dto, GastosDb db) =>\n{\n    if (await db.Usuarios.{0}(u => u.Email == dto.Email))\n        return Results.{1}();\n\n    var usuario = new Usuario\n    {\n        Email = dto.Email,\n        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)\n    };\n    db.Usuarios.Add(usuario);\n    await db.{2}();\n    return Results.Created($\"/usuarios/{usuario.Id}\", usuario.Email);\n});",
        respuestas: ["AnyAsync", "Conflict", "SaveChangesAsync"],
        banco: ["AnyAsync", "Conflict", "SaveChangesAsync", "FirstAsync", "Ok", "Commit"],
        explicacion:
          "AnyAsync comprueba si el email ya existe sin traer datos. Conflict devuelve 409. SaveChangesAsync escribe el nuevo usuario en la base de datos.",
      },
      {
        tipo: "quiz",
        parte: "Parte 3 · Registro de usuarios",
        pregunta: "Alguien se registra con un email que ya existe. ¿Qué responde GastosAPI?",
        opciones: [
          "409 Conflict: el recurso choca con uno existente",
          "200 OK con el usuario antiguo",
          "500 Internal Server Error",
          "404 Not Found",
        ],
        correcta: 0,
        explicacion:
          "Cada situación tiene su código: 409 dice exactamente \"esto choca con algo que ya existe\". El cliente puede mostrar \"ese email ya está registrado\".",
      },
      // ---- Parte 4 · Login con JWT ----
      {
        tipo: "ordenar",
        parte: "Parte 4 · Login con JWT",
        enunciado: "Ordena el flujo del endpoint de login:",
        items: [
          "Recibir email y contraseña (LoginDto)",
          "Buscar el usuario por email en la base de datos",
          "Verificar la contraseña contra el PasswordHash",
          "Generar el token JWT con los datos del usuario",
          "Devolver el token al cliente",
        ],
        explicacion:
          "Si el usuario no existe o el hash no coincide, se devuelve 401 sin decir cuál de las dos cosas falló (para no dar pistas a atacantes).",
      },
      {
        tipo: "huecos",
        parte: "Parte 4 · Login con JWT",
        enunciado: "Genera el token con la identidad del usuario dentro:",
        codigo:
          "var claims = new[]\n{\n    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),\n    new Claim(ClaimTypes.Email, usuario.Email)\n};\n\nvar token = new JwtSecurityToken(\n    claims: claims,\n    {0}: DateTime.UtcNow.AddHours(8),\n    signingCredentials: credenciales);\n\nreturn Results.Ok(new JwtSecurityTokenHandler().{1}(token));",
        respuestas: ["expires", "WriteToken"],
        banco: ["expires", "WriteToken", "timeout", "Serialize", "Encode"],
        explicacion:
          "Los claims viajan firmados dentro del token: el id del usuario irá en cada petición sin consultar la base de datos. expires limita su vida útil.",
      },
      {
        tipo: "quiz",
        parte: "Parte 4 · Login con JWT",
        pregunta: "¿Para qué guardamos el Id del usuario como claim en el token?",
        opciones: [
          "En cada petición sabremos QUIÉN llama leyendo el token, sin ir a la base de datos",
          "Para que el frontend pinte el id en pantalla",
          "Es obligatorio, sin id el token no compila",
          "Para poder cambiar la contraseña después",
        ],
        correcta: 0,
        explicacion:
          "El token va firmado: nadie puede falsificar el claim. Los endpoints protegidos lo leerán para filtrar \"los gastos DE ESTE usuario\".",
      },
      {
        tipo: "ordenar",
        parte: "Parte 4 · Login con JWT",
        enunciado: "Activa la autenticación en el orden correcto:",
        items: [
          "builder.Services.AddAuthentication(\"Bearer\").AddJwtBearer(...);",
          "builder.Services.AddAuthorization();",
          "var app = builder.Build();",
          "app.UseAuthentication();",
          "app.UseAuthorization();",
        ],
        explicacion:
          "Primero se registran los servicios en el builder; tras Build() se añaden los middlewares: identificar al usuario (Authentication) siempre antes de comprobar permisos (Authorization).",
      },
      // ---- Parte 5 · Endpoints protegidos ----
      {
        tipo: "huecos",
        parte: "Parte 5 · Endpoints protegidos",
        enunciado: "Agrupa los endpoints de gastos y protégelos todos de una vez:",
        codigo: "var gastos = app.{0}(\"/gastos\").{1}();",
        respuestas: ["MapGroup", "RequireAuthorization"],
        banco: ["MapGroup", "RequireAuthorization", "MapRoute", "UseAuthorization", "Protect"],
        explicacion:
          "MapGroup crea un prefijo común y RequireAuthorization() sobre el grupo protege todos sus endpoints: sin token válido, 401 automático.",
      },
      {
        tipo: "huecos",
        parte: "Parte 5 · Endpoints protegidos",
        enunciado: "Devuelve SOLO los gastos del usuario que llama:",
        codigo:
          "gastos.MapGet(\"/\", async (ClaimsPrincipal user, GastosDb db) =>\n{\n    var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.{0})!);\n\n    var misGastos = await db.Gastos\n        .{1}(g => g.UsuarioId == usuarioId)\n        .ToListAsync();\n\n    return Results.Ok(misGastos);\n});",
        respuestas: ["NameIdentifier", "Where"],
        banco: ["NameIdentifier", "Where", "Email", "Select", "FindAsync"],
        explicacion:
          "ClaimsPrincipal es el usuario autenticado: de ahí sale el id que metimos en el token al hacer login. El Where garantiza que nadie ve gastos ajenos.",
      },
      {
        tipo: "ordenar",
        parte: "Parte 5 · Endpoints protegidos",
        enunciado: "Ordena el DELETE que comprueba que el gasto es tuyo:",
        items: [
          "gastos.MapDelete(\"/{id}\", async (int id, ClaimsPrincipal user, GastosDb db) =>",
          "{",
          "    var gasto = await db.Gastos.FindAsync(id);",
          "    if (gasto is null) return Results.NotFound();",
          "    if (gasto.UsuarioId != UsuarioIdDe(user)) return Results.Forbid();",
          "    db.Gastos.Remove(gasto); await db.SaveChangesAsync();",
          "    return Results.NoContent();",
          "});",
        ],
        explicacion:
          "Primero ¿existe? (404), luego ¿es tuyo? (403), y solo entonces se borra (204). Este patrón de autorización por propietario es clave en cualquier API multiusuario.",
      },
      {
        tipo: "quiz",
        parte: "Parte 5 · Endpoints protegidos",
        pregunta: "¿Cuál es la diferencia entre responder 401 y 403?",
        opciones: [
          "401: no sé quién eres (sin token válido); 403: sé quién eres pero no puedes hacer eso",
          "Son equivalentes, da igual cuál usar",
          "401 es para GET y 403 para DELETE",
          "403 solo se usa con formularios web",
        ],
        correcta: 0,
        explicacion:
          "En GastosAPI: llamar sin token → 401. Llamar con token pero intentar borrar el gasto de otro usuario → 403. Códigos precisos = clientes que saben qué hacer.",
      },
      // ---- Parte 6 · Validación y remate ----
      {
        tipo: "huecos",
        parte: "Parte 6 · Validación y remate",
        enunciado: "Blinda la entrada de datos con un DTO validado:",
        codigo:
          "public class CrearGastoDto\n{\n    [{0}]\n    public string Concepto { get; set; } = \"\";\n\n    [{1}(0.01, 100000)]\n    public decimal Cantidad { get; set; }\n}",
        respuestas: ["Required", "Range"],
        banco: ["Required", "Range", "NotEmpty", "Max", "Validate"],
        explicacion:
          "Sin validación, alguien podría crear gastos vacíos o negativos. Con DataAnnotations la petición inválida se rechaza con 400 antes de tocar tu lógica.",
      },
      {
        tipo: "quiz",
        parte: "Parte 6 · Validación y remate",
        pregunta: "¿Por qué los endpoints usan DTOs en vez de las entidades Usuario/Gasto directamente?",
        opciones: [
          "Para no exponer campos sensibles (¡PasswordHash!) y controlar exactamente qué entra y sale",
          "Porque las entidades no se pueden serializar a JSON",
          "Para que el código ocupe más líneas",
          "Es un requisito de SQLite",
        ],
        correcta: 0,
        explicacion:
          "Si devolvieras la entidad Usuario, el PasswordHash saldría en el JSON. El DTO define el contrato público de la API, independiente de la base de datos.",
      },
      {
        tipo: "ordenar",
        parte: "Parte 6 · Validación y remate",
        enunciado: "Repasa el Program.cs completo de GastosAPI:",
        items: [
          "var builder = WebApplication.CreateBuilder(args);",
          "// servicios: AddDbContext, AddAuthentication + AddJwtBearer, AddAuthorization",
          "var app = builder.Build();",
          "app.UseAuthentication();",
          "app.UseAuthorization();",
          "// endpoints: /auth/registro, /auth/login y el grupo protegido /gastos",
          "app.Run();",
        ],
        explicacion:
          "La foto completa: configurar servicios → construir la app → pipeline de seguridad → endpoints → Run. Toda API ASP.NET Core sigue este esqueleto.",
      },
      {
        tipo: "quiz",
        parte: "Parte 6 · Validación y remate",
        pregunta: "¡GastosAPI terminada! 🏆 ¿Cómo la harías crecer?",
        opciones: [
          "Añadir categorías e informes mensuales, escribir tests y desplegarla con Docker",
          "Reescribirla entera en otro framework",
          "Quitar la autenticación para simplificar",
          "Guardar las contraseñas en claro para depurar mejor",
        ],
        correcta: 0,
        explicacion:
          "Ya tienes el esqueleto de cualquier API profesional: modelo + EF Core + auth + endpoints protegidos + validación. Constrúyela de verdad en tu máquina: dotnet new webapi y a por ello 🚀",
      },
    ],
  },
];
