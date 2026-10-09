# Sources & Media Attribution

Imperium Archive is an unofficial fan project. This file records the main external references used by the current build.

## Cartography

### Jambonium — Warhammer 40K Interactive Map
- Interactive map: https://jambonium.co.uk/40kmap/
- Project/blog: https://jambonium.co.uk/horus-heresy-map-project/
- 2025 update: https://jambonium.co.uk/2025/03/40k-map-update/
- 2022 interface screenshot used only as an optional source preview: https://jambonium.co.uk/wp-content/uploads/2022/01/40kmap-v6-1024x494.png

The Imperium Archive map is a separate implementation. Jambonium is credited as a major cartographic and interaction reference, especially for map eras, filters/layers, confidence of placement, search, incursions and timeline concepts.

## Encyclopedic lore references

- Lexicanum: https://wh40k.lexicanum.com/
- Warhammer 40K Wiki / Fandom: https://warhammer40k.fandom.com/
- Warhammer Community: https://www.warhammer-community.com/
- Warhammer: https://www.warhammer.com/
- Black Library: https://www.blacklibrary.com/

Each lore record also contains its own source links when available.

## Dynamically loaded source images

For records with a Lexicanum article, the frontend can request the page image through the Lexicanum MediaWiki API. The image is not presented as original Imperium Archive artwork: the gallery labels it as an external source and links back to the relevant article.

Explicit source-media mappings currently include:

### Roboute Guilliman
- Source page: https://wh40k.lexicanum.com/mediawiki/index.php?title=File:Resurrected_Roboute_Guilliman.jpg
- Image URL: https://wh40k.lexicanum.com/mediawiki/images/c/ce/Resurrected_Roboute_Guilliman.jpg

### Cadia / Cadian forces
- Source page: https://wh40k.lexicanum.com/mediawiki/index.php?title=File:Cadians9th3.jpg
- Image URL: https://wh40k.lexicanum.com/mediawiki/images/7/73/Cadians9th3.jpg

### Luna Wolves / Sons of Horus
- Source page: https://wh40k.lexicanum.com/mediawiki/index.php?title=File:Lunawolveslegion.jpg
- Image URL: https://wh40k.lexicanum.com/mediawiki/images/9/9c/Lunawolveslegion.jpg
- The Lexicanum file page credits the artwork to Phillip Sibbering.

## Local project artwork

Files in `public/assets` such as `galaxy-atlas.webp`, `lion-hero.webp`, `horus-hero.webp`, `sanguinius-hero.webp`, `trazyn-hero.webp`, `guilliman-hero.jpg`, and the existing atmospheric backdrops are local concept illustrations used for this prototype.

Warhammer 40,000, its characters, factions, names, logos, official miniatures and official imagery are the intellectual property of Games Workshop and/or their respective rights holders. The project is not official and is not affiliated with Games Workshop.


## Space Marine Chapters / Foundings research

The chapter expansion uses these reference hubs as indexes and fact-checking starting points:

- Lexicanum — Space Marine Forces / Chapters list: https://wh40k.lexicanum.com/wiki/Chapters_list
- Lexicanum — Founding: https://wh40k.lexicanum.com/wiki/Founding
- Lexicanum — Space Marine Legion / Second Founding overview: https://wh40k.lexicanum.com/wiki/Legion_%28Space_Marines%29
- Lexicanum — pictorial chapter lists: https://wh40k.lexicanum.com/mediawiki/index.php?title=Pictorial_List_of_Space_Marine_Chapters_A-L
- Warhammer Community — Space Marine Chapters faction focus: https://www.warhammer-community.com/en-gb/articles/qWz90QUl/warhammer-40000-faction-focus-space-marine-chapters/
- Warhammer Community — Codex Space Marines / Chapter Tactics overview: https://www.warhammer-community.com/en-gb/articles/almtylr8/a-new-chapter-of-codex-space-marines/

Exact chapter articles are also linked from each individual dossier. The archive intentionally marks unknown or disputed Foundings as unknown rather than converting fan assumptions into canon.

## Gallery loading

Version 5 adds `/api/wiki-gallery`, which asks the Lexicanum MediaWiki API for images attached to the exact article being viewed. The frontend labels those images as external material and links to the file/source page. Local generated artwork remains the visual fallback and the primary UI background layer.

## Runtime media sources (V8)

The project does **not** bundle wiki artwork into the archive. When the user runs the site with internet access, relevant page images and gallery images may be requested at runtime from:

- Warhammer 40k Wiki / Fandom — https://warhammer40k.fandom.com/
- Lexicanum — https://wh40k.lexicanum.com/

The page itself keeps a visible source link/credit. The local Node server proxies image bytes to avoid browser hotlink/referrer failures. If a remote image is unavailable, the interface falls back to local thematic artwork.

## Reading references

Reading recommendations are built around Black Library titles and are intended as navigation, not reproduction of book text:

- Black Library — https://www.blacklibrary.com/
- Official Warhammer / Warhammer Community material is preferred for current-era product/lore verification when available.

## Cartography

- Jambonium Warhammer 40K Interactive Map — https://jambonium.co.uk/40kmap/

Imperium Archive uses Jambonium as an explicit external UX/cartography reference. Campaign lines in V8 are labelled as schematic navigation aids rather than exact canonical flight paths.

## CODEX V9 source strategy

V9 deliberately separates **text**, **navigation data** and **media**:

- Lore text is an original Russian-language summary written for Imperium Archive, not copied from wiki articles or Black Library books.
- Exact images are requested at runtime from the corresponding Warhammer 40k Wiki / Fandom and Lexicanum records, then shown with a visible source link.
- Black Library titles are listed as reading recommendations only; book text is not reproduced.
- Short slogans/phrases are used only as small thematic markers, not as a substitute for the original works.
- The galactic map remains an original schematic interface informed by Jambonium and published 40K cartography. It does not claim astronomical precision.

Main external reference hubs:
- Warhammer 40,000 Wiki / Fandom: https://warhammer40k.fandom.com/
- Lexicanum: https://wh40k.lexicanum.com/
- Black Library: https://www.blacklibrary.com/
- Warhammer Community: https://www.warhammer-community.com/
- Jambonium 40K Map: https://jambonium.co.uk/40kmap/

## CODEX V10 — primarch / legion verification

Для V10 дополнительно использовались официальные и справочные страницы при проверке структуры чтения, флагманов и вооружения:

- Black Library — Primarchs series: https://www.blacklibrary.com/series/primarchs_
- Black Library — The Horus Heresy: https://www.blacklibrary.com/the-horus-heresy
- Warhammer Community — Lion El’Jonson returns: https://www.warhammer-community.com/en-gb/articles/7su4GFZe/lion-eljonson-primarch-of-the-dark-angels-returns-to-warhammer-40000/
- Warhammer Community — loyalist Primarchs in modern 40K: https://www.warhammer-community.com/en-gb/articles/o8hfXHxy/40-years-of-warhammer-the-first-loyalist-primarch-in-warhammer-40000/
- Lexicanum — Fist of Iron: https://wh40k.lexicanum.com/wiki/Fist_of_Iron_%28battleship%29
- Lexicanum — Swordstorm: https://wh40k.lexicanum.com/wiki/Swordstorm
- Lexicanum — Shadow of the Emperor: https://wh40k.lexicanum.com/wiki/Shadow_of_the_Emperor
- Lexicanum — Flamewrought: https://wh40k.lexicanum.com/wiki/Flamewrought_%28Great_Crusade%29
- Lexicanum — Blade of Ahn-Nunurta: https://wh40k.lexicanum.com/wiki/Blade_of_Ahn-Nunurta
- Lexicanum — Leman Russ: https://wh40k.lexicanum.com/wiki/Leman_Russ_%28Primarch%29
- Lexicanum — Corvus Corax: https://wh40k.lexicanum.com/wiki/Corvus_Corax
- Lexicanum — Alpha / Beta: https://wh40k.lexicanum.com/wiki/Alpha and https://wh40k.lexicanum.com/wiki/Beta

V10 продолжает правило проекта: факты пересказываются своими словами; внешние изображения подгружаются в рантайме с видимым источником и не упаковываются в архив как официальные ассеты.


## CODEX V11 — search, media ranking and deep faction pass

V11 сохраняет прежнюю модель источников и усиливает две вещи:

1. **Медиа выбирается по релевантности.** Сервер ранжирует файлы Wiki/Fandom по совпадению с названием сущности и предпочитает artwork / illustration / portrait; логотипы, иконки, миниатюры и продуктовые фотографии понижаются.
2. **Текст остаётся авторской сводкой.** Дополнительные слои по Империуму, Астартес, Механикус, Инквизиции, Некронам, Тиранидам, Т’ау, Оркам и ключевым орденам не копируют энциклопедические статьи, а пересобирают факты в русскоязычный навигационный материал.

Используемые хабы:
- Warhammer 40,000 Wiki / Fandom — https://warhammer40k.fandom.com/
- Warhammer 40,000 Wiki RU — https://warhammer40k.fandom.com/ru/wiki/Warhammer_40,000_Wiki
- Lexicanum — https://wh40k.lexicanum.com/
- Black Library — https://www.blacklibrary.com/
- Warhammer Community — https://www.warhammer-community.com/
- Jambonium 40K Map — https://jambonium.co.uk/40kmap/

Поиск V11 индексирует не внешние страницы в реальном времени, а уже встроенную базу Imperium Archive: названия, описания, связи, историю, книги и структурированные досье.

## V12 media/source policy
V12 no longer treats the project as a closed three-source archive. An article may expose images from any public source explicitly listed in its source metadata. The local Node server reads the page's OpenGraph preview when available, then displays that image inside the site's own gallery. Clicking an image opens the local lightbox; leaving Imperium Archive only happens through the clearly labelled “Источник ↗” link.

Primary discovery/reference families currently used include:
- Warhammer Community — official articles, faction/features and campaign material.
- Black Library — novel/series pages and reading-order context.
- Warhammer 40k Wiki / Fandom — broad article coverage and page galleries.
- Lexicanum — cross-checking, references and image/article discovery.
- Jambonium 40K Map — cartographic UX/reference methodology.

External art is not repackaged as project-owned content. The visible source/domain remains attached to the gallery item. If a source blocks hotlinking or preview access, Imperium Archive falls back to its local visual reserve rather than presenting a broken image.

## CODEX V13 — video and chronology references

The chronology is an original Russian-language synthesis. Video sources are treated as **secondary explanatory material**, not as primary canon. Their wording/transcripts are not copied; the site only links to them and provides short original summaries.

### English-language video references
- Luetin09 — *The Emperor of Man [1] The Rise of Humanity*: https://www.youtube.com/watch?v=KyPjE1Sn-Ts
  - useful overview of ancient human history, the Dark Age of Technology, Age of Strife, Unification and the Great Crusade.
- Luetin09 — *The Emperor of Man [2] Heresy & The Imperium*: https://www.youtube.com/watch?v=2F3y2bJzDJQ
  - overview of the Horus Heresy, Battle/Siege of Terra, Great Scouring and later Imperial structure.
- Arbitor Ian — *The entire HORUS HERESY TIMELINE in 40 Mins!*: https://www.youtube.com/watch?v=9pRh-yKziY8
  - concise visual chronology of the Heresy and its major campaigns.

### Russian-language video references
- Экспедиция Альфария — *Ересь Хоруса | Основы Warhammer 40000. ч.6. Хронология. 8 лет Ереси*: https://www.youtube.com/watch?v=Fr8XbaNyZ9g
  - Russian overview used as a supplementary beginner route through the Heresy.
- WISH HAMMER — *WARHAMMER 40 000 — ВСЁ, ЧТО НУЖНО ЗНАТЬ*: https://www.youtube.com/watch?v=EJsKS7vMeFA
  - long Russian overview covering the Imperium, armies, Chaos, xenos and broad setting history.

### Notes on translation
- English-source summaries in the Russian interface are **our own Russian paraphrases**.
- Full transcripts are not reproduced.
- If a claim conflicts with a current Codex, campaign book, Black Library novel, or Games Workshop publication, the primary/official publication takes precedence.
