// SMS via Africa's Talking — couvre la Guinée (pays code +224)
// Compte gratuit sandbox sur https://africastalking.com
// Variables d'env requises :
//   AT_USERNAME  → ton username Africa's Talking
//   AT_API_KEY   → ta clé API Africa's Talking
//   AT_SENDER_ID → (optionnel) nom affiché (ex: "MARCHE ROYAL")

import AfricasTalking from 'africastalking'

let _client: ReturnType<typeof AfricasTalking> | null = null

function getClient() {
  if (!_client) {
    _client = AfricasTalking({
      username: process.env.AT_USERNAME || '',
      apiKey: process.env.AT_API_KEY || '',
    })
  }
  return _client
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-GN').format(price) + ' GNF'

interface SmsOrderData {
  orderId: string
  customerName: string
  customerPhone: string
  totalAmount: number
}

/**
 * SMS de confirmation au client après sa commande.
 * Le numéro doit être au format international : +224XXXXXXXXX
 */
export async function sendOrderConfirmationSms(data: SmsOrderData): Promise<void> {
  if (!process.env.AT_USERNAME || !process.env.AT_API_KEY) {
    console.log('[SMS] AT_USERNAME ou AT_API_KEY non configuré — SMS ignoré')
    return
  }

  const shortId = data.orderId.slice(0, 8).toUpperCase()

  // Normaliser le numéro guinéen → +224XXXXXXXXX
  let phone = data.customerPhone.replace(/\s/g, '')
  if (phone.startsWith('0')) phone = '+224' + phone.slice(1)
  else if (!phone.startsWith('+')) phone = '+224' + phone

  const message =
    `MARCHE ROYAL: Bonjour ${data.customerName}, votre commande #${shortId} est confirmee! ` +
    `Total: ${formatPrice(data.totalAmount)}. ` +
    `Notre equipe vous appellera sous 24h pour la livraison a Conakry. ` +
    `Suivi: marcheroyalguinee.com/suivi`

  try {
    const sms = getClient().SMS
    const result = await sms.send({
      to: [phone],
      message,
      from: process.env.AT_SENDER_ID,
    })

    const recipient = result.SMSMessageData?.Recipients?.[0]
    if (recipient?.status === 'Success') {
      console.log(`[SMS] Confirmation envoyée à ${phone}`)
    } else {
      console.error('[SMS] Erreur:', recipient?.status, recipient?.statusCode)
    }
  } catch (err) {
    console.error('[SMS] Exception:', err)
  }
}
