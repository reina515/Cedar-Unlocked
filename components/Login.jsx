import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constant/Colors';

export default function Login() {
    const router = useRouter();
  return (
    <View>
      <Image source={require('../assets/images/login.jpg')}
        style={{
        width:'100%',
        height:520
      }}
      />
      <View style={styles.container}>
        <Text style={{
            fontSize:30,
            fontFamily:'outfit-bold',
            textAlign:'center',
            marginTop:10
        }}>
            AI Travel Planner</Text>
            <Text style={{
                fontFamily:'outfit',
                fontSize:19,
                textAlign:'center',
                color:Colors.GRAY,
                marginTop:20
            }}>Discover Your Personalized Journey In Lebanon.</Text>
         <TouchableOpacity style={styles.button}
            onPress={()=>router.push('auth/sign-in')}
         >
            <Text style={{
                color:Colors.WHITE,
                textAlign:'center',
                fontFamily:'outfit',
                fontSize:18
            }}>Sign In With Google</Text>
         </TouchableOpacity>
      
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:Colors.WHITE,
        marginTop:-20,
        borderTopRightRadius:30,
        borderTopLeftRadius:30,
        padding:25,
        height:'100%'
    },button:{
        padding:15,
        backgroundColor:Colors.PRIMARY,
        borderRadius:99,
        marginTop:'15%'


    }

})