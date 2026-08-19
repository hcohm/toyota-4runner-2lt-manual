export interface SchematicProbePoint {
  id: string;
  name: string;
  x: number; // percentage in SVG coordinate space
  y: number;
  expectedStateKeyON: string;
  expectedStateCranking: string;
  expectedResistance?: string;
  description: string;
  troubleshootingTip: string;
}

export const SUPER_GLOW_PROBE_POINTS: SchematicProbePoint[] = [
  {
    id: "battery-pos",
    name: "Battery Positive Terminal (+12.6V)",
    x: 8,
    y: 75,
    expectedStateKeyON: "12.6 V DC (Battery Voltage)",
    expectedStateCranking: "10.2 – 11.0 V DC (Under Starter Load)",
    description: "Main 12V supply feeding 80A GLOW fusible link and ignition switch.",
    troubleshootingTip: "Clean terminal posts; voltage drop across cable clamp must be <0.2V."
  },
  {
    id: "fusible-link-glow",
    name: "80A GLOW Fusible Link (Engine Bay Box)",
    x: 18,
    y: 75,
    expectedStateKeyON: "12.6 V DC",
    expectedStateCranking: "10.5 V DC",
    expectedResistance: "< 0.01 Ω (Continuity)",
    description: "High-current protection link supplying power directly to the contact studs of Glow Relay 1 and Relay 2.",
    troubleshootingTip: "If blown, entire glow system is completely dead with 0V at bus bar."
  },
  {
    id: "glow-relay-1-contact",
    name: "Glow Relay No. 1 - Main Output (High Power Pre-Glow)",
    x: 42,
    y: 35,
    expectedStateKeyON: "11.5 – 12.2 V DC (for 2 to 6 seconds, then 0V)",
    expectedStateCranking: "0 V DC (Transfers over to Relay 2)",
    expectedResistance: "Coil: 18 – 24 Ω",
    description: "Applies direct unfettered 12V battery current directly to the 4 glow plugs for fast heating to 900°C.",
    troubleshootingTip: "If no 12V click occurs, check relay control signal from Timer ECU pin 3."
  },
  {
    id: "glow-relay-2-contact",
    name: "Glow Relay No. 2 - After-Glow Output",
    x: 42,
    y: 65,
    expectedStateKeyON: "0 V DC during initial 2-6 sec, then 12.0 V DC through dropping resistor",
    expectedStateCranking: "10.5 V DC",
    description: "Engages immediately after Relay 1 clicks off to supply stepped-down voltage for smooth cold idling.",
    troubleshootingTip: "Stays active up to 180 seconds until engine coolant temp reaches >60°C."
  },
  {
    id: "dropping-resistor",
    name: "Dropping Resistor (0.02 Ω Ceramic on Intake)",
    x: 62,
    y: 65,
    expectedStateKeyON: "5.8 – 7.2 V DC at output terminal",
    expectedStateCranking: "5.5 – 6.5 V DC",
    expectedResistance: "0.02 – 0.04 Ω",
    description: "Drops 12V down to ~6V to prevent burning the sensitive 6V fast-heating glow plugs during prolonged after-glow.",
    troubleshootingTip: "If cracked or open-circuit, engine starts then runs extremely rough with thick white smoke after 5 seconds."
  },
  {
    id: "glow-plugs-bus",
    name: "Glow Plug Common Bus Bar (#1 to #4)",
    x: 82,
    y: 50,
    expectedStateKeyON: "Initial: 11.5V (Stage 1) -> Drops to 6.2V (Stage 2)",
    expectedStateCranking: "5.5 – 6.5 V DC",
    expectedResistance: "0.18 – 0.22 Ω (All 4 in parallel) / 0.65 – 0.85 Ω (Individual)",
    description: "Delivers electrical power to all four 2L-T ceramic/metallic glow plugs.",
    troubleshootingTip: "Inspect individual glow plugs if parallel resistance exceeds 0.35 Ω."
  },
  {
    id: "coolant-temp-sensor",
    name: "Water Temp Sensor for Glow Timer (Green 2-Pin)",
    x: 32,
    y: 15,
    expectedStateKeyON: "Analog Signal (2.1-2.7 kΩ cold, 300 Ω hot)",
    expectedStateCranking: "Analog Signal",
    expectedResistance: "2.1 – 2.7 kΩ @ 20°C / 0.28 – 0.36 kΩ @ 80°C",
    description: "Informs Glow Plug Timer module of engine temperature to adjust pre-glow duration between 2.0s (warm) and 6.0s (freezing).",
    troubleshootingTip: "Unplugging sensor forces Timer into default maximum cold pre-glow duration (good for testing)."
  },
  {
    id: "glow-timer-ecu",
    name: "Glow Plug Timer Module (Driver Kick Panel)",
    x: 25,
    y: 40,
    expectedStateKeyON: "Pin 1 (IGN): 12V | Pin 3 (Relay 1): 12V Pulse | Pin 4 (Relay 2): 12V Hold",
    expectedStateCranking: "Pin 5 (Start SW): 12V",
    description: "Solid-state electronic control module that orchestrates relay timing and dashboard indicator light.",
    troubleshootingTip: "Inspect circuit board capacitors for leakage if timing is erratic."
  }
];

export interface VacuumLineItem {
  id: string;
  name: string;
  source: string;
  destination: string;
  color: string;
  functionDescription: string;
  failureSymptom: string;
}

export const VACUUM_CIRCUIT_DATA: VacuumLineItem[] = [
  {
    id: "vac-boost-comp",
    name: "Boost Pressure Signal Line",
    source: "Intake Crossover Aluminum Pipe",
    destination: "Bosch VE Injection Pump Boost Compensator (LDA)",
    color: "#3B82F6", // Blue
    functionDescription: "Transfers turbocharger boost pressure (0-10 psi) to the rubber aneroid diaphragm on top of the VE pump, pushing down the eccentric fuel enrichment pin.",
    failureSymptom: "Severe loss of power under boost, engine feels like non-turbo 2L, sluggish acceleration."
  },
  {
    id: "vac-pump-main",
    name: "Main Vacuum Supply Line",
    source: "Alternator Rear Vane Vacuum Pump",
    destination: "Vacuum Storage Tank & Brake Booster Check Valve",
    color: "#10B981", // Green
    functionDescription: "Provides continuous 500-600 mmHg vacuum generated by the oil-lubricated vane pump on the back of the alternator.",
    failureSymptom: "Hard brake pedal, complete loss of power brake assist, 4WD ADD actuator inoperative."
  },
  {
    id: "vac-add-engage",
    name: "4WD ADD Differential Engagement Vacuum Line",
    source: "ADD Vacuum Switching Valve (VSV No. 1 - Blue)",
    destination: "Front Axle Differential Vacuum Actuator Diaphragm (Left Chamber)",
    color: "#F59E0B", // Amber
    functionDescription: "Applies engine vacuum to slide the splined clutch sleeve to lock the front intermediate axle shaft when 4WD is selected on transfer case.",
    failureSymptom: "Transfer case is shifted to 4H/4L but front wheels have no drive, 4WD indicator light flashes continuously."
  },
  {
    id: "vac-add-disengage",
    name: "4WD ADD Differential Disengage Vacuum Line",
    source: "ADD Vacuum Switching Valve (VSV No. 2 - Brown)",
    destination: "Front Axle Differential Vacuum Actuator Diaphragm (Right Chamber)",
    color: "#8B5CF6", // Purple
    functionDescription: "Applies engine vacuum to return the front axle clutch sleeve to the open 2WD position.",
    failureSymptom: "Front differential remains locked in 2WD mode causing excess fuel consumption and driveline drag."
  },
  {
    id: "vac-hac",
    name: "High Altitude Compensator (HAC) Line",
    source: "HAC Barometric Bellows Unit (Firewall)",
    destination: "VE Injection Pump Altitude Capsule",
    color: "#EC4899", // Pink
    functionDescription: "Bleeds atmospheric pressure to reduce maximum fuel delivery when driving at altitudes above 1,000 meters to prevent heavy black smoke.",
    failureSymptom: "Excessive soot and black smoke during mountain driving."
  }
];
