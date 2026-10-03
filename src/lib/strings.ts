/* =====================================================================
   STRINGS — all user-visible text in one place.
   Add a new language by copying the 'en' block and translating.
   ===================================================================== */

export type Language = 'en' | 'es';

export const STRINGS = {
  en: {
    // ── App chrome ────────────────────────────────────────────────────
    theHand:              "The Hand",
    handsView:            "Hand's View · same numbers, right-side up",

    // ── Phases ───────────────────────────────────────────────────────
    phaseReinforce:       'Reinforce',
    phaseInvade:          'Invade',
    phaseObjectives:      'Objectives',

    // ── House in Turn ─────────────────────────────────────────────────
    houseInTurn:          'House in Turn',

    // ── Reinforce formula ─────────────────────────────────────────────
    reinforceFormLine1:   'Territories + Castles',
    reinforceFormLine2:   '÷ 3 (rounded down, min 3, max 13)',
    reinforceFormBonus:   'Region bonus armies',
    reinforceArmies:      'Armies to place',
    reinforceGold:        'Gold income',

    // ── Invade ────────────────────────────────────────────────────────
    defender:             'Defender',
    clear:                'Clear',
    invadeTerritory:      'Territory',
    invadeCastle:         'Castle',
    invadePort:           'Port',

    // ── Objectives ────────────────────────────────────────────────────
    vpFooter:             'When the Valar Morghulis card is drawn, open the leaderboard.',

    // ── Action buttons ────────────────────────────────────────────────
    btnUndo:              'Undo',
    btnUndoHint:          'no action yet',
    btnLog:               "Maester's Log",
    btnLogHint:           'events',
    btnStandings:         'Full Standings',
    btnStandingsHint:     'detailed breakdown',
    btnSetup:             'Setup',
    btnSetupHint:         'players · counts · new game',
    btnRules:             'House Rules',
    btnRulesHint:         'roles · rulings · this app',

    // ── HouseColumn ───────────────────────────────────────────────────
    statusTurn:           'Turn',
    statTerr:             'Terr.',
    statCastles:          'Castles',
    statPorts:            'Ports',
    statVP:               'VP',
    statBonus:            'Bonus',
    holdings:             'holdings',
    ordinals:             ['1st','2nd','3rd','4th','5th','6th','7th'],

    // ── HouseMirror abbreviations ─────────────────────────────────────
    abbTerr:              'T',
    abbCastle:            'C',
    abbPort:              'P',
    abbVP:                'VP',

    // ── Log overlay ───────────────────────────────────────────────────
    logTitle:             "Maester's Log",
    logSubtitle:          'every move, in order of the Realm',
    logEmpty:             'No moves recorded yet. The Realm is still.',
    logUndoLast:          'Undo Last',
    logEntries:           'entries',
    logEntry:             'entry',

    // ── Leaderboard overlay ───────────────────────────────────────────
    lbTitle:              'Standings',
    lbSubtitle:           'territory + castle + port',
    lbHoldings:           'holdings',
    lbFooter:             'If Valar Morghulis were drawn now, the leader takes the realm.',

    // ── Settings overlay ──────────────────────────────────────────────
    setupTitle:           'Setup',
    setupSubtitle:        'configure the realm before, or correct mid-game',
    setupHousesLabel:     'Houses at the table',
    setupCountsLabel:     'Starting counts',
    setupColTerr:         'Terr.',
    setupColCastles:      'Castles',
    setupColPorts:        'Ports',
    setupColVP:           'VP',
    setupColBonus:        'Bonus ⚔',
    setupEditsLive:       'Edits apply live. The log records each adjustment.',
    setupNewGame:         'New Game',
    setupConfirm:         'Restart the realm — clear all counts, log, and the turn marker?',
    setupCancel:          'Cancel',
    setupYes:             'Yes, new game',
    setupLanguage:        'Language',

    // ── Custom rules overlay ──────────────────────────────────────────
    rulesTitle:           'House Rules',
    rulesSubtitle:        'the law of the realm at this table',
    rulesAboutTitle:      'About this App',
    rulesAboutBody:       'Hand of the King is a score tracker for a custom Game of Thrones–themed RISK variant. It tracks territories, castles, ports, VPs, and armies for up to 7 Great Houses. The Hand manages the app; all other players read their own column on the screen.',
    rulesTableTitle:      'Table Rules',
    rulesMaesterCard:     "Maester cards — any player may purchase a Maester card at any moment, even during another player's turn.",
    rulesRolesTitle:      'Roles at the Table',
    rulesFooter:          'The Maester of Laws has the final word on all disputes.',
    rulesSuggested7th:    'Suggested 7th Role',

    // ── Roles ─────────────────────────────────────────────────────────
    role1Title:           'The Hand of the King',
    role1Desc:            'Holds the app. Manages game state, turn order, and score tracking.',
    role2Title:           'Maester of Coins',
    role2Desc:            'The bank. Handles all gold income payouts and army purchase transactions.',
    role3Title:           'Grand Maester',
    role3Desc:            'Holds and deals the Maester card deck. Controls when cards are revealed.',
    role4Title:           'Three-Eye Raven',
    role4Desc:            'Holds and deals the objective card deck.',
    role5Title:           'Lord Commander of the Kingsguard',
    role5Desc:            'Holds and deals territory cards. Oversees all territorial disputes on the board.',
    role6Title:           'Maester of Laws',
    role6Desc:            'Holds the rulebook. Final arbiter on any rule question — their ruling stands.',
    role7Title:           'Knight of the Seven Kingdoms',
    role7Desc:            'Guardian of special units. Holds and distributes siege engines, knights, and fortifications to any house when called upon in battle.',
    role7aTitle:          'Master of Whisperers',
    role7aDesc:           'Tracks inter-player alliances and side deals. Social referee — mediates disputes the Maester of Laws cannot resolve alone.',
    role7bTitle:          'Lord of the Harbor',
    role7bDesc:           'Arbiter of all port and naval adjacency rulings. Manages coast and sea-lane special cases.',
    role7cTitle:          'High Sparrow',
    role7cDesc:           'VP and objective scorekeeper for all players. Breaks ties and reads the final standings when Valar Morghulis is drawn.',
  },

  es: {
    // ── App chrome ────────────────────────────────────────────────────
    theHand:              'La Mano',
    handsView:            'Vista de la Mano · mismos números, al derecho',

    // ── Phases ───────────────────────────────────────────────────────
    phaseReinforce:       'Reforzar',
    phaseInvade:          'Invadir',
    phaseObjectives:      'Objetivos',

    // ── House in Turn ─────────────────────────────────────────────────
    houseInTurn:          'Casa en Turno',

    // ── Reinforce formula ─────────────────────────────────────────────
    reinforceFormLine1:   'Territorios + Castillos',
    reinforceFormLine2:   '÷ 3 (redondeado abajo, mín 3, máx 13)',
    reinforceFormBonus:   'Bonus de región',
    reinforceArmies:      'Ejércitos a colocar',
    reinforceGold:        'Ingresos de oro',

    // ── Invade ────────────────────────────────────────────────────────
    defender:             'Defensor',
    clear:                'Limpiar',
    invadeTerritory:      'Territorio',
    invadeCastle:         'Castillo',
    invadePort:           'Puerto',

    // ── Objectives ────────────────────────────────────────────────────
    vpFooter:             'Cuando se saca la carta Valar Morghulis, abre la clasificación.',

    // ── Action buttons ────────────────────────────────────────────────
    btnUndo:              'Deshacer',
    btnUndoHint:          'sin acciones aún',
    btnLog:               'Registro del Maestre',
    btnLogHint:           'eventos',
    btnStandings:         'Clasificación',
    btnStandingsHint:     'desglose detallado',
    btnSetup:             'Configurar',
    btnSetupHint:         'jugadores · conteos · nueva partida',
    btnRules:             'Reglas de Casa',
    btnRulesHint:         'roles · normas · esta app',

    // ── HouseColumn ───────────────────────────────────────────────────
    statusTurn:           'Turno',
    statTerr:             'Terr.',
    statCastles:          'Castillos',
    statPorts:            'Puertos',
    statVP:               'PV',
    statBonus:            'Bonus',
    holdings:             'territorios',
    ordinals:             ['1°','2°','3°','4°','5°','6°','7°'],

    // ── HouseMirror abbreviations ─────────────────────────────────────
    abbTerr:              'T',
    abbCastle:            'C',
    abbPort:              'P',
    abbVP:                'PV',

    // ── Log overlay ───────────────────────────────────────────────────
    logTitle:             'Registro del Maestre',
    logSubtitle:          'cada movimiento, en orden del Reino',
    logEmpty:             'Ningún movimiento aún. El Reino está en calma.',
    logUndoLast:          'Deshacer último',
    logEntries:           'entradas',
    logEntry:             'entrada',

    // ── Leaderboard overlay ───────────────────────────────────────────
    lbTitle:              'Clasificación',
    lbSubtitle:           'territorios + castillos + puertos',
    lbHoldings:           'territorios',
    lbFooter:             'Si se sacara Valar Morghulis ahora, el líder tomaría el reino.',

    // ── Settings overlay ──────────────────────────────────────────────
    setupTitle:           'Configurar',
    setupSubtitle:        'configura el reino antes o corrige a medio juego',
    setupHousesLabel:     'Casas en la mesa',
    setupCountsLabel:     'Conteos iniciales',
    setupColTerr:         'Terr.',
    setupColCastles:      'Castillos',
    setupColPorts:        'Puertos',
    setupColVP:           'PV',
    setupColBonus:        'Bonif. ⚔',
    setupEditsLive:       'Los cambios se aplican en tiempo real. El registro guarda cada ajuste.',
    setupNewGame:         'Nueva Partida',
    setupConfirm:         'Reiniciar el reino — ¿borrar conteos, registro y turno?',
    setupCancel:          'Cancelar',
    setupYes:             'Sí, nueva partida',
    setupLanguage:        'Idioma',

    // ── Custom rules overlay ──────────────────────────────────────────
    rulesTitle:           'Reglas de Casa',
    rulesSubtitle:        'la ley del reino en esta mesa',
    rulesAboutTitle:      'Sobre esta App',
    rulesAboutBody:       'La Mano del Rey es un marcador para una variante de RISK ambientada en Juego de Tronos. Registra territorios, castillos, puertos, PVs y ejércitos para hasta 7 Grandes Casas. La Mano gestiona la app; los demás jugadores leen su columna en pantalla.',
    rulesTableTitle:      'Reglas de Mesa',
    rulesMaesterCard:     'Cartas de Maestre — cualquier jugador puede comprar una carta de Maestre en cualquier momento, incluso durante el turno de otro jugador.',
    rulesRolesTitle:      'Roles en la Mesa',
    rulesFooter:          'El Maestre de las Leyes tiene la última palabra en todas las disputas.',
    rulesSuggested7th:    'Séptimo Rol Sugerido',

    // ── Roles ─────────────────────────────────────────────────────────
    role1Title:           'La Mano del Rey',
    role1Desc:            'Sostiene la app. Gestiona el estado del juego, el orden de turno y el marcador.',
    role2Title:           'Maestre de las Monedas',
    role2Desc:            'El banco. Gestiona todos los cobros de oro y las transacciones de ejércitos.',
    role3Title:           'Gran Maestre',
    role3Desc:            'Sostiene y reparte el mazo de Maestres. Controla cuándo se revelan las cartas.',
    role4Title:           'Cuervo de Tres Ojos',
    role4Desc:            'Sostiene y reparte el mazo de objetivos.',
    role5Title:           'Lord Comandante de la Guardia Real',
    role5Desc:            'Sostiene y reparte las cartas de territorio. Supervisa todas las disputas territoriales.',
    role6Title:           'Maestre de las Leyes',
    role6Desc:            'Tiene el reglamento. Árbitro final en cualquier pregunta — su decisión es inapelable.',
    role7Title:           'Caballero de los Siete Reinos',
    role7Desc:            'Guardián de unidades especiales. Sostiene y distribuye máquinas de asedio, caballeros y fortifications a cualquier casa cuando se le requiere en batalla.',
    role7aTitle:          'Maestro de los Susurros',
    role7aDesc:           'Lleva registro de alianzas y tratos entre jugadores. Árbitro social — media en disputas que el Maestre de las Leyes no puede resolver solo.',
    role7bTitle:          'Lord del Puerto',
    role7bDesc:           'Árbitro de decisiones sobre puertos y adyacencia naval. Gestiona casos especiales de costas y rutas marítimas.',
    role7cTitle:          'Gorrión Supremo',
    role7cDesc:           'Anotador de PVs y objetivos para todos. Desempata y lee la clasificación final cuando se saca Valar Morghulis.',
  },
} as const;

export type Strings = typeof STRINGS['en'];
