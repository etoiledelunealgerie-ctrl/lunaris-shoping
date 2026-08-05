import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

async function sha256Hex(value: string | null | undefined): Promise<string | undefined> {
  if (!value) return undefined;
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizePhone(rawPhone: string | null | undefined): string | undefined {
  if (!rawPhone) return undefined;
  let digits = rawPhone.replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) {
    digits = "213" + digits.slice(1);
  }
  return digits;
}

serve(async (req) => {
  try {
    const payload = await req.json();

    const record = payload.record || payload;

    const {
      id,
      fname,
      lname,
      phone,
      wilaya,
      commune,
      total_amount,
      fbp,
      fbc,
      status
    } = record;

    if (status !== "delivered_paid") {
      return new Response(
        JSON.stringify({ message: "Status is not delivered_paid. Event skipped." }),
        { headers: { "Content-Type": "application/json" }, status: 200 }
      );
    }

    const FB_PIXEL_ID = Deno.env.get("FB_PIXEL_ID");
    const FB_CAPI_TOKEN = Deno.env.get("FB_CAPI_TOKEN");

    if (!FB_PIXEL_ID || !FB_CAPI_TOKEN) {
      throw new Error("Missing Meta environment variables on Supabase.");
    }

    const eventId = `purchase_offline_${id}_${Date.now()}`;

    const capiBody = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: "physical_store", 
          user_data: {
            fn: await sha256Hex(fname),
            ln: await sha256Hex(lname),
            ph: await sha256Hex(normalizePhone(phone)),
            st: await sha256Hex(wilaya),     
            ct: await sha256Hex(commune),    
            country: await sha256Hex("dz"),  
            fbp: fbp || undefined,
            fbc: fbc || undefined,
          },
          custom_data: {
            value: Number(total_amount) || 0,
            currency: "DZD",
          },
        },
      ],
    };

    const metaResponse = await fetch(
      `https://graph.facebook.com/v20.0/${FB_PIXEL_ID}/events?access_token=${FB_CAPI_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(capiBody),
      }
    );

    const metaResult = await metaResponse.json();

    return new Response(JSON.stringify(metaResult), {
      headers: { "Content-Type": "application/json" },
      status: metaResponse.ok ? 200 : 400,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});