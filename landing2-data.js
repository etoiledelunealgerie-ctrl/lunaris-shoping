/* ═══════════════════════════════════════════════════════════════
   LUNARIS — LANDING PAGE 2 PRODUCT CONFIG
   ═══════════════════════════════════════════════════════════════
   This promo page (landing-page2.html) shows ONE product. Edit
   its images/price/sizes/stock text here — no Google Sheet needed.

   Delivery rates are NOT set here — landing-page2.html shares the
   same DELIVERY_RATES table as the rest of the site (delivery-data.js),
   so a price change there updates both places at once.
   ═══════════════════════════════════════════════════════════════ */

const LANDING2_PRODUCT = {
  images: [
    "REPLACE_WITH_IMAGE_URL_1",
    "REPLACE_WITH_IMAGE_URL_2",
    "REPLACE_WITH_IMAGE_URL_3"
  ],
  price: "0",                 // digits only, DA
  sizes: ["Standard", "S", "M", "L", "XL"],
  stockText: "In Stock"       // shown in the stock-flag badge
};
