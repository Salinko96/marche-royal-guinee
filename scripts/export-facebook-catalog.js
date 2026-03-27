/**
 * Script d'export du catalogue produit au format Facebook Commerce
 *
 * Utilisation : node scripts/export-facebook-catalog.js
 *
 * Génère un fichier CSV compatible avec le Gestionnaire de Commerce Facebook.
 * Importez ce fichier dans Facebook Commerce Manager > Catalogue > Sources de données.
 */

const fs = require("fs");
const path = require("path");

// Données produits (à synchroniser avec vos données en base)
const products = [
  {
    id: "1",
    title: "Montre Richard Mille – Édition Tendance",
    description:
      "Style luxe inspiré des modèles Richard Mille, idéale pour vos sorties, événements spéciaux et cadeaux marquants. Boîtier en alliage de haute qualité, verre minéral résistant, mouvement quartz précis.",
    availability: "in stock",
    condition: "new",
    price: "350000 GNF",
    link: "https://marcheroyalguinee.com",
    image_link: "https://marcheroyalguinee.com/blanche.jpg",
    additional_image_link:
      "https://marcheroyalguinee.com/vert.jpg,https://marcheroyalguinee.com/noir.jpg,https://marcheroyalguinee.com/rouge.jpg",
    brand: "MARCHÉ ROYAL DE GUINÉE",
    google_product_category: "Watches",
    fb_product_category: "watches",
    product_type: "Montres > Montres de luxe",
    sale_price: "",
    sale_price_effective_date: "",
    item_group_id: "watches-richard-mille",
    gender: "unisex",
    age_group: "adult",
    color: "Blanc, Vert, Noir, Rouge, Jaune, Bleu",
    shipping_weight: "0.2 kg",
    custom_label_0: "montres",
    custom_label_1: "premium",
  },
  {
    id: "2",
    title: "Montre Cartier – Élégance Classique",
    description:
      "L'élégance classique inspirée de la maison Cartier pour vos occasions officielles, cérémonies et moments importants. Boîtier en acier inoxydable, verre saphir, mouvement automatique.",
    availability: "in stock",
    condition: "new",
    price: "500000 GNF",
    link: "https://marcheroyalguinee.com",
    image_link: "https://marcheroyalguinee.com/precious%20duke.jpg",
    additional_image_link:
      "https://marcheroyalguinee.com/_%20(1).jpeg,https://marcheroyalguinee.com/_%20(2).jpeg",
    brand: "MARCHÉ ROYAL DE GUINÉE",
    google_product_category: "Watches",
    fb_product_category: "watches",
    product_type: "Montres > Montres classiques",
    sale_price: "",
    sale_price_effective_date: "",
    item_group_id: "watches-cartier",
    gender: "unisex",
    age_group: "adult",
    color: "Or, Argent",
    shipping_weight: "0.3 kg",
    custom_label_0: "montres",
    custom_label_1: "prestige",
  },
  {
    id: "3",
    title: "Coque AG Glass Premium",
    description:
      "Protection premium en verre trempé AG avec finition matte élégante. Résistance aux chocs 9H, anti-traces de doigts, design ultra-fin 0.3mm. Compatible iPhone, Samsung, Xiaomi, Huawei, Oppo.",
    availability: "in stock",
    condition: "new",
    price: "480000 GNF",
    link: "https://marcheroyalguinee.com",
    image_link:
      "https://marcheroyalguinee.com/Luxury%20Big%20Window%20AG%20Glass%20Matte.jpeg",
    additional_image_link:
      "https://marcheroyalguinee.com/Luxury%20Big%20Window%20AG%20Glass%20Matte%20(1).jpeg",
    brand: "MARCHÉ ROYAL DE GUINÉE",
    google_product_category: "Phone Cases",
    fb_product_category: "phone cases",
    product_type: "Accessoires Téléphone > Coques de protection",
    sale_price: "",
    sale_price_effective_date: "",
    item_group_id: "phone-cases-ag-glass",
    gender: "unisex",
    age_group: "adult",
    color: "Noir",
    shipping_weight: "0.1 kg",
    custom_label_0: "accessoires",
    custom_label_1: "protection",
  },
];

// Générer le CSV
const headers = Object.keys(products[0]);
const csvContent = [
  headers.join("\t"), // Facebook préfère les TSV (tab-separated)
  ...products.map((product) =>
    headers.map((h) => `"${(product[h] || "").replace(/"/g, '""')}"`).join("\t")
  ),
].join("\n");

// Écrire le fichier
const outputPath = path.join(__dirname, "..", "public", "facebook-catalog.tsv");
fs.writeFileSync(outputPath, csvContent, "utf-8");

console.log(`✅ Catalogue Facebook exporté avec succès !`);
console.log(`   Fichier : ${outputPath}`);
console.log(`   Produits : ${products.length}`);
console.log("");
console.log("📋 Étapes suivantes :");
console.log("   1. Allez dans le Gestionnaire de Commerce Facebook");
console.log("   2. Créez un nouveau catalogue ou ouvrez un existant");
console.log("   3. Sources de données > Ajouter des produits > Importer");
console.log("   4. Importez le fichier facebook-catalog.tsv");
console.log("   5. Liez le catalogue à votre Page Facebook");
