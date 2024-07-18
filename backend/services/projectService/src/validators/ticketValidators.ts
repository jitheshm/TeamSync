import { Schema } from 'express-validator';
import mongoose from 'mongoose';

export default (): Schema => {
    return {
        title: {
            trim: true,
            notEmpty: {
                errorMessage: 'Name cannot be empty',
            },
            isLength: {
                errorMessage: 'Name must be at least 3 characters long',
                options: { min: 3 },
            },
            isString: {
                errorMessage: 'Name must be a string',
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


    };
};
