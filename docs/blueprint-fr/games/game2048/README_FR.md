# Blueprint - 2048

## Role du dossier
Ce module expose la vue 2048 et le suivi du score.

## Flux MVC
- `GET /games/2048`: charge la grille selon difficulté.
- `POST /games/2048/save`: persiste résultat de partie.

## Niveaux
- Facile: objectif 512
- Moyen: objectif 1024
- Difficile: objectif 2048

## Limites
Mécanique JS complète non branchée dans cette version initiale.
