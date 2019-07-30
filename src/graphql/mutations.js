export const CREATE_PIN_MUTATION = `
mutation($name:String,$lng:Float,$lat:Float,$color:Int,$category:Int,$type:String) {
    createPin(data:{
        name:$name,
        color:$color,
        category:$category,
        location:{
            type:$type,
            coordinates:[$lng,$lat]
        }
    }) {
        _id
        name
        color
        category
        location{
            type
            coordinates
        }
    }
}
`

export const CREATE_LIVE_LOCATION_MUTATION = `
mutation($name:String,$category:Int,$lat:Float,$lng:Float,$type:String) {
    addLiveLocation(data:{
        name:$name,
        category:$category,
        location:{
            type:$type,
            coordinates:[$lng,$lat]
        }
    }){
        _id
        name
        category
        location{
            type
            coordinates
        }
    }
}
`

export const UPDATE_LIVE_LOCATION_MUTATION = `
mutation($id:ID,$lng:Float,$lat:Float){
    updateLiveLocation(id:$id,lng:$lng,lat:$lat){
        _id
        name
        category
        location{
            type
            coordinates
        } 
    }
}
`
export const DELETE_LIVE_LOCATION_MUTATION = `
mutation($id:ID){
    deleteLiveLocation(id:$id){
        _id
    }
}
`