/* Draft Version */

var XLSX = require('xlsx');

//var workbook = XLSX.readFile('./data/twIndex_20100521_20170210.xlsx');
var workbook = XLSX.readFile('./data/tw1310_20100521_20170210.xlsx');
var first_sheet_name = workbook.SheetNames[0];
var worksheet = workbook.Sheets[first_sheet_name];
var dataObj = XLSX.utils.sheet_to_json(worksheet);
var do_buy = false; 
var do_sell = false;
var total = 0;
var buy_index = 0;
var sell_index = 0; 
var positive_earnings_cnt = 0;
var negative_earnings_cnt = 0;
var boundry = -20;

var i = 0;
for (dayData of dataObj)
{
	//console.log(dayData['時間']);
	if (do_buy == false){		
			if ((dayData['SMA13'] > dayData['SMA72']) && (dayData['開盤價'] > dayData['SMA288']))
			//if (dayData['SMA72'] > dayData['SMA288'])
			//if ((dayData['收盤價'] >= dayData['SMA13']) && (dayData['SMA72'] > dayData['SMA288']))			
			//if ((dayData['收盤價'] >= dayData['SMA13']))			
			//if ((dayData['收盤價'] >= dayData['SMA13']) && (dayData['SMA72'] > dayData['SMA288']))	
			{
				var william_int = parseInt(dayData['威廉指標72'].replace('%', ''));
				if (william_int >= boundry)
				//if (1)
				{
					var nextDayData = dataObj[i+1];
					if (nextDayData == undefined){
			   			continue;
					}
					console.log('[Buy]:' + dayData['時間'] + ' [Index]:' + nextDayData['開盤價']);
					do_buy = true;
					buy_index = parseInt(nextDayData['開盤價']); /* Action on tomorrow */
				}
			}					
	}else {          
		var william_int = parseInt(dayData['威廉指標72'].replace('%', ''));
		if (william_int < boundry)
		//if (dayData['SMA72'] <= dayData['SMA288'])		
		//if ((dayData['收盤價'] < dayData['SMA13']) && (dayData['SMA72'] <= dayData['SMA288'] ))
		//if ((dayData['收盤價'] < dayData['SMA13']) && (dayData['收盤價'] < dayData['SMA72']))
		//if (dayData['收盤價'] < dayData['SMA13'])
		{			

				//sell_index = parseInt(dayData['收盤價']);
				var nextDayData = dataObj[i+1];
				if (nextDayData == undefined){
				   continue;
				}

				console.log('[Sell]:' + dayData['時間'] + ' [Index]:' + nextDayData['開盤價']);
				do_buy = false;

				sell_index = parseInt(nextDayData['開盤價']);  /* Action on tomorrow */
				var delta = sell_index - buy_index;
				if (delta > 0){
					console.log("賺錢: " + delta);
					positive_earnings_cnt += 1;
				}else{
					console.log("賠錢: " + delta);
					negative_earnings_cnt += 1;
				}
				total += delta;			
		}
	}
	i ++;
} /* for */

console.log("Statistic:" + total);
console.log("positive_earnings_cnt:" + positive_earnings_cnt);
console.log("negative_earnings_cnt:" + negative_earnings_cnt);