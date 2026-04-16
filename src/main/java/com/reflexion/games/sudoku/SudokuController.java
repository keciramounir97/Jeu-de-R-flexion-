package com.reflexion.games.sudoku;

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
public class SudokuController {
    private final GameProgressService gameProgressService;

    public SudokuController(GameProgressService gameProgressService) {
        this.gameProgressService = gameProgressService;
    }

    @GetMapping("/games/sudoku")
    public String page(@RequestParam(defaultValue = "EASY") DifficultyLevel level, HttpSession session, Model model) {
        if (session.getAttribute("username") == null) return "redirect:/login";
        model.addAttribute("level", level);
        model.addAttribute("holes", switch (level) {
            case EASY -> 30;
            case MEDIUM -> 40;
            case HARD -> 50;
        });
        return "games/sudoku/index";
    }

    @PostMapping("/games/sudoku/save")
    public String save(
            @RequestParam DifficultyLevel level,
            @RequestParam Integer score,
            @RequestParam(defaultValue = "sudoku-state-placeholder") String stateData,
            HttpSession session
    ) {
        String username = (String) session.getAttribute("username");
        if (username == null) return "redirect:/login";
        gameProgressService.saveProgress(username, GameType.SUDOKU, level, score, stateData);
        return "redirect:/games/sudoku?level=" + level;
    }
}
