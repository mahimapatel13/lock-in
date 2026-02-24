import React, { useEffect, useCallback, useState } from 'react'
import api from '@/utils/api'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Leaderboard = () => {
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLeaderboard = useCallback(async () => {
    try {
      console.log("hhiiiii")
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

  useEffect(() => { fetchLeaderboard() }, [fetchLeaderboard])

  return (
    <div className="w-full max-w-2xl mx-auto font-mono text-black p-4">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-4 mt-10 px-2">
        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Leaderboard</h1>
        <span className="text-[10px] font-bold opacity-50 uppercase leading-none tracking-widest">Unit: Minutes</span>
      </div>

      {/* OUTER BOX - This provides the Top and Left outer borders */}
      <div className="border-[3px] border-black shadow-[4px_4px_0px_0px_black] bg-white overflow-hidden">
        
        {/* TOP STATUS BAR */}
        <div className="bg-white  border-black px-4 py-2 flex justify-between items-center">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-black" />
            <div className="w-2 h-2 bg-black/20" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Registry.Static</span>
        </div>

        <div className="bg-graph-paper">
          {/* border-collapse ensures borders share the same space */}
          <Table className="border-collapse border-none ">
            <TableHeader className="bg-graph-paper">
              <TableRow className=" border-none bg-transparent">
                {/* We use border-b and border-r on cells to create the grid */}
                <TableHead className=" bg-transparent h-12 w-16 text-black font-black uppercase border-r-[3px] border-b-[3px] border-black text-center p-0">
                  #
                </TableHead>
                <TableHead className="h-12 text-black font-black uppercase px-4 border-r-[3px] border-b-[3px] border-black text-left">
                  User
                </TableHead>
                <TableHead className="h-12 text-right text-black font-black uppercase px-4 border-b-[3px] border-black whitespace-nowrap">
                  Score
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-graph-paper">
              {isLoading ? (
                <TableRow className="border-none bg-transparent">
                  <TableCell colSpan={3} className="py-20 text-center bg-transparent font-black uppercase opacity-20">
                    Pulling_Data...
                  </TableCell>
                </TableRow>
              ) : (
                list.map((player, index) => (
                  <TableRow 
                    key={player.username + index} 
                    className={`${index === 0 ? "border-b-3" : "border-none"} bg-transparent `}
                  >
                    <TableCell className={`${index === 0 ? "bg-graph-paper-blue " : ""}py-3 border-r-[3px] last:border-b-0 border-black text-center font-black italic text-lg`}>
                      { player.rank}
                    </TableCell>

                    <TableCell className={`${index === 0 ? "bg-graph-paper-blue " : ""} px-4 py-3 border-r-[3px]  last:border-b-0 border-black`}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-none border-2 border-black shadow-[2px_2px_0px_0px_black] flex-shrink-0">
                          <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${player.username}`} />
                          <AvatarFallback className="font-black text-[10px]">??</AvatarFallback>
                        </Avatar>
                        <span className="font-black uppercase text-sm">
                          {index === 0 ? "YOU" : player.username}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className={` ${index === 0 ? "bg-graph-paper-blue " : ""} px-4 text-right border-b-[3px] last:border-b-0 border-black`}>
                      <span className="bg-black text-white px-2 py-0.5 text-xs font-bold inline-block border border-black">
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
    </div>
  )
}

export default Leaderboard