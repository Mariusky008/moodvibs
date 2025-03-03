import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const title = pageProps.title ? `${pageProps.title} | MoodVibes` : 'MoodVibes'
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
      </Head>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp