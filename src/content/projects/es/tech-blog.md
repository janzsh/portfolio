---
name: "Blog técnico"
year: "2026"
type: "personal"
kind: "frontend"
role: "Autor"
summary: "Un blog técnico bilingüe con varios autores, rutas de aprendizaje y cursos, construido como un sistema pequeño: un núcleo compartido y módulos independientes sobre contenido tipado."
skills: ["Astro", "TypeScript", "Preact", "SCSS", "Zod", "Vitest"]
picture: "../../../assets/pictures/projects/tech-blog.png"
live: "https://blog.janzsh.com"
score: 75
---
**Problema.** Un blog en dos idiomas y con varios autores que pueda crecer hacia rutas de aprendizaje, cursos y noticias sin volverse un código enredado.

**Enfoque.** Astro estático con islas de Preact solo donde hay interacción. El código compartido vive en un `core` (modelo de contenido, i18n, componentes) y cada vista es un módulo independiente; un test falla si un módulo importa a otro o si `core` importa un módulo. Las vistas reciben datos tipados y un solo archivo sabe de dónde vienen, así que pasar de colecciones de contenido a una API toca un único lugar. Cada post, autor y categoría recibe un patrón generativo determinista a partir de su id, que sirve de portada, banner y avatar.

**Estado.** En producción, con CI que revisa tipos, tests y el build en cada pull request. Repositorio privado.
