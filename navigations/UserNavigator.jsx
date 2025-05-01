import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../app/library/homeScreen";
import InfoPage from "../app/library/infoPage";
import ReadBookScreen from "../app/library/readBooks";
import CategoryScreen from "../app/library/categoryScreen";
import profileScreen from "../app/profile/profileScreen";

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="infoPage" component={InfoPage} />
      <Stack.Screen name="ReadBook" component={ReadBookScreen} />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={({ route }) => ({ title: route.params.type })}
      />

      {/* Profile Screens */}
      <Stack.Screen name="Profile" component={profileScreen} />
    </Stack.Navigator>
  );
};

export default UserNavigator;
