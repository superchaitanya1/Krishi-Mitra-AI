/* =========================================================
   KRISHI-MITRA
   DASHBOARD.JS
   Main Dashboard Module
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       DASHBOARD DATA
       ===================================================== */

    const dashboardData = {

        weather: {
            location: "Your Location",
            temperature: "28°C",
            condition: "Partly Cloudy",
            humidity: "68%",
            wind: "12 km/h",
            rainfall: "20%"
        },

        crops: [
            {
                name: "Tomato",
                status: "Healthy",
                progress: 78,
                icon: "fa-seedling"
            },
            {
                name: "Wheat",
                status: "Growing Well",
                progress: 64,
                icon: "fa-wheat-awn"
            },
            {
                name: "Cotton",
                status: "Needs Attention",
                progress: 52,
                icon: "fa-leaf"
            }
        ],

        tips: [
            {
                icon: "fa-droplet",
                title: "Check Soil Moisture",
                text: "Check your soil moisture before the next irrigation cycle."
            },
            {
                icon: "fa-cloud-sun",
                title: "Watch the Weather",
                text: "Rain may affect your irrigation and spraying schedule."
            },
            {
                icon: "fa-bug",
                title: "Inspect Your Crops",
                text: "Regularly check leaves for early signs of pests or disease."
            }
        ]
    };


    /* =====================================================
       DOM HELPER
       ===================================================== */

    function getContentArea() {
        return document.getElementById("content-area");
    }


    /* =====================================================
       USER PROFILE
       ===================================================== */

    function getUserProfile() {

        try {

            const saved =
                localStorage.getItem(
                    "krishiMitraProfile"
                );

            if (saved) {

                return JSON.parse(saved);
            }

        } catch (error) {

            console.warn(
                "Unable to read profile.",
                error
            );
        }

        return null;
    }


    /* =====================================================
       USER NAME
       ===================================================== */

    function getUserName() {

        const profile =
            getUserProfile();


        if (
            profile &&
            profile.name &&
            profile.name.trim()
        ) {

            return profile.name.trim();
        }


        return "Farmer";
    }


    /* =====================================================
       LOCATION
       ===================================================== */

    function getUserLocation() {

        const profile =
            getUserProfile();


        if (
            profile &&
            profile.location &&
            profile.location.trim()
        ) {

            return profile.location.trim();
        }


        return "Your Farm";
    }


    /* =====================================================
       GREETING
       ===================================================== */

    function getGreeting() {

        const hour =
            new Date().getHours();


        if (hour < 12) {

            return "Good Morning";

        } else if (hour < 17) {

            return "Good Afternoon";

        } else {

            return "Good Evening";
        }
    }


    /* =====================================================
       DASHBOARD HTML
       ===================================================== */

    function getDashboardHTML() {

        const userName =
            escapeHTML(
                getUserName()
            );


        const location =
            escapeHTML(
                getUserLocation()
            );


        const greeting =
            getGreeting();


        return `

            <!-- =================================================
                 DASHBOARD WRAPPER
                 ================================================= -->

            <div class="dashboard-page">


                <!-- =============================================
                     HERO / GREETING SECTION
                     ============================================= -->

                <section class="dashboard-hero">

                    <div class="hero-overlay"></div>

                    <div class="hero-content">

                        <div class="hero-text">

                            <span class="hero-eyebrow">
                                ${greeting}, ${userName} 🌱
                            </span>

                            <h1>
                                Let's grow something great today.
                            </h1>

                            <p>
                                Smart insights for your farm,
                                right when you need them.
                            </p>

                            <div class="hero-location">

                                <i class="fa-solid fa-location-dot"></i>

                                <span>
                                    ${location}
                                </span>

                            </div>

                        </div>

                    </div>

                </section>


                <!-- =============================================
                     QUICK WEATHER
                     ============================================= -->

                <section class="dashboard-section">

                    <div class="section-heading">

                        <div>

                            <span class="section-eyebrow">
                                TODAY
                            </span>

                            <h2>
                                Weather at a glance
                            </h2>

                        </div>

                        <button
                            type="button"
                            class="section-link"
                            data-module="weather"
                        >
                            View 7-day forecast
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>

                    </div>


                    <div class="weather-overview-card">

                        <div class="weather-main-info">

                            <div class="weather-icon-large">

                                <i class="fa-solid fa-cloud-sun"></i>

                            </div>

                            <div>

                                <span class="weather-location">
                                    ${location}
                                </span>

                                <strong class="weather-temperature">
                                    ${dashboardData.weather.temperature}
                                </strong>

                                <span class="weather-condition">
                                    ${dashboardData.weather.condition}
                                </span>

                            </div>

                        </div>


                        <div class="weather-details">

                            <div class="weather-detail">

                                <i class="fa-solid fa-droplet"></i>

                                <div>
                                    <span>Humidity</span>
                                    <strong>
                                        ${dashboardData.weather.humidity}
                                    </strong>
                                </div>

                            </div>


                            <div class="weather-detail">

                                <i class="fa-solid fa-wind"></i>

                                <div>
                                    <span>Wind</span>
                                    <strong>
                                        ${dashboardData.weather.wind}
                                    </strong>
                                </div>

                            </div>


                            <div class="weather-detail">

                                <i class="fa-solid fa-cloud-rain"></i>

                                <div>
                                    <span>Rain Chance</span>
                                    <strong>
                                        ${dashboardData.weather.rainfall}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                <!-- =============================================
                     QUICK ACTIONS
                     ============================================= -->

                <section class="dashboard-section">

                    <div class="section-heading">

                        <div>

                            <span class="section-eyebrow">
                                FARM TOOLS
                            </span>

                            <h2>
                                What would you like to do?
                            </h2>

                        </div>

                    </div>


                    <div class="quick-actions">


                        <button
                            type="button"
                            class="quick-action"
                            data-module="my-farm"
                        >

                            <span class="quick-action-icon">

                                <i class="fa-solid fa-wheat-awn"></i>

                            </span>

                            <span class="quick-action-content">

                                <strong>
                                    My Farm
                                </strong>

                                <small>
                                    Manage your crops and farm details
                                </small>

                            </span>

                            <i class="fa-solid fa-arrow-right quick-action-arrow"></i>

                        </button>


                        <button
                            type="button"
                            class="quick-action"
                            data-module="crop-doctor"
                        >

                            <span class="quick-action-icon">

                                <i class="fa-solid fa-stethoscope"></i>

                            </span>

                            <span class="quick-action-content">

                                <strong>
                                    AI Crop Doctor
                                </strong>

                                <small>
                                    Check crop health and diseases
                                </small>

                            </span>

                            <i class="fa-solid fa-arrow-right quick-action-arrow"></i>

                        </button>


                        <button
                            type="button"
                            class="quick-action"
                            data-module="mitra-ai"
                        >

                            <span class="quick-action-icon">

                                <i class="fa-solid fa-robot"></i>

                            </span>

                            <span class="quick-action-content">

                                <strong>
                                    Ask Mitra AI
                                </strong>

                                <small>
                                    Get farming guidance instantly
                                </small>

                            </span>

                            <i class="fa-solid fa-arrow-right quick-action-arrow"></i>

                        </button>


                        <button
                            type="button"
                            class="quick-action"
                            data-module="market"
                        >

                            <span class="quick-action-icon">

                                <i class="fa-solid fa-chart-line"></i>

                            </span>

                            <span class="quick-action-content">

                                <strong>
                                    Market Prices
                                </strong>

                                <small>
                                    Check today's crop prices
                                </small>

                            </span>

                            <i class="fa-solid fa-arrow-right quick-action-arrow"></i>

                        </button>


                    </div>

                </section>


                <!-- =============================================
                     FARM STATUS + MITRA
                     ============================================= -->

                <section class="dashboard-two-column">


                    <!-- FARM STATUS -->

                    <div class="dashboard-card farm-status-card">

                        <div class="card-header">

                            <div>

                                <span class="section-eyebrow">
                                    YOUR FARM
                                </span>

                                <h2>
                                    Crop Overview
                                </h2>

                            </div>

                            <button
                                type="button"
                                class="card-more-button"
                                data-module="my-farm"
                            >
                                View All
                            </button>

                        </div>


                        <div class="crop-list">

                            ${dashboardData.crops.map(
                                function (crop) {

                                    return `

                                        <div class="crop-item">

                                            <div class="crop-icon">

                                                <i class="fa-solid ${crop.icon}"></i>

                                            </div>

                                            <div class="crop-info">

                                                <div class="crop-title-row">

                                                    <strong>
                                                        ${crop.name}
                                                    </strong>

                                                    <span class="crop-status">
                                                        ${crop.status}
                                                    </span>

                                                </div>

                                                <div class="crop-progress">

                                                    <span
                                                        style="width:${crop.progress}%"
                                                    ></span>

                                                </div>

                                            </div>

                                            <span class="crop-percentage">
                                                ${crop.progress}%
                                            </span>

                                        </div>

                                    `;
                                }
                            ).join("")}

                        </div>

                    </div>


                    <!-- MITRA CARD -->

                    <div class="dashboard-card mitra-dashboard-card">

                        <div class="mitra-card-decoration"></div>

                        <div class="mitra-card-content">

                            <div class="mitra-card-icon">

                                <i class="fa-solid fa-leaf"></i>

                            </div>

                            <span class="section-eyebrow">
                                YOUR FARMING COMPANION
                            </span>

                            <h2>
                                Meet Mitra 🌱
                            </h2>

                            <p>
                                Have a question about your crops,
                                weather, soil or farming?
                                Mitra is here to help.
                            </p>

                            <button
                                type="button"
                                class="primary-button"
                                data-module="mitra-ai"
                            >

                                Ask Mitra

                                <i class="fa-solid fa-arrow-right"></i>

                            </button>

                        </div>

                    </div>

                </section>


                <!-- =============================================
                     FARM TIPS
                     ============================================= -->

                <section class="dashboard-section">

                    <div class="section-heading">

                        <div>

                            <span class="section-eyebrow">
                                FARM SMART
                            </span>

                            <h2>
                                Today's Tips
                            </h2>

                        </div>

                    </div>


                    <div class="farm-tips-grid">

                        ${dashboardData.tips.map(
                            function (tip) {

                                return `

                                    <div class="farm-tip-card">

                                        <div class="farm-tip-icon">

                                            <i class="fa-solid ${tip.icon}"></i>

                                        </div>

                                        <div>

                                            <h3>
                                                ${tip.title}
                                            </h3>

                                            <p>
                                                ${tip.text}
                                            </p>

                                        </div>

                                    </div>

                                `;
                            }
                        ).join("")}

                    </div>

                </section>


                <!-- =============================================
                     DASHBOARD FOOTER
                     ============================================= -->

                <footer class="dashboard-footer">

                    <div>

                        <i class="fa-solid fa-seedling"></i>

                        <span>
                            Krishi-Mitra
                        </span>

                    </div>

                    <p>
                        Grow smarter. Farm better.
                    </p>

                </footer>


            </div>
        `;
    }


    /* =====================================================
       RENDER DASHBOARD
       ===================================================== */

    function renderDashboard() {

        const content =
            getContentArea();


        if (!content) {
            return;
        }


        content.innerHTML =
            getDashboardHTML();


        bindDashboardEvents();


        updateDashboardDate();


        document.dispatchEvent(
            new CustomEvent(
                "krishi:dashboard-loaded"
            )
        );
    }


    /* =====================================================
       DASHBOARD EVENTS
       ===================================================== */

    function bindDashboardEvents() {

        const moduleButtons =
            document.querySelectorAll(
                "[data-module]"
            );


        moduleButtons.forEach(
            function (button) {

                /*
                 * Navigation.js handles the actual
                 * module loading. We only notify it.
                 */

                button.addEventListener(
                    "click",
                    function () {

                        const moduleName =
                            button.getAttribute(
                                "data-module"
                            );


                        if (!moduleName) {
                            return;
                        }


                        document.dispatchEvent(
                            new CustomEvent(
                                "krishi:module-request",
                                {
                                    detail: {
                                        module:
                                            moduleName
                                    }
                                }
                            )
                        );
                    }
                );
            }
        );
    }


    /* =====================================================
       DASHBOARD DATE
       ===================================================== */

    function updateDashboardDate() {

        const dateElements =
            document.querySelectorAll(
                "[data-dashboard-date]"
            );


        if (!dateElements.length) {
            return;
        }


        const today =
            new Date();


        const formatted =
            today.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                }
            );


        dateElements.forEach(
            function (element) {

                element.textContent =
                    formatted;
            }
        );
    }


    /* =====================================================
       WEATHER UPDATE
       ===================================================== */

    function updateWeather(
        weather
    ) {

        if (!weather) {
            return;
        }


        if (
            weather.temperature
        ) {

            dashboardData.weather.temperature =
                weather.temperature;
        }


        if (
            weather.condition
        ) {

            dashboardData.weather.condition =
                weather.condition;
        }


        if (
            weather.humidity
        ) {

            dashboardData.weather.humidity =
                weather.humidity;
        }


        if (
            weather.wind
        ) {

            dashboardData.weather.wind =
                weather.wind;
        }


        if (
            weather.rainfall
        ) {

            dashboardData.weather.rainfall =
                weather.rainfall;
        }


        const content =
            getContentArea();


        if (
            content &&
            content.querySelector(
                ".dashboard-page"
            )
        ) {

            renderDashboard();
        }
    }


    /* =====================================================
       PROFILE UPDATE
       ===================================================== */

    document.addEventListener(
        "krishi:profile-updated",
        function () {

            /*
             * Refresh only if dashboard
             * is currently visible.
             */

            const content =
                getContentArea();


            if (
                content &&
                content.querySelector(
                    ".dashboard-page"
                )
            ) {

                renderDashboard();
            }
        }
    );


    /* =====================================================
       MODULE REQUEST SUPPORT
       ===================================================== */

    document.addEventListener(
        "krishi:module-request",
        function (event) {

            if (
                !event.detail ||
                !event.detail.module
            ) {

                return;
            }


            const moduleName =
                event.detail.module;


            /*
             * If Navigation.js exposes a
             * navigation function, use it.
             */

            if (
                window.KrishiNavigation &&
                typeof window.KrishiNavigation
                    .openModule === "function"
            ) {

                window.KrishiNavigation
                    .openModule(
                        moduleName
                    );

                return;
            }


            if (
                window.navigateToModule &&
                typeof window.navigateToModule ===
                "function"
            ) {

                window.navigateToModule(
                    moduleName
                );
            }
        }
    );


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(
        value
    ) {

        const element =
            document.createElement(
                "div"
            );


        element.textContent =
            String(value);


        return element.innerHTML;
    }


    /* =====================================================
       PUBLIC DASHBOARD API
       ===================================================== */

    window.KrishiDashboard = {

        render:
            renderDashboard,

        updateWeather:
            updateWeather,

        getData:
            function () {

                return dashboardData;
            },

        getUserName:
            getUserName,

        getUserLocation:
            getUserLocation
    };


    /* =====================================================
       INITIAL DASHBOARD LOAD
       ===================================================== */

    function initializeDashboard() {

        /*
         * Wait for the main application to be ready.
         */

        renderDashboard();
    }


    document.addEventListener(
        "krishi:app-ready",
        initializeDashboard
    );


    /*
     * Fallback in case app.js has already
     * initialized before this file loads.
     */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                setTimeout(
                    function () {

                        const content =
                            getContentArea();


                        if (
                            content &&
                            !content.querySelector(
                                ".dashboard-page"
                            )
                        ) {

                            renderDashboard();
                        }

                    },
                    50
                );
            }
        );

    } else {

        setTimeout(
            function () {

                const content =
                    getContentArea();


                if (
                    content &&
                    !content.querySelector(
                        ".dashboard-page"
                    )
                ) {

                    renderDashboard();
                }

            },
            50
        );
    }

})();