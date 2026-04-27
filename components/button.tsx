import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';
import { createStyles } from '../styles/theme';

type ButtonProps = {
  title: string;
  url: Parameters<ReturnType<typeof useRouter>['push']>[0]; // <-- correct type
  theme: 'light' | 'dark';
};

export default function Button({ title, url , theme }: ButtonProps) {
  const router = useRouter();

  const styles = createStyles(theme);

  return (

    <TouchableOpacity style={styles.button} onPress={() => router.push(url)}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>

  );
}


