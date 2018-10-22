var controller = {}
var debug = false

module.exports = (params) => {
  debug = params.debug || false

  return controller
}

/**
* Caso o flag debug for true, retorna o log no console
*/
controller.log = function () {
  if (debug) {
    console.log('------------ DEBUG ------------\n', new Date(), '\n\n', arguments, '\n\n------------ END DEBUG ------------\n')
  }
}