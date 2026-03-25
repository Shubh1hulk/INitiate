import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'LifeTwin AI - Your Digital Twin & Life Decision Simulator',
  description: 'Create your AI twin and simulate life decisions with personalized insights',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
