var moment = require('moment');

function trip_utils(){}


trip_utils.calculate_position = function(start_time, points, duration) {
  var now = Date.now()
  var seconds_from_begginig = (now - start_time) / 1000
  if (seconds_from_begginig <= 0) {
    return points[0];
  }
  var seconds_per_interval = duration / points.length;
  var index = Math.round(seconds_from_begginig/seconds_per_interval)
  
  return points[index]
}

trip_utils.get_drivers_by_score = function(idTrip,sourceTrip,drivers){
	var driversByScore = [];
	//creamos los elementos
	drivers.forEach(driver => {
		var distFrom = trip_utils.distFrom(sourceTrip.lat,sourceTrip.long,driver.currentposition.lat,driver.currentposition.long);
		var driverElement = {
			driverId : driver.id,
			distFrom: distFrom,
			rating: driver.rating,
			ring: trip_utils.getRings(distFrom)
		}
		driversByScore.push(driverElement);
	});
	//ordeno por anillos y por rating.
	driversByScore.sort(function(a, b) {
  		if( a.ring < b.ring){
  			return -1;
  		}
  		if(a.ring > b.ring){
  			return 1;
  		}
  		return a.rating <= b.rating;
	});
	return driversByScore;
}

//calculo de distancias
trip_utils.distFrom = function(lat1, lng1, lat2, lng2) {
	//console.log("Calculo de desitancia lat1:"+lat1+" lng1:"+lng1+" lat2:"+lat2+" lng2:"+lng2);
    var earthRadius = 6371000; //meters
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
           Math.sin(dLng/2) * Math.sin(dLng/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var dist =  (earthRadius * c);
    //console.log("Resultado:"+dist);
    return dist;
}

// devuelve el anillo de distancia a que pertenece
trip_utils.getRings= function(distance){
	if(distance<500){return 1;}
	if(distance<1000){return 2;}
	if(distance<1500){return 3;}
	if(distance<2000){return 4;}
	if(distance<2500){return 5;}
	if(distance<3000){return 6;}
	if(distance<3500){return 7;}
	if(distance<4000){return 8;}
	if(distance<4500){return 9;}
	if(distance<5000){return 10;}
	if(distance>=5000){return 11;}
}

trip_utils.getPrice = function(animalCount,companion,km,min,startTime,tripRates){
	return  parseFloat(animalCount*tripRates.animalrate) + 
		   parseFloat(companion?tripRates.companion:0) +
		   parseFloat(km*tripRates.km) +
		   parseFloat(min*tripRates.min) + 
		   parseFloat(trip_utils.getNightRange(tripRates,startTime));
}

trip_utils.getNightRange = function(tripRates,startTime){
	var restaHoras = parseInt(tripRates.nighttimeend.split(':')[0]) - parseInt(tripRates.nighttimestart.split(':')[0]);
	var restaMinutos = parseInt(tripRates.nighttimeend.split(':')[1]) - parseInt(tripRates.nighttimestart.split(':')[1]);
	var restaSegundos = parseInt(tripRates.nighttimeend.split(':')[2]) - parseInt(tripRates.nighttimestart.split(':')[2]);

	if(restaHoras > 0) {
		return trip_utils.between(tripRates,startTime.split('T')[1].split('.')[0])?tripRates.nightrate:0;
	}else if(restaHoras < 0){
		return trip_utils.between2(tripRates,startTime.split('T')[1].split('.')[0])?tripRates.nightrate:0;
	}else{
		//son horas iguales ==
		if(restaMinutos > 0){
			return trip_utils.between(tripRates,startTime.split('T')[1].split('.')[0])?tripRates.nightrate:0;
		}else if(restaMinutos < 0){
			return trip_utils.between2(tripRates,startTime.split('T')[1].split('.')[0])?tripRates.nightrate:0;
		}else{
			//mintuos ==
			if(restaSegundos >0 ){
				return trip_utils.between(tripRates,startTime.split('T')[1].split('.')[0])?tripRates.nightrate:0;
			}else if(restaSegundos < 0){
				return trip_utils.between2(tripRates,startTime.split('T')[1].split('.')[0])?tripRates.nightrate:0;
			}else{
				//Son iguales
				return false;
			}
		}
	}
}

trip_utils.between = function(tripRates,t1){ //mayor que cero
	var HorasTRE = parseInt(tripRates.nighttimeend.split(':')[0]);
	var MinutosTRE = parseInt(tripRates.nighttimeend.split(':')[1]);
	var SegundosTRE = parseInt(tripRates.nighttimeend.split(':')[2]);
	var HorasTRS = parseInt(tripRates.nighttimestart.split(':')[0]);
	var MinutosTRS = parseInt(tripRates.nighttimestart.split(':')[1]);
	var SegundosTRS = parseInt(tripRates.nighttimestart.split(':')[2]);
	var HorasT1 = parseInt(t1.split(':')[0]);
	var MinutosT1 = parseInt(t1.split(':')[1]);
	var SegundosT1 = parseInt(t1.split(':')[2]);

	if(HorasT1 > HorasTRS){
		if(HorasT1 < HorasTRE){
			return true;	
		}else if(HorasT1 == HorasTRE){
			if(MinutosT1 < MinutosTRE){
				return true;
			}else if( MinutosT1 == MinutosTRE){
				if(SegundosT1 < SegundosTRE){
					return true;
				}else if(SegundosT1 == SegundosTRE){
					//mismo tiempo
					return true;
				}else{	
					return false;
				}
			}else{
				return false;
			}
		}else{
			return false;
		}
		
	}else if(HorasT1 == HorasTRS){
		if(MinutosT1 > MinutosTRS){
			if(HorasT1 < HorasTRE){
				return true;	
			}else if(HorasT1 == HorasTRE){
				if(MinutosT1 < MinutosTRE){
					return true;
				}else if( MinutosT1 == MinutosTRE){
					if(SegundosT1 < SegundosTRE){
						return true;
					}else if(SegundosT1 == SegundosTRE){
						//mismo tiempo
						return true;
					}else{
						return false;
					}
				}else{
					return false;
				}
			}else{
				return false;
			}
		}else if(MinutosT1 == MinutosTRS){
			if(SegundosT1 > SegundosTRS){
				if(HorasT1 < HorasTRE){
					return true;	
				}else if(HorasT1 == HorasTRE){
					if(MinutosT1 < MinutosTRE){
						return true;
					}else if( MinutosT1 == MinutosTRE){
						if(SegundosT1 < SegundosTRE){
							return true;
						}else if(SegundosT1 == SegundosTRE){
							//mismo tiempo
							return true;
						}else{
							return false;
						}
					}else{
						return false;
					}
				}else{
					return false;
				}
			}else if( SegundosT1 == SegundosTRS){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}else{
		return false;
	}
	
	
}


trip_utils.between2 = function(tripRates,t1){ //menor que cero
	var HorasTRE = parseInt(tripRates.nighttimeend.split(':')[0]);
	var MinutosTRE = parseInt(tripRates.nighttimeend.split(':')[1]);
	var SegundosTRE = parseInt(tripRates.nighttimeend.split(':')[2]);
	var HorasTRS = parseInt(tripRates.nighttimestart.split(':')[0]);
	var MinutosTRS = parseInt(tripRates.nighttimestart.split(':')[1]);
	var SegundosTRS = parseInt(tripRates.nighttimestart.split(':')[2]);
	var HorasT1 = parseInt(t1.split(':')[0]);
	var MinutosT1 = parseInt(t1.split(':')[1]);
	var SegundosT1 = parseInt(t1.split(':')[2]);

	if(HorasT1 < HorasTRS){
		if(HorasT1 > HorasTRE){
			return false;
		}else if(HorasT1 == HorasTRE){
			//voy por minutos
			if(MinutosT1 > MinutosTRE){
				return false;
			}else if(MinutosT1 == MinutosTRE){
			//voy por segundos
				if(SegundosT1 > SegundosTRE){
					return false;
				}else if(SegundosT1 == SegundosTRE){
					return true;
				}else{
					return true;
				}
			}else{
				return true;
			}
		}else{
			return true;
		}
	}else if( HorasT1 == HorasTRS){
		if(MinutosT1>MinutosTRS){
			if(HorasT1 > HorasTRE){
				return true;
			}else if(HorasT1 == HorasTRE){
				//voy por minutos
				if(MinutosT1 > MinutosTRE){
					return true;
				}else if(MinutosT1 == MinutosTRE){
				//voy por segundos
					if(SegundosT1 > SegundosTRE){
						return true;
					}else if(SegundosT1 == SegundosTRE){
						return true;
					}else{
						return false;
					}
				}else{
					return false;
				}
			}else{
				return false;
			}
		}else if( MinutosT1 == MinutosTRS){
			//voy por segundos
			if(SegundosT1> SegundosTRS){
				if(HorasT1 > HorasTRE){
					return true;
				}else if(HorasT1 == HorasTRE){
				//voy por minutos
					if(MinutosT1 > MinutosTRE){
						return true;
					}else if(MinutosT1 == MinutosTRE){
						//voy por segundos
						if(SegundosT1 > SegundosTRE){
							return true;
						}else if(SegundosT1 == SegundosTRE){
							return true;
						}else{
							return false;
						}
					}else{
						return false;
					}
				}else{
					return false;
				}
			}else if( SegundosT1 == SegundosTRS){
				//son iguales
				return true;
			}else if(SegundosT1 < SegundosTRS){
				if(HorasT1 > HorasTRE){
					return false;
				}else if(HorasT1 == HorasTRE){
					//voy por minutos
					if(MinutosT1 > MinutosTRE){
						return false;
					}else if(MinutosT1 == MinutosTRE){
					//voy por segundos
						if(SegundosT1 > SegundosTRE){
							return false;
						}else if(SegundosT1 == SegundosTRE){
							return true;
						}else{
							return true;
						}
					}else{
						return true;
					}
				}else{
					return true;
				}
			}
		}else if( MinutosT1 < MinutosTRS){
			if(HorasT1 > HorasTRE){
				return false;
			}else if(HorasT1 == HorasTRE){
				//voy por minutos
				if(MinutosT1 > MinutosTRE){
					return false;
				}else if(MinutosT1 == MinutosTRE){
				//voy por segundos
					if(SegundosT1 > SegundosTRE){
						return false;
					}else if(SegundosT1 == SegundosTRE){
						return true;
					}else{
						return true;
					}
				}else{
					return true;
				}
			}else{
				return true;
			}
		}
	}else if(HorasT1 > HorasTRS){
		if(HorasT1 > HorasTRE){
			return true;
		}else if(HorasT1 == HorasTRE){
			//voy por minutos
			if(MinutosT1 > MinutosTRE){
				return true;
			}else if(MinutosT1 == MinutosTRE){
				//voy por segundos
				if(SegundosT1 > SegundosTRE){
					return true;
				}else if(SegundosT1 == SegundosTRE){
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	
	
}

module.exports = trip_utils;