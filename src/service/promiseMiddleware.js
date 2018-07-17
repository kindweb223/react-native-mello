/**
 * Promise middleware
 *
 * @return promise
 */

export default function promiseMiddleware(){
  return (next) => (action) => {
      const { promise, types, ...rest } = action;
      if (!promise) {
          return next(action);
      }
      
      const [PENDING, FULFILLED, REJECTED] = types;
      next({ ...rest, type: PENDING });

      return promise
          .then((result) => {
              return next({ ...rest, result, type: FULFILLED })})
          
          .catch((error) => {
              return next({ ...rest, error, type: REJECTED })});
  };
}