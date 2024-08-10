import { Schema } from 'express-validator';

export default (): Schema => {
    return {
        name: {
            trim: true,
            notEmpty: {
                errorMessage: 'Name cannot be empty',
            },
            isLength: {
                errorMessage: 'Name must be at least 3 characters long',
                options: { min: 3 },
            },
            custom: {
                options: (value: string) => {
                    if (!/^[A-Za-z]{3,}(\s[A-Za-z]+)*$/.test(value)) {
                        throw new Error('Name should start with at least three letters and can include spaces thereafter');
                    }
                    return true;
                },
            },
        },
        email: {
            isEmail: {
                errorMessage: 'Invalid Email',
            },
            normalizeEmail: true,
        },
        phone_no: {
            trim: true,
            notEmpty: {
                errorMessage: 'Phone number cannot be empty',
            },
            isLength: {
                errorMessage: 'Phone number should be 10 digits long',
                options: { min: 10, max: 10 },
            },
            isNumeric: {
                errorMessage: 'Phone number should contain only digits',
            },
            custom: {
                options: (value: string) => {
                    if (/(\d)\1{9}/.test(value)) {
                        throw new Error('Phone number should not contain continuous same digits');
                    }
                    return true;
                },
            },
        },
        role: {
            trim: true,
            notEmpty: {
                errorMessage: 'Role cannot be empty',
            },
            isString: {
                errorMessage: 'Role must be a string',
            },
            isIn: {
                options: [['Manager', 'Project_Manager', 'Developer', 'Tester']],
                errorMessage: 'Invalid role',
            },
        },
    };
};
