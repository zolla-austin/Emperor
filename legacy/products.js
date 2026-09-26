const EMPEROR_PRODUCTS = [
  // --- FRAGRANCES ---
  {
    id: "oba-noir",
    name: "Ọba Noir",
    category: "fragrance",
    sub: "L'Essence du Roi",
    tags: ["Oud", "Amber", "Vetiver"],
    price: "₦185,000",
    imageKey: "img_oba_noir",
    label: "Collection I"
  },
  {
    id: "imagination",
    name: "Imagination",
    category: "fragrance",
    sub: "L'Air Céleste",
    tags: ["Neroli", "Aqua", "White Musk"],
    price: "₦165,000",
    imageKey: "img_imagination",
    label: "Collection I"
  },
  {
    id: "sovereign-rain",
    name: "Sovereign Rain",
    category: "fragrance",
    sub: "L'Orage Doré",
    tags: ["Petrichor", "Sandalwood", "Sea"],
    price: "₦155,000",
    imageKey: "img_sovereign_rain",
    label: "Collection I"
  },

  // --- SKINCARE ---
  {
    id: "wonder-cream",
    name: "Wonder Cream",
    category: "skincare",
    sub: "Instant Glow Reviver · 50ml",
    desc: "Gold lid · Vegan · Dermatologically tested<br>For a smoother, rejuvenated complexion",
    price: "₦78,000",
    imageKey: "img_wonder_cream",
    label: "Hero Treatment · Best Seller"
  },
  {
    id: "cerave-cream",
    name: "CeraVe Cream",
    category: "skincare",
    sub: "Moisturising Cream · 454g",
    desc: "3 essential ceramides · Hyaluronic acid<br>Fragrance free · For very dry skin",
    price: "₦52,000",
    imageKey: "img_cerave_cream",
    label: "Deep Moisture"
  },
  {
    id: "hydra-aura",
    name: "Hydra Aura Mask",
    category: "skincare",
    sub: "Moisturising Cream Mask · 200ml",
    desc: "Gatineau Paris · Hydrating complex<br>Hyaluronic acid · Instant plumping",
    price: "₦95,000",
    imageKey: "img_hydra_aura",
    label: "Hydration Ritual"
  },
  {
    id: "cicaplast",
    name: "Cicaplast Baume",
    category: "skincare",
    sub: "Soothing Therapeutic Balm · B5+",
    desc: "La Roche-Posay · Tribioma Innovation<br>Multi-purpose skin protector",
    price: "₦68,000",
    imageKey: "img_cicaplast",
    label: "Repair & Soothe"
  },
  {
    id: "collagen-snail",
    name: "Collagen Snail Cream",
    category: "skincare",
    sub: "Deep Cleansing Whitening · 80g",
    desc: "Anti-acne · Brightening · Whitening<br>Anti-ageing · All skin types",
    price: "₦38,000",
    imageKey: "img_collagen_snail",
    label: "Anti-Ageing"
  },

  // --- COUTURE: SUITS & TAILORING ---
  {
    id: "emperor-suit",
    name: "The Emperor Suit",
    category: "suits",
    desc: "Double-breasted · Gold chain detail<br>Italian wool · Lagos crafted",
    price: "From ₦1,200,000",
    imageKey: "img_emperor_suit",
    label: "Bespoke Tailoring"
  },
  {
    id: "white-sovereign",
    name: "The White Sovereign",
    category: "suits",
    desc: "Three-piece tuxedo · Shawl lapel<br>Black contrast buttons · Waistcoat",
    price: "From ₦980,000",
    imageKey: "img_white_sovereign",
    label: "Formal Collection"
  },
  {
    id: "lagos-classic",
    name: "The Lagos Classic",
    category: "suits",
    desc: "Three-piece slate grey · Peak lapel<br>Cashmere blend · Structured silhouette",
    price: "From ₦850,000",
    imageKey: "img_lagos_classic",
    label: "Ready-to-Wear"
  },

  // --- COUTURE: STREETWEAR & CASUAL ---
  {
    id: "oversized-tee",
    name: "Emperor Oversized Tee",
    category: "streetwear",
    desc: "400gsm cotton · Gold print<br>Dropped shoulder · Unisex",
    price: "₦45,000",
    imageKey: "img_oversized_tee",
    label: "Streetwear"
  },
  {
    id: "wings-royalty",
    name: "Wings of Royalty Tee",
    category: "streetwear",
    desc: "Heavyweight cotton · Screen print<br>Army green · Limited run",
    price: "₦52,000",
    imageKey: "img_wings_royalty",
    label: "Graphic Series"
  },
  {
    id: "hustle-culture",
    name: "Hustle Culture Tee",
    category: "streetwear",
    desc: "Vintage wash · Hand artwork<br>Oversized · Statement piece",
    price: "₦68,000",
    imageKey: "img_hustle_culture",
    label: "Art Series"
  },
  {
    id: "flannel-shirt",
    name: "Emperor Flannel Shirt",
    category: "streetwear",
    desc: "Brushed cotton · Relaxed fit<br>Oversized · Plaid weave",
    price: "₦78,000",
    imageKey: "img_flannel_shirt",
    label: "Smart Casual"
  },
  {
    id: "signature-hoodie",
    name: "Emperor Signature Hoodie",
    category: "streetwear",
    desc: "500gsm fleece · Bold graphic<br>Oversized fit · Unisex",
    price: "₦95,000",
    imageKey: "img_signature_hoodie",
    label: "Premium Hoodies"
  },
  {
    id: "monogram-polo",
    name: "Emperor Monogram Polo",
    category: "streetwear",
    desc: "Pique cotton · Diamond pattern<br>5 colourways · Made in Lagos",
    price: "₦62,000",
    imageKey: "img_monogram_polo",
    label: "Polo Collection"
  },

  // --- LOOKBOOK / GALLERY ---
  {
    id: "lookbook-1",
    name: "Emperor Suit",
    category: "lookbook",
    price: "From ₦1,200,000",
    imageKey: "img_lookbook_1"
  },
  {
    id: "lookbook-2",
    name: "Ọba Noir",
    category: "lookbook",
    price: "₦185,000",
    imageKey: "img_lookbook_2"
  },
  {
    id: "lookbook-3",
    name: "Signature Hoodie",
    category: "lookbook",
    price: "₦95,000",
    imageKey: "img_lookbook_3"
  },
  {
    id: "lookbook-4",
    name: "Séduction Royale",
    category: "lookbook",
    price: "₦420,000",
    imageKey: "img_lookbook_4"
  },
  {
    id: "lookbook-5",
    name: "The White Sovereign",
    category: "lookbook",
    price: "From ₦980,000",
    imageKey: "img_lookbook_5",
    wide: true,
    imgStyle: "object-position:center 20%"
  },
  {
    id: "lookbook-6",
    name: "Monogram Polo",
    category: "lookbook",
    price: "₦62,000",
    imageKey: "img_lookbook_6"
  },
  {
    id: "lookbook-7",
    name: "Sovereign Rain",
    category: "lookbook",
    price: "₦155,000",
    imageKey: "img_lookbook_7"
  },
  {
    id: "lookbook-8",
    name: "Hustle Culture Tee",
    category: "lookbook",
    price: "₦68,000",
    imageKey: "img_lookbook_8"
  },
  {
    id: "lookbook-9",
    name: "The Lagos Classic",
    category: "lookbook",
    price: "₦850,000",
    imageKey: "img_lookbook_9"
  }
];

/**
 * Creates HTML string for a unified product card.
 */
function createProductCardHtml(product, index) {
  const imageSrc = EMPEROR_IMAGES[product.imageKey] || '';
  
  // Format tags or description
  let detailsHtml = '';
  if (product.tags && product.tags.length > 0) {
    detailsHtml = `<div class="ftags">` + 
      product.tags.map(t => `<span class="tag">${t}</span>`).join('') + 
      `</div>`;
  } else if (product.desc) {
    detailsHtml = `<p class="product-desc">${product.desc}</p>`;
  }

  // Animation delay calculation (matching the original template pattern)
  const animDelayClass = `d${(index % 4) + 1}`;

  return `
    <div class="product-card rv ${animDelayClass}">
      <div class="product-image-box">
        <img src="${imageSrc}" alt="${product.name}">
      </div>
      <div class="product-info">
        <p class="product-label">${product.label || '&nbsp;'}</p>
        <h3 class="product-title">${product.name}</h3>
        ${product.sub ? `<p class="product-sub">${product.sub}</p>` : ''}
        ${detailsHtml}
        <div class="product-footer">
          <span class="product-price">${product.price}</span>
          <button class="cbtn book-viewing-btn"><span>Acquire</span></button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Creates HTML string for a lookbook item.
 */
function createLookbookCardHtml(item) {
  const imageSrc = EMPEROR_IMAGES[item.imageKey] || '';
  const imgStyle = item.imgStyle ? ` style="${item.imgStyle}"` : '';
  return `
    <div class="gal-item${item.wide ? ' wide' : ''}">
      <img src="${imageSrc}" alt="${item.name}"${imgStyle}>
      <div class="gal-overlay">
        <p class="gal-name">${item.name}</p>
        <p class="gal-price">${item.price}</p>
      </div>
    </div>
  `;
}

/**
 * Renders all sections based on EMPEROR_PRODUCTS array.
 */
function renderProducts() {
  // 1. Render Fragrances
  const fragGrid = document.querySelector('#frag .fg');
  if (fragGrid) {
    const fragrances = EMPEROR_PRODUCTS.filter(p => p.category === 'fragrance');
    fragGrid.innerHTML = fragrances.map((p, idx) => createProductCardHtml(p, idx)).join('');
  }

  // 2. Render Skincare
  const skinGrid = document.querySelector('#skin .product-grid');
  if (skinGrid) {
    const skincare = EMPEROR_PRODUCTS.filter(p => p.category === 'skincare');
    skinGrid.innerHTML = skincare.map((p, idx) => createProductCardHtml(p, idx)).join('');
  }

  // 3. Render Couture Suits
  const suitsGrid = document.querySelector('#cout .suits-grid');
  if (suitsGrid) {
    const suits = EMPEROR_PRODUCTS.filter(p => p.category === 'suits');
    suitsGrid.innerHTML = suits.map((p, idx) => createProductCardHtml(p, idx)).join('');
  }

  // 4. Render Couture Streetwear
  const streetwearGrid = document.querySelector('#cout .streetwear-grid');
  if (streetwearGrid) {
    const streetwear = EMPEROR_PRODUCTS.filter(p => p.category === 'streetwear');
    streetwearGrid.innerHTML = streetwear.map((p, idx) => createProductCardHtml(p, idx)).join('');
  }

  // 5. Render Lookbook Gallery
  const lookbookGrid = document.querySelector('#gallery .gal');
  if (lookbookGrid) {
    const lookbook = EMPEROR_PRODUCTS.filter(p => p.category === 'lookbook');
    lookbookGrid.innerHTML = lookbook.map(item => createLookbookCardHtml(item)).join('');
  }

  // 6. Bind the "Acquire" buttons to open the Private Viewing modal
  document.querySelectorAll('.book-viewing-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Emulate the nav book private viewing button action
      const bookBtn = document.querySelector('nav .nc');
      if (bookBtn) {
        bookBtn.click();
      }
    });
  });

  // 7. Render featured banner images
  const featuredFragImg = document.getElementById('featured-fragrance-img');
  if (featuredFragImg) {
    featuredFragImg.src = EMPEROR_IMAGES.img_seduction_royale;
  }
  const skincareCampaignImg = document.getElementById('skincare-campaign-img');
  if (skincareCampaignImg) {
    skincareCampaignImg.src = EMPEROR_IMAGES.img_skincare_campaign;
  }
  const skincareBottomImg = document.getElementById('skincare-bottom-img');
  if (skincareBottomImg) {
    skincareBottomImg.src = EMPEROR_IMAGES.img_cerave_collection;
  }
}
