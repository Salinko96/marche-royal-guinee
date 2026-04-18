// Notifications WhatsApp pour l'admin via CallMeBot API (gratuit)
// Setup : envoyer "I allow callmebot to send me messages" au +34 644 77 14 41
// sur WhatsApp → tu reçois ton WHATSAPP_API_KEY

const STORE_NAME = 'MARCHÉ ROYAL DE GUINÉE'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-GN').format(price) + ' GNF'

interface OrderData {
  orderId: string
  customerName: string
  customerPhone: string
  customerAddress?: string
  items: { productName?: string; name?: string; quantity: number; price: number }[]
  totalAmount: number
  paymentMethod: string
  notes?: string
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Paiement à la livraison',
  orange_money: 'Orange Money',
  mtn_money: 'MTN Money',
}

/**
 * Envoie une notification WhatsApp à l'admin via CallMeBot.
 * Variables d'env requises :
 *   WHATSAPP_ADMIN_PHONE  → numéro international sans + (ex: 224621234567)
 *   WHATSAPP_API_KEY      → clé fournie par CallMeBot
 */
export async function sendWhatsAppOrderNotification(data: OrderData): Promise<void> {
  const phone = process.env.WHATSAPP_ADMIN_PHONE
  const apiKey = process.env.WHATSAPP_API_KEY

  if (!phone || !apiKey) {
    console.log('[WhatsApp] WHATSAPP_ADMIN_PHONE ou WHATSAPP_API_KEY non configuré — notification ignorée')
    return
  }

  const shortId = data.orderId.slice(0, 8).toUpperCase()
  const itemsList = data.items
    .map((i) => `• ${i.quantity}x ${i.productName || i.name} (${formatPrice(i.price)})`)
    .join('\n')

  const message = [
    `🛒 NOUVELLE COMMANDE #${shortId}`,
    `━━━━━━━━━━━━━━━━━━━`,
    `👤 ${data.customerName}`,
    `📞 ${data.customerPhone}`,
    data.customerAddress ? `📍 ${data.customerAddress}` : null,
    `━━━━━━━━━━━━━━━━━━━`,
    itemsList,
    `━━━━━━━━━━━━━━━━━━━`,
    `💰 Total : ${formatPrice(data.totalAmount)}`,
    `💳 ${PAYMENT_LABELS[data.paymentMethod] || data.paymentMethod}`,
    data.notes ? `📝 Notes : ${data.notes}` : null,
    `━━━━━━━━━━━━━━━━━━━`,
    `⚡ Répondre vite = client fidèle !`,
    `👉 Admin : https://marche-royal-guinee.vercel.app/admin/commandes`,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const encoded = encodeURIComponent(message)
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apiKey}`

    const res = await fetch(url, { method: 'GET' })
    if (res.ok) {
      console.log(`[WhatsApp] Notification envoyée au ${phone}`)
    } else {
      console.error('[WhatsApp] Erreur CallMeBot:', res.status, await res.text())
    }
  } catch (err) {
    console.error('[WhatsApp] Exception:', err)
  }
}
