/* ═══════════════════════════════════════════════════════════════
   LUNARIS — CENTRAL PRODUCT CATALOG
   ═══════════════════════════════════════════════════════════════
   THIS is the ONLY file you edit to change what's on the site:
   names, prices, images, stock, descriptions, sizes.

   Nothing else needs to change — inventory.js reads this file
   directly. No Google Sheet, no network fetch, no delay on load.

   HOW TO ADD / EDIT A PRODUCT:
   Copy one block below, give it a unique id (left side, e.g. "LUN-3"),
   and fill in the fields. Every field is a plain string.

   FIELD REFERENCE:
     stock       "12"                 — number shown as "X Left In Stock". Any
                                         non-numeric value (or "0") shows "Sold Out".
     img1..img4  "https://..."        — product photos. img1 is used everywhere a
                                         single thumbnail is needed (cart, checkout,
                                         category grids). Cloudinary URLs are auto-
                                         optimized (resized + compressed) on the fly —
                                         paste the original Cloudinary URL as-is.
     nameEn/nameAr                    — product name, English / Arabic.
     category                          — MUST exactly match the data-category used on
                                         the listing page (dresses.html currently uses
                                         "Women's Dress"). Case + spelling must match.
     price        "6000"               — price in DA, digits only (no "DA", no commas).
     descEn/descAr                    — product description, English / Arabic.
     sizes        "Standard,S,M,L,XL"  — comma-separated. Must be a subset of the
                                         fixed size list the page recognizes:
                                         Standard, XS, S, M, L, XL.
     pageUrl      "robe1.html"         — which product page this item opens to.
                                         IMPORTANT: for the multi-color pouch pages
                                         (bigpouches.html / pouch12.html), every color
                                         variant is a SEPARATE id here that all share
                                         the SAME pageUrl — that's how the page knows
                                         which colors belong to it.
     bestSeller   "YES" or ""          — "YES" makes it appear in the homepage
                                         bestsellers marquee (#bestsellersTrack).

   To ADD a brand-new product page (a 3rd dress, a 3rd pouch style, etc.),
   you still need to duplicate an existing product HTML page (e.g. copy
   robe1.html to robe3.html and change data-product="LUN-1" to your new id)
   — this file only controls the DATA, not which pages exist.
   ═══════════════════════════════════════════════════════════════ */

const PRODUCTS_DATA = {

  // ── DRESSES (single-page products, shown via data-product="LUN-x") ──
  "LUN-1": {
    stock:    "0",
    img1: "REPLACE_WITH_IMAGE_URL_1", img2: "REPLACE_WITH_IMAGE_URL_2",
    img3: "REPLACE_WITH_IMAGE_URL_3", img4: "REPLACE_WITH_IMAGE_URL_4",
    nameEn: "REPLACE — Dress Name (EN)", nameAr: "استبدل — اسم الفستان",
    category: "Women's Dress",
    price: "0",
    descEn: "REPLACE — product description in English.",
    descAr: "استبدل — وصف المنتج بالعربية.",
    sizes: "Standard,S,M,L,XL",
    pageUrl: "robe1.html",
    bestSeller: "YES"
  },
  "LUN-2": {
    stock:    "0",
    img1: "REPLACE_WITH_IMAGE_URL_1", img2: "REPLACE_WITH_IMAGE_URL_2",
    img3: "REPLACE_WITH_IMAGE_URL_3", img4: "REPLACE_WITH_IMAGE_URL_4",
    nameEn: "REPLACE — Dress Name (EN)", nameAr: "استبدل — اسم الفستان",
    category: "Women's Dress",
    price: "0",
    descEn: "REPLACE — product description in English.",
    descAr: "استبدل — وصف المنتج بالعربية.",
    sizes: "Standard,S,M,L,XL",
    pageUrl: "robe2.html",
    bestSeller: "YES"
  },

  // ── SMALL POUCH colors (all share pageUrl: pouch12.html) ──
  "POUCH-SMALL-1": {
    stock: "0",
    img1: "REPLACE_WITH_IMAGE_URL", img2: "", img3: "", img4: "",
    nameEn: "REPLACE — Color name (EN)", nameAr: "استبدل — اسم اللون",
    category: "Pouch Bag - Small",
    price: "0",
    descEn: "", descAr: "",
    sizes: "Standard",
    pageUrl: "pouch12.html",
    bestSeller: ""
  },

  // ── BIG POUCH colors (all share pageUrl: bigpouches.html) ──
  "POUCH-BIG-1": {
    stock: "0",
    img1: "REPLACE_WITH_IMAGE_URL", img2: "", img3: "", img4: "",
    nameEn: "REPLACE — Color name (EN)", nameAr: "استبدل — اسم اللون",
    category: "Pouch Bag - Big",
    price: "0",
    descEn: "", descAr: "",
    sizes: "Standard",
    pageUrl: "bigpouches.html",
    bestSeller: ""
  }

  // Add more products by copying a block above and giving it a new id.
};

/* ── Global site settings (was the "CONFIG-SETTINGS" sheet row) ── */
const SITE_SETTINGS = {
  freeDeliveryThreshold: "3500" // DA — used for "Free delivery over X DA" badges
};
