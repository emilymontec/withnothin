import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Catálogo inicial. Deliberadamente corto: la lista crece por
 * find-or-create a medida que los usuarios etiquetan posts, no
 * manteniendo aquí una lista exhaustiva.
 */
const TECHNOLOGIES: Array<{ name: string; slug: string; category: string }> = [
  { name: 'JavaScript', slug: 'javascript', category: 'language' },
  { name: 'TypeScript', slug: 'typescript', category: 'language' },
  { name: 'Python', slug: 'python', category: 'language' },
  { name: 'Kotlin', slug: 'kotlin', category: 'language' },
  { name: 'Java', slug: 'java', category: 'language' },
  { name: 'Go', slug: 'go', category: 'language' },
  { name: 'Rust', slug: 'rust', category: 'language' },
  { name: 'PHP', slug: 'php', category: 'language' },
  { name: 'React', slug: 'react', category: 'framework' },
  { name: 'Next.js', slug: 'nextjs', category: 'framework' },
  { name: 'NestJS', slug: 'nestjs', category: 'framework' },
  { name: 'Jetpack Compose', slug: 'jetpack-compose', category: 'framework' },
  { name: 'Node.js', slug: 'nodejs', category: 'runtime' },
  { name: 'PostgreSQL', slug: 'postgresql', category: 'database' },
  { name: 'Docker', slug: 'docker', category: 'infrastructure' },
  { name: 'Supabase', slug: 'supabase', category: 'infrastructure' },
];

async function main() {
  for (const tech of TECHNOLOGIES) {
    await prisma.technology.upsert({
      where: { slug: tech.slug },
      update: {},
      create: tech,
    });
  }
  // eslint-disable-next-line no-console
  console.log(`Seed completo: ${TECHNOLOGIES.length} tecnologías.`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
