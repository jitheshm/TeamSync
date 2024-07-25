import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { PieValueType } from '@mui/x-charts/models';

interface PieChartsProps {
    data: PieValueType[];
}

function PieCharts({ data }: PieChartsProps) {
    return (
        <PieChart
            series={[
                {
                    data,
                },
            ]}
           
            height={200}
            className='text-white mx-auto '
            
            slotProps={{
                legend: {

                    labelStyle: {
                        fill: 'white',
                        
                    },
                },
            }}
        />
    );
}

export default PieCharts;
