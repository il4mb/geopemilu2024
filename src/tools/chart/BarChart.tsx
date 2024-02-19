import { Chart as ChartJS } from "chart.js";
import Annotation from "chartjs-plugin-annotation";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useRef, useState } from "react";
import img01 from "../../data/img/01.jpg";
import img02 from "../../data/img/02.jpg";
import img03 from "../../data/img/03.jpg";

// ChartJS.register();
ChartJS.register(Annotation);


interface IBar {
    labels: string[],
    datasets: any[],
}


function indexToMin(index: any) {
    return index - 0.36;
}

function indexToMax(index: any) {
    return index + 0.36;
}

function middleValue(ctx: any, index: any, perc: any) {

    const chart = ctx.chart;
    if (!chart.data.datasets[0]) return 0;
    const dataset = chart.data.datasets[0];
    return dataset.data[index] * perc;
}

function isMobileDevice() {
    return window.screen.width < 768;
}



const createAnnotation = (index: number) => {

    const paslonNames = [
        [
            "H. ANIES RASYID BASWEDAN, Ph.D",
            "Dr. (H.C.) H. A. MUHAIMIN ISKANDAR"
        ],
        [
            "H. PRABOWO SUBIANTO",
            "GIBRAN RAKABUMING RAKA"
        ],
        [
            "H. GANJAR PRANOWO, S.H., M.I.P",
            "Prof. Dr. H. M. MAHFUD MD"
        ]
    ]

    return [
        {
            // Dot annotation
            type: 'point',
            xValue: (ctx: any) => (indexToMax(index) + indexToMin(index)) / 2, // Assuming this averages to the correct x position
            yValue: (ctx: any) => middleValue(ctx, index, 0.5),
            radius: 10,
        },
        {
            type: 'label',
            drawTime: 'afterDraw',
            content: (ctx: any) => {
                if (ctx.chart.data.datasets[0]) {
                    let nilai = ctx.chart.data.datasets[0].data[index];
                    return [...paslonNames[index], `Suara : ${Intl.NumberFormat('de-DE').format(nilai)}`]
                }
                return "";
            },
            width: 100,
            height: 1000,
            xValue: (ctx: any) => (indexToMax(index) + indexToMin(index)) / 2,
            yValue: (ctx: any) => middleValue(ctx, index, 0.5),
            xAdjust: (ctx: any) => {
                return -150;
            },
            yAdjust: -(100 * ((index + 1) / 2)),
            borderWidth: 1,
            borderDash: [6, 6],
            callout: {
                display: true,
                position: (ctx: any) => {
                    return 'right';
                },
            }
        }
    ];
};


const BarChart = (arg: IBar) => {

    let canvasRef = useRef(null);


    useEffect(() => {

        if (!canvasRef.current) return;

        const chart = new ChartJS((canvasRef.current as any).getContext('2d'), {
            type: 'bar',
            data: {
                labels: arg.labels,
                datasets: arg.datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: (() => {
                    let w = window.screen.width;
                    if (w < 768) return 1.5;
                    return 1.5;
                })(),
                layout: {
                    padding: {
                        top: (() => {
                            let w = window.screen.width;
                            if (w < 768) return 25;
                            if (w < 1024) return 50;
                            if(w < 1280) return 75;
                            return 100;
                        })(),

                        bottom: (() => {
                            let w = window.screen.width;
                            if (w < 768) return 25;
                            if (w < 1024) return 50;
                            if(w < 1280) return 75;
                            return 100;
                        })(),
                        right: (() => {
                            let w = window.screen.width;
                            if (w < 768) return 50;
                            if (w < 1024) return 100;
                            if(w < 1280) return 200;
                            return 300;
                        })(),
                        left: (() => {
                            let w = window.screen.width;
                            if (w < 768) return 50;
                            if (w < 1024) return 100;
                            if(w < 1280) return 200;
                            return 300;
                        })(),
                    }
                },
                plugins: {
                    annotation: {
                        clip: false,
                        annotations: [...(createAnnotation(0) as any), ...(createAnnotation(1) as any), ...(createAnnotation(2) as any)]
                    },
                    legend: {
                        display: false
                    },
                    datalabels: {
                        color: '#000',
                        font: {
                            weight: 'bold',
                            size: 16
                        },
                        anchor: 'end',
                        formatter: function (value, context: any) {

                            return new Intl.NumberFormat('de-DE').format(value);
                        }
                    },
                    tooltip: {
                        enabled: false
                    },
                },
                scales: {

                    x: {
                        grid: {
                            display: false,

                        },
                        border: {
                            display: false
                        },


                    },
                    y: {
                        grid: {
                            display: false,

                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            display: false
                        }
                    },
                    r: {

                    }

                },
                datasets: {
                    bar: {
                        barPercentage: 0.9
                    }
                }
            },
            plugins: [ChartDataLabels, Annotation]
        });


        return () => {
            chart.destroy();
        };
    })



    return (<div className="w-full max-w-[1200px] mx-auto"><canvas height={600} width={600} className="w-full h-full" ref={canvasRef} /></div>)
}


export {
    BarChart
}