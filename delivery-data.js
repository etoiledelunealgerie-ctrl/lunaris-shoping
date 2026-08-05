/* ═══════════════════════════════════════════════════════════════
   LUNARIS — CENTRAL DELIVERY RATES (all 58 wilayas)
   ═══════════════════════════════════════════════════════════════
   Edit prices here — used by BOTH the main site checkout (checkout.html
   via inventory.js) AND landing-page2.html. One place, not two.

   home  = home delivery price (DA)
   desk  = stop-desk / office pickup price (DA), or null if unavailable
   (there is no per-wilaya threshold anymore — see freeDeliveryThreshold
   in product-data.js, which applies site-wide)

   NOTE: these numbers were carried over from your existing rate table
   (the LIHÈNE landing page) as a starting point — double check them
   against your actual ZR Express / delivery partner pricing before
   relying on this for real orders.
   ═══════════════════════════════════════════════════════════════ */

const DELIVERY_RATES = {
  "adrar":               { name: "Adrar",               home: 1400, desk: 970  },
  "chlef":               { name: "Chlef",                home: 750,  desk: 520  },
  "laghouat":            { name: "Laghouat",             home: 950,  desk: 670  },
  "oum el bouaghi":      { name: "Oum El Bouaghi",       home: 800,  desk: 520  },
  "batna":               { name: "Batna",                home: 800,  desk: 520  },
  "bejaia":              { name: "Béjaïa",               home: 800,  desk: 520  },
  "biskra":              { name: "Biskra",               home: 950,  desk: 670  },
  "bechar":              { name: "Béchar",               home: 1100, desk: 720  },
  "blida":               { name: "Blida",                home: 400,  desk: 370  },
  "bouira":              { name: "Bouira",               home: 750,  desk: 520  },
  "tamanrasset":         { name: "Tamanrasset",          home: 1600, desk: 1120 },
  "tebessa":             { name: "Tébessa",              home: 850,  desk: 520  },
  "tlemcen":             { name: "Tlemcen",              home: 850,  desk: 570  },
  "tiaret":              { name: "Tiaret",               home: 800,  desk: 520  },
  "tizi ouzou":          { name: "Tizi Ouzou",           home: 750,  desk: 520  },
  "alger":               { name: "Alger",                home: 500,  desk: 420  },
  "djelfa":              { name: "Djelfa",               home: 950,  desk: 670  },
  "jijel":               { name: "Jijel",                home: 800,  desk: 520  },
  "setif":               { name: "Sétif",                home: 750,  desk: 520  },
  "saida":               { name: "Saïda",                home: 800,  desk: 570  },
  "skikda":              { name: "Skikda",               home: 800,  desk: 520  },
  "sidi bel abbes":      { name: "Sidi Bel Abbès",       home: 800,  desk: 520  },
  "annaba":              { name: "Annaba",               home: 800,  desk: 520  },
  "guelma":              { name: "Guelma",               home: 800,  desk: 520  },
  "constantine":         { name: "Constantine",          home: 800,  desk: 520  },
  "medea":               { name: "Médéa",                home: 750,  desk: 520  },
  "mostaganem":          { name: "Mostaganem",           home: 800,  desk: 520  },
  "msila":               { name: "M'Sila",               home: 850,  desk: 570  },
  "mascara":             { name: "Mascara",               home: 800,  desk: 520  },
  "ouargla":             { name: "Ouargla",              home: 950,  desk: 670  },
  "oran":                { name: "Oran",                 home: 800,  desk: 520  },
  "el bayadh":           { name: "El Bayadh",            home: 1100, desk: 670  },
  "illizi":              { name: "Illizi",               home: 1600, desk: null },
  "bordj bou arreridj":  { name: "Bordj Bou Arréridj",   home: 750,  desk: 520  },
  "boumerdes":           { name: "Boumerdès",            home: 750,  desk: 520  },
  "el tarf":             { name: "El Tarf",              home: 800,  desk: 520  },
  "tindouf":             { name: "Tindouf",              home: 1600, desk: null },
  "tissemsilt":          { name: "Tissemsilt",           home: 800,  desk: 520  },
  "el oued":             { name: "El Oued",              home: 950,  desk: 670  },
  "khenchela":           { name: "Khenchela",            home: 800,  desk: 520  },
  "souk ahras":          { name: "Souk Ahras",           home: 800,  desk: 520  },
  "tipaza":              { name: "Tipaza",               home: 750,  desk: 520  },
  "mila":                { name: "Mila",                 home: 800,  desk: 520  },
  "ain defla":           { name: "Aïn Defla",            home: 750,  desk: 520  },
  "naama":               { name: "Naâma",                home: 1100, desk: 670  },
  "ain temouchent":      { name: "Aïn Témouchent",       home: 800,  desk: 520  },
  "ghardaia":            { name: "Ghardaïa",             home: 950,  desk: 670  },
  "relizane":            { name: "Relizane",             home: 800,  desk: 520  },
  "timimoun":            { name: "Timimoun",             home: 1400, desk: 970  },
  "bordj badji mokhtar": { name: "Bordj Badji Mokhtar",  home: 1600, desk: null },
  "ouled djellal":       { name: "Ouled Djellal",        home: 950,  desk: 670  },
  "beni abbes":          { name: "Béni Abbès",           home: 1200, desk: 970  },
  "in salah":            { name: "In Salah",             home: 1600, desk: 1120 },
  "in guezzam":          { name: "In Guezzam",           home: 1600, desk: null },
  "touggourt":           { name: "Touggourt",            home: 950,  desk: 670  },
  "djanet":              { name: "Djanet",               home: 1600, desk: null },
  "el mghair":           { name: "El M'Ghair",           home: 950,  desk: null },
  "el meniaa":           { name: "El Meniaa",            home: 1000, desk: 670  }
};
