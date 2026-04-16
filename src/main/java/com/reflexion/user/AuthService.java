package com.reflexion.user;

import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    /*
     * Cette dépendance donne accès au stockage persistant des utilisateurs.
     * Elle est injectée par Spring pour respecter l'inversion de contrôle.
     * Le service ne connaît pas la base SQL directement.
     * Cela améliore les tests car on peut mocker le repository.
     * Cette ligne réduit le couplage entre couches.
     */
    private final UserAccountRepository userAccountRepository;

    /*
     * Le constructeur est le point officiel d'injection des dépendances.
     * Ce choix rend la classe immuable après création.
     * Il évite l'utilisation de champs null initialisés tardivement.
     * Il clarifie explicitement ce dont AuthService a besoin.
     * Il sécurise l'instanciation côté framework.
     */
    public AuthService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public boolean register(String username, String password) {
        /*
         * Ce garde-fou rejette les valeurs nulles ou vides.
         * Il protège la base contre des enregistrements invalides.
         * Il simplifie les règles en aval.
         * Il donne un comportement déterministe pour l'UI.
         * Il évite des exceptions inutiles plus tard.
         */
        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return false;
        }
        /*
         * Cette vérification applique l'unicité fonctionnelle du username.
         * Elle évite les collisions d'identité entre joueurs.
         * Elle préserve la cohérence des connexions.
         * Elle limite les erreurs SQL liées à la contrainte unique.
         * Elle fournit un refus clair au frontend.
         */
        if (userAccountRepository.existsByUsername(username)) {
            return false;
        }
        /*
         * On instancie un objet métier prêt à être persisté.
         * Cela encapsule proprement les données d'inscription.
         * Le modèle représente une ligne de la table users.
         * Cette étape permet de préparer les transformations.
         * Elle garde la méthode lisible.
         */
        UserAccount userAccount = new UserAccount();
        userAccount.setUsername(username.trim());
        userAccount.setPassword(password.trim());
        /*
         * save(...) délègue l'insertion à JPA/Hibernate.
         * L'entité est suivie puis écrite en base.
         * Cette opération finalise l'inscription.
         * Elle permet ensuite l'authentification du joueur.
         * C'est l'effet métier principal de la méthode.
         */
        userAccountRepository.save(userAccount);
        return true;
    }

    public boolean authenticate(String username, String password) {
        /*
         * On récupère éventuellement l'utilisateur via son username.
         * Optional évite un null direct fragile.
         * La recherche est unique grâce à la contrainte côté entité.
         * Cette ligne centralise l'accès lecture.
         * Elle prépare la vérification de mot de passe.
         */
        Optional<UserAccount> user = userAccountRepository.findByUsername(username);
        /*
         * Le résultat est vrai si compte trouvé + mot de passe identique.
         * C'est une logique simple adaptée à une version académique.
         * Elle permet de créer la session utilisateur ensuite.
         * En production, il faudrait comparer un hash sécurisé.
         * Cette ligne ferme le flux d'authentification.
         */
        return user.isPresent() && user.get().getPassword().equals(password);
    }
}
