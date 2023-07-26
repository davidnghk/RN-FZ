import moment, * as moments from 'moment';

interface AmbienceDataSet {
    id: number,
    device: String,
    thing_id: number,
    message_datetime: string,
    created_at: string,
    updated_at: string,
    dev_eui: string,
    state: string,
    account_id: number,
    humidity: string,
    barometer: string,
    gas_resistance: string,
    battery: string,
    temperature: string,
}

export default class AmbienceData {
    data: AmbienceDataSet[];
    numberOfDays: number;
    dayRangeStart: Date;
    dayRangeEnd: Date;

    constructor(data: AmbienceDataSet[]) {
        this.data = data;
        this.numberOfDays = 7;
        this.dayRangeStart = new Date();
        this.dayRangeEnd = new Date(this.dayRangeStart.setDate(this.dayRangeStart.getDate() - this.numberOfDays));
    }

    formateDateTime(dateTime: string) {
        return moment(dateTime).local().format('DD/MM ha');
    }

    getProcessedData(dataTarget: string) {

        let processedData = [];

        const filterData = this.data.filter(dataItem => {
            let date = new Date(dataItem.message_datetime);
            return date > this.dayRangeEnd
        })

        for (let dayData of filterData) {

            if (dayData[dataTarget] === null) {
                continue;
            }

            let formatDate = this.formateDateTime(dayData.message_datetime);
            processedData.unshift({ x: formatDate, y: parseFloat(dayData[dataTarget]) })

        }

        return processedData
    }

    findMaxAndMinValue(data: any) {
        const max = Math.max.apply(Math, data.map(function (o) { return o.y; }));
        const min = Math.min.apply(Math, data.map(function (o) { return o.y; }));

        return { max, min }
    }

    getDataAndMinMaxObject(dataTarget: string) {

        const data = this.getProcessedData(dataTarget);
        const minMax = this.findMaxAndMinValue(data);

        return { data, minMax }
    }

}