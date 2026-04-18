import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await db.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du produit' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { id } = await params
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
      stockQuantity,
      variants,
      tags,
      originalPrice,
      isRealPhoto,
      badge,
      isNew,
    } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (category !== undefined) updateData.category = category
    if (price !== undefined) updateData.price = price
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription
    if (longDescription !== undefined) updateData.longDescription = longDescription
    if (characteristics !== undefined) updateData.characteristics = JSON.stringify(characteristics)
    if (highlights !== undefined) updateData.highlights = JSON.stringify(highlights)
    if (image !== undefined) updateData.image = image
    if (images !== undefined) updateData.images = JSON.stringify(images)
    if (compatibility !== undefined) updateData.compatibility = compatibility ? JSON.stringify(compatibility) : null
    if (inStock !== undefined) updateData.inStock = inStock
    if (featured !== undefined) updateData.featured = featured
    if (stockQuantity !== undefined) updateData.stockQuantity = stockQuantity
    if (variants !== undefined) updateData.variants = JSON.stringify(variants)
    if (tags !== undefined) updateData.tags = JSON.stringify(tags)
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice !== null ? originalPrice : null
    if (isRealPhoto !== undefined) updateData.isRealPhoto = isRealPhoto
    if (badge !== undefined) updateData.badge = badge || null
    if (isNew !== undefined) updateData.isNew = isNew

    const product = await db.product.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { id } = await params
    await db.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    )
  }
}
