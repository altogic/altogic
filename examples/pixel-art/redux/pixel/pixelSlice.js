import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import createPallette from "../../functions/createPallette";

// Initial state
const initialState = {
  globalPixels: {},
  searchText: "",
  info: null, // object

  userArts: {},
  userArtsSearchText: "",
  userArtsInfo: null, // object

  pixels: {},
  members: {},
  pixel: createPallette(16),

  pixelConnections: {},
  pixelDrawers: {},
  pixelDrawersSearchText: "",
  pixelDrawersInfo: null, // object
};

export const pixelSlice = createSlice({
  name: "pixel",
  initialState,
  reducers: {
    getGlobalPixelsRequest() {},
    getGlobalPixelsSearchRequest() {},
    createRequest() {},
    getPixelBySlugRequest() {},
    getConnectionBySlugRequest() {},
    savePixelRequest() {},
    getUserArtsRequest() {},
    sendInviteRequest() {},
    joinPixelRequest() {},
    getPixelDrawersRequest() {},
    updatePixelNameRequest() {},
    removePixelArtRequest() {},
    getPixelDrawersSearchRequest() {},
    deleteMemberRequest() {},
    replacePictureRequest() {},

    drawPixel(state, action) {
      const { x, y, drawColor } = action.payload;
      state.pixel[y][x].color = drawColor;
    },
    setPixel(state, action) {
      state.pixel = action.payload;
    },

    updatePixels(state, action) {
      state.pixels[action.payload.key] = action.payload.value;
    },
    removePixels(state, action) {
      delete state.pixels[action.payload.key];
    },

    updateGlobalPixels(state, action) {
      state.globalPixels[action.payload.key] = action.payload.value;
    },
    removeGlobalPixels(state, action) {
      delete state.globalPixels[action.payload.key];
    },
    setGlobalPixels(state, action) {
      if (action.payload.page && action.payload.page > 1) {
        state.globalPixels = {
          ...state.globalPixels,
          ...action.payload.data,
        };
      } else {
        state.globalPixels = action.payload.data;
      }
    },
    setInfo(state, action) {
      state.info = action.payload;
    },
    setSearchText(state, action) {
      state.searchText = action.payload;
    },

    setUserArts(state, action) {
      if (action.payload.page && action.payload.page > 1) {
        state.userArts = {
          ...state.userArts,
          ...action.payload.data,
        };
      } else {
        state.userArts = action.payload.data;
      }
    },
    setUserArtsInfo(state, action) {
      state.userArtsInfo = action.payload;
    },
    setUserArtsSearchText(state, action) {
      state.userArtsSearchText = action.payload;
    },
    updateUserArt(state, action) {
      state.userArts[action.payload.key] = action.payload.value;
    },
    removeUserArt(state, action) {
      delete state.userArts[action.payload.key];
    },

    updateMembers(state, action) {
      state.members[action.payload.key] = action.payload.value;
    },
    setMembers(state, action) {
      state.members = action.payload;
    },
    removeMembers(state, action) {
      delete state.members[action.payload.key];
    },

    updatePixelConnections(state, action) {
      state.pixelConnections[action.payload.key] = action.payload.value;
    },
    removePixelConnections(state, action) {
      delete state.pixelConnections[action.payload.key];
    },
    removePixelDrawers(state, action) {
      delete state.pixelDrawers[action.payload.key];
    },
    setPixelDrawers(state, action) {
      if (action.payload.page && action.payload.page > 1) {
        state.pixelDrawers = {
          ...state.pixelDrawers,
          ...action.payload.data,
        };
      } else {
        state.pixelDrawers = action.payload.data;
      }
    },
    setPixelDrawersInfo(state, action) {
      state.pixelDrawersInfo = action.payload;
    },
    setPixelDrawersSearchText(state, action) {
      state.pixelDrawersSearchText = action.payload;
    },
  },
});

export const pixelActions = pixelSlice.actions;

export default pixelSlice.reducer;
