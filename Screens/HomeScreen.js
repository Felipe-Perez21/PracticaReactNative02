import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Button } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Constants from 'expo-constants';
import { createIconSetFromFontello } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [lista, setLista] = useState([]);
  const [ciudad, setCiudad] = useState('');
  const [location, setLocation] = useState([]);
  const [temp, setTemp] = useState([]);
  const [consultado, setConsultado]= useState(false);

  
  // Buscar el clima de la ciudad
  const buscar = (ciudad) => {
    
    const key = '';
    const api_url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${key}&units=metric`;

    if(ciudad == ""){
      console.log("Parametro de ciudad vacio")
    }
    else{
      fetch(api_url)
        .then(data => {
            return data.json();
        }).then(resultado => {
         console.log(resultado);
         console.log(resultado.message)

         if(resultado.message ==="city not found"){
          setConsultado(false);
         }
         else{
          setConsultado(true);
          
          let tempcoord = 0;
          let temptemp =0;
          let temploc = 0;
          tempcoord = resultado.coord;
          temptemp = resultado.main;
          temploc = resultado.sys;
         
          //Info de temperaturas
          let temparreglotemp = [];
          temparreglotemp.push(temptemp.temp);
          temparreglotemp.push(temptemp.temp_max);
          temparreglotemp.push(temptemp.temp_min);

          //Info de coordenadas
          let temparreglocoord = [];
          temparreglocoord.push(tempcoord.lon);
          temparreglocoord.push(tempcoord.lat);

          //Infor de ciudad
          let temparregloloc = [];
          temparregloloc.push(temploc.country)
          temparregloloc.push(resultado.name)

          
          setLista(temparreglotemp);
          setTemp(temparregloloc);
          setLocation(temparreglocoord);

         }
         
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.texto}> El climas</Text>
      <SearchBar
        round
        containerStyle={{
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderBottomWidth: 0,
        }}
        inputStyle={{ backgroundColor: 'white' }}
        onChangeText={(texto) => {
          setCiudad(texto)
          buscar(texto);
        }}
        onClear={() => {
          setLista([]);
          setCiudad("")
          setConsultado(false);
        }}
        value={ciudad}
        placeholder="Escribe aqui..."
      />

      <View style={{ margin: 10, fontSize: 20 }}>
        {
          consultado 
          ?
          <View style={{ margin: 10, fontSize: 20 }}>
            <Text style={styles.texto}> {temp[1]}, {temp[0]}{}</Text>
            <Text style={styles.texto}> Temperatura actural = {lista[0]} c°</Text>
            <Text style={styles.texto}> Temperatura máxima = {lista[1]} c°</Text>
            <Text style={styles.texto}> Temperatura mínima = {lista[2]} c°</Text>
            <Button 
                title="Más detalles (+)" 
                onPress={()=>navigation.navigate('DetailScreen',{nombre:temp[1],lon:location[0],lat:location[1]})}
            />
          </View>
          :
          <Text style={styles.texto}>
              Realiza una busqueda
          </Text>
        }
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    justifyContent: 'flex-start',
    backgroundColor: '#4c4949',
  },
  texto: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    margin: 10,
    fontWeight: 'bold',
  },
});
