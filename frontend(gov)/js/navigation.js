/* navigation.js
=========================================================
   KRISHI-MITRA
   NAVIGATION.JS
   FINAL MODULE NAVIGATION CONTROLLER
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       MODULE CONFIGURATION
       ===================================================== */

    const MODULE_ALIASES = {

        "dashboard": "dashboard",

        "my-farm": "my-farm",

        "crop-doctor": "crop-doctor",

        "mitra-ai": "mitra",
        "mitra": "mitra",

        "weather": "weather",

        "market": "market",

        "irrigation": "irrigation",

        "insights": "insights",

        "schemes": "schemes",

        "notifications": "notifications",

        "transportation": "transportation",

        "cold-storage": "cold-storage",

        "fpo-bulk-selling": "fpo-bulk-selling",

        /* =========================
           BUYER
           ========================= */

        "buyer-dashboard": "buyer-dashboard"

    };


    /* =====================================================
       GET MODULE
       ===================================================== */

    function getModuleSection(moduleName) {

        const sectionName =
            MODULE_ALIASES[moduleName] ||
            moduleName;

        return document.querySelector(
            `[data-module-section="${sectionName}"]`
        );
    }


    /* =====================================================
       SHOW MODULE
       ===================================================== */

    function showModule(moduleName) {

        const sectionName =
            MODULE_ALIASES[moduleName] ||
            moduleName;


        const target =
            getModuleSection(moduleName);


        /* =================================================
           INTEGRATED FRIEND MODULE CONTAINMENT FIX
           Move integrated module sections to body when opened
           so the existing fixed secondary-module layout keeps
           them inside the right-side context area.
           ================================================= */

        const integratedSections = [
            "crop-doctor",
            "market",
            "cold-storage",
            "transportation",
            "fpo-bulk-selling"
        ];

        if (
            integratedSections.includes(sectionName) &&
            target &&
            target.parentElement !== document.body
        ) {
            document.body.appendChild(target);
        }


        /* =================================================
           GOVERNMENT SCHEMES CONTAINMENT FIX
           The schemes section can be parsed inside the Weather
           markup because of the existing legacy HTML nesting.
           Move it to body when opened so it is not hidden by
           the Weather section and can use the same right-side
           viewport alignment as the other secondary modules.
           ================================================= */

        if (
            sectionName === "schemes" &&
            target &&
            target.parentElement !== document.body
        ) {
            document.body.appendChild(target);
        }


        /* =================================================
           MODULE NOT FOUND
           ================================================= */

        if (!target) {

            console.error(
                "Krishi-Mitra: Module not found:",
                sectionName
            );

            return;
        }


        /* =================================================
           HIDE ALL MODULES
           ================================================= */

        document
            .querySelectorAll(
                "[data-module-section]"
            )
            .forEach(function (section) {

                section.hidden = true;

                section.classList.remove(
                    "active"
                );

            });


        /* =================================================
           SHOW TARGET MODULE
           ================================================= */

        target.hidden = false;

        target.classList.add(
            "active"
        );


        /* =================================================
           BUYER EXTRA VISIBILITY
           ================================================= */

        if (
            sectionName ===
            "buyer-dashboard"
        ) {

            target.style.display =
                "block";

        }


        /* =================================================
           SIDEBAR ACTIVE STATE
           ================================================= */

        document
            .querySelectorAll(
                ".nav-item[data-module]"
            )
            .forEach(function (item) {

                const itemModule =
                    item.getAttribute(
                        "data-module"
                    );


                const itemSection =
                    MODULE_ALIASES[itemModule] ||
                    itemModule;


                item.classList.toggle(
                    "active",
                    itemSection ===
                    sectionName
                );

            });


        /* =================================================
           APPLICATION STATE
           ================================================= */

        if (
            window.KrishiApp &&
            window.KrishiApp.state
        ) {

            window.KrishiApp.state.currentModule =
                sectionName;

        }


        /* =================================================
           CLOSE MOBILE SIDEBAR
           ================================================= */

        if (
            window.KrishiApp &&
            typeof window.KrishiApp.closeSidebar ===
                "function"
        ) {

            window.KrishiApp.closeSidebar();

        }


        /* =================================================
           MODULE CHANGE EVENT
           ================================================= */

        document.dispatchEvent(
            new CustomEvent(
                "krishi:module-changed",
                {
                    detail: {
                        module:
                            sectionName
                    }
                }
            )
        );


        /* =================================================
           SCROLL TO TOP
           ================================================= */

        const content =
            document.getElementById(
                "content-area"
            );


        if (content) {

            content.scrollTop = 0;

        }


        window.scrollTo(
            0,
            0
        );

    }


    /* =====================================================
       NAVIGATION CLICK HANDLER
       ===================================================== */

    function setupNavigation() {

        document.addEventListener(
            "click",
            function (event) {

                const trigger =
                    event.target.closest(
                        "[data-module]"
                    );


                if (!trigger) {
                    return;
                }


                if (
                    trigger.disabled ||
                    trigger.getAttribute(
                        "aria-disabled"
                    ) === "true"
                ) {

                    return;

                }


                const moduleName =
                    trigger.getAttribute(
                        "data-module"
                    );


                if (!moduleName) {
                    return;
                }


                event.preventDefault();


                showModule(
                    moduleName
                );

            }
        );

    }


    /* =====================================================
       INITIAL MODULE
       ===================================================== */

    function initializeNavigation() {

        setupNavigation();


        const dashboard =
            getModuleSection(
                "dashboard"
            );


        // After switching back to English, restore the exact Farmer module
        // that was open before the page reload.
        let restoreModule = "dashboard";
        try {
            const savedReturn = sessionStorage.getItem("krishiEnglishReturn");
            if (savedReturn) {
                const parsed = JSON.parse(savedReturn);
                if (parsed && parsed.context === "farmer" && parsed.module) {
                    restoreModule = parsed.module;
                }
                // app.js removes this marker after it hides the landing page.
            }
        } catch (error) {}

        if (dashboard) {

            showModule(
                restoreModule
            );

        }

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.KrishiNavigation = {

        showModule:
            showModule,

        getModuleSection:
            getModuleSection

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
            initializeNavigation
        );

    } else {

        initializeNavigation();

    }

})();