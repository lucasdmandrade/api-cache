import { useCallback, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import useQuery from 'react-native-api-cache';
import type { PokemonResponse } from './mock';

const App = () => {
  const requestFn = useCallback(
    async () =>
      await fetch('https://pokeapi.co/api/v2/pokemon/?limit=500').then(
        async (response) => {
          const pokemons = await response.json();
          return pokemons;
        }
      ),
    []
  );

  const options = useMemo(
    () => ({
      staleTime: 5000,
    }),
    []
  );

  const { data, error, isLoading, refetch } = useQuery<PokemonResponse>(
    'exampleData',
    requestFn,
    options
  );

  if (isLoading)
    return (
      <View style={[styles.container, styles.backgroundRed]}>
        <Text>Loading...</Text>
      </View>
    );
  if (error)
    return (
      <View style={[styles.container, styles.backgroundRed]}>
        <Text>Error: {error?.message || 'Erro'}</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={refetch}>
          <Text style={styles.text}>Atualizar</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[styles.container, styles.backgroundBlue]}
      >
        {data?.results?.map((item, index) => (
          <Text key={index} style={styles.text}>
            {item.name}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  btn: {
    paddingHorizontal: 10,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1,
  },
  btnContainer: {
    padding: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  container: {
    padding: 25,
    alignItems: 'center',
  },
  backgroundBlue: {
    backgroundColor: 'green',
  },
  backgroundRed: {
    backgroundColor: 'red',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    padding: 10,
  },
});

export default App;
