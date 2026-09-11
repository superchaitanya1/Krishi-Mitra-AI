/* =========================================================
   KRISHI-MITRA
   PROFILE.JS
   Farmer Profile Management
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       STORAGE
       ===================================================== */

    const PROFILE_KEY = "krishiMitraProfile";
    const USER_KEY = "krishiMitraUser";


    /* =====================================================
       DOM ELEMENTS
       ===================================================== */

    const profileModal =
        document.getElementById("profile-modal");

    const profileForm =
        document.getElementById("profile-form");


    /* =====================================================
       PROFILE STORAGE
       ===================================================== */

    function getProfile() {

        const stored =
            localStorage.getItem(PROFILE_KEY);

        if (!stored) {
            return null;
        }

        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error(
                "Unable to read farmer profile:",
                error
            );

            return null;
        }
    }


    function saveProfile(profile) {

        localStorage.setItem(
            PROFILE_KEY,
            JSON.stringify(profile)
        );

        updateProfileDisplay(profile);
    }


    /* =====================================================
       USER STORAGE
       ===================================================== */

    function getUser() {

        const stored =
            localStorage.getItem(USER_KEY);

        if (!stored) {
            return null;
        }

        try {
            return JSON.parse(stored);
        } catch (error) {
            return null;
        }
    }


    function updateStoredUser(profile) {

        const existingUser =
            getUser() || {};

        const updatedUser = {

            ...existingUser,

            loggedIn: true,

            profileCreated: true,

            name: profile.name,

            location: profile.location,

            mobile:
                profile.mobile ||
                existingUser.mobile ||
                ""
        };

        localStorage.setItem(
            USER_KEY,
            JSON.stringify(updatedUser)
        );
    }


    /* =====================================================
       OPEN PROFILE MODAL
       ===================================================== */

    function openProfile() {

        if (!profileModal) {
            return;
        }

        const profile = getProfile();

        if (profile) {
            populateForm(profile);
        }

        profileModal.classList.add("active");

        profileModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

        setTimeout(() => {

            const nameInput =
                document.getElementById(
                    "farmer-name"
                );

            if (nameInput) {
                nameInput.focus();
            }

        }, 150);
    }


    /* =====================================================
       CLOSE PROFILE MODAL
       ===================================================== */

    function closeProfile() {

        if (!profileModal) {
            return;
        }

        profileModal.classList.remove("active");

        profileModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );
    }


    /* =====================================================
       POPULATE PROFILE FORM
       ===================================================== */

    function populateForm(profile) {

        const fields = {

            "farmer-name":
                profile.name || "",

            "farmer-location":
                profile.location || "",

            "farm-size":
                profile.farmSize || "",

            "main-crop":
                profile.crop || "",

            "soil-type":
                profile.soilType || "",

            "irrigation-type":
                profile.irrigationType || "",

            "sowing-date":
                profile.sowingDate || ""
        };


        Object.keys(fields).forEach(
            function (id) {

                const element =
                    document.getElementById(id);

                if (element) {
                    element.value =
                        fields[id];
                }
            }
        );
    }


    /* =====================================================
       COLLECT PROFILE FORM DATA
       ===================================================== */

    function collectProfileData() {

        const formData =
            new FormData(profileForm);

        const existingProfile =
            getProfile();

        const user =
            getUser();

        return {

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

            mobile:
                (existingProfile &&
                    existingProfile.mobile) ||
                (user && user.mobile) ||
                "",

            createdAt:
                (existingProfile &&
                    existingProfile.createdAt) ||
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()
        };
    }


    /* =====================================================
       VALIDATE PROFILE
       ===================================================== */

    function validateProfile(profile) {

        if (!profile.name) {

            showMessage(
                "Please enter your name.",
                "error"
            );

            focusField("farmer-name");

            return false;
        }


        if (!profile.location) {

            showMessage(
                "Please enter your village or city.",
                "error"
            );

            focusField("farmer-location");

            return false;
        }


        if (!profile.farmSize) {

            showMessage(
                "Please enter your farm size.",
                "error"
            );

            focusField("farm-size");

            return false;
        }


        if (
            Number(profile.farmSize) <= 0
        ) {

            showMessage(
                "Farm size must be greater than 0.",
                "error"
            );

            focusField("farm-size");

            return false;
        }


        if (!profile.crop) {

            showMessage(
                "Please select your main crop.",
                "error"
            );

            focusField("main-crop");

            return false;
        }


        return true;
    }


    /* =====================================================
       SAVE PROFILE FROM FORM
       ===================================================== */

    function handleProfileSubmit(event) {

        event.preventDefault();

        if (!profileForm) {
            return;
        }

        const profile =
            collectProfileData();

        if (!validateProfile(profile)) {
            return;
        }

        saveProfile(profile);

        updateStoredUser(profile);

        closeProfile();

        showMessage(
            `Profile saved successfully. Welcome, ${profile.name}! 🌱`,
            "success"
        );


        /*
         * Refresh dashboard if dashboard.js
         * has already been loaded.
         */

        setTimeout(() => {

            if (
                typeof window.loadDashboard ===
                "function"
            ) {

                window.loadDashboard();

            }

        }, 300);
    }


    /* =====================================================
       UPDATE TOPBAR PROFILE
       ===================================================== */

    function updateProfileDisplay(profile) {

        if (!profile) {
            return;
        }


        const topbarName =
            document.getElementById(
                "topbar-profile-name"
            );

        const topbarStatus =
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


        if (topbarName) {

            topbarName.textContent =
                profile.name ||
                "Farmer";
        }


        if (topbarStatus) {

            topbarStatus.textContent =
                "Farmer Profile";
        }


        if (dropdownName) {

            dropdownName.textContent =
                profile.name ||
                "Farmer";
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
       FOCUS FIELD
       ===================================================== */

    function focusField(id) {

        const field =
            document.getElementById(id);

        if (!field) {
            return;
        }

        setTimeout(() => {

            field.focus();

        }, 100);
    }


    /* =====================================================
       MESSAGE / TOAST
       ===================================================== */

    function showMessage(
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
            document.createElement("div");

        toast.className =
            `krishi-toast ${type}`;

        toast.textContent =
            message;

        container.appendChild(toast);


        requestAnimationFrame(() => {

            toast.classList.add("show");

        });


        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 3000);
    }


    /* =====================================================
       CHECK WHETHER PROFILE EXISTS
       ===================================================== */

    function hasProfile() {

        return getProfile() !== null;
    }


    /* =====================================================
       REQUIRE PROFILE
       ===================================================== */

    function requireProfile() {

        if (hasProfile()) {
            return true;
        }

        openProfile();

        return false;
    }


    /* =====================================================
       RESET PROFILE FORM
       ===================================================== */

    function resetProfileForm() {

        if (!profileForm) {
            return;
        }

        profileForm.reset();
    }


    /* =====================================================
       PROFILE FORM SUBMIT
       ===================================================== */

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            handleProfileSubmit
        );
    }


    /* =====================================================
       PROFILE BUTTON
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const profileAction =
                event.target.closest(
                    '[data-action="profile"]'
                );

            if (!profileAction) {
                return;
            }

            event.preventDefault();

            openProfile();
        }
    );


    /* =====================================================
       INITIALIZE EXISTING PROFILE
       ===================================================== */

    function initializeProfile() {

        let profile =
            getProfile();

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

        if (!profile) {
            return;
        }

        updateProfileDisplay(profile);
    }


    /* =====================================================
       PUBLIC PROFILE API
       ===================================================== */

    window.KrishiProfile = {

        get: getProfile,

        save: saveProfile,

        open: openProfile,

        close: closeProfile,

        hasProfile: hasProfile,

        require: requireProfile,

        updateDisplay:
            updateProfileDisplay,

        reset:
            resetProfileForm
    };


    /* =====================================================
       GLOBAL HELPERS
       ===================================================== */

    window.openProfileModal =
        openProfile;

    window.closeProfileModal =
        closeProfile;

    window.hasKrishiMitraProfile =
        hasProfile;


    /* =====================================================
       START
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeProfile
        );

    } else {

        initializeProfile();
    }

})();