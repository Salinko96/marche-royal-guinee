'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Truck, Star, Heart, MapPin, Phone, MessageCircle, Crown, ArrowLeft } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-600 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <Image src="/logo-royal.png" alt="Marché Royal" width={100} height={50} className="h-10 w-auto object-contain" />
          <Link href="/produits">
            <Button size="sm" className="bg-[#B8860B] hover:bg-[#9A7209] text-white">
              Nos produits
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1400] to-[#0a0a0a] py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #D4A418 0%, transparent 70%)'
        }} />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#D4A418]/10 border border-[#D4A418]/30 text-[#D4A418] text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Crown className="h-4 w-4" />
            Notre histoire
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
            Marché Royal<br />
            <span className="text-[#D4A418]">de Guinée</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            La première boutique en ligne premium de Guinée, spécialisée dans les montres de prestige
            et les accessoires de qualité. Basée à Conakry, nous livrons partout en Guinée.
          </p>
        </motion.div>
      </section>

      {/* Notre mission */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Rendre le luxe <span className="text-[#B8860B]">accessible</span> à tous les Guinéens
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Marché Royal de Guinée est né d&apos;une conviction simple : chaque Guinéen mérite d&apos;avoir
              accès à des produits de qualité, livrés rapidement et payables à la livraison.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Nous sélectionnons avec soin chaque produit de notre catalogue — des montres élégantes aux
              accessoires premium — pour vous offrir un rapport qualité-prix exceptionnel.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Pas besoin de carte bancaire, pas de frais cachés. Vous commandez, nous livrons,
              vous payez en espèces ou via Mobile Money à la réception.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Shield, label: 'Qualité garantie', desc: 'Chaque produit est vérifié avant expédition' },
              { icon: Truck, label: 'Livraison rapide', desc: 'Conakry et toute la Guinée' },
              { icon: Star, label: 'Premium abordable', desc: 'Les meilleurs prix du marché' },
              { icon: Heart, label: 'Satisfaction client', desc: 'Retour possible sous 7 jours' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#FFF9E6] to-white border border-[#D4A418]/20 rounded-2xl p-5"
              >
                <item.icon className="h-6 w-6 text-[#B8860B] mb-3" />
                <p className="font-bold text-gray-900 text-sm mb-1">{item.label}</p>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="bg-gradient-to-r from-[#0a0a0a] to-[#1a1400] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Clients satisfaits' },
              { value: '100%', label: 'Paiement à la livraison' },
              { value: '24h', label: 'Délai de confirmation' },
              { value: '5★', label: 'Note moyenne' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p className="text-4xl font-black text-[#D4A418] mb-2">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi nous choisir ?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Nous construisons une relation de confiance durable avec chaque client.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: 'Authenticité',
              desc: 'Tous nos produits sont authentiques et correspondent exactement aux photos. Pas de mauvaises surprises.',
              emoji: '✅',
            },
            {
              title: 'Transparence',
              desc: 'Prix clairs, pas de frais cachés. Ce que vous voyez est ce que vous payez, à la livraison.',
              emoji: '💎',
            },
            {
              title: 'Réactivité',
              desc: 'Notre équipe répond sur WhatsApp en moins de 5 minutes, 7j/7, de 8h à 22h.',
              emoji: '⚡',
            },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{v.emoji}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Besoin de nous parler ?</h2>
          <p className="text-gray-500 mb-8">Nous sommes disponibles 7j/7 pour répondre à vos questions.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/224623457689" target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-600 hover:bg-green-700 text-white gap-2 h-12 px-6">
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </Button>
            </a>
            <a href="tel:+224623457689">
              <Button variant="outline" className="gap-2 h-12 px-6">
                <Phone className="h-5 w-5" />
                +224 623 457 689
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" className="gap-2 h-12 px-6">
                <MapPin className="h-5 w-5" />
                Nous trouver
              </Button>
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-6">
            📍 Lambanyi, Conakry – Guinée
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à découvrir nos produits ?
          </h2>
          <Link href="/produits">
            <Button className="bg-[#B8860B] hover:bg-[#9A7209] text-white h-12 px-8 text-base font-semibold">
              Voir le catalogue 👑
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
