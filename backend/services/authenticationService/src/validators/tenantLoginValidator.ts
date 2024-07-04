import { Schema } from 'express-validator';

export default (): Schema => {
    return {
        email: {
            isEmail: {
                errorMessage: 'Invalid Email',
            },
            normalizeEmail: true,
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
        tenantId: {
            trim: true,
            notEmpty: {
                errorMessage: 'Tenant ID cannot be empty',
            },

        },

    }
}
