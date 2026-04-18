import { NextRequest, NextResponse } from 'next/server'
import { getAdmin } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const admin = await getAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'csv'
    const status = searchParams.get('status')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    // Construire le filtre
    const where: Record<string, unknown> = {}
    if (status && status !== 'all') where.status = status
    if (from || to) {
      where.createdAt = {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to + 'T23:59:59') }),
      }
    }

    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Préparer les données
    const rows = orders.map((order) => {
      let items: { productName?: string; name?: string; quantity: number; price: number }[] = []
      try { items = JSON.parse(order.items) } catch {}
      const itemsSummary = items.map(i => `${i.quantity}x ${i.productName || i.name}`).join(', ')

      return {
        'ID Commande': order.id.slice(0, 8).toUpperCase(),
        'Date': new Date(order.createdAt).toLocaleDateString('fr-FR'),
        'Client': order.customerName,
        'Téléphone': order.customerPhone,
        'Email': order.customerEmail || '',
        'Adresse': order.customerAddress || '',
        'Produits': itemsSummary,
        'Total (GNF)': order.totalAmount,
        'Statut': order.status,
        'Paiement': order.paymentMethod,
        'Statut Paiement': order.paymentStatus,
        'Notes': order.notes || '',
      }
    })

    if (format === 'csv') {
      // Générer CSV
      const headers = Object.keys(rows[0] || {})
      const csvLines = [
        headers.join(';'),
        ...rows.map(row =>
          headers.map(h => {
            const val = String((row as Record<string, unknown>)[h] || '')
            return `"${val.replace(/"/g, '""')}"`
          }).join(';')
        ),
      ]
      const csvContent = '\uFEFF' + csvLines.join('\n') // BOM pour Excel FR

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="commandes-marche-royal-${new Date().toISOString().slice(0,10)}.csv"`,
        },
      })
    }

    // Format JSON (peut servir pour Excel côté client)
    return NextResponse.json({ orders: rows, total: rows.length })

  } catch (error) {
    console.error('Erreur export:', error)
    return NextResponse.json({ error: 'Erreur export' }, { status: 500 })
  }
}
