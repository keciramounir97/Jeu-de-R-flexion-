package com.reflexion.games.chess;

import com.reflexion.common.DifficultyLevel;
import com.reflexion.common.GameProgressService;
import com.reflexion.common.GameType;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ChessController {
    private final GameProgressService gameProgressService;

    public ChessController(GameProgressService gameProgressService) {
        this.gameProgressService = gameProgressService;
    }

    @GetMapping("/games/chess")
    public String page(@RequestParam(defaultValue = "EASY") DifficultyLevel level, HttpSession session, Model model) {
        if (session.getAttribute("username") == null) return "redirect:/login";
        model.addAttribute("gameName", "Echecs");
        model.addAttribute("level", level);
        model.addAttribute("tip", switch (level) {
            case EASY -> "Niveau Facile : profondeur IA 1.";
            case MEDIUM -> "Niveau Moyen : profondeur IA 2.";
            case HARD -> "Niveau Difficile : profondeur IA 3.";
        });
        return "games/chess/index";
    }

    @PostMapping("/games/chess/save")
    public String save(
            @RequestParam DifficultyLevel level,
            @RequestParam Integer score,
            @RequestParam(defaultValue = "chess-state-placeholder") String stateData,
            HttpSession session
    ) {
        String username = (String) session.getAttribute("username");
        if (username == null) return "redirect:/login";
        gameProgressService.saveProgress(username, GameType.CHESS, level, score, stateData);
        return "redirect:/games/chess?level=" + level;
    }
}
