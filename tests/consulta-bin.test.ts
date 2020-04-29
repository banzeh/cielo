import { ConsultBinRequestModel } from './../src/models/consults/consult-bin.request.model';
import { CieloConstructor, Cielo } from './../src/cielo';
import test from "tape";

const cieloParams: CieloConstructor = {
  merchantId: "dbe5e423-ed15-4c27-843a-fedf325ea67c",
  merchantKey: "NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD",
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

function error(err: Object) {
  console.log('Ocorreu o seguinte erro', err)
}

test(`Consulta BIN`, async (t) => {
  const consultaBinNacionalParams: ConsultBinRequestModel = {
    cardBin: '453211'
  };
  const consultaBinNacional = await cielo.consult.bin(consultaBinNacionalParams).catch(error);
  if (consultaBinNacional) {
    t.assert(consultaBinNacional.foreignCard === true, 'Consulta bin OK');
  }
  
  t.end();
});