import IPlan from "../entities/PlanEntity";
import { Schema } from "mongoose";

const planSchema: Schema<IPlan> = new Schema<IPlan>({
    plan_id: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    description: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 10
    },
    bill_cycle: { 
        type: String, 
        required: true,
        enum: ['monthly', 'yearly'],
        trim: true 
    },
    features: {
       branches: { 
           type: Number, 
           required: true 
       },
       meetings: { 
           type: Number, 
           required: true 
       },
       support: { 
           type: String, 
           required: true, 
           enum: [ 'basic', 'expert' ],
           lowercase: true
       },
    },
    created_at: { 
        type: Date, 
        required: true,
        default: Date.now 
    },
    price: { 
        type: String, 
        required: true,
        trim: true,
        match: /^[0-9]+$/
    },
    name: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        minlength: 3
    },
    active: { 
        type: Boolean, 
        required: true, 
        default: true
    },
    currency: { 
        type: String, 
        required: true,
        enum: ['indian', 'dollar'],
        trim: true
    },
    is_deleted: { 
        type: Boolean, 
        required: true, 
        default: false
    },
});

export default planSchema;
