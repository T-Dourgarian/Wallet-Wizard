import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { put, takeLatest } from 'redux-saga/effects';

function* getCoordinates(action) {

    let coordinatesArray = [];
    for (const card of action.payload) {
        coordinatesArray.push(yield getCoordinate(card));
    }
    yield put({type:'SET_COORDINATES',payload:coordinatesArray})
    return coordinatesArray;

};

let handleSelect = async (value) => {
    const results = await geocodeByAddress(value)
    const latlng = await getLatLng(results[0]);
    return latlng;
}

function* getCoordinate(card) {
        return yield handleSelect(card.location + "Minneapolis, MN");
}

function* coordinatesSaga() {
    yield takeLatest('GET_COORDINATES', getCoordinates);
}



export default coordinatesSaga;