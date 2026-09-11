/* =========================================================
   KRISHI-MITRA
   AUTH.JS
   Mobile Number Authentication + Profile Continuity
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       DOM ELEMENTS
       ===================================================== */

    const loginModal = document.getElementById("login-modal");

    const mobileForm = document.getElementById("mobile-form");
    const otpForm = document.getElementById("otp-form");

    const mobileInput = document.getElementById("mobile-number");
    const otpInput = document.getElementById("otp-input");

    const otpMobileDisplay =
        document.getElementById("otp-mobile-display");

    const changeMobileButton =
        document.getElementById("change-mobile");

    const profileModal =
        document.getElementById("profile-modal");

    const profileForm =
        document.getElementById("profile-form");


    /* =====================================================
       AUTH STATE
       ===================================================== */

    let enteredMobile = "";

    let generatedOTP = "";

    let otpTimer = null;

    let otpAttempts = 0;


    /* =====================================================
       STORAGE KEYS
       ===================================================== */

    const STORAGE_KEYS = {
        USER: "krishiMitraUser",
        PROFILE: "krishiMitraProfile",
        LOGGED_IN: "krishiMitraLoggedIn"
    };


    /* =====================================================
       UTILITY
       ===================================================== */

    function showElement(element) {

        if (!element) {
            return;
        }

        element.classList.remove("hidden");
    }


    function hideElement(element) {

        if (!element) {
            return;
        }

        element.classList.add("hidden");
    }


    function showToast(message, type = "info") {

        if (
            typeof window.showToast === "function"
        ) {
            window.showToast(message, type);
            return;
        }

        const toastContainer =
            document.getElementById("toast-container");

        if (!toastContainer) {
            return;
        }

        const toast =
            document.createElement("div");

        toast.className =
            `krishi-toast ${type}`;

        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {

            toast.classList.add("show");

        }, 10);

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 3000);
    }


    /* =====================================================
       OPEN MODAL
       ===================================================== */

    function openLoginModal() {

        if (!loginModal) {
            return;
        }

        loginModal.classList.add("active");

        loginModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add("modal-open");

        resetAuthenticationStep();

        setTimeout(() => {

            if (mobileInput) {
                mobileInput.focus();
            }

        }, 200);
    }


    /* =====================================================
       CLOSE MODAL
       ===================================================== */

    function closeLoginModal() {

        if (!loginModal) {
            return;
        }

        loginModal.classList.remove("active");

        loginModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove("modal-open");
    }


    /* =====================================================
       RESET AUTHENTICATION
       ===================================================== */

    function resetAuthenticationStep() {

        enteredMobile = "";
        generatedOTP = "";
        otpAttempts = 0;

        clearTimeout(otpTimer);

        showElement(mobileForm);
        hideElement(otpForm);

        if (mobileInput) {
            mobileInput.value = "";
        }

        if (otpInput) {
            otpInput.value = "";
        }
    }


    /* =====================================================
       VALIDATE MOBILE NUMBER
       ===================================================== */

    function validateMobileNumber(number) {

        return /^[6-9]\d{9}$/.test(number);
    }


    /* =====================================================
       GENERATE DEMO OTP
       ===================================================== */

    function generateOTP() {

        /*
         * Frontend demo OTP.
         *
         * When backend authentication is connected,
         * this function will be replaced by the API
         * response without changing the UI flow.
         */

        return Math.floor(
            100000 + Math.random() * 900000
        ).toString();
    }


    /* =====================================================
       MASK MOBILE NUMBER
       ===================================================== */

    function maskMobileNumber(number) {

        if (!number || number.length !== 10) {
            return "+91 XXXXX XXXXX";
        }

        return (
            "+91 " +
            number.substring(0, 2) +
            "XXXX " +
            number.substring(6)
        );
    }


    /* =====================================================
       SEND OTP
       ===================================================== */

    function sendOTP() {

        if (!mobileInput) {
            return;
        }

        const mobile =
            mobileInput.value
                .replace(/\D/g, "")
                .trim();

        if (!validateMobileNumber(mobile)) {

            showToast(
                "Please enter a valid 10-digit mobile number.",
                "error"
            );

            mobileInput.focus();

            return;
        }

        enteredMobile = mobile;

        generatedOTP = generateOTP();

        otpAttempts = 0;

        if (otpMobileDisplay) {

            otpMobileDisplay.textContent =
                maskMobileNumber(enteredMobile);
        }

        hideElement(mobileForm);
        showElement(otpForm);

        if (otpInput) {
            otpInput.value = "";

            setTimeout(() => {
                otpInput.focus();
            }, 100);
        }

        /*
         * Demo message.
         *
         * In production, OTP will come from backend/SMS API.
         */
        showToast(
            "OTP sent successfully.",
            "success"
        );

        /*
         * Console is useful during frontend development.
         * Remove when backend OTP is connected.
         */
        console.info(
            "Krishi-Mitra Demo OTP:",
            generatedOTP
        );
    }


    /* =====================================================
       VERIFY OTP
       ===================================================== */

    function verifyOTP() {

        if (!otpInput) {
            return;
        }

        const enteredOTP =
            otpInput.value
                .replace(/\D/g, "")
                .trim();

        if (enteredOTP.length !== 6) {

            showToast(
                "Please enter the 6-digit OTP.",
                "error"
            );

            otpInput.focus();

            return;
        }

        otpAttempts++;

        if (enteredOTP !== generatedOTP) {

            showToast(
                "Incorrect OTP. Please try again.",
                "error"
            );

            otpInput.value = "";

            otpInput.focus();

            return;
        }

        completeAuthentication();
    }


    /* =====================================================
       COMPLETE AUTHENTICATION
       ===================================================== */

    function completeAuthentication() {

        clearTimeout(otpTimer);

        const existingProfile =
            getStoredProfile();

        const user = {
            mobile: enteredMobile,
            loggedIn: true,
            authenticatedAt:
                new Date().toISOString()
        };

        localStorage.setItem(
            STORAGE_KEYS.USER,
            JSON.stringify(user)
        );

        localStorage.setItem(
            STORAGE_KEYS.LOGGED_IN,
            "true"
        );

        closeLoginModal();

        showToast(
            "Mobile number verified successfully!",
            "success"
        );

        /*
         * IMPORTANT:
         *
         * Sign-up/login and profile creation are
         * intentionally connected.
         *
         * If the farmer has no profile,
         * profile creation opens immediately.
         */

        if (!existingProfile) {

            setTimeout(() => {

                openProfileCreation();

            }, 350);

            return;
        }

        /*
         * Existing farmer:
         * directly continue to dashboard.
         */

        updateUserInterface(existingProfile);

        setTimeout(() => {

            if (
                typeof window.loadDashboard === "function"
            ) {
                window.loadDashboard();
            }

        }, 300);
    }


    /* =====================================================
       OPEN PROFILE CREATION
       ===================================================== */

    function openProfileCreation() {

        if (!profileModal) {
            return;
        }

        profileModal.classList.add("active");

        profileModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add("modal-open");

        setTimeout(() => {

            const nameInput =
                document.getElementById("farmer-name");

            if (nameInput) {
                nameInput.focus();
            }

        }, 200);
    }


    /* =====================================================
       CLOSE PROFILE CREATION
       ===================================================== */

    function closeProfileCreation() {

        if (!profileModal) {
            return;
        }

        profileModal.classList.remove("active");

        profileModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove("modal-open");
    }


    /* =====================================================
       SAVE PROFILE
       ===================================================== */

    function saveProfile() {

        if (!profileForm) {
            return;
        }

        const formData =
            new FormData(profileForm);

        const profile = {

            name:
                (formData.get("name") || "")
                    .toString()
                    .trim(),

            location:
                (formData.get("location") || "")
                    .toString()
                    .trim(),

            farmSize:
                (formData.get("farmSize") || "")
                    .toString()
                    .trim(),

            crop:
                (formData.get("crop") || "")
                    .toString()
                    .trim(),

            soilType:
                (formData.get("soilType") || "")
                    .toString()
                    .trim(),

            irrigationType:
                (formData.get("irrigationType") || "")
                    .toString()
                    .trim(),

            sowingDate:
                (formData.get("sowingDate") || "")
                    .toString()
                    .trim(),

            mobile: enteredMobile ||
                getStoredMobile(),

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()
        };


        /* ---------- BASIC VALIDATION ---------- */

        if (!profile.name) {

            showToast(
                "Please enter your name.",
                "error"
            );

            return;
        }


        if (!profile.location) {

            showToast(
                "Please enter your location.",
                "error"
            );

            return;
        }


        if (!profile.farmSize) {

            showToast(
                "Please enter your farm size.",
                "error"
            );

            return;
        }


        if (!profile.crop) {

            showToast(
                "Please select your main crop.",
                "error"
            );

            return;
        }


        /* ---------- SAVE ---------- */

        localStorage.setItem(
            STORAGE_KEYS.PROFILE,
            JSON.stringify(profile)
        );


        /* ---------- UPDATE USER ---------- */

        const user = {
            mobile: profile.mobile,
            loggedIn: true,
            profileCreated: true,
            name: profile.name,
            location: profile.location,
            authenticatedAt:
                new Date().toISOString()
        };

        localStorage.setItem(
            STORAGE_KEYS.USER,
            JSON.stringify(user)
        );

        localStorage.setItem(
            STORAGE_KEYS.LOGGED_IN,
            "true"
        );


        /* ---------- CLOSE ---------- */

        closeProfileCreation();


        /* ---------- UPDATE UI ---------- */

        updateUserInterface(profile);


        /* ---------- SUCCESS ---------- */

        showToast(
            `Welcome to Krishi-Mitra, ${profile.name}! 🌱`,
            "success"
        );


        /*
         * Load personalized dashboard
         */

        setTimeout(() => {

            if (
                typeof window.loadDashboard === "function"
            ) {

                window.loadDashboard();

            } else if (
                window.KrishiNavigation &&
                typeof window.KrishiNavigation.loadDashboard === "function"
            ) {

                window.KrishiNavigation.loadDashboard();

            }

        }, 400);
    }


    /* =====================================================
       GET STORED PROFILE
       ===================================================== */

    function getStoredProfile() {

        const stored =
            localStorage.getItem(
                STORAGE_KEYS.PROFILE
            );

        if (!stored) {
            return null;
        }

        try {

            return JSON.parse(stored);

        } catch (error) {

            return null;
        }
    }


    /* =====================================================
       GET STORED MOBILE
       ===================================================== */

    function getStoredMobile() {

        const storedUser =
            localStorage.getItem(
                STORAGE_KEYS.USER
            );

        if (!storedUser) {
            return "";
        }

        try {

            const user =
                JSON.parse(storedUser);

            return user.mobile || "";

        } catch (error) {

            return "";
        }
    }


    /* =====================================================
       CHECK AUTH STATUS
       ===================================================== */

    function isAuthenticated() {

        return (
            localStorage.getItem(
                STORAGE_KEYS.LOGGED_IN
            ) === "true"
        );
    }


    /* =====================================================
       UPDATE TOPBAR PROFILE
       ===================================================== */

    function updateUserInterface(profile) {

        if (!profile) {
            return;
        }

        const profileName =
            document.getElementById(
                "topbar-profile-name"
            );

        const profileStatus =
            document.getElementById(
                "topbar-profile-status"
            );

        const dropdownName =
            document.getElementById(
                "dropdown-profile-name"
            );

        const dropdownStatus =
            document.getElementById(
                "dropdown-profile-status"
            );


        if (profileName) {

            profileName.textContent =
                profile.name || "Farmer";
        }


        if (profileStatus) {

            profileStatus.textContent =
                "Farmer Profile";
        }


        if (dropdownName) {

            dropdownName.textContent =
                profile.name || "Farmer";
        }


        if (dropdownStatus) {

            dropdownStatus.textContent =
                profile.location ||
                "Farmer Profile";
        }

        const heroFarmerName =
            document.getElementById("dashboard-farmer-name");

        if (heroFarmerName && profile.name) {
            heroFarmerName.textContent = profile.name;
        }
    }


    /* =====================================================
       CHANGE MOBILE NUMBER
       ===================================================== */

    function changeMobileNumber() {

        clearTimeout(otpTimer);

        generatedOTP = "";

        if (otpInput) {
            otpInput.value = "";
        }

        showElement(mobileForm);
        hideElement(otpForm);

        if (mobileInput) {
            mobileInput.focus();
        }
    }


    /* =====================================================
       MOBILE FORM SUBMIT
       ===================================================== */

    if (mobileForm) {

        mobileForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                sendOTP();
            }
        );
    }


    /* =====================================================
       OTP FORM SUBMIT
       ===================================================== */

    if (otpForm) {

        otpForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                verifyOTP();
            }
        );
    }


    /* =====================================================
       CHANGE MOBILE BUTTON
       ===================================================== */

    if (changeMobileButton) {

        changeMobileButton.addEventListener(
            "click",
            function () {

                changeMobileNumber();
            }
        );
    }


    /* =====================================================
       PROFILE FORM SUBMIT
       ===================================================== */

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                saveProfile();
            }
        );
    }


    /* =====================================================
       CLOSE MODALS
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const closeButton =
                event.target.closest(
                    "[data-close-modal]"
                );

            if (!closeButton) {
                return;
            }

            const modalId =
                closeButton.getAttribute(
                    "data-close-modal"
                );

            const modal =
                document.getElementById(modalId);

            if (!modal) {
                return;
            }

            modal.classList.remove("active");

            modal.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove(
                "modal-open"
            );
        }
    );


    /* =====================================================
       LOGIN MODAL BACKDROP
       ===================================================== */

    if (loginModal) {

        loginModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === loginModal
                ) {

                    closeLoginModal();
                }
            }
        );
    }


    /* =====================================================
       PROFILE MODAL BACKDROP
       ===================================================== */

    if (profileModal) {

        profileModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === profileModal
                ) {

                    /*
                     * Do not accidentally lose the
                     * profile form. The farmer can
                     * explicitly close it.
                     */

                    return;
                }
            }
        );
    }


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }

            if (
                loginModal &&
                loginModal.classList.contains("active")
            ) {

                closeLoginModal();

                return;
            }

            if (
                profileModal &&
                profileModal.classList.contains("active")
            ) {

                return;
            }
        }
    );


    /* =====================================================
       INITIALIZE EXISTING USER
       ===================================================== */

    function initializeAuth() {

        let profile =
            getStoredProfile();

        if (!profile || !profile.name) {
            try {
                const kUser = localStorage.getItem("krishi_mitra_user");
                if (kUser) {
                    const parsed = JSON.parse(kUser);
                    if (parsed && parsed.name && parsed.name !== "Guest User") {
                        profile = { name: parsed.name, location: parsed.district || "Farmer Profile" };
                    }
                }
            } catch (err) {}
        }

        if (!profile || !profile.name) {
            try {
                const kU = localStorage.getItem("krishiMitraUser");
                if (kU) {
                    const parsed = JSON.parse(kU);
                    if (parsed && parsed.name && parsed.name !== "Guest User") {
                        profile = { name: parsed.name, location: "Farmer Profile" };
                    }
                }
            } catch (err) {}
        }

        if (
            (isAuthenticated() || profile) &&
            profile &&
            profile.name &&
            profile.name !== "Guest User"
        ) {

            updateUserInterface(profile);

        } else {

            const profileName =
                document.getElementById(
                    "topbar-profile-name"
                );

            const profileStatus =
                document.getElementById(
                    "topbar-profile-status"
                );

            if (profileName) {
                profileName.textContent =
                    "Guest User";
            }

            if (profileStatus) {
                profileStatus.textContent =
                    "Guest Mode";
            }
        }
    }


    /* =====================================================
       PUBLIC AUTH API
       ===================================================== */

    window.KrishiAuth = {

        openLogin: openLoginModal,

        closeLogin: closeLoginModal,

        openProfile: openProfileCreation,

        closeProfile: closeProfileCreation,

        isAuthenticated: isAuthenticated,

        getProfile: getStoredProfile,

        getMobile: getStoredMobile,

        logout: function () {

            localStorage.removeItem(
                STORAGE_KEYS.USER
            );

            localStorage.removeItem(
                STORAGE_KEYS.PROFILE
            );

            localStorage.removeItem(
                STORAGE_KEYS.LOGGED_IN
            );

            localStorage.removeItem(
                "krishi_mitra_user"
            );

            sessionStorage.removeItem(
                "krishi_farmer_authenticated"
            );

            window.location.reload();
        }
    };


    /* =====================================================
       GLOBAL HELPERS
       ===================================================== */

    window.openLoginModal = openLoginModal;

    window.openProfileCreation = openProfileCreation;

    window.isKrishiMitraAuthenticated =
        isAuthenticated;


    /* =====================================================
       INITIALIZE
       ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAuth
        );

    } else {

        initializeAuth();
    }

})();