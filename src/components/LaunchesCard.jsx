import React, { useEffect, useState } from "react"

const LaunchesCard = ({ launch }) => {
  const [imageError, setImageError] = useState(false)
  const handleImageError = () => {
    setImageError(true)
  }
  const [onHover, setOnHover] = useState(false)

  const parseYear = (date) => {
    const newDate = new Date(date)
    return newDate.getFullYear()
  }

  return (
    <div className="flex px-8 py-4 gap-4 items-center">
      <img
        src={imageError ? "/images/noImage.jpg" : launch.links.patch.small}
        className="w-24 h-24"
        alt="Image"
        onError={handleImageError}
      ></img>
      <div className="flex flex-col gap-2 ">
        <h1 className="font-bold">
          {launch.flight_number}: {launch.name} ({parseYear(launch.date_local)})
        </h1>
        <p
          className={onHover ? "" : "line-clamp-1"}
          onMouseEnter={() => setOnHover(true)}
          onMouseLeave={() => setOnHover(false)}
        >
          Details: {launch.details ? launch.details : "None"}
        </p>
      </div>
    </div>
  )
}

export default LaunchesCard
