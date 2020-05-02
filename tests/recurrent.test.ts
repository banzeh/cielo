import { EnumRecurrentPaymentInterval, EnumRecurrentPaymentUpdateInterval } from './../src/enums';
import test from 'tape';
import {
  CieloConstructor,
  Cielo,
  RecurrentCreateModel,
  RecurrentModifyIntervalModel,
  RecurrentModifyCustomerModel,
  RecurrentModifyAmountModel,
  RecurrentModifyNextPaymentDateModel,
  RecurrentModifyModel,
  ConsultTransactionRecurrentPaymentIdRequestModel,
} from '../src';
import { EnumCardType, EnumBrands } from '../src/enums';

const cieloParams: CieloConstructor = {
  merchantId: "dbe5e423-ed15-4c27-843a-fedf325ea67c",
  merchantKey: "NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD",
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

function error(err: Object) {
  console.log('Ocorreu o seguinte erro', err)
}

test(`Recorrencia`, async (t) => {

  const createRecurrencyParams: RecurrentCreateModel = {
    merchantOrderId: '2014113245231706',
    customer: {
      name: 'Comprador rec programada'
    },
    payment: {
      type: EnumCardType.CREDIT,
      amount: 1500,
      installments: 1,
      softDescriptor: '123456789ABCD',
      currency: 'BRL',
      country: 'BRA',
      recurrentPayment: {
        authorizeNow: true,
        endDate: '2022-12-01',
        interval: EnumRecurrentPaymentInterval.SEMIANNUAL
      },
      creditCard: {
        cardNumber: '4024007197692931',
        holder: 'Teste Holder',
        expirationDate: '12/2030',
        securityCode: '262',
        saveCard: false,
        brand: 'Visa' as EnumBrands
      }
    }
  }

  const firstRecurrency = await cielo.recurrent.create(createRecurrencyParams).catch(error);
  if (!firstRecurrency) {
    t.end('Erro na criação da recorrência');
    return;
  }
  t.assert(firstRecurrency.payment.recurrentPayment.reasonCode === 0, 'Pagamento recorrente criado')
  t.assert(firstRecurrency.payment.status === 1, 'Status transacional autorizado (1)')
  t.assert(firstRecurrency.payment.recurrentPayment.interval === 6, 'Intervalo de recorrência correto (6)')

  const modifyRecurrencyParams: RecurrentModifyIntervalModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
    interval: EnumRecurrentPaymentUpdateInterval.MONTHLY
  }
  const modifyRecurrency = await cielo.recurrent.modifyInterval(modifyRecurrencyParams).catch(error)
  if (modifyRecurrency) {
    t.assert(modifyRecurrency.statusCode === 200, 'StatusCode da modificação da recorrência para mensal correto (200)')
  }

  const updateCustomer: RecurrentModifyCustomerModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
    customer: {
      name: 'Customer',
      email: 'customer@teste.com',
      birthdate: '1999-12-12',
      identity: '22658954236',
      identityType: 'CPF',
      address: {
        street: 'Rua Teste',
        number: '174',
        complement: 'AP 201',
        zipCode: '21241140',
        city: 'Rio de Janeiro',
        state: 'RJ',
        country: 'BRA'
      },
      deliveryAddress: {
        street: 'Outra Rua Teste',
        number: '123',
        complement: 'AP 111',
        zipCode: '21241111',
        city: 'Qualquer Lugar',
        state: 'QL',
        country: 'BRA',
      }
    }
  }

  const customer = await cielo.recurrent.modifyCustomer(updateCustomer).catch(error);
  if (customer) {
    t.assert(customer.statusCode === 200, 'StatusCode da modificação do Customer correto (200)')
  }

  const endDate = await cielo.recurrent.modifyEndDate({
    paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
    endDate: '2021-01-09'
  }).catch(error)
  if (endDate) {
    t.assert(endDate.statusCode === 200, 'StatusCode da modificação da recorrência terminar dia 09/01/2021 correto (200)')
  }

  const recurrencyDay = await cielo.recurrent.modifyRecurrencyDay({
    paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
    recurrencyDay: 10
  }).catch(error)
  if (recurrencyDay) {
    t.assert(recurrencyDay.statusCode === 200, 'StatusCode da modificação da recorrência para dia 10 correto (200)')
  }

  const updateAmount: RecurrentModifyAmountModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
    amount: 156 // Valor do Pedido em centavos: 156 equivale a R$ 1,56
  }
  const amount = await cielo.recurrent.modifyAmount(updateAmount).catch(error)
  if (amount) {
    t.assert(amount.statusCode === 200, 'StatusCode da modificação do valor para 156 correto (200)')
  }

  let newRecurrencyDate = new Date()
  newRecurrencyDate.setDate(newRecurrencyDate.getDate() + 7) // Altera para a próxima semana
  let nextRecurrency = `${newRecurrencyDate.getFullYear()}-${newRecurrencyDate.getMonth() + 1}-${newRecurrencyDate.getDate()}`
  const updateNextPaymentDate: RecurrentModifyNextPaymentDateModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
    nextPaymentDate: nextRecurrency
  }
  const nextPaymentDate = await cielo.recurrent.modifyNextPaymentDate(updateNextPaymentDate).catch(error)
  if (nextPaymentDate) {
    t.assert(nextPaymentDate.statusCode === 200, 'StatusCode da modificação da data do próximo pagamento para 15/06/2016 correto (200)')
  }

  const deactivateRecurrencyParams: RecurrentModifyModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId
  }
  const deactivateRecurrency = await cielo.recurrent.deactivate(deactivateRecurrencyParams).catch(error)
  if (deactivateRecurrency) {
    t.assert(deactivateRecurrency.statusCode === 200, 'StatusCode da desativação da recorrência correto (200)')
  }

  const recurrencyConsultingParams: ConsultTransactionRecurrentPaymentIdRequestModel = {
    recurrentPaymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId
  }
  const recurrencyConsulting = await cielo.consult.recurrent(recurrencyConsultingParams).catch(error)
  if (recurrencyConsulting) {
    t.assert(recurrencyConsulting.recurrentPayment.status === 3, 'Status da recorrência correto (3 - desativada pelo lojista)')
    t.assert(recurrencyConsulting.recurrentPayment.interval === 'Monthly', 'Intervalo da recorrência correto (Monthly)')
    t.assert(recurrencyConsulting.customer.email === 'customer@teste.com', 'Dados do cliente alterados com sucesso')
  }

  t.end()


});