/* =========================================================
   KRISHI-MITRA
   CHATBOT.JS
   Mitra AI — Full-Featured Agricultural AI Assistant
   Powered by OpenRouter AI (Google Gemini 2.5 Flash / Llama 3.3 / GPT-4o-mini)
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       CONFIG & CREDENTIALS
       ===================================================== */
    const OPENROUTER_API_KEY = "YOUR_API_KEY_HERE";
    const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

    // Primary and fallback models for high speed and 100% uptime
    const AI_MODELS = [
        "google/gemini-2.5-flash",
        "meta-llama/llama-3.3-70b-instruct",
        "openai/gpt-4o-mini",
        "deepseek/deepseek-chat"
    ];

    const CHAT_STORAGE_KEY = "krishi_mitra_chat_history_v2";

    /* =====================================================
       STATE
       ===================================================== */
    let conversationHistory = [];
    let isAwaitingResponse = false;
    let speechRecognition = null;
    let isListening = false;
    let currentSpeechUtterance = null;

    /* =====================================================
       DYNAMIC USER CONTEXT & SYSTEM PROMPT
       ===================================================== */
    function getUserContext() {
        let userName = "Farmer";
        let userRole = "farmer";
        let district = "";
        let crop = "";

        try {
            const rawUser = localStorage.getItem("krishi_mitra_user");
            if (rawUser) {
                const u = JSON.parse(rawUser);
                if (u.name && u.name !== "Guest User") userName = u.name;
                if (u.role) userRole = u.role;
                if (u.district) district = u.district;
            }
        } catch (e) {}

        try {
            const rawProfile = localStorage.getItem("krishiMitraProfile");
            if (rawProfile) {
                const p = JSON.parse(rawProfile);
                if (p.name && p.name !== "Farmer") userName = p.name;
                if (p.location) district = p.location;
                if (p.crop) crop = p.crop;
            }
        } catch (e) {}

        let currentLang = "en";
        try {
            if (window.KrishiTranslation && typeof window.KrishiTranslation.getLanguage === "function") {
                currentLang = window.KrishiTranslation.getLanguage();
            } else {
                currentLang = localStorage.getItem("krishiMitraLanguage") || "en";
            }
        } catch (e) {}

        return { userName, userRole, district, crop, currentLang };
    }

    function buildSystemPrompt() {
        const ctx = getUserContext();
        return `You are Mitra AI (कृषि-मित्र एआई), an elite, compassionate, and highly practical agricultural expert and farm advisor on India's Krishi-Mitra (कृषि-मित्र) platform.

USER PROFILE:
- Name: ${ctx.userName}
- Role: ${ctx.userRole === "buyer" ? "Agri Buyer / Trader / Merchant" : "Farmer (शेतकरी / किसान)"}
${ctx.district ? `- District/Region: ${ctx.district}` : ""}
${ctx.crop ? `- Primary Crop: ${ctx.crop}` : ""}
- Active Language: ${ctx.currentLang}

INSTRUCTIONS FOR RESPONSES:
1. MULTILINGUAL AGILITY: Automatically detect and respond in the user's language:
   - If user writes in Hindi or asks in Hindi -> Reply in clean, respectful Hindi (हिन्दी).
   - If user writes in Marathi or asks in Marathi -> Reply in clean, respectful Marathi (मराठी).
   - If user writes in English -> Reply in clear, simple English.
   - If user writes in Hinglish / Marathiglish in Latin script -> Reply in clear Hindi/Marathi or Hinglish as natural.
2. PERSONALIZATION: Greet warmly using their name (e.g. "नमस्ते ${ctx.userName} जी!" or "नमस्कार ${ctx.userName} जी!").
3. ACTIONABLE AGRICULTURAL GUIDANCE:
   - For CROP DISEASES: Identify symptoms, state organic/biological remedy first (Neem oil, Trichoderma, etc.), and provide exact chemical fungicide/pesticide dosage (e.g. 2 ml/liter or 250 ml/acre) with safety precautions.
   - For FERTILIZERS: Provide exact NPK ratios, Urea/DAP/MOP schedule, and micronutrient tips based on crop stages.
   - For WEATHER & SOWING: Give practical sowing, irrigation, and spraying window advice based on seasonal cycles.
   - For MANDI PRICES & POST-HARVEST: Advise on grading, cold storage timing, FPO bulk bargaining, and transport.
   - For GOVERNMENT SCHEMES: Provide clear steps for PM-Kisan, PM Fasal Bima Yojana (PMFBY), Kisan Credit Card (KCC), Soil Health Card, and e-NAM.
4. FORMATTING & READABILITY:
   - Use bold highlights (**word**), clean bullet points, numbered steps, and relevant emojis (🌾, 🍅, 💧, 🌦️, 💰, 🌿).
   - Keep answers well-structured, easy to scan on mobile, concise yet comprehensive.
   - Do NOT produce huge walls of text; organize into distinct sections.`;
    }

    /* =====================================================
       MARKDOWN TO HTML FORMATTER
       ===================================================== */
    function formatMarkdown(text) {
        if (!text) return "";

        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Bold **text**
        html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Italic *text*
        html = html.replace(/\*([^\*]+)\*/g, "<em>$1</em>");

        // Inline code `code`
        html = html.replace(/`([^`]+)`/g, "<code class='inline-code'>$1</code>");

        // Headings ### Heading
        html = html.replace(/^### (.*$)/gim, "<h4 class='mitra-h4'>$1</h4>");
        html = html.replace(/^## (.*$)/gim, "<h3 class='mitra-h3'>$1</h3>");
        html = html.replace(/^# (.*$)/gim, "<h2 class='mitra-h2'>$1</h2>");

        // Numbered lists
        html = html.replace(/^\s*(\d+)\.\s+(.*)$/gim, "<li class='mitra-list-item-num'><strong>$1.</strong> $2</li>");

        // Bullet lists
        html = html.replace(/^\s*[\*\-]\s+(.*)$/gim, "<li class='mitra-list-item-bullet'>$1</li>");

        // Double newlines into paragraph separation
        html = html.replace(/\n{2,}/g, "</p><p>");

        // Single newlines into breaks
        html = html.replace(/\n/g, "<br>");

        return "<p>" + html + "</p>";
    }

    /* =====================================================
       OPENROUTER API CLIENT (WITH MODEL FALLBACKS)
       ===================================================== */
    async function fetchAIResponse(messages) {
        let lastError = null;

        for (let i = 0; i < AI_MODELS.length; i++) {
            const modelName = AI_MODELS[i];
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout per model

                const response = await fetch(OPENROUTER_ENDPOINT, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://krishi-mitra.gov.in",
                        "X-Title": "Krishi-Mitra AI Assistant"
                    },
                    body: JSON.stringify({
                        model: modelName,
                        messages: messages,
                        temperature: 0.7,
                        max_tokens: 800
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errBody = await response.text();
                    console.warn(`Model ${modelName} returned status ${response.status}:`, errBody);
                    lastError = new Error(`HTTP ${response.status}: ${errBody}`);
                    continue; // Try next fallback model
                }

                const data = await response.json();
                if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                    return {
                        content: data.choices[0].message.content,
                        model: modelName
                    };
                } else {
                    lastError = new Error("No response choices returned by API.");
                }
            } catch (err) {
                console.warn(`Error connecting with model ${modelName}:`, err);
                lastError = err;
            }
        }

        throw lastError || new Error("Unable to connect to AI service. Please check your network.");
    }

    /* =====================================================
       TEXT TO SPEECH (VOICE READOUT)
       ===================================================== */
    function speakText(text, btnElement) {
        if (!("speechSynthesis" in window)) {
            alert("Text-to-speech is not supported in your browser.");
            return;
        }

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            if (btnElement && btnElement.classList.contains("speaking")) {
                btnElement.classList.remove("speaking");
                btnElement.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
                return;
            }
        }

        // Clean markdown tags for natural speech
        const cleanText = text
            .replace(/[*#`_]/g, "")
            .replace(/https?:\/\/\S+/g, "")
            .replace(/[🌱🌾🍅🌦️💰🌿🤖💡🔔🛒👨‍🌾]/g, "");

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.95; // Slightly slower for clear rural understanding
        utterance.pitch = 1.0;

        // Try to pick appropriate regional voice
        const voices = window.speechSynthesis.getVoices();
        const hasDevanagari = /[\u0900-\u097F]/.test(text);

        if (hasDevanagari) {
            const hiVoice = voices.find(v => v.lang.startsWith("hi") || v.lang.startsWith("mr"));
            if (hiVoice) utterance.voice = hiVoice;
        } else {
            const inVoice = voices.find(v => v.lang === "en-IN" || v.lang.startsWith("en"));
            if (inVoice) utterance.voice = inVoice;
        }

        if (btnElement) {
            btnElement.classList.add("speaking");
            btnElement.innerHTML = '<i class="fa-solid fa-circle-stop"></i> Stop';

            utterance.onend = () => {
                btnElement.classList.remove("speaking");
                btnElement.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
            };
            utterance.onerror = () => {
                btnElement.classList.remove("speaking");
                btnElement.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
            };
        }

        currentSpeechUtterance = utterance;
        window.speechSynthesis.speak(utterance);
    }

    /* =====================================================
       SPEECH RECOGNITION (VOICE INPUT)
       ===================================================== */
    function initSpeechRecognition() {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) return null;

        const recognizer = new SpeechRec();
        recognizer.continuous = false;
        recognizer.interimResults = false;

        const ctx = getUserContext();
        if (ctx.currentLang === "hi") {
            recognizer.lang = "hi-IN";
        } else if (ctx.currentLang === "mr") {
            recognizer.lang = "mr-IN";
        } else {
            recognizer.lang = "en-IN";
        }

        return recognizer;
    }

    function toggleVoiceInput(micBtn, inputField) {
        if (!speechRecognition) {
            speechRecognition = initSpeechRecognition();
        }

        if (!speechRecognition) {
            alert("Voice typing is not supported in this browser. Please use Chrome, Edge, or Safari.");
            return;
        }

        if (isListening) {
            speechRecognition.stop();
            isListening = false;
            micBtn.classList.remove("listening");
            micBtn.title = "Speak to Mitra (Voice Input)";
            return;
        }

        // Update language to current
        const ctx = getUserContext();
        speechRecognition.lang = ctx.currentLang === "hi" ? "hi-IN" : (ctx.currentLang === "mr" ? "mr-IN" : "en-IN");

        speechRecognition.onstart = function () {
            isListening = true;
            micBtn.classList.add("listening");
            micBtn.title = "Listening... Speak your question now";
            inputField.placeholder = "Listening... Speak now 🎙️";
        };

        speechRecognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
                inputField.value = transcript;
                // Auto-send voice queries for hands-free farmer convenience
                const form = inputField.closest("form");
                if (form) {
                    form.dispatchEvent(new Event("submit", { cancelable: true }));
                }
            }
        };

        speechRecognition.onerror = function (event) {
            console.warn("Speech recognition error:", event.error);
            isListening = false;
            micBtn.classList.remove("listening");
            inputField.placeholder = "Ask Mitra about your farm...";
        };

        speechRecognition.onend = function () {
            isListening = false;
            micBtn.classList.remove("listening");
            inputField.placeholder = "Ask Mitra about your farm...";
        };

        try {
            speechRecognition.start();
        } catch (e) {
            console.warn("Speech recognition start failed:", e);
        }
    }

    /* =====================================================
       CHAT DOM RENDERING
       ===================================================== */
    function renderUserMessage(text, container) {
        const row = document.createElement("div");
        row.className = "mitra-message user";

        const bubble = document.createElement("div");
        bubble.className = "mitra-bubble user-bubble";
        bubble.textContent = text;

        const avatar = document.createElement("div");
        avatar.className = "mitra-message-avatar user-avatar";
        avatar.innerHTML = '<i class="fa-solid fa-user"></i>';

        row.appendChild(bubble);
        row.appendChild(avatar);
        container.appendChild(row);

        scrollToBottom(container);
    }

    function renderBotMessage(text, container, modelUsed) {
        const row = document.createElement("div");
        row.className = "mitra-message bot";

        const avatar = document.createElement("div");
        avatar.className = "mitra-message-avatar bot-avatar";
        avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';

        const bubble = document.createElement("div");
        bubble.className = "mitra-bubble bot-bubble";

        const contentDiv = document.createElement("div");
        contentDiv.className = "mitra-content-body";
        contentDiv.innerHTML = formatMarkdown(text);
        bubble.appendChild(contentDiv);

        // Action Toolbar (Audio Listen, Copy, Timestamp)
        const actionsBar = document.createElement("div");
        actionsBar.className = "mitra-message-actions";

        const timeSpan = document.createElement("span");
        timeSpan.className = "mitra-time-tag";
        const now = new Date();
        timeSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        actionsBar.appendChild(timeSpan);

        // TTS Speak Button
        const listenBtn = document.createElement("button");
        listenBtn.type = "button";
        listenBtn.className = "mitra-action-btn listen-btn";
        listenBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
        listenBtn.title = "Read aloud in natural voice";
        listenBtn.addEventListener("click", () => speakText(text, listenBtn));
        actionsBar.appendChild(listenBtn);

        // Copy Button
        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "mitra-action-btn copy-btn";
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        copyBtn.title = "Copy advice to clipboard";
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.innerHTML = '<i class="fa-solid fa-check text-emerald-500"></i> Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
                }, 2000);
            });
        });
        actionsBar.appendChild(copyBtn);

        bubble.appendChild(actionsBar);
        row.appendChild(avatar);
        row.appendChild(bubble);
        container.appendChild(row);

        scrollToBottom(container);
    }

    function showTypingIndicator(container) {
        removeTypingIndicator(container);

        const row = document.createElement("div");
        row.className = "mitra-message bot mitra-typing-row";
        row.id = "mitra-typing-indicator";

        const avatar = document.createElement("div");
        avatar.className = "mitra-message-avatar bot-avatar";
        avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';

        const bubble = document.createElement("div");
        bubble.className = "mitra-bubble bot-bubble typing-bubble";
        bubble.innerHTML = `
            <div class="mitra-typing-dots">
                <span></span><span></span><span></span>
            </div>
            <span class="typing-label">Mitra AI is thinking...</span>
        `;

        row.appendChild(avatar);
        row.appendChild(bubble);
        container.appendChild(row);
        scrollToBottom(container);
    }

    function removeTypingIndicator(container) {
        const typing = container ? container.querySelector("#mitra-typing-indicator") : document.getElementById("mitra-typing-indicator");
        if (typing) typing.remove();
    }

    function scrollToBottom(container) {
        if (!container) return;
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 50);
    }

    /* =====================================================
       SENDING MESSAGE FLOW
       ===================================================== */
    async function handleSendMessage(queryText, messagesContainer, inputField) {
        if (!queryText || isAwaitingResponse) return;

        const cleanText = queryText.trim();
        if (!cleanText) return;

        // Render user query
        renderUserMessage(cleanText, messagesContainer);

        // Clear input
        if (inputField) {
            inputField.value = "";
            inputField.focus();
        }

        // Add to conversation memory
        conversationHistory.push({ role: "user", content: cleanText });
        saveChatHistory();

        isAwaitingResponse = true;
        showTypingIndicator(messagesContainer);

        // Prepare context payload
        const systemPrompt = buildSystemPrompt();
        // Keep last 10 messages for fast contextual speed
        const recentHistory = conversationHistory.slice(-10);
        const payloadMessages = [
            { role: "system", content: systemPrompt },
            ...recentHistory
        ];

        try {
            const response = await fetchAIResponse(payloadMessages);
            removeTypingIndicator(messagesContainer);

            renderBotMessage(response.content, messagesContainer, response.model);

            conversationHistory.push({ role: "assistant", content: response.content });
            saveChatHistory();
        } catch (error) {
            console.error("Mitra AI Error:", error);
            removeTypingIndicator(messagesContainer);

            const errText = `⚠️ **Connection issue:** I was unable to connect to the cloud AI server right now (${error.message}).\n\n*Quick offline advice:* Please ensure your internet connection is active, or try asking your question again in a moment.`;
            renderBotMessage(errText, messagesContainer);
        } finally {
            isAwaitingResponse = false;
        }
    }

    /* =====================================================
       CHAT PERSISTENCE & RESET
       ===================================================== */
    function saveChatHistory() {
        try {
            // Keep at most 20 messages in storage
            const trimmed = conversationHistory.slice(-20);
            sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(trimmed));
        } catch (e) {}
    }

    function loadSavedChatHistory(messagesContainer) {
        try {
            const raw = sessionStorage.getItem(CHAT_STORAGE_KEY);
            if (!raw) return false;

            const saved = JSON.parse(raw);
            if (Array.isArray(saved) && saved.length > 0) {
                conversationHistory = saved;

                // Clear default placeholder messages
                messagesContainer.innerHTML = "";

                // Render saved history
                saved.forEach(msg => {
                    if (msg.role === "user") {
                        renderUserMessage(msg.content, messagesContainer);
                    } else if (msg.role === "assistant") {
                        renderBotMessage(msg.content, messagesContainer);
                    }
                });
                return true;
            }
        } catch (e) {}
        return false;
    }

    function clearChat(messagesContainer) {
        conversationHistory = [];
        try {
            sessionStorage.removeItem(CHAT_STORAGE_KEY);
        } catch (e) {}

        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        if (messagesContainer) {
            messagesContainer.innerHTML = "";
            renderInitialWelcome(messagesContainer);
        }
    }

    function renderInitialWelcome(messagesContainer) {
        const ctx = getUserContext();
        let welcomeText = "";

        if (ctx.currentLang === "hi") {
            welcomeText = `**नमस्ते ${ctx.userName} जी!** 🌱🙏\n\nमैं आपका **कृषि-मित्र एआई (Mitra AI)** सहायक हूँ। मुझसे फसल रोग, कीटनाशक दवा, खाद की सही मात्रा, मंडी भाव या सरकारी योजनाओं के बारे में कुछ भी पूछें!`;
        } else if (ctx.currentLang === "mr") {
            welcomeText = `**नमस्कार ${ctx.userName} जी!** 🌱🙏\n\nमी तुमचा **कृषी-मित्र एआय (Mitra AI)** सहाय्यक आहे. मला पीक रोग, कीटकनाशके, खतांचे प्रमाण, बाजार भाव किंवा सरकारी योजनांविषयी कोणताही प्रश्न विचारा!`;
        } else {
            welcomeText = `**Namaste ${ctx.userName}!** 🌱\n\nI am **Mitra AI**, your smart agricultural companion. Ask me anything about crop diseases, pest treatments, fertilizer calculations, mandi rates, or government schemes!`;
        }

        renderBotMessage(welcomeText, messagesContainer);
    }

    /* =====================================================
       INITIALIZE MITRA MODULE IN DASHBOARD
       ===================================================== */
    function initializeMitraModule() {
        const messagesContainer = document.getElementById("mitra-messages");
        const chatForm = document.getElementById("mitra-chat-form");
        const chatInput = document.getElementById("mitra-chat-input");

        if (!messagesContainer || !chatForm || !chatInput) {
            return;
        }

        // Add Quick Clear & Voice Controls if not already in markup
        const chatHeader = document.querySelector(".mitra-chat-header");
        if (chatHeader && !document.getElementById("mitra-clear-btn")) {
            const headerRight = document.createElement("div");
            headerRight.className = "mitra-header-right-tools";
            headerRight.innerHTML = `
                <button type="button" class="mitra-clear-btn" id="mitra-clear-btn" title="Start fresh conversation">
                    <i class="fa-solid fa-rotate-right"></i> <span>New Chat</span>
                </button>
            `;
            chatHeader.appendChild(headerRight);

            const clearBtn = document.getElementById("mitra-clear-btn");
            if (clearBtn) {
                clearBtn.addEventListener("click", () => {
                    if (confirm("Start a new chat session with Mitra AI?")) {
                        clearChat(messagesContainer);
                    }
                });
            }
        }

        // Add microphone voice button to chat form if missing
        if (!document.getElementById("mitra-voice-btn")) {
            const voiceBtn = document.createElement("button");
            voiceBtn.type = "button";
            voiceBtn.id = "mitra-voice-btn";
            voiceBtn.className = "mitra-voice-btn";
            voiceBtn.title = "Speak to Mitra (Voice Input)";
            voiceBtn.setAttribute("aria-label", "Voice input");
            voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';

            // Insert before input
            chatForm.insertBefore(voiceBtn, chatInput);

            voiceBtn.addEventListener("click", (e) => {
                e.preventDefault();
                toggleVoiceInput(voiceBtn, chatInput);
            });
        }

        // Add Interactive Suggestion Chips above the form
        if (!document.getElementById("mitra-suggestion-chips")) {
            const chipsDiv = document.createElement("div");
            chipsDiv.id = "mitra-suggestion-chips";
            chipsDiv.className = "mitra-suggestion-chips";

            const ctx = getUserContext();
            const suggestions = ctx.currentLang === "hi" ? [
                { text: "🌾 गेहूं की खाद और पानी शेड्यूल", q: "गेहूं की फसल में खाद (Urea, DAP) और सिंचाई का सही समय क्या है?" },
                { text: "🍅 टमाटर में पत्ती मुड़ना (Leaf Curl)", q: "टमाटर में पत्ती मुड़ने का रोग (Leaf Curl) लग गया है, क्या स्प्रे करें?" },
                { text: "🌦️ बारिश में कीटनाशक छिड़काव", q: "क्या बारिश से पहले कीटनाशक का छिड़काव करना सही है?" },
                { text: "📈 मंडी में अधिकतम भाव कैसे पाएं?", q: "फसल को मंडी में बेचते समय सबसे अच्छा भाव पाने के तरीके क्या हैं?" },
                { text: "🏛️ पीएम किसान सम्मान निधि स्टेटस", q: "पीएम किसान सम्मान निधि 17वीं किस्त की पात्रता और जांच कैसे करें?" }
            ] : (ctx.currentLang === "mr" ? [
                { text: "🌾 गव्हाचे खत व पाणी व्यवस्थापन", q: "गहू पिकासाठी खत (युरिया, डीएपी) आणि पाण्याचे योग्य वेळापत्रक काय आहे?" },
                { text: "🍅 टोमॅटो पानांचा चुरडा-मुरडा रोग", q: "टोमॅटो पिकावर चुरडा-मुरडा (Leaf Curl) रोग आला आहे, काय फवारणी करावी?" },
                { text: "🌦️ पावसाचा अंदाज व फवारणी सल्ला", q: "पावसाच्या वातावरणात पिकावर कीटकनाशक फवारणी करावी का?" },
                { text: "📈 बाजारपेठेत हमखास चांगला भाव", q: "बाजार समितीत शेतमालाला चांगला दर मिळवण्यासाठी काय करावे?" },
                { text: "🏛️ पीएम किसान योजना लाभ", q: "पीएम किसान योजनेचे हप्ते आणि लाभ कसा तपासावा?" }
            ] : [
                { text: "🌾 Wheat fertilizer & watering schedule", q: "What is the optimal fertilizer (Urea/DAP) and irrigation schedule for wheat?" },
                { text: "🍅 Tomato leaf curl remedy", q: "My tomato crop has leaf curl virus, what pesticide/fungicide should I spray?" },
                { text: "🌦️ Pesticide spray weather advice", q: "Is it safe to spray pesticides if rain is expected in 24 hours?" },
                { text: "📈 Tips to get max APMC mandi price", q: "How can I get the highest price for my produce in APMC markets?" },
                { text: "🏛️ PM-Kisan scheme guidelines", q: "How can I check my eligibility and installment status under PM-Kisan?" }
            ]);

            chipsDiv.innerHTML = `
                <div class="chips-scroll">
                    ${suggestions.map(s => `<button type="button" class="mitra-chip" data-query="${s.q}">${s.text}</button>`).join("")}
                </div>
            `;

            chatForm.parentNode.insertBefore(chipsDiv, chatForm);

            // Chip click handler
            chipsDiv.addEventListener("click", (e) => {
                const btn = e.target.closest(".mitra-chip");
                if (btn) {
                    const query = btn.dataset.query;
                    if (query) {
                        handleSendMessage(query, messagesContainer, chatInput);
                    }
                }
            });
        }

        // Load conversation history or initial welcome
        const hadHistory = loadSavedChatHistory(messagesContainer);
        if (!hadHistory) {
            messagesContainer.innerHTML = "";
            renderInitialWelcome(messagesContainer);
        }

        // Form Submit Handler
        chatForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (text) {
                handleSendMessage(text, messagesContainer, chatInput);
            }
        });

        // Enter key shortcut (Shift+Enter for newline if multiline)
        chatInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                chatForm.dispatchEvent(new Event("submit", { cancelable: true }));
            }
        });
    }

    /* =====================================================
       FARMER DASHBOARD CHECK
       Strictly show only on Farmer Dashboard (never on landing or login)
       ===================================================== */
    function isFarmerDashboardActive() {
        // Disallow on buyer pages
        if (window.location.pathname.includes("/buyer/") || document.getElementById("buyerSidebar")) {
            return false;
        }

        // Disallow on auth/login pages
        if (window.location.pathname.includes("auth.html")) {
            return false;
        }

        // Disallow when body has landing-active
        if (document.body && document.body.classList.contains("landing-active")) {
            return false;
        }

        // Disallow when landing page section is visible
        const landingPage = document.getElementById("landing-page");
        if (landingPage) {
            const isHiddenAttr = landingPage.hidden || landingPage.getAttribute("aria-hidden") === "true";
            if (!isHiddenAttr) {
                const styleDisplay = window.getComputedStyle(landingPage).display;
                if (styleDisplay !== "none") {
                    return false;
                }
            }
        }

        // Must have farmer dashboard sidebar/content-area active
        const sidebar = document.getElementById("sidebar");
        if (sidebar && window.getComputedStyle(sidebar).display === "none") {
            return false;
        }

        return true;
    }

    function syncMitraVisibility() {
        const fab = document.getElementById("mitra-floating-fab");
        const modal = document.getElementById("mitra-floating-modal");
        const isFarmerActive = isFarmerDashboardActive();

        if (fab) {
            fab.style.display = isFarmerActive ? "flex" : "none";
        }
        if (modal && !isFarmerActive) {
            modal.classList.remove("active");
            modal.style.display = "none";
        }
    }

    function startDashboardObserver() {
        syncMitraVisibility();

        if (window.MutationObserver && document.body) {
            const observer = new MutationObserver(() => {
                syncMitraVisibility();
            });

            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ["class", "style"]
            });

            const landing = document.getElementById("landing-page");
            if (landing) {
                observer.observe(landing, {
                    attributes: true,
                    attributeFilter: ["style", "hidden", "class"]
                });
            }
        }

        // Continuous sync check for hash/state transitions
        setInterval(syncMitraVisibility, 500);
    }

    /* =====================================================
       FLOATING MITRA AI BUTTON (FARMERS DASHBOARD ONLY)
       ===================================================== */
    function injectFloatingMitraButton() {
        if (document.getElementById("mitra-floating-fab")) return;

        // Never inject on buyer or login pages
        if (window.location.pathname.includes("/buyer/") || window.location.pathname.includes("auth.html") || document.getElementById("buyerSidebar")) {
            return;
        }

        const fab = document.createElement("button");
        fab.type = "button";
        fab.id = "mitra-floating-fab";
        fab.className = "mitra-floating-fab";
        fab.title = "Ask Mitra AI — Intelligent Farming Assistant";
        fab.setAttribute("aria-label", "Ask Mitra AI");

        fab.innerHTML = `
            <span class="mitra-fab-pulse"></span>
            <div class="mitra-fab-icon">
                <i class="fa-solid fa-robot"></i>
            </div>
            <span class="mitra-fab-text">Ask Mitra AI</span>
        `;

        // Start hidden if landing page is active
        fab.style.display = isFarmerDashboardActive() ? "flex" : "none";

        document.body.appendChild(fab);

        fab.addEventListener("click", function () {
            if (window.KrishiNavigation && typeof window.KrishiNavigation.showModule === "function") {
                window.KrishiNavigation.showModule("mitra-ai");
                const chatInput = document.getElementById("mitra-chat-input");
                if (chatInput) setTimeout(() => chatInput.focus(), 150);
            }
        });
    }

    /* =====================================================
       FLOATING CHAT MODAL (POPUP FOR ALL PAGES / BUYER)
       ===================================================== */
    function openFloatingChatModal() {
        if (!isFarmerDashboardActive()) return;

        let modal = document.getElementById("mitra-floating-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "mitra-floating-modal";
            modal.className = "mitra-floating-modal";

            modal.innerHTML = `
                <div class="mitra-modal-box">
                    <div class="mitra-modal-header">
                        <div class="flex items-center gap-2.5">
                            <div class="modal-robot-avatar">
                                <i class="fa-solid fa-robot"></i>
                            </div>
                            <div>
                                <h3 class="modal-title">Mitra AI Assistant</h3>
                                <span class="modal-sub">Smart Agricultural Advisor • Online</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <button type="button" id="modal-clear-btn" class="modal-tool-btn" title="New conversation">
                                <i class="fa-solid fa-rotate-right"></i>
                            </button>
                            <button type="button" id="modal-close-btn" class="modal-tool-btn" title="Close chat">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mitra-messages modal-messages-area" id="modal-mitra-messages"></div>
                    <form class="mitra-input-area modal-input-bar" id="modal-mitra-form">
                        <button type="button" class="mitra-voice-btn" id="modal-voice-btn" title="Voice Input">
                            <i class="fa-solid fa-microphone"></i>
                        </button>
                        <input type="text" id="modal-mitra-input" placeholder="Ask Mitra anything..." autocomplete="off">
                        <button type="submit" class="mitra-send-btn">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            const closeBtn = modal.querySelector("#modal-close-btn");
            closeBtn.addEventListener("click", () => modal.classList.remove("active"));

            const clearBtn = modal.querySelector("#modal-clear-btn");
            const modalMessages = modal.querySelector("#modal-mitra-messages");
            clearBtn.addEventListener("click", () => clearChat(modalMessages));

            const modalVoiceBtn = modal.querySelector("#modal-voice-btn");
            const modalInput = modal.querySelector("#modal-mitra-input");
            modalVoiceBtn.addEventListener("click", () => toggleVoiceInput(modalVoiceBtn, modalInput));

            const modalForm = modal.querySelector("#modal-mitra-form");
            modalForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const text = modalInput.value.trim();
                if (text) {
                    handleSendMessage(text, modalMessages, modalInput);
                }
            });

            renderInitialWelcome(modalMessages);
        }

        modal.classList.add("active");
        const modalInput = modal.querySelector("#modal-mitra-input");
        if (modalInput) setTimeout(() => modalInput.focus(), 150);
    }

    /* =====================================================
       SIDEBAR & HERO BUTTON BINDINGS
       ===================================================== */
    function setupTriggerButtons() {
        document.addEventListener("click", function (e) {
            const heroBtn = e.target.closest('.hero-mitra-button, [data-module="mitra-ai"], [data-module="mitra"]');
            if (heroBtn) {
                e.preventDefault();
                if (!isFarmerDashboardActive()) return;

                if (window.KrishiNavigation && typeof window.KrishiNavigation.showModule === "function") {
                    window.KrishiNavigation.showModule("mitra-ai");
                    const input = document.getElementById("mitra-chat-input");
                    if (input) setTimeout(() => input.focus(), 200);
                }
            }
        });
    }

    /* =====================================================
       PUBLIC MITRA API
       ===================================================== */
    window.KrishiChatbot = {
        send: function (text) {
            if (!isFarmerDashboardActive()) return;
            const messages = document.getElementById("mitra-messages");
            const input = document.getElementById("mitra-chat-input");
            if (messages) handleSendMessage(text, messages, input);
        },
        open: function () {
            if (!isFarmerDashboardActive()) return;
            if (window.KrishiNavigation && typeof window.KrishiNavigation.showModule === "function") {
                window.KrishiNavigation.showModule("mitra-ai");
            }
        },
        clear: function () {
            const messages = document.getElementById("mitra-messages");
            clearChat(messages);
        }
    };

    /* =====================================================
       INITIALIZE ON DOM READY
       ===================================================== */
    function initialize() {
        initializeMitraModule();
        injectFloatingMitraButton();
        setupTriggerButtons();
        startDashboardObserver();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }

})();