/* =========================================================
   KRISHI-MITRA BUYER DASHBOARD
   FRONTEND JAVASCRIPT
   FINAL BUYER VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".dashboard-section");

    const mobileMenu = document.getElementById("mobileMenu");
    const sidebar = document.getElementById("buyerSidebar");

    const notificationBtn = document.getElementById("notificationBtn");
    const notificationPanel = document.getElementById("notificationPanel");
    const closeNotifications = document.getElementById("closeNotifications");

    const globalSearch = document.getElementById("globalSearch");
    const browseProduceBtn = document.getElementById("browseProduceBtn");

    const produceSearch = document.getElementById("produceSearch");
    const locationFilter = document.getElementById("locationFilter");
    const qualityFilter = document.getElementById("qualityFilter");
    const priceFilter = document.getElementById("priceFilter");

    const browseGrid = document.getElementById("browseGrid");
    const noResults = document.getElementById("noResults");

    const detailsModal = document.getElementById("detailsModal");

    const modalClose = document.getElementById("modalClose");
    const modalTitle = document.getElementById("modalTitle");
    const modalFarmer = document.getElementById("modalFarmer");
    const modalProduceIcon = document.getElementById("modalProduceIcon");

    const contactFarmerBtn =
        document.getElementById("contactFarmerBtn");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    const savedList = document.getElementById("savedList");


    /* =====================================================
       FARMER / CROP CONTACT DATA
       Frontend demo data only
    ===================================================== */

    const farmerContacts = {
        "Rajesh Patil": "+91 XXXXX XXXXX",
        "Suresh More": "+91 XXXXX XXXXX",
        "Mahesh Shinde": "+91 XXXXX XXXXX",
        "Anita Jadhav": "+91 XXXXX XXXXX",
        "Sunil Jadhav": "+91 XXXXX XXXXX"
    };


    /* =====================================================
       SMALL LAYOUT FIXES FOR CURRENT HTML
       Only affects the newly modified buyer sections.
    ===================================================== */

    const layoutStyle = document.createElement("style");

    layoutStyle.textContent = `
        /* ===== MODAL STRUCTURE FIX ===== */

        .details-modal {
            width: min(520px, calc(100vw - 30px));
            max-height: calc(100vh - 40px);
            overflow-y: auto;
        }

        .details-modal > .modal-details-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            margin-top: 18px;
        }

        .details-modal > .modal-details-grid > div {
            min-width: 0;
            padding: 12px;
            background: var(--cream);
            border: 1px solid var(--soft-border);
            border-radius: 10px;
        }

        .details-modal > .modal-details-grid > div span {
            display: block;
            margin-bottom: 5px;
            color: var(--muted-text);
            font-size: 9px;
            font-weight: 600;
        }

        .details-modal > .modal-details-grid > div strong {
            display: block;
            color: var(--dark-text);
            font-family: var(--font-display);
            font-size: 11px;
            line-height: 1.4;
        }

        .modal-farmer-info {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            margin-top: 14px;
            padding: 14px;
            background: var(--cream);
            border: 1px solid var(--soft-border);
            border-radius: 12px;
        }

        .modal-farmer-item {
            min-width: 0;
        }

        .modal-farmer-item span {
            display: block;
            margin-bottom: 5px;
            color: var(--muted-text);
            font-size: 9px;
            font-weight: 600;
        }

        .modal-farmer-item strong {
            display: block;
            color: var(--dark-text);
            font-family: var(--font-display);
            font-size: 11px;
            font-weight: 700;
            line-height: 1.4;
            word-break: break-word;
        }

        .modal-contact-btn {
            width: 100%;
            margin-top: 16px;
        }


        /* ===== SAVED CROPS ===== */

        .saved-list {
            width: 100%;
        }

        .saved-crop-card {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            margin-bottom: 14px;
            background: var(--white);
            border: 1px solid var(--soft-border);
            border-radius: 14px;
            box-shadow: 0 3px 15px rgba(72, 42, 32, 0.035);
        }

        .saved-crop-icon {
            width: 54px;
            height: 54px;
            flex: 0 0 54px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--soft-terracotta);
            border-radius: 12px;
            font-size: 27px;
        }

        .saved-crop-content {
            flex: 1;
            min-width: 0;
        }

        .saved-crop-content h3 {
            margin: 0 0 4px;
            color: var(--dark-text);
            font-family: var(--font-display);
            font-size: 14px;
        }

        .saved-crop-content p {
            margin: 0 0 7px;
            color: var(--secondary-text);
            font-size: 10px;
        }

        .saved-crop-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            color: var(--muted-text);
            font-size: 9px;
        }

        .saved-crop-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
        }

        .saved-crop-actions button {
            min-height: 34px;
            padding: 7px 12px;
            border-radius: 8px;
            font-family: var(--font-main);
            font-size: 9px;
            font-weight: 700;
            cursor: pointer;
        }

        .saved-view-btn {
            border: 1px solid var(--border);
            background: var(--white);
            color: var(--deep-terracotta);
        }

        .saved-remove-btn {
            border: 1px solid var(--border);
            background: var(--white);
            color: var(--secondary-text);
        }

        .saved-view-btn:hover,
        .saved-remove-btn:hover {
            background: var(--soft-terracotta);
            border-color: var(--primary-terracotta);
        }


        /* ===== HARVEST / TRANSPORT ALIGNMENT ===== */

        .harvest-card,
        .transport-card {
            min-width: 0;
        }

        .harvest-main,
        .transport-crop-details {
            min-width: 0;
        }

        .harvest-bottom,
        .transport-footer {
            min-width: 0;
        }


        /* ===== MOBILE ===== */

        @media (max-width: 650px) {

            .details-modal > .modal-details-grid,
            .modal-farmer-info {
                grid-template-columns: 1fr;
            }

            .saved-crop-card {
                align-items: flex-start;
                flex-wrap: wrap;
            }

            .saved-crop-content {
                width: calc(100% - 70px);
            }

            .saved-crop-actions {
                width: 100%;
                margin-left: 70px;
            }

            .harvest-info,
            .transport-info {
                grid-template-columns: 1fr;
            }

            .harvest-info-item,
            .transport-info-item {
                padding: 10px 0;
                border-right: none;
                border-bottom: 1px solid var(--soft-border);
            }

            .harvest-info-item:last-child,
            .transport-info-item:last-child {
                border-bottom: none;
            }

            .harvest-bottom,
            .transport-footer {
                align-items: flex-start;
                flex-direction: column;
            }

            .harvest-actions,
            .transport-actions {
                width: 100%;
                flex-wrap: wrap;
            }

            .harvest-actions button,
            .transport-actions button {
                flex: 1;
            }
        }
    `;

    document.head.appendChild(layoutStyle);


    /* =====================================================
       TOAST
    ===================================================== */

    let toastTimer;

    function showToast(message) {

        if (!toast || !toastMessage) {
            return;
        }

        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }


    /* =====================================================
       SECTION NAVIGATION
    ===================================================== */

    function showSection(sectionId) {

        if (!sectionId) {
            return;
        }

        /*
         * Old HTML may still contain data-section="delivery".
         * Convert it to the new Transport section.
         */
        if (sectionId === "delivery") {
            sectionId = "transport";
        }

        sections.forEach(function (section) {
            section.classList.remove("active-section");
        });

        const targetSection =
            document.getElementById(sectionId);

        if (targetSection) {
            targetSection.classList.add("active-section");
        }

        navItems.forEach(function (item) {

            item.classList.remove("active");

            let itemSection = item.dataset.section;

            if (itemSection === "delivery") {
                itemSection = "transport";
            }

            if (itemSection === sectionId) {
                item.classList.add("active");
            }
        });

        if (sidebar) {
            sidebar.classList.remove("mobile-open");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    navItems.forEach(function (item) {

        item.addEventListener("click", function () {

            showSection(item.dataset.section);

        });

    });


    document.querySelectorAll("[data-section-target]")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                showSection(
                    button.dataset.sectionTarget
                );

            });

        });


    if (browseProduceBtn) {

        browseProduceBtn.addEventListener("click", function () {
            showSection("browse");
        });

    }

    // Restore the Buyer section after English is selected. English switching
    // reloads this same Buyer URL so Google Translator can return to the
    // original English DOM without sending the user to Farmer/Landing.
    try {
        const savedReturn = sessionStorage.getItem("krishiEnglishReturn");
        if (savedReturn) {
            const parsed = JSON.parse(savedReturn);
            if (parsed && parsed.context === "buyer") {
                showSection(parsed.section || "dashboard");
                sessionStorage.removeItem("krishiEnglishReturn");
            }
        }
    } catch (error) {}

    /* =====================================================
       BUYER PROFILE SYNC
    ===================================================== */
    function syncBuyerProfile() {
        try {
            const rawUser = localStorage.getItem("krishi_mitra_user");
            if (rawUser) {
                const userObj = JSON.parse(rawUser);
                if (userObj && userObj.role === "buyer") {
                    const profileNameEl = document.querySelector(".buyer-profile-top .profile-name strong");
                    const profileRoleEl = document.querySelector(".buyer-profile-top .profile-name span");
                    const heroGreetingEl = document.querySelector(".buyer-hero .hero-content h1");
                    const displayName = userObj.name && userObj.name !== "Guest User" ? userObj.name : (userObj.company || "Buyer");

                    if (profileNameEl) profileNameEl.textContent = displayName;
                    if (profileRoleEl) profileRoleEl.textContent = userObj.company ? userObj.company : "Buyer Profile";
                    if (heroGreetingEl) heroGreetingEl.textContent = `Good Morning, ${displayName} 🌾`;
                }
            }
        } catch (err) {}
    }
    syncBuyerProfile();
    window.addEventListener("DOMContentLoaded", syncBuyerProfile);
    window.addEventListener("storage", function (e) {
        if (e.key === "krishi_mitra_user") syncBuyerProfile();
    });


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    if (mobileMenu && sidebar) {

        mobileMenu.addEventListener("click", function () {

            sidebar.classList.toggle("mobile-open");

        });

    }


    /* =====================================================
       LANGUAGE
       Current HTML uses:
       English | हिन्दी | मराठी
    ===================================================== */

    const languageOptions =
        document.querySelectorAll(".language-option");

    languageOptions.forEach(function (button) {

        button.addEventListener("click", function () {

            languageOptions.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            const selected =
                button.dataset.language || button.textContent.trim();

            const languageMap = {
                English: "en",
                Hindi: "hi",
                Marathi: "mr"
            };

            const language = languageMap[selected] || selected;

            if (window.KrishiTranslation) {
                window.KrishiTranslation.setLanguage(language);
            }

            showToast(
                language === "hi"
                    ? "भाषा हिन्दी में बदल दी गई है।"
                    : language === "mr"
                        ? "भाषा मराठीत बदलली आहे।"
                        : "Language changed to English."
            );

        });

    });


    // Keep the buyer language buttons aligned with the shared platform language.
    if (window.KrishiTranslation) {
        const savedLanguage = window.KrishiTranslation.getLanguage();
        const savedName = { en: "English", hi: "Hindi", mr: "Marathi" }[savedLanguage];
        languageOptions.forEach(function (button) {
            button.classList.toggle(
                "active",
                button.dataset.language === savedName
            );
        });
    }


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    if (notificationBtn && notificationPanel) {

        notificationBtn.addEventListener("click", function (event) {

            event.stopPropagation();

            notificationPanel.classList.toggle("show");

        });

    }


    if (closeNotifications && notificationPanel) {

        closeNotifications.addEventListener("click", function () {

            notificationPanel.classList.remove("show");

        });

    }


    document.addEventListener("click", function (event) {

        if (
            notificationPanel &&
            notificationBtn &&
            notificationPanel.classList.contains("show") &&
            !notificationPanel.contains(event.target) &&
            !notificationBtn.contains(event.target)
        ) {
            notificationPanel.classList.remove("show");
        }

    });


    /* =====================================================
       GLOBAL SEARCH
    ===================================================== */

    if (globalSearch) {

        globalSearch.addEventListener("keydown", function (event) {

            if (event.key !== "Enter") {
                return;
            }

            const searchValue =
                globalSearch.value.trim();

            if (searchValue === "") {
                return;
            }

            showSection("browse");

            if (produceSearch) {

                produceSearch.value = searchValue;

                filterProduce();

            }

        });

    }


    /* =====================================================
       BROWSE FILTER
    ===================================================== */

    function filterProduce() {

        if (!browseGrid) {
            return;
        }

        const cards =
            browseGrid.querySelectorAll(".browse-card");

        const searchValue =
            produceSearch
                ? produceSearch.value.toLowerCase().trim()
                : "";

        const locationValue =
            locationFilter
                ? locationFilter.value
                : "all";

        const qualityValue =
            qualityFilter
                ? qualityFilter.value
                : "all";

        const priceValue =
            priceFilter
                ? priceFilter.value
                : "all";

        let visibleCount = 0;


        cards.forEach(function (card) {

            const name =
                (card.dataset.name || "").toLowerCase();

            const location =
                (card.dataset.location || "").toLowerCase();

            const price =
                Number(card.dataset.price || 0);

            const qualityElement =
                card.querySelector(".quality-badge");

            const quality =
                qualityElement
                    ? qualityElement.textContent
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                    : "";


            const matchesSearch =
                searchValue === "" ||
                name.includes(searchValue);


            const matchesLocation =
                locationValue === "all" ||
                location === locationValue;


            const matchesQuality =
                qualityValue === "all" ||
                quality === qualityValue;


            let matchesPrice = true;

            if (priceValue === "low") {
                matchesPrice = price < 25;
            }

            if (priceValue === "medium") {
                matchesPrice =
                    price >= 25 && price <= 30;
            }

            if (priceValue === "high") {
                matchesPrice = price > 30;
            }


            const shouldShow =
                matchesSearch &&
                matchesLocation &&
                matchesQuality &&
                matchesPrice;


            if (shouldShow) {

                card.style.display = "";

                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });


        if (noResults) {

            noResults.style.display =
                visibleCount === 0
                    ? "block"
                    : "none";

        }

    }


    if (produceSearch) {
        produceSearch.addEventListener(
            "input",
            filterProduce
        );
    }

    if (locationFilter) {
        locationFilter.addEventListener(
            "change",
            filterProduce
        );
    }

    if (qualityFilter) {
        qualityFilter.addEventListener(
            "change",
            filterProduce
        );
    }

    if (priceFilter) {
        priceFilter.addEventListener(
            "change",
            filterProduce
        );
    }


    /* =====================================================
       CROP INFORMATION
    ===================================================== */

    function getCropData(card) {

        if (!card) {
            return null;
        }

        const title =
            card.querySelector(
                ".produce-title-row h3"
            )?.textContent.trim() || "Produce";


        const farmerText =
            card.querySelector(
                ".farmer-name"
            )?.textContent.trim() || "Farmer";


        const farmer =
            farmerText.replace(/^👨‍🌾\s*/, "").trim();


        const location =
            card.querySelector(
                ".produce-meta span:first-child"
            )?.textContent
                .replace("📍", "")
                .trim() || "Location";


        const quantity =
            card.querySelector(
                ".produce-meta span:last-child"
            )?.textContent.trim() || "Available";


        const price =
            card.querySelector(
                ".produce-footer strong"
            )?.textContent.trim() || "Price";


        const quality =
            card.querySelector(
                ".quality-badge"
            )?.textContent.trim() || "Grade A";


        const rating =
            card.querySelector(
                ".rating"
            )?.textContent.trim() || "";


        const icon =
            card.querySelector(
                ".produce-image > span:first-child"
            )?.textContent.trim() || "🌾";


        const contact =
            farmerContacts[farmer] || "+91 XXXXX XXXXX";


        return {
            title,
            farmer,
            location,
            quantity,
            price,
            quality,
            rating,
            icon,
            contact
        };
    }


    /* =====================================================
       SAVED CROPS
    ===================================================== */

    const savedCrops = new Map();


    function getCropKey(card) {

        const data = getCropData(card);

        if (!data) {
            return "";
        }

        return (
            data.title.toLowerCase() +
            "|" +
            data.farmer.toLowerCase()
        );

    }


    function syncSaveButtons() {

        document.querySelectorAll(".save-btn")
            .forEach(function (button) {

                const card =
                    button.closest(".produce-card");

                const key =
                    getCropKey(card);

                const saved =
                    savedCrops.has(key);

                button.dataset.saved =
                    saved ? "true" : "false";

                button.classList.toggle(
                    "saved",
                    saved
                );

                button.textContent =
                    saved ? "♥" : "♡";

            });

    }


    function renderSavedList() {

        if (!savedList) {
            return;
        }


        if (savedCrops.size === 0) {

            savedList.innerHTML = `
                <div class="saved-empty">
                    <div>♡</div>
                    <h3>No saved crops yet</h3>
                    <p>
                        Save crops you're interested in to
                        easily find and contact the farmer later.
                    </p>
                    <button
                        class="primary-btn"
                        data-section-target="browse"
                    >
                        Browse Crops
                    </button>
                </div>
            `;

            const browseButton =
                savedList.querySelector(
                    "[data-section-target='browse']"
                );

            if (browseButton) {

                browseButton.addEventListener(
                    "click",
                    function () {
                        showSection("browse");
                    }
                );

            }

            return;
        }


        savedList.innerHTML = "";


        savedCrops.forEach(function (data, key) {

            const item =
                document.createElement("div");

            item.className =
                "saved-crop-card";

            item.dataset.cropKey = key;


            item.innerHTML = `
                <div class="saved-crop-icon">
                    ${data.icon}
                </div>

                <div class="saved-crop-content">

                    <h3>${data.title}</h3>

                    <p>
                        👨‍🌾 ${data.farmer}
                    </p>

                    <div class="saved-crop-meta">
                        <span>📍 ${data.location}</span>
                        <span>${data.quantity}</span>
                        <span>${data.price}</span>
                        <span>${data.quality}</span>
                    </div>

                </div>

                <div class="saved-crop-actions">

                    <button
                        class="saved-view-btn"
                        type="button"
                    >
                        View Details
                    </button>

                    <button
                        class="saved-remove-btn"
                        type="button"
                    >
                        Remove
                    </button>

                </div>
            `;


            const viewButton =
                item.querySelector(".saved-view-btn");

            const removeButton =
                item.querySelector(".saved-remove-btn");


            if (viewButton) {

                viewButton.addEventListener(
                    "click",
                    function () {

                        openCropModalFromData(data);

                    }
                );

            }


            if (removeButton) {

                removeButton.addEventListener(
                    "click",
                    function () {

                        savedCrops.delete(key);

                        syncSaveButtons();
                        renderSavedList();

                        showToast(
                            "Removed from saved crops."
                        );

                    }
                );

            }


            savedList.appendChild(item);

        });

    }


    function saveCrop(card) {

        const data =
            getCropData(card);

        if (!data) {
            return;
        }

        const key =
            getCropKey(card);

        if (!key) {
            return;
        }


        if (savedCrops.has(key)) {

            savedCrops.delete(key);

            showToast(
                "Removed from saved crops."
            );

        } else {

            savedCrops.set(
                key,
                data
            );

            showToast(
                "Crop saved successfully."
            );

        }


        syncSaveButtons();
        renderSavedList();

    }


    /*
     * Event delegation is intentional.
     * It makes every current and future Save button work.
     */

    document.addEventListener(
        "click",
        function (event) {

            const saveButton =
                event.target.closest(".save-btn");

            if (!saveButton) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const card =
                saveButton.closest(".produce-card");

            if (card) {
                saveCrop(card);
            }

        },
        true
    );


    /* =====================================================
       VIEW DETAILS MODAL
    ===================================================== */

    function rebuildModalDetails() {

        if (!detailsModal) {
            return;
        }

        const modal =
            detailsModal.querySelector(".details-modal");

        if (!modal) {
            return;
        }


        /*
         * The current HTML contains an accidentally duplicated
         * .modal-details-grid. Rebuild only this modal content
         * so the alignment becomes correct.
         */

        let detailsGrid =
            modal.querySelector(".modal-details-grid");

        if (!detailsGrid) {

            detailsGrid =
                document.createElement("div");

            detailsGrid.className =
                "modal-details-grid";

            const contactButton =
                modal.querySelector(
                    "#contactFarmerBtn"
                );

            if (contactButton) {
                modal.insertBefore(
                    detailsGrid,
                    contactButton
                );
            } else {
                modal.appendChild(detailsGrid);
            }

        }


        detailsGrid.innerHTML = "";


        const farmerInfo =
            document.createElement("div");

        farmerInfo.className =
            "modal-farmer-info";


        const farmerItem =
            document.createElement("div");

        farmerItem.className =
            "modal-farmer-item";

        farmerItem.innerHTML = `
            <span>Farmer</span>
            <strong id="modalFarmerName">
                -
            </strong>
        `;


        const contactItem =
            document.createElement("div");

        contactItem.className =
            "modal-farmer-item";

        contactItem.innerHTML = `
            <span>Contact</span>
            <strong id="modalFarmerContact">
                -
            </strong>
        `;


        farmerInfo.appendChild(farmerItem);
        farmerInfo.appendChild(contactItem);


        /*
         * Make farmer information a sibling of the
         * details grid, not a child of it.
         */

        if (
            detailsGrid.nextElementSibling &&
            detailsGrid.nextElementSibling.classList.contains(
                "modal-farmer-info"
            )
        ) {

            detailsGrid.nextElementSibling.remove();

        }


        detailsGrid.insertAdjacentElement(
            "afterend",
            farmerInfo
        );


        return {
            detailsGrid,
            farmerInfo
        };

    }


    function openCropModal(card) {

        const data =
            getCropData(card);

        if (!data) {
            return;
        }

        openCropModalFromData(data);

    }


    function openCropModalFromData(data) {

        if (!detailsModal || !data) {
            return;
        }


        const modal =
            detailsModal.querySelector(".details-modal");

        if (!modal) {
            return;
        }


        /*
         * Remove the accidentally nested/old modal grids
         * and rebuild the correct structure.
         */

        const existingGrids =
            modal.querySelectorAll(
                ".modal-details-grid"
            );

        let detailsGrid;


        if (existingGrids.length > 0) {

            detailsGrid =
                existingGrids[0];

        } else {

            detailsGrid =
                document.createElement("div");

            detailsGrid.className =
                "modal-details-grid";

        }


        existingGrids.forEach(function (grid, index) {

            if (index > 0) {
                grid.remove();
            }

        });


        /*
         * Move farmer information outside the details grid
         * if it currently exists inside it.
         */

        const oldFarmerInfo =
            modal.querySelector(".modal-farmer-info");

        if (oldFarmerInfo) {
            oldFarmerInfo.remove();
        }


        detailsGrid.innerHTML = `
            <div>
                <span>Quality</span>
                <strong>${data.quality}</strong>
            </div>

            <div>
                <span>Available Quantity</span>
                <strong>${data.quantity}</strong>
            </div>

            <div>
                <span>Price</span>
                <strong>${data.price}</strong>
            </div>

            <div>
                <span>Farm Location</span>
                <strong>${data.location}</strong>
            </div>
        `;


        const farmerInfo =
            document.createElement("div");

        farmerInfo.className =
            "modal-farmer-info";

        farmerInfo.innerHTML = `
            <div class="modal-farmer-item">
                <span>Farmer</span>
                <strong>${data.farmer}</strong>
            </div>

            <div class="modal-farmer-item">
                <span>Contact</span>
                <strong>${data.contact}</strong>
            </div>
        `;


        const contactButton =
            modal.querySelector(
                "#contactFarmerBtn"
            );


        /*
         * Ensure correct order:
         *
         * Details Grid
         * Farmer Info
         * Contact Button
         */

        if (contactButton) {

            contactButton.remove();

            detailsGrid.insertAdjacentElement(
                "afterend",
                farmerInfo
            );

            detailsGrid.insertAdjacentHTML(
                "afterend",
                ""
            );

            modal.appendChild(contactButton);

        } else {

            detailsGrid.insertAdjacentElement(
                "afterend",
                farmerInfo
            );

        }


        if (modalTitle) {
            modalTitle.textContent =
                data.title;
        }


        if (modalFarmer) {
            modalFarmer.textContent =
                "👨‍🌾 " + data.farmer;
        }


        if (modalProduceIcon) {
            modalProduceIcon.textContent =
                data.icon;
        }


        /*
         * Store current farmer/crop for Contact Farmer.
         */

        detailsModal.dataset.farmer =
            data.farmer;

        detailsModal.dataset.contact =
            data.contact;

        detailsModal.dataset.crop =
            data.title;


        detailsModal.classList.add("show");

    }


    /*
     * Event delegation makes View Details work for
     * dashboard cards and Browse cards.
     */

    document.addEventListener(
        "click",
        function (event) {

            const viewButton =
                event.target.closest(".view-details");

            if (!viewButton) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const card =
                viewButton.closest(".produce-card");

            if (card) {
                openCropModal(card);
            }

        },
        true
    );


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    if (modalClose && detailsModal) {

        modalClose.addEventListener(
            "click",
            function () {

                detailsModal.classList.remove("show");

            }
        );

    }


    if (detailsModal) {

        detailsModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === detailsModal
                ) {

                    detailsModal.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    /* =====================================================
       CONTACT FARMER
    ===================================================== */

    function contactFarmer(farmer, contact, crop) {

        if (!farmer) {
            farmer = "Farmer";
        }

        if (!contact) {
            contact = "+91 XXXXX XXXXX";
        }

        showToast(
            "Contact " +
            farmer +
            " regarding " +
            crop +
            "."
        );

        /*
         * No purchase/order is created.
         * Actual phone/WhatsApp integration can be
         * connected later with backend data.
         */

    }


    if (contactFarmerBtn) {

        contactFarmerBtn.addEventListener(
            "click",
            function () {

                contactFarmer(
                    detailsModal?.dataset.farmer,
                    detailsModal?.dataset.contact,
                    detailsModal?.dataset.crop
                );

            }
        );

    }


    /* =====================================================
       UPCOMING HARVEST
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const saveButton =
                event.target.closest(
                    ".harvest-save-btn"
                );

            if (!saveButton) {
                return;
            }

            event.preventDefault();

            const saved =
                saveButton.dataset.saved === "true";

            if (saved) {

                saveButton.dataset.saved = "false";
                saveButton.textContent =
                    "♡ Save Crop";

                showToast(
                    "Removed from saved crops."
                );

            } else {

                saveButton.dataset.saved = "true";
                saveButton.textContent =
                    "♥ Saved Crop";

                showToast(
                    "Harvest crop saved successfully."
                );

            }

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            const contactButton =
                event.target.closest(
                    ".harvest-contact-btn"
                );

            if (!contactButton) {
                return;
            }

            const card =
                contactButton.closest(
                    ".harvest-card"
                );

            const farmer =
                card?.querySelector(
                    ".harvest-info-item:first-child strong"
                )?.textContent.trim()
                || "Farmer";

            const crop =
                card?.querySelector(
                    ".harvest-top h3"
                )?.textContent.trim()
                || "crop";

            contactFarmer(
                farmer,
                farmerContacts[farmer],
                crop
            );

        }
    );


    /* =====================================================
       TRANSPORT & CONNECTIONS
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const saveButton =
                event.target.closest(
                    ".transport-save-btn"
                );

            if (!saveButton) {
                return;
            }

            event.preventDefault();

            const saved =
                saveButton.dataset.saved === "true";

            if (saved) {

                saveButton.dataset.saved = "false";
                saveButton.textContent =
                    "♡ Save Connection";

                showToast(
                    "Connection removed."
                );

            } else {

                saveButton.dataset.saved = "true";
                saveButton.textContent =
                    "♥ Connection Saved";

                showToast(
                    "Farmer connection saved."
                );

            }

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            const contactButton =
                event.target.closest(
                    ".transport-contact-btn"
                );

            if (!contactButton) {
                return;
            }

            const card =
                contactButton.closest(
                    ".transport-card"
                );

            const farmer =
                card?.querySelector(
                    ".transport-farmer h3"
                )?.textContent.trim()
                || "Farmer";

            const crop =
                card?.querySelector(
                    ".transport-crop-details strong"
                )?.textContent.trim()
                || "crop";

            contactFarmer(
                farmer,
                farmerContacts[farmer],
                crop
            );

        }
    );


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }

            if (detailsModal) {
                detailsModal.classList.remove(
                    "show"
                );
            }

            if (notificationPanel) {
                notificationPanel.classList.remove(
                    "show"
                );
            }

        }
    );


    /* =====================================================
       INITIAL SETUP
    ===================================================== */

    syncSaveButtons();
    renderSavedList();
    filterProduce();

});