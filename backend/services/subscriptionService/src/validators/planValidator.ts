import { Schema } from 'express-validator';

export default (): Schema => {
    return {
        description: {
            trim: true,
            notEmpty: {
                errorMessage: 'Description cannot be empty'
            },
            isString: {
                errorMessage: 'Description must be a string'
            },
            isLength: {
                options: { min: 10 },
                errorMessage: 'Description must be at least 10 characters long'
            }
        },
        bill_cycle: {
            trim: true,
            notEmpty: {
                errorMessage: 'Bill Cycle cannot be empty'
            },
            isIn: {
                options: [['monthly', 'yearly']],
                errorMessage: 'Bill Cycle must be either "monthly" or "yearly"'
            }
        },
        'features.branches': {
            notEmpty: {
                errorMessage: 'Branches cannot be empty'
            },
            isInt: {
                errorMessage: 'Branches must be an integer'
            },
            toInt: true
        },
        'features.meetings': {
            notEmpty: {
                errorMessage: 'Meetings cannot be empty'
            },
            isInt: {
                errorMessage: 'Meetings must be an integer'
            },
            toInt: true
        },
        'features.support': {
            notEmpty: {
                errorMessage: 'Support cannot be empty'
            },
            isIn: {
                options: [['basic', 'expert']],
                errorMessage: 'Support must be either "basic" or "expert"'
            }
        },
        price: {
            trim: true,
            notEmpty: {
                errorMessage: 'Price cannot be empty'
            },
            isString: {
                errorMessage: 'Price must be a string'
            },
            matches: {
                options: /^[0-9]+$/,
                errorMessage: 'Price must contain only digits'
            }
        },
        name: {
            trim: true,
            notEmpty: {
                errorMessage: 'Name cannot be empty'
            },
            isString: {
                errorMessage: 'Name must be a string'
            },
            isLength: {
                options: { min: 3 },
                errorMessage: 'Name must be at least 3 characters long'
            }
        },
        currency: {
            trim: true,
            notEmpty: {
                errorMessage: 'Currency cannot be empty'
            },
            isIn: {
                options: [['indian', 'dollar']],
                errorMessage: 'Currency must be either "indian" or "dollar"'
            }
        }
    };
};
