---
name: "janzsh.com"
year: "2026"
type: "personal"
kind: "fullstack"
role: "Autor"
summary: "Este portafolio: sitio estático bilingüe con Astro e islas de Preact, contenido validado con Zod y verificación automática de pruebas, accesibilidad y rendimiento en cada pull request."
skills: ["Astro", "TypeScript", "Preact", "SCSS", "Zod", "Vitest"]
repo: "https://github.com/janzsh/portfolio"
featured: true
order: 3
---
**Problema.** Un portafolio en dos idiomas que cargue rápido, sea accesible y se pueda cambiar sin miedo a romperlo.

**Enfoque.** HTML estático por defecto e islas de Preact solo donde hay interacción. El contenido vive en colecciones validadas con Zod y los textos de interfaz en diccionarios tipados: si falta una traducción, no compila. Estilos en SCSS con BEM y tokens de tema claro y oscuro. La lógica se desarrolla con TDD en Vitest, y el formulario de contacto valida en el servidor y limita los envíos.

**Resultado.** Lighthouse 100 en las cuatro categorías en móvil y escritorio, sin infracciones de axe-core y más de 190 pruebas. La CI repite esas comprobaciones en cada pull request. Lo construí con asistencia de IA (Claude Code), siguiendo las convenciones documentadas en el repositorio.
