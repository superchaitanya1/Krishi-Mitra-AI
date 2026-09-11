/* =========================================================
   KRISHI-MITRA
   API.JS
   Backend API Connection Layer
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       API CONFIGURATION
       ===================================================== */

    /*
     * Keep this URL ready for backend integration.
     *
     * For now, the frontend works independently.
     * When your backend teammate provides the API URL,
     * change ONLY API_BASE_URL.
     */

    const API_BASE_URL =
        "http://localhost:5000/api";


    /* =====================================================
       REQUEST CONFIGURATION
       ===================================================== */

    const DEFAULT_HEADERS = {
        "Content-Type": "application/json"
    };


    /* =====================================================
       BASIC REQUEST HANDLER
       ===================================================== */

    async function request(
        endpoint,
        options = {}
    ) {

        const url =
            `${API_BASE_URL}${endpoint}`;

        const config = {

            method:
                options.method || "GET",

            headers: {
                ...DEFAULT_HEADERS,
                ...(options.headers || {})
            },

            body:
                options.body !== undefined
                    ? JSON.stringify(options.body)
                    : undefined
        };


        try {

            const response =
                await fetch(
                    url,
                    config
                );


            let data = null;


            try {

                data =
                    await response.json();

            } catch (error) {

                data = null;
            }


            if (!response.ok) {

                const message =
                    data &&
                    data.message
                        ? data.message
                        : `Request failed with status ${response.status}.`;

                throw new Error(
                    message
                );
            }


            return {

                success: true,

                data: data

            };

        } catch (error) {

            console.error(
                "Krishi-Mitra API Error:",
                error
            );


            return {

                success: false,

                error:
                    error.message ||
                    "Unable to connect to the server."

            };
        }
    }


    /* =====================================================
       HEALTH CHECK
       ===================================================== */

    async function checkServer() {

        return request(
            "/health"
        );
    }


    /* =====================================================
       AUTHENTICATION
       ===================================================== */

    async function sendOTP(
        mobile
    ) {

        return request(
            "/auth/send-otp",
            {
                method: "POST",

                body: {
                    mobile: mobile
                }
            }
        );
    }


    async function verifyOTP(
        mobile,
        otp
    ) {

        return request(
            "/auth/verify-otp",
            {
                method: "POST",

                body: {
                    mobile: mobile,
                    otp: otp
                }
            }
        );
    }


    async function logout() {

        return request(
            "/auth/logout",
            {
                method: "POST"
            }
        );
    }


    /* =====================================================
       PROFILE
       ===================================================== */

    async function createProfile(
        profile
    ) {

        return request(
            "/profile",
            {
                method: "POST",

                body: profile
            }
        );
    }


    async function getProfile(
        mobile
    ) {

        const query =
            mobile
                ? `?mobile=${encodeURIComponent(mobile)}`
                : "";

        return request(
            `/profile${query}`
        );
    }


    async function updateProfile(
        profile
    ) {

        return request(
            "/profile",
            {
                method: "PUT",

                body: profile
            }
        );
    }


    /* =====================================================
       WEATHER
       ===================================================== */

    async function getWeather(
        location
    ) {

        const query =
            `?location=${encodeURIComponent(
                location || ""
            )}`;

        return request(
            `/weather${query}`
        );
    }


    async function getSevenDayWeather(
        location
    ) {

        const query =
            `?location=${encodeURIComponent(
                location || ""
            )}`;

        return request(
            `/weather/7-days${query}`
        );
    }


    /* =====================================================
       MARKET PRICES
       ===================================================== */

    async function getMarketPrices(
        crop = "",
        location = ""
    ) {

        const params =
            new URLSearchParams();


        if (crop) {

            params.append(
                "crop",
                crop
            );
        }


        if (location) {

            params.append(
                "location",
                location
            );
        }


        const query =
            params.toString()
                ? `?${params.toString()}`
                : "";


        return request(
            `/market-prices${query}`
        );
    }


    /* =====================================================
       FARM DATA
       ===================================================== */

    async function getFarmData() {

        return request(
            "/farm"
        );
    }


    async function updateFarmData(
        farmData
    ) {

        return request(
            "/farm",
            {
                method: "PUT",

                body: farmData
            }
        );
    }


    /* =====================================================
       IRRIGATION
       ===================================================== */

    async function getIrrigationData() {

        return request(
            "/irrigation"
        );
    }


    async function getIrrigationRecommendation(
        data
    ) {

        return request(
            "/irrigation/recommendation",
            {
                method: "POST",

                body: data
            }
        );
    }


    /* =====================================================
       CROP DOCTOR
       ===================================================== */

    async function analyzeCrop(
        data
    ) {

        return request(
            "/crop-doctor/analyze",
            {
                method: "POST",

                body: data
            }
        );
    }


    /* =====================================================
       MITRA AI
       ===================================================== */

    async function askMitra(
        message,
        context = {}
    ) {

        return request(
            "/mitra/chat",
            {
                method: "POST",

                body: {

                    message: message,

                    context: context
                }
            }
        );
    }


    async function getChatHistory() {

        return request(
            "/mitra/history"
        );
    }


    /* =====================================================
       FARM INSIGHTS
       ===================================================== */

    async function getFarmInsights() {

        return request(
            "/farm/insights"
        );
    }


    /* =====================================================
       GOVERNMENT SCHEMES
       ===================================================== */

    async function getGovernmentSchemes(
        location = ""
    ) {

        const query =
            location
                ? `?location=${encodeURIComponent(
                    location
                )}`
                : "";

        return request(
            `/schemes${query}`
        );
    }


    /* =====================================================
       NOTIFICATIONS
       ===================================================== */

    async function getNotifications() {

        return request(
            "/notifications"
        );
    }


    async function markNotificationRead(
        notificationId
    ) {

        return request(
            `/notifications/${notificationId}/read`,
            {
                method: "PUT"
            }
        );
    }


    async function markAllNotificationsRead() {

        return request(
            "/notifications/read-all",
            {
                method: "PUT"
            }
        );
    }


    /* =====================================================
       DASHBOARD DATA
       ===================================================== */

    async function getDashboardData() {

        return request(
            "/dashboard"
        );
    }


    /* =====================================================
       FILE / IMAGE UPLOAD
       ===================================================== */

    async function uploadImage(
        file
    ) {

        if (!file) {

            return {

                success: false,

                error:
                    "No file selected."
            };
        }


        const formData =
            new FormData();

        formData.append(
            "image",
            file
        );


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/upload/image`,
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Image upload failed."
                );
            }


            return {

                success: true,

                data: data

            };

        } catch (error) {

            console.error(
                "Image upload error:",
                error
            );


            return {

                success: false,

                error:
                    error.message ||
                    "Unable to upload image."
            };
        }
    }


    /* =====================================================
       SAFE API CALL
       ===================================================== */

    async function safeRequest(
        apiFunction,
        ...args
    ) {

        try {

            return await apiFunction(
                ...args
            );

        } catch (error) {

            console.error(
                "Krishi-Mitra API Error:",
                error
            );

            return {

                success: false,

                error:
                    error.message ||
                    "Something went wrong."
            };
        }
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.KrishiAPI = {

        baseURL:
            API_BASE_URL,

        request:

            request,

        safeRequest:

            safeRequest,

        checkServer:

            checkServer,


        /* Authentication */

        sendOTP:

            sendOTP,

        verifyOTP:

            verifyOTP,

        logout:

            logout,


        /* Profile */

        createProfile:

            createProfile,

        getProfile:

            getProfile,

        updateProfile:

            updateProfile,


        /* Weather */

        getWeather:

            getWeather,

        getSevenDayWeather:

            getSevenDayWeather,


        /* Market */

        getMarketPrices:

            getMarketPrices,


        /* Farm */

        getFarmData:

            getFarmData,

        updateFarmData:

            updateFarmData,


        /* Irrigation */

        getIrrigationData:

            getIrrigationData,

        getIrrigationRecommendation:

            getIrrigationRecommendation,


        /* Crop Doctor */

        analyzeCrop:

            analyzeCrop,


        /* Mitra */

        askMitra:

            askMitra,

        getChatHistory:

            getChatHistory,


        /* Insights */

        getFarmInsights:

            getFarmInsights,


        /* Schemes */

        getGovernmentSchemes:

            getGovernmentSchemes,


        /* Notifications */

        getNotifications:

            getNotifications,

        markNotificationRead:

            markNotificationRead,

        markAllNotificationsRead:

            markAllNotificationsRead,


        /* Dashboard */

        getDashboardData:

            getDashboardData,


        /* Upload */

        uploadImage:

            uploadImage
    };


})();