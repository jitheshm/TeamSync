import { Schema } from 'express-validator';

export default (): Schema => {
    return {
        email: {
            isEmail: {
                errorMessage: 'Invalid Email'
            }
        },
        context: {
            isString: {
                errorMessage: 'Context should be a string'
            }
        },
    }
}
