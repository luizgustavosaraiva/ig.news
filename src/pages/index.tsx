import type { GetStaticProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

type HomeProps = {
  product: {
    priceId: string;
    amount: number;
  };
};

export default function Home({ product }: HomeProps) {
  const { data } = useSession();
  const email = data?.user?.email;
  const name = data?.user?.name;
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          {email ? (
            <span>👏 Hey <strong>{name}</strong>, welcome</span>
          ) : (
            <span>👏 Hey, welcome</span>
          )}

          <h1>
            News about the <span>React</span> world.
          </h1>
          {!data?.activeSubscription && (
            <p>
              Get access to all the publications <br />
              <span>for {product.amount} month</span>
            </p>
          )}
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src='/images/avatar.svg' alt='Girls coding' />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1K2OIeEJWRjr3RTZs4cBHnJC', {
    expand: ['product'],
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format((price.unit_amount ?? 1) / 100),
  };
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24 hours
  };
};
