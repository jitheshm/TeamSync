import { Schema } from 'express-validator';

export default (): Schema => {
    return {
        email: {
            isEmail: {
                errorMessage: 'Invalid Email'
            }
        }
        
    }
}
