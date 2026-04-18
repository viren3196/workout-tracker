import { v4 as uuid } from 'uuid';
import type { Exercise, MuscleGroup, EquipmentType, WeightMode } from '../types';

function ex(
  name: string,
  category: MuscleGroup,
  equipmentType: EquipmentType = 'BARBELL',
  weightMode: WeightMode = 'TOTAL_WEIGHT',
  defaultBarWeight?: number
): Exercise {
  return {
    id: uuid(),
    name,
    category,
    equipmentType,
    weightMode,
    defaultBarWeight,
    isFavorite: false,
    isCustom: false,
  };
}

export const DEFAULT_EXERCISES: Exercise[] = [
  // Chest
  ex('Flat Bench Press', 'chest', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Incline Bench Press', 'chest', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Decline Bench Press', 'chest', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Dumbbell Bench Press', 'chest', 'DUMBBELL', 'PER_SIDE'),
  ex('Incline Dumbbell Press', 'chest', 'DUMBBELL', 'PER_SIDE'),
  ex('Dumbbell Fly', 'chest', 'DUMBBELL', 'PER_SIDE'),
  ex('Cable Fly', 'chest', 'CABLE', 'STACK_WEIGHT'),
  ex('Pec Deck', 'chest', 'MACHINE', 'STACK_WEIGHT'),
  ex('Machine Chest Press', 'chest', 'MACHINE', 'STACK_WEIGHT'),
  ex('Push-up', 'chest', 'BODYWEIGHT', 'BODYWEIGHT_ONLY'),

  // Shoulders
  ex('Overhead Press', 'shoulders', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Dumbbell Shoulder Press', 'shoulders', 'DUMBBELL', 'PER_SIDE'),
  ex('Arnold Press', 'shoulders', 'DUMBBELL', 'PER_SIDE'),
  ex('Lateral Raise', 'shoulders', 'DUMBBELL', 'PER_SIDE'),
  ex('Front Raise', 'shoulders', 'DUMBBELL', 'PER_SIDE'),
  ex('Rear Delt Fly', 'shoulders', 'DUMBBELL', 'PER_SIDE'),
  ex('Face Pull', 'shoulders', 'CABLE', 'STACK_WEIGHT'),
  ex('Upright Row', 'shoulders', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Cable Lateral Raise', 'shoulders', 'CABLE', 'STACK_WEIGHT'),
  ex('Machine Shoulder Press', 'shoulders', 'MACHINE', 'STACK_WEIGHT'),

  // Triceps
  ex('Tricep Pushdown', 'triceps', 'CABLE', 'STACK_WEIGHT'),
  ex('Rope Pushdown', 'triceps', 'CABLE', 'STACK_WEIGHT'),
  ex('Skull Crusher', 'triceps', 'BARBELL', 'TOTAL_WEIGHT', 10),
  ex('Overhead Tricep Extension', 'triceps', 'DUMBBELL', 'COMBINED'),
  ex('Close-Grip Bench Press', 'triceps', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Dips (Tricep)', 'triceps', 'BODYWEIGHT', 'BODYWEIGHT_ONLY'),
  ex('Kickback', 'triceps', 'DUMBBELL', 'PER_SIDE'),
  ex('Diamond Push-up', 'triceps', 'BODYWEIGHT', 'BODYWEIGHT_ONLY'),

  // Biceps
  ex('Barbell Curl', 'biceps', 'BARBELL', 'TOTAL_WEIGHT', 10),
  ex('Dumbbell Curl', 'biceps', 'DUMBBELL', 'PER_SIDE'),
  ex('Hammer Curl', 'biceps', 'DUMBBELL', 'PER_SIDE'),
  ex('Preacher Curl', 'biceps', 'BARBELL', 'TOTAL_WEIGHT', 10),
  ex('Incline Curl', 'biceps', 'DUMBBELL', 'PER_SIDE'),
  ex('Concentration Curl', 'biceps', 'DUMBBELL', 'COMBINED'),
  ex('Cable Curl', 'biceps', 'CABLE', 'STACK_WEIGHT'),
  ex('EZ-Bar Curl', 'biceps', 'BARBELL', 'TOTAL_WEIGHT', 10),
  ex('Spider Curl', 'biceps', 'DUMBBELL', 'PER_SIDE'),

  // Back
  ex('Pull-up', 'back', 'BODYWEIGHT', 'BODYWEIGHT_ONLY'),
  ex('Chin-up', 'back', 'BODYWEIGHT', 'BODYWEIGHT_ONLY'),
  ex('Lat Pulldown', 'back', 'CABLE', 'STACK_WEIGHT'),
  ex('Barbell Row', 'back', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Dumbbell Row', 'back', 'DUMBBELL', 'PER_SIDE'),
  ex('Seated Cable Row', 'back', 'CABLE', 'STACK_WEIGHT'),
  ex('T-Bar Row', 'back', 'PLATE_LOADED', 'TOTAL_WEIGHT'),
  ex('Face Pull (Back)', 'back', 'CABLE', 'STACK_WEIGHT'),
  ex('Deadlift', 'back', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Rack Pull', 'back', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Cable Pullover', 'back', 'CABLE', 'STACK_WEIGHT'),

  // Legs
  ex('Back Squat', 'legs', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Front Squat', 'legs', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Leg Press', 'legs', 'MACHINE', 'TOTAL_WEIGHT'),
  ex('Hack Squat', 'legs', 'MACHINE', 'TOTAL_WEIGHT'),
  ex('Leg Extension', 'legs', 'MACHINE', 'STACK_WEIGHT'),
  ex('Leg Curl', 'legs', 'MACHINE', 'STACK_WEIGHT'),
  ex('Romanian Deadlift', 'legs', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Bulgarian Split Squat', 'legs', 'DUMBBELL', 'PER_SIDE'),
  ex('Walking Lunge', 'legs', 'DUMBBELL', 'PER_SIDE'),
  ex('Goblet Squat', 'legs', 'DUMBBELL', 'COMBINED'),
  ex('Hip Thrust', 'legs', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Calf Raise (Standing)', 'legs', 'MACHINE', 'STACK_WEIGHT'),
  ex('Calf Raise (Seated)', 'legs', 'MACHINE', 'STACK_WEIGHT'),

  // Abs/Core
  ex('Crunch', 'abs', 'BODYWEIGHT', 'BODYWEIGHT_ONLY'),
  ex('Cable Crunch', 'abs', 'CABLE', 'STACK_WEIGHT'),
  ex('Hanging Leg Raise', 'abs', 'BODYWEIGHT', 'BODYWEIGHT_ONLY'),
  ex('Ab Wheel Rollout', 'abs', 'BODYWEIGHT', 'BODYWEIGHT_ONLY'),
  ex('Plank', 'abs', 'BODYWEIGHT', 'BODYWEIGHT_ONLY'),
  ex('Russian Twist', 'abs', 'DUMBBELL', 'COMBINED'),
  ex('Woodchop', 'abs', 'CABLE', 'STACK_WEIGHT'),
  ex('Dead Bug', 'abs', 'BODYWEIGHT', 'BODYWEIGHT_ONLY'),
  ex('Pallof Press', 'abs', 'CABLE', 'STACK_WEIGHT'),

  // Forearms
  ex('Wrist Curl', 'forearms', 'BARBELL', 'TOTAL_WEIGHT', 10),
  ex('Reverse Wrist Curl', 'forearms', 'BARBELL', 'TOTAL_WEIGHT', 10),
  ex('Farmer\'s Walk', 'forearms', 'DUMBBELL', 'PER_SIDE'),
  ex('Dead Hang', 'forearms', 'BODYWEIGHT', 'BODYWEIGHT_ONLY'),

  // Glutes
  ex('Hip Thrust (Glutes)', 'glutes', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Glute Bridge', 'glutes', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Cable Kickback', 'glutes', 'CABLE', 'STACK_WEIGHT'),
  ex('Sumo Deadlift', 'glutes', 'BARBELL', 'TOTAL_WEIGHT', 20),

  // Full Body
  ex('Clean and Press', 'fullbody', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Turkish Get-up', 'fullbody', 'DUMBBELL', 'COMBINED'),
  ex('Thruster', 'fullbody', 'BARBELL', 'TOTAL_WEIGHT', 20),
  ex('Burpee', 'fullbody', 'BODYWEIGHT', 'BODYWEIGHT_ONLY'),
];
