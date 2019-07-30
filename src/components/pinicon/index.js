import React,{useContext} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee,faStreetView,faMotorcycle,faBus,faCar,faPlane, faHome,faMapMarkerAlt,faMapMarkedAlt,faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import './pinicon.css';
import Context from '../../context'

const icons = [faCoffee,faStreetView,faMotorcycle,faPlane,faCar,faBus,faHome]
const colors = ["Black","Blue","BlueViolet","Brown","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Crimson","DarkBlue","DarkCyan","DarkGoldenRod","DarkGreen","DarkMagenta","DarkOliveGreen","DarkOrange","DarkOrchid","DarkRed","DarkSalmon","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkViolet","DeepPink","DimGray","DimGrey","DodgerBlue","FireBrick","ForestGreen","Fuchsia","GoldenRod","Gray","Grey","Green","HotPink","IndianRed","Indigo","LawnGreen","LightCoral","LightSalmon","LightSeaGreen","LightSlateGray","LightSlateGrey","Lime","LimeGreen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumVioletRed","MidnightBlue","Navy","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleVioletRed","Peru","Plum","Purple","RebeccaPurple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SeaGreen","Sienna"]
export const PinIcon = ({icon,color}) => {
    const {state} = useContext(Context)
console.log(icons[state.pinIcon])
return(
    <div className='pinMarker'>
    <div className='icon' style={{color:colors[color]}}>
    <FontAwesomeIcon  icon={icons[icon]} />
    </div>
    </div>
)
}

export const PinMarker = (color)=>{
    return(
        <div className='pinMarker'>
        <div className='icon' style={{color:colors[4],fontSize:'1.5em'}}>
        <FontAwesomeIcon  icon={faMapMarkerAlt} />
        </div>
        </div>  
    )
}
export const MapMarkedIcon = () => {
    return(
        <FontAwesomeIcon  icon={faMapMarkedAlt} /> 
    )
}
export const EyeIcon = () => {
    return(
        <FontAwesomeIcon  icon={faEye} /> 
    )
}
export const EyeSlash = () => {
    return(
        <FontAwesomeIcon  icon={faEyeSlash} /> 
    )
}

