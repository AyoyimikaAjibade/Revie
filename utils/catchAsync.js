/**
 * @file This file is responsible for handling asyn operations and generally
 * catching all error in the try catch block
 * @author Ayoyimika <ajibadeayoyimika@gmail.com> <16/03/2021 08:32pm>
 * @since 1.0.0
 *  Last Modified: Ayoyimikka <ajibadeayoyimika@gmail.com> <02/01/2021 06:59am>
 */

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
