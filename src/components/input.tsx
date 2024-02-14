import {TextInput, TextInputProps} from 'react-native';



export function Input({...rest}: TextInputProps) {
    return (
        <TextInput 
            className='h-32 bg-slate-800 rounded-md px-4 py-3 font-body text-sm text-white'
            multiline
            textAlignVertical='top'
            placeholderTextColor={'gray'}

        {...rest}/>
    )
}