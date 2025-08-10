import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Define the path to blog content
const contentDirectory = path.join(process.cwd(), 'content/blog');

// Define the structure for blog post metadata
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  html?: string;
}

/**
 * Get all blog posts with their metadata
 */
export function getAllPosts(): BlogPost[] {
  // Get all files from the blog directory
  const fileNames = fs.readdirSync(contentDirectory);
  
  // Process each file to extract metadata and content
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      // Get the slug by removing .md from the filename
      const slug = fileName.replace(/\.md$/, '');
      
      // Read the markdown file
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // Parse the front matter
      const { data, content } = matter(fileContents);
      
      // Return the combined data
      return {
        slug,
        title: data.title || 'Untitled Post',
        description: data.description || '',
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        content
      };
    });
  
  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
}

/**
 * Get a specific blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    // Construct file path
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    // Read file and parse frontmatter
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Convert markdown to HTML
    const html = marked(content);
    
    // Return the post data with HTML
    return {
      slug,
      title: data.title || 'Untitled Post',
      description: data.description || '',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      content,
      html
    };
  } catch (error) {
    console.error(`Error getting post by slug '${slug}':`, error);
    return null;
  }
}

/**
 * Get all blog post slugs
 */
export function getAllPostSlugs(): string[] {
  const fileNames = fs.readdirSync(contentDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''));
}
