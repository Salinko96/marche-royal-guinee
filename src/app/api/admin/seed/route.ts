import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function GET(_request: NextRequest) {
  return POST(_request)
}

export async function POST(request: NextRequest) {
  try {
    // Créer l'admin s'il n'existe pas
    let admin = await db.admin.findUnique({
      where: { email: 'alphasalinko@gmail.com' },
    })

    if (!admin) {
      admin = await db.admin.create({
        data: {
          email: 'alphasalinko@gmail.com',
          password: await hashPassword('Salinko2024'),
          name: 'Alpha Salinko',
          role: 'admin',
        },
      })
    } else {
      // Toujours mettre à jour le mot de passe au dernier hash
      await db.admin.update({
        where: { email: 'alphasalinko@gmail.com' },
        data: { password: await hashPassword('Salinko2024'), name: 'Alpha Salinko' },
      })
    }

    // Supprimer les anciens produits pour re-seeder proprement
    await db.product.deleteMany()

    // Créer les 3 produits avec les vraies images du projet
    const products = await Promise.all([
      db.product.create({
        data: {
          name: 'Montre Style Royal RM – Édition Tendance',
          slug: 'montre-style-royal-rm-edition-tendance',
          category: 'Montres',
          price: 350000,
          originalPrice: 480000,
          shortDescription: "Montre de style luxe contemporain, idéale pour vos sorties, événements spéciaux et cadeaux marquants. Livraison à Conakry.",
          longDescription: "La Montre Style Royal RM – Édition Tendance incarne l'excellence horlogère rendue accessible en Guinée. Son design audacieux aux lignes géométriques pures capture l'essence du luxe contemporain.\n\nCette montre accompagne toutes vos occasions : sorties à Conakry, soirées VIP, événements familiaux. Cadeau mémorable pour un proche.\n\nConçue pour durer, elle allie robustesse et raffinement dans un équilibre remarquable. Disponible exclusivement chez MARCHÉ ROYAL DE GUINÉE.",
          characteristics: JSON.stringify(["Boîtier en alliage haute qualité","Verre minéral résistant aux rayures","Mouvement quartz précis","Bracelet silicone confortable","Étanchéité 3 ATM","Style unisexe moderne","Couleur noir/luxe avec accents métallisés"]),
          highlights: JSON.stringify(["Design exclusif de style luxe contemporain","Parfaite pour impressionner lors de vos soirées à Conakry","Idéale comme cadeau prestige","Style unisexe","Disponible immédiatement à Conakry","Paiement à la livraison possible"]),
          image: '/blanche.jpg',
          images: JSON.stringify(["/blanche.jpg","/vert.jpg","/rouge-jaune-vert-noir.jpg","/noir.jpg","/rouge.jpg","/jaune.jpg","/bleu.jpg","/belle-vue-bleu.jpg"]),
          featured: true,
          inStock: true,
          stockQuantity: 15,
          isNew: false,
          isRealPhoto: true,
          badge: 'Best-seller',
          rating: 5.0,
        },
      }),
      db.product.create({
        data: {
          name: 'Montre Élégance Gold – Style Classique',
          slug: 'montre-elegance-gold-style-classique',
          category: 'Montres',
          price: 500000,
          shortDescription: "Montre de style classique élégant pour vos occasions officielles, cérémonies et moments importants. Disponible à Conakry.",
          longDescription: "La Montre Élégance Gold représente le summum du raffinement et de la sophistication horlogère. Son design classique intemporel aux lignes harmonieuses en fait le compagnon idéal des hommes et femmes d'affaires de Conakry.\n\nSon cadran raffiné avec aiguilles élégantes et index précis témoigne d'un savoir-faire artisanal remarquable. Que ce soit pour un mariage, une réunion d'affaires importante, une cérémonie officielle ou simplement pour affirmer votre statut avec discrétion.\n\nOffrir cette montre, c'est offrir un symbole de réussite. Disponible à Lambanyi, Conakry.",
          characteristics: JSON.stringify(["Boîtier acier inoxydable poli miroir","Verre saphir anti-reflet","Mouvement automatique de précision","Bracelet cuir véritable","Boucle déployante sécurisée","Résistance à l'eau 5 ATM","Finitions main luxe"]),
          highlights: JSON.stringify(["Parfaite pour les réunions d'affaires et occasions professionnelles","Idéale pour cérémonies : mariages, baptêmes, remises de prix","Cadeau prestige exceptionnel","Design classique intemporel","Qualité supérieure garantie","Livraison express à Conakry"]),
          image: '/precious-duke.jpg',
          images: JSON.stringify(["/precious-duke.jpg","/montre-1.jpeg","/montre-2.jpeg","/montre-6.jpeg","/montre-8.jpeg","/montre-9.jpeg","/montre.jpeg","/7437519256192966656.jpg"]),
          featured: true,
          inStock: true,
          stockQuantity: 8,
          isNew: true,
          isRealPhoto: true,
          badge: 'Sélection premium',
          rating: 5.0,
        },
      }),
      db.product.create({
        data: {
          name: 'Coque AG Glass Premium',
          slug: 'coque-ag-glass-premium',
          category: 'Accessoires Téléphone',
          price: 480000,
          shortDescription: "Protection premium en verre trempé AG avec finition matte élégante. Résistance aux chocs 9H, anti-traces, design ultra-fin.",
          longDescription: "La Coque AG Glass Premium offre une protection exceptionnelle pour votre smartphone. Verre trempé renforcé 9H, résistance aux chocs et esthétique raffinée.\n\nTechnologie AG (Anti-Glare) avancée réduisant reflets et traces de doigts. Lisible même sous le soleil de Conakry.\n\nMatériaux première qualité. Installation sans bulles en quelques secondes.",
          characteristics: JSON.stringify(["Verre trempé AG renforcé 9H","Protection anti-chocs avancée","Finition matte anti-traces","Ultra-fin 0.3mm","Installation sans bulles","Toucher naturel préservé","Bords arrondis confortables","Design élégant et professionnel"]),
          highlights: JSON.stringify(["Protection maximale contre chutes et rayures","Design élégant pour votre téléphone","Compatibilité universelle","Rapport qualité-prix exceptionnel","Finition matte propre toute la journée","Idéal pour la vie active à Conakry"]),
          compatibility: JSON.stringify(["iPhone 13, 14, 15, 16","Samsung Galaxy S21-S24","Samsung Galaxy Série A","Xiaomi Redmi Note series","Huawei Série P et Mate","Oppo Série Reno et A","Et bien d'autres – contactez-nous !"]),
          image: '/luxury-glass-matte.jpeg',
          images: JSON.stringify(["/luxury-glass-matte.jpeg","/luxury-glass-matte-2.jpeg","/f9d01d82-379f-42b7-9d7b-49ea74dbe43e.jpg"]),
          featured: true,
          inStock: true,
          stockQuantity: 25,
          isNew: false,
          isRealPhoto: true,
          rating: 5.0,
        },
      }),
    ])

    return NextResponse.json({
      message: 'Base de données initialisée avec succès',
      admin: { id: admin.id, email: admin.email },
      products: products.map((p) => ({ id: p.id, name: p.name, slug: p.slug, price: p.price })),
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: "Erreur lors de l'initialisation de la base de données" },
      { status: 500 }
    )
  }
}
