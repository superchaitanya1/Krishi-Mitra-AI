/* =========================================================
   KRISHI-MITRA
   TRANSLATION.JS
   Complete Multilingual Interface
   English / Hindi / Marathi

   IMPORTANT:
   - English is the source language.
   - Every text node remembers its original English text.
   - Switching languages repeatedly is supported.
   - Dynamic content created by dashboard.js is translated.
   - Meaning-based Hindi and Marathi translations are used.
   ========================================================= */
(function () {

    "use strict";

    /* =====================================================
       AUTOMATIC TRANSLATION ENGINE
       Uses Google Website Translator (no API key in frontend).
       The existing dictionary remains available as a fallback
       and for Krishi-Mitra-specific terminology.
       ===================================================== */

    let googleTranslateReady = false;
    let googleTranslateRequestedLanguage = "en";
    let googleTranslateLoaderStarted = false;

    function ensureGoogleTranslateStyles() {
        if (document.getElementById("krishi-google-translate-style")) return;
        const style = document.createElement("style");
        style.id = "krishi-google-translate-style";
        style.textContent = `
            #google_translate_element {
                position: fixed !important;
                width: 1px !important;
                height: 1px !important;
                overflow: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                left: -9999px !important;
                top: -9999px !important;
            }
            .goog-te-banner-frame, .skiptranslate,
            body > .skiptranslate { display: none !important; }
            body { top: 0 !important; }
            .goog-tooltip, .goog-te-balloon-frame { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    function ensureGoogleTranslateContainer() {
        let container = document.getElementById("google_translate_element");
        if (!container) {
            container = document.createElement("div");
            container.id = "google_translate_element";
            container.setAttribute("aria-hidden", "true");
            document.body.appendChild(container);
        }
        return container;
    }

    window.googleTranslateElementInit = function () {
        if (!window.google || !google.translate) return;
        ensureGoogleTranslateStyles();
        ensureGoogleTranslateContainer();
        new google.translate.TranslateElement({
            pageLanguage: "en",
            includedLanguages: "en,hi,mr",
            autoDisplay: false,
            multilanguagePage: true
        }, "google_translate_element");
        googleTranslateReady = true;
        setTimeout(function () {
            applyGoogleLanguage(googleTranslateRequestedLanguage);
        }, 250);
    };

    function loadGoogleTranslate() {
        ensureGoogleTranslateStyles();
        ensureGoogleTranslateContainer();
        if (googleTranslateLoaderStarted) return;
        googleTranslateLoaderStarted = true;

        if (window.google && google.translate) {
            window.googleTranslateElementInit();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        script.onerror = function () {
            googleTranslateReady = false;
        };
        document.head.appendChild(script);
    }

    function getGoogleSelect() {
        return document.querySelector("#google_translate_element select.goog-te-combo");
    }

    function applyGoogleLanguage(language) {
        googleTranslateRequestedLanguage = language;
        const select = getGoogleSelect();
        if (!select) return false;

        const target = language === "en" ? "" : language;
        if (select.value !== target) {
            select.value = target;
            select.dispatchEvent(new Event("change", { bubbles: true }));
        } else if (language === "en") {
            select.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (language !== "en") {
            setTimeout(function () { applyStrictLocalizations(language); }, 350);
            setTimeout(function () { applyStrictLocalizations(language); }, 1200);
            setTimeout(function () { applyStrictLocalizations(language); }, 2200);
        }
        return true;
    }

    function broadcastLanguageToIframes(language) {
        document.querySelectorAll("iframe").forEach(function (frame) {
            try {
                frame.contentWindow.postMessage({
                    type: "krishi:set-language",
                    language: language
                }, "*");
            } catch (error) {}
        });
    }

    window.addEventListener("message", function (event) {
        if (!event.data || event.data.type !== "krishi:set-language") return;
        const language = event.data.language;
        if (["en", "hi", "mr"].includes(language)) {
            googleTranslateRequestedLanguage = language;
            if (language === "en") {
                // A parent page may send the English command to an iframe.
                // The parent itself handles its own page-state restoration;
                // here we only restore this iframe's source-language DOM.
                restoreOriginalPage();
                document.dispatchEvent(new CustomEvent("krishi:language-changed", { detail: { language: "en" } }));
                return;
            }
            if (googleTranslateReady) {
                applyGoogleLanguage(language);
            } else {
                loadGoogleTranslate();
            }
        }
    });

    function restoreOriginalPage() {
        isTranslating = true;
        try {
            getTextNodes(document.body).forEach(function (node) {
                if (originalTextMap.has(node)) {
                    node.nodeValue = originalTextMap.get(node);
                }
            });

            document.querySelectorAll("[data-krishi-original-placeholder]").forEach(function (element) {
                element.setAttribute("placeholder", element.getAttribute("data-krishi-original-placeholder"));
            });

            document.querySelectorAll("[data-krishi-original-title]").forEach(function (element) {
                element.setAttribute("title", element.getAttribute("data-krishi-original-title"));
            });

            document.documentElement.setAttribute("lang", "en");
            currentLanguage = "en";
            localStorage.setItem("krishiMitraLanguage", "en");

            // Reset the hidden Google selector to the source language without
            // reloading the current page/module.
            const select = getGoogleSelect();
            if (select && select.value !== "") {
                select.value = "";
                select.dispatchEvent(new Event("change", { bubbles: true }));
            }
        } finally {
            isTranslating = false;
        }
    }

    /* =====================================================
       STRICT AGRICULTURE TERM LOCALIZATION
       Handles dynamic/proper-name content that automatic web
       translators commonly leave partly untranslated.
       ===================================================== */
    const strictLocalizations = {
        hi: {
            "Live Market Intelligence": "लाइव बाज़ार बुद्धिमत्ता",
            "Life Bazaar Intelligence": "लाइव बाज़ार बुद्धिमत्ता",
            "Live": "लाइव",
            "Kisan Samruddhi Producer": "किसान समृद्धि उत्पादक",
            "Kisan Samruddhi Farmer Producer": "किसान समृद्धि किसान उत्पादक",
            "Farmer Producer": "किसान उत्पादक",
            "NH 60 Pune-Nashik Highway, Narayangaon, Taluka Junnar, Pune": "एनएच 60 पुणे-नाशिक हाईवे, नारायणगाव, तालुका जुन्नर, पुणे",
            "Old Mumbai-Pune Highway, Bazaar Area, Khadki, Pune": "पुराना मुंबई-पुणे हाईवे, बाज़ार क्षेत्र, खड़की, पुणे",
            "Gate No. 4 and 5": "गेट नंबर 4 और 5",
            "Chakan, Maharashtra": "चाकण, महाराष्ट्र",
            "Chakan APMC Yard": "चाकण एपीएमसी यार्ड",
            "Chakan APMC Yard Hub": "चाकण एपीएमसी यार्ड हब",
            "Talegaon Dabhade APMC Sub-Yard": "तलेगाँव दाभाड़े एपीएमसी उप-बाज़ार यार्ड",
            "Talegaon Dabhade Hub": "तलेगाँव दाभाड़े हब",
            "Hadapsar APMC Sub-Market Yard": "हडपसर एपीएमसी उप-बाज़ार यार्ड",
            "Uruli Kanchan Collection Center": "उरुली कांचन संग्रह केंद्र",
            "Pimpri APMC Krishi Mandi (PCMC)": "पिंपरी एपीएमसी कृषि मंडी (पीसीएमसी)",
            "Pimpri Vegetable Mandi": "पिंपरी सब्ज़ी मंडी",
            "Tukaram Pawar": "तुकाराम पवार",
            "Gajanan Chavan": "गजानन चव्हाण",
            "Santosh Jadhav": "संतोष जाधव",
            "Farmer Producer Orgs": "किसान उत्पादक संगठन",
            "Farmer Producer Organizations": "किसान उत्पादक संगठन",
            "Kisan Samruddhi Farmer Producer Co": "किसान समृद्धि किसान उत्पादक कंपनी",
            "Cold Storage Availability": "शीतगृह उपलब्धता",
            "Availability": "उपलब्धता",
            "Market Intelligence": "बाज़ार बुद्धिमत्ता",
            "APMC": "एपीएमसी",
            "Sub-Yard": "उप-बाज़ार यार्ड",
            "Hub": "हब",
            "Collection Center": "संग्रह केंद्र",
            "Producer Orgs": "उत्पादक संगठन",
            "Producer Organizations": "उत्पादक संगठन",
            "Farmer Producer Co": "किसान उत्पादक कंपनी",
            "Farmer Producer": "किसान उत्पादक",
            "Life": "लाइव",
            "Intelligence": "बुद्धिमत्ता"
        },
        mr: {
            "Live Market Intelligence": "थेट बाजार बुद्धिमत्ता",
            "Life Bazaar Intelligence": "थेट बाजार बुद्धिमत्ता",
            "Live": "थेट",
            "Kisan Samruddhi Producer": "किसान समृद्धी उत्पादक",
            "Kisan Samruddhi Farmer Producer": "किसान समृद्धी शेतकरी उत्पादक",
            "Farmer Producer": "शेतकरी उत्पादक",
            "NH 60 Pune-Nashik Highway, Narayangaon, Taluka Junnar, Pune": "एनएच 60 पुणे-नाशिक महामार्ग, नारायणगाव, तालुका जुन्नर, पुणे",
            "Old Mumbai-Pune Highway, Bazaar Area, Khadki, Pune": "जुना मुंबई-पुणे महामार्ग, बाजार परिसर, खडकी, पुणे",
            "Gate No. 4 and 5": "गेट क्रमांक ४ आणि ५",
            "Chakan, Maharashtra": "चाकण, महाराष्ट्र",
            "Chakan APMC Yard": "चाकण एपीएमसी यार्ड",
            "Chakan APMC Yard Hub": "चाकण एपीएमसी यार्ड हब",
            "Talegaon Dabhade APMC Sub-Yard": "तळेगाव दाभाडे एपीएमसी उप-बाजार यार्ड",
            "Talegaon Dabhade Hub": "तळेगाव दाभाडे हब",
            "Hadapsar APMC Sub-Market Yard": "हडपसर एपीएमसी उप-बाजार यार्ड",
            "Uruli Kanchan Collection Center": "उरुळी कांचन संकलन केंद्र",
            "Pimpri APMC Krishi Mandi (PCMC)": "पिंपरी एपीएमसी कृषी मंडई (पीसीएमसी)",
            "Pimpri Vegetable Mandi": "पिंपरी भाजी मंडई",
            "Tukaram Pawar": "तुकाराम पवार",
            "Gajanan Chavan": "गजानन चव्हाण",
            "Santosh Jadhav": "संतोष जाधव",
            "Farmer Producer Orgs": "शेतकरी उत्पादक संस्था",
            "Farmer Producer Organizations": "शेतकरी उत्पादक संस्था",
            "Kisan Samruddhi Farmer Producer Co": "किसान समृद्धी शेतकरी उत्पादक कंपनी",
            "Cold Storage Availability": "शीतगृह उपलब्धता",
            "Availability": "उपलब्धता",
            "Market Intelligence": "बाजार बुद्धिमत्ता",
            "APMC": "एपीएमसी",
            "Sub-Yard": "उप-बाजार यार्ड",
            "Hub": "हब",
            "Collection Center": "संकलन केंद्र",
            "Producer Orgs": "उत्पादक संस्था",
            "Producer Organizations": "उत्पादक संस्था",
            "Farmer Producer Co": "शेतकरी उत्पादक कंपनी",
            "Farmer Producer": "शेतकरी उत्पादक",
            "Life": "थेट",
            "Intelligence": "बुद्धिमत्ता"
        }
    };

    function restoreTemperatureDisplays(language) {
        // First restore all known weather temperature text nodes from the
        // original English DOM, then apply Indic digits for Hindi/Marathi.
        document.querySelectorAll(
            "#weather-current-temp, #weather-feels, .weather-day-card strong, .weather-chart-y-axis span"
        ).forEach(function (element) {
            const nodes = getTextNodes(element);
            nodes.forEach(function (node) {
                const original = getOriginalText(node);
                if (original && /\d+(?:\.\d+)?\s*°C/i.test(original)) {
                    let value = original.match(/\d+(?:\.\d+)?\s*°C/i)[0].replace(/\s+/g, "");
                    if (language === "hi" || language === "mr") value = convertNumbersToIndic(value);
                    node.nodeValue = value;
                }
            });
        });

        const nodes = getTextNodes(document.body);
        nodes.forEach(function (node) {
            const original = getOriginalText(node);
            if (!original || !/\d+(?:\.\d+)?\s*°C/i.test(original)) return;
            const match = original.match(/\d+(?:\.\d+)?\s*°C/i);
            if (!match) return;
            let value = match[0].replace(/\s+/g, "");
            if (language === "hi" || language === "mr") {
                value = convertNumbersToIndic(value);
            }
            // Google sometimes expands °C to words. Replace any translated
            // temperature wording with the original numeric Celsius value.
            node.nodeValue = node.nodeValue.replace(
                /(?:[-+]?\d+(?:[.,]\d+)?)\s*(?:°C|degrees?\s*Celsius|degree\s*Celsius|डिग्री\s*सेल्सियस|अंश\s*सेल्सिअस|सेल्सिअस)/gi,
                value
            );
        });
    }

    function restoreLostNumericValues(language) {
        const nodes = getTextNodes(document.body);
        nodes.forEach(function (node) {
            const original = getOriginalText(node);
            if (!original) return;

            const percentMatch = original.match(/[-+]?\d+(?:[.,]\d+)?\s*%/);
            const tempMatch = original.match(/[-+]?\d+(?:[.,]\d+)?\s*°C/i);

            if (percentMatch && !/\d/.test(node.nodeValue)) {
                let translated = translateText(original, language);
                const number = percentMatch[0].replace(/\s+/g, "");
                const localizedNumber = (language === "hi" || language === "mr")
                    ? convertNumbersToIndic(number) : number;
                translated = translated.replace(/%/, localizedNumber.includes("%") ? "%" : "%");
                // If the translation engine dropped the numeric value, rebuild
                // this node from its original source so the value is preserved.
                const phraseWithoutNumber = translated.replace(/[-+]?\d+(?:[.,]\d+)?\s*%/, "").trim();
                node.nodeValue = preserveWhitespace(node.nodeValue, phraseWithoutNumber + " " + localizedNumber);
            }

            if (tempMatch && !/\d/.test(node.nodeValue)) {
                let value = tempMatch[0].replace(/\s+/g, "");
                if (language === "hi" || language === "mr") value = convertNumbersToIndic(value);
                node.nodeValue = value;
            }
        });
    }

    function applyStrictLocalizations(language) {
        if (!strictLocalizations[language]) return;
        const replacements = strictLocalizations[language];
        const nodes = getTextNodes(document.body);
        nodes.forEach(function (node) {
            let text = node.nodeValue;
            const trimmed = normalizeText(text);
            if (!trimmed) return;
            Object.keys(replacements).sort((a,b) => b.length - a.length).forEach(function (source) {
                if (text.includes(source)) {
                    text = text.split(source).join(replacements[source]);
                }
            });
            if (text !== node.nodeValue) node.nodeValue = text;
        });
        restoreTemperatureDisplays(language);
        restoreLostNumericValues(language);

        // Hindi-only landing hero branding fix.
        // Keep English and Marathi completely untouched.
        if (language === "hi") {
            const landingBrand = document.querySelector(".landing-hero h1 span");
            if (landingBrand) {
                landingBrand.textContent = "कृषि-मित्र";
            }
        }
    }

    /* =====================================================
       TRANSLATION DICTIONARY
       ===================================================== */

    const translations = {

        /* =================================================
           ENGLISH
           ================================================= */

        en: {

            "Farm Information": "Farm Information",
            "View Farm": "View Farm",
            "Total Land": "Total Land",
            "2.5 Acres": "2.5 Acres",
            "Active Crops": "Active Crops",
            "Water Status": "Water Status",
            "Good": "Good",
            "Growth Score": "Growth Score",

            "92%": "92%",

            "PERSONALIZED GUIDANCE": "PERSONALIZED GUIDANCE",
            "Farm Tips For You": "Farm Tips For You",
            "Check Soil Moisture": "Check Soil Moisture",
            "Watch the Weather": "Watch the Weather",
            "Inspect Your Crops": "Inspect Your Crops",
            "IRRIGATION": "IRRIGATION",
            "WEATHER": "WEATHER",
            "CROP CARE": "CROP CARE",

            "TODAY'S WEATHER": "TODAY'S WEATHER",
            "Weather Forecast": "Weather Forecast",
            "View 7 Days": "View 7 Days",
            "Humidity": "Humidity",
            "Wind": "Wind",
            "Partly Cloudy": "Partly Cloudy",

            "FARM MANAGEMENT": "FARM MANAGEMENT",
            "My Farm": "My Farm",
            "Manage your farm information and crop details.":
                "Manage your farm information and crop details.",
            "Your Crops": "Your Crops",
            "View and manage your current crops.":
                "View and manage your current crops.",
            "Farm Location": "Farm Location",
            "Your farm location will appear here.":
                "Your farm location will appear here.",
            "Crop Calendar": "Crop Calendar",
            "Track important crop activities.":
                "Track important crop activities.",

            "AI POWERED": "AI POWERED",
            "AI Crop Doctor": "AI Crop Doctor",
            "Upload a crop or leaf image to detect possible diseases.":
                "Upload a crop or leaf image to detect possible diseases.",
            "Upload Crop Image": "Upload Crop Image",
            "Take a clear photo of the affected leaf or crop.":
                "Take a clear photo of the affected leaf or crop.",
            "Choose Image": "Choose Image",
            "Analyze Crop": "Analyze Crop",
            "ANALYSIS": "ANALYSIS",
            "Crop Health Result": "Crop Health Result",
            "Upload an image to see the crop health analysis.":
                "Upload an image to see the crop health analysis.",

            "AI FARMING ASSISTANT": "AI FARMING ASSISTANT",
            "Mitra AI": "Mitra AI",
            "Your intelligent farming companion.":
                "Your intelligent farming companion.",
            "AI Farming Assistant": "AI Farming Assistant",
            "Online": "Online",
            "Namaste! 🌱": "Namaste! 🌱",
            "I'm Mitra. Ask me anything about your farm, crops, weather or farming practices.":
                "I'm Mitra. Ask me anything about your farm, crops, weather or farming practices.",
            "Ask Mitra about your farm...":
                "Ask Mitra about your farm...",

            "FARM INTELLIGENCE": "FARM INTELLIGENCE",
            "Detailed 7-day weather forecast for your farm.":
                "Detailed 7-day weather forecast for your farm.",
            "Pune, Maharashtra": "Pune, Maharashtra",
            "TODAY": "TODAY",
            "Feels Like": "Feels Like",
            "7-Day Forecast": "7-Day Forecast",
            "Tomorrow": "Tomorrow",
            "Day 3": "Day 3",
            "Day 4": "Day 4",
            "Day 5": "Day 5",
            "Rain Expected": "Rain Expected",
            "Cloudy": "Cloudy",
            "Sunny": "Sunny",
            "Rainy": "Rainy",
"Light Rain": "Light Rain",
"Scattered Rain": "Scattered Rain",
"Mostly Cloudy": "Mostly Cloudy",
"Cloudy": "Cloudy",
"70% rain": "70% rain",
"60% rain": "60% rain",
"45% rain": "45% rain",
"55% rain": "55% rain",
"65% rain": "65% rain",
"40% rain": "40% rain",
"50% rain": "50% rain",
"Rainy · 70% rain": "Rainy · 70% rain",
"Light Rain · 60% rain": "Light Rain · 60% rain",
"Cloudy · 45% rain": "Cloudy · 45% rain",
"Scattered Rain · 55% rain": "Scattered Rain · 55% rain",
"Rainy · 65% rain": "Rainy · 65% rain",
"Mostly Cloudy · 40% rain": "Mostly Cloudy · 40% rain",
"Light Rain · 50% rain": "Light Rain · 50% rain",        
"Minimum Temperature": "Minimum Temperature",
"Maximum Temperature": "Maximum Temperature",
"Rain Probability": "Rain Probability",
"Weather Analysis": "Weather Analysis",
"Temperature & Rain Probability": "Temperature & Rain Probability",
"Transportation": "Transportation",
"Cold Storage": "Cold Storage",
"SMART AGRICULTURE PLATFORM": "SMART AGRICULTURE PLATFORM",
"Welcome to,": "Welcome to,",
"Smart Farming.": "Smart Farming.",
"Smarter Future.": "Smarter Future.",
"I'm a Farmer": "I'm a Farmer",
"Manage your farm smarter": "Manage your farm smarter",
"I'm a Buyer": "I'm a Buyer",
"Connect with farmers & produce": "Connect with farmers & produce",
"Your intelligent farming companion for better decisions, healthier crops and smarter markets.": "Your intelligent farming companion for better decisions, healthier crops and smarter markets.",
"Government Schemes": "Government Schemes",
"View All →": "View All →",
"Active": "Active",
"Eligibility": "Eligibility",
"Apply Now": "Apply Now",

"PM-Kisan Samman Nidhi": "PM-Kisan Samman Nidhi",
"Direct income support of ₹6,000 per year to farmer families.": "Direct income support of ₹6,000 per year to farmer families.",
"Small & Marginal Farmers (< 2 Hectares)": "Small & Marginal Farmers (< 2 Hectares)",

"Paramparagat Krishi Vikas Yojana": "Paramparagat Krishi Vikas Yojana",
"Promotes organic farming through a cluster-based approach and supports farmers in converting conventional land.": "Promotes organic farming through a cluster-based approach and supports farmers in converting conventional land.",
"All Farmers starting organic farming": "All Farmers starting organic farming",

"National Agriculture Market (e-NAM)": "National Agriculture Market (e-NAM)",
"Online trading platform for agricultural commodities offering e-bidding and direct e-payment.": "Online trading platform for agricultural commodities offering e-bidding and direct e-payment.",
"All registered farmers and FPOs": "All registered farmers and FPOs",

"Notifications": "Notifications",
"Your latest updates": "Your latest updates",
"Mark all": "Mark all",

"Weather": "Weather",
"🌧️ Heavy rainfall expected tomorrow": "🌧️ Heavy rainfall expected tomorrow",

"Crop Health": "Crop Health",
"⚠️ High disease risk expected due to weather": "⚠️ High disease risk expected due to weather",
"🐛 Pest risk increasing in your area": "🐛 Pest risk increasing in your area",
"👨‍🌾 Expert validation completed for your crop scan": "👨‍🌾 Expert validation completed for your crop scan",

"Irrigation": "Irrigation",
"💧 Irrigation recommended for your Tomato crop": "💧 Irrigation recommended for your Tomato crop",

"Market": "Market",
"📈 Tomato prices increased nearby": "📈 Tomato prices increased nearby",

"Buyer": "Buyer",
"🛒 New suitable buyer found for your produce": "🛒 New suitable buyer found for your produce",

"Scheme": "Scheme",
"📢 New government agriculture scheme available": "📢 New government agriculture scheme available"
},

        /* =================================================
           HINDI
           ================================================= */

        hi: {

    /* ---------- BRAND / SIDEBAR ---------- */

    "Krishi-Mitra": "कृषि-मित्र",

    "Your Smart Farming Companion":
    "आपका स्मार्ट कृषि साथी",
    "Dashboard": "डैशबोर्ड",
    "Weather": "मौसम",
    "Market Prices": "बाज़ार भाव",
    "Irrigation": "सिंचाई",
    "Farm Insights": "कृषि जानकारी",
    "Government Schemes": "सरकारी योजनाएँ",
    "Government": "सरकारी",
    "Schemes": "योजनाएँ",
    "Notifications": "सूचनाएँ",
    "Notification": "सूचना",
    "Help & Support": "सहायता और समर्थन",

    "My Farm": "मेरा खेत",
    "New": "नया",
    "AI Crop Doctor": "एआई फसल डॉक्टर",
    "AI Farm Doctor": "एआई फसल डॉक्टर",
    "Mitra AI": "मित्र एआई",

    /* ---------- DASHBOARD / HERO ---------- */

    "Farm Information": "कृषि जानकारी",
    "Farm Overview": "कृषि अवलोकन",
    "FARM OVERVIEW": "कृषि अवलोकन",
    "View Farm": "खेत देखें",
    "See Your Farm": "अपना खेत देखें",
    "Your Farm": "आपका खेत",
    "YOUR FARM": "आपका खेत",
    "TODAY": "आज",
    "Today": "आज",

    "Here's what's happening in your farm today":
        "आज आपके खेत में क्या हो रहा है, यहाँ देखें",

    "Good Morning, Farmer":
        "सुप्रभात, किसान",

    "Good morning, Farmer":
        "सुप्रभात, किसान",

    "Good Morning":
        "सुप्रभात",

    "Farmer":
        "किसान",


    /* ---------- FARM OVERVIEW CARDS ---------- */

    "Farm Information": "कृषि जानकारी",
    "FARM INFORMATION": "कृषि जानकारी",
    "Farm Overview": "कृषि अवलोकन",
    "Total Land": "कुल भूमि",
    "2.5 Acres": "2.5 एकड़",
    "Active Crops": "वर्तमान फसलें",
    "Water Status": "पानी की स्थिति",
    "Good": "अच्छी",
    "Growth Score": "वृद्धि स्तर",
    "92%": "92%",
    "Tomato": "टमाटर",

    /* ---------- MITRA ASSISTANT CARD ---------- */

    "Mitra AI Assistant":
        "मित्र एआई सहायक",
    
    "MITRA AI": "मित्र एआई",

    "Assistant":
        "सहायक",

    "Hello, I am Mitra AI. How can I help your farm today?":
        "नमस्ते, मैं मित्र एआई हूँ। आज मैं आपके खेत की कैसे मदद कर सकता हूँ?",

    "Hello! I'm Mitra AI. How can I help your farm today?":
        "नमस्ते! मैं मित्र एआई हूँ। आज मैं आपके खेत की कैसे मदद कर सकता हूँ?",

    "Chat with Mitra":
        "मित्र से बात करें",

    /* ---------- QUICK FARM CARDS ---------- */

    "Crop Health":
        "फसल स्वास्थ्य",

    "Excellent":
        "उत्कृष्ट",

    "Your crops are healthy":
        "आपकी फसलें स्वस्थ हैं",

    "Your crops are healthy.":
        "आपकी फसलें स्वस्थ हैं।",

    "Weather":
        "मौसम",

    "Rain expected tomorrow":
        "कल बारिश की संभावना है",

    "Rain Expected Tomorrow":
        "कल बारिश की संभावना है",

    "Minimum":
        "न्यूनतम",

    "Maximum":
        "अधिकतम",

    "Min":
        "न्यूनतम",

    "Max":
        "अधिकतम",

    "Temperature":
            "तापमान",

    "Market Price":
        "बाज़ार भाव",

    "Rain Probability": 
        "वर्षा की संभावना",

    "₹2950 / Quintal":
        "₹2950 प्रति क्विंटल",

    "₹2950 /Quintal":
        "₹2950 प्रति क्विंटल",

    "per quintal":
        "प्रति क्विंटल",

    "Increased 8.4% from yesterday":
        "कल की तुलना में 8.4% की वृद्धि",

    "Increased":
        "वृद्धि",

    "from yesterday":
        "कल की तुलना में",

    "Irrigation Advice":
        "सिंचाई सलाह",

    "Irrigate in 2 Days":
        "दो दिनों में सिंचाई करें",

    "Next recommended irrigation":
        "अगली अनुशंसित सिंचाई",

    /* ---------- FARM TIPS ---------- */

    "PERSONALIZED GUIDANCE":
        "व्यक्तिगत मार्गदर्शन",

    "Farm Tips For You":
        "आपके लिए खेती के सुझाव",
    
    "Simple recommendations to help you make better farming decisions." :
            "बेहतर खेती संबंधी निर्णय लेने में आपकी मदद करने के लिए सरल सुझाव।",

    "Check Soil Moisture":
        "मिट्टी की नमी जाँचें",

    "Check soil moisture before the next irrigation cycle":
        "अगली सिंचाई से पहले मिट्टी की नमी जाँचें",

    "Check soil moisture before the next irrigation cycle.":
        "अगली सिंचाई से पहले मिट्टी की नमी जाँचें।",

    "Watch the Weather":
        "मौसम पर नज़र रखें",

    "Rain may affect irrigation":
        "बारिश सिंचाई को प्रभावित कर सकती है",

    "Rain may affect irrigation.":
        "बारिश सिंचाई को प्रभावित कर सकती है।",

    "Weather changes may affect irrigation":
        "मौसम में बदलाव सिंचाई को प्रभावित कर सकता है",

    "Weather changes may affect irrigation.":
        "मौसम में बदलाव सिंचाई को प्रभावित कर सकता है।",

    "and spraying schedules":
        "और छिड़काव की समय-सारणी को",

    "and spraying schedules.":
        "और छिड़काव की समय-सारणी को।",

    "Inspect Your Crops":
        "अपनी फसलों की जाँच करें",

    "Regularly check leaves for early signs of pests or disease.":
        "बीमारियों के शुरुआती लक्षणों के लिए पत्तियों की नियमित जाँच करें",

    "Regular checking of leaves for early signs of diseases.":
        "बीमारियों के शुरुआती लक्षणों के लिए पत्तियों की नियमित जाँच करें।",

    "Regularly check leaves for early signs of pests or diseases":
        "कीटों या बीमारियों के शुरुआती लक्षणों के लिए पत्तियों की नियमित जाँच करें",

    "Regularly check leaves for early signs of pests or diseases.":
        "कीटों या बीमारियों के शुरुआती लक्षणों के लिए पत्तियों की नियमित जाँच करें।",

    "IRRIGATION":
        "सिंचाई",

    "WEATHER":
        "मौसम",

    "CROP CARE":
        "फसल देखभाल",

    /* ---------- WEATHER MINI PANEL ---------- */

    "TODAY'S WEATHER":
        "आज का मौसम",

    "Weather Forecast":
        "मौसम का पूर्वानुमान",

    "View 7 Days":
        "७ दिन देखें",

    "Humidity":
        "नमी",

    "Wind":
        "हवा",

    "Partly Cloudy":
        "आंशिक रूप से बादल",

    /* ---------- MY FARM ---------- */

    "FARM MANAGEMENT":
        "कृषि प्रबंधन",

    "Manage your farm information and crop details.":
        "अपने खेत की जानकारी और फसल का विवरण प्रबंधित करें।",

    "Your Crops":
        "आपकी फसलें",

    "View and manage your current crops.":
        "अपनी वर्तमान फसलों को देखें और प्रबंधित करें।",

    "Farm Location":
        "खेत का स्थान",

    "Your farm location will appear here.":
        "आपके खेत का स्थान यहाँ दिखाई देगा।",

    "Crop Calendar":
        "फसल गतिविधि कैलेंडर",

    "Track important crop activities.":
        "फसल से जुड़ी महत्वपूर्ण गतिविधियों पर नज़र रखें।",

    /* ---------- CROP DOCTOR ---------- */

    "AI POWERED":
        "कृत्रिम बुद्धिमत्ता संचालित",

    "Upload a crop or leaf image to detect possible diseases.":
        "संभावित बीमारियों का पता लगाने के लिए फसल या पत्ते की तस्वीर अपलोड करें।",

    "Upload Crop Image":
        "फसल की तस्वीर अपलोड करें",

    "Take a clear photo of the affected leaf or crop.":
        "प्रभावित पत्ते या फसल की स्पष्ट तस्वीर लें।",

    "Choose Image":
        "तस्वीर चुनें",

    "Analyze Crop":
        "फसल की जाँच करें",

    "ANALYSIS":
        "जाँच परिणाम",

    "Crop Health Result":
        "फसल के स्वास्थ्य का परिणाम",

    "Upload an image to see the crop health analysis.":
        "फसल के स्वास्थ्य की जाँच देखने के लिए तस्वीर अपलोड करें।",

    /* ---------- MITRA AI ---------- */

    "AI FARMING ASSISTANT":
        "कृत्रिम बुद्धिमत्ता कृषि सहायक",

    "FARM INTELLIGENCE":
        "कृषि बुद्धिमत्ता",

    "MAIN": "मुख्य",
    
    "RESOURCES": "संसाधन",

    "Grow Smarter.": "समझदारी से खेती करें।",
    "Farm Better.": "बेहतर खेती करें।",

    "Your intelligent farming companion.":
        "आपका बुद्धिमान कृषि साथी।",

    "AI Farming Assistant":
        "कृषि कृत्रिम बुद्धिमत्ता सहायक",

    "Online":
        "सक्रिय",

    "Namaste! 🌱":
        "नमस्ते! 🌱",

    "I'm Mitra. Ask me anything about your farm, crops, weather or farming practices.":
        "मैं मित्र हूँ। अपने खेत, फसलों, मौसम या खेती से जुड़ा कोई भी सवाल पूछें।",

    "Ask Mitra about your farm...":
        "अपने खेत के बारे में मित्र से पूछें...",

    /* ---------- WEATHER MODULE ---------- */

    "Detailed 7-day weather forecast for your farm.":
        "आपके खेत के लिए ७ दिनों का विस्तृत मौसम पूर्वानुमान।",

    "Pune, Maharashtra":
        "पुणे, महाराष्ट्र",

    "TODAY":
        "आज",

    "Feels Like":
        "महसूस होने वाला तापमान",

    "7-Day Forecast":
        "७ दिनों का मौसम पूर्वानुमान",

    "Next 7 Days": "अगले ७ दिन",

    "Weather Analysis": "मौसम विश्लेषण",
    "Temperature & Rain Probability": "तापमान और वर्षा की संभावना",

    "Tomorrow":
        "कल",

    "Day 3":
        "तीसरा दिन",

    "Day 4":
        "चौथा दिन",

    "Day 5":
        "पाँचवाँ दिन",

    "Rain Expected":
        "बारिश की संभावना",

    "Cloudy":
        "बादल छाए रहेंगे",

    "Sunny":
        "धूप रहेगी",

    "Rainy · 70% rain": "बारिश · ७०% बारिश",
"Light Rain · 60% rain": "हल्की बारिश · ६०% बारिश",
"Cloudy · 45% rain": "बादल छाए रहेंगे · ४५% बारिश",
"Scattered Rain · 55% rain": "रुक-रुक कर बारिश · ५५% बारिश",
"Rainy · 65% rain": "बारिश · ६५% बारिश",
"Mostly Cloudy · 40% rain": "ज्यादातर बादल छाए रहेंगे · ४०% बारिश",
"Light Rain · 50% rain": "हल्की बारिश · ५०% बारिश",

"17 Aug · Mon": "१७ अगस्त · सोमवार",
"18 Aug · Tue": "१८ अगस्त · मंगलवार",
"19 Aug · Wed": "१९ अगस्त · बुधवार",
"20 Aug · Thu": "२० अगस्त · गुरुवार",
"21 Aug · Fri": "२१ अगस्त · शुक्रवार",
"22 Aug · Sat": "२२ अगस्त · शनिवार",
"23 Aug · Sun": "२३ अगस्त · रविवार",

"Transportation": "परिवहन",
"Cold Storage" : "शीत गृह",
"SMART AGRICULTURE PLATFORM": "आधुनिक कृषि मंच",
"Welcome to,": "स्वागत है,",
"Smart Farming.": "बेहतर खेती।",
"Smarter Future.": "बेहतर भविष्य।",
"I'm a Farmer": "मैं किसान हूँ",
"Manage your farm smarter": "अपने खेत का बेहतर प्रबंधन करें",
"I'm a Buyer": "मैं खरीदार हूँ",
"Connect with farmers & produce": "किसानों और कृषि उपज से जुड़ें",
"Your intelligent farming companion for better decisions, healthier crops and smarter markets.": "बेहतर फैसले लेने, स्वस्थ फसल उगाने और अच्छे बाजार भाव पाने में आपका खेती का साथी।",
"Government Schemes": "सरकारी योजनाएँ",
"View All →": "सभी देखें →",
"Active": "सक्रिय",
"Eligibility": "पात्रता",
"Apply Now": "अभी आवेदन करें",

"PM-Kisan Samman Nidhi": "पीएम-किसान सम्मान निधि",
"Direct income support of ₹6,000 per year to farmer families.": "किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।",
"Small & Marginal Farmers (< 2 Hectares)": "लघु एवं सीमांत किसान (< 2 हेक्टेयर)",

"Paramparagat Krishi Vikas Yojana": "परंपरागत कृषि विकास योजना",
"Promotes organic farming through a cluster-based approach and supports farmers in converting conventional land.": "क्लस्टर आधारित दृष्टिकोण के माध्यम से जैविक खेती को बढ़ावा देती है और किसानों को पारंपरिक भूमि को जैविक खेती में बदलने में सहायता करती है।",
"All Farmers starting organic farming": "जैविक खेती शुरू करने वाले सभी किसान",

"National Agriculture Market (e-NAM)": "राष्ट्रीय कृषि बाजार (e-NAM)",
"Online trading platform for agricultural commodities offering e-bidding and direct e-payment.": "कृषि जिंसों के लिए ऑनलाइन व्यापार मंच, जो ई-बोली और सीधे ई-भुगतान की सुविधा प्रदान करता है।",
"All registered farmers and FPOs": "सभी पंजीकृत किसान और FPOs",

"Notifications": "सूचनाएँ",
"Your latest updates": "आपके नवीनतम अपडेट",
"Mark all": "सभी को पढ़ा हुआ चिन्हित करें",

"Weather": "मौसम",
"🌧️ Heavy rainfall expected tomorrow": "🌧️ कल भारी बारिश होने की संभावना है",

"Crop Health": "फसल स्वास्थ्य",
"⚠️ High disease risk expected due to weather": "⚠️ मौसम के कारण फसल में रोग का अधिक जोखिम है",
"🐛 Pest risk increasing in your area": "🐛 आपके क्षेत्र में कीट का जोखिम बढ़ रहा है",
"👨‍🌾 Expert validation completed for your crop scan": "👨‍🌾 आपके फसल स्कैन का विशेषज्ञ सत्यापन पूरा हो गया है",

"Irrigation": "सिंचाई",
"💧 Irrigation recommended for your Tomato crop": "💧 आपकी टमाटर की फसल में सिंचाई की सलाह दी जाती है",

"Market": "बाज़ार",
"📈 Tomato prices increased nearby": "📈 आस-पास के क्षेत्र में टमाटर के दाम बढ़ गए हैं",

"Buyer": "खरीदार",
"🛒 New suitable buyer found for your produce": "🛒 आपकी उपज के लिए नया उपयुक्त खरीदार मिला है",

"Scheme": "योजना",
"📢 New government agriculture scheme available": "📢 नई सरकारी कृषि योजना उपलब्ध है"
},

        /* =================================================
           MARATHI
           ================================================= */

        mr: {

    /* ---------- BRAND / SIDEBAR ---------- */

    "Krishi-Mitra":
        "कृषी-मित्र",

    "Your Smart Farming Companion":
    "तुमचा स्मार्ट शेती साथीदार",
    "Dashboard":
        "डॅशबोर्ड",

    "Weather":
        "हवामान",

    "Market Prices":
        "बाजारभाव",

    "Irrigation":
        "सिंचन",

    "Farm Insights":
        "शेतीविषयक माहिती",

    "Government Schemes":
        "शासकीय योजना",

    "Government":
           "शासकीय",

    "Schemes":
        "योजना",

    "Notifications":
        "सूचना",

    "Notification":
        "सूचना",

    "Help & Support":
        "मदत आणि सहाय्य",

    "My Farm":
        "माझे शेत",

    "New": "नवीन",

    "AI Crop Doctor":
        "एआय पीक डॉक्टर",

    "AI Farm Doctor":
        "एआय पीक डॉक्टर",

    "Mitra AI":
        "मित्र एआय",


    /* ---------- DASHBOARD / HERO ---------- */

    "Farm Information":
        "शेतीविषयक माहिती",

    "FARM INFORMATION":
        "शेतीविषयक माहिती",

    "Farm Overview":
        "शेतीचा आढावा",

    "FARM OVERVIEW":
        "शेतीचा आढावा",

    "View Farm":
        "शेत पहा",

    "See Your Farm":
        "तुमचे शेत पहा",

    "Your Farm":
        "तुमचे शेत",

    "YOUR FARM":
        "तुमचे शेत",

    "TODAY":
        "आज",

    "Today":
        "आज",

    "Here's what's happening in your farm today":
        "आज तुमच्या शेतात काय घडत आहे",

    "Good Morning Farmer":
        "शुभ सकाळ शेतकरी",

    "Good morning, Farmer":
        "शुभ सकाळ शेतकरी",

    "Good Morning":
        "शुभ सकाळ",

    "Farmer":
        "शेतकरी",

    "Mitra AI":
        "मित्र एआय",



    /* ---------- FARM OVERVIEW CARDS ---------- */
        
    
    "Total Land":
        "एकूण जमीन",

    "2.5 Acres":
        "२.५ एकर",

    "Active Crops":
        "सध्या असलेली पिके",

    "Water Status":
        "पाण्याची स्थिती",

    "Good":
        "चांगली",

    "Growth Score":
        "वाढीचा स्तर",

    "92%":
        "९२%",

    "Tomato":
        "टोमॅटो",



    /* ---------- MITRA ASSISTANT CARD ---------- */

    "Mitra AI Assistant":
        "मित्र एआय सहाय्यक",
    
    "MITRA AI":
        "मित्र एआय",

    "Assistant":
        "सहाय्यक",

    "AI FARMING ASSISTANT":
        "कृत्रिम बुद्धिमत्ता शेती सहाय्यक",

    "FARM INTELLIGENCE":
        "शेतीविषयक माहिती",

    "MAIN": "मुख्य",

    "RESOURCES": "संसाधने",

    "Grow Smarter.": "समजूतदारपणे शेती करा.",
    "Farm Better.": "अधिक चांगली शेती करा.",

    "Your intelligent farming companion.":
        "तुमचा बुद्धिमान शेती साथीदार.",

    "AI Farming Assistant":
        "कृत्रिम बुद्धिमत्ता शेती सहाय्यक",

    "Online":
        "सक्रिय",

    "Namaste! 🌱":
        "नमस्कार! 🌱",

    "Hello, I am Mitra AI. How can I help your farm today?":
        "नमस्कार, मी मित्र एआय आहे. आज मी तुमच्या शेतासाठी कशी मदत करू शकतो?",

    "Hello! I'm Mitra AI. How can I help your farm today?":
        "नमस्कार! मी मित्र एआय आहे. आज मी तुमच्या शेतासाठी कशी मदत करू शकतो?",

    "I'm Mitra. Ask me anything about your farm, crops, weather or farming practices.":
        "मी मित्र आहे. तुमच्या शेताबद्दल, पिकांबद्दल, हवामानाबद्दल किंवा शेतीविषयी काहीही विचारा.",

    "Ask Mitra about your farm...":
        "तुमच्या शेताबद्दल मित्राला विचारा...",

    "Chat with Mitra":
        "मित्राशी संवाद साधा",


    /* ---------- QUICK FARM CARDS ---------- */

    "Crop Health":
        "पिकांचे आरोग्य",

    "Excellent":
        "उत्कृष्ट",

    "Your crops are healthy":
        "तुमची पिके निरोगी आहेत",

    "Your crops are healthy.":
        "तुमची पिके निरोगी आहेत.",

    "Rain Expected Tomorrow":
        "उद्या पावसाची शक्यता",

    "Rain expected tomorrow":
        "उद्या पावसाची शक्यता",

    "Minimum":
        "किमान",

    "Maximum":
        "कमाल",

    "Temperature":
            "तापमान",

    "Rain Probability": 
        "पावसाची शक्यता",

    "Next 7 Days": 
        "पुढील ७ दिवस",

    "Weather Analysis": "हवामान विश्लेषण",
    "Temperature & Rain Probability": "तापमान आणि पावसाची शक्यता",

    "Min":
        "किमान",

    "Max":
        "कमाल",

    "Market Price":
        "बाजारभाव",

    "₹2950  /Quintal":
        "₹२९५० प्रति क्विंटल",

    "₹2950 /Quintal":
        "₹२९५० प्रति क्विंटल",

    "per quintal":
        "प्रति क्विंटल",

    "Increased":
        "वाढले",

    "from yesterday":
        "कालच्या तुलनेत",

    "Increased 8.4% from yesterday":
        "कालच्या तुलनेत ८.४% वाढ",

    "Irrigation Advice":
        "सिंचन सल्ला",

    "Irrigate in 2 Days":
        "दोन दिवसांत सिंचन",

    "Next recommended irrigation":
        "पुढील शिफारस केलेले सिंचन",


    /* ---------- FARM TIPS ---------- */

    "PERSONALIZED GUIDANCE":
        "वैयक्तिक मार्गदर्शन",

    "Farm Tips For You":
        "तुमच्यासाठी शेतीविषयक सूचना",

    "Simple recommendations to help you make better farming decisions.":
        "तुम्हाला शेतीविषयक चांगले निर्णय घेण्यास मदत करण्यासाठी सोप्या सूचना.",

    "Check Soil Moisture":
        "मातीतील ओलावा तपासा",

    "Check soil moisture before the next irrigation cycle.":
        "पुढील सिंचनापूर्वी मातीतील ओलावा तपासा",

    "Check soil moisture before the next irrigation.":
        "पुढील सिंचनापूर्वी मातीतील ओलावा तपासा.",

    "Watch the Weather":
        "हवामानावर लक्ष ठेवा",

    "Rain may affect irrigation":
        "पाऊस सिंचनावर परिणाम करू शकतो",

    "Rain may affect irrigation.":
        "पाऊस सिंचनावर परिणाम करू शकतो.",

    "Weather changes may affect irrigation":
        "हवामानातील बदल सिंचनावर परिणाम करू शकतात",

    "Weather changes may affect irrigation.":
        "हवामानातील बदल सिंचनावर परिणाम करू शकतात.",

    "and spraying schedules":
        "आणि फवारणीच्या वेळापत्रकावर",

    "and spraying schedules.":
        "आणि फवारणीच्या वेळापत्रकावर.",

    "Inspect Your Crops":
        "तुमच्या पिकांची तपासणी करा",

    "Regularly check leaves for early signs of pests or disease.":
        "रोगांची सुरुवातीची लक्षणे ओळखण्यासाठी पानांची नियमित तपासणी करा",

    "Regularly check leaves for early signs of pests or disease.":
        "रोगांची सुरुवातीची लक्षणे ओळखण्यासाठी पानांची नियमित तपासणी करा.",

    "Regularly check leaves for early signs of pests or disease.":
        "कीड किंवा रोगांची सुरुवातीची लक्षणे ओळखण्यासाठी पानांची नियमित तपासणी करा",

    "Regularly check leaves for early signs of pests or disease.":
        "कीड किंवा रोगांची सुरुवातीची लक्षणे ओळखण्यासाठी पानांची नियमित तपासणी करा.",

    "IRRIGATION":
        "सिंचन",

    "WEATHER":
        "हवामान",

    "CROP CARE":
        "पीक व्यवस्थापन",


    /* ---------- WEATHER MINI PANEL ---------- */

    "TODAY'S WEATHER":
        "आजचे हवामान",

    "Weather Forecast":
        "हवामानाचा अंदाज",

    "View 7 Days":
        "७ दिवस पहा",

    "Humidity":
        "आर्द्रता",

    "Wind":
        "वारा",

    "Partly Cloudy":
        "अंशतः ढगाळ",


    /* ---------- MY FARM ---------- */

    "FARM MANAGEMENT":
        "शेती व्यवस्थापन",

    "Manage your farm information and crop details.":
        "तुमच्या शेताची माहिती आणि पिकांचा तपशील व्यवस्थापित करा.",

    "Your Crops":
        "तुमची पिके",

    "View and manage your current crops.":
        "तुमची सध्याची पिके पहा आणि व्यवस्थापित करा.",

    "Farm Location":
        "शेताचे ठिकाण",

    "Your farm location will appear here.":
        "तुमच्या शेताचे ठिकाण येथे दिसेल.",

    "Crop Calendar":
        "पीक दिनदर्शिका",

    "Track important crop activities.":
        "पिकांशी संबंधित महत्त्वाच्या कामांचा मागोवा घ्या.",


    /* ---------- CROP DOCTOR ---------- */

    "AI POWERED":
        "कृत्रिम बुद्धिमत्ता आधारित",

    "Upload a crop or leaf image to detect possible diseases.":
        "संभाव्य रोग शोधण्यासाठी पिकाचा किंवा पानाचा फोटो अपलोड करा.",

    "Upload Crop Image":
        "पिकाचा फोटो अपलोड करा",

    "Take a clear photo of the affected leaf or crop.":
        "प्रभावित पानाचा किंवा पिकाचा स्पष्ट फोटो घ्या.",

    "Choose Image":
        "फोटो निवडा",

    "Analyze Crop":
        "पिकाची तपासणी करा",

    "ANALYSIS":
        "तपासणी",

    "Crop Health Result":
        "पिकाच्या आरोग्याचा अहवाल",

    "Upload an image to see the crop health analysis.":
        "पिकाच्या आरोग्याची तपासणी पाहण्यासाठी फोटो अपलोड करा.",


    /* ---------- WEATHER MODULE ---------- */

    "Detailed 7-day weather forecast for your farm.":
        "तुमच्या शेतासाठी ७ दिवसांचा सविस्तर हवामान अंदाज.",

    "Pune, Maharashtra":
        "पुणे, महाराष्ट्र",

    "TODAY":
        "आज",

    "Feels Like":
        "जाणवणारे तापमान",

    "7-Day Forecast":
        "७ दिवसांचा हवामान अंदाज",

    "Tomorrow":
        "उद्या",

    "Day 3":
        "तिसरा दिवस",

    "Day 4":
        "चौथा दिवस",

    "Day 5":
        "पाचवा दिवस",

    "Rain Expected":
        "पावसाची शक्यता",

    "Cloudy":
        "ढगाळ हवामान",

    "Sunny":
        "ऊन राहील",

    "Rainy · 70% rain": "पावसाळी हवामान · ७०% पावसाची शक्यता",
"Light Rain · 60% rain": "हलका पाऊस · ६०% पावसाची शक्यता",
"Cloudy · 45% rain": "ढगाळ हवामान · ४५% पावसाची शक्यता",
"Scattered Rain · 55% rain": "अधूनमधून पाऊस · ५५% पावसाची शक्यता",
"Rainy · 65% rain": "पावसाळी हवामान · ६५% पावसाची शक्यता",
"Mostly Cloudy · 40% rain": "बहुतेक वेळा ढगाळ · ४०% पावसाची शक्यता",
"Light Rain · 50% rain": "हलका पाऊस · ५०% पावसाची शक्यता",

"17 Aug · Mon": "१७ ऑगस्ट · सोमवार",
"18 Aug · Tue": "१८ ऑगस्ट · मंगळवार",
"19 Aug · Wed": "१९ ऑगस्ट · बुधवार",
"20 Aug · Thu": "२० ऑगस्ट · गुरुवार",
"21 Aug · Fri": "२१ ऑगस्ट · शुक्रवार",
"22 Aug · Sat": "२२ ऑगस्ट · शनिवार",
"23 Aug · Sun": "२३ ऑगस्ट · रविवार",

"Transportation": "वाहतूक",
"Cold Storage" : "शीतगृह",
"SMART AGRICULTURE PLATFORM": "आधुनिक शेती मंच",
"Welcome to,": "स्वागत आहे,",
"Smart Farming.": "आधुनिक शेती.",
"Smarter Future.": "उज्ज्वल भविष्य.",
"I'm a Farmer": "मी शेतकरी आहे",
"Manage your farm smarter": "तुमच्या शेतीचे अधिक चांगल्या प्रकारे व्यवस्थापन करा",
"I'm a Buyer": "मी खरेदीदार आहे",
"Connect with farmers & produce": "शेतकरी आणि कृषी उत्पादनांशी जोडा",
"Your intelligent farming companion for better decisions, healthier crops and smarter markets.": "चांगले निर्णय घेण्यासाठी, निरोगी पिके घेण्यासाठी आणि चांगला बाजारभाव मिळवण्यासाठी तुमचा शेतीचा साथीदार.",
"Government Schemes": "शासकीय योजना",
"View All →": "सर्व पहा →",
"Active": "सक्रिय",
"Eligibility": "पात्रता",
"Apply Now": "आता अर्ज करा",

"PM-Kisan Samman Nidhi": "पीएम-किसान सन्मान निधी",
"Direct income support of ₹6,000 per year to farmer families.": "शेतकरी कुटुंबांना दरवर्षी ₹6,000 ची थेट आर्थिक मदत.",
"Small & Marginal Farmers (< 2 Hectares)": "अल्प व अत्यल्प भूधारक शेतकरी (< 2 हेक्टर)",

"Paramparagat Krishi Vikas Yojana": "परंपरागत कृषी विकास योजना",
"Promotes organic farming through a cluster-based approach and supports farmers in converting conventional land.": "गटाधारित पद्धतीने सेंद्रिय शेतीला प्रोत्साहन देते आणि पारंपरिक जमीन सेंद्रिय शेतीमध्ये रूपांतरित करण्यासाठी शेतकऱ्यांना मदत करते.",
"All Farmers starting organic farming": "सेंद्रिय शेती सुरू करणारे सर्व शेतकरी",

"National Agriculture Market (e-NAM)": "राष्ट्रीय कृषी बाजार (e-NAM)",
"Online trading platform for agricultural commodities offering e-bidding and direct e-payment.": "कृषी मालासाठी ऑनलाइन व्यापार मंच, ज्यामध्ये ई-बोली आणि थेट ई-भरणाची सुविधा उपलब्ध आहे.",
"All registered farmers and FPOs": "सर्व नोंदणीकृत शेतकरी आणि FPOs",

"Notifications": "सूचना",
"Your latest updates": "तुमचे नवीनतम अपडेट",
"Mark all": "सर्व वाचलेले म्हणून चिन्हांकित करा",

"Weather": "हवामान",
"🌧️ Heavy rainfall expected tomorrow": "🌧️ उद्या मुसळधार पावसाची शक्यता आहे",

"Crop Health": "पिकाचे आरोग्य",
"⚠️ High disease risk expected due to weather": "⚠️ हवामानामुळे पिकांमध्ये रोगाचा जास्त धोका आहे",
"🐛 Pest risk increasing in your area": "🐛 तुमच्या परिसरात किडींचा धोका वाढत आहे",
"👨‍🌾 Expert validation completed for your crop scan": "👨‍🌾 तुमच्या पीक स्कॅनची तज्ज्ञांकडून पडताळणी पूर्ण झाली आहे",

"Irrigation": "सिंचन",
"💧 Irrigation recommended for your Tomato crop": "💧 तुमच्या टोमॅटो पिकासाठी सिंचन करण्याचा सल्ला दिला जातो",

"Market": "बाजार",
"📈 Tomato prices increased nearby": "📈 जवळच्या बाजारात टोमॅटोचे दर वाढले आहेत",

"Buyer": "खरेदीदार",
"🛒 New suitable buyer found for your produce": "🛒 तुमच्या शेतमालासाठी नवीन योग्य खरेदीदार मिळाला आहे",

"Scheme": "योजना",
"📢 New government agriculture scheme available": "📢 नवीन सरकारी कृषी योजना उपलब्ध आहे",


    /* ---------- MARKET / CROP DATA ---------- */

    "per quintal":
        "प्रति क्विंटल",

    "2950":
        "२९५०",

    "8.4%":
        "८.४%"
},
    };
    /* =====================================================
       ORIGINAL TEXT STORAGE
       ===================================================== */

    const originalTextMap = new WeakMap();
    const originalAttributeMap = new WeakMap();

    let currentLanguage = "en";
    let observer = null;
    let observerTimer = null;
    let isTranslating = false;


    /* =====================================================
       NORMALIZE
       ===================================================== */

    function normalizeText(text) {

        return String(text ?? "")
            .replace(/\u00A0/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }


    /* =====================================================
       ESCAPE REGEX
       ===================================================== */

    function escapeRegExp(string) {

        return String(string).replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
    }


    /* =====================================================
       PRESERVE WHITESPACE
       ===================================================== */

    function preserveWhitespace(original, translated) {

        const value = String(original);

        const leading =
            value.match(/^\s*/)?.[0] || "";

        const trailing =
            value.match(/\s*$/)?.[0] || "";

        return leading + translated + trailing;
    }


    /* =====================================================
       GET DICTIONARY
       ===================================================== */

    function getDictionary(language) {

        return translations[language] ||
               translations.en;
    }


    /* =====================================================
       GET ORIGINAL TEXT
       ===================================================== */

    function getOriginalText(node) {

        if (originalTextMap.has(node)) {

            return originalTextMap.get(node);
        }

        const original = node.nodeValue;

        originalTextMap.set(node, original);

        return original;
    }

/* =====================================================
       TRANSLATE NOS 
       ===================================================== */

    const indicDigits = {
    "0": "०",
    "1": "१",
    "2": "२",
    "3": "३",
    "4": "४",
    "5": "५",
    "6": "६",
    "7": "७",
    "8": "८",
    "9": "९"
};

function convertNumbersToIndic(text) {
    return text.replace(/[0-9]/g, function (digit) {
        return indicDigits[digit];
    });
}

/* =====================================================
   TRANSLATE TEXT
   ===================================================== */

function translateText(originalText, language) {

    if (!originalText) {
        return originalText;
    }

    const normalized =
        normalizeText(originalText);

    if (!normalized) {
        return originalText;
    }

    const dictionary =
        getDictionary(language);


    function applyNumberConversion(text) {

        if (
            language === "hi" ||
            language === "mr"
        ) {
            return convertNumbersToIndic(text);
        }

        return text;
    }


    if (
        Object.prototype.hasOwnProperty.call(
            dictionary,
            normalized
        )
    ) {

        return preserveWhitespace(
            originalText,
            applyNumberConversion(
                dictionary[normalized]
            )
        );
    }


    let result = normalized;

    const keys =
        Object.keys(dictionary)
            .filter(function (key) {

                return (
                    key.length > 2 &&
                    result.includes(key)
                );
            })
            .sort(function (a, b) {

                return b.length - a.length;
            });


    keys.forEach(function (key) {

        const translated =
            dictionary[key];

        if (
            typeof translated !== "string" ||
            !translated
        ) {
            return;
        }

        result =
            result.replace(
                new RegExp(
                    escapeRegExp(key),
                    "g"
                ),
                translated
            );
    });


    if (result !== normalized) {

        return preserveWhitespace(
            originalText,
            applyNumberConversion(result)
        );
    }


    return applyNumberConversion(originalText);
}


    /* =====================================================
       SHOULD TRANSLATE NODE
       ===================================================== */

    function shouldTranslateNode(node) {

        if (!node) {
            return false;
        }

        const parent =
            node.parentElement;

        if (!parent) {
            return false;
        }

        const tag =
            parent.tagName;

        const ignoredTags = [
            "SCRIPT",
            "STYLE",
            "NOSCRIPT",
            "TEXTAREA",
            "CODE"
        ];

        if (ignoredTags.includes(tag)) {
            return false;
        }

        if (
            parent.classList.contains("fa-solid") ||
            parent.classList.contains("fa-regular") ||
            parent.classList.contains("fa-brands")
        ) {
            return false;
        }

        if (
            parent.hasAttribute(
                "data-translation-ignore"
            )
        ) {
            return false;
        }

        return true;
    }


    /* =====================================================
       GET TEXT NODES
       ===================================================== */

    function getTextNodes(root) {

        const nodes = [];

        if (!root) {
            return nodes;
        }

        const walker =
            document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function (node) {

                        return shouldTranslateNode(node)
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT;
                    }
                }
            );

        let node;

        while (
            (node = walker.nextNode())
        ) {

            nodes.push(node);
        }

        return nodes;
    }


    /* =====================================================
       TRANSLATE TEXT CONTENT
       ===================================================== */

    function translateTextContent(language, root) {

        const container =
            root || document.body;

        const nodes =
            getTextNodes(container);

        nodes.forEach(function (node) {

            const original =
                getOriginalText(node);

            if (!normalizeText(original)) {
                return;
            }

            node.nodeValue =
                translateText(
                    original,
                    language
                );
        });
    }


    /* =====================================================
       PLACEHOLDERS
       ===================================================== */

    function translatePlaceholders(language, root) {

        const container =
            root || document;

        const elements =
            container.querySelectorAll(
                "[placeholder]"
            );

        elements.forEach(function (element) {

            let original =
                element.getAttribute(
                    "data-original-placeholder"
                );

            if (original === null) {

                original =
                    element.getAttribute(
                        "placeholder"
                    );

                element.setAttribute(
                    "data-original-placeholder",
                    original
                );
            }

            const translated =
                translateText(
                    original,
                    language
                );

            element.setAttribute(
                "placeholder",
                translated
            );
        });
    }


    /* =====================================================
       ALT + TITLE
       ===================================================== */

    function translateAttributes(language, root) {

        const container =
            root || document;

        const elements =
            container.querySelectorAll(
                "[alt], [title]"
            );

        elements.forEach(function (element) {

            ["alt", "title"].forEach(
                function (attribute) {

                    if (
                        !element.hasAttribute(attribute)
                    ) {
                        return;
                    }

                    let stored =
                        originalAttributeMap.get(
                            element
                        );

                    if (!stored) {

                        stored = {};

                        originalAttributeMap.set(
                            element,
                            stored
                        );
                    }

                    if (
                        !Object.prototype.hasOwnProperty.call(
                            stored,
                            attribute
                        )
                    ) {

                        stored[attribute] =
                            element.getAttribute(
                                attribute
                            );
                    }

                    const original =
                        stored[attribute];

                    const translated =
                        translateText(
                            original,
                            language
                        );

                    element.setAttribute(
                        attribute,
                        translated
                    );
                }
            );
        });
    }


    /* =====================================================
       COMPLETE PAGE TRANSLATION
       ===================================================== */

    function translatePage(language) {

        const selectedLanguage =
            ["en", "hi", "mr"].includes(language)
                ? language
                : "en";

        if (isTranslating) {
            return;
        }

        isTranslating = true;
        currentLanguage = selectedLanguage;

        try {

            translateTextContent(
                selectedLanguage
            );

            translatePlaceholders(
                selectedLanguage
            );

            translateAttributes(
                selectedLanguage
            );

            document.documentElement.setAttribute(
                "lang",
                selectedLanguage
            );

        } finally {

            isTranslating = false;
        }
    }


    /* =====================================================
       DYNAMIC CONTENT
       ===================================================== */

    function translateAddedContent(node, language) {

        if (
            !node ||
            node.nodeType !== Node.ELEMENT_NODE
        ) {
            return;
        }

        translateTextContent(
            language,
            node
        );

        translatePlaceholders(
            language,
            node
        );

        translateAttributes(
            language,
            node
        );
    }


    /* =====================================================
       MUTATION OBSERVER
       ===================================================== */

    function startObserver() {

        if (observer) {
            return;
        }

        observer =
            new MutationObserver(
                function (mutations) {

                    if (isTranslating) {
                        return;
                    }

                    clearTimeout(observerTimer);

                    observerTimer =
                        setTimeout(
                            function () {

                                mutations.forEach(
                                    function (mutation) {

                                        if (
                                            mutation.type !==
                                            "childList"
                                        ) {
                                            return;
                                        }

                                        mutation.addedNodes.forEach(
                                            function (node) {

                                                translateAddedContent(
                                                    node,
                                                    currentLanguage
                                                );
                                            }
                                        );
                                    }
                                );

                            },
                            30
                        );
                }
            );

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    function getLanguage() {

        const saved =
            localStorage.getItem(
                "krishiMitraLanguage"
            );

        return (
            ["en", "hi", "mr"].includes(saved)
                ? saved
                : "en"
        );
    }


    /* =====================================================
       SET LANGUAGE
       ===================================================== */

    function setLanguage(language) {

        if (!["en", "hi", "mr"].includes(language)) {
            return;
        }

        currentLanguage = language;

        localStorage.setItem(
            "krishiMitraLanguage",
            language
        );

        document.documentElement.setAttribute(
            "lang",
            language
        );

        googleTranslateRequestedLanguage = language;

        // English is the original/source language. Google Website Translator
        // changes the DOM internally, so restoring individual text nodes is not
        // reliable after Google has replaced/wrapped nodes. For English we
        // therefore reload the CURRENT page, while remembering the current
        // module/Buyer section so the user stays exactly where they are.
        if (language === "en") {
            localStorage.setItem("krishiMitraLanguage", "en");

            // Force Google Translator back to the source language.
            document.cookie = "googtrans=/en/en; path=/; max-age=31536000";
            document.cookie = "googtrans=/en/en; path=/; domain=" + location.hostname + "; max-age=31536000";

            const isBuyerPage = /\/buyer\//i.test(location.pathname);
            const isLanding = document.body && document.body.classList.contains("landing-active");

            if (isBuyerPage) {
                const activeBuyerSection =
                    document.querySelector(".dashboard-section.active-section");
                sessionStorage.setItem(
                    "krishiEnglishReturn",
                    JSON.stringify({
                        context: "buyer",
                        section: activeBuyerSection ? activeBuyerSection.id : "dashboard"
                    })
                );
            } else if (!isLanding) {
                const activeModule =
                    document.querySelector("[data-module-section].active");
                sessionStorage.setItem(
                    "krishiEnglishReturn",
                    JSON.stringify({
                        context: "farmer",
                        module: activeModule ? activeModule.getAttribute("data-module-section") : "dashboard"
                    })
                );
            } else {
                sessionStorage.removeItem("krishiEnglishReturn");
            }

            // Reload this exact URL — never redirect to the landing page.
            window.location.reload();
            return;
        }

        if (googleTranslateReady && applyGoogleLanguage(language)) {
            setTimeout(function () { applyStrictLocalizations(language); }, 500);
        } else {
            translatePage(language);
            loadGoogleTranslate();
            setTimeout(function () { applyStrictLocalizations(language); }, 500);
        }

        broadcastLanguageToIframes(language);

        document.dispatchEvent(
            new CustomEvent(
                "krishi:language-changed",
                { detail: { language: language } }
            )
        );
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function initializeTranslation() {

        currentLanguage = getLanguage();
        googleTranslateRequestedLanguage = currentLanguage;

        // Start the automatic translator after the page exists.
        startObserver();

        requestAnimationFrame(function () {
            loadGoogleTranslate();

            // If Google is temporarily unavailable, preserve the existing
            // Krishi-Mitra dictionary behavior.
            translatePage(currentLanguage);

            setTimeout(function () {
                if (googleTranslateReady) {
                    applyGoogleLanguage(currentLanguage);
                }
                if (currentLanguage !== "en") {
                    applyStrictLocalizations(currentLanguage);
                }
                broadcastLanguageToIframes(currentLanguage);
            }, 1200);
        });
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.KrishiTranslation = {

        setLanguage:
            setLanguage,

        getLanguage:
            getLanguage,

        translatePage:
            translatePage,

        translateText:
            translateText,

        translations:
            translations
    };


    /* =====================================================
       START
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeTranslation
        );

    } else {

        initializeTranslation();
    }

})();

