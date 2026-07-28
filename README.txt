INTERAKTÍV TÉRKÉP – PROTOTÍPUS

INDÍTÁS
1. Csomagold ki a ZIP fájlt.
2. Nyisd meg az index.html fájlt Google Chrome-ban vagy más böngészőben.
3. Internetkapcsolat szükséges a térképi háttér és a Leaflet betöltéséhez.

MIT TUD EZ A VÁLTOZAT?
- Magyarországról induló, de szabadon mozgatható világtérkép
- Egérrel húzható térkép
- Görgővel nagyítás és kicsinyítés
- Kattintható nevezetességek
- Jobb oldali részletes adatlap
- Több kategória helyenként
- Több kategória egyidejű kiválasztása
- Szűrők törlése

MINTAHELYEK MÓDOSÍTÁSA
A script.js fájl tetején található a places lista.
Itt új helyeket is hozzáadhatsz a következő mezőkkel:

{
    id: 5,
    name: "Hely neve",
    address: "Pontos cím",
    latitude: 47.0000,
    longitude: 19.0000,
    website: "https://...",
    description: "Leírás",
    ticketInfo: "Jegyárak",
    openingHours: "Nyitvatartás",
    categories: ["Kategória 1", "Kategória 2"],
    image: "assets/kep.svg"
}

KÖVETKEZŐ FEJLESZTÉSI LÉPÉS
- adminisztrátori szerkesztőfelület
- új hely felvétele űrlappal
- cím alapján koordinátakeresés
- online adatbázis
- csak az admin szerkeszthet


JAVÍTÁS
A korábbi változatban a Leaflet CSS integritás-ellenőrzése miatt egyes
böngészők blokkolhatták a stíluslap betöltését. Emiatt a térképcsempék
szétszórva jelentek meg. A javított változat jsDelivr CDN-ről tölti be
a Leaflet CSS- és JavaScript-fájljait integritáskorlátozás nélkül.
