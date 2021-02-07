# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.4.3](https://github.com/banzeh/cielo/compare/v2.4.2...v2.4.3) (2021-02-07)

### [2.4.2](https://github.com/banzeh/cielo/compare/v2.4.1...v2.4.2) (2021-01-25)

### [2.4.1](https://github.com/banzeh/cielo/compare/v2.4.0...v2.4.1) (2020-11-15)


### Erros Corrigidos

* (Antifraude) Ajustes para retornar ([33af404](https://github.com/banzeh/cielo/commit/33af404c03d13129840743f780243a6b58df90f9))

## [2.4.0](https://github.com/banzeh/cielo/compare/v2.3.4...v2.4.0) (2020-10-12)


### Funcionalidades

* **antifraude:** transação ([7b6b567](https://github.com/banzeh/cielo/commit/7b6b567b8991b7e2520f1d97191c93132d554c74))


### Erros Corrigidos

* **customer-model:** remove phone duplicate ([23c634b](https://github.com/banzeh/cielo/commit/23c634b0017e42ed43ccb09805ecc5350c4f11bd))
* **yarn:** remove yarn.lock ([2b137c9](https://github.com/banzeh/cielo/commit/2b137c9ac4ea574e918731aed2caa40c79cd1ff0))

### [2.3.4](https://github.com/banzeh/cielo/compare/v2.3.3...v2.3.4) (2020-09-13)


### Erros Corrigidos

* CI ([8c16a6b](https://github.com/banzeh/cielo/commit/8c16a6bc2cec0c6d6174b9757565fe8c057f472f))

### [2.3.3](https://github.com/banzeh/cielo/compare/v2.3.2...v2.3.3) (2020-09-13)

### [2.3.2](https://github.com/banzeh/cielo/compare/v2.3.1...v2.3.2) (2020-09-13)


### Erros Corrigidos

* **enums.ts:** correção de enum DISCOVER ([7d8ce81](https://github.com/banzeh/cielo/commit/7d8ce81ab5c3e927da15006d1ac1edca7878507b)), closes [#85](https://github.com/banzeh/cielo/issues/85)

### [2.3.1](https://github.com/banzeh/cielo/compare/v2.3.0...v2.3.1) (2020-07-05)


### Erros Corrigidos

* adicionado campos nas models ([d5c18c7](https://github.com/banzeh/cielo/commit/d5c18c757e74a34a19b3faeded2f6c1240b780d1)), closes [#77](https://github.com/banzeh/cielo/issues/77)

### [2.3.0](https://github.com/banzeh/cielo/compare/v2.2.6...v2.3.0)

### ⚠ BREAKING CHANGES

* **src/models/payment.request.model.ts:** Propriedade *returnUrl* estava definida como *ReturnUrl*. Foi atualizada para
seguir o padrão camelcase.

### Erros Corrigidos

* **src/models/payment.request.model.ts:** correçào de model ([eaf223f](https://github.com/banzeh/cielo/commit/eaf223f77984f43b0ee69a28a1bbc7784af27303))
* **src\class\utils.ts:** correção no retorno de erro da recorrência ([a4485c9](https://github.com/banzeh/cielo/commit/a4485c94b9d7e3be4b33deabc93add19af7fa794)), closes [#73](https://github.com/banzeh/cielo/issues/73)

### [2.2.6](https://github.com/banzeh/cielo/compare/v2.2.4...v2.2.6) (2020-05-26)


### Errors Corrigidos

* **package.json:** corrige erro de módulo ([768b084](https://github.com/banzeh/cielo/commit/768b084295c50186b5f74533071427909acdea01))

### [2.2.5](https://github.com/banzeh/cielo/compare/v2.2.4...v2.2.5) (2020-05-23)

### [2.2.4](https://github.com/banzeh/cielo/compare/v2.2.3...v2.2.4) (2020-05-14)

### [2.2.3](https://github.com/banzeh/cielo/compare/v2.2.2...v2.2.3) (2020-05-03)

### [2.2.2](https://github.com/banzeh/cielo/compare/v2.2.1...v2.2.2) (2020-05-03)


### Errors Corrigidos

* ajustes para publicação do pacote ([38f569e](https://github.com/banzeh/cielo/commit/38f569e35a58f2c236ed82ae09f45c4cd677b05a))

### [2.2.1](https://github.com/banzeh/cielo/compare/v2.2.0...v2.2.1) (2020-05-03)


### Errors Corrigidos

* corrige erro no build ([2388845](https://github.com/banzeh/cielo/commit/23888457ae93c037f04165dd27b16b5a7b9ffab8))

## [2.2.0](https://github.com/banzeh/cielo/compare/v2.1.1...v2.2.0) (2020-05-03)


### Funcionalidades

* adiciona apção de criar uma transação com cartão de débito ([dc67a2a](https://github.com/banzeh/cielo/commit/dc67a2ad91e46477a3322ba982fa169e21c06f25))
* adicionado consulta de card token ([2737624](https://github.com/banzeh/cielo/commit/273762456ddbc3173568a012a55342dd464f29d3))
* adicionado opção de transferência eletrônica ([32035f2](https://github.com/banzeh/cielo/commit/32035f25801bfc8774efaa69d1504891b55d8b53))


### Errors Corrigidos

* correção de testes ([2ba1700](https://github.com/banzeh/cielo/commit/2ba17004e66379718f9f42955a16e328c4d282fe))
* **src\models\card\tokenize.request.model.ts:** correção de tipagem ([6d83f3e](https://github.com/banzeh/cielo/commit/6d83f3e150c0152c567ff7a63e5cb6ed3b3501ca))

### [2.1.1](https://github.com/banzeh/cielo/compare/v2.1.0...v2.1.1) (2020-05-02)


### Errors Corrigidos

* fix merge ([eef4007](https://github.com/banzeh/cielo/commit/eef400771e5f628db3927298e873bfad83b35e25))

## [2.1.0](https://github.com/banzeh/cielo/compare/v2.0.4...v2.1.0) (2020-05-02)


### Funcionalidades

* adicionado criação e modificação de recorrência ([fd49464](https://github.com/banzeh/cielo/commit/fd49464723a09a54b39c4bdf79749eddf58db830))
* implementação das atualizações de recorrência ([2e5c1a4](https://github.com/banzeh/cielo/commit/2e5c1a476c7dfba33179a0816706d5cb687d6a34))


### Errors Corrigidos

* correção de build ([5854e4d](https://github.com/banzeh/cielo/commit/5854e4d7c1c926b79fbfaf60a92bbb33fcc1fe6b))
* correção de import no test ([94c1016](https://github.com/banzeh/cielo/commit/94c101643429cbc08d5fb9662a24c9ac29a821f3))

### [2.0.4](https://github.com/banzeh/cielo/compare/v2.0.3...v2.0.4) (2020-05-02)

### [2.0.3](https://github.com/banzeh/cielo/compare/v2.0.2...v2.0.3) (2020-04-30)

### [2.0.2](https://github.com/banzeh/cielo/compare/v2.0.0...v2.0.2) (2020-04-30)


### Errors Corrigidos

* correção de CI ([bab90c5](https://github.com/banzeh/cielo/commit/bab90c526bd7c95bad0b66253c3bd7d25dbe2712))
* **src\class\utils.ts:** validação de JSON na response ([5273814](https://github.com/banzeh/cielo/commit/527381446423498b75bd7841da397b895eececb6))
* fix merge ([e70f4ec](https://github.com/banzeh/cielo/commit/e70f4ec7959ba4bfc6bee05a9a4d71d351f07783))

### [1.1.2](https://github.com/banzeh/cielo/compare/v1.1.1...v1.1.2) (2019-11-24)

## [2.0.0](https://github.com/banzeh/cielo/compare/v1.1.1...v2.0.0) (2020-04-30)


### ⚠ BREAKING CHANGES

* Mudança do módulo para utilização de Typescript

### Features

* automatização de CHANGELOG.md ([34d8755](https://github.com/banzeh/cielo/commit/34d8755507c86f639116f66510a1df39394c1078))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
