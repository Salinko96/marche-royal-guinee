#!/bin/bash
# Auto-debug hook — s'active après chaque commande Bash
# Détecte les erreurs de build/deploy et prépare un rapport pour Claude

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')
OUTPUT=$(echo "$INPUT" | jq -r '.tool_response.stdout // ""')
EXIT_CODE=$(echo "$INPUT" | jq -r '.tool_response.exitCode // 0')

# Ne s'active que pour les commandes vercel ou npm run build
if ! echo "$COMMAND" | grep -qE '(vercel|npm run build|next build)'; then
  exit 0
fi

# Si pas d'erreur, rien à faire
if [ "$EXIT_CODE" = "0" ]; then
  exit 0
fi

# Extraire les erreurs du output
ERRORS=$(echo "$OUTPUT" | grep -iE '(error|failed|cannot|missing|undefined|null)' | head -20)

if [ -z "$ERRORS" ]; then
  exit 0
fi

# Préparer le message de réveil pour Claude
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "🚨 ERREUR DÉTECTÉE — Debug automatique\n\nCommande: $COMMAND\nCode de sortie: $EXIT_CODE\n\nErreurs:\n$ERRORS\n\nInstructions: Analyse ces erreurs, identifie la cause racine dans le code source du projet, corrige le fichier concerné, puis redéploie automatiquement avec vercel --prod."
  }
}
EOF
