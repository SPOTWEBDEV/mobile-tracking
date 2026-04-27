import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// 🔹 User type
export type User = {
  email: string;
  firstName: string;
  lastName: string;
  kyc_level: number;
  user_invite_code?: string;
  ref_bal: string;
  bal: string;
  bal_usd: string;
  has_bank_account: number;
  haspin?: string;
  bank_id?: number;
  created_at?: string;

  // 🆕 Add this:
  kyc_details?: {
    user_id: number;
    country: string;
    address: string;
    nin: string;
    passport: string;
    nin_doc: string;
    address_doc: string;
    status: string;
    phone: string;
    city: string;
    bvn: string;
    state: string;
    postal_code: string;
    house_number: string;
  } | null;
};


// 🔹 Context type
type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: any, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
  refreshWallet: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load auth ONCE on app start
  useEffect(() => {
    (async () => {
      const storedToken = await SecureStore.getItemAsync("token");
      const storedUser = await SecureStore.getItemAsync("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUserState(JSON.parse(storedUser));
      }

      setLoading(false);
    })();
  }, []);

  // 🔹 LOGIN (ONLY place that writes to SecureStore)
  const login = async (newToken: any, newUser: User) => {
    await SecureStore.setItemAsync("token", newToken);
    await SecureStore.setItemAsync("user", JSON.stringify(newUser));

    setToken(newToken);
    setUserState(newUser);
  };

  // 🔹 LOGOUT
  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");

    setToken(null);
    setUserState(null);

    router.replace("/auth/login");
  };

  // 🔹 Update user (balance, profile, etc.)
  const setUser = async (updatedUser: User) => {
    await SecureStore.setItemAsync("user", JSON.stringify(updatedUser));
    setUserState(updatedUser);
  };

  const refreshWallet = async () => {
    if (!token) return;

    try {
      const res = await fetch(
        "https://asfast-app.com/api/api/user/exchange.php?action=refresh",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.status && user) {
        const updatedUser = {
          ...user,
          bal: data.data.balance_naira,
          bal_usd: data.data.balance_usd,
        };

        await setUser(updatedUser);
      }
    } catch (err) {
      console.log("Wallet refresh error", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        setUser,
        refreshWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
