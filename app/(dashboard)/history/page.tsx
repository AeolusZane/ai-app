import HistoryChart from '@/components/HistoryChart'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'

/**
 * question: 如何找到用户的所有的analyses？数据怎么查询
 * 给analyses添加一个relation属性，让它们能找到用户
 */
const getData = async () => {
  const user = await getUserByClerkID()
  const analyses = await prisma.analysis.findMany({
    where: {
      entry: {
        userId: user.id,
      },
    },
    orderBy:{
        createdAt: 'asc'
    }
  })

  const sum = analyses.reduce((acc, cur) => acc + cur.sentimentScore, 0)
  const avg = Math.round(sum / analyses.length)
  return { analyses, avg }
}
const History = async () => {
  const { avg, analyses } = await getData()

  return (
    <div className='w-full h-full'>
      <div>Avg. Sentiment {avg}</div>
      <div className='w-full h-full'>
        <HistoryChart data={analyses} />
      </div>
    </div>
  )
}
export default History
