import { createStackNavigator } from "@react-navigation/stack";
import SignUpScreen from "../app/auth/signUp";
import SignInScreen from "../app/auth/signIn";


const AuthNavigator = () => {
    const Stack = createStackNavigator();
    return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  )
}

export default AuthNavigator

