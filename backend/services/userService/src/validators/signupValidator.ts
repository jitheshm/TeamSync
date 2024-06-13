import { Schema} from 'express-validator';

export default (): Schema => {
    return {
        first_name: {
            trim: true,
            isEmpty: {
                errorMessage: 'First Name cannot be empty',
                negated: true
            },
            custom: {
                options: (value: string) => {
                    if (!/^[^\s]{3}/.test(value)) {
                        throw new Error('First Name should not contain spaces between the first three letters');
                    }
                    if (!/^[A-Za-z]+$/.test(value)) {
                        throw new Error('First Name should contain only alphabets');
                    }
                    return true;
                }
            }
        },
        last_name: {
            trim: true,
            isEmpty: {
                errorMessage: 'Last Name cannot be empty',
                negated: true
            },
            isLength: {
                errorMessage: 'Last Name should be at least 1 character long',
                options: { min: 1 }
            },
            custom: {
                options: (value: string) => {
                    if (!/^[A-Za-z]+$/.test(value)) {
                        throw new Error('Last Name should contain only alphabets');
                    }
                    return true;
                }
            }
        },
        email: {
            isEmail: {
                errorMessage: 'Invalid Email'
            }
        },
        password: {
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
    };
};
