import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  path: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slug: {
    type: "string",
    resolve: (doc) => {
      if (!doc._raw.flattenedPath) {
        throw new Error(`Missing flattenedPath for document: ${doc.title}`);
      }
      return doc._raw.flattenedPath.split("/").slice(1).join("/");
    },
  },
};

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: "./content/projects/**/*.mdx", // Updated path
  contentType: "mdx",
  fields: {
    published: {
      type: "boolean",
      default: false, // Default value for optional field
    },
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    date: {
      type: "date",
      default: new Date().toISOString(), // Default value for optional field
    },
    url: {
      type: "string",
      default: "", // Default value for optional field
    },
    repository: {
      type: "string",
      default: "", // Default value for optional field
    },
  },
  computedFields,
}));

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: "./content/pages/**/*.mdx", // Updated path
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      default: "", // Default value for optional field
    },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: 'app/components/content/projects',
  documentTypes: [Project],
  onSuccess: async (importedData) => {
    console.log('Contentlayer build successful!');
    console.log('Imported data:', importedData);
  },
  onError: async (error) => {
    console.error('Contentlayer build failed:', error);
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      rehypePrettyCode,
      [
        {
          theme: "github-dark",
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word--highlighted"];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});