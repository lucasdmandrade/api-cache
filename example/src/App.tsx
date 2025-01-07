import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from 'react-native-api-cache';
import type { PokemonResponse } from './mock';

const App = () => {
  let count = 0;
  const teste = ['a', 'm', 'n', 'o'];

  const increaseCounter = () => {
    console.log('count', count);
    if (count >= teste.length - 1) count = 0;
    else count++;
  };

  const requestFn = async (): Promise<PokemonResponse> => {
    console.log('teste[count]', teste[count]);

    return await fetch(`https://pokeapi.co/api/v2/pokemo${teste[count]}`)
      .then(async (response) => {
        increaseCounter();
        const pokemons = await response.json();
        console.log('pokemons', pokemons);
        return pokemons;
      })
      .catch((e) => {
        console.warn('api error', e);
        throw e;
      });
  };

  const { data, error, refetch } = useQuery<PokemonResponse>(
    'exampleData',
    requestFn,
    {
      staleTime: 100,
      retries: 4,
      retryInterval: 5000,
    }
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            refetch();
            increaseCounter();
          }}
        >
          <Text style={styles.text}>Atualizar</Text>
        </TouchableOpacity>
      </View>
      {error && (
        <View style={[styles.container, styles.backgroundRed]}>
          <Text>Error: {error?.message || 'Erro'}</Text>
        </View>
      )}
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
