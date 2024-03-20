import axios from "axios"
import React, { useEffect, useState } from "react"
import LaunchesCard from "./components/LaunchesCard"
import ReactLoading from "react-loading"

const App = () => {
  const [launches, setLaunches] = useState([])
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchData = () => {
    if (!hasMore || loading) return
    let options
    if (keyword.length) {
      options = {
        query: {
          $text: {
            $search: keyword,
          },
        },
        options: {
          page: page,
        },
      }
    } else {
      options = {
        options: {
          page: page,
        },
      }
    }
    setLoading(true)
    axios
      .post("https://api.spacexdata.com/v4/launches/query", options)
      .then((res) => {
        setPage(page + 1)
        if (page === 1) setLaunches(res.data.docs)
        else setLaunches((prevData) => [...prevData, ...res.data.docs])
      })
      .catch((error) => {
        setHasMore(false)
        console.error(error)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [keyword])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight &&
        !loading
      ) {
        if (keyword.length) fetchDataOnKeyword()
        else fetchData()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [page, loading, hasMore, setLaunches])

  return (
    <div className="flex flex-col items-center py-24 text-lg bg-slate-200 text-slate-800">
      <div className="w-2/5">
        <input
          type="text"
          className="w-full px-4 py-2 bg-white"
          placeholder="Enter keywords"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
            setPage(1)
          }}
        />
        <div className="bg-white flex flex-col overflow-auto mt-12">
          {launches.map((launch) => {
            return <LaunchesCard launch={launch} key={launch.id} />
          })}
          {loading && (
            <div className="flex justify-center py-8">
              <ReactLoading
                type="spinningBubbles"
                color="#1e293b"
                height={50}
                width={50}
              />
            </div>
          )}
          {!loading && !hasMore && (
            <div className="font-bold capitalize text-slate-600 text-xl">
              End of data
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
