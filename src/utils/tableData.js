export const halteTableData = [
  {
    haltNo: "1",
    haltTime: "10:30 AM",
    m1000: "13",
    m500: "17",
    m400: "18",
    m300: "16",
    m200: "12",
    m100: "11",
    halt: "0",
    profile: "Abrupt",
  },
  {
    haltNo: "2",
    haltTime: "12:30 AM",
    m1000: "13",
    m500: "17",
    m400: "18",
    m300: "16",
    m200: "12",
    m100: "11",
    halt: "0",
    profile: "Abrupt",
  },
  {
    haltNo: "3",
    haltTime: "12:30 AM",
    m1000: "13",
    m500: "17",
    m400: "18",
    m300: "16",
    m200: "12",
    m100: "11",
    halt: "0",
    profile: "Smooth",
  },
];

export const halteTableTitle = [
  { label: "Halt Station", key: "halt_name" },
  { label: "Halt Time", key: "halt_time" },
  { label: "1000m", key: "1000m" },
  { label: "500m", key: "500m" },
  { label: "400m", key: "400m" },
  { label: "300m", key: "300m" },
  { label: "200m", key: "200m" },
  { label: "100m", key: "100m" },
  { label: "Halt", key: "halt" },
  { label: "Remark", key: "remark" },
];

export const previousAnalysisTitle = ["Date of Wkg", "Loco", "From", "To"];

export const previousAnalysisData = [
  { "Date of Wkg": "26/05/2024", Loco: "33301", From: "PNVL", To: "CSTM" },
  { "Date of Wkg": "26/05/2024", Loco: "33302", From: "PUNE", To: "NDLS" },
  { "Date of Wkg": "26/05/2024", Loco: "33303", From: "HWH", To: "LTT" },
  { "Date of Wkg": "26/05/2024", Loco: "33304", From: "NGP", To: "ADI" },
  { "Date of Wkg": "26/05/2024", Loco: "33305", From: "JSLE", To: "BPL" },
  { "Date of Wkg": "26/05/2024", Loco: "33306", From: "NDLS", To: "HWH" },
  { "Date of Wkg": "26/05/2024", Loco: "33307", From: "BPL", To: "CSTM" },
  { "Date of Wkg": "26/05/2024", Loco: "33308", From: "LTT", To: "PNVL" },
  { "Date of Wkg": "26/05/2024", Loco: "33309", From: "ADI", To: "JSLE" },
  { "Date of Wkg": "26/05/2024", Loco: "33310", From: "CSTM", To: "PUNE" },
];

export const TSRTableTitle = [
  "Section",
  "From Km",
  "To Km",
  "Distance",
  "Speed",
  "Observed",
];

export const TSRTableData = [
  {
    Section: "DPL-PNVL",
    FromKm: "73.23",
    ToKm: "73.19",
    Distance: "0.04",
    Speed: "20",
    Observed: "OServe",
  },
  {
    Section: "BPNVL-KLMG2",
    FromKm: "63.25",
    ToKm: "62.29",
    Distance: "0.96",
    Speed: "30",
    Observed: "OServe",
  },
];

export const speedTestTableTitle = ["Test Con", "At Speed", "Speed Drop to "];
export const speedTestTableData = [
  {
    "Test Con": "BFT",
    "At Speed": "-",
    "Speed Drop to": "-",
  },
  {
    "Test Con": "BPT",
    "At Speed": "40",
    "Speed Drop to": "18",
  },
];

export const locations = [
  { id: 1, name: "ASN" },
  { id: 2, name: "BCQ" },
  { id: 3, name: "STN" },
  { id: 4, name: "KLC" },
  { id: 5, name: "ULT" },
  { id: 6, name: "BRR" },
  { id: 7, name: "KMME" },
  { id: 8, name: "MMU" },
  { id: 9, name: "TNW" },
  { id: 10, name: "KAO" },
  { id: 11, name: "CAM" },
  { id: 12, name: "PKA" },
  { id: 13, name: "DBH" },
  { id: 14, name: "DHN" },
  { id: 15, name: "BLI" },
  { id: 16, name: "TET" },
  { id: 17, name: "NPJE" },
  { id: 18, name: "MRQ" },
  { id: 19, name: "IBP" },
  { id: 20, name: "GMO" },
];
