const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType, VerticalAlign,
        HeadingLevel, PageBreak } = require('docx');
const fs = require('fs');

// Professional content for MARCHÉ ROYAL DE GUINÉE
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 48, bold: true, color: "B8860B", font: "Times New Roman" },
        paragraph: { spacing: { before: 0, after: 300 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: "1A1A1A", font: "Times New Roman" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "B8860B", font: "Times New Roman" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: "333333", font: "Times New Roman" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-main",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-product1",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-product2",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-product3",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-faq",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-faq",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      // ============================================
      // COVER PAGE
      // ============================================
      new Paragraph({ spacing: { before: 2000 } }),
      new Paragraph({ 
        heading: HeadingLevel.TITLE,
        children: [new TextRun({ text: "MARCHÉ ROYAL DE GUINÉE", bold: true, size: 56, color: "B8860B" })]
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 400 },
        children: [new TextRun({ text: "ROYAL GUINEA MARKET", size: 32, color: "666666", italics: true })]
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 200 },
        children: [new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", size: 24, color: "D4A418" })]
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
        children: [new TextRun({ text: "TEXTES E-COMMERCE PROFESSIONNELS", size: 28, bold: true, color: "1A1A1A" })]
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 200 },
        children: [new TextRun({ text: "Boutique en ligne de montres et accessoires", size: 24, color: "666666" })]
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 200 },
        children: [new TextRun({ text: "Lambanyi, Conakry, Guinée", size: 22, color: "888888" })]
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 200 },
        children: [new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", size: 24, color: "D4A418" })]
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // ============================================
      // SECTION 1: TEXTES PRODUITS
      // ============================================
      new Paragraph({ 
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("SECTION 1 : TEXTES PRODUITS")]
      }),
      
      // ============================================
      // PRODUIT A: MONTRE RICHARD MILLE
      // ============================================
      new Paragraph({ 
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("A. MONTRE RICHARD MILLE – ÉDITION TENDANCE")]
      }),
      
      // Titre H1
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Titre H1 optimisé :")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun({ text: "Montre Richard Mille – Édition Tendance : Le Style Luxe Accessible à Conakry", bold: true, size: 26 })]
      }),
      
      // Sous-titre accrocheur
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Sous-titre accrocheur :")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun({ text: "Affirmez votre personnalité avec une montre au design audacieux qui ne passera pas inaperçu au poignet.", italics: true })]
      }),
      
      // Description courte
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Description courte (liste produits) :")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Style luxe inspiré des grandes maisons horlogères, idéal pour vos sorties à Conakry, vos événements spéciaux et vos cadeaux marquants. Une pièce audacieuse qui attirera tous les regards.")]
      }),
      
      // Description longue
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Description longue (fiche produit) :")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("La Montre Richard Mille – Édition Tendance incarne l'excellence horlogère rendue accessible au plus grand nombre en Guinée. Ce chef-d'œuvre de design s'inspire des lignes emblématiques et audacieuses de la maison Richard Mille, offrant un look résolument contemporain qui ne passera pas inaperçu au poignet. Son boîtier aux formes géométriques pures et son cadran sophistiqué avec détails raffinés en font l'accessoire parfait pour ceux qui souhaitent affirmer leur style avec confiance et originalité.")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("Cette montre tendance accompagne toutes vos occasions importantes : sorties entre amis à Conakry, soirées VIP à Kaloum, événements familiaux ou rencontres professionnelles décontractées. Elle constitue également un cadeau mémorable pour un proche qui mérite une attention spéciale – anniversaire, réussite scolaire, mariage ou promotion professionnelle. Le mariage parfait entre l'artisanat traditionnel et l'esthétique moderne se reflète dans chaque détail de cette pièce exceptionnelle.")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("Conçue pour durer, cette montre allie robustesse et raffinement dans un équilibre remarquable. Son mécanisme de précision garantit une fiabilité absolue au fil des heures, tandis que son design audacieux traverse les modes sans jamais se démoder. Portez-la fièrement et laissez votre personnalité distinctive briller à travers cet accessoire qui en dit long sur votre goût pour l'excellence et votre volonté de vous distinguer.")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Disponible exclusivement chez MARCHÉ ROYAL DE GUINÉE à Lambanyi, cette pièce représente bien plus qu'une simple montre : c'est un véritable statement de style pour l'homme ou la femme moderne de Conakry qui refuse la banalité. Commandez maintenant par WhatsApp et recevez votre montre en 24 à 48 heures directement chez vous, avec paiement à la livraison – zéro risque, confiance totale.")]
      }),
      
      // Caractéristiques
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Caractéristiques :")]
      }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, children: [new TextRun("Boîtier en alliage de haute qualité avec finitions luxueuses et détails raffinés")] }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, children: [new TextRun("Verre minéral résistant aux rayures et aux impacts du quotidien")] }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, children: [new TextRun("Mouvement quartz précis pour une fiabilité à toute épreuve")] }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, children: [new TextRun("Bracelet en silicone confortable, ajustable et durable")] }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, children: [new TextRun("Étanchéité quotidienne (3 ATM) – résiste aux éclaboussures et à la pluie")] }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, children: [new TextRun("Style unisexe moderne – parfaite aussi bien pour homme que pour femme")] }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, children: [new TextRun("Couleur dominante : noir/luxe avec accents métallisés dorés")] }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Occasions idéales : sorties, soirées, événements, cadeaux, style quotidien à Conakry")] }),
      
      // Pourquoi vous allez l'adorer
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Pourquoi vous allez l'adorer :")]
      }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, children: [new TextRun("Design exclusif inspiré des grandes maisons horlogères mondiales, sans le prix exorbitant")] }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, children: [new TextRun("Parfaite pour impressionner lors de vos soirées et événements à Conakry – vous serez le centre d'attention")] }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, children: [new TextRun("Idéale comme cadeau prestige pour un proche (anniversaire, réussite, mariage, remise de diplôme)")] }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, children: [new TextRun("Style unisexe qui convient aussi bien aux hommes qu'aux femmes modernes et audacieux")] }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, children: [new TextRun("Disponible immédiatement à Conakry – pas d'attente ni d'importation compliquée depuis l'étranger")] }),
      new Paragraph({ numbering: { reference: "bullet-product1", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Paiement à la livraison possible – vous payez uniquement quand vous tenez la montre entre vos mains")] }),
      
      // Livraison & Paiement
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Livraison & Paiement :")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun({ text: "Livraison disponible : ", bold: true }), new TextRun("Conakry et environs proches (Coyah, Dubréka). Nous livrons dans tous les quartiers : Kaloum, Dixinn, Ratoma, Matam, Matoto, Lambanyi, etc.")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun({ text: "Délai moyen : ", bold: true }), new TextRun("24 à 48 heures pour Conakry intra-muros. Livraison express le jour même possible selon disponibilité.")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun({ text: "Paiement à la livraison : ", bold: true }), new TextRun("Cash (espèces) ou Mobile Money (Orange Money, MTN Mobile Money). Vous payez uniquement quand vous recevez votre montre.")]
      }),
      new Paragraph({ 
        spacing: { after: 300 },
        children: [new TextRun({ text: "Commande simple : ", bold: true }), new TextRun("Cliquez sur le bouton WhatsApp, envoyez-nous un message et nous organisons la livraison selon vos disponibilités. Réponse rapide garantie !")]
      }),
      
      // ============================================
      // PRODUIT B: MONTRE CARTIER
      // ============================================
      new Paragraph({ 
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("B. MONTRE CARTIER – ÉLÉGANCE CLASSIQUE")]
      }),
      
      // Titre H1
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Titre H1 optimisé :")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun({ text: "Montre Cartier – Élégance Classique : Le Raffinement au Service de Votre Image Professionnelle", bold: true, size: 26 })]
      }),
      
      // Sous-titre accrocheur
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Sous-titre accrocheur :")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun({ text: "L'élégance intemporelle pour vos moments importants : affaires, cérémonies et cadeaux de valeur.", italics: true })]
      }),
      
      // Description courte
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Description courte (liste produits) :")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("L'élégance classique inspirée de la maison Cartier pour vos occasions officielles, cérémonies et moments importants. Un choix raffiné pour affirmer votre statut avec discrétion et classe.")]
      }),
      
      // Description longue
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Description longue (fiche produit) :")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("La Montre Cartier – Élégance Classique représente le summum du raffinement et de la sophistication horlogère. Inspirée par l'héritage prestigieux de la maison Cartier, cette montre incarne un classicisme indémodable qui traverse les époques avec une grâce inaltérable. Son design épuré aux lignes harmonieuses et son cadran élégant en font le compagnon idéal des hommes et femmes d'affaires de Conakry qui comprennent que l'allure est le premier message que l'on adresse au monde professionnel.")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("Cette pièce d'exception est façonnée pour ceux qui apprécient les valeurs sûres de l'horlogerie classique. Son cadran raffiné avec aiguilles élégantes et index précis témoigne d'un savoir-faire artisanal remarquable. Que ce soit pour un mariage à Conakry, une réunion d'affaires importante à Kaloum, une cérémonie officielle ou simplement pour affirmer votre statut social avec discrétion, cette montre Cartier sera votre alliée de confiance en toutes circonstances professionnelles et personnelles.")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("Offrir cette montre, c'est transmettre bien plus qu'un simple accessoire : c'est offrir un symbole de réussite, de bon goût et d'ambition. Son allure distinguée séduira instantanément les amateurs de belles pièces horlogères qui reconnaissent la qualité au premier regard. Le bracelet en cuir véritable apporte une touche de chaleur et de noblesse, tandis que le boîtier poli reflète la lumière avec une subtilité qui ne cherche pas à briller artificiellement.")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Disponible exclusivement chez MARCHÉ ROYAL DE GUINÉE à Lambanyi, avec la garantie de qualité et le service client irréprochable qui font notre réputation à Conakry. Cette pièce représente un investissement dans votre image professionnelle et personnelle. Le luxe véritable ne crie pas : il suggère, il inspire, il impressionne par sa maîtrise et sa discrétion élégante. Commandez par WhatsApp et recevez votre montre avec paiement à la livraison.")]
      }),
      
      // Caractéristiques
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Caractéristiques :")]
      }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, children: [new TextRun("Boîtier en acier inoxydable poli miroir – finitions premium et brillance élégante")] }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, children: [new TextRun("Verre saphir anti-reflet pour une lisibilité parfaite en toutes circonstances")] }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, children: [new TextRun("Mouvement automatique de précision – pas besoin de pile, fonctionnement mécanique")] }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, children: [new TextRun("Bracelet cuir véritable de qualité supérieure – confort et élégance naturelles")] }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, children: [new TextRun("Boucle déployante sécurisée – confort optimal et maintien parfait au poignet")] }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, children: [new TextRun("Résistance à l'eau (5 ATM) – usage quotidien serein, passage sous la pluie sans souci")] }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, children: [new TextRun("Finitions main luxe avec attention aux moindres détails")] }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Occasions idéales : affaires, cérémonies, mariages, cadeaux prestige, occasions officielles")] }),
      
      // Pourquoi vous allez l'adorer
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Pourquoi vous allez l'adorer :")]
      }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, children: [new TextRun("Parfaite pour les réunions d'affaires et occasions professionnelles à Conakry – projetez une image de sérieux et de réussite")] }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, children: [new TextRun("Idéale pour cérémonies : mariages, baptêmes, remises de prix, réceptions officielles et événements familiaux importants")] }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, children: [new TextRun("Cadeau prestige exceptionnel pour marquer un moment unique de la vie d'un proche ou d'un partenaire")] }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, children: [new TextRun("Design classique intemporel qui ne se démode jamais – un investissement durable dans votre image")] }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, children: [new TextRun("Qualité supérieure garantie par notre sélection rigoureuse – nous refusons les produits médiocres")] }),
      new Paragraph({ numbering: { reference: "bullet-product2", level: 0 }, spacing: { after: 300 }, children: [new TextRun("Livraison express à Conakry avec paiement à la livraison – confiance totale, zéro risque")] }),
      
      // ============================================
      // PRODUIT C: COQUE AG GLASS
      // ============================================
      new Paragraph({ 
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("C. COQUE AG GLASS PREMIUM")]
      }),
      
      // Titre H1
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Titre H1 optimisé :")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun({ text: "Coque AG Glass Premium : Protection Ultime pour Votre Smartphone à Conakry", bold: true, size: 26 })]
      }),
      
      // Sous-titre accrocheur
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Sous-titre accrocheur :")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun({ text: "Protégez votre investissement avec une coque en verre trempé 9H, anti-chocs et anti-traces, au design ultra-fin et élégant.", italics: true })]
      }),
      
      // Description courte
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Description courte (liste produits) :")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Protection premium en verre trempé AG avec finition matte élégante. Résistance aux chocs, anti-traces et design ultra-fin pour préserver l'esthétique de votre smartphone tout en le protégeant efficacement.")]
      }),
      
      // Description longue
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Description longue (fiche produit) :")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("La Coque AG Glass Premium offre une protection exceptionnelle pour votre smartphone tout en préservant son élégance naturelle et sa prise en main confortable. Conçue avec les dernières technologies de verre trempé renforcé de qualité 9H – la norme la plus élevée en matière de résistance aux rayures – cette coque combine une protection hors pair contre les chocs avec une esthétique raffinée. Son design ultra-fin de seulement 0.3mm s'adapte parfaitement à la forme de votre téléphone sans ajouter de volume inutile ni compromettre son ergonomie au quotidien.")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("Cette coque de protection haut de gamme intègre une technologie AG (Anti-Glare) avancée qui réduit significativement les reflets gênants et les traces de doigts si fréquentes sur les écrans classiques. Votre écran reste parfaitement lisible en toutes circonstances, même sous le soleil intense de Conakry. La finition matte luxueuse apporte une touche de sophistication moderne à votre appareil, le distinguant nettement des coques ordinaires que l'on trouve partout ailleurs sur le marché local.")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("Fabriquée avec des matériaux de première qualité sélectionnés avec soin, la Coque AG Glass Premium résiste aux chutes accidentelles, aux rayures quotidiennes et aux impacts du transport. Son système d'absorption des chocs révolutionnaire protège efficacement les angles vulnérables et le dos de votre téléphone contre les dommages. L'installation se fait en quelques secondes, sans bulles d'air, pour un résultat professionnel dès le premier essai. Vivez votre vie active à Conakry avec la tranquillité d'esprit totale, sachant que votre précieux smartphone est protégé par le meilleur des accessoires disponibles en Guinée.")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Disponible chez MARCHÉ ROYAL DE GUINÉE pour de nombreux modèles de téléphones. Cette coque n'est pas qu'une simple protection : c'est un investissement intelligent dans la longévité de votre téléphone et la préservation de sa valeur. Évitez les réparations d'écran coûteuses et les désagréments d'un téléphone abîmé. Commandez maintenant par WhatsApp en précisant votre modèle de téléphone, et recevez votre coque en 24 à 48 heures avec paiement à la livraison.")]
      }),
      
      // Caractéristiques
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Caractéristiques :")]
      }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Verre trempé AG renforcé 9H – la meilleure protection contre les rayures disponible")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Protection anti-chocs avancée – absorbe efficacement les impacts des chutes accidentelles")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Finition matte anti-traces – pas de traces de doigts visibles, toujours propre et élégant")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Ultra-fin : 0.3mm d'épaisseur – préserve la finesse et la prise en main de votre téléphone")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Installation sans bulles – application facile et rapide, résultat professionnel garanti")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Toucher naturel préservé – sensation fluide et réactive comme sans protection")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Bords arrondis confortables – agréable au toucher, ne gêne pas les gestes")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Design élégant et professionnel – adapté à tous les environnements, du bureau aux sorties")] }),
      
      // Compatibilité
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Compatibilité :")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("Nous disposons de cette coque AG Glass Premium pour de nombreux modèles de smartphones populaires en Guinée :")]
      }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("iPhone : modèles 13, 14, 15, 16 (toutes versions et tailles)")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Samsung Galaxy : S21, S22, S23, S24 (toutes versions) et série A (A50, A51, A52, A53, etc.)")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Xiaomi : Redmi Note series (Note 10, 11, 12, 13, etc.)")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Huawei : Série P et Mate")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Oppo : Série Reno et A")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, spacing: { after: 150 }, children: [new TextRun("Et bien d'autres modèles – contactez-nous pour vérifier la disponibilité !")] }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun({ text: "Important : ", bold: true }), new TextRun("Lors de votre commande WhatsApp, merci de préciser le modèle exact de votre téléphone (marque + modèle + année si possible). Nous vérifierons la disponibilité et vous confirmerons avant la livraison.")]
      }),
      
      // Pourquoi vous allez l'adorer
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Pourquoi vous allez l'adorer :")]
      }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Protection maximale contre les chutes et rayures du quotidien à Conakry – plus de stress pour votre téléphone")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Design élégant et professionnel qui met en valeur votre téléphone au lieu de le défigurer")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Rapport qualité-prix exceptionnel comparé au coût des réparations d'écran à Conakry")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Finition matte qui reste propre et élégante toute la journée – zéro traces de doigts")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, children: [new TextRun("Idéal pour la vie active – transport, travail, sorties, votre téléphone est protégé en permanence")] }),
      new Paragraph({ numbering: { reference: "bullet-product3", level: 0 }, spacing: { after: 300 }, children: [new TextRun("Installation facile – pas besoin de compétences techniques, tout le monde peut l'appliquer")] }),
      
      // ============================================
      // SECTION 2: BLOC LIVRAISON ET PAIEMENT
      // ============================================
      new Paragraph({ children: [new PageBreak()] }),
      
      new Paragraph({ 
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("SECTION 2 : BLOC LIVRAISON ET PAIEMENT")]
      }),
      
      new Paragraph({ 
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Livraison et Paiement – Simple, Rapide et Sans Risque")]
      }),
      
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Chez MARCHÉ ROYAL DE GUINÉE, nous avons conçu un système de livraison et de paiement pensé pour vous faciliter la vie. Plus besoin de vous déplacer, de chercher votre produit pendant des heures dans les boutiques de Conakry, ou de vous inquiéter pour le paiement. Nous nous occupons de tout, de A à Z. Voici comment ça fonctionne :")]
      }),
      
      // Sous-bloc 1
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Livraison à Conakry et environs")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Nous livrons personnellement vos commandes dans tous les quartiers de Conakry : Kaloum, Dixinn, Ratoma, Matam, Matoto, Lambanyi, et bien d'autres. Nous livrons également les communes proches comme Coyah et Dubréka. Votre commande est traitée le jour même et vous est livrée en 24 à 48 heures maximum pour Conakry intra-muros. Nous vous contactons par téléphone pour convenir d'un créneau horaire qui vous arrange – vous n'avez pas à vous déplacer, nous venons jusqu'à vous, que ce soit à votre domicile, votre bureau ou tout autre lieu de votre choix.")]
      }),
      
      // Sous-bloc 2
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Paiement à la livraison")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Avec MARCHÉ ROYAL DE GUINÉE, vous ne prenez absolument aucun risque financier. Vous payez uniquement au moment où vous recevez votre produit, après l'avoir vérifié et approuvé. Pas d'avance, pas de virement à faire avant d'avoir vu la marchandise, pas de mauvaise surprise possible. C'est la méthode la plus simple et la plus rassurante pour acheter en ligne en Guinée. Vous gardez le contrôle total jusqu'au dernier moment.")]
      }),
      
      // Sous-bloc 3
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Mobile Money et cash acceptés")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Pour votre confort, nous acceptons le paiement en espèces (cash) directement à la livraison. Vous pouvez également régler par Mobile Money via Orange Money ou MTN Mobile Money si vous préférez ne pas manipuler d'argent liquide. Choisissez simplement le mode de paiement qui vous convient le mieux au moment de la livraison. Nous nous adaptons à vos préférences pour rendre votre achat aussi pratique que possible.")]
      }),
      
      // Sous-bloc 4
      new Paragraph({ 
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Confirmation par WhatsApp")]
      }),
      new Paragraph({ 
        spacing: { after: 300 },
        children: [new TextRun("Passer commande chez MARCHÉ ROYAL DE GUINÉE, c'est simple comme un message WhatsApp. Cliquez sur le bouton de commande sur notre site, et vous êtes directement connecté avec notre équipe. Nous confirmons ensemble le produit choisi, votre modèle de téléphone si nécessaire (pour les coques), votre adresse de livraison exacte et le créneau qui vous arrange. Vous recevez une confirmation écrite et vous êtes tenu informé de l'avancement de votre livraison. Une question ? Un doute ? Notre équipe répond rapidement et reste disponible avant, pendant et après votre achat.")]
      }),
      
      // ============================================
      // SECTION 3: FAQ COMPLÈTE
      // ============================================
      new Paragraph({ children: [new PageBreak()] }),
      
      new Paragraph({ 
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("SECTION 3 : FAQ COMPLÈTE")]
      }),
      
      new Paragraph({ 
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Questions Fréquentes – Tout ce que vous devez savoir")]
      }),
      
      // FAQ 1
      new Paragraph({ 
        spacing: { before: 200 },
        children: [new TextRun({ text: "1. Comment se passe la livraison à Conakry et dans les environs ?", bold: true })]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Nous livrons personnellement vos commandes dans tous les quartiers de Conakry (Kaloum, Dixinn, Ratoma, Matam, Matoto, Lambanyi, etc.) ainsi que dans les communes environnantes comme Coyah et Dubréka. Notre équipe de livreurs dédiée vous contacte par téléphone pour convenir d'un créneau horaire qui vous arrange. Vous n'avez pas à vous déplacer : nous venons jusqu'à vous, que ce soit à votre domicile, votre bureau ou tout autre lieu de votre choix à Conakry. Votre commande est livrée en main propre, dans les meilleures conditions.")]
      }),
      
      // FAQ 2
      new Paragraph({ 
        spacing: { before: 200 },
        children: [new TextRun({ text: "2. Quels sont les frais de livraison ?", bold: true })]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Les frais de livraison dépendent de votre zone géographique. Pour Conakry intra-muros, la livraison est généralement offerte à partir d'un certain montant d'achat, sinon des frais modérés s'appliquent. Pour les environs proches, des frais supplémentaires raisonnables peuvent être ajoutés. Nous vous communiquons toujours le montant exact avant confirmation de votre commande, sans surprise ni frais cachés. Notre objectif est de vous offrir le meilleur rapport qualité-prix et la meilleure expérience d'achat possible.")]
      }),
      
      // FAQ 3
      new Paragraph({ 
        spacing: { before: 200 },
        children: [new TextRun({ text: "3. Quels sont les délais moyens de livraison ?", bold: true })]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Pour Conakry, comptez entre 24 et 48 heures ouvrées après confirmation de votre commande. Nous livrons du lundi au samedi, de 8h à 20h. Si vous avez une urgence (cadeau de dernière minute, départ en voyage), nous proposons un service de livraison express le jour même selon disponibilité. Pour les villes de l'intérieur du pays, le délai est de 3 à 5 jours via nos partenaires de transport fiables. Nous vous tiendrons informé de l'avancement de votre livraison par SMS ou WhatsApp à chaque étape importante.")]
      }),
      
      // FAQ 4
      new Paragraph({ 
        spacing: { before: 200 },
        children: [new TextRun({ text: "4. Quels modes de paiement acceptez-vous ?", bold: true })]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Nous offrons plusieurs options de paiement flexibles pour vous faciliter la vie. Le paiement à la livraison est notre option la plus populaire : vous payez en espèces (cash) ou par Mobile Money (Orange Money, MTN Mobile Money) au moment où vous recevez votre produit. Vous pouvez également effectuer un virement Mobile Money avant la livraison si vous préférez. Enfin, vous pouvez passer directement à notre boutique de Lambanyi pour payer en espèces. Nous nous adaptons à vos préférences pour que votre achat se passe sans stress et en toute confiance.")]
      }),
      
      // FAQ 5
      new Paragraph({ 
        spacing: { before: 200 },
        children: [new TextRun({ text: "5. Comment passer commande via WhatsApp ?", bold: true })]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("C'est très simple et rapide ! Cliquez sur le bouton vert « Commander sur WhatsApp » présent sur chaque fiche produit ou en bas de page. Vous serez automatiquement redirigé vers notre WhatsApp avec un message pré-rempli. Notre équipe vous répondra en quelques minutes (pendant les heures d'ouverture) pour confirmer la disponibilité du produit, prendre vos coordonnées de livraison et convenir du mode de paiement. Tout se passe en conversation naturelle, sans formulaire compliqué à remplir. Simple, direct et humain.")]
      }),
      
      // FAQ 6
      new Paragraph({ 
        spacing: { before: 200 },
        children: [new TextRun({ text: "6. Les produits sont-ils réellement disponibles en stock en Guinée ?", bold: true })]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Oui, absolument ! Contrairement à beaucoup de sites qui font venir les produits de l'étranger après votre commande, nos produits sont physiquement disponibles à Conakry. Cela signifie que vous pouvez recevoir votre achat très rapidement, sans attendre des semaines d'expédition internationale. Avant de confirmer votre commande, nous vérifions systématiquement la disponibilité en stock pour éviter toute déception. Dans le rare cas où un produit serait temporairement indisponible, nous vous en informons immédiatement et vous proposons une alternative ou un délai estimé.")]
      }),
      
      // FAQ 7
      new Paragraph({ 
        spacing: { before: 200 },
        children: [new TextRun({ text: "7. Puis-je échanger un produit s'il ne me convient pas ou s'il est défectueux ?", bold: true })]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Bien sûr ! Votre satisfaction est notre priorité absolue. Si le produit reçu ne correspond pas à votre commande ou présente un défaut, vous avez 48 heures pour nous le signaler par WhatsApp et effectuer un échange. Pour Conakry, nous pouvons même venir récupérer le produit chez vous. Les produits doivent être retournés dans leur état original, non utilisés et dans leur emballage d'origine. Notre politique d'échange est simple et sans tracas car nous voulons que vous soyez pleinement satisfait de votre achat chez MARCHÉ ROYAL DE GUINÉE.")]
      }),
      
      // FAQ 8
      new Paragraph({ 
        spacing: { before: 200 },
        children: [new TextRun({ text: "8. Les montres et coques sont-elles de bonne qualité ? Comment garantissez-vous la qualité ?", bold: true })]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Nous sélectionnons personnellement chaque produit que nous proposons, en privilégiant la qualité et la durabilité. Nos montres proviennent de fournisseurs vérifiés et chaque pièce est contrôlée avant mise en vente. Toutes nos montres bénéficient d'une garantie de 30 jours contre les défauts de fabrication. Pour les coques de téléphone, nous choisissons uniquement des matériaux premium (verre trempé AG, protection renforcée) qui offrent une vraie protection efficace. Nous préférons proposer moins de références mais de meilleure qualité plutôt que d'inonder le marché avec des produits médiocres.")]
      }),
      
      // FAQ 9
      new Paragraph({ 
        spacing: { before: 200 },
        children: [new TextRun({ text: "9. Est-ce que je peux commander depuis l'intérieur du pays, pas seulement Conakry ?", bold: true })]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Oui, nous livrons dans les principales villes de Guinée : Kankan, N'Zérékoré, Labé, Kindia, Boké, Siguiri, Kissidougou et bien d'autres. Les commandes sont expédiées via nos partenaires de transport routier fiables et sécurisés. Le délai de livraison est de 3 à 5 jours ouvrées selon la destination. Des frais de livraison supplémentaires s'appliquent pour couvrir les coûts de transport, mais nous restons très compétitifs. Contactez-nous par WhatsApp pour obtenir un devis précis selon votre ville et nous organiserons votre livraison dans les meilleures conditions.")]
      }),
      
      // FAQ 10
      new Paragraph({ 
        spacing: { before: 200 },
        children: [new TextRun({ text: "10. Que faire si j'ai un problème avec ma commande (retard, erreur, produit défectueux) ?", bold: true })]
      }),
      new Paragraph({ 
        spacing: { after: 300 },
        children: [new TextRun("Ne paniquez pas, nous sommes là pour vous ! Contactez-nous immédiatement par WhatsApp ou téléphone en expliquant votre situation. Que ce soit un retard de livraison, une erreur sur le produit reçu, ou un défaut constaté après ouverture, notre équipe réagira rapidement pour trouver une solution. Pour les clients de Conakry, nous pouvons intervenir le jour même dans la plupart des cas. Notre engagement est simple : nous ne vous laissons jamais dans l'embarras. Chaque client mérite un service irréprochable avant, pendant et après son achat. Votre satisfaction est notre priorité.")]
      }),
      
      // ============================================
      // SECTION 4: PAGE À PROPOS
      // ============================================
      new Paragraph({ children: [new PageBreak()] }),
      
      new Paragraph({ 
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("SECTION 4 : PAGE À PROPOS")]
      }),
      
      new Paragraph({ 
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Notre Histoire – MARCHÉ ROYAL DE GUINÉE")]
      }),
      
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("MARCHÉ ROYAL DE GUINÉE, également connu sous le nom de ROYAL GUINEA MARKET, est une boutique en ligne basée à Lambanyi, dans la banlieue de Conakry. Nous avons été créés avec une mission simple mais ambitieuse : apporter des montres stylées et des accessoires de qualité aux clients de Conakry et de toute la Guinée, sans les contraintes habituelles des achats traditionnels. Notre boutique est née d'un constat simple : les Guinéens méritent d'avoir accès à des produits tendance et de qualité, avec un service digne de ce nom.")]
      }),
      
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("L'idée de départ était de rendre accessibles des produits tendance sans se compliquer la vie. Trop souvent, acheter une belle montre ou un accessoire de qualité à Conakry relevait du parcours du combattant : se déplacer dans plusieurs boutiques, négocier les prix, ne pas être sûr de la qualité, et parfois repartir bredouille. Nous avons voulu changer cela en proposant une expérience d'achat simple, transparente et rassurante : commande facile par WhatsApp, livraison rapide directement chez vous, et paiement uniquement à la livraison. Plus besoin de se déplacer, plus besoin de prendre des risques financiers.")]
      }),
      
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Chez MARCHÉ ROYAL DE GUINÉE, nous sélectionnons nos produits avec un soin particulier. Chaque montre et chaque accessoire est choisi pour sa qualité, son style et sa fiabilité. Nous travaillons avec des fournisseurs de confiance et nous refusons les produits médiocres qui inondent parfois le marché local. Notre philosophie est simple : nous ne vendons que ce que nous serions fiers de porter ou d'offrir nous-mêmes. Cette exigence de qualité est au cœur de tout ce que nous faisons et c'est ce qui fait notre différence.")]
      }),
      
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Nos engagements sont clairs et nous les prenons très au sérieux. Le sérieux d'abord : nous honorons nos engagements de livraison et nous ne promettons que ce que nous pouvons tenir. La transparence sur les prix : le prix affiché est le prix final, sans surprise ni frais cachés. Un service client WhatsApp réactif : nous répondons rapidement à vos questions et nous restons disponibles avant, pendant et après votre achat. Le respect des délais : quand nous vous donnons un créneau de livraison, nous le respectons.")]
      }),
      
      new Paragraph({ 
        spacing: { after: 300 },
        children: [new TextRun("Derrière MARCHÉ ROYAL DE GUINÉE, il y a une vraie équipe, de vraies personnes basées à Lambanyi. Nous ne sommes pas une entreprise anonyme cachée derrière un site web, mais des Guinéens qui comprennent les réalités du marché local et les attentes de nos concitoyens. Nous sommes fiers de servir notre communauté et de contribuer à l'économie locale. Chaque commande que vous passez chez nous soutient un commerce guinéen et contribue à faire vivre des familles de Conakry. Merci de nous faire confiance – nous sommes là pour vous servir au mieux.")]
      }),
      
      // ============================================
      // SECTION 5: TEXTES DE RASSURANCE
      // ============================================
      new Paragraph({ children: [new PageBreak()] }),
      
      new Paragraph({ 
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("SECTION 5 : TEXTES DE RASSURANCE")]
      }),
      
      new Paragraph({ 
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Tagline (près du logo)")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun({ text: "« Vos montres et accessoires livrés à Conakry, en toute simplicité. »", italics: true, size: 26 })]
      }),
      
      new Paragraph({ 
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Mini-engagements (page d'accueil)")]
      }),
      
      // Engagement 1
      new Paragraph({ 
        spacing: { before: 200 },
        children: [new TextRun({ text: "Paiement à la livraison", bold: true, size: 26, color: "B8860B" })]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("Commandez sans risque – vous payez uniquement quand vous tenez votre produit entre les mains. Cash ou Mobile Money, vous choisissez.")]
      }),
      
      // Engagement 2
      new Paragraph({ 
        spacing: { before: 150 },
        children: [new TextRun({ text: "Livraison rapide à Conakry", bold: true, size: 26, color: "B8860B" })]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("Recevez votre commande en 24 à 48 heures directement chez vous, à votre bureau ou là où vous le souhaitez.")]
      }),
      
      // Engagement 3
      new Paragraph({ 
        spacing: { before: 150 },
        children: [new TextRun({ text: "Service client WhatsApp", bold: true, size: 26, color: "B8860B" })]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("Une question ? Un doute ? Notre équipe répond rapidement par WhatsApp. Nous sommes là pour vous accompagner.")]
      }),
      
      // Engagement 4
      new Paragraph({ 
        spacing: { before: 150 },
        children: [new TextRun({ text: "Produits sélectionnés avec soin", bold: true, size: 26, color: "B8860B" })]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("Chaque montre et accessoire est choisi pour sa qualité et sa durabilité. Nous refusons les produits médiocres.")]
      }),
      
      new Paragraph({ 
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bandeau de confiance (bas de page)")]
      }),
      new Paragraph({ 
        spacing: { after: 150 },
        children: [new TextRun("« Boutique basée à Lambanyi, Conakry • Produits disponibles en stock en Guinée • Livraison dans tout Conakry et environs • Commande simple par WhatsApp • Paiement à la livraison accepté • Service client réactif et à votre écoute »")]
      }),
      
      new Paragraph({ 
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Texte d'appel à l'action (bouton WhatsApp)")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("« Commandez maintenant sur WhatsApp et recevez votre produit en 24 à 48 heures à Conakry. Paiement à la livraison, zéro risque, confiance totale. »")]
      }),
      
      new Paragraph({ 
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Message de bienvenue (section héro)")]
      }),
      new Paragraph({ 
        spacing: { after: 200 },
        children: [new TextRun("« Découvrez notre collection exclusive de montres tendance et d'accessoires premium. Qualité exceptionnelle, style raffiné, disponible immédiatement en Guinée avec paiement à la livraison. Commandez par WhatsApp et recevez votre produit directement chez vous à Conakry. »")]
      }),
      
      new Paragraph({ 
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Signature email / communication")]
      }),
      new Paragraph({ 
        spacing: { after: 100 },
        children: [new TextRun("« L'équipe MARCHÉ ROYAL DE GUINÉE")]
      }),
      new Paragraph({ 
        children: [new TextRun("Votre boutique de montres et accessoires à Conakry")]
      }),
      new Paragraph({ 
        children: [new TextRun("WhatsApp : +224 623 45 76 89")]
      }),
      new Paragraph({ 
        children: [new TextRun("Localisation : Lambanyi, Conakry, Guinée »")]
      }),
    ]
  }]
});

// Save the document
const outputPath = '/home/z/my-project/download/MARCHE_ROYAL_GUINEE_Textes_Ecommerce.docx';
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log('Document created successfully:', outputPath);
});
