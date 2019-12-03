const initialExercises = [
    {
        title: 'Bench Press',
        modifiers: [], // ie. Incline, decline, seated, etc. For grouping in list, such as Bench Press - Incline, Bench Press - Decline
        muscleGroups: ['Chest'],
        equipment: ['Barbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Bench Press',
        modifiers: ['Incline'], 
        muscleGroups: ['Chest'],
        equipment: ['Barbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Bench Press',
        modifiers: ['Decline'],
        muscleGroups: ['Chest'],
        equipment: ['Barbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Dumbbell Bench Press',
        modifiers: [],
        muscleGroups: ['Chest'],
        equipment: ['Dumbbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Dumbbell Bench Press',
        modifiers: ['Incline'],
        muscleGroups: ['Chest'],
        equipment: ['Dumbbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Dumbbell Bench Press',
        modifiers: ['Decline'],
        muscleGroups: ['Chest'],
        equipment: ['Dumbbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Pectoral Raises',
        modifiers: [],
        muscleGroups: ['Chest'],
        equipment: ['Dumbbell'],
        laterality: 'unilateral'
    },
    {
        title: 'Dumbbell Flys',
        modifiers: [],
        muscleGroups: ['Chest'],
        equipment: ['Dumbbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Dumbbell Flys',
        modifiers: ['Incline'],
        muscleGroups: ['Chest'],
        equipment: ['Dumbbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Cable Flys',
        modifiers: [],
        muscleGroups: ['Chest'],
        equipment: ['Cable'],
        laterality: 'bilateral'
    },
    {
        title: 'Cable Flys',
        modifiers: ['Incline'],
        muscleGroups: ['Chest'],
        equipment: ['Cable'],
        laterality: 'bilateral'
    },
    {
        title: 'Cable Flys',
        modifiers: ['Decline'],
        muscleGroups: ['Chest'],
        equipment: ['Cable'],
        laterality: 'bilateral'
    },
    {
        title: 'Machine Flys',
        modifiers: [],
        muscleGroups: ['Chest'],
        equipment: ['Machine'],
        laterality: 'bilateral'
    },
    {
        title: 'Pushups',
        modifiers: [],
        muscleGroups: ['Chest'],
        equipment: ['None'],
        laterality: 'bilateral'
    },
    {
        title: 'Pushups',
        modifiers: ['Decline'],
        muscleGroups: ['Chest'],
        equipment: ['None'],
        laterality: 'bilateral'
    },
    {
        title: 'Lat Pulldown',
        modifiers: [],
        muscleGroups: ['Back'],
        equipment: ['Machine'],
        laterality: 'bilateral'
    },
    {
        title: 'Lat Pulldown',
        modifiers: ['Close-Grip'],
        muscleGroups: ['Back'],
        equipment: ['Machine'],
        laterality: 'bilateral'
    },
    {
        title: 'Barbell Row',
        modifiers: [],
        muscleGroups: ['Back'],
        equipment: ['Barbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Dumbbell Row',
        modifiers: [],
        muscleGroups: ['Back'],
        equipment: ['Dumbbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Pullup',
        modifiers: [],
        muscleGroups: ['Back'],
        equipment: ['None'],
        laterality: 'bilateral'
    },
    {
        title: 'Seated Cable Row',
        modifiers: [],
        muscleGroups: ['Back'],
        equipment: ['Cable'],
        laterality: 'bilateral'
    },
    {
        title: 'Machine Row',
        modifiers: [],
        muscleGroups: ['Back'],
        equipment: ['Machine'],
        laterality: 'bilateral'
    },
    {
        title: 'Machine Pulldown',
        modifiers: [],
        muscleGroups: ['Back'],
        equipment: ['Machine'],
        laterality: 'bilateral'
    },
    {
        title: 'Barbell Curl',
        modifiers: [],
        muscleGroups: ['Biceps'],
        equipment: ['Barbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Dumbbell Curl',
        modifiers: [],
        muscleGroups: ['Biceps'],
        equipment: ['Dumbbell'],
        laterality: 'unilateral'
    },
    {
        title: 'Dumbbell Curl',
        modifiers: ['Seated'],
        muscleGroups: ['Biceps'],
        equipment: ['Dumbbell'],
        laterality: 'unilateral'
    },
    {
        title: 'Cable Curl',
        modifiers: [],
        muscleGroups: ['Biceps'],
        equipment: ['Cable'],
        laterality: 'unilateral'
    },
    {
        title: 'Chin Up',
        modifiers: [],
        muscleGroups: ['Biceps', 'Back'],
        equipment: ['None'],
        laterality: 'bilateral'
    },
    {
        title: 'Concentration Curl',
        modifiers: [],
        muscleGroups: ['Biceps'],
        equipment: ['Dumbbell'],
        laterality: 'unilateral'
    },
    {
        title: 'Preacher Curl',
        modifiers: [],
        muscleGroups: ['Biceps'],
        equipment: ['Barbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Hammer Curl',
        modifiers: [],
        muscleGroups: ['Biceps', 'Forearms'],
        equipment: ['Dumbbell'],
        laterality: 'unilateral'
    },
    {
        title: 'EZ-Bar Curl',
        modifiers: [],
        muscleGroups: ['Biceps'],
        equipment: ['EZ-Bar'],
        laterality: 'bilateral'
    },
    {
        title: 'Cable Extension',
        modifiers: [],
        muscleGroups: ['Triceps'],
        equipment: ['Cable'],
        laterality: 'unilateral'
    },
    {
        title: 'Rope Overhead Extension',
        modifiers: [],
        muscleGroups: ['Triceps'],
        equipment: ['Cable'],
        laterality: 'bilateral'
    },
    {
        title: 'Skullcrusher',
        modifiers: [],
        muscleGroups: ['Triceps'],
        equipment: ['Barbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Dips',
        modifiers: [],
        muscleGroups: ['Triceps'],
        equipment: ['None'],
        laterality: 'bilateral'
    },
    {
        title: 'Rope Pushdown',
        modifiers: [],
        muscleGroups: ['Triceps'],
        equipment: ['Cable'],
        laterality: 'bilateral'
    },
    {
        title: 'Bench Press',
        modifiers: ['Close-Grip'],
        muscleGroups: ['Triceps', 'Chest'],
        equipment: ['Barbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Face Pull',
        modifiers: [],
        muscleGroups: ['Shoulders'],
        equipment: ['Cable'],
        laterality: 'bilateral'
    },
    {
        title: 'Front Dumbbell Raises',
        modifiers: [],
        muscleGroups: ['Shoulders'],
        equipment: ['Dumbbell'],
        laterality: 'unilateral'
    },
    {
        title: 'Lateral Dumbbell Raises',
        modifiers: [],
        muscleGroups: ['Shoulders'],
        equipment: ['Dumbbell'],
        laterality: 'unilateral'
    },
    {
        title: 'Front Cable Raises',
        modifiers: [],
        muscleGroups: ['Shoulders'],
        equipment: ['Cable'],
        laterality: 'unilateral'
    },
    {
        title: 'Lateral Cable Raises',
        modifiers: [],
        muscleGroups: ['Shoulders'],
        equipment: ['Cable'],
        laterality: 'unilateral'
    },
    {
        title: 'Military Press',
        modifiers: [],
        muscleGroups: ['Shoulders'],
        equipment: ['Dumbbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Overhead Press',
        modifiers: [],
        muscleGroups: ['Shoulders'],
        equipment: ['Dumbbell'],
        laterality: 'unilateral'
    },
    {
        title: 'Rear Flys',
        modifiers: [],
        muscleGroups: ['Shoulders'],
        equipment: ['Machine'],
        laterality: 'bilateral'
    },
    {
        title: 'Rear Flys',
        modifiers: [],
        muscleGroups: ['Shoulders'],
        equipment: ['Dumbbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Log Press',
        modifiers: [],
        muscleGroups: ['Shoulders'],
        equipment: ['Barbell'],
        laterality: 'unilateral'
    },
    {
        title: 'Squats',
        modifiers: [],
        muscleGroups: ['Legs'],
        equipment: ['Barbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Leg Press',
        modifiers: [],
        muscleGroups: ['Legs'],
        equipment: ['Machine'],
        laterality: 'bilateral'
    },
    {
        title: 'Lunges',
        modifiers: [],
        muscleGroups: ['Legs'],
        equipment: ['Dumbbell'],
        laterality: 'unilateral'
    },
    {
        title: 'Leg Press',
        modifiers: ['Incline'],
        muscleGroups: ['Legs'],
        equipment: ['Machine'],
        laterality: 'bilateral'
    },
    {
        title: 'Leg Extension Machine',
        modifiers: [],
        muscleGroups: ['Legs'],
        equipment: ['Machine'],
        laterality: 'unilateral'
    },
    {
        title: 'Leg Curl Machine',
        modifiers: ['Seated'],
        muscleGroups: ['Legs'],
        equipment: ['Machine'],
        laterality: 'unilateral'
    },
    {
        title: 'Leg Curl Machine',
        modifiers: ['Lying'],
        muscleGroups: ['Legs'],
        equipment: ['Machine'],
        laterality: 'unilateral'
    },
    {
        title: 'Calf Raises',
        modifiers: [],
        muscleGroups: ['Legs'],
        equipment: ['Dumbbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Calf Raises',
        modifiers: ['Seated'],
        muscleGroups: ['Legs'],
        equipment: ['Machine'],
        laterality: 'bilateral'
    },
    {
        title: 'Glute Bridges',
        modifiers: [],
        muscleGroups: ['Legs'],
        equipment: ['Barbbell'],
        laterality: 'bilateral'
    },
    {
        title: 'Cable Pull-Through',
        modifiers: [],
        muscleGroups: ['Legs'],
        equipment: ['Cable'],
        laterality: 'bilateral'
    },
    {
        title: 'Cable Crunch',
        modifiers: [],
        muscleGroups: ['Abs'],
        equipment: ['Cable'],
        laterality: 'bilateral'
    },
    {
        title: 'Cable Side Bends',
        modifiers: [],
        muscleGroups: ['Abs'],
        equipment: ['Cable'],
        laterality: 'unilateral'
    },
    {
        title: 'Wood Chops',
        modifiers: [],
        muscleGroups: ['Abs'],
        equipment: ['Cable'],
        laterality: 'unilateral'
    },
    {
        title: 'Wood Chops',
        modifiers: ['Decline'],
        muscleGroups: ['Abs'],
        equipment: ['Cable'],
        laterality: 'unilateral'
    },
    {
        title: 'Crunches',
        modifiers: [],
        muscleGroups: ['Abs'],
        equipment: ['None'],
        laterality: 'bilateral'
    },
    {
        title: 'Crunches',
        modifiers: ['Decline'],
        muscleGroups: ['Abs'],
        equipment: ['None'],
        laterality: 'bilateral'
    },
    {
        title: 'Oblique Crunches',
        modifiers: [],
        muscleGroups: ['Abs'],
        equipment: ['None'],
        laterality: 'unilateral'
    },
    {
        title: 'Hanging Leg Raises',
        modifiers: [],
        muscleGroups: ['Abs'],
        equipment: ['None'],
        laterality: 'bilateral'
    },
    {
        title: 'Reverse-Grip Dumbbell Curl',
        modifiers: [],
        muscleGroups: ['Forearms', 'Biceps'],
        equipment: ['Dumbbell'],
        laterality: 'unilateral'
    },
    {
        title: 'Reverse-Grip Barbell Curl',
        modifiers: [],
        muscleGroups: ['Forearms', 'Biceps'],
        equipment: ['Barbell'],
        laterality: 'unilateral'
    },
    {
        title: 'Wrist Curls',
        modifiers: ['Loose-Grip'],
        muscleGroups: ['Forearms'],
        equipment: ['Dumbbell'],
        laterality: 'unilateral'
    },
    {
        title: 'Wrist Curls',
        modifiers: ['Tight-Grip'],
        muscleGroups: ['Forearms'],
        equipment: ['Dumbbell'],
        laterality: 'unilateral'
    },
    

];

export default initialExercises;
