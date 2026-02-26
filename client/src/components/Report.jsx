import React, { useEffect, useState, useMemo } from "react"
import api from "@/utils/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Report = () => {
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true)
        const resp = await api.get("/session/all")
        if (resp.data && Array.isArray(resp.data.sessions)) {
          setSessions(resp.data.sessions)
        }
      } catch (err) {
        console.error("Failed to fetch sessions", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const totalMinutes = useMemo(() => {
    return sessions.reduce((acc, curr) => acc + curr.duration_minutes, 0)
  }, [sessions])

  const formatDate = (iso) => {
    const date = new Date(iso)
    return date.toLocaleString()
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12 font-mono">
      
      {/* Header */}
      <div className="mb-4 bg-white border-2  border-black/50 p-4 space-y-2">
        <h1 className="text-3xl font-black  uppercase tracking-tight text-black/80">
          Study Report
        </h1>
        <div className="flex gap-6 text-sm text-black/60 font-semibold">
          <span>Total Sessions: {sessions.length}</span>
          <span>Total Focus: {totalMinutes} minutes</span>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white border-black/70 shadow-lg   overflow-hidden">
        <Table className="border-collapse border-black/50">
          <TableHeader>
            <TableRow className="bg-white">
              <TableHead className="border-b-2 border-black/75 text-black/80 uppercase text-xs tracking-wider">
                End Time
              </TableHead>
              <TableHead className="border-b-2 border-black/75 text-black/80 uppercase text-xs tracking-wider text-right">
                Duration
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow className="bg-white">
                <TableCell colSpan={2} className="py-16 text-center  text-black/40 font-bold">
                  Loading Sessions...
                </TableCell>
              </TableRow>
            ) : sessions.length === 0 ? (
              <TableRow className="bg-white">
                <TableCell colSpan={2} className="py-16 text-center text-black/40 font-bold">
                  No sessions found.
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session, index) => (
                <TableRow
                key={index}
                className="bg-white text-black/80 border-b border-black/30 hover:bg-black/5"
                >
                <TableCell className="py-4 text-black/80 text-sm">
                    {formatDate(session.end_time)}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <span className="inline-block px-3 py-1 text-xs font-bold border border-black/60 text-black/80 rounded-md">
                      {session.duration_minutes}m
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

export default Report