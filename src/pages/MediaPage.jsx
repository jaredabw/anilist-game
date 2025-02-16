import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMedia } from "../api";
import { titleCase } from "title-case";
import { useGameContext } from "../context/GameContext";
import { getReasonPhrase } from "http-status-codes";

const MediaPage = ({ id, type }) => {
  const [media, setMedia] = useState(null);
  const [error, setError] = useState(null);
  const { handleLinkClick } = useGameContext();

  useEffect(() => {
    fetchMedia(Number(id), type.toUpperCase())
      .then((data) => setMedia(data.Media))
      .catch((err) => setError(err));
  }, [id, type]);

  if (error)
    return (
      <div className="text-red-500 p-6">
        Error: {error.response.status} ({getReasonPhrase(error.response.status)}
        )<br />
        Variables: {JSON.stringify(error.request.variables)}
      </div>
    );
  if (!media || media.id != id)
    return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto my-6 bg-[#EDF1F5] p-6 rounded-lg shadow-lg">
      {media.bannerImage && (
        <div
          className="w-full h-64 bg-cover bg-center rounded-lg mb-6"
          style={{ backgroundImage: `url(${media.bannerImage})` }}
        ></div>
      )}

      <div className="flex">
        <div className="w-1/4 mr-6">
          <img
            className="w-full rounded-lg"
            src={media.coverImage.extraLarge}
            alt={media.title.romaji}
          />

          <div className="bg-white p-4 mt-4 rounded-lg shadow">
            <p className="font-semibold">Format</p>
            <p>
              {media.format && !["TV", "OVA", "ONA"].includes(media.format)
                ? media.format.toLowerCase() === "novel"
                  ? "Light Novel"
                  : titleCase(media.format.toLowerCase().replaceAll("_", " "))
                : media.format}
            </p>
            {media.episodes && (
              <>
                <p className="font-semibold mt-2">Episodes</p>
                <p>{media.episodes}</p>
              </>
            )}

            {media.chapters && (
              <>
                <p className="font-semibold mt-2">Chapters</p>
                <p>{media.chapters}</p>
              </>
            )}

            {media.status && (
              <>
                <p className="font-semibold mt-2">Status</p>
                <p>
                  {titleCase(media.status.toLowerCase().replaceAll("_", " "))}
                </p>
              </>
            )}

            {media.season && (
              <>
                <p className="font-semibold mt-2">Season</p>
                <Link
                  to={`/season/${media.seasonYear}/${media.season}`}
                  onClick={(e) =>
                    handleLinkClick(
                      e,
                      "season",
                      `${media.seasonYear}/${media.season}`,
                      `${titleCase(media.season.toLowerCase())} ${
                        media.seasonYear
                      }`,
                      null,
                      "Aired during"
                    )
                  }
                  className="text-blue-500 hover:underline"
                >
                  {titleCase(media.season.toLowerCase())} {media.seasonYear}
                </Link>
              </>
            )}

            {media.averageScore && (
              <>
                <p className="font-semibold mt-2">Average Score</p>
                <p>{media.averageScore}%</p>
              </>
            )}

            {media.studios.edges.length > 0 && (
              <>
                <p className="font-semibold mt-2">
                  {media.studios.edges.filter((studio) => studio.isMain)
                    .length === 1
                    ? "Studio"
                    : "Studios"}
                </p>
                {media.studios.edges
                  .filter((studio) => studio.isMain)
                  .map((studio) => (
                    <Link
                      key={studio.node.id}
                      to={`/studio/${studio.node.id}`}
                      onClick={(e) =>
                        handleLinkClick(
                          e,
                          "studio",
                          studio.node.id,
                          studio.node.name,
                          null,
                          "Created by"
                        )
                      }
                      className="text-blue-500 hover:underline block"
                    >
                      {studio.node.name}
                    </Link>
                  ))}
              </>
            )}

            {media.genres.length > 0 && (
              <>
                <p className="font-semibold mt-2">Genres</p>
                {media.genres.map((genre) => (
                  <Link
                    key={genre}
                    to={`/genre/${type.toLowerCase()}/${genre}`}
                    onClick={(e) =>
                      handleLinkClick(
                        e,
                        "genre",
                        `${type.toLowerCase()}/${genre}`,
                        genre,
                        null,
                        "Tagged as"
                      )
                    }
                    className="block text-blue-500 hover:underline"
                  >
                    {genre}
                  </Link>
                ))}
              </>
            )}
          </div>

          <div className="bg-white p-4 mt-4 rounded-lg shadow">
            <p className="font-semibold">Tags</p>
            {media.tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/tag/${media.type.toLowerCase()}/${tag.id}`}
                onClick={(e) =>
                  handleLinkClick(
                    e,
                    "tag",
                    `${media.type.toLowerCase()}/${tag.id}`,
                    tag.name,
                    null,
                    "Tagged as"
                  )
                }
                className={`block shadow rounded-lg p-1 pl-2 mt-2 bg-gray-100 ${
                  tag.isMediaSpoiler
                    ? "blur-sm hover:blur-none text-red-300 hover:text-black"
                    : ""
                }`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="w-3/4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold">{media.title.romaji}</h1>
            <p
              className="mt-4 text-gray-700"
              dangerouslySetInnerHTML={{ __html: media.description }}
            ></p>
          </div>

          {media.relations.edges.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Relations</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {media.relations.edges.map((relation) => (
                  <Link
                    key={relation.node.id}
                    to={`/${relation.node.type.toLowerCase()}/${
                      relation.node.id
                    }`}
                    onClick={(e) =>
                      handleLinkClick(
                        e,
                        relation.node.type.toLowerCase(),
                        relation.node.id,
                        relation.node.title.romaji,
                        relation.node.coverImage.medium,
                        relation.relationType
                      )
                    }
                    className="flex bg-white rounded-lg shadow overflow-hidden h-29"
                  >
                    <div className="w-20 flex-shrink-0">
                      <img
                        src={relation.node.coverImage.medium}
                        alt={relation.node.title.romaji}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-between p-3 w-full">
                      <p className="text-blue-500 text-xs font-semibold mb-2">
                        {titleCase(
                          relation.relationType
                            .toLowerCase()
                            .replaceAll("_", " ")
                        )}
                      </p>
                      <p className="text-sm font-[450] mb-3">
                        {relation.node.title.romaji}
                      </p>
                      <p className="text-gray-500 text-xs mt-auto">
                        {relation.node.format &&
                        !["TV", "OVA", "ONA"].includes(relation.node.format)
                          ? relation.node.format.toLowerCase() === "novel"
                            ? "Light Novel"
                            : titleCase(
                                relation.node.format
                                  .toLowerCase()
                                  .replaceAll("_", " ")
                              )
                          : relation.node.format}{" "}
                        ・{" "}
                        {titleCase(
                          relation.node.status
                            .toLowerCase()
                            .replaceAll("_", " ")
                        )}
                      </p>{" "}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {media.characters.edges.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold">Characters</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
                {media.characters.edges.map((character) => (
                  <div
                    key={character.node.id}
                    className="flex bg-white rounded-lg shadow overflow-hidden h-29"
                  >
                    <Link
                      to={`/character/${character.node.id}`}
                      onClick={(e) =>
                        handleLinkClick(
                          e,
                          "character",
                          character.node.id,
                          character.node.name.full,
                          character.node.image.medium,
                          "Includes"
                        )
                      }
                      className={`flex ${
                        character.voiceActors.length > 0 ? "w-1/2" : "w-full"
                      }`}
                    >
                      <img
                        src={character.node.image.medium}
                        alt={character.node.name.full}
                        className="w-20 flex-shrink-0 object-cover"
                      />
                      <div className="flex flex-col justify-between p-3 w-full">
                        <p className="font-semibold mb-3">
                          {character.node.name.full}
                        </p>
                        <p className="text-gray-500 text-xs mt-auto">
                          {titleCase(character.role.toLowerCase())}
                        </p>
                      </div>
                    </Link>

                    {character.voiceActors.length > 0 && (
                      <Link
                        to={`/staff/${character.voiceActors[0].id}`}
                        onClick={(e) =>
                          handleLinkClick(
                            e,
                            "staff",
                            character.voiceActors[0].id,
                            character.voiceActors[0].name.full,
                            character.voiceActors[0].image.medium,
                            "Has character voiced by"
                          )
                        }
                        className="flex w-1/2"
                      >
                        <div className="flex flex-col justify-between p-3 w-full">
                          <p className="font-semibold mb-3 text-right">
                            {character.voiceActors[0].name.full}
                          </p>
                          <p className="text-gray-500 text-xs mt-auto text-right">
                            {titleCase(
                              character.voiceActors[0].language.toLowerCase()
                            )}
                          </p>
                        </div>
                        <img
                          src={character.voiceActors[0].image.medium}
                          alt={character.voiceActors[0].name.full}
                          className="w-20 flex-shrink-0 object-cover"
                        />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {media.staff.edges.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold">Staff</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                {media.staff.edges.map((staff, index) => (
                  <Link
                    key={`${staff.node.id}-${index}`}
                    to={`/staff/${staff.node.id}`}
                    onClick={(e) =>
                      handleLinkClick(
                        e,
                        "staff",
                        staff.node.id,
                        staff.node.name.full,
                        staff.node.image.medium,
                        "Worked on by"
                      )
                    }
                    className="flex bg-white rounded-lg shadow overflow-hidden h-24"
                  >
                    <div className="w-16 flex-shrink-0">
                      <img
                        src={staff.node.image.medium}
                        alt={staff.node.name.full}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-between p-3 w-full">
                      <p className="text-sm font-semibold mb-2">
                        {staff.node.name.full}
                      </p>
                      <p className="text-gray-500 text-xs mt-auto">
                        {titleCase(staff.role.toLowerCase())}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {media.recommendations.edges.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold">Recommendations</h2>
              <div className="flex-wrap gap-4 mt-4 grid grid-cols-3 xl:grid-cols-5">
                {media.recommendations.edges.map(
                  (recommendation) =>
                    recommendation.node.mediaRecommendation && (
                      <div
                        key={recommendation.node.mediaRecommendation.id}
                        className=""
                      >
                        <Link
                          to={`/${recommendation.node.mediaRecommendation.type.toLowerCase()}/${
                            recommendation.node.mediaRecommendation.id
                          }`}
                          onClick={(e) =>
                            handleLinkClick(
                              e,
                              recommendation.node.mediaRecommendation.type.toLowerCase(),
                              recommendation.node.mediaRecommendation.id,
                              recommendation.node.mediaRecommendation.title
                                .romaji,
                              recommendation.node.mediaRecommendation.coverImage
                                .medium,
                              "Has recommendation for"
                            )
                          }
                        >
                          <img
                            src={
                              recommendation.node.mediaRecommendation.coverImage
                                .large
                            }
                            alt={
                              recommendation.node.mediaRecommendation.title
                                .romaji
                            }
                            className="w-full min-w-24 rounded-lg shadow aspect-[2/3]"
                          />
                          <p className="text-sm mt-2 text-center">
                            {
                              recommendation.node.mediaRecommendation.title
                                .romaji
                            }
                          </p>
                        </Link>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
