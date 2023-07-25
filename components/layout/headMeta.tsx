import Head from 'next/head';
import React from 'react';

export type HeadMetaProps = {
  metaTitle?: string;
  metaDescription?: string;
};

export default function HeadMeta({ metaTitle, metaDescription }: HeadMetaProps) {
  return (
    <Head>
      <title>{metaTitle ? `${metaTitle} - 모두의 사활` : '모두의 사활'}</title>
      <link rel='icon' href='/icons/favicon.ico' />
      <meta name='description' content={metaDescription ?? '매일 새로운 문제 100개! 모두가 즐기는 사활 문제.'} />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <meta property='og:title' content='모두의 사활' />
      <meta property='og:description' content='매일 새로운 문제 100개! 모두가 즐기는 사활 문제' />
      <meta property='og:type' content='website' />
      <meta property='og:image' content={'/imgs/logo_1.png'} />
      <meta property='og:article:author' content='모두의 사활' />
    </Head>
  );
}
