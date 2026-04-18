import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * API de contact avec rate-limiting intégré
 * Limite : 5 requêtes par IP toutes les 15 minutes
 */

// Store simple en mémoire pour le rate-limiting
// En production, utiliser Redis ou un service dédié
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_MAX = 5; // Maximum 5 requêtes
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes en millisecondes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count += 1;
  rateLimitMap.set(ip, record);
  return false;
}

// Nettoyage périodique du rate-limit map (éviter les fuites mémoire)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 1000); // Nettoyer toutes les minutes

// Validation basique anti-spam
function isSpamContent(message: string): boolean {
  const spamPatterns = [
    /\b(viagra|casino|lottery|bitcoin|crypto|free money)\b/i,
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Attributs d'événements HTML
  ];
  return spamPatterns.some((pattern) => pattern.test(message));
}

export async function POST(request: NextRequest) {
  try {
    // Récupérer l'IP du client
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Vérifier le rate-limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Trop de requêtes. Veuillez réessayer dans quelques minutes.",
        },
        { status: 429 }
      );
    }

    // Parser le body
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validation des champs requis
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Veuillez remplir tous les champs obligatoires (nom, email, message).",
        },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Adresse email invalide.",
        },
        { status: 400 }
      );
    }

    // Anti-spam
    if (isSpamContent(message) || isSpamContent(name)) {
      return NextResponse.json(
        {
          success: false,
          error: "Votre message a été détecté comme spam.",
        },
        { status: 400 }
      );
    }

    // Longueur maximale
    if (message.length > 5000 || name.length > 200) {
      return NextResponse.json(
        {
          success: false,
          error: "Le message ou le nom est trop long.",
        },
        { status: 400 }
      );
    }

    // Sauvegarder en base de données
    await db.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        message: message.trim(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur API contact :", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne du serveur. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}
