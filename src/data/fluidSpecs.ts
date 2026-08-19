export interface FluidCapacity {
  system: string;
  capacityLiters: number;
  capacityQuarts: number;
  fluidType: string;
  recommendedSpec: string;
  serviceInterval: string;
  notes: string;
  criticalWarning?: string;
}

export const FLUID_SPECIFICATIONS: FluidCapacity[] = [
  {
    system: "Engine Oil (with Filter Change)",
    capacityLiters: 6.7,
    capacityQuarts: 7.1,
    fluidType: "Heavy-Duty Diesel Engine Oil (15W-40 or 10W-30)",
    recommendedSpec: "API CF-4, CI-4, or ACEA E7",
    serviceInterval: "Every 5,000 km (3,000 miles) or 6 months",
    notes: "Dry fill after full overhaul is 7.5 Liters. Standard oil pan with filter change is 6.7 Liters.",
    criticalWarning: "Do NOT use modern Low-SAPS synthetic oils designed for DPF engines if they lack high ZDDP/detergent pack needed for indirect diesel flat-tappet camshafts."
  },
  {
    system: "Cooling System",
    capacityLiters: 10.5,
    capacityQuarts: 11.1,
    fluidType: "Ethylene Glycol 50/50 Pre-mixed (Toyota Red Long Life)",
    recommendedSpec: "Phosphate-enhanced OAT (POAT) or standard low-silicate heavy duty diesel coolant",
    serviceInterval: "Every 40,000 km (25,000 miles) or 24 months",
    notes: "Capacity includes front engine block, radiator, expansion tank, and dual front/rear cabin heater cores.",
    criticalWarning: "Never mix green conventional coolant with Toyota red coolant. Never use straight water; the 2L-T cylinder head relies heavily on proper boiling point elevation (128°C under 0.9 bar cap)."
  },
  {
    system: "Manual Transmission (W56 / R150F / R151F)",
    capacityLiters: 3.0,
    capacityQuarts: 3.2,
    fluidType: "SAE 75W-90 High Performance Manual Transmission Fluid",
    recommendedSpec: "API GL-4 (Yellow Metal / Synchronizer Safe)",
    serviceInterval: "Every 40,000 km (25,000 miles)",
    notes: "Fill until fluid just begins to weep from the bottom of the upper 24mm fill plug hole on a level surface.",
    criticalWarning: "DO NOT USE standard API GL-5 hypoid gear oil in manual transmissions! GL-5 sulfur-phosphorus EP additives chemically attack and erode the brass synchronizer rings causing grindy shifts."
  },
  {
    system: "Automatic Transmission (A340H / A343F)",
    capacityLiters: 4.5,
    capacityQuarts: 4.8,
    fluidType: "Dexron II or Dexron III Automatic Transmission Fluid",
    recommendedSpec: "Dexron III / Mercon compliant ATF",
    serviceInterval: "Drain & Fill every 30,000 km (Dry overhaul capacity: 10.2 Liters)",
    notes: "Check fluid level on dipstick with engine running at idle, transmission in PARK, at normal operating temp (70-80°C).",
    criticalWarning: "A340H models have an integrated transfer case that shares or connects to the hydraulic circuit; verify transfer case fluid level during service."
  },
  {
    system: "Transfer Case (Manual Transmission Models)",
    capacityLiters: 1.4,
    capacityQuarts: 1.5,
    fluidType: "SAE 75W-90 Gear Oil",
    recommendedSpec: "API GL-4 or GL-5",
    serviceInterval: "Every 40,000 km (25,000 miles)",
    notes: "Separate oil reservoir from the manual transmission. Fill to bottom of side fill plug.",
    criticalWarning: "Verify whether your vehicle is manual (gear oil 75W-90) or automatic (uses ATF) before filling transfer case."
  },
  {
    system: "Front Differential (IFS 7.5\" 4WD)",
    capacityLiters: 1.6,
    capacityQuarts: 1.7,
    fluidType: "Hypoid Gear Oil SAE 75W-90 or 80W-90",
    recommendedSpec: "API GL-5",
    serviceInterval: "Every 40,000 km (25,000 miles)",
    notes: "ADD (Automatic Disconnecting Differential) equipped front axle uses standard GL-5 gear oil.",
  },
  {
    system: "Rear Differential (Solid 8.0\" Axle)",
    capacityLiters: 2.2,
    capacityQuarts: 2.3,
    fluidType: "Hypoid Gear Oil SAE 80W-90 (or 75W-140 for heavy towing/desert)",
    recommendedSpec: "API GL-5 (Add LSD friction modifier if equipped with OEM clutch-type LSD)",
    serviceInterval: "Every 40,000 km (25,000 miles) or immediately after deep water fording",
    notes: "Check axle housing tag: 'LSD ONLY' sticker indicates clutch pack differential requiring LSD additive (or dedicated LSD GL-5 oil).",
  },
  {
    system: "Power Steering Hydraulic Circuit",
    capacityLiters: 0.8,
    capacityQuarts: 0.85,
    fluidType: "Dexron II or Dexron III ATF",
    recommendedSpec: "ATF Dexron III",
    serviceInterval: "Inspect every 10,000 km; flush every 60,000 km",
    notes: "Toyota power steering systems use Automatic Transmission Fluid (ATF), not clear American power steering fluid.",
  },
  {
    system: "Brake & Clutch Hydraulic Master/Slave",
    capacityLiters: 1.0,
    capacityQuarts: 1.05,
    fluidType: "Heavy Duty Glycol Brake Fluid",
    recommendedSpec: "DOT 3 or DOT 4 (DOT 5.1 compatible, NOT silicone DOT 5)",
    serviceInterval: "Flush and replace every 2 years / 40,000 km",
    notes: "Bleed sequence: LSPV (Load Sensing Proportioning Valve) -> Rear Left -> Rear Right -> Front Left -> Front Right.",
  }
];

export interface GreasingPoint {
  id: number;
  location: string;
  component: string;
  greaseType: string;
  shots: string;
  notes: string;
}

export const CHASSIS_GREASE_ZERK_MAP: GreasingPoint[] = [
  {
    id: 1,
    location: "Front Propeller Shaft",
    component: "Front Universal Joint (Spider Cross)",
    greaseType: "NLGI No. 2 Lithium Base Chassis Grease (or Moly-Lithium)",
    shots: "2 - 4 pumps until clean grease purges past seals",
    notes: "Wipe zerk fitting clean before attaching grease gun coupler."
  },
  {
    id: 2,
    location: "Front Propeller Shaft",
    component: "Front Slip Yoke Spline",
    greaseType: "NLGI No. 2 Molybdenum Disulfide (Moly) Lithium Grease",
    shots: "1 - 2 pumps ONLY",
    notes: "CAUTION: Do not over-grease slip yoke. Excess grease can hydraulic-lock the shaft and destroy transfer case bearings upon suspension compression."
  },
  {
    id: 3,
    location: "Front Propeller Shaft",
    component: "Transfer Case Flange Universal Joint",
    greaseType: "NLGI No. 2 Lithium Base Grease",
    shots: "2 - 4 pumps until purge",
    notes: "Inspect spider needle bearings for play or rust staining."
  },
  {
    id: 4,
    location: "Rear Propeller Shaft",
    component: "Transmission/Transfer Output Double-Cardan Joint (Ball & Spiders)",
    greaseType: "NLGI No. 2 Extreme Pressure (EP) Lithium Complex Grease",
    shots: "3 - 5 pumps (Special flush needle fitting may be required for center ball)",
    notes: "Double-Cardan constant-velocity joint has a hidden center centering ball that must be lubricated to prevent high-speed driveline vibration."
  },
  {
    id: 5,
    location: "Rear Propeller Shaft",
    component: "Rear Slip Yoke Spline",
    greaseType: "NLGI No. 2 Molybdenum Disulfide (Moly) Lithium Grease",
    shots: "1 - 2 pumps ONLY",
    notes: "Check boot condition and clamp tightness."
  },
  {
    id: 6,
    location: "Rear Propeller Shaft",
    component: "Rear Differential Pinion Universal Joint",
    greaseType: "NLGI No. 2 Lithium Base Grease",
    shots: "2 - 4 pumps until clean grease purges",
    notes: "Ensure all 4 bearing caps purge evenly."
  },
  {
    id: 7,
    location: "Front Steering Linkage",
    component: "Steering Idler Arm Pivot Shaft",
    greaseType: "NLGI No. 2 Chassis Grease",
    shots: "2 - 3 pumps",
    notes: "Common wear item on IFS 4Runners. Check for up/down play while assistant wiggles steering wheel."
  },
  {
    id: 8,
    location: "Front Steering Linkage",
    component: "Tie Rod Ends & Drag Link Ball Joints (If greaseable aftermarket/OEM equipped)",
    greaseType: "NLGI No. 2 Chassis Grease",
    shots: "1 - 2 pumps until rubber boot swells slightly",
    notes: "Do not burst rubber dust boots."
  }
];
