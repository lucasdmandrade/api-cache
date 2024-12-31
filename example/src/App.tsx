import { useCallback, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import useQuery from 'react-native-api-cache';

const App = () => {
  const requestFn = useCallback(
    async () =>
      await fetch('https://pokeapi.co/api/v2/pokemon/?limit=50').then(
        async (response) => {
          const teste = await response.json();
          return teste;
        }
      ),
    []
  );

  const options = useMemo(
    () => ({
      staleTime: 300,
    }),
    []
  );

  const { data, error, isLoading } = useQuery(
    'exampleData',
    requestFn,
    options
  );
  console.log('rendered', JSON.stringify(data));

  if (isLoading) return <Text>Loading...</Text>;
  if (error)
    return (
      <View style={styles.container}>
        <Text>Error: {error?.message || 'Erro'}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text>Data: {JSON.stringify(data)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'red',
  },
});

export default App;
