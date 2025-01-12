import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  useQuery,
  BackgroundFetchProvider,
  useQueryv2,
} from 'react-native-api-cache';
import type { PokemonResponse } from './mock';

let apiCounter = 0;
const teste = ['n'];
let count = 0;

const Component1 = () => {
  console.warn('Component1');
  const increaseCounter = () => {
    if (count >= teste.length - 1) count = 0;
    else count++;
  };

  const requestFn = async (): Promise<PokemonResponse> => {
    console.log('Component1 teste[count]', teste[count]);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return await fetch(`https://pokeapi.co/api/v2/pokemo${teste[count]}`)
      .then(async (response) => {
        apiCounter++;
        console.log(
          '---------- Component1 ------------api counter----------------',
          apiCounter
        );
        increaseCounter();
        console.log('response1!!!', response);
        const pokemons = await response.json();
        return pokemons;
      })
      .catch((e) => {
        console.warn('api error', e);
        throw e;
      });
  };

  const { data, error, refetch } = useQueryv2<PokemonResponse>(
    'exampleData',
    requestFn,
    {
      staleTime: 0,
      retries: 4,
      retryInterval: 5000,
      multiScreen: true,
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
          <Text style={styles.text}>Atualizar Componente 1</Text>
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

const Component2 = () => {
  console.warn('Component2');
  const increaseCounter = () => {
    if (count >= teste.length - 1) count = 0;
    else count++;
  };

  const requestFn = async (): Promise<PokemonResponse> => {
    console.log('Component2 teste[count]', teste[count]);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return await fetch(`https://pokeapi.co/api/v2/pokemo${teste[count]}`)
      .then(async (response) => {
        apiCounter++;
        console.log(
          '---------- Component2 ------------api counter----------------',
          apiCounter
        );
        increaseCounter();
        console.log('response2!!!', response);
        const pokemons = await response.json();
        return pokemons;
      })
      .catch((e) => {
        console.warn('api error', e);
        throw e;
      });
  };

  const { data, error, refetch } = useQueryv2<PokemonResponse>(
    'exampleData',
    requestFn,
    {
      staleTime: 0,
      retries: 4,
      retryInterval: 5000,
      multiScreen: true,
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
          <Text style={styles.text}>Atualizar Componente 2</Text>
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

const App = () => {
  return (
    // <BackgroundFetchProvider>
    <>
      <Component1 />
      <Component2 />

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            console.log(
              '*********** Contador de requisições ***************',
              apiCounter
            )
          }
        >
          <Text style={styles.text}>Contador de requisições </Text>
        </TouchableOpacity>
      </View>
    </>
    // </BackgroundFetchProvider>
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
    backgroundColor: 'blue',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
