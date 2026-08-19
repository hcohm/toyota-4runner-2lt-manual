export interface Step {
  stepNumber: number;
  title: string;
  instruction: string;
  torqueCallout?: string;
  sstNumber?: string;
  warningAlert?: string;
  timerDurationSeconds?: number;
  timerLabel?: string;
  checkItem?: string;
}

export interface Procedure {
  id: string;
  title: string;
  category: "Engine" | "Fuel & Turbo" | "Cooling" | "Electrical" | "Drivetrain" | "Suspension & Brakes";
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Master Mechanic";
  estimatedTime: string;
  requiredSSTs: { number: string; name: string; description: string }[];
  consumables: string[];
  overview: string;
  steps: Step[];
}

export const PROCEDURES_DATA: Procedure[] = [
  {
    id: "head-gasket-replacement",
    title: "Cylinder Head R&R, Piston Protrusion & Multi-Stage Torque Sequence",
    category: "Engine",
    difficulty: "Master Mechanic",
    estimatedTime: "8 - 12 Hours",
    requiredSSTs: [
      { number: "09011-38121", name: "12-Point 14mm Head Bolt Socket", description: "Deep socket for Toyota 12-point cylinder head bolts" },
      { number: "09275-54011", name: "Dial Indicator & Deck Measuring Bridge", description: "Measures piston protrusion above deck surface at TDC" },
      { number: "09213-60017", name: "Crankshaft Pulley Holding Tool", description: "Locks crank pulley during removal/torquing" }
    ],
    consumables: [
      "Grade B, D, or F Multi-Layer Steel Head Gasket",
      "Set of 18x New 12-Point Cylinder Head Stretch Bolts",
      "Toyota Red LLC Coolant (10.5 Liters)",
      "High-Temp RTV FIPG (08826-00080)",
      "Copper Injector Seat Washers & Leak-off Washers",
      "Intake & Exhaust Manifold Gaskets"
    ],
    overview: "The 2L-T cylinder head is sensitive to improper thermal cycles and uneven clamping loads. This procedure details proper loosening order to prevent head warp, precise deck piston protrusion measurement to select the exact head gasket thickness (Grade B, D, or F), and the 3-stage 18-bolt criss-cross angle torque protocol.",
    steps: [
      {
        stepNumber: 1,
        title: "Disconnect Battery & Drain Fluids",
        instruction: "Disconnect negative battery cable. Open radiator drain cock and engine block drain plug (behind oil filter) to completely empty all 10.5L of coolant. Drain engine oil.",
        checkItem: "Cooling system and engine block completely drained"
      },
      {
        stepNumber: 2,
        title: "Remove Intake Crossover, Turbo Heat Shields & Piping",
        instruction: "Unbolt the aluminum turbo crossover pipe. Remove CT20 turbo heat shields, exhaust downpipe flange bolts, and turbo oil feed/return lines.",
        warningAlert: "Cover turbo oil ports with clean plastic caps to prevent grit contamination."
      },
      {
        stepNumber: 3,
        title: "Remove Injection Lines & Glow Plug Bus Bar",
        instruction: "Disconnect glow plug power lead and remove the metal bus bar connecting the 4 glow plugs. Using a 17mm flare nut wrench, disconnect all 4 high-pressure fuel injection lines at both the VE pump and injector holders.",
        checkItem: "Injection lines removed and labeled #1 through #4"
      },
      {
        stepNumber: 4,
        title: "Remove Timing Belt & Camshaft Sprocket",
        instruction: "Rotate engine to TDC No. 1. Relieve timing belt tensioner bolt, remove timing belt. Hold camshaft hex with 24mm wrench and loosen 19mm cam sprocket bolt.",
        torqueCallout: "Cam Sprocket Bolt: 98 Nm (72 ft-lb)",
        checkItem: "Engine verified at TDC before belt removal"
      },
      {
        stepNumber: 5,
        title: "Loosen Cylinder Head Bolts in REVERSE Criss-Cross Order",
        instruction: "Using SST 12-point socket, loosen the 18 cylinder head bolts in 3 progressive passes (1/3 turn each pass) starting from the OUTSIDE ends and working toward the CENTER. Loosening center bolts first will warp or crack the casting.",
        warningAlert: "CRITICAL: Never impact-wrench head bolts off. Loosen evenly across all 18 fasteners.",
        checkItem: "All 18 bolts loosened evenly in reverse sequence"
      },
      {
        stepNumber: 6,
        title: "Lift Cylinder Head & Inspect Deck",
        instruction: "Carefully lift cylinder head vertically off dowel pins. Clean block deck thoroughly with brass scraper and lacquer thinner. Inspect pre-combustion chamber ceramic cups for cracking.",
        warningAlert: "Do NOT use abrasive Roloc discs on the engine deck. They create low spots and introduce abrasive aluminum oxide into oil galleys."
      },
      {
        stepNumber: 7,
        title: "Measure Piston Protrusion & Select Gasket Grade",
        instruction: "Position dial indicator on engine deck and zero the gauge. Rotate crankshaft to bring each piston to absolute TDC. Measure protrusion of all 4 pistons at 2 points per piston (parallel to wrist pin). Take the highest reading to select the gasket: 0.68-0.77mm = Grade B (1 notch), 0.78-0.87mm = Grade D (2 notches), 0.88-0.97mm = Grade F (3 notches).",
        sstNumber: "09275-54011",
        checkItem: "Maximum piston protrusion recorded and matching gasket grade selected"
      },
      {
        stepNumber: 8,
        title: "Install New Gasket & Position Cylinder Head",
        instruction: "Place new gasket onto block locating dowels with 'TOP' marking facing upward. Ensure oil restrictor orifice O-ring is in place. Carefully lower cylinder head straight down onto dowels.",
        checkItem: "Gasket seated flush over dowel pins without binding"
      },
      {
        stepNumber: 9,
        title: "Cylinder Head Tightening - STAGE 1 (78 Nm Initial Torque)",
        instruction: "Coat threads and bolt under-heads with clean engine oil. Install 18 bolts into their original positions. In progressive passes, torque all 18 bolts in the criss-cross sequence from the CENTER outward to 78 Nm (58 ft-lb / 8.0 kgf-m).",
        torqueCallout: "78 Nm (58 ft-lb) in 18-bolt criss-cross order",
        checkItem: "All 18 bolts clicked at 78 Nm in exact numbered sequence"
      },
      {
        stepNumber: 10,
        title: "Cylinder Head Tightening - STAGE 2 (+90° Angle Turn)",
        instruction: "Paint a white reference mark on the 12 o'clock position of each bolt head. Following the same 18-bolt criss-cross sequence from center outward, rotate every bolt an additional 90° (to the 3 o'clock position).",
        warningAlert: "Do not stop mid-turn; make a smooth, continuous 90° rotation.",
        checkItem: "All 18 bolts rotated 90°"
      },
      {
        stepNumber: 11,
        title: "Cylinder Head Tightening - STAGE 3 (+90° Final Angle Turn)",
        instruction: "Following the same criss-cross sequence, rotate every bolt an additional 90° (bringing the paint mark to 6 o'clock - total 180° beyond Stage 1).",
        torqueCallout: "Final Angle: +90° (Total 180° beyond 78 Nm)",
        checkItem: "All 18 bolts rotated final 90°"
      },
      {
        stepNumber: 12,
        title: "Reinstall Valvetrain, Timing Belt & Bleed Cooling System",
        instruction: "Reinstall camshaft, timing belt, valve cover, injection lines, and turbocharger. Fill coolant using spill-free funnel and perform anti-air-lock purging procedure.",
        timerDurationSeconds: 900,
        timerLabel: "Coolant Burping & Thermostat Cycle (15 min)",
        checkItem: "Complete assembly re-torqued and cooling system purged"
      }
    ]
  },
  {
    id: "ct20-turbo-service",
    title: "CT20 Turbocharger Inspection, Wastegate Bench Testing & Overhaul",
    category: "Fuel & Turbo",
    difficulty: "Advanced",
    estimatedTime: "3 - 4 Hours",
    requiredSSTs: [
      { number: "09275-54011", name: "Dial Indicator & Stand", description: "Measures wastegate actuator stroke and turbine shaft radial/axial play" },
      { number: "Universal", name: "Regulated Pressure Test Gun & Gauge", description: "Applies 0-1.5 bar air pressure to actuator canister" }
    ],
    consumables: [
      "CT20 Multi-Layer Stainless Exhaust Gasket Kit",
      "Viton Turbo Oil Drain Flange O-Ring",
      "High-Temperature Copper Locknuts (M10x1.25)",
      "4mm Reinforced Silicone Boost Hose"
    ],
    overview: "The water-cooled Toyota CT20 turbocharger requires precise wastegate actuator calibration to maintain 0.50–0.72 bar (7.1–10.2 psi) standard boost pressure without thermal over-boost.",
    steps: [
      {
        stepNumber: 1,
        title: "Inspect Shaft End Play & Radial Clearances",
        instruction: "Remove air inlet duct and exhaust downpipe. Mount dial indicator on compressor housing. Push turbine shaft back and forth to measure Axial Play (Standard: 0.040–0.080 mm / Limit: 0.11 mm). Measure Radial Play by wiggling shaft side-to-side (Standard: 0.080–0.180 mm / Limit: 0.22 mm).",
        checkItem: "Axial play < 0.08mm and radial play < 0.18mm"
      },
      {
        stepNumber: 2,
        title: "Bench Test Wastegate Actuator Opening Pressure",
        instruction: "Connect regulated air supply and pressure gauge to actuator nipple. Mount dial indicator on the actuator pushrod tip. Gradually apply pressure: The pushrod must begin moving at 0.78–0.84 bar (11.3–12.2 psi) for 0.38 mm stroke.",
        warningAlert: "If actuator diaphragm leaks air or fails to move smoothly, replace actuator assembly."
      },
      {
        stepNumber: 3,
        title: "Clean Oil Supply Tube Restrictor Orifice",
        instruction: "Remove the steel turbo oil feed line. Inspect the banjo bolt internal restrictor hole for baked carbon sludge. Clean in ultrasonic bath or brake cleaner.",
        warningAlert: "CRITICAL: Carbon blockage in oil feed line causes instantaneous turbo bearing seizure within 30 seconds of starting."
      },
      {
        stepNumber: 4,
        title: "Pre-Lube Turbo Bearings Before First Start",
        instruction: "Before connecting oil feed line, pour 20ml of fresh clean engine oil directly into the top oil feed port of the turbo. Spin compressor wheel by hand to coat floating journal bearings.",
        checkItem: "Turbo CHRA bearing cavity primed with clean oil"
      },
      {
        stepNumber: 5,
        title: "Re-Torque Turbo Flanges & Heat Shield",
        instruction: "Install new stainless gasket. Torque turbo-to-manifold flange nuts to 52 Nm (38 ft-lb) using copper locknuts. Torque downpipe nuts to 44 Nm.",
        torqueCallout: "Manifold Flange: 52 Nm (38 ft-lb) | Downpipe: 44 Nm"
      }
    ]
  },
  {
    id: "front-wheel-bearings",
    title: "Front Wheel Bearing Repack, Preload Adjustment & Spindle Locknut Protocol",
    category: "Suspension & Brakes",
    difficulty: "Intermediate",
    estimatedTime: "2.5 Hours",
    requiredSSTs: [
      { number: "09607-10010", name: "54mm Octagonal Hub Spindle Socket", description: "Specialty thin-wall socket for Toyota front spindle nuts" },
      { number: "09608-20012", name: "Cone Washer Drift & Snap Ring Pliers", description: "Extracts Aisin manual hub cone washers and spindle snap ring" },
      { number: "Universal", name: "Spring Pull Scale (0 - 15 kg)", description: "Measures front wheel bearing rolling preload" }
    ],
    consumables: [
      "High-Temperature NLGI No. 2 Lithium Complex Wheel Bearing Grease",
      "Inner Spindle Grease Seals (Toyota 90311-62001)",
      "Star Tab Lock Washers (Toyota 90215-42025)",
      "Aisin Hub Paper Gaskets"
    ],
    overview: "Front wheel bearings on the LN130 IFS 4Runner require precise two-stage preload adjustment using a 54mm socket and spring scale to eliminate death wobble and prevent premature spindle bearing seizure.",
    steps: [
      {
        stepNumber: 1,
        title: "Remove Brake Caliper & Aisin Hub Assembly",
        instruction: "Support vehicle safely on jackstands. Unbolt 4-piston front brake caliper (2x 17mm bolts - 123 Nm) and hang with wire. Remove Aisin locking hub cover, axle snap ring, cone washers, and hub body.",
        torqueCallout: "Caliper Mounting Bolts: 123 Nm (91 ft-lb)",
        checkItem: "Caliper hung safely without straining rubber brake hose"
      },
      {
        stepNumber: 2,
        title: "Remove 54mm Spindle Locknuts & Rotor Hub",
        instruction: "Flatten star lock washer tabs. Using 54mm SST socket, remove outer locknut, star lock washer, inner adjusting nut, and thrust washer. Slide brake rotor and wheel hub assembly off spindle snout.",
        sstNumber: "09607-10010",
        checkItem: "Inner and outer tapered roller bearings extracted"
      },
      {
        stepNumber: 3,
        title: "Clean, Inspect & Palm-Pack Bearings",
        instruction: "Clean spindle, rotor hub cavity, and bearings in solvent. Inspect bearing rollers and races for pitting or blue thermal discoloration. Pack new NLGI 2 lithium complex grease through bearing cages until grease oozes completely through rollers. Drive in new inner grease seal flush with hub rim.",
        checkItem: "Bearings 100% packed and new seal installed flush"
      },
      {
        stepNumber: 4,
        title: "Stage 1 Preload Seating Torque",
        instruction: "Slide hub onto spindle. Install thrust washer and inner 54mm adjusting nut. Using 54mm socket, torque inner nut to 59 Nm (43 ft-lb) while rotating the rotor back and forth 5 times to seat the bearing rollers.",
        torqueCallout: "Preload Seating: 59 Nm (43 ft-lb)",
        checkItem: "Hub spun 5 revolutions during seating torque"
      },
      {
        stepNumber: 5,
        title: "Stage 2 Final Preload Adjustment",
        instruction: "Loosen inner 54mm nut completely until finger-loose. Re-torque inner nut to 25 Nm (18 ft-lb). Turn hub back and forth several times.",
        torqueCallout: "Inner Adjusting Nut: 25 Nm (18 ft-lb)"
      },
      {
        stepNumber: 6,
        title: "Install Star Lock Washer & Outer Locknut",
        instruction: "Install star tab washer. Thread outer 54mm locknut and torque to 47 Nm (35 ft-lb). Check that hub spins smoothly without any lateral end play (0.00 mm).",
        torqueCallout: "Outer 54mm Locknut: 47 Nm (35 ft-lb)"
      },
      {
        stepNumber: 7,
        title: "Spring Pull Scale Rolling Resistance Check",
        instruction: "Hook spring scale to a wheel lug stud at 90 degrees. Pull steadily: The rolling frictional drag must be 2.8 – 5.7 kg (6.2 – 12.6 lbs). Bend one star tab inward over the inner nut and one tab outward over the outer nut.",
        checkItem: "Spring pull force between 2.8 and 5.7 kg; lock tabs bent"
      }
    ]
  },
  {
    id: "rear-diff-overhaul",
    title: "Rear 8.0-inch Differential Third Member Setup (Backlash & Pinion Preload)",
    category: "Drivetrain",
    difficulty: "Master Mechanic",
    estimatedTime: "5 - 7 Hours",
    requiredSSTs: [
      { number: "09556-30010", name: "Pinion Flange Holding Tool", description: "Holds rear companion flange during 196 Nm pinion nut torquing" },
      { number: "09275-54011", name: "Dial Indicator with Magnetic Base", description: "Measures ring gear backlash (0.13–0.18 mm)" },
      { number: "Universal", name: "Inch-Pound Beam Torque Wrench (0 - 30 in-lb)", description: "Measures pinion bearing starting rolling preload" }
    ],
    consumables: [
      "Toyota OEM Crush Sleeve (Collapsible Spacer)",
      "Rear Pinion Oil Seal (Toyota 90311-38047)",
      "Toyota Gear Marking Compound / Prussian Blue",
      "API GL-5 SAE 80W-90 Gear Oil (2.2 Liters)",
      "High-Tack Permatex Ultra Grey RTV"
    ],
    overview: "Setting up the Toyota 8.0-inch rear differential third member requires precise collapsible crush sleeve compression, carrier bearing preload adjustment via side spanner rings, and ring-to-pinion backlash setting to ensure silent, vibration-free operation under heavy turbo torque.",
    steps: [
      {
        stepNumber: 1,
        title: "Measure Starting Pinion Bearing Preload",
        instruction: "With differential carrier assembly removed from housing, install pinion gear, front/rear bearings, new crush sleeve, and companion flange. Tighten 30mm pinion nut gradually until all end play disappears. Use inch-pound torque wrench to measure rotational drag: New Bearings = 1.0 – 1.6 Nm (8.7 – 13.9 in-lb) | Used Bearings = 0.5 – 0.8 Nm (4.3 – 6.9 in-lb).",
        sstNumber: "09556-30010",
        torqueCallout: "Pinion Nut: Tighten progressively up to 196 Nm (145 ft-lb) maximum",
        warningAlert: "CRITICAL: Never overtighten the crush sleeve! If preload exceeds 1.6 Nm, you MUST discard the crush sleeve and install a brand new one."
      },
      {
        stepNumber: 2,
        title: "Install Differential Carrier & Bearing Caps",
        instruction: "Place carrier into third member housing. Install side adjuster rings and bearing caps. Snug 4x 17mm bearing cap bolts to 20 Nm (do not final-torque yet).",
        checkItem: "Side adjuster rings threaded in straight without cross-threading"
      },
      {
        stepNumber: 3,
        title: "Adjust Ring Gear Backlash (0.13 – 0.18 mm)",
        instruction: "Mount magnetic base dial indicator with stem perpendicular to the drive side of a ring gear tooth. Lock the pinion flange. Rock the ring gear back and forth: Backlash must measure 0.13 – 0.18 mm (0.005 – 0.007 in). Turn the side adjuster spanner rings to shift the carrier left or right to achieve exact backlash.",
        checkItem: "Backlash measured at 4 points around ring gear within 0.13-0.18mm"
      },
      {
        stepNumber: 4,
        title: "Set Carrier Bearing Preload & Torque Bearing Caps",
        instruction: "Tighten both side adjuster rings evenly to apply carrier preload until total assembly rotational drag increases by 0.4 – 0.6 Nm (3.5 – 5.2 in-lb) beyond pinion preload. Torque bearing cap bolts to 85 Nm (63 ft-lb) and install lock tabs (13 Nm).",
        torqueCallout: "Bearing Cap Bolts: 85 Nm (63 ft-lb)",
        checkItem: "Bearing caps torqued and lock tabs secured"
      },
      {
        stepNumber: 5,
        title: "Inspect Gear Tooth Contact Pattern",
        instruction: "Paint 4 ring gear teeth with Prussian blue marking paste. Rotate pinion flange through 3 full revolutions under drag load. Observe tooth contact footprint: Pattern must be centered between heel and toe, positioned slightly toward the toe on the drive face.",
        checkItem: "Drive and coast contact patterns centered oval"
      },
      {
        stepNumber: 6,
        title: "Install Third Member into Axle Housing",
        instruction: "Clean axle flange. Apply 3mm continuous bead of Toyota Ultra Grey RTV around stud perimeter. Slide third member onto studs and torque 10x 14mm flange nuts to 73 Nm (54 ft-lb) in criss-cross pattern.",
        torqueCallout: "Housing Stud Nuts: 73 Nm (54 ft-lb)"
      }
    ]
  },
  {
    id: "clutch-replacement",
    title: "Clutch Disc, Pressure Plate & Pilot/Release Bearing Overhaul",
    category: "Drivetrain",
    difficulty: "Master Mechanic",
    estimatedTime: "6 - 8 Hours",
    requiredSSTs: [
      { number: "09301-20020", name: "Clutch Disc Spline Alignment Tool", description: "Centers clutch friction disc to pilot bearing during pressure plate torquing" },
      { number: "09303-35011", name: "Pilot Bearing Puller & Slide Hammer", description: "Extracts bronze/roller pilot bearing from crankshaft snout" },
      { number: "Universal", name: "Transmission Transmission Floor Jack & Straps", description: "Safely supports and balances 80 kg R150F/W56 gearbox" }
    ],
    consumables: [
      "Heavy-Duty 225mm / 236mm Clutch Disc (21 Spline)",
      "Diaphragm Spring Clutch Pressure Plate",
      "Koyo Release Throwout Bearing & Pilot Bearing",
      "High-Temp Urea Release Fork Spline Grease (Toyota 08887-01206)",
      "Set of 6x High-Tensile Flywheel Bolts (123 Nm)"
    ],
    overview: "Replacing the clutch on the 1991 4Runner requires safely dropping the heavy manual transmission and transfer case, inspecting flywheel friction face runout (<0.10mm), packing the release fork pivot with high-temp grease, and aligning the disc spline.",
    steps: [
      {
        stepNumber: 1,
        title: "Disconnect Driveshafts, Starter & Slave Cylinder",
        instruction: "Matchmark and remove front and rear propeller driveshafts. Unbolt clutch slave cylinder (2x 12mm bolts) from bellhousing and hang out of way. Unbolt starter motor (2x 14mm bolts) and disconnect wiring.",
        checkItem: "Driveshafts matchmarked and starter removed"
      },
      {
        stepNumber: 2,
        title: "Remove Interior Shifters & Crossmember",
        instruction: "Remove cabin center console. Unbolt transmission and 4WD transfer case shifter boots and extract levers. Support transmission with transmission jack. Unbolt transmission crossmember (8x 14mm bolts).",
        checkItem: "Shifter levers removed and gearbox supported"
      },
      {
        stepNumber: 3,
        title: "Drop Transmission & Bellhousing",
        instruction: "Remove 9x bellhousing-to-engine block bolts. Slide transmission rearward horizontally until the input shaft completely clears the clutch pressure plate. Lower jack slowly.",
        warningAlert: "Never let transmission hang on the input shaft while splines are partially engaged, as this bends the clutch disc hub."
      },
      {
        stepNumber: 4,
        title: "Remove Pressure Plate, Disc & Flywheel",
        instruction: "Loosen 6x 12mm pressure plate bolts evenly (1 turn each) in criss-cross order. Remove clutch disc. Lock flywheel ring gear and remove 6x 17mm flywheel center bolts. Resurface flywheel friction face (step height: 0.50 mm).",
        torqueCallout: "Flywheel Center Bolts: 123 Nm (91 ft-lb)"
      },
      {
        stepNumber: 5,
        title: "Replace Pilot Bearing & Rear Main Crank Seal",
        instruction: "Extract old pilot bearing using slide hammer. Drive new sealed pilot bearing into crank snout. Inspect rear main crankshaft oil seal for leakage; replace if wet with engine oil.",
        sstNumber: "09303-35011",
        checkItem: "New pilot bearing seated flush"
      },
      {
        stepNumber: 6,
        title: "Install Clutch Disc with SST Alignment Tool",
        instruction: "Wipe flywheel clean with brake cleaner. Position new clutch disc with stamped 'FLYWHEEL SIDE' facing engine. Insert SST 09301-20020 through disc hub into pilot bearing. Install pressure plate over dowels.",
        sstNumber: "09301-20020",
        checkItem: "Disc perfectly centered on pilot bearing"
      },
      {
        stepNumber: 7,
        title: "Torque Pressure Plate Bolts in Criss-Cross Order",
        instruction: "Tighten 6x pressure plate bolts progressively in star pattern to 19 Nm (14 ft-lb). Remove SST alignment tool. Verify disc does not shift.",
        torqueCallout: "Pressure Plate Bolts: 19 Nm (14 ft-lb)",
        checkItem: "All 6 bolts torqued to 19 Nm in criss-cross order"
      },
      {
        stepNumber: 8,
        title: "Service Release Bearing & Pivot Ball",
        instruction: "Install new throwout bearing onto slide quill. Apply high-temp urea grease to release fork pivot ball, fork fingers, and input shaft spline teeth.",
        checkItem: "Release bearing slides effortlessly on guide quill"
      },
      {
        stepNumber: 9,
        title: "Reinstall Transmission & Bleed Hydraulic Clutch",
        instruction: "Raise gearbox, align input shaft splines, slide flush against block, and torque bellhousing bolts to 72 Nm. Reinstall slave cylinder, fill master cylinder with DOT 4 fluid, and bleed air.",
        torqueCallout: "Bellhousing Bolts: 72 Nm (53 ft-lb)"
      }
    ]
  },
  {
    id: "fan-clutch-rebuild",
    title: "Viscous Fan Clutch Silicone Fluid Drain & 10,000 cSt Refill Service",
    category: "Cooling",
    difficulty: "Beginner",
    estimatedTime: "1 Hour",
    requiredSSTs: [
      { number: "Universal", name: "Heat Gun & Digital Thermometer", description: "Verifies bimetallic coil spring unwinding between 65°C and 70°C" }
    ],
    consumables: [
      "Toyota Genuine Silicone Fluid 10,000 cSt (Toyota 08816-03001 / 2x 18ml tubes)",
      "High-Temperature Housing Perimeter O-Ring",
      "Blue Medium-Strength Threadlocker (Loctite 242)"
    ],
    overview: "The Aisin viscous fan clutch on the 2L-T is the primary defense against head cracking. Over 10-15 years, the internal silicone fluid shears down or leaks out, causing the fan to slip and move only 30% of required CFM. This procedure restores 100% factory locking engagement.",
    steps: [
      {
        stepNumber: 1,
        title: "Remove Fan Assembly from Water Pump",
        instruction: "Unbolt 4x 10mm nuts securing fan clutch to water pump pulley studs. Unclip radiator fan shroud and lift fan clutch assembly out of engine bay.",
        checkItem: "Fan blades inspected for cracks or chipping"
      },
      {
        stepNumber: 2,
        title: "Disassemble Housing Halves",
        instruction: "Place clutch on bench. Remove 4x Phillips/hex screws securing front and rear aluminum housing halves. Carefully separate halves using a utility blade to break the perimeter seal.",
        warningAlert: "Do not bend or pry violently on the aluminum mating flanges."
      },
      {
        stepNumber: 3,
        title: "Clean Out Old Degraded Silicone Fluid",
        instruction: "Drain old discolored silicone fluid into catch pan. Clean internal fluid drive grooves and valve plate with brake cleaner and compressed air until clean and dry.",
        checkItem: "Drive grooves cleaned of old scorched silicone fluid"
      },
      {
        stepNumber: 4,
        title: "Test Bimetallic Coil Spring Thermostatic Valve",
        instruction: "Direct a heat gun onto the front bimetallic spiral spring while monitoring with thermometer. At 65°C – 70°C, the spring must rotate and open the internal fluid gate valve completely.",
        checkItem: "Valve plate opens smoothly at 65°C–70°C"
      },
      {
        stepNumber: 5,
        title: "Inject Fresh 10,000 cSt Silicone Fluid",
        instruction: "Dispense exactly 40 – 45 ml of Toyota 10,000 cSt silicone oil evenly into the rear reservoir chamber. For heavy towing / hot climates, 50 ml provides earlier lockup.",
        checkItem: "40-45ml of 10,000 cSt fluid added"
      },
      {
        stepNumber: 6,
        title: "Install New O-Ring & Re-Torque Housing Screws",
        instruction: "Fit new perimeter rubber O-ring. Mate housing halves, apply blue threadlocker to screws, and tighten evenly in criss-cross pattern to 6.5 Nm.",
        torqueCallout: "Housing Screws: 6.5 Nm (58 in-lb)",
        checkItem: "Housing sealed with zero fluid leaks around perimeter"
      },
      {
        stepNumber: 7,
        title: "Reinstall on Vehicle & Verify Hydraulic Drag",
        instruction: "Re-bolt fan clutch to water pump studs (10 Nm). Spin fan by hand to verify smooth heavy hydraulic drag.",
        torqueCallout: "Pulley Nuts: 10 Nm (89 in-lb)"
      }
    ]
  },
  {
    id: "steering-gearbox-service",
    title: "Steering Gearbox Backlash Preload Adjustment & Idler Arm Bushing Overhaul",
    category: "Suspension & Brakes",
    difficulty: "Intermediate",
    estimatedTime: "2 Hours",
    requiredSSTs: [
      { number: "09610-20012", name: "Pitman Arm Puller", description: "Separates tapered pitman arm from steering box sector shaft" },
      { number: "Universal", name: "Spring Scale & Dial Indicator", description: "Measures steering wheel center deadband and sector backlash" }
    ],
    consumables: [
      "Heavy-Duty Bronze/Delrin Idler Arm Bushing Upgrade Kit",
      "NLGI No. 2 Molybdenum Disulfide Chassis Grease",
      "Locknut Sealing Washer"
    ],
    overview: "Eliminates dangerous 2-inch steering wheel deadband play and wandering on highway ruts by adjusting the sector shaft mesh preload on the recirculating-ball steering gearbox and upgrading worn plastic idler arm bushings.",
    steps: [
      {
        stepNumber: 1,
        title: "Check Steering Center On-Center Play",
        instruction: "With front wheels pointed straight ahead on flat ground, wiggle steering wheel lightly. Measure free play at wheel rim: Standard free play must be under 30 mm (1.18 in). If free play > 40 mm, perform gearbox and idler adjustment.",
        checkItem: "Steering free play measured"
      },
      {
        stepNumber: 2,
        title: "Inspect & Re-Bush Passenger-Side Idler Arm",
        instruction: "Have an assistant rock the steering wheel while inspecting the passenger-side idler arm frame bracket. If the idler shaft moves vertically, unbolt idler arm, press out worn soft factory plastic bushings, and install heavy-duty bronze/Delrin bushings packed with moly grease.",
        torqueCallout: "Idler Frame Bolts: 142 Nm (105 ft-lb)",
        checkItem: "Zero vertical deflection in idler arm pivot"
      },
      {
        stepNumber: 3,
        title: "Loosen Sector Shaft Adjuster Locknut",
        instruction: "Locate the slotted sector shaft adjusting screw on top of the steering gearbox (driver side frame rail). Loosen the 17mm locknut while holding the center slotted screw steady with a flathead screwdriver.",
        checkItem: "17mm locknut backed off 1 full turn"
      },
      {
        stepNumber: 4,
        title: "Adjust Sector Shaft Mesh Preload",
        instruction: "Ensure front wheels are pointed DEAD STRAIGHT AHEAD (sector teeth have highest contact at center). Turn the slotted adjusting screw clockwise in 1/8-turn increments to reduce gear tooth clearance. Turn steering wheel lock-to-lock: Steering must feel smooth through center with zero binding or tight spots.",
        warningAlert: "CRITICAL: Do NOT over-tighten! Excessive preload destroys the recirculating ball worm gear and prevents steering self-centering after turns."
      },
      {
        stepNumber: 5,
        title: "Torque Locknut & Road Test",
        instruction: "Hold slotted screw firmly in adjusted position and torque 17mm locknut to 44 Nm (32 ft-lb). Grease all 4 steering tie-rod ball joints and center drag link zerks.",
        torqueCallout: "Sector Adjuster Locknut: 44 Nm (32 ft-lb)",
        checkItem: "Steering self-centers smoothly after 90° low-speed turn"
      }
    ]
  },
  {
    id: "alternator-vacuum-pump-service",
    title: "Alternator & Rear Vacuum Vane Pump Overhaul & Oil Banjo Cleaning",
    category: "Electrical",
    difficulty: "Advanced",
    estimatedTime: "2.5 Hours",
    requiredSSTs: [
      { number: "Digital Multimeter & Vacuum Gauge", name: "Multimeter & 0-760 mmHg Vacuum Gauge", description: "Measures charging voltage and vacuum draw (500-600 mmHg)" }
    ],
    consumables: [
      "Vacuum Pump Carbon Vanes (Set of 4x)",
      "Rear Housing O-Ring & Shaft Lip Seal",
      "Alternator Carbon Brushes (Toyota 27370-54050)",
      "Copper Banjo Sealing Washers (4x 14mm)"
    ],
    overview: "Because diesel engines produce no manifold vacuum, the 2L-T utilizes an oil-lubricated rotary vane pump mounted to the back of the alternator. This procedure services vacuum vanes, cleans the oil feed banjo restrictor, and replaces alternator carbon brushes.",
    steps: [
      {
        stepNumber: 1,
        title: "Remove Alternator / Vacuum Pump Assembly",
        instruction: "Disconnect battery ground cable. Unbolt 14mm engine oil supply line and drain hose from the rear vacuum pump housing. Disconnect 3-pin electrical harness and B+ output cable. Loosen pivot and tensioner bolts; remove alternator from bracket.",
        warningAlert: "Catch dripping oil with a rag and plug block oil ports immediately."
      },
      {
        stepNumber: 2,
        title: "Disassemble Rear Vacuum Pump Housing",
        instruction: "Remove 3x 10mm bolts securing the rear cast iron vacuum pump cover. Pull housing off rotor shaft.",
        checkItem: "Vacuum pump housing separated from alternator rear"
      },
      {
        stepNumber: 3,
        title: "Measure Carbon Vane Thickness & Housing Wear",
        instruction: "Extract the 4 sliding carbon vanes from rotor slots. Measure vane thickness (Standard: 4.0 mm / Wear Limit: 3.5 mm). Inspect internal cylindrical housing bore for deep gouges or scoring.",
        checkItem: "All 4 vanes > 3.5mm thick with clean sliding action"
      },
      {
        stepNumber: 4,
        title: "Clean Oil Supply Banjo Restrictor Hole",
        instruction: "Inspect the 14mm oil supply banjo bolt. Clean the tiny 1.5mm internal oil restrictor jet with solvent and compressed air.",
        warningAlert: "Blocked restrictor starves vacuum vanes of oil, causing catastrophic pump seizure that snaps the alternator drive belt."
      },
      {
        stepNumber: 5,
        title: "Inspect Alternator Carbon Brushes",
        instruction: "Remove rear plastic brush holder cover. Measure exposed carbon brush length (Standard: 10.5 mm / Minimum Limit: 4.5 mm). Solder in new brushes if worn near limit line.",
        checkItem: "Brush length > 4.5mm with smooth slip ring contact"
      },
      {
        stepNumber: 6,
        title: "Reassemble with New Seals & Test Vacuum",
        instruction: "Install new shaft lip seal and perimeter O-ring. Torque pump housing bolts to 11 Nm. Reinstall on engine with new copper banjo washers (25 Nm). Start engine: Output must measure 13.8–14.6V and vacuum gauge must pull 500–600 mmHg at idle.",
        torqueCallout: "Oil Banjo Bolts: 25 Nm | Pump Housing: 11 Nm",
        checkItem: "Alternator charges >13.8V and vacuum reaches >500 mmHg"
      }
    ]
  },
  {
    id: "ve-pump-reseal",
    title: "Bosch VE Injection Pump Top Cover Re-Seal & LDA Diaphragm Service",
    category: "Fuel & Turbo",
    difficulty: "Advanced",
    estimatedTime: "2 - 3 Hours",
    requiredSSTs: [
      { number: "Universal", name: "Scribe & Depth Micrometer", description: "Indexes LDA fuel enrichment cone and maximum fuel smoke screw" }
    ],
    consumables: [
      "Bosch VE Top Cover Rubber Perimeter Gasket",
      "Throttle Shaft O-Ring & Brass Bushing Kit",
      "LDA Boost Compensator Rubber Diaphragm",
      "Brake Cleaner & Lint-Free Wipes"
    ],
    overview: "Fuel leaks around the throttle lever or oil leaks from the boost compensator on the Bosch VE pump are easily serviced on-engine without removing the pump.",
    steps: [
      {
        stepNumber: 1,
        title: "Scribe Throttle Lever Alignment Mark",
        instruction: "Use a sharp metal scribe to mark the exact position of the serrated throttle arm relative to the throttle shaft center. Remove 10mm locknut and return spring.",
        warningAlert: "CRITICAL: If throttle lever is reinstalled even 1 tooth off spline, engine may fail to idle or suffer uncontrolled high-RPM run-away."
      },
      {
        stepNumber: 2,
        title: "Remove Top Cover Screws",
        instruction: "Clean top of pump thoroughly. Loosen 4x slotted screws securing aluminum top cover. Lift cover carefully while holding down the internal governor shaft with a small punch.",
        checkItem: "Top cover lifted without disturbing internal governor spring"
      },
      {
        stepNumber: 3,
        title: "Replace Throttle Shaft O-Ring & Seal",
        instruction: "Slide throttle shaft out of top cover. Extract old hardened rubber O-ring. Lubricate new Viton O-ring with clean diesel and slide into groove. Inspect brass bushing for oval wear.",
        checkItem: "New O-ring seated smoothly in groove"
      },
      {
        stepNumber: 4,
        title: "Inspect & Re-Index LDA Boost Cone Diaphragm",
        instruction: "Remove 4x top screws on boost compensator capsule. Scribe alignment line on rubber diaphragm. Pull eccentric cone assembly straight up. Clean guide pin bore. Install new diaphragm matching original rotation index mark.",
        checkItem: "Eccentric cone eccentric ramp oriented correctly toward fuel pin"
      },
      {
        stepNumber: 5,
        title: "Reinstall Cover & Prime Fuel System",
        instruction: "Install new perimeter gasket. Lower top cover, engage governor spring in lever hole, and tighten 4x screws to 8 Nm. Reinstall throttle arm matching scribe mark. Pump fuel primer until firm.",
        torqueCallout: "Top Cover Screws: 8 Nm (71 in-lb)"
      }
    ]
  },
  {
    id: "add-vsv-service",
    title: "4WD ADD Vacuum Switching Valves (VSVs) & Actuator Overhaul",
    category: "Drivetrain",
    difficulty: "Intermediate",
    estimatedTime: "1.5 Hours",
    requiredSSTs: [
      { number: "Digital Multimeter", name: "Ohmmeter & Hand Vacuum Pump / Gauge", description: "Measures solenoid resistance and actuator diaphragm vacuum hold" }
    ],
    consumables: [
      "Toyota OEM Blue 4WD VSV (85420-24010)",
      "3.5mm High-Temp Silicone Vacuum Hose (2 Meters)",
      "Dielectric Grease"
    ],
    overview: "Diagnoses and restores the Automatic Disconnecting Differential (ADD) system on IFS 4Runners to eliminate flashing 4WD dash lights and failure to engage front axle drive.",
    steps: [
      {
        stepNumber: 1,
        title: "Test VSV Solenoid Coil Resistances",
        instruction: "Unplug 2-pin electrical connectors on Blue (4WD engage) and Brown (2WD disengage) VSVs on inner fender. Measure resistance across the 2 male pins on each valve. Specification: 38 – 45 Ω at 20°C.",
        checkItem: "Both VSV coils read 38 – 45 Ω (Infinite = burned coil)"
      },
      {
        stepNumber: 2,
        title: "Test VSV Airflow Switching with 12V",
        instruction: "Connect hand vacuum pump to VSV inlet port. Without power, air should bleed to atmospheric filter. Apply 12V battery power across pins: Solenoid should click and route vacuum straight through to front diff port.",
        checkItem: "VSVs switch vacuum cleanly when energized"
      },
      {
        stepNumber: 3,
        title: "Vacuum Leakdown Test on Front Differential Actuator",
        instruction: "Raise vehicle on jackstands. Connect hand vacuum pump to front axle actuator left port. Apply 500 mmHg vacuum. The actuator must hold vacuum for 60 seconds without dropping more than 20 mmHg while spinning the left front wheel to lock.",
        timerDurationSeconds: 60,
        timerLabel: "Actuator Vacuum Hold Test (60 sec)",
        checkItem: "Actuator diaphragm holds vacuum and locks axle shaft"
      },
      {
        stepNumber: 4,
        title: "Replace Split Rubber Vacuum Lines",
        instruction: "Replace old cracked rubber hoses from engine vacuum storage tank down to front axle with new 3.5mm silicone vacuum hose. Secure with spring wire clamps.",
        checkItem: "All vacuum lines securely routed away from exhaust downpipe"
      }
    ]
  },
  {
    id: "lspv-brake-service",
    title: "Load Sensing Proportioning Valve (LSPV) Height Calibration & 5-Point Bleed",
    category: "Suspension & Brakes",
    difficulty: "Intermediate",
    estimatedTime: "1.5 Hours",
    requiredSSTs: [
      { number: "09709-29018", name: "Dual Hydraulic Pressure Gauges", description: "Measures front caliper vs rear wheel cylinder hydraulic pressure" }
    ],
    consumables: [
      "DOT 4 High Boiling Point Brake Fluid (1.5 Liters)",
      "Clear Bleeder Hose & Catch Bottle",
      "Penetrating Oil for Bleeder Screws"
    ],
    overview: "Critical for lifted 4Runners to prevent dangerous rear-wheel lockup under emergency braking. Re-calibrates the sensing shackle rod and bleeds the hidden 5th bleeder on the LSPV body.",
    steps: [
      {
        stepNumber: 1,
        title: "Inspect Shackle Spring Length at Curb Weight",
        instruction: "Place vehicle on flat level ground with unladen curb weight (full tank of fuel, empty cargo area). Measure distance 'L' of the LSPV shackle sensing spring from axle bracket to valve body arm (Standard: 125 ± 2 mm).",
        checkItem: "Spring length recorded at curb weight"
      },
      {
        stepNumber: 2,
        title: "Adjust Shackle Bracket for Lift Kits",
        instruction: "If rear suspension is lifted 2 inches (50mm), the axle bracket must be extended downward by exactly 50mm using an LSPV drop bracket, or adjust the threaded shackle bolt so the valve arm rests in neutral horizontal position.",
        warningAlert: "Never leave LSPV unadjusted after a suspension lift! It causes severe rear wheel lockup and vehicle spin-out on wet roads."
      },
      {
        stepNumber: 3,
        title: "Execute Toyota 5-Point Brake Bleeding Sequence",
        instruction: "Bleed in exact factory order: 1) LSPV Body Bleeder Valve (near rear axle) &rarr; 2) Rear Left Drum &rarr; 3) Rear Right Drum &rarr; 4) Front Left Caliper &rarr; 5) Front Right Caliper. Keep master cylinder reservoir full of DOT 4 fluid.",
        torqueCallout: "Bleeder Screws: 8.5 Nm (75 in-lb)",
        checkItem: "All 5 bleeder points purged of micro-bubbles"
      }
    ]
  },
  {
    id: "injector-nozzle-service",
    title: "Fuel Injector Nozzle Pop-Testing, Spray Pattern & Shimming",
    category: "Fuel & Turbo",
    difficulty: "Advanced",
    estimatedTime: "2.5 Hours",
    requiredSSTs: [
      { number: "09260-54012", name: "Diesel Injector Pop Tester Stand", description: "Manual hydraulic tester with 0-300 bar pressure gauge" },
      { number: "09268-54011", name: "Nozzle Holder Socket (21mm/27mm)", description: "Deep hex socket for 2L-T two-piece injector holders" }
    ],
    consumables: [
      "Nippondenso DN4PD57 / DN0PDN112 Throttle Nozzle Tips (4x)",
      "Internal Pressure Adjusting Shims (0.90mm - 1.95mm)",
      "Combustion Chamber Copper Heat Shield Washers (4x)",
      "Aluminum Leak-Off Return Rail Crush Washers (8x)"
    ],
    overview: "Worn injector nozzles cause black smoke, diesel knocking, and excessive fuel consumption. This procedure pop-tests opening pressure and verifies chattering spray atomization.",
    steps: [
      {
        stepNumber: 1,
        title: "Remove Injector Holders from Cylinder Head",
        instruction: "Disconnect leak-off fuel return rail and high pressure steel lines. Using 27mm deep socket, unscrew all 4 injector holders from pre-chambers. Extract old copper seat washers with brass hook.",
        torqueCallout: "Nozzle Holder to Head: 64 Nm (47 ft-lb)"
      },
      {
        stepNumber: 2,
        title: "Disassemble & Ultrasonic Clean Nozzle Bodies",
        instruction: "Clamp holder in vise. Loosen 21mm retaining nut. Remove nozzle tip, distance piece, pressure spring, and adjusting shim. Clean carbon in ultrasonic cleaner with diesel solvent.",
        warningAlert: "Do not touch nozzle needle mating surfaces with bare steel wire."
      },
      {
        stepNumber: 3,
        title: "Pop-Test Opening Pressure & Atomization",
        instruction: "Mount assembled injector on pop-tester. Pump lever slowly: 1) Initial Opening Pressure: Standard 145–155 kg/cm² (2,062–2,204 psi). 2) Leakage Test: Hold pressure at 130 kg/cm² for 10 sec; zero dripping from nozzle tip allowed. 3) Chattering: Rapid pumps should produce a crisp whistling buzz with cone mist.",
        checkItem: "Opening pressure 145-155 kg/cm² and zero droplet leakage"
      },
      {
        stepNumber: 4,
        title: "Adjust Pressure with Shims",
        instruction: "If opening pressure is too low, install a thicker adjusting shim inside the holder. A 0.04 mm shim thickness change alters opening pressure by approximately 5.0 kg/cm² (71 psi).",
        checkItem: "All 4 injectors matched within 3 kg/cm² of each other"
      },
      {
        stepNumber: 5,
        title: "Reinstall with New Copper Combustion Washers",
        instruction: "Drop brand new copper washer (flanged side facing UP) into head pre-chamber. Install new corrugated heat shield washer. Torque injector holders to 64 Nm and leak-off rail banjo nuts to 29 Nm.",
        torqueCallout: "Holder: 64 Nm (47 ft-lb) | Return Rail: 29 Nm (21 ft-lb)"
      }
    ]
  },
  {
    id: "timing-belt-service",
    title: "Timing Belt & Tensioner Replacement (Alignment & Tensioning)",
    category: "Engine",
    difficulty: "Intermediate",
    estimatedTime: "3 - 5 Hours",
    requiredSSTs: [
      { number: "09213-60017", name: "Crankshaft Pulley Holder", description: "Holds harmonic balancer for 167 Nm torque" },
      { number: "09950-50013", name: "Universal Puller Set", description: "Removes crank pulley from snout without damaging rubber bond" }
    ],
    consumables: [
      "OEM Toyota 2L-T Timing Belt (13568-59065 / 130 teeth)",
      "Timing Belt Tensioner Idler Pulley & Return Spring",
      "Front Crankshaft & Camshaft Viton Oil Seals",
      "Water Pump & Gasket"
    ],
    overview: "The 2L-T is an interference diesel engine. Precise tooth timing between the Crankshaft, Bosch VE Injection Pump, and Camshaft is imperative to prevent valve-to-piston impact.",
    steps: [
      {
        stepNumber: 1,
        title: "Remove Radiator Shroud, Fan & Drive Belts",
        instruction: "Drain radiator. Remove 4x 10mm nuts securing viscous fan clutch to water pump pulley. Remove fan, fan shroud, and alternator/power steering V-belts.",
        checkItem: "Drive belts and fan assembly cleared"
      },
      {
        stepNumber: 2,
        title: "Remove Crankshaft Pulley & Timing Covers",
        instruction: "Lock crankshaft using SST. Loosen 19mm crank pulley center bolt (167 Nm). Use puller tool to slide harmonic balancer off crank snout. Unbolt upper and lower plastic timing belt covers.",
        sstNumber: "09213-60017",
        torqueCallout: "Crank Center Bolt: 167 Nm (123 ft-lb)",
        checkItem: "Harmonic balancer and timing covers removed"
      },
      {
        stepNumber: 3,
        title: "Align Engine Timing Marks to TDC No. 1",
        instruction: "Temporarily thread crank bolt and rotate clockwise until: 1) Crankshaft sprocket notch aligns with oil pump mark at 12:00 (0° TDC), 2) Injection pump sprocket mark aligns with rear plate notch at 12:00, 3) Camshaft sprocket timing mark aligns with cylinder head notch at 3:00 position.",
        warningAlert: "Never rotate engine counter-clockwise. Always verify all 3 marks simultaneously align.",
        checkItem: "All 3 timing marks aligned at TDC No. 1"
      },
      {
        stepNumber: 4,
        title: "Remove Tensioner Spring & Old Belt",
        instruction: "Loosen tensioner pulley pivot bolt. Pry tensioner away from belt and temporarily snug bolt. Disconnect tensioner return spring. Slide timing belt off sprockets.",
        checkItem: "Old timing belt and tensioner removed"
      },
      {
        stepNumber: 5,
        title: "Inspect Tensioner Spring & Replace Water Pump",
        instruction: "Measure tensioner spring free length (Standard: 54.5 mm / Limit: 55.5 mm). Replace if stretched. Unbolt water pump (7x bolts) and replace with new gasket, torquing to 19 Nm.",
        torqueCallout: "Water Pump Bolts: 19 Nm (14 ft-lb)"
      },
      {
        stepNumber: 6,
        title: "Install New Timing Belt",
        instruction: "Ensure timing marks remain aligned. Route belt starting from Crankshaft -> Injection Pump -> Camshaft -> Tensioner Idler, keeping tension tight on the non-tensioner drive side.",
        checkItem: "Belt teeth engaged without slack between crank, pump, and cam"
      },
      {
        stepNumber: 7,
        title: "Set Belt Tension & Torque Tensioner Bolt",
        instruction: "Install tensioner spring. Loosen tensioner pivot bolt to allow spring tension to take up slack. Rotate crankshaft clockwise 2 full revolutions (720°) and verify all 3 timing marks return to exact alignment. Torque tensioner pivot bolt to 43 Nm.",
        torqueCallout: "Tensioner Pivot Bolt: 43 Nm (32 ft-lb)",
        warningAlert: "Do NOT apply extra pry bar leverage to tensioner; rely strictly on factory calibrated spring tension.",
        checkItem: "Tensioner bolt torqued to 43 Nm and timing re-verified after 2 full crank rotations"
      },
      {
        stepNumber: 8,
        title: "Reassemble Timing Covers & Harmonic Balancer",
        instruction: "Reinstall timing covers. Apply light anti-seize to crank snout, install balancer, and torque center bolt to 167 Nm using SST holding tool.",
        torqueCallout: "Crank Bolt: 167 Nm (123 ft-lb)"
      }
    ]
  },
  {
    id: "valve-clearance-adjustment",
    title: "Valve Clearance Inspection & Shim-on-Bucket Adjustment",
    category: "Engine",
    difficulty: "Advanced",
    estimatedTime: "2 - 3 Hours",
    requiredSSTs: [
      { number: "09248-64011", name: "Valve Lifter Press Tool & Stopper", description: "Depresses lifter bucket to pop outer shim out without removing camshaft" },
      { number: "09248-73010", name: "Magnetic Shim Pick & Tweezers", description: "Extracts shim from bucket recess" }
    ],
    consumables: [
      "Toyota 2L-T Valve Adjusting Shims (2.50mm - 3.30mm range)",
      "Valve Cover Gasket & 4x Camshaft Spark/Glow Plug Well Seals",
      "Semi-Drying Sealant for Half-Moon Plugs"
    ],
    overview: "Gen 2 2L-T engines utilize direct cam-over-bucket followers with top-mounted adjusting shims. Proper cold lash (Intake: 0.20-0.30mm, Exhaust: 0.40-0.50mm) is vital to prevent burned exhaust valves and lost compression.",
    steps: [
      {
        stepNumber: 1,
        title: "Prepare Engine (Cold Condition)",
        instruction: "Ensure engine is cold (under 20°C / 68°F). Remove intake crossover pipe, blowby PCV hose, and cylinder head valve cover.",
        checkItem: "Engine cold and valve cover removed"
      },
      {
        stepNumber: 2,
        title: "Position Cylinder No. 1 at TDC Compression",
        instruction: "Rotate crankshaft until TDC mark aligns on timing cover. Cam lobes for Cylinder No. 1 should point upward and away from lifters.",
        checkItem: "No. 1 at TDC compression"
      },
      {
        stepNumber: 3,
        title: "Measure Clearances for Group A Valves",
        instruction: "Using feeler gauge, measure gap between camshaft lobe base circle and shim for: Cyl 1 Intake & Exhaust, Cyl 2 Intake, Cyl 3 Exhaust. Record all measurements.",
        checkItem: "Group A clearance gaps recorded"
      },
      {
        stepNumber: 4,
        title: "Rotate Crank 360° to TDC Cylinder No. 4",
        instruction: "Rotate crankshaft 1 full turn (360°). Measure Group B valves: Cyl 2 Exhaust, Cyl 3 Intake, Cyl 4 Intake & Exhaust. Record all measurements.",
        checkItem: "Group B clearance gaps recorded"
      },
      {
        stepNumber: 5,
        title: "Calculate Required Shim Thickness",
        instruction: "For any valve outside specification (Intake: 0.20-0.30mm, Exhaust: 0.40-0.50mm), use formula:\nIntake New Shim: N = T + (A - 0.25 mm)\nExhaust New Shim: N = T + (A - 0.45 mm)\nWhere T = Old Shim Thickness, A = Measured Clearance.",
        checkItem: "New shim thicknesses calculated matching Toyota 0.05mm increment table"
      },
      {
        stepNumber: 6,
        title: "Extract Old Shim with SST Tool",
        instruction: "Position cam lobe pointing upward. Attach SST 09248-64011 to cylinder head and depress lifter bucket. Insert SST stopper wedge between camshaft and bucket rim. Remove tool, use magnetic pick and compressed air nozzle to pop old shim out of slot.",
        sstNumber: "09248-64011",
        warningAlert: "Do not scratch camshaft polished lobe surfaces with steel picks."
      },
      {
        stepNumber: 7,
        title: "Install New Shim & Re-Verify Clearance",
        instruction: "Measure new shim with micrometer to confirm thickness. Install with stamped number facing DOWN into bucket recess. Depress lifter, remove stopper wedge, and re-measure clearance with feeler gauge.",
        checkItem: "All 8 valve clearances within factory cold spec"
      },
      {
        stepNumber: 8,
        title: "Reinstall Valve Cover",
        instruction: "Clean head sealing rail. Apply Toyota FIPG sealant dab to half-moon seal corners. Install new valve cover gasket and torque acorn nuts to 8 Nm.",
        torqueCallout: "Valve Cover Nuts: 8 Nm (71 in-lb)"
      }
    ]
  },
  {
    id: "injection-pump-timing",
    title: "Bosch VE Injection Pump Static Timing (Plunger Stroke Dial Gauge)",
    category: "Fuel & Turbo",
    difficulty: "Master Mechanic",
    estimatedTime: "2 - 3 Hours",
    requiredSSTs: [
      { number: "09275-54011", name: "VE Pump Plunger Dial Gauge Adapter & Pin", description: "Threads into distributor head center plug to measure plunger stroke" }
    ],
    consumables: [
      "Center Plug Copper Sealing Washer (12mm)",
      "High Pressure Injection Line Washers"
    ],
    overview: "Proper injection timing controls peak cylinder combustion pressure, cold start smokiness, and diesel clatter. Static timing is set by measuring plunger stroke at TDC (0.58 - 0.64 mm).",
    steps: [
      {
        stepNumber: 1,
        title: "Release Cold Start ACSD Lever",
        instruction: "If equipped with thermostatic Automatic Cold Start Device (ACSD), insert a small flat tool between the thermo-wax piston pin and cold start advance lever to disable advance during static measurement.",
        warningAlert: "Failing to release ACSD advance lever will result in falsely retarded timing setting."
      },
      {
        stepNumber: 2,
        title: "Remove Distributor Head Center Plug",
        instruction: "Clean rear distributor head of VE injection pump thoroughly with brake cleaner. Remove 12mm center plug bolt located between the 4 high pressure delivery valves.",
        checkItem: "Center plug removed and cavity cleaned"
      },
      {
        stepNumber: 3,
        title: "Install Dial Indicator SST",
        instruction: "Thread SST 09275-54011 adapter with measuring pin and metric dial indicator into center plug hole. Apply approximately 2.0 mm preload to dial indicator pin.",
        sstNumber: "09275-54011",
        checkItem: "Dial gauge threaded in with ~2.0mm preload"
      },
      {
        stepNumber: 4,
        title: "Find Plunger Bottom Dead Center (BDC) & Zero Gauge",
        instruction: "Slowly rotate crankshaft counter-clockwise approximately 25°-30° until dial indicator needle stops moving. Zero the dial indicator bezel at this bottom resting point.",
        checkItem: "Dial gauge zeroed at plunger BDC"
      },
      {
        stepNumber: 5,
        title: "Rotate Crankshaft Clockwise to TDC No. 1",
        instruction: "Rotate crankshaft clockwise until the harmonic balancer timing mark aligns exactly with the 0° (TDC) pointer on the timing cover. Read the dial indicator measurement.",
        checkItem: "Measured plunger stroke recorded"
      },
      {
        stepNumber: 6,
        title: "Adjust Pump Position to Specification (0.58 - 0.64 mm)",
        instruction: "Target Plunger Stroke: 0.58 – 0.64 mm.\n• If stroke < 0.58 mm (Retarded): Loosen pump mounting nuts and tilt pump body TOWARD the engine block.\n• If stroke > 0.64 mm (Advanced): Tilt pump body AWAY from engine block.",
        checkItem: "Dial indicator reading between 0.58mm and 0.64mm at TDC"
      },
      {
        stepNumber: 7,
        title: "Torque Pump Nuts & Re-Verify",
        instruction: "Tighten 2x front mounting flange nuts (21 Nm) and rear support bracket bolts (19 Nm). Rotate crank 2 full turns and re-check dial gauge at TDC. Remove SST and install center plug with new copper washer (17 Nm).",
        torqueCallout: "Center Plug: 17 Nm | Pump Nuts: 21 Nm"
      }
    ]
  },
  {
    id: "cooling-purge-anti-crack",
    title: "Cooling System Anti-Air-Lock Purging Protocol",
    category: "Cooling",
    difficulty: "Beginner",
    estimatedTime: "45 Minutes",
    requiredSSTs: [
      { number: "Universal", name: "No-Spill Spill-Free Coolant Funnel Kit", description: "Elevates coolant level above heater core and cylinder head water jacket" }
    ],
    consumables: [
      "Toyota Red Long Life Coolant 50/50 mix",
      "New 0.9 bar OEM Radiator Cap (16401-54750)"
    ],
    overview: "Trapped air in the 2L-T cylinder head causes localized steam pockets, instantaneous hotspotting above the pre-combustion chambers, and head cracking. This protocol guarantees 100% air extraction.",
    steps: [
      {
        stepNumber: 1,
        title: "Elevate Front of Vehicle & Set Heater Controls",
        instruction: "Park vehicle on steep incline or raise front wheels with floor jacks so radiator filler neck is the absolute highest point in the entire vehicle. Move dashboard heater slider and rear heater switch to maximum HOT.",
        checkItem: "Front end elevated & both cabin heaters set to maximum hot"
      },
      {
        stepNumber: 2,
        title: "Attach Spill-Free Funnel & Fill",
        instruction: "Attach spill-free funnel adapter tightly to radiator neck. Slowly pour 50/50 Toyota Red coolant until funnel is 1/3 full. Squeeze upper and lower radiator hoses repeatedly to expel primary air bubbles.",
        checkItem: "Funnel installed with fluid pool above radiator neck"
      },
      {
        stepNumber: 3,
        title: "Start Engine & Run at High Idle",
        instruction: "Start engine and use dashboard manual idle knob (idle-up dial) to hold RPM at 1,800 - 2,000 RPM. Observe steady stream of air bubbles escaping through the funnel.",
        timerDurationSeconds: 600,
        timerLabel: "Warm-Up & Thermostat Opening (10 min)"
      },
      {
        stepNumber: 4,
        title: "Verify Thermostat Opening & Heater Core Flow",
        instruction: "Wait until lower radiator hose transitions from cold to hot (signaling thermostat has opened at 82°C). Feel dashboard heater vents to confirm blazing hot air output from both front and rear heater cores.",
        checkItem: "Lower hose hot and both heaters blowing maximum hot air"
      },
      {
        stepNumber: 5,
        title: "Final RPM Burp & Cap Installation",
        instruction: "Blip throttle to 2,500 RPM 3 times. Watch for final bubble expulsion. Stop engine, plug funnel stopper, remove funnel, top off overflow bottle to FULL line, and install new 0.9 bar radiator cap.",
        checkItem: "Radiator full to neck and expansion bottle at MAX line"
      }
    ]
  },
  {
    id: "super-glow-diagnosis",
    title: "Super Glow II Dual-Relay Electrical Diagnostics",
    category: "Electrical",
    difficulty: "Intermediate",
    estimatedTime: "1 Hour",
    requiredSSTs: [
      { number: "Digital Multimeter", name: "Automotive Multimeter with Low-Resistance Ohmmeter", description: "Measures milliohm values on glow plugs and dropping resistor" }
    ],
    consumables: [
      "OEM 6V Ceramic Glow Plugs (19850-54090)",
      "Contact Cleaner"
    ],
    overview: "Toyota's Super Glow II uses Relay 1 (12V flash heat for 2-6 sec) and Relay 2 (~6V afterglow via dropping resistor for up to 180 sec). Faulty dropping resistors or dead relays result in prolonged cranking and heavy white diesel smoke on cold start.",
    steps: [
      {
        stepNumber: 1,
        title: "Test Individual Glow Plug Resistance",
        instruction: "Disconnect negative battery terminal. Remove 8mm nuts and metal bus bar connecting the 4 glow plugs. Measure resistance between each glow plug center terminal and engine cylinder head ground.",
        checkItem: "Each plug measures 0.65 – 0.85 Ω at 20°C (Infinite resistance = burned open plug)"
      },
      {
        stepNumber: 2,
        title: "Test Dropping Resistor on Intake Plenum",
        instruction: "Locate ceramic dropping resistor mounted on top of intake manifold. Measure resistance between its 2 terminals.",
        checkItem: "Dropping resistor measures 0.02 – 0.04 Ω (Replace if open/cracked)"
      },
      {
        stepNumber: 3,
        title: "Test Glow Relay No. 1 (High Voltage Pre-Glow)",
        instruction: "Reconnect battery and glow bus bar. Connect multimeter voltmeter (+) to glow bus bar and (-) to engine block. Turn ignition key to ON. Voltage must spike to 11.5 - 12.0V for 2 to 6 seconds then click off.",
        checkItem: "12V present during pre-glow period"
      },
      {
        stepNumber: 4,
        title: "Test Glow Relay No. 2 (After-Glow Voltage)",
        instruction: "Immediately following Relay 1 click-off, bus bar voltage must drop to approximately 5.5 - 7.0V and remain active during cranking and initial engine idle.",
        checkItem: "5.5 - 7.0V after-glow voltage confirmed"
      },
      {
        stepNumber: 5,
        title: "Test Water Temperature Sensor (Glow Timer)",
        instruction: "Unplug 2-pin green coolant temp sensor at thermostat housing. Measure resistance across sensor pins: Cold (20°C) = 2.1–2.7 kΩ | Hot (80°C) = 0.28–0.36 kΩ.",
        checkItem: "Coolant sensor resistance matches thermistor temperature curve"
      }
    ]
  },
  {
    id: "aisin-manual-hub-rebuild",
    title: "Aisin Manual 4WD Locking Hub Teardown & Service",
    category: "Drivetrain",
    difficulty: "Intermediate",
    estimatedTime: "2 Hours",
    requiredSSTs: [
      { number: "09608-20012", name: "Snap Ring Pliers & Brass Drift", description: "Extracts axle spindle snap ring and cone washers" }
    ],
    consumables: [
      "Aisin Hub Gasket Kit & Star Lock Washers",
      "NLGI No. 2 Wheel Bearing Grease (Thin film only)",
      "Brake Cleaner"
    ],
    overview: "Aisin manual locking hubs are renowned for extreme durability. However, packed heavy grease can prevent the pawl spring from locking the splined clutch ring in sub-zero weather.",
    steps: [
      {
        stepNumber: 1,
        title: "Remove Dial Cover (FREE Position)",
        instruction: "Turn hub dial to FREE. Remove 6x 10mm bolts securing the aluminum dial clutch cover. Pull cover assembly straight off.",
        checkItem: "Cover removed with dial in FREE position"
      },
      {
        stepNumber: 2,
        title: "Remove Axle Shaft Retaining Snap Ring",
        instruction: "Thread an M8 bolt into end of CV axle stub shaft to pull shaft outward. Use snap ring pliers to remove external circlip and thrust washer.",
        sstNumber: "09608-20012",
        checkItem: "Circlip and thrust washer removed"
      },
      {
        stepNumber: 3,
        title: "Extract Conical Washers & Hub Body",
        instruction: "Remove 6x 12mm nuts from hub body studs. Use a brass drift and hammer to lightly tap the stud centers until the cone washers pop loose. Slide hub body off spindle studs.",
        warningAlert: "Never hammer steel studs directly without a brass drift.",
        checkItem: "All 6 cone washers and hub body extracted"
      },
      {
        stepNumber: 4,
        title: "Clean, Inspect & Apply LIGHT Grease Film",
        instruction: "Clean internal splines, spring, and sliding clutch gear in solvent. Inspect teeth for chipping. Coat sliding surfaces with a THIN film of light grease.",
        warningAlert: "CRITICAL: DO NOT pack hub body full of heavy grease! Heavy grease creates hydraulic suction that prevents pawl engagement in cold weather.",
        checkItem: "Clutch mechanism slides freely on pawl ramps"
      },
      {
        stepNumber: 5,
        title: "Reinstall Hub Body & Torque Hardware",
        instruction: "Install new paper gasket. Slide hub body onto studs, install cone washers, flat washers, and 6x nuts. Torque nuts to 31 Nm in star pattern. Reinstall axle snap ring, new cover gasket, and dial cover (10 Nm).",
        torqueCallout: "Hub Body Nuts: 31 Nm (23 ft-lb) | Cover: 10 Nm",
        checkItem: "Dial turns smoothly between FREE and LOCK with positive detent click"
      }
    ]
  }
];
