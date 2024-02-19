import React, { useEffect, useRef, useState } from 'react';
import {
    Chart as ChartJS, CategoryScale,
    Tooltip,
    Title,
    Legend,
    LineController,
    LineElement,
    PointElement,
    LinearScale,

} from 'chart.js/auto';

import { topojson, ChoroplethController, ProjectionScale, ColorScale, GeoFeature, BubbleMapController, SizeScale } from 'chartjs-chart-geo';
import zoomPlugin from 'chartjs-plugin-zoom';

import idn from '../data/idn.topo.json';
import provinces from '../data/province.json';
import { PaslonContainer, PaslonI } from './Paslon';
import { GeoChart, IGeo } from './chart/GeoChart';
import { BarChart } from './chart/BarChart';


ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineController, LineElement, PointElement, LinearScale,
    SizeScale,
    CategoryScale,
    BubbleMapController,
    ChoroplethController,
    ProjectionScale,
    ColorScale,
    GeoFeature,
    zoomPlugin
);

const states: IGeo[] = (topojson.feature(idn as any, idn.objects.idn as any) as any).features;


type endpoint = {
    ppwp: string,
    hhcw: string
}

interface IProvince {
    "nama": string
    "id": number
    "kode": string
    "tingkat": number
    "latitude": number
    "longitude": number
}





const MapChart = () => {

    const [paslonData, setPaslonData] = useState([]);
    const [GeoData, setGeoData] = useState([]);
    const [barData, setBarData] = useState([]);
    const [persen, setPersen] = useState(0);
    const [description, setDescription] = useState("");

    const createGeoDataset = (paslons: PaslonI[], tables: Array<any>): any[] => {

        let paslonKeys: string[] = Object.keys(paslons);
        const datasets: any[] = [];

        const maxPaslonColorsByProvince = provinces.reduce((acc: any, province: IProvince) => {
            const provinceData = tables[province.kode as any];
            if (!provinceData) return acc; // Skip if no data for the province

            let maxVal = 0;
            let maxPaslonColor = ""; // Default color or logic to handle no max value found

            // Iterate through each paslon to find the max value for the current province
            Object.keys(paslons).forEach(key => {
                const paslonValue = provinceData[key]; // Assuming the key is paslon.nomor_urut
                if (paslonValue > maxVal) {
                    maxVal = paslonValue;
                    maxPaslonColor = paslons[key as any].warna; // Update to the color of the paslon with the max value
                }
            });

            acc[province.kode as any] = maxPaslonColor; // Assign the color of the paslon with the highest value
            return acc;
        }, {});


        paslonKeys.forEach((key: string) => {

            let paslon = paslons[key as any];

            datasets.push({
                outline: states,
                label: paslon.nomor_urut < 10 ? `0${paslon.nomor_urut}` : paslon.nomor_urut,
                backgroundColor: states.map((d: IGeo) => {
                    const province = provinces.find(p => p.nama.toUpperCase() === d.properties.name?.toUpperCase());
                    return province ? maxPaslonColorsByProvince[province.kode] : "defaultColor";
                }), // Set background color
                _color: paslon.warna,
                data: states.map((d: IGeo) => {

                    const province = provinces.find(p => p.nama.toUpperCase() === d.properties.name?.toUpperCase());
                    const value = province ? tables[province.kode as any][key] : 0; // Your existing value calculation logic
                    const data = {
                        feature: d as any,
                        value: value,
                        backgroundColor: province ? maxPaslonColorsByProvince[province.kode] : "defaultColor",
                    }
                    return data;
                })
            })
        })
        return datasets;
    }


    const createBarDataset = (paslons: PaslonI[], chart: Array<any>) => {

        const paslonKeys: string[] = Object.keys(paslons);
        const dataset = {

            label: paslonKeys.map((key: string) => {
                return "0" + paslons[key as any].nomor_urut
            }),

            backgroundColor: paslonKeys.map((key: string) => {
                return paslons[key as any].warna
            }),

            data: paslonKeys.map((key: string) => {
                return chart[key as any]
            })
        }
        return [dataset];
    }




    useEffect(() => {

        fetch('json/links.json')
            .then((response) => response.json())
            .then((data: endpoint) => {
                fetch(data.ppwp)
                    .then((response) => response.json())
                    .then((json: any) => {

                        setPaslonData(json);
                        fetch(data.hhcw)
                            .then((response) => response.json())
                            .then((data) => {

                                setGeoData(createGeoDataset(json, data.table) as any);
                                setBarData(createBarDataset(json, data.chart) as any);
                                setPersen(data.chart.persen);
                                setDescription("Aplikasi ini mengunakan data langsung dari website <a target='_blank' class='text-blue-500' href='https://pemilu2024.kpu.go.id/'>pemilu2024.kpu.go.id</a>");
                            });
                    });
            });
    }, []);






    return (
        <>
            <div className='w-full h-full max-w-[1200px] mx-auto'>
                <h1 className='text-center text-lg font-bold text-gray-600'>HASIL HITUNG SUARA PEMILU PRESIDEN & WAKIL PRESIDEN RI 2024</h1>
                <div className='text-center mb-3'>
                    <span className='text-gray-400'>Persentase {persen}%</span>
                    <p dangerouslySetInnerHTML={{ __html: description }} ></p>
                </div>
                <div className='mb-3'>
                    <PaslonContainer data={paslonData} />
                </div>

                <div>
                    <h2 className='text-md font-bold text-gray-500'>Bar Chart Diagram</h2>
                    <BarChart labels={Object.keys(paslonData).map((key: any) => ("Paslon 0" + (paslonData[key as any] as PaslonI).nomor_urut))} datasets={barData} />
                </div>
                <div>
                    <h2 className='text-md font-bold text-gray-500'>Choropleth Map Diagram</h2>
                    <GeoChart datasets={GeoData} states={states} />
                </div>
            </div>
            <footer className='text-sm text-gray-500'>
                <div className='text-center'>Copyright © 2023. <a href='https://github.com/il4mb' target='_blank' className='text-blue-500'>il4mb</a> All rights reserved.</div>
            </footer>
        </>
    );
};

export { MapChart };
