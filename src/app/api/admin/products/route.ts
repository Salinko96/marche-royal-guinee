import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (category) {
      where.category = category
    }

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      slug,
      category,
      price,
      shortDescription,
      longDescription,
      characteristics,
      highlights,
      image,
      images,
      compatibility,
      inStock,
      featured,
    } = body

    if (!name || !slug || !category || !price) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        category,
        price,
        shortDescription: shortDescription || '',
        longDescription: longDescription || '',
        characteristics: characteristics ? JSON.stringify(characteristics) : '{}',
        highlights: highlights ? JSON.stringify(highlights) : '[]',
        image: image || '',
        images: images ? JSON.stringify(images) : '[]',
        compatibility: compatibility ? JSON.stringify(compatibility) : null,
        inStock: inStock !== undefined ? inStock : true,
        featured: featured !== undefined ? featured : false,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}
