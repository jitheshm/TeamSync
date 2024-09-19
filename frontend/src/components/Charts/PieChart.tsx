import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { PieValueType } from '@mui/x-charts/models';
import { useTheme } from 'next-themes';

interface PieChartsProps {
    data: PieValueType[];
}

function PieCharts({ data }: PieChartsProps) {

    const { theme, setTheme } = useTheme()
    const labelColor = theme === 'dark' ? 'white' : 'black'; // Set label color based on theme

    return (
        <PieChart
            series={[
                {
                    data,
                },
            ]}
            height={200}
            className="mx-auto"
            slotProps={{
                legend: {
                    labelStyle: {
                        fill: labelColor, 
                    },
                },
            }}
        />
    );
}

export default PieCharts;
