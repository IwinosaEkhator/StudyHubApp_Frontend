import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../app/library/homeScreen";
import InfoPage from "../app/library/infoPage";
import ReadBookScreen from "../app/library/readBooks";


const UserNavigator = () => {
    const Stack = createStackNavigator();
    return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="infoPage" component={InfoPage} />
      <Stack.Screen name="ReadBook" component={ReadBookScreen} />
    </Stack.Navigator>
  )
}

export default UserNavigator

