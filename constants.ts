import { DrugFamily, Disease, TextbookSection } from './types';

// --- DRUG DATABASE ---
export const DRUG_FAMILIES: DrugFamily[] = [
  {
    id: 'natural_penicillins',
    name: 'Natural Penicillins',
    drugs: [
      { id: 'pen_g_benz', name: 'Penicillin G Benzathine', familyId: 'natural_penicillins', baseDamage: 10, nephrotoxicity: 1, cost: 2 },
      { id: 'pen_v', name: 'Penicillin V Potassium', familyId: 'natural_penicillins', baseDamage: 10, nephrotoxicity: 1, cost: 1 },
      { id: 'pen_g_aq', name: 'Penicillin G Aqueous', familyId: 'natural_penicillins', baseDamage: 12, nephrotoxicity: 2, cost: 3 },
    ]
  },
  {
    id: 'aminopenicillins',
    name: 'Aminopenicillins',
    drugs: [
      { id: 'amox', name: 'Amoxicillin', familyId: 'aminopenicillins', baseDamage: 10, nephrotoxicity: 1, cost: 1 },
      { id: 'ampi', name: 'Ampicillin', familyId: 'aminopenicillins', baseDamage: 10, nephrotoxicity: 1, cost: 2 },
    ]
  },
  {
    id: 'antistaphylococcal',
    name: 'Antistaphylococcal Penicillins',
    drugs: [
      { id: 'diclox', name: 'Dicloxacillin', familyId: 'antistaphylococcal', baseDamage: 12, nephrotoxicity: 3, cost: 3 },
      { id: 'nafcillin', name: 'Nafcillin', familyId: 'antistaphylococcal', baseDamage: 14, nephrotoxicity: 4, cost: 4 },
      { id: 'oxacillin', name: 'Oxacillin', familyId: 'antistaphylococcal', baseDamage: 14, nephrotoxicity: 4, cost: 4 },
    ]
  },
  {
    id: 'beta_lactam_combo',
    name: 'Beta-Lactam / Inhibitor Combos',
    drugs: [
      { id: 'amox_clav', name: 'Amoxicillin/Clavulanate', familyId: 'beta_lactam_combo', baseDamage: 13, nephrotoxicity: 2, cost: 3 },
      { id: 'amp_sulb', name: 'Ampicillin/Sulbactam', familyId: 'beta_lactam_combo', baseDamage: 13, nephrotoxicity: 2, cost: 4 },
      { id: 'piptazo', name: 'Piperacillin/Tazobactam', familyId: 'beta_lactam_combo', baseDamage: 16, nephrotoxicity: 4, cost: 5 },
    ]
  },
  {
    id: 'cephalosporins_1st',
    name: '1st Gen Cephalosporins',
    drugs: [
      { id: 'cephalexin', name: 'Cephalexin', familyId: 'cephalosporins_1st', baseDamage: 10, nephrotoxicity: 1, cost: 2 },
      { id: 'cefadroxil', name: 'Cefadroxil', familyId: 'cephalosporins_1st', baseDamage: 10, nephrotoxicity: 1, cost: 2 },
      { id: 'cefazolin', name: 'Cefazolin', familyId: 'cephalosporins_1st', baseDamage: 12, nephrotoxicity: 2, cost: 3 },
    ]
  },
  {
    id: 'cephalosporins_2nd',
    name: '2nd Gen Cephalosporins',
    drugs: [
      { id: 'cefuroxime', name: 'Cefuroxime Axetil', familyId: 'cephalosporins_2nd', baseDamage: 11, nephrotoxicity: 2, cost: 3 },
      { id: 'cefprozil', name: 'Cefprozil', familyId: 'cephalosporins_2nd', baseDamage: 11, nephrotoxicity: 2, cost: 3 },
      { id: 'cefoxitin', name: 'Cefoxitin', familyId: 'cephalosporins_2nd', baseDamage: 12, nephrotoxicity: 3, cost: 4 },
    ]
  },
  {
    id: 'cephalosporins_3rd',
    name: '3rd Gen Cephalosporins',
    drugs: [
      { id: 'ceftriaxone', name: 'Ceftriaxone', familyId: 'cephalosporins_3rd', baseDamage: 14, nephrotoxicity: 2, cost: 3 },
      { id: 'ceftazidime', name: 'Ceftazidime', familyId: 'cephalosporins_3rd', baseDamage: 15, nephrotoxicity: 3, cost: 4 },
      { id: 'cefdinir', name: 'Cefdinir', familyId: 'cephalosporins_3rd', baseDamage: 12, nephrotoxicity: 2, cost: 3 },
    ]
  },
  {
    id: 'cephalosporins_4th',
    name: '4th Gen Cephalosporins',
    drugs: [
      { id: 'cefepime', name: 'Cefepime', familyId: 'cephalosporins_4th', baseDamage: 16, nephrotoxicity: 4, cost: 5 },
    ]
  },
  {
    id: 'carbapenems',
    name: 'Carbapenems',
    drugs: [
      { id: 'meropenem', name: 'Meropenem', familyId: 'carbapenems', baseDamage: 18, nephrotoxicity: 3, cost: 7 },
      { id: 'ertapenem', name: 'Ertapenem', familyId: 'carbapenems', baseDamage: 16, nephrotoxicity: 3, cost: 6 },
    ]
  },
  {
    id: 'glycopeptides',
    name: 'Glycopeptides & Lipopeptides',
    drugs: [
      { id: 'vanco_iv', name: 'Vancomycin (IV)', familyId: 'glycopeptides', baseDamage: 15, nephrotoxicity: 7, cost: 4 }, 
      { id: 'vanco_po', name: 'Vancomycin (Oral)', familyId: 'glycopeptides', baseDamage: 15, nephrotoxicity: 0, cost: 4 },
      { id: 'daptomycin', name: 'Daptomycin', familyId: 'glycopeptides', baseDamage: 16, nephrotoxicity: 4, cost: 6 },
    ]
  },
  {
    id: 'tetracyclines',
    name: 'Tetracyclines',
    drugs: [
      { id: 'doxy', name: 'Doxycycline', familyId: 'tetracyclines', baseDamage: 11, nephrotoxicity: 1, cost: 2 },
    ]
  },
  {
    id: 'macrolides',
    name: 'Macrolides / Lincosamides',
    drugs: [
      { id: 'azithro', name: 'Azithromycin', familyId: 'macrolides', baseDamage: 12, nephrotoxicity: 1, cost: 2 },
      { id: 'clarithro', name: 'Clarithromycin', familyId: 'macrolides', baseDamage: 12, nephrotoxicity: 2, cost: 3 },
      { id: 'clindamycin', name: 'Clindamycin', familyId: 'macrolides', baseDamage: 12, nephrotoxicity: 3, cost: 3 },
      { id: 'fidaxomicin', name: 'Fidaxomicin', familyId: 'macrolides', baseDamage: 20, nephrotoxicity: 1, cost: 8 },
    ]
  },
  {
    id: 'oxazolidinones',
    name: 'Oxazolidinones',
    drugs: [
      { id: 'linezolid', name: 'Linezolid', familyId: 'oxazolidinones', baseDamage: 15, nephrotoxicity: 4, cost: 6 },
    ]
  },
  {
    id: 'aminoglycosides',
    name: 'Aminoglycosides',
    drugs: [
      { id: 'gentamicin', name: 'Gentamicin', familyId: 'aminoglycosides', baseDamage: 14, nephrotoxicity: 9, cost: 4 },
    ]
  },
  {
    id: 'fluoroquinolones',
    name: 'Fluoroquinolones',
    drugs: [
      { id: 'cipro', name: 'Ciprofloxacin', familyId: 'fluoroquinolones', baseDamage: 14, nephrotoxicity: 2, cost: 3 },
      { id: 'levofloxacin', name: 'Levofloxacin', familyId: 'fluoroquinolones', baseDamage: 15, nephrotoxicity: 3, cost: 4 },
      { id: 'moxifloxacin', name: 'Moxifloxacin', familyId: 'fluoroquinolones', baseDamage: 15, nephrotoxicity: 3, cost: 4 },
    ]
  },
  {
    id: 'sulfonamides_nitro',
    name: 'Sulfonamides / Nitroimidazoles',
    drugs: [
      { id: 'bactrim', name: 'Trimethoprim/Sulfamethoxazole', familyId: 'sulfonamides_nitro', baseDamage: 12, nephrotoxicity: 4, cost: 2 },
      { id: 'metronidazole', name: 'Metronidazole', familyId: 'sulfonamides_nitro', baseDamage: 12, nephrotoxicity: 2, cost: 2 },
      { id: 'nitro', name: 'Nitrofurantoin', familyId: 'sulfonamides_nitro', baseDamage: 12, nephrotoxicity: 2, cost: 1 },
    ]
  },
  {
    id: 'antimycobacterial',
    name: 'Antimycobacterial / Antiviral / Fungal',
    drugs: [
      { id: 'rifampin', name: 'Rifampin', familyId: 'antimycobacterial', baseDamage: 10, nephrotoxicity: 5, cost: 4 },
      { id: 'isoniazid', name: 'Isoniazid', familyId: 'antimycobacterial', baseDamage: 10, nephrotoxicity: 6, cost: 3 },
      { id: 'fluconazole', name: 'Fluconazole', familyId: 'antimycobacterial', baseDamage: 12, nephrotoxicity: 2, cost: 3 },
      { id: 'terbinafine', name: 'Terbinafine', familyId: 'antimycobacterial', baseDamage: 10, nephrotoxicity: 4, cost: 3 },
      { id: 'valacyclovir', name: 'Valacyclovir', familyId: 'antimycobacterial', baseDamage: 10, nephrotoxicity: 3, cost: 4 },
      { id: 'oseltamivir', name: 'Oseltamivir', familyId: 'antimycobacterial', baseDamage: 10, nephrotoxicity: 1, cost: 4 },
    ]
  },
  {
    id: 'combinations',
    name: 'Regimen Combinations (Simulated)',
    drugs: [
      { id: 'ceftriaxone_vanco', name: 'Ceftriaxone + Vancomycin', familyId: 'combinations', baseDamage: 20, nephrotoxicity: 8, cost: 6 },
      { id: 'ceftriaxone_vanco_ampi', name: 'Ceftriaxone + Vanco + Ampicillin', familyId: 'combinations', baseDamage: 22, nephrotoxicity: 9, cost: 8 },
      { id: 'piptazo_vanco', name: 'Pip/Tazo + Vancomycin', familyId: 'combinations', baseDamage: 22, nephrotoxicity: 9, cost: 8 },
      { id: 'cipro_metro', name: 'Cipro + Metronidazole', familyId: 'combinations', baseDamage: 18, nephrotoxicity: 5, cost: 4 },
    ]
  }
];

// --- TEXTBOOK STRUCTURE ---
export const TEXTBOOK_SECTIONS: TextbookSection[] = [
  {
    id: 'cns',
    title: '1. Central Nervous System Infections',
    chapters: [
      { id: 'cns_1', title: 'Acute Bacterial Meningitis (18–50)', sectionId: 'cns' },
      { id: 'cns_2', title: 'Acute Bacterial Meningitis (>50)', sectionId: 'cns' },
    ]
  },
  {
    id: 'resp',
    title: '2. Respiratory Tract Infections',
    chapters: [
      { id: 'resp_1', title: 'Community-Acquired Pneumonia (CAP)', sectionId: 'resp' },
      { id: 'resp_2', title: 'Hospital-Acquired Pneumonia (HAP)', sectionId: 'resp' },
      { id: 'resp_3', title: 'Aspiration Pneumonia', sectionId: 'resp' },
      { id: 'resp_4', title: 'Acute COPD Exacerbation', sectionId: 'resp' },
      { id: 'resp_5', title: 'Streptococcal Pharyngitis', sectionId: 'resp' },
    ]
  },
  {
    id: 'cv',
    title: '3. Cardiovascular Infections',
    chapters: [
      { id: 'cv_1', title: 'Native Valve Endocarditis', sectionId: 'cv' },
    ]
  },
  {
    id: 'uti',
    title: '4. Urinary Tract Infections (UTI)',
    chapters: [
      { id: 'uti_1', title: 'Uncomplicated Cystitis', sectionId: 'uti' },
      { id: 'uti_2', title: 'Acute Pyelonephritis', sectionId: 'uti' },
    ]
  },
  {
    id: 'ssti',
    title: '5. Skin and Soft Tissue Infections',
    chapters: [
      { id: 'ssti_1', title: 'Non-purulent Cellulitis', sectionId: 'ssti' },
      { id: 'ssti_2', title: 'Purulent Cellulitis / Abscess', sectionId: 'ssti' },
    ]
  },
  {
    id: 'gi',
    title: '6. Gastrointestinal Infections',
    chapters: [
      { id: 'gi_1', title: 'Clostridioides difficile', sectionId: 'gi' },
      { id: 'gi_2', title: 'Traveler’s Diarrhea', sectionId: 'gi' },
      { id: 'gi_3', title: 'Acute Diverticulitis', sectionId: 'gi' },
    ]
  },
  {
    id: 'bone',
    title: '7. Bone and Joint Infections',
    chapters: [
      { id: 'bone_1', title: 'Osteomyelitis', sectionId: 'bone' },
    ]
  },
  {
    id: 'sti',
    title: '8. Reproductive Health & STIs',
    chapters: [
      { id: 'sti_1', title: 'Gonococcal Urethritis', sectionId: 'sti' },
    ]
  },
  {
    id: 'vector',
    title: '9. Vector-Borne & Systemic',
    chapters: [
      { id: 'vector_1', title: 'Lyme Disease (Early)', sectionId: 'vector' },
    ]
  },
];

// --- PLAYABLE LEVELS (Mapped to Chapters) ---
export const DISEASES: Disease[] = [
  {
    id: 'meningitis_adult',
    chapterId: 'cns_1',
    name: 'Acute Bacterial Meningitis (Adults 18–50)',
    description: 'Adult presents with fever, nuchal rigidity, and altered mental status. No history of immunocompromise.',
    pathogen: 'S. pneumoniae, N. meningitidis',
    bacteriaColor: '#ef4444', // Red
    baseBacteriaCount: 100,
    susceptibleTo: ['ceftriaxone_vanco'],
    resistantTo: ['amox', 'cipro', 'cephalexin'],
    optimalTreatment: {
      drugId: 'ceftriaxone_vanco',
      durationDays: 10, // 10-14 days
      intervalHours: 12, 
      doseMg: 2000 
    }
  },
  {
    id: 'meningitis_senior',
    chapterId: 'cns_2',
    name: 'Acute Bacterial Meningitis (Adults >50)',
    description: 'Elderly patient with classic meningitis triad. Increased risk for Listeria.',
    pathogen: 'S. pneumoniae, N. meningitidis, L. monocytogenes',
    bacteriaColor: '#9f1239', // Dark Red
    baseBacteriaCount: 120,
    susceptibleTo: ['ceftriaxone_vanco_ampi'],
    resistantTo: ['ceftriaxone_vanco', 'amox'], // Needs Ampicillin for Listeria
    optimalTreatment: {
      drugId: 'ceftriaxone_vanco_ampi',
      durationDays: 21, // 21 days for Listeria
      intervalHours: 4, 
      doseMg: 2000 // Ampicillin dose driver
    }
  },
  {
    id: 'cap_outpatient',
    chapterId: 'resp_1',
    name: 'CAP (Healthy Outpatient)',
    description: 'Productive cough, fever, lobar consolidation. No comorbidities.',
    pathogen: 'Streptococcus pneumoniae, Mycoplasma',
    bacteriaColor: '#22d3ee', // Cyan
    baseBacteriaCount: 50,
    susceptibleTo: ['amox', 'doxy', 'azithro'], 
    resistantTo: [],
    optimalTreatment: {
      drugId: 'amox',
      durationDays: 5,
      intervalHours: 8,
      doseMg: 1000 
    }
  },
  {
    id: 'hap',
    chapterId: 'resp_2', 
    name: 'Hospital-Acquired Pneumonia (HAP)',
    description: 'New infiltrate >48h after admission. High risk for Pseudomonas/MRSA.',
    pathogen: 'P. aeruginosa, S. aureus (MRSA)',
    bacteriaColor: '#1e3a8a', // Dark Blue
    baseBacteriaCount: 80,
    susceptibleTo: ['piptazo_vanco'],
    resistantTo: ['ceftriaxone', 'amox'],
    optimalTreatment: {
      drugId: 'piptazo_vanco',
      durationDays: 7,
      intervalHours: 6,
      doseMg: 4500 
    }
  },
  {
    id: 'aspiration_pna',
    chapterId: 'resp_3',
    name: 'Aspiration Pneumonia',
    description: 'Patient with history of seizure/stroke presents with foul-smelling sputum.',
    pathogen: 'Oral Anaerobes, Streptococci',
    bacteriaColor: '#a8a29e', // Stone/Gray
    baseBacteriaCount: 60,
    susceptibleTo: ['amox_clav', 'amp_sulb', 'clindamycin'],
    resistantTo: ['cephalexin', 'azithro'], // Poor anaerobe coverage
    optimalTreatment: {
      drugId: 'amox_clav',
      durationDays: 7,
      intervalHours: 12,
      doseMg: 875 
    }
  },
  {
    id: 'copd_exacerbation',
    chapterId: 'resp_4',
    name: 'Acute COPD Exacerbation',
    description: 'Smoker with increased dyspnea and sputum volume/purulence.',
    pathogen: 'H. influenzae, M. catarrhalis, S. pneumo',
    bacteriaColor: '#06b6d4', // Cyan-600
    baseBacteriaCount: 55,
    susceptibleTo: ['azithro', 'doxy', 'amox_clav', 'levofloxacin'],
    resistantTo: ['pen_v', 'cephalexin'], // Poor H. flu coverage
    optimalTreatment: {
      drugId: 'azithro',
      durationDays: 3, 
      intervalHours: 24,
      doseMg: 500 
    }
  },
  {
    id: 'strep_throat',
    chapterId: 'resp_5',
    name: 'Streptococcal Pharyngitis',
    description: 'Child with fever, tonsillar exudates, and no cough.',
    pathogen: 'Streptococcus pyogenes (Group A)',
    bacteriaColor: '#f43f5e', // Rose
    baseBacteriaCount: 40,
    susceptibleTo: ['pen_v', 'amox', 'cephalexin'],
    resistantTo: ['azithro', 'bactrim'], 
    optimalTreatment: {
      drugId: 'pen_v',
      durationDays: 10,
      intervalHours: 12, // or 6-8, but 12 common for compliance
      doseMg: 500 
    }
  },
  {
    id: 'endocarditis_native',
    chapterId: 'cv_1',
    name: 'Native Valve Endocarditis',
    description: 'Fever, new murmur, Janeway lesions. Empiric therapy needed.',
    pathogen: 'Staph, Strep, Enterococci',
    bacteriaColor: '#b91c1c', // Deep Red
    baseBacteriaCount: 90,
    susceptibleTo: ['ceftriaxone_vanco'],
    resistantTo: ['amox', 'cipro'],
    optimalTreatment: {
      drugId: 'ceftriaxone_vanco',
      durationDays: 42, // 4-6 weeks
      intervalHours: 24, // Ceftriaxone component
      doseMg: 2000 
    }
  },
  {
    id: 'cystitis',
    chapterId: 'uti_1',
    name: 'Uncomplicated Cystitis',
    description: 'Dysuria, urgency, frequency. Afebrile.',
    pathogen: 'E. coli, S. saprophyticus',
    bacteriaColor: '#f0abfc', // Light Purple
    baseBacteriaCount: 40,
    susceptibleTo: ['nitro', 'bactrim'],
    resistantTo: ['amox'], 
    optimalTreatment: {
      drugId: 'nitro',
      durationDays: 5,
      intervalHours: 12,
      doseMg: 100 
    }
  },
  {
    id: 'pyelonephritis',
    chapterId: 'uti_2',
    name: 'Acute Pyelonephritis',
    description: 'Fever, flank pain, CVA tenderness.',
    pathogen: 'E. coli, Proteus, Klebsiella',
    bacteriaColor: '#7e22ce', // Purple
    baseBacteriaCount: 70,
    susceptibleTo: ['cipro'],
    resistantTo: ['nitro', 'cephalexin'], // Nitro poor tissue penetration for kidneys
    optimalTreatment: {
      drugId: 'cipro',
      durationDays: 7,
      intervalHours: 12,
      doseMg: 500 
    }
  },
  {
    id: 'cellulitis_non_purulent',
    chapterId: 'ssti_1',
    name: 'Non-purulent Cellulitis',
    description: 'Spreading erythema, warmth. No abscess.',
    pathogen: 'Streptococcus pyogenes (Group A)',
    bacteriaColor: '#fda4af', // Pink
    baseBacteriaCount: 35,
    susceptibleTo: ['cephalexin'],
    resistantTo: ['cipro'],
    optimalTreatment: {
      drugId: 'cephalexin',
      durationDays: 5,
      intervalHours: 6,
      doseMg: 500 
    }
  },
  {
    id: 'cellulitis_purulent',
    chapterId: 'ssti_2',
    name: 'Purulent Cellulitis / Abscess',
    description: 'Localized infection with pus/abscess. MRSA concern.',
    pathogen: 'Staphylococcus aureus (MRSA)',
    bacteriaColor: '#fbbf24', // Amber
    baseBacteriaCount: 50,
    susceptibleTo: ['bactrim', 'vanco_iv', 'doxy'],
    resistantTo: ['cephalexin', 'amox'], // MRSA resistant to beta lactams
    optimalTreatment: {
      drugId: 'bactrim', // or doxy
      durationDays: 7, // 5-10 days
      intervalHours: 12,
      doseMg: 800 // ~1 DS tablet
    }
  },
  {
    id: 'c_diff',
    chapterId: 'gi_1',
    name: 'Clostridioides difficile',
    description: 'Profuse watery diarrhea post-antibiotics.',
    pathogen: 'C. difficile',
    bacteriaColor: '#854d0e', // Brown
    baseBacteriaCount: 65,
    susceptibleTo: ['fidaxomicin', 'vanco_po'],
    resistantTo: ['vanco_iv', 'metro'], // IV doesn't work, metro no longer 1st line
    optimalTreatment: {
      drugId: 'fidaxomicin',
      durationDays: 10,
      intervalHours: 12,
      doseMg: 200 
    }
  },
  {
    id: 'travelers_diarrhea',
    chapterId: 'gi_2',
    name: 'Traveler’s Diarrhea (Severe)',
    description: 'Febrile, dysentery after travel.',
    pathogen: 'ETEC, Campylobacter',
    bacteriaColor: '#d97706', // Orange
    baseBacteriaCount: 45,
    susceptibleTo: ['azithro', 'cipro'], // Azithro preferred for SE Asia/Campy
    resistantTo: [],
    optimalTreatment: {
      drugId: 'azithro',
      durationDays: 3, // 1-3 days
      intervalHours: 24,
      doseMg: 500 
    }
  },
  {
    id: 'diverticulitis',
    chapterId: 'gi_3',
    name: 'Acute Diverticulitis (Uncomplicated)',
    description: 'Left lower quadrant pain, fever, leukocytosis.',
    pathogen: 'E. coli, Bacteroides fragilis',
    bacteriaColor: '#57534e', // Stone
    baseBacteriaCount: 75,
    susceptibleTo: ['amox_clav', 'cipro_metro'],
    resistantTo: ['cipro', 'metronidazole'], // Must be combo or Augmentin
    optimalTreatment: {
      drugId: 'amox_clav',
      durationDays: 7,
      intervalHours: 12,
      doseMg: 875 
    }
  },
  {
    id: 'osteomyelitis',
    chapterId: 'bone_1',
    name: 'Osteomyelitis',
    description: 'Bone pain, MRI shows marrow edema. Empiric.',
    pathogen: 'Staphylococcus aureus',
    bacteriaColor: '#fcd34d', // Yellow
    baseBacteriaCount: 100,
    susceptibleTo: ['vanco_iv'],
    resistantTo: [],
    optimalTreatment: {
      drugId: 'vanco_iv',
      durationDays: 42, // 6 weeks
      intervalHours: 12,
      doseMg: 1000 // Weight based, approx 1g
    }
  },
  {
    id: 'gonorrhea',
    chapterId: 'sti_1',
    name: 'Gonococcal Urethritis',
    description: 'Purulent urethral discharge and dysuria.',
    pathogen: 'Neisseria gonorrhoeae',
    bacteriaColor: '#4ade80', // Green
    baseBacteriaCount: 30,
    susceptibleTo: ['ceftriaxone'],
    resistantTo: ['azithro', 'cipro', 'doxy'], 
    optimalTreatment: {
      drugId: 'ceftriaxone',
      durationDays: 1, // Single dose
      intervalHours: 24, 
      doseMg: 500 // New guideline 500mg IM x1
    }
  },
  {
    id: 'lyme',
    chapterId: 'vector_1',
    name: 'Lyme Disease (Early Localized)',
    description: 'Patient from Northeast US with erythema migrans (bullseye rash).',
    pathogen: 'Borrelia burgdorferi',
    bacteriaColor: '#84cc16', // Lime
    baseBacteriaCount: 40,
    susceptibleTo: ['doxy', 'amox', 'cefuroxime'],
    resistantTo: ['cephalexin', 'cipro'],
    optimalTreatment: {
      drugId: 'doxy',
      durationDays: 10, 
      intervalHours: 12,
      doseMg: 100 
    }
  }
];

export const DOSAGES = [
  75, 100, 125, 150, 200, 250, 300, 400, 450, 500, 600, 750, 800, 875, 900, 
  1000, 1500, 2000, 2400, 3000, 3375, 4000, 4500
];
export const INTERVALS = [4, 6, 8, 12, 24, 48];
export const DURATIONS = [1, 3, 5, 7, 10, 14, 21, 28, 42, 56];