'use client'
import EntryCard from '@/components/EntryCard'
import NewEntryCard from '@/components/NewEntryCard'
import Question from '@/components/Question'
import { getEntries } from '@/utils/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const JournalPage = () => {
  const [entries, setEntries] = useState<any[]>([])
  useEffect(() => {
    getEntries().then((entries) => {
      setEntries(entries)
    })
  }, [])

  return (
    <div className="p-10 bg-zinc-400/10 h-full">
      <h2 className="text-3xl mb-8">Journal</h2>
      <div className="my-8">
        <Question />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <NewEntryCard />
        {entries.map((entry) => (
          <Link href={`/journal/${entry.id}`} key={entry.id}>
            <EntryCard key={entry.id} entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default JournalPage
