# Choix techniques - Reflexion

## Pourquoi Spring MVC
Spring MVC fournit un découpage clair Controller/Service/Repository adapté à un projet pédagogique J2EE.

## Pourquoi Thymeleaf
Thymeleaf permet un rendu serveur simple et propre, sans Angular, conforme à la contrainte du module.

## Persistance
- H2 en mémoire pour démarrage rapide.
- JPA/Hibernate pour les entités `UserAccount` et `GameSessionEntity`.

## Gestion des niveaux
Chaque jeu expose trois niveaux via l'enum `DifficultyLevel`:
- `EASY`
- `MEDIUM`
- `HARD`

## Sécurité
Une authentification de base est implémentée via session HTTP.
Le mot de passe est stocké en clair dans cette version académique (à améliorer en production avec hash BCrypt).
