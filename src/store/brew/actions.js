import { getListOfBeers } from "../../dataAccess/beerRepository/helpers";
import {
  findBrews,
  findSingleBrew,
  dislikePost,
  likePost
} from "../../dataAccess/brewRepository/helpers";
import actionTypes from "./actionTypes";

const getBeerNamesSuccess = response => ({
  type: actionTypes.GET_BEER_NAMES,
  payload: response
});

export const getBeerNames = name => async dispatch => {
  const response = await getListOfBeers(50, null, name);
  const result = response.data.map(elem => {
    return { id: elem.id, name: elem.name };
  });
  dispatch(getBeerNamesSuccess(result));
};

const getBeerByNameSuccess = response => ({
  type: actionTypes.GET_BEER_BY_NAME,
  payload: response
});

export const getBeerByName = name => async dispatch => {
  const response = await getListOfBeers(1, null, name);
  dispatch(getBeerByNameSuccess(response.data));
};

const getBrewListSuccess = response => ({
  type: actionTypes.GET_BREWS_LIST,
  payload: response
});

export const getBrewList = () => async dispatch => {
  const response = await findBrews();
  dispatch(getBrewListSuccess(response.data));
};

const getBrewByIdSuccess = response => ({
  type: actionTypes.GET_BREW_BY_ID,
  payload: response
});

export const getBrewById = id => async dispatch => {
  const response = await findSingleBrew(id);
  dispatch(getBrewByIdSuccess(response.data));
};

const getRatingChangeSuccess = response => ({
  type: actionTypes.GET_RATING_CHANGE,
  payload: response
});

export const getRatingChange = (decision, payload) => async dispatch => {
  try {
    const response =
      decision === "+" ? await likePost(payload) : await dislikePost(payload);
    dispatch(getRatingChangeSuccess(response.data.rating));
  } catch (e) {
    // TODO: improve
    console.log(e);
  }
};
