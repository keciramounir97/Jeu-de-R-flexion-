package com.reflexion.user;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/")
    public String homeRedirect(HttpSession session) {
        return session.getAttribute("username") == null ? "redirect:/login" : "redirect:/lobby";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "auth/login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password, HttpSession session, Model model) {
        if (authService.authenticate(username, password)) {
            session.setAttribute("username", username);
            return "redirect:/lobby";
        }
        model.addAttribute("error", "Identifiants invalides.");
        return "auth/login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "auth/register";
    }

    @PostMapping("/register")
    public String register(@RequestParam String username, @RequestParam String password, Model model) {
        if (authService.register(username, password)) {
            model.addAttribute("success", "Compte créé avec succès. Connecte-toi.");
            return "auth/login";
        }
        model.addAttribute("error", "Impossible de créer le compte.");
        return "auth/register";
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
