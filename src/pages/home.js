import React,{useState, useContext} from 'react';
import Map from '../components/map/index'
import Modal from '../components/modal'
import Context from '../context';
import Client from '../graphql/client'
import { CREATE_PIN_MUTATION, CREATE_LIVE_LOCATION_MUTATION, UPDATE_LIVE_LOCATION_MUTATION} from '../graphql/mutations'
function Home() {
const { state,dispatch} = useContext(Context)
const [modal,setModal] = useState(false)
const [errModal,setErrModal] = useState(false)
const [liveLocation,setLiveLocation] = useState(false)
const [icon, setIcon] =useState(1)
const [allowLocation,setAllowLocation] = useState(false)
const [online,setOnline] = useState(true)
const [name,setName] = useState('')
const [btnLocation,setBtnLocation] = useState(false)
const [btnLiveLocation,setBtnLiveLocation] = useState(false)
const [liveLocationId,setliveLocationId] = useState('')
const handleSubmit = async () => {
  if(!name) return
  setBtnLocation(true)
  if('onLine' in navigator){ 
   if(!navigator.onLine){
  return  setOnline(false); 
  }}
  const random = Math.random()*74;
  const color = Math.round(Number(random))
  // dispatch({type:'SET_ICON_AND_COLOR',payload:{icon:Number(icon),color}})
  const {lng,lat} = state.draftPin
  const variables = {
    name,
    color,
    category:Number(icon),
    type:'Point',
    lng,
    lat
  }
  const {createPin} = await Client.request(CREATE_PIN_MUTATION,variables)
  dispatch({type:'DELETE_DRAFT'})
  setName('')
  setIcon(1)
  setBtnLocation(false)
  setModal(false)
}



const handleLiveLocation = async () => {
  if(!name) return
  setBtnLiveLocation(true)
  if('onLine' in navigator){ 
    if(!navigator.onLine){
   return  setOnline(false); 
   }
  }
  const random = Math.random()*74;
  const color = Math.round(Number(random))
  const {longitude,latitude} = state.liveLocation
  const variables = {
    name,
    category:Number(icon),
    type:'Point',
    lng:longitude,
    lat:latitude
  }

  const {addLiveLocation} = await Client.request(CREATE_LIVE_LOCATION_MUTATION,variables) 
  dispatch({type:'ADD_LIVE_LOCATION',payload:addLiveLocation})
  dispatch({type:'DELETE_DRAFT'})
  dispatch({type:'DESELECT_CURRENT_PIN'})
  setName('')
  setIcon(1)
  setLiveLocation(false)
  setBtnLiveLocation(false)

  watchUserPosition(addLiveLocation._id)
}

const watchUserPosition = (id) => {

  if('geolocation' in navigator) {
     const idLiveLocation =  navigator.geolocation.watchPosition(
          async ({coords})=>{
              const {latitude,longitude} = coords

              const variables = {
                id,
                lng:longitude,
                lat:latitude
              };
              
              const {updateLiveLocation} = await Client.request(UPDATE_LIVE_LOCATION_MUTATION,variables)


          },
          (err)=>{
              if(err.code === 1) {
                setErrModal(true)
              }
          },{
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
      )
      setliveLocationId(idLiveLocation)
  }
}

const inputs = () => {
  return(
    <div>
    <input name="name" type="text" placeholder="Name" onChange={(e)=>setName(e.target.value)} value={name} />
        <select name="Location Icon" onChange={(e)=>setIcon(e.target.value)}>
        
        <option value={1}>Person</option>
        <option value={2}>Bike</option>
        <option value={3}>Airport</option>
        <option value={4}>Car</option>
        <option value={5}>Bus</option>
        <option value={6}>Home</option>
        <option value={7}>Running</option>
        <option value={8}>Flight</option>
        </select>
        </div>
  )
}

const openModal = ()=>{
  setModal(true)
  setLiveLocation(false)
}
const openLiveLocation = ()=>{
  setModal(false)
  setLiveLocation(true)
}

if(errModal) {
  return(
      <Modal>
        <div className="modal-content">
          <div className="contents">
          <p className="title">Sorry! We're unable to track your Location.</p>
          <p className="desc">Note: Everybody will be able to see your shared location!</p>
            </div>
            <div className="btn-group">
            <button name="Cancel" onClick={()=>{
              setBtnLocation(false)
              setBtnLiveLocation(false)
              setErrModal(false)}}>Cancel</button>
            </div>
          </div>
      </Modal>
  )
}


return(
    <div>
    {
    modal && (
        <Modal>
        <div className="modal-content">
          <div className="contents">
        <p className="title">Would you like to share this location?</p>
        {inputs()}
        <p className="desc">Note: Everybody will be able to see your shared location!</p>
          </div>
          <div className="btn-group">
          <button name="Cancel" onClick={()=>{
            setBtnLocation(false)
            dispatch({type:'DELETE_DRAFT'})
            setModal(false)
          }}>Cancel</button>
          <button disabled={btnLocation} name="Confirm" onClick={()=>handleSubmit()}>{btnLocation ? 'Submitting...' : 'Okay'}</button>
          </div>
          </div>
          </Modal>
    )
    }
    {
     liveLocation && (
          <Modal>
          <div className="modal-content">
            <div className="contents">
          <p className="title">Would you like to share your live location?</p>
          {inputs()}
          <p className="desc">Note: Everybody will be able to see your shared location!</p>
            </div>
            <div className="btn-group">
            <button  name="Cancel" onClick={()=>{
              dispatch({type:'DELETE_LIVE_LOCATION'})
              setBtnLiveLocation(false)
              setLiveLocation(false)
            }}>Cancel</button>
            <button disabled={btnLiveLocation} name="Confirm" onClick={()=>handleLiveLocation()}>{btnLiveLocation ? 'Submitting...' : 'Okay'}</button>
            </div>
            </div>
            </Modal>
      )
      }
      {
        !online && (
             <Modal>
             <div className="modal-content">
               <div className="contents">
             <p className="title">Please Check Your Intetnet Connection ?</p>
             <p className="desc">Note: We require an internet connection to share your location!</p>
               </div>
               <div className="btn-group">
               <button  name="Cancel" onClick={()=>{
                 setOnline(true)
               }}>Cancel</button>
               </div>
               </div>
               </Modal>
         )
         }
    
    <Map allowLoc={allowLocation} modalOpen={()=>openModal()} liveLocationModal={()=>openLiveLocation()} liveLocationId={liveLocationId} />
    </div>
)
}

export default Home