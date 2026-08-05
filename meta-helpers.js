/* ═══════════════════════════════════════════════════════════════
   LUNARIS — META PIXEL / CAPI HELPERS
   ═══════════════════════════════════════════════════════════════
   Include on every page AFTER the inline Meta Pixel base-code
   script (the one that calls fbq('init', ...)) and BEFORE
   order-tracking.js / cart.js:

     <script src="meta-helpers.js"></script>

   This file does NOT init the pixel itself — every Lunaris page
   already does that inline with its own fbq('init','899939093169077').
   This just adds: a stable per-event ID generator, fbp/fbc cookie
   readers, and a function to forward any event to the server-side
   Cloudflare Function (/api/meta-capi) for Meta CAPI, so every
   client-fired pixel event gets a matching server-side event with
   the same event_id (Meta dedups them automatically).
   ═══════════════════════════════════════════════════════════════ */

function metaGenerateEventId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2);
}

function metaGetCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

/* fbp/fbc are Meta's own browser-set matching cookies. Passing them to
   CAPI improves match quality between the pixel event and the server
   event, and they're required for delayed Purchase attribution — this
   is exactly what gets saved to Supabase at order time so the delayed
   Purchase event (fired later, when you mark an order delivered_paid)
   can still be matched to the original ad click. */
function metaGetBrowserIds() {
  return {
    fbp: metaGetCookie('_fbp') || null,
    fbc: metaGetCookie('_fbc') || null
  };
}

/* Fires a Pixel event in-browser AND forwards the same event (same
   event_id) to the server via CAPI, for deduplication + resilience
   against ad blockers / iOS tracking prevention. */
function metaTrackEvent(eventName, customData = {}, userData = {}) {
  const eventId = metaGenerateEventId();

  if (typeof fbq === 'function') {
    fbq('track', eventName, customData, { eventID: eventId });
  }

  metaSendToCapi(eventName, eventId, customData, userData);
  return eventId;
}

function metaSendToCapi(eventName, eventId, customData, userData) {
  const { fbp, fbc } = metaGetBrowserIds();

  fetch('/api/meta-capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_source_url: window.location.href,
      action_source: 'website',
      user_data: {
        fbp,
        fbc,
        ...userData          // e.g. { phone, first_name, last_name, city, state } — hashed server-side
      },
      custom_data: {
        currency: 'DZD',
        ...customData
      }
    })
  }).catch(err => console.error('[Meta CAPI] send failed:', err));
}

window.metaGenerateEventId = metaGenerateEventId;
window.metaGetBrowserIds = metaGetBrowserIds;
window.metaTrackEvent = metaTrackEvent;
window.metaSendToCapi = metaSendToCapi;