export interface ToleranceSpec {
  item: string;
  standard: string;
  wearLimit: string;
  notes?: string;
}

export interface ManualSubsection {
  id: string;
  title: string;
  summary: string;
  specifications: ToleranceSpec[];
  torques: { fastener: string; nm: number; ftlb: number; note?: string }[];
  steps: string[];
  proTips: string[];
}

export interface ManualChapter {
  id: string;
  chapterNumber: number;
  title: string;
  category: string;
  iconName: string;
  description: string;
  subsections: ManualSubsection[];
}

export const MASTER_MANUAL_CHAPTERS: ManualChapter[] = [
  // =========================================================================
  // CHAPTER 1: TUNE-UP, ROUTINE MAINTENANCE & SERVICE INTERVALS
  // =========================================================================
  {
    id: "chapter-1-maintenance",
    chapterNumber: 1,
    title: "Tune-Up, Routine Maintenance & Service Intervals",
    category: "Maintenance",
    iconName: "Clock",
    description: "Complete factory periodic maintenance schedules, fluid change intervals, drive belt deflections, idle speed calibrations, and valve clearance checks.",
    subsections: [
      {
        id: "routine-service-schedule",
        title: "Factory Service Interval Matrix (5k - 100k km)",
        summary: "Toyota factory maintenance schedule for severe operating conditions (dusty roads, towing, cold climates, off-road driving).",
        specifications: [
          { item: "Engine Oil & Filter (15W-40 API CF-4)", standard: "Every 5,000 km (3,000 mi)", wearLimit: "Max 7,500 km", notes: "Always pre-fill oil filter with clean oil" },
          { item: "Diesel Fuel Filter (23303-64010)", standard: "Every 20,000 km (12,000 mi)", wearLimit: "Max 30,000 km", notes: "Drain sedimenter bowl water every 5,000 km" },
          { item: "Air Cleaner Element (Dry Paper)", standard: "Inspect 10,000 km / Replace 40,000 km", wearLimit: "Blow out with compressed air from inside", notes: "Never wash dry paper element in solvent" },
          { item: "Engine Coolant (Toyota Red LLC 50/50)", standard: "Every 40,000 km or 24 Months", wearLimit: "10.5 Liters total capacity", notes: "Always use distilled water only" },
          { item: "Manual Transmission (API GL-4 75W-90)", standard: "Every 40,000 km (24,000 mi)", wearLimit: "Capacity: 3.0 L (W56) / 3.9 L (R150F)", notes: "CRITICAL: Do NOT use GL-5 (corrodes brass synchros)" },
          { item: "Transfer Case (API GL-4/GL-5 75W-90)", standard: "Every 40,000 km (24,000 mi)", wearLimit: "Capacity: 1.4 Liters", notes: "Top-fill to lower lip of fill plug hole" },
          { item: "Front & Rear Differentials (API GL-5)", standard: "Every 40,000 km (20,000 km if submerged)", wearLimit: "Front: 1.6 L | Rear 8.0\": 2.2 L", notes: "If LSD equipped, add friction modifier" },
          { item: "Chassis Driveshaft Grease Zerks (8 Points)", standard: "Every 5,000 km (3,000 mi)", wearLimit: "NLGI No. 2 Lithium / Moly", notes: "Caution: 2-3 pumps only on slip yokes" },
          { item: "Valve Lash Clearance (Cold Spec)", standard: "Inspect every 40,000 km (24,000 mi)", wearLimit: "Intake: 0.20-0.30mm | Exhaust: 0.40-0.50mm", notes: "Adjust using Toyota 0.05mm increment shims" },
          { item: "Timing Belt (130 Teeth / 13568-59065)", standard: "Every 100,000 km (60,000 mi)", wearLimit: "Mandatory replacement", notes: "Replace tensioner idler & water pump simultaneously" }
        ],
        torques: [
          { fastener: "Engine Oil Pan Drain Plug", nm: 34, ftlb: 25, note: "Replace 12mm crush washer" },
          { fastener: "Transmission Drain & Fill Plugs (24mm)", nm: 37, ftlb: 27, note: "New aluminum crush washer" },
          { fastener: "Transfer Case Drain & Fill Plugs (24mm)", nm: 37, ftlb: 27 },
          { fastener: "Front/Rear Differential Drain Plugs (24mm)", nm: 49, ftlb: 36, note: "Clean magnetic sludge collector" }
        ],
        steps: [
          "1. Engine warm-up: Run engine for 5 minutes to suspend contaminants before draining oil.",
          "2. Complete oil drain: Remove 14mm oil pan plug and block drain cock (behind oil filter). Allow 15 minutes of gravity drainage.",
          "3. Pre-fill oil filter: Fill new filter with 500ml of clean 15W-40 oil before spinning onto bracket. Lubricate rubber gasket with oil.",
          "4. Greasing: Wipe clean all 8 chassis zerk fittings. Pump moly grease into universal spiders until fresh grease emerges past seals; pump ONLY 2-3 strokes into slip yokes.",
          "5. Battery service: Clean battery terminals with wire brush and baking soda solution. Coat with petroleum jelly. Verify electrolyte level above upper level mark."
        ],
        proTips: [
          "Over-greasing the slip yoke can hydraulically lock the driveshaft, blowing out the transfer case rear output bearing on full rear suspension compression.",
          "In cold winter climates (below -10°C), switch engine oil to 10W-30 or 5W-40 synthetic CI-4 to reduce starter motor drag on cold mornings."
        ]
      },
      {
        id: "idle-and-drive-belts",
        title: "Idle Speed, A/C Idle-Up & Drive Belt Deflection",
        summary: "Standard engine idle speed adjustment, A/C compensation VSV diaphragm tuning, and V-belt tensioning.",
        specifications: [
          { item: "Standard Engine Idle Speed (Warm Engine)", standard: "700 ± 50 RPM", wearLimit: "650 – 750 RPM", notes: "Adjust via VE pump throttle idle stop screw" },
          { item: "A/C Compressor Idle-Up Speed", standard: "850 ± 50 RPM", wearLimit: "800 – 900 RPM", notes: "Vacuum actuator on side of pump" },
          { item: "Alternator / Fan Belt Deflection (New Belt)", standard: "7.0 – 9.0 mm (0.28 – 0.35 in)", wearLimit: "Limit: 12.0 mm (0.47 in)", notes: "Measured midway with 10 kg (22 lb) thumb press" },
          { item: "Power Steering Belt Deflection", standard: "9.0 – 11.0 mm (0.35 – 0.43 in)", wearLimit: "Limit: 14.0 mm (0.55 in)", notes: "Measured between PS pump and crank pulley" },
          { item: "A/C Compressor Belt Deflection", standard: "8.0 – 10.0 mm (0.31 – 0.39 in)", wearLimit: "Limit: 13.0 mm (0.51 in)", notes: "Adjust via idler pulley tensioner bolt" }
        ],
        torques: [
          { fastener: "Alternator Pivot Bolt (14mm)", nm: 54, ftlb: 40 },
          { fastener: "Alternator Adjuster Lock Bolt (12mm)", nm: 19, ftlb: 14 },
          { fastener: "Power Steering Idler Locknut (14mm)", nm: 43, ftlb: 32 }
        ],
        steps: [
          "1. Warm engine to full operating temperature (coolant temp > 80°C).",
          "2. Connect an optical or diesel inductive tachometer to injection line #1.",
          "3. Check base idle: Must be 700 RPM. If incorrect, loosen 10mm locknut on the mechanical idle stop screw on the VE pump throttle arm, adjust slotted screw, and retighten locknut.",
          "4. Turn A/C switch ON: Vacuum actuator should pull throttle lever forward to 850 RPM. Adjust vacuum rod length if RPM drops below 800.",
          "5. Belt tension check: Press firmly on belt midway between pulleys with 10 kg force. Deflection should be 7-9 mm. To tighten, loosen alternator pivot and adjuster lock bolts, pry alternator outward with wooden lever, and torque lock bolt."
        ],
        proTips: [
          "Never overtighten V-belts; excessive belt tension causes rapid failure of the water pump bearing and front alternator bearing.",
          "If drive belts squeal on cold starts, clean glaze from pulley V-grooves with a wire brush and spray with belt dressing or replace hardened belts."
        ]
      }
    ]
  },

  // =========================================================================
  // CHAPTER 2: 2L-T ENGINE MECHANICAL OVERHAUL & REBUILDING
  // =========================================================================
  {
    id: "chapter-2-engine-overhaul",
    chapterNumber: 2,
    title: "2L-T Engine Mechanical Overhaul & Block Rebuilding",
    category: "Engine",
    iconName: "Wrench",
    description: "Complete machine shop blueprint tolerances: cylinder bore limits, piston ring end gaps, crankshaft journal clearances, camshaft lobe heights, and valve guide wear limits.",
    subsections: [
      {
        id: "cylinder-block-and-pistons",
        title: "Cylinder Block, Bore Limits, Pistons & Rings",
        summary: "Bore measurements, piston-to-wall clearances, ring end gaps, and piston protrusion grade selection.",
        specifications: [
          { item: "Cylinder Bore Standard Diameter", standard: "92.000 – 92.030 mm (3.6220 – 3.6232 in)", wearLimit: "Max Limit: 92.230 mm (0.009 in wear)", notes: "Measure at top, middle, and bottom in X and Y axes" },
          { item: "Cylinder Bore Out-of-Round / Taper", standard: "< 0.010 mm (0.0004 in)", wearLimit: "Limit: 0.020 mm (0.0008 in)", notes: "Rebore to 0.50mm / 1.00mm oversize if exceeded" },
          { item: "Piston-to-Cylinder Wall Clearance", standard: "0.040 – 0.060 mm (0.0016 – 0.0024 in)", wearLimit: "Limit: 0.140 mm (0.0055 in)", notes: "Measure piston skirt 14mm up from bottom edge" },
          { item: "Top Piston Compression Ring End Gap", standard: "0.250 – 0.450 mm (0.0098 – 0.0177 in)", wearLimit: "Limit: 1.050 mm (0.0413 in)", notes: "Push ring 110mm down bore using inverted piston" },
          { item: "Second Compression Ring End Gap", standard: "0.350 – 0.600 mm (0.0138 – 0.0236 in)", wearLimit: "Limit: 1.200 mm (0.0472 in)", notes: "Install with stamped '2T' mark facing UP" },
          { item: "Oil Control Ring (3-Piece) End Gap", standard: "0.200 – 0.500 mm (0.0079 – 0.0197 in)", wearLimit: "Limit: 1.000 mm (0.0394 in)", notes: "Stagger end gaps 120° apart from compression rings" },
          { item: "Piston Protrusion above Deck at TDC", standard: "0.680 – 0.970 mm", wearLimit: "Grades: B (0.68-0.77), D (0.78-0.87), F (0.88-0.97)", notes: "Determines cylinder head gasket thickness grade" },
          { item: "Cylinder Block Top Surface Flatness", standard: "< 0.050 mm (0.0020 in)", wearLimit: "Limit: 0.150 mm (0.0059 in)", notes: "Measure across diagonal with precision straight edge" }
        ],
        torques: [
          { fastener: "Main Bearing Cap Bolts (17mm)", nm: 103, ftlb: 76, note: "Torque in 3 passes from center outward" },
          { fastener: "Connecting Rod Cap Bolts (12-Pt 14mm)", nm: 54, ftlb: 40, note: "Plus +90° angle turn (Torque-to-Yield)" },
          { fastener: "Flywheel Mounting Bolts (17mm)", nm: 123, ftlb: 91, note: "Apply threadlocker to bolt threads" }
        ],
        steps: [
          "1. Cylinder bore inspection: Use an inside micrometer/bore gauge at 3 depths (10mm, 60mm, and 110mm from deck). Calculate taper and out-of-round.",
          "2. Ring end gap measurement: Push each new ring 110mm down the cylinder bore using an inverted piston crown. Measure gap with feeler gauge. File ring ends if gap is tighter than 0.25mm.",
          "3. Piston assembly: Heat piston crown in warm oil bath (60°C) before inserting wrist pin through connecting rod small-end brass bushing. Install new snap rings.",
          "4. Ring orientation: Space top ring gap at 45° from thrust face; second ring gap at 180° from top ring; oil expander gap at 90° from compression rings. Never align ring gaps with wrist pin axis.",
          "5. Piston installation: Compress rings with ring compressor tool. Coat cylinder bore and bearing shells with clean assembly lube. Tap piston crown gently with wooden hammer handle into bore.",
          "6. Rod cap torquing: Verify rod side clearance (Standard: 0.15-0.30mm, Limit: 0.35mm). Torque rod bolts to 54 Nm, then rotate an additional 90°."
        ],
        proTips: [
          "Always measure deck piston protrusion on all 4 cylinders at absolute TDC. A 2L-T with mismatched gasket thickness will suffer either piston-to-head contact or lost compression resulting in hard cold starting.",
          "Ensure connecting rod oil squirt holes point toward the intake side of the engine block to properly cool piston crowns."
        ]
      },
      {
        id: "crankshaft-and-camshaft",
        title: "Crankshaft, Bearings, Camshaft & Valvetrain Tolerances",
        summary: "Plastigage oil clearance measurement, crankshaft end play, camshaft lobe dimensions, and valve guide limits.",
        specifications: [
          { item: "Crankshaft Main Journal Diameter", standard: "62.000 – 62.020 mm (2.4409 – 2.4417 in)", wearLimit: "Limit: 61.980 mm", notes: "Main bearing journal standard size" },
          { item: "Connecting Rod Crankpin Journal Diameter", standard: "53.000 – 53.020 mm (2.0866 – 2.0874 in)", wearLimit: "Limit: 52.980 mm", notes: "Crankpin journal standard size" },
          { item: "Main Bearing Oil Clearance (Plastigage)", standard: "0.025 – 0.055 mm (0.0010 – 0.0022 in)", wearLimit: "Max Limit: 0.100 mm (0.0039 in)", notes: "Measure with Plastigage (do NOT rotate crank)" },
          { item: "Rod Bearing Oil Clearance (Plastigage)", standard: "0.025 – 0.055 mm (0.0010 – 0.0022 in)", wearLimit: "Max Limit: 0.100 mm (0.0039 in)", notes: "Measure with Plastigage" },
          { item: "Crankshaft Thrust Washer End Play", standard: "0.040 – 0.240 mm (0.0016 – 0.0094 in)", wearLimit: "Max Limit: 0.300 mm (0.0118 in)", notes: "Thrust washers on center main #3 journal" },
          { item: "Crankshaft Total Radial Runout", standard: "< 0.030 mm (0.0012 in)", wearLimit: "Limit: 0.060 mm (0.0024 in)", notes: "Measured at #3 center main on V-blocks" },
          { item: "Camshaft Intake Lobe Height", standard: "51.910 – 52.010 mm (2.0437 – 2.0476 in)", wearLimit: "Min Limit: 51.410 mm (2.0240 in)", notes: "Replace camshaft if worn beyond limit" },
          { item: "Camshaft Exhaust Lobe Height", standard: "53.950 – 54.050 mm (2.1240 – 2.1279 in)", wearLimit: "Min Limit: 53.450 mm (2.1043 in)", notes: "Measure with outside micrometer" },
          { item: "Camshaft Journal Oil Clearance", standard: "0.025 – 0.066 mm (0.0010 – 0.0026 in)", wearLimit: "Limit: 0.100 mm (0.0039 in)", notes: "5 journal bearing caps" },
          { item: "Valve Spring Free Length", standard: "47.00 mm (1.850 in)", wearLimit: "Min Limit: 45.80 mm (1.803 in)", notes: "Check spring squareness limit: < 2.0 mm" }
        ],
        torques: [
          { fastener: "Camshaft Bearing Cap Bolts (12mm)", nm: 18, ftlb: 13, note: "Torque in criss-cross order from center" },
          { fastener: "Camshaft Sprocket Center Bolt (19mm)", nm: 98, ftlb: 72, note: "Hold cam hex with 24mm wrench" },
          { fastener: "Crankshaft Harmonic Balancer Bolt (19mm)", nm: 167, ftlb: 123, note: "Use SST 09213-60017 holder" }
        ],
        steps: [
          "1. Crankshaft Plastigage check: Wipe main journals clean. Place Plastigage strip across each journal. Install main caps and torque to 103 Nm (do NOT spin crankshaft). Remove caps and measure squashed width against gauge envelope.",
          "2. Thrust washer installation: Place upper thrust washers in #3 main journal with oil grooves facing OUTWARD toward crankshaft web. Install main cap and check end play with dial indicator.",
          "3. Camshaft installation: Lubricate cam journals with assembly lube. Lower camshaft into cylinder head with lobes for #1 pointing upward. Install 5 bearing caps in numbered order (arrows pointing forward) and torque to 18 Nm in progressive passes.",
          "4. Front & rear crank seals: Drive new Viton oil seals into oil pump front housing and rear main retainer plate using seal driver SST until flush with housing surface."
        ],
        proTips: [
          "Installing crankshaft thrust washers backward (oil grooves facing inward toward block) will starve the thrust surface of oil, resulting in catastrophic thrust bearing weld within 100 km.",
          "Always replace connecting rod bolts during major rebuilds. They are torque-to-yield stretch fasteners subjected to extreme diesel combustion forces."
        ]
      }
    ]
  },

  // =========================================================================
  // CHAPTER 3: DRIVETRAIN & 4WD SYSTEMS (MANUAL, AUTO, TRANSFER & AXLES)
  // =========================================================================
  {
    id: "chapter-3-drivetrain",
    chapterNumber: 3,
    title: "Drivetrain, Transmissions & 4WD Transfer Case",
    category: "Drivetrain",
    iconName: "Compass",
    description: "Manual W56 & R150F gear ratios, A340H automatic transmission pressure specs, VF1A transfer case rebuild, and front/rear axle backlash setup.",
    subsections: [
      {
        id: "transmissions-and-transfer",
        title: "W56 / R150F Manual & A340H Automatic Transmissions",
        summary: "Gearbox ratios, synchronizer clearances, automatic transmission hydraulic line pressures, and transfer case chain tolerances.",
        specifications: [
          { item: "R150F Manual Gear Ratios", standard: "1st: 3.830 | 2nd: 2.062 | 3rd: 1.436 | 4th: 1.000 | 5th: 0.838 | Rev: 4.220", wearLimit: "Synchro ring to gear face gap: > 0.80 mm", notes: "Requires API GL-4 ONLY (3.0 Liters)" },
          { item: "W56 Manual Gear Ratios", standard: "1st: 3.954 | 2nd: 2.141 | 3rd: 1.384 | 4th: 1.000 | 5th: 0.850 | Rev: 4.091", wearLimit: "Synchro ring gap limit: 0.60 mm", notes: "Requires API GL-4 ONLY (3.0 Liters)" },
          { item: "A340H Automatic Hydraulic Line Pressure", standard: "Idle: 4.0 – 4.6 bar (57 – 65 psi) | Stall: 11.2 – 13.5 bar (160 – 192 psi)", wearLimit: "D-Range Stall Speed: 2,100 ± 150 RPM", notes: "Requires Toyota ATF D-II / Dexron III" },
          { item: "VF1A / RF1A Transfer Case Ratios", standard: "High: 1.000:1 | Low: 2.566:1", wearLimit: "Drive chain deflection slack: < 10.0 mm", notes: "Capacity: 1.4 Liters API GL-4 / GL-5" },
          { item: "Clutch Pedal Free Play & Height", standard: "Pedal Height: 148 – 158 mm | Free Play: 5.0 – 15.0 mm", wearLimit: "Release fork travel: 12 – 15 mm", notes: "Adjust via pushrod clevis locknut" },
          { item: "Front / Rear Driveshaft Radial Runout", standard: "< 0.30 mm (0.012 in)", wearLimit: "Max Limit: 0.80 mm (0.031 in)", notes: "Measure at center of tube with dial indicator" }
        ],
        torques: [
          { fastener: "Bellhousing to Engine Block Bolts (14mm/17mm)", nm: 72, ftlb: 53 },
          { fastener: "Transmission Crossmember to Frame Bolts", nm: 65, ftlb: 48 },
          { fastener: "Driveshaft Flange Locknuts (M10 High-Tensile)", nm: 74, ftlb: 55, note: "Never reuse stripped locknuts" },
          { fastener: "Clutch Master Cylinder Mounting Nuts", nm: 13, ftlb: 9 }
        ],
        steps: [
          "1. Clutch pedal adjustment: Measure distance from floorboard sound deadener to pedal pad. Loosen clevis locknut and rotate master cylinder pushrod until pedal height is 153mm. Check that free play at pedal tip is 5-15mm before resistance begins.",
          "2. Hydraulic clutch bleeding: Fill master cylinder reservoir with DOT 4 fluid. Attach clear hose to slave cylinder bleeder screw. Have assistant depress clutch pedal 3 times and hold down; open bleeder screw to purge air; close bleeder before pedal is released. Repeat until bubble-free.",
          "3. Transfer case chain check: With transfer case split, push down on the silent drive chain midway between sprockets. If slack exceeds 10mm or chain contacts internal aluminum case ribs under acceleration, replace chain and sprockets.",
          "4. Double cardan CV joint greasing: Locate the needle-point flush zerk recessed inside the center ball casting of the rear driveshaft front double-cardan joint. Use a needle-adapter grease gun to inject 3 pumps of lithium complex grease directly into the centering ball socket."
        ],
        proTips: [
          "90% of manual transmission 'hard shifting into 2nd gear' complaints are caused by previous owners putting API GL-5 gear oil in the gearbox. The sulfur-phosphorus EP additives chemically attack yellow brass synchronizer rings. Flush and refill with pure API GL-4.",
          "The A340H automatic transmission shares hydraulic fluid between the main gearbox and the integrated transfer case hydraulic clutch pack. Always check fluid level in both dipsticks with engine warm and idling in PARK."
        ]
      }
    ]
  },

  // =========================================================================
  // CHAPTER 4: BRAKES, SUSPENSION & WHEEL ALIGNMENT
  // =========================================================================
  {
    id: "chapter-4-chassis",
    chapterNumber: 4,
    title: "Brakes, IFS Suspension, Steering & Wheel Alignment",
    category: "Suspension & Brakes",
    iconName: "Disc",
    description: "Front 4-piston calipers, rear drum brake overhauls, LSPV proportioning curves, torsion bar Z-height tuning, ball joint play limits, and alignment specifications.",
    subsections: [
      {
        id: "brakes-and-lspv",
        title: "Brake Calipers, Drums, Booster & LSPV Calibration",
        summary: "4-piston front caliper rebuild, rear drum limits, brake booster airtightness testing, and LSPV hydraulic split-point specifications.",
        specifications: [
          { item: "Front Brake Disc Standard Thickness", standard: "20.0 mm (0.787 in)", wearLimit: "Minimum Limit: 18.0 mm (0.709 in)", notes: "Vented 4-piston rotor" },
          { item: "Front Brake Disc Lateral Runout", standard: "< 0.05 mm (0.0020 in)", wearLimit: "Maximum Limit: 0.15 mm (0.0059 in)", notes: "Measured 10mm from outer rotor edge" },
          { item: "Front Brake Pad Lining Thickness", standard: "10.0 mm (0.394 in)", wearLimit: "Minimum Limit: 1.0 mm (0.039 in)", notes: "Replace pads in axle sets" },
          { item: "Rear Brake Drum Inside Diameter", standard: "295.0 mm (11.61 in)", wearLimit: "Maximum Wear Limit: 297.0 mm (11.69 in)", notes: "Cast iron leading-trailing drum" },
          { item: "Rear Brake Shoe Lining Thickness", standard: "5.0 mm (0.197 in)", wearLimit: "Minimum Limit: 1.0 mm (0.039 in)", notes: "Inspect for wheel cylinder oil contamination" },
          { item: "Brake Booster Vacuum Airtightness", standard: "Vacuum drop < 25 mmHg in 15 sec", wearLimit: "Must hold vacuum with engine stopped", notes: "Test with inline vacuum gauge" },
          { item: "LSPV Hydraulic Split-Point (Unladen)", standard: "Front: 30 bar &rarr; Rear: 18 ± 2 bar | Front: 60 bar &rarr; Rear: 28 ± 3 bar", wearLimit: "Shackle Spring Length L: 125 ± 2 mm", notes: "Critical: Prevents rear wheel lockup" }
        ],
        torques: [
          { fastener: "Front 4-Piston Caliper Mounting Bolts (17mm)", nm: 123, ftlb: 91 },
          { fastener: "Brake Hose Banjo Union Bolts (14mm)", nm: 30, ftlb: 22, note: "Replace 2x copper sealing washers" },
          { fastener: "Brake Line Bleeder Screws (8mm/10mm)", nm: 8.5, ftlb: 6.3, note: "Do not overtighten bleeders" },
          { fastener: "Master Cylinder Mounting Nuts (12mm)", nm: 13, ftlb: 9 }
        ],
        steps: [
          "1. Caliper piston inspection: Remove brake pads. Place wooden block in caliper and apply light compressed air (2 bar) to fluid inlet to push out the 4 pistons. Inspect chrome plating for rust pitting; replace pitted pistons and install new square-cut Viton seal rings.",
          "2. Rear drum brake adjustment: Back off parking brake cable. Turn star wheel adjuster through drum backing plate access slot until brake shoes lock drum solid, then back off 8 clicks until drum spins freely without drag.",
          "3. Booster check: Depress brake pedal several times with engine OFF to deplete vacuum. Hold pedal down firmly and start engine: Pedal should sink slightly under foot as engine vacuum assists booster diaphragm.",
          "4. 5-Point bleeding sequence: Purge air in exact order: 1) LSPV Body Bleeder Valve (near rear axle) &rarr; 2) Rear Left Drum &rarr; 3) Rear Right Drum &rarr; 4) Front Left Caliper &rarr; 5) Front Right Caliper."
        ],
        proTips: [
          "If the rear brake shoes are soaked with gear oil, replacing the shoes alone is useless; you MUST replace the rear axle shaft inner oil seal (Toyota 90311-40001) and clean the axle housing vent breather.",
          "When installing lift kits, the LSPV axle bracket must be dropped by the exact amount of suspension lift (e.g. 50mm drop for 2-inch lift) to prevent dangerous unladen rear-wheel lockup in rain."
        ]
      },
      {
        id: "suspension-and-alignment",
        title: "IFS Torsion Bars, Ball Joints & Wheel Alignment",
        summary: "Torsion bar anchor bolt adjustment (Z-height), upper/lower ball joint play limits, and factory alignment specifications.",
        specifications: [
          { item: "Front Suspension Ride Height (Z-Height)", standard: "290 ± 5 mm (11.42 ± 0.20 in)", wearLimit: "Measure from ground to lower arm bolt center", notes: "Adjust via rear torsion bar 22mm anchor bolts" },
          { item: "Upper Ball Joint Vertical End Play", standard: "0.00 mm (0.000 in)", wearLimit: "Max Limit: 0.50 mm (0.020 in)", notes: "Load must be relieved from suspension" },
          { item: "Lower Ball Joint Vertical End Play", standard: "0.00 mm (0.000 in)", wearLimit: "Max Limit: 0.50 mm (0.020 in)", notes: "Replace if boots are torn or play detected" },
          { item: "Front Wheel Camber Angle", standard: "0°30' ± 45' (0.50°)", wearLimit: "Left/Right difference < 30'", notes: "Adjust via lower control arm eccentric cams" },
          { item: "Front Wheel Caster Angle", standard: "2°15' ± 45' (2.25°)", wearLimit: "Left/Right difference < 30'", notes: "Adjust via lower control arm front/rear eccentrics" },
          { item: "Front Total Toe-In", standard: "1.0 – 3.0 mm (0.04 – 0.12 in)", wearLimit: "Angle: 0°06' to 0°18'", notes: "Adjust by rotating tie rod adjustment sleeves" }
        ],
        torques: [
          { fastener: "Lower Ball Joint Mounting Bolts (4x 14mm)", nm: 59, ftlb: 43 },
          { fastener: "Lower Ball Joint Castle Nut (22mm)", nm: 142, ftlb: 105, note: "Install new cotter pin" },
          { fastener: "Upper Ball Joint Castle Nut (19mm)", nm: 98, ftlb: 72, note: "Install new cotter pin" },
          { fastener: "Lower Control Arm Eccentric Cam Bolts (19mm)", nm: 196, ftlb: 145, note: "Tighten with vehicle at curb weight" }
        ],
        steps: [
          "1. Torsion bar ride height setting: Park vehicle on flat level ground with fuel tank full. Measure vertical distance from ground to center of front lower control arm pivot bolt (Standard: 290mm). To raise height, turn 22mm rear torsion bar adjuster bolt clockwise (1 turn = ~5mm ride height change).",
          "2. Ball joint play check: Jack front wheel 5 cm off ground under lower control arm. Place dial indicator against steering knuckle. Pry under tire with pry bar: Vertical play must be under 0.50mm.",
          "3. Camber & Caster adjustment: Loosen lower control arm front and rear 19mm eccentric cam bolts. Rotate both cams inward to increase positive camber; rotate front cam inward and rear cam outward to increase positive caster. Torque eccentric nuts to 196 Nm with full vehicle weight on ground.",
          "4. Toe-in setting: Center steering wheel and lock in place. Loosen tie rod sleeve clamp bolts. Rotate left and right tie rod adjusting sleeves equally until total front toe-in measures 2.0 mm across front tire center tread."
        ],
        proTips: [
          "Cranking torsion bars too high (>310mm ride height) leaves zero down-travel in the suspension, resulting in severe CV half-shaft binding, torn CV boots, and jarring ride quality over bumps.",
          "Always torque control arm bushing pivot bolts and shock absorber lower mounts with the full weight of the vehicle resting on its wheels. Torquing bolts while the vehicle is in the air pre-twists the rubber bushings, causing premature bushing failure within 10,000 km."
        ]
      }
    ]
  },

  // =========================================================================
  // CHAPTER 5: CHASSIS ELECTRICAL, FUSE DIRECTORY & RELAYS
  // =========================================================================
  {
    id: "chapter-5-electrical-directory",
    chapterNumber: 5,
    title: "Chassis Electrical, Fuse Directories, Relays & Power Windows",
    category: "Electrical",
    iconName: "Zap",
    description: "Complete under-dash and engine bay fuse tables, starter solenoid circuits, alternator testing, and the tailgate rear power window troubleshooting logic.",
    subsections: [
      {
        id: "fuse-and-relay-directory",
        title: "Master Fuse Box Directory & Wire Colors (Cabin & Engine Bay)",
        summary: "Exhaustive table of every fuse, relay, circuit breaker, rating, wire color, and protected subsystem.",
        specifications: [
          { item: "80A GLOW (Engine Bay Fusible Link)", standard: "80A Bolt-Down Link", wearLimit: "Continuous 12V feed", notes: "Feeds Glow Relay 1 & Relay 2" },
          { item: "60A MAIN (Engine Bay Fusible Link)", standard: "60A Bolt-Down Link", wearLimit: "Continuous 12V feed", notes: "Main power feed to ignition switch & cabin fuse box" },
          { item: "30A HEAD (Engine Bay Fusible Link)", standard: "30A Cartridge Fuse", wearLimit: "Headlights & high beams", notes: "Feeds headlight relay" },
          { item: "IGN 15A (Under-Dash Cabin Fuse Box)", standard: "15A Blade Fuse", wearLimit: "Black-White (B-W) wire", notes: "Feeds Fuel Cut Solenoid, Glow Timer ECU & Gauge cluster" },
          { item: "GAUGE 10A (Under-Dash Cabin Fuse Box)", standard: "10A Blade Fuse", wearLimit: "Black-Yellow (B-Y) wire", notes: "Feeds charging light, back-up lights, 4WD indicator" },
          { item: "STOP 15A (Under-Dash Cabin Fuse Box)", standard: "15A Blade Fuse", wearLimit: "Green-White (G-W) wire", notes: "Brake stop lights & horn relay" },
          { item: "TAIL 15A (Under-Dash Cabin Fuse Box)", standard: "15A Blade Fuse", wearLimit: "Green (G) wire", notes: "Parking lights, license plate lamps, dash illumination" },
          { item: "WIPER 20A (Under-Dash Cabin Fuse Box)", standard: "20A Blade Fuse", wearLimit: "Blue-Black (L-B) wire", notes: "Windshield wipers & washer pumps" },
          { item: "POWER 30A Circuit Breaker (Cabin)", standard: "30A Auto-Reset Breaker", wearLimit: "Door locks & power windows", notes: "Located behind driver kick panel" },
          { item: "HEATER 30A (Cabin Fuse Box)", standard: "30A Blade Fuse", wearLimit: "Blower motor fan speeds", notes: "Heater resistor block circuit" }
        ],
        torques: [
          { fastener: "80A / 60A Fusible Link Screws (M5)", nm: 3.5, ftlb: 2.5, note: "Do not overtighten brass bus bar screws" },
          { fastener: "Starter Motor Mounting Bolts (14mm)", nm: 64, ftlb: 47 }
        ],
        steps: [
          "1. Testing blown fuse: Use a 12V test light connected to chassis ground. Touch the test probe to both exposed metal test points on top of the blade fuse with ignition ON. If light illuminates on one side but not the other, the fuse is blown.",
          "2. Fusible link replacement: Disconnect battery ground cable. Unclip engine bay fuse box lower cover. Use Phillips screwdriver to remove the 2 screws securing the 80A GLOW link from underneath the bus bar.",
          "3. Parasitic battery drain test: Disconnect negative battery terminal. Connect digital multimeter in series (set to 10A DC mode) between negative battery post and disconnected cable clamp. Normal key-off draw is < 25 mA. If drain > 80 mA, pull fuses one by one until reading drops to isolate faulty circuit."
        ],
        proTips: [
          "If the IGN 15A fuse blows, the Bosch VE Fuel Cut Solenoid immediately de-energizes, shutting the engine down instantly like the key was turned off.",
          "Never replace a blown fuse with a higher amperage fuse or wire foil. The 1991 wiring harness uses fusible insulation designed specifically for factory amperage loads."
        ]
      },
      {
        id: "tailgate-power-window-system",
        title: "Rear Tailgate Power Window & Wiper Safety Circuit",
        summary: "The legendary 4Runner tailgate window control module, interlock safety switches, and motor rebuilding.",
        specifications: [
          { item: "Tailgate Window Relay Control Module", standard: "Toyota 85930-89104", wearLimit: "Behind driver rear quarter trim panel", notes: "10-pin multi-function logic controller" },
          { item: "Tailgate Lock Interlock Safety Switch", standard: "Closed when both latches engaged", wearLimit: "Zero window operation if latches ajar", notes: "Switches ground to relay pin 4" },
          { item: "Wiper Up-Park Safety Switch", standard: "Closed only when wiper fully parked", wearLimit: "Prevents window from hitting wiper arm", notes: "Located inside rear wiper gearbox" },
          { item: "Tailgate Window Motor Current Draw", standard: "Normal: 6.0 – 9.0 A | Stall: 18.0 A", wearLimit: "Slow speed indicates dry felt channels", notes: "Permanent magnet reversible motor" }
        ],
        torques: [
          { fastener: "Window Regulator Mounting Bolts (10mm)", nm: 5.5, ftlb: 4.0 },
          { fastener: "Tailgate Hinge to Body Bolts (14mm)", nm: 28, ftlb: 21 }
        ],
        steps: [
          "1. Tailgate window no-operation diagnosis: Verify that the dashboard 'Rear Window Lock' toggle switch is not locked. Check 30A POWER circuit breaker behind driver kick panel.",
          "2. Interlock switch testing: Open tailgate. Manually click both left and right side latch claws into the double-latched position using a screwdriver. Probe the latch switches for continuity to ground.",
          "3. Wiper park switch test: If the rear window will roll down with the key but NOT roll up, the rear wiper arm is slightly off its park cradle. Push wiper arm fully down into its rest bracket to close the safety limit switch.",
          "4. Motor bench test: Remove tailgate inner access panel. Unplug 2-pin motor connector. Apply 12V and Ground directly across the 2 motor pins: Motor should power window UP; reverse polarity to power window DOWN.",
          "5. Glass channel lubrication: Clean dried mud and sand from the rubber glass run channels. Spray thoroughly with pure dry silicone spray to cut regulator motor friction by 60%."
        ],
        proTips: [
          "Over 80% of 'dead tailgate window' issues on LN130 4Runners are caused by broken copper wires inside the rubber flex conduit between the body and tailgate door from 30+ years of opening the tailgate.",
          "Always verify both tailgate latches click twice when closing. If only one latch engages, the safety interlock switch disables both the rear window and rear wiper."
        ]
      }
    ]
  }
];
