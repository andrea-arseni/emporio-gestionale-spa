import vendereImage from "../assets/living.jpeg";
import comprareImage from "../assets/kitchen.jpeg";
import affittareImage from "../assets/bed.jpg";
import capannoneImage from "../assets/capannone.jpg";
import renovateImage from "../assets/renovate.jpg";
import attivitaImage from "../assets/attivita.jpg";
import moneyImage from "../assets/money.jpeg";
import consulenzaImage from "../assets/services.jpeg";
import disegnoImage from "../assets/disegno.jpeg";
import condominioImage from "../assets/condominio.jpeg";
import apeImage from "../assets/ape.jpeg";
import tribunaleImage from "../assets/tribunale.jpeg";

export type service = {
    name: string;
    image: string;
    title: string;
    message: string[];
    id: number;
};

export const services: service[] = [
    {
        id: 0,
        name: "vendere-casa",
        image: vendereImage,
        title: "VENDERE CASA",
        message: [
            "Dal 1985 operiamo con successo nel mercato immobiliare, prima di Milano, ora di Segrate e dintorni.",
            "Siamo l'agenzia immobiliare più vantaggiosa per il venditore: chiediamo per collaborazioni in esclusiva su immobili di Segrate una provvigione fissa pari all'1,5% del prezzo finale di vendita, la metà di quanto solitamente chiesto dalla concorrenza.",
            "Ci occupiamo noi di tutto l'iter di vendita: dalla raccolta documentale, alla messa in pubblicità dell'immobile sul mercato, fino a vendita conclusa.",
        ],
    },
    {
        id: 1,
        name: "comprare-casa",
        image: comprareImage,
        title: "COMPRARE CASA",
        message: [
            "Se volete comprare casa e avete dubbi su come procedere, potete affidarci il vostro progetto.",
            "Potrete affidarvi ad un professionista che vi accompagnerà nelle diverse fasi del processo, la ricerca del giusto immobile, l'eventuale richiesta del mutuo, la trattativa con parte venditrice, fino al giorno del rogito.",
        ],
    },
    {
        id: 2,
        name: "affittare-locare",
        image: affittareImage,
        title: "AFFITTARE / LOCARE",
        message: [
            "Siamo l'agenzia immobiliare più vantaggiosa per chi decide di affittare o locare il suo immobile: chiediamo una provvigione fissa pari a 300 € più IVA a contratto stipulato, meno della metà di quanto solitamente richiesto dalla concorrenza.",
            "Forniamo un servizio unico: non solo ci adoperiamo per trovare un inquilino referenziato e rispettoso dell'immobile, ma dopo la firma del contratto continuiamo a sostenervi ed assistervi rimanendo un riferimento per tutte le potenziali problematiche che potrebbero sorgere nel rapporto proprietà-inquilini",
        ],
    },
    {
        id: 3,
        name: "immobili-commerciali",
        image: capannoneImage,
        title: "IMMOBILI COMMERCIALI E/O INDUSTRIALI",
        message: [
            "Dal 1985 operiamo con successo nel mercato immobiliare, prima di Milano, ora di Segrate e dintorni.",
            "Siamo l'agenzia immobiliare più vantaggiosa per il venditore: chiediamo una provvigione fissa pari all'1,5% del prezzo finale di vendita, la metà di quanto chiesto di solito dalle altre agenzie.",
            "Una parte importante del nostro business ha sempre riguardato la compravendita di immobili di natura commerciale, come capannoni, uffici e negozi.",
        ],
    },
    {
        id: 4,
        name: "ristrutturazioni",
        image: renovateImage,
        title: "RISTRUTTURAZIONI",
        message: [
            "Nel corso degli anni abbiamo messo insieme una equipe di professionisti e artigiani pronta a svolgere diversi interventi in merito a ristrutturazioni parziali o totali.",
            "Potete contattarci per diverse tipologie di opere: rifacimento di pavimenti, imbiancature pareti, opere di muratura, installazione sanitari, manutenzione impianti idraulici, elettrici e di condizionamento etc.",
        ],
    },
    {
        id: 5,
        name: "cessione-attivita",
        image: attivitaImage,
        title: "CESSIONE ATTIVITA'",
        message: [
            "Quando si decide di terminare un'attività il rischio è quello di perdere un capitale consistente solo perché non si è stati adeguatamente assistiti.",
            "Noi effettuiamo una valutazione del valore sul mercato della vostra attività, tenendo conto della sua posizione, del parco clienti in essere, della sua potenzialità e del valore delle eventuali macchine/attrezzature presenti.",
            "Infine ci occupiamo della cessione in modo che questa sia venduta ad un giusto prezzo di mercato.",
        ],
    },
    {
        id: 6,
        name: "consulenza-finanziaria",
        image: moneyImage,
        title: "CONSULENZA FINANZIARIA",
        message: [
            "Quando si decide di aprire un mutuo bancario vi sono diverse opzioni: ci si può affidare ad un broker oppure andare direttamente alla propria filiale di riferimento.",
            "Un'ulteriore opzione è affidarsi ad un'agenzia immobiliare, noi ci adoperiamo per far ottenere ai nostri clienti il mutuo più vantaggioso e più adatto alle loro esigenze e li assistiamo sino all'erogazione, tramite convenzioni dirette con i migliori Istituti di Credito oppure mediante importanti Mediatori Creditizi",
        ],
    },
    {
        id: 7,
        name: "consulenze-notarili-legali",
        image: consulenzaImage,
        title: "CONSULENZE NOTARILI E/O LEGALI",
        message: [
            "Consulenza notarile: Collaboriamo con un importante studio notarile di Segrate dagli anni 90. Vi assistiamo nella preparazione di tutta la documentazione necessaria per la stipula del rogito, affiancandovi durante l'atto notarile sino alla effettiva consegna dell'immobile.",
            "Consulenza legale: Talvolta abbiamo conosciuto nostri clienti perché sono venuti a chiederci aiuto in merito a controversie legate all'ambito immobiliare. Noi collaboriamo da molti anni con un'ottima avvocatessa esperta in questo campo, che vi potrà fornire l'assistenza necessaria.",
        ],
    },
    {
        id: 8,
        name: "pratiche-catastali-comunali",
        image: disegnoImage,
        title: "PRATICHE CATASTALI E/O COMUNALI",
        message: [
            "Svolgiamo pratiche catastali di diversa tipologia (docfa, pregeo, rettifiche, volture) e comunali, progetti, SCIA, DIA, CILA, sanatorie, tabelle millesimali.",
        ],
    },
    {
        id: 9,
        name: "amministrazioni-condominio",
        image: condominioImage,
        title: "AMMINISTRAZIONI DI CONDOMINIO",
        message: [
            "Nel caso in cui steste considerando di cambiare il vostro amministratore di condominio, noi operiamo con successo nella zona di Segrate da diversi anni.",
            "Possiamo organizzare un incontro conoscitivo con i condomini, valutare insieme lo stato del condominio e farvi avere un preventivo.",
        ],
    },
    {
        id: 10,
        name: "attestati-prestazione-energetica",
        image: apeImage,
        title: "ATTESTATI DI PRESTAZIONE ENERGETICA",
        message: [
            "L'Attestato di Prestazione Energetica è un documento volto a calcolare la dispersione energetica di un'immobile. Si tratta di un documento obbligatorio ormai da diversi anni in tutta l'Unione Europea, nel quale all'immobile viene assegnata una classe energetica ed un indice di prestazione energetica.",
            "Noi ci avvaliamo di professionisti che possono venire presso il vostro immobile e, seguendo le procedure a norma di legge a regola d'arte, produrre il documento.",
        ],
    },
    {
        id: 11,
        name: "perizie-immobiliari",
        image: tribunaleImage,
        title: "PERIZIE IMMOBILIARI GIURATE",
        message: [
            "Una perizia giurata si distingue da una normale valutazione immobiliare perché contiene un giuramento scritto reso da un professionista dinanzi al Cancelliere di un ufficio giudiziario oppure ad un notaio.",
            "La perizia definisce il reale valore dell’immobile, ed è ottenuta sia attraverso i dati raccolti durante un sopralluogo che attraverso l'analisi documentale dell'immobile stesso",
        ],
    },
];
