import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions Légales | MARCHÉ ROYAL DE GUINÉE',
  description: 'Mentions légales de la boutique MARCHÉ ROYAL DE GUINÉE, Conakry, Guinée.',
};

export default function MentionsLegalesPage() {
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
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-[#B8860B]" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mentions Légales</h1>
            <p className="text-gray-500 text-sm mt-1">Dernière mise à jour : Avril 2026</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Éditeur du site</h2>
            <p>Le site <strong>marcheroyalguinee.com</strong> est édité par :</p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-1">
              <p><strong>Raison sociale :</strong> MARCHÉ ROYAL DE GUINÉE</p>
              <p><strong>Siège social :</strong> Lambanyi, Conakry, République de Guinée</p>
              <p><strong>Téléphone :</strong> +224 623 457 689</p>
              <p><strong>Horaires :</strong> Lundi – Samedi, 9h – 19h</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Activité</h2>
            <p>
              MARCHÉ ROYAL DE GUINÉE est une boutique en ligne spécialisée dans la vente de montres, accessoires pour téléphone et articles premium. Nous opérons principalement à Conakry et ses environs avec livraison à domicile.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Hébergement</h2>
            <p>Ce site est hébergé par :</p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-1">
              <p><strong>Prestataire :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
              <p><strong>Site web :</strong> vercel.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, logos, design) est la propriété exclusive de MARCHÉ ROYAL DE GUINÉE, sauf mention contraire. Toute reproduction, représentation ou diffusion sans autorisation préalable est strictement interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Données personnelles</h2>
            <p>
              Conformément à notre engagement en matière de protection des données, nous collectons uniquement les informations nécessaires au traitement de vos commandes. Pour plus de détails, consultez notre{' '}
              <Link href="/confidentialite" className="text-[#B8860B] underline hover:no-underline">
                Politique de Confidentialité
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies</h2>
            <p>
              Notre site peut utiliser des cookies à des fins statistiques (Google Analytics) et publicitaires (Facebook Pixel) afin d'améliorer votre expérience de navigation. En continuant à utiliser ce site, vous acceptez l'utilisation de ces cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Liens hypertextes</h2>
            <p>
              Notre site peut contenir des liens vers des sites tiers. MARCHÉ ROYAL DE GUINÉE ne peut être tenu responsable du contenu de ces sites externes ni de leur politique de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont soumises au droit de la République de Guinée. Tout litige relatif à l'utilisation du site sera soumis à la compétence exclusive des tribunaux de Conakry.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact</h2>
            <p>Pour toute question ou réclamation :</p>
            <ul className="mt-2 space-y-1">
              <li>📱 <strong>+224 623 457 689</strong> (WhatsApp et appels)</li>
              <li>📍 Lambanyi, Conakry, Guinée</li>
              <li>🕐 Lundi – Samedi, 9h – 19h</li>
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
