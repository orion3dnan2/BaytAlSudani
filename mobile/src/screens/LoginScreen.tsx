import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Text,
  I18nManager,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { theme, sudaneseColors } from '../theme/colors';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('خطأ', 'يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
    } catch (error) {
      Alert.alert('خطأ في تسجيل الدخول', error.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username || !password || !fullName || !email) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      // Handle registration logic here
      Alert.alert('نجح التسجيل', 'تم إنشاء حسابك بنجاح');
      setIsRegister(false);
    } catch (error) {
      Alert.alert('خطأ في التسجيل', error.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>البيت السوداني</Text>
          <Text style={styles.subtitle}>السوق الإلكتروني السوداني</Text>
        </View>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            {isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </Title>
          
          {isRegister && (
            <>
              <TextInput
                label="الاسم الكامل"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
                right={<TextInput.Icon icon="account" />}
              />
              
              <TextInput
                label="البريد الإلكتروني"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                right={<TextInput.Icon icon="email" />}
              />
              
              <TextInput
                label="رقم الهاتف"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
                right={<TextInput.Icon icon="phone" />}
              />
            </>
          )}

          <TextInput
            label="اسم المستخدم"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            right={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="كلمة المرور"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            right={<TextInput.Icon icon="lock" />}
          />

          <Button
            mode="contained"
            onPress={isRegister ? handleRegister : handleLogin}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            {isRegister ? 'إنشاء حساب' : 'تسجيل الدخول'}
          </Button>

          <Button
            mode="text"
            onPress={() => setIsRegister(!isRegister)}
            style={styles.switchButton}
          >
            {isRegister ? 'لديك حساب بالفعل؟ سجل الدخول' : 'ليس لديك حساب؟ أنشئ حساباً جديداً'}
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Paragraph style={styles.footerText}>
          مرحباً بك في البيت السوداني
        </Paragraph>
        <Paragraph style={styles.footerSubtext}>
          السوق الإلكتروني الأول في السودان
        </Paragraph>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: sudaneseColors.blue,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: sudaneseColors.red,
    textAlign: 'center',
  },
  card: {
    marginBottom: 30,
    elevation: 8,
    borderRadius: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: theme.colors.text,
    fontSize: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 8,
    backgroundColor: sudaneseColors.blue,
  },
  switchButton: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 18,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: theme.colors.placeholder,
    textAlign: 'center',
  },
});

export default LoginScreen;