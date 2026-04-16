(() => {
    if (!window.motion || !window.motion.animate) return;
    const { animate, stagger } = window.motion;

    animate(".auth-shell, .lobby-header, .chess-hero", { opacity: [0, 1], y: [16, 0] }, { duration: 0.42, easing: "ease-out" });
    animate(".card, .panel-block, .history-panel, .fun-resources", { opacity: [0, 1], y: [10, 0] }, { duration: 0.34, delay: stagger(0.03), easing: "ease-out" });

    const buttons = document.querySelectorAll("button, .ghost-btn, .level-links a");
    buttons.forEach((el) => {
        el.addEventListener("mouseenter", () => animate(el, { y: [0, -1.5], scale: [1, 1.01] }, { duration: 0.14, easing: "ease-out" }));
        el.addEventListener("mouseleave", () => animate(el, { y: [0, 0], scale: [1.01, 1] }, { duration: 0.12, easing: "ease-out" }));
    });
})();
