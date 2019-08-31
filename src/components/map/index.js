import React,{useState, useEffect, useContext} from 'react'
import ReactMapGL, {NavigationControl, Marker, Popup} from 'react-map-gl'
import './map.css'
import './button.css'
import './index.css'
import {PinIcon,PinMarker,MapMarkedIcon,EyeIcon,EyeSlash} from '../pinicon/index';
import Modal from '../modal/index';
import Client from '../../graphql/client'
import { GET_PINS,GET_LIVE_LOCATIONS_QUERY } from '../../graphql/queries'
import { DELETE_LIVE_LOCATION_MUTATION } from '../../graphql/mutations'
import {PIN_ADDED_SUBSCRIPTION,LIVE_LOCATION_ADDED_SUBSCRIPTION,LIVE_LOCATION_UPDATED_SUBSCRIPTION,LIVE_LOCATION_DELETED_SUBSCRIPTION} from '../../graphql/subscriptions'
import { Subscription } from 'react-apollo'

import Context from '../../context'


function Map({modalOpen,liveLocationModal,liveLocationId}) {
    const {state,dispatch} = useContext(Context)
    const [viewport,setViewport] = useState({
        latitude: 26.5363,
        longitude: 88.0803,
        zoom: 13 
    })
    const getPins = async () =>{
        const { getPins } = await Client.request(GET_PINS)
        dispatch({type:'ALL_PINS',payload:getPins})
    }
    const getLiveLocations = async () =>{
        const { getLiveLocations } = await Client.request(GET_LIVE_LOCATIONS_QUERY)
        dispatch({type:'LIVE_LOCATIONS',payload:getLiveLocations})
    }
    useEffect(()=>{
        getPins()
    },[])
    useEffect(()=>{
        getLiveLocations()
    },[])
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      const [popUp,setPopup] = useState(null)
     const [modal,setModal] = useState(false)
    const [userPosition,setUserPosition] =useState(null)
    useEffect(()=>{
            clearWatch()
            getUserPosition()
    },[])

    const getUserPosition = () => {
        if('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                ({coords})=>{
                   const {latitude,longitude} = coords
                    setViewport({...viewport,latitude,longitude})
                    setUserPosition({latitude,longitude})
                },
                (err)=>{
                    if(err.code === 1) {
                        setModal(true)
                    }
                    
                },options
            )
        }
    }

    
const handleMapClick = (e) => {
    setPopup(null)
    const [lng, lat] = e.lngLat
    const draft = {lng,lat} 
    dispatch({type:'CREATE_DRAFT',payload:draft})
    
}

const markerClick = (pin) => {
    dispatch({type:'DELETE_DRAFT'})
    setPopup(pin)
}

const clearWatch = ()=>{
navigator.geolocation.clearWatch(liveLocationId)
}

const StopWatchLocation = async () => {
    clearWatch()
    const id = state.liveLocation._id
const variables = {
    id
}
const { deleteLiveLocation } = await Client.request(DELETE_LIVE_LOCATION_MUTATION,variables)
dispatch({type:'DELETE_LIVE_LOCATION'})
setPopup(null)


}

    if(modal) {
        return(
            <Modal>
              <div className="modal-content">
                <div className="contents">
                <p className="title">Sorry! We're unable to track your Location.</p>
                <p className="desc">Note: Everybody will be able to see your shared location!</p>
                  </div>
                  <div className="btn-group">
                  <button onClick={()=>setModal(false)}>Cancel</button>
                  </div>
                </div>
            </Modal>
        )
    }
    

    return (
        <div className="map" tabIndex={-1}>
        <ReactMapGL
        {...viewport}
        
        onClick={(e)=>handleMapClick(e)}
        onViewportChange={newViewport => setViewport(newViewport)}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoibWl0aGxleGgiLCJhIjoiY2p4aWxxajZxMG5hYTNubnY2OWZ0MGljaiJ9.kdK80LecD6yKdEK0ASom6w"
        >
        <div className="navigation">
        <NavigationControl
        onViewportChange={newViewport => setViewport(newViewport)}></NavigationControl>
        </div>

        {userPosition && !state.liveLocation && (
            <Marker latitude={userPosition.latitude} longitude={userPosition.longitude}>
            <PinIcon icon={1} color={state.color} />
            </Marker>
        )}
        {state.draftPin && (
            <Marker latitude={state.draftPin.lat} longitude={state.draftPin.lng}  offsetTop={-20} offsetLeft={-10} >
            <PinMarker  color={5} />
                </Marker>
        )}
        
        {state.pins && state.pins.map((pin)=>{
            return(
                <div key={pin._id} onClick={()=>markerClick(pin)} >
                <Marker latitude={pin.location.coordinates[1]} longitude={pin.location.coordinates[0]}  offsetTop={-20} offsetLeft={-10}>
                <PinIcon icon={pin.category} color={pin.color} />
                </Marker>
                </div>  
            )
        })}

        {state.liveLocations && state.liveLocations.map((pin)=>{
            return(
                <div className="live-location" key={pin._id} onClick={()=>markerClick(pin)} >
                <Marker latitude={pin.location.coordinates[1]} longitude={pin.location.coordinates[0]}  offsetTop={-20} offsetLeft={-10}>
                <PinIcon icon={pin.category} color={'red'} />
                </Marker>
                </div>  
            )
        })}
        

        

{popUp &&(<Popup
            style={{marginBottom:'25px'}}
            offsetTop={-20} offsetLeft={-1}
          latitude={popUp.location.coordinates[1]}
          longitude={popUp.location.coordinates[0]}
          closeButton={true}
          closeOnClick={false}
          onClose={() => {
              setPopup(null)
          }}
          anchor="bottom" >
          <div style={{margin:'0.5em 0px -6px 0px',fontSize:'1em',fontWeight:'500'}}>{popUp.name}</div>
        </Popup>)}
        
        </ReactMapGL>
        {state.draftPin && (<button  className="map-marked" onClick={()=>{modalOpen()}}>
        <MapMarkedIcon />
        <span>Pin Location</span>
        
        </button>)}
        {userPosition && !state.liveLocation && (<button className="map-eye" onClick={()=>{
            dispatch({type:'DELETE_DRAFT'})
            dispatch({type:'ADD_LIVE_LOCATION',payload:userPosition})
            liveLocationModal()
        }} >
        <EyeIcon />
        <span>Share Live Location</span>
        
        </button>)}
        {state.liveLocation && state.liveLocation._id &&(<button className="map-eye" onClick={()=>StopWatchLocation()} >
        <EyeSlash />
        <span>Stop Sharing</span>
        </button>)}

        <Subscription subscription={PIN_ADDED_SUBSCRIPTION} 
        onSubscriptionData={({subscriptionData})=>{
            const {pinAdded} = subscriptionData.data
            dispatch({type:'CREATE_PIN',payload:pinAdded})
        }}
        />
        <Subscription subscription={LIVE_LOCATION_ADDED_SUBSCRIPTION} 
        onSubscriptionData={({subscriptionData})=>{
            const {liveLocationAdded} = subscriptionData.data
            dispatch({type:'ADD_LIVELOCATIONS',payload:liveLocationAdded})
        }}
        />
        <Subscription subscription={LIVE_LOCATION_UPDATED_SUBSCRIPTION} 
        onSubscriptionData={({subscriptionData})=>{
            const {liveLocationUpdated} = subscriptionData.data
              dispatch({type:'UPDATE_LIVE_LOCATION',payload:liveLocationUpdated})
        }}
        />
        <Subscription subscription={LIVE_LOCATION_DELETED_SUBSCRIPTION} 
        onSubscriptionData={({subscriptionData})=>{
            const {liveLocationDeleted} = subscriptionData.data
            dispatch({type:'DELETE_LIVE_LOCATIONS',payload:liveLocationDeleted})

        }}
        />
        </div>
    )
}

export default Map