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
                let networkError = error
                if (error.response === undefined && error.toString().includes('Error: Network Error')) {     // For network failed
                    networkError['response'] = { data: null }
                    next({ ...rest, error, type: 'NETWORK_FAILED' });
                }
                return next({ ...rest, error: networkError, type: REJECTED })
            });
    };
}