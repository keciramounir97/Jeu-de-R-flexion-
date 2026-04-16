# Blueprint - Sudoku

## Role du dossier
Ce module gère l'écran Sudoku et la sauvegarde score/niveau.

## Flux MVC
- `GET /games/sudoku`: rend une configuration de difficulté.
- `POST /games/sudoku/save`: enregistre session.

## Niveaux
- Facile: 30 trous
- Moyen: 40 trous
- Difficile: 50 trous

## Limites
Génération complète de grille Sudoku à renforcer.
