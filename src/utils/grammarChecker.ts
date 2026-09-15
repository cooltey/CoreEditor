import { GrammarIssue } from '../types';

interface Rule {
  id: string;
  category: 'grammar' | 'spelling' | 'style' | 'punctuation' | 'redundancy';
  message: string;
  pattern: RegExp;
  replace: (match: string, ...groups: string[]) => string | string[];
}

/**
 * 1. HIGH-PRECISION GRAMMAR, PHRASE, & SYNTAX RULES
 */
const GRAMMAR_RULES: Rule[] = [
  // 1. Repeated words (e.g. "the the", "is is", "we we", "can can")
  {
    id: 'duplicate-word',
    category: 'grammar',
    message: 'Duplicate word detected. Consider removing one.',
    pattern: /\b([a-zA-Z]{2,})\s+\1\b/gi,
    replace: (_match, word) => word,
  },

  // 2. Personal pronoun "I" must be capitalized
  {
    id: 'capitalize-i',
    category: 'grammar',
    message: 'The personal pronoun "I" should always be capitalized.',
    pattern: /(^|[\s(])(i)([\s),.?!:;]|$)/g,
    replace: (_match, p1, _i, p3) => `${p1}I${p3}`,
  },
  {
    id: 'capitalize-i-contractions',
    category: 'grammar',
    message: 'Contraction should start with capitalized "I".',
    pattern: /\b(im|ive|id|ill)\b/gi,
    replace: (match) => {
      const lower = match.toLowerCase();
      if (lower === 'im') return "I'm";
      if (lower === 'ive') return "I've";
      if (lower === 'id') return "I'd";
      if (lower === 'ill') return "I'll";
      return match;
    },
  },

  // 3. Modal verbs + "of" confusion (e.g. "could of", "should of", "would of")
  {
    id: 'modal-have',
    category: 'grammar',
    message: 'Did you mean "have" instead of "of"?',
    pattern: /\b(could|should|would|might|must)\s+of\b/gi,
    replace: (_match, verb) => `${verb} have`,
  },

  // 4. Comparison "then" vs "than"
  {
    id: 'then-than',
    category: 'grammar',
    message: 'Use "than" for comparisons, "then" for sequence or time.',
    pattern: /\b(better|worse|more|less|faster|slower|bigger|smaller|higher|lower|older|younger|easier|harder|rather|sooner|greater)\s+then\b/gi,
    replace: (_match, comp) => `${comp} than`,
  },
  {
    id: 'other-then',
    category: 'grammar',
    message: 'Did you mean "other than"?',
    pattern: /\bother\s+then\b/gi,
    replace: () => 'other than',
  },
  {
    id: 'rather-then',
    category: 'grammar',
    message: 'Did you mean "rather than"?',
    pattern: /\brather\s+then\b/gi,
    replace: () => 'rather than',
  },

  // 5. "its" vs "it's"
  {
    id: 'its-contraction',
    category: 'grammar',
    message: 'Did you mean the contraction "it\'s" (short for "it is" or "it has")?',
    pattern: /\b(its)\s+(a|an|the|my|your|his|her|our|their|going|not|too|very|always|already|obviously|clearly|supposed|better|easier|harder|good|bad|nice|great|time|working|done|important|safe|possible|true|false)\b/gi,
    replace: (_match, _its, next) => `it's ${next}`,
  },
  {
    id: 'its-possessive',
    category: 'grammar',
    message: 'Did you mean the possessive "its" (belonging to it)?',
    pattern: /\b(it's)\s+(name|color|size|shape|surface|price|purpose|features|components|elements|status|value|content|speed|length|width|height|weight|design|code|engine|system|behavior|effect|icon)\b/gi,
    replace: (_match, _its, next) => `its ${next}`,
  },

  // 6. "their" vs "there" vs "they're"
  {
    id: 'their-there',
    category: 'grammar',
    message: 'Did you mean "there"?',
    pattern: /\btheir\s+(is|are|was|were|will|has|have|had|could|should|would|can|might)\b/gi,
    replace: (_match, verb) => `there ${verb}`,
  },
  {
    id: 'there-their',
    category: 'grammar',
    message: 'Did you mean the possessive "their"?',
    pattern: /\bthere\s+(car|house|dog|cat|computer|phone|money|family|parents|friends|children|team|work|idea|book|file|files|code|app|project|office|job|account)\b/gi,
    replace: (_match, noun) => `their ${noun}`,
  },
  {
    id: 'there-theyre',
    category: 'grammar',
    message: 'Did you mean "they\'re" (they are)?',
    pattern: /\bthere\s+(going|supposed|trying|planning|working|building|developing|coming|leaving)\b/gi,
    replace: (_match, gerund) => `they're ${gerund}`,
  },

  // 7. "your" vs "you're"
  {
    id: 'your-youre',
    category: 'grammar',
    message: 'Did you mean "you\'re" (contraction of "you are")?',
    pattern: /\byour\s+(welcome|right|wrong|late|early|amazing|correct|the\s+best|going|looking|ready|smart|sure|invited|doing)\b/gi,
    replace: (_match, next) => `you're ${next}`,
  },
  {
    id: 'youre-your',
    category: 'grammar',
    message: 'Did you mean the possessive "your"?',
    pattern: /\byou're\s+(car|house|dog|cat|computer|phone|money|family|name|email|account|password|file|folder|document|settings|profile|turn|own)\b/gi,
    replace: (_match, noun) => `your ${noun}`,
  },

  // 8. "lose" vs "loose"
  {
    id: 'lose-loose',
    category: 'grammar',
    message: 'Did you mean "lose" (fail to win, misplace)?',
    pattern: /\bloose\s+(weight|money|time|my|your|his|her|their|our|the\s+game|hope|control|interest|focus|patience)\b/gi,
    replace: (_match, next) => `lose ${next}`,
  },
  {
    id: 'to-lose',
    category: 'grammar',
    message: 'Did you mean "to lose"?',
    pattern: /\bto\s+loose\b/gi,
    replace: () => 'to lose',
  },

  // 9. "affect" vs "effect"
  {
    id: 'affect-effect',
    category: 'grammar',
    message: 'Did you mean "take effect"?',
    pattern: /\btake\s+affect\b/gi,
    replace: () => 'take effect',
  },
  {
    id: 'have-an-affect',
    category: 'grammar',
    message: 'Did you mean "have an effect"?',
    pattern: /\b(have|has|had)\s+an\s+affect\b/gi,
    replace: (_match, verb) => `${verb} an effect`,
  },
  {
    id: 'side-affect',
    category: 'grammar',
    message: 'Did you mean "side effect"?',
    pattern: /\bside\s+affects?\b/gi,
    replace: (match) => match.toLowerCase().endsWith('s') ? 'side effects' : 'side effect',
  },

  // 10. "suppose to" -> "supposed to"
  {
    id: 'suppose-to',
    category: 'grammar',
    message: 'Did you mean "supposed to"?',
    pattern: /\b(am|is|are|was|were|be|been)\s+suppose\s+to\b/gi,
    replace: (_match, verb) => `${verb} supposed to`,
  },
  {
    id: 'use-to',
    category: 'grammar',
    message: 'Did you mean "used to"?',
    pattern: /\b(am|is|are|was|were)\s+use\s+to\b/gi,
    replace: (_match, verb) => `${verb} used to`,
  },

  // 11. "a" vs "an" article agreement
  {
    id: 'article-a-an',
    category: 'grammar',
    message: 'Use "an" before words starting with a vowel sound.',
    pattern: /\b(a)\s+([aeioAEIO][a-z]{2,})\b/g,
    replace: (_match, _a, word) => {
      const lower = word.toLowerCase();
      if (
        lower.startsWith('uni') ||
        lower.startsWith('use') ||
        lower.startsWith('one') ||
        lower.startsWith('eu') ||
        lower.startsWith('ubo')
      ) {
        return `a ${word}`;
      }
      return `an ${word}`;
    },
  },
  {
    id: 'article-an-a',
    category: 'grammar',
    message: 'Use "a" before words starting with a consonant sound.',
    pattern: /\b(an)\s+([b-df-hj-np-tv-zB-DF-HJ-NP-TV-Z][a-z]{2,})\b/g,
    replace: (_match, _an, word) => {
      const lower = word.toLowerCase();
      if (
        lower.startsWith('hour') ||
        lower.startsWith('honor') ||
        lower.startsWith('honest') ||
        lower.startsWith('heir')
      ) {
        return `an ${word}`;
      }
      return `a ${word}`;
    },
  },

  // 12. "every day" vs "everyday"
  {
    id: 'everyday-verb',
    category: 'grammar',
    message: '"everyday" is an adjective. Use "every day" (two words) as an adverb of frequency.',
    pattern: /\b(do|practice|run|work|study|write|read|train)\s+(this\s+)?everyday\b/gi,
    replace: (match) => match.replace(/everyday$/i, 'every day'),
  },

  // 13. Subject-Verb agreement basic checks
  {
    id: 'they-does',
    category: 'grammar',
    message: 'Subject-verb agreement: use "do" with plural pronoun "they" / "we" / "you".',
    pattern: /\b(they|we|you)\s+does\b/gi,
    replace: (_match, pron) => `${pron} do`,
  },
  {
    id: 'he-do',
    category: 'grammar',
    message: 'Subject-verb agreement: use "does" with 3rd-person singular "he" / "she" / "it".',
    pattern: /\b(he|she|it)\s+dont\b/gi,
    replace: (_match, pron) => `${pron} doesn't`,
  },
  {
    id: 'he-dont',
    category: 'grammar',
    message: 'Subject-verb agreement: use "doesn\'t" with 3rd-person singular.',
    pattern: /\b(he|she|it)\s+don't\b/gi,
    replace: (_match, pron) => `${pron} doesn't`,
  },

  // 14. Punctuation spacing (e.g. space before comma/period)
  {
    id: 'space-before-punctuation',
    category: 'punctuation',
    message: 'Unexpected space before punctuation mark.',
    pattern: /([a-zA-Z0-9])\s+([,.:;?!])/g,
    replace: (_match, char, punc) => `${char}${punc}`,
  },
  {
    id: 'missing-space-after-punctuation',
    category: 'punctuation',
    message: 'Missing space after punctuation mark.',
    pattern: /([,.:;?!])([a-zA-Z])/g,
    replace: (match, punc, letter) => {
      // Don't flag URLs or decimals
      if (punc === '.' && /\d/.test(match)) return match;
      if (punc === ':' && (match.includes('http') || match.includes('https'))) return match;
      return `${punc} ${letter}`;
    },
  },

  // 15. Style & Clarity simplifications
  {
    id: 'style-in-order-to',
    category: 'style',
    message: 'Consider simplifying "in order to" to just "to".',
    pattern: /\bin order to\b/gi,
    replace: () => 'to',
  },
  {
    id: 'style-due-to-the-fact',
    category: 'style',
    message: 'Consider simplifying "due to the fact that" to "because".',
    pattern: /\bdue to the fact that\b/gi,
    replace: () => 'because',
  },
  {
    id: 'style-at-this-point',
    category: 'style',
    message: 'Consider simplifying "at this point in time" to "currently" or "now".',
    pattern: /\bat this point in time\b/gi,
    replace: () => 'now',
  },
  {
    id: 'style-utilize',
    category: 'style',
    message: 'Consider using "use" instead of "utilize" for clearer, simpler writing.',
    pattern: /\butilize\b/gi,
    replace: () => 'use',
  },
  {
    id: 'style-large-number-of',
    category: 'style',
    message: 'Consider using "many" instead of "a large number of".',
    pattern: /\ba large number of\b/gi,
    replace: () => 'many',
  },
  {
    id: 'style-as-well-as',
    category: 'style',
    message: 'Consider using "and" instead of "as well as" for concise reading.',
    pattern: /\bas well as\b/gi,
    replace: () => 'and',
  },
];

/**
 * 2. EXPANDED OFFLINE SPELLING DICTIONARY
 * Over 150+ most commonly misspelled English words with immediate corrections
 */
const SPELLING_DICTIONARY: Record<string, string> = {
  // Frequently misspelled English words
  'alot': 'a lot',
  'noone': 'no one',
  'seperate': 'separate',
  'seperated': 'separated',
  'seperating': 'separating',
  'definately': 'definitely',
  'definitly': 'definitely',
  'definetly': 'definitely',
  'recieve': 'receive',
  'recieved': 'received',
  'recieving': 'receiving',
  'occured': 'occurred',
  'occuring': 'occurring',
  'occurance': 'occurrence',
  'untill': 'until',
  'truely': 'truly',
  'wierd': 'weird',
  'goverment': 'government',
  'enviroment': 'environment',
  'acheive': 'achieve',
  'acheived': 'achieved',
  'beleive': 'believe',
  'beleived': 'believed',
  'calender': 'calendar',
  'tommorrow': 'tomorrow',
  'tomorow': 'tomorrow',
  'neccessary': 'necessary',
  'necesary': 'necessary',
  'necessery': 'necessary',
  'accomodate': 'accommodate',
  'accomodation': 'accommodation',
  'embarass': 'embarrass',
  'embarassing': 'embarrassing',
  'begining': 'beginning',
  'commited': 'committed',
  'commitee': 'committee',
  'concious': 'conscious',
  'curiousity': 'curiosity',
  'disapear': 'disappear',
  'dissapear': 'disappear',
  'disapoint': 'disappoint',
  'dissapoint': 'disappoint',
  'existance': 'existence',
  'experiance': 'experience',
  'experianced': 'experienced',
  'fourty': 'forty',
  'freind': 'friend',
  'gaurantee': 'guarantee',
  'garantee': 'guarantee',
  'guarenteed': 'guaranteed',
  'happend': 'happened',
  'harrass': 'harass',
  'heigth': 'height',
  'independant': 'independent',
  'intrest': 'interest',
  'intresting': 'interesting',
  'knowlege': 'knowledge',
  'liesure': 'leisure',
  'maintenence': 'maintenance',
  'mispell': 'misspell',
  'mispelled': 'misspelled',
  'noticable': 'noticeable',
  'ocassion': 'occasion',
  'occassion': 'occasion',
  'persue': 'pursue',
  'posession': 'possession',
  'posess': 'possess',
  'prefered': 'preferred',
  'privilege': 'privilege',
  'privelege': 'privilege',
  'priviledge': 'privilege',
  'probaly': 'probably',
  'probley': 'probably',
  'recommand': 'recommend',
  'recomended': 'recommended',
  'refered': 'referred',
  'relavent': 'relevant',
  'religeous': 'religious',
  'rember': 'remember',
  'resistence': 'resistance',
  'rythm': 'rhythm',
  'sieze': 'seize',
  'succesful': 'successful',
  'successfull': 'successful',
  'suprise': 'surprise',
  'surprizing': 'surprising',
  'tendancy': 'tendency',
  'threshhold': 'threshold',
  'tomatos': 'tomatoes',
  'unforseen': 'unforeseen',
  'usefull': 'useful',
  'whish': 'wish',
  'wierdest': 'weirdest',
  'writting': 'writing',
  'yeild': 'yield',
  'basicly': 'basically',
  'completly': 'completely',
  'diferent': 'different',
  'familar': 'familiar',
  'foward': 'forward',
  'grammer': 'grammar',
  'gramer': 'grammar',
  'gramar': 'grammar',
  'grammerly': 'grammarly',
  'garmmar': 'grammar',
  'garmmer': 'grammar',
  'garmer': 'grammar',
  'hightlight': 'highlight',
  'immediatly': 'immediately',
  'langauge': 'language',
  'lenght': 'length',
  'libary': 'library',
  'lisence': 'license',
  'peice': 'piece',
  'politican': 'politician',
  'publically': 'publicly',
  'realy': 'really',
  'shaddow': 'shadow',
  'similiar': 'similar',
  'sincerly': 'sincerely',
  'speach': 'speech',
  'teh': 'the',
  'thier': 'their',
  'untilll': 'until',
  'wich': 'which',
  'widht': 'width',
  'withing': 'within',
  'woudl': 'would',
  'shoudl': 'should',
  'coudl': 'could',
  'becuase': 'because',
  'beacuse': 'because',
  'alreay': 'already',
  'alright': 'all right',
  'allways': 'always',
  'amature': 'amateur',
  'appologize': 'apologize',
  'argument': 'argument',
  'arguement': 'argument',
  'athiest': 'atheist',
  'avaliable': 'available',
  'awfull': 'awful',
  'buisness': 'business',
  'collegue': 'colleague',
  'congradulations': 'congratulations',
  'catagory': 'category',
  'cemetery': 'cemetery',
  'cemetary': 'cemetery',
  'definatelys': 'definitely',
  'dilema': 'dilemma',
  'dispair': 'despair',
  'embarassment': 'embarrassment',
  'excede': 'exceed',
  'fascinat': 'fascinate',
  'guage': 'gauge',
  'humourous': 'humorous',
  'ignorant': 'ignorant',
  'interupt': 'interrupt',
  'judgement': 'judgment',
  'liason': 'liaison',
  'millenium': 'millennium',
  'minature': 'miniature',
  'neice': 'niece',
  'paralell': 'parallel',
  'pasttime': 'pastime',
  'playwrite': 'playwright',
  'possesion': 'possession',
  'questionaire': 'questionnaire',
  'referance': 'reference',
  'schedual': 'schedule',
  'twelth': 'twelfth',
  'tyrany': 'tyranny',
  'vaccuum': 'vacuum',
  'vehical': 'vehicle',
  'vicious': 'vicious',
};

/**
 * Strips code blocks and URLs from text to avoid false positives on programming syntax
 */
function maskCodeAndUrls(text: string): string {
  // Replace triple-backtick code blocks with equivalent spaces/newlines
  let masked = text.replace(/```[\s\S]*?```/g, (match) => ' '.repeat(match.length));
  
  // Replace inline code with spaces
  masked = masked.replace(/`[^`\n]+`/g, (match) => ' '.repeat(match.length));

  // Replace URLs with spaces
  masked = masked.replace(/https?:\/\/[^\s)]+/g, (match) => ' '.repeat(match.length));

  // Replace HTML tags with spaces
  masked = masked.replace(/<[^>]+>/g, (match) => ' '.repeat(match.length));

  return masked;
}

/**
 * Calculates 1-indexed line and column for a character index
 */
function getLineAndCol(text: string, index: number): { line: number; column: number } {
  const upToIndex = text.slice(0, index);
  const lines = upToIndex.split('\n');
  const line = lines.length;
  const column = (lines[lines.length - 1]?.length || 0) + 1;
  return { line, column };
}

/**
 * Check text for English grammar, spelling, and style issues.
 * 100% offline, synchronous, zero API key.
 */
export function checkGrammar(text: string): GrammarIssue[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const masked = maskCodeAndUrls(text);
  const issues: GrammarIssue[] = [];
  const seenRanges = new Set<string>();

  // PHASE 1: Grammar, Syntax, and Style Rules
  for (const rule of GRAMMAR_RULES) {
    rule.pattern.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = rule.pattern.exec(masked)) !== null) {
      const index = match.index;
      const matchedText = match[0];
      const length = matchedText.length;

      // Extract original matched text from real document
      const originalSnippet = text.slice(index, index + length);

      // Generate replacement
      const replacementResult = rule.replace(
        originalSnippet,
        ...(match.slice(1) as string[])
      );

      // If replacement equals matched text (e.g. valid exception), skip
      const replacementStr = Array.isArray(replacementResult) ? replacementResult[0] : replacementResult;
      if (replacementStr.toLowerCase() === originalSnippet.toLowerCase() && replacementStr === originalSnippet) {
        continue;
      }

      const replacements = Array.isArray(replacementResult) ? replacementResult : [replacementResult];

      // Avoid overlapping duplicates
      const rangeKey = `${index}-${index + length}`;
      if (seenRanges.has(rangeKey)) {
        continue;
      }
      seenRanges.add(rangeKey);

      const { line, column } = getLineAndCol(text, index);

      issues.push({
        id: `${rule.id}-${index}`,
        message: rule.message,
        category: rule.category,
        index,
        length,
        line,
        column,
        matchedText: originalSnippet,
        replacements,
      });

      if (rule.pattern.lastIndex === index) {
        rule.pattern.lastIndex++;
      }
    }
  }

  // PHASE 2: Comprehensive Dictionary Spelling Scan
  // Tokenize words across the document and match against common spelling mistakes
  const wordRegex = /\b([a-zA-Z]{3,})\b/g;
  let wordMatch: RegExpExecArray | null;

  while ((wordMatch = wordRegex.exec(masked)) !== null) {
    const rawWord = wordMatch[1];
    const lowerWord = rawWord.toLowerCase();
    const index = wordMatch.index;
    const length = rawWord.length;

    const rangeKey = `${index}-${index + length}`;
    if (seenRanges.has(rangeKey)) {
      continue;
    }

    if (SPELLING_DICTIONARY[lowerWord]) {
      const suggested = SPELLING_DICTIONARY[lowerWord];
      // Preserve first character casing
      const finalSuggested = rawWord[0] === rawWord[0].toUpperCase() && rawWord[0] !== rawWord[0].toLowerCase()
        ? suggested.charAt(0).toUpperCase() + suggested.slice(1)
        : suggested;

      seenRanges.add(rangeKey);
      const { line, column } = getLineAndCol(text, index);

      issues.push({
        id: `spelling-${index}`,
        message: `"${rawWord}" is likely misspelled. Did you mean "${finalSuggested}"?`,
        category: 'spelling',
        index,
        length,
        line,
        column,
        matchedText: text.slice(index, index + length),
        replacements: [finalSuggested],
      });
    }
  }

  // Sort issues by appearance in document
  return issues.sort((a, b) => a.index - b.index);
}
