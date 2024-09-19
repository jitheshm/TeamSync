import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface BarchartProps {
    dataValues: number[];
    dataNames: string[];
}

const colors = ['#FF4560', '#00E396', '#008FFB', '#775DD0', '#FEB019', '#FF66C3', '#D3A1F5', '#1E90FF'];

const Barchart: React.FC<BarchartProps> = ({ dataValues, dataNames }) => {
    const [series, setSeries] = useState([{ data: dataValues }]);
    const [options, setOptions] = useState<ApexOptions>({
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        colors: colors,
        plotOptions: {
            bar: {
                columnWidth: '45%',
                distributed: true,
            }
        },
        legend: {
            show: false
        },
        xaxis: {
            categories: dataNames,
            labels: {
                style: {
                    colors: colors,
                    fontSize: '12px'
                }
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: 'white',
                    fontSize: '12px'
                }
            }
        },
        grid: {
            show: false
        }
    });

    useEffect(() => {
        setSeries([{ data: dataValues }]);
        setOptions(prevOptions => ({
            ...prevOptions,
            xaxis: {
                categories: dataNames,
                labels: {
                    style: {
                        colors: colors,
                        fontSize: '12px'
                    }
                },
            },
        }));
    }, [dataValues, dataNames]);

    return (
        <div>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="bar" height={350} width={350}/>
            </div>
        </div>
    );
};

export default Barchart;
