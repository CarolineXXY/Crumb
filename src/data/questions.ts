import { BakeCategory, Question, Diagnosis } from '../types';

export const CATEGORIES = [
  {
    id: 'bread' as BakeCategory,
    name: 'Artisan Bread & Yeast Bakes',
    description: 'Sourdough, sandwich loaves, brioche, and rolls.',
    icon: 'Wheat',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    accentColor: 'amber',
  },
  {
    id: 'cake' as BakeCategory,
    name: 'Cakes & Cupcakes',
    description: 'Sponge cakes, pound cakes, chiffons, and butter cakes.',
    icon: 'Cake',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-800',
    accentColor: 'rose',
  },
  {
    id: 'pastry' as BakeCategory,
    name: 'Pies & Flaky Pastries',
    description: 'Tart crusts, puff pastry, croissants, and choux.',
    icon: 'Cookie', // We use Cake/Cookie as a representation
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800',
    accentColor: 'orange',
  },
  {
    id: 'biscuits' as BakeCategory,
    name: 'Cookies & Biscuits',
    description: 'Chocolate chip cookies, shortbreads, and macaron shells.',
    icon: 'Smile', // Placeholder or custom
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    accentColor: 'yellow',
  },
  {
    id: 'other' as BakeCategory,
    name: 'Other Flour Adventures',
    description: 'Scones, quick breads, muffins, and flatbreads.',
    icon: 'Utensils',
    bgColor: 'bg-stone-50',
    borderColor: 'border-stone-200',
    textColor: 'text-stone-800',
    accentColor: 'stone',
  },
];

// Rich, educational questions branching logic. 
// We will have 6-8 sequential questions for each category to reach a diagnosis.
export const QUESTIONS: Record<BakeCategory, Question[]> = {
  bread: [
    {
      id: 'bread_crumb',
      text: 'How does the crumb (interior) of your baked bread feel and look?',
      category: 'bread',
      whyWeAsk: 'The interior structure (crumb) reveals how yeast produced gas, and how well the gluten network trapped it. Dense means gas didn\'t expand, while giant holes at the top mean gas escaped upwards.',
      options: [
        { value: 'dense_gummy_heavy', label: 'Dense, heavy, and slightly gummy', description: 'Feels wet, brick-like, and has very small air pockets.' },
        { value: 'dry_crumbly', label: 'Dry and crumbly', description: 'Falls apart easily when sliced, feels stale almost immediately.' },
        { value: 'giant_holes_top', label: 'Large tunnel-like holes near the crust', description: 'Also known as "fool\'s crumb" — big gaps at the top but dense at the bottom.' },
        { value: 'uneven_dense_open', label: 'Generally tight but with dense horizontal lines', description: 'Unbalanced holes with rubbery, unbaked segments.' },
      ],
      nextQuestionIdMap: {
        dense_gummy_heavy: 'bread_rise_stage',
        dry_crumbly: 'bread_hydration',
        giant_holes_top: 'bread_proofing',
        uneven_dense_open: 'bread_proofing',
      }
    },
    {
      id: 'bread_rise_stage',
      text: 'Did your dough rise noticeably during the first or second proof?',
      category: 'bread',
      whyWeAsk: 'Yeast fermentation is temperature and time dependent. Checking when the rise failed helps isolate whether the yeast was dead, too cold, or if it ran out of sugars to consume.',
      options: [
        { value: 'no_rise_at_all', label: 'Hardly any rise at all', description: 'The dough stayed flat like clay in both stages.' },
        { value: 'rose_then_deflated', label: 'Rose beautifully, but deflated in the oven', description: 'It collapsed in the oven, leaving a dipped or wrinkled top.' },
        { value: 'slow_incomplete_rise', label: 'Rose slightly but took twice the recommended time', description: 'Reached some volume, but required extreme patience.' },
      ],
      nextQuestionIdMap: {
        no_rise_at_all: 'bread_yeast_temp',
        rose_then_deflated: 'bread_yeast_temp',
        slow_incomplete_rise: 'bread_kneading_gluten',
      }
    },
    {
      id: 'bread_yeast_temp',
      text: 'What temperature water or liquid did you mix with the yeast?',
      category: 'bread',
      whyWeAsk: 'Yeast is a living organism. Liquid above 120°F (49°C) permanently kills yeast, while liquid below 70°F (21°C) slows it down to a near halt.',
      options: [
        { value: 'hot_water', label: 'Comfortably hot to the touch ( steaming )', description: 'Likely over 120°F (49°C).' },
        { value: 'cold_tepid', label: 'Cool or room temperature', description: 'Below 70°F (21°C).' },
        { value: 'warm_perfect', label: 'Warm bath temperature', description: 'Ideally around 100°F–110°F (38°C–43°C).' },
      ],
      nextQuestionIdMap: {
        hot_water: 'bread_recipe_accuracy',
        cold_tepid: 'bread_kneading_gluten',
        warm_perfect: 'bread_proofing_time',
      }
    },
    {
      id: 'bread_proofing',
      text: 'How long did the shaped dough proof before going into the oven?',
      category: 'bread',
      whyWeAsk: 'Proofing is the final fermentation. Under-proofed dough has too much energy left and bursts wildly in the oven. Over-proofed dough is exhausted and collapses from lack of gas support.',
      options: [
        { value: 'under_hour', label: 'Less than 1 hour (quite brief)', description: 'Baked as soon as it held its shape.' },
        { value: 'over_proofed_long', label: 'Several hours, or lost track of time', description: 'Dough got very puffy, jiggly, and spread flat.' },
        { value: 'cold_overnight', label: 'Overnight in the refrigerator', description: 'Used a slow, cold fermentation.' },
      ],
      nextQuestionIdMap: {
        under_hour: 'bread_kneading_gluten',
        over_proofed_long: 'bread_kneading_gluten',
        cold_overnight: 'bread_baking_temp',
      }
    },
    {
      id: 'bread_proofing_time',
      text: 'How did you determine the loaf was ready to bake?',
      category: 'bread',
      whyWeAsk: 'Baking timers are guidelines; gluten tension is the real clock. The poke test (whether a finger indent springs back slowly) is the gold standard for knowing when fermentation is optimal.',
      options: [
        { value: 'followed_recipe_time', label: 'Simply followed the time on the recipe', description: 'Timer went off, so in it went.' },
        { value: 'poke_test_rapid', label: 'Poked it: the dent sprang back instantly', description: 'Dough is elastic but still tight and full of gas tension.' },
        { value: 'poke_test_no_spring', label: 'Poked it: the dent stayed and didn\'t bounce back', description: 'Gluten structure is fully relaxed and weakened.' },
      ],
      nextQuestionIdMap: {
        followed_recipe_time: 'bread_kneading_gluten',
        poke_test_rapid: 'bread_kneading_gluten',
        poke_test_no_spring: 'bread_kneading_gluten',
      }
    },
    {
      id: 'bread_hydration',
      text: 'How did you measure your flour and liquids?',
      category: 'bread',
      whyWeAsk: 'Dipping a measuring cup into a flour bag compresses the flour, packing up to 30% more weight than called for! Measuring by weight (grams) is crucial for accurate baking hydration.',
      options: [
        { value: 'measuring_cups', label: 'Volume cups and spoons', description: 'Scooped directly from the container.' },
        { value: 'kitchen_scale', label: 'A digital kitchen scale (grams)', description: 'Weighed everything carefully.' },
      ],
      nextQuestionIdMap: {
        measuring_cups: 'bread_baking_temp',
        kitchen_scale: 'bread_baking_temp',
      }
    },
    {
      id: 'bread_kneading_gluten',
      text: 'How thoroughly did you knead the dough or perform stretch & folds?',
      category: 'bread',
      whyWeAsk: 'Kneading aligns gluten proteins into an elastic mesh. Without adequate gluten development, the dough cannot hold the pockets of CO2 produced by the yeast, resulting in dense bread.',
      options: [
        { value: 'no_knead_recipe', label: 'Minimal or no kneading (No-Knead recipe)', description: 'Relied on slow fermentation time to form gluten.' },
        { value: 'knead_brief', label: 'Kneaded by hand for 3–5 minutes', description: 'Until it was roughly holding together.' },
        { value: 'knead_full', label: 'Kneaded until it passed the "windowpane test"', description: 'Stretched thin enough to see light through without tearing.' },
      ],
      nextQuestionIdMap: {
        no_knead_recipe: 'bread_baking_temp',
        knead_brief: 'bread_baking_temp',
        knead_full: 'bread_baking_temp',
      }
    },
    {
      id: 'bread_baking_temp',
      text: 'What was your approximate oven temperature, and did you use steam?',
      category: 'bread',
      whyWeAsk: 'Artisan bread needs high heat (400°F–475°F) and steam in the first 15 minutes. Steam keeps the crust supple, allowing the bread to expand fully before the outer shell hardens.',
      options: [
        { value: 'low_temp_no_steam', label: '350°F–375°F (175°C–190°C), no steam source', description: 'Standard cake/cookie temp.' },
        { value: 'high_temp_with_steam', label: '425°F–475°F (220°C–245°C), with steam or Dutch Oven', description: 'Artisan style.' },
        { value: 'high_temp_no_steam', label: '425°F–475°F (220°C–245°C), but dry air (no steam)', description: 'Hot oven but no moisture cover.' },
      ]
    }
  ],
  cake: [
    {
      id: 'cake_symptom',
      text: 'What was the primary visual defect of your cake?',
      category: 'cake',
      whyWeAsk: 'Cake defects are beautifully descriptive geometry. A sunken middle usually points to weak gluten or premature oven-door openings, whereas a high cracked dome means the oven was too hot.',
      options: [
        { value: 'sunken_middle', label: 'A deep crater in the very center', description: 'The outer edges rose but the core collapsed.' },
        { value: 'domed_cracked', label: 'A tall peak/dome with cracks on top', description: 'Looks more like a volcano than a flat tier.' },
        { value: 'dense_rubbery_bottom', label: 'A dense, rubbery, translucent layer at the bottom', description: 'Sometimes called a "glue strip" near the base.' },
        { value: 'dry_coarse_clumpy', label: 'Dry, crumbly, or sawdust-like texture', description: 'Chokes you slightly, struggles to hold frosting.' },
      ],
      nextQuestionIdMap: {
        sunken_middle: 'cake_leavening',
        domed_cracked: 'cake_oven_temp',
        dense_rubbery_bottom: 'cake_mixing',
        dry_coarse_clumpy: 'cake_fat_sugar',
      }
    },
    {
      id: 'cake_leavening',
      text: 'How old is your baking powder or baking soda?',
      category: 'cake',
      whyWeAsk: 'Chemical leaveners are active for only 6-12 months once opened. Old raising agents lose their chemical potency, failing to push the cake up when the proteins set, causing a tragic sinkhole.',
      options: [
        { value: 'brand_new', label: 'Opened in the last 6 months', description: 'Fresh and active.' },
        { value: 'dusty_cabinet', label: 'Sitting in the cupboard for over a year (or expired)', description: 'Might have lost its fire.' },
        { value: 'didnt_use_any', label: 'Did not use any, relied on whipped eggs', description: 'Sponge or chiffon technique.' },
      ],
      nextQuestionIdMap: {
        brand_new: 'cake_oven_door',
        dusty_cabinet: 'cake_oven_door',
        didnt_use_any: 'cake_egg_whipping',
      }
    },
    {
      id: 'cake_oven_door',
      text: 'Did you open the oven door during the first 25 minutes of baking?',
      category: 'cake',
      whyWeAsk: 'Cakes rely on delicate trapped hot air bubbles. Opening the oven door lets out an immediate blast of heat, dropping the pressure. If the flour proteins haven\'t fully set yet, the cake collapses instantly.',
      options: [
        { value: 'opened_to_peek', label: 'Yes, just checked on it quick', description: 'Curiosity got the better of me.' },
        { value: 'left_alone', label: 'No, left it shut until the end', description: 'I used the oven light.' },
      ],
      nextQuestionIdMap: {
        opened_to_peek: 'cake_measuring',
        left_alone: 'cake_measuring',
      }
    },
    {
      id: 'cake_oven_temp',
      text: 'Do you use an independent hung oven thermometer inside your oven?',
      category: 'cake',
      whyWeAsk: 'Oven dials lie. A dial set to 350°F can actually fire at 390°F because internal sensors degrade. High heat forms a crust too quickly, forcing the expanding batter to erupt out the top as a dome.',
      options: [
        { value: 'no_thermometer', label: 'No, I trust my oven\'s built-in dial/display', description: 'Rely purely on the stove controls.' },
        { value: 'yes_thermometer', label: 'Yes, I monitor with a separate inside thermometer', description: 'I verify the actual coordinates.' },
      ],
      nextQuestionIdMap: {
        no_thermometer: 'cake_measuring',
        yes_thermometer: 'cake_mixing',
      }
    },
    {
      id: 'cake_mixing',
      text: 'How long did you mix the batter after adding the flour?',
      category: 'cake',
      whyWeAsk: 'Flour + water + agitation has a biological result: gluten. If we over-mix cake batter, we create a strong bread-like network that squeezes out gas, leaving a tough, rubbery layer on the bottom.',
      options: [
        { value: 'beaten_vigorously', label: 'Beaten thoroughly on high speed', description: 'Wanted to get rid of every lump.' },
        { value: 'folded_gentle', label: 'Folded gently with a spatula by hand', description: 'Just mixed until flour disappeared.' },
        { value: 'standard_mixer_time', label: 'Used standard mixer speed for a couple minutes', description: 'Followed recipe time closely.' },
      ],
      nextQuestionIdMap: {
        beaten_vigorously: 'cake_measuring',
        folded_gentle: 'cake_measuring',
        standard_mixer_time: 'cake_measuring',
      }
    },
    {
      id: 'cake_fat_sugar',
      text: 'Did you make any sugar or butter substitutions (e.g. reducing sugar)?',
      category: 'cake',
      whyWeAsk: 'Sugar is not just a sweetener; it is a wet tenderizer. Sugar molecules bond with water, keeping the flour hydrated and preventing gluten from becoming too tough. Reducing sugar makes cake extremely dry.',
      options: [
        { value: 'reduced_sugar', label: 'Yes, cut down on sugar to make it healthier', description: 'Reduced by 25% or more.' },
        { value: 'substituted_fat', label: 'Substituted oil for applesauce or yogurt', description: 'Tried a low-fat tweak.' },
        { value: 'followed_exactly', label: 'Followed sugar/fat ratios exactly', description: 'No substitutions made.' },
      ],
      nextQuestionIdMap: {
        reduced_sugar: 'cake_measuring',
        substituted_fat: 'cake_measuring',
        followed_exactly: 'cake_measuring',
      }
    },
    {
      id: 'cake_egg_whipping',
      text: 'For sponge techniques, how did you treat the egg whites?',
      category: 'cake',
      whyWeAsk: 'Whites need pristine conditions. Greasy bowls or egg yolk specks coat egg white proteins, stopping them from forming the stable foam skeleton required to support sponge rise.',
      options: [
        { value: 'whipped_stiff_dry', label: 'Whipped until dry and clumpy', description: 'Probably overwhipped.' },
        { value: 'grease_in_bowl', label: 'Struggled to beat them stiff', description: 'Might have had grease or a bit of yolk.' },
        { value: 'folded_too_rough', label: 'Whipped nicely but deflated when folding batter', description: 'Gluten batter was too heavy.' },
      ],
      nextQuestionIdMap: {
        whipped_stiff_dry: 'cake_measuring',
        grease_in_bowl: 'cake_measuring',
        folded_too_rough: 'cake_measuring',
      }
    },
    {
      id: 'cake_measuring',
      text: 'How did you weigh your primary cake flour?',
      category: 'cake',
      whyWeAsk: 'Like all bakes, flour packed into a scoop dryly is much heavier than flour fluffed into a scale. 1 cup can vary from 120g to 160g!',
      options: [
        { value: 'scooped_cups', label: 'Scooped with dry measuring cups', description: 'I scooped it directly out of the bag.' },
        { value: 'weighed_grams', label: 'Weighed on a digital scale in grams', description: 'I was accurate to the gram.' },
      ]
    }
  ],
  pastry: [
    {
      id: 'pastry_symptom',
      text: 'What went wrong with your pie crust or flaky pastry?',
      category: 'pastry',
      whyWeAsk: 'Pastry relies on alternating sheets of solid fat and dough. If the fat melts before baking, no pockets form, resulting in greasy pools or tough, cardboard-like crusts.',
      options: [
        { value: 'tough_and_rigid', label: 'Tough, cardboard-like, or hard to chew', description: 'No flakiness, feels like dense concrete.' },
        { value: 'shrunk_in_pan', label: 'Shrunk drastically down the pie plate sides', description: 'The edges slipped down, leaving a thick base.' },
        { value: 'soggy_bottom', label: 'The bottom crust is wet, limp, and doughy', description: 'The dreaded "wet towel" texture.' },
        { value: 'melted_greasy_pool', label: 'Butter leaked out during baking into a greasy pool', description: 'Pastry sits dryly inside melted butter.' },
      ],
      nextQuestionIdMap: {
        tough_and_rigid: 'pastry_fat_temp',
        shrunk_in_pan: 'pastry_resting',
        soggy_bottom: 'pastry_blind_bake',
        melted_greasy_pool: 'pastry_fat_temp',
      }
    },
    {
      id: 'pastry_fat_temp',
      text: 'What was the physical state of your butter/fat when mixing?',
      category: 'pastry',
      whyWeAsk: 'Flaky pastry is created when pieces of cold butter steam inside the oven, expanding into thin flaky pockets. Warm butter melts into the flour, turning flakes into cookie crumbs.',
      options: [
        { value: 'warm_softened', label: 'Softened or room temperature', description: 'Easy to mash with fingers.' },
        { value: 'shaved_ice_cold', label: 'Ice cold, straight from fridge/freezer', description: 'Extremely firm and cold.' },
        { value: 'melted_liquid', label: 'Completely liquid or melted', description: 'Poured into flour.' },
      ],
      nextQuestionIdMap: {
        warm_softened: 'pastry_water_amount',
        shaved_ice_cold: 'pastry_water_amount',
        melted_liquid: 'pastry_water_amount',
      }
    },
    {
      id: 'pastry_resting',
      text: 'Did you let your rolled pastry rest in the fridge before baking?',
      category: 'pastry',
      whyWeAsk: 'When rolling out dough, stretch creates gluten tension. Resting relaxes these flour cords. Without a 30-minute cold rest, those stretched gluten bands will snap back in the oven, shrinking your pie crust.',
      options: [
        { value: 'no_rest_baked_immediately', label: 'No rest, rolled and baked immediately', description: 'I was in a hurry!' },
        { value: 'cold_resting_30min', label: 'Rested in fridge for 30+ minutes', description: 'Kept it chilled and relaxed.' },
      ],
      nextQuestionIdMap: {
        no_rest_baked_immediately: 'pastry_water_amount',
        cold_resting_30min: 'pastry_water_amount',
      }
    },
    {
      id: 'pastry_blind_bake',
      text: 'Did you "blind bake" (pre-bake) your crust before adding filling?',
      category: 'pastry',
      whyWeAsk: 'Wet fillings soak into raw pastry before the heat can crisp it. Blind baking seals the moisture barrier with egg wash or partial baking, ensuring a crispy crunch.',
      options: [
        { value: 'poured_into_raw', label: 'Poured filling directly into raw crust', description: 'Standard recipe direction.' },
        { value: 'pre_baked_weights', label: 'Pre-baked with weights (dry beans/pie weights)', description: 'Kept the container flat.' },
      ],
      nextQuestionIdMap: {
        poured_into_raw: 'pastry_water_amount',
        pre_baked_weights: 'pastry_water_amount',
      }
    },
    {
      id: 'pastry_water_amount',
      text: 'How much water was added to the dough mixture?',
      category: 'pastry',
      whyWeAsk: 'Water is a double-agent. It dissolves flour proteins to make dough, but too much triggers gluey gluten bonds. Use only enough water to bind the loose crumbs together.',
      options: [
        { value: 'added_until_sticky', label: 'Poured until a smooth, wet, sticky ball formed', description: 'Very easy to roll.' },
        { value: 'barely_holding', label: 'Added tablespoons until it barely held together', description: 'Looks slightly shaggy but packs under pressure.' },
      ]
    }
  ],
  biscuits: [
    {
      id: 'bisc_symptom',
      text: 'What is the main issue with your cookies or biscuits?',
      category: 'biscuits',
      whyWeAsk: 'Cookies are a delicate battle of fat spreading versus flour structure setting. Spread issues or hardness tell us about temperature balance or flour volume.',
      options: [
        { value: 'spread_flat_puddle', label: 'Spread out completely into a flat, greasy puddle', description: 'Merged into one giant bake sheet-sized cookie.' },
        { value: 'puff_dry_cakey', label: 'Puffed up like cake or bread, dry and thick', description: 'Did not spread, lacks the chew.' },
        { value: 'rock_hard', label: 'Extremely hard and crispy, like dry crackers', description: 'Hard on the teeth, very pale.' },
        { value: 'burnt_bottoms', label: 'Perfect centers but completely black or burnt bottoms', description: 'Oven issues or sheet thermal heat transfer.' },
      ],
      nextQuestionIdMap: {
        spread_flat_puddle: 'bisc_dough_temp',
        puff_dry_cakey: 'bisc_measuring_dry',
        rock_hard: 'bisc_sugar_type',
        burnt_bottoms: 'bisc_baking_sheet',
      }
    },
    {
      id: 'bisc_dough_temp',
      text: 'Did you chill the shaped cookies before baking?',
      category: 'biscuits',
      whyWeAsk: 'Chilling solidifies the butter fats. Solid cold butter chips take longer to melt in the oven, allowing the outer flour structure to solidify before the fat flattens the cookie.',
      options: [
        { value: 'baked_straight_away', label: 'Baked immediately after mixing', description: 'Warm batter directly to hot tray.' },
        { value: 'chilled_some_time', label: 'Chilled in fridge for 30–60 minutes', description: 'Butter felt cold and rigid.' },
      ],
      nextQuestionIdMap: {
        baked_straight_away: 'bisc_butter_prep',
        chilled_some_time: 'bisc_measuring_dry',
      }
    },
    {
      id: 'bisc_butter_prep',
      text: 'How did you prepare the butter for the creamed stage?',
      category: 'biscuits',
      whyWeAsk: 'Cuffed room-temp butter holds oxygen bubbles. Microwaved or melted butter cannot hold air, leading to a quick-leaking puddle in the heat.',
      options: [
        { value: 'melted_microwave', label: 'Melted completely in microwave/saucepan', description: 'Easy liquid.' },
        { value: 'softened_perfect', label: 'Softened at room temp (holds fingerprint but cool)', description: 'Ideal cream state.' },
      ],
      nextQuestionIdMap: {
        melted_microwave: 'bisc_measuring_dry',
        softened_perfect: 'bisc_measuring_dry',
      }
    },
    {
      id: 'bisc_measuring_dry',
      text: 'How did you scoop your flour?',
      category: 'biscuits',
      whyWeAsk: 'Cookie dough uses flour to structure itself. Extra flour turns a chewy melt-in-your-mouth drop cookie into a dry, dome-shaped cake. Always fluff first or weigh.',
      options: [
        { value: 'cups_heavy', label: 'Compressed cup scoop directly from flour bin', description: 'Packed tight flour.' },
        { value: 'scale_exact', label: 'Weighed precisely in grams', description: 'Gram accuracy.' },
      ],
      nextQuestionIdMap: {
        cups_heavy: 'bisc_sugar_type',
        scale_exact: 'bisc_sugar_type',
      }
    },
    {
      id: 'bisc_sugar_type',
      text: 'What ratio of sugars did you use?',
      category: 'biscuits',
      whyWeAsk: 'Brown sugar contains molasses, which adds moisture and creates a soft, chewy center. White granulated sugar attracts less moisture, resulting in crispier, flatter edges.',
      options: [
        { value: 'mainly_white', label: 'Almost all white granulated sugar', description: 'Creates a crispy, crunchy bite.' },
        { value: 'balanced_brown_white', label: 'Shared 50/50 brown and white sugar', description: 'Standard cookie profile.' },
        { value: 'low_sugar_again', label: 'Reduced the sugar content globally', description: 'For health adjustments.' },
      ],
      nextQuestionIdMap: {
        mainly_white: 'bisc_baking_sheet',
        balanced_brown_white: 'bisc_baking_sheet',
        low_sugar_again: 'bisc_baking_sheet',
      }
    },
    {
      id: 'bisc_baking_sheet',
      text: 'What type of cookie sheet did you bake on?',
      category: 'biscuits',
      whyWeAsk: 'Dark, black metal cookie sheets absorb thermal infrared oven energy rapidly, scorching bottoms before the cookie top can bake. Shiny aluminum heats gradually.',
      options: [
        { value: 'dark_heavy_tray', label: 'Dark metal / black baking sheets', description: 'Quick toast/scorch.' },
        { value: 'light_aluminum_tray', label: 'Light, shiny silver metal sheets', description: 'Even heat reflection.' },
        { value: 'greased_foil_pan', label: 'Foil-covered tray with grease spray', description: 'Transfers moisture rapidly.' },
      ]
    }
  ],
  other: [
    {
      id: 'other_symptom',
      text: 'What is the primary frustration with your bake?',
      category: 'other',
      whyWeAsk: 'We collect indicators to diagnose flour hydrate and rising issues for standard scones, quick breads, or muffins.',
      options: [
        { value: 'heavy_dense_and_gummy', label: 'Dense and wet like pudding interior', description: 'Muffin / Quick bread feels greasy and uncooked.' },
        { value: 'tastes_metallic_soapy', label: 'Tastes weirdly soapy or metallic', description: 'Leaves a tingle on the tongue.' },
        { value: 'scones_didnt_rise_flat', label: 'Dry, flat scones with zero puff', description: 'Stayed dense like standard biscuits.' },
      ],
      nextQuestionIdMap: {
        heavy_dense_and_gummy: 'other_leavening_mix',
        tastes_metallic_soapy: 'other_chem_ratios',
        scones_didnt_rise_flat: 'other_cold_prep',
      }
    },
    {
      id: 'other_leavening_mix',
      text: 'How did you mix the batter before baking?',
      category: 'other',
      whyWeAsk: 'Quick breads (muffins, banana bread) are raised by gas, not gluten. Overmixing activates wheat protein threads, which wrap your bubbles tightly, creating rubber tunnels.',
      options: [
        { value: 'whipped_lump_free', label: 'Beaten smooth until all lumps were fully cleared', description: 'Uniform liquid.' },
        { value: 'stirred_lightly', label: 'Stirred briefly, left clumps of dry flour visible', description: 'Just folded together.' },
      ],
      nextQuestionIdMap: {
        whipped_lump_free: 'other_measure',
        stirred_lightly: 'other_measure',
      }
    },
    {
      id: 'other_chem_ratios',
      text: 'Did you measure your raising agents accurately?',
      category: 'other',
      whyWeAsk: 'Baking soda needs an acid ( buttermilk, lemon, brown sugar ) to react. If you add too much leaving soda without acid, the extra unreacted sodium carbonate leaves a strong metallic soap flavor!',
      options: [
        { value: 'soda_with_no_acid', label: 'Used baking soda but no acid source (e.g. regular sweet milk)', description: 'Soda stayed unactivated.' },
        { value: 'excess_measure', label: 'Eyeballed the spoons or added extra to be safe', description: 'Over-dosage.' },
      ],
      nextQuestionIdMap: {
        soda_with_no_acid: 'other_measure',
        excess_measure: 'other_measure',
      }
    },
    {
      id: 'other_cold_prep',
      text: 'What temperature was your butter or butter fat?',
      category: 'other',
      whyWeAsk: 'Like pies, scones require cold fat chips that create little steam elevators inside the dough to lift the layers.',
      options: [
        { value: 'warm_room_temp', label: 'Warm/softened butter', description: 'Melted smoothly.' },
        { value: 'frozen_grated', label: 'Ice cold hard butter', description: 'Grated or cut in.' },
      ],
      nextQuestionIdMap: {
        warm_room_temp: 'other_measure',
        frozen_grated: 'other_measure',
      }
    },
    {
      id: 'other_measure',
      text: 'How did you measure your flour ingredients?',
      category: 'other',
      whyWeAsk: 'Weight is accurate, volume is variable. Overpacking flour sucks the moisture out of quick breads.',
      options: [
        { value: 'dry_scoops', label: 'With visual measurement cups', description: 'Quick scoop.' },
        { value: 'gram_scale', label: 'Precision scale', description: 'Gram accuracy.' },
      ]
    }
  ],
};

// Returns a gorgeous, highly educational Diagnosis object based on the state
export function getDiagnosisForAnswers(category: BakeCategory, answers: Record<string, string>): Diagnosis {
  const ans = (id: string) => answers[id] || '';

  if (category === 'bread') {
    if (ans('bread_crumb') === 'dense_gummy_heavy') {
      if (ans('bread_yeast_temp') === 'hot_water') {
        return {
          id: 'bread_dead_yeast',
          category: 'bread',
          title: 'The Unintentional Scalding (Dead Yeast)',
          confidence: 'High',
          probability: '92% matching symptoms',
          summary: 'Your liquid was too hot for the yeast, meaning your rising agent was neutralized before fermentation even started.',
          scienceExplanation: 'Saccharomyces cerevisiae (yeast) is a living, thermo-sensitive fungus. At water temperatures exceeding 120°F (49°C), its cell membranes break down, permanently denaturing the internal enzymes required to convert starches into carbon dioxide (CO2). Liquid feels hot to your hands, but perfect to yeast is actually just finger-warm (105°F).',
          actionSteps: [
            'Test your liquid with your wrist: if it feels hotter than comfortable baby bathwater, let it cool down before adding yeast.',
            'Switch to a cold-fermentation process: yeast works slowly at room temp or in the fridge, reducing risk of over-heating entirely.',
            'Confirm yeast viability check: stir yeast with spoonful of flour and warm water in a cup; if it bubbles in 10 minutes, it is alive.'
          ],
          educationalSnippet: 'Yeast likes the same bath as a human baby – warm, nourishing, and never steaming!'
        };
      }
      if (ans('bread_rise_stage') === 'no_rise_at_all') {
        return {
          id: 'bread_neutral_yeast',
          category: 'bread',
          title: 'Dormant or Weak Yeast Activity',
          confidence: 'Medium',
          probability: '78% matching symptoms',
          summary: 'Your yeast was likely expired or the kitchen temperature was too cold to stimulate fermentation activity.',
          scienceExplanation: 'Yeast yeast consumes sugars inside flour, outputting CO2 bubbles. Below 65°F (18°C), this biochemical reaction enters near-hibernation. If your dough has no yeast, or outdated dry yeast, gravity compresses gluten down, turning dough dense, wet, and gummy in the oven.',
          actionSteps: [
            'Store dry packets in the freezer – humidity in cupboards causes yeast cells to die over time.',
            'Find a warm, draft-free spot in your kitchen: on top of the fridge, or inside an unlit oven with just the oven light switched on.',
            'Give it more time. If proofing cold, wait 3-4 hours instead of the written 1 hour instruction.'
          ],
          educationalSnippet: 'Oven light magic: keeping your dough in a closed, unlit oven with just the interior light on creates a steady, draft-free environment at exactly 80°F.'
        };
      }
    }

    if (ans('bread_rise_stage') === 'rose_then_deflated' || ans('bread_proofing') === 'over_proofed_long') {
      return {
        id: 'bread_over_proofed',
        category: 'bread',
        title: 'Exhausted Gluten Net (Over-Proofing)',
        confidence: 'High',
        probability: '95% matching symptoms',
        summary: 'Your dough fermented for too long. The yeast generated more gas than the stretching gluten networks could hold, causing them to fatigue, stretch thin, and pop.',
        scienceExplanation: 'Gluten behaves like rubber balloons. During initial stages, it holds CO2. But during over-extension, the yeast consumes all starch nutrition, acid levels rise to digest proteins, and balloon walls turn paper-thin. When oven heat expands the gas rapidly, these fragile cells rupture, causing the entire loaf to deflate.',
        actionSteps: [
          'Use the "Poke Test": GENTLY press the proofed loaf with your finger. If it bounces back slowly but leaves a slight dimple, it is ready. If it springs back instantly, it is under-proofed. If it stays sunken, it is over-proofed and must be baked immediately.',
          'Shave 20-30 minutes off your next proofing stage, especially during warm summer months.',
          'Bake on the earlier side. Under-proofed dough survives oven-spring better than over-proofed dough.'
        ],
        educationalSnippet: 'Sourdough yields are highly sensitive to seasonal room temperatures. A recipe written for a drafty 65°F winter kitchen will over-proof in a summer 80°F room in half the time.'
      };
    }

    if (ans('bread_crumb') === 'giant_holes_top') {
      return {
        id: 'bread_fools_crumb',
        category: 'bread',
        title: 'The "Fool\'s Crumb" (Under-proofing & Heavy heat)',
        confidence: 'High',
        probability: '88% matching symptoms',
        summary: 'A fast visual trick. The loaf looked ready because gas burst to the top, but the core was under-developed and cold, sealing a dense base.',
        scienceExplanation: 'Under-fermented dough holds tight, stubborn gluten bands. When loaded into a hot oven, the yeast panics and fires gas quickly. The gas slips through dense gluten channels, merging into massive tunnels that get trapped beneath a quickly setting crust, while the heavy core paste never rises.',
        actionSteps: [
          'Extend your bulk fermentation. Wait until the dough is light, aerated, and has rounded dome edges in the bowl.',
          'Ensure even room temperature: warm the mixing water slightly so the dough starts its rise at 75°F–78°F.',
          'Do the poke test rather than trusting baking timer clocks.'
        ],
        educationalSnippet: 'Fools Crumb is the hallmark of the eager baker! Patience in bulk rise creates thousands of microscopic pockets rather than ten giant cave networks.'
      };
    }

    // Default Bread Diagnosis (Dry / Dense general)
    return {
      id: 'bread_hydration_heavy',
      category: 'bread',
      title: 'Moisture Deficiency (Low Hydration)',
      confidence: 'Medium',
      probability: '72% matching symptoms',
      summary: 'Your dough had a high ratio of flour to water, likely due to scooped flour cups, making it too dry to expand.',
      scienceExplanation: 'Flour hydration directly controls gluten extensibility. Scooping directly out of a flour bag packs extra volume, inadvertently adding 20g-30g of extra flour per cup. Without water, protein alignment stalls and yeast is locked in plaster.',
      actionSteps: [
        'Invest in a digital kitchen scale and weigh flour inside grams (1 cup of flour is roughly 120 grams).',
        'Add water in slow spoons if the dough feels tight like putty; it should feel supple and slightly tacky.',
        'Cover rising dough with plastic wrap or a damp towel to keep moisture from venting out.'
      ],
      educationalSnippet: 'Professional bakers talk in "Baker\'s Percentages" where water is always measured relative to the weight of flour. 65% water to flour weight is the sweet zone for soft loaves.'
    };
  }

  if (category === 'cake') {
    if (ans('cake_symptom') === 'sunken_middle') {
      if (ans('cake_leavening') === 'dusty_cabinet') {
        return {
          id: 'cake_failed_soda',
          category: 'cake',
          title: 'Expiring Raising Sparks (Soft Leavening)',
          confidence: 'High',
          probability: '90% matching symptoms',
          summary: 'Your baking powder lost its reactant gases over months of cupboard storage, causing the cake cake to collapse from structural weakness.',
          scienceExplanation: 'Baking powder operates via a chemical reaction between sodium bicarbonate and dry monocalcium phosphate. Once open, cupboard humidity triggers low-level reactions inside the jar over time. When expired baking powder goes into the hot batter, it fails to produce the carbon dioxide lift needed to support the setting flour network.',
          actionSteps: [
            'Ditch older tins of baking powder opened more than 6-9 months ago.',
            'Test chemical power: Drop 1/2 teaspoon of baking powder into a warm cup of water. If it fizzes immediately, it is alive. If it sits inert, toss it!',
            'Avoid letting wet batter sit on the counter – chemical reaction starts the minute dry meets wet. Bake immediately.'
          ],
          educationalSnippet: 'Baking powder has a secret birthday! Always write the opening date on the bottom of the tin with a Sharpie.'
        };
      }
      if (ans('cake_oven_door') === 'opened_to_peek') {
        return {
          id: 'cake_premature_peek',
          category: 'cake',
          title: 'The Sneak-Peek Collapse (Thermal Drop)',
          confidence: 'High',
          probability: '85% matching symptoms',
          summary: 'Opening the oven door let in cold air before the flour starches and egg proteins could bake solid, collapsing the delicate risen bubbles.',
          scienceExplanation: 'Cake batter behaves like molten foam. The initial 15-20 minutes expansion relies on hot air and gas pressures. Starch gluten networks are still liquid paste. If you open the door, oven temps drop by 30°F, gas contracts immediately, and the soft walls collapse under weight.',
          actionSteps: [
            'Rely exclusively on your window glass and oven light source. Never crack the door open until 75% of the written bake run is finished.',
            'Close the kitchen door to avoid strong floor drafts that leak into preheated compartments.',
            'To test doneness, wait till the pleasant aroma of baked cake fills the room.'
          ],
          educationalSnippet: 'Pre-heating forms the stable envelope. Every door peek releases a pressure pocket that acts like stepping on a souffle.'
        };
      }
    }

    if (ans('cake_symptom') === 'domed_cracked') {
      return {
        id: 'cake_volcano_fever',
        category: 'cake',
        title: 'Thermal Core Explosion (Oven Too Hot)',
        confidence: 'High',
        probability: '94% matching symptoms',
        summary: 'Your oven was running hotter than the dial setting, forcing the outer edges of the cake to set hard while the center continued to expand.',
        scienceExplanation: 'In a hot oven (usually 375°F+ instead of 350°F), the outer batter quickly bakes into a hard shell. Meanwhile, the thermal wave is slowly reaching the wet inner liquid batter. The core suddenly expands with steam but has nowhere to expand, so it ruptures the solidified top crust, erupting upwards as a cracked volcano dome.',
        actionSteps: [
          'Purchase an oven thermometer that hangs on the center rack – adjustments of 15°F to oven dials are incredibly common.',
          'Lower the oven heat by 25°F next time, extending bake time by 5-10 minutes to compensate.',
          'Consider wrapping cake pans with baking strips (wet fabric bands that wrap around the outside of the pan) to keep edges cool.'
        ],
        educationalSnippet: 'Baking strips protect the outer rim with cool evaporation, forcing the entire cake layer to rise at a unified uniform speed.'
      };
    }

    if (ans('cake_symptom') === 'dense_rubbery_bottom' || ans('cake_mixing') === 'beaten_vigorously') {
      return {
        id: 'cake_over_developed_gluten',
        category: 'cake',
        title: 'The Gluten Squeeze (Over-mixing Batter)',
        confidence: 'High',
        probability: '89% matching symptoms',
        summary: 'Vigorous beating created heavy, elastic bread gluten threads, which squeezed out the rising rising gases and settled as rubbery, dense bands.',
        scienceExplanation: 'Cake flour contains 7-9% protein. When mixed with liquid and worked vigorously, these proteins align into gluten, an elastic structural net. Sourdough needs this, cakes hate it. Over-mixing forms a rubber web that locks down air bubbles, compressing the fat and starch downward into a dense rubber layer.',
        actionSteps: [
          'Once flour is added, switch to a soft hand spatula or use lowest speed limit on electric whisks.',
          'Adopt the Folding method: draw a line down the middle of the bowl, scoop up from the bottom, and flip over.',
          'Switch to soft cake flour (low protein content) instead of using heavy all-purpose blends.'
        ],
        educationalSnippet: 'The spatula dance: as soon as dry flour joins wet fats, you have only 20 gentle strokes before the gluten nets start gluing!'
      };
    }

    return {
      id: 'cake_dry_measuring',
      category: 'cake',
      title: 'Compressed Dust Factor (Flour Cramming)',
      confidence: 'Medium',
      probability: '75% matching symptoms',
      summary: 'You likely added too much flour by scooping with a metric volume cup, leaving the cake sponge parched and tight.',
      scienceExplanation: 'Moisture dry balance is a narrow corridor in cakes. When heavy cups scoop flour, compaction piles extra solids. That additional grain absorbs the butter fats and eggs, turning soft moisture into dry fibers.',
      actionSteps: [
        'Shift recipe measurements to weight scales: 1 cup of standard sifted flour equals 120g of grains.',
        'Ensure butter is at perfect cool room temp when creaming sugar: it holds air pockets that create sponge tenderness.',
        'Do not over-bake: take the cake out as soon as a toothpick inserted in the center comes out with a few moist crumbs.'
      ],
      educationalSnippet: 'A toothpick check should never come out dusty dry – it should carry 3-4 tiny moist cake crumbs showing cell structure is complete.'
    };
  }

  if (category === 'pastry') {
    if (ans('pastry_symptom') === 'tough_and_rigid' || ans('pastry_fat_temp') === 'warm_softened') {
      return {
        id: 'pastry_melted_butter',
        category: 'pastry',
        title: 'The Melted Separation (Warm Fat)',
        confidence: 'High',
        probability: '91% matching symptoms',
        summary: 'Your butter or fat warmed up during the prep, dissolving into dry grains instead of remaining as tiny cold layers that puff into flakes.',
        scienceExplanation: 'Flakiness is a physical magic trick. Tiny cold butter cubes are rolled flat into layers of flour. When heated, the water inside the cold butter boils instantly, flashing into steam. This steam pushes the sheet of dough up before the butter fat absorbs. If butter is room temp, it simply oils the flour grains, making a dense, tough cookie crust instead of paper flakes.',
        actionSteps: [
          'Use ice-cold butter straight from the freezer, and mix with ice water (add raw ice cubes to the glass).',
          'Rest shaped crust in the freezer for 15 minutes before loading into the oven.',
          'Work with cold tools: chill your metal mixing bowl and pastry cutter in the fridge beforehand.'
        ],
        educationalSnippet: 'Pastry dough should look ugly! Marbled chunks of butter the size of peas are what build the flaking staircase.'
      };
    }

    if (ans('pastry_symptom') === 'shrunk_in_pan' || ans('pastry_resting') === 'no_rest_baked_immediately') {
      return {
        id: 'pastry_elastic_snap',
        category: 'pastry',
        title: 'Gluten Snap-Back (Insufficent Gluten Rest)',
        confidence: 'High',
        probability: '87% matching symptoms',
        summary: 'Rolling the dough stretched out elastic gluten bands. Without cold resting time to relax, they snapped back in the heat, shrinking your crust sides.',
        scienceExplanation: 'Gluten has memory and tension. Pressing with a rolling pin works like stretching a rubber band. When loaded into a hot oven immediately, the heat cures the proteins while they are under full stretch, causing them to contract rapidly down the pan walls, pooling butter at the bottom.',
        actionSteps: [
          'Rest rolled crust in the refrigerator for at least 30 minutes after placing it in the pie dish.',
          'Never stretch or pull the dough to force it to fit the pan edges – instead, gently drape and drop it in.',
          'Fill the cold crust with baking weights (such as dried beans) all the way to the top rim to physically support the walls.'
        ],
        educationalSnippet: 'Drape, don\'t stretch! If you pull pastry tight to fit a corner, it will pull twice as hard to slip back down during the bake.'
      };
    }

    if (ans('pastry_symptom') === 'soggy_bottom') {
      return {
        id: 'pastry_soggy_barrier',
        category: 'pastry',
        title: 'Filling Intrusion (Unprotected Crust)',
        confidence: 'Medium',
        probability: '80% matching symptoms',
        summary: 'The wet fruit or custard filling soaked deep into the raw crust bottom before the heat could crisp the flour layers.',
        scienceExplanation: 'Pie pastries take 20 minutes to set structures. Custards or fruit sugars are heavy and wet. When poured onto a cold raw shell, gravity pulls liquids into the flour network. This blocks the heat from frying the butter flakes, locking the bottom in a pasty raw glaze.',
        actionSteps: [
          'Blind bake the crust: pre-bake with weights at 400°F until light tan, then seal with warm egg wash brush before filling.',
          'Bake on the lowest oven shelf (or direct on a preheated pizza stone) to blast high direct heat to the pie base.',
          'Toss fruit fillings with a touch of cornstarch to bind free juices from seeping out instantly.'
        ],
        educationalSnippet: 'Egg wash shield: brushing a layer of egg wash on a hot blind-baked crust acts as a waterproof varnish, preserving supreme crunch.'
      };
    }

    return {
      id: 'pastry_general_water',
      category: 'pastry',
      title: 'Water Over-Dosage (Gluten Glue)',
      confidence: 'Medium',
      probability: '75% matching symptoms',
      summary: 'You added too much liquid water to bind the dough, turning the flaky sheets into a dense, hard bread.',
      scienceExplanation: 'Water acts like a key that opens the protein alignment gate. Adding water creates wet paste glue. To remain flaky, pastry needs the bare minimum liquid required to fuse crumbling chunks together.',
      actionSteps: [
        'Add ice water tablespoon by tablespoon: the dough should look like craggy gravel in the bowl before you press it into a sheet.',
        'Use plastic wrap to squeeze the crumbs together instead of adding more water spoons.',
        'Keep handling brief: your warm fingers melt the fats.'
      ],
      educationalSnippet: 'Shaggy is perfect: pastry crumbs that look slightly dry in the bowl fuse easily under rolling pressure without adding more water.'
    };
  }

  if (category === 'biscuits') {
    if (ans('bisc_symptom') === 'spread_flat_puddle' || ans('bisc_dough_temp') === 'baked_straight_away') {
      return {
        id: 'bisc_soft_slippage',
        category: 'biscuits',
        title: 'The Pancake Melt (Warm Trapped Fat)',
        confidence: 'High',
        probability: '96% matching symptoms',
        summary: 'Warm cookie dough entered the oven, melting the butter instantly into a liquid pool before the flour could set up its structural frame.',
        scienceExplanation: 'In cookies, butter holds starch in check. When cold shaped dough bakes, the starches cook solid before the internal butter block liquefies completely, leaving a nice chewy hump. If butter starts warm, it acts immediately as liquid oil, flattening the cookie into a greasy puddle before starch gelatinizes.',
        actionSteps: [
          'Freeze your scoop dough balls for 15-20 minutes before placing them on the baking sheet.',
          'Never put freshly scooped cookie dough onto a baking sheet that is still warm from the previous batch.',
          'Always use cool, room temperature butter for creaming – microwave-melted butter ruins cookie structure.'
        ],
        educationalSnippet: 'The double tray rule: never reuse a hot tray! Let cookie sheets cool completely under tap water before arranging the next cold batch.'
      };
    }

    if (ans('bisc_symptom') === 'puff_dry_cakey' || ans('bisc_measuring_dry') === 'cups_heavy') {
      return {
        id: 'bisc_cakey_dry',
        category: 'biscuits',
        title: 'The Flour Mountain (Cakey Cookies)',
        confidence: 'Medium',
        probability: '84% matching symptoms',
        summary: 'Your cookies rose like biscuits rather than spreading, leaving a dense, dry, and puffy interior cake structure.',
        scienceExplanation: 'Scooping flour with a measuring cup compresses the grains, loading up to 40g of extra flour per cup. This high starch ratio drinks up fat and egg hydration. In the oven, there is no fat lubrication to slip edges outward, so the cookie bakes upright like a mini biscuit.',
        actionSteps: [
          'Weigh flour on a digital scale (typical standard cookie flour scoop is 120g).',
          'If using cups, fluff the flour with a fork first, spoon it gently into the cup, then level across with a flat knife.',
          'Ensure you did not over-beat the eggs, which introduces sponge-like rise bubbles.'
        ],
        educationalSnippet: 'Granulated sugar promotes spread; flour stops it. Accurate balance is what creates the perfect concentric ring crackles.'
      };
    }

    if (ans('bisc_symptom') === 'burnt_bottoms' || ans('bisc_baking_sheet') === 'dark_heavy_tray') {
      return {
        id: 'bisc_scorch_trays',
        category: 'biscuits',
        title: 'Infrared Scorch (Dark Cookie Sheets)',
        confidence: 'High',
        probability: '90% matching symptoms',
        summary: 'Your dark or black metal cookie sheets absorbed the oven\'s radiant heat too rapidly, burning the cookie base before the top finished baking.',
        scienceExplanation: 'Dark metals absorb infrared light waves much faster than silver or reflective sheets. This rapid absorption conducts heat straight into the cookie butter bases on contact, raising temperature instantly past caramelization and straight to carbonization (burnt black).',
        actionSteps: [
          'Use light-colored aluminum sheets, which reflect heat gently for even caramelization.',
          'Line baking sheets with parchment paper or a silicone baking mat to buffer direct metal contact.',
          'Move the oven rack up one tier, away from the bottom heating coil source.'
        ],
        educationalSnippet: 'Parchment paper is a thermal insulator that distributes hot air pocket currents evenly beneath the cookie dough feet.'
      };
    }

    return {
      id: 'bisc_general_hard',
      category: 'biscuits',
      title: 'Tenderizer Deficit (Hard cookies)',
      confidence: 'Medium',
      probability: '72% matching symptoms',
      summary: 'Your cookies dried out and hardened due to missing tenderizing moisture agents like brown sugar or healthy portion fats.',
      scienceExplanation: 'Sugar and fats act as gluten tenderizers by coating flour grains. White sugar creates crispiness, brown sugar (with natural moist molasses) ensures chewiness. A low fat or low sugar substitution leads to tough starch grids.',
      actionSteps: [
        'Mix dynamic ratios: increase brown sugar percentage relative to white granulated powder.',
        'Don\'t over-bake: take cookies out while they still look slightly soft and wet in the very center; they solidify on the hot tray solid.',
        'Keep dough covered in the fridge during shaping.'
      ],
      educationalSnippet: 'The carryover carry: cookies should finish baking on the counter, not in the oven! Take them out when edges are firm but center is soft.'
    };
  }

  // Other default
  return {
    id: 'other_overmix_scones',
    category: 'other',
    title: 'Cell Overworking (Tough Rise)',
    confidence: 'Medium',
    probability: '70% matching symptoms',
    summary: 'Over-handling or overmixing the flour paste activated excess gluten, making your bakes dense and preventing a clean rise.',
    scienceExplanation: 'Quick breads, scones, and muffins rely on chemical gas lift. Overmixing forms rubber sheets which wrap chemical bubbles, converting a light, fluffy rise into a tough, heavy chewing loaf.',
    actionSteps: [
      'Mix just until you see the flour strip lines disappear – a lumpy batter makes the loftiest muffins.',
      'Ensure milk/liquids are ice cold for scone bakes, or room temperature for quick breads.',
      'Test raising baking powder for correct carbonation fizzes before starting.'
    ],
    educationalSnippet: 'Scone lumps are safe! Gently folding flour with a table knife keeps the gluten sleep asleep while the cream acts.'
  };
}
