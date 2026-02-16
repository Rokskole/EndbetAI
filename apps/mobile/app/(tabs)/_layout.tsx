import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#4b5563',
        tabBarStyle: {
          backgroundColor: '#1f2937',
          borderTopColor: '#4b5563',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: '#1f2937',
          borderBottomColor: '#4b5563',
          borderBottomWidth: 1,
        },
        headerTintColor: '#f9fafb',
        headerTitleStyle: {
          color: '#f9fafb',
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="index"
        component={require('./index').default}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="journal"
        component={require('./journal').default}
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="finance"
        component={require('./finance').default}
        options={{
          title: 'Finance',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="tasks"
        component={require('./tasks').default}
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="check-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="chat"
        component={require('./chat').default}
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
