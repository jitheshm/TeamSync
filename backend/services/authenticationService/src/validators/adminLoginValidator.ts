import { Schema } from 'express-validator';

export default (): Schema => {
    return {
        user_name: {
            trim: true,
            isEmpty: {
                errorMessage: 'User Name cannot be empty',
                negated: true
            },
            isLength: {
                errorMessage: 'User Name should be at least 4 character long',
                options: { min: 4 }
            },
        },
        password: {
            trim: true,
            isEmpty: {
                errorMessage: 'Password cannot be empty',
                negated: true
            },
            isLength: {
                errorMessage: 'Password should be at least 5 characters long',
                options: { min: 5 }
            }
        }
    }
}
