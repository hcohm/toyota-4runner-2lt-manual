export interface TorqueItem {
  id: string;
  category: "Engine Block & Bottom End" | "Cylinder Head & Valvetrain" | "Fuel & Turbo System" | "Cooling & Lubrication" | "Transmission & Transfer Case" | "Driveshaft & Axles" | "Suspension & Steering" | "Brake System";
  fastener: string;
  nm: number;
  ftlb: number;
  inlb?: number;
  kgfm: number;
  stageNote?: string;
  threadSpec?: string;
  critical?: boolean;
  warnings?: string;
}

export const TORQUE_SPECIFICATIONS: TorqueItem[] = [
  // Cylinder Head & Valvetrain
  {
    id: "head-bolts-1",
    category: "Cylinder Head & Valvetrain",
    fastener: "Cylinder Head Bolts (18x 12-point bolts, Stage 1)",
    nm: 78,
    ftlb: 58,
    kgfm: 8.0,
    stageNote: "Stage 1: Torque to 78 Nm in criss-cross sequence from center outwards",
    critical: true,
    warnings: "Ensure threads and bolt under-heads are lightly coated with clean engine oil. Follow reverse sequence during removal."
  },
  {
    id: "head-bolts-2",
    category: "Cylinder Head & Valvetrain",
    fastener: "Cylinder Head Bolts (Stage 2 - Angle)",
    nm: 78,
    ftlb: 58,
    kgfm: 8.0,
    stageNote: "Stage 2: Turn all bolts an additional +90° in the same criss-cross sequence",
    critical: true,
    warnings: "Paint reference mark on bolt head to verify exact 90° rotation."
  },
  {
    id: "head-bolts-3",
    category: "Cylinder Head & Valvetrain",
    fastener: "Cylinder Head Bolts (Stage 3 - Final Angle)",
    nm: 78,
    ftlb: 58,
    kgfm: 8.0,
    stageNote: "Stage 3: Turn all bolts a final additional +90° (Total 180° beyond Stage 1)",
    critical: true,
    warnings: "Yield bolts: If any bolt fails to maintain increasing resistance, discard and replace."
  },
  {
    id: "cam-bearing-caps",
    category: "Cylinder Head & Valvetrain",
    fastener: "Camshaft Bearing Cap Bolts (M8)",
    nm: 18,
    ftlb: 13,
    kgfm: 1.85,
    stageNote: "Tighten uniformly in several passes to prevent camshaft snap",
    critical: true
  },
  {
    id: "cam-sprocket-bolt",
    category: "Cylinder Head & Valvetrain",
    fastener: "Camshaft Timing Sprocket Retaining Bolt",
    nm: 98,
    ftlb: 72,
    kgfm: 10.0,
    critical: true,
    warnings: "Hold camshaft with wrench on cast hex portion while torquing bolt."
  },
  {
    id: "valve-cover-bolts",
    category: "Cylinder Head & Valvetrain",
    fastener: "Cylinder Head Valve Cover Acorn Nuts & Bolts",
    nm: 8,
    ftlb: 6,
    inlb: 71,
    kgfm: 0.8,
    stageNote: "Do not overtighten; verify rubber grommet seal compression."
  },
  {
    id: "glow-plugs",
    category: "Cylinder Head & Valvetrain",
    fastener: "Glow Plug Body into Cylinder Head",
    nm: 13,
    ftlb: 9.5,
    inlb: 115,
    kgfm: 1.3,
    warnings: "Anti-seize recommended on threads. Do not exceed torque to avoid breaking plug body in head."
  },
  {
    id: "glow-bridge-nuts",
    category: "Cylinder Head & Valvetrain",
    fastener: "Glow Plug Electrical Bus Bar Connecting Nuts",
    nm: 1.5,
    ftlb: 1.1,
    inlb: 13,
    kgfm: 0.15,
    warnings: "Very low torque! Overtightening will snap the center electrode post."
  },

  // Engine Block & Bottom End
  {
    id: "main-bearing-caps",
    category: "Engine Block & Bottom End",
    fastener: "Main Crankshaft Bearing Cap Bolts",
    nm: 103,
    ftlb: 76,
    kgfm: 10.5,
    critical: true,
    stageNote: "Tighten in 2-3 progressive passes starting from center main journal outward."
  },
  {
    id: "connecting-rod-caps",
    category: "Engine Block & Bottom End",
    fastener: "Connecting Rod Big-End Cap 12-point Bolts",
    nm: 54,
    ftlb: 40,
    kgfm: 5.5,
    stageNote: "54 Nm + 90° angle turn (Plastic region tightening on Gen 2)",
    critical: true,
    warnings: "Check plastic region bolt stretch. Discard if necked down."
  },
  {
    id: "crank-pulley-bolt",
    category: "Engine Block & Bottom End",
    fastener: "Crankshaft Harmonic Balancer Center Bolt",
    nm: 167,
    ftlb: 123,
    kgfm: 17.0,
    critical: true,
    warnings: "Must lock flywheel ring gear or use SST 09213-60017 pulley holder. High risk of keyway shear if under-torqued."
  },
  {
    id: "flywheel-bolts",
    category: "Engine Block & Bottom End",
    fastener: "Flywheel to Crankshaft Flange Bolts (Manual Transmission)",
    nm: 123,
    ftlb: 90,
    kgfm: 12.5,
    critical: true,
    stageNote: "Apply medium thread locker (Loctite 242) and torque in star pattern."
  },
  {
    id: "driveplate-bolts",
    category: "Engine Block & Bottom End",
    fastener: "Drive Plate / Flexplate to Crankshaft (Automatic A340H)",
    nm: 74,
    ftlb: 54,
    kgfm: 7.5,
    critical: true
  },
  {
    id: "oil-pump-bolts",
    category: "Engine Block & Bottom End",
    fastener: "Front Oil Pump Case to Engine Block Bolts",
    nm: 19,
    ftlb: 14,
    kgfm: 1.95
  },
  {
    id: "oil-pan-bolts",
    category: "Engine Block & Bottom End",
    fastener: "Oil Pan Sump Bolts & Nuts",
    nm: 9,
    ftlb: 6.6,
    inlb: 80,
    kgfm: 0.9,
    stageNote: "Apply Toyota FIPG 08826-00080 sealant bead, tighten progressively."
  },

  // Fuel & Turbo System
  {
    id: "injector-nozzle-holder",
    category: "Fuel & Turbo System",
    fastener: "Fuel Injection Nozzle Holder into Pre-Chamber",
    nm: 64,
    ftlb: 47,
    kgfm: 6.5,
    critical: true,
    warnings: "Always install brand new copper combustion seal and heat shield washer."
  },
  {
    id: "injector-leak-off-pipe",
    category: "Fuel & Turbo System",
    fastener: "Injector Return / Leak-Off Rail Banjo Nuts",
    nm: 29,
    ftlb: 21,
    kgfm: 3.0,
    warnings: "Use new aluminum crush washers to prevent fuel leakage onto hot cylinder head."
  },
  {
    id: "injection-lines",
    category: "Fuel & Turbo System",
    fastener: "High Pressure Steel Injection Line Flare Nuts",
    nm: 25,
    ftlb: 18,
    kgfm: 2.5,
    warnings: "Hold delivery valve holder with backup wrench while tightening."
  },
  {
    id: "inj-pump-sprocket",
    category: "Fuel & Turbo System",
    fastener: "Injection Pump Drive Gear Nut",
    nm: 64,
    ftlb: 47,
    kgfm: 6.5,
    critical: true
  },
  {
    id: "inj-pump-mounting-nuts",
    category: "Fuel & Turbo System",
    fastener: "Injection Pump Body to Front Timing Cover Flange Nuts",
    nm: 21,
    ftlb: 15,
    kgfm: 2.15
  },
  {
    id: "inj-pump-rear-bracket",
    category: "Fuel & Turbo System",
    fastener: "Injection Pump Rear Support Bracket to Engine Block",
    nm: 19,
    ftlb: 14,
    kgfm: 1.95,
    warnings: "Never leave rear bracket loose; vibration will crack aluminum front housing."
  },
  {
    id: "turbo-to-manifold",
    category: "Fuel & Turbo System",
    fastener: "CT20 Turbocharger to Exhaust Manifold Flange Nuts",
    nm: 52,
    ftlb: 38,
    kgfm: 5.3,
    critical: true,
    warnings: "Use high-temp copper lock nuts and stainless multi-layer gasket."
  },
  {
    id: "turbo-oil-feed-pipe",
    category: "Fuel & Turbo System",
    fastener: "Turbocharger Oil Feed Union Banjo Bolt",
    nm: 25,
    ftlb: 18,
    kgfm: 2.5,
    warnings: "Check union restrictor orifice for carbon blockage."
  },
  {
    id: "exhaust-manifold-nuts",
    category: "Fuel & Turbo System",
    fastener: "Exhaust Manifold to Cylinder Head Stud Nuts",
    nm: 44,
    ftlb: 32,
    kgfm: 4.5,
    critical: true
  },

  // Cooling & Lubrication
  {
    id: "water-pump-bolts",
    category: "Cooling & Lubrication",
    fastener: "Water Pump Assembly to Engine Block Bolts",
    nm: 19,
    ftlb: 14,
    kgfm: 1.95
  },
  {
    id: "timing-tensioner-bolt",
    category: "Cooling & Lubrication",
    fastener: "Timing Belt Tensioner Idler Pulley Pivot Bolt",
    nm: 43,
    ftlb: 32,
    kgfm: 4.4,
    critical: true,
    warnings: "Verify tensioner spring seated properly in keeper tab before final torque."
  },
  {
    id: "thermostat-housing",
    category: "Cooling & Lubrication",
    fastener: "Thermostat Water Inlet Housing Bolts",
    nm: 19,
    ftlb: 14,
    kgfm: 1.95
  },
  {
    id: "oil-drain-plug",
    category: "Cooling & Lubrication",
    fastener: "Engine Oil Sump Drain Plug",
    nm: 37,
    ftlb: 27,
    kgfm: 3.8,
    warnings: "Replace crushed fiber/aluminum drain plug washer."
  },

  // Transmission & Transfer Case
  {
    id: "bellhousing-bolts-large",
    category: "Transmission & Transfer Case",
    fastener: "Transmission Bellhousing to Engine Block (M12 Bolts)",
    nm: 72,
    ftlb: 53,
    kgfm: 7.3
  },
  {
    id: "bellhousing-bolts-small",
    category: "Transmission & Transfer Case",
    fastener: "Transmission Bellhousing to Engine Block (M10 Bolts)",
    nm: 39,
    ftlb: 29,
    kgfm: 4.0
  },
  {
    id: "clutch-pressure-plate",
    category: "Transmission & Transfer Case",
    fastener: "Clutch Cover / Pressure Plate to Flywheel Bolts",
    nm: 19,
    ftlb: 14,
    kgfm: 1.95,
    stageNote: "Tighten evenly 1 turn at a time in star pattern to avoid warping cover."
  },
  {
    id: "trans-crossmember-bolts",
    category: "Transmission & Transfer Case",
    fastener: "Transmission Crossmember to Frame Rails",
    nm: 44,
    ftlb: 32,
    kgfm: 4.5
  },
  {
    id: "trans-drain-fill",
    category: "Transmission & Transfer Case",
    fastener: "Manual Transmission / Transfer Case Fill & Drain Plugs (24mm)",
    nm: 37,
    ftlb: 27,
    kgfm: 3.8
  },

  // Driveshaft & Axles
  {
    id: "propeller-shaft-flanges",
    category: "Driveshaft & Axles",
    fastener: "Driveshaft / Propeller Shaft Flange Bolts & Locknuts",
    nm: 74,
    ftlb: 54,
    kgfm: 7.5,
    critical: true,
    warnings: "High-stress driveline connection. Replace deformed locknuts."
  },
  {
    id: "rear-diff-carrier-nuts",
    category: "Driveshaft & Axles",
    fastener: "Rear 8.0\" Differential 3rd Member to Axle Housing Stud Nuts",
    nm: 73,
    ftlb: 54,
    kgfm: 7.4
  },
  {
    id: "front-diff-mounting-bolts",
    category: "Driveshaft & Axles",
    fastener: "Front IFS Differential Housing Crossmember Support Bolts",
    nm: 147,
    ftlb: 108,
    kgfm: 15.0,
    critical: true
  },
  {
    id: "front-cv-halfshaft-nuts",
    category: "Driveshaft & Axles",
    fastener: "Front CV Half-Shaft Inner Axle Flange Stud Nuts (6x)",
    nm: 83,
    ftlb: 61,
    kgfm: 8.5,
    critical: true,
    warnings: "Torque in star pattern. Use conical spring washers."
  },
  {
    id: "front-spindle-bearing-locknut",
    category: "Driveshaft & Axles",
    fastener: "Front Wheel Bearing Outer Locknut (54mm Spindle Nut)",
    nm: 64,
    ftlb: 47,
    kgfm: 6.5,
    stageNote: "Preload inner nut to 59 Nm, spin hub, back off, set to 25 Nm, lock outer nut to 64 Nm with star lock washer."
  },
  {
    id: "aisin-hub-body-bolts",
    category: "Driveshaft & Axles",
    fastener: "Aisin Manual Hub Body to Wheel Hub (Cone Washer Studs)",
    nm: 31,
    ftlb: 23,
    kgfm: 3.2
  },

  // Suspension & Steering
  {
    id: "torsion-bar-anchor-nut",
    category: "Suspension & Steering",
    fastener: "Front Torsion Bar Height Adjusting Anchor Bolt Nut",
    nm: 88,
    ftlb: 65,
    kgfm: 9.0
  },
  {
    id: "upper-ball-joint",
    category: "Suspension & Steering",
    fastener: "Upper Ball Joint to Upper Control Arm Bolts",
    nm: 29,
    ftlb: 21,
    kgfm: 3.0
  },
  {
    id: "lower-ball-joint-stud",
    category: "Suspension & Steering",
    fastener: "Lower Ball Joint Castle Nut (to Steering Knuckle)",
    nm: 142,
    ftlb: 105,
    kgfm: 14.5,
    critical: true,
    warnings: "Install new cotter pin. If hole does not line up, tighten further to next slot (do not loosen)."
  },
  {
    id: "tie-rod-end-castle-nut",
    category: "Suspension & Steering",
    fastener: "Tie Rod End Castle Nut to Knuckle Arm",
    nm: 90,
    ftlb: 67,
    kgfm: 9.2,
    critical: true
  },
  {
    id: "steering-gearbox-mount",
    category: "Suspension & Steering",
    fastener: "Power Steering Gearbox to Frame Rail Bolts",
    nm: 123,
    ftlb: 90,
    kgfm: 12.5,
    critical: true
  },
  {
    id: "pitman-arm-nut",
    category: "Suspension & Steering",
    fastener: "Pitman Arm to Steering Gearbox Sector Shaft Nut",
    nm: 167,
    ftlb: 123,
    kgfm: 17.0,
    critical: true
  },
  {
    id: "rear-panhard-rod-bolts",
    category: "Suspension & Steering",
    fastener: "Rear Lateral Control Rod (Panhard Bar) Mounting Bolts",
    nm: 98,
    ftlb: 72,
    kgfm: 10.0
  },
  {
    id: "rear-control-arm-bolts",
    category: "Suspension & Steering",
    fastener: "Rear 4-Link Upper and Lower Control Arm Pivot Bolts",
    nm: 137,
    ftlb: 101,
    kgfm: 14.0,
    warnings: "Final torque must be applied with vehicle on ground at normal ride height to avoid bushing bind."
  },

  // Brake System
  {
    id: "front-caliper-bolts",
    category: "Brake System",
    fastener: "Front 4-Piston Brake Caliper Mounting Bolts",
    nm: 108,
    ftlb: 80,
    kgfm: 11.0,
    critical: true
  },
  {
    id: "brake-hose-banjo-bolts",
    category: "Brake System",
    fastener: "Brake Flexible Hose Banjo Union Bolt into Caliper",
    nm: 30,
    ftlb: 22,
    kgfm: 3.1,
    warnings: "Use new copper sealing washers."
  },
  {
    id: "wheel-lug-nuts",
    category: "Brake System",
    fastener: "Wheel Lug Nuts (6-Lug pattern M12x1.5)",
    nm: 112,
    ftlb: 83,
    kgfm: 11.5,
    stageNote: "Torque in star sequence: 1-4-2-5-3-6",
    critical: true
  }
];
