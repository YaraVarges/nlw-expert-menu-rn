import { useState } from "react";
import { Header } from "@/components/header";
import { View, Text, ScrollView, Alert, Linking } from "react-native";
import { Product } from "@/components/product";
import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/format-currency";
import { Input } from "@/components/input";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link.button";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = "YOUR_NUMBER_HERE"

export default function Cart() {
    const [address, setAddress] = useState("")
    const [obs, setObs] = useState("")
    const [methodPay, setMethodPay] = useState("")
    const cartStore = useCartStore()
    const navigation = useNavigation()

    const total = formatCurrency(
        cartStore.products.reduce(
            (total, product) => total + product.price * product.quantity, 0
        )
    )

    function handleProductRemove (product: ProductCartProps) {
        Alert.alert("Remover", `Deseja remover o item "${product.title}" do seu carrinho?`, [
            {
                text: "Cancelar",
            },
            {
                text: "Remover",
                onPress: () => cartStore.remove(product.id)
            }
        ])
    }


    function handleOrder(){
        if (address.trim().length === 0) {
            return Alert.alert("Pedido", "Informe os dados de entrega no campo de 'Endereço de Entrega'.")
        }

        const products = cartStore.products.map((product) => `\n${product.quantity} x  ${formatCurrency(product.price)} | ${product.title}`).join("")

        const message = `
            🍔 *NOVO PEDIDO*
            
            \n✅ *Produtos*:
            ${products}

            \n📝 *Observações*: \n${obs}

            \n📌 *Endereço de Entrega*: \n${address}
            
            \n💲 *Forma de Pagamento*: \n${methodPay}
            
            \n💰 *Valor Total*: ${total}
        `

        Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`)

        cartStore.clear()

        navigation.goBack()


    }

    return (
        <View className="flex-1 pt-10">
            
            <Header title="Seu Carrinho"/>
             

            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                extraHeight={100}    
            >
                <ScrollView>
                    <View className="p-5 flex-1">
                        {cartStore.products.length > 0 ? (
                            <View>
                                {cartStore.products.map((product) => (
                                    <Product 
                                        key={product.id} 
                                        data={product}
                                        onPress={() => handleProductRemove(product)}
                                    />
                                ))}
                            </View>
                        ) : (
                            <Text className="text-slate-400 font-body text-center my-96">
                                Seu Carrinho está vazio.
                            </Text> 
                        )}

                        <Text className="text-white text-xl font-heading py-3">Observações</Text>
                        <Input 
                            placeholder="Carne ao ponto, sem cebola, sem molho..." 
                            onChangeText={setObs}/>
                        <View className="border-b border-slate-700 py-2"></View>

                        <View className="flex-row gap-3 item mt-5 mb-5">
                            <Text className="text-white text-3xl font-subtitle">Total:</Text>
                            <Text className="text-lime-400 text-3xl font-heading">{total}</Text>
                        </View>


                        <Text className="text-white text-xl font-heading py-4">Endereço de Entrega</Text>
                        <Input 
                            placeholder="Informe a Rua, Número, Bairro, CEP e complemento."
                            onChangeText={setAddress}
                            blurOnSubmit={true}
                            onSubmitEditing={handleOrder}
                            returnKeyType="next"/>

                        <Text className="text-white text-xl font-heading py-4">Forma de Pagamento</Text>
                        <Input 
                            placeholder="Dinheiro, PIX, Cartão (crédito ou debito)."
                            onChangeText={setMethodPay}
                            blurOnSubmit={true}
                            onSubmitEditing={handleOrder}
                            returnKeyType="next"
                        />
                    </View>
                </ScrollView> 
            </KeyboardAwareScrollView>

            <View className="p-5 gap-5">
                <Button onPress={handleOrder}>
                    <Button.Text>Enviar Pedido</Button.Text>
                    <Button.Icon>
                        <Feather name="arrow-right-circle" size={20}></Feather>
                    </Button.Icon>
                </Button>

                <LinkButton title="Voltar para o cardápio" href="/" />
            </View>
        </View>
    )
}