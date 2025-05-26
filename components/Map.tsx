import { useLocationStore, useStores } from "@/store";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import React, { useRef, useEffect, useState } from 'react';


interface MapProps {
    onMarkerSelect?: (store: Store | null) => void;
}

const Map = ({ onMarkerSelect }: MapProps) => {
    
    const {
        userLongitude,
        userLatitude,
        destinationLongitude,
        destinationLatitude,
        storeId,
        chainId,
        subChainId,
    } = useLocationStore();

    
    // get stores from the store store
    const { stores, isLoading, error, fetchStores } = useStores();

    // Create a ref to the map to access its methods
    const mapRef = useRef<MapView>(null);
    
    // Define an initial region with specific coordinates
    const initialRegion = {
        latitude: userLatitude ?? 32.0853, // Tel Aviv coordinates
        longitude: userLongitude ?? 34.7818,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    // fetch stores when the component mounts
    useEffect(() => {
      fetchStores();
    }, [fetchStores]);
    
    // Animate to destination when it changes
    useEffect(() => {
        if (destinationLatitude && destinationLongitude && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: destinationLatitude,
                longitude: destinationLongitude,
                latitudeDelta: 0.05, // Zoom in closer for destination
                longitudeDelta: 0.05,
            }, 1000); // Animation duration in ms
        }
    }, [destinationLatitude, destinationLongitude]);


    //this is the part that auto-selects the marker when the destination is set with store IDs
    // Auto-select marker when destination is set with store IDs
    useEffect(() => {
        if (storeId && chainId && subChainId && onMarkerSelect && stores.length > 0) {
            // Find the store that matches the destination store IDs
            const targetStore = stores.find(store => 
                store.StoreId === storeId && 
                store.ChainId === chainId && 
                store.SubChainId === subChainId
            );
            
            console.log('Auto-selecting store:', { storeId, chainId, subChainId, targetStore, storesCount: stores.length });
            
            if (targetStore) {
                // Add a small delay to ensure the map has finished animating
                setTimeout(() => {
                    console.log('Calling onMarkerSelect with:', targetStore);
                    onMarkerSelect(targetStore);
                }, 1500); // Slightly longer than the map animation (1000ms)
            }
        }
    }, [storeId, chainId, subChainId, stores, onMarkerSelect]);

    // Handle map press to clear selected marker
    const handleMapPress = () => {
        if (onMarkerSelect) {
            onMarkerSelect(null);
        }
    };

    // Handle marker press to select a marker
    const handleMarkerPress = (store: Store) => {
        if (onMarkerSelect) {
            onMarkerSelect(store);
        }
    };

    return (
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1, width: "100%", height: "100%" }}
        className="w-full h-full rounded-2xl"
        tintColor="black"
        mapType="standard"
        showsPointsOfInterest={false}
        toolbarEnabled={false}
        initialRegion={initialRegion}
        showsMyLocationButton={true}
        showsUserLocation={true}
        userInterfaceStyle="light"
        onPress={handleMapPress}
      >
        {stores.map(
          (store) =>
            store.Latitude != null &&
            store.Longitude != null && (
              <Marker
                key={`${store.ChainId}-${store.SubChainId}-${store.StoreId}`}
                coordinate={{
                  latitude: store.Latitude,
                  longitude: store.Longitude,
                }}
                tracksViewChanges={false}
                image={require("@/assets/icons/store_marker.png")}
                onPress={() => handleMarkerPress(store)}
                title={store.StoreName || undefined}
                description={store.Address || undefined}
              />
            )
        )}
      </MapView>
    );
}


export default Map;
