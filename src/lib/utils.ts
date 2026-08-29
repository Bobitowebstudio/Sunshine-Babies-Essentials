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

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9+]/g, '').replace(/^0/, '234').replace(/^\+/, '');
}

export function getWhatsAppUrl(phone: string, text: string): string {
  const clean = cleanPhoneNumber(phone);
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${clean}?text=${encoded}`;
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

