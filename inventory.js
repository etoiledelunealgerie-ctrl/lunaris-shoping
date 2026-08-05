/* ═══════════════════════════════════════════════════════════════
   LUNARIS — INVENTORY RENDERER
   ═══════════════════════════════════════════════════════════════
   Reads PRODUCTS_DATA / SITE_SETTINGS (from product-data.js) and
   DELIVERY_RATES (from delivery-data.js) and paints the page.

   No network fetch, no Google Sheet, no CSV parsing — this used to
   pull from a published Google Sheet CSV on every page load; that
   made every page load depend on Google's servers + could show
   stale/broken data if the sheet was mid-edit. Editing is now done
   in product-data.js / delivery-data.js directly.

   Every HTML page that used to load this file still just needs:
     <script src="product-data.js"></script>
     <script src="delivery-data.js"></script>
     <script src="inventory.js"></script>
   (product-data.js and delivery-data.js MUST load first.)
   ═══════════════════════════════════════════════════════════════ */

/**
 * Cloudinary Image Optimization Helper
 * Automatically injects resizing, auto-formatting (f_auto), and auto-compression (q_auto)
 */
function optimizeImage(url, width = 400, height = 500) {
  if (!url || !url.includes('cloudinary.com/image/upload/')) return url;
  if (url.includes('f_auto') || url.includes('q_auto')) return url;
  const params = `c_fill,w_${width},h_${height},f_auto,q_auto`;
  return url.replace('upload/', `upload/${params}/`);
}

function renderInventory() {
  try {
    const inventoryData = (typeof PRODUCTS_DATA !== 'undefined') ? PRODUCTS_DATA : {};
    const settings = (typeof SITE_SETTINGS !== 'undefined') ? SITE_SETTINGS : {};
    const deliveryRatesRaw = (typeof DELIVERY_RATES !== 'undefined') ? DELIVERY_RATES : {};

    if (typeof PRODUCTS_DATA === 'undefined') {
      console.error('[inventory.js] PRODUCTS_DATA is missing — make sure product-data.js is included BEFORE inventory.js.');
    }
    if (typeof DELIVERY_RATES === 'undefined') {
      console.error('[inventory.js] DELIVERY_RATES is missing — make sure delivery-data.js is included BEFORE inventory.js.');
    }

    // ==========================================
    // MODULE A: SINGLE PRODUCT PAGES
    // ==========================================
    const stockElement = document.getElementById('live-stock');
    const mainImgElement = document.getElementById('mainImg');
    const productId = stockElement ? stockElement.getAttribute('data-product') :
                     (mainImgElement ? mainImgElement.getAttribute('data-product') : null);

    if (productId && inventoryData[productId]) {
      const data = inventoryData[productId];

      if (typeof PRODUCT !== 'undefined') {
        PRODUCT.name_en = data.nameEn;
        PRODUCT.price = data.price;
        // cart.js / checkout.html read PRODUCT.img1 directly as the cart
        // item's "image" field (cart drawer + checkout order summary thumbs).
        // Store an optimized thumbnail-sized version, not the raw URL,
        // otherwise every cart/checkout thumbnail loads full-resolution.
        if (data.img1) PRODUCT.img1 = optimizeImage(data.img1, 160, 200);
      }

      if (document.getElementById('pTitle')) document.getElementById('pTitle').innerText = data.nameEn;
      if (document.getElementById('pTitleAr')) document.getElementById('pTitleAr').innerText = data.nameAr;
      if (document.getElementById('pTag')) document.getElementById('pTag').innerText = data.category;
      if (document.getElementById('pPrice')) document.getElementById('pPrice').innerText = data.price;
      if (document.getElementById('pDesc')) document.getElementById('pDesc').innerText = data.descEn;
      if (document.getElementById('pDescAr')) document.getElementById('pDescAr').innerText = data.descAr;

      if (stockElement) {
        stockElement.innerText = (data.stock && parseInt(data.stock) > 0) ? data.stock : "Sold Out";
      }

      const imgs = [data.img1, data.img2, data.img3, data.img4].filter(src => src && src.startsWith('http'));

      if (mainImgElement && imgs.length > 0) {
        mainImgElement.src = optimizeImage(imgs[0], 800, 1000);

        const bgBlur = document.getElementById('bgBlur');
        if (bgBlur) bgBlur.style.backgroundImage = `url('${optimizeImage(imgs[0], 100, 150)}')`;

        const thumbRow = document.getElementById('thumbRow');
        if (thumbRow) {
          thumbRow.innerHTML = '';
          imgs.forEach((src, i) => {
            const optimizedThumb = optimizeImage(src, 150, 200);
            const optimizedMain = optimizeImage(src, 800, 1000);

            const div = document.createElement('div');
            div.className = 'thumb' + (i === 0 ? ' active' : '');
            div.innerHTML = `<img src="${optimizedThumb}" loading="lazy" alt="View ${i+1}" />`;
            div.onclick = () => {
              mainImgElement.src = optimizedMain;
              document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
              div.classList.add('active');
            };
            thumbRow.appendChild(div);
          });
        }
      }

      const sizeRow = document.getElementById('sizeRow');
      if (sizeRow && data.sizes) {
        sizeRow.innerHTML = '';
        const availableSizes = data.sizes.split(',').map(s => s.trim().toUpperCase());
        const sizeOrder = ['Standard', 'XS', 'S', 'M', 'L', 'XL'];

        sizeOrder.forEach(size => {
          const isAvailable = availableSizes.includes(size.toUpperCase());

          const btn = document.createElement('button');
          btn.className = 'size-btn' + (!isAvailable ? ' soldout' : '');
          btn.textContent = size;

          if (isAvailable) {
            btn.onclick = () => {
              document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
            };
          }
          sizeRow.appendChild(btn);
        });

        const firstAvailable = sizeRow.querySelector('.size-btn:not(.soldout)');
        if (firstAvailable) firstAvailable.classList.add('active');
      }
    }

    // ==========================================
    // MODULE B: CATEGORY GRIDS (dresses.html)
    // ==========================================
    const dynamicGrid = document.getElementById('dynamicGrid');
    if (dynamicGrid) {
      dynamicGrid.innerHTML = '';
      const targetCategory = dynamicGrid.getAttribute('data-category');

      Object.values(inventoryData).forEach(item => {
        if (item.category && item.category.trim() === targetCategory) {
          const card = document.createElement('a');
          card.href = item.pageUrl;
          card.className = 'product-card';

          const optImage = item.img1 ? optimizeImage(item.img1, 400, 500) : 'loading-placeholder.jpg';

          card.innerHTML = `
            <img src="${optImage}" loading="lazy" alt="${item.nameEn}" onerror="this.src='loading-placeholder.jpg'" />
            <div class="product-card-info">
              <div class="product-card-name">${item.nameEn}</div>
              <div class="product-card-price">${item.price}</div>
            </div>
          `;
          dynamicGrid.appendChild(card);
        }
      });

      if (dynamicGrid.innerHTML === '') {
        dynamicGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #777;">New collection arriving soon...</p>';
      }
    }

    // ==========================================
    // MODULE C: HOMEPAGE BESTSELLERS MARQUEE
    // ==========================================
    const bestsellersTrack = document.getElementById('bestsellersTrack');
    if (bestsellersTrack) {
      bestsellersTrack.innerHTML = '';
      let cardsHTML = '';

      Object.values(inventoryData).forEach(item => {
        const isNotHero = !(item.id || '').toLowerCase().includes('hero');
        const hasPrice = item.price && item.price.trim() !== '';
        const isFeatured = item.bestSeller && item.bestSeller.toUpperCase() === 'YES';

        if (item.nameEn && item.img1 && isNotHero && hasPrice && isFeatured) {
          const optImage = optimizeImage(item.img1, 300, 400);

          cardsHTML += `
            <a href="${item.pageUrl}" class="bs-card">
              <img src="${optImage}" loading="lazy" alt="${item.nameEn}" onerror="this.style.height='200px';this.style.background='linear-gradient(135deg,#F8EEF2,#E8C4D2)'" />
              <div class="bs-card-info">
                <div class="bs-card-tag">${item.category || 'Product'}</div>
                <div class="bs-card-name">${item.nameEn}</div>
                <div class="bs-card-price">${item.price}</div>
                <div class="bs-card-stars">★★★★★</div>
              </div>
            </a>
          `;
        }
      });

      if (cardsHTML === '') {
         bestsellersTrack.innerHTML = '<div style="padding: 40px; color: #C8547A;">No products marked bestSeller: "YES" in product-data.js yet.</div>';
      } else {
         bestsellersTrack.innerHTML = cardsHTML + cardsHTML;
      }
    }

    // ==========================================
    // MODULE D: DYNAMIC HERO IMAGE
    // ==========================================
    const heroImageElement = document.getElementById('heroImage');
    if (heroImageElement) {
      const heroId = heroImageElement.getAttribute('data-product');
      if (heroId && inventoryData[heroId] && inventoryData[heroId].img1) {
        heroImageElement.src = optimizeImage(inventoryData[heroId].img1, 1000, 1200);
        heroImageElement.style.display = 'block';
      }
    }

    // ==========================================
    // MODULE E: MULTI-COLOR BUNDLE PAGES
    // ==========================================
    const multiColorContainer = document.getElementById('multiColorPouchContainer');
    if (multiColorContainer) {
      const targetPageUrl = multiColorContainer.getAttribute('data-page-url');

      if (typeof PRODUCT !== 'undefined') {
        PRODUCT.colors = [];
        Object.values(inventoryData).forEach(item => {
          if (item.pageUrl && item.pageUrl.trim() === targetPageUrl) {
             const imgs = [item.img1, item.img2, item.img3, item.img4].filter(src => src && src.startsWith('http'));
             const optimizedImgs = imgs.map(src => optimizeImage(src, 600, 800));

             PRODUCT.colors.push({
               id: item.id,
               name_en: item.nameEn || 'Color',
               name_ar: item.nameAr || '',
               img: optimizedImgs.length > 0 ? optimizedImgs : ['loading-placeholder.jpg'],
               price: item.price
             });
          }
        });
        if (typeof renderPouchPage === 'function') {
           renderPouchPage();
        }
      }
    }

    // ==========================================
    // MODULE F: CHECKOUT DELIVERY RATES
    // ==========================================
    const wilayaSelect = document.getElementById('wilayaSelect');
    if (wilayaSelect) {
       wilayaSelect.innerHTML = '<option value="">Select your wilaya — اختر ولايتك</option>';

       Object.values(deliveryRatesRaw).forEach(rate => {
           if (rate.name) {
               const opt = document.createElement('option');
               opt.value = rate.name;
               opt.setAttribute('data-price-home', rate.home ?? 0);
               opt.setAttribute('data-price-desk', rate.desk ?? 0);
               opt.setAttribute('data-threshold', settings.freeDeliveryThreshold || 999999);
               opt.textContent = rate.name;
               wilayaSelect.appendChild(opt);
           }
       });

       if (typeof renderSummary === 'function') {
           renderSummary();
       }
    }

    // ==========================================
    // MODULE G: GLOBAL SITE SETTINGS
    // ==========================================
    if (settings.freeDeliveryThreshold) {
       const thresholdValue = settings.freeDeliveryThreshold;

       const announceEn = document.getElementById('announceThreshold');
       if (announceEn) announceEn.innerText = thresholdValue;

       const announceAr = document.getElementById('announceThresholdAr');
       if (announceAr) announceAr.innerText = thresholdValue;

       const trustEn = document.getElementById('trustThreshold');
       if (trustEn) trustEn.innerText = thresholdValue;

       const trustAr = document.getElementById('trustThresholdAr');
       if (trustAr) trustAr.innerText = thresholdValue;
    }

  } catch (error) {
    console.error('Error rendering inventory:', error);
  }
}

// Attach the id to each product object so Module C's "isNotHero" filter
// still works (it used to come from the sheet's first column).
if (typeof PRODUCTS_DATA !== 'undefined') {
  Object.keys(PRODUCTS_DATA).forEach(key => { PRODUCTS_DATA[key].id = key; });
}

renderInventory();
