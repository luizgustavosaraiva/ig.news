import NextAuth from 'next-auth';
import { Casefold, query as q } from 'faunadb';
import GithubProvider from 'next-auth/providers/github';
import { fauna } from '../../../services/fauna';
import { supabase } from '../../../services/supabase';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({session, user, token}) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user?.email || '')
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'), 'active'
              )
            ])
          )
        );      
  
        return {
          ...session,
          ...user,
          ...token,        
          activeSubscription: userActiveSubscription
        };
      } catch (error) {
        return {
          ...session,
          ...user,
          ...token,        
          activeSubscription: null
        };
      }
    },
    async signIn({ user, account, profile }) {
      const email = user.email || '';
      try {
        // const { data: foundedUser } = await supabase
        //   .from('users')
        //   .select('*')
        //   .eq('email', email);

        // if (!foundedUser?.length) {
        //   const { data: newUser } = await supabase
        //     .from('users')
        //     .insert([{ email }]);
        //   console.log('novo usuário criado', newUser);
        // } else {
        //   console.log(
        //     'encontrado',
        //     foundedUser[0].email,
        //     Intl.DateTimeFormat('pt-BR', {
        //       dateStyle: 'short',
        //       timeStyle: 'short',
        //     }).format(foundedUser[0].created_at)
        //   );
        // }

        // const {data:users} = await supabase.from('users').select('*');
        // const {data:filteredUsers} = await supabase.from('users').select('*').eq('email', email);

        await fauna.query(
          q.If(
            q.Not(
              q.Exists(q.Match(q.Index('user_by_email'), q.Casefold(email)))
            ),
            q.Create(q.Collection('users'), { data: { email } }),
            q.Get(q.Match(q.Index('user_by_email'), q.Casefold(email)))
          )
        );

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});
