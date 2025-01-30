import { Stack, useRouter } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import { Platform, TouchableOpacity } from 'react-native';
import { IconSymbol } from '../../../components/ui/IconSymbol';

export default function HabitLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.text,
        presentation: Platform.select({
          ios: 'card',
          android: 'card',
          default: 'card'
        }),
        animation: Platform.select({
          ios: 'default',
          android: 'slide_from_right',
          default: 'slide_from_right'
        }),
        headerLeft: Platform.select({
          web: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ marginRight: 16, padding: 8 }}
            >
              <IconSymbol name="arrow-back-outline" color={Colors.text} size={24} />
            </TouchableOpacity>
          ),
          default: undefined
        }),
        gestureEnabled: Platform.select({
          ios: true,
          android: true,
          default: false
        }),
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Habit Details',
          headerShown: true,
        }}
      />
    </Stack>
  );
} 