import type { Department } from './types';

export const DEPARTMENTS: Department[] = [
  { name: "Powertrain", blurb: "Engine, transmission, intake, exhaust, and cooling systems.", roles: ["Powertrain Lead", "Engine Specialist", "Transmission Engineer", "Cooling & Exhaust Lead"] },
  { name: "Braking", blurb: "Caliper selection, pedal box geometry, rotors, and master cylinders.", roles: ["Braking Lead", "Caliper & Rotor Designer", "Pedal Box Engineer", "Fluid Systems Specialist"] },
  { name: "Steering", blurb: "Steering columns, rack and pinion, steering geometry, and linkages.", roles: ["Steering Lead", "Column & Linkage Designer", "Rack & Pinion Engineer", "Geometry Analyst"] },
  { name: "Suspension", blurb: "Dampers, springs, wishbones, geometry, hubs, and uprights.", roles: ["Suspension Lead", "Suspension Geometry Lead", "Damper & Spring Engineer", "Upright & Hub Designer"] },
  { name: "Electronics", blurb: "Telemetry, DAQ, wiring harness, dashboard, sensors, and power distribution.", roles: ["Electronics Lead", "Wiring Harness Engineer", "Telemetry & DAQ Specialist", "Sensor & Dashboard Lead"] }
];
