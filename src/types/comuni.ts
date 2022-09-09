export type comune =
    | "Segrate"
    | "Milano"
    | "Peschiera Borromeo"
    | "Pioltello"
    | "Vignate"
    | "Cernusco sul Naviglio"
    | "Vimodrone"
    | "Cologno Monzese"
    | "Cassina de Pecchi"
    | "Bussero"
    | "Gorgonzola"
    | "Monza";

export const possibleComuni = [
    "Segrate",
    "Milano",
    "Peschiera Borromeo",
    "Pioltello",
    "Vignate",
    "Cernusco sul Naviglio",
    "Vimodrone",
    "Cologno Monzese",
    "Cassina de Pecchi",
    "Bussero",
    "Gorgonzola",
    "Monza",
];

export type zona =
    | { id: "segrate-centro"; text: "Segrate Centro"; comune: "Segrate" }
    | {
          id: "villaggio-ambrosiano";
          text: "Villaggio Ambrosiano";
          comune: "Segrate";
      }
    | {
          id: "area-novegro-san-felice";
          text: "Novegro / San Felice";
          comune: "Segrate";
      }
    | {
          id: "area-lavanderie-redecesio";
          text: "Lavanderie / Redecesio";
          comune: "Segrate";
      }
    | { id: "milano-due"; text: "Milano Due"; comune: "Segrate" }
    | { id: "centro"; text: "Milano Centro"; comune: "Milano" }
    | {
          id: "arco-della-pace-arena-pagano";
          text: "Arco della Pace / Arena / Pagano";
          comune: "Milano";
      }
    | {
          id: "genova-ticinese";
          text: "Porta Genova / Porta Ticinese";
          comune: "Milano";
      }
    | {
          id: "quadronno-palestro-guastalla";
          text: "Quadronno / Palestro / Guastalla";
          comune: "Milano";
      }
    | {
          id: "garibaldi-moscova-porta-nuova";
          text: "Garibaldi / Moscova / Porta Nuova";
          comune: "Milano";
      }
    | {
          id: "fiera-sempione-city-life-portello";
          text: "Fiera / Sempione / City-life";
          comune: "Milano";
      }
    | { id: "zona-navigli"; text: "Navigli"; comune: "Milano" }
    | {
          id: "porta-romana-cadore-montenero";
          text: "Porta Romana / Cadore / Montenero";
          comune: "Milano";
      }
    | {
          id: "porta-venezia-indipendenza";
          text: "Porta Venezia / Corso Indipendenza";
          comune: "Milano";
      }
    | {
          id: "centrale-repubblica";
          text: "Stazione Centrale / Repubblica";
          comune: "Milano";
      }
    | {
          id: "cenisio-sarpi-isola";
          text: "Cenisio / Sarpi / Isola";
          comune: "Milano";
      }
    | {
          id: "viale-certosa-cascina-merlata";
          text: "Viale Certosa / Cascina Merlata";
          comune: "Milano";
      }
    | {
          id: "bande-nere-inganni";
          text: "Bande Nere / Inganni";
          comune: "Milano";
      }
    | { id: "famagosta-barona"; text: "Famagosta / Barona"; comune: "Milano" }
    | {
          id: "abbiategrasso-chiesa-rossa";
          text: "Abbiategrasso / Chiesa Rossa";
          comune: "Milano";
      }
    | {
          id: "porta-vittoria-lodi";
          text: "Porta Vittoria / Corso Lodi";
          comune: "Milano";
      }
    | {
          id: "cimiano-crescenzago-adriano";
          text: "Cimiano / Crescenzago / Quartiere Adriano";
          comune: "Milano";
      }
    | { id: "bicocca-niguarda"; text: "Bicocca / Niguarda"; comune: "Milano" }
    | {
          id: "solari-washington";
          text: "Parco Solari / Washington";
          comune: "Milano";
      }
    | { id: "affori-bovisa"; text: "Affori / Bovisa"; comune: "Milano" }
    | { id: "san-siro-trenno"; text: "San Siro / Trenno"; comune: "Milano" }
    | {
          id: "bisceglie-baggio-olmi";
          text: "Bisceglie / Baggio / Olmi";
          comune: "Milano";
      }
    | {
          id: "ripamonti-vigentino";
          text: "Ripamonti / Vigentino";
          comune: "Milano";
      }
    | { id: "forlanini"; text: "Corso Forlanini"; comune: "Milano" }
    | {
          id: "citta-studi-susa";
          text: "Città Studi / Piazzale Susa";
          comune: "Milano";
      }
    | { id: "maggiolina-istria"; text: "Maggiolina / Istria"; comune: "Milano" }
    | {
          id: "precotto-turro";
          text: "Precotto / Turro";
          comune: "Milano";
      }
    | {
          id: "udine-lambrate";
          text: "Piazza Udine / Lambrate";
          comune: "Milano";
      }
    | { id: "pasteur-rovereto"; text: "Pasteur / Rovereto"; comune: "Milano" }
    | {
          id: "ponte-lambro-santa-giulia";
          text: "Ponte Lambro / Santa Giulia";
          comune: "Milano";
      }
    | {
          id: "corvetto-rogoredo";
          text: "Piazzale Corvetto / Rogoredo";
          comune: "Milano";
      }
    | {
          id: "napoli-soderini";
          text: "Piazza Napoli / Soderini";
          comune: "Milano";
      };

export const possibleZona = [
    { id: "segrate-centro", text: "Segrate Centro", comune: "Segrate" },
    {
        id: "villaggio-ambrosiano",
        text: "Villaggio Ambrosiano",
        comune: "Segrate",
    },
    {
        id: "area-novegro-san-felice",
        text: "Novegro / San Felice",
        comune: "Segrate",
    },
    {
        id: "area-lavanderie-redecesio",
        text: "Lavanderie / Redecesio",
        comune: "Segrate",
    },
    { id: "milano-due", text: "Milano Due", comune: "Segrate" },
    { id: "centro", text: "Milano Centro", comune: "Milano" },
    {
        id: "arco-della-pace-arena-pagano",
        text: "Arco della Pace / Arena / Pagano",
        comune: "Milano",
    },
    {
        id: "genova-ticinese",
        text: "Porta Genova / Porta Ticinese",
        comune: "Milano",
    },
    {
        id: "quadronno-palestro-guastalla",
        text: "Quadronno / Palestro / Guastalla",
        comune: "Milano",
    },
    {
        id: "garibaldi-moscova-porta-nuova",
        text: "Garibaldi / Moscova / Porta Nuova",
        comune: "Milano",
    },
    {
        id: "fiera-sempione-city-life-portello",
        text: "Fiera / Sempione / City-life",
        comune: "Milano",
    },
    { id: "zona-navigli", text: "Navigli", comune: "Milano" },
    {
        id: "porta-romana-cadore-montenero",
        text: "Porta Romana / Cadore / Montenero",
        comune: "Milano",
    },
    {
        id: "porta-venezia-indipendenza",
        text: "Porta Venezia / Corso Indipendenza",
        comune: "Milano",
    },
    {
        id: "centrale-repubblica",
        text: "Stazione Centrale / Repubblica",
        comune: "Milano",
    },
    {
        id: "cenisio-sarpi-isola",
        text: "Cenisio / Sarpi / Isola",
        comune: "Milano",
    },
    {
        id: "viale-certosa-cascina-merlata",
        text: "Viale Certosa / Cascina Merlata",
        comune: "Milano",
    },
    {
        id: "bande-nere-inganni",
        text: "Bande Nere / Inganni",
        comune: "Milano",
    },
    { id: "famagosta-barona", text: "Famagosta / Barona", comune: "Milano" },
    {
        id: "abbiategrasso-chiesa-rossa",
        text: "Abbiategrasso / Chiesa Rossa",
        comune: "Milano",
    },
    {
        id: "porta-vittoria-lodi",
        text: "Porta Vittoria / Corso Lodi",
        comune: "Milano",
    },
    {
        id: "cimiano-crescenzago-adriano",
        text: "Cimiano / Crescenzago / Quartiere Adriano",
        comune: "Milano",
    },
    { id: "bicocca-niguarda", text: "Bicocca / Niguarda", comune: "Milano" },
    {
        id: "solari-washington",
        text: "Parco Solari / Washington",
        comune: "Milano",
    },
    { id: "affori-bovisa", text: "Affori / Bovisa", comune: "Milano" },
    { id: "san-siro-trenno", text: "San Siro / Trenno", comune: "Milano" },
    {
        id: "bisceglie-baggio-olmi",
        text: "Bisceglie / Baggio / Olmi",
        comune: "Milano",
    },
    {
        id: "ripamonti-vigentino",
        text: "Ripamonti / Vigentino",
        comune: "Milano",
    },
    { id: "forlanini", text: "Corso Forlanini", comune: "Milano" },
    {
        id: "citta-studi-susa",
        text: "Città Studi / Piazzale Susa",
        comune: "Milano",
    },
    { id: "maggiolina-istria", text: "Maggiolina / Istria", comune: "Milano" },
    {
        id: "precotto-turro",
        text: "Precotto / Turro",
        comune: "Milano",
    },
    {
        id: "udine-lambrate",
        text: "Piazza Udine / Lambrate",
        comune: "Milano",
    },
    { id: "pasteur-rovereto", text: "Pasteur / Rovereto", comune: "Milano" },
    {
        id: "ponte-lambro-santa-giulia",
        text: "Ponte Lambro / Santa Giulia",
        comune: "Milano",
    },
    {
        id: "corvetto-rogoredo",
        text: "Piazzale Corvetto / Rogoredo",
        comune: "Milano",
    },
    {
        id: "napoli-soderini",
        text: "Piazza Napoli / Soderini",
        comune: "Milano",
    },
];
