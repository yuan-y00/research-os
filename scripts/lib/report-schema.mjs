/**
 * Validates a report object against the ResearchReport schema.
 * Returns { valid: boolean, errors: string[] }.
 */

const REPORT_TYPES = [
  'brand', 'founder', 'product', 'company', 'crowdfunding', 'industry_event'
];

const CONFIDENCE_VALUES = ['high', 'medium', 'low'];
const DATA_AVAILABILITY_VALUES = ['public_data', 'partial_data', 'no_reliable_data'];
const SEVERITY_VALUES = ['low', 'medium', 'high'];
const FIXABILITY_VALUES = ['easy', 'hard', 'unclear'];

function required(obj, path) {
  if (obj == null) return `${path}: required, got ${obj}`;
  return null;
}

function isString(obj, path) {
  if (typeof obj !== 'string') return `${path}: expected string, got ${typeof obj}`;
  return null;
}

function isNonEmptyString(obj, path) {
  const e = isString(obj, path);
  if (e) return e;
  if (obj.trim().length === 0) return `${path}: must be non-empty string`;
  return null;
}

function isArray(obj, path) {
  if (!Array.isArray(obj)) return `${path}: expected array, got ${typeof obj}`;
  return null;
}

function isObject(obj, path) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj))
    return `${path}: expected object, got ${typeof obj}`;
  return null;
}

function validateKPI(kpi, idx) {
  const errors = [];
  const p = `kpis[${idx}]`;
  const e = required(kpi, p); if (e) { errors.push(e); return errors; }
  errors.push(...filterNulls([isNonEmptyString(kpi.label, `${p}.label`)]));
  errors.push(...filterNulls([isString(kpi.value, `${p}.value`)])); // value can be empty
  if (kpi.note !== undefined) errors.push(...filterNulls([isString(kpi.note, `${p}.note`)]));
  return errors;
}

function validateOriginStory(o, path) {
  const errors = [];
  const e = required(o, path); if (e) { errors.push(e); return errors; }
  errors.push(...filterNulls([isString(o.title, `${path}.title`)]));
  errors.push(...filterNulls([isString(o.marketProblem, `${path}.marketProblem`)]));
  errors.push(...filterNulls([isString(o.foundingContext, `${path}.foundingContext`)]));
  errors.push(...filterNulls([isString(o.firstVersion, `${path}.firstVersion`)]));
  errors.push(...filterNulls([isString(o.nonConsensusInsight, `${path}.nonConsensusInsight`)]));
  return errors;
}

function validateInnovation(item, idx) {
  const errors = [];
  const p = `initialInnovation[${idx}]`;
  const e = required(item, p); if (e) { errors.push(e); return errors; }
  errors.push(...filterNulls([isString(item.type, `${p}.type`)]));
  errors.push(...filterNulls([isString(item.insight, `${p}.insight`)]));
  errors.push(...filterNulls([isString(item.evidence, `${p}.evidence`)]));
  return errors;
}

function validateBreakoutMoment(b, path) {
  const errors = [];
  const e = required(b, path); if (e) { errors.push(e); return errors; }
  errors.push(...filterNulls([isString(b.period, `${path}.period`)]));
  errors.push(...filterNulls([isString(b.trigger, `${path}.trigger`)]));
  errors.push(...filterNulls([isString(b.whyNow, `${path}.whyNow`)]));
  errors.push(...filterNulls([isString(b.growthFlywheel, `${path}.growthFlywheel`)]));
  return errors;
}

function validateCustomerImpact(item, idx) {
  const errors = [];
  const p = `customerImpact[${idx}]`;
  const e = required(item, p); if (e) { errors.push(e); return errors; }
  errors.push(...filterNulls([isString(item.area, `${p}.area`)]));
  errors.push(...filterNulls([isString(item.impact, `${p}.impact`)]));
  errors.push(...filterNulls([isString(item.evidence, `${p}.evidence`)]));
  if (!CONFIDENCE_VALUES.includes(item.confidence))
    errors.push(`${p}.confidence: must be one of ${CONFIDENCE_VALUES.join(', ')}, got "${item.confidence}"`);
  return errors;
}

function validateEcosystemImpact(item, idx) {
  const errors = [];
  const p = `ecosystemImpact[${idx}]`;
  const e = required(item, p); if (e) { errors.push(e); return errors; }
  errors.push(...filterNulls([isString(item.area, `${p}.area`)]));
  errors.push(...filterNulls([isString(item.impact, `${p}.impact`)]));
  errors.push(...filterNulls([isString(item.evidence, `${p}.evidence`)]));
  if (!DATA_AVAILABILITY_VALUES.includes(item.dataAvailability))
    errors.push(`${p}.dataAvailability: must be one of ${DATA_AVAILABILITY_VALUES.join(', ')}, got "${item.dataAvailability}"`);
  return errors;
}

function validateBusinessModel(b, path) {
  const errors = [];
  const e = required(b, path); if (e) { errors.push(e); return errors; }
  errors.push(...filterNulls([isString(b.customers, `${path}.customers`)]));
  errors.push(...filterNulls([isString(b.revenue, `${path}.revenue`)]));
  errors.push(...filterNulls([isString(b.marginLogic, `${path}.marginLogic`)]));
  errors.push(...filterNulls([isString(b.repeatPurchase, `${path}.repeatPurchase`)]));
  errors.push(...filterNulls([isString(b.channels, `${path}.channels`)]));
  errors.push(...filterNulls([isString(b.scalability, `${path}.scalability`)]));
  return errors;
}

function validateCompetitor(item, idx) {
  const errors = [];
  const p = `competitiveLandscape[${idx}]`;
  const e = required(item, p); if (e) { errors.push(e); return errors; }
  errors.push(...filterNulls([isString(item.competitor, `${p}.competitor`)]));
  errors.push(...filterNulls([isString(item.position, `${p}.position`)]));
  errors.push(...filterNulls([isString(item.strength, `${p}.strength`)]));
  errors.push(...filterNulls([isString(item.weakness, `${p}.weakness`)]));
  return errors;
}

function validateWhatWorked(item, idx) {
  const errors = [];
  const p = `whatWorked[${idx}]`;
  const e = required(item, p); if (e) { errors.push(e); return errors; }
  errors.push(...filterNulls([isString(item.insight, `${p}.insight`)]));
  errors.push(...filterNulls([isString(item.evidence, `${p}.evidence`)]));
  errors.push(...filterNulls([isString(item.whyItMatters, `${p}.whyItMatters`)]));
  return errors;
}

function validateRisk(item, idx) {
  const errors = [];
  const p = `risks[${idx}]`;
  const e = required(item, p); if (e) { errors.push(e); return errors; }
  errors.push(...filterNulls([isString(item.risk, `${p}.risk`)]));
  errors.push(...filterNulls([isString(item.evidence, `${p}.evidence`)]));
  if (!SEVERITY_VALUES.includes(item.severity))
    errors.push(`${p}.severity: must be one of ${SEVERITY_VALUES.join(', ')}, got "${item.severity}"`);
  if (!FIXABILITY_VALUES.includes(item.fixability))
    errors.push(`${p}.fixability: must be one of ${FIXABILITY_VALUES.join(', ')}, got "${item.fixability}"`);
  return errors;
}

function validateLesson(item, idx) {
  const errors = [];
  const p = `lessonsForBuilders[${idx}]`;
  const e = required(item, p); if (e) { errors.push(e); return errors; }
  errors.push(...filterNulls([isString(item.lesson, `${p}.lesson`)]));
  errors.push(...filterNulls([isString(item.application, `${p}.application`)]));
  errors.push(...filterNulls([isString(item.caution, `${p}.caution`)]));
  return errors;
}

function validateFinalJudgment(f, path) {
  const errors = [];
  const e = required(f, path); if (e) { errors.push(e); return errors; }
  errors.push(...filterNulls([isString(f.learnable, `${path}.learnable`)]));
  errors.push(...filterNulls([isString(f.copyable, `${path}.copyable`)]));
  errors.push(...filterNulls([isString(f.investable, `${path}.investable`)]));
  errors.push(...filterNulls([isString(f.threeYearView, `${path}.threeYearView`)]));
  errors.push(...filterNulls([isString(f.biggestOpportunity, `${path}.biggestOpportunity`)]));
  errors.push(...filterNulls([isString(f.biggestRisk, `${path}.biggestRisk`)]));
  return errors;
}

function validateSource(item, idx) {
  const errors = [];
  const p = `sources[${idx}]`;
  const e = required(item, p); if (e) { errors.push(e); return errors; }
  errors.push(...filterNulls([isString(item.title, `${p}.title`)]));
  errors.push(...filterNulls([isString(item.url, `${p}.url`)]));
  if (item.publisher !== undefined) errors.push(...filterNulls([isString(item.publisher, `${p}.publisher`)]));
  if (item.date !== undefined) errors.push(...filterNulls([isString(item.date, `${p}.date`)]));
  return errors;
}

function filterNulls(arr) {
  return arr.filter(Boolean);
}

function validateStringArray(arr, path) {
  const errors = [];
  const ae = isArray(arr, path);
  if (ae) { errors.push(ae); return errors; }
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== 'string')
      errors.push(`${path}[${i}]: expected string, got ${typeof arr[i]}`);
  }
  return errors;
}

function validateArrayOf(arr, path, validator) {
  const errors = [];
  const ae = isArray(arr, path);
  if (ae) { errors.push(ae); return errors; }
  for (let i = 0; i < arr.length; i++) {
    errors.push(...validator(arr[i], i));
  }
  return errors;
}

/**
 * @param {object} report - The report to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateReport(report) {
  const errors = [];

  if (!report || typeof report !== 'object' || Array.isArray(report)) {
    errors.push('report: expected object');
    return { valid: false, errors };
  }

  // Top-level required string fields
  for (const field of ['id', 'slug', 'title', 'subtitle', 'subject', 'createdAt', 'updatedAt', 'summary', 'verdict']) {
    const e = isNonEmptyString(report[field], field);
    if (e) errors.push(e);
  }

  // type must be one of REPORT_TYPES
  if (!REPORT_TYPES.includes(report.type))
    errors.push(`type: must be one of ${REPORT_TYPES.join(', ')}, got "${report.type}"`);

  // Optional string fields
  if (report.country !== undefined) {
    const e = isString(report.country, 'country');
    if (e) errors.push(e);
  }
  if (report.category !== undefined) {
    const e = isString(report.category, 'category');
    if (e) errors.push(e);
  }

  // tags: string[]
  errors.push(...validateStringArray(report.tags, 'tags'));

  // kpis: KPI[]
  errors.push(...validateArrayOf(report.kpis, 'kpis', validateKPI));

  // originStory: OriginStory
  errors.push(...validateOriginStory(report.originStory, 'originStory'));

  // initialInnovation: Innovation[]
  errors.push(...validateArrayOf(report.initialInnovation, 'initialInnovation', validateInnovation));

  // breakoutMoment: BreakoutMoment
  errors.push(...validateBreakoutMoment(report.breakoutMoment, 'breakoutMoment'));

  // customerImpact: CustomerImpact[]
  errors.push(...validateArrayOf(report.customerImpact, 'customerImpact', validateCustomerImpact));

  // ecosystemImpact: EcosystemImpact[]
  errors.push(...validateArrayOf(report.ecosystemImpact, 'ecosystemImpact', validateEcosystemImpact));

  // businessModel: BusinessModel
  errors.push(...validateBusinessModel(report.businessModel, 'businessModel'));

  // competitiveLandscape: Competitor[]
  errors.push(...validateArrayOf(report.competitiveLandscape, 'competitiveLandscape', validateCompetitor));

  // whatWorked: WhatWorked[]
  errors.push(...validateArrayOf(report.whatWorked, 'whatWorked', validateWhatWorked));

  // risks: Risk[]
  errors.push(...validateArrayOf(report.risks, 'risks', validateRisk));

  // lessonsForBuilders: Lesson[]
  errors.push(...validateArrayOf(report.lessonsForBuilders, 'lessonsForBuilders', validateLesson));

  // finalJudgment: FinalJudgment
  errors.push(...validateFinalJudgment(report.finalJudgment, 'finalJudgment'));

  // sources: Source[]
  errors.push(...validateArrayOf(report.sources, 'sources', validateSource));

  return { valid: errors.length === 0, errors };
}
