export const balances = [
  { code: "USD", flag: "🇺🇸", amount: "$1,376.11", label: "Available Balance", ready: true },
  { code: "EUR", flag: "🇪🇺", amount: "€143.63", label: "Available Balance", ready: true },
  { code: "GBP", flag: "🇬🇧", amount: "£0.00", label: "Set Up Account", ready: false },
];

export const recentActivity = [
  {
    date: "12 Aug 2026",
    company: "ABC Logistics",
    ref: "INV-20391",
    type: "Sent",
    amount: "-$2,500.00 USD",
    status: "Completed",
  },
  {
    date: "11 Aug 2026",
    company: "Global Freight Ltd",
    ref: "INV-8842",
    type: "Received",
    amount: "+$4,200.00 USD",
    status: "Completed",
  },
  {
    date: "09 Aug 2026",
    company: "XYZ Cargo",
    ref: "INV-7712",
    type: "Sent",
    amount: "-€850.00 EUR",
    status: "Processing",
  },
  {
    date: "07 Aug 2026",
    company: "WSA Pay Deposit",
    ref: "DEP-10291",
    type: "Deposit",
    amount: "+$5,000.00 USD",
    status: "Completed",
  },
  {
    date: "06 Aug 2026",
    company: "Oceanic Logistics",
    ref: "INV-5512",
    type: "Received",
    amount: "+$1,750.00 USD",
    status: "Completed",
  },
];

export const partnersDirectory = [
  { name: "EUGENE' Logistics Co., Ltd", city: "Qingdao", country: "China", id: "98551" },
  {
    name: "'K' Line Logistics (Hong Kong) Ltd",
    city: "Hong Kong",
    country: "Hong Kong",
    id: "65362",
  },
  { name: "MGL Georgia' Ltd (Poti, GE)", city: "Poti", country: "Georgia", id: "97089" },
  { name: "RBS Logistics' LTD (Tbilisi, GE)", city: "Tbilisi", country: "Georgia", id: "84718" },
  { name: "+AN CARGO s.r.o.", city: "Liptovsky Mikulas", country: "Slovakia", id: "148208" },
  {
    name: "+Carga - Transitos Comercio e Servicos Lda",
    city: "Lisbon",
    country: "Portugal",
    id: "55680",
  },
  {
    name: "1 2 3 Air Sea Rail International Transport GmbH",
    city: "Hamburg",
    country: "Germany",
    id: "71708",
  },
  {
    name: "101 Supply Chain Group (Los Angeles, CA, US)",
    city: "Los Angeles",
    country: "United States",
    id: "145512",
  },
];

export const selectedPayees = [
  { name: "1UP CARGO (Sydney, AU)", city: "Sydney", country: "Australia", id: "114640" },
  { name: "A-Star Logistics Corporation", city: "Kaohsiung", country: "Taiwan", id: "64979" },
  { name: "Adam Transport Services Ltd.", city: "Budapest", country: "Hungary", id: "83091" },
  {
    name: "Alpha Cargo International Logistics S.A.S.",
    city: "Paris",
    country: "France",
    id: "152285",
  },
  {
    name: "Americargo Logistics (DRV Forwarding SA DE CV)",
    city: "Jalisco",
    country: "Mexico",
    id: "75967",
  },
  {
    name: "AOF CARGO LOGISTICS CO., LTD (Taipei, TW)",
    city: "Taipei",
    country: "Taiwan",
    id: "54933",
  },
  { name: "APEX International Inc (Tokyo, JP)", city: "Tokyo", country: "Japan", id: "35908" },
];

export const companyUsers = [
  {
    initials: "RS",
    name: "Remon Saerosem",
    email: "remon@pfsegypt.com",
    role: "Administrator",
    last: "12 Aug 2026 11:57 AM",
    you: true,
  },
  {
    initials: "MA",
    name: "Mariam Adel",
    email: "mariam@pfsegypt.com",
    role: "Finance Manager",
    last: "11 Aug 2026 09:21 AM",
    you: false,
  },
  {
    initials: "KA",
    name: "Karim Ahmed",
    email: "karim@pfsegypt.com",
    role: "Finance Officer",
    last: "10 Aug 2026 04:35 PM",
    you: false,
  },
  {
    initials: "HA",
    name: "Hoda Ali",
    email: "hoda@pfsegypt.com",
    role: "Viewer",
    last: "08 Aug 2026 02:11 PM",
    you: false,
  },
];

export const importantNotes = [
  "Please allow 72 hours for the processing of withdrawals and deposits in your WSA Pay account.",
  "Partner to partner transfers within WSA Pay are processed immediately.",
  "A minimum account balance of USD 1.00 / EUR 1.00 / GBP 1.00 is required at all times.",
  "Deposits made in any other currency will remain in that currency in your WSA Pay account.",
  "For security, withdrawals will only be sent to the bank account(s) registered in your profile.",
  "Withdrawals above a certain amount may require additional verification.",
];

export const depositAccounts = {
  USD: [
    ["Beneficiary Bank (Field 57)", "Citibank N.A."],
    ["Beneficiary Bank Address", "111 Wall Street, New York, NY 10005 USA"],
    ["Beneficiary Bank SWIFT", "CITIUS33XXX"],
    ["ABA/Routing #", "026009593"],
    ["Beneficiary Name", "WSA USA, Inc."],
    ["Beneficiary Address", "210 North University Drive, Suite 700, Coral Springs, FL 33071, USA"],
    ["Beneficiary Account #", "9145101236"],
    ["Account Type", "Checking"],
    ["Payment Reference", "WSA Member ID + Company Name"],
  ],
  EUR: [
    ["Beneficiary Bank (Field 57)", "Royal Bank of Scotland"],
    ["Beneficiary Bank Address", "9-13 Paternoster Row, London EC4M 7EJ"],
    ["Beneficiary Bank SWIFT", "RBOSGB2L"],
    ["Sort Code", "16-00-32"],
    ["Beneficiary Name (Field 59)", "Caxton FX Limited"],
    ["Beneficiary Address", "Portland House, Bressenden Place, London SW1E 5BH"],
    ["Beneficiary Account #", "GB46 RBOS 1600 3210 1060 21"],
  ],
  GBP: [
    ["Beneficiary Bank (Field 57)", "Royal Bank of Scotland"],
    ["Beneficiary Bank Address", "9-13 Paternoster Row, London EC4M 7EJ"],
    ["Beneficiary Bank SWIFT", "RBOSGB2L"],
    ["Sort Code", "16-00-32"],
    ["Beneficiary Name (Field 59)", "Caxton FX Limited"],
    ["Beneficiary Account #", "GB46 RBOS 1600 3210 1060 22"],
  ],
} as const;
