/* =========================================================
   NAVIGATION
========================================================= */
function toggleMenu() {
    const nav = document.querySelector(".nav-links");
    if (!nav) return;
    const isOpen = nav.classList.toggle("mobile-open");
    nav.style.display = isOpen ? "flex" : "none";
    if (isOpen) {
        Object.assign(nav.style, {
            position: "absolute", top: "78px", left: "4%", right: "4%",
            padding: "22px", background: "rgba(6,10,20,.97)",
            border: "1px solid rgba(69,231,255,.15)", borderRadius: "12px",
            flexDirection: "column", gap: "20px", zIndex: "1001"
        });
    } else {
        ["position", "top", "left", "right", "padding", "background", "border", "borderRadius", "flexDirection", "gap", "zIndex"].forEach(p => nav.style.removeProperty(p.replace(/[A-Z]/g, m => "-" + m.toLowerCase())));
    }
}

const navLinks = document.querySelectorAll(".nav-links a");
navLinks.forEach(link => link.addEventListener("click", () => {
    if (window.innerWidth <= 850) {
        const nav = document.querySelector(".nav-links");
        nav?.classList.remove("mobile-open");
        if (nav) nav.style.display = "none";
    }
}));

/* =========================================================
   PERSONAL AI GUIDE
   This first version uses curated portfolio knowledge locally.
   It does not call an external AI API or send visitor data.
========================================================= */
(() => {
    const bubble = document.getElementById("aiGuideBubble");
    const launcher = document.getElementById("aiGuideLauncher");
    const panel = document.getElementById("aiChatPanel");
    const closeButton = document.getElementById("aiChatClose");
    const openButton = document.getElementById("aiGuideOpen");
    const messages = document.getElementById("aiChatMessages");
    const form = document.getElementById("aiChatForm");
    const input = document.getElementById("aiChatInput");
    if (!bubble || !launcher || !panel || !messages || !form || !input) return;

    const sectionCopy = {
        home: "Welcome! I'm Keerthikumar's virtual guide. He is pursuing M.Tech in VLSI Design and is interested in digital hardware, RTL design and semiconductor technologies.",
        about: "This section introduces Keerthikumar's VLSI interests, including RTL design, Verilog HDL, design verification and physical design.",
        experience: "Here you'll find Keerthikumar's hardware engineering experience at Gelidcure Healthcare, including STM32 firmware, hardware testing, PCB troubleshooting and development support.",
        projects: "Explore the projects here, including UART protocol design, Parkinson's disease prediction, a coal-mine gas detector and the Razorpay AI Risk Manager.",
        skills: "This section highlights VLSI and RTL design, embedded hardware, STM32, Verilog HDL, Cadence tools, Python and machine learning.",
        education: "Keerthikumar is pursuing M.Tech in VLSI Design at SRM Institute of Science and Technology. His undergraduate degree is in Electronics and Communication Engineering.",
        contact: "Interested in discussing an internship, VLSI opportunity or collaboration? Use the contact details and message form in this section."
    };

    const hoverCopy = [
        { selector: ".project-card.featured", text: "This is Keerthikumar's UART project, focused on protocol design using Verilog HDL, RTL simulation and synthesis with Cadence Genus." },
        { selector: ".project-card", text: "This project card gives a quick overview of one of Keerthikumar's technical projects. Check its description and repository link for more details." },
        { selector: ".skill", text: "These are the tools and technical areas Keerthikumar has worked with or studied. His main focus is VLSI and digital hardware." },
        { selector: ".experience", text: "This is Keerthikumar's professional hardware engineering experience, including embedded development and practical hardware work." },
        { selector: ".education-item", text: "This entry is part of Keerthikumar's academic background." },
        { selector: ".certificate", text: "This card highlights a certification or academic publication listed in the portfolio." }
    ];

    let bubbleTimer;
    let lastSection = "";
    let lastHoverTarget = null;

    function showBubble(message, duration = 6500) {
        const p = bubble.querySelector("p");
        if (p) p.textContent = message;
        bubble.classList.add("is-visible");
        clearTimeout(bubbleTimer);
        if (duration > 0) bubbleTimer = setTimeout(() => bubble.classList.remove("is-visible"), duration);
    }

    function openChat() {
        panel.classList.add("is-open");
        panel.setAttribute("aria-hidden", "false");
        launcher.setAttribute("aria-expanded", "true");
        bubble.classList.remove("is-visible");
        input.focus();
    }
    function closeChat() {
        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");
        launcher.setAttribute("aria-expanded", "false");
        launcher.focus();
    }
    launcher.addEventListener("click", () => panel.classList.contains("is-open") ? closeChat() : openChat());
    openButton?.addEventListener("click", openChat);
    closeButton?.addEventListener("click", closeChat);
    document.addEventListener("keydown", e => { if (e.key === "Escape" && panel.classList.contains("is-open")) closeChat(); });

    function addMessage(text, who = "assistant") {
        const node = document.createElement("div");
        node.className = `ai-chat-message${who === "user" ? " user" : ""}`;
        node.textContent = text;
        messages.appendChild(node);
        messages.scrollTop = messages.scrollHeight;
    }

    function answerQuestion(raw) {
        const q = raw.toLowerCase();
        if (/hello|hi\b|hey|good morning/.test(q)) return "Hello! Welcome to Keerthikumar's portfolio. I can guide you through his education, experience, VLSI skills and projects.";
        if (/about|who is|introduc|keerthi/.test(q)) return "Keerthikumar J is pursuing M.Tech in VLSI Design at SRM Institute of Science and Technology. His interests include digital hardware, RTL design, design verification and physical design.";
        if (/uart|bist|fault.tolerant|communication protocol/.test(q)) return "His UART work explores digital communication protocol design in Verilog HDL, including configurable parity and error detection. The portfolio describes RTL simulation and synthesis using Cadence Genus. For detailed implementation results, see the project repository.";
        if (/project|work|github|repository/.test(q)) return "The portfolio lists a UART communication protocol, Parkinson's disease prediction, a colliery gas detector and the Razorpay AI Risk Manager. Open the project cards to see descriptions and available GitHub links.";
        if (/skill|tool|verilog|cadence|physical design|rtl/.test(q)) return "His listed technical areas include VLSI and RTL design, Verilog HDL, digital design, RTL simulation, design verification, physical design, Cadence Virtuoso, Cadence Genus, STM32, embedded C and Python.";
        if (/experience|job|gelidcure|hardware engineer|intern/.test(q)) return "Keerthikumar worked as a Hardware Engineer at Gelidcure Healthcare Pvt Ltd from July 2024 to August 2025. His listed work includes STM32 firmware, hardware testing, PCB troubleshooting and manufacturing support.";
        if (/education|college|srm|degree|m.tech|mtech/.test(q)) return "He is pursuing M.Tech in VLSI Design at SRM Institute of Science and Technology (2025–2027). He completed B.E. in Electronics and Communication Engineering at Rajalakshmi Engineering College (2020–2024).";
        if (/contact|email|linkedin|hire|opportunit/.test(q)) return "You can contact Keerthikumar using the email and LinkedIn links in the Contact section. The message form is also available near the bottom of this page.";
        if (/thank/.test(q)) return "You're welcome! Feel free to explore the rest of the portfolio.";
        return "I can help with questions about Keerthikumar's background, education, hardware engineering experience, VLSI skills and listed projects. Try asking about the UART project or his technical skills.";
    }

    function sendQuestion(question) {
        const clean = question.trim();
        if (!clean) return;
        addMessage(clean, "user");
        addMessage(answerQuestion(clean));
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        sendQuestion(input.value);
        input.value = "";
    });
    panel.querySelectorAll("[data-question]").forEach(button => button.addEventListener("click", () => sendQuestion(button.dataset.question || "")));

    // Explain a section when it becomes the visitor's main viewport focus.
    const sections = document.querySelectorAll("main section[id]");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible || visible.target.id === lastSection || panel.classList.contains("is-open")) return;
            lastSection = visible.target.id;
            const message = sectionCopy[lastSection];
            if (message) showBubble(message, 5800);
        }, { threshold: [0.22, 0.45, 0.65] });
        sections.forEach(section => observer.observe(section));
    }

    // Give concise, contextual hints when the pointer enters project/skill cards.
    document.addEventListener("pointerover", event => {
        if (event.pointerType === "touch" || panel.classList.contains("is-open")) return;
        const match = hoverCopy.find(item => event.target.closest(item.selector));
        if (!match) return;
        const target = event.target.closest(match.selector);
        if (target === lastHoverTarget) return;
        lastHoverTarget = target;
        showBubble(match.text, 4800);
    });
    document.addEventListener("pointerout", event => {
        if (event.target.closest(".project-card, .skill, .experience, .education-item, .certificate")) lastHoverTarget = null;
    });

    // Eyes follow the cursor slightly, without moving the assistant itself.
    const eyes = document.querySelectorAll(".ai-robot-eye");
    window.addEventListener("pointermove", event => {
        if (event.pointerType === "touch" || !eyes.length) return;
        const rect = launcher.getBoundingClientRect();
        const dx = Math.max(-2, Math.min(2, (event.clientX - (rect.left + rect.width / 2)) / 90));
        const dy = Math.max(-1.5, Math.min(1.5, (event.clientY - (rect.top + rect.height / 2)) / 110));
        eyes.forEach(eye => { eye.style.transform = `translate(${dx}px, ${dy}px)`; });
    }, { passive: true });

    // Initial greeting disappears gently; the character remains available.
    setTimeout(() => bubble.classList.remove("is-visible"), 9000);
})();
