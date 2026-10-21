// Config
const MOBILE_BREAKPOINT = 768;
const LANDSCAPE_BREAKPOINT = 900;
const SHEET_COLLAPSED_HEIGHT = 200;
const SHEET_TOP_GAP = 80;
const DRAG_TAP_THRESHOLD = 8;
const DRAG_CLOSE_THRESHOLD = 65;
const DRAG_EXPAND_SNAP = 0.28;
const DRAG_COLLAPSE_SNAP = 0.72;

const CATEGORY_MARKER_CONFIG = {
	"Állatkert": { symbol: "🐾", color: "#2f9e62" },
	"Múzeum": { symbol: "🏛", color: "#8b5cf6" },
	"Vár / kastély": { symbol: "🏰", color: "#b7793f" },
	"Séta / pihenőhely": { symbol: "🌳", color: "#0ea5a4" },
	"Túra / kirándulóhely": { symbol: "▲", color: "#64748b" },
	"Kajálda": { symbol: "🍴", color: "#f97316" },
	"Helyi érdekesség": { symbol: "★", color: "#ec4899" }
};
const DEFAULT_MARKER_CONFIG = { symbol: "●", color: "#64748b" };
const MONTH_NAMES = [
	"Január", "Február", "Március", "Április", "Május", "Június",
	"Július", "Augusztus", "Szeptember", "Október", "November", "December"
];
const ORDINAL_NAMES = {
	"1": "első",
	"2": "második",
	"3": "harmadik",
	"4": "negyedik",
	"5": "ötödik",
	"-1": "utolsó"
};
const WEEKDAY_RULE_NAMES = {
	"0": "vasárnapján",
	"1": "hétfőjén",
	"2": "keddjén",
	"3": "szerdáján",
	"4": "csütörtökén",
	"5": "péntekén",
	"6": "szombatján"
};

// State
let places = [];
let events = [];
let monthlyEvents = [];
let allCategories = [];
let selectedMarkerId = null;
let activeEventId = null;
let lightboxSourceImage = null;
let detailsDragging = false;
let detailsDragStartY = 0;
let detailsDragCurrentY = 0;
let detailsDragStartProgress = 0;
let detailsDragStartedExpanded = false;
let detailsDragCaptureElement = null;
let suppressDetailsClick = false;
let detailsSheetProgress = 0;

const selectedCategories = new Set();
const selectedPriceLevels = new Set();
const markerByPlaceId = new Map();

// Map
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
	maxClusterRadius: 55,
	iconCreateFunction(cluster) {
		const count = cluster.getChildCount();
		const size = count < 10 ? "small" : count < 100 ? "medium" : "large";

		return L.divIcon({
			className: `modern-cluster ${size}`,
			html: `<span>${count}</span>`,
			iconSize: [44, 44]
		});
	}
});
markerLayer.addTo(map);

const eventMarkerLayer = L.layerGroup().addTo(map);

// Elements
const detailsPanel = document.getElementById("detailsPanel");
const detailsContent = document.getElementById("detailsContent");
const closeDetailsButton = document.getElementById("closeDetailsButton");
const detailsBackdrop = document.getElementById("detailsBackdrop");
const detailsDragZone = document.getElementById("detailsDragZone");
const detailsDragHintText = document.getElementById("detailsDragHintText");

const placeSearchInput = document.getElementById("placeSearchInput");
const placeSearchResults = document.getElementById("placeSearchResults");
const categoryFilters = document.getElementById("categoryFilters");
const listCategoryFilters = document.getElementById("listCategoryFilters");
const activeFilterCount = document.getElementById("activeFilterCount");
const priceFilterSection = document.getElementById("priceFilterSection");
const listPriceFilterSection = document.getElementById("listPriceFilterSection");
const resetFiltersButton = document.getElementById("resetFiltersButton");
const mobileResetFiltersButton = document.getElementById("mobileResetFiltersButton");
const listClearFiltersButton = document.getElementById("listClearFiltersButton");

const filterPanel = document.getElementById("filterPanel");
const mobileSearchButton = document.getElementById("mobileSearchButton");
const mobileListButton = document.getElementById("mobileListButton");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileShowMapButton = document.getElementById("mobileShowMapButton");
const uiBackdrop = document.getElementById("uiBackdrop");

const listPanel = document.getElementById("listPanel");
const desktopListButton = document.getElementById("desktopListButton");
const closeListButton = document.getElementById("closeListButton");
const listSearchInput = document.getElementById("listSearchInput");
const listSortSelect = document.getElementById("listSortSelect");
const listResultsCount = document.getElementById("listResultsCount");
const placesListView = document.getElementById("placesListView");

const desktopEventsButton = document.getElementById("desktopEventsButton");
const desktopEventsClose = document.getElementById("desktopEventsClose");
const desktopEventsPanel = document.getElementById("desktopEventsPanel");
const desktopEventsList = document.getElementById("desktopEventsList");
const mobileEventsList = document.getElementById("mobileEventsList");
const desktopEventsTitle = document.getElementById("desktopEventsTitle");
const mobileEventsTitle = document.getElementById("mobileEventsTitle");
const desktopEventCount = document.getElementById("desktopEventCount");

const imageLightbox = document.getElementById("imageLightbox");
const imageLightboxImage = document.getElementById("imageLightboxImage");
const imageLightboxClose = document.getElementById("imageLightboxClose");
const appVersionElements = document.querySelectorAll(".app-version");

// Helpers
function escapeHtml(value) {
	return String(value ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

function isMobile() {
	return window.innerWidth <= MOBILE_BREAKPOINT || isMobileLandscape();
}

function isMobileLandscape() {
	return window.innerWidth <= LANDSCAPE_BREAKPOINT && window.matchMedia("(orientation: landscape)").matches;
}

function isMobilePortrait() {
	return isMobile() && !isMobileLandscape();
}

function getMonthName(month) {
	return MONTH_NAMES[Number(month) - 1] || "";
}

function getMonthRangeLabel(startMonth, endMonth) {
	const start = getMonthName(startMonth);
	const end = getMonthName(endMonth);
	return Number(startMonth) === Number(endMonth) ? start : `${start}–${end}`;
}

function monthRangeContains(month, startMonth, endMonth) {
	const start = Number(startMonth);
	const end = Number(endMonth || startMonth);
	if (start <= end) {
		return month >= start && month <= end;
	}
	return month >= start || month <= end;
}

function getNthWeekdayDate(year, monthIndex, ordinal, weekday) {
	const targetWeekday = Number(weekday);
	const targetOrdinal = Number(ordinal);
	if (targetOrdinal === -1) {
		const lastDay = new Date(year, monthIndex + 1, 0);
		const offset = (lastDay.getDay() - targetWeekday + 7) % 7;
		return new Date(year, monthIndex, lastDay.getDate() - offset);
	}

	const firstDay = new Date(year, monthIndex, 1);
	const offset = (targetWeekday - firstDay.getDay() + 7) % 7;
	const day = 1 + offset + ((targetOrdinal - 1) * 7);
	const result = new Date(year, monthIndex, day);
	return result.getMonth() === monthIndex ? result : null;
}

function formatOccurrenceDate(date) {
	return new Intl.DateTimeFormat("hu-HU", {
		month: "long",
		day: "numeric"
	}).format(date);
}

function getMonthlyRuleLabel(ordinal, weekday) {
	return `Minden hónap ${ORDINAL_NAMES[String(ordinal)] || ""} ${WEEKDAY_RULE_NAMES[String(weekday)] || ""}`.trim();
}

function getMonthTitle(date = new Date()) {
	const month = new Intl.DateTimeFormat("hu-HU", { month: "long" }).format(date);
	return `${month.charAt(0).toUpperCase()}${month.slice(1)}i események`;
}

function getPlaceById(placeId) {
	return places.find((place) => Number(place.id) === Number(placeId)) || null;
}

function getBrowseablePlaces() {
	return places.filter((place) => !place.isEventOnly);
}

// Version
async function loadAppVersion() {
	const { data, error } = await supabaseClient
		.from("app_settings")
		.select("version_major, version_minor")
		.eq("id", 1)
		.single();

	if (error) {
		console.error("Verzió betöltési hiba:", error);
		return;
	}

	const version = `v${data.version_major}.${data.version_minor}`;
	appVersionElements.forEach((element) => {
		element.textContent = version;
	});
}

// Data
async function loadPlaces() {
	const { data, error } = await supabaseClient
		.from("places")
		.select(`
			id,
			name,
			address,
			city,
			latitude,
			longitude,
			website,
			description,
			ticket_info,
			opening_hours,
			categories,
			price_level,
			image_urls,
			is_event_only
		`)
		.eq("is_published", true)
		.order("name", { ascending: true });

	if (error) {
		console.error("Nem sikerült betölteni a helyeket:", error);
		return;
	}

	places = (data || []).map((place) => {
		const categories = Array.isArray(place.categories) ? place.categories : [];
		const imageUrls = Array.isArray(place.image_urls) ? place.image_urls : [];

		return {
			id: Number(place.id),
			name: place.name,
			address: place.address,
			city: place.city || "",
			latitude: Number(place.latitude),
			longitude: Number(place.longitude),
			website: place.website || "",
			description: place.description || "Nincs megadva leírás.",
			ticketInfo: place.ticket_info || "Nincs megadva jegyinformáció.",
			openingHours: place.opening_hours || "Nincs megadva nyitvatartás.",
			categories,
			priceLevel: place.price_level || null,
			image: imageUrls[0] || "",
			isEventOnly: Boolean(place.is_event_only),
			searchText: [place.name, place.address, place.city, ...categories]
				.join(" ")
				.toLocaleLowerCase("hu")
		};
	});

	allCategories = [...new Set(getBrowseablePlaces().flatMap((place) => place.categories))]
		.sort((a, b) => a.localeCompare(b, "hu"));

	renderCategoryFilters();
	buildPlaceMarkers();
	applyFilters();
}

async function loadEvents() {
	const { data, error } = await supabaseClient
		.from("events")
		.select(`
			id,
			title,
			description,
			recurrence_type,
			start_month,
			end_month,
			recurrence_ordinal,
			recurrence_weekday,
			place_id,
			website,
			image_url
		`)
		.eq("is_published", true)
		.order("title", { ascending: true });

	if (error) {
		console.warn("Az események nem tölthetők be:", error.message);
		events = [];
	} else {
		events = (data || []).map((event) => ({
			id: Number(event.id),
			title: event.title,
			description: event.description || "",
			recurrenceType: event.recurrence_type || "yearly",
			startMonth: event.start_month ? Number(event.start_month) : null,
			endMonth: event.end_month ? Number(event.end_month) : null,
			recurrenceOrdinal: event.recurrence_ordinal ? Number(event.recurrence_ordinal) : null,
			recurrenceWeekday: event.recurrence_weekday === null || event.recurrence_weekday === undefined
				? null
				: Number(event.recurrence_weekday),
			placeId: event.place_id ? Number(event.place_id) : null,
			website: event.website || "",
			image: event.image_url || ""
		}));
	}

	monthlyEvents = getMonthlyEvents(new Date());
	renderMonthlyEvents();
}

// Filters
function renderCategoryFilters() {
	const html = allCategories
		.map((category) => {
			const config = CATEGORY_MARKER_CONFIG[category] || DEFAULT_MARKER_CONFIG;
			const label = escapeHtml(category);

			return `
				<button
					class="category-button category-icon-button"
					type="button"
					data-category-filter="${label}"
					aria-label="${label}"
					title="${label}"
				>
					<span aria-hidden="true">${config.symbol}</span>
				</button>
			`;
		})
		.join("");

	categoryFilters.innerHTML = html;
	listCategoryFilters.innerHTML = html;
	syncFilterControls();
}

function isFoodPlace(place) {
	return place.categories.includes("Kajálda");
}

function getVisiblePlaces() {
	return getBrowseablePlaces().filter((place) => {
		const categoryMatches = selectedCategories.size === 0 ||
			place.categories.some((category) => selectedCategories.has(category));

		if (!categoryMatches) {
			return false;
		}

		if (!isFoodPlace(place) || selectedPriceLevels.size === 0) {
			return true;
		}

		return selectedPriceLevels.has(place.priceLevel);
	});
}

function syncFilterControls() {
	document.querySelectorAll("[data-category-filter]").forEach((button) => {
		button.classList.toggle("active", selectedCategories.has(button.dataset.categoryFilter));
	});

	document.querySelectorAll("[data-price-level]").forEach((button) => {
		button.classList.toggle("active", selectedPriceLevels.has(button.dataset.priceLevel));
	});

	const foodSelected = selectedCategories.has("Kajálda");
	priceFilterSection.classList.toggle("hidden", !foodSelected);
	listPriceFilterSection.classList.toggle("hidden", !foodSelected);

	if (!foodSelected && selectedPriceLevels.size > 0) {
		selectedPriceLevels.clear();
		document.querySelectorAll("[data-price-level]").forEach((button) => {
			button.classList.remove("active");
		});
	}

	const filterCount = selectedCategories.size + selectedPriceLevels.size;
	activeFilterCount.textContent = filterCount ? `${filterCount} aktív` : "Mind";
}

function applyFilters() {
	syncFilterControls();
	renderMarkers();
	renderPlaceList();
}

function toggleCategory(category) {
	if (selectedCategories.has(category)) {
		selectedCategories.delete(category);
	} else {
		selectedCategories.add(category);
	}

	applyFilters();
}

function togglePriceLevel(priceLevel) {
	if (selectedPriceLevels.has(priceLevel)) {
		selectedPriceLevels.delete(priceLevel);
	} else {
		selectedPriceLevels.add(priceLevel);
	}

	applyFilters();
}

function clearActiveFilters() {
	selectedCategories.clear();
	selectedPriceLevels.clear();
	applyFilters();
}

// Markers
function getCategoryMarkerIcon(place) {
	const primaryCategory = place.categories[0] || "";
	const config = CATEGORY_MARKER_CONFIG[primaryCategory] || DEFAULT_MARKER_CONFIG;

	return L.divIcon({
		className: "category-marker-wrapper",
		html: `
			<div class="category-marker-pin" style="--marker-color: ${config.color}">
				<span class="category-marker-symbol">${config.symbol}</span>
			</div>
		`,
		iconSize: [38, 44],
		iconAnchor: [19, 42]
	});
}

function getEventMarkerIcon() {
	return L.divIcon({
		className: "event-marker-wrapper",
		html: `
			<div class="event-marker-pin">
				<span>◫</span>
			</div>
		`,
		iconSize: [46, 50],
		iconAnchor: [23, 48]
	});
}

function buildPlaceMarkers() {
	markerByPlaceId.clear();

	getBrowseablePlaces().forEach((place) => {
		const marker = L.marker([place.latitude, place.longitude], {
			icon: getCategoryMarkerIcon(place),
			title: place.name,
			alt: place.name,
			riseOnHover: false
		});

		marker.on("click", () => {
			clearEventFocusMarker();
			openPlaceDetails(place.id);
		});

		markerByPlaceId.set(place.id, marker);
	});
}

function renderMarkers() {
	const visiblePlaces = getVisiblePlaces();
	const visibleIds = new Set(visiblePlaces.map((place) => place.id));
	const markers = visiblePlaces
		.map((place) => markerByPlaceId.get(place.id))
		.filter(Boolean);

	markerLayer.clearLayers();
	markerLayer.addLayers(markers);

	const openPlaceId = Number(detailsPanel.dataset.placeId || 0);
	if (openPlaceId && !visibleIds.has(openPlaceId) && !activeEventId) {
		closePlaceDetails();
	}

	requestAnimationFrame(() => setSelectedMarker(selectedMarkerId));
}

function setSelectedMarker(placeId) {
	if (selectedMarkerId) {
		markerByPlaceId.get(selectedMarkerId)?.getElement()?.classList.remove("is-selected");
	}

	selectedMarkerId = placeId ? Number(placeId) : null;
	if (selectedMarkerId) {
		markerByPlaceId.get(selectedMarkerId)?.getElement()?.classList.add("is-selected");
	}
}

function clearEventFocusMarker() {
	activeEventId = null;
	eventMarkerLayer.clearLayers();
}

function showEventFocusMarker(event, place) {
	clearEventFocusMarker();
	activeEventId = event.id;

	if (!place) {
		return;
	}

	L.marker([place.latitude, place.longitude], {
		icon: getEventMarkerIcon(),
		interactive: false,
		zIndexOffset: 1000
	}).addTo(eventMarkerLayer);
}

// Search
function renderPlaceSearchResults() {
	const searchText = placeSearchInput.value.trim().toLocaleLowerCase("hu");
	if (searchText.length < 2) {
		placeSearchResults.innerHTML = "";
		placeSearchResults.classList.add("hidden");
		return;
	}

	const matchingPlaces = getBrowseablePlaces()
		.filter((place) => place.searchText.includes(searchText))
		.slice(0, 10);

	placeSearchResults.classList.remove("hidden");
	if (matchingPlaces.length === 0) {
		placeSearchResults.innerHTML = `<div class="map-search-empty">Nincs találat.</div>`;
		return;
	}

	placeSearchResults.innerHTML = matchingPlaces
		.map((place) => `
			<button class="map-search-result" type="button" data-search-place-id="${place.id}">
				<strong>${escapeHtml(place.name)}</strong>
				<span>${escapeHtml(place.city || place.address)}</span>
			</button>
		`)
		.join("");
}

function selectPlaceFromSearch(placeId) {
	const place = getPlaceById(placeId);
	if (!place) {
		return;
	}

	selectedCategories.clear();
	selectedPriceLevels.clear();
	placeSearchInput.value = place.name;
	placeSearchResults.innerHTML = "";
	placeSearchResults.classList.add("hidden");
	applyFilters();
	focusPlace(place, true);
}

// List
function getListPlaces() {
	const searchText = listSearchInput.value.trim().toLocaleLowerCase("hu");
	const sortMode = listSortSelect.value;
	const filteredPlaces = getVisiblePlaces().filter((place) => !searchText || place.searchText.includes(searchText));

	return filteredPlaces.sort((a, b) => {
		if (sortMode === "city") {
			const cityCompare = (a.city || "").localeCompare(b.city || "", "hu");
			return cityCompare || a.name.localeCompare(b.name, "hu");
		}

		return a.name.localeCompare(b.name, "hu");
	});
}

function renderPlaceList() {
	const listPlaces = getListPlaces();
	listResultsCount.textContent = `${listPlaces.length} hely`;

	if (listPlaces.length === 0) {
		placesListView.innerHTML = `
			<div class="panel-empty-state">
				<strong>Nincs találat.</strong>
				<span>Módosítsd a keresést vagy a szűrőket.</span>
			</div>
		`;
		return;
	}

	placesListView.innerHTML = listPlaces
		.map((place) => {
			const category = place.categories[0] || "Hely";
			const image = place.image
				? `<img src="${escapeHtml(place.image)}" alt="" loading="lazy">`
				: `<div class="list-place-placeholder">${escapeHtml((CATEGORY_MARKER_CONFIG[category] || DEFAULT_MARKER_CONFIG).symbol)}</div>`;

			return `
				<button class="list-place-card" type="button" data-list-place-id="${place.id}">
					<div class="list-place-image">${image}</div>
					<div class="list-place-copy">
						<strong>${escapeHtml(place.name)}</strong>
						<span>${escapeHtml(place.city || place.address)}</span>
						<small>${escapeHtml(category)}</small>
					</div>
					<span class="list-place-arrow">›</span>
				</button>
			`;
		})
		.join("");
}

function setListOpen(isOpen) {
	listPanel.classList.toggle("open", isOpen);
	listPanel.setAttribute("aria-hidden", String(!isOpen));
	desktopListButton.classList.toggle("active", isOpen);
	desktopListButton.setAttribute("aria-expanded", String(isOpen));
	mobileListButton.classList.toggle("active", isOpen);
	mobileListButton.setAttribute("aria-expanded", String(isOpen));
	document.body.classList.toggle("list-open", isOpen);

	if (isOpen) {
		setMobileMenuOpen(false);
		setDesktopEventsOpen(false);
		if (isMobile()) {
			closePlaceDetails();
		}
		renderPlaceList();
	}

	updateUiBackdrop();
}

// Events
function getMonthlyEvents(referenceDate) {
	const year = referenceDate.getFullYear();
	const monthIndex = referenceDate.getMonth();
	const monthNumber = monthIndex + 1;
	const occurrences = [];

	events.forEach((event) => {
		if (event.recurrenceType === "monthly_rule") {
			const occurrenceDate = getNthWeekdayDate(
				year,
				monthIndex,
				event.recurrenceOrdinal,
				event.recurrenceWeekday
			);
			if (!occurrenceDate) {
				return;
			}

			occurrences.push({
				...event,
				occurrenceDate,
				sortDay: occurrenceDate.getDate()
			});
			return;
		}

		if (!event.startMonth || !monthRangeContains(monthNumber, event.startMonth, event.endMonth)) {
			return;
		}

		occurrences.push({
			...event,
			occurrenceDate: null,
			sortDay: 0
		});
	});

	return occurrences.sort((a, b) => a.sortDay - b.sortDay || a.title.localeCompare(b.title, "hu"));
}

function getEventDateLabel(event) {
	if (event.recurrenceType === "monthly_rule" && event.occurrenceDate) {
		return formatOccurrenceDate(event.occurrenceDate);
	}
	return getMonthRangeLabel(event.startMonth, event.endMonth || event.startMonth);
}

function getEventRecurrenceLabel(event) {
	return event.recurrenceType === "monthly_rule" ? "Havi szabály" : "Évente";
}

function getEventRuleText(event) {
	if (event.recurrenceType !== "monthly_rule") {
		return "";
	}
	return getMonthlyRuleLabel(event.recurrenceOrdinal, event.recurrenceWeekday);
}

function getEventDateBadge(event) {
	if (event.recurrenceType === "monthly_rule" && event.occurrenceDate) {
		return `
			<div class="event-date-badge">
				<strong>${event.occurrenceDate.getDate()}</strong>
				<span>${new Intl.DateTimeFormat("hu-HU", { month: "short" }).format(event.occurrenceDate)}</span>
			</div>
		`;
	}

	const monthLabel = getMonthName(event.startMonth).slice(0, 3).toUpperCase();
	return `
		<div class="event-date-badge annual">
			<strong>${escapeHtml(monthLabel)}</strong>
			<span>ÉVENTE</span>
		</div>
	`;
}

function renderEventCards(target) {
	if (monthlyEvents.length === 0) {
		target.innerHTML = `
			<div class="panel-empty-state small">
				<strong>Nincs esemény ebben a hónapban.</strong>
			</div>
		`;
		return;
	}

	target.innerHTML = monthlyEvents
		.map((event) => {
			const place = getPlaceById(event.placeId);
			const placeLabel = place ? place.name : "Helyszín nélkül";
			const description = event.description ? `<p>${escapeHtml(event.description)}</p>` : "";
			const ruleText = getEventRuleText(event);
			const ruleHtml = ruleText ? `<span class="event-rule-text">${escapeHtml(ruleText)}</span>` : "";
			const locationHint = place
				? `<span class="event-place">📍 ${escapeHtml(placeLabel)}</span>`
				: `<span class="event-place muted">Nincs térképes hely kapcsolva</span>`;

			return `
				<article class="event-card">
					<button class="event-card-main" type="button" data-event-focus-id="${event.id}">
						${getEventDateBadge(event)}
						<div class="event-card-copy">
							<div class="event-card-meta">
								<span>${escapeHtml(getEventDateLabel(event))}</span>
								<span class="event-repeat-badge">${getEventRecurrenceLabel(event)}</span>
							</div>
							<h4>${escapeHtml(event.title)}</h4>
							${ruleHtml}
							${description}
							${locationHint}
						</div>
					</button>
					${event.website ? `<a class="event-link" href="${escapeHtml(event.website)}" target="_blank" rel="noopener noreferrer">Weboldal ↗</a>` : ""}
				</article>
			`;
		})
		.join("");
}

function renderMonthlyEvents() {
	const title = getMonthTitle();
	desktopEventsTitle.textContent = title;
	mobileEventsTitle.textContent = title;
	desktopEventCount.textContent = monthlyEvents.length;
	renderEventCards(desktopEventsList);
	renderEventCards(mobileEventsList);
}

function getEventDetailsDateHtml(event) {
	if (event.recurrenceType === "monthly_rule") {
		const rule = getMonthlyRuleLabel(event.recurrenceOrdinal, event.recurrenceWeekday);
		const occurrence = event.occurrenceDate ? formatOccurrenceDate(event.occurrenceDate) : "";
		return `
			<p>${escapeHtml(rule)}</p>
			${occurrence ? `<span class="event-detail-occurrence">Ebben a hónapban: ${escapeHtml(occurrence)}</span>` : ""}
		`;
	}

	return `<p>${escapeHtml(getMonthRangeLabel(event.startMonth, event.endMonth || event.startMonth))}</p>`;
}

function openEventDetails(event, place = null) {
	if (!event) {
		return;
	}

	setSelectedMarker(null);
	setMobileMenuOpen(false);
	setDesktopEventsOpen(false);

	detailsPanel.dataset.placeId = "";
	detailsPanel.dataset.eventId = String(event.id);
	detailsPanel.classList.add("open");
	detailsPanel.setAttribute("aria-hidden", "false");

	if (isMobilePortrait()) {
		detailsPanel.classList.remove("expanded");
		detailsSheetProgress = 0;
		detailsBackdrop.classList.remove("open");
		detailsBackdrop.setAttribute("aria-hidden", "true");
	}

	const eventImage = event.image
		? `<img class="place-image event-detail-image" src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)}">`
		: "";
	const summaryClass = event.image ? "has-image" : "no-image";
	const cityLabel = place?.city || "Esemény";
	const placeHtml = place
		? `
			<section class="info-block">
				<h3>Helyszín</h3>
				<p><strong>${escapeHtml(place.name)}</strong><br>${escapeHtml(place.address || place.city || "")}</p>
			</section>
		`
		: `
			<section class="info-block">
				<h3>Helyszín</h3>
				<p>Nincs térképes hely kapcsolva ehhez az eseményhez.</p>
			</section>
		`;
	const descriptionHtml = event.description
		? `
			<section class="info-block">
				<h3>Leírás</h3>
				<p>${escapeHtml(event.description)}</p>
			</section>
		`
		: "";
	const websiteHtml = event.website
		? `
			<section class="info-block">
				<h3>Weboldal</h3>
				<a class="website-link" href="${escapeHtml(event.website)}" target="_blank" rel="noopener noreferrer">Esemény weboldala ↗</a>
			</section>
		`
		: "";

	detailsContent.innerHTML = `
		<div class="details-summary event-details-summary ${summaryClass}">
			${eventImage}
			<div class="details-summary-text">
				<span class="details-city">${escapeHtml(cityLabel)}</span>
				<h2>${escapeHtml(event.title)}</h2>
				<div class="category-list">
					<span class="category-tag event-tag">Esemény</span>
					<span class="category-tag">${escapeHtml(getEventDateLabel(event))}</span>
				</div>
			</div>
		</div>

		<div class="details-full-content event-details-content">
			<section class="info-block">
				<h3>Időpont</h3>
				${getEventDetailsDateHtml(event)}
			</section>
			${placeHtml}
			${descriptionHtml}
			${websiteHtml}
		</div>
	`;

	if (!place) {
		return;
	}

	map.setView([place.latitude, place.longitude], Math.max(map.getZoom(), 15), { animate: true });
}

function focusEvent(eventId) {
	const event = monthlyEvents.find((item) => item.id === Number(eventId));
	if (!event) {
		return;
	}

	const place = getPlaceById(event.placeId);
	setMobileMenuOpen(false);
	setListOpen(false);
	setDesktopEventsOpen(false);
	showEventFocusMarker(event, place);
	openEventDetails(event, place);
}

function setDesktopEventsOpen(isOpen) {
	if (isMobile()) {
		isOpen = false;
	}

	desktopEventsPanel.classList.toggle("open", isOpen);
	desktopEventsPanel.setAttribute("aria-hidden", String(!isOpen));
	desktopEventsButton.classList.toggle("active", isOpen);
	desktopEventsButton.setAttribute("aria-expanded", String(isOpen));

	if (isOpen) {
		setListOpen(false);
		closePlaceDetails();
	}
}

// Panels
function setMobileMenuOpen(isOpen) {
	if (!isMobile() && isOpen) {
		return;
	}

	filterPanel.classList.toggle("mobile-open", isOpen);
	mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
	document.body.classList.toggle("mobile-menu-open", isOpen);

	if (isOpen) {
		setListOpen(false);
		setDesktopEventsOpen(false);
		closePlaceDetails();
	}

	if (!isOpen) {
		placeSearchResults.classList.add("hidden");
	}

	updateUiBackdrop();
}

function updateUiBackdrop() {
	const shouldShow = isMobile() && (
		filterPanel.classList.contains("mobile-open") ||
		listPanel.classList.contains("open")
	);

	uiBackdrop.classList.toggle("open", shouldShow);
	uiBackdrop.setAttribute("aria-hidden", String(!shouldShow));
}

function closeTransientPanels() {
	setMobileMenuOpen(false);
	setListOpen(false);
	setDesktopEventsOpen(false);
}

// Details
function getMobileSheetMetrics() {
	const viewportHeight = window.visualViewport?.height || window.innerHeight;
	const expandedHeight = Math.max(SHEET_COLLAPSED_HEIGHT, viewportHeight - SHEET_TOP_GAP);

	return {
		expandedHeight,
		travel: Math.max(1, expandedHeight - SHEET_COLLAPSED_HEIGHT)
	};
}

function applyDetailsSheetProgress(progress) {
	if (!isMobilePortrait()) {
		return;
	}

	const safeProgress = clamp(progress, 0, 1);
	const { expandedHeight } = getMobileSheetMetrics();
	const height = SHEET_COLLAPSED_HEIGHT + ((expandedHeight - SHEET_COLLAPSED_HEIGHT) * safeProgress);
	const side = 10 * (1 - safeProgress);
	const bottom = 10 * (1 - safeProgress);
	const topRadius = 22 + (2 * safeProgress);
	const bottomRadius = 22 * (1 - safeProgress);
	const contentOpacity = clamp((safeProgress - 0.18) / 0.55, 0, 1);
	const hintOpacity = 0.8 * (1 - safeProgress);

	detailsSheetProgress = safeProgress;
	detailsPanel.style.height = `${height}px`;
	detailsPanel.style.left = `${side}px`;
	detailsPanel.style.right = `${side}px`;
	detailsPanel.style.bottom = `${bottom}px`;
	detailsPanel.style.borderRadius = `${topRadius}px ${topRadius}px ${bottomRadius}px ${bottomRadius}px`;
	detailsPanel.style.setProperty("--details-content-opacity", contentOpacity.toFixed(3));
	detailsPanel.style.setProperty("--details-hint-opacity", hintOpacity.toFixed(3));
	detailsBackdrop.style.background = `rgba(3, 8, 14, ${(0.42 * safeProgress).toFixed(3)})`;

	if (safeProgress > 0) {
		detailsBackdrop.classList.add("open");
		detailsBackdrop.setAttribute("aria-hidden", "false");
	}
}

function clearDetailsDragStyles() {
	detailsPanel.style.transform = "";
	detailsPanel.style.height = "";
	detailsPanel.style.left = "";
	detailsPanel.style.right = "";
	detailsPanel.style.bottom = "";
	detailsPanel.style.borderRadius = "";
	detailsPanel.style.removeProperty("--details-content-opacity");
	detailsPanel.style.removeProperty("--details-hint-opacity");
	detailsBackdrop.style.background = "";
}

function settleDetailsPanel(expanded) {
	detailsSheetProgress = expanded ? 1 : 0;
	detailsPanel.classList.remove("dragging", "drag-ready");
	detailsPanel.classList.toggle("expanded", expanded);
	detailsDragHintText.textContent = "Húzd fel a részletekhez";
	detailsBackdrop.classList.toggle("open", expanded && isMobilePortrait());
	detailsBackdrop.setAttribute("aria-hidden", String(!(expanded && isMobilePortrait())));
	requestAnimationFrame(clearDetailsDragStyles);
}

function getPlaceImageHtml(place) {
	if (!place.image) {
		const category = place.categories[0] || "";
		const symbol = (CATEGORY_MARKER_CONFIG[category] || DEFAULT_MARKER_CONFIG).symbol;
		return `<div class="place-image place-image-placeholder" aria-hidden="true">${symbol}</div>`;
	}

	return `<img class="place-image" src="${escapeHtml(place.image)}" alt="${escapeHtml(place.name)}">`;
}

function openPlaceDetails(placeId, options = {}) {
	const place = getPlaceById(placeId);
	if (!place) {
		return;
	}

	const { preserveEventMarker = false, panMap = true } = options;
	if (!preserveEventMarker) {
		clearEventFocusMarker();
	}

	setSelectedMarker(place.id);
	setMobileMenuOpen(false);
	setDesktopEventsOpen(false);

	detailsPanel.dataset.placeId = String(place.id);
	detailsPanel.dataset.eventId = "";
	detailsPanel.classList.add("open");
	detailsPanel.setAttribute("aria-hidden", "false");

	if (isMobilePortrait()) {
		detailsPanel.classList.remove("expanded");
		detailsSheetProgress = 0;
		detailsBackdrop.classList.remove("open");
		detailsBackdrop.setAttribute("aria-hidden", "true");
	}

	const categoryTags = place.categories
		.map((category) => `<span class="category-tag">${escapeHtml(category)}</span>`)
		.join("");
	const priceHtml = isFoodPlace(place) && place.priceLevel
		? `<span class="price-badge ${place.priceLevel}">${place.priceLevel === "cheap" ? "Olcsó" : "Drága"}</span>`
		: "";
	const websiteHtml = place.website
		? `
			<section class="info-block">
				<h3>Weboldal</h3>
				<a class="website-link" href="${escapeHtml(place.website)}" target="_blank" rel="noopener noreferrer">Hivatalos weboldal ↗</a>
			</section>
		`
		: "";

	detailsContent.innerHTML = `
		<div class="details-summary">
			${getPlaceImageHtml(place)}
			<div class="details-summary-text">
				<span class="details-city">${escapeHtml(place.city || "Hely")}</span>
				<h2>${escapeHtml(place.name)}</h2>
				<div class="category-list">${categoryTags}</div>
			</div>
		</div>

		<div class="details-full-content">
			<section class="info-block">
				<h3>Cím</h3>
				<p>${escapeHtml(place.address)}</p>
			</section>

			${priceHtml ? `<section class="info-block"><h3>Árkategória</h3>${priceHtml}</section>` : ""}

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

			${websiteHtml}
		</div>
	`;

	if (panMap) {
		map.panTo([place.latitude, place.longitude], { animate: true, duration: 0.35 });
	}
}

function closePlaceDetails() {
	detailsSheetProgress = 0;
	detailsPanel.classList.remove("dragging", "drag-ready", "expanded", "open");
	detailsPanel.setAttribute("aria-hidden", "true");
	detailsDragHintText.textContent = "Húzd fel a részletekhez";
	detailsBackdrop.classList.remove("open");
	detailsBackdrop.setAttribute("aria-hidden", "true");
	detailsPanel.dataset.placeId = "";
	detailsPanel.dataset.eventId = "";
	setSelectedMarker(null);
	clearEventFocusMarker();

	if (detailsPanel.contains(document.activeElement) && document.activeElement instanceof HTMLElement) {
		document.activeElement.blur();
	}

	requestAnimationFrame(clearDetailsDragStyles);
}

function expandPlaceDetails() {
	settleDetailsPanel(true);
}

function collapsePlaceDetails() {
	settleDetailsPanel(false);
	detailsPanel.scrollTop = 0;
}

function focusPlace(place, openDetails = true) {
	setMobileMenuOpen(false);
	setListOpen(false);
	setDesktopEventsOpen(false);
	clearEventFocusMarker();

	const marker = markerByPlaceId.get(place.id);
	if (marker && markerLayer.hasLayer(marker)) {
		markerLayer.zoomToShowLayer(marker, () => {
			map.setView([place.latitude, place.longitude], Math.max(map.getZoom(), 14), { animate: true });
			if (openDetails) {
				openPlaceDetails(place.id, { panMap: false });
			}
		});
		return;
	}

	map.setView([place.latitude, place.longitude], Math.max(map.getZoom(), 14), { animate: true });
	if (openDetails) {
		openPlaceDetails(place.id, { panMap: false });
	}
}

// Lightbox
function openImageLightbox(sourceImage) {
	if (!(sourceImage instanceof HTMLImageElement)) {
		return;
	}

	lightboxSourceImage = sourceImage;
	const rect = sourceImage.getBoundingClientRect();
	imageLightboxImage.src = sourceImage.src;
	imageLightboxImage.alt = sourceImage.alt || "";
	imageLightboxImage.style.top = `${rect.top}px`;
	imageLightboxImage.style.left = `${rect.left}px`;
	imageLightboxImage.style.width = `${rect.width}px`;
	imageLightboxImage.style.height = `${rect.height}px`;
	imageLightboxImage.style.borderRadius = "14px";
	imageLightbox.classList.add("open");
	imageLightbox.setAttribute("aria-hidden", "false");

	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			imageLightboxImage.style.top = "6dvh";
			imageLightboxImage.style.left = "4vw";
			imageLightboxImage.style.width = "92vw";
			imageLightboxImage.style.height = "88dvh";
			imageLightboxImage.style.borderRadius = "18px";
		});
	});
}

function closeImageLightbox() {
	if (!lightboxSourceImage) {
		return;
	}

	const rect = lightboxSourceImage.getBoundingClientRect();
	imageLightboxImage.style.top = `${rect.top}px`;
	imageLightboxImage.style.left = `${rect.left}px`;
	imageLightboxImage.style.width = `${rect.width}px`;
	imageLightboxImage.style.height = `${rect.height}px`;
	imageLightboxImage.style.borderRadius = "14px";
	imageLightbox.classList.remove("open");

	setTimeout(() => {
		imageLightbox.setAttribute("aria-hidden", "true");
		imageLightboxImage.src = "";
		lightboxSourceImage = null;
	}, 320);
}

// Drag
function startDetailsDrag(event) {
	if (!isMobilePortrait() || !detailsPanel.classList.contains("open")) {
		return;
	}

	const startedExpanded = detailsPanel.classList.contains("expanded");
	const onDragHandle = event.target instanceof Element && event.target.closest("#detailsDragZone");
	const onInteractive = event.target instanceof Element && event.target.closest("a, button, input, select, textarea");

	if ((startedExpanded && !onDragHandle) || onInteractive) {
		return;
	}

	detailsDragging = true;
	detailsDragStartY = event.clientY;
	detailsDragCurrentY = event.clientY;
	detailsDragStartedExpanded = startedExpanded;
	detailsDragStartProgress = detailsDragStartedExpanded ? 1 : 0;
	detailsDragCaptureElement = detailsDragStartedExpanded ? detailsDragZone : detailsPanel;
	detailsSheetProgress = detailsDragStartProgress;
	detailsPanel.classList.add("dragging");
	applyDetailsSheetProgress(detailsDragStartProgress);
	detailsDragCaptureElement.setPointerCapture(event.pointerId);
}

function moveDetailsDrag(event) {
	if (!detailsDragging) {
		return;
	}

	detailsDragCurrentY = event.clientY;
	const deltaY = detailsDragCurrentY - detailsDragStartY;

	if (!detailsDragStartedExpanded && deltaY > 0) {
		detailsPanel.style.transform = `translateY(${Math.min(deltaY, 120)}px)`;
		detailsPanel.classList.remove("drag-ready");
		detailsDragHintText.textContent = "Húzd fel a részletekhez";
		return;
	}

	const { travel } = getMobileSheetMetrics();
	const progress = detailsDragStartProgress - (deltaY / travel);
	detailsPanel.style.transform = "";
	applyDetailsSheetProgress(progress);

	if (!detailsDragStartedExpanded) {
		const readyToExpand = detailsSheetProgress >= DRAG_EXPAND_SNAP;
		detailsPanel.classList.toggle("drag-ready", readyToExpand);
		detailsDragHintText.textContent = readyToExpand
			? "Engedd el a megnyitáshoz"
			: "Húzd fel a részletekhez";
	}
}

function finishDetailsDrag(event) {
	if (!detailsDragging) {
		return;
	}

	detailsDragging = false;
	const deltaY = detailsDragCurrentY - detailsDragStartY;
	detailsPanel.classList.remove("dragging");

	if (detailsDragCaptureElement?.hasPointerCapture(event.pointerId)) {
		detailsDragCaptureElement.releasePointerCapture(event.pointerId);
	}
	detailsDragCaptureElement = null;

	suppressDetailsClick = true;
	setTimeout(() => {
		suppressDetailsClick = false;
	}, 120);

	if (Math.abs(deltaY) < DRAG_TAP_THRESHOLD) {
		detailsDragStartedExpanded ? collapsePlaceDetails() : expandPlaceDetails();
		return;
	}

	if (!detailsDragStartedExpanded && deltaY > DRAG_CLOSE_THRESHOLD) {
		closePlaceDetails();
		return;
	}

	if (detailsDragStartedExpanded) {
		detailsSheetProgress <= DRAG_COLLAPSE_SNAP ? collapsePlaceDetails() : expandPlaceDetails();
		return;
	}

	detailsSheetProgress >= DRAG_EXPAND_SNAP ? expandPlaceDetails() : collapsePlaceDetails();
}

// Events
function handleFilterClick(event) {
	const categoryButton = event.target.closest("[data-category-filter]");
	if (categoryButton) {
		toggleCategory(categoryButton.dataset.categoryFilter);
		return;
	}

	const priceButton = event.target.closest("[data-price-level]");
	if (priceButton) {
		togglePriceLevel(priceButton.dataset.priceLevel);
	}
}

document.addEventListener("click", handleFilterClick);

placeSearchInput.addEventListener("input", renderPlaceSearchResults);
placeSearchResults.addEventListener("click", (event) => {
	const resultButton = event.target.closest("[data-search-place-id]");
	if (resultButton) {
		selectPlaceFromSearch(Number(resultButton.dataset.searchPlaceId));
	}
});

resetFiltersButton.addEventListener("click", clearActiveFilters);
mobileResetFiltersButton.addEventListener("click", clearActiveFilters);
listClearFiltersButton.addEventListener("click", clearActiveFilters);

listSearchInput.addEventListener("input", renderPlaceList);
listSortSelect.addEventListener("change", renderPlaceList);
placesListView.addEventListener("click", (event) => {
	const button = event.target.closest("[data-list-place-id]");
	if (!button) {
		return;
	}

	const place = getPlaceById(Number(button.dataset.listPlaceId));
	if (place) {
		focusPlace(place, true);
	}
});

mobileMenuButton.addEventListener("click", () => {
	setMobileMenuOpen(!filterPanel.classList.contains("mobile-open"));
});
mobileSearchButton.addEventListener("click", () => {
	setMobileMenuOpen(true);
	setTimeout(() => placeSearchInput.focus(), 360);
});
mobileShowMapButton.addEventListener("click", () => setMobileMenuOpen(false));

mobileListButton.addEventListener("click", () => {
	setListOpen(!listPanel.classList.contains("open"));
});
desktopListButton.addEventListener("click", () => {
	setListOpen(!listPanel.classList.contains("open"));
});
closeListButton.addEventListener("click", () => setListOpen(false));

desktopEventsButton.addEventListener("click", () => {
	setDesktopEventsOpen(!desktopEventsPanel.classList.contains("open"));
});
desktopEventsClose.addEventListener("click", () => setDesktopEventsOpen(false));

[desktopEventsList, mobileEventsList].forEach((container) => {
	container.addEventListener("click", (event) => {
		const button = event.target.closest("[data-event-focus-id]");
		if (button && !button.disabled) {
			focusEvent(Number(button.dataset.eventFocusId));
		}
	});
});

uiBackdrop.addEventListener("click", closeTransientPanels);
closeDetailsButton.addEventListener("click", closePlaceDetails);

detailsPanel.addEventListener("pointerdown", startDetailsDrag);
detailsPanel.addEventListener("pointermove", moveDetailsDrag);
detailsPanel.addEventListener("pointerup", finishDetailsDrag);
detailsPanel.addEventListener("pointercancel", finishDetailsDrag);

detailsContent.addEventListener("click", (event) => {
	if (suppressDetailsClick) {
		event.preventDefault();
		return;
	}

	const clickedImage = event.target.closest("img.place-image");
	if (clickedImage) {
		openImageLightbox(clickedImage);
	}
});

imageLightboxClose.addEventListener("click", (event) => {
	event.stopPropagation();
	closeImageLightbox();
});
imageLightbox.addEventListener("click", (event) => {
	if (event.target === imageLightbox) {
		closeImageLightbox();
	}
});

detailsBackdrop.addEventListener("click", () => {
	if (isMobilePortrait() && detailsPanel.classList.contains("expanded")) {
		collapsePlaceDetails();
		return;
	}
	closePlaceDetails();
});

map.on("click", () => {
	clearEventFocusMarker();
	if (isMobileLandscape() && detailsPanel.classList.contains("open")) {
		closePlaceDetails();
	}
});

map.getContainer().addEventListener("pointerdown", (event) => {
	if (!(event.target instanceof Element)) {
		return;
	}

	const interactive = event.target.closest(".leaflet-marker-icon, .modern-cluster, .leaflet-control");
	if (!interactive && isMobile()) {
		setMobileMenuOpen(false);
		setListOpen(false);
	}
}, { passive: true });

document.addEventListener("click", (event) => {
	if (!event.target.closest(".map-search")) {
		placeSearchResults.classList.add("hidden");
	}
});

document.addEventListener("keydown", (event) => {
	if (event.key !== "Escape") {
		return;
	}

	if (imageLightbox.classList.contains("open")) {
		closeImageLightbox();
		return;
	}
	if (listPanel.classList.contains("open")) {
		setListOpen(false);
		return;
	}
	if (filterPanel.classList.contains("mobile-open")) {
		setMobileMenuOpen(false);
		return;
	}
	if (desktopEventsPanel.classList.contains("open")) {
		setDesktopEventsOpen(false);
		return;
	}
	if (detailsPanel.classList.contains("open")) {
		closePlaceDetails();
	}
});

window.addEventListener("resize", () => {
	detailsDragging = false;
	clearDetailsDragStyles();

	if (!isMobile()) {
		setMobileMenuOpen(false);
		updateUiBackdrop();
	}

	if (isMobile()) {
		setDesktopEventsOpen(false);
	}

	if (!isMobilePortrait()) {
		detailsPanel.classList.remove("expanded");
		detailsBackdrop.classList.remove("open");
		detailsBackdrop.setAttribute("aria-hidden", "true");
	}

	setTimeout(() => map.invalidateSize(), 80);
});

// Init
window.openPlaceDetails = openPlaceDetails;

async function initializeApp() {
	await Promise.all([
		loadAppVersion(),
		loadPlaces()
	]);
	await loadEvents();

	if (!isMobile()) {
		setDesktopEventsOpen(true);
	}

	map.invalidateSize();
}

initializeApp();
