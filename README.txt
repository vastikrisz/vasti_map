Vasti Map
=========

Publikus térkép: index.html
Adminfelület: admin.html

Fő funkciók
-----------
- kategória- és ár szerinti szűrés
- kereső és lista nézet
- mobil és asztali térképes felület
- havi eseményajánló
- éves, hónap-alapú események
- havi szabály szerint számolt események
- eseményhez kapcsolható rejtett eseményhelyszínek
- adminos hely- és eseménykezelés
- verzióértesítő email rendszer

Supabase
--------
A frissített supabase-events.sql egyszeri futtatása szükséges az eseményrendszer új mezőihez és az eseményhelyszínekhez. A fájl meglévő events tábla esetén migrációként is futtatható.

Eseményrendszer v3:
- Az eseményekhez külön kép tölthető fel; ez csak az esemény részleteinek megnyitásakor látszik.
- Az eseményre kattintva eseményspecifikus adatlap nyílik meg, nem a kapcsolt hely normál adatlapja.
- Új eseményhelyszín felvételekor külön Leaflet térképes pozíció-előnézet használható.
- A frissített supabase-events.sql fájlt a meglévő projektben is újra le kell futtatni az eseménykép mezők hozzáadásához.

Új belépési funkciók:
- A helyek külön "Ingyenesen látogatható" jelölést kaphatnak az adminban.
- A publikus térképen és listában külön Ingyenes szűrő használható a kategóriákkal együtt.
- A múzeumhoz kapcsolt események a jegyinformációnál ingyenes látogatási alkalomként jelennek meg.
- A havi szabályos események aktuális havi dátumát a rendszer automatikusan kiszámolja.

UI frissítés:
- Mobilon külön Lista / Szűrők / Események panelek.
- Landscape nézetben kompakt oldalsó panelek és dinamikus fejléc.
- Desktopon felső sávba integrált kategóriaszűrők.
- Szélesebb desktop lista és nagyobb hely-képek.
