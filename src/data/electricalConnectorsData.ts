export interface ConnectorPin {
  pinNumber: number;
  label: string;
  wireColor: string; // Toyota color code (e.g. "B-W", "W-R")
  wireColorFull: string;
  function: string;
  testCondition: string;
  expectedVoltage: string;
}

export interface ElectricalComponentLocator {
  id: string;
  name: string;
  shortCode: string;
  zone: "Engine Bay (Driver Side)" | "Engine Bay (Passenger Side)" | "Engine / Block Mounted" | "Cabin (Driver Footwell)" | "Drivetrain & Undercarriage";
  x: number; // Percentage on vehicle map
  y: number;
  physicalLocation: string;
  visualIdentifier: string;
  accessTips: string;
  system: "Glow & Starting" | "Fuel & Turbo" | "4WD & Driveline" | "Sensors & Gauges" | "Charging & Power";
  connectorShape: "2-Pin Oval" | "1-Pin Spade" | "6-Pin Rectangle" | "8-Pin Rectangle" | "3-Pin Round" | "10-Pin Timer" | "Screw Terminal Stud";
  pins: ConnectorPin[];
  failureSymptoms: string[];
}

export const TOYOTA_WIRE_COLOR_CODE_LEGEND: Record<string, string> = {
  "B": "Black",
  "W": "White",
  "R": "Red",
  "G": "Green",
  "L": "Blue (Light Blue)",
  "Y": "Yellow",
  "BR": "Brown",
  "O": "Orange",
  "V": "Violet / Purple",
  "P": "Pink",
  "GR": "Gray",
  "B-W": "Black with White Stripe",
  "B-Y": "Black with Yellow Stripe",
  "W-R": "White with Red Stripe",
  "W-B": "White with Black Stripe (Ground)",
  "G-B": "Green with Black Stripe",
  "G-R": "Green with Red Stripe",
  "L-Y": "Blue with Yellow Stripe",
  "L-B": "Blue with Black Stripe",
  "R-B": "Red with Black Stripe",
  "Y-G": "Yellow with Green Stripe",
  "Y-R": "Yellow with Red Stripe"
};

export const ELECTRICAL_LOCATOR_DATA: ElectricalComponentLocator[] = [
  {
    id: "glow-timer-ecu",
    name: "Glow Plug Timer ECU (Pre-Heating Computer)",
    shortCode: "GLOW-ECU",
    zone: "Cabin (Driver Footwell)",
    x: 42,
    y: 38,
    physicalLocation: "Inside cabin, bolted to the outer body pillar behind the plastic driver's left kick panel, just above the hood release latch.",
    visualIdentifier: "Black plastic rectangular module (~10x7 cm) with an aluminum mounting bracket and a 10-pin yellow/white locking connector. Stamped 'COMPUTER, GLOW PLUG TIMER' (OEM: 28521-54280 / 28521-54370).",
    accessTips: "Pry off the driver's plastic door sill scuff plate, unscrew the plastic thumb nut on the kick panel, and pull kick panel inward. Unbolt two 10mm bolts holding the bracket.",
    system: "Glow & Starting",
    connectorShape: "10-Pin Timer",
    pins: [
      { pinNumber: 1, label: "+B (Ignition Feed)", wireColor: "B-W", wireColorFull: "Black / White", function: "12V Switched Power from IGN 15A Fuse", testCondition: "Key ON", expectedVoltage: "12.0 – 12.6 V DC" },
      { pinNumber: 2, label: "STA (Starter Trigger)", wireColor: "B", wireColorFull: "Black", function: "Starter cranking detection signal", testCondition: "Key in START", expectedVoltage: "10.0 – 11.5 V DC" },
      { pinNumber: 3, label: "G1 (Relay 1 Control)", wireColor: "B-Y", wireColorFull: "Black / Yellow", function: "Low-side ground trigger for Glow Relay No. 1", testCondition: "Pre-Glow (0-6 sec)", expectedVoltage: "0.5 V (Grounded) &rarr; 12V (Off)" },
      { pinNumber: 4, label: "G2 (Relay 2 Control)", wireColor: "G-B", wireColorFull: "Green / Black", function: "Low-side ground trigger for Glow Relay No. 2", testCondition: "After-Glow (6-180 sec)", expectedVoltage: "0.5 V (Grounded) &rarr; 12V (Off)" },
      { pinNumber: 5, label: "IND (Glow Lamp)", wireColor: "G-R", wireColorFull: "Green / Red", function: "Drives dashboard GLOW amber indicator light", testCondition: "Key ON initial", expectedVoltage: "0.5 V (Lamp ON)" },
      { pinNumber: 6, label: "THW (Coolant Temp)", wireColor: "Y-G", wireColorFull: "Yellow / Green", function: "Analog thermistor input from engine water sensor", testCondition: "Key ON (Cold 20°C)", expectedVoltage: "3.2 – 3.8 V DC" },
      { pinNumber: 7, label: "E (Ground)", wireColor: "W-B", wireColorFull: "White / Black", function: "Chassis ground connection", testCondition: "All states", expectedVoltage: "< 0.05 V (0.0 Ω to ground)" }
    ],
    failureSymptoms: [
      "Glow indicator light stays on permanently or never illuminates",
      "Glow Relay No. 1 clicks on and off continuously like a machine gun",
      "No power sent to glow plugs during freezing cold mornings"
    ]
  },
  {
    id: "glow-relay-1",
    name: "Glow Relay No. 1 (Main High-Current 12V Pre-Glow)",
    shortCode: "RELAY-1",
    zone: "Engine Bay (Driver Side)",
    x: 24,
    y: 28,
    physicalLocation: "Mounted on the driver's side inner fender apron wall, approximately 15 cm behind the 80A main fusible link box.",
    visualIdentifier: "Heavy-duty cylindrical / square metal-can relay with two thick M6 threaded copper post studs for 12V battery cables and a 2-pin plastic trigger pigtail connector.",
    accessTips: "Easily accessible from the engine bay. Remove rubber weather cap over copper studs to probe 12V high-current bus.",
    system: "Glow & Starting",
    connectorShape: "Screw Terminal Stud",
    pins: [
      { pinNumber: 1, label: "BAT+", wireColor: "W", wireColorFull: "Thick White Cable", function: "Direct 12V battery feed through 80A fusible link", testCondition: "Constant", expectedVoltage: "12.6 V DC" },
      { pinNumber: 2, label: "OUT", wireColor: "B-R", wireColorFull: "Thick Black / Red", function: "High power 12V output direct to glow plug bus bar", testCondition: "Pre-Glow (0-6 sec)", expectedVoltage: "11.8 – 12.2 V DC" },
      { pinNumber: 3, label: "COIL+", wireColor: "B-W", wireColorFull: "Black / White", function: "Ignition 12V coil feed", testCondition: "Key ON", expectedVoltage: "12.0 V DC" },
      { pinNumber: 4, label: "COIL-", wireColor: "B-Y", wireColorFull: "Black / Yellow", function: "Ground trigger wire from Timer ECU Pin 3", testCondition: "Pre-Glow Active", expectedVoltage: "0.2 V (Grounded)" }
    ],
    failureSymptoms: [
      "No 12V flash heat on cold start, engine requires 20+ seconds of continuous cranking",
      "Thick white unburnt diesel smoke cloud upon cold startup",
      "Relay body gets scalding hot to touch"
    ]
  },
  {
    id: "glow-relay-2",
    name: "Glow Relay No. 2 (After-Glow Step-Down Relay)",
    shortCode: "RELAY-2",
    zone: "Engine Bay (Driver Side)",
    x: 26,
    y: 33,
    physicalLocation: "Mounted directly beside Glow Relay No. 1 on the driver's inner fender apron.",
    visualIdentifier: "Similar metal-can relay. Routes power through the dropping resistor on the intake manifold rather than directly to the bus bar.",
    accessTips: "Located 5 cm rearward of Relay No. 1 on the same metal bracket.",
    system: "Glow & Starting",
    connectorShape: "Screw Terminal Stud",
    pins: [
      { pinNumber: 1, label: "BAT+", wireColor: "W", wireColorFull: "White Cable", function: "12V Battery feed from 80A fusible link", testCondition: "Constant", expectedVoltage: "12.6 V DC" },
      { pinNumber: 2, label: "OUT", wireColor: "G-Y", wireColorFull: "Green / Yellow", function: "Feeds 12V to input side of 0.02Ω Dropping Resistor", testCondition: "After-Glow (6-180s)", expectedVoltage: "12.2 V DC" },
      { pinNumber: 3, label: "COIL+", wireColor: "B-W", wireColorFull: "Black / White", function: "Ignition 12V coil feed", testCondition: "Key ON", expectedVoltage: "12.0 V DC" },
      { pinNumber: 4, label: "COIL-", wireColor: "G-B", wireColorFull: "Green / Black", function: "Ground trigger from Timer ECU Pin 4", testCondition: "After-Glow Active", expectedVoltage: "0.2 V (Grounded)" }
    ],
    failureSymptoms: [
      "Engine starts on initial 12V pre-glow, but immediately stumbles, runs rough and misfires after 5 seconds of idling",
      "Engine idles smoothly only after driving for 5 minutes"
    ]
  },
  {
    id: "dropping-resistor",
    name: "Dropping Resistor (Glow Step-Down Resistor 0.02 Ω)",
    shortCode: "DROP-RES",
    zone: "Engine / Block Mounted",
    x: 65,
    y: 28,
    physicalLocation: "Bolted directly to the top surface of the aluminum intake manifold crossover chamber (Right/top of engine).",
    visualIdentifier: "Rectangular ribbed ceramic/aluminum resistor body (~8x3 cm) with two 8mm nut screw terminals with protective rubber boots. Marked '0.02 Ω'.",
    accessTips: "Clearly visible on top of the intake manifold right above the glow plug bus bar.",
    system: "Glow & Starting",
    connectorShape: "Screw Terminal Stud",
    pins: [
      { pinNumber: 1, label: "IN", wireColor: "G-Y", wireColorFull: "Green / Yellow", function: "12V input feed from Glow Relay No. 2", testCondition: "After-Glow Active", expectedVoltage: "12.2 V DC" },
      { pinNumber: 2, label: "OUT", wireColor: "B-R", wireColorFull: "Black / Red", function: "Stepped down ~6V output connecting to glow plug bus bar", testCondition: "After-Glow Active", expectedVoltage: "5.8 – 6.8 V DC" }
    ],
    failureSymptoms: [
      "Ceramic body cracked or internal nichrome wire burned open (reading infinite resistance on ohmmeter)",
      "Severe cold idle knocking and white smoke during warm-up phase"
    ]
  },
  {
    id: "water-temp-glow-sensor",
    name: "Water Temperature Sensor (for Glow Timer Thermistor)",
    shortCode: "THW-SENS",
    zone: "Engine / Block Mounted",
    x: 58,
    y: 20,
    physicalLocation: "Threaded into the water outlet housing at the front top of the cylinder head, right next to the upper radiator hose connection.",
    visualIdentifier: "Brass hexagonal sensor with a GREEN 2-pin oval plastic waterproof connector with a wire spring locking clip (OEM: 89422-20010).",
    accessTips: "Front of engine head, behind the timing belt upper plastic cover.",
    system: "Sensors & Gauges",
    connectorShape: "2-Pin Oval",
    pins: [
      { pinNumber: 1, label: "THW (Signal)", wireColor: "Y-G", wireColorFull: "Yellow / Green", function: "NTC Thermistor resistance to Glow Timer ECU", testCondition: "20°C: 2.1–2.7 kΩ | 80°C: 280–360 Ω", expectedVoltage: "Analog Voltage 0.5V – 4.2V" },
      { pinNumber: 2, label: "E2 (Ground)", wireColor: "BR", wireColorFull: "Brown", function: "Sensor ground return", testCondition: "Constant", expectedVoltage: "< 0.05 V (Continuity)" }
    ],
    failureSymptoms: [
      "Glow timer thinks engine is always freezing cold, holding maximum pre-glow on warm restarts",
      "Glow timer thinks engine is always hot, giving zero pre-glow on cold sub-zero mornings"
    ]
  },
  {
    id: "fuel-cut-solenoid",
    name: "Bosch VE Fuel Cut Solenoid",
    shortCode: "FUEL-CUT",
    zone: "Engine / Block Mounted",
    x: 52,
    y: 42,
    physicalLocation: "Threaded vertically into the rear distributor cast iron head of the Bosch VE fuel injection pump, situated directly between the 4 high-pressure delivery valve fittings.",
    visualIdentifier: "24mm brass/steel hexagonal solenoid body with a single terminal stud covered by a black rubber boot. Single wire connected with an 8mm nut.",
    accessTips: "Located on the pump rear facing the firewall. Reach down between the intake manifold runners.",
    system: "Fuel & Turbo",
    connectorShape: "1-Pin Spade",
    pins: [
      { pinNumber: 1, label: "IGN 12V", wireColor: "B-W", wireColorFull: "Black / White", function: "12V power from ignition switch / IGN 15A fuse to retract internal fuel stop plunger", testCondition: "Key in ON / START", expectedVoltage: "12.0 – 12.6 V DC" }
    ],
    failureSymptoms: [
      "Engine cranks strongly and has compression, but will not fire even with starter fluid",
      "Zero fuel squirt from loosened injector flare nuts while cranking",
      "Engine suddenly shuts off while driving if wire is loose"
    ]
  },
  {
    id: "vsv-4wd-add",
    name: "4WD ADD Vacuum Switching Valves (Blue: 4WD / Brown: 2WD)",
    shortCode: "4WD-VSVs",
    zone: "Engine Bay (Passenger Side)",
    x: 78,
    y: 35,
    physicalLocation: "Mounted on a bracket on the passenger-side inner fender apron, located between the windshield washer fluid bottle and the fuel filter assembly.",
    visualIdentifier: "Two colored cylindrical solenoids mounted side-by-side: BLUE valve is for 4WD engagement, BROWN valve is for 2WD disengagement. Each has a 2-pin connector and two 3.5mm vacuum ports.",
    accessTips: "Passenger fender apron. Check the vacuum hoses running down beneath the battery tray.",
    system: "4WD & Driveline",
    connectorShape: "2-Pin Oval",
    pins: [
      { pinNumber: 1, label: "12V Power", wireColor: "B-W", wireColorFull: "Black / White", function: "Switched 12V power from 4WD fuse circuit", testCondition: "Key ON", expectedVoltage: "12.2 V DC" },
      { pinNumber: 2, label: "Control Ground", wireColor: "L-Y", wireColorFull: "Blue / Yellow", function: "Ground signal from Transfer Case 4WD position switch", testCondition: "Shift lever in 4H/4L", expectedVoltage: "0.2 V (Solenoid Energized)" }
    ],
    failureSymptoms: [
      "Green 4WD indicator light flashes indefinitely on dashboard",
      "Transfer case shifted to 4WD but front wheels do not receive torque",
      "Solenoid coil measures infinite resistance (>100 kΩ) due to internal open circuit"
    ]
  },
  {
    id: "alternator-connector",
    name: "Alternator & Internal IC Regulator Connector",
    shortCode: "ALT-REG",
    zone: "Engine / Block Mounted",
    x: 62,
    y: 55,
    physicalLocation: "Located on the rear cover of the 55A/60A alternator on the lower right side of the engine block.",
    visualIdentifier: "Green or Grey 3-pin round/oval waterproof connector with locking tab, plus a separate heavy-gauge B+ output stud with a rubber boot.",
    accessTips: "Accessed from underneath passenger wheel well or through the front skid plate opening.",
    system: "Charging & Power",
    connectorShape: "3-Pin Round",
    pins: [
      { pinNumber: 1, label: "S (Sense)", wireColor: "W", wireColorFull: "White", function: "Direct battery voltage sense line for internal IC regulator", testCondition: "Constant", expectedVoltage: "12.6 V DC" },
      { pinNumber: 2, label: "IG (Ignition)", wireColor: "B-Y", wireColorFull: "Black / Yellow", function: "12V Exciter power to turn on the regulator", testCondition: "Key ON", expectedVoltage: "12.0 V DC" },
      { pinNumber: 3, label: "L (Lamp)", wireColor: "Y-W", wireColorFull: "Yellow / White", function: "Drives dashboard CHARGE warning lamp", testCondition: "Engine Running", expectedVoltage: "13.8 – 14.6 V DC" },
      { pinNumber: 4, label: "B+ (Main Output)", wireColor: "Thick W", wireColorFull: "Thick White Cable", function: "High amperage charging output directly to battery", testCondition: "Engine Running @ 2,000 RPM", expectedVoltage: "13.8 – 14.8 V DC" }
    ],
    failureSymptoms: [
      "Both the BATTERY and BRAKE warning lights illuminate simultaneously on the dash (Classic Toyota alternator failure signature!)",
      "Battery drains flat overnight or charging voltage stays below 12.5V"
    ]
  },
  {
    id: "water-sedimenter-switch",
    name: "Fuel Filter Water Sedimenter Float Switch",
    shortCode: "SED-SWITCH",
    zone: "Engine Bay (Passenger Side)",
    x: 75,
    y: 22,
    physicalLocation: "Threaded directly into the plastic drain cock on the very bottom of the diesel fuel filter canister.",
    visualIdentifier: "2-pin black connector pigtail emerging from the bottom wing-nut drain plug of the fuel filter.",
    accessTips: "Passenger side firewall / inner fender near brake booster.",
    system: "Sensors & Gauges",
    connectorShape: "2-Pin Oval",
    pins: [
      { pinNumber: 1, label: "Signal", wireColor: "Y-R", wireColorFull: "Yellow / Red", function: "Switches ground to dashboard fuel filter warning icon when water float rises", testCondition: "Water level high in filter", expectedVoltage: "0.2 V (Grounded / Light ON)" },
      { pinNumber: 2, label: "Ground", wireColor: "W-B", wireColorFull: "White / Black", function: "Chassis ground connection", testCondition: "Constant", expectedVoltage: "< 0.05 V" }
    ],
    failureSymptoms: [
      "Dashboard fuel pump / water droplet icon lights up amber",
      "Water contamination entering VE injection pump if not drained immediately"
    ]
  },
  {
    id: "front-diff-add-switch",
    name: "Front Axle ADD 4WD Engagement Position Switch",
    shortCode: "ADD-SW",
    zone: "Drivetrain & Undercarriage",
    x: 48,
    y: 72,
    physicalLocation: "Threaded into the aluminum intermediate axle tube of the front IFS 7.5\" differential (Left/driver side of differential carrier).",
    visualIdentifier: "22mm hexagonal brass switch body with a 2-pin harness connector with corrugated loom.",
    accessTips: "Crawl underneath front skid plate. Look directly above the left front CV half-shaft flange.",
    system: "4WD & Driveline",
    connectorShape: "2-Pin Oval",
    pins: [
      { pinNumber: 1, label: "Signal", wireColor: "G-W", wireColorFull: "Green / White", function: "Sends ground confirmation to 4WD relay when clutch collar fully locks axle", testCondition: "Front axle locked", expectedVoltage: "0.2 V (Continuity across switch)" },
      { pinNumber: 2, label: "Ground", wireColor: "W-B", wireColorFull: "White / Black", function: "Ground return", testCondition: "Constant", expectedVoltage: "< 0.05 V" }
    ],
    failureSymptoms: [
      "Front differential physically locks in 4WD, but dash 4WD light never stops flashing",
      "Switch contacts corroded from river crossings"
    ]
  },
  {
    id: "temp-gauge-sender",
    name: "Coolant Temperature Gauge Sender (Instrument Cluster)",
    shortCode: "TEMP-GAUGE",
    zone: "Engine / Block Mounted",
    x: 46,
    y: 22,
    physicalLocation: "Threaded into the left (intake) side of the cylinder head casting, situated between Cylinder #1 and #2 glow plug ports.",
    visualIdentifier: "Small single-terminal brass sensor with a push-on plastic spade slide connector with rubber boot (OEM: 83420-16040).",
    accessTips: "Left side of cylinder head beneath the intake manifold.",
    system: "Sensors & Gauges",
    connectorShape: "1-Pin Spade",
    pins: [
      { pinNumber: 1, label: "Gauge Feed", wireColor: "Y-G", wireColorFull: "Yellow / Green", function: "Variable resistance to ground controlling dashboard temperature needle", testCondition: "Cold (20°C): ~600 Ω | Hot (80°C): ~30 Ω", expectedVoltage: "Analog 3V – 10V" }
    ],
    failureSymptoms: [
      "Dashboard coolant temperature gauge needle is completely dead or pegged past hot",
      "If spade connector touches engine block, gauge needle immediately pegs to maximum hot"
    ]
  },
  {
    id: "main-fuse-box-engine",
    name: "Main Engine Bay Fusible Link & Relay Center",
    shortCode: "FUSE-ENG",
    zone: "Engine Bay (Driver Side)",
    x: 18,
    y: 22,
    physicalLocation: "Black plastic fuse box mounted on the driver's side inner fender, situated directly behind the main starting battery.",
    visualIdentifier: "Rectangular black plastic cover embossed with 'FUSE & RELAY'. Contains the 80A GLOW bolt-down fusible link, 60A MAIN, and 30A HEAD fuses.",
    accessTips: "Depress plastic side clips to unlatch cover. 80A fusible link is bolted down with two 8mm screws from underneath the bus bar.",
    system: "Charging & Power",
    connectorShape: "Screw Terminal Stud",
    pins: [
      { pinNumber: 1, label: "80A GLOW", wireColor: "W", wireColorFull: "White 8.0mm²", function: "Main feed for Glow Relay 1 & Relay 2", testCondition: "Constant", expectedVoltage: "12.6 V DC" },
      { pinNumber: 2, label: "60A MAIN", wireColor: "W-R", wireColorFull: "White / Red 5.0mm²", function: "Main battery power feed to cabin ignition switch", testCondition: "Constant", expectedVoltage: "12.6 V DC" },
      { pinNumber: 3, label: "30A HEAD", wireColor: "R-Y", wireColorFull: "Red / Yellow 3.0mm²", function: "Headlight and lighting circuit feed", testCondition: "Constant", expectedVoltage: "12.6 V DC" }
    ],
    failureSymptoms: [
      "Completely dead vehicle with zero power to ignition switch (60A MAIN blown)",
      "Zero power to glow plugs (80A GLOW blown after accidental short circuit on bus bar)"
    ]
  }
];
