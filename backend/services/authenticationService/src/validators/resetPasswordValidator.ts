import { Schema } from 'express-validator';

export default (): Schema => {
    return {
        new_password: {
            trim: true,
            isEmpty: {
                errorMessage: 'Password cannot be empty',
                negated: true
            },
            isLength: {
                errorMessage: 'Password should be at least 6 characters long',
                options: { min: 6 }
            }
        } 
    }
}
