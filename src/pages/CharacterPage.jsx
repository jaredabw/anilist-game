import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCharacter } from "../api";
import DOMPurify from "dompurify";
import { useGameContext } from "../context/GameContext";
import { getReasonPhrase } from "http-status-codes";

const CharacterPage = ({ id }) => {
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const { handleLinkClick } = useGameContext();

  useEffect(() => {
    fetchCharacter(Number(id))
      .then((data) => setCharacter(data.Character))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error)
    return (
      <div className="text-red-500 p-6">
        Error: {error.response.status} ({getReasonPhrase(error.response.status)}
        )<br />
        Variables: {JSON.stringify(error.request.variables)}
      </div>
    );
  if (!character || character.id != id) return <div className="text-center p-6">Loading...</div>;

  const sanitiseDescription = (description) => {
    const cleanDescription = DOMPurify.sanitize(description, {
      FORBID_TAGS: ["a"],
    });
    return cleanDescription;
  };

  const formatDate = (year, month, day) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = monthNames[month - 1];
    return `${monthName} ${day ? day : ""}${day && year ? ", " : ""}${
      year ? year : ""
    }`;
  };

  return (
    <div className="max-w-7xl mx-auto my-6 bg-[#EDF1F5] p-6 rounded-lg shadow-lg">
      <div className="flex">
        <div className="xl:w-1/4 md:w-1/2 mr-6">
          <img
            className="w-full rounded-lg"
            src={character.image.large}
            alt={character.name.full}
          />
        </div>
        <div className="w-3/4 bg-white p-4 rounded-lg max-h-[452px] overflow-y-auto">
          <h1 className="text-3xl font-bold">{character.name.full}</h1>
          <div className="mt-4">
            {character.dateOfBirth.month && (
              <p>
                <strong>Birthday:</strong>{" "}
                {formatDate(
                  character.dateOfBirth.year,
                  character.dateOfBirth.month,
                  character.dateOfBirth.day
                )}
              </p>
            )}
            {character.age && (
              <p>
                <strong>Age:</strong> {character.age}
              </p>
            )}
            {character.gender && (
              <p>
                <strong>Gender:</strong> {character.gender}
              </p>
            )}
            {character.bloodType && (
              <p>
                <strong>Blood Type:</strong> {character.bloodType}
              </p>
            )}
          </div>
          <div
            className="flex flex-col gap-2"
            dangerouslySetInnerHTML={{
              __html: sanitiseDescription(character.description),
            }}
          ></div>
        </div>
      </div>

      {character.media.edges.length > 0 && (
        <div className="mt-6">
          {/* <h2 className="text-2xl font-bold">Media</h2> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
            {character.media.edges.map((media) => (
              <div
                key={media.node.id}
                className="flex flex-col rounded-lg overflow-hidden"
              >
                <Link
                  to={`/${media.node.type.toLowerCase()}/${media.node.id}`}
                  onClick={(e) =>
                    handleLinkClick(
                      e,
                      media.node.type.toLowerCase(),
                      media.node.id,
                      media.node.title.romaji,
                      media.node.coverImage.medium,
                      "Appears in"
                    )
                  }
                >
                  <img
                    src={media.node.coverImage.large}
                    alt={media.node.title.romaji}
                    className="w-full object-cover aspect-2/3 rounded-lg"
                  />
                  <p className="text-m text-left pt-2 pb-1">
                    {media.node.title.romaji}
                  </p>
                </Link>
                {media.voiceActors.length > 0 && (
                  <Link
                    to={`/staff/${media.voiceActors[0].id}`}
                    onClick={(e) =>
                      handleLinkClick(
                        e,
                        "staff",
                        media.voiceActors[0].id,
                        media.voiceActors[0].name.full,
                        media.voiceActors[0].image.medium,
                        "Voiced by"
                      )
                    }
                    className="text-xs text-left text-gray-500 pb-1 hover:underline"
                  >
                    {media.voiceActors[0].name.full}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterPage;
