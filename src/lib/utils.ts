export function formatCurrency(amount: number, currencySymbol: string = '₦'): string {
  if (isNaN(amount)) return `${currencySymbol}0`;
  return `${currencySymbol}${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatWhatsAppMessage(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    const placeholder = new RegExp(`{${key}}`, 'g');
    result = result.replace(placeholder, String(value ?? ''));
  }
  return result;
}

export const PRIMARY_WHATSAPP_NUMBER = '+234 903 466 5968';
export const PRIMARY_WHATSAPP_CLEAN = '2349034665968';

export const DEFAULT_WHATSAPP_NUMBER = PRIMARY_WHATSAPP_NUMBER;
export const DEFAULT_WHATSAPP_CLEAN = PRIMARY_WHATSAPP_CLEAN;

export function cleanPhoneNumber(phone?: string): string {
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return PRIMARY_WHATSAPP_CLEAN;
  }
  const cleaned = phone.replace(/[^0-9+]/g, '').replace(/^0/, '234').replace(/^\+/, '');
  // Ignore old placeholder dummy numbers
  if (
    cleaned.includes('8123456789') ||
    cleaned.includes('812345') ||
    cleaned.length < 7
  ) {
    return PRIMARY_WHATSAPP_CLEAN;
  }
  return cleaned || PRIMARY_WHATSAPP_CLEAN;
}

/**
 * Generates a WhatsApp URL directing to the store's configured or primary WhatsApp number.
 * Defaults cleanly to https://wa.me/2349034665968.
 */
export function getWhatsAppUrl(phoneOrText?: string, text?: string): string {
  let targetNumber = PRIMARY_WHATSAPP_CLEAN;
  let message = '';

  if (phoneOrText && text !== undefined) {
    // Called as getWhatsAppUrl(phone, text)
    targetNumber = cleanPhoneNumber(phoneOrText);
    message = text || '';
  } else if (phoneOrText && text === undefined) {
    // Called with 1 argument: could be phone OR message
    if (phoneOrText.startsWith('+') || /^\d[\d\s-]{6,}$/.test(phoneOrText.trim())) {
      targetNumber = cleanPhoneNumber(phoneOrText);
    } else {
      targetNumber = PRIMARY_WHATSAPP_CLEAN;
      message = phoneOrText;
    }
  }

  if (!message || !message.trim()) {
    return `https://wa.me/${targetNumber}`;
  }
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * Generates a WhatsApp URL directing to a specific customer phone number (used in admin replies).
 */
export function getCustomerWhatsAppUrl(customerPhone: string, text?: string): string {
  const clean = customerPhone ? customerPhone.replace(/[^0-9+]/g, '').replace(/^0/, '234').replace(/^\+/, '') : PRIMARY_WHATSAPP_CLEAN;
  const target = clean && clean.length >= 7 ? clean : PRIMARY_WHATSAPP_CLEAN;
  if (!text || !text.trim()) {
    return `https://wa.me/${target}`;
  }
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${target}?text=${encoded}`;
}

export function generateOrderNumber(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `ORD-${dateStr}-${rand}`;
}

export function calculateDiscountPercent(regular: number, discount?: number): number {
  if (!discount || discount >= regular) return 0;
  return Math.round(((regular - discount) / regular) * 100);
}

export function formatOrderWhatsAppMessage(order: any, companySettings: any): string {
  const itemsText = order.items
    .map((it: any) => `• ${it.quantity}x ${it.name} - ${formatCurrency(it.price * it.quantity, companySettings.currency_symbol)}`)
    .join('\n');

  return `*NEW ORDER NOTIFICATION - ${order.order_number}*

👤 *Customer Details:*
• Name: ${order.customer.full_name}
• Phone: ${order.customer.phone}
• Email: ${order.customer.email || 'N/A'}

📍 *Delivery Location:*
• Address: ${order.delivery_location.address}
• City/Area: ${order.delivery_location.city}, ${order.delivery_location.state}
${order.notes ? `• Notes: ${order.notes}\n` : ''}
🛒 *Ordered Items:*
${itemsText}

💰 *Payment Breakdown:*
• Subtotal: ${formatCurrency(order.subtotal, companySettings.currency_symbol)}
• Delivery Fee: ${formatCurrency(order.delivery_fee, companySettings.currency_symbol)}
• *Total Payable: ${formatCurrency(order.total_amount, companySettings.currency_symbol)}*
• Payment Method: ${String(order.payment_method).replace(/_/g, ' ').toUpperCase()}

Please confirm receipt and dispatch scheduling. Thank you!`;
}

