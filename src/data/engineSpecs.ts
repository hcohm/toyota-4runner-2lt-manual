export interface EngineSpecification {
  category: string;
  items: {
    label: string;
    value: string;
    unit?: string;
    notes?: string;
    critical?: boolean;
  }[];
}

export const ENGINE_SPECS_2LT: EngineSpecification[] = [
  {
    category: "General Engine Specifications",
    items: [
      { label: "Engine Code", value: "2L-T (Gen 2 Turbo Diesel)" },
      { label: "Configuration", value: "Inline 4-Cylinder, SOHC 8-Valve" },
      { label: "Displacement", value: "2,446 cc (2.4 Liter)" },
      { label: "Bore × Stroke", value: "92.0 mm × 92.0 mm (Square)" },
      { label: "Compression Ratio", value: "20.0:1 (Gen 2 LN130) / 21.0:1 (Gen 1)" },
      { label: "Max Power Output", value: "90-97 PS (66-71 kW) @ 3,800 - 4,000 RPM" },
      { label: "Max Torque Output", value: "216-221 Nm (159-163 ft-lb) @ 2,400 RPM" },
      { label: "Firing Order", value: "1 - 3 - 4 - 2" },
      { label: "Idle Speed", value: "700 ± 50 RPM (Manual) / 750 ± 50 RPM (Auto in N)" },
      { label: "Max Governed Engine Speed", value: "4,600 ± 100 RPM" },
    ],
  },
  {
    category: "Cylinder Block & Piston Fitment",
    items: [
      { label: "Cylinder Bore Standard", value: "92.000 – 92.030 mm" },
      { label: "Max Cylinder Bore Wear Limit", value: "92.20 mm" },
      { label: "Piston-to-Cylinder Clearance", value: "0.040 – 0.060 mm" },
      { label: "Piston Protrusion (Crank @ TDC)", value: "0.68 – 0.97 mm", notes: "Used to determine Cylinder Head Gasket thickness Grade (B, D, or F)", critical: true },
      { label: "Piston Ring End Gap (Top)", value: "0.30 – 0.47 mm (Limit: 1.07 mm)" },
      { label: "Piston Ring End Gap (2nd)", value: "0.40 – 0.57 mm (Limit: 1.17 mm)" },
      { label: "Piston Ring End Gap (Oil)", value: "0.20 – 0.47 mm (Limit: 1.07 mm)" },
    ],
  },
  {
    category: "Cylinder Head & Valvetrain",
    items: [
      { label: "Head Material", value: "Cast Iron with Ceramic-coated Swirl Pre-Chambers", critical: true },
      { label: "Valvetrain Type", value: "Direct Cam-on-Bucket with Outer Adjusting Shims (Gen 2)", notes: "Earlier 2L-T used adjustable rocker arms" },
      { label: "Valve Clearance (Intake - Cold)", value: "0.20 – 0.30 mm (Target: 0.25 mm)", critical: true },
      { label: "Valve Clearance (Exhaust - Cold)", value: "0.40 – 0.50 mm (Target: 0.45 mm)", critical: true },
      { label: "Head Warpage Limit (Block Surface)", value: "0.15 mm (0.0059 in)", notes: "Any warpage >0.20mm requires resurfacing or head replacement", critical: true },
      { label: "Valve Seat Angle", value: "45°" },
      { label: "Valve Margin Thickness Limit", value: "Intake: 0.8 mm / Exhaust: 0.9 mm" },
      { label: "Valve Spring Free Length", value: "46.20 mm (Limit: 45.20 mm)" },
    ],
  },
  {
    category: "Compression Testing Specs",
    items: [
      { label: "Standard Compression Pressure", value: "30.0 kg/cm² (427 psi) @ 250 RPM", critical: true },
      { label: "Minimum Compression Pressure", value: "20.0 kg/cm² (284 psi)", critical: true },
      { label: "Max Allowable Difference Between Cylinders", value: "5.0 kg/cm² (71 psi)", critical: true },
      { label: "Testing Requirement", value: "Engine at normal operating temperature, remove all 4 glow plugs or injectors, disconnect fuel cut solenoid 12V terminal to stop fuel spray." },
    ],
  },
  {
    category: "Turbocharger System (Toyota CT20)",
    items: [
      { label: "Turbo Model", value: "Toyota CT20 (Single Scroll, Internal Wastegate)" },
      { label: "Cooling & Lubrication", value: "Engine Oil lubricated + Engine Coolant jacket cooled", critical: true },
      { label: "Standard Boost Pressure", value: "0.50 – 0.72 bar (7.1 – 10.2 psi / 51 – 73 kPa)", critical: true },
      { label: "Wastegate Actuator Opening Pressure", value: "0.78 – 0.84 bar (11.3 – 12.2 psi) for 0.38 mm stroke" },
      { label: "Turbine Shaft Axial Play Limit", value: "0.08 mm (0.0031 in)" },
      { label: "Turbine Shaft Radial Play Limit", value: "0.18 mm (0.0071 in)" },
      { label: "Safe Exhaust Gas Temperature (EGT)", value: "< 650°C (1200°F) Pre-Turbo", notes: "Temperatures above 720°C cause cylinder head cracking and turbine wheel thermal erosion", critical: true },
    ],
  },
  {
    category: "Fuel Injection System (Bosch VE Rotary Pump)",
    items: [
      { label: "Injection Pump Type", value: "Nippondenso / Bosch VE Mechanical Rotary Distributor" },
      { label: "Plunger Diameter", value: "10.0 mm" },
      { label: "Plunger Stroke at TDC (Static Timing)", value: "0.58 – 0.64 mm", notes: "Measured at rear distributor head center plug with dial indicator SST 09275-54011", critical: true },
      { label: "Cold Start Advance Device (ACSD)", value: "Wax element thermostatic advance on pump body" },
      { label: "Injection Nozzle Type", value: "Throttle Type (Nippondenso DN4PD57 or DN0PDN112)" },
      { label: "Injection Nozzle Opening Pressure (New)", value: "145 – 155 kg/cm² (2,062 – 2,204 psi)", critical: true },
      { label: "Injection Nozzle Opening Pressure (Re-used)", value: "135 – 155 kg/cm² (1,920 – 2,204 psi)" },
      { label: "Fuel Cut Solenoid Resistance", value: "9.5 – 11.5 Ω @ 20°C (12V Switched)" },
    ],
  },
  {
    category: "Super Glow Pre-Heating Electrical System",
    items: [
      { label: "System Architecture", value: "Super Glow II (Dual-Relay with dropping resistor)" },
      { label: "Glow Plug Type", value: "6.0V Ceramic / Fast-Heating Metallic with Self-Regulation" },
      { label: "Glow Plug Resistance", value: "0.65 – 0.85 Ω @ 20°C (Measure with wire bridge removed)", critical: true },
      { label: "Glow Relay No. 1", value: "Applies direct 12V to plugs during initial 2-6 sec pre-glow" },
      { label: "Glow Relay No. 2", value: "Feeds ~6V via Dropping Resistor during cranking & after-glow (up to 180 sec until coolant > 60°C)" },
      { label: "Dropping Resistor Resistance", value: "0.02 – 0.04 Ω (Mounted on intake plenum)" },
      { label: "Water Temperature Sensor (for Glow Timer)", value: "2.1 – 2.7 kΩ @ 20°C / 0.28 – 0.36 kΩ @ 80°C" },
    ],
  },
  {
    category: "Lubrication System",
    items: [
      { label: "Oil Pump Type", value: "Trochoid gear driven directly by crankshaft" },
      { label: "Oil Pressure (Idle)", value: "> 0.3 kg/cm² (4.3 psi) @ 700 RPM", critical: true },
      { label: "Oil Pressure (3,000 RPM)", value: "2.5 – 5.0 kg/cm² (36 – 71 psi) @ normal temp", critical: true },
      { label: "Oil Cooler", value: "Engine block integrated water-to-oil heat exchanger with relief valve" },
      { label: "Relief Valve Opening Pressure", value: "4.5 – 5.5 kg/cm² (64 – 78 psi)" },
    ],
  },
  {
    category: "Cooling System",
    items: [
      { label: "Thermostat Opening Temperature", value: "82°C (180°F) Standard / 88°C (190°F) Cold climate" },
      { label: "Thermostat Full Open Temperature", value: "95°C (203°F) with valve lift > 8.5 mm" },
      { label: "Radiator Cap Relief Pressure", value: "0.9 ± 0.15 kg/cm² (12.8 ± 2.1 psi / 88 kPa)" },
      { label: "Viscous Fan Clutch Coupling", value: "Silicone fluid thermal bimetallic valve (10,000 cSt fluid)" },
      { label: "Cooling System Capacity", value: "10.0 – 10.5 Liters (With front/rear heater cores)" },
    ],
  }
];

export const GASKET_THICKNESS_SELECTOR = [
  {
    grade: "Grade B (1-Notch / Cutout B)",
    protrusionMin: 0.68,
    protrusionMax: 0.77,
    installedThickness: "1.45 ± 0.05 mm",
    description: "Lowest piston protrusion. Use when pistons protrude between 0.68mm and 0.77mm above the deck."
  },
  {
    grade: "Grade D (2-Notches / Cutout D)",
    protrusionMin: 0.78,
    protrusionMax: 0.87,
    installedThickness: "1.55 ± 0.05 mm",
    description: "Standard mid-range protrusion. Most common factory specification (0.78mm to 0.87mm)."
  },
  {
    grade: "Grade F (3-Notches / Cutout F)",
    protrusionMin: 0.88,
    protrusionMax: 0.97,
    installedThickness: "1.65 ± 0.05 mm",
    description: "Highest piston protrusion (0.88mm to 0.97mm). Prevents piston-to-valve or piston-to-head collision."
  }
];

export const SHIM_SIZES_TOYOTA = [
  { size: 2.50, partNo: "13753-54010" },
  { size: 2.55, partNo: "13753-54020" },
  { size: 2.60, partNo: "13753-54030" },
  { size: 2.65, partNo: "13753-54040" },
  { size: 2.70, partNo: "13753-54050" },
  { size: 2.75, partNo: "13753-54060" },
  { size: 2.80, partNo: "13753-54070" },
  { size: 2.85, partNo: "13753-54080" },
  { size: 2.90, partNo: "13753-54090" },
  { size: 2.95, partNo: "13753-54100" },
  { size: 3.00, partNo: "13753-54110" },
  { size: 3.05, partNo: "13753-54120" },
  { size: 3.10, partNo: "13753-54130" },
  { size: 3.15, partNo: "13753-54140" },
  { size: 3.20, partNo: "13753-54150" },
  { size: 3.25, partNo: "13753-54160" },
  { size: 3.30, partNo: "13753-54170" }
];
