import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/store';


export default function App() {
  return (
    <GestureHandlerRootView>
      
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer>
             <RootNavigator />
          </NavigationContainer>
           <Toast />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}