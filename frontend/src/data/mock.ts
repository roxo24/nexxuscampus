export const hardSkills = ['UX Research', 'React', 'Finanzas', 'Marketing', 'Python', 'Diseño de producto', 'Ventas B2B'];

export const softSkills = ['Comunicación', 'Liderazgo', 'Pensamiento crítico', 'Organización', 'Empatía'];

export const ventures = [
  {
    name: 'Vitrina Circular',
    category: 'Economía circular',
    copy: 'El marketplace universitario que da una segunda vida a materiales, libros y prototipos.',
    image: 'https://images.unsplash.com/photo-1787647561979-da6797612e4d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400',
    color: 'lime',
    progress: '4 de 6 perfiles',
    stage: 'Prototipo en validación',
    challenge: 'Cada ciclo se descartan miles de materiales, libros y prototipos que todavía tienen valor para otros estudiantes.',
    solution: 'Una vitrina segura para intercambiar, vender o donar recursos dentro de la comunidad universitaria.',
    impact: '1,240 kg',
    impactLabel: 'de materiales recuperados',
    needs: ['Desarrollo frontend', 'Marketing', 'Operaciones'],
  },
  {
    name: 'Aula Nómada',
    category: 'EdTech',
    copy: 'Aprendizaje breve, práctico y creado por estudiantes para estudiantes.',
    image: 'https://images.unsplash.com/photo-1758873272414-c0bf30332738?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400',
    color: 'violet',
    progress: '3 de 5 perfiles',
    stage: 'MVP en construcción',
    challenge: 'Los estudiantes con alta carga académica abandonan cursos largos aunque necesiten aprender habilidades concretas.',
    solution: 'Cápsulas de aprendizaje creadas por pares, con retos breves y resultados aplicables desde el primer día.',
    impact: '320',
    impactLabel: 'estudiantes en lista de espera',
    needs: ['Diseño UX', 'Creación de contenido', 'React'],
  },
  {
    name: 'Nexo Salud',
    category: 'HealthTech',
    copy: 'Una red de acompañamiento preventivo para comunidades universitarias.',
    image: 'https://images.unsplash.com/photo-1758873267964-66a045a75e25?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400',
    color: 'coral',
    progress: '5 de 7 perfiles',
    stage: 'Validación con usuarios',
    challenge: 'Muchas señales tempranas de estrés y agotamiento pasan desapercibidas hasta convertirse en una crisis.',
    solution: 'Una red preventiva de orientación, seguimiento y acceso temprano a recursos de bienestar universitario.',
    impact: '87%',
    impactLabel: 'reporta mayor sensación de apoyo',
    needs: ['Psicología', 'Data Analytics', 'Alianzas'],
  },
];

export const talent = [
  { id: 1, name: 'Valeria S.', career: 'Ingeniería Industrial', cycle: '8.º ciclo', skills: ['Finanzas', 'Excel avanzado', 'Pitch'], availability: 'Mar y jue · 18:00–21:00', rating: 4.9, match: 96, color: 'coral' },
  { id: 2, name: 'Diego R.', career: 'Diseño Digital', cycle: '7.º ciclo', skills: ['UX Research', 'Figma', 'Branding'], availability: 'Lun, mié y sáb · Tardes', rating: 4.8, match: 91, color: 'violet' },
  { id: 3, name: 'Lucía M.', career: 'Ciencia de Datos', cycle: '9.º ciclo', skills: ['Python', 'Analítica', 'IA aplicada'], availability: 'Vie y sáb · 09:00–14:00', rating: 4.7, match: 88, color: 'mint' },
  { id: 4, name: 'Mateo C.', career: 'Comunicación', cycle: '6.º ciclo', skills: ['Storytelling', 'Oratoria', 'Contenido'], availability: 'Lun a jue · Noches', rating: 4.9, match: 84, color: 'amber' },
  { id: 5, name: 'Ana Sofía R.', career: 'Ingeniería de Software', cycle: '7.º ciclo', skills: ['React', 'UI/UX', 'TypeScript'], availability: 'Lun, mié y vie · Tardes', rating: 4.8, match: 94, color: 'coral' },
  { id: 6, name: 'Mateo R.', career: 'Ciencia de Datos', cycle: '8.º ciclo', skills: ['Python', 'Base de datos', 'APIs'], availability: 'Mar y jue · Noches', rating: 4.6, match: 89, color: 'violet' },
  { id: 7, name: 'Valentina C.', career: 'Comunicación', cycle: '7.º ciclo', skills: ['Marketing', 'Investigación', 'Contenido'], availability: 'Lun a vie · Tardes', rating: 4.7, match: 86, color: 'amber' },
];

export const skillIcons: Record<string, string> = {
  'UX Research': 'search',
  React: 'atom',
  Finanzas: 'spark',
  Marketing: 'send',
  Python: 'code',
  'Diseño de producto': 'layers',
  'Ventas B2B': 'users',
  Comunicación: 'chat',
  Liderazgo: 'users',
  'Pensamiento crítico': 'brain',
  Organización: 'checklist',
  Empatía: 'heart',
};

export const skillDescriptions: Record<string, string> = {
  'UX Research': 'Diseño de experiencia',
  React: 'Desarrollo frontend',
  Finanzas: 'Gestión financiera',
  Marketing: 'Estrategia de crecimiento',
  Python: 'Desarrollo y datos',
  'Diseño de producto': 'Producto digital',
  'Ventas B2B': 'Desarrollo comercial',
};
