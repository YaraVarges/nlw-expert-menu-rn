import {View, ActivityIndicator} from 'react-native';

export function Loading(){
    return (
        <View className='flex-1 items-center justify-center bg-slate-900'>
            <ActivityIndicator size="large" color="#000"/>
        </View>
    )
}