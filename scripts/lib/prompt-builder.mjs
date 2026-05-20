/**
 * Builds a prompt for the AI to generate a ResearchReport in JSON format.
 * Emphasizes: no fabricated numbers, use "暂无可靠公开数据" when data unavailable.
 */

const REPORT_TYPES = {
  brand: '品牌',
  founder: '创始人',
  product: '产品',
  company: '公司',
  crowdfunding: '众筹',
  industry_event: '行业事件',
};

/**
 * @param {string} subject - The research subject
 * @param {string} reportType - The report type
 * @param {string} [notes] - Optional notes / focus areas
 * @returns {string} A prompt string for the AI
 */
export function buildPrompt(subject, reportType, notes) {
  const typeLabel = REPORT_TYPES[reportType] || reportType;
  const notesSection = notes
    ? `\n\n【额外研究重点】\n${notes}`
    : '';

  // Build the JSON schema description inline so the AI knows exactly what to output
  return `你是一位资深商业研究分析师。请对以下研究对象进行深度分析，并以 JSON 格式输出完整的结构化研究报告。

【研究对象】
名称：${subject}
类型：${typeLabel}${notesSection}

【关键原则】
1. 所有数据必须基于可验证的公开信息。严禁编造具体数字（如营收、估值、增长率等）。
2. 当某项数据无法从公开渠道获取时，必须使用 "暂无可靠公开数据" 作为值。宁可留白也不要伪造。
3. 分析深度：必须覆盖起源故事、创新点、爆发时刻、客户影响、生态影响、商业模式、竞争格局、成功因素、风险、对创业者的启示、最终判断。
4. 输出必须是合法的 JSON 对象，不要包含任何 JSON 之外的解释文字。所有内容字段使用简体中文。

【输出 JSON 结构】
请严格按照以下结构输出 JSON（所有字段均为必填，除非标注为 optional）：

{
  "title": "研究报告标题，格式为：{subject} - {type}研究报告",
  "subtitle": "一句话副标题，概括核心发现",
  "type": "${reportType}",
  "subject": "${subject}",
  "country": "国家/地区（optional）",
  "category": "分类标签（optional）",
  "summary": "200字以内的研究摘要",
  "verdict": "一句话核心判断",
  "tags": ["标签1", "标签2"],
  "kpis": [
    { "label": "指标名称", "value": "数值或暂无可靠公开数据", "note": "补充说明（optional）" }
  ],
  "originStory": {
    "title": "起源故事标题",
    "marketProblem": "创始人所看到的市场问题/痛点",
    "foundingContext": "创立背景和时机",
    "firstVersion": "第一个版本/产品的形态",
    "nonConsensusInsight": "创始人当时持有的非共识洞察（别人都怎么想，但他的不同观点是什么）"
  },
  "initialInnovation": [
    { "type": "创新类型（产品创新/技术创新/商业模式创新等）", "insight": "创新洞察", "evidence": "支持证据" }
  ],
  "breakoutMoment": {
    "period": "爆发时间窗口",
    "trigger": "触发爆发的具体事件或条件",
    "whyNow": "为什么是这个时间点而非更早或更晚",
    "growthFlywheel": "增长飞轮机制描述"
  },
  "customerImpact": [
    { "area": "影响领域", "impact": "具体影响", "evidence": "证据", "confidence": "high|medium|low" }
  ],
  "ecosystemImpact": [
    { "area": "影响领域", "impact": "具体影响", "evidence": "证据", "dataAvailability": "public_data|partial_data|no_reliable_data" }
  ],
  "businessModel": {
    "customers": "目标客户群体",
    "revenue": "收入模式",
    "marginLogic": "利润逻辑",
    "repeatPurchase": "复购机制",
    "channels": "销售渠道",
    "scalability": "可扩展性分析"
  },
  "competitiveLandscape": [
    { "competitor": "竞品名称", "position": "市场定位", "strength": "优势", "weakness": "劣势" }
  ],
  "whatWorked": [
    { "insight": "成功因素", "evidence": "支持证据", "whyItMatters": "为什么重要" }
  ],
  "risks": [
    { "risk": "风险描述", "evidence": "证据", "severity": "low|medium|high", "fixability": "easy|hard|unclear" }
  ],
  "lessonsForBuilders": [
    { "lesson": "对创业者的启示", "application": "如何应用", "caution": "注意事项/陷阱" }
  ],
  "finalJudgment": {
    "learnable": "什么是可学习的（200字内）",
    "copyable": "什么是可复制的（200字内）",
    "investable": "投资判断（200字内）",
    "threeYearView": "3年展望（200字内）",
    "biggestOpportunity": "最大机遇",
    "biggestRisk": "最大风险"
  },
  "sources": [
    { "title": "信息来源标题", "url": "https://...", "publisher": "发布方（optional）", "date": "发布日期（optional）" }
  ]
}

【特别提醒】
- 如果研究对象是品牌（brand），重点分析品牌策略、DTC模式、供应链等。
- 如果研究对象是创始人（founder），重点分析其思维方式、决策逻辑、领导风格、关键转折点。
- 如果研究对象是产品（product），重点分析产品设计理念、技术创新、用户反馈、迭代历程。
- 如果研究对象是公司（company），重点分析组织架构、文化、战略、财务表现。
- 如果研究对象是众筹项目（crowdfunding），重点分析众筹策略、社区运营、交付能力。
- 如果研究对象是行业事件（industry_event），重点分析趋势信号、影响范围、行业格局变化。

请现在开始生成关于 "${subject}" 的研究报告。只输出 JSON，不要输出任何其他文字。`;
}
