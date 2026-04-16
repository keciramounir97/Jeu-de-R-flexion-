# Blueprint - Dama

## Role du dossier
Ce module gère la page dama et sa sauvegarde de progression.

## Flux MVC
- `GET /games/dama`: affiche le jeu avec le niveau.
- `POST /games/dama/save`: enregistre score et état.

## Niveaux
- Facile: stratégie basique
- Moyen: priorité captures
- Difficile: stratégie améliorée

## Limites
Moteur de règles simplifié pour la démonstration.
