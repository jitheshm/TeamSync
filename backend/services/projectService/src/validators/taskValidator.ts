import { Schema } from 'express-validator';
import mongoose from 'mongoose';

export default (): Schema => {
    return {
        title: {
            trim: true,
            notEmpty: {
                errorMessage: 'Title cannot be empty',
            },
            isLength: {
                errorMessage: 'Title must be at least 3 characters long',
                options: { min: 3 },
            },
            isString: {
                errorMessage: 'Title must be a string',
            },
        },
        description: {
            trim: true,
            notEmpty: {
                errorMessage: 'Description cannot be empty',
            },
            isLength: {
                errorMessage: 'Description must be at least 10 characters long',
                options: { min: 10 },
            },
            isString: {
                errorMessage: 'Description must be a string',
            },
        },
        developer_id: {
            notEmpty: {
                errorMessage: 'Developers ID cannot be empty',
            },

        },

        tester_id: {
            notEmpty: {
                errorMessage: 'Tester ID cannot be empty',
            },

        },


        due_date: {
            notEmpty: {
                errorMessage: 'Start Date cannot be empty',
            },
            isISO8601: {
                errorMessage: 'Start Date must be a valid date',
            },
        },

    };
};
