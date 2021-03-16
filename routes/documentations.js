/**
 * @file Handles the request made fro retrieveal of the API documentation
 * @author Ayoyimika <ajibadeayoyimika@gmail.com> <03/16/2021 08:32pm>
 * @since 0.1.0
 *  Last Modified: Ayoyimika <ajibadeayoyimika@gmail.com> <03/16/2021 08:32pm>
 */

const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../');

/**
 * API documentation using swaggerUI
 * @see {@link https://swagger.io/docs/specification/about/}
 */

module.exports = () => {
  /**
   *  ATTENTION:
   *  please place unprotected routes first as there is a fall-through when the jwt protection is
   *  placed on any route
   */
  router.get('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return router;
};
