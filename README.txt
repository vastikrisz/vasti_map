VASTI MAP

INDÍTÁS
1. Nyisd meg a projektet VS Code-ban.
2. Indítsd el Live Serverrel az index.html fájlt.
3. Az adminfelület az admin.html oldalon érhető el.
4. Internetkapcsolat szükséges a Leaflet, Supabase és Quill betöltéséhez.

FŐ FÁJLOK
- index.html      Nyilvános térkép
- style.css       Nyilvános felület stílusai
- script.js       Térkép, szűrés, keresés és mobil adatlap
- admin.html      Adminfelület
- admin.css       Adminfelület stílusai
- admin.js        Helykezelés és verzióértesítések
- config.js       Supabase kliens beállítása
- assets/         Helyi grafikai elemek

FUNKCIÓK
- Supabase-alapú helyadatbázis
- kategória- és ár szerinti szűrés
- keresés és marker clustering
- reszponzív mobil/asztali felület
- adminos helyfelvétel, szerkesztés és törlés
- cím alapú koordinátakeresés
- képfeltöltés Supabase Storage-ba
- verzióértesítő email szerkesztő és előnézet
- címzettkezelés és próbaküldés
- automatikus verzióléptetés

MEGJEGYZÉS
A publikus Supabase kulcs kliensoldali használatra szolgál. Az admin műveleteket
Supabase Auth, RLS szabályok és szerveroldali funkciók védik.
