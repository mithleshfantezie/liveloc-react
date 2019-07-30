export default function reducer(state,action){
    switch (action.type) {
        case 'SET_ICON_AND_COLOR':
            return {...state,pinIcon:action.payload.icon,color:action.payload.color}
        
        case 'ALL_PINS':
            return {...state,pins:action.payload}
        case 'CREATE_PIN':
            const newPin = action.payload
            const prevPins = state.pins.filter((pin)=>pin._id !== newPin._id)
            return {...state,pins:[...prevPins,newPin]}
        case 'CREATE_DRAFT':
            return {...state,draftPin:action.payload}
        
        case 'DELETE_DRAFT':
            return {...state,draftPin:null}
        
        case 'CURRENT_PIN':
            return {...state,currentPin:action.payload}
        
        case 'DESELECT_CURRENT_PIN':
            return {...state,currentPin:null}
        
        case 'ADD_LIVE_LOCATION':
            return {...state,liveLocation:action.payload}
        case 'LIVE_LOCATIONS':
            return {...state,liveLocations:action.payload}
        case 'DELETE_LIVE_LOCATION':
            return {...state,liveLocation:null}
        case 'DELETE_LIVE_LOCATIONS':
                const deletedLocation = action.payload
                const LiveLocations = state.liveLocations.filter(location=>location._id !== deletedLocation)
                return {...state,liveLocations:LiveLocations,liveLocation:null,currentPin:null,draftPin:null}


        case 'ADD_LIVELOCATIONS':
            const newLocation = action.payload
            const prevLocations = state.liveLocations.filter((location)=>location._id !== newLocation._id)
            return {...state,liveLocations:[...prevLocations,newLocation],currentPin:null,draftPin:null}
        
        case 'UPDATE_LIVE_LOCATION':
            const updateLocation = action.payload
            const updatedLiveLocations = state.liveLocations && state.liveLocations.length > 0 && state.liveLocations.map((location)=>{
               if(location && location._id){
                   return location._id === updateLocation._id ? location = updateLocation : location 
               }
            })
            return {...state,liveLocations:updatedLiveLocations}
    
        default:
           return state;
    }
} 