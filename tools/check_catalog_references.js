/**
 * Validate canonical catalog IDs and report generated-page references.
 *
 * Run from the project root:
 *   node tools/check_catalog_references.js
 */

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const ITEMS_DIR = path.join(ROOT, "items");
const MAIN_PAGES = [
  "index.html",
  "fragrance.html",
  "couture.html",
  "accessories.html",
  "lookbook.html",
  "about.html",
  "contact.html",
];

const source = fs.readFileSync(path.join(ROOT, "data", "products.js"), "utf8");
const context = {};
vm.createContext(context);
vm.runInContext(
  `${source}
globalThis.__catalog = {
  products: EMPEROR_PRODUCTS,
  lookbookIds: EMPEROR_LOOKBOOK_PRODUCT_IDS,
  imageCredits: EMPEROR_IMAGE_CREDITS
};`,
  context,
);

const { products, lookbookIds, imageCredits } = context.__catalog;
const ids = products.map((product) => product.id);
const catalogIds = new Set(ids);
const errors = [];

for (const id of catalogIds) {
  const count = ids.filter((candidate) => candidate === id).length;
  if (count !== 1) errors.push(`Catalog ID "${id}" is defined ${count} times.`);
}

if (catalogIds.size !== products.length) {
  errors.push("The product catalog contains duplicate IDs.");
}

const slugs = products.map((product) => product.slug);
if (new Set(slugs).size !== slugs.length) {
  errors.push("The product catalog contains duplicate slugs.");
}

products.forEach((product) => {
  if (!fs.existsSync(path.join(ROOT, product.image))) {
    errors.push(`Missing image for "${product.id}": ${product.image}`);
  }
});

Object.keys(imageCredits).forEach((id) => {
  if (!catalogIds.has(id)) errors.push(`Image credit references unknown product ID "${id}".`);
});

if (new Set(lookbookIds).size !== lookbookIds.length) {
  errors.push("The lookbook contains duplicate ID references.");
}

lookbookIds.forEach((id) => {
  if (!catalogIds.has(id)) errors.push(`Unknown lookbook ID "${id}".`);
});

const itemFiles = fs
  .readdirSync(ITEMS_DIR)
  .filter((file) => file.endsWith(".html"))
  .sort();
const expectedItemFiles = products.map((product) => `${product.slug}.html`).sort();

if (JSON.stringify(itemFiles) !== JSON.stringify(expectedItemFiles)) {
  errors.push("Generated item files do not exactly match the canonical catalog.");
}

const pageFiles = [...MAIN_PAGES, ...itemFiles.map((file) => path.join("items", file))];
const referenceCounts = new Map(ids.map((id) => [id, 0]));

pageFiles.forEach((relativePath) => {
  const html = fs.readFileSync(path.join(ROOT, relativePath), "utf8");
  const pageIds = [...html.matchAll(/data-product-id="([^"]+)"/g)].map((match) => match[1]);
  const pageCounts = new Map();

  pageIds.forEach((id) => {
    if (!catalogIds.has(id)) {
      errors.push(`${relativePath} references unknown product ID "${id}".`);
      return;
    }
    referenceCounts.set(id, referenceCounts.get(id) + 1);
    pageCounts.set(id, (pageCounts.get(id) || 0) + 1);
  });

  pageCounts.forEach((count, id) => {
    if (count > 1) errors.push(`${relativePath} renders product ID "${id}" ${count} times.`);
  });

  if (/Skincare|skincare\.html|hustle-culture-tee|Hustle Culture Tee/i.test(html)) {
    errors.push(`${relativePath} contains retired catalog content.`);
  }
});

console.log("id | data definitions | lookbook references | generated page references");
products.forEach((product) => {
  const lookbookCount = lookbookIds.filter((id) => id === product.id).length;
  console.log(`${product.id} | 1 | ${lookbookCount} | ${referenceCounts.get(product.id)}`);
});

if (errors.length) {
  console.error("\nValidation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `\nPASS: ${products.length} unique catalog IDs, ${lookbookIds.length} unique lookbook references, and no duplicate product card within any generated page.`,
  );
}
