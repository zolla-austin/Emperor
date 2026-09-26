/**
 * Generate the finished static HTML pages for EMPEROR.
 *
 * Run once from the project root:
 *   node tools/generate_pages.js
 *
 * This script has no dependencies and is not needed by Netlify.
 */

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const ITEMS_DIR = path.join(ROOT, "items");
const SITE_URL = "https://emperor001.netlify.app/";

function loadCatalog() {
  const source = fs.readFileSync(path.join(ROOT, "data", "products.js"), "utf8");
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    `${source}
globalThis.__catalog = {
  products: EMPEROR_PRODUCTS,
  lookbookIds: EMPEROR_LOOKBOOK_PRODUCT_IDS
};`,
    context,
  );
  return context.__catalog;
}

const { products, lookbookIds } = loadCatalog();
const productsById = new Map(products.map((product) => [product.id, product]));
const lookbookProducts = lookbookIds.map((id) => {
  const product = productsById.get(id);
  if (!product) throw new Error(`Unknown lookbook product ID: ${id}`);
  return product;
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPrice(product) {
  const amount = `₦${Number(product.price).toLocaleString("en-NG")}`;
  return product.priceNote ? `${product.priceNote} ${amount}` : amount;
}

function slugifyCategory(category) {
  return category.toLowerCase();
}

function pageHead({
  title,
  description,
  prefix = "",
  urlPath = "",
  image: _image = "images/lookbook-the-emperor-suit.webp",
  ogType = "website",
}) {
  const fullTitle = `${title} | EMPEROR — Lagos`;
  const canonicalUrl = new URL(urlPath, SITE_URL).href;
  const socialImageUrl = new URL("images/og-emperor.png", SITE_URL).href;

  return `  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(description)}" />
    <title>${escapeHtml(fullTitle)}</title>
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <link rel="icon" href="${prefix}images/favicon.png" type="image/png" sizes="512x512" />
    <link rel="icon" href="${prefix}images/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="${prefix}images/apple-touch-icon.png" />
    <meta property="og:site_name" content="EMPEROR — Lagos" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(socialImageUrl)}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="EMPEROR logo" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${escapeHtml(socialImageUrl)}" />
    <meta property="og:type" content="${escapeHtml(ogType)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@200;300;400;500&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="${prefix}css/styles.css" />
    <script src="${prefix}data/site-config.js" defer></script>
    <script src="${prefix}data/products.js" defer></script>
    <script src="${prefix}js/main.js" defer></script>
  </head>`;
}

function header(activePage, prefix = "") {
  const links = [
    ["Home", "index.html", "home"],
    ["Fragrance", "fragrance.html", "fragrance"],
    ["Couture", "couture.html", "couture"],
    ["Accessories", "accessories.html", "accessories"],
    ["Lookbook", "lookbook.html", "lookbook"],
    ["About", "about.html", "about"],
    ["Contact", "contact.html", "contact"],
  ];

  const navigation = links
    .map(
      ([label, href, key]) =>
        `<li><a class="site-nav__link" href="${prefix}${href}"${
          key === activePage ? ' aria-current="page"' : ""
        }>${label}</a></li>`,
    )
    .join("\n            ");

  return `    <a class="skip-link" href="#main-content">Skip to content</a>

    <header class="site-header">
      <div class="header-inner container">
        <a class="site-logo" href="${prefix}index.html" aria-label="EMPEROR home">Emperor</a>
        <button
          class="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-controls="primary-navigation"
          aria-expanded="false"
          data-menu-toggle
        >
          <span class="menu-toggle__lines" aria-hidden="true"></span>
        </button>
        <nav class="site-nav" id="primary-navigation" aria-label="Primary navigation" data-site-nav>
          <ul class="site-nav__list">
            ${navigation}
          </ul>
        </nav>
      </div>
    </header>`;
}

const whatsappIcon = `<svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.04 2a9.84 9.84 0 0 0-8.47 14.84L2 22l5.29-1.53A9.97 9.97 0 1 0 12.04 2Zm0 17.98a8 8 0 0 1-4.08-1.12l-.29-.17-3.14.91.93-3.06-.19-.31a7.96 7.96 0 1 1 6.77 3.75Zm4.38-5.97c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19a7.2 7.2 0 0 1-1.33-1.65c-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
              </svg>`;

const instagramIcon = `<svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm10.5 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
              </svg>`;

function footer(prefix = "") {
  return `    <footer class="site-footer">
      <div class="footer-main container">
        <div>
          <p class="footer-logo">Emperor</p>
          <p class="footer-tagline">Luxury fragrance, couture, and accessories — curated in Lagos.</p>
        </div>
        <div>
          <h2 class="footer-heading">Explore</h2>
          <ul class="footer-links">
            <li><a href="${prefix}index.html">Home</a></li>
            <li><a href="${prefix}fragrance.html">Fragrance</a></li>
            <li><a href="${prefix}couture.html">Couture</a></li>
            <li><a href="${prefix}accessories.html">Accessories</a></li>
            <li><a href="${prefix}lookbook.html">Lookbook</a></li>
            <li><a href="${prefix}about.html">About</a></li>
            <li><a href="${prefix}contact.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-heading">Private Enquiries</h2>
          <div class="footer-contact">
            <a href="#" target="_blank" rel="noopener" data-whatsapp-link>
              <span data-whatsapp-label>WhatsApp</span>
            </a>
            <a href="#" data-phone-link><span data-phone-label>Call</span></a>
          </div>
          <div class="social-links" aria-label="Social links">
            <a
              class="social-link"
              href="#"
              target="_blank"
              rel="noopener"
              aria-label="Contact EMPEROR on WhatsApp"
              data-whatsapp-link
            >
              ${whatsappIcon}
            </a>
            <a
              class="social-link"
              href="#"
              target="_blank"
              rel="noopener"
              aria-label="EMPEROR on Instagram"
              data-instagram-link
            >
              ${instagramIcon}
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <p>© <span data-current-year>2026</span> EMPEROR Lagos. All rights reserved.</p>
        </div>
      </div>
    </footer>`;
}

function breadcrumb(items, prefix = "") {
  const markup = items
    .map((item, index) => {
      const isLast = index === items.length - 1;
      return `<li class="breadcrumb__item"${
        isLast ? ' aria-current="page"' : ""
      }>${item.href && !isLast ? `<a href="${prefix}${item.href}">${escapeHtml(item.label)}</a>` : escapeHtml(item.label)}</li>`;
    })
    .join("\n          ");

  return `      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol class="breadcrumb__list container">
          ${markup}
        </ol>
      </nav>`;
}

function itemCard(product, { prefix = "", itemHrefPrefix = "items/" } = {}) {
  const subcategory = product.subcategory ? ` · ${escapeHtml(product.subcategory)}` : "";
  return `          <article class="item-card" data-product-id="${escapeHtml(product.id)}"${
    product.subcategory ? ` data-subcategory="${escapeHtml(product.subcategory)}"` : ""
  }>
            <a class="item-card__link" href="${itemHrefPrefix}${escapeHtml(product.slug)}.html" aria-label="View ${escapeHtml(product.name)}">
              <div class="item-card__media">
                <img
                  class="item-card__image"
                  src="${prefix}${escapeHtml(product.image)}"
                  alt="${escapeHtml(product.imageAlt)}"
                  loading="lazy"
                  decoding="async"
                />
                ${product.badge ? `<p class="item-card__badge">${escapeHtml(product.badge)}</p>` : ""}
              </div>
              <div class="item-card__content">
                <p class="item-card__category">${escapeHtml(product.category)}${subcategory}</p>
                <h3 class="item-card__title">${escapeHtml(product.name)}</h3>
                <p class="item-card__description">${escapeHtml(product.description)}</p>
                <div class="item-card__footer">
                  <span class="item-card__price">${escapeHtml(formatPrice(product))}</span>
                  <span class="item-card__action">View Piece</span>
                </div>
              </div>
            </a>
          </article>`;
}

function lookbookCard(product, prefix = "") {
  return `          <article class="lookbook-card" data-product-id="${escapeHtml(product.id)}">
            <a href="${prefix}items/${escapeHtml(product.slug)}.html" aria-label="View ${escapeHtml(product.name)}">
              <img
                class="lookbook-card__image"
                src="${prefix}${escapeHtml(product.image)}"
                alt="${escapeHtml(product.imageAlt)}"
                loading="lazy"
                decoding="async"
              />
              <div class="lookbook-card__content">
                <h2 class="lookbook-card__title">${escapeHtml(product.name)}</h2>
                <p class="lookbook-card__meta">${escapeHtml(formatPrice(product))}</p>
              </div>
            </a>
          </article>`;
}

function documentShell({ head, body }) {
  return `<!doctype html>
<html lang="en">
${head}
  <body>
${body}
  </body>
</html>
`;
}

function generateHome() {
  const featured = products.filter((product) => product.featured);
  const preview = lookbookProducts.filter((product) => !product.featured).slice(0, 4);

  const body = `${header("home")}

    <main id="main-content">
      <section class="hero" style="background-image: url('images/lookbook-the-emperor-suit.webp')">
        <div class="hero__content container">
          <p class="eyebrow">Lagos · Est. MMXXIV · Couture Maison</p>
          <h1 class="display-title">Define<br /><em>Your Legacy.</em></h1>
          <p class="lead">For those who were born to reign.</p>
          <div class="hero__actions">
            <a class="button button--solid" href="#collections">Explore the Collections</a>
            <a class="button" href="lookbook.html">View Lookbook</a>
          </div>
        </div>
      </section>

      <section class="section" id="collections" aria-labelledby="collections-title">
        <div class="container">
          <div class="section-heading">
            <div>
              <p class="eyebrow">The Emperor World</p>
              <h2 class="section-title" id="collections-title">Three Expressions<br /><em>of Luxury</em></h2>
            </div>
          </div>
          <div class="category-grid">
            <a class="category-card" href="fragrance.html">
              <img class="category-card__image" src="images/seduction-royale.webp" alt="Séduction Royale fragrance" loading="lazy" decoding="async" />
              <div class="category-card__content">
                <p class="category-card__label">Collection I</p>
                <h3 class="category-card__title">Fragrance</h3>
                <span class="category-card__action">Enter the Atelier</span>
              </div>
            </a>
            <a class="category-card" href="couture.html">
              <img class="category-card__image" src="images/the-emperor-suit.webp" alt="The Emperor Suit" loading="lazy" decoding="async" />
              <div class="category-card__content">
                <p class="category-card__label">Collection II</p>
                <h3 class="category-card__title">Couture</h3>
                <span class="category-card__action">Enter the Gallery</span>
              </div>
            </a>
            <a class="category-card" href="accessories.html">
              <img class="category-card__image" src="images/the-regent-cufflinks.webp" alt="The Regent Cufflinks" loading="lazy" decoding="async" />
              <div class="category-card__content">
                <p class="category-card__label">Collection III</p>
                <h3 class="category-card__title">Accessories</h3>
                <span class="category-card__action">Enter the Cabinet</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="featured-title">
        <div class="container">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Selected by the Maison</p>
              <h2 class="section-title" id="featured-title">Featured<br /><em>Work</em></h2>
            </div>
          </div>
          <div class="item-grid">
${featured.map((product) => itemCard(product)).join("\n")}
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="lookbook-preview-title">
        <div class="container">
          <div class="section-heading">
            <div>
              <p class="eyebrow">The Gallery</p>
              <h2 class="section-title" id="lookbook-preview-title">Emperor<br /><em>Lookbook</em></h2>
            </div>
            <a class="text-link" href="lookbook.html">View Full Lookbook</a>
          </div>
          <div class="lookbook-grid">
${preview.map((product) => lookbookCard(product)).join("\n")}
          </div>
        </div>
      </section>
    </main>

${footer()}`;

  return documentShell({
    head: pageHead({
      title: "Home",
      description: "EMPEROR Lagos presents a portfolio of luxury fragrance, couture, and accessories.",
      urlPath: "",
      image: "images/lookbook-the-emperor-suit.webp",
    }),
    body,
  });
}

const categoryContent = {
  Fragrance: {
    active: "fragrance",
    title: "The Fragrance Atelier",
    eyebrow: "Collection I",
    image: "images/seduction-royale.webp",
    intro:
      "Crystal vessels containing olfactory masterpieces — each composition a journey through desire, memory, and prestige.",
  },
  Couture: {
    active: "couture",
    title: "The Couture Gallery",
    eyebrow: "Collection II",
    image: "images/the-emperor-suit.webp",
    intro:
      "Tailored in Lagos, admired worldwide. Each piece is a manifesto of modern African aristocracy.",
  },
  Accessories: {
    active: "accessories",
    title: "The Accessories Cabinet",
    eyebrow: "Collection III",
    image: "images/the-regent-cufflinks.webp",
    intro:
      "The final marks of distinction — considered objects that complete the Emperor silhouette.",
  },
};

function generateCategoryPage(category) {
  const details = categoryContent[category];
  const categoryProducts = products.filter((product) => product.category === category);
  const isCouture = category === "Couture";
  const tabs = ["All", "Suits", "T-Shirts", "Hoodies", "Shirts & Polos"];

  const filterMarkup = isCouture
    ? `        <div class="filter-tabs" role="tablist" aria-label="Filter couture collection" data-filter-tabs data-filter-target="#category-grid">
${tabs
  .map(
    (tab, index) =>
      `          <button class="filter-tab${index === 0 ? " is-active" : ""}" type="button" role="tab" aria-selected="${index === 0}" data-filter="${tab}">${tab}</button>`,
  )
  .join("\n")}
        </div>`
    : "";

  const body = `${header(details.active)}

    <main id="main-content">
${breadcrumb([
  { label: "Home", href: "index.html" },
  { label: category },
])}
      <section class="page-intro">
        <div class="container">
          <p class="eyebrow">${details.eyebrow}</p>
          <h1 class="display-title">${details.title}</h1>
          <hr class="gold-rule" />
          <p class="lead">${details.intro}</p>
        </div>
      </section>

      <section class="section" aria-label="${category} collection">
        <div class="container">
${filterMarkup}
          <div class="item-grid" id="category-grid">
${categoryProducts.map((product) => itemCard(product)).join("\n")}
          </div>
        </div>
      </section>
    </main>

${footer()}`;

  return documentShell({
    head: pageHead({
      title: details.title,
      description: details.intro,
      urlPath: `${details.active}.html`,
      image: details.image,
    }),
    body,
  });
}

function generateLookbook() {
  const body = `${header("lookbook")}

    <main id="main-content">
${breadcrumb([
  { label: "Home", href: "index.html" },
  { label: "Lookbook" },
])}
      <section class="page-intro">
        <div class="container">
          <p class="eyebrow">The Gallery</p>
          <h1 class="display-title">Emperor<br /><em>Lookbook</em></h1>
          <hr class="gold-rule" />
          <p class="lead">Every piece tells a story. Every detail carries a legacy.</p>
        </div>
      </section>
      <section class="section" aria-label="EMPEROR lookbook">
        <div class="container">
          <div class="lookbook-grid">
${lookbookProducts.map((product) => lookbookCard(product)).join("\n")}
          </div>
        </div>
      </section>
    </main>

${footer()}`;

  return documentShell({
    head: pageHead({
      title: "Lookbook",
      description: "Explore the EMPEROR Lagos lookbook across fragrance, couture, and accessories.",
      urlPath: "lookbook.html",
      image: "images/lookbook-the-emperor-suit.webp",
    }),
    body,
  });
}

function generateAbout() {
  const body = `${header("about")}

    <main id="main-content">
${breadcrumb([
  { label: "Home", href: "index.html" },
  { label: "About" },
])}
      <section class="page-intro">
        <div class="container">
          <p class="eyebrow">The Maison</p>
          <h1 class="display-title">Born in Lagos.<br /><em>Made to Reign.</em></h1>
          <hr class="gold-rule" />
          <p class="lead">A contemporary expression of African luxury, created for those who define their own legacy.</p>
        </div>
      </section>
      <section class="section">
        <div class="container editorial-grid">
          <div class="editorial-image">
            <img src="images/lookbook-the-emperor-suit.webp" alt="The Emperor Suit from the EMPEROR Lagos lookbook" loading="lazy" decoding="async" />
          </div>
          <div class="editorial-copy">
            <p class="eyebrow">Our Story</p>
            <h2>Luxury with a<br /><em>distinct Lagos soul.</em></h2>
            <p>
              EMPEROR is a portfolio of fragrance, couture, and accessories shaped by
              precision, confidence, and modern African elegance.
            </p>
            <p>
              Emperor was born from a simple idea: that everyday pieces — a scent, a suit, a signature hoodie — can carry the weight and confidence of royalty. Based in Lagos, Emperor curates fragrance, tailoring, and accessories for those who dress with intention. Every piece in this collection is chosen to make one statement: presence. This is not fast fashion. This is a wardrobe built for a king.
            </p>
          </div>
        </div>
      </section>
      <section class="philosophy">
        <div class="container">
          <blockquote>
            “True luxury is not purchased. It is <strong>inherited through vision</strong>
            — and chosen by those who understand the weight of excellence.”
          </blockquote>
          <cite>— The Emperor Philosophy, Lagos</cite>
        </div>
      </section>
    </main>

${footer()}`;

  return documentShell({
    head: pageHead({
      title: "About",
      description: "Discover the story and philosophy of EMPEROR Lagos.",
      urlPath: "about.html",
      image: "images/lookbook-the-emperor-suit.webp",
    }),
    body,
  });
}

function generateContact() {
  const body = `${header("contact")}

    <main id="main-content">
${breadcrumb([
  { label: "Home", href: "index.html" },
  { label: "Contact" },
])}
      <section class="page-intro">
        <div class="container">
          <p class="eyebrow">Private Enquiries</p>
          <h1 class="display-title">Begin a<br /><em>Conversation.</em></h1>
          <hr class="gold-rule" />
          <p class="lead">For orders, private viewings, and collection enquiries, contact the EMPEROR team in Lagos.</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <p class="component-note">Have a question about a piece, or ready to place an order? Reach out on WhatsApp for the fastest response, or send a message on Instagram. We're based in Lagos, Nigeria, and every order is handled personally.</p>
          <div class="contact-grid">
            <a class="contact-card" href="#" target="_blank" rel="noopener" data-whatsapp-link>
              <p class="contact-card__label">WhatsApp</p>
              <p class="contact-card__value">Start a Conversation</p>
              <p class="contact-card__note" data-whatsapp-label>WhatsApp</p>
            </a>
            <a class="contact-card" href="#" data-phone-link>
              <p class="contact-card__label">Telephone</p>
              <p class="contact-card__value">Call the Maison</p>
              <p class="contact-card__note" data-phone-label>Call</p>
            </a>
            <a class="contact-card" href="#" target="_blank" rel="noopener" data-instagram-link>
              <p class="contact-card__label">Instagram</p>
              <p class="contact-card__value">@code_with_austine</p>
              <p class="contact-card__note">Follow EMPEROR on Instagram</p>
            </a>
            <div class="contact-card">
              <p class="contact-card__label">Location</p>
              <p class="contact-card__value">Lagos, Nigeria</p>
              <p class="contact-card__note">Private appointments by arrangement.</p>
            </div>
          </div>
        </div>
      </section>
    </main>

${footer()}`;

  return documentShell({
    head: pageHead({
      title: "Contact",
      description: "Contact EMPEROR Lagos for orders, private viewings, and collection enquiries.",
      urlPath: "contact.html",
      image: "images/the-emperor-suit.webp",
    }),
    body,
  });
}

function takeRelated(list, startIndex, picked, limit) {
  if (!list.length || startIndex < 0) return;
  for (let offset = 1; offset < list.length && picked.length < limit; offset += 1) {
    const candidate = list[(startIndex + offset) % list.length];
    if (picked.some((item) => item.id === candidate.id)) continue;
    picked.push(candidate);
  }
}

function relatedProducts(product) {
  const inCategory = products.filter((candidate) => candidate.category === product.category);
  const categoryIndex = inCategory.findIndex((candidate) => candidate.id === product.id);
  const sameSubcategory = product.subcategory
    ? inCategory.filter((candidate) => candidate.subcategory === product.subcategory)
    : inCategory;
  const subcategoryIndex = sameSubcategory.findIndex((candidate) => candidate.id === product.id);
  const related = [];

  takeRelated(sameSubcategory, subcategoryIndex, related, 4);
  if (product.subcategory && related.length < 4) {
    takeRelated(inCategory, categoryIndex, related, 4);
  }

  return related;
}

function generateItemPage(product) {
  const categorySlug = slugifyCategory(product.category);
  const related = relatedProducts(product);

  const detailItems = product.details
    .map((detail) => `<li>${escapeHtml(detail)}</li>`)
    .join("\n              ");

  const body = `${header(categorySlug, "../")}

    <main id="main-content">
${breadcrumb(
  [
    { label: "Home", href: "index.html" },
    { label: product.category, href: `${categorySlug}.html` },
    { label: product.name },
  ],
  "../",
)}
      <section class="item-detail container" data-product-id="${escapeHtml(product.id)}">
        <div class="item-detail__media">
          <img
            class="item-detail__image"
            src="../${escapeHtml(product.image)}"
            alt="${escapeHtml(product.imageAlt)}"
            loading="lazy"
            decoding="async"
          />
          ${product.badge ? `<p class="item-detail__badge">${escapeHtml(product.badge)}</p>` : ""}
        </div>
        <div class="item-detail__content">
          <p class="eyebrow">${escapeHtml(product.category)}${
            product.subcategory ? ` · ${escapeHtml(product.subcategory)}` : ""
          }</p>
          <h1 class="item-detail__title">${escapeHtml(product.name)}</h1>
          <p class="item-detail__price">${escapeHtml(formatPrice(product))}</p>
          <p class="item-detail__description">${escapeHtml(product.description)}</p>
          <ul class="details-list" aria-label="Item details">
              ${detailItems}
          </ul>
          <button
            class="button button--solid"
            type="button"
            data-order-button
            data-product-name="${escapeHtml(product.name)}"
            data-product-price="${escapeHtml(formatPrice(product))}"
          >
            Order on WhatsApp
          </button>
        </div>
      </section>

      <section class="section related-section" aria-labelledby="related-title">
        <div class="container">
          <div class="section-heading">
            <div>
              <p class="eyebrow">${escapeHtml(product.category)}</p>
              <h2 class="section-title" id="related-title">More from this<br /><em>Collection</em></h2>
            </div>
          </div>
          <div class="item-grid">
${related
  .map((candidate) =>
    itemCard(candidate, {
      prefix: "../",
      itemHrefPrefix: "",
    }),
  )
  .join("\n")}
          </div>
        </div>
      </section>
    </main>

${footer("../")}`;

  return documentShell({
    head: pageHead({
      title: product.name,
      description: `${product.name} by EMPEROR Lagos. ${product.description}`,
      prefix: "../",
      urlPath: `items/${product.slug}.html`,
      image: product.image,
      ogType: "product",
    }),
    body,
  });
}

function writePage(relativePath, content) {
  const destination = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, content, "utf8");
}

function generateAllPages() {
  fs.mkdirSync(ITEMS_DIR, { recursive: true });

  writePage("index.html", generateHome());
  writePage("fragrance.html", generateCategoryPage("Fragrance"));
  writePage("couture.html", generateCategoryPage("Couture"));
  writePage("accessories.html", generateCategoryPage("Accessories"));
  writePage("lookbook.html", generateLookbook());
  writePage("about.html", generateAbout());
  writePage("contact.html", generateContact());

  const shortRelated = [];
  products.forEach((product) => {
    const related = relatedProducts(product);
    if (related.length < 4) {
      shortRelated.push(`${product.name} (${product.slug}.html): ${related.length}`);
    }
    writePage(path.join("items", `${product.slug}.html`), generateItemPage(product));
  });

  const currentItemFiles = new Set(products.map((product) => `${product.slug}.html`));
  fs.readdirSync(ITEMS_DIR)
    .filter((file) => file.endsWith(".html") && !currentItemFiles.has(file))
    .forEach((file) => fs.rmSync(path.join(ITEMS_DIR, file)));

  const retiredPages = [path.join(ROOT, "skincare.html")];
  retiredPages.filter((file) => fs.existsSync(file)).forEach((file) => fs.rmSync(file));

  console.log(`Generated 7 main pages and ${products.length} item pages.`);
  if (shortRelated.length) {
    console.log(`Related sections with fewer than 4 items:\n${shortRelated.join("\n")}`);
  } else {
    console.log("Every item page has 4 related items.");
  }
  console.log("Homepage written to index.html.");
}

generateAllPages();
