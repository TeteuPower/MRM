
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'YOUR_ACCESS_TOKEN' });

const preference = new Preference(client);

preference.create({
  body: {
    payment_methods: {
  excluded_payment_methods: [],
  excluded_payment_types: [],
  installments: 12
},
    items: [
      {
        title: 'My product',
        quantity: 1,
        unit_price: 2000
      }
    ],
  }
})
.then(console.log)
.catch(console.log);