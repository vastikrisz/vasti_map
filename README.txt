VASTI MAP
=========

Publikus térkép:
- index.html
- style.css
- script.js

Admin:
- admin.html
- admin.css
- admin.js

Beállítás:
- config.js tartalmazza a Supabase kliens publikus konfigurációját.
- Az eseményrendszer első használata előtt futtasd a Supabase SQL Editorban a supabase-events.sql fájlt.

Fő publikus funkciók:
- modern kategória-markerek és cluster jelölők
- keresés és kategória/ár szűrés
- mobil seamless oldalsó menü
- mobil és desktop lista nézet
- havi eseményajánló
- eseményhez kapcsolt hely ideiglenes térképes kiemelése
- mobil portrait bottom sheet
- külön mobil landscape elrendezés
- desktop oldalsó adatlap
- képnagyító lightbox
- automatikus verziószám

Esemény ismétlődés:
- Egyszeri: a kezdő és opcionális záró dátum tényleges dátum.
- Évente: a minta dátum hónapja és napja ismétlődik évente.
- Havonta: a minta dátum napja ismétlődik minden hónapban.

Későbbre hagyott funkciók:
- útvonaltervező
- valódi távolság
- kedvencek / meglátogatott helyek
- közvetlen helylinkek
- közeli helyek
- random „Hova menjünk?” funkció
