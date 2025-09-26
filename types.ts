
export enum TravelMode {
  WALK = 'Walk',
  CYCLE = 'Cycle',
  CAR = 'Car',
  MOTORBIKE = 'Motorbike',
  BUS = 'Bus',
  TRAIN = 'Train',
  AUTO = 'Auto-rickshaw',
  TAXI = 'Taxi',
  OTHER = 'Other',
}

export enum TripPurpose {
  WORK = 'Work',
  EDUCATION = 'Education',
  SHOPPING = 'Shopping',
  LEISURE = 'Leisure',
  PERSONAL = 'Personal Business',
  HEALTH = 'Health',
  SOCIAL = 'Social',
  OTHER = 'Other',
}

export enum TripFrequency {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  OCCASIONALLY = 'Occasionally',
}

export interface Trip {
  id: string;
  tripNumber: number;
  origin: { lat: number | ''; lon: number | '' };
  startTime: string;
  destination: { lat: number | ''; lon: number | '' };
  endTime: string;
  mode: TravelMode;
  distance: number | '';
  purpose: TripPurpose;
  companions: number | '';
  frequency: TripFrequency;
  cost: number | '';
}
