/**
 * AI client for generating research reports.
 * Uses OpenAI API if OPENAI_API_KEY is available, otherwise returns mock data.
 * Never throws - always falls back to mock on failure.
 */

/**
 * Generates a mock ResearchReport with reasonable placeholder content.
 * @param {string} subject
 * @param {string} reportType
 * @param {string} [notes]
 * @returns {object} A valid ResearchReport object
 */
function generateMockReport(subject, reportType, notes) {
  const now = new Date().toISOString();
  const id = 'mock-' + Date.now().toString(36);
  const slug = subject
    .toLowerCase()
    .replace(/[^\w一-鿿]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const typeLabels = {
    brand: '品牌',
    founder: '创始人',
    product: '产品',
    company: '公司',
    crowdfunding: '众筹',
    industry_event: '行业事件',
  };

  const typeLabel = typeLabels[reportType] || reportType;
  const notesHint = notes ? `\n研究重点：${notes}` : '';

  return {
    id,
    slug,
    title: `${subject} - ${typeLabel}研究报告`,
    subtitle: `关于${subject}的深度分析报告`,
    type: reportType,
    subject,
    country: '待确认',
    category: '待分类',
    createdAt: now,
    updatedAt: now,
    summary: `这是一份关于${subject}的模拟研究报告。当前未配置 OPENAI_API_KEY 环境变量，因此返回模拟数据。${notesHint}`.trim(),
    verdict: `${subject}展现了值得关注的市场潜力。由于当前为模拟数据生成模式，建议配置 OPENAI_API_KEY 以获得基于最新公开信息的深度分析。`,
    tags: [subject, reportType],
    kpis: [
      {
        label: '市场估值',
        value: '暂无可靠公开数据',
        note: '需通过公开财报或权威第三方报告获取',
      },
      {
        label: '年度营收',
        value: '暂无可靠公开数据',
        note: '非上市公司数据通常不公开',
      },
      {
        label: '用户规模',
        value: '暂无可靠公开数据',
      },
    ],
    originStory: {
      title: `${subject}的创立故事`,
      marketProblem: `${subject}所瞄准的市场痛点，需要进一步调研确认。`,
      foundingContext: `关于${subject}的具体创立背景和时间线，目前暂无充分的公开数据可供参考。建议查阅一手访谈或创始人公开演讲。`,
      firstVersion: '暂无可靠公开数据',
      nonConsensusInsight: `关于${subject}创始人的非共识洞察，需要深入分析其早期访谈和决策逻辑。`,
    },
    initialInnovation: [
      {
        type: '产品创新',
        insight: `${subject}在其领域的创新方向值得关注。`,
        evidence: '需进一步收集产品发布资料和用户反馈。',
      },
      {
        type: '商业模式创新',
        insight: `${subject}的商业模式可能有其独到之处。`,
        evidence: '暂无可靠公开数据，建议分析其公开的定价和渠道策略。',
      },
    ],
    breakoutMoment: {
      period: '待确认',
      trigger: `${subject}的爆发式增长触发点暂未明确。`,
      whyNow: '市场时机分析需要结合行业趋势数据。',
      growthFlywheel: '暂无可靠公开数据',
    },
    customerImpact: [
      {
        area: '用户体验',
        impact: `${subject}对目标用户群体产生了可感知的影响。`,
        evidence: '暂无可靠公开数据',
        confidence: 'low',
      },
      {
        area: '使用成本',
        impact: '暂未获得足够的用户反馈数据。',
        evidence: '暂无可靠公开数据',
        confidence: 'low',
      },
    ],
    ecosystemImpact: [
      {
        area: '供应链',
        impact: `${subject}对其供应链生态的影响需要进一步调研。`,
        evidence: '暂无可靠公开数据',
        dataAvailability: 'no_reliable_data',
      },
      {
        area: '行业标准',
        impact: '对行业标准的影响暂不明确。',
        evidence: '暂无可靠公开数据',
        dataAvailability: 'no_reliable_data',
      },
    ],
    businessModel: {
      customers: '待确认',
      revenue: '暂无可靠公开数据',
      marginLogic: '暂无可靠公开数据',
      repeatPurchase: '暂无可靠公开数据',
      channels: '待确认',
      scalability: '待分析',
    },
    competitiveLandscape: [
      {
        competitor: '主要竞品 A',
        position: '市场领导者',
        strength: '品牌认知度高',
        weakness: '创新速度可能较慢',
      },
      {
        competitor: '主要竞品 B',
        position: '新进入者',
        strength: '灵活性和创新能力',
        weakness: '规模和资源有限',
      },
    ],
    whatWorked: [
      {
        insight: `${subject}的核心成功因素之一是产品与市场的匹配。`,
        evidence: '暂无可靠公开数据',
        whyItMatters: '产品市场匹配是所有成功企业的基础。',
      },
      {
        insight: '团队执行力是其差异化优势。',
        evidence: '暂无可靠公开数据',
        whyItMatters: '在竞争激烈的市场中，执行力往往比创意更重要。',
      },
    ],
    risks: [
      {
        risk: '市场竞争加剧',
        evidence: '行业中不断有新的参与者进入。',
        severity: 'medium',
        fixability: 'unclear',
      },
      {
        risk: '技术迭代风险',
        evidence: '技术发展速度快，现有优势可能被颠覆。',
        severity: 'medium',
        fixability: 'hard',
      },
      {
        risk: '供应链依赖',
        evidence: '暂无可靠公开数据',
        severity: 'low',
        fixability: 'unclear',
      },
    ],
    lessonsForBuilders: [
      {
        lesson: '找到真正的用户痛点比技术更重要。',
        application: '在产品开发前，投入足够时间验证用户需求。',
        caution: '不要因为技术可行就假设市场需要。',
      },
      {
        lesson: '早期用户反馈是产品迭代的最宝贵资源。',
        application: '建立快速反馈闭环，每周与用户沟通。',
        caution: '过度依赖少数用户意见可能导致视野局限。',
      },
      {
        lesson: '商业模式需要在早期就有清晰的假设和验证计划。',
        application: '从第一天就思考如何盈利，即使不立即执行。',
        caution: '过早追求盈利可能牺牲增长速度。',
      },
    ],
    finalJudgment: {
      learnable: `${subject}在产品创新和市场策略方面有值得学习的地方，但需获取更多一手信息才能做出准确判断。`,
      copyable: '部分策略可以借鉴，但需结合自身情况调整。',
      investable: '当前信息不足以做出投资判断，需进一步调研。',
      threeYearView: '未来三年发展取决于其能否持续创新和应对竞争。',
      biggestOpportunity: '市场的增长潜力是其最大机遇。',
      biggestRisk: '竞争加剧和技术变革是其主要风险。',
    },
    sources: [
      {
        title: `${subject} 官方网站`,
        url: `https://www.google.com/search?q=${encodeURIComponent(subject)}+official`,
        publisher: '待确认',
        date: now,
      },
    ],
  };
}

/**
 * Calls OpenAI API to generate a research report.
 * @param {string} prompt - The prompt to send
 * @returns {Promise<object>} Parsed JSON response
 */
async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL || 'gpt-4o';

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert research analyst. You generate thorough, well-structured research reports in JSON format. Always use Chinese (简体中文) for content. When data is unavailable, use "暂无可靠公开数据" instead of fabricating numbers.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 8192,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI API returned empty response');
  }

  return JSON.parse(content);
}

/**
 * Generates a research report. Uses OpenAI API if OPENAI_API_KEY is set,
 * otherwise returns a mock report. Never throws - always returns a report.
 *
 * @param {object} options
 * @param {string} options.subject - The research subject
 * @param {string} options.reportType - The report type (brand, founder, etc.)
 * @param {string} [options.notes] - Optional research notes
 * @returns {Promise<object>} A ResearchReport object
 */
export async function generateReport({ subject, reportType, notes }) {
  if (!process.env.OPENAI_API_KEY) {
    console.log('[ai-client] No OPENAI_API_KEY set, returning mock report.');
    return generateMockReport(subject, reportType, notes);
  }

  try {
    // Dynamic import of prompt-builder to avoid circular issues
    const { buildPrompt } = await import('./prompt-builder.mjs');
    const prompt = buildPrompt(subject, reportType, notes);

    console.log('[ai-client] Calling OpenAI API...');
    const report = await callOpenAI(prompt);

    // Add id and slug if the AI didn't generate them
    if (!report.id) {
      report.id = 'ai-' + Date.now().toString(36);
    }
    if (!report.slug) {
      report.slug = subject
        .toLowerCase()
        .replace(/[^\w一-鿿]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    if (!report.createdAt) {
      report.createdAt = new Date().toISOString();
    }
    report.updatedAt = new Date().toISOString();

    console.log('[ai-client] Successfully generated report via OpenAI.');
    return report;
  } catch (err) {
    console.error('[ai-client] OpenAI API call failed, falling back to mock:', err.message);
    return generateMockReport(subject, reportType, notes);
  }
}
