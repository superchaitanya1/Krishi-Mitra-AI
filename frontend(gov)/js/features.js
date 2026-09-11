/* =========================================================
   KRISHI-MITRA
   FEATURES.JS
   Feature Access + Module Actions
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       MODULE CONFIGURATION
       ===================================================== */

    const MODULES = {

        dashboard: {
            name: "Dashboard",
            requiresProfile: false
        },

        "my-farm": {
            name: "My Farm",
            requiresProfile: true
        },

        "crop-doctor": {
            name: "AI Crop Doctor",
            requiresProfile: true
        },

        "mitra-ai": {
            name: "Mitra AI",
            requiresProfile: true
        },

        weather: {
            name: "Weather",
            requiresProfile: false
        },

        market: {
            name: "Market Prices",
            requiresProfile: false
        },

        irrigation: {
            name: "Irrigation",
            requiresProfile: true
        },

        insights: {
            name: "Farm Insights",
            requiresProfile: true
        },

        schemes: {
            name: "Government Schemes",
            requiresProfile: false
        },

        notifications: {
            name: "Notifications",
            requiresProfile: true
        }
    };


    /* =====================================================
       AUTH HELPERS
       ===================================================== */

    function isLoggedIn() {

        if (
            window.KrishiAuth &&
            typeof window.KrishiAuth.isAuthenticated ===
                "function"
        ) {
            return window.KrishiAuth.isAuthenticated();
        }

        return (
            localStorage.getItem(
                "krishiMitraLoggedIn"
            ) === "true"
        );
    }


    function hasProfile() {

        if (
            window.KrishiProfile &&
            typeof window.KrishiProfile.hasProfile ===
                "function"
        ) {
            return window.KrishiProfile.hasProfile();
        }

        return (
            localStorage.getItem(
                "krishiMitraProfile"
            ) !== null
        );
    }


    /* =====================================================
       OPEN SIGN-IN
       ===================================================== */

    function openSignIn() {

        if (
            window.KrishiAuth &&
            typeof window.KrishiAuth.openLogin ===
                "function"
        ) {

            window.KrishiAuth.openLogin();

            return;
        }

        if (
            typeof window.openLoginModal ===
                "function"
        ) {

            window.openLoginModal();
        }
    }


    /* =====================================================
       OPEN PROFILE
       ===================================================== */

    function openProfile() {

        if (
            window.KrishiProfile &&
            typeof window.KrishiProfile.open ===
                "function"
        ) {

            window.KrishiProfile.open();

            return;
        }

        if (
            typeof window.openProfileModal ===
                "function"
        ) {

            window.openProfileModal();
        }
    }


    /* =====================================================
       SHOW ACCESS MODAL
       ===================================================== */

    function showAccessModal(
        moduleName
    ) {

        const modal =
            document.getElementById(
                "access-modal"
            );

        if (!modal) {
            return;
        }


        const message =
            document.getElementById(
                "access-modal-message"
            );


        if (message) {

            message.textContent =
                `Sign in to use ${moduleName} and get personalized farming guidance.`;
        }


        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );
    }


    /* =====================================================
       CLOSE ACCESS MODAL
       ===================================================== */

    function closeAccessModal() {

        const modal =
            document.getElementById(
                "access-modal"
            );

        if (!modal) {
            return;
        }

        modal.classList.remove(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );
    }


    /* =====================================================
       CHECK MODULE ACCESS
       ===================================================== */

    function checkModuleAccess(
        moduleId
    ) {

        const module =
            MODULES[moduleId];

        if (!module) {
            return true;
        }


        /*
         * Public modules can be opened
         * without authentication.
         */

        if (!module.requiresProfile) {
            return true;
        }


        /*
         * Personalized modules require
         * sign-in first.
         */

        if (!isLoggedIn()) {

            showAccessModal(
                module.name
            );

            return false;
        }


        /*
         * Logged-in farmer without profile
         * should immediately complete profile.
         */

        if (!hasProfile()) {

            openProfile();

            return false;
        }


        return true;
    }


    /* =====================================================
       HANDLE MODULE CLICK
       ===================================================== */

    function handleModuleClick(
        moduleId
    ) {

        if (!moduleId) {
            return;
        }


        if (
            !checkModuleAccess(
                moduleId
            )
        ) {

            return;
        }


        /*
         * Navigation.js is responsible for
         * actually loading the selected module.
         */

        if (
            window.KrishiNavigation &&
            typeof window.KrishiNavigation.navigate ===
                "function"
        ) {

            window.KrishiNavigation.navigate(
                moduleId
            );

            return;
        }


        /*
         * Compatibility with navigation.js
         * implementations that use loadModule().
         */

        if (
            window.KrishiNavigation &&
            typeof window.KrishiNavigation.loadModule ===
                "function"
        ) {

            window.KrishiNavigation.loadModule(
                moduleId
            );

            return;
        }


        /*
         * Compatibility fallback.
         */

        if (
            typeof window.navigateToModule ===
                "function"
        ) {

            window.navigateToModule(
                moduleId
            );
        }
    }


    /* =====================================================
       SIDEBAR MODULE CLICKS
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const moduleButton =
                event.target.closest(
                    "[data-module]"
                );

            if (!moduleButton) {
                return;
            }


            /*
             * Do not interfere with buttons
             * handled by other components.
             */

            if (
                moduleButton.closest(
                    ".topbar"
                )
            ) {
                return;
            }


            const moduleId =
                moduleButton.getAttribute(
                    "data-module"
                );


            if (!moduleId) {
                return;
            }


            /*
             * Navigation.js may also listen to
             * this same button. This access check
             * is performed before navigation.
             */

            if (
                !checkModuleAccess(
                    moduleId
                )
            ) {

                event.preventDefault();

                event.stopImmediatePropagation();

                return;
            }

        },
        true
    );


    /* =====================================================
       ACCESS MODAL ACTIONS
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const signInButton =
                event.target.closest(
                    '[data-action="signin"]'
                );


            if (signInButton) {

                event.preventDefault();

                closeAccessModal();

                const isLoggedIn =
                    localStorage.getItem("krishiMitraLoggedIn") === "true";

                if (isLoggedIn) {
                    if (window.KrishiAuth && typeof window.KrishiAuth.logout === "function") {
                        window.KrishiAuth.logout();
                        return;
                    }
                    localStorage.removeItem("krishiMitraLoggedIn");
                    localStorage.removeItem("krishi_mitra_user");
                    sessionStorage.removeItem("krishi_farmer_authenticated");
                    window.location.reload();
                    return;
                }

                const lang = (window.KrishiTranslation && typeof window.KrishiTranslation.getLanguage === "function")
                    ? window.KrishiTranslation.getLanguage()
                    : "en";

                window.location.href = "../modules/farmer_auth.html?lang=" + encodeURIComponent(lang);

                return;
            }


            const signUpButton =
                event.target.closest(
                    '[data-action="signup"]'
                );


            if (signUpButton) {

                event.preventDefault();

                closeAccessModal();

                const lang = (window.KrishiTranslation && typeof window.KrishiTranslation.getLanguage === "function")
                    ? window.KrishiTranslation.getLanguage()
                    : "en";

                window.location.href = "../modules/farmer_auth.html?lang=" + encodeURIComponent(lang);

                return;
            }


            const closeButton =
                event.target.closest(
                    '[data-close-modal="access-modal"]'
                );


            if (closeButton) {

                closeAccessModal();
            }
        }
    );


    /* =====================================================
       QUICK FEATURE ACTIONS
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const actionElement =
                event.target.closest(
                    "[data-feature]"
                );

            if (!actionElement) {
                return;
            }


            const feature =
                actionElement.getAttribute(
                    "data-feature"
                );


            if (!feature) {
                return;
            }


            if (
                !checkModuleAccess(
                    feature
                )
            ) {

                event.preventDefault();

                return;
            }


            handleModuleClick(
                feature
            );
        }
    );


    /* =====================================================
       PROFILE ACTION
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const profileButton =
                event.target.closest(
                    '[data-action="profile"]'
                );

            if (!profileButton) {
                return;
            }

            event.preventDefault();

            openProfile();
        }
    );


    /* =====================================================
       HELP ACTION
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const helpButton =
                event.target.closest(
                    '[data-action="help"]'
                );

            if (!helpButton) {
                return;
            }

            event.preventDefault();

            showFeatureMessage(
                "Need help? You can use Mitra AI or explore the Help & Support section for guidance.",
                "info"
            );
        }
    );


    /* =====================================================
       FEATURE MESSAGE
       ===================================================== */

    function showFeatureMessage(
        message,
        type = "info"
    ) {

        if (
            typeof window.showToast ===
                "function"
        ) {

            window.showToast(
                message,
                type
            );

            return;
        }


        const container =
            document.getElementById(
                "toast-container"
            );

        if (!container) {
            return;
        }


        const toast =
            document.createElement(
                "div"
            );

        toast.className =
            `krishi-toast ${type}`;

        toast.textContent =
            message;


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


        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

                setTimeout(
                    function () {

                        toast.remove();

                    },
                    300
                );

            },
            3500
        );
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.KrishiFeatures = {

        modules: MODULES,

        checkAccess:
            checkModuleAccess,

        openSignIn:
            openSignIn,

        openProfile:
            openProfile,

        showAccessModal:
            showAccessModal,

        closeAccessModal:
            closeAccessModal,

        handleModuleClick:
            handleModuleClick,

        isLoggedIn:
            isLoggedIn,

        hasProfile:
            hasProfile
    };


    /* =====================================================
       GLOBAL HELPERS
       ===================================================== */

    window.checkKrishiMitraAccess =
        checkModuleAccess;


    window.showKrishiMitraAccessModal =
        showAccessModal;


})();