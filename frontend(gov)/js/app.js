/* =========================================================
   KRISHI-MITRA
   APP.JS
   FINAL MAIN APPLICATION CONTROLLER
   Aligned with updated index.html + style.css + responsive.css
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       APPLICATION STATE
       ===================================================== */

    const state = {
        currentModule: "dashboard",
        language: "en",

        sidebarOpen: false,
        profileMenuOpen: false,
        languageMenuOpen: false,

        initialized: false
    };


    /* =====================================================
       DOM HELPERS
       ===================================================== */

    function $(id) {
        return document.getElementById(id);
    }

    function query(selector) {
        return document.querySelector(selector);
    }

    function queryAll(selector) {
        return document.querySelectorAll(selector);
    }


    /* =====================================================
       BODY SCROLL CONTROL
       ===================================================== */

    function lockBodyScroll() {

        const modal =
            query(".modal-overlay.show");

        const sidebar =
            query(".sidebar.mobile-open");

        document.body.classList.toggle(
            "no-scroll",
            Boolean(modal || sidebar)
        );
    }


    /* =====================================================
       MOBILE MENU / SIDEBAR
       ===================================================== */

    function updateMobileMenuButton(isOpen) {

        const button =
            $("mobile-menu-button");

        if (!button) {
            return;
        }

        button.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        button.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation"
                : "Open navigation"
        );

        const icon =
            button.querySelector("i");

        if (icon) {

            icon.classList.toggle(
                "fa-bars",
                !isOpen
            );

            icon.classList.toggle(
                "fa-xmark",
                isOpen
            );
        }
    }


    function openSidebar() {

        const sidebar =
            $("sidebar");

        const overlay =
            $("sidebar-overlay");

        if (!sidebar) {
            return;
        }

        sidebar.classList.add(
            "mobile-open"
        );

        if (overlay) {

            overlay.classList.add(
                "show"
            );
        }

        state.sidebarOpen = true;

        updateMobileMenuButton(true);

        lockBodyScroll();
    }


    function closeSidebar() {

        const sidebar =
            $("sidebar");

        const overlay =
            $("sidebar-overlay");

        if (sidebar) {

            sidebar.classList.remove(
                "mobile-open"
            );
        }

        if (overlay) {

            overlay.classList.remove(
                "show"
            );
        }

        state.sidebarOpen = false;

        updateMobileMenuButton(false);

        lockBodyScroll();
    }


    function toggleSidebar() {

        if (state.sidebarOpen) {

            closeSidebar();

        } else {

            openSidebar();
        }
    }


    function setupMobileMenu() {

        const button =
            $("mobile-menu-button");

        if (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    toggleSidebar();
                }
            );
        }


        const overlay =
            $("sidebar-overlay");

        if (overlay) {

            overlay.addEventListener(
                "click",
                function () {

                    closeSidebar();
                }
            );
        }
    }


    /* =====================================================
       PROFILE DROPDOWN
       ===================================================== */

    function openProfileDropdown() {

        const dropdown =
            $("profile-dropdown");

        if (!dropdown) {
            return;
        }

        closeLanguageDropdown();

        dropdown.classList.add(
            "active"
        );

        const button =
            $("profile-button");

        if (button) {

            button.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        state.profileMenuOpen = true;
    }


    function closeProfileDropdown() {

        const dropdown =
            $("profile-dropdown");

        if (dropdown) {

            dropdown.classList.remove(
                "active"
            );
        }

        const button =
            $("profile-button");

        if (button) {

            button.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        state.profileMenuOpen = false;
    }


    function toggleProfileDropdown() {

        if (state.profileMenuOpen) {

            closeProfileDropdown();

        } else {

            openProfileDropdown();
        }
    }


    /* =====================================================
       LANGUAGE DROPDOWN
       ===================================================== */

    function openLanguageDropdown() {

        const dropdown =
            $("language-dropdown");

        if (!dropdown) {
            return;
        }

        closeProfileDropdown();

        dropdown.classList.add(
            "active"
        );

        const button =
            $("language-button");

        if (button) {

            button.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        state.languageMenuOpen = true;
    }


    function closeLanguageDropdown() {

        const dropdown =
            $("language-dropdown");

        if (dropdown) {

            dropdown.classList.remove(
                "active"
            );
        }

        const button =
            $("language-button");

        if (button) {

            button.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        state.languageMenuOpen = false;
    }


    function toggleLanguageDropdown() {

        if (state.languageMenuOpen) {

            closeLanguageDropdown();

        } else {

            openLanguageDropdown();
        }
    }


    function setupLanguageButton() {

        const button =
            $("language-button");

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                toggleLanguageDropdown();
            }
        );
    }


    /* =====================================================
       LANGUAGE SYSTEM
       ===================================================== */

    function updateLanguageButton(language) {

        const button =
            $("language-button");

        if (!button) {
            return;
        }

        const labels = {
            en: "English",
            hi: "हिन्दी",
            mr: "मराठी"
        };


        const text =
            button.querySelector(
                ".language-text"
            );

        if (text) {

            text.textContent =
                labels[language] || labels.en;
        }


        queryAll(
            "#language-dropdown [data-language]"
        ).forEach(
            function (option) {

                const active =
                    option.getAttribute(
                        "data-language"
                    ) === language;

                option.classList.toggle(
                    "active",
                    active
                );

                option.setAttribute(
                    "aria-selected",
                    active
                        ? "true"
                        : "false"
                );
            }
        );
    }


    function setLanguage(language) {

        if (
            !["en", "hi", "mr"].includes(
                language
            )
        ) {
            return;
        }

        state.language =
            language;

        localStorage.setItem(
            "krishiMitraLanguage",
            language
        );

        document.documentElement.setAttribute(
            "lang",
            language
        );

        updateLanguageButton(
            language
        );

        KrishiTranslation.setLanguage(language);

        closeLanguageDropdown();


        /* Optional translation module */

        if (
            window.KrishiTranslation &&
            typeof window.KrishiTranslation.setLanguage ===
                "function"
        ) {

            window.KrishiTranslation.setLanguage(
                language
            );
        }


        const message = {

            en:
                "Language changed to English.",

            hi:
                "भाषा हिन्दी में बदल दी गई है।",

            mr:
                "भाषा मराठीत बदलली आहे."
        };


        showToast(
            message[language],
            "success"
        );
    }


    function loadSavedLanguage() {

        const saved =
            localStorage.getItem(
                "krishiMitraLanguage"
            );

        const language =
            ["en", "hi", "mr"].includes(
                saved
            )
                ? saved
                : "en";

        state.language =
            language;

        document.documentElement.setAttribute(
            "lang",
            language
        );

        updateLanguageButton(
            language
        );
    }


    function setupLanguageOptions() {

        const dropdown =
            $("language-dropdown");

        if (!dropdown) {
            return;
        }

        dropdown.addEventListener(
            "click",
            function (event) {

                const option =
                    event.target.closest(
                        "[data-language]"
                    );

                if (!option) {
                    return;
                }

                event.stopPropagation();

                setLanguage(
                    option.getAttribute(
                        "data-language"
                    )
                );
            }
        );
    }

function setupInlineLanguageOptions() {

    document
    .querySelectorAll(
        ".language-option-inline, .landing-language-option"
    )
        .forEach(function (option) {

            option.addEventListener(
                "click",
                function () {

                    const language =
                        option.getAttribute(
                            "data-language"
                        );

                    KrishiTranslation.setLanguage(
                        language
                    );

                    document
    .querySelectorAll(
        ".language-option-inline, .landing-language-option"
    )
                        .forEach(function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        });

                    option.classList.add("active");
                }
            );
        });
}

    /* =====================================================
       SEARCH
       ===================================================== */

    function setupSearch() {

        const search =
            $("global-search");

        if (!search) {
            return;
        }


        const container =
            search.closest(
                ".search-container"
            );


        let clearButton =
            container
                ? container.querySelector(
                    ".search-clear"
                )
                : null;


        /*
         * Create clear button only if
         * HTML does not already contain it.
         */

        if (
            container &&
            !clearButton
        ) {

            clearButton =
                document.createElement(
                    "button"
                );

            clearButton.type =
                "button";

            clearButton.className =
                "search-clear";

            clearButton.setAttribute(
                "aria-label",
                "Clear search"
            );

            clearButton.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';


            const shortcut =
                container.querySelector(
                    ".search-shortcut"
                );


            if (shortcut) {

                container.insertBefore(
                    clearButton,
                    shortcut
                );

            } else {

                container.appendChild(
                    clearButton
                );
            }
        }


        function updateClearButton() {

            if (!clearButton) {
                return;
            }

            clearButton.classList.toggle(
                "show",
                search.value.trim().length > 0
            );
        }


        search.addEventListener(
            "input",
            updateClearButton
        );


        search.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !==
                    "Enter"
                ) {
                    return;
                }


                const value =
                    search.value.trim();


                if (!value) {
                    return;
                }


                document.dispatchEvent(
                    new CustomEvent(
                        "krishi:search",
                        {
                            detail: {
                                query: value
                            }
                        }
                    )
                );
            }
        );


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                function () {

                    search.value =
                        "";

                    updateClearButton();

                    search.focus();

                    document.dispatchEvent(
                        new CustomEvent(
                            "krishi:search-cleared"
                        )
                    );
                }
            );
        }


        updateClearButton();
    }


    /* =====================================================
       SEARCH SHORTCUT
       ===================================================== */

    function setupSearchShortcut() {

        document.addEventListener(
            "keydown",
            function (event) {

                const isMac =
                    navigator.platform
                        .toUpperCase()
                        .includes("MAC");


                const modifier =
                    isMac
                        ? event.metaKey
                        : event.ctrlKey;


                if (
                    modifier &&
                    event.key.toLowerCase() ===
                        "k"
                ) {

                    event.preventDefault();

                    const search =
                        $("global-search");

                    if (search) {

                        search.focus();

                        search.select();
                    }
                }


                /*
                 * Escape clears search
                 * when search is focused.
                 */

                if (
                    event.key === "Escape" &&
                    document.activeElement ===
                        $("global-search")
                ) {

                    const search =
                        $("global-search");

                    if (
                        search &&
                        search.value
                    ) {

                        search.value = "";

                        search.dispatchEvent(
                            new Event(
                                "input",
                                {
                                    bubbles: true
                                }
                            )
                        );
                    }
                }
            }
        );
    }


    /* =====================================================
       OUTSIDE CLICK
       ===================================================== */

    function setupOutsideClick() {

        document.addEventListener(
            "click",
            function (event) {

                const profile =
                    $("profile-dropdown");

                const profileButton =
                    $("profile-button");


                if (
                    state.profileMenuOpen &&
                    profile &&
                    profileButton &&
                    !profile.contains(
                        event.target
                    ) &&
                    !profileButton.contains(
                        event.target
                    )
                ) {

                    closeProfileDropdown();
                }


                const language =
                    $("language-dropdown");

                const languageButton =
                    $("language-button");


                if (
                    state.languageMenuOpen &&
                    language &&
                    languageButton &&
                    !language.contains(
                        event.target
                    ) &&
                    !languageButton.contains(
                        event.target
                    )
                ) {

                    closeLanguageDropdown();
                }
            }
        );
    }


    /* =====================================================
       MODAL SYSTEM
       ===================================================== */

    function openModal(modalId) {

        const modal =
            $(modalId);

        if (!modal) {
            return;
        }

        closeProfileDropdown();

        closeLanguageDropdown();


        modal.classList.add(
            "show"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

        lockBodyScroll();
    }


    function closeModal(modalId) {

        const modal =
            $(modalId);

        if (!modal) {
            return;
        }

        modal.classList.remove(
            "show"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        const anyModal =
            query(
                ".modal-overlay.show"
            );


        if (!anyModal) {

            document.body.classList.remove(
                "modal-open"
            );
        }

        lockBodyScroll();
    }


    function closeAllModals() {

        queryAll(
            ".modal-overlay.show"
        ).forEach(
            function (modal) {

                modal.classList.remove(
                    "show"
                );

                modal.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }
        );

        document.body.classList.remove(
            "modal-open"
        );

        lockBodyScroll();
    }


    function setupModalButtons() {

        document.addEventListener(
            "click",
            function (event) {

                const closeButton =
                    event.target.closest(
                        "[data-close-modal]"
                    );


                if (closeButton) {

                    closeModal(
                        closeButton.getAttribute(
                            "data-close-modal"
                        )
                    );

                    return;
                }


                if (
                    event.target.classList.contains(
                        "modal-overlay"
                    )
                ) {

                    const modalId =
                        event.target.id;

                    if (modalId) {

                        closeModal(
                            modalId
                        );
                    }
                }
            }
        );
    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(
        message,
        type = "info"
    ) {

        const container =
            $("toast-container");

        if (!container) {
            return;
        }


        const toast =
            document.createElement(
                "div"
            );


        /*
         * Updated style.css uses .toast
         */

        toast.className =
            `toast ${type}`;

        toast.setAttribute(
            "role",
            "status"
        );


        const iconMap = {

            success:
                "fa-circle-check",

            error:
                "fa-circle-exclamation",

            warning:
                "fa-triangle-exclamation",

            info:
                "fa-circle-info"
        };


        const icon =
            iconMap[type] ||
            iconMap.info;


        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>

            <span>
                ${escapeHTML(message)}
            </span>

            <button
                type="button"
                class="toast-close"
                aria-label="Close notification">

                <i class="fa-solid fa-xmark"></i>

            </button>
        `;


        container.appendChild(
            toast
        );


        requestAnimationFrame(
            function () {

                toast.classList.add(
                    "show"
                );
            }
        );


        const close =
            toast.querySelector(
                ".toast-close"
            );


        if (close) {

            close.addEventListener(
                "click",
                function () {

                    removeToast(
                        toast
                    );
                }
            );
        }


        setTimeout(
            function () {

                removeToast(
                    toast
                );

            },
            4000
        );
    }


    function removeToast(toast) {

        if (!toast) {
            return;
        }


        toast.classList.remove(
            "show"
        );


        setTimeout(
            function () {

                if (
                    toast &&
                    toast.parentNode
                ) {

                    toast.remove();
                }

            },
            300
        );
    }


    function escapeHTML(value) {

        const element =
            document.createElement(
                "div"
            );

        element.textContent =
            String(value);

        return element.innerHTML;
    }


    /* =====================================================
       PROFILE DISPLAY
       ===================================================== */

    function updateProfileDisplay() {

        let profile =
            null;


        try {

            const saved =
                localStorage.getItem(
                    "krishiMitraProfile"
                );

            if (saved) {

                profile =
                    JSON.parse(
                        saved
                    );
            }

        } catch (error) {

            profile = null;
        }

        if (!profile || !profile.name) {
            try {
                const savedUser = localStorage.getItem("krishi_mitra_user");
                if (savedUser) {
                    const parsedUser = JSON.parse(savedUser);
                    if (parsedUser && parsedUser.name && parsedUser.name !== "Guest User") {
                        profile = { name: parsedUser.name, role: parsedUser.role || "farmer" };
                    }
                }
            } catch (err) {}
        }

        if (!profile || !profile.name) {
            try {
                const savedU = localStorage.getItem("krishiMitraUser");
                if (savedU) {
                    const parsedU = JSON.parse(savedU);
                    if (parsedU && parsedU.name && parsedU.name !== "Guest User") {
                        profile = { name: parsedU.name, role: "farmer" };
                    }
                }
            } catch (err) {}
        }


        const name =
            profile &&
            profile.name
                ? profile.name
                : "Guest User";


        const status =
            profile && profile.name
                ? "Farmer Profile"
                : "Guest Mode";


        const topbarName =
            $("topbar-profile-name");

        const topbarStatus =
            $("topbar-profile-status");

        const dropdownName =
            $("dropdown-profile-name");

        const dropdownStatus =
            $("dropdown-profile-status");

        const heroFarmerName =
            $("dashboard-farmer-name");


        if (topbarName) {

            topbarName.textContent =
                name;
        }


        if (topbarStatus) {

            topbarStatus.textContent =
                status;
        }


        if (dropdownName) {

            dropdownName.textContent =
                name;
        }


        if (dropdownStatus) {

            dropdownStatus.textContent =
                profile
                    ? "Farmer Profile"
                    : "Explore Krishi-Mitra";
        }

        if (heroFarmerName && profile && profile.name) {
            heroFarmerName.textContent = profile.name;
        }
    }


    /* =====================================================
       AUTH DISPLAY
       ===================================================== */

    function updateAuthDisplay() {

        const loggedIn =
            localStorage.getItem(
                "krishiMitraLoggedIn"
            ) === "true";


        queryAll(
            '[data-action="signin"]'
        ).forEach(
            function (button) {

                const span =
                    button.querySelector(
                        "span"
                    );

                if (!span) {
                    return;
                }

                span.textContent =
                    loggedIn
                        ? "Sign Out"
                        : "Sign In";
            }
        );
    }

    /* =====================================================
   LANDING PAGE ROLE ACTIONS
   ===================================================== */

function setupLandingPage() {

    const landingPage = $("landing-page");

    if (!landingPage) {
        return;
    }

    landingPage.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".landing-role-button"
                );

            if (!button) {
                return;
            }

            const role =
                button.getAttribute("data-role");


            /* =========================================
               FARMER
               Landing → Farmer Login Page
               ========================================= */

            if (role === "farmer") {
                let lang = "en";
                if (window.KrishiTranslation && typeof window.KrishiTranslation.getLanguage === "function") {
                    lang = window.KrishiTranslation.getLanguage();
                } else {
                    const activeLang = document.querySelector(".landing-language-option.active");
                    if (activeLang && activeLang.dataset && activeLang.dataset.language) {
                        lang = activeLang.dataset.language;
                    }
                }

                window.location.href = "../modules/farmer_auth.html?lang=" + encodeURIComponent(lang);
                return;
            }

            /* =========================================
               BUYER
               Landing → Buyer Login Page
               ========================================= */

            if (role === "buyer") {
                let lang = "en";
                if (window.KrishiTranslation && typeof window.KrishiTranslation.getLanguage === "function") {
                    lang = window.KrishiTranslation.getLanguage();
                } else {
                    const activeLang = document.querySelector(".landing-language-option.active");
                    if (activeLang && activeLang.dataset && activeLang.dataset.language) {
                        lang = activeLang.dataset.language;
                    }
                }

                window.location.href = "../modules/buyer_auth.html?lang=" + encodeURIComponent(lang);
                return;
            }

        }
    );
}


    /* =====================================================
       GLOBAL ACTIONS
       ===================================================== */

    function setupGlobalActions() {

        document.addEventListener(
            "click",
            function (event) {

                const action =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!action) {
                    return;
                }


                const actionName =
                    action.getAttribute(
                        "data-action"
                    );


                if (
                    actionName ===
                    "settings"
                ) {

                    showToast(
                        "Settings will be available here.",
                        "info"
                    );
                }
            }
        );
    }


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    function setupEscapeKey() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !==
                    "Escape"
                ) {
                    return;
                }


                if (
                    state.sidebarOpen
                ) {

                    closeSidebar();
                }


                if (
                    state.profileMenuOpen
                ) {

                    closeProfileDropdown();
                }


                if (
                    state.languageMenuOpen
                ) {

                    closeLanguageDropdown();
                }


                closeAllModals();
            }
        );
    }


    /* =====================================================
       RESPONSIVE HANDLER
       ===================================================== */

    function setupResizeHandler() {

        window.addEventListener(
            "resize",
            function () {

                /*
                 * Desktop does not need mobile sidebar.
                 */

                if (
                    window.innerWidth >
                    991 &&
                    state.sidebarOpen
                ) {

                    closeSidebar();
                }


                /*
                 * Keep dropdowns within viewport.
                 */

                if (
                    window.innerWidth <=
                    767
                ) {

                    const profile =
                        $("profile-dropdown");

                    const language =
                        $("language-dropdown");


                    if (
                        profile &&
                        state.profileMenuOpen
                    ) {

                        profile.style.right =
                            "0";
                    }


                    if (
                        language &&
                        state.languageMenuOpen
                    ) {

                        language.style.right =
                            "0";
                    }
                }
            }
        );
    }


    /* =====================================================
       STORAGE CHANGE
       ===================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key ===
                "krishiMitraProfile" ||
                event.key ===
                "krishi_mitra_user" ||
                event.key ===
                "krishiMitraUser"
            ) {

                updateProfileDisplay();
            }


            if (
                event.key ===
                "krishiMitraLoggedIn"
            ) {

                updateAuthDisplay();

                updateProfileDisplay();
            }


            if (
                event.key ===
                "krishiMitraLanguage"
            ) {

                loadSavedLanguage();
            }
        }
    );


    /* =====================================================
       CUSTOM EVENTS
       ===================================================== */

    document.addEventListener(
        "krishi:profile-updated",
        function () {

            updateProfileDisplay();
        }
    );


    document.addEventListener(
        "krishi:auth-updated",
        function () {

            updateAuthDisplay();

            updateProfileDisplay();
        }
    );


    /* =====================================================
       GOVERNMENT SCHEMES
       ===================================================== */

    const mockSchemesData = [

        {
            name: "PM-Kisan Samman Nidhi",
            status: "Active",
            description:
                "Direct income support of ₹6,000 per year to farmer families.",
            eligibility:
                "Small & Marginal Farmers (< 2 Hectares)",
            link:
                "https://pmkisan.gov.in/"
        },

        {
            name: "Paramparagat Krishi Vikas Yojana",
            status: "Active",
            description:
                "Promotes organic farming through a cluster-based approach and supports farmers in converting conventional land.",
            eligibility:
                "All Farmers starting organic farming",
            link:
                "https://www.myscheme.gov.in/schemes/pkvy"
        },

        {
            name: "National Agriculture Market (e-NAM)",
            status: "Active",
            description:
                "Online trading platform for agricultural commodities offering e-bidding and direct e-payment.",
            eligibility:
                "All registered farmers and FPOs",
            link:
                "https://www.myscheme.gov.in/schemes/e-nam"
        }
    ];


    function loadGovernmentSchemes() {

        const container =
            $("schemes-container");

        if (!container) {
            return;
        }

        container.innerHTML = "";

        mockSchemesData.forEach(
            function (scheme) {

                const card =
                    document.createElement("div");

                card.className =
                    "government-scheme-card";

                card.innerHTML = `
                    <div class="government-scheme-content">

                        <div class="government-scheme-heading">
                            <h3>${scheme.name}</h3>
                            <span class="government-scheme-status">
                                ${scheme.status}
                            </span>
                        </div>

                        <p class="government-scheme-description">
                            ${scheme.description}
                        </p>

                        <p class="government-scheme-eligibility">
                            Eligibility:
                            <span>${scheme.eligibility}</span>
                        </p>

                    </div>

                    <div class="government-scheme-action">
                        <a
                            href="${scheme.link}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="government-scheme-apply">
                            Apply Now
                        </a>
                    </div>
                `;

                container.appendChild(card);
            }
        );
    }


    function setupGovernmentSchemes() {

        loadGovernmentSchemes();

    }


    /* =====================================================
       APPLICATION INITIALIZATION
       ===================================================== */

    function initializeApp() {

        if (state.initialized) {
            return;
        }


        state.initialized =
            true;


        loadSavedLanguage();

        updateProfileDisplay();

        updateAuthDisplay();

        /* =====================================================
   LANDING PAGE INITIALIZATION
   ===================================================== */

const landingPage = $("landing-page");

if (landingPage) {
    let shouldDirectToFarmerDashboard = false;

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const viewParam = urlParams.get("view");
        const roleParam = urlParams.get("role");
        const farmerAuth = sessionStorage.getItem("krishi_farmer_authenticated");

        if (viewParam === "dashboard" || roleParam === "farmer" || farmerAuth === "true") {
            shouldDirectToFarmerDashboard = true;
            sessionStorage.removeItem("krishi_farmer_authenticated");
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    } catch (e) {}

    // If English was selected from inside the Farmer dashboard, the English
    // restore uses a same-URL reload. Re-open the application instead of
    // showing the landing page again.
    try {
        const savedReturn = sessionStorage.getItem("krishiEnglishReturn");
        if (savedReturn) {
            const parsed = JSON.parse(savedReturn);
            if (parsed && parsed.context === "farmer") {
                shouldDirectToFarmerDashboard = true;
                sessionStorage.removeItem("krishiEnglishReturn");
            }
        }
    } catch (error) {}

    if (shouldDirectToFarmerDashboard) {
        landingPage.style.display = "none";
        document.body.classList.remove("landing-active");

        const topbar = document.getElementById("topbar");
        const sidebar = document.getElementById("sidebar");
        const contentArea = document.getElementById("content-area");

        if (topbar) topbar.style.display = "";
        if (sidebar) sidebar.style.display = "";
        if (contentArea) contentArea.style.display = "";

        const dashboard = document.querySelector('[data-module-section="dashboard"]');
        if (dashboard) {
            document.querySelectorAll("[data-module-section]").forEach(function (section) {
                section.hidden = true;
                section.classList.remove("active");
            });
            dashboard.hidden = false;
            dashboard.classList.add("active");
        }

        if (window.KrishiNavigation && typeof window.KrishiNavigation.showModule === "function") {
            window.KrishiNavigation.showModule("dashboard");
        }

        updateProfileDisplay();
    } else {
        landingPage.style.display = "block";
        document.body.classList.add("landing-active");
    }
}

        setupMobileMenu();

        setupLanguageOptions();

        setupInlineLanguageOptions();

        setupOutsideClick();

        setupModalButtons();

        setupEscapeKey();

        setupResizeHandler();

        setupSearch();

        setupSearchShortcut();

        setupGlobalActions();

        setupLandingPage();

        setupGovernmentSchemes();


        document.dispatchEvent(
            new CustomEvent(
                "krishi:app-ready",
                {
                    detail: {
                        state: state
                    }
                }
            )
        );
    }


    /* =====================================================
       PUBLIC APPLICATION API
       ===================================================== */

    window.KrishiApp = {

        state: state,

        openSidebar:
            openSidebar,

        closeSidebar:
            closeSidebar,

        toggleSidebar:
            toggleSidebar,

        openProfileDropdown:
            openProfileDropdown,

        closeProfileDropdown:
            closeProfileDropdown,

        toggleProfileDropdown:
            toggleProfileDropdown,

        openLanguageDropdown:
            openLanguageDropdown,

        closeLanguageDropdown:
            closeLanguageDropdown,

        toggleLanguageDropdown:
            toggleLanguageDropdown,

        openModal:
            openModal,

        closeModal:
            closeModal,

        closeAllModals:
            closeAllModals,

        showToast:
            showToast,

        setLanguage:
            setLanguage,

        updateProfileDisplay:
            updateProfileDisplay,

        updateAuthDisplay:
            updateAuthDisplay
    };


    /* =====================================================
       GLOBAL HELPERS
       ===================================================== */

    window.showToast =
        showToast;

    window.openKrishiModal =
        openModal;

    window.closeKrishiModal =
        closeModal;


    /* =====================================================
       START APPLICATION
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeApp
        );

    } else {

        initializeApp();
    }

})();

/* Notification k liye */ 

/* =========================================================
   KRISHI-MITRA — STATIC NOTIFICATION SYSTEM
   ========================================================= */

(function () {

    /* =====================================================
       SETTINGS
       ===================================================== */

    // One automatic notification every 30 minutes.
    const NOTIFICATION_INTERVAL =
        30 * 60 * 1000;

    // Popup stays visible for 5 seconds.
    const NOTIFICATION_DISPLAY_TIME =
        5000;


    /* =====================================================
       STATIC NOTIFICATIONS
       ===================================================== */

    const staticNotifications = [

        {
            category: "Weather",
            message: "🌧️ Heavy rainfall expected tomorrow"
        },

        {
            category: "Crop Health",
            message: "⚠️ High disease risk expected due to weather"
        },

        {
            category: "Crop Health",
            message: "🐛 Pest risk increasing in your area"
        },

        {
            category: "Irrigation",
            message: "💧 Irrigation recommended for your Tomato crop"
        },

        {
            category: "Market",
            message: "📈 Tomato prices increased nearby"
        },

        {
            category: "Crop Health",
            message: "👨‍🌾 Expert validation completed for your crop scan"
        },

        {
            category: "Buyer",
            message: "🛒 New suitable buyer found for your produce"
        },

        {
            category: "Scheme",
            message: "📢 New government agriculture scheme available"
        }

    ];


    /* =====================================================
       LOCAL STORAGE KEYS
       ===================================================== */

    const LAST_NOTIFICATION_TIME_KEY =
        "krishiMitraLastNotificationTime";

    const NOTIFICATION_INDEX_KEY =
        "krishiMitraNotificationIndex";

    const NOTIFICATION_HISTORY_KEY =
        "krishiMitraNotificationHistory";


    /* =====================================================
       GET NOTIFICATION HISTORY
       ===================================================== */

    function getNotificationHistory() {

        try {

            const history =
                JSON.parse(
                    localStorage.getItem(
                        NOTIFICATION_HISTORY_KEY
                    )
                );

            if (Array.isArray(history)) {
                return history;
            }

        } catch (error) {

            console.warn(
                "Could not read notification history.",
                error
            );

        }

        return [];

    }


    /* =====================================================
       SAVE NOTIFICATION HISTORY
       ===================================================== */

    function saveNotificationHistory(history) {

        localStorage.setItem(
            NOTIFICATION_HISTORY_KEY,
            JSON.stringify(history)
        );

    }


    /* =====================================================
       ADD NOTIFICATION TO HISTORY
       ===================================================== */

    function addNotificationToHistory(notification) {

        const history =
            getNotificationHistory();


        const historyItem = {

            id:
                Date.now().toString() +
                Math.random()
                    .toString(36)
                    .substring(2, 8),

            category:
                notification.category,

            message:
                notification.message,

            unread:
                true,

            time:
                Date.now()

        };


        /*
         * Newest notification appears first.
         */

        history.unshift(
            historyItem
        );


        saveNotificationHistory(
            history
        );


        /*
         * Refresh notification panel
         * and unread count.
         */

        renderNotificationPanel();
        updateNotificationCount();

    }


    /* =====================================================
       UPDATE UNREAD COUNT
       ===================================================== */

    function updateNotificationCount() {

        const badge =
            document.getElementById(
                "notification-count"
            );


        if (!badge) {
            return;
        }


        const history =
            getNotificationHistory();


        const unreadCount =
            history.filter(
                function (notification) {

                    return notification.unread === true;

                }
            ).length;


        if (unreadCount <= 0) {

            badge.textContent = "";
            badge.classList.add("empty");

        } else {

            badge.textContent =
                unreadCount > 99
                    ? "99+"
                    : String(unreadCount);

            badge.classList.remove("empty");

        }

    }


    /* =====================================================
       RENDER NOTIFICATION PANEL
       ===================================================== */

    function renderNotificationPanel() {

        const list =
            document.getElementById(
                "notification-list"
            );


        if (!list) {
            return;
        }


        const history =
            getNotificationHistory();


        /*
         * No notifications have appeared yet.
         */

        if (history.length === 0) {

            list.innerHTML = `

                <div class="notification-empty">

                    No new notifications yet.

                </div>

            `;

            return;

        }


        /*
         * Create each notification individually.
         */

        list.innerHTML =
            history.map(
                function (notification) {

                    return `

                        <div
                            class="
                                notification-item
                                ${notification.unread ? "unread" : "read"}
                            "
                            data-notification-id="${notification.id}"
                        >

                            <div class="notification-category">

                                ${notification.category}

                            </div>

                            <div class="notification-message">

                                ${notification.message}

                            </div>

                        </div>

                    `;

                }
            ).join("");


        /*
         * Individual notification click
         * marks that notification as read.
         */

        const notificationItems =
            list.querySelectorAll(
                ".notification-item"
            );


        notificationItems.forEach(
            function (item) {

                item.addEventListener(
                    "click",
                    function () {

                        const notificationId =
                            item.getAttribute(
                                "data-notification-id"
                            );


                        markNotificationAsRead(
                            notificationId
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       MARK ONE NOTIFICATION AS READ
       ===================================================== */

    function markNotificationAsRead(
        notificationId
    ) {

        const history =
            getNotificationHistory();


        const notification =
            history.find(
                function (item) {

                    return item.id === notificationId;

                }
            );


        if (!notification) {
            return;
        }


        notification.unread = false;


        saveNotificationHistory(
            history
        );


        renderNotificationPanel();
        updateNotificationCount();

    }


    /* =====================================================
       MARK ALL NOTIFICATIONS AS READ
       ===================================================== */

    function markAllNotificationsAsRead() {

        const history =
            getNotificationHistory();


        history.forEach(
            function (notification) {

                notification.unread = false;

            }
        );


        saveNotificationHistory(
            history
        );


        renderNotificationPanel();
        updateNotificationCount();

    }


    /* =====================================================
       SHOW AUTOMATIC NOTIFICATION POPUP
       ===================================================== */

    function showNotificationPopup(
        notification
    ) {

        /*
         * Remove old automatic popup first.
         */

        const oldPopup =
            document.getElementById(
                "krishi-auto-notification"
            );


        if (oldPopup) {
            oldPopup.remove();
        }


        /*
         * Create popup.
         */

        const popup =
            document.createElement("div");


        popup.id =
            "krishi-auto-notification";

        popup.className =
            "krishi-auto-notification";


        popup.innerHTML = `

            <div class="krishi-notification-popup-header">

                <span>
                    🔔 New Notification
                </span>

                <button
                    type="button"
                    class="krishi-notification-close"
                    aria-label="Close notification">
                    ×
                </button>

            </div>


            <div class="krishi-notification-popup-body">

                <div class="krishi-notification-category">

                    ${notification.category} :

                </div>

                <div class="krishi-notification-message">

                    ${notification.message}

                </div>

            </div>

        `;


        document.body.appendChild(
            popup
        );


        /*
         * Animate popup.
         */

        requestAnimationFrame(
            function () {

                popup.classList.add(
                    "show"
                );

            }
        );


        /*
         * Close button.
         */

        const closeButton =
            popup.querySelector(
                ".krishi-notification-close"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function () {

                    removeNotificationPopup(
                        popup
                    );

                }
            );

        }


        /*
         * Automatically close after 5 seconds.
         */

        setTimeout(
            function () {

                removeNotificationPopup(
                    popup
                );

            },
            NOTIFICATION_DISPLAY_TIME
        );

    }


    /* =====================================================
       REMOVE POPUP
       ===================================================== */

    function removeNotificationPopup(
        popup
    ) {

        if (!popup) {
            return;
        }


        popup.classList.remove(
            "show"
        );


        setTimeout(
            function () {

                if (
                    popup &&
                    popup.parentNode
                ) {

                    popup.remove();

                }

            },
            300
        );

    }


    /* =====================================================
       GET NOTIFICATION INDEX
       ===================================================== */

    function getNotificationIndex() {

        let index =
            parseInt(
                localStorage.getItem(
                    NOTIFICATION_INDEX_KEY
                ),
                10
            );


        if (
            Number.isNaN(index) ||
            index < 0 ||
            index >= staticNotifications.length
        ) {

            index = 0;

        }


        return index;

    }


    /* =====================================================
       SAVE NEXT NOTIFICATION INDEX
       ===================================================== */

    function saveNextNotificationIndex(
        currentIndex
    ) {

        const nextIndex =
            (
                currentIndex + 1
            ) %
            staticNotifications.length;


        localStorage.setItem(
            NOTIFICATION_INDEX_KEY,
            String(nextIndex)
        );

    }


    /* =====================================================
       SHOW NEXT NOTIFICATION
       ===================================================== */

    /* =====================================================
   SHOW NEXT NOTIFICATION
   ===================================================== */

function showNextNotification() {

    let index =
        getNotificationIndex();


    const notification =
        staticNotifications[index];


    if (!notification) {
        return;
    }


    /*
     * SHOW POPUP
     */

    showNotificationPopup(
        notification
    );


    /*
     * Save notification in history.
     */

    addNotificationToHistory(
        notification
    );


    /*
     * Save exact time.
     */

    localStorage.setItem(
        LAST_NOTIFICATION_TIME_KEY,
        String(Date.now())
    );


    /*
     * If this was the 8th notification,
     * prepare to restart after 1 hour.
     */

    if (
        index ===
        staticNotifications.length - 1
    ) {

        /*
         * Reset index to 0.
         */

        localStorage.setItem(
            NOTIFICATION_INDEX_KEY,
            "0"
        );


        /*
         * Special flag:
         * The next cycle should wait only 1 hour
         * after notification #8.
         */

        localStorage.setItem(
            "krishiMitraCycleComplete",
            "true"
        );

    } else {

        /*
         * Normal notification:
         * move to next notification.
         */

        saveNextNotificationIndex(
            index
        );

    }

}

    /* =====================================================
       CHECK 30-MINUTE SCHEDULE
       ===================================================== */

    /* =====================================================
   CHECK NOTIFICATION SCHEDULE
   ===================================================== */

function checkNotificationSchedule() {

    const lastNotificationTime =
        parseInt(
            localStorage.getItem(
                LAST_NOTIFICATION_TIME_KEY
            ),
            10
        );


    /*
     * FIRST VISIT
     *
     * Show first notification.
     */

    if (
        Number.isNaN(
            lastNotificationTime
        )
    ) {

        showNextNotification();

        return;

    }


    const timePassed =
        Date.now() -
        lastNotificationTime;


    /*
     * Check whether the 8-notification
     * cycle has completed.
     */

    const cycleComplete =
        localStorage.getItem(
            "krishiMitraCycleComplete"
        ) === "true";


    /*
     * AFTER NOTIFICATION #8
     *
     * Wait only 1 hour.
     */

    if (cycleComplete) {

        const ONE_HOUR =
            60 * 60 * 1000;


        if (
            timePassed >= ONE_HOUR
        ) {

            /*
             * Reset cycle.
             */

            localStorage.setItem(
                "krishiMitraNotificationIndex",
                "0"
            );


            localStorage.removeItem(
                "krishiMitraCycleComplete"
            );


            /*
             * Start again with notification #1.
             */

            showNextNotification();

        }


        return;

    }


    /*
     * NORMAL MODE
     *
     * Wait 30 minutes between
     * notifications.
     */

    if (
        timePassed >=
        NOTIFICATION_INTERVAL
    ) {

        showNextNotification();

    }

}

    /* =====================================================
       SETUP BELL BUTTON
       ===================================================== */

    function setupNotificationButton() {

        const button =
            document.getElementById(
                "notification-button"
            );


        const panel =
            document.getElementById(
                "notification-panel"
            );


        if (!button || !panel) {
            return;
        }


        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                /*
                 * Refresh history every time
                 * the bell is clicked.
                 */

                renderNotificationPanel();
                updateNotificationCount();


                panel.classList.toggle(
                    "open"
                );

            }
        );


        /*
         * Prevent clicks inside panel
         * from closing it.
         */

        panel.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

            }
        );


        /*
         * Clicking anywhere outside
         * closes the panel.
         */

        document.addEventListener(
            "click",
            function () {

                panel.classList.remove(
                    "open"
                );

            }
        );

    }


    /* =====================================================
       SETUP MARK ALL BUTTON
       ===================================================== */

    function setupMarkAllButton() {

        const button =
            document.querySelector(
                ".mark-all-notifications"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                markAllNotificationsAsRead();

            }
        );

    }


    /* =====================================================
       INITIALIZE NOTIFICATIONS
       ===================================================== */

    /* =====================================================
   INITIALIZE NOTIFICATIONS
   ===================================================== */

function initializeNotifications() {

    /*
     * Render existing notification history.
     */

    renderNotificationPanel();
    updateNotificationCount();


    /*
     * Setup notification bell.
     */

    setupNotificationButton();


    /*
     * Setup Mark All button.
     */

    setupMarkAllButton();


    /*
     * Wait for Farmer Dashboard.
     *
     * Notification should NOT appear
     * while user is on the landing page.
     */

    function waitForDashboard() {

        const landingPage =
            document.getElementById("landing-page");


        /*
         * If landing page is currently active,
         * wait and check again.
         */

        if (
            document.body.classList.contains(
                "landing-active"
            )
        ) {

            setTimeout(
                waitForDashboard,
                500
            );

            return;

        }


        /*
         * Landing page is no longer active.
         *
         * User has entered the application/dashboard.
         *
         * Wait 5 seconds before showing
         * the first notification.
         */

        setTimeout(
            function () {

                checkNotificationSchedule();

            },
            5000
        );

    }


    /*
     * Start watching for dashboard entry.
     */

    waitForDashboard();


    /*
     * Continue checking every minute
     * for the 30-minute interval.
     */

    setInterval(
        function () {

            /*
             * Don't show notifications
             * while user is on landing page.
             */

            if (
                document.body.classList.contains(
                    "landing-active"
                )
            ) {

                return;

            }


            checkNotificationSchedule();

        },
        60 * 1000
    );

}

    /* =====================================================
       DOM READY
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeNotifications
        );

    } else {

        initializeNotifications();

    }


})();