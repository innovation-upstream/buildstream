import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { wrapper } from 'state/store'

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(
    (store) => async (context: GetServerSidePropsContext) => {
      return {
        redirect: {
          destination: '/',
          permanent: true
        }
      }
    }
  )

export default function Task() {}
