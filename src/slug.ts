export function generateSlug(title: string): string {
    return title
      .toLowerCase() // Convert to lowercase
      .trim() // Remove extra spaces
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove duplicate hyphens
}
