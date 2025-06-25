import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../app/library/homeScreen";
import InfoPage from "../app/library/infoPage";
import ReadBookScreen from "../app/library/readBooks";
import CategoryScreen from "../app/library/categoryScreen";
import profileScreen from "../app/profile/profileScreen";
import ProfileScreen from "../app/profile/profileScreen";
import ChatListScreen from "../app/chat/chatListScreen";
import ChatScreen from "../app/chat/chatScreen";
import PostScreen from "../app/community/postScreen";
import EditProfileScreen from "../app/profile/editProfileScreen";
import BookmarksScreen from "../app/library/bookmarkScreen";
import AddPeopleScreen from "../app/chat/addPeopleScreen";
import ShareInfoPage from "../app/library/shareInfoPage";

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="infoPage" component={InfoPage} />
      <Stack.Screen name="ReadBook" component={ReadBookScreen} />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={({ route }) => ({ title: route.params.type })}
      />

      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Bookmark" component={BookmarksScreen} />
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="AddPeople" component={AddPeopleScreen} />
      <Stack.Screen
        name="ChatRoom"
        component={ChatScreen}
        options={({ route }) => ({ title: route.params.otherUser.username })}
      />
      <Stack.Screen name="Posts" component={PostScreen} />
      <Stack.Screen name="infoPage2" component={ShareInfoPage} />
    </Stack.Navigator>
  );
};

export default UserNavigator;
