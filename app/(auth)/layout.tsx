import { AuthProvider } from "@/contexts/auth-context";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthLayout;
