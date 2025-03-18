package com.aerofit

import android.content.Context
import android.preference.PreferenceManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.ScaleBarOverlay
import org.osmdroid.views.overlay.compass.CompassOverlay
import org.osmdroid.views.overlay.compass.InternalCompassOrientationProvider
import org.osmdroid.views.overlay.mylocation.GpsMyLocationProvider
import org.osmdroid.views.overlay.mylocation.MyLocationNewOverlay

class OSMMapViewManager(private val reactContext: ReactApplicationContext) : SimpleViewManager<MapView>() {

    companion object {
        const val REACT_CLASS = "OSMMapView"
        private const val COMMAND_ANIMATE_TO_REGION = 1
        private const val COMMAND_GET_MAP_BOUNDARIES = 2
    }

    override fun getName() = REACT_CLASS

    // Add this method to register commands
    override fun getCommandsMap(): Map<String, Int> {
        return MapBuilder.of(
            "animateToRegion", COMMAND_ANIMATE_TO_REGION,
            "getMapBoundaries", COMMAND_GET_MAP_BOUNDARIES
        )
    }

    // Add this method to handle commands
    override fun receiveCommand(mapView: MapView, commandId: String, args: ReadableArray?) {
        when (commandId.toInt()) {
            COMMAND_ANIMATE_TO_REGION -> {
                args?.let {
                    if (it.size() >= 2) {
                        val region = it.getMap(0)
                        val duration = it.getInt(1)
                        
                        try {
                            val latitude = region.getDouble("latitude")
                            val longitude = region.getDouble("longitude")
                            val geoPoint = GeoPoint(latitude, longitude)
                            
                            // Animate to the point (osmdroid doesn't have duration param in animateTo)
                            // so we'll just have to use the setCenter method with the default animation
                            mapView.controller.animateTo(geoPoint)
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    }
                }
            }
            COMMAND_GET_MAP_BOUNDARIES -> {
                // Implementation for getting map boundaries if needed
                // This would typically involve sending a result back to JS
                // via a callback or event
            }
        }
    }

    // Alternative overload for older React Native versions
    override fun receiveCommand(mapView: MapView, commandId: Int, args: ReadableArray?) {
        when (commandId) {
            COMMAND_ANIMATE_TO_REGION -> {
                args?.let {
                    if (it.size() >= 2) {
                        val region = it.getMap(0)
                        val duration = it.getInt(1)
                        
                        try {
                            val latitude = region.getDouble("latitude")
                            val longitude = region.getDouble("longitude")
                            val geoPoint = GeoPoint(latitude, longitude)
                            
                            // Animate to the point
                            mapView.controller.animateTo(geoPoint)
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    }
                }
            }
            COMMAND_GET_MAP_BOUNDARIES -> {
                // Implementation for getting map boundaries
            }
        }
    }

    override fun createViewInstance(reactContext: ThemedReactContext): MapView {
        // Configure OSM
        val context = reactContext.applicationContext
        Configuration.getInstance().load(context, PreferenceManager.getDefaultSharedPreferences(context))
        Configuration.getInstance().userAgentValue = context.packageName

        val mapView = MapView(reactContext)
        
        // Configure map settings
        mapView.setTileSource(TileSourceFactory.MAPNIK)
        mapView.setMultiTouchControls(true)
        mapView.isFocusable = true
        mapView.isFocusableInTouchMode = true

        // Add location overlay
        val locationProvider = GpsMyLocationProvider(context)
        val myLocationOverlay = MyLocationNewOverlay(locationProvider, mapView)
        myLocationOverlay.enableMyLocation()
        mapView.overlayManager.add(myLocationOverlay)

        // Add compass overlay
        val compassOverlay = CompassOverlay(
            context, 
            InternalCompassOrientationProvider(context),
            mapView
        )
        compassOverlay.enableCompass()
        mapView.overlayManager.add(compassOverlay)

        // Add scale bar
        val scaleBarOverlay = ScaleBarOverlay(mapView)
        mapView.overlayManager.add(scaleBarOverlay)

        // Set default location 
        val defaultLocation = GeoPoint(0.0, 0.0)
        mapView.controller.setCenter(defaultLocation)
        mapView.controller.setZoom(2.0)

        return mapView
    }

    @ReactProp(name = "initialRegion")
    fun setInitialRegion(mapView: MapView, region: ReadableMap?) {
        region?.let {
            try {
                val latitude = it.getDouble("latitude")
                val longitude = it.getDouble("longitude")
                val geoPoint = GeoPoint(latitude, longitude)

                mapView.controller.setCenter(geoPoint)
                mapView.controller.setZoom(15.0)
            } catch (e: Exception) {
                // Log or handle any parsing errors
                e.printStackTrace()
            }
        }
    }

    // Add this to support event emitting
    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
        return MapBuilder.of(
            "onMapReady", MapBuilder.of("registrationName", "onMapReady"),
            "onRegionChange", MapBuilder.of("registrationName", "onRegionChange"),
            "onError", MapBuilder.of("registrationName", "onError")
        )
    }

    override fun onDropViewInstance(mapView: MapView) {
        // Clean up resources if needed
        mapView.onDetach()
        super.onDropViewInstance(mapView)
    }
}