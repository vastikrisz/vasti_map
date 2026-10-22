// Config
const ADMIN_USER_ID = "df168eb9-7131-4b74-b757-75f6a653e299";
const IMAGE_BUCKET = "place-images";
const RELEASE_FUNCTION = "send-release-email";
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

// Auth
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton");
const userEmail = document.getElementById("userEmail");

// Places
const placeForm = document.getElementById("placeForm");
const savePlaceButton = document.getElementById("savePlaceButton");
const clearFormButton = document.getElementById("clearFormButton");
const saveMessage = document.getElementById("saveMessage");
const isPublishedInput = document.getElementById("isPublished");
const findLocationButton = document.getElementById("findLocationButton");
const placeAddress = document.getElementById("placeAddress");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");
const locationMessage = document.getElementById("locationMessage");
const placesList = document.getElementById("placesList");
const placesCount = document.getElementById("placesCount");
const placesSearchInput = document.getElementById("placesSearchInput");
const placesListMessage = document.getElementById("placesListMessage");
const refreshPlacesButton = document.getElementById("refreshPlacesButton");
const editModeBanner = document.getElementById("editModeBanner");
const editModePlaceName = document.getElementById("editModePlaceName");
const cancelEditButton = document.getElementById("cancelEditButton");
const placeNameInput = document.getElementById("placeName");
const cityInput = document.getElementById("city");
const websiteInput = document.getElementById("website");
const descriptionInput = document.getElementById("description");
const ticketInfoInput = document.getElementById("ticketInfo");
const openingHoursInput = document.getElementById("openingHours");
const categoryOneInput = document.getElementById("categoryOne");
const categoryTwoInput = document.getElementById("categoryTwo");
const isFreeInput = document.getElementById("isFree");

// Events
const eventsAdminView = document.getElementById("eventsAdminView");
const eventsTabButton = document.getElementById("eventsTabButton");
const eventForm = document.getElementById("eventForm");
const eventTitleInput = document.getElementById("eventTitle");
const eventRecurrenceType = document.getElementById("eventRecurrenceType");
const eventYearlyFields = document.getElementById("eventYearlyFields");
const eventStartMonth = document.getElementById("eventStartMonth");
const eventEndMonth = document.getElementById("eventEndMonth");
const eventMonthlyRuleFields = document.getElementById("eventMonthlyRuleFields");
const eventOrdinal = document.getElementById("eventOrdinal");
const eventWeekday = document.getElementById("eventWeekday");
const eventRulePreview = document.getElementById("eventRulePreview");
const eventPlaceId = document.getElementById("eventPlaceId");
const toggleEventPlaceCreatorButton = document.getElementById("toggleEventPlaceCreatorButton");
const eventPlaceCreator = document.getElementById("eventPlaceCreator");
const eventPlaceName = document.getElementById("eventPlaceName");
const eventPlaceAddress = document.getElementById("eventPlaceAddress");
const eventPlaceCity = document.getElementById("eventPlaceCity");
const eventPlaceLatitude = document.getElementById("eventPlaceLatitude");
const eventPlaceLongitude = document.getElementById("eventPlaceLongitude");
const eventPlaceMessage = document.getElementById("eventPlaceMessage");
const findEventPlaceButton = document.getElementById("findEventPlaceButton");
const saveEventPlaceButton = document.getElementById("saveEventPlaceButton");
const cancelEventPlaceButton = document.getElementById("cancelEventPlaceButton");
const eventWebsite = document.getElementById("eventWebsite");
const eventDescription = document.getElementById("eventDescription");
const eventImageFile = document.getElementById("eventImageFile");
const eventImageMessage = document.getElementById("eventImageMessage");
const eventImagePreviewContainer = document.getElementById("eventImagePreviewContainer");
const eventImagePreview = document.getElementById("eventImagePreview");
const removeEventImageButton = document.getElementById("removeEventImageButton");
const eventIsPublished = document.getElementById("eventIsPublished");
const saveEventButton = document.getElementById("saveEventButton");
const clearEventFormButton = document.getElementById("clearEventFormButton");
const cancelEventEditButton = document.getElementById("cancelEventEditButton");
const eventEditModeBanner = document.getElementById("eventEditModeBanner");
const eventEditModeTitle = document.getElementById("eventEditModeTitle");
const eventSaveMessage = document.getElementById("eventSaveMessage");
const eventsList = document.getElementById("eventsList");
const eventsCount = document.getElementById("eventsCount");
const eventsSearchInput = document.getElementById("eventsSearchInput");
const eventsListMessage = document.getElementById("eventsListMessage");
const refreshEventsButton = document.getElementById("refreshEventsButton");

// Images
const imageFileInput = document.getElementById("imageFile");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const imagePreview = document.getElementById("imagePreview");
const removeSelectedImageButton = document.getElementById("removeSelectedImageButton");
const imageMessage = document.getElementById("imageMessage");
const imageUrlInput = document.getElementById("imageUrl");

// Notifications
const placesAdminView = document.getElementById("placesAdminView");
const notificationsAdminView = document.getElementById("notificationsAdminView");
const placesTabButton = document.getElementById("placesTabButton");
const notificationsTabButton = document.getElementById("notificationsTabButton");
const currentVersionDisplay = document.getElementById("currentVersionDisplay");
const nextVersionDisplay = document.getElementById("nextVersionDisplay");
const releaseSubject = document.getElementById("releaseSubject");
const releaseImageInput = document.getElementById("releaseImageInput");
const releasePreviewFrame = document.getElementById("releasePreviewFrame");
const releasePreviewShell = document.getElementById("releasePreviewShell");
const desktopPreviewButton = document.getElementById("desktopPreviewButton");
const mobilePreviewButton = document.getElementById("mobilePreviewButton");
const subscriberForm = document.getElementById("subscriberForm");
const subscriberEmailInput = document.getElementById("subscriberEmailInput");
const subscribersList = document.getElementById("subscribersList");
const subscriberCount = document.getElementById("subscriberCount");
const subscriberMessage = document.getElementById("subscriberMessage");
const sendTestReleaseButton = document.getElementById("sendTestReleaseButton");
const sendReleaseButton = document.getElementById("sendReleaseButton");
const releaseMessage = document.getElementById("releaseMessage");

// State
let releaseEditor = null;
let releaseSubscribers = [];
let currentReleaseVersion = {
	major: 1,
	minor: 1
};
let adminMap = null;
let adminMarker = null;
let adminPlaces = [];
let editingPlaceId = null;
let editingOriginalStoragePath = null;
let editingOriginalImageUrl = "";
let removeExistingImageOnSave = false;
let adminEvents = [];
let editingEventId = null;
let eventPlaceMap = null;
let eventPlaceMarker = null;
let editingEventOriginalStoragePath = null;
let editingEventOriginalImageUrl = "";
let removeExistingEventImageOnSave = false;

// Places
async function loadAdminPlaces() {
	placesListMessage.textContent = "Mentett helyek betöltése...";
	refreshPlacesButton.disabled = true;
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
				is_free,
				image_urls,
				image_storage_path,
				is_published,
				is_event_only,
				created_at
		`)
		.order("name", {
			ascending: true
		});
	refreshPlacesButton.disabled = false;
	if (error) {
		console.error("A helylista betöltési hibája:", error);
		placesListMessage.textContent = "Nem sikerült betölteni a mentett helyeket.";
		placesListMessage.className = "message error";
		return;
	}
	adminPlaces = (data || []).map((place) => ({
		...place,
		searchText: [
			place.name,
			place.address,
			place.city,
			...(Array.isArray(place.categories) ? place.categories : [])
		]
			.join(" ")
			.toLocaleLowerCase("hu")
	}));
	placesListMessage.textContent = "";
	placesListMessage.className = "message";
	updateEventPlaceOptions();
	renderAdminPlaces();
}
function renderAdminPlaces() {
	const searchText = placesSearchInput.value
		.trim()
		.toLocaleLowerCase("hu");
	const browseablePlaces = adminPlaces.filter((place) => !place.is_event_only);
	const filteredPlaces = browseablePlaces.filter((place) => place.searchText.includes(searchText));
	placesCount.textContent = searchText
		? `${filteredPlaces.length} találat, összesen ${browseablePlaces.length} hely`
		: `${browseablePlaces.length} mentett hely`;
	if (filteredPlaces.length === 0) {
		placesList.innerHTML = `
			<div class="empty-list">
				${searchText
				? "Nincs a keresésnek megfelelő hely."
				: "Még nincs mentett nevezetesség."}
			</div>
		`;
		return;
	}
	placesList.innerHTML = filteredPlaces
		.map((place) => {
			const categories = Array.isArray(place.categories)
				? place.categories
				: [];
			const categoryHtml = categories
				.map((category) => `
						<span class="place-list-category">
							${escapeHtml(category)}
						</span>
					`)
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
			const freeHtml = place.is_free
				? `<span class="place-status free">Ingyenes</span>`
				: "";
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
							${freeHtml}
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
	const place = adminPlaces.find((item) => Number(item.id) === Number(placeId));
	if (!place) {
		alert("A kiválasztott hely nem található.");
		return;
	}
	editingPlaceId = Number(place.id);
	placeNameInput.value = place.name || "";
	placeAddress.value = place.address || "";
	cityInput.value = place.city || "";
	latitudeInput.value = place.latitude ?? "";
	longitudeInput.value = place.longitude ?? "";
	updateAdminMapPosition(Number(place.latitude), Number(place.longitude), true);
	websiteInput.value = place.website || "";
	descriptionInput.value = place.description || "";
	ticketInfoInput.value = place.ticket_info || "";
	openingHoursInput.value = place.opening_hours || "";
	const categories = Array.isArray(place.categories)
		? place.categories
		: [];
	categoryOneInput.value = categories[0] || "";
	categoryTwoInput.value = categories[1] || "";
	const imageUrls = Array.isArray(place.image_urls)
		? place.image_urls
		: [];
	editingOriginalImageUrl = imageUrls[0] || "";
	editingOriginalStoragePath = place.image_storage_path || null;
	removeExistingImageOnSave = false;
	imageFileInput.value = "";
	if (editingOriginalStoragePath) {
		imageUrlInput.value = "";
		imageMessage.textContent = "Jelenlegi, tárhelyre feltöltött kép.";
		imageMessage.style.color = "#94a3b8";
	} else {
		imageUrlInput.value = editingOriginalImageUrl;
	}
	showImagePreview(editingOriginalImageUrl);
	const selectedPriceLevel = place.price_level || "";
	document
		.querySelectorAll('input[name="priceLevel"]')
		.forEach((input) => {
			input.checked = input.value === selectedPriceLevel;
		});
	isFreeInput.checked = Boolean(place.is_free);
	isPublishedInput.checked = Boolean(place.is_published);
	savePlaceButton.textContent = "Módosítások mentése";
	cancelEditButton.classList.remove("hidden");
	editModeBanner.classList.remove("hidden");
	editModePlaceName.textContent = `– ${place.name}`;
	showSaveMessage("");
	placeForm.scrollTo({
		top: 0,
		behavior: "smooth"
	});
	placeNameInput.focus({
		preventScroll: true
	});
}
async function deletePlace(placeId, placeName) {
	const confirmed = window.confirm(`Biztosan törölni szeretnéd ezt a helyet?\n\n${placeName}\n\nEz a művelet nem vonható vissza.`);
	if (!confirmed) {
		return;
	}
	const placeToDelete = adminPlaces.find((place) => Number(place.id) === Number(placeId));
	const storagePathToDelete = placeToDelete?.image_storage_path ||
		null;
	placesListMessage.textContent = `${placeName} törlése...`;
	placesListMessage.className = "message";
	const { error } = await supabaseClient
		.from("places")
		.delete()
		.eq("id", placeId);
	if (error) {
		console.error("Törlési hiba:", error);
		placesListMessage.textContent = `Nem sikerült törölni: ${error.message}`;
		placesListMessage.className = "message error";
		return;
	}
	if (storagePathToDelete) {
		await deleteStoredImage(storagePathToDelete);
	}
	adminPlaces = adminPlaces.filter((place) => Number(place.id) !== Number(placeId));
	if (Number(editingPlaceId) ===
		Number(placeId)) {
		resetPlaceForm();
	}
	placesListMessage.textContent = `Törölve: ${placeName}`;
	placesListMessage.className = "message success";
	renderAdminPlaces();
}

// Geocoding
async function searchLocation(query) {
	const searchParameters = new URLSearchParams({
		q: query,
		format: "jsonv2",
		limit: "1",
		addressdetails: "1",
		"accept-language": "hu"
	});
	const response = await fetch(`https://nominatim.openstreetmap.org/search?${searchParameters}`);
	if (!response.ok) {
		throw new Error(`A keresés HTTP-hibával tért vissza: ${response.status}`);
	}
	const results = await response.json();
	if (!Array.isArray(results) || results.length === 0) {
		return null;
	}

	const result = results[0];
	const address = result.address || {};
	return {
		displayName: result.display_name,
		latitude: Number(result.lat),
		longitude: Number(result.lon),
		city: address.city || address.town || address.village || address.municipality || ""
	};
}

async function findLocationByAddress() {
	const address = placeAddress.value.trim();
	if (!address) {
		locationMessage.textContent = "Először írd be a címet vagy a hely nevét.";
		locationMessage.style.color = "#f87171";
		placeAddress.focus();
		return;
	}

	findLocationButton.disabled = true;
	findLocationButton.textContent = "Keresés...";
	locationMessage.textContent = "Hely keresése folyamatban...";
	locationMessage.style.color = "#94a3b8";

	try {
		const result = await searchLocation(address);
		if (!result) {
			locationMessage.textContent = "Nem találtam ilyen helyet. Próbáld meg pontosabb címmel vagy a nevezetesség nevével.";
			locationMessage.style.color = "#f87171";
			return;
		}

		if (result.city) {
			cityInput.value = result.city;
		}
		latitudeInput.value = result.latitude.toFixed(7);
		longitudeInput.value = result.longitude.toFixed(7);
		updateAdminMapPosition(result.latitude, result.longitude, true);
		locationMessage.textContent = `Találat: ${result.displayName} – OpenStreetMap`;
		locationMessage.style.color = "#4ade80";
	} catch (error) {
		console.error("Helykeresési hiba:", error);
		locationMessage.textContent = "Nem sikerült lekérni a hely koordinátáit. Próbáld újra később.";
		locationMessage.style.color = "#f87171";
	} finally {
		findLocationButton.disabled = false;
		findLocationButton.textContent = "Hely megkeresése";
	}
}

async function savePlace(event) {
	event.preventDefault();
	showSaveMessage("");
	const { data: userData, error: userError } = await supabaseClient.auth.getUser();
	const user = userData?.user;
	if (userError ||
		!user ||
		user.id !== ADMIN_USER_ID) {
		showSaveMessage("A mentéshez adminisztrátorként kell bejelentkezned.", "error");
		return;
	}
	const formData = new FormData(placeForm);
	const name = String(formData.get("name") || "").trim();
	const address = String(formData.get("address") || "").trim();
	const city = String(formData.get("city") || "").trim();
	const latitude = Number(formData.get("latitude"));
	const longitude = Number(formData.get("longitude"));
	const website = String(formData.get("website") || "").trim();
	const description = String(formData.get("description") || "").trim();
	const ticketInfo = String(formData.get("ticketInfo") || "").trim();
	const openingHours = String(formData.get("openingHours") || "").trim();
	const categoryOne = String(formData.get("categoryOne") || "").trim();
	const categoryTwo = String(formData.get("categoryTwo") || "").trim();
	const priceLevel = String(formData.get("priceLevel") || "").trim();
	const isFree = formData.get("isFree") === "on";
	const imageUrl = String(formData.get("imageUrl") || "").trim();
	const selectedImageFile = imageFileInput.files?.[0] || null;
	const isPublished = formData.get("isPublished") === "on";
	const categories = [
		categoryOne,
		categoryTwo
	].filter((category, index, array) => category &&
		array.indexOf(category) === index);
	if (!name || !address || !city) {
		showSaveMessage("A nevet, a címet és a települést kötelező megadni.", "error");
		return;
	}
	if (!Number.isFinite(latitude) ||
		latitude < -90 ||
		latitude > 90) {
		showSaveMessage("A szélességi koordináta nem megfelelő.", "error");
		return;
	}
	if (!Number.isFinite(longitude) ||
		longitude < -180 ||
		longitude > 180) {
		showSaveMessage("A hosszúsági koordináta nem megfelelő.", "error");
		return;
	}
	if (categories.length === 0) {
		showSaveMessage("Legalább egy kategóriát adj meg.", "error");
		return;
	}
	const isEditing = editingPlaceId !== null;
	savePlaceButton.disabled = true;
	let finalImageUrl = editingOriginalImageUrl || "";
	let finalStoragePath = editingOriginalStoragePath || null;
	let newlyUploadedStoragePath = null;
	try {
		if (selectedImageFile) {
			savePlaceButton.textContent = "Kép tömörítése és feltöltése...";
			imageMessage.textContent = "A kép tömörítése és feltöltése folyamatban...";
			imageMessage.style.color = "#94a3b8";
			const uploadResult = await uploadPlaceImage(selectedImageFile);
			finalImageUrl = uploadResult.publicUrl;
			finalStoragePath = uploadResult.storagePath;
			newlyUploadedStoragePath = uploadResult.storagePath;
			const sizeInKilobytes = Math.round(uploadResult.sizeBytes / 1024);
			imageMessage.textContent = `A tömörített kép feltöltve: ${sizeInKilobytes} KB`;
			imageMessage.style.color = "#4ade80";
		}
		else if (imageUrl) {
			finalImageUrl = imageUrl;
			finalStoragePath = null;
		}
		else if (removeExistingImageOnSave) {
			finalImageUrl = "";
			finalStoragePath = null;
		}
	}
	catch (error) {
		console.error("Képfeltöltési hiba:", error);
		savePlaceButton.disabled = false;
		savePlaceButton.textContent =
			isEditing
				? "Módosítások mentése"
				: "Nevezetesség mentése";
		showSaveMessage(`Nem sikerült feltölteni a képet: ${error.message ||
			"ismeretlen hiba"}`, "error");
		return;
	}
	savePlaceButton.textContent =
		isEditing
			? "Módosítások mentése..."
			: "Mentés...";
	const placeToSave = {
		name,
		address,
		city,
		latitude,
		longitude,
		website: website || null,
		description: description || null,
		ticket_info: ticketInfo || null,
		opening_hours: openingHours || null,
		categories,
		price_level: priceLevel || null,
		is_free: isFree,
		image_urls: finalImageUrl
			? [finalImageUrl]
			: [],
		image_storage_path: finalStoragePath,
		is_published: isPublished
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
	const { data, error } = result;
	savePlaceButton.disabled = false;
	savePlaceButton.textContent =
		isEditing
			? "Módosítások mentése"
			: "Nevezetesség mentése";
	if (error) {
		if (newlyUploadedStoragePath) {
			await deleteStoredImage(newlyUploadedStoragePath);
		}
		console.error("Mentési hiba:", error);
		showSaveMessage(`Nem sikerült elmenteni: ${error.message}`, "error");
		return;
	}
	const savedPlace = data?.[0];
	if (isEditing &&
		editingOriginalStoragePath &&
		editingOriginalStoragePath !==
		finalStoragePath) {
		await deleteStoredImage(editingOriginalStoragePath);
	}
	const successText = isEditing
		? `Sikeresen módosítva: ${savedPlace?.name || name}`
		: `Sikeresen elmentve: ${savedPlace?.name || name}`;
	resetPlaceForm();
	showSaveMessage(successText, "success");
	placeForm.scrollTo({
		top: 0,
		behavior: "smooth"
	});
	setTimeout(() => {
		placeNameInput.focus({
			preventScroll: true
		});
	}, 300);
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

// Events
function updateEventPlaceOptions() {
	const selectedValue = eventPlaceId.value;
	const options = adminPlaces
		.map((place) => {
			const typeLabel = place.is_event_only ? " · eseményhelyszín" : "";
			const cityLabel = place.city ? ` – ${escapeHtml(place.city)}` : "";
			return `<option value="${place.id}">${escapeHtml(place.name)}${cityLabel}${typeLabel}</option>`;
		})
		.join("");

	eventPlaceId.innerHTML = `<option value="">Nincs kapcsolt hely</option>${options}`;
	if ([...eventPlaceId.options].some((option) => option.value === selectedValue)) {
		eventPlaceId.value = selectedValue;
	}

	if (adminEvents.length > 0) {
		adminEvents.forEach((event) => {
			event.searchText = [event.title, event.description, getAdminEventPlaceName(event.place_id)]
				.join(" ")
				.toLocaleLowerCase("hu");
		});
		renderAdminEvents();
	}
}

function getMonthName(month) {
	return MONTH_NAMES[Number(month) - 1] || "";
}

function getMonthRangeLabel(startMonth, endMonth) {
	const start = getMonthName(startMonth);
	const end = getMonthName(endMonth);
	return Number(startMonth) === Number(endMonth) ? start : `${start}–${end}`;
}

function getMonthlyRuleLabel(ordinal, weekday) {
	return `Minden hónap ${ORDINAL_NAMES[String(ordinal)] || ""} ${WEEKDAY_RULE_NAMES[String(weekday)] || ""}`.trim();
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

function updateEventRulePreview() {
	const rule = getMonthlyRuleLabel(eventOrdinal.value, eventWeekday.value);
	const now = new Date();
	const occurrence = getNthWeekdayDate(now.getFullYear(), now.getMonth(), eventOrdinal.value, eventWeekday.value);
	const currentDate = occurrence
		? new Intl.DateTimeFormat("hu-HU", { month: "long", day: "numeric" }).format(occurrence)
		: "ebben a hónapban nincs ilyen nap";
	eventRulePreview.textContent = `${rule}. Aktuális hónap: ${currentDate}.`;
}

function updateEventScheduleFields() {
	const yearly = eventRecurrenceType.value === "yearly";
	eventYearlyFields.classList.toggle("hidden", !yearly);
	eventMonthlyRuleFields.classList.toggle("hidden", yearly);
	updateEventRulePreview();
}

function getAdminEventPlaceName(placeId) {
	return adminPlaces.find((place) => Number(place.id) === Number(placeId))?.name || "Nincs kapcsolt hely";
}

function getAdminRecurrenceLabel(recurrenceType) {
	return recurrenceType === "monthly_rule" ? "Havi szabály" : "Évente";
}

function formatAdminEventSchedule(event) {
	if (event.recurrence_type === "monthly_rule") {
		return getMonthlyRuleLabel(event.recurrence_ordinal, event.recurrence_weekday);
	}
	return getMonthRangeLabel(event.start_month, event.end_month || event.start_month);
}

function initializeEventPlaceMap() {
	if (eventPlaceMap) {
		setTimeout(() => eventPlaceMap.invalidateSize(), 100);
		return;
	}

	eventPlaceMap = L.map("eventPlaceMap", {
		zoomControl: true,
		minZoom: 3,
		maxZoom: 19
	}).setView([47.1625, 19.5033], 7);

	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution: "&copy; OpenStreetMap közreműködők"
	}).addTo(eventPlaceMap);

	eventPlaceMap.on("click", (event) => {
		const latitude = Number(event.latlng.lat.toFixed(7));
		const longitude = Number(event.latlng.lng.toFixed(7));
		eventPlaceLatitude.value = latitude;
		eventPlaceLongitude.value = longitude;
		updateEventPlaceMapPosition(latitude, longitude, false);
		eventPlaceMessage.textContent = "A pozíciót a térképen állítottad be.";
		eventPlaceMessage.className = "field-message success-text";
	});

	setTimeout(() => eventPlaceMap.invalidateSize(), 100);
}

function updateEventPlaceMapPosition(latitude, longitude, zoomToMarker = true) {
	if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
		return;
	}

	initializeEventPlaceMap();
	const position = [Number(latitude), Number(longitude)];

	if (!eventPlaceMarker) {
		eventPlaceMarker = L.marker(position, { draggable: true }).addTo(eventPlaceMap);
		eventPlaceMarker.on("dragend", () => {
			const markerPosition = eventPlaceMarker.getLatLng();
			eventPlaceLatitude.value = markerPosition.lat.toFixed(7);
			eventPlaceLongitude.value = markerPosition.lng.toFixed(7);
			eventPlaceMessage.textContent = "A jelölő pozíciója módosítva.";
			eventPlaceMessage.className = "field-message success-text";
		});
	} else {
		eventPlaceMarker.setLatLng(position);
	}

	if (zoomToMarker) {
		eventPlaceMap.setView(position, 16);
	}
}

function showEventImagePreview(imageSource) {
	if (!imageSource) {
		eventImagePreview.src = "";
		eventImagePreviewContainer.classList.add("hidden");
		return;
	}

	eventImagePreview.src = imageSource;
	eventImagePreviewContainer.classList.remove("hidden");
}

function clearEventImageSelection(markExistingImageForRemoval = true) {
	eventImageFile.value = "";
	eventImageMessage.textContent = "";
	showEventImagePreview("");

	if (markExistingImageForRemoval && editingEventId !== null && editingEventOriginalImageUrl) {
		removeExistingEventImageOnSave = true;
	}
}

async function uploadEventImage(file) {
	const compressedImage = await compressImageToWebp(file);
	const storagePath = `events/${crypto.randomUUID()}.webp`;
	const { error: uploadError } = await supabaseClient.storage
		.from(IMAGE_BUCKET)
		.upload(storagePath, compressedImage, {
			contentType: "image/webp",
			cacheControl: "31536000",
			upsert: false
		});

	if (uploadError) {
		throw uploadError;
	}

	const { data: publicUrlData } = supabaseClient.storage
		.from(IMAGE_BUCKET)
		.getPublicUrl(storagePath);

	if (!publicUrlData?.publicUrl) {
		await supabaseClient.storage.from(IMAGE_BUCKET).remove([storagePath]);
		throw new Error("Nem sikerült létrehozni az eseménykép nyilvános címét.");
	}

	return {
		publicUrl: publicUrlData.publicUrl,
		storagePath
	};
}

function setEventPlaceCreatorOpen(isOpen) {
	eventPlaceCreator.classList.toggle("hidden", !isOpen);
	toggleEventPlaceCreatorButton.setAttribute("aria-expanded", String(isOpen));

	if (!isOpen) {
		return;
	}

	initializeEventPlaceMap();
	setTimeout(() => {
		eventPlaceMap.invalidateSize();
		const latitude = Number(eventPlaceLatitude.value);
		const longitude = Number(eventPlaceLongitude.value);
		if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
			updateEventPlaceMapPosition(latitude, longitude);
		}
		eventPlaceName.focus();
	}, 80);
}

function resetEventPlaceCreator() {
	eventPlaceName.value = "";
	eventPlaceAddress.value = "";
	eventPlaceCity.value = "";
	eventPlaceLatitude.value = "";
	eventPlaceLongitude.value = "";
	eventPlaceMessage.textContent = "";
	eventPlaceMessage.className = "field-message";
	if (eventPlaceMarker && eventPlaceMap) {
		eventPlaceMap.removeLayer(eventPlaceMarker);
		eventPlaceMarker = null;
		eventPlaceMap.setView([47.1625, 19.5033], 7);
	}
	setEventPlaceCreatorOpen(false);
}

async function findEventPlaceLocation() {
	const query = eventPlaceAddress.value.trim() || eventPlaceName.value.trim();
	if (!query) {
		eventPlaceMessage.textContent = "Adj meg egy címet vagy helyszínnevet.";
		eventPlaceMessage.className = "field-message error-text";
		return;
	}

	findEventPlaceButton.disabled = true;
	findEventPlaceButton.textContent = "Keresés...";
	eventPlaceMessage.textContent = "Hely keresése folyamatban...";
	eventPlaceMessage.className = "field-message";

	try {
		const result = await searchLocation(query);
		if (!result) {
			eventPlaceMessage.textContent = "Nem találtam ilyen helyet. Próbálj pontosabb címet.";
			eventPlaceMessage.className = "field-message error-text";
			return;
		}

		if (result.city) {
			eventPlaceCity.value = result.city;
		}
		eventPlaceLatitude.value = result.latitude.toFixed(7);
		eventPlaceLongitude.value = result.longitude.toFixed(7);
		updateEventPlaceMapPosition(result.latitude, result.longitude);
		eventPlaceMessage.textContent = `Találat: ${result.displayName}`;
		eventPlaceMessage.className = "field-message success-text";
	} catch (error) {
		console.error("Eseményhelyszín keresési hiba:", error);
		eventPlaceMessage.textContent = "Nem sikerült lekérni a koordinátákat.";
		eventPlaceMessage.className = "field-message error-text";
	} finally {
		findEventPlaceButton.disabled = false;
		findEventPlaceButton.textContent = "Hely megkeresése";
	}
}

async function saveEventPlace() {
	const { data: userData, error: userError } = await supabaseClient.auth.getUser();
	if (userError || !userData?.user || userData.user.id !== ADMIN_USER_ID) {
		eventPlaceMessage.textContent = "A mentéshez adminisztrátorként kell bejelentkezned.";
		eventPlaceMessage.className = "field-message error-text";
		return;
	}

	const name = eventPlaceName.value.trim();
	const address = eventPlaceAddress.value.trim();
	const city = eventPlaceCity.value.trim();
	const latitude = Number(eventPlaceLatitude.value);
	const longitude = Number(eventPlaceLongitude.value);

	if (!name || !address || !city || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
		eventPlaceMessage.textContent = "A nevet, címet, települést és koordinátákat kötelező megadni.";
		eventPlaceMessage.className = "field-message error-text";
		return;
	}

	saveEventPlaceButton.disabled = true;
	saveEventPlaceButton.textContent = "Mentés...";
	const { data, error } = await supabaseClient
		.from("places")
		.insert({
			name,
			address,
			city,
			latitude,
			longitude,
			website: null,
			description: null,
			ticket_info: null,
			opening_hours: null,
			categories: ["Eseményhelyszín"],
			price_level: null,
			is_free: false,
			image_urls: [],
			image_storage_path: null,
			is_published: true,
			is_event_only: true
		})
		.select("id, name")
		.single();

	saveEventPlaceButton.disabled = false;
	saveEventPlaceButton.textContent = "Helyszín mentése és kiválasztása";
	if (error) {
		console.error("Eseményhelyszín mentési hiba:", error);
		eventPlaceMessage.textContent = `Nem sikerült elmenteni: ${error.message}`;
		eventPlaceMessage.className = "field-message error-text";
		return;
	}

	await loadAdminPlaces();
	eventPlaceId.value = String(data.id);
	resetEventPlaceCreator();
	eventSaveMessage.textContent = `Eseményhelyszín létrehozva: ${data.name}`;
	eventSaveMessage.className = "message success full-width";
}

async function loadAdminEvents() {
	eventsListMessage.textContent = "Események betöltése...";
	eventsListMessage.className = "message";
	refreshEventsButton.disabled = true;

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
			image_url,
			image_storage_path,
			is_published,
			created_at,
			updated_at
		`)
		.order("title", { ascending: true });

	refreshEventsButton.disabled = false;
	if (error) {
		console.error("Eseménylista betöltési hiba:", error);
		eventsListMessage.textContent = "Nem sikerült betölteni az eseményeket. Futtasd a frissített supabase-events.sql fájlt.";
		eventsListMessage.className = "message error";
		adminEvents = [];
		renderAdminEvents();
		return;
	}

	adminEvents = (data || []).map((event) => ({
		...event,
		searchText: [event.title, event.description, getAdminEventPlaceName(event.place_id)]
			.join(" ")
			.toLocaleLowerCase("hu")
	}));

	eventsListMessage.textContent = "";
	eventsListMessage.className = "message";
	renderAdminEvents();
}

function renderAdminEvents() {
	const searchText = eventsSearchInput.value.trim().toLocaleLowerCase("hu");
	const filteredEvents = adminEvents.filter((event) => !searchText || event.searchText.includes(searchText));

	eventsCount.textContent = searchText
		? `${filteredEvents.length} találat, összesen ${adminEvents.length} esemény`
		: `${adminEvents.length} mentett esemény`;

	if (filteredEvents.length === 0) {
		eventsList.innerHTML = `
			<div class="empty-list">
				${searchText ? "Nincs a keresésnek megfelelő esemény." : "Még nincs mentett esemény."}
			</div>
		`;
		return;
	}

	eventsList.innerHTML = filteredEvents
		.map((event) => {
			const statusClass = event.is_published ? "published" : "draft";
			const statusText = event.is_published ? "Közzétéve" : "Piszkozat";
			const placeName = getAdminEventPlaceName(event.place_id);

			return `
				<article class="event-admin-item">
					<div class="event-admin-content">
						<div class="event-admin-heading">
							<h3>${escapeHtml(event.title)}</h3>
							<span class="place-status ${statusClass}">${statusText}</span>
						</div>
						<p class="event-admin-date">${escapeHtml(formatAdminEventSchedule(event))} · ${getAdminRecurrenceLabel(event.recurrence_type)}</p>
						<p class="event-admin-place">${escapeHtml(placeName)}</p>
					</div>
					<div class="place-list-actions">
						<button class="edit-place-button" type="button" data-edit-event-id="${event.id}">Szerkesztés</button>
						<button class="delete-place-button" type="button" data-delete-event-id="${event.id}" data-event-title="${escapeHtml(event.title)}">Törlés</button>
					</div>
				</article>
			`;
		})
		.join("");
}

function resetEventForm() {
	eventForm.reset();
	editingEventId = null;
	eventIsPublished.checked = true;
	eventRecurrenceType.value = "yearly";
	const currentMonth = new Date().getMonth() + 1;
	eventStartMonth.value = String(currentMonth);
	eventEndMonth.value = String(currentMonth);
	eventOrdinal.value = "3";
	eventWeekday.value = "6";
	saveEventButton.textContent = "Esemény mentése";
	cancelEventEditButton.classList.add("hidden");
	eventEditModeBanner.classList.add("hidden");
	eventEditModeTitle.textContent = "";
	eventSaveMessage.textContent = "";
	eventSaveMessage.className = "message full-width";
	clearEventImageSelection(false);
	editingEventOriginalStoragePath = null;
	editingEventOriginalImageUrl = "";
	removeExistingEventImageOnSave = false;
	resetEventPlaceCreator();
	updateEventScheduleFields();
}

function startEditingEvent(eventId) {
	const event = adminEvents.find((item) => Number(item.id) === Number(eventId));
	if (!event) {
		return;
	}

	editingEventId = Number(event.id);
	eventTitleInput.value = event.title || "";
	eventRecurrenceType.value = event.recurrence_type === "monthly_rule" ? "monthly_rule" : "yearly";
	eventStartMonth.value = String(event.start_month || new Date().getMonth() + 1);
	eventEndMonth.value = String(event.end_month || event.start_month || new Date().getMonth() + 1);
	eventOrdinal.value = String(event.recurrence_ordinal || 3);
	eventWeekday.value = String(event.recurrence_weekday ?? 6);
	eventPlaceId.value = event.place_id ? String(event.place_id) : "";
	eventWebsite.value = event.website || "";
	eventDescription.value = event.description || "";
	editingEventOriginalStoragePath = event.image_storage_path || null;
	editingEventOriginalImageUrl = event.image_url || "";
	removeExistingEventImageOnSave = false;
	clearEventImageSelection(false);
	showEventImagePreview(editingEventOriginalImageUrl);
	eventIsPublished.checked = Boolean(event.is_published);
	saveEventButton.textContent = "Módosítások mentése";
	cancelEventEditButton.classList.remove("hidden");
	eventEditModeBanner.classList.remove("hidden");
	eventEditModeTitle.textContent = `– ${event.title}`;
	setEventPlaceCreatorOpen(false);
	updateEventScheduleFields();

	eventForm.scrollTo({ top: 0, behavior: "smooth" });
	setTimeout(() => eventTitleInput.focus({ preventScroll: true }), 250);
}

async function deleteEvent(eventId, eventTitle) {
	const eventToDelete = adminEvents.find((item) => Number(item.id) === Number(eventId));
	const confirmed = window.confirm(`Biztosan törlöd ezt az eseményt?

${eventTitle}`);
	if (!confirmed) {
		return;
	}

	const { error } = await supabaseClient.from("events").delete().eq("id", eventId);
	if (error) {
		console.error("Eseménytörlési hiba:", error);
		eventsListMessage.textContent = `Nem sikerült törölni: ${error.message}`;
		eventsListMessage.className = "message error";
		return;
	}

	if (eventToDelete?.image_storage_path) {
		await deleteStoredImage(eventToDelete.image_storage_path);
	}

	if (Number(editingEventId) === Number(eventId)) {
		resetEventForm();
	}

	eventsListMessage.textContent = `Törölve: ${eventTitle}`;
	eventsListMessage.className = "message success";
	await loadAdminEvents();
}

async function saveEvent(event) {
	event.preventDefault();
	eventSaveMessage.textContent = "";

	const { data: userData, error: userError } = await supabaseClient.auth.getUser();
	if (userError || !userData?.user || userData.user.id !== ADMIN_USER_ID) {
		eventSaveMessage.textContent = "A mentéshez adminisztrátorként kell bejelentkezned.";
		eventSaveMessage.className = "message error full-width";
		return;
	}

	const formData = new FormData(eventForm);
	const title = String(formData.get("title") || "").trim();
	const recurrenceType = String(formData.get("recurrenceType") || "yearly");
	const placeId = String(formData.get("placeId") || "");
	const website = String(formData.get("website") || "").trim();
	const description = String(formData.get("description") || "").trim();
	const isPublished = formData.get("isPublished") === "on";

	if (!title) {
		eventSaveMessage.textContent = "Az esemény nevét kötelező megadni.";
		eventSaveMessage.className = "message error full-width";
		return;
	}

	const eventToSave = {
		title,
		description: description || null,
		recurrence_type: recurrenceType,
		start_month: null,
		end_month: null,
		recurrence_ordinal: null,
		recurrence_weekday: null,
		start_date: null,
		end_date: null,
		start_time: null,
		end_time: null,
		place_id: placeId ? Number(placeId) : null,
		website: website || null,
		is_published: isPublished,
		updated_at: new Date().toISOString()
	};

	if (recurrenceType === "yearly") {
		eventToSave.start_month = Number(formData.get("startMonth"));
		eventToSave.end_month = Number(formData.get("endMonth"));
		if (!eventToSave.start_month || !eventToSave.end_month) {
			eventSaveMessage.textContent = "A kezdő és záró hónapot kötelező megadni.";
			eventSaveMessage.className = "message error full-width";
			return;
		}
	} else {
		eventToSave.recurrence_ordinal = Number(formData.get("ordinal"));
		eventToSave.recurrence_weekday = Number(formData.get("weekday"));
		if (![1, 2, 3, 4, 5, -1].includes(eventToSave.recurrence_ordinal) ||
			![0, 1, 2, 3, 4, 5, 6].includes(eventToSave.recurrence_weekday)) {
			eventSaveMessage.textContent = "Az ismétlődési szabály nem megfelelő.";
			eventSaveMessage.className = "message error full-width";
			return;
		}
	}

	const isEditing = editingEventId !== null;
	let finalImageUrl = isEditing && !removeExistingEventImageOnSave ? editingEventOriginalImageUrl : "";
	let finalStoragePath = isEditing && !removeExistingEventImageOnSave ? editingEventOriginalStoragePath : null;
	let newlyUploadedStoragePath = null;
	const selectedImage = eventImageFile.files?.[0];

	if (selectedImage) {
		saveEventButton.disabled = true;
		saveEventButton.textContent = "Kép feltöltése...";
		eventImageMessage.textContent = "Eseménykép tömörítése és feltöltése...";

		try {
			const uploadedImage = await uploadEventImage(selectedImage);
			finalImageUrl = uploadedImage.publicUrl;
			finalStoragePath = uploadedImage.storagePath;
			newlyUploadedStoragePath = uploadedImage.storagePath;
		} catch (error) {
			console.error("Eseménykép feltöltési hiba:", error);
			saveEventButton.disabled = false;
			saveEventButton.textContent = isEditing ? "Módosítások mentése" : "Esemény mentése";
			eventImageMessage.textContent = `Nem sikerült feltölteni a képet: ${error.message || "ismeretlen hiba"}`;
			eventImageMessage.className = "field-message error-text";
			return;
		}
	}

	eventToSave.image_url = finalImageUrl || null;
	eventToSave.image_storage_path = finalStoragePath;

	saveEventButton.disabled = true;
	saveEventButton.textContent = isEditing ? "Módosítások mentése..." : "Mentés...";

	const result = isEditing
		? await supabaseClient.from("events").update(eventToSave).eq("id", editingEventId).select("id, title")
		: await supabaseClient.from("events").insert(eventToSave).select("id, title");

	saveEventButton.disabled = false;
	saveEventButton.textContent = isEditing ? "Módosítások mentése" : "Esemény mentése";
	if (result.error) {
		if (newlyUploadedStoragePath) {
			await deleteStoredImage(newlyUploadedStoragePath);
		}
		console.error("Eseménymentési hiba:", result.error);
		eventSaveMessage.textContent = `Nem sikerült elmenteni: ${result.error.message}`;
		eventSaveMessage.className = "message error full-width";
		return;
	}

	if (isEditing && editingEventOriginalStoragePath && editingEventOriginalStoragePath !== finalStoragePath) {
		await deleteStoredImage(editingEventOriginalStoragePath);
	}

	const savedTitle = result.data?.[0]?.title || title;
	resetEventForm();
	eventSaveMessage.textContent = isEditing
		? `Sikeresen módosítva: ${savedTitle}`
		: `Sikeresen elmentve: ${savedTitle}`;
	eventSaveMessage.className = "message success full-width";
	await loadAdminEvents();
}

// Notifications
function switchAdminView(view) {
	const showPlaces = view === "places";
	const showEvents = view === "events";
	const showNotifications = view === "notifications";

	placesAdminView.classList.toggle("hidden", !showPlaces);
	eventsAdminView.classList.toggle("hidden", !showEvents);
	notificationsAdminView.classList.toggle("hidden", !showNotifications);

	placesTabButton.classList.toggle("active", showPlaces);
	eventsTabButton.classList.toggle("active", showEvents);
	notificationsTabButton.classList.toggle("active", showNotifications);

	if (showEvents) {
		updateEventPlaceOptions();
		updateEventScheduleFields();
		loadAdminEvents();
	}

	if (showNotifications) {
		initializeReleaseEditor();
		loadReleaseVersion();
		loadNotificationSubscribers();
		updateReleasePreview();
	}
}
function initializeReleaseEditor() {
	if (releaseEditor) {
		return;
	}
	releaseEditor = new Quill("#releaseEditor", {
		theme: "snow",
		placeholder: "Írd meg az új verzió értesítőjét...",
		modules: {
			toolbar: {
				container: [
					[
						{
							header: [
								1,
								2,
								3,
								false
							]
						}
					],
					[
						{
							size: [
								"small",
								false,
								"large",
								"huge"
							]
						}
					],
					[
						"bold",
						"italic",
						"underline",
						"strike"
					],
					[
						{
							color: []
						},
						{
							background: []
						}
					],
					[
						{
							list: "ordered"
						},
						{
							list: "bullet"
						}
					],
					[
						{
							align: []
						}
					],
					[
						"blockquote",
						"link",
						"image"
					],
					[
						"clean"
					]
				],
				handlers: {
					image: function() {
						chooseReleaseImage();
					}
				}
			}
		}
	});
	releaseEditor.root.addEventListener("paste", async (event) => {
		const items = Array.from(event.clipboardData?.items || []);
		const imageItem = items.find((item) => item.type.startsWith("image/"));
		if (!imageItem) {
			return;
		}
		event.preventDefault();
		event.stopImmediatePropagation();
		const imageFile = imageItem.getAsFile();
		if (!imageFile) {
			return;
		}
		try {
			const imageUrl = await uploadReleaseImage(imageFile);
			const range = releaseEditor.getSelection(true);
			releaseEditor.insertEmbed(range.index, "image", imageUrl, "user");
			releaseEditor.setSelection(range.index + 1, 0);
		}
		catch (error) {
			console.error("Beillesztett kép feltöltési hiba:", error);
			alert("Nem sikerült feltölteni a beillesztett képet.");
		}
	}, true);
	releaseEditor.on("text-change", updateReleasePreview);
}
function chooseReleaseImage() {
	releaseImageInput.value = "";
	releaseImageInput.click();
}
async function uploadReleaseImage(file) {
	const compressedImage = await compressImageToWebp(file);
	const storagePath = `email-notifications/${crypto.randomUUID()}.webp`;
	const { error: uploadError } = await supabaseClient.storage
		.from(IMAGE_BUCKET)
		.upload(storagePath, compressedImage, {
			contentType: "image/webp",
			cacheControl: "31536000",
			upsert: false
		});
	if (uploadError) {
		throw uploadError;
	}
	const { data } = supabaseClient.storage
		.from(IMAGE_BUCKET)
		.getPublicUrl(storagePath);
	if (!data?.publicUrl) {
		throw new Error("Nem sikerült létrehozni a kép URL-jét.");
	}
	return data.publicUrl;
}
async function loadReleaseVersion() {
	const { data, error } = await supabaseClient
		.from("app_settings")
		.select("version_major, version_minor")
		.eq("id", 1)
		.single();
	if (error) {
		console.error("Verzió betöltési hiba:", error);
		return;
	}
	currentReleaseVersion = {
		major: data.version_major,
		minor: data.version_minor
	};
	currentVersionDisplay.textContent = `v${data.version_major}.${data.version_minor}`;
	nextVersionDisplay.textContent = `v${data.version_major}.${data.version_minor + 1}`;
	updateReleasePreview();
}
function buildReleaseEmailHtml() {
	const nextVersion = `${currentReleaseVersion.major}.` +
		`${currentReleaseVersion.minor + 1}`;
	const content = releaseEditor
		? releaseEditor.root.innerHTML
		: "";
	return `
<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">

<style>
	body {
		margin: 0;
		padding: 0;
		background: #080d14;
		font-family:
			Arial,
			Helvetica,
			sans-serif;
	}

	.email-wrapper {
		width: 100%;
		padding: 34px 14px;
		box-sizing: border-box;
	}

	.email-card {
		max-width: 640px;
		margin: 0 auto;
		padding: 34px;
		box-sizing: border-box;

		border: 1px solid #263447;
		border-radius: 18px;

		background: #101923;
		color: #e7edf6;
	}

	.email-brand {
		margin-bottom: 25px;

		color: #ffffff;

		font-size: 22px;
		font-weight: 700;
	}

	.email-version {
		display: inline-block;

		margin-left: 8px;
		padding: 4px 8px;

		border-radius: 999px;

		background: #172e4d;
		color: #93c5fd;

		font-size: 13px;
	}

	.email-content {
		color: #dce5ef;

		font-size: 16px;
		line-height: 1.65;
	}

	.email-content h1,
	.email-content h2,
	.email-content h3 {
		color: #ffffff;
	}

	.email-content a {
		color: #60a5fa;
	}

	.email-content img {
		max-width: 100%;
		height: auto;

		border-radius: 12px;
	}

	.ql-size-small {
		font-size: 12px;
	}

	.ql-size-large {
		font-size: 20px;
	}

	.ql-size-huge {
		font-size: 28px;
	}

	.ql-align-center {
		text-align: center;
	}

	.ql-align-right {
		text-align: right;
	}

	.ql-align-justify {
		text-align: justify;
	}

	.map-button {
		display: inline-block;

		margin-top: 26px;
		padding: 13px 20px;

		border-radius: 10px;

		background: #2563eb;
		color: #ffffff !important;

		font-weight: 700;
		text-decoration: none;
	}

	.email-footer {
		margin-top: 32px;
		padding-top: 18px;

		border-top: 1px solid #263447;

		color: #718096;

		font-size: 12px;
		line-height: 1.5;
	}
</style>
</head>

<body>

<div class="email-wrapper">

	<div class="email-card">

		<div class="email-brand">
			Vasti Map
			<span class="email-version">
				v${nextVersion}
			</span>
		</div>

		<div class="email-content">
			${content}
		</div>

		<a
			class="map-button"
			href="https://vastikrisz.github.io/vasti_map/"
			target="_blank"
		>
			Térkép megnyitása
		</a>

		<div class="email-footer">
			Ezt az emailt azért kaptad,
			mert feliratkoztál a Vasti Map
			verzióértesítőire.
		</div>

	</div>

</div>

</body>
</html>
	`;
}
function updateReleasePreview() {
	if (!releasePreviewFrame) {
		return;
	}
	releasePreviewFrame.srcdoc = buildReleaseEmailHtml();
}
async function loadNotificationSubscribers() {
	const { data, error } = await supabaseClient
		.from("notification_subscribers")
		.select("id, email, is_active, created_at")
		.order("created_at", {
			ascending: true
		});
	if (error) {
		console.error("Címzettlista betöltési hiba:", error);
		subscriberMessage.textContent = "Nem sikerült betölteni a címzetteket.";
		subscriberMessage.className = "message error";
		return;
	}
	releaseSubscribers = data || [];
	renderNotificationSubscribers();
}
function renderNotificationSubscribers() {
	const activeCount = releaseSubscribers.filter((subscriber) => subscriber.is_active).length;
	subscriberCount.textContent =
		`${activeCount} aktív / ` +
		`${releaseSubscribers.length} összesen`;
	if (releaseSubscribers.length === 0) {
		subscribersList.innerHTML = `
			<div class="empty-list">
				Még nincs címzett.
			</div>
		`;
		return;
	}
	subscribersList.innerHTML =
		releaseSubscribers
			.map((subscriber) => `
					<div
						class="subscriber-item"
					>
						<span
							class="subscriber-email"
						>
							${escapeHtml(subscriber.email)}
						</span>

						<div
							class="subscriber-actions"
						>
							<button
								type="button"
								class="
									subscriber-toggle-button
									${subscriber.is_active
					? ""
					: "inactive"}
								"
								data-subscriber-toggle="
									${subscriber.id}
								"
							>
								${subscriber.is_active
					? "Aktív"
					: "Inaktív"}
							</button>

							<button
								type="button"
								class="
									subscriber-delete-button
								"
								data-subscriber-delete="
									${subscriber.id}
								"
							>
								Törlés
							</button>
						</div>
					</div>
				`)
			.join("");
}
async function sendReleaseEmail(testMode) {
	const subject = releaseSubject.value.trim();
	const plainText = releaseEditor
		?.getText()
		.trim() || "";
	const hasImage = Boolean(releaseEditor
		?.root
		.querySelector("img"));
	if (!subject) {
		releaseMessage.textContent = "Add meg az email tárgyát.";
		releaseMessage.className = "message error";
		return;
	}
	if (!plainText && !hasImage) {
		releaseMessage.textContent = "Írd meg az email tartalmát.";
		releaseMessage.className = "message error";
		return;
	}
	if (!testMode) {
		const activeCount = releaseSubscribers.filter((subscriber) => subscriber.is_active).length;
		if (activeCount === 0) {
			releaseMessage.textContent = "Nincs aktív címzett.";
			releaseMessage.className = "message error";
			return;
		}
		const confirmed = confirm(`Biztosan kiküldöd ` +
			`${activeCount} címzettnek?`);
		if (!confirmed) {
			return;
		}
	}
	sendTestReleaseButton.disabled = true;
	sendReleaseButton.disabled = true;
	releaseMessage.textContent =
		testMode
			? "Próbaemail küldése..."
			: "Verzióértesítő küldése...";
	releaseMessage.className = "message";
	try {
		const { data, error } = await supabaseClient
			.functions
			.invoke(RELEASE_FUNCTION, {
				body: {
					subject,
					html: buildReleaseEmailHtml(),
					test: testMode
				}
			});
		if (error) {
			throw error;
		}
		if (!data?.ok) {
			throw new Error(data?.error ||
				"Ismeretlen küldési hiba.");
		}
		if (testMode) {
			releaseMessage.textContent = "A próbaemail sikeresen elküldve.";
			releaseMessage.className = "message success";
		} else {
			releaseMessage.textContent =
				`${data.sent} email sikeresen elküldve. ` +
				`Az új verzió: v${data.newVersion}.`;
			releaseMessage.className = "message success";
			releaseSubject.value = "";
			releaseEditor.setContents([]);
			await loadReleaseVersion();
			updateReleasePreview();
		}
	}
	catch (error) {
		console.error("Emailküldési hiba:", error);
		releaseMessage.textContent = `Küldési hiba: ${error.message}`;
		releaseMessage.className = "message error";
	}
	finally {
		sendTestReleaseButton.disabled = false;
		sendReleaseButton.disabled = false;
	}
}

// Messages
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

// Map
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
	}).setView([47.1625, 19.5033], 7);
	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution: "&copy; OpenStreetMap közreműködők"
	}).addTo(adminMap);
	adminMap.on("click", (event) => {
		const latitude = Number(event.latlng.lat.toFixed(7));
		const longitude = Number(event.latlng.lng.toFixed(7));
		latitudeInput.value = latitude;
		longitudeInput.value = longitude;
		updateAdminMapPosition(latitude, longitude, false);
		locationMessage.textContent = "A pozíciót a térképen állítottad be.";
		locationMessage.style.color = "#4ade80";
	});
	setTimeout(() => {
		adminMap.invalidateSize();
	}, 100);
}
function updateAdminMapPosition(latitude, longitude, zoomToMarker = true) {
	if (!Number.isFinite(Number(latitude)) ||
		!Number.isFinite(Number(longitude))) {
		return;
	}
	initializeAdminMap();
	const position = [
		Number(latitude),
		Number(longitude)
	];
	if (!adminMarker) {
		adminMarker = L.marker(position, {
			draggable: true
		}).addTo(adminMap);
		adminMarker.on("dragend", () => {
			const markerPosition = adminMarker.getLatLng();
			latitudeInput.value = markerPosition.lat.toFixed(7);
			longitudeInput.value = markerPosition.lng.toFixed(7);
			locationMessage.textContent = "A jelölő pozíciója módosítva.";
			locationMessage.style.color = "#4ade80";
		});
	} else {
		adminMarker.setLatLng(position);
	}
	if (zoomToMarker) {
		adminMap.setView(position, 16);
	}
}

// Images
function showImagePreview(imageSource) {
	if (!imageSource) {
		imagePreview.src = "";
		imagePreviewContainer.classList.add("hidden");
		return;
	}
	imagePreview.src = imageSource;
	imagePreviewContainer.classList.remove("hidden");
}
function clearImageSelection(markExistingImageForRemoval = true) {
	imageFileInput.value = "";
	imageUrlInput.value = "";
	imagePreview.src = "";
	imagePreviewContainer.classList.add("hidden");
	imageMessage.textContent = "";
	if (markExistingImageForRemoval &&
		editingPlaceId !== null &&
		editingOriginalImageUrl) {
		removeExistingImageOnSave = true;
	}
}
async function compressImageToWebp(file) {
	const maximumWidth = 1600;
	const maximumHeight = 1200;
	const webpQuality = 0.78;
	const temporaryUrl = URL.createObjectURL(file);
	try {
		const image = new Image();
		await new Promise((resolve, reject) => {
			image.onload = resolve;
			image.onerror = () => {
				reject(new Error("A kiválasztott képet nem sikerült megnyitni."));
			};
			image.src = temporaryUrl;
		});
		let width = image.naturalWidth;
		let height = image.naturalHeight;
		if (!width || !height) {
			throw new Error("A kép mérete nem állapítható meg.");
		}
		const scale = Math.min(1, maximumWidth / width, maximumHeight / height);
		width = Math.round(width * scale);
		height = Math.round(height * scale);
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const context = canvas.getContext("2d");
		if (!context) {
			throw new Error("A böngésző nem tudja feldolgozni a képet.");
		}
		context.drawImage(image, 0, 0, width, height);
		const compressedBlob = await new Promise((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (blob) {
					resolve(blob);
				} else {
					reject(new Error("Nem sikerült tömöríteni a képet."));
				}
			}, "image/webp", webpQuality);
		});
		return compressedBlob;
	}
	finally {
		URL.revokeObjectURL(temporaryUrl);
	}
}
async function uploadPlaceImage(file) {
	const compressedImage = await compressImageToWebp(file);
	const storagePath = `places/${crypto.randomUUID()}.webp`;
	const { error: uploadError } = await supabaseClient.storage
		.from(IMAGE_BUCKET)
		.upload(storagePath, compressedImage, {
			contentType: "image/webp",
			cacheControl: "31536000",
			upsert: false
		});
	if (uploadError) {
		throw uploadError;
	}
	const { data: publicUrlData } = supabaseClient.storage
		.from(IMAGE_BUCKET)
		.getPublicUrl(storagePath);
	if (!publicUrlData?.publicUrl) {
		await supabaseClient.storage
			.from(IMAGE_BUCKET)
			.remove([storagePath]);
		throw new Error("Nem sikerült létrehozni a kép nyilvános címét.");
	}
	return {
		publicUrl: publicUrlData.publicUrl,
		storagePath,
		sizeBytes: compressedImage.size
	};
}
async function deleteStoredImage(storagePath) {
	if (!storagePath) {
		return true;
	}
	const { error } = await supabaseClient.storage
		.from(IMAGE_BUCKET)
		.remove([storagePath]);
	if (error) {
		console.error("A tárolt kép törlési hibája:", error);
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
		adminMap.setView([47.1625, 19.5033], 7);
	}
	editingOriginalStoragePath = null;
	editingOriginalImageUrl = "";
	removeExistingImageOnSave = false;
	isFreeInput.checked = false;
	isPublishedInput.checked = true;
	savePlaceButton.textContent = "Nevezetesség mentése";
	cancelEditButton.classList.add("hidden");
	editModeBanner.classList.add("hidden");
	editModePlaceName.textContent = "";
	locationMessage.textContent = "";
}

// Auth
function showLogin() {
	loginSection.classList.remove("hidden");
	dashboardSection.classList.add("hidden");
}
function showDashboard(user) {
	loginSection.classList.add("hidden");
	dashboardSection.classList.remove("hidden");
	userEmail.textContent = `Bejelentkezett felhasználó: ${user.email}`;
	initializeAdminMap();
	resetEventForm();
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
		showMessage("Ez a felhasználó nem rendelkezik adminisztrátori jogosultsággal.", "error");
		return false;
	}
	showDashboard(user);
	return true;
}
async function checkCurrentUser() {
	const { data, error } = await supabaseClient.auth.getUser();
	if (error || !data.user) {
		showLogin();
		return;
	}
	await verifyAdminUser(data.user);
}

// Events
loginForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	showMessage("");
	loginButton.disabled = true;
	loginButton.textContent = "Belépés...";
	const formData = new FormData(loginForm);
	const email = String(formData.get("email") || "")
		.trim();
	const password = String(formData.get("password") || "");
	const { data, error } = await supabaseClient.auth
		.signInWithPassword({
			email,
			password
		});
	loginButton.disabled = false;
	loginButton.textContent = "Belépés";
	if (error) {
		console.error("Belépési hiba:", error);
		showMessage("Sikertelen belépés. Ellenőrizd az e-mail-címet és a jelszót.", "error");
		return;
	}
	const isAdmin = await verifyAdminUser(data.user);
	if (isAdmin) {
		loginForm.reset();
		showMessage("Sikeres belépés.", "success");
	}
});
logoutButton.addEventListener("click", async () => {
	const { error } = await supabaseClient.auth.signOut({
		scope: "local"
	});
	if (error) {
		console.error("Kijelentkezési hiba:", error);
		alert("Nem sikerült kijelentkezni.");
		return;
	}
	showLogin();
	loginForm.reset();
	showMessage("");
});
placesTabButton.addEventListener("click", () => {
	switchAdminView("places");
});
eventsTabButton.addEventListener("click", () => {
	switchAdminView("events");
});
notificationsTabButton.addEventListener("click", () => {
	switchAdminView("notifications");
});
eventForm.addEventListener("submit", saveEvent);
eventRecurrenceType.addEventListener("change", updateEventScheduleFields);
eventOrdinal.addEventListener("change", updateEventRulePreview);
eventWeekday.addEventListener("change", updateEventRulePreview);
toggleEventPlaceCreatorButton.addEventListener("click", () => {
	setEventPlaceCreatorOpen(eventPlaceCreator.classList.contains("hidden"));
});
cancelEventPlaceButton.addEventListener("click", resetEventPlaceCreator);
eventPlaceCreator.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		event.preventDefault();
	}
});
findEventPlaceButton.addEventListener("click", findEventPlaceLocation);
eventPlaceLatitude.addEventListener("change", () => {
	updateEventPlaceMapPosition(eventPlaceLatitude.value, eventPlaceLongitude.value);
});
eventPlaceLongitude.addEventListener("change", () => {
	updateEventPlaceMapPosition(eventPlaceLatitude.value, eventPlaceLongitude.value);
});
saveEventPlaceButton.addEventListener("click", saveEventPlace);
eventImageFile.addEventListener("change", () => {
	const file = eventImageFile.files?.[0];
	eventImageMessage.textContent = "";
	eventImageMessage.className = "field-message";

	if (!file) {
		showEventImagePreview(editingEventOriginalImageUrl);
		return;
	}

	if (!file.type.startsWith("image/")) {
		eventImageFile.value = "";
		eventImageMessage.textContent = "A kiválasztott fájl nem kép.";
		eventImageMessage.className = "field-message error-text";
		return;
	}

	removeExistingEventImageOnSave = false;
	showEventImagePreview(URL.createObjectURL(file));
	eventImageMessage.textContent = `Kiválasztva: ${file.name}`;
	eventImageMessage.className = "field-message success-text";
});
removeEventImageButton.addEventListener("click", () => clearEventImageSelection(true));
eventsSearchInput.addEventListener("input", renderAdminEvents);
refreshEventsButton.addEventListener("click", loadAdminEvents);
clearEventFormButton.addEventListener("click", () => {
	resetEventForm();
	eventTitleInput.focus();
});
cancelEventEditButton.addEventListener("click", () => {
	resetEventForm();
	eventSaveMessage.textContent = "A szerkesztés megszakítva.";
	eventSaveMessage.className = "message full-width";
	eventTitleInput.focus();
});
eventsList.addEventListener("click", async (event) => {
	const editButton = event.target.closest("[data-edit-event-id]");
	if (editButton) {
		startEditingEvent(Number(editButton.dataset.editEventId));
		return;
	}

	const deleteButton = event.target.closest("[data-delete-event-id]");
	if (deleteButton) {
		await deleteEvent(
			Number(deleteButton.dataset.deleteEventId),
			deleteButton.dataset.eventTitle || "Esemény"
		);
	}
});

releaseSubject.addEventListener("input", updateReleasePreview);
desktopPreviewButton.addEventListener("click", () => {
	releasePreviewShell.classList.remove("mobile-preview");
	desktopPreviewButton.classList.add("active");
	mobilePreviewButton.classList.remove("active");
});
mobilePreviewButton.addEventListener("click", () => {
	releasePreviewShell.classList.add("mobile-preview");
	mobilePreviewButton.classList.add("active");
	desktopPreviewButton.classList.remove("active");
});
releaseImageInput.addEventListener("change", async () => {
	const file = releaseImageInput.files?.[0];
	if (!file) {
		return;
	}
	try {
		const imageUrl = await uploadReleaseImage(file);
		const range = releaseEditor.getSelection(true);
		releaseEditor.insertEmbed(range.index, "image", imageUrl, "user");
		releaseEditor.setSelection(range.index + 1, 0);
	}
	catch (error) {
		console.error("Emailkép feltöltési hiba:", error);
		alert("Nem sikerült feltölteni a képet.");
	}
});
subscriberForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	const email = subscriberEmailInput
		.value
		.trim()
		.toLowerCase();
	if (!email) {
		return;
	}
	const { error } = await supabaseClient
		.from("notification_subscribers")
		.insert({
			email,
			is_active: true
		});
	if (error) {
		subscriberMessage.textContent =
			error.code === "23505"
				? "Ez az email már szerepel a listában."
				: "Nem sikerült hozzáadni.";
		subscriberMessage.className = "message error";
		return;
	}
	subscriberEmailInput.value = "";
	subscriberMessage.textContent = "Címzett hozzáadva.";
	subscriberMessage.className = "message success";
	await loadNotificationSubscribers();
});
subscribersList.addEventListener("click", async (event) => {
	const toggleButton = event.target.closest("[data-subscriber-toggle]");
	const deleteButton = event.target.closest("[data-subscriber-delete]");
	if (toggleButton) {
		const id = toggleButton.dataset
			.subscriberToggle
			.trim();
		const subscriber = releaseSubscribers.find((item) => item.id === id);
		if (!subscriber) {
			return;
		}
		await supabaseClient
			.from("notification_subscribers")
			.update({
				is_active: !subscriber.is_active
			})
			.eq("id", id);
		await loadNotificationSubscribers();
		return;
	}
	if (deleteButton) {
		const id = deleteButton.dataset
			.subscriberDelete
			.trim();
		const confirmed = confirm("Biztosan törlöd ezt a címzettet?");
		if (!confirmed) {
			return;
		}
		await supabaseClient
			.from("notification_subscribers")
			.delete()
			.eq("id", id);
		await loadNotificationSubscribers();
	}
});
sendTestReleaseButton.addEventListener("click", () => {
	sendReleaseEmail(true);
});
sendReleaseButton.addEventListener("click", () => {
	sendReleaseEmail(false);
});
findLocationButton.addEventListener("click", findLocationByAddress);
function updateMapFromCoordinateInputs() {
	const latitude = Number(latitudeInput.value);
	const longitude = Number(longitudeInput.value);
	if (Number.isFinite(latitude) &&
		Number.isFinite(longitude) &&
		latitude >= -90 &&
		latitude <= 90 &&
		longitude >= -180 &&
		longitude <= 180) {
		updateAdminMapPosition(latitude, longitude, true);
	}
}
latitudeInput.addEventListener("change", updateMapFromCoordinateInputs);
longitudeInput.addEventListener("change", updateMapFromCoordinateInputs);
placeForm.addEventListener("submit", savePlace);
clearFormButton.addEventListener("click", () => {
	resetPlaceForm();
	showSaveMessage("");
	placeNameInput.focus();
});
cancelEditButton.addEventListener("click", () => {
	resetPlaceForm();
	showSaveMessage("A szerkesztés megszakítva.");
	placeNameInput.focus();
});
placesSearchInput.addEventListener("input", renderAdminPlaces);
refreshPlacesButton.addEventListener("click", loadAdminPlaces);
placesList.addEventListener("click", async (event) => {
	const editButton = event.target.closest("[data-edit-place-id]");
	if (editButton) {
		const placeId = Number(editButton.dataset.editPlaceId);
		startEditingPlace(placeId);
		return;
	}
	const deleteButton = event.target.closest("[data-delete-place-id]");
	if (!deleteButton) {
		return;
	}
	const placeId = Number(deleteButton.dataset.deletePlaceId);
	const placeName = deleteButton.dataset.placeName ||
		"Ismeretlen hely";
	await deletePlace(placeId, placeName);
});
imageFileInput.addEventListener("change", () => {
	const file = imageFileInput.files?.[0];
	imageMessage.textContent = "";
	if (!file) {
		showImagePreview(imageUrlInput.value.trim());
		return;
	}
	if (!file.type.startsWith("image/")) {
		imageMessage.textContent = "A kiválasztott fájl nem kép.";
		imageMessage.style.color = "#f87171";
		imageFileInput.value = "";
		return;
	}
	removeExistingImageOnSave = false;
	const temporaryUrl = URL.createObjectURL(file);
	showImagePreview(temporaryUrl);
	imageMessage.textContent = `Kiválasztva: ${file.name}`;
	imageMessage.style.color = "#4ade80";
});
imageUrlInput.addEventListener("change", () => {
	if (imageFileInput.files?.length) {
		return;
	}
	const imageUrl = imageUrlInput.value.trim();
	if (imageUrl) {
		removeExistingImageOnSave = false;
	}
	showImagePreview(imageUrl);
});
removeSelectedImageButton.addEventListener("click", clearImageSelection);

// Init
checkCurrentUser();
