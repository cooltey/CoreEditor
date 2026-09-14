import { GrammarIssue } from '../types';

interface Rule {
  id: string;
  category: 'grammar' | 'spelling' | 'style' | 'punctuation' | 'redundancy';
  message: string;
  pattern: RegExp;
  replace: (match: string, ...groups: string[]) => string | string[];
}

const RULES: Rule[] = [
  // 1. Repeated words (e.g. "the the", "is is")
  {
    id: 'duplicate-word',
    category: 'grammar',
    message: 'Duplicate word detected. Consider removing one.',
    pattern: /\b([a-zA-Z]{2,})\s+\1\b/gi,
    replace: (_match, word) => word,
  },

  // 2. Pronoun "I" capitalization
  {
    id: 'capitalize-i',
    category: 'grammar',
    message: 'The personal pronoun "I" should always be capitalized.',
    pattern: /(^|[\s(])(i)([\s),.?!:;]|$)/g,
    replace: (_match, p1, _i, p3) => `${p1}I${p3}`,
  },

  // 3. Modal verbs with "of" instead of "have" (e.g. "could of")
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
    pattern: /\b(better|worse|more|less|faster|slower|bigger|smaller|higher|lower|older|younger|easier|harder|rather)\s+then\b/gi,
    replace: (_match, comp) => `${comp} than`,
  },

  // 5. "its" vs "it's"
  {
    id: 'its-contraction',
    category: 'grammar',
    message: 'Did you mean the contraction "it\'s" (short for "it is" or "it has")?',
    pattern: /\b(its)\s+(a|an|the|my|your|his|her|our|their|going|not|too|very|always|already|obviously|clearly|supposed|better|easier|harder)\b/gi,
    replace: (_match, _its, next) => `it's ${next}`,
  },
  {
    id: 'its-possessive',
    category: 'grammar',
    message: 'Did you mean the possessive "its" (belonging to it)?',
    pattern: /\b(it's)\s+(name|color|size|shape|surface|price|purpose|features|components|elements|status|value|content|speed|length|width|height)\b/gi,
    replace: (_match, _its, next) => `its ${next}`,
  },

  // 6. "their" vs "there" vs "they're"
  {
    id: 'their-there',
    category: 'grammar',
    message: 'Did you mean "there"?',
    pattern: /\btheir\s+(is|are|was|were|will|has|have|had|could|should|would)\b/gi,
    replace: (_match, verb) => `there ${verb}`,
  },
  {
    id: 'there-their',
    category: 'grammar',
    message: 'Did you mean the possessive "their"?',
    pattern: /\bthere\s+(car|house|dog|cat|computer|phone|money|family|parents|friends|children|team|work|idea|book|file|files|code|app)\b/gi,
    replace: (_match, noun) => `their ${noun}`,
  },
  {
    id: 'there-theyre',
    category: 'grammar',
    message: 'Did you mean "they\'re" (they are)?',
    pattern: /\bthere\s+(going|supposed|trying|planning|working|building)\b/gi,
    replace: (_match, gerund) => `they're ${gerund}`,
  },

  // 7. "your" vs "you're"
  {
    id: 'your-youre',
    category: 'grammar',
    message: 'Did you mean "you\'re" (contraction of "you are")?',
    pattern: /\byour\s+(welcome|right|wrong|late|early|amazing|correct|the\s+best|going|looking)\b/gi,
    replace: (_match, next) => `you're ${next}`,
  },
  {
    id: 'youre-your',
    category: 'grammar',
    message: 'Did you mean the possessive "your"?',
    pattern: /\byou're\s+(car|house|dog|cat|computer|phone|money|family|name|email|account|password|file|folder|document|settings)\b/gi,
    replace: (_match, noun) => `your ${noun}`,
  },

  // 8. "a" vs "an" article check
  {
    id: 'article-a-an',
    category: 'grammar',
    message: 'Use "an" before words starting with a vowel sound.',
    // Exclude special cases like "unique", "user", "university", "european", "one"
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
    // Exclude special cases like "hour", "honor", "honest", "heir"
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

  // 9. Common spelling & typo fixes
  {
    id: 'spelling-alot',
    category: 'spelling',
    message: '"alot" is misspelled. Did you mean "a lot"?',
    pattern: /\balot\b/gi,
    replace: () => 'a lot',
  },
  {
    id: 'spelling-noone',
    category: 'spelling',
    message: '"noone" is misspelled. Did you mean "no one"?',
    pattern: /\bnoone\b/gi,
    replace: () => 'no one',
  },
  {
    id: 'spelling-seperate',
    category: 'spelling',
    message: '"seperate" is misspelled. Did you mean "separate"?',
    pattern: /\bseperate\b/gi,
    replace: () => 'separate',
  },
  {
    id: 'spelling-definitely',
    category: 'spelling',
    message: 'Did you mean "definitely"?',
    pattern: /\b(definately|definitly|definetly)\b/gi,
    replace: () => 'definitely',
  },
  {
    id: 'spelling-receive',
    category: 'spelling',
    message: '"recieve" is misspelled. Did you mean "receive"? (Rule: i before e except after c)',
    pattern: /\brecieve\b/gi,
    replace: () => 'receive',
  },
  {
    id: 'spelling-occurred',
    category: 'spelling',
    message: 'Did you mean "occurred"?',
    pattern: /\b(occured|occurances|occurance)\b/gi,
    replace: () => 'occurred',
  },
  {
    id: 'spelling-until',
    category: 'spelling',
    message: '"untill" is misspelled. Did you mean "until"?',
    pattern: /\buntill\b/gi,
    replace: () => 'until',
  },
  {
    id: 'spelling-truly',
    category: 'spelling',
    message: '"truely" is misspelled. Did you mean "truly"?',
    pattern: /\btruely\b/gi,
    replace: () => 'truly',
  },
  {
    id: 'spelling-lose-loose',
    category: 'spelling',
    message: 'Did you mean "lose" (not loose)?',
    pattern: /\bloose\s+(weight|money|time|my|your|his|her|their|our|the\s+game|hope)\b/gi,
    replace: (_match, next) => `lose ${next}`,
  },
  {
    id: 'spelling-take-effect',
    category: 'grammar',
    message: 'Did you mean "take effect"?',
    pattern: /\btake\s+affect\b/gi,
    replace: () => 'take effect',
  },

  // 10. Wordy / Style Enhancements
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
    message: 'Consider using "use" instead of "utilize" for clearer writing.',
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

  // 11. Punctuation spacing (e.g. space before comma, missing space after punctuation)
  {
    id: 'space-before-punctuation',
    category: 'punctuation',
    message: 'Unexpected space before punctuation mark.',
    pattern: /([a-zA-Z0-9])\s+([,.:;?!])/g,
    replace: (_match, char, punc) => `${char}${punc}`,
  },
];

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

  for (const rule of RULES) {
    // Reset regex state
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

      // Avoid regex infinite loop for zero-length matches
      if (rule.pattern.lastIndex === index) {
        rule.pattern.lastIndex++;
      }
    }
  }

  // Sort issues by appearance in document
  return issues.sort((a, b) => a.index - b.index);
}
