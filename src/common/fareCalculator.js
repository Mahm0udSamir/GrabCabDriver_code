// calculation for fare on the base of distance and time

export function farehelper(distance,time,rateDetails){
    let ratePerKm = rateDetails.rate_per_kilometer;
    let ratePerHour = rateDetails.rate_per_hour;
    let ratePerSecond = ratePerHour/3600;

    let DistanceInKM = (distance/1000).toFixed(2);
    let estimateRateForKM =(DistanceInKM*ratePerKm).toFixed(2)*1;
    let estimateRateForhour = (time*ratePerSecond).toFixed(2);
    let total = parseFloat(estimateRateForKM)+parseFloat(estimateRateForhour);
    let grandtotal = (parseFloat(estimateRateForKM)+parseFloat(estimateRateForhour)+rateDetails.convenience_fees)
    let calculateData = {
        distaceRate:estimateRateForKM,
        timeRate:estimateRateForhour,
        totalCost:total,
        grandTotal:grandtotal
    }
    return calculateData
    }




    