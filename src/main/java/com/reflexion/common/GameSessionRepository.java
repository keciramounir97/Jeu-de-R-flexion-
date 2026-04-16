package com.reflexion.common;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSessionRepository extends JpaRepository<GameSessionEntity, Long> {
    List<GameSessionEntity> findTop10ByUsernameOrderByPlayedAtDesc(String username);
}
