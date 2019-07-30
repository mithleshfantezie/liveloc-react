import gql from 'graphql-tag'

export const PIN_ADDED_SUBSCRIPTION = gql`
subscription {
pinAdded {
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

export const LIVE_LOCATION_ADDED_SUBSCRIPTION = gql`
subscription {
liveLocationAdded {
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
export const LIVE_LOCATION_UPDATED_SUBSCRIPTION = gql`
subscription {
liveLocationUpdated {
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
export const LIVE_LOCATION_DELETED_SUBSCRIPTION = gql`
subscription {
liveLocationDeleted {
    _id
}
}
`