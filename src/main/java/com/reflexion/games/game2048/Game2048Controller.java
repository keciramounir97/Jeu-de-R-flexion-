package com.reflexion.games.game2048;

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
public class Game2048Controller {
    private final GameProgressService gameProgressService;

    public Game2048Controller(GameProgressService gameProgressService) {
        this.gameProgressService = gameProgressService;
    }

    @GetMapping("/games/2048")
    public String page(@RequestParam(defaultValue = "EASY") DifficultyLevel level, HttpSession session, Model model) {
        if (session.getAttribute("username") == null) return "redirect:/login";
        model.addAttribute("level", level);
        model.addAttribute("goal", switch (level) {
            case EASY -> 512;
            case MEDIUM -> 1024;
            case HARD -> 2048;
        });
        return "games/game2048/index";
    }

    @PostMapping("/games/2048/save")
    public String save(
            @RequestParam DifficultyLevel level,
            @RequestParam Integer score,
            @RequestParam(defaultValue = "2048-state-placeholder") String stateData,
            HttpSession session
    ) {
        String username = (String) session.getAttribute("username");
        if (username == null) return "redirect:/login";
        gameProgressService.saveProgress(username, GameType.GAME_2048, level, score, stateData);
        return "redirect:/games/2048?level=" + level;
    }
}
