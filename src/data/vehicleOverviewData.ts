export interface ModelPlateDecoder {
  field: string;
  example: string;
  meaning: string;
  notes: string;
}

export const MODEL_CODE_DECODER: ModelPlateDecoder[] = [
  { field: "Model Prefix", example: "LN130", meaning: "L = L-Series Diesel Engine | N = Hilux / 4Runner Platform | 130 = 2nd Gen 4-Link Chassis", notes: "LN130 designates 2L-T (2.4L Turbo Diesel) or 3L (2.8L NA Diesel)" },
  { field: "Body Type", example: "G", meaning: "Wagon (4-Door / 2-Door SUV body with glass tailgate)", notes: "Also designated as Hilux Surf SSR / SSR-X / SSR-G in JDM markets" },
  { field: "Transmission Code", example: "K (Manual) / P (Auto)", meaning: "K = 5-Speed Manual Floor Shift | P = 4-Speed Automatic Column/Floor", notes: "Manual = R150F / R151F or W56 | Auto = A340H / A343F" },
  { field: "Grade / Trim", example: "M", meaning: "Mid/High Grade (SSR-X / SR5 equivalent)", notes: "Features power windows, rear heater core, electronic tailgate window" },
  { field: "Engine Induction", example: "G", meaning: "Turbocharged Diesel with OHC (2L-T / 2L-TE)", notes: "Mechanical injection on 2L-T; EFI-Diesel on 2L-TE" },
  { field: "Destination", example: "T", meaning: "Japan Domestic Market / General Export specification", notes: "12V electrical system (24V on some heavy-duty Land Cruiser 70s)" }
];

export const AXLE_CODE_DECODER = [
  { code: "G144", ringGear: "8.0\" (G)", ratio: "4.875:1 (14)", diffType: "4-Pinion Open (4)" },
  { code: "G145", ringGear: "8.0\" (G)", ratio: "4.875:1 (14)", diffType: "4-Pinion Limited Slip Differential / LSD (5)" },
  { code: "G284", ringGear: "8.0\" (G)", ratio: "4.556:1 (28)", diffType: "4-Pinion Open (4)" },
  { code: "G285", ringGear: "8.0\" (G)", ratio: "4.556:1 (28)", diffType: "4-Pinion Limited Slip Differential / LSD (5)" },
  { code: "G254", ringGear: "8.0\" (G)", ratio: "4.556:1 (25)", diffType: "2-Pinion Open (4)" }
];

export const VEHICLE_DIMENSIONS = [
  { item: "Wheelbase", value: "2,625 mm (103.3 in)" },
  { item: "Overall Length", value: "4,490 mm (176.8 in)" },
  { item: "Overall Width", value: "1,690 mm (66.5 in) / 1,790 mm with SSR-G Wide Fender Flares" },
  { item: "Overall Height", value: "1,745 mm (68.7 in)" },
  { item: "Front Track", value: "1,430 mm (56.3 in)" },
  { item: "Rear Track", value: "1,425 mm (56.1 in)" },
  { item: "Curb Weight", value: "1,720 – 1,840 kg (3,790 – 4,050 lbs)" },
  { item: "Fuel Tank Capacity", value: "65 Liters (17.2 US Gallons)" },
  { item: "Front Suspension", value: "Independent Double Wishbone with 22.8mm Torsion Bars & Hydraulic Shocks" },
  { item: "Rear Suspension", value: "4-Link Solid Axle with Coil Springs, Lateral Panhard Rod & Stabilizer Bar" },
  { item: "Steering System", value: "Recirculating Ball with Integral Hydraulic Power Assist (Ratio: 19.5:1)" },
  { item: "Braking System", value: "Front 4-Piston Fixed Calipers (Ventilated Discs) / Rear Leading-Trailing Drums with LSPV" }
];
