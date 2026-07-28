let places = [];
let allCategories = [];

const map = L.map("map", {
    zoomControl: true,
    minZoom: 3,
    maxZoom: 19
}).setView([47.1625, 19.5033], 7);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap közreműködők"
}).addTo(map);

const markerLayer = L.markerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true,
    removeOutsideVisibleBounds: true,
    maxClusterRadius: 55
});

markerLayer.addTo(map);

const markerByPlaceId = new Map();

const detailsPanel = document.getElementById("detailsPanel");
const detailsContent = document.getElementById("detailsContent");
const closeDetailsButton = document.getElementById("closeDetailsButton");
const placeSearchInput = document.getElementById("placeSearchInput");
const placeSearchResults = document.getElementById("placeSearchResults");
const categoryFilters = document.getElementById("categoryFilters");
const resetFiltersButton = document.getElementById("resetFiltersButton");
const priceFilters = document.getElementById("priceFilters");
const filterPanel = document.getElementById("filterPanel");
const mobileFilterToggle = document.getElementById("mobileFilterToggle");

const selectedCategories = new Set();
const selectedPriceLevels = new Set();


function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function loadPlaces() {
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
            image_urls
        `)
        .eq("is_published", true)
        .order("name", {
            ascending: true
        });

    if (error) {
        console.error(
            "Nem sikerült betölteni a helyeket:",
            error
        );

        alert(
            "Nem sikerült betölteni a nevezetességeket."
        );

        return;
    }

    places = data.map((place) => ({
        id: Number(place.id),

        name: place.name,
        address: place.address,

        latitude: Number(place.latitude),
        longitude: Number(place.longitude),

        website: place.website || "",

        description:
            place.description || "Nincs megadva leírás.",

        ticketInfo:
            place.ticket_info ||
            "Nincs megadva jegyinformáció.",

        openingHours:
            place.opening_hours ||
            "Nincs megadva nyitvatartás.",

        categories:
            Array.isArray(place.categories)
                ? place.categories
                : [],

        priceLevel:
            place.price_level || null,

        image:
            Array.isArray(place.image_urls) &&
            place.image_urls.length > 0
                ? place.image_urls[0]
                : ""
    }));

    allCategories = [
        ...new Set(
            places.flatMap(
                (place) => place.categories
            )
        )
    ].sort(
        (a, b) => a.localeCompare(b, "hu")
    );

    renderCategoryFilters();
    renderMarkers();

    console.log(
        `${places.length} hely betöltve az adatbázisból.`
    );
}

function renderCategoryFilters() {
    categoryFilters.innerHTML = "";

    allCategories.forEach((category) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "category-button";
        button.textContent = category;
        button.dataset.category = category;

        button.addEventListener("click", () => {
            if (selectedCategories.has(category)) {
                selectedCategories.delete(category);
                button.classList.remove("active");
            } else {
                selectedCategories.add(category);
                button.classList.add("active");
            }

            renderMarkers();
        });

        categoryFilters.appendChild(button);
    });
}

function initializePriceFilters() {
    priceFilters
        .querySelectorAll("[data-price-level]")
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    const priceLevel =
                        button.dataset.priceLevel;

                    if (
                        selectedPriceLevels.has(
                            priceLevel
                        )
                    ) {
                        selectedPriceLevels.delete(
                            priceLevel
                        );

                        button.classList.remove(
                            "active"
                        );
                    } else {
                        selectedPriceLevels.add(
                            priceLevel
                        );

                        button.classList.add(
                            "active"
                        );
                    }

                    renderMarkers();
                }
            );
        });
}

function getVisiblePlaces() {
    return places.filter((place) => {
        const categoryMatches =
            selectedCategories.size === 0 ||
            place.categories.some(
                (category) =>
                    selectedCategories.has(category)
            );

        const priceMatches =
            selectedPriceLevels.size === 0 ||
            selectedPriceLevels.has(
                place.priceLevel
            );

        return categoryMatches && priceMatches;
    });
}

const CATEGORY_MARKER_CONFIG = {
    "Állatkert": {
        symbol: "🐾",
        color: "#2e7d32"
    },

    "Múzeum": {
        symbol: "🏛",
        color: "#7b1fa2"
    },

    "Vár / kastély": {
        symbol: "🏰",
        color: "#6d4c41"
    },

    "Séta / pihenőhely": {
        symbol: "🌳",
        color: "#00897b"
    },

    "Túra / kirándulóhely": {
        symbol: "▲",
        color: "#455a64"
    },

    "Kajálda": {
        symbol: "🍴",
        color: "#e65100"
    },

    "Helyi érdekesség": {
        symbol: "★",
        color: "#c2185b"
    }
};


const DEFAULT_MARKER_CONFIG = {
    symbol: "●",
    color: "#546e7a"
};


function getCategoryMarkerIcon(place) {
    const primaryCategory =
        Array.isArray(place.categories)
            ? place.categories[0]
            : "";

    const markerConfig =
        CATEGORY_MARKER_CONFIG[primaryCategory] ||
        DEFAULT_MARKER_CONFIG;

    return L.divIcon({
        className: "category-marker-wrapper",

        html: `
            <div
                class="category-marker-pin"
                style="--marker-color: ${markerConfig.color}"
            >
                <span class="category-marker-symbol">
                    ${markerConfig.symbol}
                </span>
            </div>
        `,

        iconSize: [42, 48],
        iconAnchor: [21, 46],
        popupAnchor: [0, -43]
    });
}

function renderMarkers() {
    markerLayer.clearLayers();
    markerByPlaceId.clear();

    const visiblePlaces = getVisiblePlaces();

    visiblePlaces.forEach((place) => {
        const marker = L.marker(
    [
        place.latitude,
        place.longitude
    ],
    {
        icon:
            getCategoryMarkerIcon(place),

        title:
            place.name,

        alt:
            place.name,

        riseOnHover:
            true
    }
);

        marker.bindPopup(`
            <strong class="popup-title">${escapeHtml(place.name)}</strong>
            <span>${escapeHtml(place.address)}</span><br>
            <button
                class="popup-button"
                type="button"
                onclick="openPlaceDetails(${place.id})"
            >
                Adatlap megnyitása
            </button>
        `);

        marker.addTo(markerLayer);
        markerByPlaceId.set(place.id, marker);
    });

    const currentlyOpenPlaceId = Number(
        detailsPanel.dataset.placeId || 0
    );

    if (
        currentlyOpenPlaceId &&
        !visiblePlaces.some((place) => place.id === currentlyOpenPlaceId)
    ) {
        closePlaceDetails();
    }
}

function renderPlaceSearchResults() {
    const searchText =
        placeSearchInput.value
            .trim()
            .toLocaleLowerCase("hu");

    if (searchText.length < 2) {
        placeSearchResults.innerHTML = "";

        placeSearchResults.classList.add(
            "hidden"
        );

        return;
    }

    const matchingPlaces = places
        .filter((place) => {
            const searchableText = [
                place.name,
                place.address,
                ...place.categories
            ]
                .join(" ")
                .toLocaleLowerCase("hu");

            return searchableText.includes(
                searchText
            );
        })
        .slice(0, 10);

    placeSearchResults.classList.remove(
        "hidden"
    );

    if (matchingPlaces.length === 0) {
        placeSearchResults.innerHTML = `
            <div class="map-search-empty">
                Nincs találat.
            </div>
        `;

        return;
    }

    placeSearchResults.innerHTML =
        matchingPlaces
            .map(
                (place) => `
                    <button
                        class="map-search-result"
                        type="button"
                        data-search-place-id="${place.id}"
                    >
                        <strong>
                            ${escapeHtml(place.name)}
                        </strong>

                        <span>
                            ${escapeHtml(place.address)}
                        </span>
                    </button>
                `
            )
            .join("");
}

function setMobileFiltersOpen(isOpen) {
    filterPanel.classList.toggle(
        "mobile-open",
        isOpen
    );

    mobileFilterToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    mobileFilterToggle.textContent =
        isOpen
            ? "Bezárás"
            : "Szűrők";
}


function toggleMobileFilters() {
    const isCurrentlyOpen =
        filterPanel.classList.contains(
            "mobile-open"
        );

    setMobileFiltersOpen(
        !isCurrentlyOpen
    );
}


function closeMobileFilters() {
    setMobileFiltersOpen(false);
}

function selectPlaceFromSearch(placeId) {
    const place = places.find(
        (item) =>
            Number(item.id) ===
            Number(placeId)
    );

    if (!place) {
        return;
    }

    clearActiveFilters();
    renderMarkers();

    placeSearchInput.value = place.name;

    placeSearchResults.innerHTML = "";
    placeSearchResults.classList.add("hidden");

    const marker =
        markerByPlaceId.get(place.id);

    if (!marker) {
        return;
    }

    markerLayer.zoomToShowLayer(
        marker,
        () => {
            marker.openPopup();
            openPlaceDetails(place.id);
        }
    );
}

function clearActiveFilters() {
    selectedCategories.clear();
    selectedPriceLevels.clear();

    document
        .querySelectorAll(".category-button")
        .forEach((button) => {
            button.classList.remove("active");
        });
}

function openPlaceDetails(placeId) {
    const place = places.find((item) => item.id === placeId);

    if (!place) {
        return;
    }

    detailsPanel.dataset.placeId = String(place.id);
    detailsPanel.classList.add("open");
    detailsPanel.setAttribute("aria-hidden", "false");

    const categoryTags = place.categories
        .map(
            (category) =>
                `<span class="category-tag">${escapeHtml(category)}</span>`
        )
        .join("");

    let priceHtml = "";

    if (place.priceLevel === "cheap") {
        priceHtml = `
            <span class="price-badge cheap">
                Olcsó
            </span>
        `;
    }

    if (place.priceLevel === "expensive") {
        priceHtml = `
            <span class="price-badge expensive">
                Drága
            </span>
        `;
    }

    detailsContent.innerHTML = `
        <img
            class="place-image"
            src="${escapeHtml(place.image)}"
            alt="${escapeHtml(place.name)}"
        >

        <h2>${escapeHtml(place.name)}</h2>
        <p class="address">${escapeHtml(place.address)}</p>

        <div class="category-list">
            ${categoryTags}
        </div>

        ${
            priceHtml
                ? `
                    <section class="info-block">
                    <h3>Árkategória</h3>
                    ${priceHtml}
                    </section>
                `
                : ""
        }

        <section class="info-block">
            <h3>Leírás</h3>
            <p>${escapeHtml(place.description)}</p>
        </section>

        <section class="info-block">
            <h3>Jegyinformáció</h3>
            <p>${escapeHtml(place.ticketInfo)}</p>
        </section>

        <section class="info-block">
            <h3>Nyitvatartás</h3>
            <p>${escapeHtml(place.openingHours)}</p>
        </section>

        <section class="info-block">
            <h3>Weboldal</h3>
            <a
                class="website-link"
                href="${escapeHtml(place.website)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Hivatalos weboldal megnyitása
            </a>
        </section>
    `;

    map.panTo([place.latitude, place.longitude], {
        animate: true,
        duration: 0.35
    });
}

function closePlaceDetails() {
    detailsPanel.classList.remove("open");
    detailsPanel.setAttribute("aria-hidden", "true");
    detailsPanel.dataset.placeId = "";
}

function resetFilters() {
    clearActiveFilters();
    renderMarkers();
}

closeDetailsButton.addEventListener("click", closePlaceDetails);
resetFiltersButton.addEventListener("click", resetFilters);

placeSearchInput.addEventListener(
    "input",
    renderPlaceSearchResults
);

placeSearchResults.addEventListener(
    "click",
    (event) => {
        const resultButton =
            event.target.closest(
                "[data-search-place-id]"
            );

        if (!resultButton) {
            return;
        }

        const placeId = Number(
            resultButton.dataset.searchPlaceId
        );

        selectPlaceFromSearch(placeId);
    }
);

mobileFilterToggle.addEventListener(
    "click",
    toggleMobileFilters
);

window.addEventListener(
    "resize",
    () => {
        if (window.innerWidth > 768) {
            closeMobileFilters();
        }
    }
);

document.addEventListener(
    "click",
    (event) => {
        const clickedInsideSearch =
            event.target.closest(".map-search");

        if (!clickedInsideSearch) {
            placeSearchResults.classList.add(
                "hidden"
            );
        }
    }
);

map.on("click", () => {
    map.closePopup();
});

map.getContainer().addEventListener(
        "pointerdown",
        (event) => {
            if (window.innerWidth > 768) {
                return;
            }

            if (!(event.target instanceof Element)) {
                return;
            }

            const clickedInteractiveElement =
                event.target.closest(`
                    .leaflet-marker-icon,
                    .marker-cluster,
                    .leaflet-control,
                    .leaflet-popup
                `);

            if (!clickedInteractiveElement) {
                closeMobileFilters();
            }
        },
        {
            passive: true
        }
    );

window.openPlaceDetails = openPlaceDetails;

initializePriceFilters();
loadPlaces();