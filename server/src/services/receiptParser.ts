
export interface ParsedReceipt {
  storeName: string;
  purchaseDate: Date;
  totalAmount: number;
  items: { name: string; quantity?: number; price?: number }[];
}

function cleanText(text: string): string {
  return text.replace(/[^\x20-\x7E]/g, '').trim();
}

function parseDate(text: string): Date | null {
  const datePatterns = [
    // MM/DD/YYYY
    /(\d{2})\/(\d{2})\/(\d{4})/,
    // DD/MM/YYYY
    /(\d{2})\/(\d{2})\/(\d{4})/,
    // YYYY-MM-DD
    /(\d{4})-(\d{2})-(\d{2})/,
    // MM-DD-YYYY
    /(\d{2})-(\d{2})-(\d{4})/
  ];

  const timePattern = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        // Handle both US and international formats
        const [_, first, second, third] = match;
        let year, month, day;
        
        if (third.length === 4) { // If third group is year
          year = parseInt(third);
          month = parseInt(first);
          day = parseInt(second);
        } else { // If first group is year
          year = parseInt(first);
          month = parseInt(second);
          day = parseInt(third);
        }
        
        // Find time if exists
        const timeMatch = text.match(timePattern);
        if (timeMatch) {
          const [_, hours, minutes, ampm] = timeMatch;
          let hour = parseInt(hours);
          if (ampm && ampm.toUpperCase() === 'PM' && hour < 12) {
            hour += 12;
          }
          return new Date(year, month - 1, day, hour, parseInt(minutes));
        }
        
        return new Date(year, month - 1, day);
      } catch (e) {
        continue;
      }
    }
  }
  return null;
}

function extractStoreName(lines: string[]): string {
  // Usually the store name is in the first few lines, in caps
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = cleanText(lines[i]);
    if (line && !/^(tel|fax|date|time|\d)/i.test(line)) {
      return line;
    }
  }
  return 'Unknown Store';
}

function extractTotal(text: string): number {
  const patterns = [
    /total\s*:?\s*\$?\s*(\d+\.\d{2})/i,
    /total\s*amount\s*:?\s*\$?\s*(\d+\.\d{2})/i,
    /grand\s*total\s*:?\s*\$?\s*(\d+\.\d{2})/i,
    /balance\s*:?\s*\$?\s*(\d+\.\d{2})/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseFloat(match[1]);
    }
  }

  // Fallback: look for last price in the receipt
  const priceMatches = text.match(/\$?\d+\.\d{2}/g);
  if (priceMatches) {
    return parseFloat(priceMatches[priceMatches.length - 1].replace('$', ''));
  }

  return 0;
}

function parseItems(lines: string[]): { name: string; quantity?: number; price?: number }[] {
  const items: { name: string; quantity?: number; price?: number }[] = [];
  const itemPatterns = [
    // Quantity x Item $Price
    /^(\d+)\s*[xX]\s*(.+?)\s*\$?(\d+\.\d{2})/,
    // Item $Price
    /^(.+?)\s*\$(\d+\.\d{2})/,
    // Quantity Item $Price
    /^(\d+)\s+(.+?)\s+\$?(\d+\.\d{2})/
  ];

  for (const line of lines) {
    const cleanLine = cleanText(line);
    
    // Skip likely non-item lines
    if (!/\d/.test(cleanLine) || 
        /total|subtotal|tax|tip|balance|date|time|tel|fax/i.test(cleanLine)) {
      continue;
    }

    for (const pattern of itemPatterns) {
      const match = cleanLine.match(pattern);
      if (match) {
        const [_, qtyOrName, nameOrPrice, priceOrNothing] = match;
        
        // Handle different patterns
        if (priceOrNothing) {
          // First pattern (Quantity x Item $Price) or third pattern (Quantity Item $Price)
          items.push({
            name: nameOrPrice.trim(),
            quantity: parseInt(qtyOrName),
            price: parseFloat(priceOrNothing)
          });
        } else {
          // Second pattern (Item $Price)
          items.push({
            name: qtyOrName.trim(),
            price: parseFloat(nameOrPrice)
          });
        }
        break;
      }
    }
  }

  return items;
}

export function parseReceiptText(rawText: string): ParsedReceipt {
  const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean);
  
  const storeName = extractStoreName(lines);
  
  // Find date in the first 10 lines
  let purchaseDate = new Date();
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const possibleDate = parseDate(lines[i]);
    if (possibleDate) {
      purchaseDate = possibleDate;
      break;
    }
  }

  const totalAmount = extractTotal(rawText);
  const items = parseItems(lines);

  return {
    storeName,
    purchaseDate,
    totalAmount,
    items
  };
}
