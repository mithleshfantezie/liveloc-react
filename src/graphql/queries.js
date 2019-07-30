export const GET_PINS= `
query {
    getPins{
        _id
        name
        category
        color
        location {
            type
            coordinates
        }
    }
}
`

export const GET_LIVE_LOCATIONS_QUERY = `
query {
    getLiveLocations{
        _id
        name
        category
        location {
            type
            coordinates
        }
    }
}
`