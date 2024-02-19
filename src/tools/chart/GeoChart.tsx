import { useEffect, useRef, useState }
    from "react";

import {
    Chart as ChartJS, CategoryScale,
    Tooltip,
    Title,
    Legend
}
    from 'chart.js/auto';

import { topojson, ChoroplethController, ProjectionScale, ColorScale, GeoFeature, BubbleMapController, SizeScale }
    from 'chartjs-chart-geo';

import zoomPlugin
    from 'chartjs-plugin-zoom';

import idn
    from '../../data/idn.topo.json';

import provinces
    from '../../data/province.json';


interface IGeo {
    geometry: any
    id: any
    properties: {
        name: string | null
    },
    type: string
}

type TGeoDatasetData = {
    feature: any[],
    value: number
}

type TGeoDataset = {

    outline: IGeo[]
    label: string
    backgroundColor: string
    data: TGeoDatasetData[]

}



const options: any = {
    legend: {
        display: false // Hide the color scale legend
    },
    plugins: {
        legend: false,
        tooltip: {
            callbacks: {
                title: function (context: any) {
                    return context[0]?.raw.feature.properties.name;
                },
                label: function (context: any) {
                    let label = context.dataset.label || '';
                    if (label) label += ': ';
                    if (context.formattedValue !== null) label += context.formattedValue;
                    return label;
                },
                labelColor: function (ctx: any) {

                    let dindx = ctx.datasetIndex;
                    return {
                        borderColor: '#fff',
                        backgroundColor: ctx.chart.data.datasets[dindx]._color,
                        borderWidth: 2,
                        borderRadius: 2,
                    };
                },
                labelTextColor: function (ctx: any) {
                    return ctx.chart.data.datasets[ctx.datasetIndex]._color;
                }
            }
        },
    },
    scales: {
        projection: {
            axis: 'x',
            projection: 'mercator' // mercator // Adjust the projection as necessary
        },
        color: {
            axis: 'x',
            quantize: 5,
            legend: {
                display: false,
                position: 'bottom-right',
                align: 'right',
            },
        },
    },
}




const changeBackgroundColorPlugin = {
    // Define the plugin's ID
    id: 'changeBackgroundColorPlugin',

    // Implement the beforeDatasetsDraw hook
    beforeDatasetsDraw: function (chart: any, args: any, options: any) {


    }
};





interface IGeoChart {
    states: IGeo[],
    datasets: TGeoDataset[]
}
const GeoChart = (arg: IGeoChart) => {


    let canvasRef = useRef(null);


    useEffect(() => {

        if (!canvasRef.current) return;

        const chart = new ChartJS((canvasRef.current as any).getContext('2d'), {
            type: 'choropleth',
            data: {
                labels: arg.states.map((d: IGeo) => d.properties.name),
                datasets: arg.datasets,
            },

            options: options
        });


        return () => chart.destroy();
    });



    return (
        <div className="w-full">
            <canvas ref={canvasRef} />
        </div>
    )
}

export {
    GeoChart
};
export type {
    TGeoDataset,
    TGeoDatasetData,
    IGeoChart,
    IGeo
};
