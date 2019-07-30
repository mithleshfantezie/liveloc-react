import {createContext} from 'react'

const context = createContext({
pinIcon:2,
color:1,
pins:null,
draftPin:null,
currentPin:null,
liveLocation:null,
liveLocations:null
})

export default context;