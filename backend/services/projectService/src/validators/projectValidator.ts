import { Schema } from 'express-validator';
import mongoose from 'mongoose';

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
        developers_id: {
            notEmpty: {
                errorMessage: 'Developers ID cannot be empty',
            },
            isArray: {
                errorMessage: 'Developers ID must be an array',
            },
            custom: {
                options: (value: any[]) => {
                    value.forEach((id, index, array) => {
                        if (!mongoose.Types.ObjectId.isValid(id)) {
                            array[index] = new mongoose.Types.ObjectId(id);
                        }
                    });
                    return true;
                },
            },
        },
        project_manager_id: {
            notEmpty: {
                errorMessage: 'Project Manager ID cannot be empty',
            },
            custom: {
                options: (value: string, { req }) => {
                    if (!mongoose.Types.ObjectId.isValid(value)) {
                        req.body.project_manager_id = new mongoose.Types.ObjectId(value);
                    }
                    return true;
                },
            },
        },
        end_date: {
            notEmpty: {
                errorMessage: 'End Date cannot be empty',
            },
            isISO8601: {
                errorMessage: 'End Date must be a valid date',
            },
        },
        start_date: {
            notEmpty: {
                errorMessage: 'Start Date cannot be empty',
            },
            isISO8601: {
                errorMessage: 'Start Date must be a valid date',
            },
        },
        client_name: {
            trim: true,
            notEmpty: {
                errorMessage: 'Client Name cannot be empty',
            },
            isLength: {
                errorMessage: 'Client Name must be at least 3 characters long',
                options: { min: 3 },
            },
            isString: {
                errorMessage: 'Client Name must be a string',
            },
        },
        testers_id: {
            notEmpty: {
                errorMessage: 'Tester ID cannot be empty',
            },
            isArray: {
                errorMessage: 'Developers ID must be an array',
            },
            custom: {
                options: (value: any[]) => {
                    value.forEach((id, index, array) => {
                        if (!mongoose.Types.ObjectId.isValid(id)) {
                            array[index] = new mongoose.Types.ObjectId(id);
                        }
                    });
                    return true;
                },
            },
        },

    };
};
