import React, { useEffect, useCallback, useState, useMemo } from "react"
import api from "@/utils/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Leaderboard = () => {
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true)
      const resp = await api.post("/leaderboard/top")
      if (resp.data && Array.isArray(resp.data.message)) {
        setList(resp.data.message)
      }
    } catch (error) {
      console.error("Fetch failed", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  const totalMinutes = useMemo(() => {
    return list.reduce((acc, curr) => acc + curr.minutes_focused, 0)
  }, [list])

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12 font-mono">

      {/* Header */}
      <div className="mb-6 bg-white border-2 border-black/50 p-6 space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tight text-black/80">
          Leaderboard
        </h1>
        <div className="flex gap-6 text-sm text-black/60 font-semibold">
          <span>Total Participants: {list.length}</span>
          <span>Total Focus: {totalMinutes} minutes</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg  border-black/50 overflow-hidden">
        <Table className="border-collapse border-black/50">
          <TableHeader>
            <TableRow className="bg-white">
              <TableHead className="border-b-2 border-black/75 text-black/80 uppercase text-xs tracking-wider w-16 text-center">
                #
              </TableHead>
              <TableHead className="border-b-2 border-black/75 text-black/80 uppercase text-xs tracking-wider">
                User
              </TableHead>
              <TableHead className="border-b-2 border-black/75 text-black/80 uppercase text-xs tracking-wider text-right">
                Minutes
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="py-16 text-center text-black/40 font-bold">
                  Loading Leaderboard...
                </TableCell>
              </TableRow>
            ) : list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-16 text-center text-black/40 font-bold">
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              list.map((player, index) => (
                <TableRow
                  key={player.username + index}
                  className="bg-white text-black/80 border-b border-black/30 hover:bg-black/5 transition-colors"
                >
                  <TableCell className="py-4 text-center font-black text-sm">
                    {player.rank}
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-md border border-black/40 flex-shrink-0">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${player.username}`}
                        />
                        <AvatarFallback className="text-xs font-bold">
                          ??
                        </AvatarFallback>
                      </Avatar>

                      <span className="font-semibold uppercase text-sm tracking-wide">
                        {index === 0 ? "YOU" : player.username}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-right">
                    <span className="inline-block px-3 py-1 text-xs font-bold border border-black/60 text-black/80 rounded-md">
                      {player.minutes_focused}m
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Leaderboard