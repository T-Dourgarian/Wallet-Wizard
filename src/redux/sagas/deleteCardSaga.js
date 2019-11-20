import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* deleteCard(action) {
  try {
    yield axios.delete(`/cards/${action.payload}`);
    yield put({type:"GET_CARDS"});
  } catch (error) {
    console.log('Cards delete request failed', error);
  }
}

function* deleteCardSaga() {
  yield takeLatest('DELETE_CARD', deleteCard);
}

export default deleteCardSaga;
