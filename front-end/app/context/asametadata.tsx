import React, { createContext, useContext, useEffect, useState } from 'react';

interface AsaMetadata {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface AsaMetadataContextType {
    getAssetById: (id: number) => AsaMetadata | undefined;
}

const AsaMetadataContext = createContext<AsaMetadataContextType | undefined>(undefined);

export const AsaMetadataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [asaMetadata, setAsaMetadata] = useState<AsaMetadata[]>([]);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await fetch('https://asa-list.tinyman.org/assets.json');
                const data = await response.json();
                setAsaMetadata(data);
            } catch (error) {
                console.error('Failed to fetch ASA metadata:', error);
            }
        };

        fetchMetadata();
    }, []);

    const getAssetById = (id: number): AsaMetadata | undefined => {
        return asaMetadata[id] || undefined;
    };

    return (
        <AsaMetadataContext.Provider value={{ getAssetById }}>
            {children}
        </AsaMetadataContext.Provider>
    );
};

export const useAsaMetadata = (): AsaMetadataContextType => {
    const context = useContext(AsaMetadataContext);
    if (!context) {
        throw new Error('useAsaMetadata must be used within an AsaMetadataProvider');
    }
    return context;
};