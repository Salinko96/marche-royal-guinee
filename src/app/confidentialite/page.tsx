import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | MARCHÉ ROYAL DE GUINÉE',
  description: 'Politique de confidentialité et protection des données personnelles - MARCHÉ ROYAL DE GUINÉE, Conakry.',
};

export default function ConfidentialitePage() {
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
          <Lock className="w-8 h-8 text-[#B8860B]" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Politique de Confidentialité</h1>
            <p className="text-gray-500 text-sm mt-1">Dernière mise à jour : Avril 2026</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              MARCHÉ ROYAL DE GUINÉE s'engage à protéger la vie privée de ses clients. La présente politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre boutique en ligne.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Données collectées</h2>
            <p>Lors de l'utilisation de notre boutique, nous pouvons collecter les données suivantes :</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Données de commande :</strong> nom, numéro de téléphone, adresse de livraison, email (optionnel), contenu de la commande.
              </li>
              <li>
                <strong>Données de compte :</strong> si vous créez un compte, nous conservons votre nom, téléphone, email et mot de passe (chiffré).
              </li>
              <li>
                <strong>Données de navigation :</strong> adresse IP, pages visitées, durée de visite (via Google Analytics et/ou Facebook Pixel).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Finalité de la collecte</h2>
            <p>Vos données sont collectées pour :</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Traiter et suivre vos commandes</li>
              <li>Vous contacter pour confirmer ou préciser votre livraison</li>
              <li>Améliorer nos services et l'expérience utilisateur</li>
              <li>Analyser le trafic sur notre site (statistiques anonymisées)</li>
              <li>Vous envoyer des informations commerciales (uniquement avec votre accord)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Conservation des données</h2>
            <p>
              Vos données de commande sont conservées pendant une durée de <strong>3 ans</strong> à des fins de gestion commerciale et comptable. Vos données de compte restent actives tant que votre compte existe. Vous pouvez demander la suppression de votre compte à tout moment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Partage des données</h2>
            <p>
              Nous ne vendons, ne louons et ne partageons <strong>jamais</strong> vos données personnelles avec des tiers à des fins commerciales. Vos données peuvent uniquement être transmises à nos prestataires techniques (hébergeur, base de données) dans le strict cadre de leur mission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction. Les mots de passe sont stockés sous forme chiffrée (hachage SHA-256). Toutes les communications sont protégées par le protocole HTTPS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Cookies et traceurs</h2>
            <p>Notre site utilise les technologies suivantes :</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Google Analytics :</strong> mesure d'audience anonymisée pour comprendre l'utilisation du site.
              </li>
              <li>
                <strong>Facebook Pixel :</strong> suivi des conversions et amélioration de nos publicités sur Facebook/Instagram.
              </li>
              <li>
                <strong>Cookies de session :</strong> nécessaires au bon fonctionnement de votre panier et de votre espace compte.
              </li>
            </ul>
            <p className="mt-2">
              Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, bien que cela puisse affecter certaines fonctionnalités du site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Vos droits</h2>
            <p>Vous disposez des droits suivants concernant vos données :</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles.</li>
              <li><strong>Droit de rectification :</strong> corriger des informations inexactes.</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données.</li>
              <li><strong>Droit d'opposition :</strong> vous opposer à l'utilisation de vos données à des fins marketing.</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous via WhatsApp au <strong>+224 623 457 689</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact</h2>
            <p>Pour toute question relative à la protection de vos données personnelles :</p>
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
