import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');
const workDirectory = path.join(contentDirectory, 'work');

export interface WorkFrontmatter {
  title: string;
  slug: string;
  summary: string;
  services: string[];
  cover: string;
  beforeImage?: string;
  afterImage?: string;
  website?: string;
  gallery?: string[];
  metrics?: {
    lighthouse?: number;
    conversion?: string;
    bounce?: string;
  };
  publishedAt: string;
  featured?: boolean;
}

export interface WorkPost {
  slug: string;
  frontmatter: WorkFrontmatter;
  content: string;
}

export async function getAllWork(): Promise<WorkPost[]> {
  try {
    if (!fs.existsSync(workDirectory)) {
      return [];
    }

    const files = fs.readdirSync(workDirectory).filter((file) => file.endsWith('.mdx'));

    const works = files.map((file) => {
      const filePath = path.join(workDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      return {
        slug: file.replace('.mdx', ''),
        frontmatter: data as WorkFrontmatter,
        content,
      };
    });

    // Sort by publishedAt date, newest first
    return works.sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime()
    );
  } catch (error) {
    console.error('Error loading work posts:', error);
    return [];
  }
}

export async function getWorkBySlug(slug: string): Promise<WorkPost | null> {
  try {
    const filePath = path.join(workDirectory, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      frontmatter: data as WorkFrontmatter,
      content,
    };
  } catch (error) {
    console.error(`Error loading work post ${slug}:`, error);
    return null;
  }
}

export async function getFeaturedWork(): Promise<WorkPost[]> {
  const allWork = await getAllWork();
  return allWork.filter((work) => work.frontmatter.featured).slice(0, 3);
}
