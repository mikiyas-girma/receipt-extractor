export interface ParsedReceipt {
  storeName: string;
  purchaseDate: Date;
  totalAmount: number;
  items: { name: string; quantity?: number; price?: number }[];
}

interface ProcessedLine {
  original: string;
  cleaned: string;
  confidence: number;
  type: 'header' | 'item' | 'total' | 'metadata' | 'noise';
}

class ReceiptTextProcessor {
  private static readonly NOISE_PATTERNS = [
    /^[^a-zA-Z0-9]*$/, // Only special characters
    /^.{1,2}$/, // Very short lines
    /^[=\-_\s]+$/, // Separator lines
    /^\s*[®©™]\s*$/, // Copyright symbols alone
    /^[|\\\/\[\](){}]+$/, // Only brackets/separators
  ];

  private static readonly STORE_INDICATORS = [
    'restaurant', 'hotel', 'market', 'shop', 'store', 'cafe', 'bar',
    'supermarket', 'plc', 'ltd', 'inc', 'corp', 'company', 'business'
  ];

  private static readonly TOTAL_KEYWORDS = [
    'total', 'grand total', 'balance', 'amount due', 'subtotal',
    'net total', 'final total', 'sum', 'due'
  ];

  private static readonly ITEM_SKIP_KEYWORDS = [
    'tel', 'phone', 'fax', 'email', 'address', 'tin', 'vat',
    'receipt', 'invoice', 'order', 'date', 'time', 'cashier',
    'operator', 'waiter', 'thank', 'visit', 'again', 'welcome'
  ];

  static preprocessText(rawText: string): ProcessedLine[] {
    const lines = rawText.split(/\r?\n/);
    const processed: ProcessedLine[] = [];

    for (let i = 0; i < lines.length; i++) {
      const original = lines[i];
      const cleaned = this.cleanLine(original);

      if (this.isNoiseLine(cleaned)) {
        continue;
      }

      const type = this.classifyLine(cleaned, i, lines.length);
      const confidence = this.calculateConfidence(cleaned, type);

      processed.push({
        original,
        cleaned,
        confidence,
        type
      });
    }

    return processed.filter(line => line.confidence > 0.3);
  }

  private static cleanLine(line: string): string {
    return line
      // Remove non-printable characters except common punctuation
      .replace(/[^\x20-\x7E]/g, '')
      .replace(/[|\\\/]/g, '1')
      .replace(/[{}]/g, '')
      .replace(/\[|\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static isNoiseLine(line: string): boolean {
    return this.NOISE_PATTERNS.some(pattern => pattern.test(line));
  }

  private static classifyLine(line: string, index: number, totalLines: number): ProcessedLine['type'] {
    const lowerLine = line.toLowerCase();

    // Header detection (first 30% of lines)
    if (index < totalLines * 0.3) {
      if (this.STORE_INDICATORS.some(indicator => lowerLine.includes(indicator))) {
        return 'header';
      }
      if (line.length > 5 && /^[A-Z\s]+$/.test(line)) {
        return 'header';
      }
    }

    // Total detection
    if (this.TOTAL_KEYWORDS.some(keyword => lowerLine.includes(keyword)) &&
      /\d+\.?\d*/.test(line)) {
      return 'total';
    }

    // Metadata detection
    if (/\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}:\d{2}|tel|phone|tin|vat/i.test(line)) {
      return 'metadata';
    }

    // Item detection
    if (/\d+\.?\d*/.test(line) &&
      !this.ITEM_SKIP_KEYWORDS.some(keyword => lowerLine.includes(keyword))) {
      return 'item';
    }

    return 'noise';
  }

  private static calculateConfidence(line: string, type: ProcessedLine['type']): number {
    let confidence = 0.5;

    // Length bonus
    if (line.length >= 5 && line.length <= 50) confidence += 0.2;

    // Type-specific bonuses
    switch (type) {
      case 'header':
        if (/^[A-Z\s]+$/.test(line)) confidence += 0.3;
        if (this.STORE_INDICATORS.some(ind => line.toLowerCase().includes(ind))) confidence += 0.2;
        break;
      case 'total':
        if (/total/i.test(line) && /\d+\.\d{2}/.test(line)) confidence += 0.4;
        break;
      case 'item':
        if (/^\d+\s*[xX]\s*/.test(line)) confidence += 0.3;
        if (/\d+\.\d{2}/.test(line)) confidence += 0.2;
        break;
      case 'metadata':
        if (/\d{2}\/\d{2}\/\d{4}/.test(line)) confidence += 0.3;
        break;
    }

    return Math.min(confidence, 1.0);
  }
}

class EnhancedReceiptParser {
  static parseStoreName(lines: ProcessedLine[]): string {
    const headerLines = lines
      .filter(line => line.type === 'header')
      .sort((a, b) => b.confidence - a.confidence);

    if (headerLines.length > 0) {
      const storeLine = headerLines[0].cleaned;
      // Clean up common OCR artifacts in store names
      return storeLine
        .replace(/^[^a-zA-Z]+/, '')
        .replace(/[^a-zA-Z0-9\s&'-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim() || 'Unknown Store';
    }

    // Fallback: look for the longest meaningful line in the first few entries
    const candidates = lines.slice(0, 5)
      .filter(line => line.cleaned.length > 3)
      .sort((a, b) => b.cleaned.length - a.cleaned.length);

    return candidates.length > 0 ? candidates[0].cleaned : 'Unknown Store';
  }

  static parseDate(lines: ProcessedLine[]): Date {
    const datePatterns = [
      { pattern: /(\d{1,2})\/(\d{1,2})\/(\d{4})/, format: 'DMY' },
      { pattern: /(\d{4})-(\d{1,2})-(\d{1,2})/, format: 'YMD' },
      { pattern: /(\d{1,2})-(\d{1,2})-(\d{4})/, format: 'DMY' },
    ];

    const timePattern = /(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i;

    for (const line of lines) {
      for (const { pattern, format } of datePatterns) {
        const match = line.cleaned.match(pattern);
        if (match) {
          try {
            let year: number, month: number, day: number;

            if (format === 'YMD') {
              [, year, month, day] = match.map(Number);
            } else { // DMY or MDY
              [, day, month, year] = match.map(Number);
              // Swap if it looks like US format (month > 12)
              if (day > 12 && month <= 12) {
                [day, month] = [month, day];
              }
            }

            // Find time in the same line or nearby lines
            let hour = 0, minute = 0;
            const timeMatch = line.cleaned.match(timePattern);
            if (timeMatch) {
              hour = parseInt(timeMatch[1]);
              minute = parseInt(timeMatch[2]);
              if (timeMatch[3]?.toUpperCase() === 'PM' && hour < 12) {
                hour += 12;
              }
            }

            return new Date(year, month - 1, day, hour, minute);
          } catch (e) {
            continue;
          }
        }
      }
    }

    return new Date();
  }

  static parseTotal(lines: ProcessedLine[]): number {
    // First try to find the final total after tax
    const finalTotalKeywords = [
      'amount incl',
      'amount including',
      'total incl',
      'grand total',
      'final amount',
      'amount payable',
      'total payable',
      'total due',
      'amount due',
      'net amount'
    ];

    // Look for final total first
    for (const line of lines) {
      const lowerLine = line.cleaned.toLowerCase();
      if (finalTotalKeywords.some(keyword => lowerLine.includes(keyword))) {
        const amountMatches = line.cleaned.match(/(\d+(?:\.\d{2})?)/g);
        if (amountMatches) {
          const amounts = amountMatches.map(match => parseFloat(match)).filter(num => !isNaN(num));
          if (amounts.length > 0) {
            return Math.max(...amounts);
          }
        }
      }
    }

    // If no final total found, look for the last total-like line
    const totalLines = lines.filter(line => {
      const lowerLine = line.cleaned.toLowerCase();
      return line.type === 'total' && 
             !lowerLine.includes('sub') && // Exclude subtotal
             !lowerLine.includes('tax') && // Exclude tax lines
             !lowerLine.includes('gst') && // Exclude GST lines
             !lowerLine.includes('vat');   // Exclude VAT lines
    });

    // Sort by position in receipt (later lines more likely to be final total)
    totalLines.sort((a, b) => lines.indexOf(b) - lines.indexOf(a));

    for (const line of totalLines) {
      const amountMatches = line.cleaned.match(/(\d+(?:\.\d{2})?)/g);
      if (amountMatches) {
        const amounts = amountMatches.map(match => parseFloat(match))
          .filter(num => !isNaN(num))
          // Filter out unreasonably small amounts (like tax rates)
          .filter(num => num > 1);
        
        if (amounts.length > 0) {
          return Math.max(...amounts);
        }
      }
    }

    // Fallback: look for the largest reasonable amount in the entire receipt
    // but exclude amounts that look like tax rates (< 1)
    const allAmounts: number[] = [];
    for (const line of lines) {
      const matches = line.cleaned.match(/\d+(?:\.\d{2})?/g);
      if (matches) {
        matches.forEach(match => {
          const amount = parseFloat(match);
          if (amount > 1 && amount < 50000) { // Reasonable range for receipt totals
            allAmounts.push(amount);
          }
        });
      }
    }

    return allAmounts.length > 0 ? Math.max(...allAmounts) : 0;
  }

  static parseItems(lines: ProcessedLine[]): { name: string; quantity?: number; price?: number }[] {
    const itemLines = lines.filter(line => line.type === 'item');
    const items: { name: string; quantity?: number; price?: number }[] = [];

    const itemPatterns = [
      // Enhanced patterns for messy OCR
      { pattern: /^(\d+)\s*[xX×]\s*(.+?)\s+(\d+(?:\.\d{2})?)/, type: 'qty_name_price' },
      { pattern: /^(.+?)\s+(\d+)\s*[xX×]\s*(\d+(?:\.\d{2})?)/, type: 'name_qty_price' },
      { pattern: /^(.+?)\s+(\d+(?:\.\d{2})?)$/, type: 'name_price' },
      { pattern: /^(\d+)\s+(.+?)\s+(\d+(?:\.\d{2})?)/, type: 'qty_name_price' },
    ];

    for (const line of itemLines) {
      if (line.confidence < 0.4) continue;

      for (const { pattern, type } of itemPatterns) {
        const match = line.cleaned.match(pattern);
        if (match) {
          let name = '', quantity: number | undefined, price: number | undefined;

          switch (type) {
            case 'qty_name_price':
              quantity = parseInt(match[1]);
              name = match[2].trim();
              price = parseFloat(match[3]);
              break;
            case 'name_qty_price':
              name = match[1].trim();
              quantity = parseInt(match[2]);
              price = parseFloat(match[3]);
              break;
            case 'name_price':
              name = match[1].trim();
              price = parseFloat(match[2]);
              break;
          }

          // Clean up item name
          name = name
            .replace(/^\d+\s*/, '')
            .replace(/[^a-zA-Z0-9\s\-&']/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          if (name.length >= 3 && name.length <= 50 && price && price > 0) {
            items.push({ name, quantity, price });
            break;
          }
        }
      }
    }

    return items;
  }
}

export function parseReceiptText(rawText: string): ParsedReceipt {
  console.log('Starting receipt parsing...');

  // Preprocess the raw OCR text
  const processedLines = ReceiptTextProcessor.preprocessText(rawText);
  
  console.log(`Processed ${processedLines.length} meaningful lines from OCR text`);
  
  // Parse each component
  const storeName = EnhancedReceiptParser.parseStoreName(processedLines);
  const purchaseDate = EnhancedReceiptParser.parseDate(processedLines);
  const totalAmount = EnhancedReceiptParser.parseTotal(processedLines);
  const items = EnhancedReceiptParser.parseItems(processedLines);

  console.log('Parsing results:', {
    storeName,
    totalAmount,
    itemCount: items.length
  });

  return {
    storeName,
    purchaseDate,
    totalAmount,
    items
  };
}
