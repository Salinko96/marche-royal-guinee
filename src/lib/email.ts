import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const STORE_NAME = 'MARCHÉ ROYAL DE GUINÉE'
const STORE_PHONE = '+224 623 457 689'
const STORE_ADDRESS = 'Lambanyi, Conakry – Guinée'
const STORE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marche-royal-guinee.vercel.app'
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-GN').format(price) + ' GNF'

interface OrderItem {
  productName?: string
  name?: string
  quantity: number
  price: number
}

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress?: string
  items: OrderItem[]
  totalAmount: number
  paymentMethod: string
  notes?: string
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Paiement à la livraison (espèces)',
  orange_money: 'Orange Money',
  mtn_money: 'MTN Mobile Money',
}

function buildOrderEmailHtml(data: OrderEmailData): string {
  const itemsRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;">
          ${item.productName || item.name}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#555;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;text-align:right;white-space:nowrap;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join('')

  const shortId = data.orderId.slice(0, 8).toUpperCase()

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:36px 40px;text-align:center;">
            <p style="color:#D4A418;font-size:28px;font-weight:900;margin:0;letter-spacing:2px;">👑 MARCHÉ ROYAL</p>
            <p style="color:#f0c040;font-size:13px;margin:6px 0 0;letter-spacing:3px;text-transform:uppercase;">DE GUINÉE</p>
          </td>
        </tr>

        <!-- Success Banner -->
        <tr>
          <td style="background:#f0fdf4;padding:20px 40px;text-align:center;border-bottom:1px solid #dcfce7;">
            <p style="color:#16a34a;font-size:20px;font-weight:700;margin:0;">✅ Commande confirmée !</p>
            <p style="color:#15803d;font-size:14px;margin:6px 0 0;">Merci pour votre confiance, ${data.customerName}.</p>
          </td>
        </tr>

        <!-- Order ID -->
        <tr>
          <td style="padding:24px 40px 0;text-align:center;">
            <p style="color:#666;font-size:13px;margin:0;">Numéro de commande</p>
            <p style="color:#B8860B;font-size:28px;font-weight:900;margin:8px 0;letter-spacing:2px;font-family:monospace;">#${shortId}</p>
            <a href="${STORE_URL}/suivi?id=${data.orderId}"
               style="display:inline-block;background:#B8860B;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;margin-top:4px;">
              Suivre ma commande →
            </a>
          </td>
        </tr>

        <!-- Items table -->
        <tr>
          <td style="padding:24px 40px;">
            <p style="font-size:15px;font-weight:700;color:#1a1a1a;margin:0 0 12px;border-left:3px solid #B8860B;padding-left:10px;">
              Détail de la commande
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #f0f0f0;">
              <thead>
                <tr style="background:#fafafa;">
                  <th style="padding:10px 12px;text-align:left;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;">Produit</th>
                  <th style="padding:10px 12px;text-align:center;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;">Qté</th>
                  <th style="padding:10px 12px;text-align:right;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;">Total</th>
                </tr>
              </thead>
              <tbody>${itemsRows}</tbody>
              <tfoot>
                <tr style="background:#FFF9E6;">
                  <td colspan="2" style="padding:12px;font-weight:700;font-size:15px;color:#1a1a1a;">Total à payer</td>
                  <td style="padding:12px;font-weight:900;font-size:18px;color:#B8860B;text-align:right;white-space:nowrap;">${formatPrice(data.totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </td>
        </tr>

        <!-- Delivery & Payment info -->
        <tr>
          <td style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="48%" style="background:#f8f8f8;border-radius:8px;padding:16px;vertical-align:top;">
                  <p style="font-size:12px;color:#888;margin:0 0 6px;text-transform:uppercase;font-weight:600;">Livraison</p>
                  <p style="font-size:14px;color:#333;margin:0;">${data.customerName}</p>
                  <p style="font-size:13px;color:#555;margin:4px 0 0;">${data.customerPhone}</p>
                  ${data.customerAddress ? `<p style="font-size:13px;color:#555;margin:4px 0 0;">${data.customerAddress}</p>` : ''}
                </td>
                <td width="4%"></td>
                <td width="48%" style="background:#f8f8f8;border-radius:8px;padding:16px;vertical-align:top;">
                  <p style="font-size:12px;color:#888;margin:0 0 6px;text-transform:uppercase;font-weight:600;">Paiement</p>
                  <p style="font-size:14px;color:#333;margin:0;">${PAYMENT_LABELS[data.paymentMethod] || data.paymentMethod}</p>
                  <p style="font-size:13px;color:#27ae60;margin:6px 0 0;font-weight:600;">✓ Paiement à la livraison</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${data.notes ? `
        <tr>
          <td style="padding:0 40px 24px;">
            <div style="background:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:16px;">
              <p style="font-size:12px;color:#888;margin:0 0 4px;font-weight:600;">Notes</p>
              <p style="font-size:14px;color:#555;margin:0;">${data.notes}</p>
            </div>
          </td>
        </tr>` : ''}

        <!-- What's next -->
        <tr>
          <td style="padding:0 40px 24px;">
            <div style="background:#EFF6FF;border-radius:8px;padding:20px;">
              <p style="font-size:14px;font-weight:700;color:#1e40af;margin:0 0 12px;">📋 Prochaines étapes</p>
              <p style="font-size:13px;color:#1e40af;margin:6px 0;">1. Notre équipe va confirmer votre commande sous <strong>24h</strong></p>
              <p style="font-size:13px;color:#1e40af;margin:6px 0;">2. Vous recevrez un appel/SMS pour convenir de la livraison</p>
              <p style="font-size:13px;color:#1e40af;margin:6px 0;">3. Livraison rapide à votre adresse à Conakry</p>
              <p style="font-size:13px;color:#1e40af;margin:6px 0;">4. Paiement à la réception de votre commande</p>
            </div>
          </td>
        </tr>

        <!-- WhatsApp CTA -->
        <tr>
          <td style="padding:0 40px 32px;text-align:center;">
            <p style="font-size:14px;color:#555;margin:0 0 12px;">Besoin d'aide ou questions sur votre commande ?</p>
            <a href="https://wa.me/224623457689?text=${encodeURIComponent(`Bonjour, je voudrais des informations sur ma commande #${shortId}`)}"
               style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;">
              💬 Nous contacter sur WhatsApp
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a1a2e;padding:24px 40px;text-align:center;">
            <p style="color:#D4A418;font-weight:700;margin:0 0 6px;">${STORE_NAME}</p>
            <p style="color:#888;font-size:12px;margin:0;">${STORE_ADDRESS} · ${STORE_PHONE}</p>
            <p style="color:#555;font-size:11px;margin:12px 0 0;">
              <a href="${STORE_URL}/cgv" style="color:#666;text-decoration:none;">CGV</a> &nbsp;·&nbsp;
              <a href="${STORE_URL}/confidentialite" style="color:#666;text-decoration:none;">Confidentialité</a> &nbsp;·&nbsp;
              <a href="${STORE_URL}/mentions-legales" style="color:#666;text-decoration:none;">Mentions légales</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email] RESEND_API_KEY non configurée — email non envoyé')
    return false
  }

  if (!data.customerEmail) {
    return false
  }

  try {
    const { error } = await getResend().emails.send({
      from: `${STORE_NAME} <${FROM_EMAIL}>`,
      to: [data.customerEmail],
      subject: `✅ Commande #${data.orderId.slice(0, 8).toUpperCase()} confirmée — ${STORE_NAME}`,
      html: buildOrderEmailHtml(data),
    })

    if (error) {
      console.error('[Email] Erreur Resend:', error)
      return false
    }

    console.log(`[Email] Confirmation envoyée à ${data.customerEmail}`)
    return true
  } catch (err) {
    console.error('[Email] Exception:', err)
    return false
  }
}

export async function sendAdminNewOrderNotification(data: OrderEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!process.env.RESEND_API_KEY || !adminEmail) return

  const shortId = data.orderId.slice(0, 8).toUpperCase()
  const itemsSummary = data.items
    .map((i) => `${i.quantity}x ${i.productName || i.name}`)
    .join(', ')

  try {
    await getResend().emails.send({
      from: `${STORE_NAME} <${FROM_EMAIL}>`,
      to: [adminEmail],
      subject: `🛒 Nouvelle commande #${shortId} — ${data.customerName} — ${formatPrice(data.totalAmount)}`,
      html: `
        <div style="font-family:sans-serif;padding:24px;max-width:500px;">
          <h2 style="color:#B8860B;">Nouvelle commande reçue 🛒</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#666;width:140px;">Commande</td><td><strong>#${shortId}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#666;">Client</td><td><strong>${data.customerName}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#666;">Téléphone</td><td><strong>${data.customerPhone}</strong></td></tr>
            ${data.customerAddress ? `<tr><td style="padding:6px 0;color:#666;">Adresse</td><td>${data.customerAddress}</td></tr>` : ''}
            <tr><td style="padding:6px 0;color:#666;">Articles</td><td>${itemsSummary}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Paiement</td><td>${PAYMENT_LABELS[data.paymentMethod] || data.paymentMethod}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Total</td><td><strong style="color:#B8860B;font-size:18px;">${formatPrice(data.totalAmount)}</strong></td></tr>
          </table>
          <a href="${STORE_URL}/admin/commandes" style="display:inline-block;margin-top:16px;background:#B8860B;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">
            Voir dans l'admin →
          </a>
        </div>
      `,
    })
  } catch (err) {
    console.error('[Email] Erreur notification admin:', err)
  }
}
