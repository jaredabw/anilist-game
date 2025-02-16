import { request } from "graphql-request";
import { MediaQuery } from "./queries/MediaQuery.gql";
import { CharacterQuery } from "./queries/CharacterQuery.gql";
import { StaffQuery } from "./queries/StaffQuery.gql";
import { StudioQuery } from "./queries/StudioQuery.gql";

const ANILIST_API = "https://graphql.anilist.co";

const fetchWithCache = async (key, query, variables) => {
  const cachedData = sessionStorage.getItem(key);

  if (cachedData) {
    console.log(`Cache hit : ${key}`);
    return JSON.parse(cachedData);
  }

  console.log(`Cache miss: ${key}, fetching from API...`);

  const response = await request(ANILIST_API, query, variables);
  sessionStorage.setItem(key, JSON.stringify(response));
  return response;
};

export const fetchMedia = (id, type) => {
  type = type.toUpperCase();
  const key = `media_${type}_${id}`;
  return fetchWithCache(key, MediaQuery, { id, type });
};

export const fetchCharacter = (id) => {
  const key = `character_${id}`;
  return fetchWithCache(key, CharacterQuery, { id });
};

export const fetchStaff = (id) => {
  const key = `staff_${id}`;
  return fetchWithCache(key, StaffQuery, { id });
};

export const fetchStudio = (id) => {
  const key = `studio_${id}`;
  return fetchWithCache(key, StudioQuery, { id });
};
