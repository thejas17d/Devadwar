# Devadwar: Research Notes for Future Digital Devotional Categories

**Prepared:** 2026-11-24. All sources were accessed on that date.
**Scope:** Background research for an independent digital devotional website. The site is **not affiliated with any temple**. It sells symbolic digital experiences: Digital Darshan ₹10, Darshan + Digital Aarti ₹20 and Interactive Digital Aarti ₹30.
**Method:** I checked official temple sites first, then government sources, encyclopaedias (Britannica and Wikipedia, each with its own citations) and established law-firm or academic commentary. Inline citations look like [n] and point to the **Sources** list at the end. Anything I could not verify is marked **[UNVERIFIED]**.

> **Guiding principle for every category below:** A Devadwar experience is a *personal, symbolic, self-guided act of devotion on a screen*. It is never a ritual performed by a priest, never "performed on your behalf", never a temple seva, and never a guarantee of blessings or results.

---

## 0. Source-access notes (read first)

| Source | Status |
|---|---|
| TTD daily sevas page, tirumala.org [1] | Loaded. It gives the seva sequence and timings but almost no description of the rituals. |
| TTD Kalyanotsavam page [2] | Loaded. It only lists "Kalyanotsavam" in the schedule and has no description. |
| Siddhivinayak pooja details [3] | Loaded. It lists pooja types, reporting times and durations. I deliberately did not record prices. |
| Shri Saibaba Sansthan portal (online.sai.org.in) [5] | **FAILED (HTTP 403).** sai.org.in also returned 403. Shirdi aarti names and times below come from secondary sources only and are **[UNVERIFIED against the official site]**. |
| Britannica article pages [7–13] | **Direct fetch FAILED (HTTP 403).** Britannica content below comes from search-engine extracts of those pages. Re-check the wording in a browser before quoting it. |
| DoPT 2027 holiday OM [27] | dopt.gov.in did not appear in search. I verified the text from the Department of Posts' official forwarding copy of the same OM, which includes the full annexures. |
| Drik Panchang [29–31] | The Diwali and Hanuman Jayanti 2027 pages loaded. The Navratri 2027 page returned 404, so its date comes from a search extract only. |

---

## 1. Practices: tradition, how temples offer them, and a respectful digital interpretation

### 1.1 Darshan (दर्शन)
- **Tradition:** *Darśan* means "seeing". In Hindu worship it means seeing the deity and being seen by the deity in the consecrated image (murti). Diana Eck's academic study, *Darśan: Seeing the Divine Image in India*, is the standard reference on this visual emphasis in Hindu devotion [26]. Britannica treats seeing the deity as a key part of temple worship and notes that darshan queues can be very long on festival days [9].
- **How temples offer it:** Temples administer darshan through free queues and paid or timed entry. Temple trusts set and publish these arrangements. TTD runs some darshan quotas linked to its own *virtual* seva bookings [42].
- **Digital interpretation:** A calm, full-screen view of a **generic, artist-made or licensed deity image that is not identified as any temple's murti**, with ambient sound and a few lines of reflection. Use wording such as "a moment of digital darshan for personal prayer". Never say "live darshan of [temple]" or use temple photographs without a licence (see §4).

### 1.2 Aarti (आरती)
- **Tradition:** Britannica describes arti as the waving of lit lamps before an image of a god, or before a person being honoured. The worshipper circles the lamp **three times clockwise** while chanting a prayer or singing a hymn, and the flame burns **ghee or camphor** [7]. Britannica also says that after the prayer, priests carry the flame to devotees, who pass their hands over it and then touch their eyes [7]. The Wikipedia article, which cites its sources, adds that the lamp is usually brass with a cotton wick soaked in camphor, ghee or oil. The aarti plate may also hold flowers, incense and *akshata* (rice), and the word *aarti* also means the hymn sung during the offering [14]. Depending on the tradition, a temple may perform aarti up to eight times a day [14].
- **Typical structure (for UI design):** (1) light the lamp; (2) ring a bell and sing or chant the aarti hymn; (3) circle the lamp clockwise in front of the deity, starting with the feet and moving up; (4) offer the flame to the devotees; (5) devotees pass their palms over the flame and touch their eyes or forehead [7][14].
  - **Bells (ghanta)** are widely rung during aarti. **[UNVERIFIED: none of the sources I consulted describes bells in Hindu aarti specifically.]**
  - **Pancha-arati** usually means aarti with a five-wick lamp. In some regional and Agamic traditions it means a sequence of five offerings. **[UNVERIFIED: none of the encyclopaedic sources I consulted defines it. Confirm with a priest or a published manual before naming a feature after it.]**
  - The foot-to-head circling order is a common practice. **[UNVERIFIED in the cited sources.]**
- **Temple examples:** Shirdi is widely reported to hold four daily aartis: *Kakad* (pre-dawn), *Madhyan* (noon), *Dhoop* (sunset) and *Shej* (night) [6]. **[UNVERIFIED: the official site was unreachable.]** Siddhivinayak's official site lists early-morning and night (*Shej*) aartis, but its schedule page appears to be old [4].
- **Digital interpretation:** This is the current ₹20/₹30 product. The user drags or taps a diya in a clockwise circle, can tap a bell, and sees a camphor-style flame animation. The hymn text is shown on screen. Label it "symbolic digital aarti". Do not show a priest or anything that suggests the flame or prayer is carried to a real shrine.

### 1.3 Abhishek (अभिषेक)
- **Tradition:** Liquid offerings are poured over the murti while mantras are chanted. The liquids include milk, yogurt, ghee, honey, *panchamrita*, sesame oil, rose water and sandalwood paste, and they vary with the type of abhishek. The rite is part of daily temple worship and symbolises purification. Many temples alternate it with food offerings, aarti and bhajans [15]. *Rudrābhiṣeka* is the abhishek of Shiva performed on the lingam [15].
- **How temples offer it:** Priests perform it as a scheduled temple service. Siddhivinayak, for example, lists *Panchamrut* and *Shodashopachar* poojas among its official bookable poojas [3].
- **Digital interpretation:** "Abhishek visualisation": an animation of offerings poured over a stylised Shiva lingam or a generic murti, one liquid per tap, each shown with its name and a short line on what it symbolises. Avoid "book an abhishek" wording. Never imply that real milk or ghee is offered anywhere.

### 1.4 Archana (अर्चना) and Sahasranama / Ashtottara (108 names)
- **Tradition:** In archana, the divine is worshipped by repeating the deity's names. A *sahasranama* is a stotra of 1,000 names. Examples are the **Vishnu Sahasranama** in the Mahabharata (Anushasana Parva 13.135) and the **Lalita Sahasranama** in the Brahmanda Purana. Shorter lists of **108 names** are called *aṣṭottara-śata-nāmāvali*, and 108 is treated as a sacred number [16].
- **How temples offer it:** TTD's day begins with Suprabhatam, then **Thomala**, then a **"Sahasranama Archana"** in the early morning [1]. Siddhivinayak lists a *Sahastra Namavali* pooja and *Sahasranam* mahapoojas among its official services [3].
- **Digital interpretation:** "108 Names" reader: one name per screen with the Devanagari, a transliteration and a short meaning. The user taps a virtual flower or petal for each name, a progress ring fills up, and the session ends with a moment of silence. Public-domain name lists are safe to use, but check every transliteration against a printed edition.

### 1.5 Suprabhatam (सुप्रभातम्)
- **Tradition:** A pre-dawn hymn that wakes the deity. The **Sri Venkatesa Suprabhatam** at Tirumala is attributed to **Prativadi Bhayankaram Annangaracharya**. It has about 70 ślokas in four parts. Sources date it differently: Wikipedia gives the 13th century, while other accounts place it later [19]. **[Dating UNVERIFIED.]**
- **How temples offer it:** At Tirumala, Suprabhatam is the **first arjitha seva of the day, 03:00–03:30** [1].
- **Digital interpretation:** "Morning Awakening": a dawn-themed screen with the public-domain text, line by line, and a soft sunrise animation. Do **not** call it "Suprabhatam Seva". Do not use TTD's name, timings or famous recordings. The well-known commercial recordings are under copyright (see §3 note).

### 1.6 Mantra-japa (मन्त्र-जप)
- **Tradition:** Japa is the meditative repetition of a mantra, often counted on a mala [17].
- **Digital interpretation:** A "Japa session" with a chosen public-domain mantra, haptic feedback for each count, and a gentle chime at 108. Text and counting only. Any audio must be self-recorded or licensed.

### 1.7 Naam-japa (नाम-जप) and 108-bead mala counting
- **Tradition:** A standard japamala has **108 beads plus a 109th "guru" (meru) bead that is not counted** [17]. A common taboo is **not crossing the guru bead**: each round starts and ends next to it, and the mala is turned around for the next round [17]. Hindu hand positions vary (for example, over the right index or middle finger), but the cited article does not source these details [17]. **[Finger technique UNVERIFIED.]**
- **Digital interpretation:** A digital mala that reverses direction at the guru bead and does not wrap past it. This mirrors the taboo, which devotees will notice and appreciate. Add a round counter and an optional daily streak. Keep streaks gentle: no guilt messages and no "your blessings will lapse" (see dark patterns, §5).

### 1.8 Satyanarayan Puja (सत्यनारायण पूजा)
- **Tradition:** Worship of **Satyanārāyaṇa, a form of Vishnu**. The rite appears in the *Bhaviṣya Purāṇa* and in the *Revā Khaṇḍa* of the *Skanda Purāṇa*, which scholars often view as a later addition. Offerings include plantains, ghee, milk, wheat flour and jaggery, and the rite centres on hearing the *katha* (the recited stories) [18]. It is commonly held on full-moon days and at household occasions. **[UNVERIFIED in the cited source.]**
- **How temples offer it:** Siddhivinayak lists a **Shree Satyanarayan Mahapooja** (about 2 hours, on set weekdays) as an official priest-performed pooja [3].
- **Digital interpretation:** "Satyanarayan Katha reading": an illustrated, chaptered telling of the katha written in the site's own words or translated from a public-domain edition, with a short reflection after each chapter. Present it as *reading or listening to the katha*, not as "performing the puja".

### 1.9 Kalyanotsavam (कल्याणोत्सवम्)
- **Tradition:** The ritual celebration of the **divine wedding**. At Tirumala it celebrates **Venkateswara (Srinivasa) and Padmavati** and is performed for the **processional deity (Malayappa)** [19].
- **How temples offer it:** TTD schedules Kalyanotsavam in the 12:00–17:00 slot alongside other processional sevas [1][2]. **TTD itself has offered "virtual" (online-participation) Kalyanotsavam since August 2020** [42]. This matters a great deal: a Devadwar "digital Kalyanotsavam" could easily be mistaken for TTD's official virtual seva.
- **Digital interpretation:** **High risk. Recommend not building it, or building it only as an educational story.** If built, use a narrative such as "The Story of Srinivasa and Padmavati" with original illustrations. Avoid the word "Kalyanotsavam" in product names, and never sell it as a booking or a participation.

### 1.10 Festival worship (2027)

All 2027 dates below come from the **DoPT Office Memorandum F. No. 12/2/2023-JCA dated 16.07.2026** (central government holidays for 2027), checked against the Department of Posts' official copy of the full OM and annexures [27][28], unless another source is cited. Regional observance often differs by a day, so always show users a "dates vary by region and panchang" note.

| Festival | What it centres on | 2027 date | Source |
|---|---|---|---|
| **Maha Shivaratri** | Shiva's great night, on the 14th day of the dark fortnight in Feb/Mar. It is observed with fasting and night vigil [13]. | **Sat 6 Mar 2027** (Restricted Holiday) | [27] |
| **Ram Navami** | Rama's birth on Chaitra Shukla Navami, the last day of the spring (Chaitra) Navratri [13]. | **Thu 15 Apr 2027** (Gazetted) | [27] |
| Chaitra Navratri | Its 1st day is listed. | **Wed 7 Apr 2027** (RH, "1st Navratra") | [27] |
| **Hanuman Jayanti** | Hanuman's birth, observed in North India on Chaitra Purnima. The date differs by region: Tamil Nadu observes it in Margashirsha, Karnataka has its own date, and Andhra Pradesh and Telangana keep a 41-day observance [30]. | **Tue 20 Apr 2027** (New Delhi, Chaitra Purnima) | Drik Panchang [30]. Not in the DoPT list. **Regional dates must be confirmed.** |
| **Janmashtami** | Krishna's birth on the 8th day of the dark fortnight. Midnight worship is customary. | **Wed 25 Aug 2027** ("Janmashtami (Vaishnav)", Gazetted). Smarta observance may fall a day earlier. **[Confirm.]** | [27] |
| **Ganesh Chaturthi** | Ganesha's festival on Bhadrapada Shukla Chaturthi. It includes *prana pratishtha* of the image and *shodashopachara* (16-fold) worship [11]. | **Sat 4 Sep 2027** (RH) | [27]. The visarjan / Anant Chaturdashi date is **not verified**. |
| **Sharad Navratri / Durga Puja** | Nine nights honouring the Goddess (Durga in her forms) in Ashvina [13]. | Starts about **Thu 30 Sep 2027** (Ghatasthapana) [31]. DoPT lists Saptami **6 Oct**, Mahashtami **7 Oct**, Mahanavami **8 Oct** (RH) and **Dussehra / Vijayadashami Sat 9 Oct 2027** (Gazetted) [27]. | The start date comes from a Drik Panchang search extract only. **[Confirm.]** |
| **Diwali** | The new-moon festival of lamps. Lamps are lit to welcome **Lakshmi**, and Lakshmi Puja falls on the main new-moon day [12]. | **Fri 29 Oct 2027** (Gazetted). Drik Panchang (New Delhi) gives Dhanteras 27 Oct, Naraka Chaturdashi 28 Oct, **Lakshmi Puja 29 Oct**, Govardhan Puja 30 Oct and Bhai Dooj 31 Oct [29]. The DoPT OM notes that some states observe Naraka Chaturdashi instead [27]. | [27][29] |
| Basant Panchami (Saraswati) | Worship of Saraswati. | **Thu 11 Feb 2027** (RH) | [27] |

- **How temples offer festival worship:** Temples hold special abhishekas, alankaras, processions and extended darshan, all administered by the trust. Siddhivinayak, for example, holds special Atharvashirsha recitations on Sankashti and Vinayaki Chaturthi [3].
- **Digital interpretation:** Seasonal "festival packs" such as a Diwali digital diya-lighting, a Navratri nine-day reflection series (one form of the Goddess per day), a Shivaratri four-*prahar* night-vigil timer, Janmashtami midnight "cradle" (jhula) animation, and a Ganesh Chaturthi 10-day modak-offering animation that ends in a respectful farewell (visarjan). Each pack should show "dates per [source]; check your local panchang".

### 1.11 Guided devotional reflection
- **Tradition:** Reading or listening to sacred texts and contemplating them (*svadhyaya*, *katha*, *satsang*) is part of devotional life in every sampradaya.
- **Digital interpretation:** This is the **safest and most scalable category**. Offer 3–7-minute guided reflections written by the site (for example on a Gita verse or a line from a stotra), with breathing cues, an optional journal and a closing aarti animation. Make clear that this is reflection, not instruction from a guru or a religious authority.

---

## 2. Deity reference sheets

**Licensing note:** The mantras and stotras below are ancient or pre-modern texts in the public domain. **Any recording (audio or video) is a separate copyright work.** That covers famous renditions, temple broadcast audio and stock music, and each needs a licence or an original recording. Also check every Devanagari line against a printed edition before publishing. Transliterations below use IAST.

**Raga note:** I found reliable sourcing for only two deity–raga associations, Bhairav for Shiva and Hamsadhvani for Ganesha. **Do not market other "raga for deity X" claims without a musicologist's source.**

### Shiva
- **Mantra:** ॐ नमः शिवाय, *oṃ namaḥ śivāya*, "salutation to the auspicious one (Shiva)". It is the *Pañcākṣara* (five-syllable) mantra and first appears in the Śrī Rudram (Taittirīya Saṃhitā 4.5.8.1, Kṛṣṇa Yajurveda) [20].
- **Also widely used:** the Mahāmṛtyuñjaya mantra, ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥, *oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam / urvārukam iva bandhanān mṛtyor mukṣīya mā'mṛtāt*: "We worship the three-eyed one, fragrant, who nourishes; like a cucumber from its stalk, may I be freed from death, not from immortality." It is from Ṛgveda 7.59.12. **[Verse reference UNVERIFIED in this session.]**
- **Attributes:** trishula, damaru, crescent moon, Ganga in his matted hair, third eye, serpent, rudraksha, vibhuti; vahana **Nandi**. Offerings include bilva leaves, water or milk abhishek and white flowers. Monday is traditional. **[Attributes are general knowledge, not individually cited.]**
- **Raga:** **Bhairav**, an early-morning raga named after Bhairava, a form of Shiva. Its origin is disputed [24].

### Ganesha
- **Mantra:** ॐ गं गणपतये नमः, *oṃ gaṃ gaṇapataye namaḥ*, "Om, salutations to Gaṇapati". *Gaṃ* is Ganesha's bīja syllable. **[UNVERIFIED in this session, though in very wide use.]**
- **Śloka:** वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥, *vakratuṇḍa mahākāya sūryakoṭi samaprabha / nirvighnaṃ kuru me deva sarvakāryeṣu sarvadā*: "O curved-trunked, mighty-bodied one, radiant as a crore suns, make all my undertakings free of obstacles, always."
- **Texts:** The Ganapati Atharvashirsha is recited formally at Siddhivinayak [3]. The aarti "Sukhakartā Dukhahartā" is traditionally attributed to Samarth Ramdas (17th century). **[Attribution UNVERIFIED in this session.]**
- **Attributes:** elephant head, broken tusk, ankusha (goad), pasha (noose), modak; vahana **mūṣaka (mouse)**. Offerings include durva grass, red flowers (hibiscus) and modak. Chaturthi tithis are sacred to him [3][11].
- **Raga:** **Hamsadhvani**, through Muthuswami Dikshitar's "Vātāpi Gaṇapatim", which is traditionally sung at the start of many Carnatic concerts [23].

### Vishnu
- **Mantras:** ॐ नमो नारायणाय, *oṃ namo nārāyaṇāya* (the eight-syllable *aṣṭākṣara*), "Om, salutation to Nārāyaṇa". ॐ नमो भगवते वासुदेवाय, *oṃ namo bhagavate vāsudevāya* (the twelve-syllable *dvādaśākṣara*), "Om, salutation to the Lord Vāsudeva". [19] lists *Om Namo Narayanaya* in the Venkateswara infobox. **[Syllable names UNVERIFIED in this session.]**
- **Text:** the Vishnu Sahasranama (Mahabharata, Anushasana Parva) [16].
- **Attributes:** **shankha** (Pāñcajanya), **chakra** (Sudarśana), **gada** (Kaumodakī), **padma** (lotus); vahana **Garuda**; yellow garments (pītāmbara); tulsi leaves; Ekadashi. Consort Lakshmi.

### Krishna
- **Mantra:** the Hare Krishna *mahā-mantra*, हरे राम हरे राम राम राम हरे हरे। हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे॥ *Hare Rāma Hare Rāma Rāma Rāma Hare Hare / Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare*. It is first attested in the **Kali-Santaraṇa Upaniṣad** as "sixteen names" (16 words) [21]. Many devotees chant it with Krishna's names first. Both orders are in use.
- **Also:** *oṃ namo bhagavate vāsudevāya* (see Vishnu).
- **Attributes:** flute (veṇu), peacock feather, dark-blue complexion, yellow garment, cows, butter (makhan), tulsi; Janmashtami at midnight. **[General knowledge.]**
- **Aarti:** "Om Jai Jagdish Hare" (to Vishnu/Krishna) is generally attributed to Shardha Ram Phillauri (19th century), so the text is public domain. **[Attribution UNVERIFIED in this session.]**

### Hanuman
- **Text:** the **Hanuman Chalisa** by **Tulsidas** (16th century, **Awadhi**). It has 43 verses: 2 opening dohas, 40 chaupais and 1 closing doha. It is traditionally recited on **Tuesdays and Saturdays** [22]. The opening line is श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि, *śrī guru carana saroja raja nija manu mukuru sudhāri*: "With the dust of the Guru's lotus feet I cleanse the mirror of my mind." The text is public domain, but modern recordings are not.
- **Mantra:** ॐ हं हनुमते नमः, *oṃ haṃ hanumate namaḥ*. **[In wide use; UNVERIFIED against a scholarly source.]**
- **Attributes:** gada (mace), carrying the mountain (Dronagiri / Sanjeevani), sindoor-orange colour, folded-hands devotion to Rama. Offerings include sindoor with oil, and regional sweets. **[Attributes are general knowledge.]**

### Durga
- **Verse:** या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता। नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः॥ *yā devī sarvabhūteṣu śaktirūpeṇa saṃsthitā / namas tasyai namas tasyai namas tasyai namo namaḥ*: "To the Goddess who dwells in all beings in the form of power: salutation, salutation, salutation again and again." It is from the hymn in **chapter 5 of the Devī Māhātmya** (Durgā Saptaśatī, part of the Mārkaṇḍeya Purāṇa) [25]. Each verse varies the form named: intelligence, peace and so on.
- **Mantra:** ॐ दुं दुर्गायै नमः, *oṃ duṃ durgāyai namaḥ*. **[UNVERIFIED; in wide use.]**
- **Attributes:** many arms holding trishula, chakra, sword, conch, bow and lotus; vahana **lion (or tiger)**; red colour; red hibiscus; Navratri.

### Lakshmi
- **Mantra:** ॐ श्रीं महालक्ष्म्यै नमः, *oṃ śrīṃ mahālakṣmyai namaḥ*. *Śrīṃ* is Lakshmi's bīja. **[UNVERIFIED; in wide use.]**
- **Hymn:** the *Mahālakṣmī Aṣṭakam*, which opens नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते, *namaste 'stu mahāmāye śrīpīṭhe surapūjite*: "Salutations to you, great Māyā, seated on the throne of fortune, worshipped by the gods." **[Textual source UNVERIFIED.]**
- **Attributes:** seated or standing on a lotus and holding lotuses, gold coins pouring from her hand, flanked by elephants (Gaja-Lakshmi); owl as vahana in some regions; red or pink; Friday; **Lakshmi Puja on Diwali night** [12].

### Saraswati
- **Verse:** या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता। या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना॥ *yā kundendu-tuṣāra-hāra-dhavalā yā śubhra-vastrāvṛtā / yā vīṇā-vara-daṇḍa-maṇḍita-karā yā śveta-padmāsanā*: "She who is white as the jasmine, the moon, snow and a garland of pearls, clad in white, whose hands are adorned with the veena, who is seated on a white lotus…" **[Source text UNVERIFIED in this session.]**
- **Mantra:** ॐ ऐं सरस्वत्यै नमः, *oṃ aiṃ sarasvatyai namaḥ*. **[UNVERIFIED; in wide use.]**
- **Attributes:** veena, book, akshamala (rosary); vahana **swan (haṃsa)**, sometimes a peacock; white; Basant Panchami (11 Feb 2027 [27]).

### Rama
- **Mantra:** श्रीराम जय राम जय जय राम, *śrī rāma jaya rāma jaya jaya rāma* (the 13-syllable *trayodaśākṣarī* mantra). **[UNVERIFIED in this session.]**
- **Verse:** श्रीराम राम रामेति रमे रामे मनोरमे। सहस्रनाम तत्तुल्यं रामनाम वरानने॥ *śrī rāma rāma rāmeti rame rāme manorame / sahasranāma tat tulyaṃ rāmanāma varānane*: "Saying 'Rāma, Rāma, Rāma', I delight in Rāma, O beautiful one; the name of Rāma equals the thousand names." It is commonly recited at the close of the Vishnu Sahasranama. **[UNVERIFIED in this session.]**
- **Attributes:** bow (Kodaṇḍa) and arrows; shown with Sita, Lakshmana and Hanuman; dark complexion; Ayodhya; Ram Navami [13].

### Venkateswara (Srinivasa, Balaji, Govinda)
- **Mantra:** ॐ नमो वेङ्कटेशाय, *oṃ namo veṅkaṭeśāya*, "Om, salutation to the Lord of Venkata". Wikipedia's claim for this mantra is tagged "citation needed" [19]. The name **Govinda** ("protector of cows") is chanted widely, as in "Govinda, Govinda" [19].
- **Suprabhatam opening:** कौसल्या सुप्रजा राम पूर्वा सन्ध्या प्रवर्तते, *kausalyā suprajā rāma pūrvā sandhyā pravartate*: "O Rāma, noble son of Kausalyā, the eastern dawn is breaking." The line is from the Valmiki Ramayana. **[Verse reference UNVERIFIED in this session.]**
- **Iconography:** a standing four-armed form on a lotus base. The upper hands hold the **shankha and chakra**, and the lower hands are in **varada** and **kati** postures. The consorts are **Padmavati and Bhudevi**, and the vahana is **Garuda** [19].
- **Caution:** Do not reproduce the Tirumala murti, the TTD logo, "Srivari" branding or Tirupati laddu imagery (see §4).

---

## 3. Temple tariffs: deliberately not copied

Official sevas are **priest-performed, temple-administered services, priced and capped by each temple trust**. Examples are TTD arjitha sevas, Siddhivinayak's listed poojas and Shirdi aarti passes [1][3][6]. Some trusts also sell their *own* virtual or online participation, for example TTD's virtual Kalyanotsavam [42].

**Devadwar does not list, mirror or benchmark against these tariffs.** Its prices (₹10, ₹20, ₹30) are for software experiences only. The site should state plainly: *"We are not a temple and do not book, perform or arrange any temple seva. To book an official seva, visit the temple's own website."*

---

## 4. Sensitivities: a do-not-do list for the digital product

1. **No implied temple affiliation.** Do not use temple names in product names ("Tirupati Darshan", "Siddhivinayak Aarti"), and do not use temple photographs, live feeds or murti likenesses identifiable as a specific temple's. Do not use temple logos, seals or trademarks, including TTD's emblem. TTD actively enforces its rights: in 2026 it served legal notices over unauthorised online use of the **Tirupati Laddu GI tag** [41].
2. **Don't imitate official virtual sevas.** TTD sells virtual participation in Kalyanotsavam and other sevas [42]. Avoid any product, name or UI that a user could mistake for those.
3. **Payment ≠ blessings.** Never use phrases like "receive blessings", "wish fulfilled", "dosha removed" or "guaranteed results". Never imply that a higher tier earns more divine favour. Suggested wording: *"This is a symbolic, self-guided devotional experience. No ritual is performed, and no spiritual outcome is promised."* Claims that a mantra or amulet cures disease may also run into Indian advertising law, such as the Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954. **[Applicability UNVERIFIED; take legal advice.]**
4. **No fake priests, no "performed on your behalf", no prasad.** Nothing physical is offered or shipped.
5. **Depict deities respectfully.** Use traditional iconography and correct attributes and vahanas (§2). No caricature, memes, distortion, gamified "damage" or "unlock the god" mechanics. Do not crop images through the face. Do not put deity images in ads next to unrelated or inappropriate content.
6. **Feet and footwear.** Never show footwear near deity images or sacred text. Show the deity's feet (*charan*) only in a reverential context, such as a lotus-feet motif at the bottom of a darshan frame. Never place the user's avatar or cursor "standing" on sacred imagery.
7. **Don't let sacred text be "stepped on".** Never put mantras, deity names or Om on floors, footers styled as ground, doormats, shoe merchandise, scroll-to-dismiss elements or anything swiped away "down" in a disrespectful gesture. Don't use them as loading spinners, decorative noise or 404-page jokes.
8. **No animals, meat or alcohol** in imagery alongside the deities. Be careful with food offerings, which are vegetarian by default.
9. **Aarti direction.** Animate the lamp **clockwise** [7]. An anticlockwise loop will look wrong to devotees.
10. **Mala logic.** Don't let the counter "cross" the guru bead (§1.7) [17].
11. **Sampradaya neutrality.** Present regional variations of dates and practices (Hanuman Jayanti, Janmashtami and so on) as such [30]. Don't declare any one tradition "correct".
12. **Recordings and art.** The texts are public domain, but recordings, illustrations and fonts must be original or licensed (§2 note).
13. **Religious-offence law.** Bharatiya Nyaya Sanhita s. 299 (the successor to IPC s. 295A) penalises *deliberate and malicious* acts intended to outrage religious feelings, including through electronic means [40]. Respectful design and a fast takedown/complaints path reduce this risk.
14. **No pressure tactics.** No countdowns like "auspicious slot closing in 3:00", no "only 2 aartis left", no pre-ticked donation add-ons (see §5).

---

## 5. Indian regulatory pointers for a small digital-goods site

*This section is research, not legal advice. Have a lawyer or CA confirm it.*

### 5.1 Consumer Protection (E-Commerce) Rules, 2020 (G.S.R. 462(E), 23 July 2020) [32]
I verified these from the notified text:
- **Rule 4(2):** Display prominently the **legal name**, the **principal geographic address**, the **website name and details**, and **contact details of customer care and of the grievance officer**.
- **Rule 4(4):** Set up an adequate grievance mechanism and **appoint a Grievance Officer**, displaying the officer's **name, contact details and designation** on the platform.
- **Rule 4(5):** The Grievance Officer must **acknowledge each complaint within 48 hours** and **redress it within one month** of receipt.
- **Rule 4(8):** No cancellation charges unless the entity bears similar charges when it cancels.
- **Rule 4(9):** Purchase consent only through an **explicit, affirmative action**. **No pre-ticked checkboxes.**
- **Rule 4(10):** Refund payments as prescribed by RBI or other law, within a reasonable time.
- Draft amendments were floated in 2021, and WIPO Lex records an amendment in 2021 [32]. **[Check whether further amendments are in force before launch.]**

### 5.2 CCPA Guidelines for Prevention and Regulation of Dark Patterns, 2023
These were issued on 30 Nov 2023 and list **13 specified dark patterns**: false urgency, basket sneaking, confirm shaming, forced action, subscription trap, interface interference, bait and switch, drip pricing, disguised advertisements, nagging, trick wording, SaaS billing and rogue malware [33]. A devotional site is especially exposed to *false urgency* ("muhurat ending!") and *confirm shaming* ("No, I don't want blessings").

### 5.3 Digital Personal Data Protection Act, 2023 and DPDP Rules, 2025
- The Rules were **notified 13/14 Nov 2025** with an **18-month phased rollout** [34][35]. The PIB backgrounder states that every Data Fiduciary must give a **clear, standalone consent notice** that explains the purpose of processing. It must also **display contact details** of a designated officer or DPO, and it must **notify affected individuals of a breach without delay**. Maximum penalties are **₹250 crore** for failing to maintain reasonable security safeguards, **₹200 crore** for breach-notification or children's-data violations, and **₹50 crore** for other violations [34].
- **Phases** (per AZB & Partners) [35]:
  - **Nov 2025:** definitions and Data Protection Board provisions.
  - **~Nov 2026:** consent-manager provisions.
  - **~May 2027:** notice, consent, security safeguards, breach intimation, data-principal rights and children's data.
  - Sources differ by a day or two on these dates (13/14 Nov; 12/13/14 May).
- **Status changes to watch:** In early 2026, MeitY consulted on **compressing the 18-month timeline**. I found no confirmation that the proposal was adopted [37]. A **DPDP (Removal of Difficulties) Order, 2026** (dated 5 Oct 2026) reportedly makes narrow textual fixes to s. 9(1) (children/disability consent) and s. 10 ("data audit") [36]. **[Official Gazette text UNVERIFIED; confirm on MeitY / egazette.]**
- **Practical point:** Build now for the full regime: purpose-specific consent, minimal data, a published contact for data queries, a breach plan and age-gating (children's data needs verifiable parental consent).

### 5.4 Information Technology Act, 2000
- **s. 43A** (compensation for failing to protect sensitive personal data) and the **SPDI Rules 2011** still apply until DPDP s. 44(2) omits s. 43A. That omission is reported to take effect with the 18-month tranche (around May 2027) [38].
- If the site later hosts **user-generated content** (comments, shared reflections), check the **IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021** obligations. **[Not researched in depth.]**
- CERT-In incident-reporting directions also apply to service providers. **[Not researched in depth.]**

### 5.5 RBI and payments
- The **RBI (Regulation of Payment Aggregators) Directions, 2025** were issued on 15 Sep 2025 and consolidate the PA framework [39]. A small merchant would not need its own licence; it uses a licensed PA such as a gateway. The PA must carry out merchant **KYC/due diligence**, with a **lighter process for small merchants with turnover up to ₹40 lakh** (PAN verification, a basic check and one valid ID) [39]. **[Details are from secondary summaries; the RBI text was not fetched directly.]**
- Never store card data on the site. RBI's card-on-file tokenisation rules (in force since 2022) bar merchants from storing card details. **[UNVERIFIED in this session.]**
- Publish clear **refund and cancellation terms** consistent with E-Commerce Rule 4(10) [32].
- **GST:** Registration and invoicing for digital services need CA advice. **[Not researched.]**

---

## 6. Candidate future categories (summary)

| Category | Risk | Notes |
|---|---|---|
| Guided reflection (verse + journal) | Low | Original writing; scalable |
| 108-Names reader (Ashtottara) | Low | Public-domain lists; verify text |
| Digital mala / Naam-japa counter | Low | Respect the guru-bead logic |
| Morning Awakening (Suprabhatam-style dawn text) | Medium | Avoid TTD naming and recordings |
| Abhishek visualisation | Medium | Clearly symbolic; generic lingam or murti |
| Katha reading (Satyanarayan and others) | Medium | Reading, not "performing" |
| Festival packs (dated) | Medium | Cite the date source; show a regional-variation note |
| "Kalyanotsavam" | **High** | Clashes with TTD's official virtual seva; story format only, if at all |

---

## Sources (all accessed 2026-11-24)

1. Tirumala Tirupati Devasthanams, "Daily Sevas": https://www.tirumala.org/DailySevas.aspx/Suprabhatam.aspx (loaded; timings only)
2. TTD, Kalyanotsavam page: https://www.tirumala.org/Kalyanotsavam.aspx (loaded; no description)
3. Shree Siddhivinayak Ganapati Mandir Trust, "Pooja Details": https://siddhivinayak.org/pooja-details/ (loaded)
4. Siddhivinayak Trust, "Temple Schedule": https://siddhivinayak.org/temple-schedule/ (search extract only; page appears dated)
5. Shri Saibaba Sansthan Trust online portal: https://online.sai.org.in/app/home/home.html and https://www.sai.org.in/en/daily-routine (**FAILED, HTTP 403**)
6. Skyscanner India, "Shirdi Sai Baba temple" guide (secondary): https://www.skyscanner.co.in/destinations/advice/shirdi-sai-baba-temple-guide (search extract only; **UNVERIFIED** against the official site)
7. Encyclopaedia Britannica, "Arti": https://www.britannica.com/topic/arti (direct fetch **403**; search extract)
8. Britannica, "Puja": https://www.britannica.com/topic/puja (search extract)
9. Britannica, "Hindu temple": https://www.britannica.com/topic/Hindu-temple (search extract)
10. Britannica, "Prasada": https://www.britannica.com/topic/prasada (search extract)
11. Britannica, "Ganesh Chaturthi": https://www.britannica.com/topic/Ganesh-Chaturthi (search extract)
12. Britannica, "Diwali": https://www.britannica.com/topic/Diwali-Hindu-festival, and "Lakshmi Puja": https://www.britannica.com/topic/Lakshmi-Puja (search extracts)
13. Britannica, "Maha Shivaratri": https://www.britannica.com/topic/Maha-shivaratri; "Rama Navami": https://www.britannica.com/topic/Rama-Navami; "Hindu calendar": https://www.britannica.com/topic/Hindu-calendar (search extracts)
14. Wikipedia, "Aarti": https://en.wikipedia.org/wiki/Aarti (carries a "needs more citations" notice)
15. Wikipedia, "Abhisheka": https://en.wikipedia.org/wiki/Abhisheka
16. Wikipedia, "Sahasranama": https://en.wikipedia.org/wiki/Sahasranama
17. Wikipedia, "Japamala": https://en.wikipedia.org/wiki/Japamala (Hindu hand-position details are uncited)
18. Wikipedia, "Satyanarayana Puja": https://en.wikipedia.org/wiki/Satyanarayana_Puja
19. Wikipedia, "Venkateswara": https://en.wikipedia.org/wiki/Venkateswara
20. Wikipedia, "Om Namah Shivaya": https://en.wikipedia.org/wiki/Om_Namah_Shivaya
21. Wikipedia, "Hare Krishna (mantra)": https://en.wikipedia.org/wiki/Hare_Krishna_(mantra)
22. Wikipedia, "Hanuman Chalisa": https://en.wikipedia.org/wiki/Hanuman_Chalisa
23. Wikipedia, "Vatapi Ganapatim": https://en.wikipedia.org/wiki/Vatapi_Ganapatim
24. Wikipedia, "Bhairav (raga)": https://en.wikipedia.org/wiki/Bhairav_(raga) (search extract)
25. Wikipedia, "Devi Mahatmya": https://en.wikipedia.org/wiki/Devi_Mahatmya (search extract)
26. Diana L. Eck, *Darśan: Seeing the Divine Image in India*, 3rd ed., Columbia University Press, 1998, ISBN 9780231112659 (catalogue record: https://search.worldcat.org/oclc/40295673)
27. DoPT O.M. F. No. 12/2/2023-JCA dated 16.07.2026, "Holidays to be observed in Central Government Offices during the year 2027", as forwarded by the Department of Posts (No. Y-21/2/2026-PE-II-DOP, 08.09.2026): https://utilities.cept.gov.in/dop/pdfbind.ashx?id=15435 (PDF text extracted and verified)
28. StaffNews reproductions of the DoPT annexures: https://www.staffnews.in/2026/07/list-of-holidays-for-the-year-2027-gazetted.html and https://www.staffnews.in/2026/07/list-of-restricted-holidays-for-the-year-2027.html (consistent with [27])
29. Drik Panchang, Diwali 2027 calendar (New Delhi): https://www.drikpanchang.com/diwali/diwali-puja-calendar.html?year=2027
30. Drik Panchang, Hanuman Jayanti 2027: https://www.drikpanchang.com/festivals/hanuman-jayanti/hanuman-jayanti-date-time.html?year=2027
31. Drik Panchang, Shardiya Navratri Ghatasthapana 2027: https://www.drikpanchang.com/navratri/shardiya-navratri-ghatasthapana.html?year=2027 (search extract only; the location in the extract was not India, so **confirm**)
32. Consumer Protection (E-Commerce) Rules, 2020, G.S.R. 462(E): notified text via https://taxguru.in/wp-content/uploads/2020/07/Consumer-Protection-E-Commerce-Rules-2020.pdf; WIPO Lex record: https://www.wipo.int/wipolex/en/legislation/details/23198
33. PIB, "CCPA issues Guidelines for Prevention and Regulation of Dark Patterns, 2023": https://www.pib.gov.in/PressReleasePage.aspx?PRID=1983994 (search extract)
34. PIB backgrounder, "DPDP Rules, 2025 Notified" (Nov 2025): https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf (PDF text extracted)
35. AZB & Partners, "India's DPDP Act: Phased Rollout and Key Compliance Milestones": https://www.azbpartners.com/bank/indias-digital-personal-data-protection-act-phased-rollout-and-key-compliance-milestones/
36. India Briefing, "DPDP Removal of Difficulties Order 2026" (7 Oct 2026): https://www.india-briefing.com/news/dpdp-removal-of-difficulties-order-2026-consent-data-audit-47274.html/; King Stubb & Kasiva: https://ksandk.com/data-protection-and-data-privacy/dpdp-removal-of-difficulties-order-2026/ (secondary; **Gazette UNVERIFIED**)
37. S.S. Rana & Co., "MeitY plans to cut short DPDP compliance timeline…": https://ssrana.in/articles/meity-plans-to-cut-short-dpdp-compliance-timeline-and-notify-cross-border-restrictions-for-sdfs/ (search extract; proposal only)
38. Taxmann, "SPDI Rules and the DPDP Act: Section 43A omitted from 13 May 2027": https://www.taxmann.com/post/blog/spdi-rules-vs-dpdp-act (search extract)
39. RBI, Master Direction "Regulation of Payment Aggregators" (15 Sep 2025): https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12896; RBI press release: https://website.rbi.org.in/web/rbi/-/press-releases/rbi-issues-the-reserve-bank-of-india-regulation-of-payment-aggregators-directions-2025 (not fetched directly; details from search summaries)
40. Bharatiya Nyaya Sanhita, 2023, s. 299 (secondary text): https://devgan.in/bns/section/299/ (search extract)
41. Deccan Herald, "TTD serves legal notice over unauthorised use of Tirupati laddu GI tag" (2026): https://www.deccanherald.com/amp/story/india%2Fandhra-pradesh%2Fin-order-to-preserve-the-sanctity-ttd-serves-legal-notice-over-unauthorised-use-of-tirupati-laddu-gi-tag-3574658; Deccan Chronicle: https://deccanchronicle.com/southern-states/andhra-pradesh/ttd-serves-legal-notices-on-misuse-of-tirupati-laddus-gi-tag-1883759 (search extracts)
42. Deccan Herald, "Tirupati Venkateshwara's Nitya Kalyanam goes online" (2020): https://www.deccanherald.com/india/tirupati-venkateshwaras-nitya-kalyanam-goes-online-869963.html; The Hans India, "TTD brings Kalyanotsavam online": https://www.thehansindia.com/andhra-pradesh/ttd-brings-kalyanotsavam-online-637691 (search extracts)

### Items explicitly not verified in this session
- The official Shirdi aarti schedule (site blocked).
- Bell use and the meaning of "pancha-arati" in aarti.
- The date of the Venkatesa Suprabhatam.
- The bīja mantras for Ganesha, Durga, Lakshmi, Saraswati and Hanuman, the Rama trayodaśākṣarī, and the verse references for the Mahāmṛtyuñjaya, Kausalyā-supraja and Saraswati verses.
- The attributions of "Sukhakartā Dukhahartā" and "Om Jai Jagdish Hare".
- The Ganesh visarjan 2027 date, the Navratri 2027 start date (search extract only), and Smarta vs Vaishnava Janmashtami.
- The Gazette text of the DPDP Removal of Difficulties Order 2026, and whether the MeitY timeline compression was adopted.
- The RBI CoF tokenisation specifics, the Drugs & Magic Remedies Act applicability, the IT Intermediary Rules, CERT-In and GST.
