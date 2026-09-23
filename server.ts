import http from 'http';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { ALL_PRODUCTS } from './src/lib/catalog/index.js';
import { INITIAL_DELIVERY_LOCATIONS } from './src/lib/constants.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// 1. Config endpoint
app.get('/api/payment/config', (req, res) => {
  const publicKey = process.env.PAYSTACK_PUBLIC_KEY || process.env.VITE_PAYSTACK_PUBLIC_KEY || '';
  const hasSecret = Boolean(process.env.PAYSTACK_SECRET_KEY && process.env.PAYSTACK_SECRET_KEY.trim() !== '');

  res.json({
    paystackPublicKey: publicKey,
    isPaystackConfigured: hasSecret,
    currency: 'NGN',
  });
});

// 2. Paystack Transaction Initialization (Secure Server-Side Calculation)
app.post('/api/payment/paystack/initialize', async (req, res) => {
  try {
    const {
      customer,
      delivery_location_id,
      address,
      instructions,
      items,
      discount_code,
    } = req.body;

    if (!customer?.full_name || !customer?.phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required order details (customer name, phone, address, and cart items).',
      });
    }

    // 1. Server-side validation of cart items against authoritative catalog
    let serverSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = ALL_PRODUCTS.find((p) => p.id === item.product_id);
      if (!product) {
        return res.status(400).json({
          success: false,
          error: `Product with ID ${item.product_id} not found in catalog.`,
        });
      }

      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const unitPrice =
        product.discount_price && product.discount_price > 0
          ? product.discount_price
          : product.regular_price;

      serverSubtotal += unitPrice * quantity;
      validatedItems.push({
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        quantity,
        price: unitPrice,
        regular_price: product.regular_price,
        image: product.images[0] || '',
        age_group: product.age_group,
      });
    }

    // 2. Server-side delivery fee calculation
    const matchedLoc = INITIAL_DELIVERY_LOCATIONS.find((l) => l.id === delivery_location_id);
    const serverDeliveryFee = matchedLoc ? matchedLoc.fee : 2500;

    // 3. Discount calculation
    let serverDiscount = 0;
    if (discount_code) {
      const normalizedCode = String(discount_code).trim().toUpperCase();
      if (['WELCOME10', 'GOLDMOM', 'BABYLOVE'].includes(normalizedCode)) {
        serverDiscount = Math.round(serverSubtotal * 0.1);
      }
    }

    const serverGrandTotal = Math.max(0, serverSubtotal + serverDeliveryFee - serverDiscount);
    const amountInKobo = Math.round(serverGrandTotal * 100);

    const orderNumber = `SB-${Math.floor(100000 + Math.random() * 900000)}`;
    const reference = `SB-PAY-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();

    // If Paystack Secret Key is configured, make the live Paystack API call
    if (secretKey) {
      const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customer.email || 'customer@sunshinebabies.com',
          amount: amountInKobo,
          reference: reference,
          currency: 'NGN',
          callback_url: `${req.protocol}://${req.get('host')}/checkout`,
          metadata: {
            order_number: orderNumber,
            customer_name: customer.full_name,
            customer_phone: customer.phone,
            customer_email: customer.email,
            delivery_address: address,
            delivery_city: matchedLoc?.city_area || 'Standard',
            delivery_state: matchedLoc?.state || 'Nigeria',
            subtotal: serverSubtotal,
            delivery_fee: serverDeliveryFee,
            discount_amount: serverDiscount,
            total_amount: serverGrandTotal,
            items_count: validatedItems.reduce((acc, it) => acc + it.quantity, 0),
            custom_fields: [
              { display_name: 'Customer Name', variable_name: 'customer_name', value: customer.full_name },
              { display_name: 'Phone Number', variable_name: 'phone', value: customer.phone },
              { display_name: 'Order Number', variable_name: 'order_number', value: orderNumber },
            ],
          },
        }),
      });

      const paystackData = await paystackRes.json();

      if (!paystackRes.ok || !paystackData.status) {
        console.error('Paystack initialization error:', paystackData);
        return res.status(400).json({
          success: false,
          error: paystackData.message || 'Could not initialize Paystack transaction.',
        });
      }

      return res.json({
        success: true,
        reference: paystackData.data.reference || reference,
        order_number: orderNumber,
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        amount_kobo: amountInKobo,
        total_amount: serverGrandTotal,
        subtotal: serverSubtotal,
        delivery_fee: serverDeliveryFee,
        discount_amount: serverDiscount,
        validated_items: validatedItems,
        paystack_public_key: process.env.PAYSTACK_PUBLIC_KEY || '',
        is_live: true,
      });
    }

    // If Paystack secret key is not provided yet, provide structured test sandbox mode
    return res.json({
      success: true,
      reference,
      order_number: orderNumber,
      amount_kobo: amountInKobo,
      total_amount: serverGrandTotal,
      subtotal: serverSubtotal,
      delivery_fee: serverDeliveryFee,
      discount_amount: serverDiscount,
      validated_items: validatedItems,
      paystack_public_key: process.env.PAYSTACK_PUBLIC_KEY || '',
      is_live: false,
      test_mode: true,
      message: 'Paystack running in secure test simulation mode. Set PAYSTACK_SECRET_KEY to enable live gateway communication.',
    });
  } catch (error: any) {
    console.error('Error in /api/payment/paystack/initialize:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while initializing payment.',
    });
  }
});

// 3. Paystack Transaction Verification
app.post('/api/payment/paystack/verify', async (req, res) => {
  try {
    const { reference, expected_amount, order_number } = req.body;

    if (!reference) {
      return res.status(400).json({
        verified: false,
        error: 'Transaction reference is required for payment verification.',
      });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();

    if (secretKey) {
      const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.status) {
        console.error('Paystack verification error response:', verifyData);
        return res.status(400).json({
          verified: false,
          payment_status: 'failed',
          error: verifyData.message || 'Failed to verify transaction with Paystack.',
        });
      }

      const tx = verifyData.data;

      if (tx.status === 'success') {
        const expectedKobo = expected_amount ? Math.round(Number(expected_amount) * 100) : 0;
        // Verify currency and amount
        if (tx.currency !== 'NGN') {
          return res.status(400).json({
            verified: false,
            payment_status: 'failed',
            error: `Invalid transaction currency: ${tx.currency}`,
          });
        }

        if (expectedKobo > 0 && tx.amount < expectedKobo) {
          return res.status(400).json({
            verified: false,
            payment_status: 'failed',
            error: `Paid amount (₦${tx.amount / 100}) does not match order amount (₦${expected_amount})`,
          });
        }

        return res.json({
          verified: true,
          payment_status: 'paid',
          reference: tx.reference,
          channel: tx.channel || 'card',
          paid_at: tx.paid_at || new Date().toISOString(),
          amount_paid: tx.amount / 100,
          customer_email: tx.customer?.email,
          gateway_response: tx.gateway_response,
          message: 'Payment verified successfully by Paystack gateway.',
        });
      } else {
        return res.status(200).json({
          verified: false,
          payment_status: 'failed',
          gateway_response: tx.gateway_response || 'Transaction not completed',
          message: `Payment status is ${tx.status}`,
        });
      }
    }

    // In test/simulation mode when secret key is not set
    return res.json({
      verified: true,
      payment_status: 'paid',
      reference: reference,
      channel: 'paystack_test_mode',
      paid_at: new Date().toISOString(),
      amount_paid: expected_amount || 0,
      test_mode: true,
      message: 'Payment verified successfully in test sandbox mode.',
    });
  } catch (error: any) {
    console.error('Error in /api/payment/paystack/verify:', error);
    res.status(500).json({
      verified: false,
      error: error.message || 'Internal server error while verifying payment.',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunshine Babies Essentials Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

