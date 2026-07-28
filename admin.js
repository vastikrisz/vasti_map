const ADMIN_USER_ID =
    "df168eb9-7131-4b74-b757-75f6a653e299";


const loginSection =
    document.getElementById("loginSection");

const dashboardSection =
    document.getElementById("dashboardSection");

const loginForm =
    document.getElementById("loginForm");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const logoutButton =
    document.getElementById("logoutButton");

const userEmail =
    document.getElementById("userEmail");

const placeForm =
    document.getElementById("placeForm");

const savePlaceButton =
    document.getElementById("savePlaceButton");

const clearFormButton =
    document.getElementById("clearFormButton");

const saveMessage =
    document.getElementById("saveMessage");

const isPublishedInput =
    document.getElementById("isPublished");

const findLocationButton =
    document.getElementById("findLocationButton");

const placeAddress =
    document.getElementById("placeAddress");

const latitudeInput =
    document.getElementById("latitude");

const longitudeInput =
    document.getElementById("longitude");

const locationMessage =
    document.getElementById("locationMessage");

const placesList =
    document.getElementById("placesList");

const placesCount =
    document.getElementById("placesCount");

const placesSearchInput =
    document.getElementById("placesSearchInput");

const placesListMessage =
    document.getElementById("placesListMessage");

const refreshPlacesButton =
    document.getElementById("refreshPlacesButton");

const editModeBanner =
    document.getElementById("editModeBanner");

const editModePlaceName =
    document.getElementById("editModePlaceName");

const cancelEditButton =
    document.getElementById("cancelEditButton");

const placeNameInput =
    document.getElementById("placeName");

const websiteInput =
    document.getElementById("website");

const descriptionInput =
    document.getElementById("description");

const ticketInfoInput =
    document.getElementById("ticketInfo");

const openingHoursInput =
    document.getElementById("openingHours");

const categoryOneInput =
    document.getElementById("categoryOne");

const categoryTwoInput =
    document.getElementById("categoryTwo");

const imageFileInput =
    document.getElementById("imageFile");

const imagePreviewContainer =
    document.getElementById("imagePreviewContainer");

const imagePreview =
    document.getElementById("imagePreview");

const removeSelectedImageButton =
    document.getElementById("removeSelectedImageButton");

const imageMessage =
    document.getElementById("imageMessage");

const imageUrlInput =
    document.getElementById("imageUrl");

const adminMapElement =
    document.getElementById("adminMap");

let adminMap = null;
let adminMarker = null;

let adminPlaces = [];
let editingPlaceId = null;

let editingOriginalStoragePath = null;
let editingOriginalImageUrl = "";
let removeExistingImageOnSave = false;

async function loadAdminPlaces() {
    placesListMessage.textContent =
        "Mentett helyek betöltése...";

    refreshPlacesButton.disabled = true;

    const { data, error } = await supabaseClient
        .from("places")
        .select(`
                id,
                name,
                address,
                latitude,
                longitude,
                website,
                description,
                ticket_info,
                opening_hours,
                categories,
                price_level,
                image_urls,
                image_storage_path,
                is_published,
                created_at
        `)
        .order("name", {
            ascending: true
        });

    refreshPlacesButton.disabled = false;

    if (error) {
        console.error(
            "A helylista betöltési hibája:",
            error
        );

        placesListMessage.textContent =
            "Nem sikerült betölteni a mentett helyeket.";

        placesListMessage.className =
            "message error";

        return;
    }

    adminPlaces = data || [];

    placesListMessage.textContent = "";
    placesListMessage.className = "message";

    renderAdminPlaces();
}

function renderAdminPlaces() {
    const searchText =
        placesSearchInput.value
            .trim()
            .toLocaleLowerCase("hu");

    const filteredPlaces = adminPlaces.filter(
        (place) => {
            const searchableText = [
                place.name,
                place.address,
                ...(Array.isArray(place.categories)
                    ? place.categories
                    : [])
            ]
                .join(" ")
                .toLocaleLowerCase("hu");

            return searchableText.includes(searchText);
        }
    );

    placesCount.textContent =
        searchText
            ? `${filteredPlaces.length} találat, összesen ${adminPlaces.length} hely`
            : `${adminPlaces.length} mentett hely`;

    if (filteredPlaces.length === 0) {
        placesList.innerHTML = `
            <div class="empty-list">
                ${
                    searchText
                        ? "Nincs a keresésnek megfelelő hely."
                        : "Még nincs mentett nevezetesség."
                }
            </div>
        `;

        return;
    }

    placesList.innerHTML = filteredPlaces
        .map((place) => {
            const categories =
                Array.isArray(place.categories)
                    ? place.categories
                    : [];

            const categoryHtml = categories
                .map(
                    (category) => `
                        <span class="place-list-category">
                            ${escapeHtml(category)}
                        </span>
                    `
                )
                .join("");

            const statusHtml = place.is_published
                ? `
                    <span class="place-status published">
                        Közzétéve
                    </span>
                `
                : `
                    <span class="place-status draft">
                        Piszkozat
                    </span>
                `;

            return `
                <article class="place-list-item">
                    <div class="place-list-content">
                        <h3>
                            ${escapeHtml(place.name)}
                        </h3>

                        <p class="place-list-address">
                            ${escapeHtml(place.address)}
                        </p>

                        <div class="place-list-meta">
                            ${statusHtml}
                            ${categoryHtml}
                        </div>
                    </div>

                    <div class="place-list-actions">

                            <button
                                class="edit-place-button"
                                type="button"
                                data-edit-place-id="${place.id}"
                            >
                                Szerkesztés
                            </button>

                        <button
                            class="delete-place-button"
                            type="button"
                            data-delete-place-id="${place.id}"
                            data-place-name="${escapeHtml(place.name)}"
                        >
                            Törlés
                        </button>
                    </div>
                </article>
            `;
        })
        .join("");
}

function startEditingPlace(placeId) {
    const place = adminPlaces.find(
        (item) =>
            Number(item.id) === Number(placeId)
    );

    if (!place) {
        alert(
            "A kiválasztott hely nem található."
        );

        return;
    }

    editingPlaceId = Number(place.id);

    placeNameInput.value =
        place.name || "";

    placeAddress.value =
        place.address || "";

    latitudeInput.value =
        place.latitude ?? "";

    longitudeInput.value =
        place.longitude ?? "";

    updateAdminMapPosition(
        Number(place.latitude),
        Number(place.longitude),
        true
    );

    websiteInput.value =
        place.website || "";

    descriptionInput.value =
        place.description || "";

    ticketInfoInput.value =
        place.ticket_info || "";

    openingHoursInput.value =
        place.opening_hours || "";

    const categories =
        Array.isArray(place.categories)
            ? place.categories
            : [];

    categoryOneInput.value =
        categories[0] || "";

    categoryTwoInput.value =
        categories[1] || "";

    const imageUrls =
    Array.isArray(place.image_urls)
        ? place.image_urls
        : [];

    editingOriginalImageUrl =
        imageUrls[0] || "";

    editingOriginalStoragePath =
        place.image_storage_path || null;

    removeExistingImageOnSave = false;

    imageFileInput.value = "";

    if (editingOriginalStoragePath) {
        // Supabase-be feltöltött kép.
        // Nem tesszük a külső link mezőbe.
        imageUrlInput.value = "";

        imageMessage.textContent =
            "Jelenlegi, tárhelyre feltöltött kép.";

        imageMessage.style.color =
            "#657383";
    } else {
        // Külső kép URL.
        imageUrlInput.value =
            editingOriginalImageUrl;
    }

    showImagePreview(
        editingOriginalImageUrl
    );

    const selectedPriceLevel =
        place.price_level || "";

    document
        .querySelectorAll(
            'input[name="priceLevel"]'
        )
        .forEach((input) => {
            input.checked =
                input.value === selectedPriceLevel;
        });

    isPublishedInput.checked =
        Boolean(place.is_published);

    savePlaceButton.textContent =
        "Módosítások mentése";

    cancelEditButton.classList.remove("hidden");
    editModeBanner.classList.remove("hidden");

    editModePlaceName.textContent =
        `– ${place.name}`;

    showSaveMessage("");

    placeForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    placeNameInput.focus();
}

async function deletePlace(placeId, placeName) {
    const confirmed = window.confirm(
        `Biztosan törölni szeretnéd ezt a helyet?\n\n${placeName}\n\nEz a művelet nem vonható vissza.`
    );

    if (!confirmed) {
        return;
    }

        const placeToDelete =
            adminPlaces.find(
                (place) =>
                    Number(place.id) ===
                    Number(placeId)
            );

        const storagePathToDelete =
            placeToDelete?.image_storage_path ||
            null;

    placesListMessage.textContent =
        `${placeName} törlése...`;

    placesListMessage.className = "message";

    const { error } = await supabaseClient
        .from("places")
        .delete()
        .eq("id", placeId);

    if (error) {
        console.error("Törlési hiba:", error);

        placesListMessage.textContent =
            `Nem sikerült törölni: ${error.message}`;

        placesListMessage.className =
            "message error";

        return;
    }

    if (storagePathToDelete) {
        await deleteStoredImage(
            storagePathToDelete
        );
    }

    adminPlaces = adminPlaces.filter(
        (place) => Number(place.id) !== Number(placeId)
    );

    if (
        Number(editingPlaceId) ===
        Number(placeId)
    ) {
    resetPlaceForm();
    }

    placesListMessage.textContent =
        `Törölve: ${placeName}`;

    placesListMessage.className =
        "message success";

    renderAdminPlaces();
}

async function findLocationByAddress() {
    const address = placeAddress.value.trim();

    if (!address) {
        locationMessage.textContent =
            "Először írd be a címet vagy a hely nevét.";

        locationMessage.style.color = "#b42318";
        placeAddress.focus();
        return;
    }

    findLocationButton.disabled = true;
    findLocationButton.textContent = "Keresés...";

    locationMessage.textContent =
        "Hely keresése folyamatban...";

    locationMessage.style.color = "#657383";

    try {
        const searchParameters = new URLSearchParams({
            q: address,
            format: "jsonv2",
            limit: "1",
            addressdetails: "1",
            "accept-language": "hu"
        });

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${searchParameters}`
        );

        if (!response.ok) {
            throw new Error(
                `A keresés HTTP-hibával tért vissza: ${response.status}`
            );
        }

        const results = await response.json();

        if (!Array.isArray(results) || results.length === 0) {
            locationMessage.textContent =
                "Nem találtam ilyen helyet. Próbáld meg pontosabb címmel vagy a nevezetesség nevével.";

            locationMessage.style.color = "#b42318";
            return;
        }

        const result = results[0];

        latitudeInput.value =
            Number(result.lat).toFixed(7);

        longitudeInput.value =
            Number(result.lon).toFixed(7);

        updateAdminMapPosition(
            Number(result.lat),
            Number(result.lon),
            true
        );

        locationMessage.textContent =
            `Találat: ${result.display_name} – OpenStreetMap`;

        locationMessage.style.color = "#18794e";
    } catch (error) {
        console.error("Helykeresési hiba:", error);

        locationMessage.textContent =
            "Nem sikerült lekérni a hely koordinátáit. Próbáld újra később.";

        locationMessage.style.color = "#b42318";
    } finally {
        findLocationButton.disabled = false;
        findLocationButton.textContent = "Hely megkeresése";
    }
}

async function savePlace(event) {
    event.preventDefault();

    showSaveMessage("");

    const {
        data: userData,
        error: userError
    } = await supabaseClient.auth.getUser();

    const user = userData?.user;

    if (
        userError ||
        !user ||
        user.id !== ADMIN_USER_ID
    ) {
        showSaveMessage(
            "A mentéshez adminisztrátorként kell bejelentkezned.",
            "error"
        );

        return;
    }

    const formData = new FormData(placeForm);

    const name =
        String(formData.get("name") || "").trim();

    const address =
        String(formData.get("address") || "").trim();

    const latitude =
        Number(formData.get("latitude"));

    const longitude =
        Number(formData.get("longitude"));

    const website =
        String(formData.get("website") || "").trim();

    const description =
        String(formData.get("description") || "").trim();

    const ticketInfo =
        String(formData.get("ticketInfo") || "").trim();

    const openingHours =
        String(formData.get("openingHours") || "").trim();

    const categoryOne =
        String(formData.get("categoryOne") || "").trim();

    const categoryTwo =
        String(formData.get("categoryTwo") || "").trim();

    const priceLevel =
        String(formData.get("priceLevel") || "").trim();

    const imageUrl =
        String(formData.get("imageUrl") || "").trim();

    const selectedImageFile =
        imageFileInput.files?.[0] || null;

    const isPublished =
        formData.get("isPublished") === "on";

    const categories = [
        categoryOne,
        categoryTwo
    ].filter(
        (category, index, array) =>
            category &&
            array.indexOf(category) === index
    );

    if (!name || !address) {
        showSaveMessage(
            "A nevet és a címet kötelező megadni.",
            "error"
        );

        return;
    }

    if (
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90
    ) {
        showSaveMessage(
            "A szélességi koordináta nem megfelelő.",
            "error"
        );

        return;
    }

    if (
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
    ) {
        showSaveMessage(
            "A hosszúsági koordináta nem megfelelő.",
            "error"
        );

        return;
    }

    if (categories.length === 0) {
        showSaveMessage(
            "Legalább egy kategóriát adj meg.",
            "error"
        );

        return;
    }

    const isEditing =
        editingPlaceId !== null;

    savePlaceButton.disabled = true;

    let finalImageUrl =
    editingOriginalImageUrl || "";

let finalStoragePath =
    editingOriginalStoragePath || null;

let newlyUploadedStoragePath = null;

try {
    if (selectedImageFile) {
        savePlaceButton.textContent =
            "Kép tömörítése és feltöltése...";

        imageMessage.textContent =
            "A kép tömörítése és feltöltése folyamatban...";

        imageMessage.style.color =
            "#657383";

        const uploadResult =
            await uploadPlaceImage(
                selectedImageFile
            );

        finalImageUrl =
            uploadResult.publicUrl;

        finalStoragePath =
            uploadResult.storagePath;

        newlyUploadedStoragePath =
            uploadResult.storagePath;

        const sizeInKilobytes =
            Math.round(
                uploadResult.sizeBytes / 1024
            );

        imageMessage.textContent =
            `A tömörített kép feltöltve: ${sizeInKilobytes} KB`;

        imageMessage.style.color =
            "#18794e";
    } else if (imageUrl) {
        finalImageUrl = imageUrl;
        finalStoragePath = null;
    } else if (removeExistingImageOnSave) {
        finalImageUrl = "";
        finalStoragePath = null;
    }
} catch (error) {
    console.error(
        "Képfeltöltési hiba:",
        error
    );

    savePlaceButton.disabled = false;

    savePlaceButton.textContent =
        isEditing
            ? "Módosítások mentése"
            : "Nevezetesség mentése";

    showSaveMessage(
        `Nem sikerült feltölteni a képet: ${
            error.message ||
            "ismeretlen hiba"
        }`,
        "error"
    );

    return;
}

    savePlaceButton.textContent =
        isEditing
            ? "Módosítások mentése..."
            : "Mentés...";

    const placeToSave = {
        name,
        address,
        latitude,
        longitude,

        website:
            website || null,

        description:
            description || null,

        ticket_info:
            ticketInfo || null,

        opening_hours:
            openingHours || null,

        categories,

        price_level:
            priceLevel || null,

        image_urls:
            finalImageUrl
                ? [finalImageUrl]
                : [],

        image_storage_path:
            finalStoragePath,

        is_published:
            isPublished
    };

    let result;

    if (isEditing) {
        result = await supabaseClient
            .from("places")
            .update(placeToSave)
            .eq("id", editingPlaceId)
            .select("id, name");
    } else {
        result = await supabaseClient
            .from("places")
            .insert(placeToSave)
            .select("id, name");
    }

    const {
        data,
        error
    } = result;

    savePlaceButton.disabled = false;

    savePlaceButton.textContent =
        isEditing
            ? "Módosítások mentése"
            : "Nevezetesség mentése";

    if (error) {
        if (newlyUploadedStoragePath) {
            await deleteStoredImage(
                newlyUploadedStoragePath
            );
        }
        console.error(
            "Mentési hiba:",
            error
        );

        showSaveMessage(
            `Nem sikerült elmenteni: ${error.message}`,
            "error"
        );

        return;
    }

    const savedPlace = data?.[0];

    if (
    isEditing &&
    editingOriginalStoragePath &&
    editingOriginalStoragePath !==
        finalStoragePath
    ) {
        await deleteStoredImage(
            editingOriginalStoragePath
        );
    }

    const successText = isEditing
        ? `Sikeresen módosítva: ${
            savedPlace?.name || name
        }`
        : `Sikeresen elmentve: ${
            savedPlace?.name || name
        }`;

    resetPlaceForm();

    showSaveMessage(
        successText,
        "success"
    );

    await loadAdminPlaces();
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function showMessage(text, type = "") {
    loginMessage.textContent = text;
    loginMessage.className = "message";

    if (type) {
        loginMessage.classList.add(type);
    }
}

function showSaveMessage(text, type = "") {
    saveMessage.textContent = text;
    saveMessage.className = "message full-width";

    if (type) {
        saveMessage.classList.add(type);
    }
}

function initializeAdminMap() {
    if (adminMap) {
        setTimeout(() => {
            adminMap.invalidateSize();
        }, 100);

        return;
    }

    adminMap = L.map("adminMap", {
        zoomControl: true,
        minZoom: 3,
        maxZoom: 19
    }).setView(
        [47.1625, 19.5033],
        7
    );

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                "&copy; OpenStreetMap közreműködők"
        }
    ).addTo(adminMap);

    adminMap.on("click", (event) => {
        const latitude =
            Number(event.latlng.lat.toFixed(7));

        const longitude =
            Number(event.latlng.lng.toFixed(7));

        latitudeInput.value = latitude;
        longitudeInput.value = longitude;

        updateAdminMapPosition(
            latitude,
            longitude,
            false
        );

        locationMessage.textContent =
            "A pozíciót a térképen állítottad be.";

        locationMessage.style.color =
            "#18794e";
    });

    setTimeout(() => {
        adminMap.invalidateSize();
    }, 100);
}

function updateAdminMapPosition(
    latitude,
    longitude,
    zoomToMarker = true
) {
    if (
        !Number.isFinite(Number(latitude)) ||
        !Number.isFinite(Number(longitude))
    ) {
        return;
    }

    initializeAdminMap();

    const position = [
        Number(latitude),
        Number(longitude)
    ];

    if (!adminMarker) {
        adminMarker = L.marker(
            position,
            {
                draggable: true
            }
        ).addTo(adminMap);

        adminMarker.on(
            "dragend",
            () => {
                const markerPosition =
                    adminMarker.getLatLng();

                latitudeInput.value =
                    markerPosition.lat.toFixed(7);

                longitudeInput.value =
                    markerPosition.lng.toFixed(7);

                locationMessage.textContent =
                    "A jelölő pozíciója módosítva.";

                locationMessage.style.color =
                    "#18794e";
            }
        );
    } else {
        adminMarker.setLatLng(position);
    }

    if (zoomToMarker) {
        adminMap.setView(
            position,
            16
        );
    }
}

function showImagePreview(imageSource) {
    if (!imageSource) {
        imagePreview.src = "";
        imagePreviewContainer.classList.add("hidden");
        return;
    }

    imagePreview.src = imageSource;
    imagePreviewContainer.classList.remove("hidden");
}

function clearImageSelection(
    markExistingImageForRemoval = true
) {
    imageFileInput.value = "";
    imageUrlInput.value = "";

    imagePreview.src = "";
    imagePreviewContainer.classList.add("hidden");

    imageMessage.textContent = "";

    if (
        markExistingImageForRemoval &&
        editingPlaceId !== null &&
        editingOriginalImageUrl
    ) {
        removeExistingImageOnSave = true;
    }
}

async function compressImageToWebp(file) {
    const maximumWidth = 1600;
    const maximumHeight = 1200;
    const webpQuality = 0.78;

    const temporaryUrl =
        URL.createObjectURL(file);

    try {
        const image = new Image();

        await new Promise((resolve, reject) => {
            image.onload = resolve;

            image.onerror = () => {
                reject(
                    new Error(
                        "A kiválasztott képet nem sikerült megnyitni."
                    )
                );
            };

            image.src = temporaryUrl;
        });

        let width = image.naturalWidth;
        let height = image.naturalHeight;

        if (!width || !height) {
            throw new Error(
                "A kép mérete nem állapítható meg."
            );
        }

        const scale = Math.min(
            1,
            maximumWidth / width,
            maximumHeight / height
        );

        width = Math.round(width * scale);
        height = Math.round(height * scale);

        const canvas =
            document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context =
            canvas.getContext("2d");

        if (!context) {
            throw new Error(
                "A böngésző nem tudja feldolgozni a képet."
            );
        }

        context.drawImage(
            image,
            0,
            0,
            width,
            height
        );

        const compressedBlob =
            await new Promise(
                (resolve, reject) => {
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(
                                    new Error(
                                        "Nem sikerült tömöríteni a képet."
                                    )
                                );
                            }
                        },
                        "image/webp",
                        webpQuality
                    );
                }
            );

        return compressedBlob;
    } finally {
        URL.revokeObjectURL(
            temporaryUrl
        );
    }
}


async function uploadPlaceImage(file) {
    const compressedImage =
        await compressImageToWebp(file);

    const storagePath =
        `places/${crypto.randomUUID()}.webp`;

    const {
        error: uploadError
    } = await supabaseClient.storage
        .from("place-images")
        .upload(
            storagePath,
            compressedImage,
            {
                contentType: "image/webp",
                cacheControl: "31536000",
                upsert: false
            }
        );

    if (uploadError) {
        throw uploadError;
    }

    const {
        data: publicUrlData
    } = supabaseClient.storage
        .from("place-images")
        .getPublicUrl(storagePath);

    if (!publicUrlData?.publicUrl) {
        await supabaseClient.storage
            .from("place-images")
            .remove([storagePath]);

        throw new Error(
            "Nem sikerült létrehozni a kép nyilvános címét."
        );
    }

    return {
        publicUrl:
            publicUrlData.publicUrl,

        storagePath,

        sizeBytes:
            compressedImage.size
    };
}


async function deleteStoredImage(
    storagePath
) {
    if (!storagePath) {
        return true;
    }

    const {
        error
    } = await supabaseClient.storage
        .from("place-images")
        .remove([storagePath]);

    if (error) {
        console.error(
            "A tárolt kép törlési hibája:",
            error
        );

        return false;
    }

    return true;
}

function resetPlaceForm() {
    placeForm.reset();

    editingPlaceId = null;

    clearImageSelection(false);

    if (adminMarker && adminMap) {
        adminMap.removeLayer(adminMarker);
        adminMarker = null;

        adminMap.setView(
            [47.1625, 19.5033],
            7
        );
    }

    editingOriginalStoragePath = null;
    editingOriginalImageUrl = "";
    removeExistingImageOnSave = false;

    isPublishedInput.checked = true;

    savePlaceButton.textContent =
        "Nevezetesség mentése";

    cancelEditButton.classList.add("hidden");
    editModeBanner.classList.add("hidden");

    editModePlaceName.textContent = "";
    locationMessage.textContent = "";
}


function showLogin() {
    loginSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
}


function showDashboard(user) {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");

    userEmail.textContent =
        `Bejelentkezett felhasználó: ${user.email}`;

    initializeAdminMap();
    loadAdminPlaces();
}


async function verifyAdminUser(user) {
    if (!user) {
        showLogin();
        return false;
    }

    if (user.id !== ADMIN_USER_ID) {
        await supabaseClient.auth.signOut({
            scope: "local"
        });

        showLogin();

        showMessage(
            "Ez a felhasználó nem rendelkezik adminisztrátori jogosultsággal.",
            "error"
        );

        return false;
    }

    showDashboard(user);
    return true;
}


async function checkCurrentUser() {
    const {
        data,
        error
    } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        showLogin();
        return;
    }

    await verifyAdminUser(data.user);
}


loginForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        showMessage("");

        loginButton.disabled = true;
        loginButton.textContent = "Belépés...";

        const formData =
            new FormData(loginForm);

        const email =
            String(formData.get("email") || "")
                .trim();

        const password =
            String(formData.get("password") || "");


        const {
            data,
            error
        } = await supabaseClient.auth
            .signInWithPassword({
                email,
                password
            });


        loginButton.disabled = false;
        loginButton.textContent = "Belépés";


        if (error) {
            console.error(
                "Belépési hiba:",
                error
            );

            showMessage(
                "Sikertelen belépés. Ellenőrizd az e-mail-címet és a jelszót.",
                "error"
            );

            return;
        }


        const isAdmin =
            await verifyAdminUser(data.user);

        if (isAdmin) {
            loginForm.reset();

            showMessage(
                "Sikeres belépés.",
                "success"
            );
        }
    }
);


logoutButton.addEventListener(
    "click",
    async () => {
        const { error } =
            await supabaseClient.auth.signOut({
                scope: "local"
            });

        if (error) {
            console.error(
                "Kijelentkezési hiba:",
                error
            );

            alert(
                "Nem sikerült kijelentkezni."
            );

            return;
        }

        showLogin();
        loginForm.reset();
        showMessage("");
    }
);

findLocationButton.addEventListener(
    "click",
    findLocationByAddress
);

function updateMapFromCoordinateInputs() {
    const latitude =
        Number(latitudeInput.value);

    const longitude =
        Number(longitudeInput.value);

    if (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
    ) {
        updateAdminMapPosition(
            latitude,
            longitude,
            true
        );
    }
}

latitudeInput.addEventListener(
    "change",
    updateMapFromCoordinateInputs
);

longitudeInput.addEventListener(
    "change",
    updateMapFromCoordinateInputs
);

placeForm.addEventListener(
    "submit",
    savePlace
);

clearFormButton.addEventListener(
    "click",
    () => {
        resetPlaceForm();
        showSaveMessage("");

        placeNameInput.focus();
    }
);

cancelEditButton.addEventListener(
    "click",
    () => {
        resetPlaceForm();

        showSaveMessage(
            "A szerkesztés megszakítva."
        );

        placeNameInput.focus();
    }
);

placesSearchInput.addEventListener(
    "input",
    renderAdminPlaces
);

refreshPlacesButton.addEventListener(
    "click",
    loadAdminPlaces
);

placesList.addEventListener(
    "click",
    async (event) => {
        const editButton =
            event.target.closest(
                "[data-edit-place-id]"
            );

        if (editButton) {
            const placeId = Number(
                editButton.dataset.editPlaceId
            );

            startEditingPlace(placeId);
            return;
        }

        const deleteButton =
            event.target.closest(
                "[data-delete-place-id]"
            );

        if (!deleteButton) {
            return;
        }

        const placeId = Number(
            deleteButton.dataset.deletePlaceId
        );

        const placeName =
            deleteButton.dataset.placeName ||
            "Ismeretlen hely";

        await deletePlace(
            placeId,
            placeName
        );
    }
);



imageFileInput.addEventListener(
    "change",
    () => {
        const file = imageFileInput.files?.[0];

        imageMessage.textContent = "";

        if (!file) {
            showImagePreview(
                imageUrlInput.value.trim()
            );

            return;
        }

        if (!file.type.startsWith("image/")) {
            imageMessage.textContent =
                "A kiválasztott fájl nem kép.";

            imageMessage.style.color = "#b42318";

            imageFileInput.value = "";
            return;
        }

        removeExistingImageOnSave = false;

        const temporaryUrl =
            URL.createObjectURL(file);

        showImagePreview(temporaryUrl);

        imageMessage.textContent =
            `Kiválasztva: ${file.name}`;

        imageMessage.style.color = "#18794e";
    }
);

imageUrlInput.addEventListener(
    "change",
    () => {
        if (imageFileInput.files?.length) {
            return;
        }

        const imageUrl =
            imageUrlInput.value.trim();

        if (imageUrl) {
            removeExistingImageOnSave = false;
        }

        showImagePreview(imageUrl);
    }
);

removeSelectedImageButton.addEventListener(
    "click",
    clearImageSelection
);


checkCurrentUser();