package com.aerofit

import android.content.Context
import android.preference.PreferenceManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.ScaleBarOverlay
import org.osmdroid.views.overlay.compass.CompassOverlay
import org.osmdroid.views.overlay.compass.InternalCompassOrientationProvider
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.overlay.mylocation.MyLocationNewOverlay
import org.osmdroid.views.overlay.mylocation.GpsMyLocationProvider

class OSMMapViewManager(private val reactContext: ReactApplicationContext) : SimpleViewManager<MapView>() {

    companion object {
        const val REACT_CLASS = "OSMMapView"
    }

    override fun getName() = REACT_CLASS

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

    override fun onDropViewInstance(mapView: MapView) {
        // Clean up resources if needed
        mapView.onDetach()
        super.onDropViewInstance(mapView)
    }
}