import { Schema } from 'express-validator';

export default (): Schema => {
    return {
        location: {
            in: ['body'],
            isString: {
                errorMessage: 'Location must be a string',
            },
            isLength: {
                options: { min: 3 },
                errorMessage: 'Location must be at least 3 characters long',
            },
            matches: {
                options: /^[A-Za-z]+$/,
                errorMessage: 'Location must contain only letters',
            },
        },
        
    };
};
