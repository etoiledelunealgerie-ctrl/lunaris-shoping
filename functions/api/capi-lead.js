/* functions/api/capi-lead.js
   ============================================================
   TEMPORARY DEBUG VERSION — same logic as before, except:
   if the Supabase insert fails, the actual error text from
   Supabase is returned in the response body instead of only
   being logged. Once we find and fix the real problem, swap
   this back to the quiet version (or just remove the "debug"
   field from the response).
   ============================================================ */

async function sha256Hex(value) {
  if (!value) return undefined;
  const data = new TextEncoder().encode(String(value).trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function normalizePhoneDigits(rawPhone) {
  if (!rawPhone) return undefined;
  let digits = String(rawPhone).replace(/[^0-9]/g, '');
  if (digits.startsWith('0')) digits = '213' + digits.slice(1);
  return digits;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let payload;
  try {
    payload = await request.json();
  } catch (err) {
    return new Response('Invalid JSON', { status: 400 });
  }

  const {
    value,
    currency,
    fname,
    lname,
    phone,
    wilaya,
    commune,
    eventId,
    eventSourceUrl,
    fbp,
    fbc
  } = payload;

  if (!value || !currency || !eventId) {
    return new Response('Missing required fields', { status: 400 });
  }

  // ---------------------------------------------------------
  // 1. FIRE META CAPI "LEAD" EVENT (unchanged)
  // ---------------------------------------------------------
  const pixelId = env.FB_PIXEL_ID;
  const accessToken = env.FB_CAPI_TOKEN;

  if (pixelId && accessToken) {
    const clientIp = request.headers.get('CF-Connecting-IP') || undefined;
    const userAgent = request.headers.get('User-Agent') || undefined;

    const eventPayload = {
      data: [{
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: 'website',
        user_data: {
          client_ip_address: clientIp,
          client_user_agent: userAgent,
          fn: await sha256Hex(fname),
          ln: await sha256Hex(lname),
          ph: await sha256Hex(normalizePhoneDigits(phone)),
          st: await sha256Hex(wilaya),
          ct: await sha256Hex(commune),
          country: await sha256Hex("dz"),
          fbp: fbp,
          fbc: fbc
        },
        custom_data: { value: value, currency: currency },
      }],
    };

    fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    }).catch(err => console.error('Meta CAPI error:', err));
  }

  // ---------------------------------------------------------
  // 2. INSERT ROW INTO SUPABASE — now with the real error surfaced
  // ---------------------------------------------------------
  const supabaseUrl = "https://tnotrlkzqrbahsqfvnlv.supabase.co";
  const supabaseKey = "sb_publishable_z1FWCUpdC-117-o1w1L-Ew_VbHbOgKn";

  let supabaseDebug = null;

  try {
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/myclicks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        fname: fname,
        lname: lname,
        phone: phone,
        wilaya: wilaya,
        commune: commune,
        total_amount: value,
        fbp: fbp,
        fbc: fbc,
        status: 'pending'
      })
    });

    if (!supabaseResponse.ok) {
      const errText = await supabaseResponse.text();
      console.error("Supabase insert failed:", errText);
      supabaseDebug = { status: supabaseResponse.status, error: errText };
    }
  } catch (err) {
    console.error("Supabase request failed:", err);
    supabaseDebug = { error: String(err) };
  }

  return new Response(JSON.stringify({ success: true, supabaseDebug }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}