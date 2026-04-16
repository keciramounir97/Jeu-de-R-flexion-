# Rapport projet - Reflexion

## Introduction
Reflexion est une plateforme de jeux de réflexion développée en Spring MVC et Thymeleaf.

## Fonctionnalités
- Authentification (username/password)
- Lobby central
- 4 jeux accessibles
- 3 niveaux par jeu
- Persistance des scores

## Architecture
Architecture MVC modulaire, séparation par packages (`user`, `lobby`, `games`, `common`).

## Résultats
L'application permet une navigation complète login -> lobby -> jeu -> sauvegarde -> historique.

## Axes d'amélioration
- Sécurisation des mots de passe
- moteur de jeu complet pour chaque module
- tests unitaires et d'intégration plus poussés
