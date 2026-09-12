const fs = require('node:fs/promises');
const path = require('node:path');
const matter = require('gray-matter');

function clean(text) {
  return text.replace(/^import .*$/gm, '').replace(/<TabItem\b[^>]*\blabel="([^"]+)"[^>]*>/g, '$1 ').replace(/<[^>]+>/g, ' ')
    .replace(/!?\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\{#[^}]+\}/g, '').replace(/[`*_>#|]/g, '').replace(/\s+/g, ' ').trim();
}
module.exports = function localSearch(context) {
  const docsDir = path.join(context.siteDir, 'docs');
  return {
    name: 'sefaris-local-search',
    getPathsToWatch: () => [path.join(docsDir, '**/*.{md,mdx}')],
    async loadContent() {
      async function walk(dir) {
        const files = await fs.readdir(dir, {withFileTypes: true});
        return (await Promise.all(files.map(async file => file.isDirectory()
          ? walk(path.join(dir, file.name))
          : /\.mdx?$/.test(file.name) ? [path.join(dir, file.name)] : []))).flat();
      }
      const entries = [];
      for (const file of await walk(docsDir)) {
        const {data, content} = matter(await fs.readFile(file, 'utf8'));
        const slug = data.slug || path.basename(file).replace(/\.mdx?$/, '');
        const route = slug === '/' ? '/' : `/${String(slug).replace(/^\/+|\/+$/g, '')}/`;
        entries.push({title: data.title, page: data.title, url: route, text: clean(data.description || content.slice(0, 600))});
        // Jawne kotwice są stabilne również po zmianie polskiego tytułu.
        const sections = [...content.matchAll(/^#{2,3}\s+(.+?)\s+\{#([^}]+)\}\s*$/gm)];
        sections.forEach((section, i) => {
          const body = content.slice(section.index + section[0].length, sections[i + 1]?.index ?? content.length);
          entries.push({title: clean(section[1]), page: data.title, url: `${route}#${section[2]}`, text: clean(body)});
        });
      }
      return entries;
    },
    async contentLoaded({content, actions}) { actions.setGlobalData({entries: content}); },
  };
};
