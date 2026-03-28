import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check if admin already exists
    const existingAdmin = await db.admin.findUnique({
      where: { email: 'alphasalinko@gmail.com' },
    })

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin utilisateur existe déjà' },
        { status: 200 }
      )
    }

    // Create default admin user
    const admin = await db.admin.create({
      data: {
        email: 'alphasalinko@gmail.com',
        password: hashPassword('admin123'),
        name: 'Admin',
        role: 'admin',
      },
    })

    // Create 3 default products
    const products = await Promise.all([
      db.product.create({
        data: {
          name: 'Montre Richard Mille',
          slug: 'montre-richard-mille',
          category: 'Montres',
          price: 350000,
          shortDescription: 'Montre de luxe suisse',
          longDescription: 'Montre Richard Mille authentique avec garantie',
          characteristics: JSON.stringify({
            brand: 'Richard Mille',
            material: 'Titane',
            waterResistance: '50m',
          }),
          highlights: JSON.stringify([
            'Authentique',
            'Garantie internationale',
            'Livraison sécurisée',
          ]),
          image: '/images/montre-richard-mille.jpg',
          images: JSON.stringify([
            '/images/montre-richard-mille.jpg',
          ]),
          featured: true,
          inStock: true,
        },
      }),
      db.product.create({
        data: {
          name: 'Sac à Main',
          slug: 'sac-a-main',
          category: 'Accessoires',
          price: 250000,
          shortDescription: 'Sac à main de designer',
          longDescription: 'Sac à main de luxe en cuir véritable',
          characteristics: JSON.stringify({
            material: 'Cuir véritable',
            color: 'Noir',
            size: 'Moyen',
          }),
          highlights: JSON.stringify([
            'Cuir premium',
            'Design élégant',
            'Durable',
          ]),
          image: '/images/sac-a-main.jpg',
          images: JSON.stringify([
            '/images/sac-a-main.jpg',
          ]),
          featured: true,
          inStock: true,
        },
      }),
      db.product.create({
        data: {
          name: 'Lunettes de Soleil',
          slug: 'lunettes-de-soleil',
          category: 'Accessoires',
          price: 150000,
          shortDescription: 'Lunettes de soleil haut de gamme',
          longDescription: 'Lunettes de soleil de marque avec protection UV',
          characteristics: JSON.stringify({
            brand: 'Luxury',
            lensType: 'Polarisées',
            uvProtection: '100%',
          }),
          highlights: JSON.stringify([
            'Protection UV 100%',
            'Verres polarisés',
            'Design tendance',
          ]),
          image: '/images/lunettes-soleil.jpg',
          images: JSON.stringify([
            '/images/lunettes-soleil.jpg',
          ]),
          featured: true,
          inStock: true,
        },
      }),
    ])

    return NextResponse.json({
      message: 'Base de données initialisée avec succès',
      admin: {
        id: admin.id,
        email: admin.email,
      },
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
      })),
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'initialisation de la base de données' },
      { status: 500 }
    )
  }
}
