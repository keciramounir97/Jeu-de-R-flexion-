# FAQ soutenance - Reflexion

## 1) Pourquoi cette architecture ?
Parce qu'elle sépare clairement la logique:
- contrôleurs web,
- services métier,
- persistance.

## 2) Comment sont gérés les niveaux ?
Via un enum commun (`DifficultyLevel`) et un paramètre `level` dans chaque route de jeu.

## 3) Où sont stockés les scores ?
Dans la table `game_sessions` avec: utilisateur, jeu, niveau, score, date, état sérialisé.

## 4) Pourquoi Thymeleaf et pas Angular/Bootstrap ?
Contrainte de l'énoncé respectée.

## 5) Limites actuelles
- UI de jeu simplifiée (placeholders).
- IA échecs/dama non complète.
- sécurité minimale.
