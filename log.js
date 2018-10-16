module.exports = (params) => {
  const debug = params.debug || false

  /**
  * Caso o flag debug for true, retorna o log no console
  */
  const log = function () {
    if (debug) {
      console.log('------------ DEBUG ------------\n', new Date(), '\n\n', arguments, '\n\n------------ END DEBUG ------------\n')
    }
  }

  return {
    log: log
  }
}