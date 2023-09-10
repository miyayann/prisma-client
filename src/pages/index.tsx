import Head from 'next/head'
import Timeline from '../../components/Timeline'


export default function Home() {
  return (
    <>
    <Head>
    <title>Next Prisma</title>
      <meta charSet="utf-8" />
      <meta
        name="description"
        content="Nextjs Nodejs Prismaを使ったアプリです。"></meta>
    </Head>
    <main>
      <div>
        <Timeline />
      </div>
    </main>
    </>
  )
}
