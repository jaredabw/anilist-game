import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStaff } from "../api";
import DOMPurify from "dompurify";
import { useGameContext } from "../context/GameContext";
import { getReasonPhrase } from "http-status-codes";

const StaffPage = ({ id }) => {
  const [staff, setStaff] = useState(null);
  const [error, setError] = useState(null);
  const { handleLinkClick } = useGameContext();

  useEffect(() => {
    fetchStaff(Number(id))
      .then((data) => setStaff(data.Staff))
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
  if (!staff || staff.id != id) return <div className="text-center p-6">Loading...</div>;

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
            src={staff.image.large}
            alt={staff.name.full}
          />
        </div>
        <div className="w-3/4 bg-white p-4 rounded-lg max-h-[452px] overflow-y-auto">
          <h1 className="text-3xl font-bold">{staff.name.full}</h1>
          <div className="mt-4">
            {staff.dateOfBirth.year && (
              <p>
                <strong>Date of Birth:</strong>{" "}
                {formatDate(
                  staff.dateOfBirth.year,
                  staff.dateOfBirth.month,
                  staff.dateOfBirth.day
                )}
              </p>
            )}
            {staff.dateOfDeath.year && (
              <p>
                <strong>Date of Death:</strong>{" "}
                {formatDate(
                  staff.dateOfDeath.year,
                  staff.dateOfDeath.month,
                  staff.dateOfDeath.day
                )}
              </p>
            )}
            {staff.age && (
              <p>
                <strong>Age:</strong> {staff.age}
              </p>
            )}
            {staff.gender && (
              <p>
                <strong>Gender:</strong> {staff.gender}
              </p>
            )}
            {staff.yearsActive.length >= 1 && (
              <p>
                <strong>Years Active:</strong> {staff.yearsActive[0]} -{" "}
                {staff.yearsActive[1] ? staff.yearsActive[1] : "Present"}
              </p>
            )}
            {staff.homeTown && (
              <p>
                <strong>Hometown:</strong> {staff.homeTown}
              </p>
            )}
            {staff.bloodType && (
              <p>
                <strong>Blood Type:</strong> {staff.bloodType}
              </p>
            )}
          </div>
          <div
            className="flex flex-col gap-2"
            dangerouslySetInnerHTML={{
              __html: sanitiseDescription(staff.description),
            }}
          ></div>
        </div>
      </div>
      {staff.characters.edges.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Characters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
            {staff.characters.edges.map((character) => (
              <div
                key={character.node.id}
                className="flex flex-col rounded-lg overflow-hidden"
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
                      "Voices"
                    )
                  }
                >
                  <img
                    src={character.node.image.large}
                    alt={character.node.name.full}
                    className="w-full object-cover aspect-2/3 rounded-lg"
                  />
                  <p className="text-m text-left pt-2 pb-1">
                    {character.node.name.full}
                  </p>
                </Link>
                <div className="text-xs text-left text-gray-500">
                  {character.media.map((media) => (
                    <Link
                      key={media.id}
                      to={`/${media.type.toLowerCase()}/${media.id}`}
                      onClick={(e) =>
                        handleLinkClick(
                          e,
                          media.type.toLowerCase(),
                          media.id,
                          media.title.romaji,
                          media.coverImage.medium,
                          "Voiced character for"
                        )
                      }
                      className="block pb-1 hover:underline"
                    >
                      {media.title.romaji}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {staff.staffMedia.edges.filter((media) => media.node.type === "ANIME")
        .length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Anime Staff Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
            {Object.values(
              staff.staffMedia.edges
                .filter((media) => media.node.type === "ANIME")
                .reduce((acc, media) => {
                  if (!acc[media.node.id]) {
                    acc[media.node.id] = {
                      ...media.node,
                      roles: [],
                    };
                  }
                  acc[media.node.id].roles.push(media.staffRole);
                  return acc;
                }, {})
            ).map((media) => (
              <div
                key={media.id}
                className="flex flex-col rounded-lg overflow-hidden"
              >
                <Link
                  to={`/${media.type.toLowerCase()}/${media.id}`}
                  onClick={(e) =>
                    handleLinkClick(
                      e,
                      media.type.toLowerCase(),
                      media.id,
                      media.title.romaji,
                      media.coverImage.medium,
                      "Worked on"
                    )
                  }
                >
                  <img
                    src={media.coverImage.large}
                    alt={media.title.romaji}
                    className="w-full object-cover aspect-2/3 rounded-lg"
                  />
                  <p className="text-m text-left pt-2 pb-1">
                    {media.title.romaji}
                  </p>
                </Link>
                {media.roles.map((role, index) => (
                  <p
                    key={index}
                    className="text-xs text-left text-gray-500 pb-1"
                  >
                    {role}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {staff.staffMedia.edges.filter((media) => media.node.type === "MANGA")
        .length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Manga Staff Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
            {Object.values(
              staff.staffMedia.edges
                .filter((media) => media.node.type === "MANGA")
                .reduce((acc, media) => {
                  if (!acc[media.node.id]) {
                    acc[media.node.id] = {
                      ...media.node,
                      roles: [],
                    };
                  }
                  acc[media.node.id].roles.push(media.staffRole);
                  return acc;
                }, {})
            ).map((media) => (
              <div
                key={media.id}
                className="flex flex-col rounded-lg overflow-hidden"
              >
                <Link
                  to={`/${media.type.toLowerCase()}/${media.id}`}
                  onClick={(e) =>
                    handleLinkClick(
                      e,
                      media.type.toLowerCase(),
                      media.id,
                      media.title.romaji,
                      media.coverImage.medium,
                      "Worked on"
                    )
                  }
                >
                  <img
                    src={media.coverImage.large}
                    alt={media.title.romaji}
                    className="w-full object-cover aspect-2/3 rounded-lg"
                  />
                  <p className="text-m text-left pt-2 pb-1">
                    {media.title.romaji}
                  </p>
                </Link>
                {media.roles.map((role, index) => (
                  <p
                    key={index}
                    className="text-xs text-left text-gray-500 pb-1"
                  >
                    {role}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default StaffPage;
