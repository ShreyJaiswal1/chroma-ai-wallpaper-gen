import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CurvedBottomTabs } from "../../src/shared/ui/base/curved-bottom-tabs";

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <CurvedBottomTabs {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="gallery"
          options={{
            title: "Gallery",
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? "images" : "images-outline"} size={20} color={focused ? "#FFFFFF" : "#B9B9B9"} />
            ),
          }}
        />
        <Tabs.Screen
          name="generate"
          options={{
            title: "Generate",
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? "sparkles" : "sparkles-outline"} size={22} color={focused ? "#FFFFFF" : "#B9B9B9"} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "settings" : "settings-outline"} size={20} color={focused ? "#FFFFFF" : "#B9B9B9"} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
