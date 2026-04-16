package com.reflexion.games.dama;

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
public class DamaController {
    private final GameProgressService gameProgressService;

    public DamaController(GameProgressService gameProgressService) {
        this.gameProgressService = gameProgressService;
    }

    @GetMapping("/games/dama")
    public String page(@RequestParam(defaultValue = "EASY") DifficultyLevel level, HttpSession session, Model model) {
        if (session.getAttribute("username") == null) return "redirect:/login";
        model.addAttribute("gameName", "Dama");
        model.addAttribute("level", level);
        model.addAttribute("tip", switch (level) {
            case EASY -> "IA defensive simple.";
            case MEDIUM -> "IA avec recherche de captures.";
            case HARD -> "IA avec priorite strategique.";
        });
        return "games/dama/index";
    }

    @PostMapping("/games/dama/save")
    public String save(
            @RequestParam DifficultyLevel level,
            @RequestParam Integer score,
            @RequestParam(defaultValue = "dama-state-placeholder") String stateData,
            HttpSession session
    ) {
        String username = (String) session.getAttribute("username");
        if (username == null) return "redirect:/login";
        gameProgressService.saveProgress(username, GameType.DAMA, level, score, stateData);
        return "redirect:/games/dama?level=" + level;
    }
}
