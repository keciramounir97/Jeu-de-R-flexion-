package com.reflexion.common;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class GameProgressService {
    /*
     * Ce repository encapsule l'accès à la table des sessions de jeu.
     * Le service s'appuie dessus pour écrire et lire les parties.
     * Cette séparation garde la logique métier indépendante du SQL.
     * Le champ final garantit qu'il est fourni à la construction.
     * C'est la base de la persistance transverse pour les 4 jeux.
     */
    private final GameSessionRepository gameSessionRepository;

    public GameProgressService(GameSessionRepository gameSessionRepository) {
        this.gameSessionRepository = gameSessionRepository;
    }

    public void saveProgress(String username, GameType gameType, DifficultyLevel level, Integer score, String stateData) {
        /*
         * L'entité représente un snapshot de partie.
         * Elle contient utilisateur, type de jeu et niveau.
         * Elle sert aussi à stocker le score obtenu.
         * Le champ stateData garde un état sérialisé éventuel.
         * Ce format unifié simplifie l'historique global.
         */
        GameSessionEntity session = new GameSessionEntity();
        session.setUsername(username);
        session.setGameType(gameType);
        session.setLevel(level);
        session.setScore(score);
        session.setStateData(stateData);
        /*
         * Horodatage de la partie pour l'ordre chronologique.
         * Cela permet d'afficher un historique récent lisible.
         * La valeur est générée côté serveur pour fiabilité.
         * Elle simplifie les tris dans le repository.
         * Cette ligne enrichit les analyses futures.
         */
        session.setPlayedAt(LocalDateTime.now());
        /*
         * Persistance effective de la session de jeu.
         * Toute la UI peut ensuite relire cet historique.
         * Cette opération est commune aux 4 modules.
         * Elle centralise l'enregistrement métier.
         * C'est le point de sortie durable des scores.
         */
        gameSessionRepository.save(session);
    }

    public List<GameSessionEntity> getRecentSessions(String username) {
        return gameSessionRepository.findTop10ByUsernameOrderByPlayedAtDesc(username);
    }
}
