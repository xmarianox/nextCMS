import React from 'react';
import Head from 'next/head';

export default ({ children }) => (
  <main>
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta charSet='utf-8' />
      <link rel='stylesheet' href='https://unpkg.com/antd@3/dist/antd.min.css' />
    </Head>
    {children}
  </main>
);