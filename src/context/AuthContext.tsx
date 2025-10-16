import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define la estructura de los datos del usuario que recibimos del backend
interface User {
    id: number;
    usuario: string;
    rolId: number;
}

// Define el tipo de valor que tendrá nuestro contexto
interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

// Crea el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Crea el Proveedor del Contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};