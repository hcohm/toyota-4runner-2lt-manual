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
