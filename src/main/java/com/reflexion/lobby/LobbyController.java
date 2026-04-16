package com.reflexion.lobby;

import com.reflexion.common.GameProgressService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LobbyController {
    private final GameProgressService gameProgressService;

    public LobbyController(GameProgressService gameProgressService) {
        this.gameProgressService = gameProgressService;
    }

    @GetMapping("/lobby")
    public String lobby(HttpSession session, Model model) {
        Object username = session.getAttribute("username");
        if (username == null) {
            return "redirect:/login";
        }
        model.addAttribute("username", username);
        model.addAttribute("sessions", gameProgressService.getRecentSessions(username.toString()));
        return "lobby/index";
    }
}
