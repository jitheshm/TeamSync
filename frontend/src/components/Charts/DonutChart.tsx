import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface DonutChartProps {
    values: number[];
    labels: string[];
}

const DonutChart: React.FC<DonutChartProps> = ({ values, labels }) => {
    const [series, setSeries] = useState<number[]>(values);
    const [options, setOptions] = useState<ApexOptions>({
        chart: {
            type: 'donut',
        },
        labels: labels,
        legend: {
            position: 'bottom',
            labels: {
                colors: '#fff'  
            }
        },
        dataLabels: {
            style: {
                colors: ['#fff']  
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        value: {
                            color: '#fff' 
                        },
                        name: {
                            color: '#fff'  
                        }
                    }
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200,
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    });

    useEffect(() => {
        setSeries(values);
        setOptions(prevOptions => ({
            ...prevOptions,
            labels: labels,
        }));
    }, [values, labels]);

    return (
        <div className='md:w-6/12 mx-auto'>
            <ReactApexChart options={options} series={series} type="donut" height={400} />
        </div>
    );
};

export default DonutChart;
