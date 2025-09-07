import { Text, View } from 'react-native';
import { Colors } from "../../constant/Colors";
export default function OptionCard({option,selectedTraveler}) {
  return (
    <View style={[{
        padding:25,
        display:'flex',
        flexDirection:'row',
        justifyContent:"space-between",
        backgroundColor:Colors.LIGHT_GRAY,
        borderRadius:11
    },selectedTraveler==option&&{borderWidth:2}]}>
        <View> 
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:20

      }}
      >{option.title}
      </Text>
      <Text style={{
        fontFamily:'outfit-medium',
        fontSize:17,
        color:Colors.GRAY

      }}
      >{option.desc}</Text>
      </View>
      <Text style={{
        fontSize:35,
      }}>{option.icon}</Text>
    </View>
  )
}