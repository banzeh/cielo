import test from 'tape';
import {
  CieloConstructor,
  Cielo,
  EletronicTransferCreateRequestModel,
} from '../src';

const cieloParams: CieloConstructor = {
  merchantId: 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

function error(err: Object) {
  console.log('Ocorreu o seguinte erro', err);
}

test(`Pagamento via Transferência Eletrônica`, async (t) => {
  const transferenciaEletronicaParams: EletronicTransferCreateRequestModel = {
    merchantOrderId: '2017051109',
    customer: {
      name: 'Nome do Comprador',
      identity: '12345678909',
      identityType: 'CPF',
      email: 'comprador@cielo.com.br',
      address: {
        street: 'Alameda Xingu',
        number: '512',
        complement: '27 andar',
        zipCode: '12345987',
        city: 'São Paulo',
        state: 'SP',
        country: 'BRA',
        district: 'Alphaville',
      },
    },
    payment: {
      provider: 'Bradesco',
      type: 'EletronicTransfer',
      amount: 10000,
      returnUrl: 'http://www.cielo.com.br',
    },
  };
  const transferenciaEletronica = await cielo.eletronicTransfer.create(transferenciaEletronicaParams);
  if (!transferenciaEletronica) {
    t.end('Erro ao gerar a transferência Eletrônica');
    return;
  }

  t.assert(transferenciaEletronica.payment.amount === transferenciaEletronicaParams.payment.amount, 'Valor da transferencia eletronica');
  t.assert(transferenciaEletronica.payment.url !== '', 'Link de pagamento válido'); // @todo adicionar regex para validar URL

  t.end();
});
