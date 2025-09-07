import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { auth } from './../../../configs/FirebaseConfig';

export default function SignIn() {
    const router = useRouter();
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    const onSignIn = () => {
        if (!email || !password) {
            ToastAndroid.show('Please Enter Email & Password', ToastAndroid.SHORT);
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                router.replace('/mytrip');
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage, errorCode);
                if (errorCode == 'auth/invalid-credential') {
                    ToastAndroid.show("Invalid Credentials", ToastAndroid.SHORT);
                }
            });
    };

    return (
        <View style={styles.container}>

            <View style={styles.backgroundCircle1} />
            <View style={styles.backgroundCircle2} />
            <View style={styles.backgroundGradient} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('auth/sign-up')} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#006A4E" />
                </TouchableOpacity>
            </View>


            <View style={styles.content}>
                <View style={styles.titleSection}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <View style={styles.titleUnderline} />
                    </View>
                    <Text style={styles.subtitle}>Sign in to continue your journey</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input} 
                                onChangeText={(value) => setEmail(value)} 
                                placeholder='Enter your email address'
                                placeholderTextColor="#94A3B8"
                                value={email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <View style={styles.inputGlow} />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                secureTextEntry={true}
                                style={styles.input} 
                                onChangeText={(value) => setPassword(value)} 
                                placeholder='Enter your password'
                                placeholderTextColor="#94A3B8"
                                value={password}
                            />
                            <View style={styles.inputGlow} />
                        </View>
                    </View>

                    <TouchableOpacity 
                        onPress={onSignIn}
                        style={styles.signInBtn}
                    >
                        <View style={styles.buttonGradient}>
                            <Text style={styles.signInText}>Sign In</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.replace('auth/sign-up')} style={styles.signUpBtn}>
                        <Text style={styles.signUpText}>Don't have an account? <Text style={styles.signUpTextBold}>Sign Up</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFBFC',
    },
    backgroundCircle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#006A4E',
        opacity: 0.03,
        top: -150,
        right: -100,
    },
    backgroundCircle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#006A4E',
        opacity: 0.05,
        bottom: -50,
        left: -75,
    },
    backgroundGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        backgroundColor: 'linear-gradient(180deg, rgba(0, 106, 78, 0.02) 0%, transparent 100%)',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    titleSection: {
        marginBottom: 48,
        alignItems: 'center',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 36,
        fontFamily: 'outfit-bold',
        color: '#1E293B',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    titleUnderline: {
        width: 60,
        height: 3,
        backgroundColor: '#006A4E',
        borderRadius: 2,
    },
    subtitle: {
        fontSize: 17,
        fontFamily: 'outfit',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
    },
    form: {
        gap: 28,
    },
    inputGroup: {
        gap: 12,
    },
    label: {
        fontSize: 15,
        fontFamily: 'outfit-medium',
        color: '#334155',
        letterSpacing: 0.3,
    },
    inputContainer: {
        position: 'relative',
    },
    input: {
        height: 64,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderRadius: 16,
        borderColor: '#E2E8F0',
        fontFamily: 'outfit',
        fontSize: 16,
        color: '#1E293B',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    inputGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
        opacity: 0,
    },
    signInBtn: {
        height: 64,
        borderRadius: 16,
        marginTop: -10,
        shadowColor: '#006A4E',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 12,
    },
    buttonGradient: {
        flex: 1,
        backgroundColor: '#006A4E',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    signInText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontFamily: 'outfit-bold',
        letterSpacing: 0.5,
    },
    signUpBtn: {
        height: 64,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: -10,
        marginTop: -5
    },
    signUpText: {
        color: '#64748B',
        fontSize: 16,
        fontFamily: 'outfit',
    },
    signUpTextBold: {
        color: '#006A4E',
        fontFamily: 'outfit-bold',
    },
});
