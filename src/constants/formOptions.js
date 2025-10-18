// Fixed ID dropdown options that don't change with language
// Only the labels change based on the current language

export const genderOptions = [
  { id: 'male', label: { en: 'Male', ar: 'ذكر' } },
  { id: 'female', label: { en: 'Female', ar: 'أنثى' } },
]

export const stateOptions = [
  { id: 'abuDhabi', label: { en: 'Abu Dhabi', ar: 'أبو ظبي' } },
  { id: 'dubai', label: { en: 'Dubai', ar: 'دبي' } },
  { id: 'sharjah', label: { en: 'Sharjah', ar: 'الشارقة' } },
  { id: 'ummAlQaiwain', label: { en: 'Umm Al Qaiwain', ar: 'أم القيوين' } },
  { id: 'fujairah', label: { en: 'Fujairah', ar: 'الفجيرة' } },
  { id: 'ajman', label: { en: 'Ajman', ar: 'عجمان' } },
  { id: 'rasAlKhaimah', label: { en: 'Ras Al Khaimah', ar: 'رأس الخيمة' } },
]

export const countryOptions = [
  { id: 'uae', label: { en: 'United Arab Emirates', ar: 'دولة الإمارات العربية المتحدة' } },
]

export const maritalStatusOptions = [
  { id: 'single', label: { en: 'Single', ar: 'أعزب/عزباء' } },
  { id: 'married', label: { en: 'Married', ar: 'متزوج/متزوجة' } },
  { id: 'divorced', label: { en: 'Divorced', ar: 'مطلق/مطلقة' } },
  { id: 'widowed', label: { en: 'Widowed', ar: 'أرمل/أرملة' } },
]

export const employmentStatusOptions = [
  { id: 'employedFullTime', label: { en: 'Employed Full-time', ar: 'موظف بدوام كامل' } },
  { id: 'employedPartTime', label: { en: 'Employed Part-time', ar: 'موظف بدوام جزئي' } },
  { id: 'selfEmployed', label: { en: 'Self-employed', ar: 'يعمل لحسابه الخاص' } },
  { id: 'unemployed', label: { en: 'Unemployed', ar: 'عاطل عن العمل' } },
  { id: 'student', label: { en: 'Student', ar: 'طالب' } },
  { id: 'retired', label: { en: 'Retired', ar: 'متقاعد' } },
  { id: 'disabled', label: { en: 'Disabled', ar: 'معاق' } },
  { id: 'other', label: { en: 'Other', ar: 'أخرى' } },
]

export const housingStatusOptions = [
  { id: 'ownWithMortgage', label: { en: 'Own Home (with mortgage)', ar: 'تملك منزل (مع رهن)' } },
  { id: 'ownPaidOff', label: { en: 'Own Home (paid off)', ar: 'تملك منزل (مدفوع بالكامل)' } },
  { id: 'rent', label: { en: 'Rent', ar: 'إيجار' } },
  {
    id: 'liveWithFamily',
    label: { en: 'Live with family/friends', ar: 'العيش مع العائلة/الأصدقاء' },
  },
  { id: 'temporaryHousing', label: { en: 'Temporary housing', ar: 'سكن مؤقت' } },
  { id: 'homeless', label: { en: 'Homeless', ar: 'بلا مأوى' } },
  { id: 'other', label: { en: 'Other', ar: 'أخرى' } },
]

export const supportNeedsOptions = [
  { id: 'financial', label: { en: 'Financial assistance', ar: 'المساعدة المالية' } },
  { id: 'emotional', label: { en: 'Emotional support', ar: 'الدعم العاطفي' } },
  { id: 'practical', label: { en: 'Practical help', ar: 'المساعدة العملية' } },
  { id: 'information', label: { en: 'Information and resources', ar: 'المعلومات والموارد' } },
  { id: 'other', label: { en: 'Other', ar: 'أخرى' } },
]

export const urgencyOptions = [
  { id: 'immediate', label: { en: 'Immediate (within 24 hours)', ar: 'فوري (خلال 24 ساعة)' } },
  { id: 'urgent', label: { en: 'Urgent (within a week)', ar: 'عاجل (خلال أسبوع)' } },
  { id: 'moderate', label: { en: 'Moderate (within a month)', ar: 'متوسط (خلال شهر)' } },
  { id: 'flexible', label: { en: 'Flexible timing', ar: 'توقيت مرن' } },
]

// Helper function to get the current language from i18n
export const getCurrentLanguage = i18n => {
  return i18n?.language || 'en'
}

// Helper function to get localized label for an option
export const getLocalizedLabel = (option, currentLanguage) => {
  return option.label[currentLanguage] || option.label.en
}
