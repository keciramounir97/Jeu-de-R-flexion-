# Architecture globale - Reflexion

## Vue d'ensemble
Reflexion est une application Spring MVC + Thymeleaf avec authentification simple, un lobby central, et 4 modules de jeux:
- `games/chess`
- `games/dama`
- `games/game2048`
- `games/sudoku`

## Flux principal
1. L'utilisateur s'inscrit ou se connecte.
2. La session HTTP stocke `username`.
3. Le lobby liste les 4 jeux.
4. Chaque jeu lit le niveau (`EASY`, `MEDIUM`, `HARD`).
5. Une sauvegarde de progression est persistée dans `game_sessions`.

## Structure backend
- `user`: login/register et validation des identifiants.
- `lobby`: écran de sélection.
- `common`: enums, entité de session de jeu, service de persistance.
- `games/*`: contrôleurs dédiés par jeu.

## Structure frontend
- `templates/auth`: login/register.
- `templates/lobby`: menu central.
- `templates/games/*`: une page Thymeleaf par jeu.
- `static/css`: thème visuel unique.
