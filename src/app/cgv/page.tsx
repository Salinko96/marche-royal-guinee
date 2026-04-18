import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente | MARCHÉ ROYAL DE GUINÉE',
  description: 'Conditions générales de vente de la boutique MARCHÉ ROYAL DE GUINÉE, Conakry, Guinée.',
};

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft className="w-5 h-5 text-[#B8860B]" />
            <BrandLogo size="sm" href="" />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 pb-16">
        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="w-8 h-8 text-[#B8860B]" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Conditions Générales de Vente</h1>
            <p className="text-gray-500 text-sm mt-1">Dernière mise à jour : Avril 2026</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Présentation de la boutique</h2>
            <p>
              <strong>MARCHÉ ROYAL DE GUINÉE</strong> est une boutique en ligne spécialisée dans la vente de montres et accessoires premium, basée à Lambanyi, Conakry, République de Guinée. Contact : +224 623 457 689 (WhatsApp et appels).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Champ d'application</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent toutes les transactions effectuées via le site MARCHÉ ROYAL DE GUINÉE. Toute commande passée sur notre boutique implique l'acceptation pleine et entière des présentes CGV.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Produits et disponibilité</h2>
            <p>
              Les produits présentés sur notre boutique sont disponibles dans la limite des stocks existants. En cas d'indisponibilité d'un produit après la passation de votre commande, nous vous en informerons dans les plus brefs délais et vous proposerons soit un produit de substitution, soit un remboursement intégral.
            </p>
            <p className="mt-2">
              Les photographies et descriptions des produits sont fournies à titre indicatif et ne sont pas contractuelles. Nous nous efforçons de présenter les produits aussi fidèlement que possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Prix</h2>
            <p>
              Tous les prix affichés sur le site sont exprimés en <strong>Francs Guinéens (GNF)</strong> et sont valables jusqu'à modification par notre boutique. Les prix peuvent être modifiés à tout moment, mais les commandes sont facturées au prix en vigueur au moment de leur validation.
            </p>
            <p className="mt-2">
              Les frais de livraison, s'ils s'appliquent, sont précisés avant la validation définitive de votre commande.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Commande</h2>
            <p>
              Pour passer une commande, le client doit renseigner ses informations personnelles (nom, numéro de téléphone, adresse de livraison) et choisir son mode de paiement. Un numéro de commande unique lui est attribué à la confirmation.
            </p>
            <p className="mt-2">
              Notre équipe vous contactera dans un délai maximum de <strong>24 heures</strong> pour confirmer votre commande et convenir des modalités de livraison.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Paiement</h2>
            <p>Nous acceptons les modes de paiement suivants :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Paiement à la livraison (cash)</strong> : Vous payez en espèces à la réception de votre commande.</li>
              <li><strong>Orange Money</strong> : Paiement mobile via Orange Money Guinée.</li>
              <li><strong>MTN Mobile Money</strong> : Paiement mobile via MTN MoMo Guinée.</li>
            </ul>
            <p className="mt-2">
              Aucun paiement en ligne par carte bancaire n'est actuellement proposé.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Livraison</h2>
            <p>
              Nous livrons principalement à <strong>Conakry et ses environs</strong>. Le délai de livraison est généralement de <strong>24 à 48 heures</strong> après confirmation de votre commande. Notre livreur vous contacte par téléphone avant le passage.
            </p>
            <p className="mt-2">
              Les livraisons sont effectuées du lundi au samedi, de 9h à 19h. En cas d'absence lors de la livraison, un nouveau rendez-vous sera convenu avec vous.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Retours et remboursements</h2>
            <p>
              Vous disposez d'un délai de <strong>48 heures</strong> après réception pour signaler tout problème avec votre commande (produit défectueux, erreur de commande). Pour exercer ce droit, contactez-nous via WhatsApp au +224 623 457 689 en joignant une photo du produit concerné.
            </p>
            <p className="mt-2">
              Les retours sont acceptés uniquement si le produit est dans son état d'origine, non utilisé. Les frais de retour sont à notre charge en cas d'erreur de notre part.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Garantie</h2>
            <p>
              Tous nos produits bénéficient d'une <strong>garantie de 30 jours</strong> contre les défauts de fabrication. Cette garantie ne couvre pas les dommages causés par une utilisation anormale ou un accident.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Responsabilité</h2>
            <p>
              MARCHÉ ROYAL DE GUINÉE s'engage à traiter vos commandes avec soin et professionnalisme. Nous ne saurions être tenus responsables des retards liés à des circonstances indépendantes de notre volonté (intempéries, perturbations de la circulation, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Données personnelles</h2>
            <p>
              Les informations que vous nous communiquez lors de votre commande sont utilisées uniquement pour le traitement et le suivi de votre commande. Nous ne vendons pas vos données à des tiers. Pour plus d'informations, consultez notre{' '}
              <Link href="/confidentialite" className="text-[#B8860B] underline hover:no-underline">
                Politique de Confidentialité
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Droit applicable</h2>
            <p>
              Les présentes CGV sont soumises au droit guinéen. Tout litige relatif à l'interprétation ou à l'exécution des présentes CGV sera soumis à la compétence des tribunaux de Conakry.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">13. Contact</h2>
            <p>
              Pour toute question relative à ces CGV, contactez-nous :
            </p>
            <ul className="mt-2 space-y-1">
              <li>📱 WhatsApp / Appel : <strong>+224 623 457 689</strong></li>
              <li>📍 Adresse : <strong>Lambanyi, Conakry, Guinée</strong></li>
              <li>🕐 Horaires : <strong>Lundi – Samedi, 9h – 19h</strong></li>
            </ul>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <p className="text-white font-semibold mb-2">MARCHÉ ROYAL DE GUINÉE</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
          </div>
          <p className="mt-3 text-xs">© {new Date().getFullYear()} MARCHÉ ROYAL DE GUINÉE</p>
        </div>
      </footer>
    </div>
  );
}
