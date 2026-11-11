// Todo el contenido de la web vive aquí. Añadir un proyecto = añadir un objeto a `projects`.
export const profile = {
  name: "Santiago Cardona",
  role: "Estudiante de 2.º de DAM · Desarrollador Backend Java Junior",
  location: "Madrid, España",
  email: "scardonav07@gmail.com",
  linkedin: "https://www.linkedin.com/in/santiago-cardona-v07",
  github: "https://github.com/santiagocardona0",
  cv: "/CV_Santiago_Cardona_Backend_Java.pdf", // el PDF va en public/CV_Santiago_Cardona_Backend_Java.pdf
};

export const status = "disponible para prácticas o puesto junior · Madrid";

// Stack a simple vista (aparece bajo el título, para que se lea antes que nada)
export const stackGlance = "Java · JDBC · SQL · PostgreSQL · MySQL · Maven · Git · Python · Spring Boot (aprendiendo)";

export const about =
  "Estoy construyendo mi camino en el desarrollo de software, con especial interés en el backend y en cómo funcionan las cosas detrás de una aplicación. Me importa escribir código limpio y bien estructurado: separar responsabilidades, pensar la arquitectura (DDD, capas) y que todo sea fácil de mantener. Por eso empecé con JDBC: quiero entender bien cómo se accede a los datos para dar el salto a JPA e Hibernate sobre unas bases sólidas. Estudio 2.º de DAM y centro mi aprendizaje en Java, programación orientada a objetos, SQL y Python; también estoy empezando con Spring Boot. Me gusta aprender construyendo. Uso la IA como apoyo para investigar y entender código, sin dejar de revisar lo que hago. Busco unas prácticas o una oportunidad junior donde aportar, asumir retos y seguir mejorando.";

export const skills = [
  { group: "Lenguajes", items: "Java, Python, SQL; conocimientos de JavaScript, HTML y CSS" },
  { group: "Java y backend", items: "programación orientada a objetos (POO), colecciones, gestión de excepciones, JDBC, fundamentos de APIs REST y JSON" },
  { group: "Bases de datos", items: "PostgreSQL, MySQL" },
  { group: "Herramientas", items: "Spring Boot (en aprendizaje; después JPA/Hibernate), Git, GitHub, Maven" },
  { group: "Fundamentos", items: "estructuras de datos, algoritmos, separación de responsabilidades, patrones de diseño" },
];

export const education = [
  { period: "2025 – 2027", title: "CFGS Desarrollo de Aplicaciones Multiplataforma (DAM) · en curso", school: "IES Virgen de la Paloma, Madrid" },
  { period: "2024", title: "Técnico en Programación de Software", school: "SENA (Servicio Nacional de Aprendizaje), Colombia" },
];

export const languages = "Español (nativo) · Inglés (B1, en mejora)";

// Bloques del README en estilo consola
export type ReadmeBlock =
  | { t: "cmd"; text: string }
  | { t: "h1" | "h2" | "p"; text: string }
  | { t: "list"; items: string[] }
  | { t: "pre"; text: string }
  | { t: "code"; text: string };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  status?: string;
  url?: string;
  repo?: string;
  readme?: ReadmeBlock[]; // se muestra al hacer clic en la tarjeta
};

// Fragmento de código REAL de tu repositorio (solo se ha ajustado la indentación).
const snippet: string | null = `@Override
public List<Empresa> findByNombreContaining(String nombre) {
    String sql = "SELECT * FROM empresa WHERE nombre LIKE ?";
    List<Empresa> empresas = new ArrayList<>();
    try (Connection connection = DatabaseConnection.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql);) {
        statement.setString(1, "%" + nombre + "%");
        try (ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Empresa empresa = new Empresa(
                        resultSet.getLong("id"),
                        resultSet.getString("nombre"),
                        resultSet.getString("cif")
                );
                empresas.add(empresa);
            }
        }
    } catch (SQLException e) {
        throw new RuntimeException("Error al buscar empresas por nombre", e);
    }
    return empresas;
}`;

const snippetNotes = [
  "try-with-resources: la conexión, el PreparedStatement y el ResultSet se cierran solos.",
  "El valor buscado entra con setString, no se concatena dentro del SQL.",
  "Cada fila del ResultSet se convierte en un objeto Empresa.",
  "Si falla el SQL, se lanza una excepción con un mensaje claro y la causa original.",
];

const jdbc: Project = {
  slug: "jdbc-empresas",
  title: "Proyecto JDBC",
  summary:
    "Aplicación en Java que gestiona empresas, departamentos y empleados sobre PostgreSQL, con acceso a datos mediante JDBC puro (sin ORM), estructura DDD y patrón Repository.",
  stack: ["Java", "JDBC", "PostgreSQL", "SQL", "Git y GitHub", "IntelliJ IDEA"],
  repo: "https://github.com/santiagocardona0/Sistema_de_gestion_JDBC",
  readme: [
    { t: "cmd", text: "cat README.md" },
    { t: "h1", text: "Gestión de empresas, departamentos y empleados" },
    { t: "p", text: "Es una aplicación en Java que guarda y gestiona los datos de empresas, departamentos y empleados en una base de datos PostgreSQL." },

    { t: "h2", text: "Por qué lo hice" },
    { t: "p", text: "Quería entender cómo se comunica una aplicación con una base de datos relacional y cómo organizar el código para que sea fácil de mantener. Empecé con JDBC a propósito: así sé qué pasa por debajo antes de usar JPA e Hibernate." },

    { t: "h2", text: "Qué problema resuelve" },
    { t: "p", text: "Mantiene la información de una empresa (sus departamentos y empleados) en una base de datos y permite consultarla y modificarla, con el código ordenado en capas para que el acceso a los datos quede separado del resto de la aplicación." },

    { t: "h2", text: "Qué hace" },
    {
      t: "list",
      items: [
        "Crea, consulta, actualiza y borra empresas, departamentos y empleados (CRUD).",
        "Busca datos por atributos y por las relaciones entre las tres entidades.",
        "Usa Optional para los resultados que pueden no existir.",
      ],
    },

    { t: "h2", text: "Cómo está organizado" },
    { t: "cmd", text: "tree" },
    {
      t: "pre",
      text: [
        "├── domain",
        "│   ├── model            las entidades del dominio",
        "│   └── repository       los contratos (interfaces) de los repositorios",
        "└── infrastructure",
        "    ├── database         el acceso a la base de datos",
        "    └── repository       la implementación de esos contratos con JDBC",
      ].join("\n"),
    },

    { t: "h2", text: "Decisiones que tomé" },
    {
      t: "list",
      items: [
        "JDBC puro, sin ORM: escribo yo las consultas SQL y el paso de filas a objetos.",
        "Consultas con PreparedStatement y lectura de resultados con ResultSet.",
        "Patrón Repository con interfaces genéricas: cada entidad tiene su contrato y una implementación con JDBC.",
        "Capas inspiradas en DDD: el dominio define qué necesita y la infraestructura lo implementa.",
      ],
    },

    ...(snippet
      ? ([
          { t: "h2", text: "Un fragmento del código" },
          { t: "code", text: snippet },
          { t: "list", items: snippetNotes },
        ] as ReadmeBlock[])
      : []),

    { t: "h2", text: "Tecnologías" },
    { t: "p", text: "Java · JDBC · PostgreSQL · SQL · Git y GitHub · IntelliJ IDEA" },

    { t: "h2", text: "Qué me llevo" },
    { t: "p", text: "Practicar programación orientada a objetos, arquitectura de software y acceso a datos. Es la base para seguir con Spring Boot y JPA." },
  ],
};

export const projects: Project[] = [jdbc];