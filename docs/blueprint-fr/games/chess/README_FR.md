# Blueprint - Echecs

## Role du dossier
Ce module gère la page d'échecs et la sauvegarde de score.

## Flux MVC
- `GET /games/chess`: charge la vue selon le niveau.
- `POST /games/chess/save`: persiste une session.

## Niveaux
- Facile: profondeur IA simulée 1
- Moyen: profondeur IA simulée 2
- Difficile: profondeur IA simulée 3

## Limites
Plateau et règles avancées non complètes dans cette version.
