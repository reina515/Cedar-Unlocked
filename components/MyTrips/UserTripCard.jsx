import moment from 'moment';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { Colors } from '../../constant/Colors';
export default function UserTripCard({trip}){
    const formatData=()=>{
        try{
        return JSON.parse(trip.tripData);
    }
    catch(e){
        console.error("invalid data", e);
        return {};
    }}
    const data =formatData();
    return(
        <View style = {{
            marginTop:20,
            display: 'flex',
            flexDirection:'row',
            gap: 10,
            alignItems: 'center'

        }}>

            <Image source = {{uri:'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference='+formatData(trip.tripData).locationInfo?.photoRef+'&key='+process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY}}
               style = {{
                width: '100%',
                height:240,
                borderRadius: 15
               }}
               resizeMode='cover'
               /> 
         
          <View >
            <Text style = {{
                fontFamily: 'outfit-medium',
                fontSize: 18,

            }}>{trip.tripPlan?.travelPlan?.location}</Text>
            <Text style ={{
                fontFamily:'outfit',
                fontSize:14,
                color: Colors.GRAY,

            }}>{moment(formatData(trip.tripData).startDate).format('DD MMM yyyy')}</Text>
            <Text style ={{
                fontFamily:'outfit',
                fontSize:18,
                color: Colors.GRAY,
                
            }}>Traveling: {formatData(trip.tripData).traveler.title}</Text>
          </View>
        </View>
    )
}
