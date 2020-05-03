import test from "tape";
import { CieloConstructor, Cielo, BankSlipCreateRequestModel } from "../src";

const cieloParams: CieloConstructor = {
  merchantId: "dbe5e423-ed15-4c27-843a-fedf325ea67c",
  merchantKey: "NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD",
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

function error(err: Object) {
  console.log('Ocorreu o seguinte erro', err)
}

test(`Pagamento via boleto`, async (t) => {
  const boletoParams: BankSlipCreateRequestModel = {
    merchantOrderId: '20180531',
    customer: {
      name: 'Comprádor Boleto Cíéló Áá',
      identity: '1234567890',
      address: {
        street: 'Avenida Marechal Câmara',
        number: '160',
        complement: 'Sala 934',
        zipCode: '22750012',
        district: 'Centro',
        city: 'Rio de Janeiro',
        state: 'RJ',
        country: 'BRA'
      }
    },
    payment: {
      type: 'Boleto',
      amount: 15700,
      provider: 'Bradesco2',
      address: 'Rua Teste',
      boletoNumber: '123',
      assignor: 'Empresa Teste',
      demonstrative: 'Desmonstrative Teste',
      expirationDate: '5/1/2020',
      identification: '11884926754',
      instructions: 'Aceitar somente até a data de vencimento, após essa data juros de 1% dia.'
    }
  }
  const boleto = await cielo.bankSlip.create(boletoParams).catch(error);

  if (!boleto) {
    t.end('Erro ao gerar o boleto');
    return;
  }

  t.assert(boleto.customer.name === 'Comprador Boleto Cielo Aa', 'Normalização do nome do cliente no boleto')
  t.assert(typeof boleto.payment !== 'undefined', 'Boleto retornou Payment')
  t.assert(boleto.payment.url.trim() !== '', 'Retornou Url para o boleto')

  t.end()

});