import '../styles/globals.css'
import Head from 'next/head'
import AuthProvider from '@/context/AuthContext'
import PoweredByAltogic from '@/components/PoweredByAltogic'
import Header from '@/layouts/Header'
import ForumProvider from '@/context/ForumContext'
import NotificationProvider from '@/context/NotificationContext'
import ReplyProvider from '@/context/ReplyContext'
import { useRouter } from 'next/router'
import ProfileProvider from '@/context/ProfileContext'
import FileProvider from '@/context/FileContext'
import CredentialProvider from '@/context/CredentialContext'
import BookmarkProvider from '@/context/BookmarkContext'
import VoteProvider from '@/context/VoteContext'
import 'highlight.js/styles/tokyo-night-dark.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Disscusy - Open discussion and communication</title>
        <meta
          name='description'
          content='Disscusy is a forum app where people can share their thoughts and ideas, follow each others and have fun.'
        />

        <meta charSet='utf-8'></meta>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, viewport-fit=cover'
        ></meta>
        <meta name='msapplication-config' content='browserconfig.xml' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' sizes='60x60' href='/apple-touch-icon-60x60.png' />
        <link rel='apple-touch-icon' sizes='76x76' href='/apple-touch-icon-76x76.png' />
        <link rel='apple-touch-icon' sizes='120x120' href='/apple-touch-icon-120x120.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/apple-touch-icon152x15.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='192x192' href='/android-chrome-192x192.png'></link>
        <link rel='icon' type='image/png' sizes='512x512' href='/android-chrome-512x512.png'></link>
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='msapplication-TileImage' content='/mstile-144x144.png'></meta>
        <meta name='theme-color' content='#ffffff' />
        <link rel='canonical' href='http://disscusy.com'></link>
        <meta property='og:title' content='Disscusy - Open discussion and communication' />
        <meta property='og:site_name' content='Disscusy - Open discussion and communication' />
        <meta property='og:url' content='https://www.disscusy.com/' />
        <meta
          property='og:description'
          content='Disscusy is a forum app where people can share their thoughts and ideas, follow each others and have fun.'
        />
        <meta property='og:type' content='article' />
        <meta property='og:image' content='/og-meta-alpha.png' />
        <meta
          name='twitter:card'
          content='Disscusy is a forum app where people can share their thoughts and ideas, follow each others and have fun.'
        />
        <meta name='twitter:site' content='@altogic' />
        <meta name='twitter:creator' content='@altogic' />
        <meta name='twitter:url' content='https://twitter.com/Altogic' />
        <meta name='twitter:title' content='Disscusy - Open discussion and communication' />
        <meta
          name='twitter:description'
          content='Disscusy is a forum app where people can share their thoughts and ideas, follow each others and have fun.'
        />
        <meta name='twitter:image' content='/og-meta-alpha.png' />
      </Head>
      <PoweredByAltogic />
      <CredentialProvider>
        <AuthProvider>
          <ForumProvider>
            <ReplyProvider>
              <NotificationProvider>
                <ProfileProvider>
                  <VoteProvider>
                    <BookmarkProvider>
                      <FileProvider>
                        {router.pathname !== '/login' &&
                          router.pathname !== '/create-an-account' &&
                          router.pathname !== '/forgot-password' &&
                          router.pathname !== '/set-new-password' &&
                          router.pathname !== '/auth-redirect' &&
                          router.pathname !== '/email-changed' &&
                          router.pathname !== '/verification' && <Header />}
                        <Component {...pageProps} />
                      </FileProvider>
                    </BookmarkProvider>
                  </VoteProvider>
                </ProfileProvider>
              </NotificationProvider>
            </ReplyProvider>
          </ForumProvider>
        </AuthProvider>
      </CredentialProvider>
    </>
  )
}

export default MyApp
